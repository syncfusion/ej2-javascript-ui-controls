import { Body } from './body';
import { Paragraph } from './paragraph';
import { WordDocument } from './document';
import { DetachedObjectError } from '../../core/errors/docx-error';

/**
 * Runtime base class for body-level items (paragraphs, tables, block content controls).
 *
 * Each body item has exactly one owning Body (the section body or a table cell that
 * extends Body). When owned by a table cell, ownerTextBody returns the TableCell
 * instance itself.
 *
 * @public
 */
export abstract class BodyItem {
    private ownerTextBodyValue: Body | undefined;

    /**
     * Creates a detached deep copy of this item; the runtime class supplies the implementation.
     *
     * @returns {BodyItem} The cloned item.
     * @public
     */
    abstract clone(): BodyItem;

    /**
     * Gets the Body that directly contains this item.
     *
     * For content inside a table cell, the returned runtime object is the
     * TableCell because TableCell extends Body.
     *
     * Returns undefined when the item is detached.
     *
     * @public
     */
    public get ownerTextBody(): Body | undefined {
        return this.ownerTextBodyValue;
    }

    /**
     * Attaches this item to a Body.
     *
     * @param {Body} body - The body.
     * @returns {void}
     * @private
     */
    attachToBody(body: Body): void {
        if (this.ownerTextBodyValue !== undefined) {
            throw new DetachedObjectError(
                'This body item is already attached to a body'
            );
        }

        this.ownerTextBodyValue = body;
        this.onAttachedToBody();
    }

    /**
     * Detaches this item from its Body.
     *
     * @param {Body} body - The body.
     * @returns {void}
     * @private
     */
    detachFromBody(body: Body): void {
        if (this.ownerTextBodyValue !== body) {
            throw new DetachedObjectError(
                'This body item does not belong to the specified body'
            );
        }

        this.onDetachingFromBody();
        this.ownerTextBodyValue = undefined;
    }

    /**
     * Gets the document containing this body item.
     *
     * @returns {WordDocument} The result of the operation.
     * @protected
     */
    protected owningDocument(): WordDocument {
        const body: Body | undefined = this.ownerTextBodyValue;
        if (body === undefined) {
            throw new DetachedObjectError('This body item is detached');
        }

        return body.owningDocument();
    }

    /**
     * Verifies that this item is still present in its owning Body.
     *
     * @returns {void}
     * @protected
     */
    protected assertMutable(): void {
        const body: Body | undefined = this.ownerTextBodyValue;
        if (body === undefined) {
            throw new DetachedObjectError('This body item is detached');
        }

        body.items.assertAttached(this);
    }

    /**
     * Allows a derived body item to attach its child content.
     *
     * @returns {void}
     * @protected
     */
    protected onAttachedToBody(): void {
        // No default action.
    }

    /**
     * Allows a derived body item to detach its child content.
     *
     * @returns {void}
     * @protected
     */
    protected onDetachingFromBody(): void {
        // No default action.
    }
}



/**
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 * True when `value` is a {@link BodyItem} instance (runtime base class).
 */
export function isBodyItemInstance(value: unknown): value is BodyItem {
    return value instanceof BodyItem;
}

/**
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 * True when `value` is a {@link Paragraph} instance.
 */
export function isParagraphBodyItem(value: unknown): value is Paragraph {
    // Avoid circular import; defer to caller's instanceof check
    return value !== null && typeof value === 'object' && 'paragraphFormat' in value;
}
