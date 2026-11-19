import { BodyItem, isParagraphBodyItem } from './body-item';
import { isTableBlock } from '../tables/index';
import { isBlockContentControl } from '../content-controls/index';
import {
    Break,
    CarriageReturn,
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    OpaqueParagraphItem,
    OpaqueRunItem,
    ParagraphItem,
    Symbol,
    Tab,
    TextRange
} from './text-range';
import { FeatureId } from '../../core/registry/feature-registry';

/**
 * Coarse public kind for a body child when walking {@link BodyItem} lists
 * (`Body.items`, `Header.items`, table cells, note bodies, …).
 *
 * Prefer this with {@link elementTypeOf} for `switch` branching; use
 * {@link isTableBlock} / {@link isBlockContentControl} to narrow feature payloads.
 *
 * @public
 */
export type ElementType =
    | 'paragraph'
    | 'table'
    | 'blockContentControl'
    | 'opaque'
    | 'feature';

/**
 * Classify a {@link BodyItem} for switch-friendly type discrimination.
 *
 * - Paragraph instance → `'paragraph'`
 * - Table feature block / instance → `'table'`
 * - Block content control → `'blockContentControl'`
 * - Other modeled feature blocks → `'feature'`
 * - Preserved unmodeled markup → `'opaque'`
 *
 * Always-on tables and content-controls register before consumers walk body
 * items from the main entry; unregistered domains still return `'feature'` or
 * `'opaque'` rather than throwing.
 *
 * Public {@link BodyItem} is an instance union (no wrapper `type` tags).
 * Discriminate with {@link isParagraphBodyItem} and feature guards.
 *
 * @param {BodyItem} item - Body child from any body-shaped list.
 * @returns {ElementType} Coarse {@link ElementType} tag.
 *
 * @private
 */
export function elementTypeOf(item: BodyItem): ElementType {
    if (isParagraphBodyItem(item)) {
        return 'paragraph';
    }
    if (isTableBlock(item)) {
        return 'table';
    }
    if (isBlockContentControl(item)) {
        return 'blockContentControl';
    }
    return 'feature';
}

/**
 * Public kind for a paragraph child when walking {@link Paragraph.items}.
 *
 * Feature-owned payloads (images, hyperlinks, fields, …) are classified by
 * registered {@link registerParagraphElementClassifier} handlers or by their
 * known feature id fallbacks — never as a public `'feature'` tag.
 *
 * @public
 */
export type ParagraphElementType =
    | 'textRange'
    | 'break'
    | 'tab'
    | 'carriageReturn'
    | 'symbol'
    | 'image'
    | 'hyperlink'
    | 'field'
    | 'bookmark'
    | 'shape'
    | 'inlineContentControl'
    | 'comment'
    | 'editableRange'
    | 'ole'
    | 'revision'
    | 'note'
    | 'opaque'
    | 'unknown';

type ParagraphElementClassifier = (item: ParagraphItem) => ParagraphElementType | undefined;

const paragraphElementClassifiers: ParagraphElementClassifier[] = [];

/**
 * Register a feature-provided classifier used by {@link paragraphElementTypeOf}.
 * Classifiers run in registration order; the first non-undefined result wins.
 *
 * @param {ParagraphElementClassifier} classifier - The classifier.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerParagraphElementClassifier(classifier: ParagraphElementClassifier): void {
    paragraphElementClassifiers.push(classifier);
}

/**
 *   Test hook
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetParagraphElementClassifiersForTests(): void {
    paragraphElementClassifiers.length = 0;
}

function featureIdOf(item: ParagraphItem): FeatureId | undefined {
    if (item instanceof FeatureRunParagraphItem || item instanceof FeatureInlineParagraphItem) {
        return item.featureId;
    }
    return undefined;
}

/**
 * Classify a {@link ParagraphItem} for switch-friendly type discrimination.
 *
 * Built-in tags cover text, breaks, tabs, symbols, and opaque markup. Feature
 * modules map their payloads (image, hyperlink, …) via registered classifiers
 * or known feature-id fallbacks. There is no public `'feature'` tag.
 *
 * @param {ParagraphItem} item - Child of {@link Paragraph.items}.
 * @returns {ParagraphElementType} Coarse {@link ParagraphElementType} tag.
 *
 * @private
 */
export function paragraphElementTypeOf(item: ParagraphItem): ParagraphElementType {
    if (item instanceof TextRange) {
        return 'textRange';
    }
    if (item instanceof Break) {
        return 'break';
    }
    if (item instanceof Tab) {
        return 'tab';
    }
    if (item instanceof CarriageReturn) {
        return 'carriageReturn';
    }
    if (item instanceof Symbol) {
        return 'symbol';
    }
    if (item instanceof OpaqueParagraphItem || item instanceof OpaqueRunItem) {
        return 'opaque';
    }
    for (const classifier of paragraphElementClassifiers) {
        const hit: ParagraphElementType = classifier(item);
        if (hit !== undefined) {
            return hit;
        }
    }
    const id: FeatureId = featureIdOf(item);
    if (id !== undefined) {
        const key: string = String(id);
        if (key === 'images') {
            return 'image';
        }
        if (key === 'hyperlinks') {
            return 'hyperlink';
        }
        if (key === 'fields') {
            return 'field';
        }
        if (key === 'bookmarks') {
            return 'bookmark';
        }
        if (key === 'drawing') {
            return 'shape';
        }
        if (key === 'content-controls') {
            return 'inlineContentControl';
        }
        if (key === 'comments') {
            return 'comment';
        }
        if (key === 'editable-ranges') {
            return 'editableRange';
        }
        if (key === 'ole-object' || key === 'ole') {
            return 'ole';
        }
        if (key === 'revisions') {
            return 'revision';
        }
        if (key === 'notes' || key === 'footnotes' || key === 'endnotes') {
            return 'note';
        }
    }
    return 'unknown';
}
