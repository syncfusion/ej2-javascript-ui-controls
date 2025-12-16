import { generateUniqueId } from '../../../common/utils/common';
import { ISplitContentData } from '../../../common/interface';
import * as constants from '../../../common/constant';

/**
 * Responsible for splitting DOM nodes
 *
 * @hidden
 */
export class NodeCutter {

    /**
     * Splits the content of a block at a specified node and offset.
     *
     * @param {HTMLElement} contentElement - The content element of the block.
     * @param {Node} splitNode - The node at which to split the content.
     * @param {number} splitOffset - The offset within the split node at which to split the content.
     * @returns {ISplitContentData} - An object containing the before and after fragments of the split content.
     * @hidden
     */
    public static splitContent(contentElement: HTMLElement, splitNode: Node, splitOffset: number): ISplitContentData {
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
                            // Only re-generate id for the root node
                            if (i === 0) {
                                cloned.id = generateUniqueId(constants.CONTENT_ID_PREFIX);
                            }
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
