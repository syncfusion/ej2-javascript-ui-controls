import { detach } from '@syncfusion/ej2-base';
import { TextNodePosition } from '../base/interface';

/**
 * Walks through all text nodes in a container with cumulative offsets
 *
 * @param {HTMLElement} container - Container element to walk
 * @returns {Array} Array of tuples with text nodes and their cumulative offsets
 * @hidden
 */
export function walkTextNodes(container: HTMLElement): Array<[Text, number]> {
    const walker: TreeWalker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
    );

    const result: Array<[Text, number]> = [];
    let cumulativeOffset: number = 0;
    let node: Node = walker.nextNode();

    while (node) {
        const textNode: Text = node as Text;
        result.push([textNode, cumulativeOffset]);
        cumulativeOffset += textNode.textContent.length;
        node = walker.nextNode();
    }

    return result;
}

/**
 * Calculates total text length in a container element
 *
 * @param {HTMLElement} container - Container element
 * @returns {number} Total text character count
 * @hidden
 */
export function getTotalTextLength(container: HTMLElement): number {
    let total: number = 0;

    for (const [node] of walkTextNodes(container)) {
        total += node.textContent.length;
    }

    return total;
}

/**
 * Finds text node at specified absolute offset in container
 *
 * @param {HTMLElement} container - Container element
 * @param {number} absoluteOffset - Absolute character offset
 * @returns {TextNodePosition|null} Text node position or null
 * @hidden
 */
export function findTextNodeAtOffset(
    container: HTMLElement,
    absoluteOffset: number
): TextNodePosition | null {
    for (const [node, nodeOffset] of walkTextNodes(container)) {
        const nodeLength: number = node.length;
        const nodeEndOffset: number = nodeOffset + nodeLength;

        if (absoluteOffset >= nodeOffset && absoluteOffset <= nodeEndOffset) {
            return {
                node,
                offsetInContainer: nodeOffset,
                offsetInNode: absoluteOffset - nodeOffset
            };
        }
    }

    return null;
}

/**
 * Walks up the DOM from `startNode` to `boundary`, returning the first
 * ancestor that has `contenteditable="false"` — i.e. an atomic/non-editable
 * chip element such as a Mention or Label.
 * Returns null when `startNode` is not inside any non-editable subtree.
 *
 * @param {Node} startNode - The start node
 * @param {HTMLElement} boundary - The boundary element
 * @returns {Element} - The ancestor of non editable element
 *
 * @hidden
 */
function getNonEditableAncestor(startNode: Node, boundary: HTMLElement): Element {
    let current: Node | null = startNode.parentNode;
    while (current && current !== boundary) {
        if (
            current.nodeType === Node.ELEMENT_NODE &&
            (current as Element).getAttribute('contenteditable') === 'false'
        ) {
            return current as Element;
        }
        current = current.parentNode;
    }
    return null;
}

/**
 * Inserts text at specified absolute offset in container
 *
 * @param {HTMLElement} container - Container element
 * @param {number} absoluteOffset - Absolute offset to insert at
 * @param {string} textToInsert - Text to insert
 * @returns {Text|null} Text node containing insertion or null
 * @hidden
 */
export function insertTextAtOffset(
    container: HTMLElement,
    absoluteOffset: number,
    textToInsert: string
): Text | null {
    const pos: TextNodePosition = findTextNodeAtOffset(container, absoluteOffset);

    if (!pos) {
        const totalLength: number = getTotalTextLength(container);
        if (absoluteOffset !== totalLength) { return null; }

        const newNode: Text = document.createTextNode(textToInsert);
        container.appendChild(newNode);
        return newNode;
    }

    const { node, offsetInNode } = pos;

    // Guard: if the resolved text node sits inside a contenteditable="false"
    // chip (Mention / Label), we must NOT mutate it with insertData.
    // Instead, redirect the insert to a text node adjacent to the chip.
    const chip: Element | null = getNonEditableAncestor(node, container);
    if (chip) {
        if (offsetInNode === 0) {
            // Insertion is at the left boundary of the chip → insert before it.
            const prevSibling: ChildNode | null = chip.previousSibling as ChildNode;
            if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
                const prev: Text = prevSibling as Text;
                prev.insertData(prev.length, textToInsert);
                return prev;
            }
            const newNode: Text = document.createTextNode(textToInsert);
            chip.parentNode.insertBefore(newNode, chip);
            return newNode;
        } else {
            // Insertion is at or past the right boundary of the chip → insert after it.
            const nextSibling: ChildNode | null = chip.nextSibling as ChildNode;
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                (nextSibling as Text).insertData(0, textToInsert);
                return nextSibling as Text;
            }
            const newNode: Text = document.createTextNode(textToInsert);
            chip.parentNode.insertBefore(newNode, nextSibling);
            return newNode;
        }
    }

    // insertData mutates the existing node buffer in place. The C++ DOM pointer stays alive, preventing cursor eviction.
    node.insertData(offsetInNode, textToInsert);

    return node;
}

/**
 * Deletes text at specified absolute offset and length
 *
 * @param {HTMLElement} container - Container element
 * @param {number} absoluteOffset - Absolute offset to start deletion
 * @param {number} length - Number of characters to delete
 * @returns {number} Number of characters deleted
 * @hidden
 */
export function deleteTextAtOffset(
    container: HTMLElement,
    absoluteOffset: number,
    length: number
): number {
    let deletedCount: number = 0;
    const endOffset: number = absoluteOffset + length;
    const nodesToClean: Text[] = [];
    const ops: Array<{ node: Text, localStart: number, localLength: number }> = [];
    const parentsToCleanup: Set<HTMLElement> = new Set<HTMLElement>();
    const inlineChipsToCleanup: Set<HTMLElement> = new Set();

    for (const [node, nodeOffset] of walkTextNodes(container)) {
        const nodeLength: number = node.length;
        const nodeEndOffset: number = nodeOffset + nodeLength;

        if (nodeEndOffset <= absoluteOffset || nodeOffset >= endOffset) {
            continue;
        }

        const deleteStart: number = Math.max(0, absoluteOffset - nodeOffset);
        const deleteEnd: number = Math.min(nodeLength, endOffset - nodeOffset);
        const deleteLength: number = deleteEnd - deleteStart;

        // Collect all deletions without mutating DOM
        ops.push({ node: node, localStart: deleteStart, localLength: deleteLength });
        deletedCount += deleteLength;
    }

    // Apply deletions in reverse order (safer for DOM mutations)
    for (let i: number = ops.length - 1; i >= 0; i--) {
        const { node, localStart, localLength } = ops[i as number];

        // deleteData runs fine-grained memmove operations. It slices out characters without creating a brand new node.
        node.deleteData(localStart, localLength);

        if (node.length === 0) {
            nodesToClean.push(node);
        }
    }


    // Remove empty text nodes immediately
    for (const node of nodesToClean) {

        const chip: HTMLElement | null = getAtomicChip(node, container);
        if (chip) {
            inlineChipsToCleanup.add(chip);
            continue;
        }

        const parent: HTMLElement | null = node.parentElement;
        if (!parent) { continue; }

        if (parent !== container && ['STRONG', 'EM', 'U', 'S', 'SPAN', 'A', 'CODE'].indexOf(parent.tagName) !== -1) {
            parentsToCleanup.add(parent);
        }

        parent.removeChild(node);
    }

    // Defer structural cleanup until current sync cycle completes
    if (parentsToCleanup.size > 0 || inlineChipsToCleanup.size > 0) {
        queueMicrotask((): void => {
            inlineChipsToCleanup.forEach((chip: HTMLElement): void => {
                detach(chip);
            });

            parentsToCleanup.forEach((parent: HTMLElement): void => {
                if (
                    parent.isConnected &&
                    parent.childNodes.length === 0 &&
                    parent.parentElement
                ) {
                    parent.parentElement.removeChild(parent);
                }
            });
        });
    }

    return deletedCount;
}

function getAtomicChip(node: Node, container: HTMLElement): HTMLElement | null {
    let current: Node | null = node.parentNode;

    while (current && current !== container) {
        if (
            current instanceof HTMLElement &&
            current.classList.contains('e-mention-chip')
        ) {
            return current;
        }

        current = current.parentNode;
    }

    return null;
}

/**
 * Flattens nested object into flat key-value pairs
 *
 * @param {Object} obj - Object to flatten
 * @returns {Object} Flattened object
 * @hidden
 */
export function flattenObj(obj: any): any {
    let res: any = {};
    for (const key of Object.keys(obj)) {
        const value: any = obj[`${key}`];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            res = { ...res, ...flattenObj(value) };
        } else {
            res[`${key}`] = value;
        }
    }
    return res;
}

/**
 * Unflattens object separating style properties into nested structure
 *
 * @param {Record<string, any>} flat - Flattened object
 * @returns {Record<string, any>} Unflattened object with styles nested
 * @hidden
 */
export function unflatten(
    flat: Record<string, any>
): Record<string, any> {
    const styleKeys: Set<string> = new Set([
        'bold', 'italic', 'underline', 'strikethrough', 'inlineCode',
        'color', 'backgroundColor', 'uppercase', 'lowercase', 'subscript', 'superscript'
    ]);
    const result: Record<string, any> = {};
    const styles: Record<string, any> = {};

    for (const key of Object.keys(flat)) {
        const value: any = flat[`${key}`];
        if (styleKeys.has(key)) {
            // Style-related → put inside styles
            styles[`${key}`] = value;
        } else {
            // Structural/special → keep at top level
            result[`${key}`] = value;
        }
    }

    // Only add styles if it has content
    if (Object.keys(styles).length > 0) {
        result.styles = styles;
    }

    return result;
}
