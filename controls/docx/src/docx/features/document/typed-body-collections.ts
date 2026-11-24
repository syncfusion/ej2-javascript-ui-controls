import { DetachedObjectError } from '../../core/errors/docx-error';
import { BodyItem } from './body-item';
import { BodyItemCollection } from './body-item-collection';
import { Paragraph } from './paragraph';

/**
 * @private
 * Factory that creates a detached instance for typed `add()` / `insert()` with
 * no customer-supplied item (paragraph / table / block CC shells).
 */
export type TypedItemFactory<T extends BodyItem> = () => T;

/**
 * @private
 */
export type TypedCollectionFilter<T extends BodyItem> = (item: BodyItem) => item is T;

/**
 * Filtered view over {@link BodyItemCollection} for one body-item kind.
 *
 * Insert index is among items of this type only; the item is placed at the
 * corresponding position in the full body order.
 *
 *  Internal filtered collection. Not part of the public API.
 *
 * @private
 */
export class TypedBodyItemCollection<T extends BodyItem> implements Iterable<T> {
    /**
     * Index signature for the internal filtered collection.
     *
     * @private
     */
    readonly [index: number]: T;

    private readonly items: BodyItemCollection;
    private readonly typeFilter: TypedCollectionFilter<T>;
    private readonly factory: TypedItemFactory<T> | undefined;
    private cachedLength: number = 0;

    /**
     *  @private
     *
     * @param {BodyItemCollection} items - The items.
     * @param {TypedCollectionFilter<T>} typeFilter - The type filter.
     * @param {TypedItemFactory<T>} factory - The factory.
     */
    constructor(
        items: BodyItemCollection,
        typeFilter: TypedCollectionFilter<T>,
        factory?: TypedItemFactory<T>
    ) {
        this.items = items;
        this.typeFilter = typeFilter;
        this.factory = factory;
        this.rebuildIndexProperties();
    }

    /** Number of items of this type in the body. */
    get count(): number {
        return this.list().length;
    }

    /**
     * Alias of {@link count} for array-like consumers (`toHaveLength`, `.length`).
     */
    get length(): number {
        return this.count;
    }

    /**
     * Appends a new item of this type to the end of the collection. The item is created by the registered factory when no `item` is passed.
     *
     * @param {T} item - Specifies the item to append. When omitted, a new item is created by the registered factory.
     * @returns {T} Returns the appended item.
     */
    add(item?: T): T {
        return this.insert(this.count, item);
    }

    /**
     * Inserts an item of this type at the specified typed index (`0…count` inclusive).
     *
     * @param {number} index - Specifies the zero-based typed index at which the item is inserted.
     * @param {T} item - Specifies the item to insert. When omitted, a new item is created by the registered factory.
     * @returns {T} Returns the inserted item.
     * @throws RangeError when `index` is outside `0…count`.
     * @throws TypeError when no factory is registered and `item` is omitted.
     */
    insert(index: number, item?: T): T {
        const typed: T[] = this.list();
        if (index < 0 || index > typed.length) {
            throw new RangeError(`Index ${String(index)} is out of range`);
        }
        let value: T;
        if (item !== undefined) {
            value = item;
        } else if (this.factory !== undefined) {
            value = this.factory();
        } else {
            throw new TypeError('No item provided and no factory is registered for this collection');
        }
        if (!this.typeFilter(value)) {
            throw new TypeError('Item type does not match this collection');
        }
        const bodyIndex: number = this.bodyIndexForTypedInsert(index, typed);
        this.items.insert(bodyIndex, value);
        this.rebuildIndexProperties();
        return value;
    }

    /**
     * Removes the specified item from the collection by instance identity.
     *
     * @param {T} item - Specifies the item to remove.
     * @returns {void} Nothing is returned.
     */
    remove(item: T): void {
        if (this.items.indexOf(item) === -1 || !this.typeFilter(item)) {
            throw new DetachedObjectError('Item is not in this collection');
        }
        this.items.remove(item);
        this.rebuildIndexProperties();
    }

    /**
     * Removes the item at the specified typed index.
     *
     * @param {number} index - Specifies the zero-based typed index of the item to remove.
     * @returns {void} Nothing is returned.
     * @throws RangeError when `index` is outside the collection.
     */
    removeAt(index: number): void {
        const typed: T[] = this.list();
        if (index < 0 || index >= typed.length) {
            throw new RangeError(`Index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        this.items.remove(typed[index]!);
        this.rebuildIndexProperties();
    }

    /**
     * Gets the typed index of the specified item, or `-1` when the item is not in the collection.
     *
     * @param {T} item - Specifies the item to locate.
     * @returns {number} Returns the zero-based typed index of the item, or `-1`.
     */
    indexOf(item: T): number {
        const typed: T[] = this.list();
        for (const [i, t] of typed.entries()) {
            if (t === item) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Creates a snapshot array of the items of this type in document order.
     *
     * @returns {T[]} Returns a copy of the items as an array.
     */
    toArray(): T[] {
        return this.list();
    }

    /**
     * Invokes the specified callback for each item of this type.
     *
     * @param {Function} fn - Specifies the callback that receives each item and its typed index.
     * @returns {void} Nothing is returned.
     */
    forEach(fn: (item: T, index: number) => void): void {
        const items: T[] = this.list();
        for (const [i, t] of items.entries()) {
            fn(t, i);
        }
    }

    /**
     * Determines whether at least one item of this type satisfies the specified predicate.
     *
     * @param {Function} predicate - Specifies the condition to test each item against.
     * @returns {boolean} Returns `true` when at least one item satisfies the predicate; otherwise, `false`.
     */
    some(predicate: (item: T, index: number) => boolean): boolean {
        const items: T[] = this.list();
        for (const [i, t] of items.entries()) {
            if (predicate(t, i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the items of this type that satisfy the specified predicate.
     *
     * @param {Function} predicate - Specifies the condition to test each item against.
     * @returns {T[]} Returns the items that satisfy the predicate.
     */
    filter(predicate: (item: T, index: number) => boolean): T[] {
        const items: T[] = this.list();
        const out: T[] = [];
        for (const [i, item] of items.entries()) {
            if (predicate(item, i)) {
                out.push(item);
            }
        }
        return out;
    }

    /**
     * Gets the first item of this type that satisfies the specified predicate.
     *
     * @param {Function} predicate - Specifies the condition to test each item against.
     * @returns {T | undefined} Returns the first matching item, or `undefined` when none matches.
     */
    find(predicate: (item: T, index: number) => boolean): T | undefined {
        const items: T[] = this.list();
        for (const [i, item] of items.entries()) {
            if (predicate(item, i)) {
                return item;
            }
        }
        return undefined;
    }

    /**
     * Projects the items of this type to a new array by using the specified callback.
     *
     * @param {Function} fn - Specifies the callback that converts each item and its typed index.
     * @returns {U[]} Returns the array of converted values.
     */
    map<U>(fn: (item: T, index: number) => U): U[] {
        const items: T[] = this.list();
        const out: U[] = [];
        for (const [i, t] of items.entries()) {
            out.push(fn(t, i));
        }
        return out;
    }

    [Symbol.iterator](): Iterator<T> {
        const items: T[] = this.list();
        let i: number = 0;
        return {
            next(): IteratorResult<T> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as T };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: T = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    syncFromHost(): void {
        this.rebuildIndexProperties();
    }

    /**
     * @param {TypedItemFactory<T> | undefined} factory - The factory.
     * @returns {void} Nothing is returned.
     * @private
     * Replace the factory used by parameterless add/insert.
     */
    setFactory(factory: TypedItemFactory<T> | undefined): void {
        (this as unknown as { factory: TypedItemFactory<T> | undefined }).factory = factory;
    }

    private list(): T[] {
        const out: T[] = [];
        const length: number = this.items.count;
        for (let i: number = 0; i < length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const item: BodyItem = this.items[i];
            if (item !== undefined && this.typeFilter(item)) {
                out.push(item);
            }
        }
        return out;
    }

    private bodyIndexForTypedInsert(typedIndex: number, typed: ReadonlyArray<T>): number {
        if (typedIndex === typed.length) {
            // Typed append is document-order: place at the end of the body,
            // not after the last item of this type (which would skip later
            // tables / SDTs and break mixed-body authoring order).
            return this.items.count;
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const target: T = typed[typedIndex]!;
        const at: number = this.items.indexOf(target);
        if (at === -1) {
            throw new DetachedObjectError('Typed collection index is inconsistent');
        }
        return at;
    }

    private rebuildIndexProperties(): void {
        const items: T[] = this.list();
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                Object.defineProperty(this, key, {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    value: items[i],
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            } else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }
}
/**
 * Paragraphs in a section body (filtered view).
 *
 * @public
 */
export class ParagraphCollection extends TypedBodyItemCollection<Paragraph> {
    /**
     *  @private
     *
     * @param {BodyItemCollection} items - The items.
     * @param {TypedItemFactory<Paragraph>} factory - The factory.
     */
    constructor(items: BodyItemCollection, factory?: TypedItemFactory<Paragraph>) {
        super(items, (item: BodyItem): item is Paragraph => item instanceof Paragraph, factory);
    }
}

/**
 * Tables in a section body (filtered view).
 *
 * @public
 */
export class TableCollection extends TypedBodyItemCollection<BodyItem> {
    /**
     *  @private
     *
     * @param {BodyItemCollection} items - The items.
     * @param {TypedCollectionFilter<BodyItem>} isTable - The is table.
     * @param {TypedItemFactory<BodyItem>} factory - The factory.
     */
    constructor(
        items: BodyItemCollection,
        isTable: TypedCollectionFilter<BodyItem>,
        factory?: TypedItemFactory<BodyItem>
    ) {
        super(items, isTable, factory);
    }
}

/**
 * Block content controls in a section body (filtered view).
 *
 * @public
 */
export class BlockContentControlCollection extends TypedBodyItemCollection<BodyItem> {
    /**
     *  @private
     *
     * @param {BodyItemCollection} items - The items.
     * @param {TypedCollectionFilter<BodyItem>} isBlockCc - The is block cc.
     * @param {TypedItemFactory<BodyItem>} factory - The factory.
     */
    constructor(
        items: BodyItemCollection,
        isBlockCc: TypedCollectionFilter<BodyItem>,
        factory?: TypedItemFactory<BodyItem>
    ) {
        super(items, isBlockCc, factory);
    }
}

/**
 * @private
 * Registration hooks so features can supply table / CC factories and filters
 * without core value-importing feature modules.
 */
export type TypedCollectionHooks = {
    isTable?(item: BodyItem): boolean;
    createTable?(): BodyItem;
    isBlockContentControl?(item: BodyItem): boolean;
    createBlockContentControl?(): BodyItem;
};

let typedHooks: TypedCollectionHooks = {};

/**
 * @param {TypedCollectionHooks} hooks - The hooks.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerTypedCollectionHooks(hooks: TypedCollectionHooks): void {
    typedHooks = { ...typedHooks, ...hooks };
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetTypedCollectionHooksForTests(): void {
    typedHooks = {};
}

/**
 * @returns {TypedCollectionHooks} The result.
 * @private
 */
export function currentTypedCollectionHooks(): TypedCollectionHooks {
    return typedHooks;
}

/**
 * @param {BodyItemCollection} items - The items.
 * @returns {TableCollection} The result.
 * @private
 * Live filter/factory over {@link currentTypedCollectionHooks} so long-lived
 * section collections do not permanently capture a pre-registration snapshot
 * (hooks object is replaced on each {@link registerTypedCollectionHooks} call).
 */
export function createTableCollection(items: BodyItemCollection): TableCollection {
    const filter: TypedCollectionFilter<BodyItem> = (item: BodyItem): item is BodyItem => {
        const isTable: (item: BodyItem) => boolean = currentTypedCollectionHooks().isTable;
        return isTable !== undefined ? isTable(item) : false;
    };
    const factory: TypedItemFactory<BodyItem> = (): BodyItem => {
        const create: () => BodyItem = currentTypedCollectionHooks().createTable;
        if (create === undefined) {
            throw new TypeError('No item provided and no factory is registered for this collection');
        }
        return create();
    };
    return new TableCollection(items, filter, factory);
}

/**
 * @param {BodyItemCollection} items - The items.
 * @returns {BlockContentControlCollection} The result.
 * @private
 * Live filter/factory over {@link currentTypedCollectionHooks} (see
 * {@link createTableCollection}).
 */
export function createBlockContentControlCollection(
    items: BodyItemCollection
): BlockContentControlCollection {
    const filter: TypedCollectionFilter<BodyItem> = (item: BodyItem): item is BodyItem => {
        const isBlockCc: (item: BodyItem) => boolean = currentTypedCollectionHooks().isBlockContentControl;
        return isBlockCc !== undefined ? isBlockCc(item) : false;
    };
    const factory: TypedItemFactory<BodyItem> = (): BodyItem => {
        const create: () => BodyItem = currentTypedCollectionHooks().createBlockContentControl;
        if (create === undefined) {
            throw new TypeError('No item provided and no factory is registered for this collection');
        }
        return create();
    };
    return new BlockContentControlCollection(items, filter, factory);
}
