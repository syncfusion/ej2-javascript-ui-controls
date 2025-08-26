/**
 * Node appending methods.
 *
 * @hidden
 */
export class InsertMethods {
    /**
     * WrapBefore method
     *
     * @param {Text} textNode - specifies the text node
     * @param {HTMLElement} parentNode - specifies the parent node
     * @param {boolean} isAfter - specifies the boolean value
     * @returns {Text} - returns the text value
     * @hidden
     * @deprecated
     */
    public static WrapBefore(textNode: Text, parentNode: HTMLElement, isAfter?: boolean): Text {
        parentNode.innerText = textNode.textContent;
        //eslint-disable-next-line
        (!isAfter) ? this.AppendBefore(parentNode, textNode) : this.AppendBefore(parentNode, textNode, true);
        if (textNode.parentNode) {
            textNode.parentNode.removeChild(textNode);
        }
        return parentNode.childNodes[0] as Text;
    }

    /**
     * Wrap method
     *
     * @param {HTMLElement} childNode - specifies the child node
     * @param {HTMLElement} parentNode - specifies the parent node.
     * @returns {HTMLElement} - returns the element
     * @hidden
     * @deprecated
     */
    public static Wrap(childNode: HTMLElement, parentNode: HTMLElement): HTMLElement {
        this.AppendBefore(parentNode, childNode);
        parentNode.appendChild(childNode);
        return childNode;
    }

    /**
     * unwrap method
     *
     * @param {Node} node - specifies the node element.
     * @returns {Node[]} - returns the array of value
     * @hidden
     * @deprecated
     */
    public static unwrap(node: Node | HTMLElement): Node[] {
        const parent: Node = node.parentNode;
        const selection: Selection = node.ownerDocument.defaultView.getSelection();
        let start: Node = null;
        let startOffset: number = 0;
        let end: Node = null;
        let endOffset: number = 0;
        let range: Range;
        // Save selection endpoints
        if (selection && selection.rangeCount) {
            range = selection.getRangeAt(0);
            start = range.startContainer;
            startOffset = range.startOffset;
            end = range.endContainer;
            endOffset = range.endOffset;
        }
        // Move children out of wrapper
        const child: Node[] = [];
        for (; node.firstChild; null) {
            child.push(parent.insertBefore(node.firstChild, node));
        }
        parent.removeChild(node);
        // Restore selection, inline mapping if node was removed
        if (selection && start && end && child.length > 0) {
            // Map start to first child if it pointed to the unwrapped node
            if (start === node)
            { start = child[Math.min(startOffset, child.length - 1)]; startOffset = 0; }
            // Map end to last child if it pointed to the unwrapped node
            if (end === node)
            { end = child[Math.min(endOffset, child.length - 1)]; endOffset = 0; }
            selection.removeAllRanges();
            range.setStart(start, startOffset);
            range.setEnd(end, endOffset);
            selection.addRange(range);
        }
        return child;
    }

    /**
     * AppendBefore method
     *
     * @param {HTMLElement} textNode - specifies the element
     * @param {HTMLElement} parentNode - specifies the parent node
     * @param {boolean} isAfter - specifies the boolean value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public static AppendBefore(
        textNode: HTMLElement | Text | DocumentFragment,
        parentNode: HTMLElement | Text | DocumentFragment,
        isAfter?: boolean): HTMLElement | Text | DocumentFragment {
        return (parentNode.parentNode) ? ((!isAfter) ? parentNode.parentNode.insertBefore(textNode, parentNode)
            : parentNode.parentNode.insertBefore(textNode, parentNode.nextSibling)) :
            parentNode;
    }
}
