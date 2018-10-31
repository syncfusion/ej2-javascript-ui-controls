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
        let select: Selection = this.get(docElement);
        let range: Range = select && select.rangeCount > 0 ? select.getRangeAt(select.rangeCount - 1) : docElement.createRange();
        return (range.startContainer !== docElement || range.endContainer !== docElement
            || range.startOffset || range.endOffset || (range.setStart(docElement.body, 0),
                range.collapse(!0)),
            range);
    }

    public get(docElement: Document): Selection {
        return docElement.defaultView.getSelection();
    }

    public save(range: Range, docElement: Document): NodeSelection {
        range = (range) ? range.cloneRange() : this.getRange(docElement);
        return this.saveInstance(range, docElement.body as HTMLBodyElement);
    }

    public getIndex(node: Node): number {
        let index: number;
        let num: number = 0;
        node = !node.previousSibling && (node as Element).tagName === 'BR' ? node : node.previousSibling;
        if (node) {
            for (let type: number = node.nodeType; node; null) {
                index = node.nodeType;
                num++;
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

    public getNodeCollection(range: Range): Node[] {

        let startNode: Node = range.startContainer.childNodes[range.startOffset]
            || range.startContainer;
        let endNode: Node = range.endContainer.childNodes[
            (range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer;
        if (startNode === endNode && startNode.childNodes.length === 0) {
            return [startNode];
        }
        let nodeCollection: Node[] = [];
        do {
            if (nodeCollection.indexOf(startNode) === -1) {
                nodeCollection.push(startNode);
            }
            startNode = this.getNode(startNode, endNode, nodeCollection);
        }
        while (startNode);
        return nodeCollection;
    }

    public getParentNodeCollection(range: Range): Node[] {
        return this.getParentNodes(this.getNodeCollection(range), range);
    }

    public getParentNodes(nodeCollection: Node[], range: Range): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection.indexOf(nodeCollection[index].parentNode) !== -1)
                || (nodeCollection[index].nodeType === 3 &&
                    range.startContainer !== range.endContainer)) {
                nodeCollection.splice(index, 1);
                index--;
            } else if (nodeCollection[index].nodeType === 3) {
                nodeCollection[index] = nodeCollection[index].parentNode;
            }
        }
        return nodeCollection;
    }

    public getSelectionNodeCollection(range: Range): Node[] {
        return this.getSelectionNodes(this.getNodeCollection(range));
    }

    public getSelectionNodes(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || nodeCollection[index].textContent.trim() === '') {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    }

    public getInsertNodeCollection(range: Range): Node[] {
        return this.getInsertNodes(this.getNodeCollection(range));
    }

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

    public getNodeArray(node: Node, isStart: boolean, root?: Document): number[] {
        let array: number[] = [];
        ((isStart) ? (this.startNodeName = []) : (this.endNodeName = []));
        for (; node !== (root ? root : this.rootNode); null) {
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
            node = node.childNodes[num[index]];
        }
        if (node && constant >= 0) {
            range[isvalid ? 'setStart' : 'setEnd'](node, constant);
        }
        return range;
    }

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

    public setRange(docElement: Document, range: Range): void {
        let selection: Selection = this.get(docElement);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    public setSelectionText(docElement: Document, startNode: Node, endNode: Node, startIndex: number, endIndex: number
    ): void {
        let range: Range = docElement.createRange();
        range.setStart(startNode, startIndex);
        range.setEnd(endNode, endIndex);
        this.setRange(docElement, range);
    }

    public setSelectionContents(docElement: Document, element: Node): void {
        let range: Range = docElement.createRange();
        range.selectNode(element);
        this.setRange(docElement, range);
    }

    public setSelectionNode(docElement: Document, element: Node): void {
        let range: Range = docElement.createRange();
        range.selectNodeContents(element);
        this.setRange(docElement, range);
    }

    public getSelectedNodes(docElement: Document): Node[] {
        return this.getNodeCollection(this.getRange(docElement));
    }

    public Clear(docElement: Document): void {
        this.get(docElement).removeAllRanges();
    }

    public insertParentNode(docElement: Document, newNode: Node, range: Range): void {
        range.surroundContents(newNode);
        this.selectRange(docElement, range);
    }

    public setCursorPoint(docElement: Document, element: Element, point: number): void {
        let range: Range = docElement.createRange();
        let selection: Selection = docElement.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

}
