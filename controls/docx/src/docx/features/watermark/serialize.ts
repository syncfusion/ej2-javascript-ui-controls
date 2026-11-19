/**
 * Dirty watermark header rewrite (TASK-8062).
 *
 * Materializes logical watermark state into section headers on save.
 * Picture media + header-local image relationships are staged as a
 * {@link FeaturePackageLevelPart} applied after header multi-part writes.
 *
 * Canonical emit: `docs/specs/watermark-basic.md`. Washout tokens from
 * PictureWatermark.docx fixture: `gain="19661f"` `blacklevel="22938f"`.
 *
 * @packageDocumentation
 */
import { sha256Hex } from '../../core/compat/sha256';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeaturePackageLevelPart } from '../document/feature-package-level-part';
import { BlockContent, Paragraph } from '../document/paragraph';
import { OpaqueParagraphItem, OpaqueRunItem, ParagraphItem, ConcreteParagraphItem } from '../document/text-range';
import { elementChildren, isWml, wmlElement } from '../document/wml';
import { DocxError } from '../../core/errors/docx-error';
import { objectEntries } from '../../core/compat/object-compat';
import { allocateRelationshipId, partByName, relationshipsForPart, relationshipsWith, resolveInternalTarget, withAddedPart, withContentTypeOverride, withPartRelationships, OpcPackage, OpcRelationship, PackagePart, PartName, RelationshipId } from '../../core/opc/index';
import { partName, partNameKey } from '../../core/opc/part-name';
import { featureId, FeatureId } from '../../core/registry/feature-registry';
import { usedMainDocumentRelationshipIds } from '../../core/registry/multi-part-handlers';
import { parseXml, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import { headersFootersFor, HeadersFootersCatalog } from '../headers-footers/index';
import { IMAGE_RELATIONSHIP_TYPE, JPEG_CONTENT_TYPE, PNG_CONTENT_TYPE, STRICT_IMAGE_RELATIONSHIP_TYPE, ImageType as PackageImageContentType } from '../images/index';
import { sniffImageContentType, sniffImagePixelDimensions } from '../images/image-sniff';
import { finalSection, paragraphSectionBreak, HeaderFooterReferenceType, PageSetup } from '../sections/index';
import { isPictureWatermarkShape, isTextWatermarkShape, isVml, PICTURE_WATERMARK_ID_PREFIX, PICTURE_WATERMARK_TYPE, TEXT_WATERMARK_ID_PREFIX, TEXT_WATERMARK_TYPE, VML_NS } from './detect';
import { ImageType, WatermarkLayout, WatermarkType, PictureWatermark, TextWatermark, WatermarkShapeResidual, Watermark } from './model';
import { logicalWatermarkOf } from './logical-store';
import { ParagraphItemCollection } from '../document/paragraph-item-collection';
import { ParagraphFormatSnapshot } from '../document/paragraph-format';
import { CharacterFormatSnapshot } from '../document/character-format';
import { Relationships } from '../../core/opc/relationships';
import { ContentTypeRecord } from '../../core/opc/content-types';
const WATERMARK: FeatureId = featureId('watermark');
/** Office namespace used for `o:title` / washout attrs on `v:imagedata`. */
const OFFICE_NS: string = 'urn:schemas-microsoft-com:office:office';
/** Relationships namespace for `r:id` on `v:imagedata`. */
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/** Image relationship types (transitional + strict). */
const IMAGE_RELATIONSHIP_TYPES: ReadonlyArray<string> = [
    IMAGE_RELATIONSHIP_TYPE,
    STRICT_IMAGE_RELATIONSHIP_TYPE
];
/** Text fallback dimensions (pt) when width/height unset â€” locked by spec. */
const TEXT_FALLBACK_WIDTH_PT: number = 250;
const TEXT_FALLBACK_HEIGHT_PT: number = 100;
/** Canonical dirty text z-index. */
const TEXT_Z_INDEX: string = '-251658752';
/** Canonical dirty picture z-index. */
const PICTURE_Z_INDEX: string = '-1';
/**
 * Verified Word washout tokens from PictureWatermark.docx fixture
 * (`v:imagedata` gain + blacklevel).
 */
const WASHOUT_GAIN: string = '19661f';
const WASHOUT_BLACKLEVEL: string = '22938f';
/** Header reference types stamped for scratch watermark policy. */
const HEADER_REF_TYPES: ReadonlyArray<HeaderFooterReferenceType> = ['default', 'even', 'first'];
/** Documents whose logical watermark assignment requires header rewrite. */
const dirtyDocuments: WeakSet<WordDocument> = new WeakSet<WordDocument>();
/** Pending media ops keyed by document (also mirrored on feature part). */
interface PendingHeaderImageRel {
    readonly headerPartName: PartName;
    readonly relationship: OpcRelationship;
}
interface PendingMediaPart {
    readonly partName: PartName;
    readonly contentType: PackageImageContentType;
    readonly data: Uint8Array;
}
interface PendingHeaderImageRelFilter {
    readonly headerPartName: PartName;
    /** Relationship ids still referenced from header body markup after rewrite. */
    readonly referencedIds: ReadonlySet<string>;
}
/**
 * Package-level pending state for watermark picture media + header image rels
 * (adds) and post-strip GC (header image rel filters + media removals).
 *
 * Applied in `applyFeaturePackageParts` after HF multi-part writes header XML.
 */
export class WatermarkPackageParts implements FeaturePackageLevelPart {
    private dirtyValue: boolean = false;
    private mediaParts: PendingMediaPart[] = [];
    private headerRels: PendingHeaderImageRel[] = [];
    private headerImageRelFilters: PendingHeaderImageRelFilter[] = [];
    private mediaRemovals: PartName[] = [];
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return this.dirtyValue;
    }
    /**
     * @param {PendingMediaPart} part - The part.
     * @returns {void} Nothing is returned.
     * @private
     * Stage a media part (dedupe by bytes+content type externally).
     */
    stageMedia(part: PendingMediaPart): void {
        this.mediaParts.push(part);
        this.dirtyValue = true;
    }
    /**
     * @param {PartName} headerPartName - The header part name.
     * @param {OpcRelationship} relationship - The relationship.
     * @returns {void} Nothing is returned.
     * @private
     * Stage a header-local image relationship.
     */
    stageHeaderRel(headerPartName: PartName, relationship: OpcRelationship): void {
        this.headerRels.push({ headerPartName, relationship });
        this.dirtyValue = true;
    }
    /**
     * @param {PartName} headerPartName - The header part name.
     * @returns {ReadonlySet<string>} The result.
     * @private
     * Relationship ids staged for a header part (not yet in package).
     * GC must treat these as still referenced so filters do not drop them.
     */
    stagedHeaderRelIds(headerPartName: PartName): ReadonlySet<string> {
        const key: string = partNameKey(headerPartName);
        const ids: Set<string> = new Set<string>();
        for (const item of this.headerRels) {
            if (partNameKey(item.headerPartName) === key) {
                ids.add(item.relationship.id);
            }
        }
        return ids;
    }
    /**
     * @param {PartName} headerPartName - The header part name.
     * @param {ReadonlySet<string>} referencedIds - The referenced ids.
     * @returns {void} Nothing is returned.
     * @private
     * After rewrite, drop header-local image relationships whose ids
     * are no longer referenced in that header's body (Removal rule 7).
     */
    stageHeaderImageRelFilter(headerPartName: PartName, referencedIds: ReadonlySet<string>): void {
        this.headerImageRelFilters.push({ headerPartName, referencedIds });
        this.dirtyValue = true;
    }
    /**
     * @param {PartName} name - The name.
     * @returns {void} Nothing is returned.
     * @private
     * Stage media part removal when package-wide unused (Removal rule 8).
     */
    stageMediaRemoval(name: PartName): void {
        const key: string = partNameKey(name);
        if (this.mediaRemovals.some((existing: PartName) => partNameKey(existing) === key)) {
            return;
        }
        this.mediaRemovals.push(name);
        this.dirtyValue = true;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     * Clear after successful apply.
     */
    clear(): void {
        this.mediaParts = [];
        this.headerRels = [];
        this.headerImageRelFilters = [];
        this.mediaRemovals = [];
        this.dirtyValue = false;
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage): OpcPackage {
        if (!this.dirtyValue) {
            return pkg;
        }
        let next: OpcPackage = pkg;
        for (const media of this.mediaParts) {
            const packagePart: PackagePart = {
                name: media.partName,
                contentType: media.contentType,
                data: media.data
            };
            next = withAddedPart(next, packagePart);
            next = withContentTypeOverride(next, media.partName, media.contentType);
        }
        // Group header rels by part and merge.
        const byHeader: Map<string, { partName: PartName; rels: OpcRelationship[]; }> = new Map<string, {
            partName: PartName;
            rels: OpcRelationship[];
        }>();
        for (const item of this.headerRels) {
            const key: string = partNameKey(item.headerPartName);
            let bucket: { partName: PartName; rels: OpcRelationship[]; } = byHeader.get(key);
            if (bucket === undefined) {
                bucket = { partName: item.headerPartName, rels: [] };
                byHeader.set(key, bucket);
            }
            bucket.rels.push(item.relationship);
        }
        for (const bucket of byHeader.values()) {
            const existing: Relationships = relationshipsForPart(next, bucket.partName);
            const used: Set<RelationshipId> = new Set(existing.items.map((r: OpcRelationship) => r.id));
            const merged: OpcRelationship[] = [...existing.items];
            for (const rel of bucket.rels) {
                if (merged.some((item: OpcRelationship) => item.type === rel.type && item.target === rel.target)) {
                    continue;
                }
                let id: RelationshipId = rel.id;
                while (used.has(id)) {
                    id = allocateRelationshipId(used);
                }
                used.add(id);
                merged.push({ ...rel, id });
            }
            next = withPartRelationships(next, bucket.partName, relationshipsWith(merged, existing.opaque));
        }
        // Drop unused header-local image relationships (rule 7).
        for (const filter of this.headerImageRelFilters) {
            next = withFilteredPartRelationshipsLocal(
                next,
                filter.headerPartName,
                (rel: OpcRelationship) => !isImageRelationshipType(rel.type) || filter.referencedIds.has(rel.id)
            );
        }
        // Drop media only when package-wide unreferenced (rule 8).
        for (const mediaName of this.mediaRemovals) {
            if (mediaPartIsReferenced(next, mediaName)) {
                continue;
            }
            next = withRemovedPartLocal(next, mediaName);
            next = withRemovedContentTypeOverrideLocal(next, mediaName);
        }
        this.clear();
        return next;
    }
}
function isImageRelationshipType(type: string): boolean {
    return IMAGE_RELATIONSHIP_TYPES.indexOf(type) !== -1;
}
function withRemovedPartLocal(pkg: OpcPackage, name: PartName): OpcPackage {
    const key: string = partNameKey(name);
    const parts: PackagePart[] = pkg.parts.filter((part: PackagePart) => partNameKey(part.name) !== key);
    if (parts.length === pkg.parts.length) {
        return pkg;
    }
    return { ...pkg, parts };
}
function withRemovedContentTypeOverrideLocal(pkg: OpcPackage, logicalPartName: PartName): OpcPackage {
    return {
        ...pkg,
        contentTypes: {
            records: pkg.contentTypes.records.filter((record: ContentTypeRecord) => !(record.kind === 'override' && record.partName === logicalPartName))
        }
    };
}
function withFilteredPartRelationshipsLocal(pkg: OpcPackage, source: PartName, keep: (rel: OpcRelationship) => boolean): OpcPackage {
    const existing: Relationships = relationshipsForPart(pkg, source);
    const kept: OpcRelationship[] = existing.items.filter(keep);
    if (kept.length === existing.items.length) {
        return pkg;
    }
    return withPartRelationships(pkg, source, relationshipsWith(kept, existing.opaque));
}
function mediaPartIsReferenced(pkg: OpcPackage, mediaName: PartName): boolean {
    const mediaKey: string = partNameKey(mediaName);
    const check: (rel: OpcRelationship, source?: PartName) => boolean = (rel: OpcRelationship, source?: PartName): boolean => {
        if (rel.targetMode === 'External') {
            return false;
        }
        try {
            // Package Relationships resolve with omitted source (not partName('/')).
            return partNameKey(resolveInternalTarget(rel.target, source)) === mediaKey;
        }
        catch {
            return false;
        }
    };
    for (const rel of pkg.packageRelationships.items) {
        if (check(rel)) {
            return true;
        }
    }
    for (const set of pkg.partRelationships) {
        for (const rel of set.relationships.items) {
            if (check(rel, set.source)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Mark document dirty for watermark materialize.
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function markWatermarkDirty(document: WordDocument): void {
    dirtyDocuments.add(document);
}
/**
 * True when watermark materialize must rewrite headers.
 *
 * @param {WordDocument} document - The document.
 * @returns {boolean} The result.
 * @private
 */
export function isWatermarkDirty(document: WordDocument): boolean {
    return dirtyDocuments.has(document);
}
/**
 * Clear dirty flag (after successful materialize or clean load).
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function clearWatermarkDirty(document: WordDocument): void {
    dirtyDocuments.delete(document);
}
/**
 * Reset module dirty state for tests.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetWatermarkSerializeStateForTests(): void {
    // WeakSet cannot be cleared globally; documents are GC'd. No-op holder for API symmetry.
}
function packagePartsFor(document: WordDocument): WatermarkPackageParts {
    const existing: FeaturePartState = document.featurePart(WATERMARK);
    if (existing instanceof WatermarkPackageParts) {
        return existing;
    }
    const created: WatermarkPackageParts = new WatermarkPackageParts();
    document.setFeaturePart(WATERMARK, created);
    return created;
}
/**
 * Relationship ids already claimed on the main document part: persisted package
 * relationships plus every id already allocated (pending) in any feature
 * catalog (images, hyperlinks, …). Scratch header allocation must not reuse
 * these, otherwise `w:headerReference r:id` can resolve to a non-header
 * relationship and corrupt the package.
 *
 * @param {WordDocument} document - The document.
 * @returns {Set<string>} The result.
 */
function usedRelationshipIds(document: WordDocument): Set<string> {
    return usedMainDocumentRelationshipIds(document);
}
function usedPartNameKeys(document: WordDocument): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of document.opcPackage().parts) {
        used.add(partNameKey(part.name));
    }
    return used;
}
/**
 * Ordered dual-hold section properties: paragraph break bags, then body-final.
 * Internal walk only â€” the public surface is `lastSection` / `sectionBreak`.
 *
 * @param {WordDocument} document - The document.
 * @returns {PageSetup[]} The result.
 */
function sectionPropertiesInDocumentOrder(document: WordDocument): PageSetup[] {
    const out: PageSetup[] = [];
    for (const block of document.listBlocks()) {
        if (block.type !== 'paragraph') {
            continue;
        }
        const breakProps: PageSetup = paragraphSectionBreak(block.paragraph);
        if (breakProps !== undefined) {
            out.push(breakProps);
        }
    }
    const bodyFinal: PageSetup = finalSection(document);
    if (bodyFinal !== undefined) {
        out.push(bodyFinal);
    }
    return out;
}
/**
 * Dual-hold already keeps each `PageSetup` on its break paragraph or
 * body-final slot. Mutating header refs in place is enough for save; no
 * Section-view write-back is required.
 *
 * @param {WordDocument} document - The document.
 * @param {HeadersFootersCatalog} catalog - The catalog.
 * @returns {void} Nothing is returned.
 */
function ensureScratchHeaders(document: WordDocument, catalog: HeadersFootersCatalog): void {
    const usedRelIds: Set<string> = usedRelationshipIds(document);
    const usedPartNames: Set<string> = usedPartNameKeys(document);
    for (const props of sectionPropertiesInDocumentOrder(document)) {
        for (const refType of HEADER_REF_TYPES) {
            const { relationshipId } = catalog.ensurePart('header', props, refType, usedRelIds, usedPartNames);
            props.setHeaderFooterReference('header', refType, relationshipId);
            usedRelIds.add(relationshipId);
        }
    }
}
function shapesUnderPict(pict: OpenXmlElement): OpenXmlElement[] {
    const shapes: OpenXmlElement[] = [];
    for (const child of elementChildren(pict)) {
        if (isVml(child, 'shape')) {
            shapes.push(child);
        }
    }
    return shapes;
}
function pictContainsRecognizedWatermark(pict: OpenXmlElement): boolean {
    for (const shape of shapesUnderPict(pict)) {
        if (isTextWatermarkShape(shape) || isPictureWatermarkShape(shape)) {
            return true;
        }
    }
    return false;
}
function openXmlContainsRecognizedWatermark(node: OpenXmlElement): boolean {
    if (isWml(node, 'pict')) {
        return pictContainsRecognizedWatermark(node);
    }
    for (const child of elementChildren(node)) {
        if (openXmlContainsRecognizedWatermark(child)) {
            return true;
        }
    }
    return false;
}
function isWatermarkOpaqueInline(inline: ParagraphItem): boolean {
    return (
        inline instanceof OpaqueParagraphItem &&
        openXmlContainsRecognizedWatermark(inline.xml)
    );
}
/**
 * True when every remaining item is a watermark opaque (or the paragraph is empty) —
 * i.e. the paragraph is watermark-owned and safely empty after strip (Removal 4).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {boolean} The result.
 */
function isWatermarkOnlyParagraph(paragraph: Paragraph): boolean {
    const content: ParagraphItemCollection = paragraph.items;
    if (content.length === 0) {
        return true;
    }
    return content.every((inline: ConcreteParagraphItem) => isWatermarkOpaqueInline(inline));
}
/** Minimal header entry surface used by strip/GC (avoids exporting HF LoadedPart). */
interface HeaderBodyEntry {
    readonly partName: PartName;
    blocks: BlockContent[];
    dirty: boolean;
}
/**
 * Strip recognized watermark `w:pict` items from a header entry (Removal 1–5).
 *
 * - Opaque watermark paragraph items: filter via paragraph snapshot + hydrate.
 * - Watermark-only empty paragraphs: omit from blocks (never delete header parts).
 * - Tables / non-wm opaque / feature blocks: preserved.
 *
 * @param {HeaderBodyEntry} entry - The entry.
 * @returns {boolean} The result.
 */
function stripEntryWatermarkLeaves(entry: HeaderBodyEntry): boolean {
    const nextBlocks: BlockContent[] = [];
    let changed: boolean = false;
    for (const block of entry.blocks) {
        if (block.type === 'opaque') {
            if (openXmlContainsRecognizedWatermark(block.xml)) {
                changed = true;
                continue;
            }
            nextBlocks.push(block);
            continue;
        }
        if (block.type !== 'paragraph') {
            nextBlocks.push(block);
            continue;
        }
        const paragraph: Paragraph = block.paragraph;
        let strippedWm: boolean = false;
        if (paragraph.items.some(isWatermarkOpaqueInline)) {
            strippedWm = true;
            if (isWatermarkOnlyParagraph(paragraph)) {
                // Removal 4: watermark-owned and safely empty → drop paragraph.
                changed = true;
                continue;
            }
            const snap: {
                extraAttributes: ReadonlyArray<OpenXmlAttribute>;
                styleIdValue: string;
                numIdValue: number;
                listLevelValue: number;
                numPrExtra: OpenXmlElement[];
                sectionBreakSectPr: OpenXmlElement;
                items: ConcreteParagraphItem[];
                paragraphFormat: ParagraphFormatSnapshot;
                breakCharacterFormat: CharacterFormatSnapshot;
            } = paragraph.snapshot();
            const filteredItems: ConcreteParagraphItem[] = snap.items.filter(
                (inline: ConcreteParagraphItem) => !isWatermarkOpaqueInline(inline)
            );
            if (filteredItems.length !== snap.items.length) {
                paragraph.hydrate({ ...snap, items: filteredItems });
                changed = true;
            }
        }
        // After strip, drop paragraphs that only held watermark content.
        if (strippedWm && isWatermarkOnlyParagraph(paragraph)) {
            changed = true;
            continue;
        }
        nextBlocks.push(block);
    }
    if (changed) {
        entry.blocks = nextBlocks;
        entry.dirty = true;
    }
    return changed;
}
/**
 * Collect relationship ids still referenced from header body markup
 * (`r:id` attributes, including `v:imagedata`).
 *
 * @param {HeaderBodyEntry} entry - The entry.
 * @returns {Set<string>} The result.
 */
function collectReferencedRelationshipIds(entry: HeaderBodyEntry): Set<string> {
    const ids: Set<string> = new Set<string>();
    const scan: (node: OpenXmlElement) => void = (node: OpenXmlElement): void => {
        for (const a of node.attributes) {
            if (a.localName === 'id' && (a.namespaceUri === R_NS || a.prefix === 'r')) {
                ids.add(a.value);
            }
            if (a.namespaceUri === R_NS && (a.localName === 'embed' || a.localName === 'link')) {
                ids.add(a.value);
            }
        }
        for (const child of elementChildren(node)) {
            scan(child);
        }
    };
    for (const block of entry.blocks) {
        if (block.type === 'opaque') {
            scan(block.xml);
            continue;
        }
        if (block.type === 'paragraph') {
            for (const inline of block.paragraph.items) {
                if (inline instanceof OpaqueParagraphItem || inline instanceof OpaqueRunItem) {
                    scan(inline.xml);
                }
            }
            try {
                scan(block.paragraph.toOpenXml());
            }
            catch {
                // Detached / incomplete — live scan above is enough.
            }
        }
    }
    return ids;
}
/**
 * Stage header-local image rel GC (rule 7) and package-wide media GC (rule 8)
 * for one unique header after strip/rewrite.
 *
 * @param {WordDocument} document - The document.
 * @param {PartName} headerPartName - The header part name.
 * @param {HeaderBodyEntry} entry - The entry.
 * @param {ReadonlySet<string>} protectedMediaKeys - The protected media keys.
 * @returns {void} Nothing is returned.
 */
function stageHeaderRelationshipGc(
    document: WordDocument,
    headerPartName: PartName,
    entry: HeaderBodyEntry,
    protectedMediaKeys: ReadonlySet<string>
): void {
    const packageParts: WatermarkPackageParts = packagePartsFor(document);
    const referencedIds: Set<string> = collectReferencedRelationshipIds(entry);
    for (const id of packageParts.stagedHeaderRelIds(headerPartName)) {
        referencedIds.add(id);
    }
    packageParts.stageHeaderImageRelFilter(headerPartName, referencedIds);
    const pkg: OpcPackage = document.opcPackage();
    const headerRels: Relationships = relationshipsForPart(pkg, headerPartName);
    for (const rel of headerRels.items) {
        if (!isImageRelationshipType(rel.type)) {
            continue;
        }
        if (referencedIds.has(rel.id)) {
            continue;
        }
        try {
            const target: PartName = resolveInternalTarget(rel.target, headerPartName);
            if (protectedMediaKeys.has(partNameKey(target))) {
                continue;
            }
            if (partByName(pkg, target) === undefined) {
                continue;
            }
            packageParts.stageMediaRemoval(target);
        }
        catch {
            // Invalid target â€” skip.
        }
    }
}
function vAttr(localName: string, value: string): OpenXmlAttribute {
    return { namespaceUri: '', localName, prefix: '', value };
}
function vElement(localName: string, options?: {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly children?: ReadonlyArray<OpenXmlChild>;
    readonly namespaceDeclarations?: OpenXmlElement['namespaceDeclarations'];
}): OpenXmlElement {
    let ts330: any; let ts331: any; let ts332: any;
    return {
        kind: 'element',
        namespaceUri: VML_NS,
        localName,
        prefix: 'v',
        attributes: ((ts330 = options == null ? undefined : options.attributes), ts330 != null ? ts330 : []),
        namespaceDeclarations: ((ts331 = options == null ? undefined : options.namespaceDeclarations), ts331 != null ? ts331 : []),
        children: ((ts332 = options == null ? undefined : options.children), ts332 != null ? ts332 : [])
    };
}
function formatPt(value: number): string {
    if (Number.isInteger(value)) {
        return String(value);
    }
    // Trim excessive float noise while keeping precision for scaled sizes.
    return String(Math.round(value * 1000) / 1000);
}
function textRotationDegrees(model: TextWatermark): number {
    const custom: number = model.getCustomRotationDegrees();
    if (custom !== undefined) {
        return custom;
    }
    return model.layout === WatermarkLayout.Horizontal ? 0 : 315;
}
function textWidthHeight(model: TextWatermark): {
    width: number;
    height: number;
} {
    return {
        width: model.width != null ? model.width : TEXT_FALLBACK_WIDTH_PT,
        height: model.height != null ? model.height : TEXT_FALLBACK_HEIGHT_PT
    };
}
function buildTextStyle(model: TextWatermark): string {
    const { width, height } = textWidthHeight(model);
    const rotation: number = textRotationDegrees(model);
    return [
        'position:absolute',
        'margin-left:0',
        'margin-top:0',
        `width:${formatPt(width)}pt`,
        `height:${formatPt(height)}pt`,
        `rotation:${formatPt(rotation)}`,
        `z-index:${TEXT_Z_INDEX}`,
        'mso-position-horizontal:center',
        'mso-position-horizontal-relative:margin',
        'mso-position-vertical:center',
        'mso-position-vertical-relative:margin'
    ].join(';');
}
function buildTextpathStyle(model: TextWatermark): string {
    const font: string = model.fontName.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `font-family:"${font}";font-size:${formatPt(model.size)}pt`;
}
function mergeResidualShapeAttrs(
    base: OpenXmlAttribute[],
    residual: WatermarkShapeResidual | undefined,
    skip: ReadonlySet<string>
): OpenXmlAttribute[] {
    if ((residual == null ? undefined : residual.extraShapeAttributes) === undefined) {
        return base;
    }
    const out: OpenXmlAttribute[] = [...base];
    const present: Set<string> = new Set(base.map((a: OpenXmlAttribute) => a.localName));
    for (const [name, value] of objectEntries(residual.extraShapeAttributes)) {
        if (skip.has(name) || present.has(name)) {
            continue;
        }
        out.push(vAttr(name, value));
        present.add(name);
    }
    return out;
}
function residualExtraChildren(residual: WatermarkShapeResidual | undefined): OpenXmlChild[] {
    if ((residual == null ? undefined : residual.extraChildXml) === undefined || residual.extraChildXml.length === 0) {
        return [];
    }
    const children: OpenXmlChild[] = [];
    for (const xml of residual.extraChildXml) {
        try {
            children.push(parseXml(xml));
        }
        catch {
            // Skip unparsable residual fragments rather than fail save.
        }
    }
    return children;
}
function buildTextPict(model: TextWatermark, shapeId: string): OpenXmlElement {
    const residual: WatermarkShapeResidual = model.getParseResidual();
    const skip: Set<string> = new Set([
        'id',
        'type',
        'style',
        'fillcolor',
        'stroked',
        'filled'
    ]);
    const attrs: OpenXmlAttribute[] = mergeResidualShapeAttrs([
        vAttr('id', shapeId),
        vAttr('type', TEXT_WATERMARK_TYPE),
        vAttr('style', buildTextStyle(model)),
        vAttr('fillcolor', model.color),
        vAttr('stroked', 'f')
    ], residual, skip);
    const children: OpenXmlChild[] = [];
    // Dirty opacity: true â†’ exact .5; false â†’ verified full opacity="1" (overrides residual
    // transparency and round-trips through parse as Opaque, not Unknown/absent).
    if (model.semitransparent) {
        children.push(vElement('fill', { attributes: [vAttr('opacity', '.5')] }));
    }
    else {
        children.push(vElement('fill', { attributes: [vAttr('opacity', '1')] }));
    }
    children.push(vElement('textpath', {
        attributes: [
            vAttr('on', 't'),
            vAttr('string', model.text),
            vAttr('style', buildTextpathStyle(model))
        ]
    }));
    // Residual extra children that are not fill/textpath (already owned).
    for (const child of residualExtraChildren(residual)) {
        if (child.kind === 'element' && isVml(child, 'fill')) {
            // Owned by dirty semitransparent path â€” skip residual fill when dirty controls opacity.
            continue;
        }
        if (child.kind === 'element' && isVml(child, 'textpath')) {
            continue;
        }
        children.push(child);
    }
    const shape: OpenXmlElement = vElement('shape', {
        attributes: attrs,
        children,
        namespaceDeclarations: [
            { prefix: 'v', namespaceUri: VML_NS },
            { prefix: 'o', namespaceUri: OFFICE_NS },
            { prefix: 'r', namespaceUri: R_NS }
        ]
    });
    return wmlElement('pict', { children: [shape] });
}
function pictureBaseSizePt(model: PictureWatermark): {
    width: number;
    height: number;
} {
    const bytes: Uint8Array = model.imageData;
    if (bytes !== undefined) {
        const pixels: { width: number; height: number; } = sniffImagePixelDimensions(bytes);
        if (pixels !== undefined) {
            // 96 DPI: px * 72/96 = px * 0.75
            return { width: pixels.width * 0.75, height: pixels.height * 0.75 };
        }
    }
    // Fallback when dimensions unknown.
    return { width: 100, height: 100 };
}
/**
 * Scaling matrix (requirement):
 * - neither explicit W/H â†’ base * scaling/100
 * - only width â†’ width + height from aspect (no scale on width)
 * - only height â†’ symmetric
 * - both explicit â†’ neither scaled
 *
 * @param {PictureWatermark} model - The model.
 * @returns {Object} The result.
 */
function pictureWidthHeight(model: PictureWatermark): {
    width: number;
    height: number;
} {
    const base: { width: number; height: number; } = pictureBaseSizePt(model);
    const explicitWidth: number = model.width;
    const explicitHeight: number = model.height;
    if (explicitWidth !== undefined && explicitHeight !== undefined) {
        return { width: explicitWidth, height: explicitHeight };
    }
    if (explicitWidth !== undefined) {
        const aspect: number = base.height / (base.width === 0 ? 1 : base.width);
        return { width: explicitWidth, height: explicitWidth * aspect };
    }
    if (explicitHeight !== undefined) {
        const aspect: number = base.width / (base.height === 0 ? 1 : base.height);
        return { width: explicitHeight * aspect, height: explicitHeight };
    }
    const scale: number = model.scaling / 100;
    return { width: base.width * scale, height: base.height * scale };
}
function buildPictureStyle(model: PictureWatermark): string {
    const { width, height } = pictureWidthHeight(model);
    return [
        'position:absolute',
        'margin-left:0',
        'margin-top:0',
        `width:${formatPt(width)}pt`,
        `height:${formatPt(height)}pt`,
        `z-index:${PICTURE_Z_INDEX}`,
        'mso-position-horizontal:center',
        'mso-position-horizontal-relative:margin',
        'mso-position-vertical:center',
        'mso-position-vertical-relative:margin'
    ].join(';');
}
function resolvePictureContentType(model: PictureWatermark): PackageImageContentType {
    const bytes: Uint8Array = model.imageData;
    if (bytes === undefined || bytes.byteLength === 0) {
        throw new DocxError('content/invalid-image', 'Picture watermark has no image bytes to serialize');
    }
    const sniffed: PackageImageContentType = sniffImageContentType(bytes);
    if (sniffed !== undefined) {
        return sniffed;
    }
    if (model.imageType === ImageType.Jpeg) {
        return JPEG_CONTENT_TYPE;
    }
    if (model.imageType === ImageType.Png) {
        return PNG_CONTENT_TYPE;
    }
    throw new DocxError('content/invalid-image', 'Picture watermark image bytes are not a supported JPEG or PNG payload');
}
function sha256(data: Uint8Array): string {
    return sha256Hex(data);
}
function allocateImagePartName(contentType: PackageImageContentType, used: ReadonlySet<string>): PartName {
    const ext: string = contentType === JPEG_CONTENT_TYPE ? 'jpeg' : 'png';
    let index: number = 1;
    while (used.has(partNameKey(partName(`/word/media/image${String(index)}.${ext}`)))) {
        index += 1;
    }
    return partName(`/word/media/image${String(index)}.${ext}`);
}
function relativeMediaTarget(partNameValue: PartName): string {
    // Header is under /word/; media target is relative: media/imageN.ext
    return partNameValue.slice('/word/'.length);
}
function buildPicturePict(model: PictureWatermark, shapeId: string, imageRelId: string): OpenXmlElement {
    const residual: WatermarkShapeResidual = model.getParseResidual();
    const skip: Set<string> = new Set(['id', 'type', 'style', 'filled', 'stroked', 'fillcolor']);
    const attrs: OpenXmlAttribute[] = mergeResidualShapeAttrs([
        vAttr('id', shapeId),
        vAttr('type', PICTURE_WATERMARK_TYPE),
        vAttr('style', buildPictureStyle(model)),
        vAttr('filled', 'f'),
        vAttr('stroked', 'f')
    ], residual, skip);
    const imageAttrs: OpenXmlAttribute[] = [
        { namespaceUri: R_NS, localName: 'id', prefix: 'r', value: imageRelId },
        { namespaceUri: OFFICE_NS, localName: 'title', prefix: 'o', value: '' }
    ];
    if (model.washout) {
        imageAttrs.push(vAttr('gain', WASHOUT_GAIN));
        imageAttrs.push(vAttr('blacklevel', WASHOUT_BLACKLEVEL));
    }
    const children: OpenXmlChild[] = [
        vElement('imagedata', { attributes: imageAttrs })
    ];
    for (const child of residualExtraChildren(residual)) {
        if (child.kind === 'element' && isVml(child, 'imagedata')) {
            continue;
        }
        children.push(child);
    }
    const shape: OpenXmlElement = vElement('shape', {
        attributes: attrs,
        children,
        namespaceDeclarations: [
            { prefix: 'v', namespaceUri: VML_NS },
            { prefix: 'o', namespaceUri: OFFICE_NS },
            { prefix: 'r', namespaceUri: R_NS }
        ]
    });
    return wmlElement('pict', { children: [shape] });
}
function collectUsedShapeIds(catalog: HeadersFootersCatalog): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const relId of catalog.relationshipIds('header')) {
        const entry: HeaderBodyEntry = catalog.entryForRelationship(relId);
        if (entry === undefined) {
            continue;
        }
        const scan: (node: OpenXmlElement) => void = (node: OpenXmlElement): void => {
            if (isVml(node, 'shape')) {
                const idAttr: OpenXmlAttribute = node.attributes.find((a: OpenXmlAttribute) => a.localName === 'id');
                if (idAttr !== undefined) {
                    used.add(idAttr.value);
                }
            }
            for (const child of elementChildren(node)) {
                scan(child);
            }
        };
        for (const block of entry.blocks) {
            if (block.type === 'opaque') {
                scan(block.xml);
            }
            else if (block.type === 'paragraph') {
                for (const inline of block.paragraph.items) {
                    if (inline instanceof OpaqueParagraphItem || inline instanceof OpaqueRunItem) {
                        scan(inline.xml);
                    }
                }
            }
        }
    }
    return used;
}
function allocateShapeId(prefix: string, used: Set<string>): string {
    let n: number = 1;
    while (used.has(`${prefix}${String(n)}`)) {
        n += 1;
    }
    const id: string = `${prefix}${String(n)}`;
    used.add(id);
    return id;
}
function appendWatermarkPict(catalog: HeadersFootersCatalog, relationshipId: string, pict: OpenXmlElement): void {
    const paragraph: Paragraph = catalog.appendParagraphForRelationship(relationshipId);
    paragraph.appendParagraphItem(new OpaqueParagraphItem(pict));
}
interface SharedPictureMedia {
    readonly relIdByHeaderPartKey: Map<string, RelationshipId>;
    readonly contentType: PackageImageContentType;
    readonly data: Uint8Array;
    readonly mediaPartName: PartName;
}
function preparePictureMedia(
    document: WordDocument,
    model: PictureWatermark,
    headerPartNames: ReadonlyArray<PartName>
): SharedPictureMedia {
    const contentType: PackageImageContentType = resolvePictureContentType(model);
    const data: Uint8Array = model.imageData;
    if (data === undefined || data.byteLength === 0) {
        throw new DocxError('content/invalid-image', 'Picture watermark has no image bytes to serialize');
    }
    const pkg: OpcPackage = document.opcPackage();
    const usedPartNames: Set<string> = usedPartNameKeys(document);
    // Dedupe: reuse existing media part with same hash+content type when present.
    const hash: string = sha256(data);
    let mediaPartName: PartName | undefined;
    for (const part of pkg.parts) {
        if (part.contentType !== contentType) {
            continue;
        }
        if (!String(part.name).includes('/word/media/')) {
            continue;
        }
        if (part.data.byteLength === data.byteLength && sha256(part.data) === hash) {
            mediaPartName = part.name;
            break;
        }
    }
    const packageParts: WatermarkPackageParts = packagePartsFor(document);
    if (mediaPartName === undefined) {
        mediaPartName = allocateImagePartName(contentType, usedPartNames);
        usedPartNames.add(partNameKey(mediaPartName));
        packageParts.stageMedia({ partName: mediaPartName, contentType, data });
    }
    const relIdByHeaderPartKey: Map<string, RelationshipId> = new Map<string, RelationshipId>();
    const target: string = relativeMediaTarget(mediaPartName);
    for (const headerPartName of headerPartNames) {
        const key: string = partNameKey(headerPartName);
        if (relIdByHeaderPartKey.has(key)) {
            continue;
        }
        const existingRels: Relationships = relationshipsForPart(pkg, headerPartName);
        const match: OpcRelationship = existingRels.items.find(
            (r: OpcRelationship) => r.type === IMAGE_RELATIONSHIP_TYPE && r.target === target
        );
        let relId: RelationshipId;
        if (match !== undefined) {
            relId = match.id;
        }
        else {
            const used: Set<RelationshipId> = new Set<RelationshipId>(existingRels.items.map((r: OpcRelationship) => r.id));
            // Also reserve ids already staged for this header.
            for (const id of relIdByHeaderPartKey.values()) {
                used.add(id);
            }
            relId = allocateRelationshipId(used);
            const relationship: OpcRelationship = {
                id: relId,
                type: IMAGE_RELATIONSHIP_TYPE,
                target,
                extraAttributes: [],
                children: []
            };
            packageParts.stageHeaderRel(headerPartName, relationship);
        }
        relIdByHeaderPartKey.set(key, relId);
    }
    return { relIdByHeaderPartKey, contentType, data, mediaPartName };
}
function uniqueHeaderEntries(document: WordDocument, catalog: HeadersFootersCatalog): {
    relationshipId: string;
    partName: PartName;
}[] {
    const seen: Set<string> = new Set<string>();
    const out: {
        relationshipId: string;
        partName: PartName;
    }[] = [];
    for (const props of sectionPropertiesInDocumentOrder(document)) {
        for (const refType of HEADER_REF_TYPES) {
            const relId: string = props.headerFooterReferenceId('header', refType);
            if (relId === undefined) {
                continue;
            }
            const entry: HeaderBodyEntry = catalog.entryForRelationship(relId);
            if (entry === undefined) {
                continue;
            }
            const key: string = partNameKey(entry.partName);
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            out.push({ relationshipId: relId, partName: entry.partName });
        }
    }
    return out;
}
/**
 * Materialize dirty logical watermark into header parts.
 *
 * Called from the feature materialize handler before multi-part apply.
 *
 * - Assign/replace (`logical` defined): ensure scratch headers, strip recognized
 *   watermark leaves, append canonical text/picture markup, stage image-rel/media GC.
 * - Remove (`logical` undefined): strip recognized watermark leaves from existing
 *   unique headers only (no new scratch headers), stage GC (Removal 1â€“10).
 *
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
export function materializeWatermarks(document: WordDocument): void {
    let ts333: any;
    if (!isWatermarkDirty(document)) {
        return;
    }
    let catalog: HeadersFootersCatalog;
    try {
        catalog = headersFootersFor(document);
    }
    catch {
        // HF not registered â€” cannot materialize; leave dirty for honest failure on save paths that need it.
        return;
    }
    const logical: Watermark = logicalWatermarkOf(document);
    // Assign/replace needs scratch headers; remove-only rewrites existing headers.
    if (logical !== undefined) {
        ensureScratchHeaders(document, catalog);
    }
    const headers: { relationshipId: string; partName: PartName; }[] = uniqueHeaderEntries(document, catalog);
    const usedShapeIds: Set<string> = collectUsedShapeIds(catalog);
    const protectedMediaKeys: Set<string> = new Set<string>();
    // Strip recognized watermark leaves from each unique header once.
    for (const header of headers) {
        const entry: HeaderBodyEntry = catalog.entryForRelationship(header.relationshipId);
        if (entry === undefined) {
            continue;
        }
        stripEntryWatermarkLeaves(entry);
    }
    if (logical === undefined) {
        // Remove path: strip + GC only (rules 1â€“10); never delete header parts (rule 9).
        for (const header of headers) {
            const entry: HeaderBodyEntry = catalog.entryForRelationship(header.relationshipId);
            if (entry === undefined) {
                continue;
            }
            stageHeaderRelationshipGc(document, header.partName, entry, protectedMediaKeys);
        }
        clearWatermarkDirty(document);
        return;
    }
    if (logical.type === WatermarkType.TextWatermark) {
        const text: TextWatermark = logical as TextWatermark;
        for (const header of headers) {
            const shapeId: string = allocateShapeId(TEXT_WATERMARK_ID_PREFIX, usedShapeIds);
            const pict: OpenXmlElement = buildTextPict(text, shapeId);
            appendWatermarkPict(catalog, header.relationshipId, pict);
        }
        for (const header of headers) {
            const entry: HeaderBodyEntry = catalog.entryForRelationship(header.relationshipId);
            if (entry === undefined) {
                continue;
            }
            stageHeaderRelationshipGc(document, header.partName, entry, protectedMediaKeys);
        }
        clearWatermarkDirty(document);
        return;
    }
    // Only remaining public watermark kind is picture (WatermarkType.PictureWatermark).
    const picture: PictureWatermark = logical as PictureWatermark;
    const media: SharedPictureMedia = preparePictureMedia(
        document,
        picture,
        headers.map((h: { relationshipId: string; partName: PartName }) => h.partName)
    );
    protectedMediaKeys.add(partNameKey(media.mediaPartName));
    for (const header of headers) {
        const shapeId: string = allocateShapeId(PICTURE_WATERMARK_ID_PREFIX, usedShapeIds);
        const relId: RelationshipId =
            ((ts333 = media.relIdByHeaderPartKey.get(partNameKey(header.partName))),
            ts333 != null ? ts333 : media.relIdByHeaderPartKey.values().next().value);
        if (relId === undefined) {
            throw new DocxError('content/invalid-image', 'Picture watermark failed to allocate a header image relationship');
        }
        const pict: OpenXmlElement = buildPicturePict(picture, shapeId, relId);
        appendWatermarkPict(catalog, header.relationshipId, pict);
    }
    for (const header of headers) {
        const entry: HeaderBodyEntry = catalog.entryForRelationship(header.relationshipId);
        if (entry === undefined) {
            continue;
        }
        stageHeaderRelationshipGc(document, header.partName, entry, protectedMediaKeys);
    }
    clearWatermarkDirty(document);
}
/**
 * Load empty/clean package parts for registration.
 *
 * @param {OpcPackage} _pkg - The  pkg.
 * @returns {WatermarkPackageParts} The result.
 * @private
 */
export function loadWatermarkPackageParts(_pkg: OpcPackage): WatermarkPackageParts {
    void _pkg;
    return new WatermarkPackageParts();
}
