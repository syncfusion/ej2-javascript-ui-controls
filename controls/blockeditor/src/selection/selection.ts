import { RangePath, IBlockSelectionState } from '../common/interface';
import { getBlockContentElement, getClosestContentElementInDocument, getSelectedRange, isChildrenTypeBlock } from '../common/utils/index';
import * as constants from '../common/constant';
import { findClosestParent } from '../common/utils/dom';

/**
 * Selection manager for the block editor.
 * This class handles the selection of blocks and text within blocks.
 * It also provides methods to save and restore the selection.
 *
 */
export class NodeSelection {
    public editorWrapper: HTMLElement;
    private currentRange: Range;
    private rangeBackup: RangePath;
    public savedSelectionState: IBlockSelectionState;

    constructor(wrapper: HTMLElement) {
        this.editorWrapper = wrapper;
    }

    /**
     * Saves the current selection state, supporting both single and multi-block selections
     *
     * @returns {void}
     */
    public saveSelection(): void {
        const range: Range = this.getRange();
        if (!range) { return; }
        this.currentRange = range.cloneRange();
        const startBlockElement: HTMLElement = findClosestParent(range.startContainer, ('.' + constants.BLOCK_CLS));
        const endBlockElement: HTMLElement = findClosestParent(range.endContainer, ('.' + constants.BLOCK_CLS));
        if (!startBlockElement || !endBlockElement) { return; }
        this.savedSelectionState = {
            startBlockId: startBlockElement.id,
            endBlockId: endBlockElement.id,
            startOffset: this.calculateOffset(range, getBlockContentElement(startBlockElement), true),
            endOffset: this.calculateOffset(range, getBlockContentElement(endBlockElement), false)
        };
    }

    /**
     * Restores the previously saved selection
     *
     * @returns {void}
     */
    public restoreSelection(): void {
        if (!this.savedSelectionState) {
            return;
        }

        const startBlockElement: HTMLElement = this.editorWrapper.querySelector('#' + this.savedSelectionState.startBlockId);
        const endBlockElement: HTMLElement = this.editorWrapper.querySelector('#' + this.savedSelectionState.endBlockId);

        const startInfo: { node: Node, offset: number } = this.findNodeAndOffsetFromTextPosition(
            getBlockContentElement(startBlockElement), this.savedSelectionState.startOffset
        );
        const endInfo: { node: Node, offset: number } = this.findNodeAndOffsetFromTextPosition(
            getBlockContentElement(endBlockElement), this.savedSelectionState.endOffset
        );

        if (startInfo && endInfo) {
            this.createRangeWithOffsets(startInfo.node, endInfo.node, startInfo.offset, endInfo.offset);
        }
    }

    /**
     * Calculates offset within the selection
     *
     * @param {Range} globalRange The global selection range
     * @param {HTMLElement} contentElement The content element
     * @param {boolean} isStart Specifies whether it is start block
     * @returns {number} The calculated offset value
     */
    private calculateOffset(globalRange: Range, contentElement: HTMLElement, isStart: boolean): number {
        const node: Node = isStart ? globalRange.startContainer : globalRange.endContainer;
        const offset: number = isStart ? globalRange.startOffset : globalRange.endOffset;
        const range: Range = document.createRange();
        range.selectNodeContents(contentElement);
        range.setEnd(node, offset);

        return range.toString().length;
    }

    /**
     * Finds the DOM node and offset that corresponds to a text position
     *
     * @param {HTMLElement} container The container to search in
     * @param {number} targetOffset The character offset to find
     * @returns {object|null} Object with node and offset, or null if not found
     */
    private findNodeAndOffsetFromTextPosition(container: HTMLElement, targetOffset: number): { node: Node, offset: number } {
        if (targetOffset > (container.textContent.length)) {
            targetOffset = container.textContent.length;
        }

        const treeWalker: TreeWalker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null
        );

        let currentOffset: number = 0;
        let currentNode: Node = treeWalker.nextNode();

        while (currentNode) {
            const nodeLength: number = currentNode.textContent.length;
            if (currentOffset + nodeLength >= targetOffset) {
                return {
                    node: currentNode,
                    offset: targetOffset - currentOffset
                };
            }

            currentOffset += nodeLength;
            currentNode = treeWalker.nextNode();
        }

        const lastNode: Node = container.lastChild;
        if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
            return {
                node: lastNode,
                offset: lastNode.textContent.length || 0
            };
        }

        return { node: container, offset: 0 };
    }

    /**
     * Gets the current selection
     *
     * @returns {Selection | null} The current selection or null
     * @hidden
     */
    public getSelection(): Selection | null {
        return window.getSelection();
    }

    /**
     * Clears the current selection in the editor
     *
     * @returns {void}
     * @hidden
     */
    public clearSelection(): void {
        const sel: Selection = this.getSelection();
        if (sel) { sel.removeAllRanges(); }
    }

    /**
     * Gets the stored range
     *
     * @returns {Range | null} The stored range or null
     * @hidden
     */
    public getStoredRange(): Range | null {
        return this.currentRange;
    }

    /**
     * Gets the stored backup range
     *
     * @returns {RangePath} The stored range or null
     * @hidden
     */
    public getStoredBackupRange(): RangePath {
        return this.rangeBackup;
    }

    /**
     * Stores the current range
     *
     * @returns {void}
     * @hidden
     */
    public storeCurrentRange(): void {
        this.currentRange = this.getRange();
        this.rangeBackup = {
            startContainer: this.currentRange.startContainer,
            startOffset: this.currentRange.startOffset,
            endContainer: this.currentRange.endContainer,
            endOffset: this.currentRange.endOffset,
            parentElement: getClosestContentElementInDocument(this.currentRange.startContainer)
        };
    }

    /**
     * Gets the current range
     *
     * @returns {Range | null} The current range or null
     * @hidden
     */
    public getRange(): Range | null {
        const selection: Selection | null = window.getSelection();
        return selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    }

    /**
     * Gets the position of the current selection
     *
     * @returns {Object} Position object with x and y coordinates
     * @hidden
     */
    public getSelectionPosition(): { x: number, y: number } {
        const range: Range | null = this.getRange();
        if (!range) {
            return { x: 0, y: 0 };
        }
        const rect: DOMRect = range.getBoundingClientRect() as DOMRect;
        return {
            x: rect.left,
            y: rect.bottom + window.scrollY + 10 // 10px below selection
        };
    }

    /**
     * Checks if the current selection is collapsed (cursor only)
     *
     * @returns {boolean} True if selection is collapsed
     * @hidden
     */
    public isCollapsed(): boolean {
        const selection: Selection | null = this.getSelection();
        return !selection || selection.isCollapsed;
    }

    /**
     * Gets the selected text
     *
     * @returns {string} Selected text or empty string
     * @hidden
     */
    public getSelectedText(): string {
        const selection: Selection | null = this.getSelection();
        return selection ? selection.toString() : '';
    }

    /**
     * Creates a range with the specified start, end nodes and offsets.
     *
     * @param {Node} startNode - The start node of the range.
     * @param {Node} endNode - The end node of the range.
     * @param {number} startOffset - The start offset of the range.
     * @param {number} endOffset - The end offset of the range.
     *
     * @returns {void} - Returns void
     * @hidden
     */
    public createRangeWithOffsets(startNode: Node, endNode: Node, startOffset: number, endOffset: number): Range {
        const selection: Selection | null = window.getSelection();
        const range: Range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        return range;
    }

    /**
     * Checks if selection contains or intersects with a specific node type
     *
     * @param {string} tagName - The tag name to check for.
     * @param {HTMLElement} container - The container to search within.
     * @returns {boolean} True if selection contains or intersects with the specified tag.
     * @hidden
     */
    public selectionContainsNodeType(tagName: string, container: HTMLElement): boolean {
        const selection: Selection | null = this.getSelection();
        if (!selection) { return false; }
        const range: Range = selection.getRangeAt(0);
        const nodes: NodeListOf<HTMLElement> = container.querySelectorAll(tagName);
        for (let i: number = 0; i < nodes.length; i++) {
            if (range.intersectsNode(nodes[parseInt(i.toString(), 10)])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Gets a node of specific type from the current selection
     *
     * @param {string} tagName - The tag name of the node to find.
     * @returns {HTMLElement | null} The found node or null if not found.
     * @hidden
     */
    public getNodeFromSelection(tagName: string): HTMLElement | null {
        const selection: Selection | null = this.getSelection();
        if (!selection || selection.rangeCount === 0) { return null; }
        const range: Range = selection.getRangeAt(0);
        const commonAncestor: Node = range.commonAncestorContainer;

        if (commonAncestor.nodeType === Node.ELEMENT_NODE &&
            (commonAncestor as HTMLElement).tagName.toLowerCase() === tagName.toLowerCase()) {
            return commonAncestor as HTMLElement;
        }

        if (commonAncestor.nodeType === Node.TEXT_NODE &&
            commonAncestor.parentElement &&
            commonAncestor.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
            return commonAncestor.parentElement;
        }

        if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
            return (commonAncestor as HTMLElement).querySelector(tagName);
        }

        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        if (startContainer && endContainer) {
            const startElement: HTMLElement = startContainer.nodeType === Node.ELEMENT_NODE
                ? startContainer as HTMLElement
                : startContainer.parentElement;
            const endElement: HTMLElement = endContainer.nodeType === Node.ELEMENT_NODE
                ? endContainer as HTMLElement
                : endContainer.parentElement;
            return (startElement.closest(tagName) || endElement.closest(tagName)) as HTMLElement;
        }
        return null;
    }

    /**
     * Checks whether the entire editor is selected or not.
     *
     * @returns {boolean} - Returns true if the entire editor is selected, otherwise false.
     * @hidden
     */
    public checkIsEntireEditorSelected(): boolean {
        const selection: Selection = this.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return false;
        }
        const range: Range = getSelectedRange();
        if (!range) { return false; }
        const firstBlockElement: HTMLElement = this.editorWrapper.firstElementChild as HTMLElement;
        const lastBlockElement: HTMLElement = this.editorWrapper.lastElementChild as HTMLElement;
        const firstBlockContent: HTMLElement = getBlockContentElement(firstBlockElement);
        const lastBlockContent: HTMLElement = getBlockContentElement(lastBlockElement);
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        const isFirstBlockEmpty: boolean = firstBlockContent.textContent.trim() === '';
        const isLastBlockEmpty: boolean = lastBlockContent.textContent.trim() === '';
        const firstBlockStartNode: ChildNode = firstBlockContent.childNodes[0];
        const lastBlockEndNode: ChildNode = lastBlockContent.childNodes[lastBlockContent.childNodes.length - 1];

        // Selection performed using selectAll method
        if (startContainer.nodeType === Node.ELEMENT_NODE && endContainer.nodeType === Node.ELEMENT_NODE &&
            (startContainer as HTMLElement).classList.contains(constants.BLOCK_CONTAINER_CLS) &&
            (endContainer as HTMLElement).classList.contains(constants.BLOCK_CONTAINER_CLS)) {
            return true;
        }

        const isEqualsStartContainer: boolean = (
            firstBlockStartNode && firstBlockStartNode.contains(startContainer) ||
            isFirstBlockEmpty && firstBlockElement.contains(startContainer)
        );
        const isEqualsEndContainer: boolean = (
            lastBlockEndNode && lastBlockEndNode.contains(endContainer) ||
            isLastBlockEmpty && lastBlockElement.contains(endContainer)
        );
        return (isEqualsStartContainer &&
            isEqualsEndContainer &&
            range.startOffset === 0 &&
            range.endOffset === endContainer.textContent.length);
    }
}
