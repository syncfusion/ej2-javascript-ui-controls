import { WordDocument } from '../document/document';
import { FeatureBlock } from '../document/feature-block';
import { FeatureInline } from '../document/feature-inline';
import { Paragraph, BlockContent } from '../document/paragraph';
import {
    FeatureInlineParagraphItem,
    InlineContent,
    ParagraphItem, ConcreteParagraphItem
} from '../document/text-range';
import { isWml, wmlAttr, wmlElement } from '../document/wml';
import { enumValues } from '../../core/compat/object-compat';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { featureId, registerFeature, registerFeatureBlockHandler, registerFeatureInlineHandler, registerFeatureMaterializeHandler, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
const EDITABLE_RANGES: FeatureId = featureId('editable-ranges');
/**
 * Editor group for an editable range (`ST_EdGrp`, ECMA-376-1 §17.18.21).
 *
 * `w:edGrp` on the start marker names the set of users who may edit the range.
 * ECMA note: `w:ed` (a single editor) takes precedence over the group when both
 * are present; the library stores both without resolving precedence.
 *
 * @private
 */
export enum EditableRangeEditorGroup {
    None = 'none',
    Everyone = 'everyone',
    Administrators = 'administrators',
    Contributors = 'contributors',
    Editors = 'editors',
    Owners = 'owners',
    Current = 'current'
}
const EDITOR_GROUPS: ReadonlyArray<string> = enumValues<EditableRangeEditorGroup>(EditableRangeEditorGroup);
/**
 * Physical displacement relative to a custom XML markup element
 * (`ST_DisplacedByCustomXml`, ECMA-376-1 §17.18.13).
 *
 * @private
 */
export type DisplacedByCustomXml = 'next' | 'prev';
const DISPLACED_VALUES: ReadonlyArray<DisplacedByCustomXml> = ['next', 'prev'];
/**
 * Attributes the editable-range model consumes; everything else is residual.
 *
 * @private
 */
const MODELED_ATTRIBUTE_LOCAL_NAMES: ReadonlyArray<string> = [
    'id',
    'edGrp',
    'ed',
    'colFirst',
    'colLast',
    'displacedByCustomXml'
];
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}
function isWmlAttribute(a: OpenXmlAttribute): boolean {
    return a.prefix === 'w' || a.namespaceUri === '' || a.namespaceUri.indexOf('wordprocessingml') >= 0;
}
/**
 * Residual attributes for lossless serialize.
 *
 * Modeled local names are omitted only when their values were successfully
 * consumed. Invalid modeled values (unknown `edGrp`, non-decimal columns, bad
 * displacement) stay in the residual bag so they round-trip unchanged.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {ReadonlySet<string>} consumedLocalNames - The consumed local names.
 * @returns {OpenXmlAttribute[]} The result.
 * @private
 */
function residualAttributesOf(el: OpenXmlElement, consumedLocalNames: ReadonlySet<string>): OpenXmlAttribute[] {
    return el.attributes.filter((a: OpenXmlAttribute) => {
        if (a.localName === 'space' && a.prefix === 'xml') {
            return false;
        }
        if (isWmlAttribute(a) && MODELED_ATTRIBUTE_LOCAL_NAMES.indexOf(a.localName) !== -1) {
            return !consumedLocalNames.has(a.localName);
        }
        return true;
    });
}
function parseDecimalId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
function parseDisplaced(raw: string | undefined): DisplacedByCustomXml | undefined {
    if (raw === undefined) {
        return undefined;
    }
    return DISPLACED_VALUES.find((value: DisplacedByCustomXml) => value === raw);
}
function parseEditorGroup(raw: string | undefined): EditableRangeEditorGroup | undefined {
    if (raw === undefined) {
        return undefined;
    }
    return EDITOR_GROUPS.find((value: string) => value === raw) as EditableRangeEditorGroup | undefined;
}
function parseColumn(raw: string | undefined): number | undefined {
    return parseDecimalId(raw);
}
/**
 * Editable-range start marker (`w:permStart`, ECMA-376-1 §17.13.7.2).
 *
 * Paired with an {@link EditableRangeEnd} by matching {@link EditableRangeStart.rangeId}
 * (`w:id`). Markers are first-class DOM nodes occupying an exact slot among
 * paragraph inlines (or body blocks for run-level markers between paragraphs),
 * so relative order versus runs, bookmarks, fields, and other content is stable.
 *
 * @remarks
 * - `rangeId` maps `w:id` (non-negative after save materialization; a negative
 *   pending id is allocated on author and remapped before save).
 * - `editorGroup` maps `w:edGrp` (`ST_EdGrp`); `editor` maps `w:ed`.
 * - `columnFirst` / `columnLast` map `w:colFirst` / `w:colLast` (zero-based
 *   table column span).
 * - Attributes outside the modeled set are preserved verbatim and re-emitted on
 *   serialization (lossless round-trip).
 * - `undefined` means the attribute is absent on serialize; assigning a value
 *   emits it; assigning `undefined` removes it.
 *
 * @private
 */
export class EditableRangeStart implements FeatureInline, FeatureBlock {
    private rangeIdValue: number;
    private editorGroupValue: EditableRangeEditorGroup | undefined;
    private editorValue: string | undefined;
    private columnFirstValue: number | undefined;
    private columnLastValue: number | undefined;
    private displacedByCustomXmlValue: DisplacedByCustomXml | undefined;
    private readonly residual: OpenXmlAttribute[];
    /**
     * @param {number} rangeId - The range id.
     * @param {Object} options - The options.
     * @private
     */
    constructor(rangeId: number, options?: {
        readonly editorGroup?: EditableRangeEditorGroup | undefined;
        readonly editor?: string | undefined;
        readonly columnFirst?: number | undefined;
        readonly columnLast?: number | undefined;
        readonly displacedByCustomXml?: DisplacedByCustomXml | undefined;
        readonly residualAttributes?: ReadonlyArray<OpenXmlAttribute> | undefined;
    }) {
        this.rangeIdValue = rangeId;
        this.editorGroupValue = options == null ? undefined : options.editorGroup;
        this.editorValue = options == null ? undefined : options.editor;
        this.columnFirstValue = options == null ? undefined : options.columnFirst;
        this.columnLastValue = options == null ? undefined : options.columnLast;
        this.displacedByCustomXmlValue = options == null ? undefined : options.displacedByCustomXml;
        this.residual = (options == null ? undefined : options.residualAttributes) !== undefined ? [...options.residualAttributes] : [];
    }
    /**
     * Editable-range identifier shared with the paired end marker (`w:id`).
     */
    get rangeId(): number {
        return this.rangeIdValue;
    }
    /**
     * @param {number} rangeId - The range id.
     * @returns {void} Nothing is returned.
     * @private
     */
    setRangeId(rangeId: number): void {
        this.rangeIdValue = rangeId;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isPendingRangeId(): boolean {
        return this.rangeIdValue < 0;
    }
    /**
     * Editor group allowed to edit the range (`w:edGrp`, `ST_EdGrp`).
     */
    get editorGroup(): EditableRangeEditorGroup | undefined {
        return this.editorGroupValue;
    }
    set editorGroup(value: EditableRangeEditorGroup | undefined) {
        this.editorGroupValue = value;
    }
    /**
     * Single editor allowed to edit the range (`w:ed`) — `DOMAIN\user`,
     * `user@domain`, or a machine-local `user` form.
     */
    get editor(): string | undefined {
        return this.editorValue;
    }
    set editor(value: string | undefined) {
        this.editorValue = value;
    }
    /**
     * Zero-based first table column of the range (`w:colFirst`).
     */
    get columnFirst(): number | undefined {
        return this.columnFirstValue;
    }
    set columnFirst(value: number | undefined) {
        this.columnFirstValue = value;
    }
    /**
     * Zero-based last table column of the range (`w:colLast`).
     */
    get columnLast(): number | undefined {
        return this.columnLastValue;
    }
    set columnLast(value: number | undefined) {
        this.columnLastValue = value;
    }
    /**
     * Displacement relative to a custom XML markup element
     * (`w:displacedByCustomXml`).
     */
    get displacedByCustomXml(): DisplacedByCustomXml | undefined {
        return this.displacedByCustomXmlValue;
    }
    set displacedByCustomXml(value: DisplacedByCustomXml | undefined) {
        this.displacedByCustomXmlValue = value;
    }
    /**
     * @returns {ReadonlyArray<OpenXmlAttribute>} The result.
     * @private
     * Residual attributes preserved for lossless serialization.
     */
    residualAttributes(): ReadonlyArray<OpenXmlAttribute> {
        return this.residual;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        return;
    }
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [wmlAttr('id', String(this.rangeIdValue))];
        if (this.editorGroupValue !== undefined) {
            attributes.push(wmlAttr('edGrp', this.editorGroupValue));
        }
        if (this.editorValue !== undefined) {
            attributes.push(wmlAttr('ed', this.editorValue));
        }
        if (this.columnFirstValue !== undefined) {
            attributes.push(wmlAttr('colFirst', String(this.columnFirstValue)));
        }
        if (this.columnLastValue !== undefined) {
            attributes.push(wmlAttr('colLast', String(this.columnLastValue)));
        }
        if (this.displacedByCustomXmlValue !== undefined) {
            attributes.push(wmlAttr('displacedByCustomXml', this.displacedByCustomXmlValue));
        }
        attributes.push(...this.residual);
        return wmlElement('permStart', { attributes });
    }
}
/**
 * Editable-range end marker (`w:permEnd`, ECMA-376-1 §17.13.7.1).
 *
 * Paired with an {@link EditableRangeStart} by matching `w:id`. The end marker
 * carries only the identifier, optional displacement, and residual attributes.
 *
 * @private
 */
export class EditableRangeEnd implements FeatureInline, FeatureBlock {
    private rangeIdValue: number;
    private displacedByCustomXmlValue: DisplacedByCustomXml | undefined;
    private readonly residual: OpenXmlAttribute[];
    /**
     * @param {number} rangeId - The range id.
     * @param {Object} options - The options.
     * @private
     */
    constructor(rangeId: number, options?: {
        readonly displacedByCustomXml?: DisplacedByCustomXml | undefined;
        readonly residualAttributes?: ReadonlyArray<OpenXmlAttribute> | undefined;
    }) {
        this.rangeIdValue = rangeId;
        this.displacedByCustomXmlValue = options == null ? undefined : options.displacedByCustomXml;
        this.residual = (options == null ? undefined : options.residualAttributes) !== undefined ? [...options.residualAttributes] : [];
    }
    /**
     * Editable-range identifier shared with the paired start marker (`w:id`).
     */
    get rangeId(): number {
        return this.rangeIdValue;
    }
    /**
     * @param {number} rangeId - The range id.
     * @returns {void} Nothing is returned.
     * @private
     */
    setRangeId(rangeId: number): void {
        this.rangeIdValue = rangeId;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isPendingRangeId(): boolean {
        return this.rangeIdValue < 0;
    }
    /**
     * Displacement relative to a custom XML markup element
     * (`w:displacedByCustomXml`).
     */
    get displacedByCustomXml(): DisplacedByCustomXml | undefined {
        return this.displacedByCustomXmlValue;
    }
    set displacedByCustomXml(value: DisplacedByCustomXml | undefined) {
        this.displacedByCustomXmlValue = value;
    }
    /**
     * @returns {ReadonlyArray<OpenXmlAttribute>} The result.
     * @private
     * Residual attributes preserved for lossless serialization.
     */
    residualAttributes(): ReadonlyArray<OpenXmlAttribute> {
        return this.residual;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        return;
    }
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [wmlAttr('id', String(this.rangeIdValue))];
        if (this.displacedByCustomXmlValue !== undefined) {
            attributes.push(wmlAttr('displacedByCustomXml', this.displacedByCustomXmlValue));
        }
        attributes.push(...this.residual);
        return wmlElement('permEnd', { attributes });
    }
}
/**
 * Live query view over a paired start/end marker pair, resolved by `w:id`.
 *
 * The view does not own markup: {@link EditableRangeStart} and
 * {@link EditableRangeEnd} remain in their host containers (which may be
 * different paragraphs), and property reads write through to the live start
 * marker.
 *
 * @private
 */
export class EditableRange {
    private readonly startMarkerValue: EditableRangeStart;
    private readonly endMarkerValue: EditableRangeEnd;
    /**
     * @param {EditableRangeStart} start - The start.
     * @param {EditableRangeEnd} end - The end.
     * @private
     */
    constructor(start: EditableRangeStart, end: EditableRangeEnd) {
        this.startMarkerValue = start;
        this.endMarkerValue = end;
    }
    /**
     * Identifier shared by the paired markers (`w:id`).
     */
    get rangeId(): number {
        return this.startMarkerValue.rangeId;
    }
    /**
     * Start marker (`w:permStart`).
     */
    get startMarker(): EditableRangeStart {
        return this.startMarkerValue;
    }
    /**
     * End marker (`w:permEnd`).
     */
    get endMarker(): EditableRangeEnd {
        return this.endMarkerValue;
    }
    /**
     * Editor group allowed to edit the range (`w:edGrp` on the start marker).
     * Assignment writes through to {@link EditableRangeStart.editorGroup}.
     */
    get editorGroup(): EditableRangeEditorGroup | undefined {
        return this.startMarkerValue.editorGroup;
    }
    set editorGroup(value: EditableRangeEditorGroup | undefined) {
        this.startMarkerValue.editorGroup = value;
    }
    /**
     * Single editor allowed to edit the range (`w:ed` on the start marker).
     * Assignment writes through to {@link EditableRangeStart.editor}.
     */
    get editor(): string | undefined {
        return this.startMarkerValue.editor;
    }
    set editor(value: string | undefined) {
        this.startMarkerValue.editor = value;
    }
    /**
     * Zero-based first table column of the range (`w:colFirst`).
     */
    get columnFirst(): number | undefined {
        return this.startMarkerValue.columnFirst;
    }
    /**
     * Zero-based last table column of the range (`w:colLast`).
     */
    get columnLast(): number | undefined {
        return this.startMarkerValue.columnLast;
    }
    /**
     * Whether both markers are paragraph inlines of the same paragraph.
     *
     * Requires a document walk; pass the owning document via
     * {@link editableRangeMarkersShareParagraph}.
     *
     * @param {WordDocument} document - The document.
     * @returns {boolean} The result.
     * @deprecated Prefer {@link editableRangeMarkersShareParagraph}.
     * @private
     */
    markersShareParagraph(document: WordDocument): boolean {
        return editableRangeMarkersShareParagraph(document, this);
    }
}
/**
 * Host location of a modeled editable-range marker.
 *
 * @private
 */
type MarkerLocation = {
    readonly kind: 'inline';
    readonly paragraph: Paragraph;
    readonly index: number;
} | {
    readonly kind: 'block';
    readonly document: WordDocument;
    readonly index: number;
};
/**
 * Whether both markers of a paired range are inlines of the same paragraph.
 *
 * @param {WordDocument} document - The document.
 * @param {EditableRange} range - The range.
 * @returns {boolean} The result.
 * @private
 */
export function editableRangeMarkersShareParagraph(document: WordDocument, range: EditableRange): boolean {
    const startLoc: MarkerLocation = locateMarker(document, range.startMarker);
    const endLoc: MarkerLocation = locateMarker(document, range.endMarker);
    // TS 3.3 does not narrow unions through `(x == null ? undefined : x.kind)`.
    return (startLoc !== undefined &&
        endLoc !== undefined &&
        startLoc.kind === 'inline' &&
        endLoc.kind === 'inline' &&
        startLoc.paragraph === endLoc.paragraph);
}
/**
 * Locate a marker among document body blocks and paragraph inlines.
 *
 * @param {WordDocument} document - The document.
 * @param {EditableRangeStart | EditableRangeEnd} marker - The marker.
 * @returns {MarkerLocation | undefined} The result.
 * @private
 */
function locateMarker(document: WordDocument, marker: EditableRangeStart | EditableRangeEnd): MarkerLocation | undefined {
    const blocks: ReadonlyArray<BlockContent> = document.listBlocks();
    for (const [i, content] of blocks.entries()) {
        if (content === undefined) {
            continue;
        }
        if (content.type === 'feature' && content.value === marker) {
            return { kind: 'block', document, index: i };
        }
    }
    let found: MarkerLocation | undefined;
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        if (found !== undefined) {
            return;
        }
        const content: ConcreteParagraphItem[] = paragraph.items.toArray();
        for (const [i, item] of content.entries()) {
            // TS 3.3 does not narrow InlineContent through `(x == null ? undefined : x.type)`.
            if (item !== undefined &&
                item instanceof FeatureInlineParagraphItem &&
                item.value === marker) {
                found = { kind: 'inline', paragraph, index: i };
                return;
            }
        }
    });
    return found;
}
function removeMarkerAt(location: MarkerLocation, marker: EditableRangeStart | EditableRangeEnd): void {
    if (location.kind === 'inline') {
        location.paragraph.removeFeatureInline(marker);
        return;
    }
    const block: BlockContent = location.document.listBlocks()[location.index];
    if (block === undefined || block.type !== 'feature' || block.value !== marker) {
        throw new DetachedObjectError('Editable-range marker is no longer in this document');
    }
    location.document.removeBlockAt(location.index);
}
/**
 * Deep-clone a start marker, optionally overriding `rangeId`.
 *
 * Residual attributes are copied. Used by paragraph/content clone helpers that
 * re-insert ranges without sharing live marker instances.
 *
 * @param {EditableRangeStart} source - The source.
 * @param {Object} options - The options.
 * @returns {EditableRangeStart} The result.
 * @private
 */
export function cloneEditableRangeStart(source: EditableRangeStart, options?: {
    readonly rangeId?: number;
}): EditableRangeStart {
    let ts331: any;
    return new EditableRangeStart(((ts331 = options == null ? undefined : options.rangeId), ts331 != null ? ts331 : source.rangeId), {
        editorGroup: source.editorGroup,
        editor: source.editor,
        columnFirst: source.columnFirst,
        columnLast: source.columnLast,
        displacedByCustomXml: source.displacedByCustomXml,
        residualAttributes: source.residualAttributes()
    });
}
/**
 * Deep-clone an end marker, optionally overriding `rangeId`.
 *
 * @param {EditableRangeEnd} source - The source.
 * @param {Object} options - The options.
 * @returns {EditableRangeEnd} The result.
 * @private
 */
export function cloneEditableRangeEnd(source: EditableRangeEnd, options?: {
    readonly rangeId?: number;
}): EditableRangeEnd {
    let ts332: any;
    return new EditableRangeEnd(((ts332 = options == null ? undefined : options.rangeId), ts332 != null ? ts332 : source.rangeId), {
        displacedByCustomXml: source.displacedByCustomXml,
        residualAttributes: source.residualAttributes()
    });
}
/**
 * Clone a paired range’s markers onto a target document with a fresh pending id.
 *
 * Returns detached start/end clones (not inserted). Callers insert them into
 * the desired hosts. Both clones share the same pending id so they pair after
 * insertion. Does not mutate the source markers.
 *
 * @param {WordDocument} document - The document.
 * @param {EditableRange} range - The range.
 * @returns {Object} The result.
 * @private
 */
export function cloneEditableRangeForInsert(document: WordDocument, range: EditableRange): {
    readonly start: EditableRangeStart;
    readonly end: EditableRangeEnd;
} {
    const pendingId: number = allocatePendingEditableRangeId(document);
    return {
        start: cloneEditableRangeStart(range.startMarker, { rangeId: pendingId }),
        end: cloneEditableRangeEnd(range.endMarker, { rangeId: pendingId })
    };
}
/**
 * Remove both markers of a paired editable range; enclosed content is kept.
 *
 * Markers may be paragraph inlines and/or body-level feature blocks. After
 * removal the pair is gone from query APIs; orphan policy does not apply
 * because both ends are deleted together.
 *
 * @param {WordDocument} document - Owning document (used for body-level marker removal)
 * @param {EditableRange} range - Pair view from a query or authoring API
 * @returns {void} Nothing
 * @throws {@link DocxError} `content/unknown-editable-range` when either marker
 *   is not found in the document.
 * @example
 * ```ts
 * const [range] = editableRangesInDocument(doc);
 * if (range) removeEditableRange(doc, range);
 * ```
 * @private
 */
export function removeEditableRange(document: WordDocument, range: EditableRange): void {
    const startLoc: MarkerLocation = locateMarker(document, range.startMarker);
    const endLoc: MarkerLocation = locateMarker(document, range.endMarker);
    if (startLoc === undefined || endLoc === undefined) {
        throw new DocxError('content/unknown-editable-range', 'Editable range markers are not in this document');
    }
    // Remove higher document-order index first so lower indices stay valid.
    const startOrder: number = markerDocumentOrderKey(startLoc);
    const endOrder: number = markerDocumentOrderKey(endLoc);
    if (startOrder > endOrder) {
        removeMarkerAt(startLoc, range.startMarker);
        // Re-locate end after start removal if both were body blocks with shifting indices.
        const endReloc: MarkerLocation = locateMarker(document, range.endMarker);
        if (endReloc === undefined) {
            throw new DocxError('content/unknown-editable-range', 'Editable range end marker is not in this document');
        }
        removeMarkerAt(endReloc, range.endMarker);
    }
    else {
        removeMarkerAt(endLoc, range.endMarker);
        const startReloc: MarkerLocation = locateMarker(document, range.startMarker);
        if (startReloc === undefined) {
            throw new DocxError('content/unknown-editable-range', 'Editable range start marker is not in this document');
        }
        removeMarkerAt(startReloc, range.startMarker);
    }
    rangeByStart.delete(range.startMarker);
}
function markerDocumentOrderKey(location: MarkerLocation): number {
    if (location.kind === 'block') {
        // Body blocks ordered by block index; scale so they interleave roughly with
        // paragraph walks (block index * large stride).
        return location.index * 1000000;
    }
    // Prefer end-before-start removal within the same paragraph via content index.
    const blocks: ReadonlyArray<BlockContent> = location.paragraph.owningDocument().listBlocks();
    let blockIndex: number = 0;
    for (const [i, content] of blocks.entries()) {
        // TS 3.3 does not narrow BodyItem through `(x == null ? undefined : x.type)`.
        if (content !== undefined && content.type === 'paragraph' && content.paragraph === location.paragraph) {
            blockIndex = i;
            break;
        }
    }
    return blockIndex * 1000000 + location.index;
}
/**
 * Move a single modeled marker from one paragraph content slot to another.
 *
 * Used for same-document reorder tests; does not change `rangeId`. When the
 * marker is a body-level feature block, it is removed from the body and
 * inserted as an inline in the target paragraph.
 *
 * @param {WordDocument} document - The document.
 * @param {EditableRangeStart | EditableRangeEnd} marker - The marker.
 * @param {Paragraph} targetParagraph - The target paragraph.
 * @param {number} inlineIndex - The inline index.
 * @returns {void} Nothing is returned.
 * @private
 */
export function moveEditableRangeMarkerToParagraph(
    document: WordDocument,
    marker: EditableRangeStart | EditableRangeEnd,
    targetParagraph: Paragraph,
    inlineIndex: number
): void {
    const location: MarkerLocation = locateMarker(document, marker);
    if (location === undefined) {
        throw new DocxError('content/unknown-editable-range', 'Editable-range marker is not in this document');
    }
    if (targetParagraph.owningDocument() !== document) {
        throw new DocxError('content/invalid-editable-range', 'Target paragraph is not in this document');
    }
    removeMarkerAt(location, marker);
    let insertAt: number = inlineIndex;
    if (location.kind === 'inline' && location.paragraph === targetParagraph) {
        // After removal, indices after the old slot shift left by one.
        if (inlineIndex > location.index) {
            insertAt = inlineIndex - 1;
        }
    }
    if (insertAt < 0 || insertAt > targetParagraph.items.length) {
        throw new RangeError(`Feature inline index ${String(insertAt)} is out of range`);
    }
    targetParagraph.insertFeatureInlineAt(insertAt, EDITABLE_RANGES, marker);
}
/**
 * Remap every editable-range marker in a paragraph to fresh pending ids, pairing
 * starts with ends that share the previous id within the paragraph only.
 *
 * Intended for “clone paragraph then insert” flows so positive ids are not
 * duplicated in the document. Cross-paragraph half-clones keep unpaired markers
 * with new pending ids (one id per marker).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {void} Nothing is returned.
 * @private
 */
export function remapEditableRangeIdsInParagraphToPending(paragraph: Paragraph): void {
    const document: WordDocument = paragraph.owningDocument();
    const content: ConcreteParagraphItem[] = paragraph.items.toArray();
    const oldToPending: Map<number, number> = new Map<number, number>();
    const usedIds: Set<number> = new Set<number>();
    collectEditableRangeIds(document, (id: number) => {
        usedIds.add(id);
    });
    const allocPending: () => number = (): number => {
        let candidate: number = -1;
        while (usedIds.has(candidate)) {
            candidate -= 1;
        }
        usedIds.add(candidate);
        return candidate;
    };
    for (const item of content) {
        if (!(item instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        if (item.value instanceof EditableRangeStart || item.value instanceof EditableRangeEnd) {
            const oldId: number = item.value.rangeId;
            if (!oldToPending.has(oldId)) {
                oldToPending.set(oldId, allocPending());
            }
        }
    }
    for (const inline of content) {
        if (!(inline instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        if (inline.value instanceof EditableRangeStart || inline.value instanceof EditableRangeEnd) {
            const pending: number = oldToPending.get(inline.value.rangeId);
            if (pending !== undefined) {
                inline.value.setRangeId(pending);
            }
        }
    }
}
/**
 * Clone all editable-range markers found as paragraph inlines, preserving local
 * pairing by assigning one fresh pending id per former id shared by start/end
 * in this paragraph.
 *
 * Returns new marker instances (not inserted). Non-range inlines are ignored —
 * callers building a full paragraph clone still need core paragraph clone support.
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} sourceParagraph - The source paragraph.
 * @returns {Object} The result.
 * @private
 */
export function cloneEditableRangeMarkersFromParagraph(document: WordDocument, sourceParagraph: Paragraph): {
    readonly markers: ReadonlyArray<{
        readonly index: number;
        readonly marker: EditableRangeStart | EditableRangeEnd;
    }>;
} {
    const oldToPending: Map<number, number> = new Map<number, number>();
    const usedPending: Set<number> = new Set<number>();
    collectEditableRangeIds(document, (id: number) => {
        usedPending.add(id);
    });
    const allocPending: () => number = (): number => {
        let candidate: number = -1;
        while (usedPending.has(candidate)) {
            candidate -= 1;
        }
        usedPending.add(candidate);
        return candidate;
    };
    const content: ConcreteParagraphItem[] = sourceParagraph.items.toArray();
    for (const inline of content) {
        if (!(inline instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        if (inline.value instanceof EditableRangeStart || inline.value instanceof EditableRangeEnd) {
            if (!oldToPending.has(inline.value.rangeId)) {
                oldToPending.set(inline.value.rangeId, allocPending());
            }
        }
    }
    const markers: {
        index: number;
        marker: EditableRangeStart | EditableRangeEnd;
    }[] = [];
    for (const [i, inline] of content.entries()) {
        // TS 3.3 does not narrow InlineContent through `(x == null ? undefined : x.type)`.
        if (inline === undefined || !(inline instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        const pending: number = oldToPending.get(inline.value instanceof EditableRangeStart || inline.value instanceof EditableRangeEnd
            ? inline.value.rangeId
            : Number.NaN);
        if (pending === undefined) {
            continue;
        }
        if (inline.value instanceof EditableRangeStart) {
            markers.push({
                index: i,
                marker: cloneEditableRangeStart(inline.value, { rangeId: pending })
            });
        }
        else if (inline.value instanceof EditableRangeEnd) {
            markers.push({
                index: i,
                marker: cloneEditableRangeEnd(inline.value, { rangeId: pending })
            });
        }
    }
    return { markers };
}
function parseEditableRangeStart(element: OpenXmlElement): EditableRangeStart | undefined {
    if (!isWml(element, 'permStart')) {
        return undefined;
    }
    const rangeId: number = parseDecimalId(wmlAttribute(element, 'id'));
    if (rangeId === undefined) {
        // Non-decimal or missing w:id — stay opaque so bytes are preserved verbatim.
        return undefined;
    }
    const consumed: Set<string> = new Set<string>(['id']);
    const editorGroupRaw: string = wmlAttribute(element, 'edGrp');
    const editorGroup: EditableRangeEditorGroup = parseEditorGroup(editorGroupRaw);
    if (editorGroupRaw !== undefined && editorGroup !== undefined) {
        consumed.add('edGrp');
    }
    const editor: string = wmlAttribute(element, 'ed');
    if (editor !== undefined) {
        consumed.add('ed');
    }
    const columnFirstRaw: string = wmlAttribute(element, 'colFirst');
    const columnFirst: number = parseColumn(columnFirstRaw);
    if (columnFirstRaw !== undefined && columnFirst !== undefined) {
        consumed.add('colFirst');
    }
    const columnLastRaw: string = wmlAttribute(element, 'colLast');
    const columnLast: number = parseColumn(columnLastRaw);
    if (columnLastRaw !== undefined && columnLast !== undefined) {
        consumed.add('colLast');
    }
    const displacedRaw: string = wmlAttribute(element, 'displacedByCustomXml');
    const displacedByCustomXml: DisplacedByCustomXml = parseDisplaced(displacedRaw);
    if (displacedRaw !== undefined && displacedByCustomXml !== undefined) {
        consumed.add('displacedByCustomXml');
    }
    return new EditableRangeStart(rangeId, {
        editorGroup,
        editor,
        columnFirst,
        columnLast,
        displacedByCustomXml,
        residualAttributes: residualAttributesOf(element, consumed)
    });
}
function parseEditableRangeEnd(element: OpenXmlElement): EditableRangeEnd | undefined {
    if (!isWml(element, 'permEnd')) {
        return undefined;
    }
    const rangeId: number = parseDecimalId(wmlAttribute(element, 'id'));
    if (rangeId === undefined) {
        return undefined;
    }
    const consumed: Set<string> = new Set<string>(['id']);
    const displacedRaw: string = wmlAttribute(element, 'displacedByCustomXml');
    const displacedByCustomXml: DisplacedByCustomXml = parseDisplaced(displacedRaw);
    if (displacedRaw !== undefined && displacedByCustomXml !== undefined) {
        consumed.add('displacedByCustomXml');
    }
    return new EditableRangeEnd(rangeId, {
        displacedByCustomXml,
        residualAttributes: residualAttributesOf(element, consumed)
    });
}
type EditableRangeMarker = EditableRangeStart | EditableRangeEnd;
/**
 * WordDocument-order walk of modeled editable-range markers.
 *
 * Visits:
 * - body-level feature blocks that are start/end markers
 * - inline markers inside every paragraph reachable via
 *   {@link visitParagraphsInDocumentOrder} (main body and nested feature
 *   paragraphs such as table cells)
 *
 * Body-level markers that sit between paragraphs are emitted when their
 * owning block is visited, before subsequent paragraphs. Nested table-cell
 * body-level markers that are not paragraph inlines are only visible when
 * hosted as paragraph inlines (common Word placement).
 *
 * @param {WordDocument} document - The document.
 * @returns {EditableRangeMarker[]} The result.
 * @private
 */
function collectEditableRangeMarkersInDocumentOrder(document: WordDocument): EditableRangeMarker[] {
    const markers: EditableRangeMarker[] = [];
    const seen: Set<EditableRangeStart | EditableRangeEnd> = new Set<EditableRangeMarker>();
    const push: (marker: EditableRangeStart | EditableRangeEnd) => void = (marker: EditableRangeMarker): void => {
        if (seen.has(marker)) {
            return;
        }
        seen.add(marker);
        markers.push(marker);
    };
    const visitParagraphInlines: (paragraph: Paragraph) => void = (paragraph: Paragraph): void => {
        for (const inline of paragraph.items) {
            if (!(inline instanceof FeatureInlineParagraphItem)) {
                continue;
            }
            if (inline.value instanceof EditableRangeStart || inline.value instanceof EditableRangeEnd) {
                push(inline.value);
            }
        }
    };
    // Interleave body-level markers with paragraphs in listBlocks order.
    // For nested feature paragraphs (tables), fall back to the registry walker
    // after finishing the top-level block stream so cell inlines are included
    // once, without double-counting top-level paragraphs already visited.
    const topLevelParagraphs: Set<Paragraph> = new Set<Paragraph>();
    for (const block of document.listBlocks()) {
        if (block.type === 'paragraph') {
            topLevelParagraphs.add(block.paragraph);
            visitParagraphInlines(block.paragraph);
            continue;
        }
        if (block.type === 'feature') {
            if (block.value instanceof EditableRangeStart || block.value instanceof EditableRangeEnd) {
                push(block.value);
            }
        }
    }
    visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
        if (topLevelParagraphs.has(paragraph)) {
            return;
        }
        visitParagraphInlines(paragraph);
    });
    return markers;
}
function forEachEditableRangeMarker(document: WordDocument, visit: (marker: EditableRangeMarker) => void): void {
    for (const marker of collectEditableRangeMarkersInDocumentOrder(document)) {
        visit(marker);
    }
}
function collectEditableRangeIds(document: WordDocument, visit: (rangeId: number) => void): void {
    forEachEditableRangeMarker(document, (marker: EditableRangeStart | EditableRangeEnd) => {
        visit(marker.rangeId);
    });
}
/**
 * Pair starts to ends in document order (ECMA one-start/one-end by id).
 *
 * For each start, the matching end is the first subsequent unpaired end with
 * the same id. Duplicate starts before an end: first start pairs; later starts
 * remain unpaired. Orphan ends remain unpaired. All markers stay in the DOM.
 *
 * @private
 */
/** Stable EditableRange identity for a start marker while its paired end is unchanged. */
const rangeByStart: WeakMap<EditableRangeStart, EditableRange> = new WeakMap<EditableRangeStart, EditableRange>();
function pairViewForMarkers(start: EditableRangeStart, end: EditableRangeEnd): EditableRange {
    let range: EditableRange = rangeByStart.get(start);
    if (range === undefined || range.endMarker !== end) {
        range = new EditableRange(start, end);
        rangeByStart.set(start, range);
    }
    return range;
}
function pairEditableRanges(markers: ReadonlyArray<EditableRangeMarker>): EditableRange[] {
    const pairedEnd: Set<EditableRangeEnd> = new Set<EditableRangeEnd>();
    const ranges: EditableRange[] = [];
    for (const [i, marker] of markers.entries()) {
        if (!(marker instanceof EditableRangeStart)) {
            continue;
        }
        const start: EditableRangeStart = marker;
        for (let j: number = i + 1; j < markers.length; j += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const candidate: EditableRangeStart | EditableRangeEnd = markers[j];
            if (!(candidate instanceof EditableRangeEnd)) {
                continue;
            }
            if (candidate.rangeId !== start.rangeId) {
                continue;
            }
            if (pairedEnd.has(candidate)) {
                continue;
            }
            pairedEnd.add(candidate);
            let range: EditableRange = rangeByStart.get(start);
            if (range === undefined || range.endMarker !== candidate) {
                range = new EditableRange(start, candidate);
                rangeByStart.set(start, range);
            }
            ranges.push(range);
            break;
        }
    }
    return ranges;
}
/**
 * All paired editable ranges in document order of their start markers.
 *
 * Walks body-level markers and paragraph inlines (including nested feature
 * paragraphs such as table cells). Unpaired start/end markers are omitted from
 * the list but remain in the DOM and continue to serialize.
 *
 * @param {WordDocument} document - WordDocument whose body is walked
 * @returns {ReadonlyArray<EditableRange>} Stable pair views (same start marker → same `EditableRange` object)
 * @example
 * ```ts
 * for (const range of editableRangesInDocument(doc)) {
 *   console.log(range.rangeId, range.editorGroup);
 * }
 * ```
 * @private
 */
export function editableRangesInDocument(document: WordDocument): ReadonlyArray<EditableRange> {
    return pairEditableRanges(collectEditableRangeMarkersInDocumentOrder(document));
}
/**
 * Paired editable ranges whose start marker lies in this paragraph.
 *
 * The matching end may be in the same paragraph, a later paragraph, or a
 * body-level feature block. Unpaired starts in the paragraph are omitted.
 *
 * @param {Paragraph} paragraph - Paragraph that may host start markers
 * @returns {ReadonlyArray<EditableRange>} Subset of {@link editableRangesInDocument} for this paragraph
 * @example
 * ```ts
 * const starts = editableRangesStartingInParagraph(doc.body.paragraphs[0]!);
 * ```
 * @private
 */
export function editableRangesStartingInParagraph(paragraph: Paragraph): ReadonlyArray<EditableRange> {
    // Pair against the full document stream so cross-paragraph ends resolve.
    const owner: WordDocument = paragraph.owningDocument();
    const all: ReadonlyArray<EditableRange> = editableRangesInDocument(owner);
    return all.filter((range: EditableRange) => {
        for (const inline of paragraph.items) {
            if (inline instanceof FeatureInlineParagraphItem && inline.value === range.startMarker) {
                return true;
            }
        }
        return false;
    });
}
/**
 * First paired editable range with this range identifier, if any.
 *
 * When duplicate starts share an id, the first start in document order that
 * successfully pairs wins (see pairing algorithm).
 *
 * @param {WordDocument} document - WordDocument to search
 * @param {number} rangeId - `w:id` value (`EditableRange.rangeId`)
 * @returns {EditableRange | undefined} First matching pair, or `undefined`
 * @example
 * ```ts
 * const range = editableRangeById(doc, 0);
 * ```
 * @private
 */
export function editableRangeById(document: WordDocument, rangeId: number): EditableRange | undefined {
    for (const range of editableRangesInDocument(document)) {
        if (range.rangeId === rangeId) {
            return range;
        }
    }
    return undefined;
}
/**
 * Modeled editable-range markers in document order (paired and unpaired).
 *
 * Useful for diagnostics and tests; public authoring stays on pair views.
 *
 * @param {WordDocument} document - WordDocument whose markers are listed
 * @returns {ReadonlyArray<EditableRangeMarker>} Start and end markers in document order
 * @private
 */
export function editableRangeMarkersInDocument(document: WordDocument): ReadonlyArray<EditableRangeMarker> {
    return collectEditableRangeMarkersInDocumentOrder(document);
}
function materializeEditableRangeIds(document: WordDocument): void {
    const remap: Map<number, number> = new Map<number, number>();
    let nextId: number = 0;
    collectEditableRangeIds(document, (rangeId: number) => {
        if (rangeId >= 0 && rangeId >= nextId) {
            nextId = rangeId + 1;
        }
    });
    forEachEditableRangeMarker(document, (marker: EditableRangeStart | EditableRangeEnd) => {
        if (!marker.isPendingRangeId()) {
            return;
        }
        const pendingId: number = marker.rangeId;
        let resolved: number = remap.get(pendingId);
        if (resolved === undefined) {
            resolved = nextId;
            nextId += 1;
            remap.set(pendingId, resolved);
        }
        marker.setRangeId(resolved);
    });
}
/**
 * @param {WordDocument} document - The document.
 * @returns {number} The result.
 * @private
 * Allocate a pending (negative) id unique among editable-range markers.
 */
export function allocatePendingEditableRangeId(document: WordDocument): number {
    const used: Set<number> = new Set<number>();
    collectEditableRangeIds(document, (rangeId: number) => {
        used.add(rangeId);
    });
    let candidate: number = -1;
    while (used.has(candidate)) {
        candidate -= 1;
    }
    return candidate;
}
/**
 * Next free non-negative editable-range id for the document (max existing + 1).
 *
 * Does not allocate or mutate markers; save-time materialization still remaps
 * pending negative ids independently.
 *
 * @param {WordDocument} document - WordDocument to scan
 * @returns {number} Smallest non-negative id not used by any marker
 * @private
 */
export function nextEditableRangeId(document: WordDocument): number {
    let nextId: number = 0;
    collectEditableRangeIds(document, (rangeId: number) => {
        if (rangeId >= 0 && rangeId >= nextId) {
            nextId = rangeId + 1;
        }
    });
    return nextId;
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetEditableRangesFeatureForTests(): void {
    registered = false;
}
/**
 * Register the editable-ranges feature handlers. Idempotent.
 *
 * Registers inline handlers (`w:permStart` / `w:permEnd` inside paragraphs),
 * the matching body block handlers (run-level markers between paragraphs), and
 * the save-time materialization pass that remaps pending negative identifiers
 * to the next free non-negative `w:id`. When this module is not imported,
 * editable-range markup stays opaque and is preserved byte-for-byte.
 *
 * @returns {void} Nothing
 * @example
 * ```ts
 * import { registerEditableRangesFeature } from '@syncfusion/ej2-docx/editable-ranges';
 * registerEditableRangesFeature();
 * ```
 * @private
 */
export function registerEditableRangesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: EDITABLE_RANGES });
    registerFeatureInlineHandler({
        featureId: EDITABLE_RANGES,
        wmlLocalName: 'permStart',
        tryParse(element: OpenXmlElement): EditableRangeStart | undefined {
            return parseEditableRangeStart(element);
        }
    });
    registerFeatureInlineHandler({
        featureId: EDITABLE_RANGES,
        wmlLocalName: 'permEnd',
        tryParse(element: OpenXmlElement): EditableRangeEnd | undefined {
            return parseEditableRangeEnd(element);
        }
    });
    registerFeatureBlockHandler({
        featureId: EDITABLE_RANGES,
        wmlLocalName: 'permStart',
        tryParse(element: OpenXmlElement): EditableRangeStart | undefined {
            return parseEditableRangeStart(element);
        }
    });
    registerFeatureBlockHandler({
        featureId: EDITABLE_RANGES,
        wmlLocalName: 'permEnd',
        tryParse(element: OpenXmlElement): EditableRangeEnd | undefined {
            return parseEditableRangeEnd(element);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: EDITABLE_RANGES,
        materialize(document: WordDocument): void {
            materializeEditableRangeIds(document);
        }
    });
}
/**
 * Whether paragraph inline content is a modeled editable-range start marker
 * (`w:permStart`) from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isEditableRangeStartInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: EditableRangeStart } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === EDITABLE_RANGES &&
        inline.value instanceof EditableRangeStart
    );
}
/**
 * Whether paragraph inline content is a modeled editable-range end marker
 * (`w:permEnd`) from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isEditableRangeEndInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: EditableRangeEnd } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === EDITABLE_RANGES &&
        inline.value instanceof EditableRangeEnd
    );
}
/**
 * Options when wrapping existing paragraph content in an editable range.
 *
 * @private
 */
export interface EditableRangeWrapOptions {
    /** Inclusive start index into `paragraph.content` (pre-insert). */
    startInlineIndex: number;
    /** Exclusive end index into `paragraph.content` (pre-insert). */
    endInlineIndex: number;
    /** Optional editor group (`w:edGrp`). */
    editorGroup?: EditableRangeEditorGroup;
    /** Optional single editor name (`w:ed`). */
    editor?: string;
    /** Optional first table column index (`w:colFirst`). */
    columnFirst?: number;
    /** Optional last table column index (`w:colLast`). */
    columnLast?: number;
}
function assertEditableRangeIndices(paragraph: Paragraph, startInlineIndex: number, endInlineIndex: number): void {
    const length: number = paragraph.items.length;
    if (!Number.isInteger(startInlineIndex) ||
        !Number.isInteger(endInlineIndex) ||
        startInlineIndex < 0 ||
        endInlineIndex < startInlineIndex ||
        endInlineIndex > length) {
        throw new DocxError('content/invalid-editable-range', `Editable range indices out of range: start=${String(startInlineIndex)} end=${String(endInlineIndex)} length=${String(length)}`);
    }
}
/**
 * Wrap an existing same-paragraph content slice in a new editable range.
 *
 * Indices refer to the current `paragraph.content` array **before** insertion:
 * the start marker is inserted at `startInlineIndex`, and the end marker is
 * inserted so that it follows the original slice
 * (`endInlineIndex + 1` after the start push). Enclosed content is not copied
 * or moved. Cross-paragraph authoring is not supported — use load/preserve for
 * multi-paragraph ranges.
 *
 * @param {Paragraph} paragraph - Paragraph that owns the inlines to wrap
 * @param {EditableRangeWrapOptions} options - Inclusive/exclusive indices and optional editor metadata
 * @returns {EditableRange} Live pair view for the new markers (pending id until save)
 * @example
 * ```ts
 * insertEditableRangeAt(paragraph, {
 *   startInlineIndex: 1,
 *   endInlineIndex: 2,
 *   editorGroup: 'editors',
 * });
 * ```
 * @private
 */
export function insertEditableRangeAt(paragraph: Paragraph, options: EditableRangeWrapOptions): EditableRange {
    assertEditableRangeIndices(paragraph, options.startInlineIndex, options.endInlineIndex);
    const document: WordDocument = paragraph.owningDocument();
    const rangeId: number = allocatePendingEditableRangeId(document);
    const start: EditableRangeStart = new EditableRangeStart(rangeId, {
        editorGroup: options.editorGroup,
        editor: options.editor,
        columnFirst: options.columnFirst,
        columnLast: options.columnLast
    });
    const end: EditableRangeEnd = new EditableRangeEnd(rangeId);
    paragraph.insertFeatureInlineAt(options.startInlineIndex, EDITABLE_RANGES, start);
    // After inserting start, original exclusive end shifts by +1.
    paragraph.insertFeatureInlineAt(options.endInlineIndex + 1, EDITABLE_RANGES, end);
    return pairViewForMarkers(start, end);
}
/**
 * Options for {@link Paragraph.appendEditableRange}.
 *
 * @private
 */
export interface AppendEditableRangeOptions {
    /** Optional editor group (`w:edGrp`). */
    editorGroup?: EditableRangeEditorGroup;
    /** Optional single editor name (`w:ed`). */
    editor?: string;
    /** Optional first table column index (`w:colFirst`). */
    columnFirst?: number;
    /** Optional last table column index (`w:colLast`). */
    columnLast?: number;
}
Paragraph.prototype.appendEditableRange = function (
    this: Paragraph,
    text: string,
    options: AppendEditableRangeOptions = {}
): EditableRange {
    const document: WordDocument = this.owningDocument();
    const rangeId: number = allocatePendingEditableRangeId(document);
    const start: EditableRangeStart = new EditableRangeStart(rangeId, {
        editorGroup: options.editorGroup,
        editor: options.editor,
        columnFirst: options.columnFirst,
        columnLast: options.columnLast
    });
    this.appendFeatureInline(EDITABLE_RANGES, start);
    this.appendText(text);
    const end: EditableRangeEnd = new EditableRangeEnd(rangeId);
    this.appendFeatureInline(EDITABLE_RANGES, end);
    return pairViewForMarkers(start, end);
};
Paragraph.prototype.insertEditableRangeAt = function (this: Paragraph, options: EditableRangeWrapOptions): EditableRange {
    return insertEditableRangeAt(this, options);
};
/**
 * Feature id string for editable-range markers (`editable-ranges`).
 * @private
 */
export const EDITABLE_RANGES_FEATURE_ID: FeatureId = EDITABLE_RANGES;
registerEditableRangesFeature();
