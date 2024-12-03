import { createElement, detach, isNullOrUndefined  as isNOU} from '@syncfusion/ej2-base';
import { insertItemsAtIndex } from '../../common/util';
/**
 * Utilities to handle the table cell selection
 */
export class TableSelection {
    private root: HTMLElement | HTMLBodyElement;
    private currentDocument: Document;
    private BLOCK_TAGS: string[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'li', 'pre', 'td', 'th', 'div', 'hr', 'section', 'figure'];
    private BASIC_FORMATS: string[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre']
    constructor(root: HTMLElement | HTMLBodyElement, currentDocument: Document) {
        this.root = root;
        this.currentDocument = currentDocument;
    }

    /**
     * Get the block nodes from the selected cells.
     *
     * @returns {HTMLTableCellElement[]} - Returns the selected cells
     */
    public getBlockNodes(): HTMLElement[] {
        const blockNodes: HTMLElement[] = [];
        if (isNOU(this.root.querySelector('.e-cell-select'))) {
            return blockNodes;
        }
        const currentTable: HTMLTableElement = this.root.querySelector('.e-cell-select').closest('table') as HTMLTableElement;
        const cellSelectNode: NodeListOf<HTMLElement> = currentTable.querySelectorAll('.e-cell-select');
        if (isNOU(cellSelectNode) || cellSelectNode.length < 2) {
            return blockNodes;
        }
        // Generate block nodes
        for (let i: number = 0; i < cellSelectNode.length; i++) {
            this.addBlockNodes(cellSelectNode[i as number], blockNodes);
        }
        this.wrapParagraphNodes(blockNodes);
        return blockNodes;
    }

    private addBlockNodes(node: Node, blockNodes: HTMLElement[]): void {
        const nodes: NodeListOf<ChildNode> = node.childNodes;
        if (nodes.length === 0) {
            blockNodes.push(node as HTMLElement);
            return;
        }
        for (let j: number = 0; j < nodes.length; j++) {
            const currentNode: HTMLElement = nodes[j as number] as HTMLElement;
            if (blockNodes.indexOf(currentNode.parentElement as HTMLElement) >= 0) {
                continue;
            }
            if (currentNode.parentElement && (currentNode.parentElement.nodeName === 'TD' || currentNode.parentElement.nodeName === 'TH')
                && currentNode.parentElement.childNodes.length === 1) {
                if (currentNode.nodeName === 'BR') {
                    blockNodes.push(currentNode.parentElement as HTMLTableCellElement);
                } else if (currentNode.nodeType === Node.TEXT_NODE) {
                    blockNodes.push(currentNode.parentElement as HTMLTableCellElement);
                } else {
                    blockNodes.push(currentNode.parentElement);
                }
            } else {
                blockNodes.push(currentNode.parentElement);
            }
        }
    }

    /**
     * Get the text nodes from the selected cells
     *
     * @returns {Node[]} - Returns the text nodes
     */
    public getTextNodes(): Node[] {
        const textNodes: Node[] = [];
        if (isNOU(this.root.querySelector('.e-cell-select'))) {
            return textNodes;
        }
        const currentTable: HTMLTableElement = this.root.querySelector('.e-cell-select').closest('table') as HTMLTableElement;
        const cellSelectNode: NodeListOf<HTMLElement> = currentTable.querySelectorAll('.e-cell-select');
        if (isNOU(cellSelectNode) || cellSelectNode.length < 2) {
            return textNodes;
        }
        // Generate text nodes
        for (let i: number = 0; i < cellSelectNode.length; i++) {
            this.addTextNodes(cellSelectNode[i as number], textNodes);
        }
        return textNodes;
    }

    private addTextNodes(parent: HTMLElement, textNodes: Node[]): void {
        const nodes: NodeListOf<ChildNode> = parent.childNodes;
        if (nodes.length === 0 && (parent.nodeName === 'TD' || parent.nodeName === 'TH')) {
            const text: Node = this.currentDocument.createTextNode('\u200B');
            parent.appendChild(text);
            textNodes.push(text);
            return;
        } // If the BR element is the only child of the TD element, add a zero width space character
        else if (nodes.length === 1 && (parent.nodeName === 'TD' || parent.nodeName === 'TH') && nodes[0].nodeName === 'BR') {
            const text: Node = this.currentDocument.createTextNode('\u200B');
            parent.insertBefore(text, nodes[0]);
            textNodes.push(text);
            return;
        }
        for (let j: number = 0; j < nodes.length; j++) {
            const currentNode: HTMLElement = nodes[j as number] as HTMLElement;
            if (currentNode.nodeType === Node.TEXT_NODE) {
                textNodes.push(currentNode);
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                // Recursively check all descendants
                this.addTextNodes(currentNode, textNodes);
            }
        }
    }

    private wrapParagraphNodes(blockNodes: HTMLElement[]): void {
        const blockNodesArry: HTMLElement[] = Array.from(blockNodes);
        for (let i: number = 0; i < blockNodesArry.length; i++) {
            const node: HTMLElement = blockNodesArry[i as number];
            if (node.nodeName === 'TD' || node.nodeName === 'TH') {
                // Case 1: Simple TD with BR or inline or text nodes
                if (node.childNodes.length === 1 && (node.childNodes[0].nodeName === 'BR' || node.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    const childNode: HTMLElement = node.childNodes[0] as HTMLElement;
                    const paragraph: HTMLElement = createElement('p');
                    childNode.parentElement.insertBefore(paragraph, childNode);
                    paragraph.appendChild(childNode);
                    const index: number = blockNodes.indexOf(node);
                    blockNodes[index as number] = paragraph;
                }
                // Case 2 TD with inline and block nodes
                else {
                    const newIndex: number = blockNodes.indexOf(node);
                    this.wrapInlineNodes(node, blockNodes, newIndex as number);
                }
            }
        }
        for (let i: number = 0; i < blockNodes.length; i++) {
            const currentNode: HTMLElement = blockNodes[i as number];
            if (currentNode.nodeName === 'LI' && currentNode.childNodes.length === 1) {
                const firstChild: HTMLElement = currentNode.childNodes[0] as HTMLElement;
                if (firstChild.nodeType === Node.ELEMENT_NODE && this.BASIC_FORMATS.indexOf(firstChild.nodeName.toLocaleLowerCase()) >= 0
                    && firstChild.textContent === currentNode.textContent) {
                    blockNodes[i as number] = firstChild as HTMLElement;
                }
            }
        }
    }

    private wrapInlineNodes(node: HTMLElement, blockNodes: HTMLElement[], index: number): void {
        let child: Node | HTMLElement = node.childNodes[0] as Node;
        let wrapperElement: HTMLElement = createElement('p');
        const tempBlockNodes: HTMLElement[] = [];
        if (isNOU(child)) {
            node.appendChild(wrapperElement);
            tempBlockNodes.push(wrapperElement);
            insertItemsAtIndex(blockNodes, tempBlockNodes, index);
            return;
        }
        while (child) {
            // CASE 1: BR Elements
            if (child.nodeName === 'BR') {
                child.parentNode.insertBefore(wrapperElement, child);
                wrapperElement.appendChild(child);
                if (wrapperElement.childNodes.length > 0 && tempBlockNodes.indexOf(wrapperElement) < 0) {
                    tempBlockNodes.push(wrapperElement);
                }
                child = wrapperElement.nextSibling;
                wrapperElement = createElement('p');
            } // CASE 2: Block elements
            else if (this.BLOCK_TAGS.indexOf(child.nodeName.toLocaleLowerCase()) >= 0) {
                tempBlockNodes.push(child as HTMLElement);
                if (wrapperElement.childNodes.length > 0) {
                    child = wrapperElement.nextSibling;
                } else {
                    // Check if any nested list items are present
                    if (child && child.nodeName === 'LI' && (child as HTMLElement).querySelectorAll('li').length > 0) {
                        const listNodes: NodeListOf<HTMLElement> = (child as HTMLElement).querySelectorAll('li');
                        for (let i: number = 0; i < listNodes.length; i++) {
                            tempBlockNodes.push(listNodes[i as number]);
                        }
                    }
                    if (child.nodeName === 'LI' && isNOU(child.nextSibling)) {
                        child = child.parentElement.nextSibling;
                    } else {
                        child = child.nextSibling;
                    }
                }
            } // CASE 3: Text node
            else if (child.nodeType === Node.TEXT_NODE) {
                // Remove empty text nodes
                if (child.textContent.trim() === '' && child.textContent.indexOf('\u200B') < 0) {
                    const nextSibling: Node = child.nextSibling;
                    detach(child);
                    child = nextSibling;
                    continue;
                }
                child.parentNode.insertBefore(wrapperElement, child);
                const textNode: Node = child;
                wrapperElement.appendChild(textNode);
                if (wrapperElement.childNodes.length > 0 && tempBlockNodes.indexOf(wrapperElement) < 0) {
                    tempBlockNodes.push(wrapperElement);
                }
                child = wrapperElement.nextSibling as HTMLElement;
            } // CASE 4: Edge case UL, OL, TABLE, etc.
            else if (child.nodeName === 'TABLE' || child.nodeName === 'UL' || child.nodeName === 'OL') {
                if (child.nodeName === 'TABLE') {
                    const nestedBlockNodes: HTMLElement[] = [];
                    const cellSelectNode: NodeListOf<HTMLElement> = (child as HTMLElement).querySelectorAll('td, th');
                    for (let i: number = 0; i < cellSelectNode.length; i++) {
                        this.addBlockNodes(cellSelectNode[i as number], nestedBlockNodes);
                    }
                    this.wrapParagraphNodes(nestedBlockNodes);
                    for (let i: number = 0; i < nestedBlockNodes.length; i++) {
                        tempBlockNodes.push(nestedBlockNodes[i as number]);
                    }
                    child = child.nextSibling as HTMLElement;
                } else {
                    child = (child as HTMLElement).firstElementChild;
                }
            } // CASE 5: Inline elements
            else if (this.BLOCK_TAGS.indexOf(child.nodeName.toLocaleLowerCase()) < 0) {
                child.parentNode.insertBefore(wrapperElement, child);
                wrapperElement.appendChild(child);
                if (wrapperElement.childNodes.length > 0 && tempBlockNodes.indexOf(wrapperElement) < 0) {
                    tempBlockNodes.push(wrapperElement);
                }
                child = wrapperElement.nextSibling as HTMLElement;
            }
        }
        // Merge the block nodes
        insertItemsAtIndex(blockNodes, tempBlockNodes, index);
    }
}
