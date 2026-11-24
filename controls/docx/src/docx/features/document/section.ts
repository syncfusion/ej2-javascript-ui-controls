import { Body } from './body';
import { HeadersFooters } from './headers-footers';
import {
    BlockContentControlCollection,
    createBlockContentControlCollection,
    createTableCollection,
    ParagraphCollection,
    TableCollection
} from './typed-body-collections';
import { BlockContent, Paragraph } from './paragraph';
import { PageSetup } from './page-setup';
import { SectionPropertiesModel } from './section-properties-model';
import { currentSectionPageSetupClone as pageSetupCloneHook, currentSectionPageSetupSeed, SectionPageSetupSeed } from './sections';
import { notifySectionPropertiesAttached } from './section-partition-flatten';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { WordDocument } from './document';

/**
 * One document section: body story, page setup, and header/footer slots.
 *
 * Main-story entry is {@link Section.body}.{@link Body.items}. Typed views
 * ({@link Section.paragraphs}, {@link Section.tables},
 * {@link Section.blockContentControls}) filter the same collection.
 *
 * Public {@link pageSetup} is always a live {@link PageSetup} when the sections
 * feature is registered. Core stores the value as
 * {@link SectionPropertiesModel} without importing the feature class.
 *
 * @public
 */
export class Section {
    private readonly bodyInstance: Body;
    private readonly paragraphsInstance: ParagraphCollection;
    private readonly tablesInstance: TableCollection;
    private readonly blockContentControlsInstance: BlockContentControlCollection;
    private readonly headersFootersInstance: HeadersFooters;
    private pageSetupModel: SectionPropertiesModel | undefined;
    private document: WordDocument | undefined;
    private cloneSourceDocument: WordDocument | undefined;

    /**
     * @param {WordDocument | undefined} document - The document.
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @param {SectionPropertiesModel} pageSetup - The page setup.
     * @private
     */
    constructor(
        document: WordDocument | undefined,
        blocks: ReadonlyArray<BlockContent> = [],
        /**
         * Gets or sets the page setup.
         */
        pageSetup?: SectionPropertiesModel
    ) {
        this.document = document;
        this.bodyInstance = new Body(document, blocks, this);
        this.pageSetupModel = pageSetup;
        if (this.pageSetupModel === undefined) {
            const seed: SectionPageSetupSeed = currentSectionPageSetupSeed();
            if (seed !== undefined) {
                this.pageSetupModel = seed();
            }
        }
        this.headersFootersInstance = new HeadersFooters(this);
        this.paragraphsInstance = new ParagraphCollection(
            this.bodyInstance.items,
            () => new Paragraph(undefined)
        );
        this.tablesInstance = createTableCollection(this.bodyInstance.items);
        this.blockContentControlsInstance = createBlockContentControlCollection(
            this.bodyInstance.items
        );
    }

    /**
     * Gets the body of the section, which holds the paragraphs, tables, and block content controls of the main story.
     */
    get body(): Body {
        return this.bodyInstance;
    }

    /**
     * Gets the paragraphs of the section body.
     */
    get paragraphs(): ParagraphCollection {
        return this.paragraphsInstance;
    }

    /**
     * Gets the tables in this section body (filtered view). Empty until the tables feature registers typed-collection hooks.
     */
    get tables(): TableCollection {
        return this.tablesInstance;
    }

    /**
     * Gets the block content controls in this section body (filtered view).
     */
    get blockContentControls(): BlockContentControlCollection {
        return this.blockContentControlsInstance;
    }

    /**
     * Gets the headers footers.
     *
     * Six getters never return `undefined`. Empty slots expose zero child items until content is written; package parts are created lazily.
     */
    get headersFooters(): HeadersFooters {
        return this.headersFootersInstance;
    }

    /**
     * Gets the page setup.
     *
     * Always returns the same {@link PageSetup} instance while the sections feature is registered. Never typed as {@link SectionPropertiesModel}. Serialization stays on the internal model bridge ({@link internalPageSetupModel}).
     *
     * @public
     */
    get pageSetup(): PageSetup {
        if (this.pageSetupModel === undefined) {
            const seed: SectionPageSetupSeed = currentSectionPageSetupSeed();
            if (seed !== undefined) {
                this.pageSetupModel = seed();
            }
        }
        if (this.pageSetupModel === undefined) {
            throw new DetachedObjectError(
                'Section.pageSetup requires the sections feature (import @syncfusion/ej2-docx or @syncfusion/ej2-docx/sections)'
            );
        }
        // Feature PageSetup implements the public PageSetup contract and the
        // internal SectionPropertiesModel serialization boundary. Core cannot
        // import the feature class, so identity is asserted through unknown.
        return this.pageSetupModel as unknown as PageSetup;
    }

    /**
     * @returns {SectionPropertiesModel | undefined} The result.
     * @private
     * Internal dual-hold / serialize model. Prefer {@link pageSetup} publicly.
     */
    internalPageSetupModel(): SectionPropertiesModel | undefined {
        return this.pageSetupModel;
    }

    /**
     * @param {SectionPropertiesModel | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Attach or clear the live page-setup model. Clearing re-seeds a default
     * when the sections feature seed hook is registered so `pageSetup` stays
     * defined for always-on section properties.
     */
    setPageSetup(value: SectionPropertiesModel | undefined): void {
        if (value !== undefined) {
            this.pageSetupModel = value;
            return;
        }
        const seed: SectionPageSetupSeed = currentSectionPageSetupSeed();
        this.pageSetupModel = seed !== undefined ? seed() : undefined;
    }

    /**
     * @returns {WordDocument} The result.
     * @private
     */
    owningDocument(): WordDocument {
        if (this.document === undefined) {
            throw new DetachedObjectError('Section is not attached to a document');
        }
        return this.document;
    }

    /**
     * The document this section was cloned from, until it is attached elsewhere.
     *
     * @returns {WordDocument | undefined} The source document, when this section is a clone.
     * @private
     */
    takeCloneSource(): WordDocument | undefined {
        const source: WordDocument | undefined = this.cloneSourceDocument;
        this.cloneSourceDocument = undefined;
        return source;
    }

    /**
     * @param {WordDocument} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    bindDocument(document: WordDocument): void {
        this.headersFootersInstance.bindSection(this);
        this.document = document;
        this.bodyInstance.setOwningDocument(document);
        this.bodyInstance.setOwningSection(this);
        if (this.pageSetupModel !== undefined) {
            notifySectionPropertiesAttached(this.pageSetupModel, document);
        }
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Refresh typed collection index properties after raw-store load mutations.
     */
    syncCollections(): void {
        this.bodyInstance.items.syncFromHost();
        this.paragraphsInstance.syncFromHost();
        this.tablesInstance.syncFromHost();
        this.blockContentControlsInstance.syncFromHost();
    }

    /**
     * Create an independent copy of this section.
     * Body content, headers, footers, and page setup are all cloned.
     *
     * The cloned section is detached and has no document owner until attached to a document.
     * Its body, headers, and footers are owned by the cloned section.
     *
     * @returns {Section} Cloned section.
     * @public
     */
    clone(): Section {
        const clonedBody: Body = this.bodyInstance.clone();

        let clonedPageSetup: SectionPropertiesModel | undefined;
        if (this.pageSetupModel !== undefined && pageSetupCloneHook() !== undefined) {
            clonedPageSetup = pageSetupCloneHook()(this.pageSetupModel);
        }

        // The constructor takes ownership of the cloned body's items.
        const cloned: Section = new Section(undefined, clonedBody.listBlocks(), clonedPageSetup);
        cloned.headersFootersInstance.cloneFrom(this.headersFootersInstance, cloned);
        cloned.cloneSourceDocument = this.document;
        return cloned;
    }
}
