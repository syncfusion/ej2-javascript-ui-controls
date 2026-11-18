import { FeatureBlock } from '../../features/document/feature-block';
import { FeatureId } from './feature-registry';
import { BlockContent, Paragraph } from '../../features/document/paragraph';
/**
 * @private
 * Minimal document surface required for save-time materialization. */
export interface MaterializableDocument {
    listBlocks(): ReadonlyArray<BlockContent>;
    featurePart(id: FeatureId): unknown;
}
/** @public */
export interface FeatureMaterializeHandler {
    readonly featureId: FeatureId;
    materialize(document: MaterializableDocument): void;
}
/** @public */
export interface FeatureBlockParagraphWalker {
    readonly featureId: FeatureId;
    visitParagraphs(block: FeatureBlock, visit: (paragraph: Paragraph) => void): void;
}
const materializeHandlers: FeatureMaterializeHandler[] = [];
const blockParagraphWalkers: Map<FeatureId, FeatureBlockParagraphWalker> = new Map<FeatureId, FeatureBlockParagraphWalker>();
/**
 *  @public Test hook
 *
 * @returns {void} Nothing is returned.
 */
export function resetFeatureMaterializeHandlers(): void {
    materializeHandlers.length = 0;
    blockParagraphWalkers.clear();
}
/**
 *  @public
 *
 * @param {FeatureMaterializeHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 */
export function registerFeatureMaterializeHandler(handler: FeatureMaterializeHandler): void {
    materializeHandlers.push(handler);
}
/**
 *  @public
 *
 * @param {FeatureBlockParagraphWalker} walker - The walker.
 * @returns {void} Nothing is returned.
 */
export function registerFeatureBlockParagraphWalker(walker: FeatureBlockParagraphWalker): void {
    blockParagraphWalkers.set(walker.featureId, walker);
}
/**
 *  @public Visit body blocks and nested feature paragraphs in document order.
 *
 * @param {MaterializableDocument} document - The document.
 * @param {Function} visit - The visit.
 * @returns {void} Nothing is returned.
 */
export function visitParagraphsInDocumentOrder(document: MaterializableDocument, visit: (paragraph: Paragraph) => void): void {
    visitBlocksInDocumentOrder(document.listBlocks(), visit);
}
/**
 * Visit paragraphs inside an ordered block list using registered feature walkers.
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @param {Function} visit - The visit.
 * @returns {void} Nothing is returned.
 * @private
 */
export function visitBlocksInDocumentOrder(blocks: ReadonlyArray<BlockContent>, visit: (paragraph: Paragraph) => void): void {
    for (const block of blocks) {
        if (block.type === 'paragraph') {
            visit(block.paragraph);
            continue;
        }
        if (block.type === 'feature') {
            const walker: FeatureBlockParagraphWalker = blockParagraphWalkers.get(block.featureId);
            if (walker !== undefined) {
                walker.visitParagraphs(block.value, visit);
            }
        }
    }
}
/**
 *  @public Run every registered feature materialization pass.
 *
 * @param {MaterializableDocument} document - The document.
 * @returns {void} Nothing is returned.
 */
export function materializeFeatureSideEffects(document: MaterializableDocument): void {
    for (const handler of materializeHandlers) {
        handler.materialize(document);
    }
}
