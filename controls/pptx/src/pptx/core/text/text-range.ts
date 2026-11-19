import { SecurityLimits, DEFAULT_SECURITY_LIMITS } from '../security/limits';
import { insertTextAtCaret } from './write-text-caret-insertion';
import { arrayAt } from '../util/es5-compat';
import { HaystackRun } from './find/types';
import { OoxmlElement } from '../xml/dom';
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { ColorValue } from '../theme/color-value';
import { TextRangeContent, readTextRangeContent } from './text-range-content';
import { TextRangeGlyphEdit, applyTextRangeGlyphFill } from './write-text-range-fill';

/** Stable source offsets and content identity; never serialized into OOXML. @public */
export interface TextRangeAnchor {
    /** Inclusive UTF-16 glyph offset; zero when omitted in TextBody.getTextRange. */
    readonly startOffset: number;
    /** Exclusive UTF-16 glyph offset; paragraph end when omitted in TextBody.getTextRange. */
    readonly endOffset: number;
    /** Caret side around zero-advance markers; defaults to after. */
    readonly affinity: 'before' | 'after';
    /** Number of hard breaks at this glyph offset preceding a caret; omitted without such markers. */
    readonly breakOffset?: number;
    /** Exact glyph stream plus field/break identities, independent of formatting/run splits. */
    readonly contentKey: string;
}
/**
 * A range or caret in one actual library-owned paragraph. Offsets follow the
 * existing layout's UTF-16 glyph stream: fields count their text, hard breaks
 * have zero advance. Outer document revisions guard shape/body replacement.
 * Obtain through TextBody.getTextRange; no DOM selection is retained here.
 *
 * @public
 */
export class TextRange {
    /** Inclusive UTF-16 glyph offset; zero when omitted in TextBody.getTextRange. */
    readonly startOffset: number;
    /** Exclusive UTF-16 glyph offset; paragraph end when omitted in TextBody.getTextRange. */
    readonly endOffset: number;
    private readonly paragraph: OoxmlElement;
    private readonly contentKey: string;
    private readonly partName: string | undefined;
    private readonly attached: () => boolean;
    private readonly affinity: 'before' | 'after';
    private readonly breakOffset: number | undefined;
    private readonly limits: SecurityLimits;
    private readonly scope: OoxmlElement;
    private readonly onMutate: (() => void) | undefined;
    /**
     * @param {OoxmlElement} paragraph - Live canonical source paragraph.
     * @param {number} startOffset - Inclusive UTF-16 glyph offset.
     * @param {number} endOffset - Exclusive UTF-16 glyph offset.
     * @param {string} partName - Owning part for diagnostics.
     * @param {Function} attached - Exact parent-child identity guard.
     * @param {string} affinity - Caret affinity around zero-advance boundaries.
     * @param {Function} onMutate - Owning document mutation hook, invoked once after an atomic change.
     * @param {number} breakOffset - Optional hard-break ordinal at a collapsed glyph offset.
     * @param {SecurityLimits} limits - Actual owning body mutation limits.
     * @param {OoxmlElement} scope - Actual owning body for namespace/limit preflight.
     * @internal
     */
    constructor(paragraph: OoxmlElement, startOffset: number, endOffset: number, partName?: string,
                attached: () => boolean = (): boolean => true, affinity: 'before' | 'after' = 'after',
                onMutate?: () => void, breakOffset?: number, limits: SecurityLimits = DEFAULT_SECURITY_LIMITS,
                scope: OoxmlElement = paragraph) {
        const content: TextRangeContent = readTextRangeContent(paragraph);
        if (!Number.isSafeInteger(startOffset) || !Number.isSafeInteger(endOffset) || startOffset < 0 ||
            endOffset < startOffset || endOffset > content.text.length || splitsSurrogate(content.text, startOffset) ||
            splitsSurrogate(content.text, endOffset) || (affinity !== 'before' && affinity !== 'after')) {
            throw new ShapeTextError('Invalid text range offsets or caret affinity', partNameOptions(partName));
        }
        const breaks: number = startOffset === endOffset ? content.map.runs.filter((run: HaystackRun, index: number): boolean =>
            run.startInHaystack === startOffset && arrayAt(content.elements, index).localName === 'br').length : 0;
        if (breakOffset !== undefined && (!Number.isSafeInteger(breakOffset) || breakOffset < 0 || breakOffset > breaks ||
            startOffset !== endOffset)) {
            throw new ShapeTextError('Invalid caret hard-break ordinal', partNameOptions(partName));
        }
        this.breakOffset = breaks > 0 ? (breakOffset === undefined ? (affinity === 'before' ? 0 : breaks) : breakOffset) : undefined;
        this.paragraph = paragraph; this.startOffset = startOffset; this.endOffset = endOffset;
        this.contentKey = content.key; this.partName = partName; this.attached = attached;
        this.affinity = affinity; this.onMutate = onMutate; this.limits = limits; this.scope = scope;
    }
    /**
     * Glyph stream slice, with field values and zero-advance hard breaks.
     *
     * @returns {string} Current source text; stale handles throw rather than retarget.
     */
    get text(): string { return this.currentContent().text.slice(this.startOffset, this.endOffset); }
    /** @returns {boolean} Whether the range represents a caret rather than selected glyphs. */
    get isCollapsed(): boolean { this.currentContent(); return this.startOffset === this.endOffset; }
    /**
     * Detached source anchor for formatting-only rebinds and cloned packages.
     *
     * @returns {TextRangeAnchor} Stable offsets and content identity, never run indices.
     */
    get anchor(): TextRangeAnchor {
        this.currentContent(); return { startOffset: this.startOffset, endOffset: this.endOffset,
            affinity: this.affinity, contentKey: this.contentKey,
            ...(this.breakOffset === undefined ? {} : { breakOffset: this.breakOffset }) };
    }
    /**
     * Applies a source gradient to selected glyphs or caret insertion formatting.
     *
     * @param {GradientFillOptions} options - Authored colors/stops/geometry, validated before mutation.
     * @returns {void} Commits one atomic paragraph update; links and other formatting survive.
     * @throws {ShapeTextError} Stale selection, partial/interior field or unsupported split metadata.
     * @throws Invalid gradient options are rejected before any source mutation.
     */
    setGradientFill(options: GradientFillOptions): void { this.apply({ kind: 'gradient', options }); }
    /**
     * @param {ColorValue} color - Authored color choice; scheme references stay references.
     * @returns {void} Explicitly replaces only selected glyph fill with solid paint.
     */
    setSolidFill(color: ColorValue): void { this.apply({ kind: 'solid', color }); }
    /** @returns {void} Explicitly suppresses selected glyph ink, independently of highlight/decorations. */
    setNoFill(): void { this.apply({ kind: 'none' }); }
    /** @returns {void} Removes selected direct glyph fill; missing fill is a no-op without run splits. */
    clearFill(): void { this.apply({ kind: 'reset' }); }
    /**
     * Inserts literal text at a collapsed source caret, consuming the actual insertion formatting.
     *
     * @param {string} text - Well-formed single-paragraph text; tabs are literal, line breaks use separate editing APIs.
     * @returns {TextRangeAnchor} Fresh collapsed caret after the inserted UTF-16 glyph stream; old content handles become stale.
     * @throws {ShapeTextError} Non-caret/stale/interior-field/invalid input; no partial paragraph change.
     * @throws Text/body security limits are checked before publication; package-wide limits also apply at save/commit.
     */
    insertText(text: string): TextRangeAnchor {
        const content: TextRangeContent = this.currentContent();
        if (this.startOffset !== this.endOffset) {
            throw new ShapeTextError('Text insertion requires a collapsed caret', partNameOptions(this.partName));
        }
        const changed: boolean = insertTextAtCaret(this.paragraph, this.scope, content, this.startOffset, text,
                                                   this.affinity, this.limits, this.partName, this.breakOffset);
        if (!changed) { return this.anchor; }
        const point: number = this.startOffset + text.length;
        const next: TextRange = new TextRange(this.paragraph, point, point, this.partName, this.attached, 'after',
                                              this.onMutate, 0, this.limits, this.scope);
        const anchor: TextRangeAnchor = next.anchor;
        if (this.onMutate) { this.onMutate(); }
        return anchor;
    }
    private apply(edit: TextRangeGlyphEdit): void {
        this.currentContent();
        const changed: boolean = applyTextRangeGlyphFill(
            this.paragraph, this.startOffset, this.endOffset, edit, this.partName, this.affinity, this.breakOffset);
        if (changed && this.onMutate) {
            this.onMutate();
        }
    }
    private currentContent(): TextRangeContent {
        const content: TextRangeContent = readTextRangeContent(this.paragraph);
        if (!this.attached() || content.key !== this.contentKey) {
            throw new ShapeTextError('stale text range: paragraph content or ownership changed', partNameOptions(this.partName));
        }
        return content;
    }
}
/**
 * @param {string} text - Existing source glyph stream.
 * @param {number} offset - Proposed caret/range boundary.
 * @returns {boolean} Whether a boundary would create malformed surrogate halves.
 */
function splitsSurrogate(text: string, offset: number): boolean {
    const left: number = text.charCodeAt(offset - 1); const right: number = text.charCodeAt(offset);
    return left >= 0xD800 && left <= 0xDBFF && right >= 0xDC00 && right <= 0xDFFF;
}
