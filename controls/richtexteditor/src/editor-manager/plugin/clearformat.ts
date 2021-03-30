/**
 * `Clear Format` module is used to handle Clear Format.
 */
import { closest } from '@syncfusion/ej2-base';
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
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
    /**
     * clear method
     *
     * @param {Document} docElement - specifies the document element.
     * @param {Node} endNode - specifies the end node
     * @param {string} selector - specifies the string value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public static clear(docElement: Document, endNode: Node, selector?: string): void {
        const nodeSelection: NodeSelection = new NodeSelection();
        const nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        const isCollapsed: boolean = range.collapsed;
        const nodes: Node[] = nodeSelection.getInsertNodeCollection(range);
        const save: NodeSelection =  nodeSelection.save(range, docElement);
        if (!isCollapsed) {
            let preNode: Node;
            if (nodes[0].nodeName === 'BR' && closest(nodes[0], 'table')) {
                preNode = nodeCutter.GetSpliceNode(range, closest(nodes[0], 'table') as HTMLElement);
            } else {
                preNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length > 1 && nodes[0].nodeName === 'IMG' ? 1 : 0]  as HTMLElement);
            }
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else {
                let i: number = 1;
                let lastText: Node = nodes[nodes.length - i];
                while (nodes.length <= i && nodes[nodes.length - i].nodeName === 'BR') {
                    i++;
                    lastText = nodes[nodes.length - i];
                }
                const lasNode: Node = nodeCutter.GetSpliceNode(range, lastText as HTMLElement);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            let exactNodes: Node[] = nodeSelection.getNodeCollection(range);
            const cloneSelectNodes: Node[] = exactNodes.slice();
            this.clearInlines(
                nodeSelection.getSelectionNodes(cloneSelectNodes),
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
        let endIndexNode: Node = selectionNodes[selectionNodes.length - 1];
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
            if ( this.BLOCK_TAGS.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1
            && parentNodes.indexOf(nodes[index]) === -1 ) {
                parentNodes.push(nodes[index]);
            } else if (
                ( this.BLOCK_TAGS.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1 )
                && parentNodes.indexOf(nodes[index].parentNode) === -1
                && endNode !== nodes[index].parentNode ) {
                parentNodes.push(nodes[index].parentNode);
            }
        }
        parentNodes = this.spliceParent(parentNodes, nodes)[0];
        parentNodes = this.removeParent(parentNodes);
        this.unWrap(docElement, parentNodes, nodeCutter, nodeSelection);
    }

    private static spliceParent(parentNodes: Node[], nodes: Node[]): Node[][] {
        for (let index1: number = 0; index1 < parentNodes.length; index1++) {
            const len: number = parentNodes[index1].childNodes.length;
            for (let index2: number = 0; index2 < len; index2++) {
                if ( (nodes.indexOf(parentNodes[index1].childNodes[index2]) > 0)
                && (parentNodes[index1].childNodes[index2].childNodes.length > 0)) {
                    nodes = this.spliceParent([parentNodes[index1].childNodes[index2]], nodes)[1];
                }
                if ( (nodes.indexOf(parentNodes[index1].childNodes[index2]) <= -1) &&
                    (parentNodes[index1].childNodes[index2].textContent.trim() !== '') ) {
                    for (let index3: number = 0; index3 < len; index3++) {
                        if (nodes.indexOf(parentNodes[index1].childNodes[index3]) > -1) {
                            nodes.splice(nodes.indexOf(parentNodes[index1].childNodes[index3]) , 1);
                        }
                    }
                    index2 = parentNodes[index1].childNodes.length;
                    const parentIndex: number = parentNodes.indexOf(parentNodes[index1].parentNode);
                    const nodeIndex: number = nodes.indexOf(parentNodes[index1].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    const elementIndex: number = nodes.indexOf(parentNodes[index1]);
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
                if (parentNodes.indexOf(parentNode.childNodes[index]) > -1) {
                    parentNodes = this.removeChild(parentNodes, parentNode.childNodes[index]);
                    parentNodes.splice(parentNodes.indexOf(parentNode.childNodes[index]), 1);
                }
            }
        }
        return parentNodes;
    }

    private static removeParent(parentNodes: Node[]): Node[] {
        for (let index: number = 0; index < parentNodes.length; index++) {
            if (parentNodes.indexOf(parentNodes[index].parentNode) > -1) {
                parentNodes = this.removeChild(parentNodes, parentNodes[index]);
                parentNodes.splice(index, 1);
                index--;
            }
        }
        return parentNodes;
    }

    private static unWrap(docElement: Document, parentNodes: Node[], nodeCutter: NodeCutter, nodeSelection: NodeSelection): void {
        for (let index1: number = 0; index1 < parentNodes.length; index1++) {
            if (this.NONVALID_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) > -1
            && parentNodes[index1].parentNode
            && this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].parentNode.nodeName.toLowerCase()) > -1) {
                nodeSelection.setSelectionText(
                    docElement,
                    parentNodes[index1],
                    parentNodes[index1],
                    0,
                    parentNodes[index1].childNodes.length);
                InsertMethods.unwrap(
                    nodeCutter.GetSpliceNode(
                        nodeSelection.getRange(docElement),
                        parentNodes[index1].parentNode as HTMLElement));
            }
            if (parentNodes[index1].nodeName.toLocaleLowerCase() !== 'p') {
                if (this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) < 0
                    && parentNodes[index1].parentNode.nodeName.toLocaleLowerCase() !== 'p'
                    && !((parentNodes[index1].nodeName.toLocaleLowerCase() === 'blockquote'
                        || parentNodes[index1].nodeName.toLocaleLowerCase() === 'li')
                        && this.IGNORE_PARENT_TAGS.indexOf(parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase()) > -1)
                    && !(parentNodes[index1].childNodes.length === 1
                        && parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase() === 'p')) {
                    InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p'));
                }
                const childNodes: Node[] = InsertMethods.unwrap(parentNodes[index1]);
                if ( childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p'));
                    InsertMethods.unwrap(parentNodes[index1]);
                }
                for (let index2: number = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2]], nodeCutter, nodeSelection);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                    childNodes[index2].nodeName.toLocaleLowerCase() !== 'p') {
                        const blockNodes: Node[] = this.removeParent([childNodes[index2]]);
                        this.unWrap(docElement, blockNodes, nodeCutter, nodeSelection);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].parentNode.nodeName.toLocaleLowerCase() === childNodes[index2].nodeName.toLocaleLowerCase()) {
                        InsertMethods.unwrap(childNodes[index2]);
                    } else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() === 'p') {
                        InsertMethods.Wrap(childNodes[index2] as HTMLElement, docElement.createElement('p'));
                        InsertMethods.unwrap(childNodes[index2]);
                    }
                }
            } else {
                InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p'));
                InsertMethods.unwrap(parentNodes[index1]);
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
            if ( textNodes[index].parentNode &&
                IsFormatted.inlineTags.indexOf(textNodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1 ) {
                nodeCutter.GetSpliceNode(range, textNodes[index].parentNode as HTMLElement );
                this.removeInlineParent(textNodes[index].parentNode);
            }
        }
    }

    private static removeInlineParent(textNodes: Node): void {
        const nodes: Node[] = InsertMethods.unwrap( textNodes );
        for (let index: number = 0; index < nodes.length; index++) {
            if ( nodes[index].parentNode.childNodes.length === 1
                && IsFormatted.inlineTags.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1 ) {
                this.removeInlineParent(nodes[index].parentNode);
            } else if (IsFormatted.inlineTags.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index]);
            }
        }
    }
}