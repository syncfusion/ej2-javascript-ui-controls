import { Body } from './body';
import { BlockContent, Paragraph } from './paragraph';
import { Document, WordDocument } from './document';
import { Section } from './section';
import { DetachedObjectError } from '../../core/errors/docx-error';

/**
 * OOXML header/footer reference slot (`default` | `first` | `even`).
 *
 * @private
 */
export type HeaderFooterSlotRef = 'default' | 'first' | 'even';

/**
 * Header vs footer story kind.
 *
 * @public
 */
export type HeaderFooterKind = 'header' | 'footer';

/**
 * Header or footer story body (`w:hdr` / `w:ftr`).
 *
 * Extends {@link Body} so section body and header/footer stories share one
 * collection architecture. Header/footer-specific state only: kind, slot,
 * relationship id, and lazy part materialization hooks (feature-bound).
 *
 * @public
 */
export class HeaderFooter extends Body {
    private readonly kindValue: HeaderFooterKind;
    private readonly refTypeValue: HeaderFooterSlotRef;
    private relationshipIdValue: string;
    private materializeHandler: (() => void) | undefined;
    private syncHandler: (() => void) | undefined;
    private suppressSync: boolean;
    private requireFeatureOnMutate: boolean;

    /**
     * @param {Section | undefined} section - The section.
     * @param {HeaderFooterKind} kind - The kind.
     * @param {HeaderFooterSlotRef} refType - The ref type.
     * @param {ReadonlyArray<BlockContent>} items - The items.
     * @param {Document} document - The document.
     * @param {string} relationshipId - The relationship id.
     * @private
     */
    constructor(
        section: Section | undefined,
        kind: HeaderFooterKind,
        refType: HeaderFooterSlotRef,
        items: ReadonlyArray<BlockContent> = [],
        document?: Document,
        relationshipId: string = ''
    ) {
        const ownerDocument: WordDocument =
            document !== undefined
                ? document
                : section !== undefined
                    ? (() => {
                        try {
                            return section.owningDocument();
                        } catch {
                            return undefined;
                        }
                    })()
                    : undefined;
        super(ownerDocument, items, section);
        this.kindValue = kind;
        this.refTypeValue = refType;
        this.relationshipIdValue = relationshipId;
        this.materializeHandler = undefined;
        this.syncHandler = undefined;
        this.suppressSync = false;
        this.requireFeatureOnMutate = false;
    }

    /**
     * Header or footer kind for this story.
     *
     * @public
     */
    get kind(): HeaderFooterKind {
        return this.kindValue;
    }

    /**
     * OOXML reference slot (`default` | `first` | `even`).
     *
     * @private
     */
    get refType(): HeaderFooterSlotRef {
        return this.refTypeValue;
    }

    /**
     * Main Document relationship id for this part when materialized.
     *
     * @private
     */
    get relationshipId(): string {
        return this.relationshipIdValue;
    }

    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     * Bind or rebind the relationship id after lazy part creation.
     */
    bindRelationshipId(relationshipId: string): void {
        this.relationshipIdValue = relationshipId;
    }

    /**
     * @param {Function} materialize - The materialize.
     * @param {Function} sync - The sync.
     * @returns {void} Nothing is returned.
     * @private
     * Feature wires lazy part creation and catalog block sync.
     */
    bindLifecycleHandlers(materialize: () => void, sync: () => void): void {
        this.materializeHandler = materialize;
        this.syncHandler = sync;
        this.requireFeatureOnMutate = false;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Unregistered placeholder: mutations throw feature-not-registered.
     */
    markFeatureRequiredOnMutate(): void {
        this.requireFeatureOnMutate = true;
    }

    /**
     * @param {ReadonlyArray<BlockContent>} items - The items.
     * @returns {void} Nothing is returned.
     * @private
     * Replace internal store without materializing or marking the part dirty
     * (catalog load / initial bind).
     */
    replaceItemsSilent(items: ReadonlyArray<BlockContent>): void {
        this.suppressSync = true;
        try {
            super.replaceItems(items);
        } finally {
            this.suppressSync = false;
        }
    }

    /**
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void {
        this.ensureMaterializedForMutation();
        super.replaceRawBlocks(blocks);
        this.runSync();
    }

    /**
     * @param {ReadonlyArray<BlockContent>} items - The items.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceItems(items: ReadonlyArray<BlockContent>): void {
        this.ensureMaterializedForMutation();
        super.replaceItems(items);
        this.runSync();
    }

    /**
     * @param {Paragraph} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     * Nested paragraph/item mutation path: materialize + catalog dirty.
     * Block-level replace already runs sync; in-place TextRange/format edits
     * only reach Body via assertAttachedParagraph and must dirty the part too.
     */
    assertAttachedParagraph(target: Paragraph): void {
        this.ensureMaterializedForMutation();
        super.assertAttachedParagraph(target);
        this.runSync();
    }

    private ensureMaterializedForMutation(): void {
        if (this.suppressSync) {
            return;
        }
        if (this.requireFeatureOnMutate) {
            throw new Error(
                'Headers/footers feature is not registered; call registerHeadersFootersFeature() before mutating header/footer content'
            );
        }
        if (this.materializeHandler !== undefined) {
            this.materializeHandler();
        }
    }

    private runSync(): void {
        if (this.suppressSync) {
            return;
        }
        if (this.syncHandler !== undefined) {
            this.syncHandler();
        }
    }
}

/**
 * Factory hooks so the headers-footers feature can bind live HeaderFooter
 * slot views without core importing the feature module.
 *
 * @private
 */
export type HeadersFootersSlotFactory = {
    createHeader(section: Section, refType: HeaderFooterSlotRef): HeaderFooter;
    createFooter(section: Section, refType: HeaderFooterSlotRef): HeaderFooter;
};

let slotFactory: HeadersFootersSlotFactory | undefined;

/**
 * @param {HeadersFootersSlotFactory} factory - The factory.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerHeadersFootersSlotFactory(factory: HeadersFootersSlotFactory): void {
    slotFactory = factory;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetHeadersFootersSlotFactoryForTests(): void {
    slotFactory = undefined;
}

/**
 * @returns {HeadersFootersSlotFactory | undefined} The result.
 * @private
 */
export function currentHeadersFootersSlotFactory(): HeadersFootersSlotFactory | undefined {
    return slotFactory;
}

/**
 * Header and footer slots for one section.
 *
 * Six getters always return {@link HeaderFooter} instances (never `undefined`).
 * Empty slots have no child items until content is written; package parts are
 * created lazily on first body mutation.
 *
 * @public
 */
export class HeadersFooters {
    private section: Section | undefined;
    private oddHeaderInstance: HeaderFooter | undefined;
    private firstPageHeaderInstance: HeaderFooter | undefined;
    private evenHeaderInstance: HeaderFooter | undefined;
    private oddFooterInstance: HeaderFooter | undefined;
    private firstPageFooterInstance: HeaderFooter | undefined;
    private evenFooterInstance: HeaderFooter | undefined;
    private linkToPreviousValue: boolean;

    /**
     * @param {Section} section - The section.
     * @private
     */
    constructor(section?: Section) {
        this.section = section;
        this.linkToPreviousValue = true;
    }

    /**
     * @param {Section} section - The section.
     * @returns {void} Nothing is returned.
     * @private
     * Bind the owning section (called from {@link Section} construction).
     */
    bindSection(section: Section): void {
        this.section = section;
    }

    /**
     * Odd/default-page header (OOXML `w:type="default"`).
     *
     * @public
     */
    get oddHeader(): HeaderFooter {
        return this.headerSlot('default');
    }

    /**
     * Header used on the first page when different first page is enabled.
     *
     * @public
     */
    get firstPageHeader(): HeaderFooter {
        return this.headerSlot('first');
    }

    /**
     * Header used on even pages when different odd and even is enabled.
     *
     * @public
     */
    get evenHeader(): HeaderFooter {
        return this.headerSlot('even');
    }

    /**
     * Odd/default-page footer (OOXML `w:type="default"`).
     *
     * @public
     */
    get oddFooter(): HeaderFooter {
        return this.footerSlot('default');
    }

    /**
     * Footer used on the first page when different first page is enabled.
     *
     * @public
     */
    get firstPageFooter(): HeaderFooter {
        return this.footerSlot('first');
    }

    /**
     * Footer used on even pages when different odd and even is enabled.
     *
     * @public
     */
    get evenFooter(): HeaderFooter {
        return this.footerSlot('even');
    }

    /**
     * When `true`, this section inherits headers/footers from the previous
     * section (no local header/footer references). Setting `false` materializes
     * empty local parts so the section no longer inherits.
     *
     * @public
     */
    get linkToPrevious(): boolean {
        return this.computeLinkToPrevious();
    }

    set linkToPrevious(value: boolean) {
        this.linkToPreviousValue = value;
        const handler: LinkToPreviousHandler = linkToPreviousHandler;
        if (handler !== undefined && this.section !== undefined) {
            handler(this.section, value);
            return;
        }
        if (!value && this.section !== undefined) {
            // Feature not registered: force materialize attempt via empty mutate path is unavailable.
            // Leaving local flag only; feature handler applies package-side unlink when registered.
            return;
        }
    }

    private computeLinkToPrevious(): boolean {
        const handler: LinkToPreviousQuery = linkToPreviousQuery;
        if (handler !== undefined && this.section !== undefined) {
            return handler(this.section);
        }
        return this.linkToPreviousValue;
    }

    private headerSlot(refType: HeaderFooterSlotRef): HeaderFooter {
        const cached: HeaderFooter = this.cachedHeader(refType);
        if (cached !== undefined) {
            return cached;
        }
        const created: HeaderFooter = this.createHeader(refType);
        this.cacheHeader(refType, created);
        return created;
    }

    private footerSlot(refType: HeaderFooterSlotRef): HeaderFooter {
        const cached: HeaderFooter = this.cachedFooter(refType);
        if (cached !== undefined) {
            return cached;
        }
        const created: HeaderFooter = this.createFooter(refType);
        this.cacheFooter(refType, created);
        return created;
    }

    private cachedHeader(refType: HeaderFooterSlotRef): HeaderFooter | undefined {
        switch (refType) {
        case 'default':
            return this.oddHeaderInstance;
        case 'first':
            return this.firstPageHeaderInstance;
        default:
            return this.evenHeaderInstance;
        }
    }

    private cacheHeader(refType: HeaderFooterSlotRef, header: HeaderFooter): void {
        switch (refType) {
        case 'default':
            this.oddHeaderInstance = header;
            break;
        case 'first':
            this.firstPageHeaderInstance = header;
            break;
        default:
            this.evenHeaderInstance = header;
            break;
        }
    }

    private cachedFooter(refType: HeaderFooterSlotRef): HeaderFooter | undefined {
        switch (refType) {
        case 'default':
            return this.oddFooterInstance;
        case 'first':
            return this.firstPageFooterInstance;
        default:
            return this.evenFooterInstance;
        }
    }

    private cacheFooter(refType: HeaderFooterSlotRef, footer: HeaderFooter): void {
        switch (refType) {
        case 'default':
            this.oddFooterInstance = footer;
            break;
        case 'first':
            this.firstPageFooterInstance = footer;
            break;
        default:
            this.evenFooterInstance = footer;
            break;
        }
    }

    private createHeader(refType: HeaderFooterSlotRef): HeaderFooter {
        const section: Section = this.section;
        const factory: HeadersFootersSlotFactory = slotFactory;
        if (section !== undefined && factory !== undefined) {
            return factory.createHeader(section, refType);
        }
        return this.createUnregisteredPlaceholder('header', refType);
    }

    private createFooter(refType: HeaderFooterSlotRef): HeaderFooter {
        const section: Section = this.section;
        const factory: HeadersFootersSlotFactory = slotFactory;
        if (section !== undefined && factory !== undefined) {
            return factory.createFooter(section, refType);
        }
        return this.createUnregisteredPlaceholder('footer', refType);
    }

    private createUnregisteredPlaceholder(
        kind: HeaderFooterKind,
        refType: HeaderFooterSlotRef
    ): HeaderFooter {
        const placeholder: HeaderFooter = new HeaderFooter(this.section, kind, refType, []);
        placeholder.markFeatureRequiredOnMutate();
        return placeholder;
    }
}

type LinkToPreviousHandler = (section: Section, link: boolean) => void;
type LinkToPreviousQuery = (section: Section) => boolean;

let linkToPreviousHandler: LinkToPreviousHandler | undefined;
let linkToPreviousQuery: LinkToPreviousQuery | undefined;

/**
 * @param {LinkToPreviousHandler} apply - The apply.
 * @param {LinkToPreviousQuery} query - The query.
 * @returns {void} Nothing is returned.
 * @private
 * Feature registers package-side linkToPrevious apply/query.
 */
export function registerHeadersFootersLinkToPreviousHandlers(
    apply: LinkToPreviousHandler,
    query: LinkToPreviousQuery
): void {
    linkToPreviousHandler = apply;
    linkToPreviousQuery = query;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetHeadersFootersLinkToPreviousHandlersForTests(): void {
    linkToPreviousHandler = undefined;
    linkToPreviousQuery = undefined;
}
