import { detach } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, TableCellModel, ContentModel, TableRowModel, ITableBlockSettings } from '../../models/index';
import { BlockType } from '../../models/enums';
import { getSelectedRange } from './selection';
import { findClosestParent, isNodeInsideElement } from './dom';
import * as constants from '../../common/constant';
import { IBlocksContainerInfo } from '../interface';
import { getDeepestTextNode } from './common';
import { hasActiveTableSelection } from './table-utils';

/**
 * Gets a block type from the element
 *
 * @param {HTMLElement} blockElement - The block element.
 * @returns {string} The block type
 */
export function extractBlockTypeFromElement(blockElement: HTMLElement): string {
    return blockElement ? blockElement.getAttribute('data-block-type') : '';
}

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
    for (const block of blocks) {
        if (block.id === blockId) {
            return block;
        }
        // Recurse into container blocks (children)
        const props: BaseChildrenProp = block.properties as BaseChildrenProp;
        if (props && props.children && props.children.length > 0) {
            const childBlock: BlockModel = getBlockModelById(blockId, props.children);
            if (childBlock) {
                return childBlock;
            }
        }
        // Recurse into table cell blocks
        if (block.blockType === BlockType.Table && block.properties) {
            const tprops: ITableBlockSettings = block.properties as ITableBlockSettings;
            if (tprops.rows && Array.isArray(tprops.rows)) {
                for (const row of tprops.rows as TableRowModel[]) {
                    for (const cell of row.cells as TableCellModel[]) {
                        if (cell.blocks && cell.blocks.length) {
                            const inner: BlockModel = getBlockModelById(blockId, cell.blocks);
                            if (inner) { return inner; }
                        }
                    }
                }
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
 * @returns {number} The index of the block element in the blocks array, or -1 if not found.
 */
export function getBlockIndexById(id: string, blocks: BlockModel[]): number {
    if (blocks.length === 0 || !id) { return -1; }
    const blockModel: BlockModel = getBlockModelById(id, blocks);
    if (!blockModel) { return -1; }

    // Determine the array that directly contains this block
    const containerInfo: IBlocksContainerInfo = getContainerInfo(id, blocks);
    if (containerInfo && containerInfo.array) {
        return containerInfo.array.indexOf(blockModel);
    }
    return -1;
}

/**
 * Retrieves the content model associated with a specific DOM node within the block structure.
 *
 * @param {Node | null} node - The DOM node for which to find the corresponding content model.
 * @param {BlockModel[]} blocks - The list of blocks to search within.
 * @returns {ContentModel | null} - The content model corresponding to the node, or null if not found.
 */
export function getContentModelByNode(node: Node | null, blocks: BlockModel[]): ContentModel | null {
    const blockElement: HTMLElement = findClosestParent(node, '.' + constants.BLOCK_CLS);
    const contentElement: HTMLElement = getBlockContentElement(blockElement);
    const block: BlockModel = getBlockModelById(blockElement.id, blocks);
    const nodeOffset: number = getAbsoluteOffsetOfNode(node, contentElement);

    return findModelByTextOffset(block, nodeOffset);
}

/**
 * Calculates the absolute offset of a target node within a content element.
 *
 * @param {Node} targetNode - The DOM node whose offset is to be calculated.
 * @param {HTMLElement} contentElement - The root content element containing the target node.
 * @returns {number} - The absolute offset position of the target node, or -1 if not found.
 */
export function getAbsoluteOffsetOfNode(targetNode: Node, contentElement: HTMLElement): number {
    let offset: number = 0;
    let found: boolean = false;

    function traverse(node: Node): void {
        if (found) { return; }

        if (node === targetNode) {
            found = true;
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            offset += (node as Text).length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let i: number = 0; i < node.childNodes.length; i++) {
                traverse(node.childNodes[i as number]);
                if (found) { return; }
            }
        }
    }

    traverse(contentElement);
    return found ? offset : -1;
}

/**
 * Finds the model within a block that corresponds to a specific text offset.
 * Traverses the content array of the block to locate the model containing the offset.
 *
 * @param {BlockModel} block - The block containing content models.
 * @param {number} offset - The absolute text offset to locate.
 * @returns {ContentModel | null} - The content model at the specified offset or null if not found.
 */
export function findModelByTextOffset(block: BlockModel, offset: number): ContentModel | null {
    let cumulativeOffset: number = 0;

    for (const model of block.content) {
        const modelLength: number = model.content.length;
        const modelEndOffset: number = cumulativeOffset + modelLength;

        if (offset >= cumulativeOffset && offset < modelEndOffset) {
            return model;
        }
        else if (modelLength === 0) {
            if (offset === cumulativeOffset) {
                return model;
            }
        }

        cumulativeOffset = modelEndOffset;
    }

    return null;
}

/**
 * Gets the content models that span the specified node within the blocks.
 *
 * @param {Node} node - The DOM node inside a block.
 * @param {BlockModel[]} blocks - The list of blocks.
 * @returns {ContentModel[]} - An array of ContentModel objects that the node spans.
 */
export function getContentModelsByNode(node: Node, blocks: BlockModel[]): ContentModel[] {
    const blockElement: HTMLElement = findClosestParent(node, '.' + constants.BLOCK_CLS);
    const contentElement: HTMLElement = getBlockContentElement(blockElement);
    const block: BlockModel = getBlockModelById(blockElement.id, blocks);

    const nodeStart: number = getAbsoluteOffsetOfNode(node, contentElement);
    const nodeEnd: number = nodeStart + (node as Text).length;

    const models: ContentModel[] = [];
    let cumulativeOffset: number = 0;

    for (const model of block.content) {
        const modelStart: number = cumulativeOffset;
        const modelEnd: number = cumulativeOffset + model.content.length;

        if (nodeStart < modelEnd && nodeEnd > modelStart) {
            models.push(model);
        }

        cumulativeOffset = modelEnd;
    }

    return models;
}

/**
 * Returns the blocks array that directly contains the given block id.
 * This may be the root blocks, a container block's children, or a table cell's blocks.
 *
 * @param {string} blockId - The ID of the block.
 * @param {BlockModel[]} blocks - The list of blocks.
 * @returns {BlockModel[]} The corresponding container array or null if not found.
 */
export function getParentBlocksArray(blockId: string, blocks: BlockModel[]): BlockModel[] {
    const info: IBlocksContainerInfo = getContainerInfo(blockId, blocks);
    return info ? info.array : null;
}

/**
 * Returns container info for the array that contains the given block id.
 *
 * @param {string} blockId - The ID of the block.
 * @param {BlockModel[]} blocks - The list of blocks.
 * @returns {IBlocksContainerInfo} The block container info or null if not found.
 */
export function getContainerInfo(blockId: string, blocks: BlockModel[]): IBlocksContainerInfo {
    const target: BlockModel = getBlockModelById(blockId, blocks);
    if (!target) { return null; }

    // If parentId empty, it is in root
    if (!target.parentId) {
        return { array: blocks, containerType: 'root', containerId: '' };
    }

    // Try as child of a container block
    const parentBlock: BlockModel = getBlockModelById(target.parentId, blocks);
    if (parentBlock && (parentBlock.properties as BaseChildrenProp).children) {
        return {
            array: (parentBlock.properties as BaseChildrenProp).children,
            containerType: 'children',
            containerId: parentBlock.id
        };
    }

    // Try as child of a table cell
    const cell: TableCellModel = findCellById(target.parentId, blocks);
    if (cell) {
        return { array: cell.blocks, containerType: 'cell', containerId: cell.id };
    }

    // Fallback root
    return { array: blocks, containerType: 'root', containerId: '' };
}
/**
 * Locate a table cell by its id and return the Cell model.
 *
 * @param {string} cellId - Id of the cell
 * @param {BlockModel[]} blocks - Collection of blocks
 * @returns {TableCellModel} - An object of cell model
 */
export function findCellById(cellId: string, blocks: BlockModel[]): TableCellModel {
    if (!cellId) { return null; }

    for (const block of blocks) {
        if (block.blockType === BlockType.Table) {
            const tprops: ITableBlockSettings = block.properties as ITableBlockSettings;
            if (tprops && tprops.rows) {
                for (const row of tprops.rows as TableRowModel[]) {
                    for (const cell of row.cells as TableCellModel[]) {
                        if (cell.id === cellId) {
                            return cell;
                        }
                    }
                }
            }
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
    const calloutBlock: HTMLElement = findClosestParent(currentBlock, '.' + constants.CALLOUT_BLOCK_CLS);
    if (calloutBlock) {
        const calloutContent: HTMLElement = calloutBlock.querySelector('.' + constants.CALLOUT_CONTENT_CLS);
        if (direction === 'previous' && currentBlock === calloutContent.firstElementChild) {
            return calloutBlock.previousElementSibling as HTMLElement;
        }
        else if (direction === 'next' && currentBlock === calloutContent.lastElementChild) {
            return calloutBlock.nextElementSibling as HTMLElement;
        }
    }
    const quoteBlock: HTMLElement = findClosestParent(currentBlock, '.' + constants.QUOTE_BLOCK_CLS);
    if (quoteBlock) {
        const quoteContent: HTMLElement = quoteBlock.querySelector('.' + constants.QUOTE_CONTENT_CLS);
        if (quoteContent) {
            if (direction === 'previous' && currentBlock === quoteContent.firstElementChild) {
                // At the first line of quote → go to block before the quote
                return quoteBlock.previousElementSibling as HTMLElement;
            }
            else if (direction === 'next' && currentBlock === quoteContent.lastElementChild) {
                // At the last line of quote → go to block after the quote
                return quoteBlock.nextElementSibling as HTMLElement;
            }
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
    const blockType: string = blockElement.getAttribute('data-block-type');
    if (blockType && blockType.startsWith('Collapsible')) {
        return blockElement.querySelector('.e-toggle-header').querySelector('.' + constants.CONTENT_CLS) as HTMLElement;
    }
    return blockElement.querySelector('.' + constants.CONTENT_CLS) as HTMLElement;
}

/**
 * Gets the adjacent cell of the current cell based on the direction.
 *
 * @param {HTMLElement} table - The table element.
 * @param {string} direction - The direction to find the adjacent cell ('up', 'down', 'left', 'right').
 * @param {HTMLTableCellElement} currentCell - The current cell element.
 * @returns {HTMLElement | null} The adjacent cell element if found, otherwise null.
 */
export function getAdjacentCell(
    table: HTMLElement,
    direction: string,
    currentCell: HTMLTableCellElement
): HTMLElement | null {
    if (!currentCell) { return null; }

    const rowIndex: number = parseInt(currentCell.dataset.row, 10);
    const colIndex: number = parseInt(currentCell.dataset.col, 10);

    let targetRowIndex: number = rowIndex;
    let targetColIndex: number = colIndex;

    switch (direction) {
    case 'up':
        targetRowIndex = rowIndex - 1;
        break;
    case 'down':
        targetRowIndex = rowIndex + 1;
        break;
    case 'left':
        targetColIndex = colIndex - 1;
        break;
    case 'right':
        targetColIndex = colIndex + 1;
        break;
    }

    const targetCellSelector: string = `[data-row="${targetRowIndex}"][data-col="${targetColIndex}"]`;
    const targetCell: HTMLTableCellElement = table.querySelector(targetCellSelector) as HTMLTableCellElement;

    return targetCell;
}

/**
 * Specifies whether the given block is a list type block.
 *
 * @param {string | BlockType} blockType - The type of the block.
 * @returns {boolean} - Returns true if the block is a list type block, otherwise false.
 */
export function isListTypeBlock(blockType: string | BlockType): boolean {
    return blockType === BlockType.BulletList || blockType === BlockType.NumberedList || blockType === BlockType.Checklist;
}

/**
 * Specifies whether the given block is a children type block.
 *
 * @param {string | BlockType} blockType - The type of the block.
 * @returns {boolean} - Returns true if the block is a children type block, otherwise false.
 */
export function isChildrenTypeBlock(blockType: string | BlockType): boolean {
    return blockType === BlockType.Callout || blockType === BlockType.Quote  || (blockType && blockType.toString().startsWith('Collapsible'));
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
 * Specifies whether the cursor is at edge of the block.(start or end)
 *
 * @param {HTMLElement} contentElement - The content element to check.
 * @param {boolean} isStart - Specifies whether to check for start or end of the block.
 * @returns {boolean} - Returns true if the cursor is at edge of the block, otherwise false.
 */
export function isCursorAtEdge(contentElement: HTMLElement, isStart: boolean): boolean {
    const isCursorAtStart: boolean = isAtStartOfBlock(contentElement);
    const isCursorAtEnd: boolean = isAtEndOfBlock(contentElement);
    return isStart ? isCursorAtStart : isCursorAtEnd;
}

/**
 * Returns true if the current selection is at the start of the block.
 *
 * @param {HTMLElement} element - The block element to check.
 * @returns {boolean} True if the selection is at the start of the block, false otherwise.
 */
export function isAtStartOfBlock(element: HTMLElement): boolean {
    if (!element) { return false; }
    const range: Range = getSelectedRange();
    const walker: TreeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const firstTextNode: Node = walker.nextNode();
    const startContainer: HTMLElement | Node = normalizeIntoContentElement(range.startContainer);

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
    const range: Range = getSelectedRange();
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
 * Normalizes an element into a content element.
 *
 * @param {HTMLElement | Node} element - The element to normalize.
 * @returns {HTMLElement | Node} The normalized content element.
 *
 */
export function normalizeIntoContentElement(element: HTMLElement | Node): HTMLElement | Node {
    if (element instanceof HTMLElement && element.classList.contains('e-block')) {
        return element.querySelector('.' + constants.CONTENT_CLS);
    }
    // else if (element instanceof HTMLElement && element.nodeName === 'BR') {
    //     return findTopLevelChildInContent(element, findClosestParent(element, '.' + constants.CONTENT_CLS));
    // }
    return element;
}

/**
 * Removes empty text nodes from the given element.
 *
 * @param {HTMLElement | Node} element - The element to remove empty nodes from.
 * @returns {HTMLElement | Node} The normalized content element.
 *
 */
export function removeEmptyTextNodes(element: HTMLElement | Node): void {
    Array.from(element.childNodes).forEach((node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
            detach(node);
        }
    });
}

export function cleanCheckmarkElement(blockElement: HTMLElement): void {
    const checkmarkElement: HTMLElement = blockElement.querySelector('.e-checkmark-container');
    if (checkmarkElement) {
        detach(checkmarkElement);
    }
}

export function isEmptyString(id: string): boolean {
    return !id || id.trim() === '';
}

export function isChildrenProp(block: BlockModel): boolean {
    return block.properties && 'children' in block.properties;
}

export function isAlwaysOnPlaceHolderBlk(blockType: string): boolean {
    const showPlaceholdersAlwaysFor: string[] = [BlockType.BulletList, BlockType.Checklist, BlockType.NumberedList];
    return blockType && (showPlaceholdersAlwaysFor.indexOf(blockType) >= 0);
}

const nonMergableBlockTypes: Set<string> = new Set<string>([ BlockType.Image, BlockType.Divider ]);

export function isNonMergableBlock(blockElement: HTMLElement): boolean {
    return nonMergableBlockTypes.has(extractBlockTypeFromElement(blockElement));
}

/**
 * Gets the adjacent block of the current block based on the direction.
 *
 * @param {HTMLElement} currentBlock - The current block element.
 * @param {string} direction - The direction to find the adjacent block ('previous' or 'next').
 * @returns {HTMLElement | null} The adjacent block element if found, otherwise null.
 */
export function getTargetBlock(currentBlock: HTMLElement, direction: string): HTMLElement | null {
    if (!currentBlock) { return null; }
    const adjacentBlock: Element | null = direction === 'previous'
        ? currentBlock.previousElementSibling
        : currentBlock.nextElementSibling;

    if (adjacentBlock instanceof HTMLElement && adjacentBlock.classList.contains('e-block')) {
        return adjacentBlock;
    }
    return null;
}

export function getBlockSpecificRange(globalRange: Range, blockElement: HTMLElement): Range {
    const contentElement: HTMLElement = getBlockContentElement(blockElement);

    const blockRange: Range = document.createRange();
    const startTextNode: Node = contentElement.firstChild.nodeType === Node.ELEMENT_NODE
        ? (getDeepestTextNode((contentElement.firstChild as HTMLElement)) || contentElement.firstChild) : contentElement.firstChild;
    const endTextNode: Node = contentElement.lastChild.nodeType === Node.ELEMENT_NODE ?
        (getDeepestTextNode((contentElement.lastChild as HTMLElement)) || contentElement.lastChild) : contentElement.lastChild;
    const tableEle: HTMLElement = blockElement.closest('.' + constants.TABLE_BLOCK_CLS) as HTMLElement;
    const hasActiveSel: boolean = hasActiveTableSelection(tableEle);
    blockRange.selectNodeContents(contentElement);
    blockRange.setStart(startTextNode, 0);
    blockRange.setEnd(endTextNode, endTextNode.textContent.length);

    if (!globalRange || hasActiveSel) { return blockRange; }

    if (isNodeInsideElement(globalRange.startContainer, blockElement)) {
        blockRange.setStart(globalRange.startContainer, globalRange.startOffset);
    }

    if (isNodeInsideElement(globalRange.endContainer, blockElement)) {
        blockRange.setEnd(globalRange.endContainer, globalRange.endOffset);
    }

    return blockRange;
}
