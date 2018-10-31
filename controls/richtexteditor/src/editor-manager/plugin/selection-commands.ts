/**
 * `Selection` module is used to handle RTE Selections.
 */
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';

export class SelectionCommands {

    public static applyFormat(docElement: Document, format: string, endNode: Node, value?: string): void {
        let validFormats: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase', 'fontcolor', 'fontname', 'fontsize', 'backgroundcolor'];
        if (validFormats.indexOf(format) > -1) {
            let domSelection: NodeSelection = new NodeSelection();
            let nodeCutter: NodeCutter = new NodeCutter();
            let isFormatted: IsFormatted = new IsFormatted();
            let range: Range = domSelection.getRange(docElement);
            let save: NodeSelection = domSelection.save(range, docElement);
            let nodes: Node[] = domSelection.getSelectionNodeCollection(range);
            let isCollapsed: boolean = false;
            let isFormat: boolean = false;
            let isCursor: boolean = false;
            let isFontStyle: boolean = (['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1);
            if (range.collapsed) {
                if (nodes.length > 0) {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
                } else if (range.startContainer.nodeName.toLowerCase() !== 'td') {
                    let cursorNode: Node = this.insertCursorNode(domSelection, range, isFormatted, nodeCutter, format, value, endNode);
                    domSelection.endContainer = domSelection.startContainer = domSelection.getNodeArray(
                        cursorNode,
                        true);
                    domSelection.endOffset = domSelection.startOffset = 1;
                }
            }
            isCursor = range.collapsed;
            for (let index: number = 0; index < nodes.length; index++) {
                let formatNode: Node = isFormatted.getFormattedNode(nodes[index], format, endNode);
                if (index === 0 && formatNode === null) {
                    isFormat = true;
                }
                if (formatNode !== null && (!isFormat || isFontStyle)) {
                    nodes[index] = this.removeFormat(
                        nodes,
                        index,
                        formatNode,
                        isCursor,
                        isFormat,
                        isFontStyle,
                        range,
                        nodeCutter,
                        format,
                        value,
                        domSelection);
                } else {
                    nodes[index] = this.insertFormat(
                        nodes,
                        index,
                        formatNode,
                        isCursor,
                        isFormat,
                        isFontStyle,
                        range,
                        nodeCutter,
                        format,
                        value);
                }
                domSelection = this.applySelection(nodes, domSelection, nodeCutter, index, isCollapsed, );
            }
            save.restore();
        }
    }

    private static insertCursorNode(
        domSelection: NodeSelection,
        range: Range,
        isFormatted: IsFormatted,
        nodeCutter: NodeCutter,
        format: string,
        value: string,
        endNode: Node): Node {
        let cursorNodes: Node[] = domSelection.getNodeCollection(range);
        let cursorFormat: Node = (cursorNodes.length > 0) ? isFormatted.getFormattedNode(cursorNodes[0], format, endNode) : null;
        let cursorNode: Node = null;
        if (cursorFormat) {
            cursorNode = cursorNodes[0];
            InsertMethods.unwrap(cursorFormat);
        } else {
            cursorNode = this.getInsertNode(range, format, value).firstChild;
        }
        return cursorNode;
    }

    private static removeFormat(
        nodes: Node[],
        index: number,
        formatNode: Node,
        isCursor: boolean,
        isFormat: boolean,
        isFontStyle: boolean,
        range: Range,
        nodeCutter: NodeCutter,
        format: string,
        value: string,
        domSelection: NodeSelection): Node {
        let splitNode: HTMLElement = null;
        if (!(range.startContainer === range.endContainer && range.startOffset === 0
            && range.endOffset === (range.startContainer as Text).length)) {
            let nodeIndex: number[] = [];
            let cloneNode: Node = nodes[index];
            do {
                nodeIndex.push(domSelection.getIndex(cloneNode));
                cloneNode = cloneNode.parentNode;
            } while (cloneNode && (cloneNode !== formatNode));
            cloneNode = splitNode = nodeCutter.GetSpliceNode(range, formatNode as HTMLElement) as HTMLElement;
            if (!isCursor) {
                while (cloneNode && cloneNode.childNodes.length > 0 && ((nodeIndex.length - 1) >= 0)
                    && (cloneNode.childNodes.length > nodeIndex[nodeIndex.length - 1])) {
                    cloneNode = cloneNode.childNodes[nodeIndex[nodeIndex.length - 1]];
                    nodeIndex.pop();
                }
                if (cloneNode.nodeType === 3 && !(isCursor && cloneNode.nodeValue === '')) {
                    nodes[index] = cloneNode;
                } else {
                    let divNode: HTMLDivElement = document.createElement('div');
                    divNode.innerHTML = '&#65279;&#65279;';
                    if (cloneNode.nodeType !== 3) {
                        cloneNode.insertBefore(divNode.firstChild, cloneNode.firstChild);
                        nodes[index] = cloneNode.firstChild;
                    } else {
                        cloneNode.parentNode.insertBefore(divNode.firstChild, cloneNode);
                        nodes[index] = cloneNode.previousSibling;
                        cloneNode.parentNode.removeChild(cloneNode);
                    }
                }
            } else {
                let lastNode: Node = splitNode;
                for (; lastNode.firstChild !== null && lastNode.firstChild.nodeType !== 3; null) {
                    lastNode = lastNode.firstChild;
                }
                (lastNode as HTMLElement).innerHTML = '&#65279;&#65279;';
                nodes[index] = lastNode.firstChild;
            }
        }
        let child: Node[] = InsertMethods.unwrap(formatNode);
        if (child.length > 0 && isFontStyle) {
            for (let num: number = 0; num < child.length; num++) {
                child[num] = InsertMethods.Wrap(child[num] as HTMLElement, this.GetFormatNode(format, value));
            }
        }
        return nodes[index];
    }

    private static insertFormat(
        nodes: Node[],
        index: number,
        formatNode: Node,
        isCursor: boolean,
        isFormat: boolean,
        isFontStyle: boolean,
        range: Range,
        nodeCutter: NodeCutter,
        format: string,
        value: string): Node {
        if (!isCursor) {
            if ((formatNode === null && isFormat) || isFontStyle) {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index] as HTMLElement);
                nodes[index].textContent = nodeCutter.TrimLineBreak((nodes[index] as Text).textContent);
                if (format === 'uppercase' || format === 'lowercase') {
                    nodes[index].textContent = (format === 'uppercase') ? nodes[index].textContent.toLocaleUpperCase()
                        : nodes[index].textContent.toLocaleLowerCase();
                } else if (!(isFontStyle === true && value === '')) {
                    let element: HTMLElement = this.GetFormatNode(format, value);
                    nodes[index] = (index === (nodes.length - 1)) ? InsertMethods.Wrap(nodes[index] as HTMLElement, element)
                        : InsertMethods.WrapBefore(nodes[index] as Text, element, true);
                    nodes[index] = this.getChildNode(nodes[index], element);
                }
            } else {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index] as HTMLElement);
            }
        } else {
            if (format !== 'uppercase' && format !== 'lowercase') {
                let element: HTMLElement = this.getInsertNode(range, format, value);
                nodes[index] = element.firstChild;
                nodeCutter.position = 1;
            } else {
                nodeCutter.position = range.startOffset;
            }
        }
        return nodes[index];
    }

    private static getInsertNode(range: Range, format: string, value: string): HTMLElement {
        let element: HTMLElement = this.GetFormatNode(format, value);
        element.innerHTML = '&#65279;&#65279;';
        range.insertNode(element);
        return element;
    }

    private static getChildNode(node: Node, element: HTMLElement): Node {
        if (node === undefined || node === null) {
            element.innerHTML = '&#65279;';
            node = element.firstChild;
        }
        return node;
    }

    private static applySelection(
        nodes: Node[],
        domSelection: NodeSelection,
        nodeCutter: NodeCutter,
        index: number,
        isCollapsed: boolean): NodeSelection {
        if (nodes.length === 1 && !isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(
                nodes[index],
                true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = 0;
            domSelection.endOffset = nodes[index].textContent.length;
        } else if (nodes.length === 1 && isCollapsed) {
            domSelection.startContainer = domSelection.getNodeArray(
                nodes[index],
                true);
            domSelection.endContainer = domSelection.startContainer;
            domSelection.startOffset = nodeCutter.position;
            domSelection.endOffset = nodeCutter.position;
        } else if (index === 0) {
            domSelection.startContainer = domSelection.getNodeArray(
                nodes[index],
                true);
            domSelection.startOffset = 0;
        } else if (index === nodes.length - 1) {
            domSelection.endContainer = domSelection.getNodeArray(
                nodes[index],
                false);
            domSelection.endOffset = nodes[index].textContent.length;
        }
        return domSelection;
    }

    private static GetFormatNode(format: string, value?: string): HTMLElement {
        let node: HTMLElement;
        switch (format) {
            case 'bold':
                return document.createElement('strong');
            case 'italic':
                return document.createElement('em');
            case 'underline':
                node = document.createElement('span');
                node.style.textDecoration = 'underline';
                return node;
            case 'strikethrough':
                node = document.createElement('span');
                node.style.textDecoration = 'line-through';
                return node;
            case 'superscript':
                return document.createElement('sup');
            case 'subscript':
                return document.createElement('sub');
            case 'fontcolor':
                node = document.createElement('span');
                node.style.color = value;
                return node;
            case 'fontname':
                node = document.createElement('span');
                node.style.fontFamily = value;
                return node;
            case 'fontsize':
                node = document.createElement('span');
                node.style.fontSize = value;
                return node;
            default:
                node = document.createElement('span');
                node.style.backgroundColor = value;
                return node;
        }
    }

}