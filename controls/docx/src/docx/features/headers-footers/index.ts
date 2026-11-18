import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import {
    bodyItemToBlock,
    isSupportedBodyItem,
    projectBlockToBodyItem
} from '../document/body-item-adapters';
import { BodyItem, isParagraphBodyItem } from '../document/body-item';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { parseBodyBlocks, serializeBodyBlocks } from '../document/body-blocks';
import { BlockContent, Paragraph, ParagraphOwner } from '../document/paragraph';
import { TextRange } from '../document/text-range';
import { isWml, wmlElement } from '../document/wml';
import { detachedBodyBlockParseContext } from '../../core/registry/block-handlers';
import { allocateRelationshipId, OpcRelationship, RelationshipId, Relationships } from '../../core/opc/relationships';
import { partByName, relationshipsForPart, OpcPackage, PackagePart } from '../../core/opc/package';
import { partName, partNameKey, resolveInternalTarget, PartName } from '../../core/opc/part-name';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureMultiPartHandler, replaceOrAddPackagePart, usedMainDocumentRelationshipIds } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { parseXml, serializeXml, WML_TRANSITIONAL_NAMESPACE, OpenXmlElement } from '../../core/xml/index';
import {
    defaultLetterPageSetup,
    finalSection,
    paragraphSectionBreak,
    setFinalSection,
    setParagraphSectionBreak,
    ownerDocumentOf,
    associatePageSetupDocument,
    ensureFinalSectionProperties,
    HeaderFooterReferenceType,
    PageSetup
} from '../sections/index';
import { installSectionHeaderFooterTextWriter } from '../sections/header-footer-text-writer';
import { Section as DocSection } from '../document/section';
import { PageSetup as DocPageSetup } from '../document/page-setup';
import {
    HeaderFooter,
    HeaderFooterKind,
    HeaderFooterSlotRef,
    registerHeadersFootersSlotFactory,
    resetHeadersFootersSlotFactoryForTests,
    registerHeadersFootersLinkToPreviousHandlers,
    resetHeadersFootersLinkToPreviousHandlersForTests
} from '../document/headers-footers';
import { Sections } from '../document/sections';
import { FeatureId } from '../../core/registry/feature-registry';
/** @public Compat alias — prefer HeaderFooter. */
export type Header = HeaderFooter;
/** @public Compat alias — prefer HeaderFooter. */
export type Footer = HeaderFooter;
/** @public Compat value alias for instanceof / legacy callers. */
// eslint-disable-next-line no-redeclare -- intentional type+value alias pair for legacy instanceof/type callers
export const Header: typeof HeaderFooter = HeaderFooter;
/** @public Compat value alias for instanceof / legacy callers. */
// eslint-disable-next-line no-redeclare -- intentional type+value alias pair for legacy instanceof/type callers
export const Footer: typeof HeaderFooter = HeaderFooter;
export { HeaderFooter, HeaderFooterKind };
const HEADERS_FOOTERS: FeatureId = featureId('headers-footers');
/**
 * Cross-bundle identity for HeadersFootersCatalog.
 *
 * Main entry and @syncfusion/ej2-docx/headers-footers can load separate module graphs of the
 * same class. instanceof fails across those graphs; Symbol.for stays shared.
 * @private
 */
const HEADERS_FOOTERS_CATALOG_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-docx.HeadersFootersCatalog');

/**
 * @private
 * Transitional header relationship (ECMA-376-4 §9.2.8). */
export const HEADER_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header';
/**
 * @private
 * Transitional footer relationship (ECMA-376-4 §9.2.7). */
export const FOOTER_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer';
/**
 * @private
 * Strict header relationship (ECMA-376-1 §11.3.6). */
export const STRICT_HEADER_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/header';
/**
 * @private
 * Strict footer relationship (ECMA-376-1 §11.3.9). */
export const STRICT_FOOTER_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/footer';
/**
 * @private
 * ECMA-376-1 §11.3.6 Header part content type. */
export const HEADER_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml';
/**
 * @private
 * ECMA-376-1 §11.3.9 Footer part content type. */
export const FOOTER_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml';
const HEADER_RELATIONSHIP_TYPES: string[] = [HEADER_RELATIONSHIP_TYPE, STRICT_HEADER_RELATIONSHIP_TYPE];
const FOOTER_RELATIONSHIP_TYPES: string[] = [FOOTER_RELATIONSHIP_TYPE, STRICT_FOOTER_RELATIONSHIP_TYPE];
const ALL_RELATIONSHIP_TYPES: string[] = [...HEADER_RELATIONSHIP_TYPES, ...FOOTER_RELATIONSHIP_TYPES];
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
const utf8: TextEncoder = new TextEncoder();
/** Header vs footer part kind for catalog listing.
 */
export type HeaderFooterType = 'header' | 'footer';
interface LoadedPart {
    readonly partName: PartName;
    readonly relationshipId: RelationshipId;
    readonly relationshipType: string;
    readonly kind: HeaderFooterType;
    readonly rootExtra: Pick<OpenXmlElement, 'attributes' | 'namespaceDeclarations'>;
    blocks: BlockContent[];
    dirty: boolean;
    pendingRelationship: OpcRelationship | undefined;
}
function kindForRelationshipType(type: string): HeaderFooterType | undefined {
    if (HEADER_RELATIONSHIP_TYPES.indexOf(type as (typeof HEADER_RELATIONSHIP_TYPES)[number]) !== -1) {
        return 'header';
    }
    if (FOOTER_RELATIONSHIP_TYPES.indexOf(type as (typeof FOOTER_RELATIONSHIP_TYPES)[number]) !== -1) {
        return 'footer';
    }
    return undefined;
}
function contentTypeForKind(kind: HeaderFooterType): string {
    return kind === 'header' ? HEADER_CONTENT_TYPE : FOOTER_CONTENT_TYPE;
}
function rootLocalName(kind: HeaderFooterType): 'hdr' | 'ftr' {
    return kind === 'header' ? 'hdr' : 'ftr';
}
function relativeTarget(partNameValue: PartName): string {
    const logical: string = partNameValue.slice('/word/'.length);
    return logical;
}
function firstParagraphText(blocks: ReadonlyArray<BlockContent>): string | undefined {
    for (const content of blocks) {
        if (content.type !== 'paragraph') {
            continue;
        }
        for (const inline of content.paragraph.items) {
            if (inline instanceof TextRange) {
                return inline.text;
            }
        }
        return '';
    }
    return undefined;
}
function blocksWithSimpleText(text: string, owner: ParagraphOwner = detachedParagraphOwner): BlockContent[] {
    const paragraph: Paragraph = Paragraph.fromXml(wmlElement('p', {
        children: [
            wmlElement('r', {
                children: [
                    wmlElement('t', {
                        children: [{ kind: 'text', value: text }]
                    })
                ]
            })
        ]
    }), owner);
    return [{ type: 'paragraph', paragraph }];
}
const detachedParagraphOwner: ParagraphOwner = {
    assertAttachedParagraph(): void {
        return;
    },
    owningDocument(): WordDocument {
        throw new DetachedObjectError('Header or footer content is not in a document');
    }
};
/**
 * Paragraph owner scoped to one header/footer catalog entry.
 * Membership is checked against the live entry blocks.
 */
class HeaderFooterPartOwner implements ParagraphOwner {
    private readonly document: WordDocument;
    private readonly relationshipId: string;
    constructor(document: WordDocument, relationshipId: string) {
        this.document = document;
        this.relationshipId = relationshipId;
    }
    assertAttachedParagraph(target: Paragraph): void {
        const catalog: HeadersFootersCatalog = headersFootersFor(this.document);
        const entry: LoadedPart = catalog.entryForRelationship(this.relationshipId);
        if (entry === undefined) {
            throw new DetachedObjectError('Header or footer part is no longer loaded');
        }
        const found: boolean = entry.blocks.some((block: BlockContent) => block.type === 'paragraph' && block.paragraph === target);
        if (!found) {
            throw new DetachedObjectError('This paragraph is no longer in its header or footer');
        }
    }
    /**
     * @returns {WordDocument} The result.
     * @private
     */
    owningDocument(): WordDocument {
        return this.document;
    }
}
function ownerForEntry(document: WordDocument, relationshipId: string): HeaderFooterPartOwner {
    return new HeaderFooterPartOwner(document, relationshipId);
}
/**
 * Bind a feature body block (table, content control, â€¦) to the owning document when
 * the value exposes `bindDocument`. Mirrors {@link Body} without exporting
 * that helper from `document.ts`.
 *
 * @param {unknown} value - The value.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 */
function bindDocumentToFeatureBlock(value: unknown, document: WordDocument): void {
    if (typeof value !== 'object' || value === null || !('bindDocument' in value)) {
        return;
    }
    const bindDocument: (doc: WordDocument) => void = (value as {
        bindDocument: (doc: WordDocument) => void;
    }).bindDocument;
    bindDocument.call(value, document);
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
function attachEntryParagraphs(document: WordDocument, entry: LoadedPart): void {
    const owner: HeaderFooterPartOwner = ownerForEntry(document, entry.relationshipId);
    for (const block of entry.blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.attach(owner);
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
    }
}
function detachEntryBlocks(blocks: ReadonlyArray<BlockContent>): void {
    for (const block of blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.detach();
        }
        else if (block.type === 'feature') {
            releaseFeatureBlockContent(block.value);
        }
    }
}
function parseHeaderFooterPart(part: PackagePart, relationship: OpcRelationship, kind: HeaderFooterType): LoadedPart | undefined {
    const root: OpenXmlElement = parseXml(utf8Decoder.decode(part.data));
    const localName: string = rootLocalName(kind);
    if (!isWml(root, localName)) {
        return undefined;
    }
    const blocks: BlockContent[] = parseBodyBlocks(root.children, detachedBodyBlockParseContext());
    return {
        partName: part.name,
        relationshipId: relationship.id,
        relationshipType: relationship.type,
        kind,
        rootExtra: {
            attributes: root.attributes,
            namespaceDeclarations: root.namespaceDeclarations.length > 0
                ? root.namespaceDeclarations
                : [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }]
        },
        blocks,
        dirty: false,
        pendingRelationship: undefined
    };
}
/**
 * In-memory header and footer parts linked from the Main Document.
 * @private
 */
export class HeadersFootersCatalog implements FeatureMultiPackagePart {
    private readonly entries: Map<PartName, LoadedPart>;
    private readonly byRelationshipId: Map<string, LoadedPart>;
    private catalogDirty: boolean;
    private boundDocument: WordDocument | undefined;
    /**
     * @param {Map<PartName, LoadedPart>} entries - The entries.
     * @private
     */
    constructor(entries: Map<PartName, LoadedPart>) {
        this.entries = entries;
        // TS 3.3 widens mapped pair literals to (T|U)[] rather than [T, U].
        const byRelationshipIdEntries: Array<[string, LoadedPart]> = [];
        for (const entry of entries.values()) {
            byRelationshipIdEntries.push([entry.relationshipId, entry]);
        }
        this.byRelationshipId = new Map<string, LoadedPart>(byRelationshipIdEntries);
        this.catalogDirty = false;
        this.boundDocument = undefined;
        // Shared across duplicate ESM graphs (main bundle vs feature subpath).
        // eslint-disable-next-line security/detect-object-injection -- key is the module-private unique symbol brand constant, not user input
        (this as HeadersFootersCatalog & {
            [HEADERS_FOOTERS_CATALOG_BRAND]?: true;
        })[HEADERS_FOOTERS_CATALOG_BRAND] = true;
    }
    /**
     * Bind this catalog to a live document so paragraph owners can resolve.
     * Re-attaches existing paragraph blocks to entry-scoped owners.
     *
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: WordDocument): void {
        this.boundDocument = document;
        for (const entry of this.entries.values()) {
            attachEntryParagraphs(document, entry);
        }
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {LoadedPart | undefined} The result.
     * @private
     */
    entryForRelationship(relationshipId: string): LoadedPart | undefined {
        return this.byRelationshipId.get(relationshipId);
    }
    private requireBoundDocument(): WordDocument {
        if (this.boundDocument === undefined) {
            throw new DocxError('content/invalid-header-footer-reference', 'Headers/footers catalog is not bound to a document');
        }
        return this.boundDocument;
    }
    private requireEntry(relationshipId: string): LoadedPart {
        const entry: LoadedPart = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            throw new DocxError('content/invalid-header-footer-reference', `Header/footer relationship ${relationshipId} is not loaded in this document`);
        }
        return entry;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        if (this.catalogDirty) {
            return true;
        }
        for (const entry of this.entries.values()) {
            if (entry.dirty || entry.pendingRelationship !== undefined) {
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
        for (const entry of this.entries.values()) {
            if (!entry.dirty && entry.pendingRelationship === undefined) {
                continue;
            }
            const xml: Uint8Array = serializeHeaderFooterPart(entry);
            const rel: OpcRelationship =
                entry.pendingRelationship != null
                    ? entry.pendingRelationship
                    : relationshipsForPart(next, mainPartName).items.find((item: OpcRelationship) => item.id === entry.relationshipId);
            next = replaceOrAddPackagePart(next, mainPartName, entry.partName, contentTypeForKind(entry.kind), xml, rel);
            entry.dirty = false;
            entry.pendingRelationship = undefined;
        }
        this.catalogDirty = false;
        return next;
    }
    /**
     * Relationship ids already allocated by this catalog — persisted package
     * items plus ids that are still pending in entries. Other feature
     * catalogs (images, hyperlinks, …) reserve these before allocating new
     * main-part rIds so concurrent pending allocations cannot collide and
     * re-point `w:headerReference` at a non-header relationship.
     *
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    pendingRelationshipIds(): ReadonlyArray<string> {
        const ids: string[] = [];
        for (const entry of this.entries.values()) {
            if (entry.pendingRelationship !== undefined) {
                ids.push(entry.relationshipId);
            }
        }
        return ids;
    }
    /**
     * @param {HeaderFooterType} kind - The kind.
     * @param {PageSetup} section - The section.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {Object} The result.
     * @private
     */
    ensureDefaultPart(kind: HeaderFooterType, section: PageSetup, usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): {
        entry: LoadedPart;
        relationshipId: string;
    } {
        return this.ensurePart(kind, section, 'default', usedRelIds, usedPartNames);
    }
    /**
     * @param {HeaderFooterType} kind - The kind.
     * @param {PageSetup} section - The section.
     * @param {HeaderFooterReferenceType} refType - The ref type.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {Object} The result.
     * @private
     */
    ensurePart(
        kind: HeaderFooterType,
        section: PageSetup,
        refType: HeaderFooterReferenceType,
        usedRelIds: ReadonlySet<string>,
        usedPartNames: ReadonlySet<string>
    ): { entry: LoadedPart; relationshipId: string } {
        const existingRel: string = section.headerFooterReferenceId(kind, refType);
        if (existingRel !== undefined) {
            const entry: LoadedPart = this.byRelationshipId.get(existingRel);
            if (entry !== undefined) {
                return { entry, relationshipId: existingRel };
            }
        }
        // Include catalog-pending part names so a second allocate on the same kind
        // does not collide with a part already added to the catalog but not yet in the package.
        const catalogPartNameKeys: Set<string> = new Set<string>([...this.entries.keys()].map((n: PartName) => partNameKey(n)));
        const allUsedPartNames: Set<string> = new Set<string>([...usedPartNames, ...catalogPartNameKeys]);
        const partNameValue: PartName = allocatePartName(kind, allUsedPartNames);
        // Accumulate all tried IDs to avoid cycling back to an already-tried value.
        // usedRelIds reflects only package relationships; catalog entries may not be
        // persisted yet, so we must also exclude every ID already in this catalog.
        const allUsedRelIds: Set<string> = new Set<string>([...usedRelIds, ...this.byRelationshipId.keys()]);
        const relId: RelationshipId = allocateRelationshipId(allUsedRelIds);
        const relationshipType: string = kind === 'header' ? HEADER_RELATIONSHIP_TYPE : FOOTER_RELATIONSHIP_TYPE;
        const entry: LoadedPart = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType,
            kind,
            rootExtra: {
                attributes: [],
                namespaceDeclarations: [{ prefix: 'w', namespaceUri: WML_TRANSITIONAL_NAMESPACE }]
            },
            // Always-present section slots stay empty until content is written.
            // setSimpleText / authoring helpers still add paragraphs explicitly.
            blocks: [],
            dirty: true,
            pendingRelationship: {
                id: relId,
                type: relationshipType,
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.entries.set(partNameValue, entry);
        this.byRelationshipId.set(relId, entry);
        this.catalogDirty = true;
        return { entry, relationshipId: relId };
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {boolean} The result.
     * @private
     * Whether a header or footer relationship id is loaded in this catalog.
     */
    hasRelationship(relationshipId: string): boolean {
        return this.byRelationshipId.has(relationshipId);
    }
    /**
     * Part names and live body blocks of every loaded header/footer part.
     *
     * @returns {Object} The result.
     * @private
     */
    partBlocks(): ReadonlyArray<{
        partName: PartName;
        blocks: ReadonlyArray<BlockContent>;
    }> {
        return [...this.entries.values()].map((entry: LoadedPart) => ({ partName: entry.partName, blocks: entry.blocks }));
    }
    /**
     * Relationship ids for loaded parts of the given kind, in catalog order.
     *
     * @param {HeaderFooterType} kind - The kind.
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    relationshipIds(kind: HeaderFooterType): ReadonlyArray<string> {
        const ids: string[] = [];
        for (const entry of this.entries.values()) {
            if (entry.kind === kind) {
                ids.push(entry.relationshipId);
            }
        }
        return ids;
    }
    /**
     * Body items for a header/footer part by relationship id (paragraphs, tables,
     * block content controls, residuals), in document order.
     *
     * Empty when the relationship is missing. When the catalog is document-bound,
     * paragraphs and feature blocks are attached for mutation.
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {ReadonlyArray<BodyItem>} The result.
     * @private
     */
    itemsForRelationship(relationshipId: string): ReadonlyArray<BodyItem> {
        const entry: LoadedPart = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            return [];
        }
        if (this.boundDocument !== undefined) {
            attachEntryParagraphs(this.boundDocument, entry);
        }
        const projected: BodyItem[] = [];
        for (const block of entry.blocks) {
            const item: BodyItem = projectBlockToBodyItem(block);
            if (item !== undefined) {
                projected.push(item);
            }
        }
        return projected;
    }
    /**
     * Modeled paragraphs for a header/footer part by relationship id.
     *
     * Empty when the relationship is missing or has no paragraph blocks.
     * When the catalog is document-bound, paragraphs are attached for mutation.
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {ReadonlyArray<Paragraph>} The result.
     * @private
     */
    paragraphsForRelationship(relationshipId: string): ReadonlyArray<Paragraph> {
        const entry: LoadedPart = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            return [];
        }
        if (this.boundDocument !== undefined) {
            attachEntryParagraphs(this.boundDocument, entry);
        }
        const paragraphs: Paragraph[] = [];
        for (const item of this.itemsForRelationship(relationshipId)) {
            if (isParagraphBodyItem(item)) {
                paragraphs.push(item);
            }
        }
        return paragraphs;
    }
    /**
     * @param {LoadedPart} entry - The entry.
     * @param {string} text - The text.
     * @returns {void} Nothing is returned.
     * @private
     */
    setSimpleText(entry: LoadedPart, text: string): void {
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(entry.relationshipId);
        detachEntryBlocks(entry.blocks);
        if (bound !== undefined) {
            entry.blocks = blocksWithSimpleText(text, bound);
            // Keep Body store in sync without re-dirtying via lifecycle sync.
            bound.replaceItemsSilent(entry.blocks.slice());
        }
        else if (this.boundDocument !== undefined) {
            const owner: HeaderFooterPartOwner = ownerForEntry(this.boundDocument, entry.relationshipId);
            entry.blocks = blocksWithSimpleText(text, owner);
        }
        else {
            entry.blocks = blocksWithSimpleText(text);
        }
        entry.dirty = true;
    }
    /**
     * Replace the body of a loaded part with a single plain-text paragraph.
     *
     * Clears any prior rich body (multiple paragraphs, tables, opaque blocks).
     *
     * @param {string} relationshipId - The relationship id.
     * @param {string} text - The text.
     * @returns {void} Nothing is returned.
     * @throws DocxError `content/invalid-header-footer-reference` when the id is unknown.
     * @private
     */
    setSimpleTextForRelationship(relationshipId: string, text: string): void {
        const entry: LoadedPart = this.requireEntry(relationshipId);
        this.setSimpleText(entry, text);
    }
    /**
     * Insert a body item at `index` in a header/footer part (`0â€¦length` inclusive).
     *
     * Attaches paragraphs and feature blocks when the catalog is document-bound.
     * Returns the same `item` reference for chaining.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {number} index - The index.
     * @param {BodyItem} item - The item.
     * @returns {BodyItem} The result.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError when the relationship id is unknown or the catalog is unbound.
     * @private
     */
    insertBodyItemAtForRelationship(relationshipId: string, index: number, item: BodyItem): BodyItem {
        const document: WordDocument = this.requireBoundDocument();
        const entry: LoadedPart = this.requireEntry(relationshipId);
        if (!isSupportedBodyItem(item)) {
            throw new TypeError('Unsupported body item type');
        }
        // Public index is over projected BodyItem instances (opaque blocks omitted).
        const publicItems: ReadonlyArray<BodyItem> = this.itemsForRelationship(relationshipId);
        if (index < 0 || index > publicItems.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const block: BlockContent = bodyItemToBlock(item);
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
        if (block.type === 'paragraph') {
            // Prefer HeaderFooter Body as paragraph owner when a live view is bound.
            block.paragraph.attach(bound !== undefined ? bound : ownerForEntry(document, relationshipId));
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
        let storeIndex: number;
        if (index === publicItems.length) {
            storeIndex = entry.blocks.length;
        }
        else {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const target: BodyItem = publicItems[index];
            storeIndex = entry.blocks.findIndex((candidate: BlockContent) => {
                const projected: BodyItem = projectBlockToBodyItem(candidate);
                return projected !== undefined && this.publicBodyItemsEqual(projected, target!);
            });
            if (storeIndex < 0) {
                throw new DetachedObjectError('Body item index is inconsistent');
            }
        }
        const next: BlockContent[] = entry.blocks.slice();
        next.splice(storeIndex, 0, block);
        entry.blocks = next;
        entry.dirty = true;
        if (bound !== undefined) {
            // Catalog wrote first; keep Body store identical without re-dirty via sync.
            bound.replaceItemsSilent(entry.blocks.slice());
        }
        return item;
    }
    /**
     * Remove the body item at `index` in a header/footer part (`0â€¦length-1`).
     * Paragraphs detach; feature blocks may release content.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError when the relationship id is unknown.
     * @private
     */
    removeBodyItemAtForRelationship(relationshipId: string, index: number): void {
        const entry: LoadedPart = this.requireEntry(relationshipId);
        const publicItems: ReadonlyArray<BodyItem> = this.itemsForRelationship(relationshipId);
        if (index < 0 || index >= publicItems.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const target: BodyItem = publicItems[index];
        if (target === undefined) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const storeIndex: number = entry.blocks.findIndex((candidate: BlockContent) => {
            const projected: BodyItem = projectBlockToBodyItem(candidate);
            return projected !== undefined && this.publicBodyItemsEqual(projected, target);
        });
        if (storeIndex < 0) {
            throw new DetachedObjectError('Body item index is inconsistent');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const block: BlockContent = entry.blocks[storeIndex];
        if (block === undefined) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const next: BlockContent[] = entry.blocks.slice();
        next.splice(storeIndex, 1);
        entry.blocks = next;
        if (block.type === 'paragraph') {
            block.paragraph.detach();
        }
        else if (block.type === 'feature') {
            releaseFeatureBlockContent(block.value);
        }
        entry.dirty = true;
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
        if (bound !== undefined) {
            bound.replaceItemsSilent(entry.blocks.slice());
        }
    }
    /**
     * Remove a body item from a header/footer part by collection or payload identity.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {BodyItem} item - The item.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError when the item is not in the part.
     * @throws DocxError when the relationship id is unknown.
     * @private
     */
    removeBodyItemForRelationship(relationshipId: string, item: BodyItem): void {
        const entry: LoadedPart = this.requireEntry(relationshipId);
        const at: number = entry.blocks.findIndex((candidate: BlockContent) => {
            const projected: BodyItem = projectBlockToBodyItem(candidate);
            return projected !== undefined && this.publicBodyItemsEqual(projected, item);
        });
        if (at === -1) {
            throw new DetachedObjectError('Body item is not in this header or footer');
        }
        const publicItems: ReadonlyArray<BodyItem> = this.itemsForRelationship(relationshipId);
        let publicIndex: number = -1;
        for (const [i, itemItem] of publicItems.entries()) {
            if (this.publicBodyItemsEqual(itemItem, item)) {
                publicIndex = i;
                break;
            }
        }
        if (publicIndex === -1) {
            throw new DetachedObjectError('Body item is not in this header or footer');
        }
        this.removeBodyItemAtForRelationship(relationshipId, publicIndex);
    }
    /**
     * Append a paragraph to a header/footer part body.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {Object} options - Optional style id and/or initial text (mirrors {@link Body.appendParagraph}).
     * @returns {Paragraph} The result.
     * @throws DocxError when the relationship id is unknown or the catalog is unbound.
     * @private
     */
    appendParagraphForRelationship(relationshipId: string, options?: {
        readonly style?: string;
        readonly text?: string;
    }): Paragraph {
        const document: WordDocument = this.requireBoundDocument();
        const entry: LoadedPart = this.requireEntry(relationshipId);
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
        const owner: HeaderFooter | HeaderFooterPartOwner = bound !== undefined ? bound : ownerForEntry(document, relationshipId);
        const paragraph: Paragraph = new Paragraph(owner);
        this.insertBodyItemAtForRelationship(
            relationshipId,
            this.itemsForRelationship(relationshipId).length,
            paragraph
        );
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
     * Insert an empty paragraph among existing paragraphs of a part.
     * Opaque / non-paragraph siblings keep their relative places.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {number} index - Index in the paragraph list, `0â€¦length` inclusive.
     * @returns {Paragraph} The result.
     * @throws RangeError if `index` is out of range.
     * @throws DocxError when the relationship id is unknown or the catalog is unbound.
     * @private
     */
    insertParagraphForRelationship(relationshipId: string, index: number): Paragraph {
        const document: WordDocument = this.requireBoundDocument();
        this.requireEntry(relationshipId);
        const paragraphs: ReadonlyArray<Paragraph> = this.paragraphsForRelationship(relationshipId);
        if (index < 0 || index > paragraphs.length) {
            throw new RangeError(`Paragraph index ${String(index)} is out of range`);
        }
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
        const owner: HeaderFooter | HeaderFooterPartOwner = bound !== undefined ? bound : ownerForEntry(document, relationshipId);
        const paragraph: Paragraph = new Paragraph(owner);
        if (index === paragraphs.length) {
            this.insertBodyItemAtForRelationship(
                relationshipId,
                this.itemsForRelationship(relationshipId).length,
                paragraph
            );
        }
        else {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const target: Paragraph = paragraphs[index];
            if (target === undefined) {
                throw new RangeError(`Paragraph index ${String(index)} is out of range`);
            }
            const publicItems: ReadonlyArray<BodyItem> = this.itemsForRelationship(relationshipId);
            const at: number = publicItems.findIndex((item: BodyItem) => isParagraphBodyItem(item) && item === target);
            if (at < 0) {
                throw new DetachedObjectError('Paragraph index is inconsistent');
            }
            this.insertBodyItemAtForRelationship(relationshipId, at, paragraph);
        }
        return paragraph;
    }
    /**
     * Remove a paragraph from a header/footer part. Further mutation throws {@link DetachedObjectError}.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {Paragraph} paragraph - The paragraph.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError when the paragraph is not in the part.
     * @throws DocxError when the relationship id is unknown.
     * @private
     */
    removeParagraphForRelationship(relationshipId: string, paragraph: Paragraph): void {
        this.removeBodyItemForRelationship(relationshipId, paragraph);
    }
    /**
     * Remove all body blocks from a header/footer part (empty `w:hdr` / `w:ftr`).
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @throws DocxError when the relationship id is unknown.
     * @private
     */
    clearForRelationship(relationshipId: string): void {
        const entry: LoadedPart = this.requireEntry(relationshipId);
        detachEntryBlocks(entry.blocks);
        entry.blocks = [];
        entry.dirty = true;
        const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
        if (bound !== undefined) {
            bound.replaceItemsSilent([]);
        }
    }
    /**
     * @param {string | undefined} relationshipId - The relationship id.
     * @returns {string | undefined} The result.
     * @private
     */
    textForRelationship(relationshipId: string | undefined): string | undefined {
        if (relationshipId === undefined) {
            return undefined;
        }
        const entry: LoadedPart = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            return undefined;
        }
        return firstParagraphText(entry.blocks);
    }
    /**
     * True when two body items refer to the same payload
     * (paragraph instance, feature value, or opaque XML node).
     *
     * @param {BodyItem} a - The a.
     * @param {BodyItem} b - The b.
     * @returns {boolean} The result.
     */
    private publicBodyItemsEqual(a: BodyItem, b: BodyItem): boolean {
        return a === b;
    }

    private storeBlocksEqual(a: BlockContent, b: BlockContent): boolean {
        if (a.type !== b.type) {
            return false;
        }
        if (a.type === 'paragraph' && b.type === 'paragraph') {
            return a.paragraph === b.paragraph;
        }
        if (a.type === 'feature' && b.type === 'feature') {
            return a.featureId === b.featureId && a.value === b.value;
        }
        if (a.type === 'opaque' && b.type === 'opaque') {
            return a.xml === b.xml;
        }
        return false;
    }
}

/**
 * Bound HeaderFooter instances by relationship id (document-scoped views).
 * Catalog text helpers and Body mutations stay in sync through this map.
 * @private
 */
const boundHeaderFooterByRelId: Map<string, HeaderFooter> = new Map<string, HeaderFooter>();

/**
 * @param {string} relationshipId - The relationship id.
 * @param {HeaderFooter} hf - The hf.
 * @returns {void} Nothing is returned.
 * @private
 */
function registerBoundHeaderFooter(relationshipId: string, hf: HeaderFooter): void {
    if (relationshipId === '') {
        return;
    }
    boundHeaderFooterByRelId.set(relationshipId, hf);
}

/**
 * Keep bound HeaderFooter Body store aligned after catalog-only mutations.
 *
 * @param {string} relationshipId - The relationship id.
 * @param {LoadedPart} entry - The entry.
 * @returns {void} Nothing is returned.
 * @private
 */
function refreshBoundHeaderFooterFromEntry(relationshipId: string, entry: LoadedPart): void {
    const bound: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
    if (bound === undefined) {
        return;
    }
    const document: WordDocument = bound.owningDocument();
    for (const block of entry.blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.attach(bound);
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
    }
    bound.replaceItemsSilent(entry.blocks.slice());
}

/**
 * Attach catalog blocks to a HeaderFooter Body store without marking dirty.
 *
 * @param {WordDocument} document - The document.
 * @param {LoadedPart} entry - The entry.
 * @param {HeaderFooter} hf - The hf.
 * @returns {void} Nothing is returned.
 * @private
 */
function loadCatalogBlocksIntoHeaderFooter(
    document: WordDocument,
    entry: LoadedPart,
    hf: HeaderFooter
): void {
    // Prefer Body as paragraph owner when bound; keeps assertAttached on Body.
    for (const block of entry.blocks) {
        if (block.type === 'paragraph') {
            block.paragraph.attach(hf);
        }
        else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
    }
    hf.replaceItemsSilent(entry.blocks.slice());
}

/**
 * Push HeaderFooter Body store into the catalog entry and mark dirty.
 *
 * @param {WordDocument} document - The document.
 * @param {string} relationshipId - The relationship id.
 * @param {HeaderFooter} hf - The hf.
 * @returns {void} Nothing is returned.
 * @private
 */
function syncHeaderFooterToCatalog(document: WordDocument, relationshipId: string, hf: HeaderFooter): void {
    if (relationshipId === '') {
        return;
    }
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const entry: LoadedPart = catalog.entryForRelationship(relationshipId);
    if (entry === undefined) {
        return;
    }
    // Do not detach: paragraphs remain owned by the HeaderFooter Body.
    entry.blocks = hf.rawBlocks().slice();
    entry.dirty = true;
}

/**
 * Live HeaderFooter for an already-materialized relationship id.
 *
 * @param {WordDocument} document - The document.
 * @param {string} relationshipId - The relationship id.
 * @param {HeaderFooterKind} kind - The kind.
 * @param {HeaderFooterSlotRef} refType - The ref type.
 * @param {DocSection} section - The section.
 * @returns {HeaderFooter} The result.
 * @private
 */
function createHeaderFooterForRelationship(
    document: WordDocument,
    relationshipId: string,
    kind: HeaderFooterKind,
    refType: HeaderFooterSlotRef = 'default',
    section?: DocSection
): HeaderFooter {
    const existing: HeaderFooter = boundHeaderFooterByRelId.get(relationshipId);
    if (existing !== undefined) {
        return existing;
    }
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const entry: LoadedPart = catalog.entryForRelationship(relationshipId);
    const blocks: BlockContent[] = entry !== undefined ? entry.blocks.slice() : [];
    const hf: HeaderFooter = new HeaderFooter(section, kind, refType, blocks, document, relationshipId);
    if (entry !== undefined) {
        loadCatalogBlocksIntoHeaderFooter(document, entry, hf);
    }
    hf.bindLifecycleHandlers(
        () => {
            // Already materialized.
        },
        () => {
            syncHeaderFooterToCatalog(document, hf.relationshipId, hf);
        }
    );
    registerBoundHeaderFooter(relationshipId, hf);
    return hf;
}

/**
 * Lazy always-present header/footer slot bound to a DocSection + ref type.
 * Package part + sectPr reference are created on first content mutation.
 *
 * @param {DocSection} section - The section.
 * @param {HeaderFooterKind} kind - The kind.
 * @param {HeaderFooterSlotRef} refType - The ref type.
 * @returns {HeaderFooter} The result.
 * @private
 */
function createSectionHeaderFooterSlot(
    section: DocSection,
    kind: HeaderFooterKind,
    refType: HeaderFooterSlotRef
): HeaderFooter {
    const document: WordDocument = section.owningDocument();
    const hf: HeaderFooter = new HeaderFooter(section, kind, refType, [], document, '');

    const tryBindExisting: () => void = (): void => {
        if (hf.relationshipId !== '') {
            return;
        }
        const props: DocPageSetup = section.pageSetup;
        if (!(props instanceof PageSetup)) {
            return;
        }
        const relId: string = props.headerFooterReferenceId(kind, refType);
        if (relId === undefined) {
            return;
        }
        const catalog: HeadersFootersCatalog = headersFootersFor(document);
        if (!catalog.hasRelationship(relId)) {
            return;
        }
        hf.bindRelationshipId(relId);
        registerBoundHeaderFooter(relId, hf);
        const entry: LoadedPart = catalog.entryForRelationship(relId);
        if (entry !== undefined) {
            loadCatalogBlocksIntoHeaderFooter(document, entry, hf);
        }
    };

    const ensureBound: () => void = (): void => {
        tryBindExisting();
        if (hf.relationshipId !== '') {
            return;
        }
        const props: PageSetup = ensurePageSetupForSlot(section);
        const catalog: HeadersFootersCatalog = headersFootersFor(document);
        const ensured: { entry: LoadedPart; relationshipId: string; } = catalog.ensurePart(
            kind,
            props,
            refType,
            usedRelationshipIds(document),
            usedPartNameKeys(document)
        );
        props.setHeaderFooterReference(kind, refType, ensured.relationshipId);
        hf.bindRelationshipId(ensured.relationshipId);
        registerBoundHeaderFooter(ensured.relationshipId, hf);
        loadCatalogBlocksIntoHeaderFooter(document, ensured.entry, hf);
    };

    hf.bindLifecycleHandlers(
        () => {
            ensureBound();
        },
        () => {
            if (hf.relationshipId === '') {
                return;
            }
            syncHeaderFooterToCatalog(document, hf.relationshipId, hf);
        }
    );

    tryBindExisting();
    return hf;
}

/**
 * Resolve live {@link PageSetup} on a section for header/footer writes.
 * Final section uses dual-hold ensure; non-final sections seed pageSetup when missing.
 *
 * @param {DocSection} section - The section.
 * @returns {PageSetup} The result.
 * @private
 */
function ensurePageSetupForSlot(section: DocSection): PageSetup {
    const document: WordDocument = section.owningDocument();
    const sections: Sections = document.sections;
    const index: number = sections.indexOf(section);
    const isFinal: boolean = index >= 0 && index === sections.count - 1;

    if (isFinal) {
        const props: PageSetup = ensureFinalSectionProperties(document);
        section.setPageSetup(props);
        return props;
    }

    const existing: DocPageSetup = section.pageSetup;
    if (existing instanceof PageSetup) {
        associatePageSetupDocument(existing, document);
        return existing;
    }

    const seeded: PageSetup = defaultLetterPageSetup();
    associatePageSetupDocument(seeded, document);
    section.setPageSetup(seeded);
    // Dual-hold non-final closer when the body already has a last paragraph.
    const blocks: ReadonlyArray<BlockContent> = section.body.listBlocks();
    for (let i: number = blocks.length - 1; i >= 0; i -= 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const block: BlockContent = blocks[i];
        if (block !== undefined && block.type === 'paragraph') {
            setParagraphSectionBreak(block.paragraph, seeded);
            break;
        }
    }
    return seeded;
}

/**
 * True when `part` is a headers/footers catalog from this module graph or a
 * duplicate published chunk of the same implementation.
 *
 * @param {unknown} part - The part.
 * @returns {*} The result.
 * @private
 */
function isHeadersFootersCatalog(part: unknown): part is HeadersFootersCatalog {
    if (part instanceof HeadersFootersCatalog) {
        return true;
    }
    if (part === null || typeof part !== 'object') {
        return false;
    }
    const candidate: HeadersFootersCatalog & {
        bindDocument?: unknown;
        ensurePart?: unknown;
        setSimpleText?: unknown;
        textForRelationship?: unknown;
        applyToPackage?: unknown;
        [HEADERS_FOOTERS_CATALOG_BRAND]?: unknown;
    } = part as HeadersFootersCatalog & {
        [HEADERS_FOOTERS_CATALOG_BRAND]?: unknown;
        bindDocument?: unknown;
        ensurePart?: unknown;
        setSimpleText?: unknown;
        textForRelationship?: unknown;
        applyToPackage?: unknown;
    };
    // eslint-disable-next-line security/detect-object-injection -- key is the module-private unique symbol brand constant, not user input
    if (candidate[HEADERS_FOOTERS_CATALOG_BRAND] === true) {
        return true;
    }
    // Duck-type fallback for catalogs built before the brand existed.
    return typeof candidate.bindDocument === 'function'
        && typeof candidate.ensurePart === 'function'
        && typeof candidate.setSimpleText === 'function'
        && typeof candidate.textForRelationship === 'function'
        && typeof candidate.applyToPackage === 'function';
}
/**
 * Headers and footers catalog for a document.
 *
 * On a loaded package this is the catalog built from header/footer parts.
 * On a newly authored document there may be no header/footer parts yet, so this
 * function attaches an empty catalog on first use when the feature is registered.
 *
 * Accepts catalogs from either the main entry graph or `@syncfusion/ej2-docx/headers-footers`
 * (duplicate class identity across published chunks).
 *
 * @param {WordDocument} document - The document.
 * @returns {HeadersFootersCatalog} The result.
 * @throws DocxError `feature/not-registered` when the module was not registered.
 * @private
 */
export function headersFootersFor(document: WordDocument): HeadersFootersCatalog {
    const part: FeaturePartState = document.featurePart(HEADERS_FOOTERS);
    if (isHeadersFootersCatalog(part)) {
        part.bindDocument(document);
        return part;
    }
    if (part !== undefined) {
        throw new DocxError('feature/not-registered', 'Headers/footers feature state was replaced with an unexpected part type');
    }
    if (!isFeatureRegistered(HEADERS_FOOTERS)) {
        throw new DocxError('feature/not-registered', 'Headers/footers feature is not registered; call registerHeadersFootersFeature() before use');
    }
    const created: HeadersFootersCatalog = new HeadersFootersCatalog(new Map());
    created.bindDocument(document);
    document.setFeaturePart(HEADERS_FOOTERS, created);
    return created;
}
/**
 * Live {@link HeaderFooter} views for every loaded header part, in catalog order.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<HeaderFooter>} The result.
 * @private
 */
export function headersInDocument(document: WordDocument): ReadonlyArray<HeaderFooter> {
    return headersFootersFor(document)
        .relationshipIds('header')
        .map((relationshipId: string) => createHeaderFooterForRelationship(document, relationshipId, 'header'));
}
/**
 * Live {@link HeaderFooter} views for every loaded footer part, in catalog order.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<HeaderFooter>} The result.
 * @private
 */
export function footersInDocument(document: WordDocument): ReadonlyArray<HeaderFooter> {
    return headersFootersFor(document)
        .relationshipIds('footer')
        .map((relationshipId: string) => createHeaderFooterForRelationship(document, relationshipId, 'footer'));
}
/**
 * Live header linked from a section's `w:headerReference`, when present and loaded.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function headerForSection(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType = 'default'): HeaderFooter | undefined {
    const relationshipId: string = section.headerFooterReferenceId('header', refType);
    if (relationshipId === undefined) {
        return undefined;
    }
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    if (!catalog.hasRelationship(relationshipId)) {
        return undefined;
    }
    return createHeaderFooterForRelationship(document, relationshipId, 'header', refType);
}
/**
 * Live footer linked from a section's `w:footerReference`, when present and loaded.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function footerForSection(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType = 'default'): HeaderFooter | undefined {
    const relationshipId: string = section.headerFooterReferenceId('footer', refType);
    if (relationshipId === undefined) {
        return undefined;
    }
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    if (!catalog.hasRelationship(relationshipId)) {
        return undefined;
    }
    return createHeaderFooterForRelationship(document, relationshipId, 'footer', refType);
}
/**
 * Default header for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function defaultHeader(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return headerForSection(document, section, 'default');
}
/**
 * Default footer for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function defaultFooter(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return footerForSection(document, section, 'default');
}
/**
 * First-page header for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function firstHeader(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return headerForSection(document, section, 'first');
}
/**
 * Even-page header for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function evenHeader(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return headerForSection(document, section, 'even');
}
/**
 * First-page footer for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function firstFooter(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return footerForSection(document, section, 'first');
}
/**
 * Even-page footer for the body-final section, when linked and loaded.
 *
 * @param {WordDocument} document - The document.
 * @returns {HeaderFooter | undefined} The result.
 * @private
 */
export function evenFooter(document: WordDocument): HeaderFooter | undefined {
    const section: PageSetup = finalSection(document);
    if (section === undefined) {
        return undefined;
    }
    return footerForSection(document, section, 'even');
}
function serializeHeaderFooterPart(entry: LoadedPart): Uint8Array {
    const root: OpenXmlElement = wmlElement(rootLocalName(entry.kind), {
        attributes: entry.rootExtra.attributes,
        namespaceDeclarations: entry.rootExtra.namespaceDeclarations,
        children: serializeBodyBlocks(entry.blocks)
    });
    return utf8.encode(serializeXml(root));
}
function allocatePartName(kind: HeaderFooterType, used: ReadonlySet<string>): PartName {
    const stem: string = kind === 'header' ? 'header' : 'footer';
    let index: number = 1;
    while (used.has(partNameKey(partName(`/word/${stem}${String(index)}.xml`)))) {
        index += 1;
    }
    return partName(`/word/${stem}${String(index)}.xml`);
}
function loadCatalog(pkg: OpcPackage, mainPartName: PartName): HeadersFootersCatalog {
    const rels: Relationships = relationshipsForPart(pkg, mainPartName);
    const entries: Map<PartName, LoadedPart> = new Map<PartName, LoadedPart>();
    for (const rel of rels.items) {
        const kind: HeaderFooterKind = kindForRelationshipType(rel.type);
        if (kind === undefined) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, mainPartName);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            continue;
        }
        const loaded: LoadedPart = parseHeaderFooterPart(part, rel, kind);
        if (loaded !== undefined) {
            entries.set(loaded.partName, loaded);
        }
    }
    return new HeadersFootersCatalog(entries);
}
function usedRelationshipIds(document: WordDocument): Set<string> {
    // Package items plus every id already allocated (pending) in any other
    // feature catalog (images, hyperlinks, …) — not just persisted package rels.
    return usedMainDocumentRelationshipIds(document);
}
function usedPartNameKeys(document: WordDocument): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of document.opcPackage().parts) {
        used.add(partNameKey(part.name));
    }
    return used;
}
function sectionForWrite(document: WordDocument): PageSetup {
    const existing: PageSetup = finalSection(document);
    if (existing !== undefined) {
        return existing;
    }
    const seeded: PageSetup = defaultLetterPageSetup();
    // Pin the live model so subsequent header/footer writes keep object identity.
    // Prefer setFinalSection over document.lastSection so feature checks do not
    // depend on module-augmentation merge for the relative WordDocument import.
    setFinalSection(document, seeded);
    return seeded;
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetHeadersFootersFeatureForTests(): void {
    registered = false;
    boundHeaderFooterByRelId.clear();
    resetHeadersFootersSlotFactoryForTests();
    resetHeadersFootersLinkToPreviousHandlersForTests();
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the headers/footers multi-part handler. Idempotent.
 */
export function registerHeadersFootersFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: HEADERS_FOOTERS });
    installSectionHeaderFooterTextWriter({ setSectionHeader, setSectionFooter });
    registerFeatureMultiPartHandler({
        featureId: HEADERS_FOOTERS,
        relationshipTypes: ALL_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): HeadersFootersCatalog {
            return loadCatalog(pkg, ctx.mainPartName);
        }
    });
    registerHeadersFootersSlotFactory({
        createHeader(section: DocSection, refType: HeaderFooterSlotRef): HeaderFooter {
            return createSectionHeaderFooterSlot(section, 'header', refType);
        },
        createFooter(section: DocSection, refType: HeaderFooterSlotRef): HeaderFooter {
            return createSectionHeaderFooterSlot(section, 'footer', refType);
        }
    });
    registerHeadersFootersLinkToPreviousHandlers(
        (section: DocSection, link: boolean) => {
            const props: DocPageSetup = section.pageSetup;
            if (!(props instanceof PageSetup)) {
                return;
            }
            const document: WordDocument = section.owningDocument();
            if (link) {
                props.setHeaderFooterReference('header', 'default', undefined);
                props.setHeaderFooterReference('header', 'first', undefined);
                props.setHeaderFooterReference('header', 'even', undefined);
                props.setHeaderFooterReference('footer', 'default', undefined);
                props.setHeaderFooterReference('footer', 'first', undefined);
                props.setHeaderFooterReference('footer', 'even', undefined);
                return;
            }
            // Materialize empty local parts so the section no longer inherits.
            getOrCreateSectionHeader(document, props, 'default');
            getOrCreateSectionHeader(document, props, 'first');
            getOrCreateSectionHeader(document, props, 'even');
            getOrCreateSectionFooter(document, props, 'default');
            getOrCreateSectionFooter(document, props, 'first');
            getOrCreateSectionFooter(document, props, 'even');
        },
        (section: DocSection) => {
            const props: DocPageSetup = section.pageSetup;
            if (!(props instanceof PageSetup)) {
                return true;
            }
            const hasLocal: boolean =
                props.headerFooterReferenceId('header', 'default') !== undefined
                || props.headerFooterReferenceId('header', 'first') !== undefined
                || props.headerFooterReferenceId('header', 'even') !== undefined
                || props.headerFooterReferenceId('footer', 'default') !== undefined
                || props.headerFooterReferenceId('footer', 'first') !== undefined
                || props.headerFooterReferenceId('footer', 'even') !== undefined;
            return !hasLocal;
        }
    );
}
/**
 * Text from the default header part, when linked from body-final `sectPr`.
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function defaultHeaderText(document: WordDocument): string | undefined {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const section: PageSetup = finalSection(document);
    const relId: string = section == null ? undefined : section.headerFooterReferenceId('header', 'default');
    return catalog.textForRelationship(relId);
}
/**
 * Text from the default footer part, when linked from body-final `sectPr`.
 *
 * @param {WordDocument} document - The document.
 * @returns {string | undefined} The result.
 * @private
 */
export function defaultFooterText(document: WordDocument): string | undefined {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const section: PageSetup = finalSection(document);
    const relId: string = section == null ? undefined : section.headerFooterReferenceId('footer', 'default');
    return catalog.textForRelationship(relId);
}
/**
 * Set default header text, creating the part and `sectPr` reference when needed.
 *
 * @param {WordDocument} document - The document.
 * @param {string} text - The text.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDefaultHeader(document: WordDocument, text: string): void {
    const section: PageSetup = sectionForWrite(document);
    setSectionHeader(document, section, text, 'default');
    setFinalSection(document, section);
}
/**
 * Set default footer text, creating the part and `sectPr` reference when needed.
 *
 * @param {WordDocument} document - The document.
 * @param {string} text - The text.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setDefaultFooter(document: WordDocument, text: string): void {
    const section: PageSetup = sectionForWrite(document);
    setSectionFooter(document, section, text, 'default');
    setFinalSection(document, section);
}
/**
 * Header text linked from a section's `sectPr`.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {string | undefined} The result.
 * @private
 */
export function headerTextForSection(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType = 'default'): string | undefined {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const relId: string = section.headerFooterReferenceId('header', refType);
    return catalog.textForRelationship(relId);
}
/**
 * Footer text linked from a section's `sectPr`.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {string | undefined} The result.
 * @private
 */
export function footerTextForSection(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType = 'default'): string | undefined {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const relId: string = section.headerFooterReferenceId('footer', refType);
    return catalog.textForRelationship(relId);
}
/**
 * Set header text on a section, reusing an existing linked part when present.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {string} text - The text.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setSectionHeader(document: WordDocument, section: PageSetup, text: string, refType: HeaderFooterReferenceType = 'default'): void {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const { entry, relationshipId } = catalog.ensurePart('header', section, refType, usedRelationshipIds(document), usedPartNameKeys(document));
    catalog.setSimpleText(entry, text);
    section.setHeaderFooterReference('header', refType, relationshipId);
}
/**
 * Set footer text on a section, reusing an existing linked part when present.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {string} text - The text.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setSectionFooter(document: WordDocument, section: PageSetup, text: string, refType: HeaderFooterReferenceType = 'default'): void {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const { entry, relationshipId } = catalog.ensurePart('footer', section, refType, usedRelationshipIds(document), usedPartNameKeys(document));
    catalog.setSimpleText(entry, text);
    section.setHeaderFooterReference('footer', refType, relationshipId);
}
/**
 * Link an existing header part to a section without creating a duplicate part.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {string} relationshipId - The relationship id.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function linkSectionHeader(document: WordDocument, section: PageSetup, relationshipId: string, refType: HeaderFooterReferenceType = 'default'): void {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    if (!catalog.hasRelationship(relationshipId)) {
        throw new DocxError('content/invalid-header-footer-reference', `Header/footer relationship ${relationshipId} is not loaded in this document`);
    }
    section.setHeaderFooterReference('header', refType, relationshipId);
}
/**
 * Link an existing footer part to a section without creating a duplicate part.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {string} relationshipId - The relationship id.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function linkSectionFooter(document: WordDocument, section: PageSetup, relationshipId: string, refType: HeaderFooterReferenceType = 'default'): void {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    if (!catalog.hasRelationship(relationshipId)) {
        throw new DocxError('content/invalid-header-footer-reference', `Header/footer relationship ${relationshipId} is not loaded in this document`);
    }
    section.setHeaderFooterReference('footer', refType, relationshipId);
}
/**
 *  @private
 * Require section properties associated with a document (section.pageSetup / document.sections).
 *
 * @param {PageSetup} section - The section.
 * @returns {WordDocument} The result.
 */
function requireAssociatedSectionDocument(section: PageSetup): WordDocument {
    const document: WordDocument = ownerDocumentOf(section);
    if (document === undefined) {
        throw new Error('sections: header/footer association requires section properties associated with a document (use section.pageSetup on a document section)');
    }
    return document;
}
/**
 *  @private
 * Resolve ref type; default slot when omitted.
 *
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooterReferenceType} The result.
 */
function resolveRefType(refType?: HeaderFooterReferenceType): HeaderFooterReferenceType {
    return refType === undefined ? 'default' : refType;
}
/**
 *  @private
 * Ensure a header part + sectPr reference without wiping body text.
 * Unlike {@link setSectionHeader}, does not call setSimpleText.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter} The result.
 */
function getOrCreateSectionHeader(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType): HeaderFooter {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const ensured: { entry: LoadedPart; relationshipId: string; } = catalog.ensurePart('header', section, refType, usedRelationshipIds(document), usedPartNameKeys(document));
    section.setHeaderFooterReference('header', refType, ensured.relationshipId);
    return createHeaderFooterForRelationship(document, ensured.relationshipId, 'header', refType);
}
/**
 *  @private
 * Ensure a footer part + sectPr reference without wiping body text.
 * Unlike {@link setSectionFooter}, does not call setSimpleText.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter} The result.
 */
function getOrCreateSectionFooter(document: WordDocument, section: PageSetup, refType: HeaderFooterReferenceType): HeaderFooter {
    const catalog: HeadersFootersCatalog = headersFootersFor(document);
    const ensured: { entry: LoadedPart; relationshipId: string; } = catalog.ensurePart('footer', section, refType, usedRelationshipIds(document), usedPartNameKeys(document));
    section.setHeaderFooterReference('footer', refType, ensured.relationshipId);
    return createHeaderFooterForRelationship(document, ensured.relationshipId, 'footer', refType);
}
/**
 * Owner-centric header/footer association on document-associated
 * {@link PageSetup}. Attached here (not in sections) to avoid a
 * sections ↔ headers-footers static import cycle. Types merge via module
 * augmentation below.
 *
 * Primary surface is property-based live views:
 * {@link PageSetup.oddHeader} (OOXML `default`),
 * {@link PageSetup.firstPageHeader} (`first`),
 * {@link PageSetup.evenHeader} (`even`), and footer counterparts.
 * Getters get-or-create the part + section reference without wiping body text.
 * Setters accept an existing {@link HeaderFooter}/{@link HeaderFooter} to share a part, or
 * `undefined` to drop this section's reference only.
 *
 * @param {string} name - Accessor name installed on `PageSetup.prototype`.
 * @param {HeaderFooterReferenceType} refType - Reference type (`default`, `first` or `even`).
 * @returns {void}
 */
function defineSectionHeaderFooterProperty(
    name: 'oddHeader' | 'firstPageHeader' | 'evenHeader' | 'oddFooter' | 'firstPageFooter' | 'evenFooter',
    refType: HeaderFooterReferenceType
): void {
    const isHeader: boolean = name.endsWith('Header');
    Object.defineProperty(PageSetup.prototype, name, {
        configurable: true,
        enumerable: false,
        get(this: PageSetup): HeaderFooter {
            const document: WordDocument = requireAssociatedSectionDocument(this);
            return isHeader
                ? getOrCreateSectionHeader(document, this, refType)
                : getOrCreateSectionFooter(document, this, refType);
        },
        set(this: PageSetup, value: HeaderFooter | undefined): void {
            const document: WordDocument = requireAssociatedSectionDocument(this);
            if (value === undefined) {
                this.setHeaderFooterReference(isHeader ? 'header' : 'footer', refType, undefined);
                return;
            }
            if (!(value instanceof HeaderFooter)) {
                throw new DocxError('argument/invalid', `${name} setter expects HeaderFooter | undefined`);
            }
            if (isHeader) {
                if (value.kind !== 'header') {
                    throw new DocxError('argument/invalid', `${name} setter expects a header HeaderFooter`);
                }
                linkSectionHeader(document, this, value.relationshipId, refType);
                return;
            }
            if (value.kind !== 'footer') {
                throw new DocxError('argument/invalid', `${name} setter expects a footer HeaderFooter`);
            }
            linkSectionFooter(document, this, value.relationshipId, refType);
        }
    });
}
defineSectionHeaderFooterProperty('oddHeader', 'default');
defineSectionHeaderFooterProperty('oddFooter', 'default');
defineSectionHeaderFooterProperty('firstPageHeader', 'first');
defineSectionHeaderFooterProperty('firstPageFooter', 'first');
defineSectionHeaderFooterProperty('evenHeader', 'even');
defineSectionHeaderFooterProperty('evenFooter', 'even');
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter | undefined} The result.
 * @deprecated Prefer {@link PageSetup.oddHeader}, {@link PageSetup.firstPageHeader},
 * or {@link PageSetup.evenHeader}. Returns the live header when already linked; does not create.
 */
PageSetup.prototype.header = function (this: PageSetup, refType?: HeaderFooterReferenceType): HeaderFooter | undefined {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    return headerForSection(document, this, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter | undefined} The result.
 * @deprecated Prefer {@link PageSetup.oddFooter}, {@link PageSetup.firstPageFooter},
 * or {@link PageSetup.evenFooter}. Returns the live footer when already linked; does not create.
 */
PageSetup.prototype.footer = function (this: PageSetup, refType?: HeaderFooterReferenceType): HeaderFooter | undefined {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    return footerForSection(document, this, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter} The result.
 * @deprecated Prefer property access (`oddHeader` / `firstPageHeader` / `evenHeader`).
 */
PageSetup.prototype.getOrCreateHeader = function (this: PageSetup, refType?: HeaderFooterReferenceType): HeaderFooter {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    return getOrCreateSectionHeader(document, this, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {HeaderFooter} The result.
 * @deprecated Prefer property access (`oddFooter` / `firstPageFooter` / `evenFooter`).
 */
PageSetup.prototype.getOrCreateFooter = function (this: PageSetup, refType?: HeaderFooterReferenceType): HeaderFooter {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    return getOrCreateSectionFooter(document, this, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooter} header - The header.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @deprecated Prefer assigning `section.oddHeader = header` (or firstPage/even).
 */
PageSetup.prototype.linkHeader = function (this: PageSetup, header: HeaderFooter, refType?: HeaderFooterReferenceType): void {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    linkSectionHeader(document, this, header.relationshipId, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooter} footer - The footer.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @deprecated Prefer assigning `section.oddFooter = footer` (or firstPage/even).
 */
PageSetup.prototype.linkFooter = function (this: PageSetup, footer: HeaderFooter, refType?: HeaderFooterReferenceType): void {
    const document: WordDocument = requireAssociatedSectionDocument(this);
    linkSectionFooter(document, this, footer.relationshipId, resolveRefType(refType));
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @deprecated Prefer `section.oddHeader = undefined` (or firstPage/even).
 */
PageSetup.prototype.removeHeader = function (this: PageSetup, refType?: HeaderFooterReferenceType): void {
    requireAssociatedSectionDocument(this);
    this.setHeaderFooterReference('header', resolveRefType(refType), undefined);
};
/**
 * @param {PageSetup} this - The this.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @deprecated Prefer `section.oddFooter = undefined` (or firstPage/even).
 */
PageSetup.prototype.removeFooter = function (this: PageSetup, refType?: HeaderFooterReferenceType): void {
    requireAssociatedSectionDocument(this);
    this.setHeaderFooterReference('footer', resolveRefType(refType), undefined);
};
declare module '../sections/index' {
    interface PageSetup {
        /**
         * Live odd/default-page header for this section (OOXML `w:type="default"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * Declared as a property (not get/set accessors) for TS 3.3.1 module
         * augmentation compatibility. Runtime still uses defineProperty getters/setters.
         *
         * @public
         */
        oddHeader: HeaderFooter | undefined;
        /**
         * Live odd/default-page footer for this section (OOXML `w:type="default"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @public
         */
        oddFooter: HeaderFooter | undefined;
        /**
         * Live first-page header for this section (OOXML `w:type="first"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @public
         */
        firstPageHeader: HeaderFooter | undefined;
        /**
         * Live first-page footer for this section (OOXML `w:type="first"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @public
         */
        firstPageFooter: HeaderFooter | undefined;
        /**
         * Live even-page header for this section (OOXML `w:type="even"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @public
         */
        evenHeader: HeaderFooter | undefined;
        /**
         * Live even-page footer for this section (OOXML `w:type="even"`).
         * Get creates the part + reference when missing without wiping body content.
         * Set an existing {@link HeaderFooter} to share a part, or `undefined` to drop the reference.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @public
         */
        evenFooter: HeaderFooter | undefined;
        /**
         * Live header linked from this section for `refType`, when present and loaded.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Header slot (`default` | `first` | `even`). Defaults to `default`.
         * @returns {@link HeaderFooter} view, or `undefined` when no reference or part is missing.
         *
         * @deprecated Prefer {@link PageSetup.oddHeader}, {@link PageSetup.firstPageHeader},
         * or {@link PageSetup.evenHeader}.
         * @public
         */
        header(refType?: HeaderFooterReferenceType): HeaderFooter | undefined;
        /**
         * Live footer linked from this section for `refType`, when present and loaded.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Footer slot (`default` | `first` | `even`). Defaults to `default`.
         * @returns {@link HeaderFooter} view, or `undefined` when no reference or part is missing.
         *
         * @deprecated Prefer {@link PageSetup.oddFooter}, {@link PageSetup.firstPageFooter},
         * or {@link PageSetup.evenFooter}.
         * @public
         */
        footer(refType?: HeaderFooterReferenceType): HeaderFooter | undefined;
        /**
         * Return the header for this section slot, creating part + relationship +
         * `w:headerReference` when missing. Does not replace existing body content.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Header slot. Defaults to `default`.
         * @returns Live {@link HeaderFooter} view.
         *
         * @deprecated Prefer property access (`oddHeader` / `firstPageHeader` / `evenHeader`).
         * @public
         */
        getOrCreateHeader(refType?: HeaderFooterReferenceType): HeaderFooter;
        /**
         * Return the footer for this section slot, creating part + relationship +
         * `w:footerReference` when missing. Does not replace existing body content.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Footer slot. Defaults to `default`.
         * @returns Live {@link HeaderFooter} view.
         *
         * @deprecated Prefer property access (`oddFooter` / `firstPageFooter` / `evenFooter`).
         * @public
         */
        getOrCreateFooter(refType?: HeaderFooterReferenceType): HeaderFooter;
        /**
         * Point this section's header slot at an existing {@link HeaderFooter} part
         * (share across sections). Validates the part is in this document's catalog.
         *
         * @param header - Header from this document (e.g. from another section).
         * @param refType - Header slot. Defaults to `default`.
         * @throws DocxError `content/invalid-header-footer-reference` when the
         * relationship is not loaded in this document.
         *
         * @deprecated Prefer assigning `section.oddHeader = header` (or firstPage/even).
         * @public
         */
        linkHeader(header: HeaderFooter, refType?: HeaderFooterReferenceType): void;
        /**
         * Point this section's footer slot at an existing {@link HeaderFooter} part
         * (share across sections). Validates the part is in this document's catalog.
         *
         * @param footer - Footer from this document (e.g. from another section).
         * @param refType - Footer slot. Defaults to `default`.
         * @throws DocxError `content/invalid-header-footer-reference` when the
         * relationship is not loaded in this document.
         *
         * @deprecated Prefer assigning `section.oddFooter = footer` (or firstPage/even).
         * @public
         */
        linkFooter(footer: HeaderFooter, refType?: HeaderFooterReferenceType): void;
        /**
         * Remove this section's header reference for `refType` (inherit / none).
         * Does not delete the OPC part if still referenced elsewhere.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Header slot. Defaults to `default`.
         *
         * @deprecated Prefer `section.oddHeader = undefined` (or firstPage/even).
         * @public
         */
        removeHeader(refType?: HeaderFooterReferenceType): void;
        /**
         * Remove this section's footer reference for `refType` (inherit / none).
         * Does not delete the OPC part if still referenced elsewhere.
         * Requires document association (`section.pageSetup` on a document section).
         *
         * @param refType - Footer slot. Defaults to `default`.
         *
         * @deprecated Prefer `section.oddFooter = undefined` (or firstPage/even).
         * @public
         */
        removeFooter(refType?: HeaderFooterReferenceType): void;
    }
}
/**
 * Set header text on a paragraph section break (`w:pPr/w:sectPr`).
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} text - The text.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setParagraphSectionHeader(document: WordDocument, paragraph: Paragraph, text: string, refType: HeaderFooterReferenceType = 'default'): void {
    let section: PageSetup = paragraphSectionBreak(paragraph);
    if (section === undefined) {
        section = defaultLetterPageSetup();
    }
    setSectionHeader(document, section, text, refType);
    setParagraphSectionBreak(paragraph, section);
}
/**
 * Set footer text on a paragraph section break (`w:pPr/w:sectPr`).
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {string} text - The text.
 * @param {HeaderFooterReferenceType} refType - The ref type.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setParagraphSectionFooter(document: WordDocument, paragraph: Paragraph, text: string, refType: HeaderFooterReferenceType = 'default'): void {
    let section: PageSetup = paragraphSectionBreak(paragraph);
    if (section === undefined) {
        section = defaultLetterPageSetup();
    }
    setSectionFooter(document, section, text, refType);
    setParagraphSectionBreak(paragraph, section);
}
registerAlwaysOnBodyFeatureBootstrap(() => {
    registerHeadersFootersFeature();
});
registerHeadersFootersFeature();
