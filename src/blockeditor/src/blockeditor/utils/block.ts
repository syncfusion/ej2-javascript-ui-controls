import { detach } from '@syncfusion/ej2-base';
import { BlockModel, Content, ContentModel } from '../models/index';
import { BlockType } from '../base/enums';
import { getSelectionRange } from './selection';
import { findClosestParent } from './dom';

/**
 * Finds a block by its ID.
 *
 * Searches recursively through the list of blocks to find a block with the specified ID.
 *
 * @param {string} blockId - The ID of the block.
 * @param {BlockModel[]} blocks - The list of blocks.
 * @returns {BlockModel | null} The matching block or null if not found.
 */
export function getBlockModelById(blockId: string, blocks: BlockModel[]): BlockModel | null {
    if (!blocks) { return null; }
    for (const block of blocks) {
        if (block.id === blockId) {
            return block;
        }
        if (block.children && block.children.length > 0) {
            const childBlock: BlockModel = getBlockModelById(blockId, block.children);
            if (childBlock) {
                return childBlock;
            }
        }
    }
    return null;
}

/**
 * Gets the index of a specific block element within the blocks array.
 *
 * @param {string} id - The id of the block element.
 * @param {BlockModel[]} blocks - The list of blocks.
 * @returns {number} The index of the block element in the blocksInternal array, or -1 if not found.
 */
export function getBlockIndexById(id: string, blocks: BlockModel[]): number {
    if (blocks.length === 0 || !id) {
        return -1;
    }
    const blockModel: BlockModel = getBlockModelById(id, blocks);
    if (blockModel && blockModel.parentId && blockModel.parentId !== '') {
        const parentBlock: BlockModel = getBlockModelById(blockModel.parentId, blocks);
        if (parentBlock) {
            return parentBlock.children.indexOf(blockModel);
        }
    }
    return blocks.indexOf(blockModel);
}

/**
 * Finds a content by its ID.
 *
 * Searches recursively through the list of contents in a block to find a content with the specified ID.
 *
 * @param {string} contentId - The ID of the content.
 * @param {ContentModel[]} contents - The list of contents.
 * @returns {ContentModel | null} The matching content or null if not found.
 */
export function getContentModelById(contentId: string, contents: ContentModel[]): ContentModel | null {
    for (const content of contents) {
        if (content.id === contentId || content.dataId === contentId) {
            return content;
        }
    }
    return null;
}

/**
 * Gets the parent block.
 *
 * @param {HTMLElement | Node} element - The element for which you need to find the parent.
 * @returns {HTMLElement | null} The parent element if found, otherwise null.
 */
export function getParentBlock(element: HTMLElement | Node): HTMLElement | null {
    // If the node is a text node, move to its parent element first
    if (element && element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
    }
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        if ((element as HTMLElement).classList.contains('e-block')) {
            return element as HTMLElement;
        }
        element = element.parentNode as HTMLElement;
    }
    return null;
}

/**
 * Gets the adjacent block of the current block based on the direction.
 *
 * @param {HTMLElement} currentBlock - The current block element.
 * @param {string} direction - The direction to find the adjacent block ('previous' or 'next').
 * @returns {HTMLElement | null} The adjacent block element if found, otherwise null.
 */
export function getAdjacentBlock(currentBlock: HTMLElement, direction: string): HTMLElement | null {
    if (!currentBlock) { return null; }
    const adjacentBlock: Element | null = direction === 'previous'
        ? currentBlock.previousElementSibling
        : currentBlock.nextElementSibling;
    if (adjacentBlock instanceof HTMLElement && adjacentBlock.classList.contains('e-block')) {
        return adjacentBlock;
    }
    const calloutBlock: HTMLElement | null = findClosestParent(currentBlock, '.e-callout-block');
    if (calloutBlock) {
        const calloutContent: HTMLElement = calloutBlock.querySelector('.e-callout-content');
        if (direction === 'previous' && currentBlock === calloutContent.firstElementChild) {
            return calloutBlock.previousElementSibling as HTMLElement;
        }
        else if (direction === 'next' && currentBlock === calloutContent.lastElementChild) {
            return calloutBlock.nextElementSibling as HTMLElement;
        }
    }
    return null;
}

/**
 * Gets the actual content element inside the block.
 *
 * @param {HTMLElement} blockElement - The block element.
 * @returns {HTMLElement | null} The content element inside the block if found, otherwise null.
 */
export function getBlockContentElement(blockElement: HTMLElement): HTMLElement | null {
    if (!blockElement) { return null; }
    if (blockElement.getAttribute('data-block-type').startsWith('Toggle')) {
        return blockElement.querySelector('.e-toggle-header').querySelector('.e-block-content') as HTMLElement;
    }
    return blockElement.querySelector('.e-block-content') as HTMLElement;
}

/**
 * Returns the content element such as span, strong, or chip element by ID or data attribute.
 *
 * @param {ContentModel} content - The Content model.
 * @param {HTMLElement} wrapper - The wrapper element to search within.
 * @returns {HTMLElement} The matched content element, or null if not found.
 */
export function getContentElementBasedOnId(content: ContentModel, wrapper: HTMLElement): HTMLElement {
    if (!wrapper || !content) { return null; }

    return wrapper.querySelector(`#${content.id}`) ||
        (content.dataId !== '' ? wrapper.querySelector(`#${content.dataId}`) : null);
}

/**
 * Specifies whether the given block is a list type block.
 *
 * @param {string | BlockType} blockType - The type of the block.
 * @returns {boolean} - Returns true if the block is a list type block, otherwise false.
 */
export function isListTypeBlock(blockType: string | BlockType): boolean {
    return blockType === BlockType.BulletList || blockType === BlockType.NumberedList || blockType === BlockType.CheckList;
}

/**
 * Specifies whether the given block is a toggle type block.
 *
 * @param {string | BlockType} blockType - The type of the block.
 * @returns {boolean} - Returns true if the block is a toggle type block, otherwise false.
 */
export function isChildrenTypeBlock(blockType: string | BlockType): boolean {
    return blockType === BlockType.Callout || (blockType && blockType.toString().startsWith('Toggle'));
}

/**
 * Specifies whether the given element is a divider block.
 *
 * @param {HTMLElement} blockElement - The block element to check.
 * @returns {boolean} - Returns true if the block is a divider block, otherwise false.
 */
export function isDividerBlock(blockElement: HTMLElement): boolean {
    return blockElement && blockElement.classList.contains('e-divider-block');
}

/**
 * Specifies whether the given block is a non content editable block.
 *
 * @param {string | BlockType} blockType - The type of the block.
 * @returns {boolean} - Returns true if the block is a non content editable block, otherwise false.
 */
export function isNonContentEditableBlock(blockType: string | BlockType): boolean {
    return blockType === BlockType.Divider || blockType === BlockType.Image;
}

/**
 * Returns true if the current selection is at the start of the block.
 *
 * @param {HTMLElement} element - The block element to check.
 * @returns {boolean} True if the selection is at the start of the block, false otherwise.
 */
export function isAtStartOfBlock(element: HTMLElement): boolean {
    if (!element) { return false; }
    const range: Range = getSelectionRange();
    const walker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const firstTextNode: Node = walker.nextNode();
    const startContainer: HTMLElement | Node = normalizeBlockIntoContentElement(range.startContainer);

    return (
        range.collapsed &&
        (startContainer === firstTextNode || startContainer === element) &&
        range.startOffset === 0
    );
}

/**
 * Returns true if the current selection is at the end of the block.
 *
 * @param {HTMLElement} element - The block element to check.
 * @returns {boolean} True if the selection is at the end of the block, false otherwise.
 */
export function isAtEndOfBlock(element: HTMLElement): boolean {
    if (!element) { return false; }
    const range: Range = getSelectionRange();
    const walker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let lastTextNode: Node = null;
    let totalLength: number = 0;

    while (walker.nextNode()) {
        lastTextNode = walker.currentNode;
        totalLength = lastTextNode.textContent.length;
    }

    return (
        range.collapsed &&
        (range.startContainer === lastTextNode || range.startContainer === element) &&
        range.startOffset === totalLength
    );
}

/**
 * Normalizes the block element into a content element.
 *
 * @param {HTMLElement | Node} blockElement - The block element to normalize.
 * @returns {HTMLElement | Node} The normalized content element.
 *
 */
export function normalizeBlockIntoContentElement(blockElement: HTMLElement | Node): HTMLElement | Node {
    if (blockElement instanceof HTMLElement && blockElement.classList.contains('e-block')) {
        return blockElement.querySelector('.e-block-content');
    }
    return blockElement;
}

/**
 * Removes empty text nodes from the given element.
 *
 * @param {HTMLElement | Node} element - The element to remove empty nodes from.
 * @returns {HTMLElement | Node} The normalized content element.
 *
 */
export function removeEmptyTextNodes(element: HTMLElement | Node): void {
    const childNodes: ChildNode[] = Array.from(element.childNodes);

    childNodes.forEach((node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
            detach(node);
        }
    });
}

export function getClosestContentElementInDocument(node: Node): HTMLElement {
    while (node && node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).id) {
            return (node as HTMLElement);
        }
        node = node.parentNode;
    }
    return null;
}

export function cleanCheckmarkElement(blockElement: HTMLElement): void {
    const checkmarkElement: HTMLElement = blockElement.querySelector('span.e-checkmark');
    if (checkmarkElement) {
        detach(checkmarkElement);
    }
}
