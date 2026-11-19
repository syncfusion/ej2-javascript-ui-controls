import { DetachedObjectError } from '../../core/errors/docx-error';
import { ParagraphItem, ParagraphItemOwner } from './paragraph-item';
import {
    ConcreteParagraphItem,
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    WireRunGroup
} from './text-range';
import { FeatureRunLeaf } from './feature-run-leaf';
import { FeatureId } from '../../core/registry/feature-registry';
import { EntityType } from './entity-type';

/**
 * Determine the feature ID for a FeatureRunLeaf based on its EntityType.
 *
 * @param {FeatureRunLeaf} leaf - The leaf.
 * @returns {FeatureId} The result.
 * @private
 */
function getFeatureIdForLeaf(leaf: FeatureRunLeaf): FeatureId {
    const probe: { type?: unknown; entityType?: unknown } = leaf as { type?: unknown; entityType?: unknown };
    const typeValue: unknown = probe.type !== undefined && probe.type !== null ? probe.type : probe.entityType;

    switch (typeValue) {
    case EntityType.Picture:
        return 'images' as FeatureId;
    case EntityType.OleObject:
        return 'ole-object' as FeatureId;
    case EntityType.Footnote:
        return 'notes' as FeatureId;
    case EntityType.Chart:
        return 'charts' as FeatureId;
    case EntityType.Shape:
    case EntityType.AutoShape:
    case EntityType.GroupShape:
    case EntityType.ChildShape:
    case EntityType.ChildGroupShape:
        return 'drawing' as FeatureId;
    default:
        // Try to use a generic feature ID based on the type name
        if (typeof typeValue === 'number') {
            // Fallback: use the entity type number as a string
            return `feature-${typeValue}` as FeatureId;
        }
        throw new Error(`Cannot determine feature ID for FeatureRunLeaf with type: ${String(typeValue)}`);
    }
}

/**
 * Project internal feature wrappers to public leaf objects when the leaf
 * exposes a numeric {@link EntityType} discriminant (e.g. Picture).
 * Storage and serialize stay on the wrapper.
 *
 * @param {ConcreteParagraphItem} item - The item.
 * @returns {ConcreteParagraphItem} The result.
 * @private
 */
function projectPublicItem(item: ConcreteParagraphItem): ConcreteParagraphItem {
    if (item instanceof FeatureRunParagraphItem) {
        const value: { type?: unknown; entityType?: unknown; } = item.value as { type?: unknown; entityType?: unknown };
        if (value != null && (typeof value.type === 'number' || typeof value.entityType === 'number')) {
            return value as ConcreteParagraphItem;
        }
    }
    if (item instanceof FeatureInlineParagraphItem) {
        const value: { type?: unknown; entityType?: unknown; } = item.value as { type?: unknown; entityType?: unknown };
        if (value != null && (typeof value.type === 'number' || typeof value.entityType === 'number')) {
            return value as ConcreteParagraphItem;
        }
    }
    return item;
}

/**
 * Resolve a public leaf back to the stored wrapper (identity if unprojected).
 *
 * @param {ReadonlyArray<ConcreteParagraphItem>} items - The items.
 * @param {ConcreteParagraphItem | ParagraphItem} item - The item.
 * @returns {number} The result.
 * @private
 */
function resolveStoredItem(
    items: ReadonlyArray<ConcreteParagraphItem>,
    item: ConcreteParagraphItem | ParagraphItem
): number {
    for (const [i, raw] of items.entries()) {
        if (raw === item || projectPublicItem(raw) === item) {
            return i;
        }
    }
    return -1;
}

/**
 * Host for {@link ParagraphItemCollection}: owns mutation gates and document link.
 *
 * @private
 */
export interface ParagraphItemCollectionHost extends ParagraphItemOwner {
    /** Gate paragraph-level authoring (detached paragraph throws). */
    assertMutable(): void;
}

/**
 * Stable mutable collection of {@link ParagraphItem} children on a paragraph.
 *
 * Single source of truth for order, ownership, insert/remove, hydrate, and the
 * serialize snapshot. Indexers are own properties refreshed after each mutation
 * (no `Proxy` — TypeScript 3.3 / ES5 target).
 *
 * Array-like surface mirrors {@link BodyItemCollection}: {@link count}/{@link length},
 * numeric index, {@link add}/{@link insert}/{@link remove}/{@link removeAt}/{@link clear},
 * {@link toArray}, iterators, and common query helpers.
 *
 * @public
 */
export class ParagraphItemCollection implements Iterable<ConcreteParagraphItem> {
    // Numeric index signature for TypeScript consumers (runtime via defineProperty).
    // Non-optional per R3.1 — `items[index]` must not force `!` in consumer code.
    readonly [index: number]: ConcreteParagraphItem;

    private readonly host: ParagraphItemCollectionHost;
    private readonly items: ConcreteParagraphItem[];
    private cachedCount: number;

    /**
     * @param {ParagraphItemCollectionHost} host - The host.
     * @private
     */
    constructor(host: ParagraphItemCollectionHost) {
        this.host = host;
        this.items = [];
        this.cachedCount = 0;
        this.rebuildIndexProperties();
    }

    /**
     * Number of paragraph items in document order.
     * @public
     */
    get count(): number {
        return this.items.length;
    }

    /**
     * Alias of {@link count} for array-like consumers (`items.length`).
     * @public
     */
    get length(): number {
        return this.count;
    }

    /**
     * Append `item` at the end. Transfers ownership to this paragraph.
     *
     * Accepts both {@link ConcreteParagraphItem} and {@link FeatureRunLeaf} types.
     * Feature items (such as {@link Picture}) are automatically wrapped as
     * {@link FeatureRunParagraphItem} for storage in the collection.
     *
     * @param {ConcreteParagraphItem | FeatureRunLeaf} item - The item.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError if the paragraph is detached, or `item` is
     * already attached elsewhere.
     * @public
     */
    add(item: ConcreteParagraphItem | FeatureRunLeaf): void {
        this.insert(this.items.length, item);
    }

    /**
     * Insert `item` at `index` (`0…count` inclusive).
     *
     * Accepts both {@link ConcreteParagraphItem} and {@link FeatureRunLeaf} types.
     * Feature items are automatically wrapped as {@link FeatureRunParagraphItem}.
     *
     * @param {number} index - The index.
     * @param {ConcreteParagraphItem | FeatureRunLeaf} item - The item.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     * @throws DetachedObjectError if the paragraph is detached or `item` is owned.
     * @public
     */
    insert(index: number, item: ConcreteParagraphItem | FeatureRunLeaf): void {
        this.host.assertMutable();
        if (index < 0 || index > this.items.length) {
            throw new RangeError(`Paragraph item index ${String(index)} is out of range`);
        }

        // Check if item is a FeatureRunLeaf that needs wrapping
        // FeatureRunLeaf has toOpenXml() but is not a ConcreteParagraphItem
        let wrappedItem: ConcreteParagraphItem;
        if (item instanceof FeatureRunParagraphItem || item instanceof FeatureInlineParagraphItem) {
            // Already wrapped, use as-is
            wrappedItem = item;
        } else if (item instanceof ParagraphItem) {
            // Already a ParagraphItem, use as-is
            wrappedItem = item as ConcreteParagraphItem;
        } else if (typeof (item as { toOpenXml?: unknown }).toOpenXml === 'function') {
            // This is a FeatureRunLeaf - wrap it
            const featureId: FeatureId = getFeatureIdForLeaf(item as FeatureRunLeaf);
            wrappedItem = new FeatureRunParagraphItem(featureId, item as FeatureRunLeaf, new WireRunGroup());
        } else {
            // Fallback - treat as ConcreteParagraphItem
            wrappedItem = item as ConcreteParagraphItem;
        }

        this.assertNotOwned(wrappedItem);
        this.items.splice(index, 0, wrappedItem);
        wrappedItem.attach(this.host);
        this.rebuildIndexProperties();
    }

    /**
     * Remove `item` by identity and detach it.
     *
     * @param {ConcreteParagraphItem} item - The item.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError if `item` is not in this collection.
     * @public
     */
    remove(item: ConcreteParagraphItem): void {
        this.host.assertMutable();
        const at: number = resolveStoredItem(this.items, item);
        if (at === -1) {
            throw new DetachedObjectError('This paragraph item is no longer in its paragraph');
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const raw: ConcreteParagraphItem = this.items[at]!;
        this.items.splice(at, 1);
        raw.detach();
        this.rebuildIndexProperties();
    }

    /**
     * Remove the item at `index` (`0…count-1`) and detach it.
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @throws RangeError if `index` is out of range.
     * @public
     */
    removeAt(index: number): void {
        this.host.assertMutable();
        if (index < 0 || index >= this.items.length) {
            throw new RangeError(`Paragraph item index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ConcreteParagraphItem = this.items[index]!;
        this.items.splice(index, 1);
        item.detach();
        this.rebuildIndexProperties();
    }

    /**
     * Remove and detach every item.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    clear(): void {
        this.host.assertMutable();
        this.detachAll();
        this.items.length = 0;
        this.rebuildIndexProperties();
    }

    /**
     * @param {ParagraphItem} item - The item.
     * @returns {boolean} The result.
     *  Identity membership (reference equality).
     *
     * @private
     */
    containsIdentity(item: ParagraphItem): boolean {
        return this.indexOfIdentity(item) !== -1;
    }

    /**
     * Index of `item` by reference, or `-1`.
     *
     * @param {ConcreteParagraphItem} item - The item.
     * @returns {number} The result.
     * @public
     */
    indexOf(item: ConcreteParagraphItem): number {
        return resolveStoredItem(this.items, item);
    }

    /**
     * @param {ParagraphItem} item - The item.
     * @returns {number} The result.
     *  Index of `item` by reference, or `-1`.
     *
     * @private
     */
    indexOfIdentity(item: ParagraphItem): number {
        for (const [i, itemItem] of this.items.entries()) {
            if (itemItem === item) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Ordered public items (projects feature wrappers to leaf entities).
     *
     * @returns {ConcreteParagraphItem[]} The result.
     * @public
     */
    toArray(): ConcreteParagraphItem[] {
        const out: ConcreteParagraphItem[] = [];
        for (const item of this.items) {
            out.push(projectPublicItem(item));
        }
        return out;
    }

    /**
     * @returns {ConcreteParagraphItem[]} The result.
     *  Ordered storage snapshot for serialize (wrappers retained).
     *
     * @private
     */
    snapshot(): ConcreteParagraphItem[] {
        return this.items.slice();
    }

    /**
     * Invoke `fn` for each item in document order.
     *
     * @param {Function} fn - The fn.
     * @returns {void} Nothing is returned.
     * @public
     */
    forEach(fn: (item: ConcreteParagraphItem, index: number) => void): void {
        for (const [i, item] of this.items.entries()) {
            fn(projectPublicItem(item), i);
        }
    }

    /**
     * True when at least one item satisfies `predicate`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {boolean} The result.
     * @public
     */
    some(predicate: (item: ConcreteParagraphItem, index: number) => boolean): boolean {
        for (const [i, item] of this.items.entries()) {
            if (predicate(projectPublicItem(item), i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * True when every item satisfies `predicate` (empty collection is true).
     *
     * @param {Function} predicate - The predicate.
     * @returns {boolean} The result.
     * @public
     */
    every(predicate: (item: ConcreteParagraphItem, index: number) => boolean): boolean {
        for (const [i, item] of this.items.entries()) {
            if (!predicate(projectPublicItem(item), i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Items that satisfy `predicate`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {ConcreteParagraphItem[]} The result.
     * @public
     */
    filter(predicate: (item: ConcreteParagraphItem, index: number) => boolean): ConcreteParagraphItem[] {
        const out: ConcreteParagraphItem[] = [];
        for (const [i, itemItem] of this.items.entries()) {
            const item: ConcreteParagraphItem = projectPublicItem(itemItem);
            if (predicate(item, i)) {
                out.push(item);
            }
        }
        return out;
    }

    /**
     * First item that satisfies `predicate`, or `undefined`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {ConcreteParagraphItem | undefined} The result.
     * @public
     */
    find(predicate: (item: ConcreteParagraphItem, index: number) => boolean): ConcreteParagraphItem | undefined {
        for (const [i, itemItem] of this.items.entries()) {
            const item: ConcreteParagraphItem = projectPublicItem(itemItem);
            if (predicate(item, i)) {
                return item;
            }
        }
        return undefined;
    }

    /**
     * Index of the first item that satisfies `predicate`, or `-1`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {number} The result.
     * @public
     */
    findIndex(predicate: (item: ConcreteParagraphItem, index: number) => boolean): number {
        for (const [i, item] of this.items.entries()) {
            if (predicate(projectPublicItem(item), i)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Map items with `fn`.
     *
     * @param {Function} fn - The fn.
     * @returns {U[]} The result.
     * @public
     */
    map<U>(fn: (item: ConcreteParagraphItem, index: number) => U): U[] {
        const out: U[] = [];
        for (const [i, itemItem9] of this.items.entries()) {
            out.push(fn(projectPublicItem(itemItem9!), i));
        }
        return out;
    }

    /**
     * Iterate items in document order.
     *
     * @returns {Iterator<ConcreteParagraphItem>} The result.
     * @public
     */
    [Symbol.iterator](): Iterator<ConcreteParagraphItem> {
        const items: ConcreteParagraphItem[] = this.items.slice();
        let i: number = 0;
        return {
            next(): IteratorResult<ConcreteParagraphItem> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as ConcreteParagraphItem };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: ConcreteParagraphItem = projectPublicItem(items[i]!);
                i += 1;
                return { done: false, value: value };
            }
        };
    }

    /**
     * @param {ReadonlyArray<ConcreteParagraphItem>} items - The items.
     * @returns {void} Nothing is returned.
     *  Replace contents during parse/hydrate without authoring mutate.
     * Detaches prior items, attaches incoming items to this host.
     *
     * @private
     */
    hydrate(items: ReadonlyArray<ConcreteParagraphItem>): void {
        this.detachAll();
        this.items.length = 0;
        for (const item of items) {
            this.items.push(item);
            item.attach(this.host);
        }
        this.rebuildIndexProperties();
    }

    /**
     * @param {ConcreteParagraphItem} item - The item.
     * @returns {void} Nothing is returned.
     *  Append during parse without assertMutable (owner may still be wiring).
     *
     * @private
     */
    addFromParse(item: ConcreteParagraphItem): void {
        this.items.push(item);
        item.attach(this.host);
        this.rebuildIndexProperties();
    }

    /**
     * @returns {void} Nothing is returned.
     *  Detach every item without clearing the array (paragraph detach).
     *
     * @private
     */
    detachAll(): void {
        for (const item of this.items) {
            item.detach();
        }
    }

    /**
     * @returns {void} Nothing is returned.
     *  Re-attach every item to this host (paragraph attach).
     *
     * @private
     */
    reattachAll(): void {
        for (const itemItem9 of this.items) {
            itemItem9!.attach(this.host);
        }
    }

    private assertNotOwned(item: ConcreteParagraphItem): void {
        if (item.owner !== undefined) {
            if (item.owner === this.host && this.containsIdentity(item)) {
                throw new DetachedObjectError('Paragraph item is already in this paragraph');
            }
            throw new DetachedObjectError('Paragraph item is already attached');
        }
    }

    private rebuildIndexProperties(): void {
        const nextLen: number = this.items.length;
        const prevLen: number = this.cachedCount;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: ConcreteParagraphItem = projectPublicItem(this.items[i]!);
                Object.defineProperty(this, key, {
                    value: value,
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            } else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedCount = nextLen;
    }
}
