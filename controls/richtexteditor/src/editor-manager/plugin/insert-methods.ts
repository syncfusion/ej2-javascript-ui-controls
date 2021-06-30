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
        const child: Node[] = [];
        for (; node.firstChild; null) {
            child.push(parent.insertBefore(node.firstChild, node));
        }
        parent.removeChild(node);
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
