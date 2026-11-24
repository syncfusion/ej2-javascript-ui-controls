import { OfficeMathRunElement, OfficeRun } from '@syncfusion/ej2-office-common';
import { DetachedObjectError } from '../../core/errors/docx-error';
import { Paragraph } from './paragraph';
import { EntityType } from './entity-type';
import { FeatureInline } from './feature-inline';

/**
 * Owner that validates {@link ParagraphItem} attachment for mutation.
 *
 * Implemented by {@link Paragraph} (and nested feature owners that host nested
 * text ranges). Collection mutations go through the paragraph collection; this
 * interface is the mutation gate for item property writes.
 *
 * @public
 */
export interface ParagraphItemOwner {
    /**
     * Assert that `target` is still attached to this owner and that the owner
     * itself is mutable. Throws {@link DetachedObjectError} otherwise.
     *
     * @param {ParagraphItem} target - Specifies the target.
     * @returns {void}
     */
    assertAttachedItem(target: ParagraphItem): void;
}

/**
 * Base class for every modeled child of {@link Paragraph.items}.
 *
 * Concrete subclasses include {@link TextRange}, breaks, symbols, tabs,
 * feature-owned items, and opaque round-trip holders. Ownership is exclusive:
 * an item is attached to at most one owner (normally a paragraph via its
 * {@link ParagraphItemCollection}).
 *
 * @public
 */
export abstract class ParagraphItem implements OfficeRun{
    /**
     * @private
     */
    private mathRunElementOwner: OfficeMathRunElement | undefined;
    private ownerValue: ParagraphItemOwner | undefined;
    /**
     * Document context for never-attached authoring (`new TextRange(document)`).
     * Cleared only when the item is removed after having been attached.
     *
     * @private
     */
    private documentContextValue: unknown | undefined;
    /**
     * True once this item has been attached at least once and later detached.
     *
     * @private
     */
    private wasRemovedValue: boolean;

    /**
     * @private
     */
    constructor() {
        this.ownerValue = undefined;
        this.documentContextValue = undefined;
        this.wasRemovedValue = false;
    }
    /**
     * Gets or sets the Math run element that owns this text range.
     *
     * @private
     */
    get ownerMathRunElement(): OfficeMathRunElement | undefined {
        return this.mathRunElementOwner;
    }

    set ownerMathRunElement(value: OfficeMathRunElement | undefined) {
        this.mathRunElementOwner = value;
    }
    /**
     * Owning paragraph/item host when attached; `undefined` when detached.
     *
     * @private
     */
    get owner(): ParagraphItemOwner | undefined {
        return this.ownerValue;
    }

    /**
     * Owning paragraph when attached; `undefined` when detached.
     *
     * Most paragraph items are owned directly by a Paragraph. This property
     * provides convenient access to the containing paragraph for formatting and manipulation.
     *
     * @returns {Paragraph | undefined} The containing {@link Paragraph}, or undefined when detached.
     * @example
     * ```ts
     * // Access paragraph format from a bookmark marker
     * const start = bookmark.bookmarkStart;
     * start.ownerParagraph.paragraphFormat.backColor = Color.AliceBlue;
     * ```
     *
     * @public
     */
    get ownerParagraph(): Paragraph | undefined {
        return this.ownerValue instanceof Paragraph
            ? this.ownerValue
            : undefined;
    }

    /**
     *  Document context for unattached authoring.
     *
     * @private
     */
    get documentContext(): unknown | undefined {
        return this.documentContextValue;
    }

    /**
     * @param {unknown | undefined} document - The document.
     * @returns {void} Nothing is returned.
     *  Bind document context without attaching to a paragraph.
     *
     * @private
     */
    setDocumentContext(document: unknown | undefined): void {
        this.documentContextValue = document;
        this.wasRemovedValue = false;
    }

    /**
     * @param {ParagraphItemOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     *  Attach to an owner (collection / nested host only).
     *
     * @private
     */
    attach(owner: ParagraphItemOwner): void {
        this.ownerValue = owner;
        this.wasRemovedValue = false;
    }

    /**
     * @returns {void} Nothing is returned.
     *  Detach from the current owner. Further authoring mutates throw
     * unless the item was never attached and still has document context.
     *
     * @private
     */
    detach(): void {
        if (this.ownerValue !== undefined) {
            this.wasRemovedValue = true;
            this.documentContextValue = undefined;
        }
        this.ownerValue = undefined;
        this.onDetached();
    }

    /**
     * Hook for subclasses that hold nested content (feature inlines, …).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    protected onDetached(): void {
        // default no-op
    }

    /**
     * Ensure this item is still attached and the owner accepts mutation.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    assertAttached(): void {
        if (this.ownerValue === undefined) {
            throw new DetachedObjectError('This paragraph item is no longer attached');
        }
        this.ownerValue.assertAttachedItem(this);
    }

    /**
     * @returns {void} Nothing is returned.
     *  Convenience for property setters.
     * Allows mutation when the item has document context and was never attached,
     * or is currently attached. Throws after removal from a parent.
     *
     * @private
     */
    protected mutate(): void {
        if (this.ownerValue !== undefined) {
            this.ownerValue.assertAttachedItem(this);
            return;
        }
        if (!this.wasRemovedValue && this.documentContextValue !== undefined) {
            return;
        }
        throw new DetachedObjectError('This paragraph item is no longer attached');
    }
}

/**
 * True when a feature inline is itself a modeled {@link ParagraphItem} that is
 * stored directly in a paragraph (no {@link FeatureInlineParagraphItem} wrapper).
 * Currently only inline content controls qualify.
 *
 * @param {unknown} value - The candidate feature inline.
 * @returns {boolean} `true` when `value` is stored directly as a paragraph item.
 * @private
 */
export function isDirectInlineFeatureItem(value: unknown): value is ParagraphItem & FeatureInline {
    return value instanceof ParagraphItem
        && (value as unknown as { entityType?: unknown }).entityType === EntityType.InlineContentControl;
}
