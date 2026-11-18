/**
 * Generic owner-aware mutable collection used by every Math collection.
 */

import { setOwnValue } from '../../../core/own-value';
import { arrayItem } from '../../../core/array-item';
import { OfficeMathEntity } from './entity';
import { OwnerHolder } from './owner-holder';

/* ES2015 runtime API; the compile-time lib set of this package does not declare Reflect.deleteProperty. */
declare const Reflect: { deleteProperty(target: object, key: number): boolean };

/** Owner of a collection: any Math entity that can bubble mutations. */
export type CollectionOwner = OfficeMathEntity & { notifyMutated(): void };

/**
 * Ordered collection that assigns/detaches owners and notifies the root on change.
 * Items are also reachable by numeric index (`collection[0]`).
 *
 * @public
 */
export abstract class OwnedCollection<T extends OwnerHolder> {
    [index: number]: T;
    private readonly _items: T[] = [];
    private _synced: number = 0;

    protected readonly owner: CollectionOwner;

    protected constructor(owner: CollectionOwner) {
        this.owner = owner;
    }

    /** Number of items. */
    get count(): number {
        return this._items.length;
    }

    /**
     * Returns the item at `index`.
     *
     * @param {number} index - The index.
     * @returns {T} The result.
     */
    getItem(index: number): T {
        this.checkIndex(index, this._items.length - 1);
        return arrayItem(this._items, index);
    }

    /**
     * Inserts an item at `index`; throws when it already belongs to a collection.
     *
     * @param {number} index - The index.
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     */
    insert(index: number, item: T): void {
        this.insertItem(index, item);
    }

    /**
     * Removes the item; no-op when it is not in the collection.
     *
     * @param {T} value - The value.
     * @returns {void} Nothing is returned.
     */
    remove(value: T): void {
        const index: number = this._items.indexOf(value);
        if (index >= 0) {
            this.removeAt(index);
        }
    }

    /**
     * Removes the item at `index`.
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     */
    removeAt(index: number): void {
        this.checkIndex(index, this._items.length - 1);
        const removed: T = this._items.splice(index, 1)[0];
        this.detach(removed);
        this.afterChange();
    }

    /**
     * Removes all items.
     *
     * @returns {void} Nothing is returned.
     */
    clear(): void {
        const removed: T[] = this._items.splice(0, this._items.length);
        removed.forEach((item: T) => this.detach(item));
        this.afterChange();
    }

    /**
     * Iterates the items in order.
     *
     * @returns {Iterator<T>} The result.
     */
    [Symbol.iterator](): Iterator<T> {
        return this._items[Symbol.iterator]();
    }

    /**
     * Snapshot of the items.
     *
     * @returns {T[]} The result.
     * @private
     */
    toArray(): T[] {
        return this._items.slice();
    }

    /**
     * Appends without owner assignment or notification (view/internal use).
     *
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     * @private
     */
    pushRaw(item: T): void {
        this._items.push(item);
        this.syncIndexes();
    }

    /**
     * Inserts with owner assignment but without the matrix guard or validation (synchronization use).
     *
     * @param {number} index - The index.
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     * @private
     */
    insertRaw(index: number, item: T): void {
        this.attach(item);
        this._items.splice(index, 0, item);
        this.syncIndexes();
    }

    /**
     * Assigns ownership of an item entering the collection.
     *
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     */
    protected attach(item: T): void {
        item.setOwner(this.owner);
    }

    /**
     * Removes by index and detaches without notification (synchronization use).
     *
     * @param {number} index - The index.
     * @returns {T} The result.
     * @private
     */
    removeRawAt(index: number): T {
        const removed: T = this._items.splice(index, 1)[0];
        this.detach(removed);
        this.syncIndexes();
        return removed;
    }

    /**
     * Inserts after validating index and ownership.
     *
     * @param {number} index - The index.
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     */
    protected insertItem(index: number, item: T): void {
        this.checkIndex(index, this._items.length);
        if (this._items.indexOf(item) >= 0 || (item.ownerMathEntity !== undefined && item.ownerMathEntity !== this.owner)) {
            throw new Error('The item already belongs to a Math collection.');
        }
        item.setOwner(this.owner);
        this._items.splice(index, 0, item);
        this.afterChange();
    }

    /**
     * Hook for subclasses after any structural change.
     *
     * @returns {void} Nothing is returned.
     */
    protected afterChange(): void {
        this.syncIndexes();
        this.owner.notifyMutated();
    }

    /**
     * Detaches a removed item.
     *
     * @param {T} item - The item.
     * @returns {void} Nothing is returned.
     */
    protected detach(item: T): void {
        item.setOwner(undefined);
    }

    private checkIndex(index: number, max: number): void {
        if (!(index >= 0 && index <= max) || Math.floor(index) !== index) {
            throw new RangeError('Index ' + index + ' is out of range.');
        }
    }

    private syncIndexes(): void {
        for (let i: number = this._items.length; i < this._synced; i++) {
            Reflect.deleteProperty(this, i);
        }
        for (const [i, item] of this._items.entries()) {
            setOwnValue(this, i, item);
        }
        this._synced = this._items.length;
    }
}
