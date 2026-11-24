export * from './comment-extensions';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { parseBodyBlocks, serializeBodyBlocks, BodyBlockParseContext } from '../document/body-blocks';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureInline } from '../document/feature-inline';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { CharacterFormatSnapshot } from '../document/character-format';
import { BlockContent, Paragraph } from '../document/paragraph';
import {
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    ParagraphItem,
    Owner,
    TextRange,
    WireRunGroup
} from '../document/text-range';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { allocateRelationshipId, OpcRelationship, RelationshipId } from '../../core/opc/relationships';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { partName, partNameKey, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureInlineHandler, registerFeatureMultiPartHandler, registerFeatureRunLeafHandler } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { replaceOrAddPackagePart } from '../../core/registry/multi-part-handlers';
import { parseXml, serializeXml, closePartNamespaces, WML_TRANSITIONAL_NAMESPACE, OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { WORDML_2010_NAMESPACE } from '../content-controls/index';
import { CommentExtensionParts, loadCommentExtensionMetadata, CommentExEntry } from './comment-extensions';
import { FeatureId } from '../../core/registry/feature-registry';
const COMMENTS: FeatureId = featureId('comments');
const WML: string = WML_TRANSITIONAL_NAMESPACE;
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
/**
 *  Transitional comments relationship (ECMA-376-4).
 *
 * @private
 */
export const COMMENTS_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';
/**
 *  Strict comments relationship.
 *
 * @private
 */
export const STRICT_COMMENTS_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/comments';
/**
 * @private
 */
export const COMMENTS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml';
const COMMENTS_RELATIONSHIP_TYPES: string[] = [
    COMMENTS_RELATIONSHIP_TYPE,
    STRICT_COMMENTS_RELATIONSHIP_TYPE
];
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}
function parseCommentId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
const detachedCommentParseContext: BodyBlockParseContext = {
    assertAttachedParagraph(): void {
        return;
    },
    owningDocument(): WordDocument {
        throw new DetachedObjectError('Comment content is not in a WordDocument');
    }
};
/** Ephemeral owner for building default elevated comment reference formatting. */
const detachedTextRangeOwner: Owner = {
    assertAttachedItem(): void {
        return;
    }
};
/** Word character style commonly applied to sole-purpose `w:commentReference` runs. */
const COMMENT_REFERENCE_STYLE_ID: string = 'CommentReference';
/**
 *  Snapshot of wire-run character format + attributes used when serializing
 * an elevated {@link Comment} as `w:r` + optional `w:rPr` + `w:commentReference`.
 *
 * @private
 */
interface CommentReferenceRunFormatting extends CharacterFormatSnapshot {
    readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
}
function formattingFromWireGroup(group: WireRunGroup): CommentReferenceRunFormatting {
    const cf: CharacterFormatSnapshot = group.snapshotCharacterFormat();
    return {
        extraAttributes: group.extraAttributes,
        rPrExtra: cf.rPrExtra,
        styleIdValue: cf.styleIdValue,
        boldValue: cf.boldValue,
        italicValue: cf.italicValue,
        strikeValue: cf.strikeValue,
        doubleStrikeValue: cf.doubleStrikeValue,
        vanishValue: cf.vanishValue,
        legacyHiddenValue: cf.legacyHiddenValue,
        noProofValue: cf.noProofValue,
        fontSizeValue: cf.fontSizeValue,
        fontSizeBidiValue: cf.fontSizeBidiValue,
        textColorValue: cf.textColorValue,
        textColorTheme: cf.textColorTheme,
        highlightValue: cf.highlightValue,
        shadingValue: cf.shadingValue,
        underlineStyleValue: cf.underlineStyleValue,
        underlineColorValue: cf.underlineColorValue,
        vertAlignValue: cf.vertAlignValue,
        smallCapsValue: cf.smallCapsValue,
        allCapsValue: cf.allCapsValue,
        fontsValue: cf.fontsValue,
        characterScaleValue: cf.characterScaleValue,
        kerningValue: cf.kerningValue,
        characterSpacingValue: cf.characterSpacingValue,
        positionValue: cf.positionValue,
        borderValue: cf.borderValue,
        languageValue: cf.languageValue,
        embossValue: cf.embossValue,
        imprintValue: cf.imprintValue,
        outlineValue: cf.outlineValue,
        shadowValue: cf.shadowValue,
        webHiddenValue: cf.webHiddenValue,
        bidiValue: cf.bidiValue,
        complexScriptValue: cf.complexScriptValue,
        boldBidiValue: cf.boldBidiValue,
        italicBidiValue: cf.italicBidiValue,
        emphasisValue: cf.emphasisValue,
        textEffectValue: cf.textEffectValue,
        specVanishValue: cf.specVanishValue,
        snapToGridValue: cf.snapToGridValue
    };
}
function emptyReferenceRunFormatting(styleId?: string): CommentReferenceRunFormatting {
    const group: WireRunGroup = new WireRunGroup();
    // Attach a transient TextRange so CharacterFormat host paths stay consistent.
    void new TextRange(detachedTextRangeOwner, group);
    if (styleId !== undefined) {
        group.characterFormat.characterStyle = styleId;
    }
    return formattingFromWireGroup(group);
}
function serializeElevatedCommentReference(commentId: number, formatting: CommentReferenceRunFormatting): OpenXmlElement {
    const group: WireRunGroup = new WireRunGroup(formatting.extraAttributes);
    const {
        extraAttributes: _extraAttributes,
        ...characterFormatData
    } = formatting;
    void _extraAttributes;
    group.hydrateCharacterFormat(characterFormatData);
    const rPrChildren: OpenXmlElement[] = group.characterFormat.buildRPrChildren();
    const children: OpenXmlElement[] = [];
    if (rPrChildren.length > 0) {
        children.push(wmlElement('rPr', { children: rPrChildren }));
    }
    children.push(wmlElement('commentReference', { attributes: [wmlAttr('id', String(commentId))] }));
    return wmlElement('r', { attributes: group.extraAttributes, children });
}
function blocksWithSimpleText(text: string): BlockContent[] {
    const paragraph: OpenXmlElement = wmlElement('p', {
        children: [wmlElement('r', { children: [wmlElement('t', { children: [{ kind: 'text', value: text }] })] })]
    });
    return parseBodyBlocks([paragraph], detachedCommentParseContext);
}
function firstParagraphText(blocks: ReadonlyArray<BlockContent>): string | undefined {
    for (const content of blocks) {
        if (content.type !== 'paragraph') {
            continue;
        }
        for (const inline of content.paragraph.items) {
            if (inline instanceof TextRange) {
                const text: string = inline.text;
                if (text.length > 0) {
                    return text;
                }
            }
        }
    }
    return undefined;
}
/**
 * Parse a Comments-part `w:date` / ST_DateTime string into a `Date`.
 *
 * Returns `undefined` when the value is missing, empty, or not parseable.
 *
 * @param {string | undefined} value - The value.
 * @returns {Date | undefined} The result.
 */
function parseCommentDateTime(value: string | undefined): Date | undefined {
    if (value === undefined || value.length === 0) {
        return undefined;
    }
    const ms: number = Date.parse(value);
    if (Number.isNaN(ms)) {
        return undefined;
    }
    return new Date(ms);
}
function relativeTarget(partNameValue: PartName): string {
    return partNameValue.slice('/word/'.length);
}
function kindForRelationshipType(type: string): boolean {
    return COMMENTS_RELATIONSHIP_TYPES.indexOf(type as (typeof COMMENTS_RELATIONSHIP_TYPES)[number]) !== -1;
}
/**
 * Comment range start marker (`w:commentRangeStart`).
 *
 * @public
 */
export class CommentRangeStart implements FeatureInline {
    /**
     * `w:commentRangeStart/@w:id` shared with the Comments part entry and end marker.
     *
     * @private
     */
    readonly commentId: number;
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     */
    constructor(commentId: number) {
        this.commentId = commentId;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    releaseContent(): void {
        return;
    }
    /**
     *  @private
     *
     * @returns {OpenXmlElement} The result.
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('commentRangeStart', { attributes: [wmlAttr('id', String(this.commentId))] });
    }
}
/**
 * Comment range end marker (`w:commentRangeEnd`).
 *
 * @public
 */
export class CommentRangeEnd implements FeatureInline {
    /**
     * `w:commentRangeEnd/@w:id` shared with the Comments part entry and start marker.
     *
     * @private
     */
    readonly commentId: number;
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     */
    constructor(commentId: number) {
        this.commentId = commentId;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    releaseContent(): void {
        return;
    }
    /**
     *  @private
     *
     * @returns {OpenXmlElement} The result.
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('commentRangeEnd', { attributes: [wmlAttr('id', String(this.commentId))] });
    }
}
/**
 * Comment reference run leaf (`w:commentReference`).
 *
 * @private
 */
export class CommentReference implements FeatureRunLeaf {
    /**
     * `w:commentReference/@w:id` shared with range markers and the Comments part entry.
     *
     * @private
     */
    readonly commentId: number;
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     */
    constructor(commentId: number) {
        this.commentId = commentId;
    }
    /**
     *  @private
     *
     * @returns {OpenXmlElement} The result.
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('commentReference', { attributes: [wmlAttr('id', String(this.commentId))] });
    }
}
/**
 * A comment anchor in a paragraph linked to a Comments part entry.
 *
 * Range markers and the reference leaf share the same internal comment id with the
 * matching {@link Comment} body in the Comments part.
 *
 * @private
 */
export class CommentAnchor {
    /**
     * Comments part id shared with range markers and {@link CommentReference}.
     *
     * @private
     */
    readonly commentId: number;
    /**
     * Author from the linked Comments part entry (`w:comment/@w:author`), or the
     * authoring author when the entry is not yet joined.
     */
    readonly author: string;
    /**
     * Optional comment timestamp from `w:comment/@w:date` (ST_DateTime), parsed as
     * a `Date` when present and parseable.
     */
    readonly date: Date | undefined;
    /**
     * Text ranges between the matching range start and end markers for this anchor.
     *
     * @private
     */
    readonly anchorRuns: ReadonlyArray<TextRange>;
    /**
     * Synthetic or residual {@link CommentReference} paired with this anchor.
     *
     * @private
     */
    readonly reference: CommentReference;
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     * @param {string} author - The author.
     * @param {string | Date | undefined} date - The date.
     * @param {ReadonlyArray<TextRange>} anchorRuns - The anchor runs.
     * @param {CommentReference} reference - The reference.
     */
    constructor(
        commentId: number,
        author: string,
        date: string | Date | undefined,
        anchorRuns: ReadonlyArray<TextRange>,
        reference: CommentReference
    ) {
        this.commentId = commentId;
        this.author = author;
        this.date = typeof date === 'string' ? parseCommentDateTime(date) : date;
        this.anchorRuns = anchorRuns;
        this.reference = reference;
    }
}
/**
 * Live view of a comment body in the Comments part (`w:comment`).
 *
 * Bound to a WordDocument and comment id; reads go through {@link CommentsCollection}.
 * Does not expose raw OOXML. Opaque/`preservedXml` entries yield empty paragraphs
 * until a later modeling slice.
 *
 * After main-story elevation, the same interned instance may also
 * appear in `paragraph.items` as a feature inline at the former
 * `w:commentReference` position. Serialize emits one `w:r` + optional `w:rPr` +
 * `w:commentReference` (ECMA-376-1 §17.13.4.5 / `CT_Markup` in `EG_RunInnerContent`).
 *
 * **Identity:** {@link commentFor}, {@link commentForAnchor},
 * {@link CommentsCollection.comments}, {@link Comment.ancestor}, and elevated
 * `paragraph.items` slots return the same interned instance per modeled
 * `(WordDocument, commentId)` for the lifetime of that collection entry (`===` holds).
 *
 * @private
 */
export class Comment implements FeatureInline {
    private readonly WordDocument: WordDocument;
    private readonly id: number;
    /**
     * Supported `w:rPr` from the elevated reference run (or authoring default).
     * Not a public wrapper — serialization metadata only (D5/D6).
     */
    private referenceRunFormatting: CommentReferenceRunFormatting | undefined;
    /**
     *  @private
     *
     * @param {WordDocument} WordDocument - The word document.
     * @param {number} commentId - The comment id.
     */
    constructor(WordDocument: WordDocument, commentId: number) {
        this.WordDocument = WordDocument;
        this.id = commentId;
    }
    /**
     * Comment id matching range markers and {@link CommentReference.commentId}.
     *
     * @private
     */
    get commentId(): number {
        return this.id;
    }
    /**
     * Author of this comment (`w:comment/@w:author`).
     *
     * Returns the modeled attribute value when the Comments part entry is known;
     * empty string when the entry is missing or opaque.
     * Read-only — set author at insert via {@link appendComment} / {@link insertComment}.
     */
    get author(): string {
        let ts331: any; let ts332: any;
        return ((ts332 = ((ts331 = commentsFor(this.WordDocument).entryFor(this.id)), ts331 == null ? undefined : ts331.author)), ts332 != null ? ts332 : '');
    }
    /**
     * Optional `w:comment/@w:initials` (`ST_String`) when present on a modeled entry.
     *
     * Undefined when the attribute is absent or the entry is opaque/preserved.
     * Empty-string values are treated as absent on serialize.
     */
    get initials(): string | undefined {
        let ts333: any;
        return ((ts333 = commentsFor(this.WordDocument).entryFor(this.id)), ts333 == null ? undefined : ts333.initials);
    }
    /**
     * Optional comment timestamp (`w:comment/@w:date`, ST_DateTime) as a `Date`.
     *
     * `undefined` when the attribute is absent, the entry is opaque, or the stored
     * value is not parseable. Package storage remains the original ST_DateTime
     * string for round-trip; this getter does not expose the raw attribute.
     * Read-only — supply `date` on {@link AppendCommentOptions} when authoring.
     */
    get date(): Date | undefined {
        let ts334: any;
        return parseCommentDateTime(((ts334 = commentsFor(this.WordDocument).entryFor(this.id)), ts334 == null ? undefined : ts334.date));
    }
    /**
     * Modeled body paragraphs for this comment (`EG_BlockLevelElts` paragraph children).
     *
     * Empty when the entry is missing or preserved as opaque XML. Paragraph content
     * is live — mutate via {@link Paragraph} APIs on the returned instances; there is
     * no separate setter on this property.
     */
    get paragraphs(): ReadonlyArray<Paragraph> {
        return commentsFor(this.WordDocument).paragraphsFor(this.id);
    }
    /**
     * Parent comment when this comment is a reply (`commentsExtended` / `commentEx/@paraIdParent`).
     *
     * Top-level comments and replies whose parent cannot be resolved return `undefined`.
     * Read-only; (`WComment.Ancestor`). The returned instance is the
     * collection-interned {@link Comment} for the parent id when resolved.
     */
    get ancestor(): Comment | undefined {
        return commentsFor(this.WordDocument).ancestorFor(this.WordDocument, this.id);
    }
    /**
     * Whether this comment is marked done (`commentsExtended` / `commentEx/@done`).
     *
     * Joined from `[MS-DOCX]` `CT_CommentEx/@done` (`ST_OnOff`) onto the same interned
     * {@link Comment} used by {@link commentFor}. After join: attribute absent or `"0"` →
     * `false`; other present values → `true`. No matching `commentEx` row → `false`
     * (MS default 0). Read-only in this slice; mutation is `comments-resolved-state`.
     */
    get done(): boolean {
        let ts335: any; let ts336: any;
        return (
            (ts336 = ((ts335 = commentsFor(this.WordDocument).entryFor(this.id)), ts335 == null ? undefined : ts335.done)),
            ts336 != null ? ts336 : false
        );
    }
    /**
     * Capture `w:rPr` from the wire group of the featureRun being elevated.
     *
     * @param {WireRunGroup} group - The group.
     * @returns {void} Nothing is returned.
     * @private
     */
    captureReferenceRunFormatting(group: WireRunGroup): void {
        this.referenceRunFormatting = formattingFromWireGroup(group);
    }
    /**
     * Default character style for newly authored elevated references.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    applyDefaultReferenceRunStyle(): void {
        if (this.referenceRunFormatting === undefined) {
            this.referenceRunFormatting = emptyReferenceRunFormatting(COMMENT_REFERENCE_STYLE_ID);
        }
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    releaseContent(): void {
        return;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     * Serialize as `w:r` + modeled `w:rPr` + `w:commentReference` (D6). Does not emit a
     * dual legacy leaf for the same elevated occurrence (D10).
     */
    toOpenXml(): OpenXmlElement {
        const formatting: CommentReferenceRunFormatting =
            this.referenceRunFormatting != null ? this.referenceRunFormatting : emptyReferenceRunFormatting();
        return serializeElevatedCommentReference(this.id, formatting);
    }
}
/**
 * @private
 */
interface CommentEntry {
    readonly commentId: number;
    author: string;
    /** Optional `w:initials` when modeled; undefined when absent or empty. */
    initials: string | undefined;
    date: string | undefined;
    blocks: BlockContent[];
    readonly preservedXml: OpenXmlElement | undefined;
    /**
     * Last body paragraph `w14:paraId` when known (from the Comments part body).
     * Used to join `commentsExtended` `commentEx/@paraId`.
     */
    lastParaId: string | undefined;
    /**
     * Parent comment last-body-paragraph paraId from `commentEx/@paraIdParent` after extension join.
     */
    parentParaId: string | undefined;
    /**
     * Joined `commentEx/@done` after extension join.
     *
     * `undefined` until a matching extended row is joined. After join, absent/`"0"` map to
     * `false` and other present values to `true` for the read API (MS default 0).
     */
    done: boolean | undefined;
}
/**
 * @private
 */
interface CommentsPartState {
    readonly partName: PartName;
    readonly relationshipId: RelationshipId;
    readonly relationshipType: string;
    readonly rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>;
    entries: CommentEntry[];
    dirty: boolean;
    pendingRelationship: OpcRelationship | undefined;
}
function optionalNonEmptyAttribute(value: string | undefined): string | undefined {
    return value !== undefined && value.length > 0 ? value : undefined;
}
function serializeCommentsPart(state: CommentsPartState): Uint8Array {
    const children: OpenXmlElement[] = [];
    for (const entry of state.entries) {
        if (entry.preservedXml !== undefined) {
            children.push(entry.preservedXml);
            continue;
        }
        const attributes: OpenXmlAttribute[] = [wmlAttr('id', String(entry.commentId)), wmlAttr('author', entry.author)];
        const initials: string = optionalNonEmptyAttribute(entry.initials);
        if (initials !== undefined) {
            attributes.push(wmlAttr('initials', initials));
        }
        const date: string = optionalNonEmptyAttribute(entry.date);
        if (date !== undefined) {
            attributes.push(wmlAttr('date', date));
        }
        children.push(wmlElement('comment', {
            attributes,
            children: serializeBodyBlocks(entry.blocks)
        }));
    }
    const root: OpenXmlElement = wmlElement('comments', {
        attributes: state.rootExtra.attributes,
        namespaceDeclarations: closePartNamespaces(state.rootExtra.namespaceDeclarations.length > 0
            ? state.rootExtra.namespaceDeclarations
            : [{ prefix: 'w', namespaceUri: WML }], children, state.rootExtra.attributes),
        children
    });
    return utf8.encode(serializeXml(root));
}
function parseCommentsPart(part: PackagePart, relationship: OpcRelationship): CommentsPartState | undefined {
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    if (!isWml(root, 'comments')) {
        return undefined;
    }
    const entries: CommentEntry[] = [];
    for (const child of elementChildren(root)) {
        if (!isWml(child, 'comment')) {
            continue;
        }
        const commentId: number = parseCommentId(wmlAttribute(child, 'id'));
        const author: string = wmlAttribute(child, 'author');
        const initials: string = optionalNonEmptyAttribute(wmlAttribute(child, 'initials'));
        const date: string = optionalNonEmptyAttribute(wmlAttribute(child, 'date'));
        if (commentId === undefined || author === undefined || author.length === 0) {
            entries.push({
                commentId: commentId != null ? commentId : -1,
                author: author != null ? author : '',
                initials,
                date,
                blocks: [],
                preservedXml: child,
                lastParaId: undefined,
                parentParaId: undefined,
                done: undefined
            });
            continue;
        }
        const blocks: BlockContent[] = parseBodyBlocks(child.children, detachedCommentParseContext);
        entries.push({
            commentId,
            author,
            initials,
            date,
            blocks,
            preservedXml: undefined,
            lastParaId: lastParagraphParaId(blocks),
            parentParaId: undefined,
            done: undefined
        });
    }
    return {
        partName: part.name,
        relationshipId: relationship.id,
        relationshipType: relationship.type,
        rootExtra: {
            attributes: root.attributes,
            namespaceDeclarations: root.namespaceDeclarations.length > 0
                ? root.namespaceDeclarations
                : [{ prefix: 'w', namespaceUri: WML }]
        },
        entries,
        dirty: false,
        pendingRelationship: undefined
    };
}
function allocatePartName(used: ReadonlySet<string>): PartName {
    const primary: PartName = partName('/word/comments.xml');
    if (!used.has(partNameKey(primary))) {
        return primary;
    }
    let index: number = 2;
    while (used.has(partNameKey(partName(`/word/comments${String(index)}.xml`)))) {
        index += 1;
    }
    return partName(`/word/comments${String(index)}.xml`);
}
function allocateCommentId(entries: ReadonlyArray<CommentEntry>, WordDocument: WordDocument): number {
    const used: Set<number> = new Set<number>();
    for (const entry of entries) {
        if (entry.commentId >= 0) {
            used.add(entry.commentId);
        }
    }
    for (const paragraph of WordDocument.listParagraphs()) {
        collectCommentIdsInParagraph(paragraph, used);
    }
    let candidate: number = 0;
    while (used.has(candidate)) {
        candidate += 1;
    }
    return candidate;
}
function collectCommentIdsInParagraph(paragraph: Paragraph, used: Set<number>): void {
    for (const inline of paragraph.items) {
        if (inline instanceof FeatureInlineParagraphItem) {
            if (
                inline.value instanceof CommentRangeStart ||
                inline.value instanceof CommentRangeEnd ||
                inline.value instanceof Comment
            ) {
                used.add(inline.value.commentId);
            }
            continue;
        }
        if (
            inline instanceof FeatureRunParagraphItem &&
            inline.value instanceof CommentReference
        ) {
            used.add(inline.value.commentId);
        }
    }
}
function isModeledElevatableComment(catalog: CommentsCollection, commentId: number): boolean {
    const entry: CommentEntry = catalog.entryFor(commentId);
    return entry !== undefined && entry.preservedXml === undefined;
}
function isElevatableCommentReferenceItem(
    item: ParagraphItem,
    catalog: CommentsCollection,
    elevatedIds: ReadonlySet<number>
): item is FeatureRunParagraphItem & { value: CommentReference } {
    return (
        item instanceof FeatureRunParagraphItem &&
        item.value instanceof CommentReference &&
        isModeledElevatableComment(catalog, item.value.commentId) &&
        !elevatedIds.has(item.value.commentId)
    );
}
/**
 * Elevate modeled main-story `w:commentReference` featureRun items to live
 * {@link Comment} featureInlines. Parse already flattens each `w:r` child into
 * sibling paragraph items sharing a {@link WireRunGroup}, so residual siblings
 * stay in place without cloning runs.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {CommentsCollection} catalog - The catalog.
 * @param {Set<number>} elevatedIds - The elevated ids.
 * @returns {boolean} The result.
 */
function elevateCommentReferencesInParagraph(
    WordDocument: WordDocument,
    paragraph: Paragraph,
    catalog: CommentsCollection,
    elevatedIds: Set<number>
): boolean {
    const nextItems: ParagraphItem[] = [];
    let changed: boolean = false;
    // Use storage wrappers (snapshot), not projected public leaves — projected
    // Picture/Shape values are not ParagraphItems and have no attach().
    const stored: ParagraphItem[] = paragraph.snapshot().items;
    for (const item of stored) {
        if (!isElevatableCommentReferenceItem(item, catalog, elevatedIds)) {
            nextItems.push(item);
            continue;
        }
        const commentId: number = item.value.commentId;
        const comment: Comment = catalog.commentInstanceFor(WordDocument, commentId);
        comment.captureReferenceRunFormatting(item.wireGroup);
        elevatedIds.add(commentId);
        changed = true;
        nextItems.push(new FeatureInlineParagraphItem(COMMENTS, comment));
    }
    if (!changed) {
        return false;
    }
    paragraph.hydrate({
        ...paragraph.snapshot(),
        items: nextItems
    });
    return true;
}
/**
 * Elevate modeled comment references across the main story.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function elevateCommentReferencesInDocument(WordDocument: WordDocument): void {
    const catalog: CommentsCollection = commentsFor(WordDocument);
    catalog.elevateMainStoryReferences(WordDocument);
}
/**
 * Type guard: paragraph feature-inline value is an elevated {@link Comment}.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isCommentInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: Comment } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === COMMENTS &&
        inline.value instanceof Comment
    );
}
/**
 * Comments part linked from the Main WordDocument.
 *
 * @private
 */
export class CommentsCollection implements FeatureMultiPackagePart {
    private state: CommentsPartState | undefined;
    private readonly extensionParts: CommentExtensionParts;
    /** Interned live Comment views keyed by comment id (per collection / WordDocument). */
    private readonly commentViews: Map<number, Comment> = new Map<number, Comment>();
    /**
     *  @private
     *
     * @param {CommentsPartState | undefined} state - The state.
     * @param {CommentExtensionParts} extensionParts - The extension parts.
     */
    constructor(state: CommentsPartState | undefined, extensionParts: CommentExtensionParts) {
        this.state = state;
        this.extensionParts = extensionParts;
    }
    /**
     * MS-DOCX comment extension metadata discovered from Main WordDocument relationships.
     *
     * @returns {CommentExtensionParts} The result.
     * @private
     */
    extensions(): CommentExtensionParts {
        return this.extensionParts;
    }
    /**
     * Main-story `commentReference` → elevated {@link Comment} (D14).
     *
     * Invoked from {@link WordDocument.fromPackage} via duck-typed `afterMainDocumentLoad`
     * so core/document does not value-import this module (avoids Paragraph TDZ cycles).
     *
     * @param {WordDocument} WordDocument - The word document.
     * @returns {void} Nothing is returned.
     * @private
     */
    elevateMainStoryReferences(WordDocument: WordDocument): void {
        const elevatedIds: Set<number> = new Set<number>();
        for (const paragraph of WordDocument.listParagraphs()) {
            elevateCommentReferencesInParagraph(WordDocument, paragraph, this, elevatedIds);
        }
    }
    /**
     * Post-load hook for {@link WordDocument.fromPackage} (duck-typed on feature parts).
     *
     * @param {WordDocument} WordDocument - The word document.
     * @returns {void} Nothing is returned.
     * @private
     */
    afterMainDocumentLoad(WordDocument: WordDocument): void {
        this.elevateMainStoryReferences(WordDocument);
    }
    /**
     * Interned live {@link Comment} for a modeled comment id.
     *
     * @param {WordDocument} WordDocument - The word document.
     * @param {number} commentId - The comment id.
     * @returns {Comment} The result.
     * @private
     */
    commentInstanceFor(WordDocument: WordDocument, commentId: number): Comment {
        const existing: Comment = this.commentViews.get(commentId);
        if (existing !== undefined) {
            return existing;
        }
        const created: Comment = new Comment(WordDocument, commentId);
        this.commentViews.set(commentId, created);
        return created;
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    isDirty(): boolean {
        return (
            (this.state == null ? undefined : this.state.dirty) === true ||
            (this.state == null ? undefined : this.state.pendingRelationship) !== undefined
        );
    }
    /**
     *  @private
     *
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        const part: CommentsPartState = this.state;
        if (part === undefined || (!part.dirty && part.pendingRelationship === undefined)) {
            return pkg;
        }
        const data: Uint8Array = serializeCommentsPart(part);
        const rel: OpcRelationship =
            part.pendingRelationship != null
                ? part.pendingRelationship
                : relationshipsForPart(pkg, mainPartName).items.find((item: OpcRelationship) => item.id === part.relationshipId);
        const next: OpcPackage = replaceOrAddPackagePart(pkg, mainPartName, part.partName, COMMENTS_CONTENT_TYPE, data, rel);
        part.dirty = false;
        part.pendingRelationship = undefined;
        return next;
    }
    /**
     *  @private
     *
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {CommentsPartState} The result.
     */
    ensurePart(usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): CommentsPartState {
        if (this.state !== undefined) {
            return this.state;
        }
        const partNameValue: PartName = allocatePartName(usedPartNames);
        const relId: RelationshipId = allocateRelationshipId(usedRelIds);
        const created: CommentsPartState = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType: COMMENTS_RELATIONSHIP_TYPE,
            rootExtra: {
                attributes: [],
                namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML }]
            },
            entries: [],
            dirty: true,
            pendingRelationship: {
                id: relId,
                type: COMMENTS_RELATIONSHIP_TYPE,
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.state = created;
        return created;
    }
    /**
     * Allocate a new modeled comment entry (unique id) and mark the part dirty.
     *
     * @param {WordDocument} WordDocument - Owning WordDocument (id allocation scans main-story markers).
     * @param {string} author - `w:author` (may be empty string).
     * @param {string} commentText - Initial body text (first paragraph / first run).
     * @param {string} date - Optional `w:date` (ST_DateTime string); empty/omitted → attribute absent.
     * @param {string} initials - Optional `w:initials`; empty/omitted → attribute absent.
     * @returns {number} The result.
     * @private
     */
    addEntry(WordDocument: WordDocument, author: string, commentText: string, date?: string, initials?: string): number {
        const part: CommentsPartState = this.state;
        if (part === undefined) {
            throw new DocxError('content/unknown-comment', 'Comments part is not loaded');
        }
        const commentId: number = allocateCommentId(part.entries, WordDocument);
        part.entries = [
            ...part.entries,
            {
                commentId,
                author,
                initials: optionalNonEmptyAttribute(initials),
                date: optionalNonEmptyAttribute(date),
                blocks: blocksWithSimpleText(commentText),
                preservedXml: undefined,
                done: undefined,
                lastParaId: undefined,
                parentParaId: undefined
            }
        ];
        part.dirty = true;
        return commentId;
    }
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     * @returns {CommentEntry | undefined} The result.
     */
    entryFor(commentId: number): CommentEntry | undefined {
        return (this.state == null ? undefined : this.state.entries).find((entry: CommentEntry) => entry.commentId === commentId);
    }
    /**
     * Resolve parent comment via reverse scan on prior Comments part entries.
     *
     * @param {WordDocument} WordDocument - The word document.
     * @param {number} commentId - The comment id.
     * @returns {Comment | undefined} The result.
     * @private
     */
    ancestorFor(WordDocument: WordDocument, commentId: number): Comment | undefined {
        const part: CommentsPartState = this.state;
        if (part === undefined) {
            return undefined;
        }
        const index: number = part.entries.findIndex((entry: CommentEntry) => entry.commentId === commentId);
        if (index < 0) {
            return undefined;
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const parentParaId: string = part.entries[index] == null ? undefined : part.entries[index].parentParaId;
        if (parentParaId === undefined || parentParaId.length === 0) {
            return undefined;
        }
        for (let prior: number = index - 1; prior >= 0; prior -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const candidate: CommentEntry = part.entries[prior];
            if (candidate === undefined || candidate.preservedXml !== undefined) {
                continue;
            }
            if (candidate.lastParaId === parentParaId) {
                return this.commentInstanceFor(WordDocument, candidate.commentId);
            }
        }
        return undefined;
    }
    /**
     * Modeled comment ids in Comments part order (opaque preserved entries omitted).
     *
     * @returns {ReadonlyArray<number>} The result.
     * @private
     */
    commentIds(): ReadonlyArray<number> {
        if (this.state === undefined) {
            return [];
        }
        const ids: number[] = [];
        for (const entry of this.state.entries) {
            if (entry.preservedXml !== undefined) {
                continue;
            }
            ids.push(entry.commentId);
        }
        return ids;
    }
    /**
     * Live {@link Comment} views for every modeled Comments part entry, in part order.
     *
     * Each id is interned: repeated collection / lookup APIs return the same instance.
     *
     * @param {WordDocument} WordDocument - The word document.
     * @returns {ReadonlyArray<Comment>} The result.
     * @private
     */
    comments(WordDocument: WordDocument): ReadonlyArray<Comment> {
        return this.commentIds().map((commentId: number) => this.commentInstanceFor(WordDocument, commentId));
    }
    /**
     * Body paragraphs of a modeled comment, when present.
     *
     * @param {number} commentId - The comment id.
     * @returns {ReadonlyArray<Paragraph>} The result.
     * @private
     */
    paragraphsFor(commentId: number): ReadonlyArray<Paragraph> {
        const entry: CommentEntry = this.entryFor(commentId);
        if (entry === undefined || entry.preservedXml !== undefined) {
            return [];
        }
        const paragraphs: Paragraph[] = [];
        for (const block of entry.blocks) {
            if (block.type === 'paragraph') {
                paragraphs.push(block.paragraph);
            }
        }
        return paragraphs;
    }
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     * @returns {string | undefined} The result.
     */
    textFor(commentId: number): string | undefined {
        const entry: CommentEntry = this.entryFor(commentId);
        if (entry === undefined || entry.preservedXml !== undefined) {
            return undefined;
        }
        return firstParagraphText(entry.blocks);
    }
    /**
     *  @private
     *
     * @param {number} commentId - The comment id.
     * @returns {void} Nothing is returned.
     */
    removeEntry(commentId: number): void {
        const part: CommentsPartState = this.state;
        if (part === undefined) {
            throw new DocxError('content/unknown-comment', 'Comments part is not loaded');
        }
        const next: CommentEntry[] = part.entries.filter((entry: CommentEntry) => entry.commentId !== commentId);
        if (next.length === part.entries.length) {
            throw new DocxError('content/unknown-comment', `Comment id ${String(commentId)} is not in this WordDocument`);
        }
        part.entries = next;
        this.commentViews.delete(commentId);
        part.dirty = true;
    }
}
/**
 * Read `w14:paraId` (Word 2010) from paragraph OpenXml attributes.
 * follows the standard behaviour.
 *
 * @param {ReadonlyArray<OpenXmlAttribute>} attributes - The attributes.
 * @returns {string | undefined} The result.
 */
function paragraphParaIdFromAttributes(attributes: ReadonlyArray<OpenXmlAttribute>): string | undefined {
    const found: OpenXmlAttribute = attributes.find((attribute: OpenXmlAttribute) => attribute.localName === 'paraId' &&
        (attribute.namespaceUri === WORDML_2010_NAMESPACE ||
            attribute.namespaceUri === '' ||
            attribute.prefix === 'w14'));
    const value: string = found == null ? undefined : found.value;
    return value !== undefined && value.length > 0 ? value : undefined;
}
function lastParagraphParaId(blocks: ReadonlyArray<BlockContent>): string | undefined {
    for (let index: number = blocks.length - 1; index >= 0; index -= 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const block: BlockContent = blocks[index];
        // TS 3.3 does not narrow through `(x == null ? undefined : x.type)`.
        if (block === undefined || block.type !== 'paragraph') {
            continue;
        }
        return paragraphParaIdFromAttributes(block.paragraph.toOpenXml().attributes);
    }
    return undefined;
}
/**
 * Join Comments part entries to `commentsExtended` rows by last body paragraph paraId
 *
 * Copies `paraIdParent` and `done` onto the same catalog entry used by interned
 * {@link Comment} views. Read default for absent `@done` after join is `false`
 * (`[MS-DOCX]` §2.5.3.1 default 0).
 *
 * @param {CommentEntry[]} entries - The entries.
 * @param {ReadonlyArray<CommentExEntry>} extendedEntries - The extended entries.
 * @returns {void} Nothing is returned.
 */
function applyCommentExRelationships(entries: CommentEntry[], extendedEntries: ReadonlyArray<CommentExEntry>): void {
    if (extendedEntries.length === 0) {
        return;
    }
    const byParaId: Map<string, CommentExEntry> = new Map<string, CommentExEntry>();
    for (const extended of extendedEntries) {
        byParaId.set(extended.paraId, extended);
    }
    for (const entry of entries) {
        if (entry.preservedXml !== undefined || entry.lastParaId === undefined) {
            continue;
        }
        const extended: CommentExEntry = byParaId.get(entry.lastParaId);
        if (extended === undefined) {
            continue;
        }
        // Parse keeps raw absent as undefined on CommentExEntry; read API defaults to false.
        entry.done = extended.done === undefined ? false : extended.done;
        entry.parentParaId = extended.paraIdParent;
    }
}
function loadCatalog(pkg: OpcPackage, mainPartName: PartName): CommentsCollection {
    const extensionParts: CommentExtensionParts = new CommentExtensionParts(loadCommentExtensionMetadata(pkg, mainPartName));
    for (const rel of relationshipsForPart(pkg, mainPartName).items) {
        if (!kindForRelationshipType(rel.type)) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, mainPartName);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            continue;
        }
        const parsed: CommentsPartState = parseCommentsPart(part, rel);
        if (parsed !== undefined) {
            applyCommentExRelationships(parsed.entries, extensionParts.extendedEntries());
            return new CommentsCollection(parsed, extensionParts);
        }
    }
    return new CommentsCollection(undefined, extensionParts);
}
function usedRelationshipIds(WordDocument: WordDocument): Set<string> {
    const main: PartName = partName('/word/document.xml');
    const used: Set<string> = new Set<string>();
    for (const rel of relationshipsForPart(WordDocument.opcPackage(), main).items) {
        used.add(rel.id);
    }
    return used;
}
function usedPartNameKeys(WordDocument: WordDocument): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of WordDocument.opcPackage().parts) {
        used.add(partNameKey(part.name));
    }
    return used;
}
function anchorRunsForReference(
    content: ReadonlyArray<ParagraphItem>,
    referenceIndex: number,
    commentId: number
): ReadonlyArray<TextRange> {
    let startIndex: number = -1;
    for (let index: number = referenceIndex - 1; index >= 0; index -= 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const inline: ParagraphItem = content[index];
        // TS 3.3 does not narrow ParagraphItem through `(x == null ? undefined : x.type)`.
        if (
            inline === undefined ||
            !(inline instanceof FeatureInlineParagraphItem) ||
            !(inline.value instanceof CommentRangeEnd)
        ) {
            continue;
        }
        if (inline.value.commentId !== commentId) {
            break;
        }
        for (let scan: number = index - 1; scan >= 0; scan -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const candidate: ParagraphItem = content[scan];
            if (
                candidate === undefined ||
                !(candidate instanceof FeatureInlineParagraphItem) ||
                !(candidate.value instanceof CommentRangeStart) ||
                candidate.value.commentId !== commentId
            ) {
                continue;
            }
            startIndex = scan;
            break;
        }
        break;
    }
    if (startIndex < 0) {
        return [];
    }
    const runs: TextRange[] = [];
    for (let index: number = startIndex + 1; index < referenceIndex; index += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const inline: ParagraphItem = content[index];
        if (inline === undefined || !(inline instanceof TextRange)) {
            continue;
        }
        runs.push(inline);
    }
    return runs;
}
function findAnchorsInParagraph(paragraph: Paragraph, catalog: CommentsCollection): CommentAnchor[] {
    let ts337: any; let ts338: any;
    const found: CommentAnchor[] = [];
    const content: ParagraphItem[] = paragraph.items.toArray();
    for (const [index, item] of content.entries()) {
        // TS 3.3 does not narrow ParagraphItem through `(x == null ? undefined : x.type)`.
        if (item !== undefined &&
            item instanceof FeatureInlineParagraphItem &&
            item.value instanceof Comment) {
            const commentId: number = item.value.commentId;
            const entry: CommentEntry = catalog.entryFor(commentId);
            const reference: CommentReference = new CommentReference(commentId);
            found.push(
                new CommentAnchor(
                    commentId,
                    ((ts337 = entry == null ? undefined : entry.author), ts337 != null ? ts337 : ''),
                    entry == null ? undefined : entry.date,
                    anchorRunsForReference(content, index, commentId),
                    reference
                )
            );
            continue;
        }
        if (
            item === undefined ||
            !(item instanceof FeatureRunParagraphItem) ||
            !(item.value instanceof CommentReference)
        ) {
            continue;
        }
        const reference: CommentReference = item.value;
        const entry: CommentEntry = catalog.entryFor(reference.commentId);
        found.push(
            new CommentAnchor(
                reference.commentId,
                ((ts338 = entry == null ? undefined : entry.author), ts338 != null ? ts338 : ''),
                entry == null ? undefined : entry.date,
                anchorRunsForReference(content, index, reference.commentId),
                reference
            )
        );
    }
    return found;
}
function removeRangeMarkers(paragraph: Paragraph, commentId: number): void {
    const toRemove: FeatureInline[] = [];
    for (const inline of paragraph.items) {
        if (!(inline instanceof FeatureInlineParagraphItem)) {
            continue;
        }
        if (
            (inline.value instanceof CommentRangeStart || inline.value instanceof CommentRangeEnd) &&
            inline.value.commentId === commentId
        ) {
            toRemove.push(inline.value);
        }
    }
    for (const marker of toRemove) {
        paragraph.removeFeatureInline(marker);
    }
}
function removeReferenceRun(paragraph: Paragraph, reference: CommentReference): void {
    for (const inline of paragraph.items) {
        if (inline instanceof FeatureInlineParagraphItem && inline.value instanceof Comment) {
            if (inline.value.commentId === reference.commentId) {
                paragraph.removeFeatureInline(inline.value);
                return;
            }
            continue;
        }
        if (
            inline instanceof FeatureRunParagraphItem &&
            inline.featureId === COMMENTS &&
            inline.value instanceof CommentReference &&
            inline.value.commentId === reference.commentId
        ) {
            paragraph.removeFeatureRunItem(inline.value);
            return;
        }
    }
    throw new DocxError('content/unknown-comment', 'Comment reference is not in this paragraph');
}
let registered: boolean = false;
/**
 *   Test hook
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetCommentsFeatureForTests(): void {
    registered = false;
}
/**
 *   Register comment inline, run-leaf, and comments-part handlers. Idempotent.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerCommentsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: COMMENTS });
    registerFeatureMultiPartHandler({
        featureId: COMMENTS,
        relationshipTypes: COMMENTS_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): CommentsCollection {
            return loadCatalog(pkg, ctx.mainPartName);
        }
    });
    registerFeatureInlineHandler({
        featureId: COMMENTS,
        wmlLocalName: 'commentRangeStart',
        tryParse(element: OpenXmlElement): CommentRangeStart | undefined {
            if (!isWml(element, 'commentRangeStart')) {
                return undefined;
            }
            const commentId: number = parseCommentId(wmlAttribute(element, 'id'));
            if (commentId === undefined) {
                return undefined;
            }
            return new CommentRangeStart(commentId);
        }
    });
    registerFeatureInlineHandler({
        featureId: COMMENTS,
        wmlLocalName: 'commentRangeEnd',
        tryParse(element: OpenXmlElement): CommentRangeEnd | undefined {
            if (!isWml(element, 'commentRangeEnd')) {
                return undefined;
            }
            const commentId: number = parseCommentId(wmlAttribute(element, 'id'));
            if (commentId === undefined) {
                return undefined;
            }
            return new CommentRangeEnd(commentId);
        }
    });
    registerFeatureRunLeafHandler({
        featureId: COMMENTS,
        wmlLocalName: 'commentReference',
        tryParse(element: OpenXmlElement): CommentReference | undefined {
            if (!isWml(element, 'commentReference')) {
                return undefined;
            }
            const commentId: number = parseCommentId(wmlAttribute(element, 'id'));
            if (commentId === undefined) {
                return undefined;
            }
            return new CommentReference(commentId);
        }
    });
}
/**
 * Public comments collection for a {@link WordDocument}.
 *
 * Stable per-document identity. Members are the same interned {@link Comment}
 * instances returned from {@link Paragraph.appendComment} and the internal
 * comments catalog.
 *
 * Supports `count`, numeric index access, and iteration.
 *
 * @private
 */
export class CommentCollection implements Iterable<Comment> {
    readonly [index: number]: Comment;

    private readonly document: WordDocument;
    private cachedLength: number = 0;
    /**
     * @param {WordDocument} document - The document.
     * @private
     */
    constructor(document: WordDocument) {
        this.document = document;
    }
    /**
     * Number of modeled comment bodies in the Comments part.
     *
     * @public
     */
    get count(): number {
        this.rebuildIndexProperties();
        return this.cachedLength;
    }
    /**
     * Comment at zero-based `index`, or `undefined` when out of range.
     *
     * @param {number} index - The index.
     * @returns {Comment | undefined} The result.
     * @public
     */
    itemAt(index: number): Comment | undefined {
        const comments: ReadonlyArray<Comment> = commentsFor(this.document).comments(this.document);
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return comments[index];
    }
    [Symbol.iterator](): Iterator<Comment> {
        const items: Comment[] = commentsFor(this.document).comments(this.document).slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Comment> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Comment };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Comment = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }
    /**
     * Refresh numeric index properties from the catalog (part order).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    rebuildIndexProperties(): void {
        const items: ReadonlyArray<Comment> = commentsFor(this.document).comments(this.document);
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                Object.defineProperty(this, key, {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    value: items[i],
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            }
            else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }
}
const commentCollections: WeakMap<WordDocument, CommentCollection> = new WeakMap<WordDocument, CommentCollection>();
/**
 * Stable public {@link CommentCollection} for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {CommentCollection} The result.
 * @private
 */
export function commentCollectionFor(document: WordDocument): CommentCollection {
    registerCommentsFeature();
    const cached: CommentCollection = commentCollections.get(document);
    if (cached !== undefined) {
        cached.rebuildIndexProperties();
        return cached;
    }
    const created: CommentCollection = new CommentCollection(document);
    created.rebuildIndexProperties();
    commentCollections.set(document, created);
    return created;
}
Object.defineProperty(WordDocument.prototype, 'comments', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): CommentCollection {
        return commentCollectionFor(this);
    }
});
/**
 * Comments collection for a WordDocument.
 *
 * On a loaded package this is the collection built from the Main WordDocument comments
 * relationship when the feature was registered before load. On
 * {@link WordDocument.create} (or a package with no comments part) attaches an empty
 * collection on first use when the feature is registered.
 *
 * The returned {@link CommentsCollection} surface is internal; public callers use
 * {@link commentsInDocument}, {@link commentFor}, and related helpers.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {CommentsCollection} The result.
 * @throws DocxError `feature/not-registered` when the module was not registered
 *   or feature state was replaced with an unexpected part type.
 *
 * @private
 */
export function commentsFor(WordDocument: WordDocument): CommentsCollection {
    const part: FeaturePartState = WordDocument.featurePart(COMMENTS);
    if (part instanceof CommentsCollection) {
        return part;
    }
    if (part !== undefined) {
        throw new DocxError('feature/not-registered', 'Comments feature state was replaced with an unexpected part type');
    }
    if (!isFeatureRegistered(COMMENTS)) {
        throw new DocxError('feature/not-registered', 'Comments feature is not registered; call registerCommentsFeature() before use');
    }
    const created: CommentsCollection = new CommentsCollection(undefined, new CommentExtensionParts({
        extended: undefined,
        people: undefined,
        ids: undefined,
        extensible: undefined
    }));
    WordDocument.setFeaturePart(COMMENTS, created);
    return created;
}
/**
 * MS-DOCX comment extension metadata for a loaded WordDocument.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {CommentExtensionParts} The result.
 * @private
 */
export function commentExtensionsFor(WordDocument: WordDocument): CommentExtensionParts {
    return commentsFor(WordDocument).extensions();
}
/**
 * Live {@link Comment} body for a Comments part id.
 *
 * Returns the catalog-interned instance for `(WordDocument, commentId)` so repeated
 * lookups share object identity (`===`).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {number} commentId - The comment id.
 * @returns {Comment} The result.
 * @private
 */
export function commentFor(WordDocument: WordDocument, commentId: number): Comment {
    return commentsFor(WordDocument).commentInstanceFor(WordDocument, commentId);
}
/**
 * Live {@link Comment} body linked from a paragraph anchor.
 *
 * Same interned instance as {@link commentFor} for `anchor.commentId`.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {CommentAnchor} anchor - The anchor.
 * @returns {Comment} The result.
 * @private
 */
export function commentForAnchor(WordDocument: WordDocument, anchor: CommentAnchor): Comment {
    return commentsFor(WordDocument).commentInstanceFor(WordDocument, anchor.commentId);
}
/**
 * Modeled comment bodies in the Comments part, in part order.
 *
 * Opaque preserved entries are omitted. Prefer this for a full catalog list;
 * {@link commentsInParagraph} lists anchors in the main story.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {ReadonlyArray<Comment>} The result.
 * @private
 */
export function commentsInDocument(WordDocument: WordDocument): ReadonlyArray<Comment> {
    return commentsFor(WordDocument).comments(WordDocument);
}
/**
 * Comment anchors in a paragraph, in WordDocument order.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<CommentAnchor>} The result.
 * @private
 */
export function commentsInParagraph(WordDocument: WordDocument, paragraph: Paragraph): ReadonlyArray<CommentAnchor> {
    return findAnchorsInParagraph(paragraph, commentsFor(WordDocument));
}
/**
 * Visible text of a comment body, when loaded (first non-empty run of the first paragraph).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {CommentAnchor} anchor - The anchor.
 * @returns {string | undefined} The result.
 * @private
 */
export function commentBody(WordDocument: WordDocument, anchor: CommentAnchor): string | undefined {
    return commentsFor(WordDocument).textFor(anchor.commentId);
}
/**
 * Modeled body paragraphs of a comment linked from an anchor.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {CommentAnchor} anchor - The anchor.
 * @returns {ReadonlyArray<Paragraph>} The result.
 * @private
 */
export function commentParagraphs(WordDocument: WordDocument, anchor: CommentAnchor): ReadonlyArray<Paragraph> {
    return commentsFor(WordDocument).paragraphsFor(anchor.commentId);
}
/**
 * Metadata for {@link appendComment} when body text is passed separately.
 * Same fields as {@link AppendCommentOptions} except `text` (TS 3.3 has no `Omit`).
 *
 *
 * @private
 */
export interface AppendCommentMetadata {
    /**
     * `w:author`. When omitted, uses an empty string (WordDocument-empty default).
     */
    readonly author?: string;
    /** `w:initials` when provided (empty string omitted on serialize). */
    readonly initials?: string;
    /**
     * `w:date` (ST_DateTime). `Date` values are written as ISO UTC (`Date.toISOString()`).
     * When omitted on append, the library writes ISO UTC now for scratch packages.
     */
    readonly date?: Date | string;
    /**
     * Inclusive start index into `paragraph.items` for `CommentRangeStart`
     * insertion **before** that item. Optional; see {@link appendComment}.
     */
    readonly rangeStart?: number;
    /**
     * Exclusive end index into `paragraph.items` for `CommentRangeEnd`
     * insertion **before** that item (or after the last included item). Optional.
     * When both `rangeStart` and `rangeEnd` are omitted, a collapsed range is
     * placed at the end of current content before the elevated `Comment` (D15).
     */
    readonly rangeEnd?: number;
}
/**
 * Options for {@link Paragraph.appendComment} / {@link appendComment}.
 *
 *
 * @private
 */
export interface AppendCommentOptions extends AppendCommentMetadata {
    /** Initial comment body text (first body paragraph / primary text). */
    readonly text: string;
}
function normalizeCommentDateAttribute(date: Date | string | undefined, defaultNow: boolean): string | undefined {
    if (date === undefined) {
        return defaultNow ? new Date().toISOString() : undefined;
    }
    if (typeof date === 'string') {
        return optionalNonEmptyAttribute(date);
    }
    return date.toISOString();
}
function assertCommentRangeIndices(paragraph: Paragraph, rangeStart: number, rangeEnd: number): void {
    const length: number = paragraph.items.length;
    if (!Number.isInteger(rangeStart) ||
        !Number.isInteger(rangeEnd) ||
        rangeStart < 0 ||
        rangeEnd < rangeStart ||
        rangeEnd > length) {
        throw new RangeError(`Comment range indices out of range: start=${String(rangeStart)} end=${String(rangeEnd)} length=${String(length)}`);
    }
}
/**
 * Resolve optional range indices for append authoring (D15).
 *
 * Both omitted → collapsed at current content end. One omitted → collapsed at
 * the provided index. Validated before any mutation.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {number | undefined} rangeStart - The range start.
 * @param {number | undefined} rangeEnd - The range end.
 * @returns {Object} The result.
 */
function resolveAppendCommentRange(paragraph: Paragraph, rangeStart: number | undefined, rangeEnd: number | undefined): {
    readonly start: number;
    readonly end: number;
} {
    const length: number = paragraph.items.length;
    let start: number;
    let end: number;
    if (rangeStart === undefined && rangeEnd === undefined) {
        start = length;
        end = length;
    }
    else if (rangeStart === undefined) {
        // One-sided: collapse at the provided end index.
        start = rangeEnd != null ? rangeEnd : length;
        end = start;
    }
    else if (rangeEnd === undefined) {
        start = rangeStart;
        end = rangeStart;
    }
    else {
        start = rangeStart;
        end = rangeEnd;
    }
    assertCommentRangeIndices(paragraph, start, end);
    return { start, end };
}
/**
 * Insert range markers and one elevated {@link Comment} after the end marker.
 *
 * Indices are pre-insert content positions (editable-range style): start at
 * `rangeStart`, end at `rangeEnd + 1` after the start push, Comment at
 * `rangeEnd + 2`.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {number} commentId - The comment id.
 * @param {Comment} comment - The comment.
 * @param {number} rangeStart - The range start.
 * @param {number} rangeEnd - The range end.
 * @returns {void} Nothing is returned.
 */
function insertCommentMarkersAndReference(
    paragraph: Paragraph,
    commentId: number,
    comment: Comment,
    rangeStart: number,
    rangeEnd: number
): void {
    paragraph.insertFeatureInlineAt(rangeStart, COMMENTS, new CommentRangeStart(commentId));
    paragraph.insertFeatureInlineAt(rangeEnd + 1, COMMENTS, new CommentRangeEnd(commentId));
    paragraph.insertFeatureInlineAt(rangeEnd + 2, COMMENTS, comment);
}
/**
 * Create a new comments-part entry, intern {@link Comment}, ensure part/rel.
 *
 * Always allocates a **new** unique id (never a second reference for an existing id).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {string} author - The author.
 * @param {string} commentText - The comment text.
 * @param {Object} options - The options.
 * @returns {Comment} The result.
 */
function createNewCommentEntry(WordDocument: WordDocument, author: string, commentText: string, options: {
    readonly date?: Date | string;
    readonly initials?: string;
    readonly defaultDateNow: boolean;
}): Comment {
    const catalog: CommentsCollection = commentsFor(WordDocument);
    catalog.ensurePart(usedRelationshipIds(WordDocument), usedPartNameKeys(WordDocument));
    const date: string = normalizeCommentDateAttribute(options.date, options.defaultDateNow);
    const commentId: number = catalog.addEntry(WordDocument, author, commentText, date, options.initials);
    const comment: Comment = catalog.commentInstanceFor(WordDocument, commentId);
    comment.applyDefaultReferenceRunStyle();
    return comment;
}
/**
 * Append a new comment to a paragraph (range markers + elevated {@link Comment}).
 *
 * Primary shape: `appendComment(paragraph, text, options?)`. Options-only overload
 * accepts {@link AppendCommentOptions} with required `text`.
 *
 * Behavior (locked D7/D8/D15/D16):
 * - Comments feature must be registered (`feature/not-registered` otherwise).
 * - Paragraph must be attached (`DetachedObjectError` via {@link Paragraph.owningDocument}).
 * - Range indices validated **before** mutation (`RangeError` when invalid/reversed).
 * - New unique comment id; one catalog entry; one elevated `Comment` after end marker.
 * - When both range indices omitted: collapsed markers at append point (still emitted).
 * - Public DOM has no empty sole-purpose `CommentReference` Run.
 *
 * @param {Paragraph} paragraph - Host paragraph in the main story.
 * @param {string | AppendCommentOptions} textOrOptions - Body text, or full options object.
 * @param {AppendCommentMetadata} options - Optional metadata / range when the first argument is text.
 * @returns {Comment} Interned {@link Comment} (`===` content slot and {@link commentFor}).
 *
 * @private
 */
export function appendComment(
    paragraph: Paragraph,
    textOrOptions: string | AppendCommentOptions,
    options?: AppendCommentMetadata
): Comment {
    const resolved: AppendCommentOptions = typeof textOrOptions === 'string'
        ? { text: textOrOptions, ...options }
        : textOrOptions;
    // Ownership check before any catalog mutation.
    const WordDocument: WordDocument = paragraph.owningDocument();
    const range: { readonly start: number; readonly end: number } = resolveAppendCommentRange(
        paragraph,
        resolved.rangeStart,
        resolved.rangeEnd
    );
    const author: string = resolved.author != null ? resolved.author : '';
    const comment: Comment = createNewCommentEntry(WordDocument, author, resolved.text, {
        ...(resolved.date !== undefined ? { date: resolved.date } : {}),
        ...(resolved.initials !== undefined ? { initials: resolved.initials } : {}),
        defaultDateNow: true
    });
    insertCommentMarkersAndReference(paragraph, comment.commentId, comment, range.start, range.end);
    return comment;
}
/**
 * Insert a comment with optional anchor text at the end of a paragraph.
 *
 * Places an elevated {@link Comment} feature-inline (not a public empty
 * CommentReference Run). When `anchorText` is non-empty, range markers wrap the
 * new anchor run before the Comment. When empty, only the elevated Comment is
 * appended (legacy insert path; prefer {@link appendComment} for D15 markers).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} author - The author.
 * @param {string} commentText - The comment text.
 * @param {string} anchorText - The anchor text.
 * @returns {CommentAnchor} The result.
 * @private
 */
export function insertComment(WordDocument: WordDocument, paragraph: Paragraph, author: string, commentText: string, anchorText: string = ''): CommentAnchor {
    let ts339: any;
    const comment: Comment = createNewCommentEntry(WordDocument, author, commentText, {
        defaultDateNow: false
    });
    const commentId: number = comment.commentId;
    const reference: CommentReference = new CommentReference(commentId);
    const anchorRuns: TextRange[] = [];
    if (anchorText.length > 0) {
        paragraph.appendFeatureInline(COMMENTS, new CommentRangeStart(commentId));
        const anchorRun: TextRange = paragraph.appendText(anchorText);
        anchorRuns.push(anchorRun);
        paragraph.appendFeatureInline(COMMENTS, new CommentRangeEnd(commentId));
    }
    // Elevated Comment feature-inline at the former sole-purpose reference run (D1/D5).
    paragraph.appendFeatureInline(COMMENTS, comment);
    const entry: CommentEntry = commentsFor(WordDocument).entryFor(commentId);
    return new CommentAnchor(
        commentId,
        ((ts339 = entry == null ? undefined : entry.author), ts339 != null ? ts339 : author),
        entry == null ? undefined : entry.date,
        anchorRuns,
        reference
    );
}
// Safe once the owning module no longer value-imports this module.
Paragraph.prototype.appendComment = function (
    this: Paragraph,
    textOrOptions: string | AppendCommentOptions,
    options?: AppendCommentMetadata
): Comment {
    return appendComment(this, textOrOptions, options);
};
/**
 * Remove a comment anchor, range markers, and comments part entry.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {CommentAnchor} anchor - The anchor.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeComment(WordDocument: WordDocument, paragraph: Paragraph, anchor: CommentAnchor): void {
    removeRangeMarkers(paragraph, anchor.commentId);
    removeReferenceRun(paragraph, anchor.reference);
    commentsFor(WordDocument).removeEntry(anchor.commentId);
}
/**
 * Whether paragraph inline content is a modeled comment range start from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isCommentRangeStartInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: CommentRangeStart } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === COMMENTS &&
        inline.value instanceof CommentRangeStart
    );
}
/**
 * Whether paragraph inline content is a modeled comment range end from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isCommentRangeEndInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: CommentRangeEnd } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === COMMENTS &&
        inline.value instanceof CommentRangeEnd
    );
}
/**
 * Whether a paragraph item is a residual modeled comment reference featureRun.
 *
 * @param {ParagraphItem} leaf - The leaf.
 * @returns {Object} The result.
 * @private
 */
export function isCommentReferenceLeaf(
    leaf: ParagraphItem
): leaf is FeatureRunParagraphItem & { value: CommentReference } {
    return (
        leaf instanceof FeatureRunParagraphItem &&
        leaf.featureId === COMMENTS &&
        leaf.value instanceof CommentReference
    );
}
// Always-on on the main `@syncfusion/ej2-docx` entry: comment range/reference handlers +
// comments multi-part catalog re-arm after test handler resets via
// WordDocument.create / fromPackage.
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerCommentsFeature();
});
registerCommentsFeature();
