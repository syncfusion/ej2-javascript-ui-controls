/**
 * `Selection` module is used to handle RTE Selections.
 */
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { isNullOrUndefined as isNOU, Browser, closest, detach } from '@syncfusion/ej2-base';
import { DOMNode } from './dom-node';

export class SelectionCommands {
    public static enterAction: string = 'P'
    /**
     * applyFormat method
     *
     * @param {Document} docElement - specifies the document
     * @param {string} format - specifies the string value
     * @param {Node} endNode - specifies the end node
     * @param {string} enterAction - specifies the enter key action
     * @param {string} value - specifies the string value
     * @param {string} selector - specifies the string
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public static applyFormat(
        docElement: Document, format: string, endNode: Node, enterAction: string,
        value?: string, selector?: string): void {
        this.enterAction = enterAction;
        const validFormats: string[] = ['bold', 'italic', 'underline', 'strikethrough', 'superscript',
            'subscript', 'uppercase', 'lowercase', 'fontcolor', 'fontname', 'fontsize', 'backgroundcolor'];
        if (validFormats.indexOf(format) > -1) {
            if (format === 'backgroundcolor' && value === '') {
                value = 'transparent';
            }
            let domSelection: NodeSelection = new NodeSelection();
            const domNode: DOMNode = new DOMNode((endNode as HTMLElement), docElement);
            const nodeCutter: NodeCutter = new NodeCutter();
            const isFormatted: IsFormatted = new IsFormatted();
            let range: Range = domSelection.getRange(docElement);
            const save: NodeSelection = domSelection.save(range, docElement);
            const nodes: Node[] = range.collapsed ? domSelection.getSelectionNodeCollection(range) :
                domSelection.getSelectionNodeCollectionBr(range);
            let isCollapsed: boolean = false;
            let isFormat: boolean = false;
            let isCursor: boolean = false;
            let preventRestore: boolean = false;
            const isFontStyle: boolean = (['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1);
            if (range.collapsed) {
                if (nodes.length > 0) {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, nodes[0]);
                } else if (range.startContainer.nodeType === 3 && range.startContainer.parentElement.childElementCount > 0 &&
                    range.startOffset > 0 && range.startContainer.parentElement.firstElementChild.tagName.toLowerCase() !== 'br') {
                    isCollapsed = true;
                    range = nodeCutter.GetCursorRange(docElement, range, range.startContainer);
                    nodes.push(range.startContainer);
                } else {
                    const cursorNode: Node = this.insertCursorNode(
                        docElement, domSelection, range, isFormatted, nodeCutter, format, value, endNode);
                    domSelection.endContainer = domSelection.startContainer = domSelection.getNodeArray(cursorNode, true);
                    const childNodes: NodeListOf<Node> = cursorNode.nodeName === 'BR' && cursorNode.parentNode.childNodes;
                    if (!isNOU(childNodes) && childNodes.length === 1 && childNodes[0].nodeName === 'BR' && nodes.length === 0) {
                        domSelection.setSelectionText(docElement, range.startContainer, range.endContainer, 0, 0);
                        preventRestore = true;
                    } else {
                        domSelection.endOffset = domSelection.startOffset = 1;
                    }
                    if (cursorNode.nodeName === 'BR' && cursorNode.parentNode.textContent.length === 0) {
                        preventRestore = true;
                    }
                }
            }
            isCursor = range.collapsed;
            let isSubSup: boolean = false;
            for (let index: number = 0; index < nodes.length; index++) {
                let formatNode: Node = isFormatted.getFormattedNode(nodes[index], format, endNode);
                if (formatNode === null) {
                    if (format === 'subscript') {
                        formatNode = isFormatted.getFormattedNode(nodes[index], 'superscript', endNode);
                        isSubSup = formatNode === null ? false : true;
                    } else if (format === 'superscript') {
                        formatNode = isFormatted.getFormattedNode(nodes[index], 'subscript', endNode);
                        isSubSup = formatNode === null ? false : true;
                    }
                }
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
                        domSelection,
                        endNode,
                        domNode);
                } else {
                    nodes[index] = this.insertFormat(
                        docElement,
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
                domSelection = this.applySelection(nodes, domSelection, nodeCutter, index, isCollapsed);
            }
            if (isIDevice()) {
                setEditFrameFocus(endNode as Element, selector);
            }
            if (!preventRestore) { save.restore(); }
            if (isSubSup) {
                this.applyFormat(docElement, format, endNode, enterAction);
            }
        }
    }

    private static insertCursorNode(
        docElement: Document,
        domSelection: NodeSelection,
        range: Range,
        isFormatted: IsFormatted,
        nodeCutter: NodeCutter,
        format: string,
        value: string,
        endNode: Node): Node {
        const cursorNodes: Node[] = domSelection.getNodeCollection(range);
        const cursorFormat: Node = (cursorNodes.length > 0) ?
            (cursorNodes.length > 1 && range.startContainer === range.endContainer) ?
                this.getCursorFormat(isFormatted, cursorNodes, format, endNode) :
                isFormatted.getFormattedNode(cursorNodes[0], format, endNode) : null;
        let cursorNode: Node = null;
        if (cursorFormat) {
            cursorNode = cursorNodes[0];
            if (cursorFormat.firstChild.textContent.charCodeAt(0) === 8203) {
                let isCursorEqual: boolean = false;
                const regEx: RegExp = new RegExp(String.fromCharCode(8203), 'g');
                let emptySpaceNode: Node;
                if (cursorFormat.firstChild === cursorNode) {
                    cursorNode.textContent = cursorNode.textContent.replace(regEx, '');
                    emptySpaceNode = cursorNode;
                    isCursorEqual = true;
                } else {
                    cursorFormat.firstChild.textContent = cursorFormat.firstChild.textContent.replace(regEx, '');
                    emptySpaceNode = cursorFormat.firstChild;
                }
                let pointer: number;
                if (emptySpaceNode.textContent.length === 0) {
                    if (!isNOU(emptySpaceNode.previousSibling)) {
                        cursorNode = emptySpaceNode.previousSibling;
                        pointer = emptySpaceNode.textContent.length - 1;
                        domSelection.setCursorPoint(docElement, emptySpaceNode as Element, pointer);
                    } else if (!isNOU(emptySpaceNode.parentElement) && emptySpaceNode.parentElement.textContent.length === 0) {
                        let brElem: HTMLElement = document.createElement('BR');
                        emptySpaceNode.parentElement.appendChild(brElem);
                        detach(emptySpaceNode);
                        cursorNode = brElem;
                        domSelection.setCursorPoint(docElement, cursorNode.parentElement, 0);
                    }
                }
            }
            if ((['fontcolor', 'fontname', 'fontsize', 'backgroundcolor'].indexOf(format) > -1)) {
                if (format === 'fontcolor') {
                    (cursorFormat as HTMLElement).style.color = value;
                } else if (format === 'fontname') {
                    (cursorFormat as HTMLElement).style.fontFamily = value;
                } else if (format === 'fontsize') {
                    (cursorFormat as HTMLElement).style.fontSize = value;
                } else {
                    (cursorFormat as HTMLElement).style.backgroundColor = value;
                }
                cursorNode = cursorFormat;
            } else {
                InsertMethods.unwrap(cursorFormat);
            }
        } else {
            if (cursorNodes.length > 1 && range.startOffset > 0 && ((cursorNodes[0] as HTMLElement).firstElementChild &&
                (cursorNodes[0] as HTMLElement).firstElementChild.tagName.toLowerCase() === 'br')) {
                (cursorNodes[0] as HTMLElement).innerHTML = '';
            }
            if (cursorNodes.length === 1 && range.startOffset === 0 && (cursorNodes[0].nodeName === 'BR' ||
                cursorNodes[0].nextSibling.nodeName === 'BR')) {
                detach(cursorNodes[0].nodeName === '#text' ? cursorNodes[0].nextSibling : cursorNodes[0]);
            }
            cursorNode = this.getInsertNode(docElement, range, format, value).firstChild;
        }
        return cursorNode;
    }

    private static getCursorFormat(isFormatted: IsFormatted, cursorNodes: Node[], format: string, endNode: Node): Node {
        let currentNode: Node;
        for (let index: number = 0; index < cursorNodes.length; index++) {
            currentNode = (cursorNodes[index] as HTMLElement).lastElementChild ?
                (cursorNodes[index] as HTMLElement).lastElementChild : cursorNodes[index];
        }
        return isFormatted.getFormattedNode(currentNode, format, endNode);
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
        domSelection: NodeSelection,
        endNode: Node,
        domNode: DOMNode): Node {
        let splitNode: HTMLElement = null;
        if (!(range.startContainer === range.endContainer && range.startOffset === 0
            && range.endOffset === (range.startContainer as Text).length)) {
            const nodeIndex: number[] = [];
            let cloneNode: Node = nodes[index];
            do {
                nodeIndex.push(domSelection.getIndex(cloneNode));
                cloneNode = cloneNode.parentNode;
            } while (cloneNode && (cloneNode !== formatNode));
            if (nodes[index].nodeName !== 'BR') {
                cloneNode = splitNode = (isCursor && (formatNode.textContent.length - 1) === range.startOffset) ?
                    nodeCutter.SplitNode(range, formatNode as HTMLElement, true) as HTMLElement
                    : nodeCutter.GetSpliceNode(range, formatNode as HTMLElement) as HTMLElement;
            }
            if (!isCursor) {
                while (cloneNode && cloneNode.childNodes.length > 0 && ((nodeIndex.length - 1) >= 0)
                    && (cloneNode.childNodes.length > nodeIndex[nodeIndex.length - 1])) {
                    cloneNode = cloneNode.childNodes[nodeIndex[nodeIndex.length - 1]];
                    nodeIndex.pop();
                }
                if (nodes[index].nodeName !== 'BR') {
                    if (cloneNode.nodeType === 3 && !(isCursor && cloneNode.nodeValue === '')) {
                        nodes[index] = cloneNode;
                    } else {
                        const divNode: HTMLDivElement = document.createElement('div');
                        divNode.innerHTML = '&#8203;';
                        if (cloneNode.nodeType !== 3) {
                            cloneNode.insertBefore(divNode.firstChild, cloneNode.firstChild);
                            nodes[index] = cloneNode.firstChild;
                        } else {
                            cloneNode.parentNode.insertBefore(divNode.firstChild, cloneNode);
                            nodes[index] = cloneNode.previousSibling;
                            cloneNode.parentNode.removeChild(cloneNode);
                        }
                    }
                }
            } else {
                let lastNode: Node = splitNode;
                for (; lastNode.firstChild !== null && lastNode.firstChild.nodeType !== 3; null) {
                    lastNode = lastNode.firstChild;
                }
                (lastNode as HTMLElement).innerHTML = '&#8203;';
                nodes[index] = lastNode.firstChild;
            }
        }
        let fontStyle: string;
        if (format === 'backgroundcolor') {
            fontStyle = (formatNode as HTMLElement).style.fontSize;
        }
        let bgStyle: string;
        if (format === 'fontsize') {
            const bg: Element = closest(nodes[index].parentElement, 'span[style*=' + 'background-color' + ']');
            if (!isNOU(bg)) {
                bgStyle = (bg as HTMLElement).style.backgroundColor;
            }
        }
        const formatNodeStyles: string = (formatNode as HTMLElement).getAttribute('style');
        const formatNodeTagName: string = (formatNode as HTMLElement).tagName;
        const child: Node[] = InsertMethods.unwrap(formatNode);
        if (child[0] && !isFontStyle) {
            let nodeTraverse: Node = child[index] ? child[index] : child[0];
            const textNode: Node = nodeTraverse;
            for ( ; nodeTraverse && nodeTraverse.parentElement && nodeTraverse.parentElement !== endNode;
                // eslint-disable-next-line
                nodeTraverse = nodeTraverse ) {
                if (nodeTraverse.parentElement && nodeTraverse.parentElement.tagName.toLocaleLowerCase()
                    === (formatNode as HTMLElement).tagName.toLocaleLowerCase() &&
                    (nodeTraverse.parentElement.childElementCount > 1 || range.startOffset > 1)) {
                    if (textNode.parentElement && textNode.parentElement.tagName.toLocaleLowerCase()
                        === (formatNode as HTMLElement).tagName.toLocaleLowerCase()) {
                        if ((range.startOffset === range.endOffset) && textNode.nodeType !== 1 &&
                        !isNOU(textNode.textContent) && textNode.parentElement.childElementCount > 1) {
                            range.setStart(textNode, 0);
                            range.setEnd(textNode, textNode.textContent.length);
                            nodeCutter.SplitNode(range, textNode.parentElement, false);
                        }
                    }
                    if (nodeTraverse.parentElement.tagName.toLocaleLowerCase() === 'span') {
                        if ((formatNode as HTMLElement).style.textDecoration === 'underline' &&
                            nodeTraverse.parentElement.style.textDecoration !== 'underline') {
                            nodeTraverse = nodeTraverse.parentElement;
                            continue;
                        }
                    }
                    InsertMethods.unwrap(nodeTraverse.parentElement);
                    nodeTraverse = !isNOU(nodeTraverse.parentElement) && !domNode.isBlockNode(nodeTraverse.parentElement) ? textNode :
                        nodeTraverse.parentElement;
                } else {
                    nodeTraverse = nodeTraverse.parentElement;
                }
            }
        }
        if (child.length > 0 && isFontStyle) {
            for (let num: number = 0; num < child.length; num++) {
                if (child[num].nodeType !== 3 || (child[num].textContent && child[num].textContent.trim().length > 0)) {
                    child[num] = InsertMethods.Wrap(
                        child[num] as HTMLElement,
                        this.GetFormatNode(format, value, formatNodeTagName, formatNodeStyles));
                    if (num === 0) {
                        range.setStartBefore(child[num]);
                    }
                    else if (num === child.length - 1) {
                        range.setEndAfter(child[num]);
                    }
                }
            }
            const currentNodeElem: HTMLElement = nodes[index].parentElement;
            if (!isNOU(fontStyle) && fontStyle !== '') {
                currentNodeElem.style.fontSize = fontStyle;
            }
            if (!isNOU(bgStyle) && bgStyle !== '') {
                currentNodeElem.style.backgroundColor = bgStyle;
            }
            if ((format === 'backgroundcolor' && !isNOU(fontStyle) && fontStyle !== '') &&
            currentNodeElem.parentElement.innerHTML === currentNodeElem.outerHTML) {
                const curParentElem: HTMLElement = currentNodeElem.parentElement;
                curParentElem.parentElement.insertBefore(currentNodeElem, curParentElem);
                detach(curParentElem);
            }
            if (format === 'fontsize' || format === 'fontcolor') {
                let liElement: HTMLElement = nodes[index].parentElement;
                let parentElement: HTMLElement = nodes[index].parentElement;
                while (!isNOU(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                    parentElement = parentElement.parentElement;
                    liElement = parentElement;
                }
                if (!isNOU(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                    liElement.textContent.trim() === nodes[index].textContent.trim()) {
                    if (format === 'fontsize') {
                        liElement.style.fontSize = value;
                    } else {
                        liElement.style.color = value;
                        liElement.style.textDecoration = 'inherit';
                    }
                }
            }
        }
        return nodes[index];
    }

    private static insertFormat(
        docElement: Document,
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
                if (nodes[index].nodeName !== 'BR') {
                    nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index] as HTMLElement);
                    nodes[index].textContent = nodeCutter.TrimLineBreak((nodes[index] as Text).textContent);
                }
                if (format === 'uppercase' || format === 'lowercase') {
                    nodes[index].textContent = (format === 'uppercase') ? nodes[index].textContent.toLocaleUpperCase()
                        : nodes[index].textContent.toLocaleLowerCase();
                } else if (!(isFontStyle === true && value === '')) {
                    const element: HTMLElement = this.GetFormatNode(format, value);
                    if (format === 'fontsize' || format === 'fontcolor') {
                        let liElement: HTMLElement = nodes[index].parentElement;
                        let parentElement: HTMLElement = nodes[index].parentElement;
                        while (!isNOU(parentElement) && parentElement.tagName.toLowerCase() !== 'li') {
                            parentElement = parentElement.parentElement;
                            liElement = parentElement;
                        }
                        if (!isNOU(liElement) && liElement.tagName.toLowerCase() === 'li' &&
                            liElement.textContent.trim() === nodes[index].textContent.trim()) {
                            if (format === 'fontsize') {
                                liElement.style.fontSize = value;
                            } else {
                                liElement.style.color = value;
                                liElement.style.textDecoration = 'inherit';
                            }
                        }
                        nodes[index] = this.applyStyles(nodes, index, element);
                        if (format === 'fontsize') {
                            const bg: Element = closest(nodes[index].parentElement, 'span[style*=' + 'background-color' + ']');
                            if (!isNOU(bg)) {
                                nodes[index].parentElement.style.backgroundColor = (bg as HTMLElement).style.backgroundColor;
                            }
                        }
                    } else {
                        nodes[index] = this.applyStyles(nodes, index, element);
                    }
                }
            } else {
                nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index] as HTMLElement);
            }
        } else {
            if (format !== 'uppercase' && format !== 'lowercase') {
                const element: HTMLElement = this.getInsertNode(docElement, range, format, value);
                nodes[index] = element.firstChild;
                nodeCutter.position = 1;
            } else {
                nodeCutter.position = range.startOffset;
            }
        }
        return nodes[index];
    }
    private static applyStyles(nodes: Node[], index: number, element: HTMLElement): Node {
        if (!(nodes[index].nodeName === 'BR' && this.enterAction === 'BR')) {
            nodes[index] = (index === (nodes.length - 1)) || nodes[index].nodeName === 'BR' ?
                InsertMethods.Wrap(nodes[index] as HTMLElement, element)
                : InsertMethods.WrapBefore(nodes[index] as Text, element, true);
            nodes[index] = this.getChildNode(nodes[index], element);
        }
        return nodes[index];
    }

    private static getInsertNode(docElement: Document, range: Range, format: string, value: string): HTMLElement {
        const element: HTMLElement = this.GetFormatNode(format, value);
        element.innerHTML = '&#8203;';
        if (Browser.isIE) {
            const frag: DocumentFragment = docElement.createDocumentFragment();
            frag.appendChild(element);
            range.insertNode(frag);
        } else {
            range.insertNode(element);
        }
        return element;
    }

    private static getChildNode(node: Node, element: HTMLElement): Node {
        if (node === undefined || node === null) {
            element.innerHTML = '&#8203;';
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

    private static GetFormatNode(format: string, value?: string, tagName?: string, styles?: string): HTMLElement {
        let node: HTMLElement;
        switch (format) {
        case 'bold':
            return document.createElement('strong');
        case 'italic':
            return document.createElement('em');
        case 'underline':
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.textDecoration = 'underline';
            return node;
        case 'strikethrough':
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.textDecoration = 'line-through';
            return node;
        case 'superscript':
            return document.createElement('sup');
        case 'subscript':
            return document.createElement('sub');
        case 'fontcolor':
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.color = value;
            node.style.textDecoration = 'inherit';
            return node;
        case 'fontname':
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.fontFamily = value;
            return node;
        case 'fontsize':
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.fontSize = value;
            return node;
        default:
            node = document.createElement('span');
            this.updateStyles(node, tagName, styles);
            node.style.backgroundColor = value;
            return node;
        }
    }

    private static updateStyles(ele: HTMLElement, tag: string, styles: string): void {
        if (styles !== null && tag === 'SPAN') {
            ele.setAttribute('style', styles);
        }
    }
}
