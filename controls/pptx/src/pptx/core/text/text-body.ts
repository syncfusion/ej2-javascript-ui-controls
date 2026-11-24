import { readTextBodyDirectProperties } from './read-text-body-properties';
import { TextRange, TextRangeAnchor } from './text-range';
import { readTextRangeContent } from './text-range-content';
import { ownerNamespace } from '../xml/office-dialect';
/**
 * Shape text body (`txBody` / `CT_TextBody`) — direct paragraphs and text parts.
 */
import { asMutable, findChild, MutableOoxmlElement, getAttr } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { SecurityLimits } from '../security/limits';
import { OoxmlAttribute, OoxmlElement } from '../xml/index';
import { Paragraph } from './paragraph';
import { PictureMediaAccess } from '../pictures/media-access';
import { assertNotLastParagraph, createParagraphCollection, ParagraphCollection } from './paragraph-collection';
import { arrayAt } from '../util/es5-compat';
import { OoxmlText } from '../xml/dom';
import {
    TextBodyProperties
} from './text-layout-types';

/**
 * Text body bound to a shape's `txBody`.
 *
 * @remarks
 * Exposes **direct** paragraph and run structure only. Inheritance resolution
 * (layout / master / theme) is out of scope for this surface.
 *
 * Spec: `dml-main.xsd` `CT_TextBody` — `bodyPr`, optional `lstStyle`, one or more `p`.
 */
export class TextBody {
    private readonly txBody: OoxmlElement;
    private readonly partName: string | undefined;
    private readonly limits: SecurityLimits;
    /** Optional mutation hook forwarded to paragraphs/text parts. */
    private readonly onMutate: (() => void) | undefined;
    /** Slide media access for picture bullets. */
    private readonly media: PictureMediaAccess | undefined;
    /** Cached {@link ParagraphCollection} proxy bound to this text body. */
    private paragraphsCollection: ParagraphCollection | undefined;
    /**
     * @internal
     * @param {OoxmlElement} txBody - Live `p:txBody` or `a:txBody` element.
     * @param {SecurityLimits} limits - Security limits forwarded to text parts.
     * @param {string} partName - Slide part name for diagnostics.
     * @param {*} onMutate - Optional callback invoked after a successful text mutation.
     */
    constructor(txBody: OoxmlElement, limits: SecurityLimits, partName?: string, onMutate?: () => void,
                media?: PictureMediaAccess) {
        this.txBody = txBody;
        this.limits = limits;
        this.partName = partName;
        this.onMutate = onMutate;
        this.media = media;
    }
    /**
     * Live `txBody` element this body is bound to.
     *
     * @internal
     * @returns {OoxmlElement} The result.
     */
    getElement(): OoxmlElement {
        return this.txBody;
    }
    /**
     * Mutation hook forwarded to paragraphs and text parts, if any.
     *
     * @internal
     * @returns {(() => void) | undefined} The result.
     */
    getOnMutate(): (() => void) | undefined {
        return this.onMutate;
    }
    /**
     * Direct, unresolved `a:bodyPr` layout values.
     *
     * @remarks Insets and column spacing are converted from EMU to points. The
     * getter never fabricates schema defaults and never mutates the XML tree.
     * Unknown attributes and children remain preserved for round trip.
     * @returns {TextBodyProperties} Sparse direct text-body properties.
     */
    get directProperties(): TextBodyProperties {
        return readTextBodyDirectProperties(this.txBody);
    }
    /**
     * Direct paragraphs (`a:p`) under this body, in document order, with append and
     * remove mutation surfaces.
     *
     * @remarks Reading returns a {@link ParagraphCollection} over the live `a:p` children of this text body (re-evaluated on access). Use
     * {@link ParagraphCollection.add} to append a constructed {@link Paragraph}, or {@link TextBody.addParagraph} for the single-statement
     * quick path. Use {@link ParagraphCollection.remove} / {@link ParagraphCollection.removeAt} to detach and discard an `a:p` (TASK-1082).
     * Removing the last paragraph is rejected (a text body must contain one or more `a:p`; `CT_TextBody`). Index access
     * (`textBody.paragraphs[0]`), `length`, and iteration behave like the underlying readonly array (R3.1 / R5.5).
     * @returns {ParagraphCollection} The result.
     */
    get paragraphs(): ParagraphCollection {
        if (this.paragraphsCollection === undefined) {
            this.paragraphsCollection = createParagraphCollection(() => this.collectParagraphs(),
                                                                  (paragraph: Paragraph) => this.addParagraphNode(paragraph),
                                                                  (paragraph: Paragraph) => this.removeParagraphNode(paragraph),
                                                                  (index: number) => this.removeParagraphAt(index));
        }
        return this.paragraphsCollection;
    }
    /**
     * Selects glyph offsets in one live paragraph, including fields. Hard breaks
     * have zero advance, matching existing layout; caret affinity disambiguates boundaries.
     *
     * @param {number} paragraphIndex - Zero-based paragraph in this body.
     * @param {number} startOffset - Inclusive UTF-16 glyph offset, default zero.
     * @param {number} endOffset - Exclusive offset, default end of paragraph.
     * @param {string} affinity - Before/after zero-advance boundary, default after.
     * @param {number} breakOffset - Optional count of hard breaks at this offset preceding a caret.
     * @returns {TextRange} Canonical live range; does not create or mutate XML.
     * @throws {ShapeTextError} Invalid paragraph, offset or surrogate boundary.
     */
    getTextRange(paragraphIndex: number, startOffset: number = 0, endOffset?: number,
                 affinity: 'before' | 'after' = 'after', breakOffset?: number): TextRange {
        const paragraph: Paragraph | undefined = arrayAt(this.paragraphs, paragraphIndex);
        if (!Number.isSafeInteger(paragraphIndex) || paragraphIndex < 0 || !paragraph) {
            throw new ShapeTextError('Invalid text range paragraph index', partNameOptions(this.partName));
        }
        const element: OoxmlElement = paragraph.getElement();
        const end: number = endOffset === undefined ? readTextRangeContent(element).text.length : endOffset;
        const attached: () => boolean = (): boolean =>
            this.txBody.children.some((child: OoxmlElement | OoxmlText): boolean => child === element);
        return new TextRange(element, startOffset, end, this.partName, attached, affinity, this.onMutate, breakOffset,
                             this.limits, this.txBody);
    }
    /**
     * Rebinds a captured range after supported formatting-only run changes or clone/reopen.
     * Outer document/paragraph revisions remain the editor owner's responsibility.
     *
     * @param {number} paragraphIndex - Same source paragraph under the current owner revision.
     * @param {TextRangeAnchor} anchor - Captured canonical glyph offsets and content identity.
     * @returns {TextRange} Reconciled handle; text/field/break changes reject as stale.
     * @throws {ShapeTextError} Invalid or stale anchor; never guesses a nearby paragraph.
     */
    resolveTextRange(paragraphIndex: number, anchor: TextRangeAnchor): TextRange {
        if (!anchor || typeof anchor !== 'object' || typeof anchor.contentKey !== 'string' ||
            (anchor.affinity !== 'before' && anchor.affinity !== 'after')) { throw new ShapeTextError('Invalid text range anchor'); }
        const range: TextRange = this.getTextRange(paragraphIndex, anchor.startOffset, anchor.endOffset, anchor.affinity, anchor.breakOffset);
        if (range.anchor.contentKey !== anchor.contentKey) { throw new ShapeTextError('stale text range anchor', partNameOptions(this.partName)); }
        return range;
    }
    /**
     *
     * @returns {*} The result.
     */
    private collectParagraphs(): ReadonlyArray<Paragraph> {
        const result: Paragraph[] = [];
        for (let i: number = 0; i < this.txBody.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(this.txBody.children, i);
            if (child.kind === 'element' && child.namespaceUri === ownerNamespace(this.txBody.namespaceUri, DML_NS) && child.localName === 'p') {
                result.push(new Paragraph(child, this.limits, this.partName, this.onMutate, this.media));
            }

        }
        return result;
    }
    /**
     * Appends a new empty paragraph (`a:p`) and returns its handle.
     *
     * @remarks When the existing last `a:p` is **empty** (no `a:r` / `a:br` / `a:fld` run content — `dml-main.xsd`
     * `EG_TextRun`), it is reused instead of appending another `a:p`, so authoring text into a seeded empty
     * paragraph (table cells, notes bodies) does not leave a stray blank paragraph above the new run (R5.6 —
     * appending targets the existing last paragraph). Otherwise a minimal `a:p` with no children is appended;
     * empty `CT_TextParagraph` is schema-valid (optional `pPr`, `EG_TextRun*`, `endParaRPr`). Existing `bodyPr` /
     * `lstStyle` / sibling paragraphs are left untouched. Use {@link Paragraph.addTextPart} to add runs.
     * Syncfusion-style alias: `AddParagraph()`.
     * @returns {Paragraph} Live {@link Paragraph} bound to the appended (or reused) `a:p`.
     */
    addParagraph(text?: string): Paragraph {
        // Reuse the last paragraph when it carries no run content (R5.6).
        const last: OoxmlElement | undefined = findLastParagraph(this.txBody);
        if (last !== undefined && paragraphHasNoRunContent(last)) {
            const reused: Paragraph = new Paragraph(last, this.limits, this.partName, this.onMutate, this.media);
            if (text !== undefined) {
                reused.addTextPart(text);
            }
            return reused;
        }
        // Empty CT_TextParagraph is schema-valid (all children optional).
        const p: OoxmlElement = dmlEl('p', [], []);
        asMutable(this.txBody).children.push(p);
        if (this.onMutate != null) {
            this.onMutate();
        }
        const paragraph: Paragraph = new Paragraph(p, this.limits, this.partName, this.onMutate, this.media);
        if (text !== undefined) {
            paragraph.addTextPart(text);
        }
        return paragraph;
    }
    /**
     * Grafts a detached {@link Paragraph} (typically `new Paragraph()`) into this
     * text body and returns a live handle bound to the parent body's limits / part
     * name / mutation hook.
     *
     * Used by {@link ParagraphCollection.add}. The detached `a:p` element held by
     * the incoming {@link Paragraph} is appended after the last existing `a:p`
     * (preserving `bodyPr` / `lstStyle` schema order — `dml-main.xsd`
     * `CT_TextBody`).
     *
     * @internal
     * @param {Paragraph} paragraph - The paragraph value.
     * @returns {Paragraph} The same {@link Paragraph} instance, re-bound to the live text body.
     */
    addParagraphNode(paragraph: Paragraph): Paragraph {
        const pElement: OoxmlElement = paragraph.getElement();
        asMutable(this.txBody).children.push(pElement);
        paragraph.bindTo(this.limits, this.partName, this.onMutate, this.media);
        if (this.onMutate != null) {
            this.onMutate();
        }
        return paragraph;
    }
    /**
     * Detaches and discards the live `a:p` that backs `paragraph` from this text
     * body. Match is by element identity (the `a:p` held by `paragraph` must be a
     * child of this text body).
     *
     * Used by {@link ParagraphCollection.remove} (TASK-1082).
     *
     * @remarks Removing the last remaining paragraph is rejected with {@link ShapeTextError}: `CT_TextBody` requires one or more `a:p`
     * (`dml-main.xsd`, `minOccurs="1"`). A detached `Paragraph` whose element is not a child of this text body throws {@link
     * ShapeTextError}.
     * @internal
     * @param {Paragraph} paragraph - The paragraph value.
     * @returns {void} Nothing.
     */
    removeParagraphNode(paragraph: Paragraph): void {
        const paragraphs: ReadonlyArray<Paragraph> = this.collectParagraphs();
        assertNotLastParagraph(paragraphs.length, this.partName);
        const target: OoxmlElement = paragraph.getElement();
        const mutable: MutableOoxmlElement = asMutable(this.txBody);
        const idx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' && c.namespaceUri === DML_NS &&
            c.localName === 'p' && c === target);
        if (idx === -1) {
            throw new ShapeTextError('Cannot remove a paragraph that is not a child of this text body', partNameOptions(this.partName));
        }
        mutable.children.splice(idx, 1);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
    /**
     * Detaches and discards the `a:p` at `index`, shifting later paragraphs up.
     * `index` is the zero-based position in the paragraph walk.
     *
     * Used by {@link ParagraphCollection.removeAt} (TASK-1082).
     *
     * @remarks Removing the last remaining paragraph (index `0` of a one-paragraph body) is rejected with {@link ShapeTextError}:
     * `CT_TextBody` requires one or more `a:p` (`dml-main.xsd`, `minOccurs="1"`). Out-of-range `index` throws {@link ShapeTextError}.
     * @internal
     * @param {number} index - The index value.
     * @returns {void} Nothing.
     */
    removeParagraphAt(index: number): void {
        // Guard against non-integer and NaN before any mutation.
        if (!Number.isInteger(index) || index < 0) {
            throw new ShapeTextError(`removeAt index must be a non-negative integer (got ${String(index)})`,
                                     partNameOptions(this.partName));
        }
        const paragraphs: ReadonlyArray<Paragraph> = this.collectParagraphs();
        assertNotLastParagraph(paragraphs.length, this.partName);
        if (index >= paragraphs.length) {
            throw new ShapeTextError(`removeAt index ${index} is out of range (paragraphs length ${paragraphs.length})`,
                                     partNameOptions(this.partName));
        }
        const target: Paragraph = arrayAt(paragraphs, index);
        if (target === undefined) {
            // Unreachable post-integer/range guard; keeps the type checker honest.
            throw new ShapeTextError(`removeAt index ${index} resolved no paragraph`, partNameOptions(this.partName));
        }
        const targetElement: OoxmlElement = target.getElement();
        const mutable: MutableOoxmlElement = asMutable(this.txBody);
        const elIdx: number = mutable.children.findIndex((c: OoxmlElement | OoxmlText) => c.kind === 'element' &&
            c.namespaceUri === DML_NS &&
            c.localName === 'p' &&
            c === targetElement);
        // Unreachable given the walk is authoritative; defensive for hostile trees.
        if (elIdx === -1) {
            throw new ShapeTextError(`removeAt index ${index} did not locate its a:p in the text body`, partNameOptions(this.partName));
        }
        mutable.children.splice(elIdx, 1);
        if (this.onMutate != null) {
            this.onMutate();
        }
    }
}

/**
 * Builds a DrawingML element with conventional `a:` prefix hint.
 *
 * @internal
 * @param {string} localName - The localName value.
 * @param {*} attributes - The attributes value.
 * @param {*} children - The children value.
 * @returns {OoxmlElement} The result.
 */
function dmlEl(localName: string, attributes: ReadonlyArray<OoxmlAttribute>,
               children: ReadonlyArray<OoxmlElement['children'][number]>): OoxmlElement {
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName,
        attributes,
        children,
        prefixHint: 'a'
    };
}
/**
 * Returns the last `a:p` child of `txBody`, if any.
 *
 * @internal
 * @param {OoxmlElement} txBody - Live `txBody` element.
 * @returns {OoxmlElement | undefined} Last paragraph element.
 */
function findLastParagraph(txBody: OoxmlElement): OoxmlElement | undefined {
    const pNamespace: string = ownerNamespace(txBody.namespaceUri, DML_NS);
    const children: ReadonlyArray<OoxmlElement | OoxmlText> = txBody.children;
    for (let i: number = children.length - 1; i >= 0; i--) {
        const child: OoxmlElement | OoxmlText = arrayAt(children, i);
        if (child.kind === 'element' && child.namespaceUri === pNamespace && child.localName === 'p') {
            return child;
        }
    }
    return undefined;
}
/**
 * True when `a:p` carries no run content (`a:r` / `a:br` / `a:fld` — `dml-main.xsd`
 * `EG_TextRun`). `pPr` / `endParaRPr` only is still empty.
 *
 * @internal
 * @param {OoxmlElement} p - Paragraph element.
 * @returns {boolean} Empty of run content.
 */
function paragraphHasNoRunContent(p: OoxmlElement): boolean {
    return !p.children.some((child: OoxmlElement | OoxmlText): boolean =>
        child.kind === 'element' && child.namespaceUri === DML_NS &&
        (child.localName === 'r' || child.localName === 'br' || child.localName === 'fld'));
}
/**
 * Locates `txBody` under a shape element (`p:sp` or similar).
 *
 * Prefer PresentationML `p:txBody`; fall back to DrawingML `a:txBody` if present.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {string} pmlNs - The pmlNs value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findTxBody(shapeElement: OoxmlElement, pmlNs: string): OoxmlElement | undefined {
    return (findChild(shapeElement, pmlNs, 'txBody') !== null &&
        findChild(shapeElement, pmlNs, 'txBody') !== undefined ? findChild(shapeElement, pmlNs, 'txBody') : findChild(shapeElement, DML_NS, 'txBody'));
}
