import { detach } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, TableCellModel, ContentModel, TableRowModel, ITableBlockSettings } from '../../models/index';
import { BlockType } from '../../models/enums';
import { getSelectedRange } from './selection';
import { findClosestParent } from './dom';
import * as constants from '../../common/constant';
import { IBlocksContainerInfo } from '../interface';

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
 * Finds a content by its ID.
 *
 * Searches recursively through the list of contents in a block to find a content with the specified ID.
 *
 * @param {string} contentId - The ID of the content.
 * @param {ContentModel[]} contents - The list of contents.
 * @returns {ContentModel} The matching content or null if not found.
 */
export function getContentModelById(contentId: string, contents: ContentModel[]): ContentModel {
    for (const content of contents) {
        if (content.id === contentId) {
            return content;
        }
    }
    return null;
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

    /* Return the first cell block if it is Table block */
    if (adjacentBlock && adjacentBlock.classList.contains(constants.TABLE_BLOCK_CLS)) {
        return adjacentBlock.querySelector('.' + constants.BLOCK_CLS);
    }

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
 * Returns the content element such as span, strong, or chip element by ID or data attribute.
 *
 * @param {ContentModel} contentId - The id of the content.
 * @param {HTMLElement} wrapper - The wrapper element to search within.
 * @returns {HTMLElement} The matched content element, or null if not found.
 */
export function getContentElementBasedOnId(contentId: string, wrapper: HTMLElement): HTMLElement {
    if (!wrapper || !contentId) { return null; }

    return wrapper.querySelector(`#${contentId}`);
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
    return blockType === BlockType.Callout || (blockType && blockType.toString().startsWith('Collapsible'));
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
    else if (element instanceof HTMLElement && element.nodeName === 'BR') {
        return getClosestContentElementInDocument(element);
    }
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
    const showPlaceholdersAlwaysFor: string[] = [BlockType.BulletList, BlockType.Checklist, BlockType.NumberedList, BlockType.Quote];
    return blockType && (showPlaceholdersAlwaysFor.indexOf(blockType) >= 0);
}

const nonMergableBlockTypes: Set<string> = new Set<string>([ BlockType.Image, BlockType.Divider ]);

export function isNonMergableBlock(blockElement: HTMLElement): boolean {
    return nonMergableBlockTypes.has(extractBlockTypeFromElement(blockElement));
}
