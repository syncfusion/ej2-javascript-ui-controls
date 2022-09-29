
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * `Selection` module is used to handle RTE Selections.
 */
export class NodeSelection {

    public range: Range;
    public rootNode: Node;
    public body: HTMLBodyElement;
    public html: string;
    public startContainer: number[];
    public endContainer: number[];
    public startOffset: number;
    public endOffset: number;
    public startNodeName: string[] = [];
    public endNodeName: string[] = [];

    private saveInstance(range: Range, body: HTMLBodyElement): NodeSelection {
        this.range = range.cloneRange();
        this.rootNode = this.documentFromRange(range);
        this.body = body;
        this.startContainer = this.getNodeArray(range.startContainer, true);
        this.endContainer = this.getNodeArray(range.endContainer, false);
        this.startOffset = range.startOffset;
        this.endOffset = range.endOffset;
        this.html = this.body.innerHTML;
        return this;
    }

    private documentFromRange(range: Range): Node {
        return (9 === range.startContainer.nodeType) ? range.startContainer : range.startContainer.ownerDocument;
    }

    public getRange(docElement: Document): Range {
        const select: Selection = this.get(docElement);
        const range: Range = select && select.rangeCount > 0 ? select.getRangeAt(select.rangeCount - 1) : docElement.createRange();
        return (range.startContainer !== docElement || range.endContainer !== docElement
            || range.startOffset || range.endOffset || (range.setStart(docElement.body, 0),
        range.collapse(!0)),
        range);
    }

    /**
     * get method
     *
     * @param {Document} docElement - specifies the get function
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public get(docElement: Document): Selection {
        return docElement.defaultView.getSelection();
    }

    /**
     * save method
     *
     * @param {Range} range - range value.
     * @param {Document} docElement - specifies the document.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public save(range: Range, docElement: Document): NodeSelection {
        range = (range) ? range.cloneRange() : this.getRange(docElement);
        return this.saveInstance(range, docElement.body as HTMLBodyElement);
    }

    /**
     * getIndex method
     *
     * @param {Node} node - specifies the node value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getIndex(node: Node): number {
        let index: number;
        let num: number = 0;
        node = !node.previousSibling && (node as Element).tagName === 'BR' ? node : node.previousSibling;
        if (node) {
            for (let type: number = node.nodeType; node; null) {
                index = node.nodeType;
                num++;
                //eslint-disable-next-line
                type = index;
                node = node.previousSibling;
            }
        }
        return num;
    }

    private isChildNode(nodeCollection: Node[], parentNode: Node): boolean {
        for (let index: number = 0; index < parentNode.childNodes.length; index++) {
            if (nodeCollection.indexOf(parentNode.childNodes[index]) > -1) {
                return true;
            }
        }
        return false;
    }

    private getNode(startNode: Node, endNode: Node, nodeCollection: Node[]): Node {

        if (endNode === startNode &&
            (startNode.nodeType === 3 || !startNode.firstChild || nodeCollection.indexOf(startNode.firstChild) !== -1
                || this.isChildNode(nodeCollection, startNode))) {
            return null;
        }
        if (nodeCollection.indexOf(startNode.firstChild) === -1 && startNode.firstChild && !this.isChildNode(nodeCollection, startNode)) {
            return startNode.firstChild;
        }
        if (startNode.nextSibling) {
            return startNode.nextSibling;
        }
        if (!startNode.parentNode) {
            return null;
        } else {
            return startNode.parentNode;
        }
    }

    /**
     * getNodeCollection method
     *
     * @param {Range} range -specifies the range.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getNodeCollection(range: Range): Node[] {

        let startNode: Node = range.startContainer.childNodes[range.startOffset]
            || range.startContainer;
        const endNode: Node = range.endContainer.childNodes[
            (range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer;
        if ((startNode === endNode || (startNode.nodeName === 'BR' && startNode === range.endContainer.childNodes[range.endOffset])) &&
        startNode.childNodes.length === 0) {
            return [startNode];
        }
        if (range.startOffset === range.endOffset && range.startOffset !== 0 && range.startContainer.nodeName === 'PRE') {
            return [startNode.nodeName === 'BR' || startNode.nodeName === '#text' ? startNode : startNode.childNodes[0]];
        }
        const nodeCollection: Node[] = [];
        do {
            if (nodeCollection.indexOf(startNode) === -1) {
                nodeCollection.push(startNode);
            }
            startNode = this.getNode(startNode, endNode, nodeCollection);
        }
        while (startNode);
        return nodeCollection;
    }

    /**
     * getParentNodeCollection method
     *
     * @param {Range} range - specifies the range value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getParentNodeCollection(range: Range): Node[] {
        return this.getParentNodes(this.getNodeCollection(range), range);
    }

    /**
     * getParentNodes method
     *
     * @param {Node[]} nodeCollection - specifies the collection of nodes.
     * @param {Range} range - specifies the range values.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getParentNodes(nodeCollection: Node[], range: Range): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection.indexOf(nodeCollection[index].parentNode) !== -1)
                || (nodeCollection[index].nodeType === 3 &&
                    range.startContainer !== range.endContainer &&
                    range.startContainer.parentNode !== range.endContainer.parentNode)) {
                nodeCollection.splice(index, 1);
                index--;
            } else if (nodeCollection[index].nodeType === 3) {
                nodeCollection[index] = nodeCollection[index].parentNode;
            }
        }
        return nodeCollection;
    }

    /**
     * getSelectionNodeCollection method
     *
     * @param {Range} range - specifies the range value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectionNodeCollection(range: Range): Node[] {
        return this.getSelectionNodes(this.getNodeCollection(range));
    }

    /**
     * getSelectionNodeCollection along with BR node method
     *
     * @param {Range} range - specifies the range value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectionNodeCollectionBr(range: Range): Node[] {
        return this.getSelectionNodesBr(this.getNodeCollection(range));
    }

    /**
     * getParentNodes method
     *
     * @param {Node[]} nodeCollection - specifies the collection of nodes.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectionNodes(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        const regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || (nodeCollection[index].textContent.trim() === '' ||
            (nodeCollection[index].textContent.length === 1 && nodeCollection[index].textContent.match(regEx)))) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }

    /**
     * Get selection text nodes with br method.
     *
     * @param {Node[]} nodeCollection - specifies the collection of nodes.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectionNodesBr(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        const regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeName !== 'BR' &&
            (nodeCollection[index].nodeType !== 3 || (nodeCollection[index].textContent.trim() === '' ||
            (nodeCollection[index].textContent.length === 1 && nodeCollection[index].textContent.match(regEx))))) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }

    /**
     * getInsertNodeCollection method
     *
     * @param {Range} range - specifies the range value.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInsertNodeCollection(range: Range): Node[] {
        return this.getInsertNodes(this.getNodeCollection(range));
    }

    /**
     * getInsertNodes method
     *
     * @param {Node[]} nodeCollection - specifies the collection of nodes.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getInsertNodes(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection[index].childNodes.length !== 0 &&
                nodeCollection[index].nodeType !== 3) ||
                (nodeCollection[index].nodeType === 3 &&
                    nodeCollection[index].textContent === '')) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }

    /**
     * getNodeArray method
     *
     * @param {Node} node - specifies the node content.
     * @param {boolean} isStart - specifies the boolean value.
     * @param {Document} root - specifies the root document.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getNodeArray(node: Node, isStart: boolean, root?: Document): number[] {
        const array: number[] = [];
        // eslint-disable-next-line
        ((isStart) ? (this.startNodeName = []) : (this.endNodeName = []));
        for (; node !== (root ? root : this.rootNode); null) {
            if (isNullOrUndefined(node)) {
                break;
            }
            // eslint-disable-next-line
            (isStart) ? this.startNodeName.push(node.nodeName.toLowerCase()) : this.endNodeName.push(node.nodeName.toLowerCase());
            array.push(this.getIndex(node));
            node = node.parentNode;
        }
        return array;
    }

    private setRangePoint(range: Range, isvalid: boolean, num: number[], size: number): Range {
        let node: Node = this.rootNode;
        let index: number = num.length;
        let constant: number = size;
        for (; index--; null) {
            node = node && node.childNodes[num[index]];
        }
        if (node && constant >= 0 && node.nodeName !== 'html') {
            if (node.nodeType === 3 && node.nodeValue.replace(/\u00a0/g, '&nbsp;') === '&nbsp;') {
                constant = node.textContent.length;
            }
            range[isvalid ? 'setStart' : 'setEnd'](node, constant);
        }
        return range;
    }

    /**
     * restore method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public restore(): Range {
        let range: Range = this.range.cloneRange();
        range = this.setRangePoint(range, true, this.startContainer, this.startOffset);
        range = this.setRangePoint(range, false, this.endContainer, this.endOffset);
        this.selectRange(this.rootNode as Document, range);
        return range;
    }

    public selectRange(docElement: Document, range: Range): void {
        this.setRange(docElement, range);
        this.save(range, docElement);
    }

    /**
     * setRange method
     *
     * @param {Document} docElement - specifies the document.
     * @param {Range} range - specifies the range.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setRange(docElement: Document, range: Range): void {
        const selection: Selection = this.get(docElement);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * setSelectionText method
     *
     * @param {Document} docElement - specifies the documrent
     * @param {Node} startNode - specifies the starting node.
     * @param {Node} endNode - specifies the the end node.
     * @param {number} startIndex - specifies the starting index.
     * @param {number} endIndex - specifies the end index.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setSelectionText(docElement: Document, startNode: Node, endNode: Node, startIndex: number, endIndex: number
    ): void {
        const range: Range = docElement.createRange();
        range.setStart(startNode, startIndex);
        range.setEnd(endNode, endIndex);
        this.setRange(docElement, range);
    }

    /**
     * setSelectionContents method
     *
     * @param {Document} docElement - specifies the document.
     * @param {Node} element - specifies the node.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setSelectionContents(docElement: Document, element: Node): void {
        const range: Range = docElement.createRange();
        range.selectNode(element);
        this.setRange(docElement, range);
    }

    /**
     * setSelectionNode method
     *
     * @param {Document} docElement - specifies the document.
     * @param {Node} element - specifies the node.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setSelectionNode(docElement: Document, element: Node): void {
        const range: Range = docElement.createRange();
        range.selectNodeContents(element);
        this.setRange(docElement, range);
    }

    /**
     * getSelectedNodes method
     *
     * @param {Document} docElement - specifies the document.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getSelectedNodes(docElement: Document): Node[] {
        return this.getNodeCollection(this.getRange(docElement));
    }

    /**
     * Clear method
     *
     * @param {Document} docElement - specifies the document.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public Clear(docElement: Document): void {
        this.get(docElement).removeAllRanges();
    }

    /**
     * insertParentNode method
     *
     * @param {Document} docElement - specifies the document.
     * @param {Node} newNode - specicfies the new node.
     * @param {Range} range - specifies the range.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public insertParentNode(docElement: Document, newNode: Node, range: Range): void {
        range.surroundContents(newNode);
        this.selectRange(docElement, range);
    }

    /**
     * setCursorPoint method
     *
     * @param {Document} docElement - specifies the document.
     * @param {Element} element - specifies the element.
     * @param {number} point - specifies the point.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setCursorPoint(docElement: Document, element: Element, point: number): void {
        const range: Range = docElement.createRange();
        const selection: Selection = docElement.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

}
