import { BlockEditor, RangePath } from '../base/index';
import { UserModel } from '../models/index';

/**
 * Selection manager for the block editor.
 * This class handles the selection of blocks and text within blocks.
 * It also provides methods to save and restore the selection.
 *
 */
export class NodeSelection {
    private savedStart: number = 0;
    private savedEnd: number = 0;
    private editor: BlockEditor;
    private currentRange: Range = null;
    private currentSelection: Selection = null;
    private rangeBackup: RangePath = null;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    public saveSelection(container: HTMLElement): void {
        const selection: Selection | null = this.getSelection();

        const range: Range = this.getRange();
        if (!range) { return; }

        // Save positions relative to text content
        const preRange: Range = range.cloneRange();
        preRange.selectNodeContents(container);
        preRange.setEnd(range.startContainer, range.startOffset);
        this.savedStart = preRange.toString().length;

        preRange.setEnd(range.endContainer, range.endOffset);
        this.savedEnd = preRange.toString().length;

        // Save current range and selection
        this.currentRange = range.cloneRange();
        this.currentSelection = selection;
    }

    public restoreSelection(container: HTMLElement): void {
        const newText: string = container.textContent || '';
        // Handle text changes between save/restore
        const [start, end]: [number, number] = this.adjustOffsetsToTextChanges(newText);
        const range: Range = this.createRangeFromTextPositions(container, start, end);

        if (range) {
            const selection: Selection | null = this.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    private adjustOffsetsToTextChanges(newText: string): [number, number] {
        const maxPos: number = newText.length;
        return [
            Math.min(this.savedStart, maxPos),
            Math.min(this.savedEnd, maxPos)
        ];
    }

    private createRangeFromTextPositions(container: HTMLElement, start: number, end: number): Range {
        const range: Range = document.createRange();
        let startSet: boolean = false;
        let charCount: number = 0;
        const walker: TreeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node: Text = walker.currentNode as Text;
            const textLength: number = node.textContent.length;
            if (!startSet && charCount + textLength >= start) {
                range.setStart(node, start - charCount);
                startSet = true;
            }
            if (charCount + textLength >= end) {
                range.setEnd(node, end - charCount);
                return range;
            }
            charCount += textLength;
        }
        if (!startSet) { range.setStart(container, 0); }
        range.setEnd(container, 0);
        return range;
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
            parentElement: this.currentRange.startContainer.parentElement as HTMLElement
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
        const rect: ClientRect | DOMRect = range.getBoundingClientRect();
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
    public createRangeWithOffsets(startNode: Node, endNode: Node, startOffset: number, endOffset: number): void {
        const selection: Selection | null = window.getSelection();
        const range: Range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
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
}
