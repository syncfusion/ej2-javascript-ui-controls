import * as Y from '../yjs-types';
import { InternalYRuntime, XmlElement, YBlockLocation } from '../base/interface';
import { Collaboration } from '../base/collaboration';
import { BlockEditorBinding } from '../plugins/sync-plugin';

/**
 * Helper utilities for locating and manipulating Yjs block elements.
 *
 * @hidden
 */
export class YBlockHelper {
    private parent: BlockEditorBinding
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(parent: BlockEditorBinding, manager: Collaboration) {
        this.parent = parent;
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Finds the block id that contains a given Y.XmlText node.
     *
     * @param {Y.XmlText} yText - The Y text node to locate
     * @param {Y.XmlFragment} yBlocks - The root fragment of Y blocks
     * @returns {string | null} - The containing block id or null
     * @hidden
     */
    public findBlockIdForYText(
        yText: Y.XmlText,
        yBlocks: Y.XmlFragment
    ): string | null {
        const result: Y.XmlElement = this.findBlockContainingText(yText, yBlocks);
        return result ? result.getAttribute('id') : null;
    }

    private findBlockContainingText(
        target: Y.XmlText,
        container: Y.XmlFragment | Y.XmlElement
    ): Y.XmlElement | null {
        const children: XmlElement[] = container.toArray();

        for (const child of children) {
            if (child === target && container instanceof this.YRuntime.XmlElement) {
                return container;
            }

            if (child instanceof this.YRuntime.XmlElement) {
                const found: Y.XmlElement = this.findBlockContainingText(target, child);
                if (found) { return found; }
            }
        }

        return null;
    }

    /**
     * Finds the index of a block within a Y container by id.
     *
     * @param {string | undefined} targetBlockId - The block id to find
     * @param {Y.XmlFragment | Y.XmlElement} container - The Y container to search
     * @returns {number} - The index of the block or -1 if not found
     * @hidden
     */
    public findBlockIndex(
        targetBlockId: string | undefined,
        container: Y.XmlFragment | Y.XmlElement
    ): number {
        if (!targetBlockId) { return -1; }

        const children: XmlElement[] = container.toArray();

        for (let index: number = 0; index < children.length; index++) {
            const child: XmlElement = children[index as number];

            if (!(child instanceof this.YRuntime.XmlElement)) { continue; }

            const childId: string = child.getAttribute('id');

            // Direct match at this level
            if (childId === targetBlockId) {
                return index;
            }

            // Recursive search inside this child
            const nestedIndex: number = this.findBlockIndex(targetBlockId, child);

            if (nestedIndex !== -1) {
                return nestedIndex;
            }
        }

        return -1;
    }

    /**
     * Locates a Y block node and its parent by block id.
     *
     * @param {string} blockId - The block id to locate
     * @param {Y.XmlFragment} yBlocks - The root fragment to search
     * @returns {object} - Found node and parent or null
     * @hidden
     */
    public findYBlockById(
        blockId: string,
        yBlocks: Y.XmlFragment
    ): YBlockLocation {
        for (const child of yBlocks.toArray()) {
            if (child instanceof this.YRuntime.XmlElement) {
                const found: YBlockLocation = this.searchYBlockById(child, blockId, yBlocks);
                if (found) { return found; }
            }
        }

        return null;
    }

    /**
     * Recursively searches for a Y block by id and returns node with parent.
     *
     * @param {Y.XmlElement} element - Element to search within
     * @param {string} blockId - Block id to match
     * @param {Y.XmlFragment | Y.XmlElement | null} parent - Optional parent reference
     * @returns {object} - Found node and parent or null
     * @hidden
     */
    public searchYBlockById(
        element: Y.XmlElement,
        blockId: string,
        parent: Y.XmlFragment | Y.XmlElement | null = null
    ): YBlockLocation {
        if (element.getAttribute('id') === blockId) {
            return parent ? { node: element, parent, index: parent.toArray().indexOf(element) } : null;
        }

        const children: XmlElement[] = element.toArray();

        for (const child of children) {
            if (child instanceof this.YRuntime.XmlElement) {
                const found: YBlockLocation = this.searchYBlockById(child, blockId, element);
                if (found) { return found; }
            }
        }

        return null;
    }

    /**
     * Retrieves the first Y.XmlText child for a given block id.
     *
     * @param {string} blockId - The id of the block to inspect
     * @param {Y.XmlFragment} yFragment - Root fragment containing blocks
     * @returns {Y.XmlText | null} - The found Y.XmlText or null
     * @hidden
     */
    public getYTextByBlockId(blockId: string, yFragment: Y.XmlFragment): Y.XmlText | null {
        const found: YBlockLocation = this.findYBlockById(blockId, yFragment);
        if (!found) { return null; }

        for (const child of found.node.toArray()) {
            if (child instanceof this.YRuntime.XmlText) {
                return child;
            }
        }

        return null;
    }

    /**
     * Returns the first Y.XmlText child of a Y block element.
     *
     * @param {Y.XmlElement} yBlock - The Y block element to inspect
     * @returns {Y.XmlText | null} - The found text node or null
     * @hidden
     */
    public getYTextByBlock(yBlock: Y.XmlElement): Y.XmlText | null {
        for (const child of yBlock.toArray()) {
            if (child instanceof this.YRuntime.XmlText) { return child; }
        }
        return null;
    }

    /**
     * Determines whether a selection rectangle targets a block-level element.
     *
     * @param {DOMRect} rect - The rectangle of the selection
     * @param {Range} range - The DOM Range of the selection
     * @returns {boolean} - True if selection is block-level, otherwise false
     * @hidden
     */
    public isBlockLevelRect(rect: DOMRect, range: Range): boolean {
        const common: Node = range.commonAncestorContainer;

        if (!(common instanceof Element)) { return false; }

        const blocks: HTMLElement[] = Array.from(common.querySelectorAll('.e-block'));

        for (const block of blocks) {
            const blockRect: DOMRect = block.getBoundingClientRect() as DOMRect;
            const widthRatio: number = rect.width / blockRect.width;

            if (widthRatio > 0.8 && Math.abs(rect.left - blockRect.left) < 5) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns the Y element that corresponds to a parent block id.
     *
     * @param {string} parentId - The parent block id to locate
     * @returns {Y.XmlElement | null} - The parent Y element or null
     * @hidden
     */
    public getParentContainer(parentId: string): Y.XmlElement | null {
        const entry: { node: Y.XmlElement; parent: Y.XmlFragment | Y.XmlElement } = this.findYBlockById(
            parentId, this.parent.yBlocks
        );
        return entry ? entry.node : null;
    }

    /**
     * Finds the index of a given child id inside a Y element.
     *
     * @param {Y.XmlElement} parent - The parent Y element to search
     * @param {string | undefined} targetId - The child id to find
     * @returns {number} - The child index or parent.length if not found
     * @hidden
     */
    public findChildIndex(
        parent: Y.XmlElement,
        targetId: string | undefined
    ): number {
        const children: XmlElement[] = parent.toArray();
        for (let i: number = 0; i < children.length; i++) {
            const child: XmlElement = children[i as number];
            if (child instanceof this.YRuntime.XmlElement && child.getAttribute('id') === targetId) {
                return i;
            }
        }

        return parent.length;
    }

}
