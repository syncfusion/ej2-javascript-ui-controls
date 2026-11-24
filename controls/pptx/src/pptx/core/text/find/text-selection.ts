/**
 * Find selection that can be collapsed to one live {@link TextPart}.
 *
 * @remarks
 * `find` / `findAll` return anchors. {@link TextSelection.getAsOneTextPart}
 * splits surrounding runs when the match is a partial `a:t`, then returns a
 * {@link TextPart} bound to the live `a:r` so existing `text` and
 * `font.highlightColor` setters mutate the package. No separate replace or
 * highlight API is added on Presentation or Slide.
 *
 * Citation: Transitional `dml-main.xsd` `CT_RegularTextRun` (`rPr?`, `t`);
 * `CT_TextParagraph` run sequence. Spec 035 anchors.
 */
import { arrayAt } from '../../util/es5-compat';
import { asMutable, MutableOoxmlElement } from '../../shapes/dom-utils';
import { DML_NS } from '../../shapes/constants';
import { partNameOptions, ShapeTextError } from '../../shapes/errors';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../../xml/index';
import { Paragraph } from '../paragraph';
import { TextPart } from '../text-part';
import { iterTextBodiesOnShape, TextBodySurface } from './walk-text-bodies';
import { Slide } from '../../slideimplementation/slide';
import { Shape } from '../../shapes/shape';

/**
 * One find hit that can be treated as a single text part for replace or highlight.
 *
 * @public
 */
export class TextSelection {
    /** Matched text as it appears in the paragraph haystack. */
    readonly text: string;
    /** Zero-based slide index in {@link Presentation.slides} order. */
    readonly slideIndex: number;
    /** The slide containing the match. */
    readonly slide: Slide;
    /**
     * Shape that owns the text body (group-descendant shape when nested).
     * For table cell text, the graphic-frame shape hosting the table.
     */
    readonly shape: Shape;
    /** When the match is inside a table cell, zero-based row index. */
    readonly tableRow?: number;
    /** When the match is inside a table cell, zero-based column index. */
    readonly tableColumn?: number;
    /** Zero-based paragraph index within the searched text body. */
    readonly paragraphIndex: number;
    /** Inclusive start offset in the paragraph haystack (JS string index). */
    readonly startOffset: number;
    /** Exclusive end offset in the paragraph haystack. */
    readonly endOffset: number;
    /** First text part (`a:r`) participating in the match. */
    readonly startTextPartIndex: number;
    /** Inclusive start offset within that part's {@link TextPart.text}. */
    readonly startTextPartOffset: number;
    /** Last text part participating in the match. */
    readonly endTextPartIndex: number;
    /** Exclusive end offset within that part's {@link TextPart.text}. */
    readonly endTextPartOffset: number;

    private readonly surface: TextBodySurface;
    /** Plain field bag so `toEqual` matches the historical readonly match shape. */
    private valueOfMatch: {
        readonly text: string;
        readonly slideIndex: number;
        readonly slide: Slide;
        readonly shape: Shape;
        readonly paragraphIndex: number;
        readonly startOffset: number;
        readonly endOffset: number;
        readonly startTextPartIndex: number;
        readonly startTextPartOffset: number;
        readonly endTextPartIndex: number;
        readonly endTextPartOffset: number;
        readonly tableRow?: number;
        readonly tableColumn?: number;
    };

    /**
     * @internal
     * @param text - Matched slice.
     * @param slideIndex - Zero-based slide index.
     * @param slide - Owning slide.
     * @param surface - Text body that produced the hit (shape or table cell).
     * @param paragraphIndex - Paragraph index within that text body.
     * @param startOffset - Inclusive haystack start.
     * @param endOffset - Exclusive haystack end.
     * @param startTextPartIndex - First participating run.
     * @param startTextPartOffset - Inclusive offset in that run.
     * @param endTextPartIndex - Last participating run.
     * @param endTextPartOffset - Exclusive offset in that run.
     */
    constructor(
        text: string,
        slideIndex: number,
        slide: Slide,
        surface: TextBodySurface,
        paragraphIndex: number,
        startOffset: number,
        endOffset: number,
        startTextPartIndex: number,
        startTextPartOffset: number,
        endTextPartIndex: number,
        endTextPartOffset: number
    ) {
        this.text = text;
        this.slideIndex = slideIndex;
        this.slide = slide;
        this.shape = surface.shape;
        this.surface = surface;
        this.paragraphIndex = paragraphIndex;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.startTextPartIndex = startTextPartIndex;
        this.startTextPartOffset = startTextPartOffset;
        this.endTextPartIndex = endTextPartIndex;
        this.endTextPartOffset = endTextPartOffset;
        if (surface.tableRow !== undefined) {
            this.tableRow = surface.tableRow;
        }
        if (surface.tableColumn !== undefined) {
            this.tableColumn = surface.tableColumn;
        }
        this.valueOfMatch = {
            text,
            slideIndex,
            slide,
            shape: surface.shape,
            paragraphIndex,
            startOffset,
            endOffset,
            startTextPartIndex,
            startTextPartOffset,
            endTextPartIndex,
            endTextPartOffset
        };
        if (surface.tableRow !== undefined) {
            this.valueOfMatch = { ...this.valueOfMatch, tableRow: surface.tableRow };
        }
        if (surface.tableColumn !== undefined) {
            this.valueOfMatch = { ...this.valueOfMatch, tableColumn: surface.tableColumn };
        }
    }

    /**
     * Structural fields used by deep equality (`toEqual` / Jasmine).
     *
     * @returns Plain match fields, without methods.
     */
    valueOf(): {
        readonly text: string;
        readonly slideIndex: number;
        readonly slide: Slide;
        readonly shape: Shape;
        readonly paragraphIndex: number;
        readonly startOffset: number;
        readonly endOffset: number;
        readonly startTextPartIndex: number;
        readonly startTextPartOffset: number;
        readonly endTextPartIndex: number;
        readonly endTextPartOffset: number;
        readonly tableRow?: number;
        readonly tableColumn?: number;
    } {
        return this.valueOfMatch;
    }

    /**
     * Collapses this match into one live {@link TextPart}.
     *
     * @remarks When the match already occupies a single run from start to end, that run is returned. Otherwise prefix and suffix text are
     * split into sibling `a:r` elements (character properties cloned from the source run) and interior runs that were fully covered are
     * removed, leaving one `a:r` whose `a:t` is the matched text. Setting {@link TextPart.text} or {@link Font.highlightColor} on the
     * result writes the live slide DOM. Call once per selection; a second call after the paragraph has been rewritten is not supported.
     * @returns {TextPart} Text part bound to the matched span.
     * @throws {ShapeTextError} When the paragraph or a participating run cannot be resolved.
     */
    getAsOneTextPart(): TextPart {
        const paragraph: Paragraph | undefined = arrayAt(this.liveSurface().textBody.paragraphs, this.paragraphIndex);
        if (paragraph === undefined) {
            throw new ShapeTextError('Find selection paragraph is missing', partNameOptions(this.shape.getPartName()));
        }
        return this.rewrite(paragraph);
    }

    /**
     * Text body on the live model slide.
     *
     * @remarks `Presentation.slides[i]` and `Slide.shapes` are proxies. Indexing
     * the slide collection clones the slide root, so a selection captured from a
     * public handle must be rebound to the model slide before run splits are written.
     * @returns Surface whose `txBody` is the package DOM.
     */
    private liveSurface(): TextBodySurface {
        const presentation = this.slide.getPresentation();
        if (presentation === undefined) {
            return this.surface;
        }
        const model = (presentation as unknown as { model: { slides: ReadonlyArray<Slide> } }).model;
        let liveSlide: Slide | undefined;
        for (let i: number = 0; i < model.slides.length; i++) {
            const candidate: Slide | undefined = arrayAt(model.slides, i);
            if (candidate !== undefined && candidate.partName === this.slide.partName && candidate.slideId === this.slide.slideId) {
                liveSlide = candidate;
                break;
            }
        }
        if (liveSlide === undefined) {
            return this.surface;
        }
        const liveShape: Shape | undefined = liveSlide.shapes.getById(this.shape.id);
        if (liveShape === undefined) {
            return this.surface;
        }
        if (this.tableRow !== undefined && this.tableColumn !== undefined) {
            const surfaces: TextBodySurface[] = [];
            const iter: IterableIterator<TextBodySurface> = iterTextBodiesOnShape(liveShape);
            let next: IteratorResult<TextBodySurface> = iter.next();
            while (!next.done) {
                surfaces.push(next.value);
                next = iter.next();
            }
            for (let i: number = 0; i < surfaces.length; i++) {
                const surface: TextBodySurface = arrayAt(surfaces, i);
                if (surface.tableRow === this.tableRow && surface.tableColumn === this.tableColumn) {
                    return surface;
                }
            }
            return this.surface;
        }
        const body = liveShape.textBody;
        if (body === undefined) {
            return this.surface;
        }
        return { shape: liveShape, textBody: body };
    }

    /**
     * Splits runs on a resolved paragraph and returns the matched text part.
     *
     * @param paragraph - Live paragraph that owns the match.
     * @returns Text part bound to the matched span.
     */
    private rewrite(paragraph: Paragraph): TextPart {
        const parts = paragraph.textParts;
        const startPart: TextPart | undefined = arrayAt(parts, this.startTextPartIndex);
        const endPart: TextPart | undefined = arrayAt(parts, this.endTextPartIndex);
        if (startPart === undefined || endPart === undefined) {
            throw new ShapeTextError('Find selection text part is missing', partNameOptions(this.shape.getPartName()));
        }
        if (this.startTextPartIndex === this.endTextPartIndex &&
            this.startTextPartOffset === 0 &&
            this.endTextPartOffset === startPart.text.length) {
            return startPart;
        }

        const paragraphEl: MutableOoxmlElement = asMutable(paragraph.getElement());
        const runElements: OoxmlElement[] = [];
        for (let i: number = 0; i < paragraphEl.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(paragraphEl.children, i);
            if (child.kind === 'element' && isRun(child)) {
                runElements.push(child);
            }
        }
        const startRun: OoxmlElement | undefined = arrayAt(runElements, this.startTextPartIndex);
        const endRun: OoxmlElement | undefined = arrayAt(runElements, this.endTextPartIndex);
        if (startRun === undefined || endRun === undefined) {
            throw new ShapeTextError('Find selection text part is missing', partNameOptions(this.shape.getPartName()));
        }

        const startText: string = readRunText(startRun);
        const endText: string = this.startTextPartIndex === this.endTextPartIndex ? startText : readRunText(endRun);
        const matchedInStart: string = startText.slice(this.startTextPartOffset,
            this.startTextPartIndex === this.endTextPartIndex ? this.endTextPartOffset : startText.length);
        const matchedInEnd: string = this.startTextPartIndex === this.endTextPartIndex
            ? ''
            : endText.slice(0, this.endTextPartOffset);
        let middle: string = '';
        if (this.endTextPartIndex > this.startTextPartIndex + 1) {
            for (let i: number = this.startTextPartIndex + 1; i < this.endTextPartIndex; i++) {
                const mid: OoxmlElement | undefined = arrayAt(runElements, i);
                if (mid !== undefined) {
                    middle += readRunText(mid);
                }
            }
        }
        const matchedText: string = this.startTextPartIndex === this.endTextPartIndex
            ? matchedInStart
            : matchedInStart + middle + matchedInEnd;

        const prefix: string = startText.slice(0, this.startTextPartOffset);
        const suffix: string = this.startTextPartIndex === this.endTextPartIndex
            ? startText.slice(this.endTextPartOffset)
            : endText.slice(this.endTextPartOffset);

        const matchRun: OoxmlElement = cloneRunWithText(startRun, matchedText);
        const insertions: OoxmlElement[] = [];
        if (prefix.length > 0) {
            insertions.push(cloneRunWithText(startRun, prefix));
        }
        insertions.push(matchRun);
        if (suffix.length > 0) {
            const suffixSource: OoxmlElement = this.startTextPartIndex === this.endTextPartIndex ? startRun : endRun;
            insertions.push(cloneRunWithText(suffixSource, suffix));
        }

        const remove: Set<OoxmlElement> = new Set<OoxmlElement>();
        for (let i: number = this.startTextPartIndex; i <= this.endTextPartIndex; i++) {
            const run: OoxmlElement | undefined = arrayAt(runElements, i);
            if (run !== undefined) {
                remove.add(run);
            }
        }
        const next: Array<OoxmlElement | OoxmlText> = [];
        let inserted: boolean = false;
        for (let i: number = 0; i < paragraphEl.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(paragraphEl.children, i);
            if (child.kind === 'element' && remove.has(child)) {
                if (!inserted) {
                    for (let j: number = 0; j < insertions.length; j++) {
                        next.push(arrayAt(insertions, j));
                    }
                    inserted = true;
                }
                continue;
            }
            next.push(child);
        }
        if (!inserted) {
            throw new ShapeTextError('Find selection could not be rewritten', partNameOptions(this.shape.getPartName()));
        }
        paragraphEl.children = next;

        const limits = this.liveSurface().shape.getSecurityLimits();
        const partName: string | undefined = this.liveSurface().shape.getPartName();
        const onMutate: (() => void) | undefined = this.liveSurface().textBody.getOnMutate();
        const live: TextPart = new TextPart(matchRun, limits, partName, onMutate);
        if (onMutate != null) {
            onMutate();
        }
        return live;
    }
}

/**
 * Reads direct `a:t` text from a regular run.
 *
 * @param run - `a:r` element.
 * @returns Concatenated text.
 */
function readRunText(run: OoxmlElement): string {
    const t: OoxmlElement | undefined = findChildNs(run, 't');
    if (t === undefined) {
        return '';
    }
    let out: string = '';
    for (let i: number = 0; i < t.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(t.children, i);
        if (child.kind === 'text') {
            out += child.text;
        }
    }
    return out;
}

/**
 * Clones a run's character properties and sets `a:t` to `text`.
 *
 * @param source - Run whose `a:rPr` is copied (not shared).
 * @param text - New direct text.
 * @returns A new `a:r` element.
 */
function cloneRunWithText(source: OoxmlElement, text: string): OoxmlElement {
    const rPr: OoxmlElement | undefined = findChildNs(source, 'rPr');
    const children: Array<OoxmlElement | OoxmlText> = [];
    if (rPr !== undefined) {
        children.push(cloneElement(rPr));
    }
    children.push({
        kind: 'element',
        namespaceUri: source.namespaceUri,
        localName: 't',
        attributes: [],
        children: [{ kind: 'text', text }],
        prefixHint: 'a'
    });
    return {
        kind: 'element',
        namespaceUri: source.namespaceUri,
        localName: 'r',
        attributes: cloneAttributes(source.attributes),
        children,
        prefixHint: source.prefixHint
    };
}

/**
 * Deep-clones an element so split runs do not share `a:rPr` nodes.
 *
 * @param el - Source element.
 * @returns Independent copy.
 */
function cloneElement(el: OoxmlElement): OoxmlElement {
    const children: Array<OoxmlElement | OoxmlText> = [];
    for (let i: number = 0; i < el.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(el.children, i);
        if (child.kind === 'element') {
            children.push(cloneElement(child));
        }
        else {
            children.push({ kind: 'text', text: child.text });
        }
    }
    return {
        kind: 'element',
        namespaceUri: el.namespaceUri,
        localName: el.localName,
        attributes: cloneAttributes(el.attributes),
        children,
        prefixHint: el.prefixHint
    };
}

/**
 * Copies attributes without sharing the source array.
 *
 * @param attributes - Source attributes.
 * @returns New attribute list.
 */
/**
 * Finds a child element in the parent's namespace (DrawingML or PresentationML).
 *
 * @param parent - Parent element.
 * @param localName - Child local name.
 * @returns The child, or `undefined`.
 */
/**
 * Run element in DrawingML or PresentationML (authored text-box dialect).
 *
 * @param child - Candidate element.
 * @returns Whether it is a regular text run.
 */
/**
 * Public collection view of a model slide.
 *
 * @remarks `Presentation.slides[i]` is a Proxy that clones the slide root on
 * property access. Find must mutate the model instance, but the handle returned
 * to callers is the public view so identity matches `presentation.slides[i]`.
 * @param slide - Model slide used for the search walk.
 * @returns Public slide when bound, otherwise the same instance.
 */
/**
 * Run element in DrawingML or PresentationML (authored text-box dialect).
 *
 * @param child - Candidate element.
 * @returns Whether it is a regular text run.
 */
function isRun(child: OoxmlElement): boolean {
    return child.localName === 'r' &&
        (child.namespaceUri === DML_NS || child.namespaceUri === 'http://schemas.openxmlformats.org/presentationml/2006/main');
}

/**
 * Finds a child element in the parent's namespace (DrawingML or PresentationML).
 *
 * @param parent - Parent element.
 * @param localName - Child local name.
 * @returns The child, or `undefined`.
 */
function findChildNs(parent: OoxmlElement, localName: string): OoxmlElement | undefined {
    for (let i: number = 0; i < parent.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(parent.children, i);
        if (child.kind === 'element' && child.namespaceUri === parent.namespaceUri && child.localName === localName) {
            return child;
        }
    }
    return undefined;
}

/**
 * Copies attributes without sharing the source array.
 *
 * @param attributes - Source attributes.
 * @returns New attribute list.
 */
function cloneAttributes(attributes: ReadonlyArray<OoxmlAttribute>): OoxmlAttribute[] {
    const out: OoxmlAttribute[] = [];
    for (let i: number = 0; i < attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(attributes, i);
        out.push({ namespaceUri: a.namespaceUri, localName: a.localName, value: a.value });
    }
    return out;
}
