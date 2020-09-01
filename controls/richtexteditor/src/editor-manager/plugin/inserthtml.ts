import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU, createElement } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { updateTextNode } from './../../common/util';

/**
 * Insert a HTML Node or Text
 * @hidden
 * @deprecated
 */
export class InsertHtml {
    /**
     * Insert method
     * @hidden
     * @deprecated
     */
    public static inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    public static Insert(docElement: Document, insertNode: Node | string, editNode?: Element, isExternal?: boolean): void {
        let node: Node;
        if (typeof insertNode === 'string') {
            let divNode: HTMLElement = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = isExternal ? divNode : divNode.firstChild;
        } else {
            if (isExternal && !(!isNOU(insertNode) && !isNOU((insertNode as HTMLElement).classList) &&
            (insertNode as HTMLElement).classList.contains('pasteContent'))) {
                let divNode: HTMLElement = document.createElement('div');
                divNode.appendChild(insertNode);
                node = divNode;
            } else { node = insertNode; }
        }
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        let isCursor: boolean = range.startOffset === range.endOffset && range.startOffset === 0 &&
        range.startContainer === range.endContainer;
        let isCollapsed: boolean = range.collapsed;
        let nodes: Node[] = this.getNodeCollection(range, nodeSelection);
        let closestParentNode: Node = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (isExternal || (!isNOU(node) && !isNOU((node as HTMLElement).classList) &&
        (node as HTMLElement).classList.contains('pasteContent'))) {
            this.pasteInsertHTML(
            nodes, node, range, nodeSelection, nodeCutter, docElement, isCollapsed, closestParentNode, editNode);
            return;
        }
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1))) {
            let preNode: Node = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            let sibNode: Node = preNode.previousSibling;
            let parentNode: Node = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else {
                let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            if ((insertNode as HTMLElement).tagName === 'TABLE') {
                this.removeEmptyElements(editNode as HTMLElement);
            }
            for (let index: number = 0; index < nodes.length; index++) {
                if (nodes[index].nodeType !== 3 && nodes[index].parentNode != null) {
                    if (nodes[index].nodeName === 'IMG') { continue; }
                    nodes[index].parentNode.removeChild(nodes[index]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node as HTMLElement, sibNode as HTMLElement, true);
            } else {
                let previousNode: Node = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    let parentNode1: Node = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) { parentNode = previousNode; }
                if (parentNode.firstChild && ((parentNode as HTMLElement) !== editNode ||
                (node.nodeName === 'TABLE' && isCursor && parentNode === range.startContainer &&
                parentNode === range.endContainer))) {
                    if (parentNode.textContent.trim() === '' && (parentNode as HTMLElement) !== editNode) {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode as HTMLElement, false);
                        detach(parentNode);
                    } else {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode.firstChild as HTMLElement, false);
                    }
                } else { parentNode.appendChild(node); }
            }
            if (node.nodeName === 'IMG') { this.imageFocus(node, nodeSelection, docElement);
            } else if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            } else { nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length); }
        } else {
            range.deleteContents();
            if (isCursor && range.startContainer.textContent === '') {
                (range.startContainer as HTMLElement).innerHTML = '';
            }
            if (Browser.isIE) {
                let frag: DocumentFragment = docElement.createDocumentFragment();
                frag.appendChild(node); range.insertNode(frag);
            } else { range.insertNode(node); }
            if (node.nodeType !== 3 && node.childNodes.length > 0) {
                nodeSelection.setSelectionText(docElement, node, node, 1, 1);
            } else if (node.nodeName === 'IMG') {
                this.imageFocus(node, nodeSelection, docElement);
            } else if (node.nodeType !== 3) {
                nodeSelection.setSelectionContents(docElement, node);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, node.textContent.length, node.textContent.length);
            }
        }
    }

    private static pasteInsertHTML(
        nodes: Node[], node: Node, range: Range,
        nodeSelection: NodeSelection, nodeCutter: NodeCutter,
        docElement: Document, isCollapsed: boolean, closestParentNode: Node, editNode?: Element): void {
        let isCursor: boolean = range.startOffset === range.endOffset &&
        range.startContainer === range.endContainer;
        if (isCursor && range.startContainer === editNode && editNode.textContent === '') {
            let currentBlockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            nodeSelection.setSelectionText(docElement, currentBlockNode, currentBlockNode, 0, 0);
            range = nodeSelection.getRange(docElement);
        }
        let lasNode: Node; let sibNode: Node; let isSingleNode: boolean; let preNode: Node;
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1))) {
            preNode = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            sibNode = isNOU(preNode.previousSibling) ? preNode.parentNode.previousSibling : preNode.previousSibling;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement); isSingleNode = true;
            } else {
                lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement); isSingleNode = false;
            }
        }
        let containsBlockNode: boolean = false;
        this.removingComments(node as HTMLElement);
        let allChildNodes: NodeListOf<Node> = node.childNodes;
        for (let i: number = 0; i < allChildNodes.length; i++) {
            if (CONSTANT.BLOCK_TAGS.indexOf(allChildNodes[i].nodeName.toLocaleLowerCase()) >= 0) {
                containsBlockNode = true; break; }
        }
        let lastSelectionNode: Node;
        let fragment: DocumentFragment = document.createDocumentFragment();
        if (!containsBlockNode) {
            if (!isCursor) {
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                if (isSingleNode) { preNode.parentNode.replaceChild(fragment, preNode);
                } else {
                    range.deleteContents(); detach(lasNode);
                    !isNOU(sibNode) ? sibNode.parentNode.appendChild(fragment) : editNode.appendChild(fragment);
                }
            } else {
                let tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
                range.insertNode(tempSpan);
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                tempSpan.parentNode.replaceChild(fragment, tempSpan);
            }
        } else {
            this.insertTempNode(range, node, nodes, nodeCutter, editNode);
            let isFirstTextNode: boolean = true;
            let isPreviousInlineElem: boolean; let paraElm: HTMLElement; let previousParent: HTMLElement;
            range.deleteContents();
            while (node.firstChild) {
                if (node.firstChild.nodeName === '#text' && node.firstChild.textContent.trim() === '') {
                    detach(node.firstChild); continue;
                }
                if (node.firstChild.nodeName === '#text' && isFirstTextNode ||
                (this.inlineNode.indexOf(node.firstChild.nodeName.toLocaleLowerCase()) >= 0 && isFirstTextNode)) {
                    lastSelectionNode = node.firstChild;
                    if (isNOU((node as HTMLElement).previousElementSibling)) {
                        let firstParaElm: HTMLElement = createElement('p');
                        (node as HTMLElement).parentElement.insertBefore(firstParaElm, node);
                    }
                    (node as HTMLElement).previousElementSibling.appendChild(node.firstChild);
                } else {
                    lastSelectionNode = node.firstChild;
                    if (node.firstChild.nodeName === '#text' ||
                    (this.inlineNode.indexOf(node.firstChild.nodeName.toLocaleLowerCase()) >= 0)) {
                        if (!isPreviousInlineElem) {
                            paraElm = createElement('p'); paraElm.appendChild(node.firstChild);
                            fragment.appendChild(paraElm);
                        } else {
                            previousParent.appendChild(node.firstChild);
                            fragment.appendChild(previousParent);
                        }
                        previousParent = paraElm; isPreviousInlineElem = true;
                    } else {
                        fragment.appendChild(node.firstChild); isPreviousInlineElem = false;
                    }
                    isFirstTextNode = false;
                }
            }
            node.parentNode.replaceChild(fragment, node);
        }
        if (lastSelectionNode.nodeName === '#text') { this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        } else { this.cursorPos(lastSelectionNode, node, nodeSelection, docElement, editNode);
        }
    }
    private static placeCursorEnd(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document, editNode?: Element): void {
        lastSelectionNode = lastSelectionNode.nodeName === 'BR' ? lastSelectionNode.previousSibling : lastSelectionNode;
        while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
        lastSelectionNode.nodeName !== 'BR') { lastSelectionNode = lastSelectionNode.lastChild; }
        lastSelectionNode = isNOU(lastSelectionNode) ? node : lastSelectionNode;
        if (lastSelectionNode.nodeName === 'IMG') {
            this.imageFocus(lastSelectionNode, nodeSelection, docElement);
        } else {
            nodeSelection.setSelectionText(
            docElement, lastSelectionNode, lastSelectionNode,
            lastSelectionNode.textContent.length, lastSelectionNode.textContent.length);
        }
        this.removeEmptyElements(editNode as HTMLElement);
    }

    private static getNodeCollection (range: Range, nodeSelection: NodeSelection): Node[] {
        let nodes: Node[] = [];
        if (range.startOffset === range.endOffset && range.startContainer === range.endContainer &&
            range.startContainer.nodeName === 'TD') {
                nodes.push(range.startContainer.childNodes[range.endOffset]);
        } else {
            nodes = nodeSelection.getInsertNodeCollection(range);
        }
        return nodes;
    }
    private static insertTempNode(range: Range, node: Node, nodes: Node[], nodeCutter: NodeCutter, editNode?: Element): void {
        if (range.startContainer === editNode && !isNOU(range.startContainer.childNodes[range.endOffset - 1]) &&
            range.startContainer.childNodes[range.endOffset - 1].nodeName === 'TABLE') {
                if (isNOU(range.startContainer.childNodes[range.endOffset - 1].nextSibling)) {
                    range.startContainer.appendChild(node);
                } else {
                    range.startContainer.insertBefore(node, range.startContainer.childNodes[range.endOffset - 1].nextSibling);
                }
        } else if (range.startContainer === editNode && !isNOU(range.startContainer.childNodes[range.endOffset]) &&
        range.startContainer.childNodes[range.endOffset].nodeName === 'TABLE') {
            range.startContainer.insertBefore(node, range.startContainer.childNodes[range.endOffset]);
        } else {
            let blockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            if (blockNode.nodeName === 'TD' || blockNode.nodeName === 'TH') {
                let tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
                range.insertNode(tempSpan);
                tempSpan.parentNode.replaceChild(node, tempSpan);
            } else {
                let splitedElm: Node = nodeCutter.GetSpliceNode(range, blockNode as HTMLElement);
                splitedElm.parentNode.replaceChild(node, splitedElm);
            }
        }
    }
    private static cursorPos(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document, editNode?: Element): void {
        (lastSelectionNode as HTMLElement).classList.add('lastNode');
        editNode.innerHTML = updateTextNode(editNode.innerHTML);
        lastSelectionNode = (editNode as HTMLElement).querySelector('.lastNode');
        this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        (lastSelectionNode as HTMLElement).classList.remove('lastNode');
        if ((lastSelectionNode as HTMLElement).classList.length === 0) {
            (lastSelectionNode as HTMLElement).removeAttribute('class');
        }
    }

    private static imageFocus(node: Node, nodeSelection: NodeSelection, docElement: Document): void {
        let focusNode: Node = document.createTextNode(' ');
        node.parentNode.insertBefore(focusNode, node.nextSibling);
        nodeSelection.setSelectionText(docElement, node.nextSibling, node.nextSibling, 0, 0);
    }

    private static getImmediateBlockNode(node: Node, editNode: Node): Node {
        do {
            node = node.parentNode;
        } while (CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0);
        return node;
    }

    private static removingComments(elm: HTMLElement): void {
        let innerElement: string = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    }

    private static findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            } else {
                removableElement = element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }
    private static removeEmptyElements(element: HTMLElement): void {
        let emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR' &&
            emptyElements[i].tagName !== 'IFRAME' && emptyElements[i].tagName !== 'TD' &&
            emptyElements[i].tagName !== 'SOURCE') {
                let detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) { detach(detachableElement); }
            }
        }
    }
    private static closestEle(element: Element | Node, editNode: Element): Element {
        let el: Element = <Element>element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNOU((el.parentNode as Element).tagName) &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((el.parentNode as Element).tagName.toLocaleLowerCase()) !== -1)) {
                return el;
            }
            el = <Element>el.parentNode;
        }
        return null;
    }
}