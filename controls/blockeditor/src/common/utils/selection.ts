import { IBlockSelectionState } from '../../common/interface';
import { getParentBlock } from './block';

/**
 * Returns the current text selection range.
 *
 * @returns {Range | null} The start and end indices of the selection range, or null if no selection is active.
 */
export function getSelectedRange(): Range | null {
    const selection: Selection | null = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return null;
}

/**
 * Sets the selection range in the editor.
 *
 * @param {Node} element - The HTML element to apply the selection range to.
 * @param {number} start - The start index of the selection.
 * @param {number} end - The end index of the selection.
 * @returns {void}
 */
export function setSelectionRange(element: Node, start: number, end: number): void {
    const range: Range = document.createRange();
    const selection: Selection | null = window.getSelection();
    if (selection) {
        range.setStart(element, start);
        range.setEnd(element, end);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

/**
 * Moves the cursor to a specific position considering formatted content
 *
 * @param {HTMLElement} element The container element
 * @param {number} position Character position within entire content (not just text nodes)
 * @returns {void}
 */
export function setCursorPosition(element: HTMLElement, position: number): void {
    const selection: Selection | null = window.getSelection();
    if (!selection || !element) { return; }

    // Create a walker to traverse all text nodes
    const treeWalker: TreeWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node: Node) => {
                return node.nodeType === Node.TEXT_NODE ||
                       (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length === 0)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            }
        }
    );

    let currentPosition: number = 0;
    let targetNode: Node | null;
    let targetOffset: number = 0;

    while (treeWalker.nextNode()) {
        const node: Node = treeWalker.currentNode;
        const contentLength: number = node.textContent.length || 0;
        if (currentPosition + contentLength >= position) {
            targetNode = node;
            targetOffset = position - currentPosition;
            break;
        }
        currentPosition += contentLength;
    }

    // Fallback to end if position exceeds content length
    if (!targetNode) {
        targetNode = element;
        targetOffset = element.childNodes.length;
    }

    if (document.contains(targetNode)) {
        const range: Range = document.createRange();
        if (targetNode.nodeType === Node.ELEMENT_NODE && targetNode.childNodes.length === 0) {
            range.setStart(targetNode, 0);
        } else {
            range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent.length || 0));
        }
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export function getTextOffset(node: Node, within: HTMLElement): number {
    let offset: number = 0;
    const walker: TreeWalker = document.createTreeWalker(within, NodeFilter.SHOW_TEXT, null);

    let current: Node | null = walker.nextNode();
    while (current && current !== node) {
        offset += current.textContent.length || 0;
        current = walker.nextNode();
    }

    return offset;
}

/**
 * Captures the current selection state, including the start and end blocks and offsets.
 *
 * @returns {IBlockSelectionState | null} The selection state or null if no selection is active.
 */
export function captureSelectionState(): IBlockSelectionState | null {
    const range: Range | null = getSelectedRange();
    if (!range) {
        return null;
    }
    const startBlock: HTMLElement | null = getParentBlock(range.startContainer);
    const endBlock: HTMLElement | null = getParentBlock(range.endContainer);
    if (!startBlock || !endBlock) {
        return null;
    }

    return {
        startBlockId: startBlock.id,
        endBlockId: endBlock.id,
        startContainerPath: getPathFromBlock(startBlock, range.startContainer),
        endContainerPath: getPathFromBlock(endBlock, range.endContainer),
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        isCollapsed: range.collapsed
    };
}

/**
 * Retrieves the path from a block element to a target node.
 *
 * @param {HTMLElement} blockElement - The block element to start from.
 * @param {Node} targetNode - The target node to find the path to.
 * @returns {number[]} - The path as an array of indices.
 */
export function getPathFromBlock(blockElement: HTMLElement, targetNode: Node): number[] {
    const path: number[] = [];
    let currentNode: Node = targetNode;

    while (currentNode && currentNode !== blockElement) {
        const parent: Node | null = currentNode.parentNode;
        if (parent) {
            const index: number = Array.prototype.indexOf.call(parent.childNodes, currentNode);
            path.unshift(index);
            currentNode = parent;
        } else {
            break;
        }
    }

    return path;
}

/**
 * Retrieves a node from a block element using a path.
 *
 * @param {HTMLElement} blockElement - The block element to start from.
 * @param {number[]} path - The path as an array of indices.
 * @returns {Node | null} - The node at the specified path, or null if not found.
 */
export function getNodeFromPath(blockElement: HTMLElement, path: number[]): Node | null {
    let currentNode: Node = blockElement;

    for (const index of path) {
        if (!currentNode.childNodes || index >= currentNode.childNodes.length) {
            return null; // Path is invalid
        }
        currentNode = currentNode.childNodes[parseInt(index.toString(), 10)];
    }

    return currentNode;
}
