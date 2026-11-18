import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { parseBodyBlocks, serializeBodyBlocks } from '../document/body-blocks';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { BodyItem } from '../document/body-item';
import { bodyItemToBlock, projectBlockToBodyItem } from '../document/body-item-adapters';
import { SubSuperScript } from '../document/character-format';
import { BlockContent, Paragraph, ParagraphOwner } from '../document/paragraph';
import { FeatureRunParagraphItem, ParagraphItem, TextRange } from '../document/text-range';
import { elementChildren, isWml, wmlAttr, wmlElement } from '../document/wml';
import { allocateRelationshipId, OpcRelationship, RelationshipId } from '../../core/opc/relationships';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { partName, partNameKey, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureMultiPartHandler, registerFeatureRunLeafHandler, replaceOrAddPackagePart, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import { Table as TableFeature } from '../tables/index';
import { createTable, TABLES_FEATURE_ID } from '../tables/index';
import { ContentControl, ContentControlType, createBlockContentControl, CONTENT_CONTROLS_FEATURE_ID, BlockContentControl } from '../content-controls/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlAttribute } from '../../core/xml/model';
const NOTES: FeatureId = featureId('notes');
const WML: string = WML_TRANSITIONAL_NAMESPACE;
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
/**
 * @private
 * Transitional footnotes relationship (ECMA-376-4 Â§9.2.6). */
export const FOOTNOTES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes';
/**
 * @private
 * Transitional endnotes relationship (ECMA-376-4 Â§9.2.5). */
export const ENDNOTES_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes';
/**
 * @private
 * Strict footnotes relationship. */
export const STRICT_FOOTNOTES_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/footnotes';
/**
 * @private
 * Strict endnotes relationship. */
export const STRICT_ENDNOTES_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/endnotes';
/**
 * @private
 */
export const FOOTNOTES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml';
/**
 * @private
 */
export const ENDNOTES_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml';
const FOOTNOTES_RELATIONSHIP_TYPES: string[] = [
    FOOTNOTES_RELATIONSHIP_TYPE,
    STRICT_FOOTNOTES_RELATIONSHIP_TYPE
];
const ENDNOTES_RELATIONSHIP_TYPES: string[] = [
    ENDNOTES_RELATIONSHIP_TYPE,
    STRICT_ENDNOTES_RELATIONSHIP_TYPE
];
const ALL_RELATIONSHIP_TYPES: string[] = [...FOOTNOTES_RELATIONSHIP_TYPES, ...ENDNOTES_RELATIONSHIP_TYPES];
type NoteKind = 'footnote' | 'endnote';
/**
 * @private
 */
export type FtnEdnType = 'normal' | 'separator' | 'continuationSeparator' | 'continuationNotice';
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === '' || a.prefix === 'w'))), ts330 == null ? undefined : ts330.value);
}
function parseNoteId(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
function parseFtnEdnType(raw: string | undefined): FtnEdnType | undefined {
    if (raw === 'normal' ||
        raw === 'separator' ||
        raw === 'continuationSeparator' ||
        raw === 'continuationNotice') {
        return raw;
    }
    return undefined;
}
function isSpecialNoteEntry(noteId: number, noteType: FtnEdnType | undefined): boolean {
    return (noteId <= 0 ||
        noteType === 'separator' ||
        noteType === 'continuationSeparator' ||
        noteType === 'continuationNotice');
}
function rootLocalName(kind: NoteKind): 'footnotes' | 'endnotes' {
    return kind === 'footnote' ? 'footnotes' : 'endnotes';
}
function entryLocalName(kind: NoteKind): 'footnote' | 'endnote' {
    return kind === 'footnote' ? 'footnote' : 'endnote';
}
function contentTypeForKind(kind: NoteKind): string {
    return kind === 'footnote' ? FOOTNOTES_CONTENT_TYPE : ENDNOTES_CONTENT_TYPE;
}
function relationshipTypeForKind(kind: NoteKind): string {
    return kind === 'footnote' ? FOOTNOTES_RELATIONSHIP_TYPE : ENDNOTES_RELATIONSHIP_TYPE;
}
function relativeTarget(partNameValue: PartName): string {
    return partNameValue.slice('/word/'.length);
}
function kindForRelationshipType(type: string): NoteKind | undefined {
    if (FOOTNOTES_RELATIONSHIP_TYPES.indexOf(type as (typeof FOOTNOTES_RELATIONSHIP_TYPES)[number]) !== -1) {
        return 'footnote';
    }
    if (ENDNOTES_RELATIONSHIP_TYPES.indexOf(type as (typeof ENDNOTES_RELATIONSHIP_TYPES)[number]) !== -1) {
        return 'endnote';
    }
    return undefined;
}
function firstParagraphText(blocks: ReadonlyArray<BlockContent>): string | undefined {
    for (const content of blocks) {
        if (content.type !== 'paragraph') {
            continue;
        }
        for (const item of content.paragraph.items) {
            if (item instanceof TextRange) {
                return item.text;
            }
        }
    }
    return undefined;
}
const detachedParagraphOwner: ParagraphOwner = {
    assertAttachedParagraph(): void {
        return;
    },
    owningDocument(): WordDocument {
        throw new DetachedObjectError('Note content is not in a WordDocument');
    }
};
/**
 * Paragraph owner scoped to one footnote or endnote catalog entry.
 * Membership is checked against the live entry blocks.
 */
class NotePartOwner implements ParagraphOwner {
    private readonly WordDocument: WordDocument;
    private readonly kind: NoteKind;
    private readonly noteId: number;
    constructor(WordDocument: WordDocument, kind: NoteKind, noteId: number) {
        this.WordDocument = WordDocument;
        this.kind = kind;
        this.noteId = noteId;
    }
    assertAttachedParagraph(target: Paragraph): void {
        const catalog: NotesCatalog = notesFor(this.WordDocument);
        const entry: NoteEntry = catalog.normalEntry(this.kind, this.noteId);
        if (entry === undefined) {
            throw new DetachedObjectError('Note part is no longer loaded');
        }
        const found: boolean = entry.blocks.some((block: BlockContent) => block.type === 'paragraph' && block.paragraph === target);
        if (!found) {
            throw new DetachedObjectError('This paragraph is no longer in its note');
        }
    }
    /**
     * @returns {WordDocument} The result.
     * @private
     */
    owningDocument(): WordDocument {
        return this.WordDocument;
    }
}
function ownerForNote(WordDocument: WordDocument, kind: NoteKind, noteId: number): NotePartOwner {
    return new NotePartOwner(WordDocument, kind, noteId);
}
/**
 * Bind a feature body block (table, content control, â€¦) to the owning WordDocument when
 * the value exposes `bindDocument`. Mirrors Body without exporting that helper
 * from WordDocument.ts.
 *
 * @param {unknown} value - The value.
 * @param {WordDocument} WordDocument - The word document.
 * @returns {void} Nothing is returned.
 */
function bindDocumentToFeatureBlock(value: unknown, WordDocument: WordDocument): void {
    if (typeof value !== 'object' || value === null || !('bindDocument' in value)) {
        return;
    }
    const bindDocument: (doc: WordDocument) => void = (value as {
        bindDocument: (doc: WordDocument) => void;
    }).bindDocument;
    bindDocument.call(value, WordDocument);
}
function releaseFeatureBlockContent(value: unknown): void {
    if (typeof value !== 'object' || value === null || !('releaseContent' in value)) {
        return;
    }
    const releaseContent: () => void = (value as {
        releaseContent?: () => void;
    }).releaseContent;
    // TS 3.3: Function.call typing treats free functions as `this: void`.
    if (typeof releaseContent === 'function') {
        (releaseContent as (this: object) => void).call(value);
    }
}
function attachNoteParagraphs(WordDocument: WordDocument, kind: NoteKind, entry: NoteEntry): void {
    const owner: NotePartOwner = ownerForNote(WordDocument, kind, entry.noteId);
    for (const block of entry.blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.attach(owner);
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, WordDocument);
        }
    }
}
function detachNoteBlocks(blocks: ReadonlyArray<BlockContent>): void {
    for (const block of blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.detach();
        }
        else if (block.type === 'feature') {
            releaseFeatureBlockContent(block.value);
        }
    }
}
function blocksWithSimpleText(text: string, owner: ParagraphOwner = detachedParagraphOwner): BlockContent[] {
    return parseBodyBlocks([
        wmlElement('p', {
            children: [
                wmlElement('r', {
                    children: [wmlElement('t', { children: [{ kind: 'text', value: text }] })]
                })
            ]
        })
    ], owner);
}
function defaultSeparatorEntries(kind: NoteKind): NoteEntry[] {
    const childName: NoteKind = entryLocalName(kind);
    const separatorLeaf: string = kind === 'footnote' ? 'separator' : 'separator';
    const continuationLeaf: string = kind === 'footnote' ? 'continuationSeparator' : 'continuationSeparator';
    return [
        {
            noteId: -1,
            noteType: 'separator',
            blocks: [],
            preservedXml: wmlElement(childName, {
                attributes: [wmlAttr('type', 'separator'), wmlAttr('id', '-1')],
                children: [
                    wmlElement('p', {
                        children: [wmlElement('r', { children: [wmlElement(separatorLeaf)] })]
                    })
                ]
            })
        },
        {
            noteId: 0,
            noteType: 'continuationSeparator',
            blocks: [],
            preservedXml: wmlElement(childName, {
                attributes: [wmlAttr('type', 'continuationSeparator'), wmlAttr('id', '0')],
                children: [
                    wmlElement('p', {
                        children: [wmlElement('r', { children: [wmlElement(continuationLeaf)] })]
                    })
                ]
            })
        }
    ];
}
/**
 * Footnote reference run leaf (`w:footnoteReference`).
 *
 * @private
 */
export class FootnoteReference implements FeatureRunLeaf {
    /**
     * @private
     * Stable id linking this reference to its footnote body. */
    readonly noteId: number;
    /**
     * @param {number} noteId - The note id.
     * @private
     */
    constructor(noteId: number) {
        this.noteId = noteId;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('footnoteReference', { attributes: [wmlAttr('id', String(this.noteId))] });
    }
}
/**
 * Endnote reference run leaf (`w:endnoteReference`).
 *
 * @private
 */
export class EndnoteReference implements FeatureRunLeaf {
    /**
     * @private
     * Stable id linking this reference to its endnote body. */
    readonly noteId: number;
    /**
     * @param {number} noteId - The note id.
     * @private
     */
    constructor(noteId: number) {
        this.noteId = noteId;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return wmlElement('endnoteReference', { attributes: [wmlAttr('id', String(this.noteId))] });
    }
}
/**
 * @private
 */
interface NoteEntry {
    readonly noteId: number;
    readonly noteType: FtnEdnType | undefined;
    blocks: BlockContent[];
    readonly preservedXml: OpenXmlElement | undefined;
}
/**
 * @private
 */
interface NotePartState {
    readonly partName: PartName;
    readonly relationshipId: RelationshipId;
    readonly relationshipType: string;
    readonly kind: NoteKind;
    readonly rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>;
    entries: NoteEntry[];
    dirty: boolean;
    pendingRelationship: OpcRelationship | undefined;
}
function serializeNotePart(state: NotePartState): Uint8Array {
    const childName: NoteKind = entryLocalName(state.kind);
    const children: OpenXmlElement[] = [];
    for (const entry of state.entries) {
        if (entry.preservedXml !== undefined) {
            children.push(entry.preservedXml);
            continue;
        }
        const attributes: OpenXmlAttribute[] = [wmlAttr('id', String(entry.noteId))];
        if (entry.noteType !== undefined && entry.noteType !== 'normal') {
            attributes.push(wmlAttr('type', entry.noteType));
        }
        children.push(wmlElement(childName, {
            attributes,
            children: serializeBodyBlocks(entry.blocks)
        }));
    }
    const root: OpenXmlElement = wmlElement(rootLocalName(state.kind), {
        attributes: state.rootExtra.attributes,
        namespaceDeclarations: state.rootExtra.namespaceDeclarations.length > 0
            ? state.rootExtra.namespaceDeclarations
            : [{ prefix: 'w', namespaceUri: WML }],
        children
    });
    return utf8.encode(serializeXml(root));
}
function parseNotePart(part: PackagePart, relationship: OpcRelationship, kind: NoteKind): NotePartState | undefined {
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    if (!isWml(root, rootLocalName(kind))) {
        return undefined;
    }
    const entries: NoteEntry[] = [];
    const childName: NoteKind = entryLocalName(kind);
    for (const child of elementChildren(root)) {
        if (!isWml(child, childName)) {
            continue;
        }
        const noteId: number = parseNoteId(wmlAttribute(child, 'id'));
        if (noteId === undefined) {
            continue;
        }
        const noteType: FtnEdnType = parseFtnEdnType(wmlAttribute(child, 'type'));
        if (isSpecialNoteEntry(noteId, noteType)) {
            entries.push({ noteId, noteType, blocks: [], preservedXml: child });
            continue;
        }
        entries.push({
            noteId,
            noteType: noteType != null ? noteType : 'normal',
            blocks: parseBodyBlocks(child.children, detachedParagraphOwner),
            preservedXml: undefined
        });
    }
    return {
        partName: part.name,
        relationshipId: relationship.id,
        relationshipType: relationship.type,
        kind,
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
function allocatePartName(kind: NoteKind, used: ReadonlySet<string>): PartName {
    const base: string = kind === 'footnote' ? 'footnotes.xml' : 'endnotes.xml';
    const primary: PartName = partName(`/word/${base}`);
    if (!used.has(partNameKey(primary))) {
        return primary;
    }
    let index: number = 2;
    while (used.has(partNameKey(partName(`/word/${kind}${String(index)}.xml`)))) {
        index += 1;
    }
    return partName(`/word/${kind}${String(index)}.xml`);
}
function allocateNoteId(entries: ReadonlyArray<NoteEntry>): number {
    let max: number = 0;
    for (const entry of entries) {
        if (entry.noteId > max && !isSpecialNoteEntry(entry.noteId, entry.noteType)) {
            max = entry.noteId;
        }
    }
    return max + 1;
}
/**
 * Footnotes and endnotes parts linked from the Main WordDocument.
 *
 * @private
 */
export class NotesCatalog implements FeatureMultiPackagePart {
    private readonly parts: Map<NoteKind, NotePartState>;
    private boundDocument: WordDocument | undefined;
    /**
     * @param {Map<NoteKind, NotePartState>} parts - The parts.
     * @private
     */
    constructor(parts: Map<NoteKind, NotePartState>) {
        this.parts = parts;
        this.boundDocument = undefined;
    }
    /**
     * Bind this catalog to a live WordDocument so paragraph owners can resolve.
     * Re-attaches existing modeled note body blocks to entry-scoped owners.
     *
     * @param {WordDocument} WordDocument - The word document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(WordDocument: WordDocument): void {
        this.boundDocument = WordDocument;
        for (const part of this.parts.values()) {
            for (const entry of part.entries) {
                if (entry.preservedXml !== undefined) {
                    continue;
                }
                if (isSpecialNoteEntry(entry.noteId, entry.noteType)) {
                    continue;
                }
                attachNoteParagraphs(WordDocument, part.kind, entry);
            }
        }
    }
    private requireBoundDocument(): WordDocument {
        if (this.boundDocument === undefined) {
            throw new DocxError('content/unknown-note', 'Notes catalog is not bound to a WordDocument');
        }
        return this.boundDocument;
    }
    private markPartDirty(kind: NoteKind): void {
        const part: NotePartState = this.parts.get(kind);
        if (part === undefined) {
            throw new DocxError('content/unknown-note', 'Notes part is not loaded');
        }
        part.dirty = true;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        for (const part of this.parts.values()) {
            if (part.dirty || part.pendingRelationship !== undefined) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        let next: OpcPackage = pkg;
        for (const part of this.parts.values()) {
            if (!part.dirty && part.pendingRelationship === undefined) {
                continue;
            }
            const data: Uint8Array = serializeNotePart(part);
            const rel: OpcRelationship =
                part.pendingRelationship != null
                    ? part.pendingRelationship
                    : relationshipsForPart(next, mainPartName).items.find((item: OpcRelationship) => item.id === part.relationshipId);
            next = replaceOrAddPackagePart(next, mainPartName, part.partName, contentTypeForKind(part.kind), data, rel);
            part.dirty = false;
            part.pendingRelationship = undefined;
        }
        return next;
    }
    /**
     * @param {NoteKind} kind - The kind.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {NotePartState} The result.
     * @private
     */
    ensurePart(kind: NoteKind, usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): NotePartState {
        const existing: NotePartState = this.parts.get(kind);
        if (existing !== undefined) {
            return existing;
        }
        const partNameValue: PartName = allocatePartName(kind, usedPartNames);
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while ([...this.parts.values()].some((part: NotePartState) => part.relationshipId === relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const created: NotePartState = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType: relationshipTypeForKind(kind),
            kind,
            rootExtra: {
                attributes: [],
                namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML }]
            },
            entries: defaultSeparatorEntries(kind),
            dirty: true,
            pendingRelationship: {
                id: relId,
                type: relationshipTypeForKind(kind),
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.parts.set(kind, created);
        return created;
    }
    /**
     * @param {NoteKind} kind - The kind.
     * @param {string} text - The text.
     * @returns {number} The result.
     * @private
     */
    addNormalEntry(kind: NoteKind, text: string): number {
        const part: NotePartState = this.parts.get(kind);
        if (part === undefined) {
            throw new DocxError('content/unknown-note', 'Notes part is not loaded');
        }
        const noteId: number = allocateNoteId(part.entries);
        const blocks: BlockContent[] = this.boundDocument !== undefined
            ? blocksWithSimpleText(text, ownerForNote(this.boundDocument, kind, noteId))
            : blocksWithSimpleText(text);
        part.entries = [
            ...part.entries,
            { noteId, noteType: 'normal', blocks, preservedXml: undefined }
        ];
        part.dirty = true;
        return noteId;
    }
    /**
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {NoteEntry | undefined} The result.
     * @private
     */
    normalEntry(kind: NoteKind, noteId: number): NoteEntry | undefined {
        const part: NotePartState = this.parts.get(kind);
        if (part === undefined) {
            return undefined;
        }
        const entry: NoteEntry = part.entries.find((candidate: NoteEntry) => candidate.noteId === noteId);
        if (entry === undefined || entry.preservedXml !== undefined) {
            return undefined;
        }
        if (isSpecialNoteEntry(entry.noteId, entry.noteType)) {
            return undefined;
        }
        return entry;
    }
    private requireNormalEntry(kind: NoteKind, noteId: number): NoteEntry {
        const entry: NoteEntry = this.normalEntry(kind, noteId);
        if (entry === undefined) {
            throw new DocxError('content/unknown-note', `Note id ${String(noteId)} is not a modeled normal note`);
        }
        return entry;
    }
    /**
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {string | undefined} The result.
     * @private
     */
    textForNote(kind: NoteKind, noteId: number): string | undefined {
        const entry: NoteEntry = this.normalEntry(kind, noteId);
        if (entry === undefined) {
            return undefined;
        }
        return firstParagraphText(entry.blocks);
    }
    /**
     * Ordered body children ({@link BodyItem}) for a normal note â€” paragraphs, tables,
     * block content controls, and residuals, in WordDocument order (same model as Body.items).
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {ReadonlyArray<BodyItem>} The result.
     * @private
     */
    itemsForNote(kind: NoteKind, noteId: number): ReadonlyArray<BodyItem> {
        return this.blocksForNote(kind, noteId);
    }
    /**
     * Body blocks of a normal note, when modeled (paragraphs, tables, content controls, residuals).
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {ReadonlyArray<BodyItem>} The result.
     * @private
     * Prefer {@link NotesCatalog.itemsForNote}.
     */
    blocksForNote(kind: NoteKind, noteId: number): ReadonlyArray<BodyItem> {
        const entry: NoteEntry = this.normalEntry(kind, noteId);
        if (entry === undefined) {
            return [];
        }
        if (this.boundDocument !== undefined) {
            attachNoteParagraphs(this.boundDocument, kind, entry);
        }
        const items: BodyItem[] = [];
        for (const content of entry.blocks) {
            const projected: BodyItem = projectBlockToBodyItem(content);
            if (projected !== undefined) {
                items.push(projected);
            }
        }
        return items;
    }
    /**
     * Body paragraphs of a normal note, when modeled.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {ReadonlyArray<Paragraph>} The result.
     * @private
     * Prefer {@link NotesCatalog.itemsForNote} for mixed body content.
     */
    paragraphsForNote(kind: NoteKind, noteId: number): ReadonlyArray<Paragraph> {
        const entry: NoteEntry = this.normalEntry(kind, noteId);
        if (entry === undefined) {
            return [];
        }
        if (this.boundDocument !== undefined) {
            attachNoteParagraphs(this.boundDocument, kind, entry);
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
     * Replace the body of a normal note with a single paragraph of plain text.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {string} text - The text.
     * @returns {void} Nothing is returned.
     * @private
     */
    setTextForNote(kind: NoteKind, noteId: number, text: string): void {
        const part: NotePartState = this.parts.get(kind);
        if (part === undefined) {
            throw new DocxError('content/unknown-note', 'Notes part is not loaded');
        }
        const entry: NoteEntry = part.entries.find((candidate: NoteEntry) => candidate.noteId === noteId);
        if (entry === undefined || entry.preservedXml !== undefined) {
            throw new DocxError('content/unknown-note', `Note id ${String(noteId)} is not a modeled normal note`);
        }
        if (isSpecialNoteEntry(entry.noteId, entry.noteType)) {
            throw new DocxError('content/unknown-note', `Note id ${String(noteId)} is a separator or special note and cannot be edited`);
        }
        detachNoteBlocks(entry.blocks);
        if (this.boundDocument !== undefined) {
            entry.blocks = blocksWithSimpleText(text, ownerForNote(this.boundDocument, kind, noteId));
        }
        else {
            entry.blocks = blocksWithSimpleText(text);
        }
        part.dirty = true;
    }
    /**
     * Insert a body item at `index` in a normal note (`0â€¦length` inclusive).
     *
     * Attaches paragraphs and feature blocks when the catalog is WordDocument-bound.
     * Returns the same `item` reference for chaining.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {number} index - The index.
     * @param {BodyItem} item - The item.
     * @returns {BodyItem} The result.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError when the note is unknown or the catalog is unbound.
     *
     * @private
     */
    insertBodyItemAtForNote(kind: NoteKind, noteId: number, index: number, item: BodyItem): BodyItem {
        const document: WordDocument = this.requireBoundDocument();
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        if (index < 0 || index > entry.blocks.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const block: BlockContent = bodyItemToBlock(item);
        if (block.type === 'paragraph') {
            block.paragraph.attach(ownerForNote(document, kind, noteId));
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
        const next: BlockContent[] = entry.blocks.slice();
        next.splice(index, 0, block);
        entry.blocks = next;
        this.markPartDirty(kind);
        return item;
    }
    /**
     * Remove the body item at `index` in a normal note (`0â€¦length-1`).
     * Paragraphs detach; feature blocks may release content.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError when the note is unknown.
     *
     * @private
     */
    removeBodyItemAtForNote(kind: NoteKind, noteId: number, index: number): void {
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        if (index < 0 || index >= entry.blocks.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const block: BlockContent = entry.blocks[index];
        if (block === undefined) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const next: BlockContent[] = [...entry.blocks];
        next.splice(index, 1);
        entry.blocks = next;
        if (block.type === 'paragraph') {
            block.paragraph.detach();
        }
        else if (block.type === 'feature') {
            releaseFeatureBlockContent(block.value);
        }
        this.markPartDirty(kind);
    }
    /**
     * Remove a body item from a normal note by collection or payload identity.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {BodyItem} item - The item.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError when the item is not in the note.
     * @throws DocxError when the note is unknown.
     *
     * @private
     */
    removeBodyItemForNote(kind: NoteKind, noteId: number, item: BodyItem): void {
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        let at: number = -1;
        for (const [i, content] of entry.blocks.entries()) {
            if (projectBlockToBodyItem(content) === item) {
                at = i;
                break;
            }
        }
        if (at === -1) {
            throw new DetachedObjectError('Body item is not in this note');
        }
        this.removeBodyItemAtForNote(kind, noteId, at);
    }
    /**
     * Append a paragraph to a normal note body.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {Object} options - The options.
     * @returns {Paragraph} The result.
     * @throws DocxError when the note is unknown or the catalog is unbound.
     *
     * @private
     */
    appendParagraphToNote(kind: NoteKind, noteId: number, options?: {
        readonly style?: string;
        readonly text?: string;
    }): Paragraph {
        const WordDocument: WordDocument = this.requireBoundDocument();
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        const owner: NotePartOwner = ownerForNote(WordDocument, kind, noteId);
        const paragraph: Paragraph = new Paragraph(owner);
        this.insertBodyItemAtForNote(kind, noteId, entry.blocks.length, paragraph);
        if ((options == null ? undefined : options.style) !== undefined) {
            // Route through the styles facade so built-in ids/names resolve.
            paragraph.applyStyle(options.style);
        }
        if ((options == null ? undefined : options.text) !== undefined) {
            paragraph.appendText(options.text);
        }
        return paragraph;
    }
    /**
     * Append a table to a normal note body.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {number} rowCount - The row count.
     * @param {number} columnCount - The column count.
     * @returns {TableFeature} The result.
     * @throws DocxError when the note is unknown or the catalog is unbound.
     * @throws RangeError when dimensions are less than 1.
     *
     * @private
     */
    appendTableToNote(kind: NoteKind, noteId: number, rowCount: number, columnCount: number): TableFeature {
        this.requireBoundDocument();
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        const table: TableFeature = createTable(rowCount, columnCount);
        this.insertBodyItemAtForNote(kind, noteId, entry.blocks.length, table);
        return table;
    }
    /**
     * Append a block-level content control to a normal note body.
     *
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @param {ContentControlType} type - The type.
     * @returns {ContentControl} The result.
     * @throws DocxError when the note is unknown or the catalog is unbound.
     *
     * @private
     */
    appendBlockContentControlToNote(kind: NoteKind, noteId: number, type?: ContentControlType): ContentControl {
        this.requireBoundDocument();
        const entry: NoteEntry = this.requireNormalEntry(kind, noteId);
        const sdt: BlockContentControl = createBlockContentControl(type);
        // ContentControl is the runtime block SDT; BodyItem is a structural union in core.
        this.insertBodyItemAtForNote(kind, noteId, entry.blocks.length, sdt as BodyItem);
        return sdt;
    }
    /**
     * @param {NoteKind} kind - The kind.
     * @param {number} noteId - The note id.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeNormalEntry(kind: NoteKind, noteId: number): void {
        const part: NotePartState = this.parts.get(kind);
        if (part === undefined) {
            throw new DocxError('content/unknown-note', 'Notes part is not loaded');
        }
        const next: NoteEntry[] = part.entries.filter((entry: NoteEntry) => entry.noteId !== noteId);
        if (next.length === part.entries.length) {
            throw new DocxError('content/unknown-note', `Note id ${String(noteId)} is not in this WordDocument`);
        }
        part.entries = next;
        part.dirty = true;
    }
}
/**
 * Live view of a footnote body in the footnotes part.
 *
 * Bound to a WordDocument and note id; reads and writes go through
 * {@link NotesCatalog}. Body content is the same R5.6
 * {@link BodyItem} list as {@link Body} (`items` +
 * insert/remove). Does not expose raw OOXML.
 *
 * @private
 */
export class Footnote {
    private readonly WordDocument: WordDocument;
    private readonly id: number;
    /**
     * @param {WordDocument} WordDocument - The word document.
     * @param {number} noteId - The note id.
     * @private
     */
    constructor(WordDocument: WordDocument, noteId: number) {
        this.WordDocument = WordDocument;
        this.id = noteId;
    }
    /**
     * @private
     * Stable id matching the footnote reference and footnotes part entry. */
    get noteId(): number {
        return this.id;
    }
    /**
     * Ordered body children ({@link BodyItem}) for this footnote â€”
     * paragraphs, tables, block content controls, and residuals, in
     * WordDocument order (same model as {@link Body.items}).
     *
     * @public
     */
    get items(): ReadonlyArray<BodyItem> {
        return notesFor(this.WordDocument).itemsForNote('footnote', this.id);
    }
    /**
     * Insert a body item at `index` in {@link Footnote.items}
     * (`0â€¦length` inclusive â€” insert-before / append).
     *
     * Attaches paragraphs and feature blocks to the owning WordDocument. Returns the
     * same `item` reference for chaining (API-RULES R1.1).
     *
     * @param {number} index - Index in {@link Footnote.items}.
     * @param {BodyItem} item - Paragraph, feature, or opaque body child.
     * @returns {BodyItem} The inserted {@link BodyItem}.
     * @throws RangeError if `index` is out of range.
     *
     * @public
     */
    insertBodyItemAt(index: number, item: BodyItem): BodyItem {
        return notesFor(this.WordDocument).insertBodyItemAtForNote('footnote', this.id, index, item);
    }
    /**
     * Remove the body item at `index` in {@link Footnote.items}
     * (`0â€¦length-1`). Paragraphs detach; feature blocks may release content.
     *
     * @param {number} index - Index in {@link Footnote.items}.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     *
     * @public
     */
    removeBodyItemAt(index: number): void {
        notesFor(this.WordDocument).removeBodyItemAtForNote('footnote', this.id, index);
    }
    /**
     * Remove a body item from {@link Footnote.items} by collection or payload identity.
     *
     * @param {BodyItem} item - Entry from `items`, or an equivalent payload wrapper.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError if `item` is not in this footnote.
     *
     * @public
     */
    removeBodyItem(item: BodyItem): void {
        notesFor(this.WordDocument).removeBodyItemForNote('footnote', this.id, item);
    }
}
/**
 * Live view of an endnote body in the endnotes part.
 *
 * Bound to a WordDocument and note id; reads and writes go through
 * {@link NotesCatalog}. Body content is the same R5.6
 * {@link BodyItem} list as {@link Body} (`items` +
 * insert/remove). Does not expose raw OOXML.
 *
 * @private
 */
export class Endnote {
    private readonly WordDocument: WordDocument;
    private readonly id: number;
    /**
     * @param {WordDocument} WordDocument - The word document.
     * @param {number} noteId - The note id.
     * @private
     */
    constructor(WordDocument: WordDocument, noteId: number) {
        this.WordDocument = WordDocument;
        this.id = noteId;
    }
    /**
     * @private
     * Stable id matching the endnote reference and endnotes part entry. */
    get noteId(): number {
        return this.id;
    }
    /**
     * Ordered body children ({@link BodyItem}) for this endnote â€”
     * paragraphs, tables, block content controls, and residuals, in
     * WordDocument order (same model as {@link Body.items}).
     *
     * @public
     */
    get items(): ReadonlyArray<BodyItem> {
        return notesFor(this.WordDocument).itemsForNote('endnote', this.id);
    }
    /**
     * Insert a body item at `index` in {@link Endnote.items}
     * (`0â€¦length` inclusive â€” insert-before / append).
     *
     * Attaches paragraphs and feature blocks to the owning WordDocument. Returns the
     * same `item` reference for chaining (API-RULES R1.1).
     *
     * @param {number} index - Index in {@link Endnote.items}.
     * @param {BodyItem} item - Paragraph, feature, or opaque body child.
     * @returns {BodyItem} The inserted {@link BodyItem}.
     * @throws RangeError if `index` is out of range.
     *
     * @public
     */
    insertBodyItemAt(index: number, item: BodyItem): BodyItem {
        return notesFor(this.WordDocument).insertBodyItemAtForNote('endnote', this.id, index, item);
    }
    /**
     * Remove the body item at `index` in {@link Endnote.items}
     * (`0â€¦length-1`). Paragraphs detach; feature blocks may release content.
     *
     * @param {number} index - Index in {@link Endnote.items}.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     *
     * @public
     */
    removeBodyItemAt(index: number): void {
        notesFor(this.WordDocument).removeBodyItemAtForNote('endnote', this.id, index);
    }
    /**
     * Remove a body item from {@link Endnote.items} by collection or payload identity.
     *
     * @param {BodyItem} item - Entry from `items`, or an equivalent payload wrapper.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError if `item` is not in this endnote.
     *
     * @public
     */
    removeBodyItem(item: BodyItem): void {
        notesFor(this.WordDocument).removeBodyItemForNote('endnote', this.id, item);
    }
}
function loadCatalog(pkg: OpcPackage, mainPartName: PartName): NotesCatalog {
    const parts: Map<'footnote' | 'endnote', NotePartState> = new Map<NoteKind, NotePartState>();
    for (const rel of relationshipsForPart(pkg, mainPartName).items) {
        const kind: NoteKind = kindForRelationshipType(rel.type);
        if (kind === undefined) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, mainPartName);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            continue;
        }
        const parsed: NotePartState = parseNotePart(part, rel, kind);
        if (parsed !== undefined) {
            parts.set(kind, parsed);
        }
    }
    return new NotesCatalog(parts);
}
function usedRelationshipIds(WordDocument: WordDocument): Set<string> {
    const main: PartName = partName('/word/WordDocument.xml');
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
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetNotesFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register note reference and notes-part handlers. Idempotent.
 */
export function registerNotesFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: NOTES });
    registerFeatureMultiPartHandler({
        featureId: NOTES,
        relationshipTypes: ALL_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): NotesCatalog {
            return loadCatalog(pkg, ctx.mainPartName);
        }
    });
    registerFeatureRunLeafHandler({
        featureId: NOTES,
        wmlLocalName: 'footnoteReference',
        tryParse(element: OpenXmlElement): FootnoteReference | undefined {
            if (!isWml(element, 'footnoteReference')) {
                return undefined;
            }
            const noteId: number = parseNoteId(wmlAttribute(element, 'id'));
            if (noteId === undefined) {
                return undefined;
            }
            return new FootnoteReference(noteId);
        }
    });
    registerFeatureRunLeafHandler({
        featureId: NOTES,
        wmlLocalName: 'endnoteReference',
        tryParse(element: OpenXmlElement): EndnoteReference | undefined {
            if (!isWml(element, 'endnoteReference')) {
                return undefined;
            }
            const noteId: number = parseNoteId(wmlAttribute(element, 'id'));
            if (noteId === undefined) {
                return undefined;
            }
            return new EndnoteReference(noteId);
        }
    });
}
/**
 * Notes catalog for a WordDocument.
 *
 * On a loaded package this is the catalog built from footnotes/endnotes parts.
 * On a newly authored WordDocument there may be no notes parts yet, so this function
 * attaches an empty catalog on first use when the feature is registered.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {NotesCatalog} The result.
 * @throws DocxError `feature/not-registered` when the module was not registered.
 *
 * @private
 */
export function notesFor(WordDocument: WordDocument): NotesCatalog {
    const part: FeaturePartState = WordDocument.featurePart(NOTES);
    if (part instanceof NotesCatalog) {
        part.bindDocument(WordDocument);
        return part;
    }
    if (part !== undefined) {
        throw new DocxError('feature/not-registered', 'Notes feature state was replaced with an unexpected part type');
    }
    if (!isFeatureRegistered(NOTES)) {
        throw new DocxError('feature/not-registered', 'Notes feature is not registered; call registerNotesFeature() before use');
    }
    const created: NotesCatalog = new NotesCatalog(new Map());
    created.bindDocument(WordDocument);
    WordDocument.setFeaturePart(NOTES, created);
    return created;
}
/** Interned footnote body views per document (stable `===` by note id). */
const footnoteViews: WeakMap<WordDocument, Map<number, Footnote>> = new WeakMap<WordDocument, Map<number, Footnote>>();
/** Interned endnote body views per document (stable `===` by note id). */
const endnoteViews: WeakMap<WordDocument, Map<number, Endnote>> = new WeakMap<WordDocument, Map<number, Endnote>>();
function footnoteViewMap(document: WordDocument): Map<number, Footnote> {
    let map: Map<number, Footnote> = footnoteViews.get(document);
    if (map === undefined) {
        map = new Map();
        footnoteViews.set(document, map);
    }
    return map;
}
function endnoteViewMap(document: WordDocument): Map<number, Endnote> {
    let map: Map<number, Endnote> = endnoteViews.get(document);
    if (map === undefined) {
        map = new Map();
        endnoteViews.set(document, map);
    }
    return map;
}
/**
 * Interned live {@link Footnote} for `(document, noteId)`.
 *
 * @param {WordDocument} document - The document.
 * @param {number} noteId - The note id.
 * @returns {Footnote} The result.
 * @private
 */
export function footnoteInstanceFor(document: WordDocument, noteId: number): Footnote {
    const map: Map<number, Footnote> = footnoteViewMap(document);
    const existing: Footnote = map.get(noteId);
    if (existing !== undefined) {
        return existing;
    }
    const created: Footnote = new Footnote(document, noteId);
    map.set(noteId, created);
    return created;
}
/**
 * Interned live {@link Endnote} for `(document, noteId)`.
 *
 * @param {WordDocument} document - The document.
 * @param {number} noteId - The note id.
 * @returns {Endnote} The result.
 * @private
 */
export function endnoteInstanceFor(document: WordDocument, noteId: number): Endnote {
    const map: Map<number, Endnote> = endnoteViewMap(document);
    const existing: Endnote = map.get(noteId);
    if (existing !== undefined) {
        return existing;
    }
    const created: Endnote = new Endnote(document, noteId);
    map.set(noteId, created);
    return created;
}
/**
 * Live {@link Footnote} view for a reference in this WordDocument.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {FootnoteReference} reference - The reference.
 * @returns {Footnote} The result.
 * @private
 */
export function footnoteFor(WordDocument: WordDocument, reference: FootnoteReference): Footnote {
    return footnoteInstanceFor(WordDocument, reference.noteId);
}
/**
 * Live {@link Endnote} view for a reference in this WordDocument.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {EndnoteReference} reference - The reference.
 * @returns {Endnote} The result.
 * @private
 */
export function endnoteFor(WordDocument: WordDocument, reference: EndnoteReference): Endnote {
    return endnoteInstanceFor(WordDocument, reference.noteId);
}
/**
 * Footnote bodies referenced from the WordDocument body, in WordDocument order (first occurrence).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {ReadonlyArray<Footnote>} The result.
 * @private
 */
export function footnotesInDocument(WordDocument: WordDocument): ReadonlyArray<Footnote> {
    const found: Footnote[] = [];
    const seen: Set<number> = new Set<number>();
    visitParagraphsInDocumentOrder(WordDocument, (paragraph: Paragraph) => {
        for (const reference of footnotesInParagraph(paragraph)) {
            if (seen.has(reference.noteId)) {
                continue;
            }
            seen.add(reference.noteId);
            found.push(footnoteInstanceFor(WordDocument, reference.noteId));
        }
    });
    return found;
}
/**
 * Endnote bodies referenced from the WordDocument body, in WordDocument order (first occurrence).
 *
 * @param {WordDocument} WordDocument - The word document.
 * @returns {ReadonlyArray<Endnote>} The result.
 * @private
 */
export function endnotesInDocument(WordDocument: WordDocument): ReadonlyArray<Endnote> {
    const found: Endnote[] = [];
    const seen: Set<number> = new Set<number>();
    visitParagraphsInDocumentOrder(WordDocument, (paragraph: Paragraph) => {
        for (const reference of endnotesInParagraph(paragraph)) {
            if (seen.has(reference.noteId)) {
                continue;
            }
            seen.add(reference.noteId);
            found.push(endnoteInstanceFor(WordDocument, reference.noteId));
        }
    });
    return found;
}
/**
 * Document-level footnotes manager (`WordDocument.footnotes`).
 *
 * Stable per-document identity. Enumerates interned {@link Footnote} bodies
 * referenced from the main story in document order. Named {@link Footnotes}
 * (plural) so it does not collide with the per-note {@link Footnote} body class.
 *
 * @private
 */
export class Footnotes implements Iterable<Footnote> {
    readonly [index: number]: Footnote;

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
     * Number of distinct footnote bodies referenced from the main story.
     *
     * @public
     */
    get count(): number {
        this.rebuildIndexProperties();
        return this.cachedLength;
    }
    /**
     * Footnote at zero-based `index`, or `undefined` when out of range.
     *
     * @param {number} index - The index.
     * @returns {Footnote | undefined} The result.
     * @public
     */
    itemAt(index: number): Footnote | undefined {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return footnotesInDocument(this.document)[index];
    }
    [Symbol.iterator](): Iterator<Footnote> {
        const items: Footnote[] = footnotesInDocument(this.document).slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Footnote> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Footnote };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Footnote = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    rebuildIndexProperties(): void {
        const items: ReadonlyArray<Footnote> = footnotesInDocument(this.document);
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
/**
 * Document-level endnotes manager (`WordDocument.endnotes`).
 *
 * Stable per-document identity. Enumerates interned {@link Endnote} bodies
 * referenced from the main story in document order. Named {@link Endnotes}
 * (plural) so it does not collide with the per-note {@link Endnote} body class.
 *
 * @private
 */
export class Endnotes implements Iterable<Endnote> {
    readonly [index: number]: Endnote;

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
     * Number of distinct endnote bodies referenced from the main story.
     *
     * @public
     */
    get count(): number {
        this.rebuildIndexProperties();
        return this.cachedLength;
    }
    /**
     * Endnote at zero-based `index`, or `undefined` when out of range.
     *
     * @param {number} index - The index.
     * @returns {Endnote | undefined} The result.
     * @public
     */
    itemAt(index: number): Endnote | undefined {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return endnotesInDocument(this.document)[index];
    }
    [Symbol.iterator](): Iterator<Endnote> {
        const items: Endnote[] = endnotesInDocument(this.document).slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Endnote> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Endnote };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Endnote = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    rebuildIndexProperties(): void {
        const items: ReadonlyArray<Endnote> = endnotesInDocument(this.document);
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
const footnotesManagers: WeakMap<WordDocument, Footnotes> = new WeakMap<WordDocument, Footnotes>();
const endnotesManagers: WeakMap<WordDocument, Endnotes> = new WeakMap<WordDocument, Endnotes>();
/**
 * Stable {@link Footnotes} manager for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {Footnotes} The result.
 * @private
 */
export function footnotesFor(document: WordDocument): Footnotes {
    registerNotesFeature();
    const cached: Footnotes = footnotesManagers.get(document);
    if (cached !== undefined) {
        cached.rebuildIndexProperties();
        return cached;
    }
    const created: Footnotes = new Footnotes(document);
    created.rebuildIndexProperties();
    footnotesManagers.set(document, created);
    return created;
}
/**
 * Stable {@link Endnotes} manager for `document`.
 *
 * @param {WordDocument} document - The document.
 * @returns {Endnotes} The result.
 * @private
 */
export function endnotesFor(document: WordDocument): Endnotes {
    registerNotesFeature();
    const cached: Endnotes = endnotesManagers.get(document);
    if (cached !== undefined) {
        cached.rebuildIndexProperties();
        return cached;
    }
    const created: Endnotes = new Endnotes(document);
    created.rebuildIndexProperties();
    endnotesManagers.set(document, created);
    return created;
}
function referencesInParagraph<T extends FootnoteReference | EndnoteReference>(
    paragraph: Paragraph,
    predicate: (item: ParagraphItem) => item is FeatureRunParagraphItem & { value: T }
): ReadonlyArray<T> {
    const found: T[] = [];
    for (const item of paragraph.items) {
        if (predicate(item)) {
            found.push(item.value);
        }
    }
    return found;
}
/**
 * Footnote references in a paragraph, in WordDocument order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<FootnoteReference>} The result.
 * @private
 */
export function footnotesInParagraph(paragraph: Paragraph): ReadonlyArray<FootnoteReference> {
    return referencesInParagraph(paragraph, isFootnoteReferenceLeaf);
}
/**
 * Endnote references in a paragraph, in WordDocument order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<EndnoteReference>} The result.
 * @private
 */
export function endnotesInParagraph(paragraph: Paragraph): ReadonlyArray<EndnoteReference> {
    return referencesInParagraph(paragraph, isEndnoteReferenceLeaf);
}
/**
 * Visible text of a footnote body, when loaded.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {FootnoteReference} reference - The reference.
 * @returns {string | undefined} The result.
 * @private
 */
export function footnoteText(WordDocument: WordDocument, reference: FootnoteReference): string | undefined {
    return notesFor(WordDocument).textForNote('footnote', reference.noteId);
}
/**
 * Visible text of an endnote body, when loaded.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {EndnoteReference} reference - The reference.
 * @returns {string | undefined} The result.
 * @private
 */
export function endnoteText(WordDocument: WordDocument, reference: EndnoteReference): string | undefined {
    return notesFor(WordDocument).textForNote('endnote', reference.noteId);
}
/**
 * Insert a footnote reference and body at the end of a paragraph.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} text - The text.
 * @returns {FootnoteReference} The result.
 * @private
 */
export function insertFootnote(WordDocument: WordDocument, paragraph: Paragraph, text: string): FootnoteReference {
    const catalog: NotesCatalog = notesFor(WordDocument);
    catalog.ensurePart('footnote', usedRelationshipIds(WordDocument), usedPartNameKeys(WordDocument));
    const noteId: number = catalog.addNormalEntry('footnote', text);
    const reference: FootnoteReference = new FootnoteReference(noteId);
    const item: FeatureRunParagraphItem = paragraph.appendFeatureRunItem(NOTES, reference);
    // Note markers are superscript in Word (w:rPr/w:vertAlign w:val="superscript").
    item.wireGroup.characterFormat.subSuperScript = SubSuperScript.SuperScript;
    return reference;
}
/**
 * Insert an endnote reference and body at the end of a paragraph.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} text - The text.
 * @returns {EndnoteReference} The result.
 * @private
 */
export function insertEndnote(WordDocument: WordDocument, paragraph: Paragraph, text: string): EndnoteReference {
    const catalog: NotesCatalog = notesFor(WordDocument);
    catalog.ensurePart('endnote', usedRelationshipIds(WordDocument), usedPartNameKeys(WordDocument));
    const noteId: number = catalog.addNormalEntry('endnote', text);
    const reference: EndnoteReference = new EndnoteReference(noteId);
    const item: FeatureRunParagraphItem = paragraph.appendFeatureRunItem(NOTES, reference);
    // Note markers are superscript in Word (w:rPr/w:vertAlign w:val="superscript").
    item.wireGroup.characterFormat.subSuperScript = SubSuperScript.SuperScript;
    return reference;
}
function removeReferenceRun(paragraph: Paragraph, reference: FootnoteReference | EndnoteReference): void {
    for (const item of paragraph.items) {
        if (item instanceof FeatureRunParagraphItem && item.featureId === NOTES && item.value === reference) {
            paragraph.removeFeatureRunItem(reference);
            return;
        }
    }
    throw new DocxError('content/unknown-note', 'Note reference is not in this paragraph');
}
/**
 * Remove a footnote reference and body from a WordDocument.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {FootnoteReference} reference - The reference.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeFootnote(WordDocument: WordDocument, paragraph: Paragraph, reference: FootnoteReference): void {
    removeReferenceRun(paragraph, reference);
    notesFor(WordDocument).removeNormalEntry('footnote', reference.noteId);
}
/**
 * Remove an endnote reference and body from a WordDocument.
 *
 * @param {WordDocument} WordDocument - The word document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {EndnoteReference} reference - The reference.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeEndnote(WordDocument: WordDocument, paragraph: Paragraph, reference: EndnoteReference): void {
    removeReferenceRun(paragraph, reference);
    notesFor(WordDocument).removeNormalEntry('endnote', reference.noteId);
}
/**
 * Whether a paragraph item is a modeled footnote reference from this module.
 *
 * @param {ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
export function isFootnoteReferenceLeaf(item: ParagraphItem): item is FeatureRunParagraphItem & { value: FootnoteReference } {
    return item instanceof FeatureRunParagraphItem && item.featureId === NOTES && item.value instanceof FootnoteReference;
}
/**
 * Whether a paragraph item is a modeled endnote reference from this module.
 *
 * @param {ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
export function isEndnoteReferenceLeaf(item: ParagraphItem): item is FeatureRunParagraphItem & { value: EndnoteReference } {
    return item instanceof FeatureRunParagraphItem && item.featureId === NOTES && item.value instanceof EndnoteReference;
}
Object.defineProperty(WordDocument.prototype, 'footnotes', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): Footnotes {
        return footnotesFor(this);
    }
});
Object.defineProperty(WordDocument.prototype, 'endnotes', {
    configurable: true,
    enumerable: false,
    get(this: WordDocument): Endnotes {
        return endnotesFor(this);
    }
});
Paragraph.prototype.appendFootnote = function (this: Paragraph, text: string): Footnote {
    const reference: FootnoteReference = insertFootnote(this.owningDocument(), this, text);
    return footnoteInstanceFor(this.owningDocument(), reference.noteId);
};
Paragraph.prototype.appendEndnote = function (this: Paragraph, text: string): Endnote {
    const reference: EndnoteReference = insertEndnote(this.owningDocument(), this, text);
    return endnoteInstanceFor(this.owningDocument(), reference.noteId);
};
registerNotesFeature();
