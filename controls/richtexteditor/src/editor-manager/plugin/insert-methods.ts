/**
 * Node appending methods.
 * @hidden
 */
export class InsertMethods {
    /**
     * WrapBefore method
     * @hidden
     * @deprecated
     */
    public static WrapBefore(textNode: Text, parentNode: HTMLElement, isAfter?: boolean): Text {
        parentNode.innerText = textNode.textContent;
        (!isAfter) ? this.AppendBefore(parentNode, textNode) : this.AppendBefore(parentNode, textNode, true);
        if (textNode.parentNode) {
            textNode.parentNode.removeChild(textNode);
        }
        return parentNode.childNodes[0] as Text;
    }

    /**
     * Wrap method
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
     * @hidden
     * @deprecated
     */
    public static unwrap(node: Node | HTMLElement): Node[] {
        let parent: Node = node.parentNode;
        let child: Node[] = [];
        for (; node.firstChild; null) {
            child.push(parent.insertBefore(node.firstChild, node));
        }
        parent.removeChild(node);
        return child;
    }

    /**
     * AppendBefore method
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