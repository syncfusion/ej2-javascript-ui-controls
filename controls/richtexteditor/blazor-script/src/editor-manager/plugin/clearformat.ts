/**
 * `Clear Format` module is used to handle Clear Format.
 */
import { closest, isNullOrUndefined } from '../../../../base'; /*externalscript*/
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { DOMNode } from './dom-node';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';
import { isIDevice, setEditFrameFocus } from '../../common/util';

export class ClearFormat {
    private static BLOCK_TAGS: string[] = ['address', 'article', 'aside', 'blockquote',
        'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
        'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'li', 'main', 'nav',
        'noscript', 'ol', 'p', 'pre', 'section', 'ul' ];
    private static NONVALID_PARENT_TAGS: string[] = ['thead', 'tbody', 'ul', 'ol', 'table', 'tfoot', 'tr'];
    private static IGNORE_PARENT_TAGS: string[] = ['ul', 'ol', 'table'];
    private static NONVALID_TAGS: string[] = ['thead', 'tbody', 'figcaption', 'td', 'tr', 'th',   'tfoot', 'figcaption', 'li'  ];
    private static defaultTag: string = 'p';
    private static domNode: DOMNode;
    /**
     * clear method
     *
     * @param {Document} docElement - specifies the document element.
     * @param {Node} endNode - specifies the end node
     * @param {string} enterAction - specifies the enter key action
     * @param {string} selector - specifies the string value
     * @param {string} command - specifies the command value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public static clear(docElement: Document, endNode: Node, enterAction: string, selector?: string, command?: string): void {
        this.domNode = new DOMNode((endNode as HTMLElement), docElement);
        this.defaultTag = enterAction === 'P' ? 'p' : 'div';
        const nodeSelection: NodeSelection = new NodeSelection(endNode as HTMLElement);
        const nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        const nodes: Node[] = range.collapsed ? nodeSelection.getSelectionNodeCollection(range) :
            nodeSelection.getSelectionNodeCollectionBr(range);
        const save: NodeSelection =  nodeSelection.save(range, docElement);
        let cursorRange: boolean = false;
        if (range.collapsed && command !== 'ClearFormat') {
            cursorRange = true;
            range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
        }
        const isCollapsed: boolean = range.collapsed;
        if (!isCollapsed) {
            let preNode: Node;
            if (nodes.length > 0 && nodes[0].nodeName === 'BR' && closest(nodes[0], 'table')) {
                preNode = nodeCutter.GetSpliceNode(range, closest(nodes[0], 'table') as HTMLElement);
            } else {
                preNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length > 1 && nodes[0].nodeName === 'IMG' ? 1 : 0]  as HTMLElement);
            }
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else if (nodes.length > 1) {
                let i: number = 1;
                let lastText: Node = nodes[nodes.length - i];
                while (nodes.length <= i && nodes[nodes.length - i].nodeName === 'BR') {
                    i++;
                    lastText = nodes[nodes.length - i];
                }
                const lasNode: Node = nodeCutter.GetSpliceNode(range, lastText as HTMLElement);
                if (lasNode) {
                    nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                        lasNode.textContent.length : lasNode.childNodes.length);
                }
                range = nodeSelection.getRange(docElement);
            }
            let exactNodes: Node[] = nodeSelection.getNodeCollection(range);
            const cloneSelectNodes: Node[] = exactNodes.slice();
            this.clearInlines(
                nodeSelection.getSelectionNodesBr(cloneSelectNodes),
                cloneSelectNodes,
                nodeSelection.getRange(docElement),
                nodeCutter,
                endNode);
            this.reSelection(docElement, save, exactNodes);
            range = nodeSelection.getRange(docElement);
            exactNodes = nodeSelection.getNodeCollection(range);
            const cloneParentNodes: Node[] = exactNodes.slice();
            this.clearBlocks(docElement, cloneParentNodes, endNode, nodeCutter, nodeSelection);
            if (isIDevice()) {
                setEditFrameFocus(endNode as Element, selector);
            }
            this.reSelection(docElement, save, exactNodes);
        }
        if (cursorRange) {
            nodeSelection.setCursorPoint(docElement, range.endContainer as Element, range.endOffset);
        }
    }

    private static reSelection(
        docElement: Document,
        save: NodeSelection,
        exactNodes: Node[] ): void {
        const selectionNodes: Node[] = save.getInsertNodes(exactNodes);
        save.startContainer = save.getNodeArray(
            selectionNodes[0],
            true,
            docElement);
        save.startOffset = 0;
        save.endContainer = save.getNodeArray(
            selectionNodes[selectionNodes.length - 1],
            false,
            docElement);
        const endIndexNode: Node = selectionNodes[selectionNodes.length - 1];
        save.endOffset = (endIndexNode.nodeType === 3) ? endIndexNode.textContent.length
            : endIndexNode.childNodes.length;
        save.restore();
    }

    private static clearBlocks(
        docElement: Document,
        nodes: Node[],
        endNode: Node,
        nodeCutter: NodeCutter,
        nodeSelection: NodeSelection): void {
        let parentNodes: Node[] = [];
        for (let index: number = 0; index < nodes.length; index++) {
            if ( this.BLOCK_TAGS.indexOf(nodes[index as number].nodeName.toLocaleLowerCase()) > -1
            && parentNodes.indexOf(nodes[index as number]) === -1 ) {
                parentNodes.push(nodes[index as number]);
            } else if (
                ( this.BLOCK_TAGS.indexOf(nodes[index as number].parentNode.nodeName.toLocaleLowerCase()) > -1 )
                && parentNodes.indexOf(nodes[index as number].parentNode) === -1
                && endNode !== nodes[index as number].parentNode ) {
                parentNodes.push(nodes[index as number].parentNode);
            }
        }
        parentNodes = this.spliceParent(parentNodes, nodes)[0];
        parentNodes = this.removeParent(parentNodes);
        this.unWrap(docElement, parentNodes, nodeCutter, nodeSelection);
    }

    private static spliceParent(parentNodes: Node[], nodes: Node[]): Node[][] {
        for (let index1: number = 0; index1 < parentNodes.length; index1++) {
            const len: number = parentNodes[index1 as number].childNodes.length;
            for (let index2: number = 0; index2 < len; index2++) {
                if ( (nodes.indexOf(parentNodes[index1 as number].childNodes[index2 as number]) > 0)
                && (parentNodes[index1 as number].childNodes[index2 as number].childNodes.length > 0)) {
                    nodes = this.spliceParent([parentNodes[index1 as number].childNodes[index2 as number]], nodes)[1];
                }
                if ((nodes.indexOf(parentNodes[index1 as number].childNodes[index2 as number]) <= -1) &&
                    (parentNodes[index1 as number].childNodes[index2 as number].textContent.trim() !== '') ) {
                    for (let index3: number = 0; index3 < len; index3++) {
                        if (nodes.indexOf(parentNodes[index1 as number].childNodes[index3 as number]) > -1) {
                            nodes.splice(nodes.indexOf(parentNodes[index1 as number].childNodes[index3 as number]) , 1);
                        }
                    }
                    index2 = parentNodes[index1 as number].childNodes.length;
                    const parentIndex: number = parentNodes.indexOf(parentNodes[index1 as number].parentNode);
                    const nodeIndex: number = nodes.indexOf(parentNodes[index1 as number].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    const elementIndex: number = nodes.indexOf(parentNodes[index1 as number]);
                    if (elementIndex > -1) {
                        nodes.splice(elementIndex, 1);
                    }
                    parentNodes.splice(index1, 1);
                    index1--;
                }
            }
        }
        return [parentNodes, nodes];
    }

    private static removeChild(parentNodes: Node[], parentNode: Node): Node[] {
        const count: number = parentNode.childNodes.length;
        if (count > 0) {
            for (let index: number = 0; index < count; index++) {
                if (parentNodes.indexOf(parentNode.childNodes[index as number]) > -1) {
                    parentNodes = this.removeChild(parentNodes, parentNode.childNodes[index as number]);
                    parentNodes.splice(parentNodes.indexOf(parentNode.childNodes[index as number]), 1);
                }
            }
        }
        return parentNodes;
    }

    private static removeParent(parentNodes: Node[]): Node[] {
        for (let index: number = 0; index < parentNodes.length; index++) {
            if (parentNodes.indexOf(parentNodes[index as number].parentNode) > -1) {
                parentNodes = this.removeChild(parentNodes, parentNodes[index as number]);
                parentNodes.splice(index, 1);
                index--;
            }
        }
        return parentNodes;
    }

    private static unWrap(docElement: Document, parentNodes: Node[], nodeCutter: NodeCutter, nodeSelection: NodeSelection): void {
        for (let index1: number = 0; index1 < parentNodes.length; index1++) {
            parentNodes[index1 as number] = (closest(parentNodes[index1 as number], 'li') && parentNodes[index1 as number].nodeName !== 'UL' && parentNodes[index1 as number].nodeName !== 'OL')
                ? closest(parentNodes[index1 as number], 'li')
                : parentNodes[index1 as number];
            if (this.NONVALID_TAGS.indexOf(parentNodes[index1 as number].nodeName.toLowerCase()) > -1
            && parentNodes[index1 as number].parentNode
            && this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1 as number].parentNode.nodeName.toLowerCase()) > -1) {
                nodeSelection.setSelectionText(
                    docElement,
                    parentNodes[index1 as number],
                    parentNodes[index1 as number],
                    0,
                    parentNodes[index1 as number].childNodes.length);
                InsertMethods.unwrap(
                    nodeCutter.GetSpliceNode(
                        nodeSelection.getRange(docElement),
                        parentNodes[index1 as number].parentNode as HTMLElement));
            }
            const blockquoteNode: Node = closest(parentNodes[index1 as number], 'blockquote');
            if (parentNodes[index1 as number].nodeName.toLocaleLowerCase() !== 'blockquote' && !isNullOrUndefined(blockquoteNode) && blockquoteNode.textContent === parentNodes[index1 as number].textContent) {
                const blockNodes: Node[] = this.removeParent([blockquoteNode]);
                this.unWrap(docElement, blockNodes, nodeCutter, nodeSelection);
            }
            if (parentNodes[index1 as number].nodeName.toLocaleLowerCase() !== 'p') {
                if (this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1 as number].nodeName.toLowerCase()) < 0
                    && !((parentNodes[index1 as number].nodeName.toLocaleLowerCase() === 'blockquote'
                        || parentNodes[index1 as number].nodeName.toLocaleLowerCase() === 'li')
                        && this.IGNORE_PARENT_TAGS.indexOf(parentNodes[index1 as number].childNodes[0].nodeName.toLocaleLowerCase()) > -1)
                    && !(parentNodes[index1 as number].childNodes.length === 1
                        && parentNodes[index1 as number].childNodes[0].nodeName.toLocaleLowerCase() === 'p')) {
                    InsertMethods.Wrap(parentNodes[index1 as number] as HTMLElement, docElement.createElement(this.defaultTag));
                }
                const childNodes: Node[] = InsertMethods.unwrap(parentNodes[index1 as number]);
                if ( childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1 as number] as HTMLElement, docElement.createElement(this.defaultTag));
                    InsertMethods.unwrap(parentNodes[index1 as number]);
                }
                for (let index2: number = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2 as number].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2 as number]], nodeCutter, nodeSelection);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2 as number].nodeName.toLocaleLowerCase()) > -1 &&
                    childNodes[index2 as number].nodeName.toLocaleLowerCase() !== 'p') {
                        const blockNodes: Node[] = this.removeParent([childNodes[index2 as number]]);
                        this.unWrap(docElement, blockNodes, nodeCutter, nodeSelection);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2 as number].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2 as number].nodeName.toLocaleLowerCase() === 'p') {
                        if (childNodes[index2 as number].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                            InsertMethods.unwrap(childNodes[index2 as number].parentNode as HTMLElement);
                        }
                        InsertMethods.Wrap(childNodes[index2 as number] as HTMLElement, docElement.createElement(this.defaultTag));
                        InsertMethods.unwrap(childNodes[index2 as number]);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2 as number].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2 as number].parentNode.nodeName.toLocaleLowerCase() ===
                    childNodes[index2 as number].nodeName.toLocaleLowerCase()) {
                        InsertMethods.unwrap(childNodes[index2 as number]);
                    }
                }
            } else {
                InsertMethods.Wrap(parentNodes[index1 as number] as HTMLElement, docElement.createElement(this.defaultTag));
                InsertMethods.unwrap(parentNodes[index1 as number]);
            }
        }
    }

    private static clearInlines(
        textNodes: Node[],
        nodes: Node[],
        range: Range,
        nodeCutter: NodeCutter,
        // eslint-disable-next-line
        endNode: Node): void {
        for (let index: number = 0; index < textNodes.length; index++) {
            let currentInlineNode: Node = textNodes[index as number];
            let currentNode: Node;
            while (!this.domNode.isBlockNode(currentInlineNode as Element) &&
            (currentInlineNode.parentElement && !currentInlineNode.parentElement.classList.contains('e-img-inner'))) {
                currentNode = currentInlineNode;
                currentInlineNode = currentInlineNode.parentElement;
            }
            if (currentNode &&
                IsFormatted.inlineTags.indexOf(currentNode.nodeName.toLocaleLowerCase()) > -1 ) {
                nodeCutter.GetSpliceNode(range, currentNode as HTMLElement );
                this.removeInlineParent(currentNode);
            }
        }
    }

    private static removeInlineParent(textNodes: Node): void {
        const nodes: Node[] = InsertMethods.unwrap( textNodes );
        for (let index: number = 0; index < nodes.length; index++) {
            if (nodes[index as number].parentNode.childNodes.length === 1 && !(nodes[index as number].parentNode as HTMLElement).classList.contains('e-img-inner')
                && IsFormatted.inlineTags.indexOf(nodes[index as number].parentNode.nodeName.toLocaleLowerCase()) > -1 ) {
                this.removeInlineParent(nodes[index as number].parentNode);
            } else if (IsFormatted.inlineTags.indexOf(nodes[index as number].nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index as number]);
            }
        }
    }
}
