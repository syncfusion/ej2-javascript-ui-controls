import { ISplitContentData } from '../interface';

export class NodeCutter {

    /**
     * Split node at both selection boundaries (start and end).
     *
     * After this method:
     * - Start boundary: content before selection is isolated from selected content
     * - End boundary: selected content is isolated from content after
     * Result: Selected content can be cleanly operated on
     *
     * @param {Range} range - The selection range
     * @param {Node} node - The node to split
     * @returns {Node} - The node containing the selected content
     */
    public getSpliceNode(range: Range, node: Node): Node {
        // First pass: split at START boundary
        node = this.splitNode(range, node, true);
        // Second pass: split at END boundary
        node = this.splitNode(range, node, false);
        return node;
    }

    /**
     * Split a single node at one boundary of the range.
     *
     * If isStart is true: Splits at the START boundary
     *   - Moves content before selection out of the node
     *   - Leaves selected content and content after in the node
     *
     * If isStart is false: Splits at the END boundary
     *   - Moves content after selection out of the node
     *   - Leaves content before and selected content in the node
     *
     * @param {Range} range - The selection range
     * @param {Node} node - The node to split
     * @param {boolean} isStart - If true, split at start boundary; if false, split at end boundary
     * @returns {Node} - The node after splitting
     */
    private splitNode(range: Range, node: Node, isStart: boolean): Node {
        const clone: Range = range.cloneRange();
        const parent: HTMLElement = node.parentNode as HTMLElement;
        const index: number = this.getNodeIndex(node);

        // Set up cloned range to extract content
        clone.collapse(isStart);
        if (isStart) {
            // For start split: we want everything from node start to selection start
            clone.setStartBefore(node);
        } else {
            // For end split: we want everything from selection end to node end
            clone.setEndAfter(node);
        }

        // Extract the content
        const fragment: DocumentFragment = clone.extractContents();

        // After extraction, get reference to current node in parent
        if (isStart) {
            // After start split, selected content is at original index
            node = parent.childNodes[index as number] as HTMLElement;
        } else {
            // After end split, find the node (it might have moved)
            node = parent.childNodes.length > 1
                ? parent.childNodes[index as number] as HTMLElement
                : parent.childNodes[0 as number] as HTMLElement;
        }

        // Insert the extracted fragment back (this is the part that's NOT selected)
        if (fragment && fragment.childNodes.length > 0) {
            const isEmpty: boolean = this.isEmptyFragment(fragment);
            const refNode: Node = (isStart ? node : node.nextSibling) as Node;
            if (!isEmpty) {
                parent.insertBefore(fragment, refNode);
            }
        }

        return node;
    }

    /**
     * Check if a fragment is effectively empty (only contains whitespace, no meaningful content)
     *
     * @param {DocumentFragment} fragment - Fragment to check
     * @returns {boolean} - Whether the fragment is empty
     */
    private isEmptyFragment(fragment: DocumentFragment | Node): boolean {
        if (!fragment || !fragment.textContent) {
            return true;
        }

        return fragment.textContent.trim() === '';
    }

    /**
     * Get the index of a node among its siblings
     *
     * @param {Node} node - The node to get index for.
     * @returns {number} - The index of the node
     */
    private getNodeIndex(node: Node): number {
        let index: number = 0;
        let sibling: Node = node.previousSibling as Node;
        while (sibling) {
            index++;
            sibling = sibling.previousSibling as Node;
        }
        return index;
    }

    /**
     * Splits the content of a block at a specified node and offset.
     * Used for block operations like Enter key (splitting paragraphs) and paste operations.
     *
     * @param {HTMLElement} contentElement - The content element of the block
     * @param {Node} splitNode - The node at which to split the content
     * @param {number} splitOffset - The offset within the split node at which to split
     * @returns {ISplitContentData} - Contains beforeFragment and afterFragment
     * @hidden
     */
    public splitContent(contentElement: HTMLElement, splitNode: Node, splitOffset: number): ISplitContentData {
        const beforeFragment: DocumentFragment = document.createDocumentFragment();
        const afterFragment: DocumentFragment = document.createDocumentFragment();
        let isSplitting: boolean = false;

        const processNode: (node: Node, container: Node, parentChain: Node[], isAfter?: boolean) => void = (
            node: Node,
            container: Node,
            parentChain: Node[] = [],
            isAfter: boolean = false
        ): void => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textNode: Text = node as Text;
                const fullText: string = textNode.textContent;
                if (!isAfter && node === splitNode) {
                    const beforeText: string = fullText.slice(0, splitOffset);
                    const afterText: string = fullText.slice(splitOffset);

                    if (beforeText) { container.appendChild(document.createTextNode(beforeText)); }

                    if (afterText) {
                        // Build after tree from deepest to root
                        let afterNode: Node = document.createTextNode(afterText);
                        for (let i: number = parentChain.length - 1; i >= 0; i--) {
                            const cloned: HTMLElement = (parentChain[i as number] as HTMLElement)
                                .cloneNode(false) as HTMLElement;
                            cloned.appendChild(afterNode);
                            afterNode = cloned;
                        }
                        afterFragment.appendChild(afterNode);
                    }

                    isSplitting = true;
                } else {
                    container.appendChild(document.createTextNode(fullText));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                const clone: HTMLElement = element.cloneNode(false) as HTMLElement;
                const newParentChain: Node[] = [...parentChain, element];

                if (!isAfter && (element.contains(splitNode) || element === splitNode)) {
                    for (const child of Array.from(element.childNodes)) {
                        if (!isSplitting && (child.contains(splitNode) || child === splitNode)) {
                            processNode(child, clone, newParentChain);
                        } else {
                            processNode(child, clone, newParentChain, isSplitting);
                        }
                    }
                    container.appendChild(clone);
                } else {
                    if (isAfter) {
                        container.appendChild(element.cloneNode(true));
                    } else {
                        container.appendChild(clone);
                        for (const child of Array.from(element.childNodes)) {
                            processNode(child, clone, newParentChain, isAfter);
                        }
                    }
                }
            }
        };

        for (const node of Array.from(contentElement.childNodes)) {
            if (!isSplitting) {
                processNode(node, beforeFragment, []);
            } else {
                afterFragment.appendChild(node.cloneNode(true));
            }
        }

        return { beforeFragment, afterFragment, splitOffset };
    }
}
