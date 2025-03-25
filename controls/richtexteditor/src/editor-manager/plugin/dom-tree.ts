/**
 *  DOMTreeMethods - A `TreeWalkder` API implementation to get the block and text nodes in the selection.
 */
export class DOMMethods {
    private directRangeElems: string[] = ['IMG', 'TABLE', 'AUDIO', 'VIDEO', 'HR']
    private BLOCK_TAGS: string[] = ['address', 'article', 'aside', 'audio', 'blockquote',
        'canvas', 'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
        'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
        'noscript', 'output', 'p', 'pre', 'section', 'td', 'tfoot', 'th',
        'video', 'body'];
    /**
     * Refers the `inputElement` of the editor.
     *
     * @hidden
     **/
    public editableElement: HTMLDivElement | HTMLBodyElement;
    private currentDocument: Document;

    constructor(editElement: HTMLDivElement | HTMLBodyElement) {
        this.editableElement = editElement;
        this.currentDocument = editElement.ownerDocument;
    }

    /**
     * Method to get the block nodes inside the given Block node `TreeWalker` API.
     *
     * @returns {HTMLElement[]} The block node element.
     *
     *
     */
    public getBlockNode(): HTMLElement[] {
        const blockCollection: HTMLElement[] = [];
        const selection: Selection = this.currentDocument.getSelection();
        const range: Range = selection.getRangeAt(0);
        // To find the direct range.
        const directRange: boolean = range.startContainer === this.editableElement && range.startContainer === range.endContainer &&
            range.startContainer.nodeName !== '#text';
        if (directRange) {
            if (range.startOffset === range.endOffset){
                const isDirectRangeElems: boolean = this.editableElement.childNodes[range.startOffset] &&
                    this.directRangeElems.indexOf(this.editableElement.childNodes[range.startOffset].nodeName) > -1;
                if (isDirectRangeElems) {
                    blockCollection.push(this.editableElement.childNodes[range.startOffset] as HTMLElement);
                }
            } else {
                const isElementRange: boolean = range.endOffset === range.startOffset + 1;
                if (isElementRange) {
                    blockCollection.push(this.editableElement.childNodes[range.startOffset] as HTMLElement);
                }
            }
            if (blockCollection.length > 0) {
                return blockCollection;
            }
        } else {
            const start: HTMLElement = range.startContainer.nodeType === Node.TEXT_NODE ?
                range.startContainer.parentElement : range.startContainer as HTMLElement;
            const end: HTMLElement = range.endContainer.nodeType === Node.TEXT_NODE ?
                range.endContainer.parentElement : range.endContainer as HTMLElement;
            const endBlockNode: HTMLElement = this.isBlockNode(end as HTMLElement) ? end : this.getParentBlockNode(end);
            const blockNodeWalker: TreeWalker = this.currentDocument.createTreeWalker(
                this.editableElement,
                NodeFilter.SHOW_ELEMENT, {
                    acceptNode: (node: Node) => {
                        if (!range.intersectsNode(node)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return this.isBlockNode(node as Element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                }
            );
            blockNodeWalker.currentNode = start;
            while (blockNodeWalker.currentNode) {
                if (this.isBlockNode(blockNodeWalker.currentNode  as Element)) {
                    this.addToBlockCollection(blockCollection, blockNodeWalker, range);
                    blockNodeWalker.nextNode();
                } else {
                    blockNodeWalker.previousNode();
                }
                if (blockNodeWalker.currentNode === end || blockNodeWalker.currentNode === endBlockNode) {
                    this.addToBlockCollection(blockCollection, blockNodeWalker, range);
                    break;
                }
            }
        }
        return blockCollection;
    }

    private addToBlockCollection(blockCollection: HTMLElement[], blockNodeWalker: TreeWalker, range: Range): void {
        const currentNode: Node = blockNodeWalker.currentNode;
        if (blockNodeWalker.currentNode && blockCollection.indexOf(blockNodeWalker.currentNode as HTMLElement) === -1) {
            if (currentNode.nodeName === 'LI') {
                const isDirectChild: boolean = !(currentNode.parentNode as HTMLElement).closest('li');
                if (isDirectChild) {
                    blockCollection.push(blockNodeWalker.currentNode as HTMLElement);
                } else {
                    const commonAncestor: Node = range.commonAncestorContainer;
                    const onlyNestedLISelection: boolean = ((commonAncestor.nodeName === 'OL' ||
                        commonAncestor.nodeName === 'UL') && (commonAncestor as HTMLElement).closest('li')) ? true : false;
                    if (onlyNestedLISelection) { // Edge case only nested List selection should allow the nodes.
                        blockCollection.push(blockNodeWalker.currentNode as HTMLElement);
                    } else {
                        return; // Nested list items are not added in the collection.
                    }
                }
            } else {
                blockCollection.push(blockNodeWalker.currentNode as HTMLElement);
            }
        }
    }

    /**
     * Method to get the text nodes inside the given Block node `TreeWalker` API.
     *
     * @param {HTMLElement} blockElem - specifies the parent block element.
     * @returns {Text[]} The Text Nodes.
     *
     *
     */
    public getTextNodes(blockElem: HTMLElement): Text[] {
        const nodeCollection: Text[] = [];
        const selection: Selection = this.currentDocument.getSelection();
        const range: Range = selection.getRangeAt(0);
        const textNodeWalker: TreeWalker = this.currentDocument.createTreeWalker(
            blockElem,
            NodeFilter.SHOW_TEXT, {
                acceptNode: (node: Node) => {
                    if (!range.intersectsNode(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        let textNode: Node = textNodeWalker.nextNode();
        while (textNode) {
            nodeCollection.push(textNode as Text);
            textNode = textNodeWalker.nextNode();
        }
        return nodeCollection;
    }

    /**
     * isBlockNode method
     *
     * @param {Element} element - specifies the node element.
     * @returns {boolean} - sepcifies the boolean value
     * @hidden
     */
    public isBlockNode(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && this.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    }

    /**
     * Retrieves the last text node within the provided node and its descendants.
     *
     * This method uses a TreeWalker to traverse all text nodes in the given node's subtree,
     * and returns the last text node found.
     *
     * @param {Node} node - The root node from which to begin searching for text nodes.
     * @returns {Node | null} - The last text node within the node, or null if no text nodes are found.
     */
    public getLastTextNode(node: Node): Node | null {
        const treeWalker: TreeWalker = this.currentDocument.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null
        );
        let lastTextNode: Node | null = null;
        let currentNode: Node | null = treeWalker.nextNode();
        while (currentNode) {
            lastTextNode = currentNode;
            currentNode = treeWalker.nextNode();
        }
        return lastTextNode;
    }

    /**
     * Retrieves the first text node within the provided node and its descendants.
     *
     * This method uses a TreeWalker to traverse all text nodes in the given node's subtree,
     * and returns the first text node found.
     *
     * @param {Node} node - The root node from which to begin searching for text nodes.
     * @returns {Node | null} - The first text node within the node, or null if no text nodes are found.
     */
    public getFirstTextNode(node: Node): Node | null {
        const treeWalker: TreeWalker = this.currentDocument.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null
        );
        const firstTextNode: Node | null = treeWalker.nextNode();
        return firstTextNode;
    }

    /**
     * Retrieves the parent block node of the given inline node.
     *
     * This method uses a TreeWalker to traverse the DOM tree and find the nearest ancestor of the given node
     * that is a block element.
     *
     * @param {Node} node - The node for which to find the parent block node.
     * @returns {Node} - The parent block node of the given node.
     * @hidden
     */
    public getParentBlockNode(node: Node): HTMLElement  {
        const treeWalker: TreeWalker = this.currentDocument.createTreeWalker(
            this.editableElement, // root
            NodeFilter.SHOW_ELEMENT, // whatToShow
            {   // filter
                acceptNode: (currentNode: Node) => {
                    // Check if the node is a block element
                    return this.isBlockNode(currentNode as Element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                }
            }
        );
        treeWalker.currentNode = node;
        const blockParent: HTMLElement = treeWalker.parentNode() as HTMLElement;
        return blockParent;
    }
    /**
     * Retrieves the top-most node in the DOM that is not a block-level element.
     * If the given text node is part of a block element, it returns the text node itself.
     * Otherwise, it traverses upwards through its parent nodes until it finds a node
     * that is either a block-level node or a node that contains different text content than the provided `text`.
     *
     * @param {Text} text - The text node from which to start the search. This can be a child of an inline element.
     * @returns {HTMLElement | Text} - The top-most parent element that is not a block node, or the text node itself if it's inside a block-level element.
     * @hidden
     *
     */
    public getTopMostNode(text: Text): HTMLElement | Text{
        if (this.isBlockNode(text.parentNode as HTMLElement)) {
            return text;
        }
        let parent: HTMLElement = text.parentNode as HTMLElement;
        while (parent) {
            if (!this.isBlockNode(parent.parentNode as HTMLElement) && text.textContent === parent.textContent) {
                parent = parent.parentNode as HTMLElement;
            } else {
                return parent;
            }
        }
        return parent;
    }
}
