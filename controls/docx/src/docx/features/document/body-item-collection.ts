import { DetachedObjectError } from '../../core/errors/docx-error';
import { bindAltChunkDocument } from './alt-chunk';
import {
    bodyItemToBlock,
    isSupportedBodyItem,
    projectBlockToBodyItem
} from './body-item-adapters';
import { BodyItem } from './body-item';
import { BlockContent, Paragraph } from './paragraph';
import { WordDocument } from './document';
import { Section } from './section';

/**
 * @private
 * Host that owns the internal ordered {@link BlockContent} store projected by
 * {@link BodyItemCollection}.
 */
export interface BodyItemCollectionHost {
    /**
     * @private
     */
    owningDocument(): WordDocument;
    /**
     * @private
     */
    owningSection(): Section | undefined;
    /**
     * @private
     */
    rawBlocks(): BlockContent[];
    /**
     * @private
     */
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void;
    /**
     * @private
     */
    assertAttachedParagraph(target: Paragraph): void;
    /**
     * @private
     * Refresh body/section typed views after public or raw item mutations.
     * Optional so test doubles need not implement it.
     */
    notifyBodyItemsChanged?(): void;
}

function bindDocumentToFeatureBlock(value: unknown, document: WordDocument): void {
    if (typeof value !== 'object' || value === null || !('bindDocument' in value)) {
        return;
    }
    const bindDocument: (doc: WordDocument) => void = (value as { bindDocument: (doc: WordDocument) => void }).bindDocument;
    if (typeof bindDocument === 'function') {
        bindDocument.call(value, document);
    }
}

function releaseFeatureBlock(value: unknown): void {
    if (typeof value !== 'object' || value === null || !('releaseContent' in value)) {
        return;
    }
    const release: () => void = (value as { releaseContent?: () => void }).releaseContent;
    if (typeof release === 'function') {
        release.call(value);
    }
}

function blocksEqual(a: BlockContent, b: BlockContent): boolean {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === 'paragraph' && b.type === 'paragraph') {
        return a.paragraph === b.paragraph;
    }
    if (a.type === 'feature' && b.type === 'feature') {
        return a.featureId === b.featureId && a.value === b.value;
    }
    if (a.type === 'opaque' && b.type === 'opaque') {
        return a.xml === b.xml;
    }
    return false;
}

function findBlockIndexForBodyItem(blocks: ReadonlyArray<BlockContent>, item: BodyItem): number {
    for (const [i, content] of blocks.entries()) {
        const projected: BodyItem = projectBlockToBodyItem(content);
        if (projected === item) {
            return i;
        }
    }
    return -1;
}

/**
 * Managed mutable collection of public {@link BodyItem} instances for a body.
 *
 * Projects from the body's internal ordered store. Unsupported markup remains
 * in the package but is not listed here. Index access uses own numeric
 * properties (no `Proxy`); identity at a given index is stable across reads.
 *
 * @public
 */
export class BodyItemCollection implements Iterable<BodyItem> {
    // Numeric index signature for TypeScript consumers (runtime via defineProperty).
    // Non-optional per R3.1 — `items[index]` must not force `!` in consumer code.
    readonly [index: number]: BodyItem;

    private readonly host: BodyItemCollectionHost;
    private cachedLength: number = 0;

    /**
     *  @private
     *
     * @param {BodyItemCollectionHost} host - The host.
     */
    constructor(host: BodyItemCollectionHost) {
        this.host = host;
        this.rebuildIndexProperties();
    }

    /**
     * Number of public body items (paragraphs, tables, block content controls).
     */
    get count(): number {
        return this.project().length;
    }

    /**
     * Alias of {@link count} for array-like consumers (`toHaveLength`, `items.length`).
     */
    get length(): number {
        return this.count;
    }

    /**
     * Append a body item after existing public children.
     *
     * @param {BodyItem} item - Paragraph, table, or block content control instance.
     * @returns {BodyItem} The same `item` reference.
     * @throws TypeError when `item` is not a supported body item.
     * @throws DetachedObjectError when `item` is already owned.
     */
    add(item: BodyItem): BodyItem {
        return this.insert(this.count, item);
    }

    /**
     * Insert a body item at a public-items index (`0…count` inclusive).
     *
     * @param {number} index - Insert-before index; `count` appends.
     * @param {BodyItem} item - Paragraph, table, or block content control instance.
     * @returns {BodyItem} The same `item` reference.
     * @throws RangeError when `index` is outside `0…count`.
     * @throws TypeError when `item` is not a supported body item.
     * @throws DetachedObjectError when `item` is already owned.
     */
    insert(index: number, item: BodyItem): BodyItem {
        if (!isSupportedBodyItem(item)) {
            throw new TypeError('BodyItemCollection accepts only Paragraph, Table, or block content control instances');
        }
        const projected: BodyItem[] = this.project();
        if (index < 0 || index > projected.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        this.assertNotOwned(item);
        const block: BlockContent = bodyItemToBlock(item);
        const raw: BlockContent[] = this.host.rawBlocks();
        const at: number = this.rawIndexForPublicInsert(index, projected, raw);
        this.insertRawBlockAt(at, block);
        return item;
    }

    /**
     * Remove a body item by instance identity.
     *
     * @param {BodyItem} item - Item currently in this collection.
     * @returns {void} Nothing is returned.
     * @throws DetachedObjectError when `item` is not in this collection.
     */
    remove(item: BodyItem): void {
        const at: number = findBlockIndexForBodyItem(this.host.rawBlocks(), item);
        if (at === -1) {
            throw new DetachedObjectError('Body item is not in this body');
        }
        this.removeRawBlockAt(at);
    }

    /**
     * Remove the public body item at `index` (`0…count-1`).
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @throws RangeError when `index` is out of range.
     */
    removeAt(index: number): void {
        const projected: BodyItem[] = this.project();
        if (index < 0 || index >= projected.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: BodyItem = projected[index]!;
        const at: number = findBlockIndexForBodyItem(this.host.rawBlocks(), item);
        if (at === -1) {
            throw new DetachedObjectError('Body item is not in this body');
        }
        this.removeRawBlockAt(at);
    }

    /**
     * Remove all body items (paragraphs, tables, block content controls) and
     * detach/release owned content. Opaque unmodeled blocks are also cleared.
     *
     * @returns {void} Nothing is returned.
     */
    clear(): void {
        const raw: BlockContent[] = this.host.rawBlocks();
        if (raw.length === 0) {
            this.rebuildIndexProperties();
            this.notifyHostBodyItemsChanged();
            return;
        }
        const snapshot: BlockContent[] = raw.slice();
        this.host.replaceRawBlocks([]);
        for (const block of snapshot) {
            if (block.type === 'paragraph') {
                block.paragraph.detach();
            } else if (block.type === 'feature') {
                releaseFeatureBlock(block.value);
            }
        }
        this.rebuildIndexProperties();
        this.notifyHostBodyItemsChanged();
    }

    /**
     * Index of `item` in this collection, or `-1` when absent.
     *
     * @param {BodyItem} item - The item.
     * @returns {number} The result.
     */
    indexOf(item: BodyItem): number {
        const projected: BodyItem[] = this.project();
        for (const [i, itemItem] of projected.entries()) {
            if (itemItem === item) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Snapshot of public body items in order.
     *
     * @returns {BodyItem[]} The result.
     */
    toArray(): BodyItem[] {
        return this.project();
    }

    /**
     * Invoke `fn` for each public body item.
     *
     * @param {Function} fn - The fn.
     * @returns {void} Nothing is returned.
     */
    forEach(fn: (item: BodyItem, index: number) => void): void {
        const items: BodyItem[] = this.project();
        for (const [i, item] of items.entries()) {
            fn(item, i);
        }
    }

    /**
     * True when at least one public body item satisfies `predicate`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {boolean} The result.
     */
    some(predicate: (item: BodyItem, index: number) => boolean): boolean {
        const items: BodyItem[] = this.project();
        for (const [i, item] of items.entries()) {
            if (predicate(item, i)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Public body items that satisfy `predicate`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {BodyItem[]} The result.
     */
    filter(predicate: (item: BodyItem, index: number) => boolean): BodyItem[] {
        const items: BodyItem[] = this.project();
        const out: BodyItem[] = [];
        for (const [i, item] of items.entries()) {
            if (predicate(item, i)) {
                out.push(item);
            }
        }
        return out;
    }

    /**
     * First public body item that satisfies `predicate`, or `undefined`.
     *
     * @param {Function} predicate - The predicate.
     * @returns {BodyItem | undefined} The result.
     */
    find(predicate: (item: BodyItem, index: number) => boolean): BodyItem | undefined {
        const items: BodyItem[] = this.project();
        for (const [i, item] of items.entries()) {
            if (predicate(item, i)) {
                return item;
            }
        }
        return undefined;
    }

    /**
     * Map public body items with `fn`.
     *
     * @param {Function} fn - The fn.
     * @returns {U[]} The result.
     */
    map<U>(fn: (item: BodyItem, index: number) => U): U[] {
        const items: BodyItem[] = this.project();
        const out: U[] = [];
        for (const [i, item] of items.entries()) {
            out.push(fn(item, i));
        }
        return out;
    }

    /**
     * Iterate public body items in document order.
     *
     * @returns {Iterator<BodyItem>} The result.
     */
    [Symbol.iterator](): Iterator<BodyItem> {
        const items: BodyItem[] = this.project();
        let i: number = 0;
        return {
            next(): IteratorResult<BodyItem> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as BodyItem };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: BodyItem = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     * Refresh numeric index properties after any raw-store mutation outside
     * this collection (load, feature internal hooks).
     */
    syncFromHost(): void {
        this.rebuildIndexProperties();
    }

    /**
     * @param {number} index - The index.
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     * Insert an internal block at a raw store index (features / load bridge).
     */
    insertRawBlockAt(index: number, block: BlockContent): void {
        const raw: BlockContent[] = this.host.rawBlocks();
        if (index < 0 || index > raw.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        const document: WordDocument = this.host.owningDocument();
        if (block.type === 'paragraph') {
            block.paragraph.attach(this.host);
        } else if (block.type === 'feature') {
            bindDocumentToFeatureBlock(block.value, document);
        }
        const next: BlockContent[] = raw.slice();
        next.splice(index, 0, block);
        this.host.replaceRawBlocks(next);
        bindAltChunkDocument([block], document);
        this.rebuildIndexProperties();
        this.notifyHostBodyItemsChanged();
    }

    /**
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeRawBlockAt(index: number): void {
        const raw: BlockContent[] = this.host.rawBlocks();
        if (index < 0 || index >= raw.length) {
            throw new RangeError(`Body item index ${String(index)} is out of range`);
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const block: BlockContent = raw[index]!;
        const next: BlockContent[] = raw.slice();
        next.splice(index, 1);
        this.host.replaceRawBlocks(next);
        if (block.type === 'paragraph') {
            block.paragraph.detach();
        } else if (block.type === 'feature') {
            releaseFeatureBlock(block.value);
        }
        this.rebuildIndexProperties();
        this.notifyHostBodyItemsChanged();
    }

    /**
     * @param {BlockContent} block - The block.
     * @returns {void} Nothing is returned.
     * @private
     */
    appendRawBlock(block: BlockContent): void {
        this.insertRawBlockAt(this.host.rawBlocks().length, block);
    }

    /**
     * @param {BlockContent} block - The block.
     * @returns {number} The result.
     * @private
     */
    indexOfRawBlock(block: BlockContent): number {
        const raw: BlockContent[] = this.host.rawBlocks();
        const direct: number = raw.indexOf(block);
        if (direct !== -1) {
            return direct;
        }
        for (const [i, content] of raw.entries()) {
            if (blocksEqual(content, block)) {
                return i;
            }
        }
        return -1;
    }

    private project(): BodyItem[] {
        const raw: BlockContent[] = this.host.rawBlocks();
        const out: BodyItem[] = [];
        for (const content of raw) {
            const item: BodyItem = projectBlockToBodyItem(content);
            if (item !== undefined) {
                out.push(item);
            }
        }
        return out;
    }

    private rawIndexForPublicInsert(
        publicIndex: number,
        projected: ReadonlyArray<BodyItem>,
        raw: ReadonlyArray<BlockContent>
    ): number {
        if (publicIndex === projected.length) {
            return raw.length;
        }
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const target: BodyItem = projected[publicIndex]!;
        const at: number = findBlockIndexForBodyItem(raw, target);
        if (at === -1) {
            throw new DetachedObjectError('Body item index is inconsistent');
        }
        return at;
    }

    private assertNotOwned(item: BodyItem): void {
        const raw: BlockContent[] = this.host.rawBlocks();
        if (findBlockIndexForBodyItem(raw, item) !== -1) {
            throw new DetachedObjectError('Body item is already in this body');
        }
        if (item instanceof Paragraph) {
            try {
                // Attached paragraphs throw when mutate path runs; owningDocument is public-ish.
                const doc: WordDocument = item.owningDocument();
                if (doc !== this.host.owningDocument()) {
                    throw new DetachedObjectError('Body item belongs to another document');
                }
                // Same document but not in this body (e.g. nested cell / other section).
                throw new DetachedObjectError('Body item is already attached');
            } catch (err) {
                if (err instanceof DetachedObjectError && err.message === 'This paragraph is no longer in a document') {
                    return;
                }
                if (err instanceof DetachedObjectError) {
                    throw err;
                }
                throw err;
            }
        }
        // Feature instances: detect via bindDocument presence + optional owner probe.
        if (typeof item === 'object' && item !== null && 'owningDocument' in item) {
            const owning: () => WordDocument = (item as { owningDocument?: () => WordDocument | undefined }).owningDocument;
            if (typeof owning === 'function') {
                let owner: WordDocument | undefined;
                try {
                    owner = owning.call(item);
                } catch {
                    owner = undefined;
                }
                if (owner !== undefined) {
                    if (owner !== this.host.owningDocument()) {
                        throw new DetachedObjectError('Body item belongs to another document');
                    }
                    throw new DetachedObjectError('Body item is already attached');
                }
            }
        }
    }

    private rebuildIndexProperties(): void {
        const items: BodyItem[] = this.project();
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: BodyItem = items[i]!;
                Object.defineProperty(this, key, {
                    value,
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            } else {
                // Remove stale index
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }

    private notifyHostBodyItemsChanged(): void {
        const notify: () => void = this.host.notifyBodyItemsChanged;
        if (typeof notify === 'function') {
            notify.call(this.host);
        }
    }
}
