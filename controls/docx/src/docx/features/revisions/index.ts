import { DetachedObjectError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { WordDocument } from '../document/document';
import { FeatureBlock } from '../document/feature-block';
import { FeatureInline } from '../document/feature-inline';
import { Paragraph } from '../document/paragraph';
import {
    FeatureInlineParagraphItem,
    ParagraphItem,
    TextRange,
    serializeTextRange
} from '../document/text-range';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { featureId, registerFeature, registerFeatureBlockHandler, registerFeatureInlineHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { BodyBlockParseContext } from '../../core/registry/block-handlers';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
const REVISIONS: FeatureId = featureId('revisions');
/** Track-change wrapper local names modeled by this module.
 *
 * @private
 */
export type TrackChangeKind = 'ins' | 'del' | 'moveFrom' | 'moveTo';
/**
 * Product-facing revision type for a modeled track-change wrapper.
 *
 * Maps ECMA-376 run/block track-change locals (`w:ins` / `w:del` / move wrappers).
 * Property-level format revisions (`w:rPrChange`, `w:pPrChange`, …) are not modeled —
 * they remain opaque; do not invent a `formatChange` product type without schema wiring.
 *
 * @private
 */
export type RevisionType = 'insertion' | 'deletion' | 'moveFrom' | 'moveTo';
// TS 3.3: plain string-array literals widen to string[] even with a ReadonlyArray annotation.
const TRACK_CHANGE_LOCAL_NAMES: ReadonlyArray<TrackChangeKind> = [
    'ins',
    'del',
    'moveFrom',
    'moveTo'
];
/** Move range marker kinds.
 *
 * @private
 */
export type MoveRangeKind = 'moveFrom' | 'moveTo';
type TrackChangeInlineItem = {
    readonly type: 'textRange';
    readonly run: TextRange;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}
function parseDecimalId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
class TrackChangeRunOwner {
    private runs: TextRange[] = [];
    assertAttachedItem(target: ParagraphItem): void {
        if (!(target instanceof TextRange) || this.runs.indexOf(target) < 0) {
            throw new DetachedObjectError('This run is no longer in its track-change wrapper');
        }
    }
    appendRun(): TextRange {
        const run: TextRange = new TextRange(this);
        this.runs = [...this.runs, run];
        return run;
    }
    listRuns(): ReadonlyArray<TextRange> {
        return this.runs;
    }
    detachRuns(): void {
        for (const run of this.runs) {
            run.detach();
        }
        this.runs = [];
    }
    hydrateRuns(runs: TextRange[]): void {
        this.runs = runs;
        for (const run of runs) {
            run.attach(this);
        }
    }
}
function parseTrackChangeChildren(element: OpenXmlElement, runOwner: TrackChangeRunOwner): TrackChangeInlineItem[] {
    const items: TrackChangeInlineItem[] = [];
    const parsedRuns: TextRange[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'r')) {
            const run: TextRange = TextRange.fromXml(child, runOwner);
            parsedRuns.push(run);
            items.push({ type: 'textRange', run });
            continue;
        }
        items.push({ type: 'opaque', xml: child });
    }
    runOwner.hydrateRuns(parsedRuns);
    return items;
}
function trackChangeAttributes(changeId: number, author: string, date: string | undefined): OpenXmlAttribute[] {
    const attributes: OpenXmlAttribute[] = [
        wmlAttr('id', String(changeId)),
        wmlAttr('author', author)
    ];
    if (date !== undefined && date.length > 0) {
        attributes.push(wmlAttr('date', date));
    }
    return attributes;
}
/**
 * Run- or block-level track change wrapper (`w:ins`, `w:del`, `w:moveFrom`, `w:moveTo`).
 *
 * @private
 */
export class RunTrackChange implements FeatureInline, FeatureBlock {
    readonly kind: TrackChangeKind;
    readonly changeId: number;
    readonly author: string;
    readonly date: string | undefined;
    private readonly runOwner: TrackChangeRunOwner;
    private readonly items: TrackChangeInlineItem[];
    private readonly preservedXml: OpenXmlElement | undefined;
    /**
     * @param {TrackChangeKind} kind - The kind.
     * @param {number} changeId - The change id.
     * @param {string} author - The author.
     * @param {string | undefined} date - The date.
     * @param {TrackChangeRunOwner} runOwner - The run owner.
     * @param {TrackChangeInlineItem[]} items - The items.
     * @param {OpenXmlElement | undefined} preservedXml - The preserved xml.
     * @private
     */
    constructor(
        kind: TrackChangeKind,
        changeId: number,
        author: string,
        date: string | undefined,
        runOwner: TrackChangeRunOwner,
        items: TrackChangeInlineItem[],
        preservedXml: OpenXmlElement | undefined
    ) {
        this.kind = kind;
        this.changeId = changeId;
        this.author = author;
        this.date = date;
        this.runOwner = runOwner;
        this.items = items;
        this.preservedXml = preservedXml;
    }
    /** Nested runs inside the track-change wrapper. */
    get runs(): ReadonlyArray<TextRange> {
        return this.runOwner.listRuns();
    }
    /**
     * Product revision type derived from {@link kind}
     * (`ins` → insertion, `del` → deletion, move kinds unchanged).
     */
    get type(): RevisionType {
        return revisionTypeForKind(this.kind);
    }
    /**
     * Concatenated text of nested modeled runs. Opaque children contribute nothing.
     */
    get text(): string {
        return revisionText(this);
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        this.runOwner.detachRuns();
    }
    toOpenXml(): OpenXmlElement {
        if (this.preservedXml !== undefined) {
            return this.preservedXml;
        }
        const children: OpenXmlElement[] = [];
        for (const item of this.items) {
            if (item.type === 'textRange') {
                children.push(serializeTextRange(item.run));
            }
            else {
                children.push(item.xml);
            }
        }
        return wmlElement(this.kind, {
            attributes: trackChangeAttributes(this.changeId, this.author, this.date),
            children
        });
    }
}
/**
 * Live view over a modeled {@link RunTrackChange} (inline or block).
 *
 * Exposes author/date/type/text and readonly nested runs without duplicating state.
 * Accept/reject is intentionally not part of this MVP.
 *
 * @private
 */
export class RevisionRange {
    private readonly change: RunTrackChange;
    /**
     * @param {RunTrackChange} change - The change.
     * @private
     */
    constructor(change: RunTrackChange) {
        this.change = change;
    }
    /** Underlying track-change model (same object as body/paragraph feature value). */
    get trackChange(): RunTrackChange {
        return this.change;
    }
    /** `@w:id` on the track-change wrapper. */
    get changeId(): number {
        return this.change.changeId;
    }
    /** `@w:author`. */
    get author(): string {
        return this.change.author;
    }
    /** Optional `@w:date`. */
    get date(): string | undefined {
        return this.change.date;
    }
    /** OOXML local kind (`ins` / `del` / `moveFrom` / `moveTo`). */
    get kind(): TrackChangeKind {
        return this.change.kind;
    }
    /** Product type mapped from {@link kind}. */
    get type(): RevisionType {
        return this.change.type;
    }
    /** Nested modeled runs (readonly). */
    get runs(): ReadonlyArray<TextRange> {
        return this.change.runs;
    }
    /** Concatenated nested run text; opaque children omitted. */
    get text(): string {
        return this.change.text;
    }
}
/**
 * Map track-change kind to product {@link RevisionType}.
 *
 * @param {TrackChangeKind} kind - The kind.
 * @returns {RevisionType} The result.
 * @private
 */
export function revisionTypeForKind(kind: TrackChangeKind): RevisionType {
    switch (kind) {
    case 'ins':
        return 'insertion';
    case 'del':
        return 'deletion';
    case 'moveFrom':
        return 'moveFrom';
    case 'moveTo':
        return 'moveTo';
    }
}
/**
 * Concatenated text of nested runs in a track-change wrapper.
 *
 * @param {RunTrackChange} change - The change.
 * @returns {string} The result.
 * @private
 */
export function revisionText(change: RunTrackChange): string {
    let out: string = '';
    for (const run of change.runs) {
        out += run.text;
    }
    return out;
}
/**
 * Thin {@link RevisionRange} over an existing track-change model.
 *
 * @param {RunTrackChange} change - The change.
 * @returns {RevisionRange} The result.
 * @private
 */
export function revisionRangeFor(change: RunTrackChange): RevisionRange {
    return new RevisionRange(change);
}
/**
 * Move range start marker (`w:moveFromRangeStart` or `w:moveToRangeStart`).
 *
 * @public
 */
export class MoveRangeStart implements FeatureInline {
    readonly moveKind: MoveRangeKind;
    readonly markerId: number;
    readonly name: string;
    readonly author: string;
    readonly date: string;
    /**
     * @param {MoveRangeKind} moveKind - The move kind.
     * @param {number} markerId - The marker id.
     * @param {string} name - The name.
     * @param {string} author - The author.
     * @param {string} date - The date.
     * @private
     */
    constructor(moveKind: MoveRangeKind, markerId: number, name: string, author: string, date: string) {
        this.moveKind = moveKind;
        this.markerId = markerId;
        this.name = name;
        this.author = author;
        this.date = date;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        return;
    }
    toOpenXml(): OpenXmlElement {
        const localName: string = this.moveKind === 'moveFrom' ? 'moveFromRangeStart' : 'moveToRangeStart';
        return wmlElement(localName, {
            attributes: [
                wmlAttr('id', String(this.markerId)),
                wmlAttr('name', this.name),
                wmlAttr('author', this.author),
                wmlAttr('date', this.date)
            ]
        });
    }
}
/**
 * Move range end marker (`w:moveFromRangeEnd` or `w:moveToRangeEnd`).
 *
 * @private
 */
export class MoveRangeEnd implements FeatureInline {
    readonly moveKind: MoveRangeKind;
    readonly markerId: number;
    /**
     * @param {MoveRangeKind} moveKind - The move kind.
     * @param {number} markerId - The marker id.
     * @private
     */
    constructor(moveKind: MoveRangeKind, markerId: number) {
        this.moveKind = moveKind;
        this.markerId = markerId;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        return;
    }
    toOpenXml(): OpenXmlElement {
        const localName: string = this.moveKind === 'moveFrom' ? 'moveFromRangeEnd' : 'moveToRangeEnd';
        return wmlElement(localName, { attributes: [wmlAttr('id', String(this.markerId))] });
    }
}
/**
 * @private
 */
export type MoveRangeMarker = MoveRangeStart | MoveRangeEnd;
function parseRunTrackChange(element: OpenXmlElement, kind: TrackChangeKind): RunTrackChange | undefined {
    const changeId: number = parseDecimalId(wmlAttribute(element, 'id'));
    const author: string = wmlAttribute(element, 'author');
    if (changeId === undefined || author === undefined || author.length === 0) {
        return new RunTrackChange(kind, -1, '', undefined, new TrackChangeRunOwner(), [], element);
    }
    const runOwner: TrackChangeRunOwner = new TrackChangeRunOwner();
    const items: TrackChangeInlineItem[] = parseTrackChangeChildren(element, runOwner);
    return new RunTrackChange(kind, changeId, author, wmlAttribute(element, 'date'), runOwner, items, undefined);
}
function parseMoveRangeStart(element: OpenXmlElement, moveKind: MoveRangeKind): MoveRangeStart | undefined {
    const localName: string = moveKind === 'moveFrom' ? 'moveFromRangeStart' : 'moveToRangeStart';
    if (!isWml(element, localName)) {
        return undefined;
    }
    const markerId: number = parseDecimalId(wmlAttribute(element, 'id'));
    const name: string = wmlAttribute(element, 'name');
    const author: string = wmlAttribute(element, 'author');
    const date: string = wmlAttribute(element, 'date');
    if (markerId === undefined ||
        name === undefined ||
        name.length === 0 ||
        author === undefined ||
        author.length === 0 ||
        date === undefined ||
        date.length === 0) {
        return undefined;
    }
    return new MoveRangeStart(moveKind, markerId, name, author, date);
}
function parseMoveRangeEnd(element: OpenXmlElement, moveKind: MoveRangeKind): MoveRangeEnd | undefined {
    const localName: string = moveKind === 'moveFrom' ? 'moveFromRangeEnd' : 'moveToRangeEnd';
    if (!isWml(element, localName)) {
        return undefined;
    }
    const markerId: number = parseDecimalId(wmlAttribute(element, 'id'));
    if (markerId === undefined) {
        return undefined;
    }
    return new MoveRangeEnd(moveKind, markerId);
}
function trackChangesInInlines(inlines: ReadonlyArray<ParagraphItem>): RunTrackChange[] {
    const found: RunTrackChange[] = [];
    for (const inline of inlines) {
        if (inline instanceof FeatureInlineParagraphItem && inline.value instanceof RunTrackChange) {
            found.push(inline.value);
        }
    }
    return found;
}
function moveMarkersInInlines(inlines: ReadonlyArray<ParagraphItem>): MoveRangeMarker[] {
    const found: MoveRangeMarker[] = [];
    for (const inline of inlines) {
        if (!(inline instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        if (inline.value instanceof MoveRangeStart || inline.value instanceof MoveRangeEnd) {
            found.push(inline.value);
        }
    }
    return found;
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetRevisionsFeatureForTests(): void {
    registered = false;
}
function registerTrackChangeHandler(kind: TrackChangeKind): void {
    registerFeatureInlineHandler({
        featureId: REVISIONS,
        wmlLocalName: kind,
        tryParse(element: OpenXmlElement): RunTrackChange | undefined {
            if (!isWml(element, kind)) {
                return undefined;
            }
            return parseRunTrackChange(element, kind);
        }
    });
    registerFeatureBlockHandler({
        featureId: REVISIONS,
        wmlLocalName: kind,
        tryParse(element: OpenXmlElement, ctx: BodyBlockParseContext): RunTrackChange | undefined {
            void ctx;
            if (!isWml(element, kind)) {
                return undefined;
            }
            return parseRunTrackChange(element, kind);
        }
    });
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register track-change and move-range handlers. Idempotent.
 */
export function registerRevisionsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: REVISIONS });
    for (const kind of TRACK_CHANGE_LOCAL_NAMES) {
        registerTrackChangeHandler(kind);
    }
    registerFeatureInlineHandler({
        featureId: REVISIONS,
        wmlLocalName: 'moveFromRangeStart',
        tryParse(element: OpenXmlElement): MoveRangeStart | undefined {
            return parseMoveRangeStart(element, 'moveFrom');
        }
    });
    registerFeatureInlineHandler({
        featureId: REVISIONS,
        wmlLocalName: 'moveFromRangeEnd',
        tryParse(element: OpenXmlElement): MoveRangeEnd | undefined {
            return parseMoveRangeEnd(element, 'moveFrom');
        }
    });
    registerFeatureInlineHandler({
        featureId: REVISIONS,
        wmlLocalName: 'moveToRangeStart',
        tryParse(element: OpenXmlElement): MoveRangeStart | undefined {
            return parseMoveRangeStart(element, 'moveTo');
        }
    });
    registerFeatureInlineHandler({
        featureId: REVISIONS,
        wmlLocalName: 'moveToRangeEnd',
        tryParse(element: OpenXmlElement): MoveRangeEnd | undefined {
            return parseMoveRangeEnd(element, 'moveTo');
        }
    });
}
/**
 * Track-change wrappers in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<RunTrackChange>} The result.
 * @private
 */
export function runTrackChangesInParagraph(paragraph: Paragraph): ReadonlyArray<RunTrackChange> {
    return trackChangesInInlines(paragraph.items.toArray());
}
/**
 * All modeled run/block track-change wrappers in the document body, in document order.
 *
 * Walks top-level body blocks so block-level `w:ins`/`w:del` between paragraphs are
 * included; also visits nested feature paragraphs registered with a block walker.
 * Move range markers are separate ({@link moveRangeMarkersInParagraph}) — pairing UX deferred.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<RunTrackChange>} The result.
 * @private
 */
export function runTrackChangesInDocument(document: WordDocument): ReadonlyArray<RunTrackChange> {
    const found: RunTrackChange[] = [];
    const seen: Set<RunTrackChange> = new Set<RunTrackChange>();
    const push: (change: RunTrackChange) => void = (change: RunTrackChange): void => {
        if (seen.has(change)) {
            return;
        }
        seen.add(change);
        found.push(change);
    };
    for (const block of document.listBlocks()) {
        if (block.type === 'paragraph') {
            for (const change of runTrackChangesInParagraph(block.paragraph)) {
                push(change);
            }
            continue;
        }
        if (block.type === 'feature' && block.value instanceof RunTrackChange) {
            push(block.value);
        }
    }
    // Nested paragraphs inside other feature blocks (tables, SDT, …) when walkers exist.
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        for (const change of runTrackChangesInParagraph(paragraph)) {
            push(change);
        }
    });
    return found;
}
/**
 * WordDocument-order {@link RevisionRange} views for every modeled track change.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<RevisionRange>} The result.
 * @private
 */
export function revisionsInDocument(document: WordDocument): ReadonlyArray<RevisionRange> {
    return runTrackChangesInDocument(document).map((change: RunTrackChange) => new RevisionRange(change));
}
/**
 * Move range markers in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<MoveRangeMarker>} The result.
 * @private
 */
export function moveRangeMarkersInParagraph(paragraph: Paragraph): ReadonlyArray<MoveRangeMarker> {
    return moveMarkersInInlines(paragraph.items.toArray());
}
/**
 * Whether inline content is a modeled run track change from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isRunTrackChangeInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: RunTrackChange } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === REVISIONS &&
        inline.value instanceof RunTrackChange
    );
}
/**
 * Whether inline content is a modeled move range marker from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isMoveRangeMarkerInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: MoveRangeMarker } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === REVISIONS &&
        (inline.value instanceof MoveRangeStart || inline.value instanceof MoveRangeEnd)
    );
}
// Always-on on the main `@syncfusion/ej2-docx` entry: track-change inline/block handlers and
// move-range markers re-arm after test handler resets via WordDocument.create /
// fromPackage.
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerRevisionsFeature();
});
registerRevisionsFeature();
