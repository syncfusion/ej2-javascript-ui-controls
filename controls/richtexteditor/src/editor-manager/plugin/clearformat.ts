/**
 * `Clear Format` module is used to handle Clear Format.
 */
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';

export class ClearFormat {

    private static BLOCK_TAGS: string[] = ['address', 'article', 'aside', 'blockquote',
     'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'li', 'main', 'nav',
    'noscript', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul' ];

    private static NONVALID_PARENT_TAGS: string[] = ['thead', 'tbody', 'ul', 'ol', 'table', 'tfoot'  ];

    private static NONVALID_TAGS: string[] = ['thead', 'tbody', 'figcaption', 'td', 'tr',
            'th',   'tfoot', 'figcaption', 'li'  ];

    public static clear(docElement: Document, endNode: Node): void {
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        let isCollapsed: boolean = range.collapsed;
        let nodes: Node[] = nodeSelection.getInsertNodeCollection(range);
        let save: NodeSelection =  nodeSelection.save(range, docElement);
        if (!isCollapsed) {
            let preNode: Node = nodeCutter.GetSpliceNode(range, nodes[0] as HTMLElement);
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else {
                let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[ nodes.length - 1 ] as HTMLElement);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            let exactNodes: Node[] = nodeSelection.getNodeCollection(range);
            let cloneSelectNodes: Node[] = exactNodes.slice();
            this.clearInlines(
                nodeSelection.getSelectionNodes(cloneSelectNodes),
                cloneSelectNodes,
                nodeSelection.getRange(docElement),
                nodeCutter,
                endNode);
            this.reSelection(docElement, save, exactNodes);
            range = nodeSelection.getRange(docElement);
            exactNodes = nodeSelection.getNodeCollection(range);
            let cloneParentNodes: Node[] = exactNodes.slice();
            this.clearBlocks(docElement, cloneParentNodes, endNode, nodeCutter, nodeSelection);
            this.reSelection(docElement, save, exactNodes);
        }
    }

    private static reSelection(
        docElement: Document,
        save: NodeSelection,
        exactNodes: Node[] ): void {
        let selectionNodes: Node[] = save.getInsertNodes(exactNodes);
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
            let len: number = parentNodes[index1].childNodes.length;
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
                    let parentIndex: number = parentNodes.indexOf(parentNodes[index1].parentNode);
                    let nodeIndex: number = nodes.indexOf(parentNodes[index1].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    let elementIndex: number = nodes.indexOf(parentNodes[index1]);
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
        let count: number = parentNode.childNodes.length;
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
                && !( parentNodes[index1].childNodes.length === 1
                    && parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase() === 'p')) {
                    InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p') );
                }
                let childNodes: Node[] = InsertMethods.unwrap(parentNodes[index1]);
                if ( childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p') );
                    InsertMethods.unwrap(parentNodes[index1]);
                }
                for (let index2: number = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2]], nodeCutter, nodeSelection);
                    }
                }
            } else {
                InsertMethods.Wrap(parentNodes[index1] as HTMLElement, docElement.createElement('p') );
                InsertMethods.unwrap(parentNodes[index1]);
            }
        }
    }

    private static clearInlines(
        textNodes: Node[],
        nodes: Node[],
        range: Range,
        nodeCutter: NodeCutter,
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
        let nodes: Node[] = InsertMethods.unwrap( textNodes );
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