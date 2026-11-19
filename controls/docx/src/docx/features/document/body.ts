import { BodyItemCollection, BodyItemCollectionHost } from './body-item-collection';
import { BlockContent, Paragraph, ParagraphOwner } from './paragraph';
import { ParagraphCollection } from './typed-body-collections';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { WordDocument } from './document';
import { Section } from './section';
import { FormFieldsCollection } from '../fields/paragraph-field';

/**
 * Section body (`w:body` story content for one section).
 *
 * Collection owner only: mutate through {@link Body.items}
 * ({@link BodyItemCollection}). The internal ordered store holds
 * {@link BlockContent} wrappers for parse/serialize; the public collection
 * projects {@link BodyItem} instances.
 *
 * Temporary bridges until TASK-8076: {@link Body.paragraphs},
 * {@link Body.appendParagraph}. Prefer {@link Body.items} for insert/remove.
 *
 * @public
 */
export class Body implements BodyItemCollectionHost, ParagraphOwner {
    private itemList: BlockContent[];
    private readonly itemsInstance: BodyItemCollection;
    private readonly paragraphsInstance: ParagraphCollection;
    private section: Section | undefined;
    private document: WordDocument | undefined;
    private formFieldsInstance: FormFieldsCollection | undefined;

    /**
     * @param {WordDocument | undefined} document - The document.
     * @param {ReadonlyArray<BlockContent>} items - The items.
     * @param {Section} section - The section.
     * @private
     */
    constructor(
        document: WordDocument | undefined,
        items: ReadonlyArray<BlockContent> = [],
        section?: Section
    ) {
        this.document = document;
        this.section = section;
        this.itemList = items.slice();
        this.itemsInstance = new BodyItemCollection(this);
        this.paragraphsInstance = new ParagraphCollection(
            this.itemsInstance,
            () => new Paragraph(undefined)
        );
        // Constructor path bypasses BodyItemCollection.insert, so attach
        // paragraphs here (table cells, section load helpers, etc.).
        for (const block of this.itemList) {
            if (block.type === 'paragraph') {
                block.paragraph.attach(this);
            }
        }
    }

    /**
     * Managed mutable collection of public body items (paragraphs, tables,
     * block content controls). Same instance on every access.
     */
    get items(): BodyItemCollection {
        return this.itemsInstance;
    }

    /**
     * Paragraphs in this body (filtered view over {@link Body.items}).
     *
     * Temporary bridge until TASK-8076 — prefer {@link Section.paragraphs}
     * when using the sections spine.
     */
    get paragraphs(): ParagraphCollection {
        return this.paragraphsInstance;
    }

    /**
     * Form fields in this body.
     *
     * @public
     */
    get formFields(): FormFieldsCollection {
        if (this.formFieldsInstance === undefined) {
            this.formFieldsInstance = new FormFieldsCollection(this);
        }
        return this.formFieldsInstance;
    }

    /**
     * @returns {Section | undefined} The result.
     * @private
     * Owning section when this body is attached under a {@link Section}.
     */
    owningSection(): Section | undefined {
        return this.section;
    }

    /**
     * @param {Section | undefined} section - The section.
     * @returns {void} Nothing is returned.
     * @private
     */
    setOwningSection(section: Section | undefined): void {
        this.section = section;
    }

    /**
     * @param {WordDocument | undefined} document - The document.
     * @returns {void} Nothing is returned.
     * @private
     */
    setOwningDocument(document: WordDocument | undefined): void {
        this.document = document;
    }

    /**
     * @returns {WordDocument} The result.
     * @private
     * Document that owns this body (via section or direct bind during load).
     */
    owningDocument(): WordDocument {
        if (this.section !== undefined) {
            return this.section.owningDocument();
        }
        if (this.document !== undefined) {
            return this.document;
        }
        throw new DetachedObjectError('Body is not attached to a document');
    }

    /**
     * @returns {BlockContent[]} The result.
     * @private
     */
    rawBlocks(): BlockContent[] {
        return this.itemList;
    }

    /**
     * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void {
        this.itemList = blocks.slice();
    }

    /**
     * @param {Paragraph} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     */
    assertAttachedParagraph(target: Paragraph): void {
        const found: boolean = this.itemList.some(
            (b: BlockContent) => b.type === 'paragraph' && b.paragraph === target
        );
        if (!found) {
            throw new DetachedObjectError('This paragraph is no longer in the document');
        }
    }

    /**
     * @returns {ReadonlyArray<BlockContent>} The result.
     * @private
     * Full internal store (paragraphs, features, opaque) for serialize/load.
     */
    listBlocks(): ReadonlyArray<BlockContent> {
        return this.itemList;
    }

    /**
     * @param {ReadonlyArray<BlockContent>} items - The items.
     * @returns {void} Nothing is returned.
     * @private
     * Replace the entire internal store (load / section partition helpers).
     */
    replaceItems(items: ReadonlyArray<BlockContent>): void {
        const previous: BlockContent[] = this.itemList;
        for (const block of previous) {
            if (block.type === 'paragraph') {
                // Only detach paragraphs that are leaving this body.
                let stillPresent: boolean = false;
                for (const next of items) {
                    if (next.type === 'paragraph' && next.paragraph === block.paragraph) {
                        stillPresent = true;
                        break;
                    }
                }
                if (!stillPresent) {
                    block.paragraph.detach();
                }
            }
        }
        this.itemList = items.slice();
        for (const block of this.itemList) {
            if (block.type === 'paragraph') {
                block.paragraph.attach(this);
            }
        }
        this.itemsInstance.syncFromHost();
        this.syncTypedViews();
    }

    /**
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     * Append an internal block (feature/load bridge — not a public Body mutator).
     * Typed views refresh via {@link notifyBodyItemsChanged} from the item collection.
     */
    appendRawBlock(block: BlockContent): void {
        this.itemsInstance.appendRawBlock(block);
    }

    /**
     * @param {number} index - The index.
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     */
    insertRawBlockAt(index: number, block: BlockContent): void {
        this.itemsInstance.insertRawBlockAt(index, block);
    }

    /**
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeRawBlockAt(index: number): void {
        this.itemsInstance.removeRawBlockAt(index);
    }

    /**
     * @returns {ReadonlyArray<Paragraph>} The result.
     * @private
     * Paragraph instances in store order (internal bridge).
     */
    listParagraphs(): ReadonlyArray<Paragraph> {
        const out: Paragraph[] = [];
        for (const block of this.itemList) {
            if (block.type === 'paragraph') {
                out.push(block.paragraph);
            }
        }
        return out;
    }

    /**
     * Appends an empty `w:p` after existing body children (before preserved `sectPr`).
     *
     * Temporary bridge until TASK-8076.
     *
     * @param {Object} options - Optional paragraph style id and/or initial text.
     * @returns {Paragraph} The appended {@link Paragraph}.
     */
    appendParagraph(options?: {
        readonly style?: string;
        readonly text?: string;
    }): Paragraph {
        const paragraph: Paragraph = this.paragraphsInstance.add();
        if ((options == null ? undefined : options.style) !== undefined) {
            // Route through the styles facade (`Paragraph.style`) so built-in
            // ids/display-names resolve eagerly; do not assign `styleId` raw.
            paragraph.applyStyle(options.style);
        }
        if ((options == null ? undefined : options.text) !== undefined) {
            paragraph.appendText(options.text);
        }
        return paragraph;
    }

    /**
     * Inserts an empty paragraph among existing paragraphs.
     *
     * @param {number} index - Index in {@link Body.paragraphs}, `0…count` inclusive.
     * @returns {Paragraph} The result.
     * @private
     * Not part of the customer Body surface (API-RULES). Prefer
     * {@link Body.items} or {@link Body.paragraphs} collection verbs.
     *
     * @throws RangeError if `index` is out of range.
     */
    insertParagraph(index: number): Paragraph {
        return this.paragraphsInstance.insert(index);
    }

    /**
     * Removes a paragraph. Further mutation of it throws {@link DetachedObjectError}.
     *
     * @param {Paragraph} paragraph - The paragraph.
     * @returns {void} Nothing is returned.
     * @private
     * Not part of the customer Body surface (API-RULES). Prefer
     * {@link Body.items} or {@link Body.paragraphs} collection verbs.
     */
    removeParagraph(paragraph: Paragraph): void {
        this.paragraphsInstance.remove(paragraph);
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Refresh typed views after raw mutations that bypass Body helpers.
     */
    syncParagraphs(): void {
        this.syncTypedViews();
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Invoked by {@link BodyItemCollection} after public/raw item mutations so
     * body paragraphs and section typed views stay aligned with `items`.
     */
    notifyBodyItemsChanged(): void {
        this.syncTypedViews();
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Rebuild body paragraph indexes and, when this body is a section main
     * story, section typed views (`paragraphs` / `tables` / block CCs).
     * Cell bodies (`TableCell extends Body`) have no owning section — only
     * local paragraphs refresh.
     */
    private syncTypedViews(): void {
        this.paragraphsInstance.syncFromHost();
        const section: Section = this.owningSection();
        if (section !== undefined) {
            section.syncCollections();
        }
    }
}
