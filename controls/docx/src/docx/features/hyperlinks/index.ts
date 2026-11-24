import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { WordDocument, FeaturePartState } from '../document/document';
import { FeatureInline } from '../document/feature-inline';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { Paragraph } from '../document/paragraph';
import {
    FeatureInlineParagraphItem,
    ParagraphItem,
    TextRange,
    serializeTextRange
} from '../document/text-range';
import { elementChildren, isWml, wmlAttr, wmlElement, WML } from '../document/wml';
import { allocateRelationshipId, relationshipsWith, TargetMode, OpcRelationship, RelationshipId, Relationships } from '../../core/opc/relationships';
import { relationshipsForPart, withPartRelationships, OpcPackage } from '../../core/opc/package';
import { partName, PartName } from '../../core/opc/part-name';
import { featureId, isFeatureRegistered, registerFeature, registerFeatureInlineHandler, registerFeatureMaterializeHandler, registerFeatureMultiPartHandler, usedMainDocumentRelationshipIds, visitParagraphsInDocumentOrder } from '../../core/registry/index';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { FeatureId } from '../../core/registry/feature-registry';
const HYPERLINKS: FeatureId = featureId('hyperlinks');
/**
 * @private
 * Transitional hyperlink relationship (ECMA-376-4 §9.2.1). */
export const HYPERLINK_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';
/**
 * @private
 * Strict hyperlink relationship. */
export const STRICT_HYPERLINK_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/hyperlink';
const HYPERLINK_RELATIONSHIP_TYPES: string[] = [
    HYPERLINK_RELATIONSHIP_TYPE,
    STRICT_HYPERLINK_RELATIONSHIP_TYPE
];
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/**
 * Options when appending an external hyperlink via {@link Paragraph.appendHyperlink}.
 *
 * @public
 */
export interface ExternalHyperlinkOptions {
    /**
     * Gets the tooltip text displayed when the pointer rests on the hyperlink.
     */
    readonly tooltip?: string | undefined;
    /**
     * Gets the anchor (bookmark name or location) within the hyperlink target.
     */
    readonly anchor?: string | undefined;
}
type HyperlinkInlineItem = {
    readonly type: 'textRange';
    readonly run: TextRange;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};
interface HyperlinkRelationshipEntry {
    readonly relationshipId: RelationshipId;
    readonly target: string;
    readonly relationshipType: string;
    pendingRelationship: OpcRelationship | undefined;
}
class HyperlinkRunOwner {
    private runs: TextRange[] = [];
    assertAttachedItem(target: ParagraphItem): void {
        if (!(target instanceof TextRange) || this.runs.indexOf(target) < 0) {
            throw new DetachedObjectError('This run is no longer in its hyperlink');
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
function relIdAttribute(el: OpenXmlElement): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === R_NS && a.localName === 'id')), ts330 == null ? undefined : ts330.value);
}
function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    let ts331: any;
    return ((ts331 = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && (a.namespaceUri === WML || a.namespaceUri === ''))), ts331 == null ? undefined : ts331.value);
}
function mergePendingRelationships(
    existing: ReturnType<typeof relationshipsForPart>,
    add: ReadonlyArray<OpcRelationship>
): ReturnType<typeof relationshipsWith> {
    if (add.length === 0) {
        return existing;
    }
    const used: Set<RelationshipId> = new Set(existing.items.map((item: OpcRelationship) => item.id));
    const next: OpcRelationship[] = [...existing.items];
    for (const rel of add) {
        let id: RelationshipId = rel.id;
        while (used.has(id)) {
            id = allocateRelationshipId(used);
        }
        used.add(id);
        next.push({ ...rel, id });
    }
    return relationshipsWith(next, existing.opaque);
}
function parseOnOffAttribute(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw === '0' || raw === 'false') {
        return raw === undefined ? undefined : false;
    }
    return true;
}
/**
 * Represents a hyperlink in a paragraph.
 *
 * The display content is available through {@link Hyperlink.runs}. Use {@link hyperlinkTarget} with the owning {@link WordDocument} to resolve the external URL.
 *
 * @public
 */
export class Hyperlink implements FeatureInline {
    private readonly runOwner: HyperlinkRunOwner;
    private readonly items: HyperlinkInlineItem[];
    private relationshipIdValue: string | undefined;
    /**
     * Gets the anchor (bookmark name or location) within the hyperlink target.
     *
     * @public
     */
    readonly anchor: string | undefined;
    /**
     * Gets the tooltip text displayed when the pointer rests on the hyperlink.
     *
     * @public
     */
    readonly tooltip: string | undefined;
    /**
     * @private
     * Location in target document (`w:docLocation`); preserved. */
    readonly docLocation: string | undefined;
    /**
     * @private
     * Target frame (`w:tgtFrame`); preserved. */
    readonly tgtFrame: string | undefined;
    /**
     * @private
     * Whether the target is added to browser history (`w:history`). */
    readonly history: boolean | undefined;
    /**
     * @param {HyperlinkRunOwner} runOwner - The run owner.
     * @param {HyperlinkInlineItem[]} items - The items.
     * @param {string | undefined} relationshipId - The relationship id.
     * @param {string | undefined} anchor - The anchor.
     * @param {string | undefined} tooltip - The tooltip.
     * @param {string | undefined} docLocation - The doc location.
     * @param {string | undefined} tgtFrame - The tgt frame.
     * @param {boolean | undefined} history - The history.
     * @private
     */
    constructor(
        runOwner: HyperlinkRunOwner,
        items: HyperlinkInlineItem[],
        relationshipId: string | undefined,
        anchor: string | undefined,
        tooltip: string | undefined,
        docLocation: string | undefined,
        tgtFrame: string | undefined,
        history: boolean | undefined
    ) {
        this.runOwner = runOwner;
        this.items = items;
        this.relationshipIdValue = relationshipId;
        this.anchor = anchor;
        this.tooltip = tooltip;
        this.docLocation = docLocation;
        this.tgtFrame = tgtFrame;
        this.history = history;
    }
    /**
     * Creates a detached copy with its own runs. The copy keeps the same relationship id until
     * it is remapped into another document.
     *
     * @returns {Hyperlink} The copy.
     * @private
     */
    clone(): Hyperlink {
        const owner: HyperlinkRunOwner = new HyperlinkRunOwner();
        const runs: TextRange[] = [];
        const items: HyperlinkInlineItem[] = this.items.map((item: HyperlinkInlineItem): HyperlinkInlineItem => {
            if (item.type === 'textRange') {
                const run: TextRange = item.run.clone();
                runs.push(run);
                return { type: 'textRange', run };
            }
            return item;
        });
        owner.hydrateRuns(runs);
        return new Hyperlink(
            owner, items, this.relationshipIdValue, this.anchor, this.tooltip, this.docLocation, this.tgtFrame, this.history);
    }
    /**
     * @private
     * External relationship id (`r:id`) when present. */
    get relationshipId(): string | undefined {
        return this.relationshipIdValue;
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     */
    resolveRelationshipId(relationshipId: string): void {
        this.relationshipIdValue = relationshipId;
    }
    /**
     * Gets the visible text runs inside the hyperlink, in document order.
     *
     * @public
     */
    get runs(): ReadonlyArray<TextRange> {
        return this.runOwner.listRuns();
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    releaseContent(): void {
        this.runOwner.detachRuns();
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [];
        if (this.tgtFrame !== undefined) {
            attributes.push(wmlAttr('tgtFrame', this.tgtFrame));
        }
        if (this.tooltip !== undefined) {
            attributes.push(wmlAttr('tooltip', this.tooltip));
        }
        if (this.docLocation !== undefined) {
            attributes.push(wmlAttr('docLocation', this.docLocation));
        }
        if (this.history !== undefined) {
            attributes.push(wmlAttr('history', this.history ? '1' : '0'));
        }
        if (this.anchor !== undefined) {
            attributes.push(wmlAttr('anchor', this.anchor));
        }
        if (this.relationshipIdValue !== undefined) {
            attributes.push({
                namespaceUri: R_NS,
                localName: 'id',
                prefix: 'r',
                value: this.relationshipIdValue
            });
        }
        // Emit children from `items` only (document order). Opaque non-run children are
        // stored once in items — do not also prepend a separate extras list (would duplicate).
        const children: OpenXmlElement[] = [];
        for (const item of this.items) {
            if (item.type === 'textRange') {
                children.push(serializeTextRange(item.run));
            }
            else {
                children.push(item.xml);
            }
        }
        return wmlElement('hyperlink', { attributes, children });
    }
}
/**
 * Hyperlink relationships on the Main Document part.
 *
 * @private
 * Catalog of hyperlink relationships; not part of the stable public surface.
 * @private
 */
export class HyperlinksCatalog implements FeatureMultiPackagePart {
    private readonly byRelationshipId: Map<string, HyperlinkRelationshipEntry>;
    private readonly pendingRemovals: string[];
    private readonly pendingExternal: Map<Hyperlink, {
        readonly target: string;
        readonly relationshipType: string;
    }>;
    private dirty: boolean;
    /**
     * @param {Map<string, HyperlinkRelationshipEntry>} byRelationshipId - The by relationship id.
     * @param {boolean} dirty - The dirty.
     * @private
     */
    constructor(byRelationshipId: Map<string, HyperlinkRelationshipEntry>, dirty: boolean) {
        this.byRelationshipId = byRelationshipId;
        this.pendingRemovals = [];
        this.pendingExternal = new Map();
        this.dirty = dirty;
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeEntry(relationshipId: string): void {
        if (!this.byRelationshipId.has(relationshipId)) {
            return;
        }
        this.byRelationshipId.delete(relationshipId);
        this.pendingRemovals.push(relationshipId);
        this.dirty = true;
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        return (this.dirty ||
            this.pendingRemovals.length > 0 ||
            this.pendingExternal.size > 0 ||
            [...this.byRelationshipId.values()].some((e: HyperlinkRelationshipEntry) => e.pendingRelationship !== undefined));
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {ReturnType<*>} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage, mainPartName: ReturnType<typeof partName>): OpcPackage {
        let next: OpcPackage = pkg;
        const pending: OpcRelationship[] = [...this.byRelationshipId.values()]
            .map((entry: HyperlinkRelationshipEntry) => entry.pendingRelationship)
            .filter((rel: OpcRelationship): rel is OpcRelationship => rel !== undefined);
        if (pending.length > 0) {
            const existing: Relationships = relationshipsForPart(next, mainPartName);
            const merged: Relationships = mergePendingRelationships(existing, pending);
            for (const entry of this.byRelationshipId.values()) {
                entry.pendingRelationship = undefined;
            }
            next = withPartRelationships(next, mainPartName, merged);
        }
        for (const relationshipId of this.pendingRemovals) {
            next = withFilteredPartRelationshipsLocal(next, mainPartName, (rel: OpcRelationship) => rel.id !== relationshipId);
        }
        this.pendingRemovals.length = 0;
        this.dirty = false;
        return next;
    }
    /**
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    relationshipIds(): ReadonlyArray<string> {
        return [...this.byRelationshipId.keys()];
    }
    /**
     * @returns {ReadonlyArray<string>} The result.
     * @private
     */
    pendingRelationshipIds(): ReadonlyArray<string> {
        return [...this.byRelationshipId.keys()];
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {string | undefined} The result.
     * @private
     */
    targetForRelationship(relationshipId: string): string | undefined {
        let ts332: any;
        return ((ts332 = this.byRelationshipId.get(relationshipId)), ts332 == null ? undefined : ts332.target);
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {string | undefined} The relationship type, when known.
     * @private
     */
    relationshipTypeFor(relationshipId: string): string | undefined {
        const entry: HyperlinkRelationshipEntry | undefined = this.byRelationshipId.get(relationshipId);
        return entry === undefined ? undefined : entry.relationshipType;
    }
    /**
     * @param {Hyperlink} hyperlink - The hyperlink.
     * @param {string} target - The target.
     * @param {string} relationshipType - The relationship type.
     * @returns {void} Nothing is returned.
     * @private
     * Register an external hyperlink before relationship allocation.
     */
    registerPendingExternal(hyperlink: Hyperlink, target: string, relationshipType: string = HYPERLINK_RELATIONSHIP_TYPE): void {
        this.pendingExternal.set(hyperlink, { target, relationshipType });
        this.dirty = true;
    }
    /**
     * @param {Hyperlink} hyperlink - The hyperlink.
     * @returns {string | undefined} The result.
     * @private
     */
    pendingTargetFor(hyperlink: Hyperlink): string | undefined {
        let ts333: any;
        return ((ts333 = this.pendingExternal.get(hyperlink)), ts333 == null ? undefined : ts333.target);
    }
    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    materializePending(document: WordDocument): void {
        if (this.pendingExternal.size === 0) {
            return;
        }
        visitParagraphsInDocumentOrder(document, (paragraph: Paragraph) => {
            for (const hyperlink of hyperlinksInParagraph(paragraph)) {
                if (hyperlink.relationshipId !== undefined) {
                    continue;
                }
                const pending: { readonly target: string; readonly relationshipType: string; } = this.pendingExternal.get(hyperlink);
                if (pending === undefined) {
                    continue;
                }
                const relationshipId: string = this.allocateExternalTarget(
                    pending.target,
                    usedRelationshipIds(document, this),
                    pending.relationshipType
                );
                hyperlink.resolveRelationshipId(relationshipId);
                this.pendingExternal.delete(hyperlink);
            }
        });
    }
    /**
     * @param {string} target - The target.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {string} relationshipType - The relationship type.
     * @returns {string} The result.
     * @private
     */
    allocateExternalTarget(
        target: string,
        usedRelIds: ReadonlySet<string>,
        relationshipType: string = HYPERLINK_RELATIONSHIP_TYPE
    ): string {
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while (this.byRelationshipId.has(relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const pending: OpcRelationship = {
            id: relId,
            type: relationshipType,
            target,
            targetMode: TargetMode.External,
            extraAttributes: [],
            children: []
        };
        this.byRelationshipId.set(relId, {
            relationshipId: relId,
            target,
            relationshipType,
            pendingRelationship: pending
        });
        this.dirty = true;
        return relId;
    }
}
function parseHyperlink(element: OpenXmlElement): Hyperlink | undefined {
    if (!isWml(element, 'hyperlink')) {
        return undefined;
    }
    const runOwner: HyperlinkRunOwner = new HyperlinkRunOwner();
    const items: HyperlinkInlineItem[] = [];
    const parsedRuns: TextRange[] = [];
    for (const child of elementChildren(element)) {
        if (isWml(child, 'r')) {
            const run: TextRange = TextRange.fromXml(child, runOwner);
            parsedRuns.push(run);
            items.push({ type: 'textRange', run });
            continue;
        }
        // Non-run children stay opaque and keep order among runs via `items`.
        items.push({ type: 'opaque', xml: child });
    }
    runOwner.hydrateRuns(parsedRuns);
    if (items.every((item: HyperlinkInlineItem) => item.type === 'opaque')) {
        return undefined;
    }
    return new Hyperlink(runOwner, items, relIdAttribute(element), wmlAttribute(element, 'anchor'), wmlAttribute(element, 'tooltip'), wmlAttribute(element, 'docLocation'), wmlAttribute(element, 'tgtFrame'), parseOnOffAttribute(wmlAttribute(element, 'history')));
}
function loadCatalog(pkg: OpcPackage, mainPartName: ReturnType<typeof partName>): HyperlinksCatalog {
    const rels: Relationships = relationshipsForPart(pkg, mainPartName);
    const byRelationshipId: Map<string, HyperlinkRelationshipEntry> = new Map<string, HyperlinkRelationshipEntry>();
    for (const rel of rels.items) {
        if (HYPERLINK_RELATIONSHIP_TYPES.indexOf(rel.type as (typeof HYPERLINK_RELATIONSHIP_TYPES)[number]) === -1) {
            continue;
        }
        byRelationshipId.set(rel.id, {
            relationshipId: rel.id,
            target: rel.target,
            relationshipType: rel.type,
            pendingRelationship: undefined
        });
    }
    return new HyperlinksCatalog(byRelationshipId, false);
}
function usedRelationshipIds(document: WordDocument, catalog: HyperlinksCatalog): Set<string> {
    const main: PartName = partName('/word/document.xml');
    const used: Set<string> = new Set<string>();
    for (const rel of relationshipsForPart(document.opcPackage(), main).items) {
        used.add(rel.id);
    }
    for (const id of catalog.relationshipIds()) {
        used.add(id);
    }
    return used;
}
function withFilteredPartRelationshipsLocal(
    pkg: OpcPackage,
    source: ReturnType<typeof partName>,
    keep: (rel: OpcRelationship) => boolean
): OpcPackage {
    const existing: Relationships = relationshipsForPart(pkg, source);
    const kept: OpcRelationship[] = existing.items.filter(keep);
    if (kept.length === existing.items.length) {
        return pkg;
    }
    return withPartRelationships(pkg, source, relationshipsWith(kept, existing.opaque));
}
let registered: boolean = false;
/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetHyperlinksFeatureForTests(): void {
    registered = false;
}
/**
 * @returns {void} Nothing is returned.
 * @private
 * Register hyperlink inline and relationship handlers. Idempotent.
 */
export function registerHyperlinksFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: HYPERLINKS });
    registerFeatureMultiPartHandler({
        featureId: HYPERLINKS,
        relationshipTypes: HYPERLINK_RELATIONSHIP_TYPES,
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): HyperlinksCatalog {
            return loadCatalog(pkg, ctx.mainPartName);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: HYPERLINKS,
        materialize(document: WordDocument): void {
            const part: FeaturePartState = document.featurePart(HYPERLINKS);
            if (part instanceof HyperlinksCatalog) {
                part.materializePending(document);
            }
        }
    });
    registerFeatureInlineHandler({
        featureId: HYPERLINKS,
        wmlLocalName: 'hyperlink',
        tryParse(element: OpenXmlElement): Hyperlink | undefined {
            return parseHyperlink(element);
        }
    });
}
/**
 * Hyperlink catalog for a document.
 *
 * On a loaded package this is the catalog built from Main Document relationships.
 * On a newly authored document there are no relationships yet, so this function
 * attaches an empty catalog on first use and {@link WordDocument.saveSync | saveSync}
 * materializes pending relationships into the package.
 *
 * @param {WordDocument} document - The document.
 * @returns {HyperlinksCatalog} The result.
 * @throws DocxError `feature/not-registered` when the module was not registered.
 * @private
 */
export function hyperlinksFor(document: WordDocument): HyperlinksCatalog {
    const part: FeaturePartState = document.featurePart(HYPERLINKS);
    if (part instanceof HyperlinksCatalog) {
        return part;
    }
    if (part !== undefined) {
        throw new DocxError('feature/not-registered', 'Hyperlinks feature state was replaced with an unexpected part type');
    }
    if (!isFeatureRegistered(HYPERLINKS)) {
        throw new DocxError('feature/not-registered', 'Hyperlinks feature is not registered; call registerHyperlinksFeature() before use');
    }
    const created: HyperlinksCatalog = new HyperlinksCatalog(new Map<string, HyperlinkRelationshipEntry>(), false);
    document.setFeaturePart(HYPERLINKS, created);
    return created;
}
/**
 * Hyperlinks in a paragraph, in document order.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<Hyperlink>} The result.
 * @private
 */
export function hyperlinksInParagraph(paragraph: Paragraph): ReadonlyArray<Hyperlink> {
    const found: Hyperlink[] = [];
    for (const inline of paragraph.items) {
        if (isHyperlinkInline(inline)) {
            found.push(inline.value);
        }
    }
    return found;
}
/**
 * Re-points hyperlinks of paragraphs imported from `source` at new relationships in `destination`,
 * so their `r:id` never refers to an unrelated destination relationship.
 *
 * @param {WordDocument} source - The document the paragraphs came from.
 * @param {WordDocument} destination - The document that now holds the paragraphs.
 * @param {ReadonlyArray<Paragraph>} paragraphs - The imported paragraphs.
 * @returns {void} Nothing is returned.
 * @private
 */
export function remapImportedHyperlinks(source: WordDocument, destination: WordDocument, paragraphs: ReadonlyArray<Paragraph>): void {
    if (!isFeatureRegistered(HYPERLINKS)) {
        return;
    }
    const sourceCatalog: HyperlinksCatalog = hyperlinksFor(source);
    const destCatalog: HyperlinksCatalog = hyperlinksFor(destination);
    const mapped: Map<string, string> = new Map<string, string>();
    for (const paragraph of paragraphs) {
        for (const hyperlink of hyperlinksInParagraph(paragraph)) {
            const oldId: string | undefined = hyperlink.relationshipId;
            if (oldId === undefined) {
                continue;
            }
            let newId: string | undefined = mapped.get(oldId);
            if (newId === undefined) {
                const target: string | undefined = sourceCatalog.targetForRelationship(oldId);
                if (target === undefined) {
                    continue;
                }
                const used: Set<string> = usedMainDocumentRelationshipIds(destination);
                for (const id of destCatalog.relationshipIds()) {
                    used.add(id);
                }
                newId = destCatalog.allocateExternalTarget(target, used, sourceCatalog.relationshipTypeFor(oldId));
                mapped.set(oldId, newId);
            }
            hyperlink.resolveRelationshipId(newId);
        }
    }
}
/**
 * Resolved external URL (MVP “url”) for a hyperlink, when present.
 *
 * Looks up the Main Document hyperlink relationship `Target` for
 * {@link Hyperlink.relationshipId}, or the pending external target registered for a
 * newly authored link that has not yet been materialized. Returns `undefined` for
 * anchor-only internal links with no external relationship.
 *
 * Targets are data only — never fetched or executed (see security policy).
 *
 * @param {WordDocument} document - The document.
 * @param {Hyperlink} hyperlink - The hyperlink.
 * @returns {string | undefined} The result.
 * @private
 */
export function hyperlinkTarget(document: WordDocument, hyperlink: Hyperlink): string | undefined {
    if (hyperlink.relationshipId !== undefined) {
        return hyperlinksFor(document).targetForRelationship(hyperlink.relationshipId);
    }
    return hyperlinksFor(document).pendingTargetFor(hyperlink);
}
/**
 * Remove a hyperlink inline from its paragraph and drop its external relationship on save.
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {Hyperlink} hyperlink - The hyperlink.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeHyperlink(document: WordDocument, paragraph: Paragraph, hyperlink: Hyperlink): void {
    paragraph.removeFeatureInline(hyperlink);
    if (hyperlink.relationshipId !== undefined) {
        hyperlinksFor(document).removeEntry(hyperlink.relationshipId);
    }
}
/**
 * Whether paragraph inline content is a modeled hyperlink from this module.
 *
 * @param {ParagraphItem} inline - The inline.
 * @returns {Object} The result.
 * @private
 */
export function isHyperlinkInline(
    inline: ParagraphItem
): inline is FeatureInlineParagraphItem & { value: Hyperlink } {
    return (
        inline instanceof FeatureInlineParagraphItem &&
        inline.featureId === HYPERLINKS &&
        inline.value instanceof Hyperlink
    );
}
registerHyperlinksFeature();
