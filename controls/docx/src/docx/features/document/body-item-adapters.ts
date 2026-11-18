import { BodyItem, isParagraphBodyItem } from './body-item';
import { BlockContent, Paragraph } from './paragraph';
import { FeatureId } from '../../core/registry/feature-registry';
import { FeatureBlock } from './feature-block';

/**
 * @private
 * Feature-block wrapper on the internal body store.
 */
export type FeatureBodyBlock = {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureBlock;
};

/**
 * @private
 * Maps a feature {@link BlockContent} entry to/from a public body-item instance.
 */
export type BodyItemAdapter = {
    /**
     * Project an internal feature block to a public instance, or `undefined` to skip.
     */
    project(block: FeatureBodyBlock): BodyItem | undefined;
    /**
     * Wrap a public instance as an internal feature block, or `undefined` if not this kind.
     */
    toBlock(item: BodyItem): FeatureBodyBlock | undefined;
    /**
     * True when `item` is a public instance owned by this adapter.
     */
    isInstance(item: unknown): item is BodyItem;
};

const adapters: BodyItemAdapter[] = [];

/**
 * @param {BodyItemAdapter} adapter - The adapter.
 * @returns {void} Nothing is returned.
 * @private
 * Register a feature adapter (tables, block content controls). Idempotent per call site.
 */
export function registerBodyItemAdapter(adapter: BodyItemAdapter): void {
    // Replace existing adapter with the same instance-predicate when re-registered in tests.
    for (const adapterItem of adapters) {
        if (adapterItem === adapter) {
            return;
        }
    }
    adapters.push(adapter);
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetBodyItemAdaptersForTests(): void {
    adapters.length = 0;
}

/**
 * @param {BlockContent} block - The block.
 * @returns {BodyItem | undefined} The result.
 * @private
 * Project an internal store entry to a public {@link BodyItem}, or `undefined`
 * when the block is opaque / unregistered feature markup (preserved off the public list).
 */
export function projectBlockToBodyItem(block: BlockContent): BodyItem | undefined {
    if (block.type === 'paragraph') {
        return block.paragraph;
    }
    if (block.type !== 'feature') {
        return undefined;
    }
    const featureBlock: FeatureBodyBlock = block;
    for (const adapter of adapters) {
        const projected: BodyItem = adapter.project(featureBlock);
        if (projected !== undefined) {
            return projected;
        }
    }
    return undefined;
}

/**
 * @param {BodyItem} item - The item.
 * @returns {BlockContent} The result.
 * @private
 * Convert a public body item to an internal {@link BlockContent} entry.
 *
 * Accepts direct {@link BodyItem} instances. Also unwraps legacy
 * `{ type: 'paragraph', paragraph }` / feature BlockContent-shaped values so
 * older call sites continue to work during the DOM flatten migration.
 *
 * @throws TypeError when `item` is not a supported public body item.
 */
export function bodyItemToBlock(item: BodyItem): BlockContent {
    if (isParagraphBodyItem(item)) {
        return { type: 'paragraph', paragraph: item };
    }
    // Legacy BlockContent wrapper still appearing in some tests/callers.
    if (typeof item === 'object' && item !== null) {
        const candidate: { type?: unknown; paragraph?: unknown; featureId?: unknown; value?: unknown; } = item as {
            type?: unknown;
            paragraph?: unknown;
            featureId?: unknown;
            value?: unknown;
        };
        if (candidate.type === 'paragraph' && candidate.paragraph instanceof Paragraph) {
            return { type: 'paragraph', paragraph: candidate.paragraph };
        }
        if (candidate.type === 'feature' && candidate.value !== undefined) {
            for (const adapter of adapters) {
                if (adapter.isInstance(candidate.value)) {
                    const block: FeatureBodyBlock = adapter.toBlock(candidate.value as BodyItem);
                    if (block !== undefined) {
                        return block;
                    }
                }
            }
        }
    }
    for (const adapter of adapters) {
        const block: FeatureBodyBlock = adapter.toBlock(item);
        if (block !== undefined) {
            return block;
        }
    }
    throw new TypeError('Unsupported body item type');
}

/**
 * @param {unknown} value - The value.
 * @returns {*} The result.
 * @private
 * True when `value` is a public body item (paragraph or registered feature instance).
 */
export function isSupportedBodyItem(value: unknown): value is BodyItem {
    if (value instanceof Paragraph) {
        return true;
    }
    for (const adapter of adapters) {
        if (adapter.isInstance(value)) {
            return true;
        }
    }
    return false;
}
