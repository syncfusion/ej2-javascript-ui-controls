import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU, createElement, closest } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { updateTextNode } from './../../common/util';

/**
 * Insert a HTML Node or Text
 *
 * @hidden
 * @deprecated
 */
export class InsertHtml {
    /**
     * Insert method
     *
     * @hidden
     * @deprecated
     */
    public static inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    public static contentsDeleted: boolean = false;
    public static Insert(
        docElement: Document, insertNode: Node | string,
        editNode?: Element, isExternal?: boolean, enterAction?: string): void {
        let node: Node;
        if (typeof insertNode === 'string') {
            const divNode: HTMLElement = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = isExternal ? divNode : divNode.firstChild;
        } else {
            if (isExternal && !(!isNOU(insertNode) && !isNOU((insertNode as HTMLElement).classList) &&
            (insertNode as HTMLElement).classList.contains('pasteContent'))) {
                const divNode: HTMLElement = document.createElement('div');
                divNode.appendChild(insertNode);
                node = divNode;
            } else {
                node = insertNode;
            }
        }
        const nodeSelection: NodeSelection = new NodeSelection();
        const nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        if (range.startContainer === editNode && range.startContainer === range.endContainer && range.startOffset === 0 &&
            range.startOffset === range.endOffset && editNode.textContent.length === 0 &&
            (editNode.children[0].tagName === 'P' || (editNode.children[0].tagName === 'BR'))) {
            nodeSelection.setSelectionText(docElement, (range.startContainer as HTMLElement).children[0],
                                           (range.startContainer as HTMLElement).children[0], 0, 0);
            range = nodeSelection.getRange(docElement);
        }
        if (range.startContainer === editNode && range.startContainer === range.endContainer && range.startOffset === 0 &&
            range.startOffset === range.endOffset && editNode.textContent.trim().length > 0) {
            const focusNode: Node | null = this.findFirstTextNode(range.startContainer);
            if (!isNOU(focusNode)) {
                nodeSelection.setSelectionText(docElement, focusNode, focusNode, 0, 0);
                range = nodeSelection.getRange(docElement);
            }
        }
        if (range.startContainer.nodeName === 'BR' && range.startOffset === 0 && range.startOffset === range.endOffset &&
        range.startContainer === range.endContainer) {
            const currentIndex: number = Array.prototype.slice.call(range.startContainer.parentElement.childNodes).indexOf(
                range.startContainer as HTMLElement);
            nodeSelection.setSelectionText(docElement, (range.startContainer as HTMLElement).parentElement, (
                range.startContainer as HTMLElement).parentElement,
                                           currentIndex, currentIndex);
            range = nodeSelection.getRange(docElement);
        }
        const isCursor: boolean = range.startOffset === range.endOffset && range.startOffset === 0 &&
        range.startContainer === range.endContainer;
        const isCollapsed: boolean = range.collapsed;
        const nodes: Node[] = this.getNodeCollection(range, nodeSelection, node);
        const closestParentNode: Node = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (isExternal || (!isNOU(node) && !isNOU((node as HTMLElement).classList) &&
        (node as HTMLElement).classList.contains('pasteContent'))) {
            this.pasteInsertHTML(
                nodes, node, range, nodeSelection, nodeCutter, docElement, isCollapsed, closestParentNode, editNode, enterAction);
            return;
        }
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1))) {
            const preNode: Node = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            const sibNode: Node = preNode.previousSibling;
            let parentNode: Node = preNode.parentNode;
            if (nodes.length === 1 || (node.nodeName.toLowerCase() === 'table' && (preNode as HTMLElement).childElementCount === 0)) {
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
                if (nodes[index as number].nodeType !== 3 && nodes[index as number].parentNode != null) {
                    if (nodes[index as number].nodeName === 'IMG') {
                        continue;
                    }
                    nodes[index as number].parentNode.removeChild(nodes[index as number]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node as HTMLElement, sibNode as HTMLElement, true);
            } else {
                let previousNode: Node = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    const parentNode1: Node = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) {
                    parentNode = previousNode;
                }
                if (parentNode.firstChild && ((parentNode as HTMLElement) !== editNode ||
                (node.nodeName === 'TABLE' && isCursor && parentNode === range.startContainer &&
                parentNode === range.endContainer))) {
                    if (parentNode.textContent.trim() === '' && (parentNode as HTMLElement) !== editNode) {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode as HTMLElement, false);
                        detach(parentNode);
                    } else {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode.firstChild as HTMLElement, false);
                    }
                } else {
                    parentNode.appendChild(node);
                }
            }
            if (node.nodeName === 'IMG') {
                this.imageFocus(node, nodeSelection, docElement);
            } else if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length);
            }
        } else {
            range.deleteContents();
            if (isCursor && range.startContainer.textContent === '' && range.startContainer.nodeName !== 'BR') {
                (range.startContainer as HTMLElement).innerHTML = '';
            }
            if (Browser.isIE) {
                const frag: DocumentFragment = docElement.createDocumentFragment();
                frag.appendChild(node); range.insertNode(frag);
            } else if (range.startContainer.nodeType === 1 && range.startContainer.nodeName.toLowerCase() === 'hr'
            && range.endContainer.nodeName.toLowerCase() === 'hr') {
                const paraElem: Element = (range.startContainer as  HTMLElement).nextElementSibling;
                if (paraElem) {
                    if (paraElem.querySelector('br')) {
                        detach(paraElem.querySelector('br'));
                    }
                    paraElem.appendChild(node);
                }
            } else {
                if (range.startContainer.nodeName === 'BR') {
                    range.startContainer.parentElement.insertBefore(node,  range.startContainer);
                } else {
                    range.insertNode(node);
                }
            }
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

    private static findFirstTextNode(node: Node | null): Node | null {
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        for (let i: number = 0; i < node.childNodes.length; i++) {
            const textNode: Node = this.findFirstTextNode(node.childNodes[i as number]);
            if (!isNOU(textNode)) {
                return textNode;
            }
        }
        return null;
    }

    private static pasteInsertHTML(
        nodes: Node[], node: Node, range: Range,
        nodeSelection: NodeSelection, nodeCutter: NodeCutter,
        docElement: Document, isCollapsed: boolean, closestParentNode: Node, editNode?: Element, enterAction?: string): void {
        const isCursor: boolean = range.startOffset === range.endOffset &&
        range.startContainer === range.endContainer;
        if (isCursor && range.startContainer === editNode && editNode.textContent === '') {
            const currentBlockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
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
        const allChildNodes: NodeListOf<Node> = node.childNodes;
        for (let i: number = 0; i < allChildNodes.length; i++) {
            if (CONSTANT.BLOCK_TAGS.indexOf(allChildNodes[i as number].nodeName.toLocaleLowerCase()) >= 0) {
                containsBlockNode = true; break;
            }
        }
        let lastSelectionNode: Node;
        const fragment: DocumentFragment = document.createDocumentFragment();
        if (!containsBlockNode) {
            if (!isCursor) {
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                if (isSingleNode) {
                    preNode.parentNode.replaceChild(fragment, preNode);
                } else {
                    range.deleteContents();
                    if (!isNOU(lasNode)) {
                        detach(lasNode);
                    }
                    // eslint-disable-next-line
                    !isNOU(sibNode) ? sibNode.parentNode.appendChild(fragment) : editNode.appendChild(fragment);
                }
            } else {
                const tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
                const nearestAnchor: Node = closest(range.startContainer.parentElement, 'a');
                if (range.startContainer.nodeType === 3 && nearestAnchor && closest(nearestAnchor, 'span')) {
                    const immediateBlockNode: Node = this.getImmediateBlockNode(range.startContainer, editNode);
                    if ((immediateBlockNode as HTMLElement).querySelectorAll('br').length > 0) {
                        detach((immediateBlockNode as HTMLElement).querySelector('br'));
                    }
                    const rangeElement: Node = closest(nearestAnchor, 'span');
                    rangeElement.appendChild(tempSpan);
                } else {
                    range.insertNode(tempSpan);
                }
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                tempSpan.parentNode.replaceChild(fragment, tempSpan);
            }
        } else {
            let parentElem: Node = range.startContainer;
            while (!isNOU(parentElem) && parentElem.nodeName !== 'PRE' && parentElem !== editNode ) {
                parentElem = parentElem.parentElement as Node;
            }
            if (!isNOU(node) && !isNOU(parentElem) && parentElem.nodeName === 'PRE') {
                range.insertNode(node);
                lastSelectionNode = node.lastChild;
            } else {
                this.insertTempNode(range, node, nodes, nodeCutter, editNode);
                let isFirstTextNode: boolean = true;
                let isPreviousInlineElem: boolean; let paraElm: HTMLElement; let previousParent: HTMLElement;
                if (!this.contentsDeleted) {
                    range.deleteContents();
                }
                while (node.firstChild) {
                    if (node.firstChild.nodeName === '#text' && node.firstChild.textContent.trim() === '') {
                        detach(node.firstChild); continue;
                    }
                    if (node.firstChild.nodeName === '#text' && isFirstTextNode ||
                    (this.inlineNode.indexOf(node.firstChild.nodeName.toLocaleLowerCase()) >= 0 && isFirstTextNode)) {
                        lastSelectionNode = node.firstChild;
                        if (isNOU((node as HTMLElement).previousElementSibling)) {
                            const firstParaElm: HTMLElement = createElement('p');
                            (node as HTMLElement).parentElement.insertBefore(firstParaElm, node);
                        }
                        if ((node as HTMLElement).previousElementSibling.nodeName === 'BR') {
                            (node as HTMLElement).parentElement.insertBefore(node.firstChild, node);
                        } else {
                            (node as HTMLElement).previousElementSibling.appendChild(node.firstChild);
                        }
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
        }
        if (lastSelectionNode.nodeName === '#text') {
            this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        } else {
            this.cursorPos(lastSelectionNode, node, nodeSelection, docElement, editNode, enterAction);
        }
    }
    private static placeCursorEnd(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document, editNode?: Element): void {
        lastSelectionNode = lastSelectionNode.nodeName === 'BR' ? (isNOU(lastSelectionNode.previousSibling) ? lastSelectionNode.parentNode
            : lastSelectionNode.previousSibling) : lastSelectionNode;
        while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
        lastSelectionNode.nodeName !== 'BR' && lastSelectionNode.nodeName !== 'HR') {
            lastSelectionNode = lastSelectionNode.lastChild;
        }
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

    private static getNodeCollection (range: Range, nodeSelection: NodeSelection, node: Node): Node[] {
        let nodes: Node[] = [];
        if (range.startOffset === range.endOffset && range.startContainer === range.endContainer &&
            range.startContainer.nodeName !== 'BR' && range.startContainer.childNodes.length > 0 &&
            (range.startContainer.nodeName === 'TD' || (range.startContainer.nodeType !== 3 &&
            (node as HTMLElement).classList && (node as HTMLElement).classList.contains('pasteContent')))) {
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
        } else if (range.startContainer === range.endContainer && range.startContainer.nodeType !== 3
                && node.firstChild.nodeName === 'HR') {
            if ((range.startContainer as HTMLElement).classList.contains('e-content') || range.startContainer.nodeName === 'BODY') {
                range.startContainer.appendChild(node);
            } else {
                range.startContainer.parentNode.insertBefore(node, range.startContainer);
            }
        } else {
            let blockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            if ((isNOU(blockNode) || isNOU(blockNode.parentElement)) && range.endContainer.nodeType !== 3) {
                blockNode = range.endContainer;
                range.setEnd(blockNode, range.endContainer.textContent.length);
            }
            if (blockNode.nodeName === 'BODY' && range.startContainer === range.endContainer && range.startContainer.nodeType === 1) {
                blockNode = range.startContainer;
            }
            if ((blockNode as HTMLElement).closest('LI') && node && (node as HTMLElement).firstElementChild &&
            (((node as HTMLElement)).firstElementChild.tagName === 'OL' || (node as HTMLElement).firstElementChild.tagName === 'UL')) {
                let liNode: HTMLElement;
                while ((node as HTMLElement).firstElementChild.lastElementChild && (node as HTMLElement).firstElementChild.lastElementChild.tagName === 'LI') {
                    liNode = ((node as HTMLElement).firstElementChild.lastElementChild as HTMLElement);
                    liNode.style.removeProperty('margin-left');
                    liNode.style.removeProperty('margin-top');
                    liNode.style.removeProperty('margin-bottom');
                    (node as HTMLElement).firstElementChild.insertAdjacentElement('afterend', liNode);
                }
            }
            if (blockNode.nodeName === 'TD' || blockNode.nodeName === 'TH' || blockNode.nodeName === 'TR') {
                const tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
                range.insertNode(tempSpan);
                tempSpan.parentNode.replaceChild(node, tempSpan);
            } else {
                const nodeSelection: NodeSelection = new NodeSelection();
                const currentNode: Node = this.getNodeCollection(range, nodeSelection, node)[this.getNodeCollection(
                    range, nodeSelection, node).length - 1];
                let splitedElm: Node;
                if ((currentNode.nodeName === 'BR' || currentNode.nodeName === 'HR' ||
                (currentNode.nodeName === '#text' && !isNOU(currentNode.parentElement) && currentNode.parentElement.nodeName === 'LI')) &&
                (!isNOU(currentNode.parentElement) && currentNode.parentElement.textContent.trim().length === 0)) {
                    splitedElm = currentNode;
                    if (currentNode.parentElement.nodeName === 'LI' && !isNOU(currentNode.nextSibling) &&
                        currentNode.nextSibling.nodeName === 'BR') {
                        detach(currentNode.nextSibling);
                    }
                } else if ((currentNode.nodeName === '#text' || currentNode.nodeName === 'BR') && !isNOU(currentNode.parentElement) &&
                (currentNode.parentElement.nodeName === 'LI' || (blockNode === editNode && currentNode.parentElement === blockNode )) &&
                currentNode.parentElement.textContent.trim().length > 0) {
                    splitedElm = currentNode;
                    if (currentNode.parentElement.nodeName === 'LI' && !isNOU(currentNode.nextSibling) &&
                    currentNode.nextSibling.nodeName === 'BR') {
                        detach(currentNode.nextSibling);
                    }
                    if (!range.collapsed) {
                        range.deleteContents();
                    }
                    range.insertNode(node);
                    this.contentsDeleted = true;
                    return;
                } else {
                    splitedElm = nodeCutter.GetSpliceNode(range, blockNode as HTMLElement);
                }
                splitedElm.parentNode.replaceChild(node, splitedElm);
            }
        }
    }
    private static cursorPos(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document,
        editNode?: Element, enterAction?: string): void {
        (lastSelectionNode as HTMLElement).classList.add('lastNode');
        editNode.innerHTML = updateTextNode(editNode.innerHTML, enterAction);
        lastSelectionNode = (editNode as HTMLElement).querySelector('.lastNode');
        if (!isNOU(lastSelectionNode)) {
            this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
            (lastSelectionNode as HTMLElement).classList.remove('lastNode');
            if ((lastSelectionNode as HTMLElement).classList.length === 0) {
                (lastSelectionNode as HTMLElement).removeAttribute('class');
            }
        }
    }

    private static imageFocus(node: Node, nodeSelection: NodeSelection, docElement: Document): void {
        const focusNode: Node = document.createTextNode(' ');
        node.parentNode.insertBefore(focusNode, node.nextSibling);
        nodeSelection.setSelectionText(docElement, node.nextSibling, node.nextSibling, 0, 0);
    }

    // eslint-disable-next-line
    private static getImmediateBlockNode(node: Node, editNode: Node): Node {
        do {
            node = node.parentNode;
        } while (node && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0);
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
            if (element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true' &&
                isNOU(element.parentElement.querySelector('img'))) {
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
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            let lineWithDiv: boolean = true;
            if (emptyElements[i as number].tagName === 'DIV') {
                lineWithDiv =  (emptyElements[i as number] as HTMLElement).style.borderBottom === 'none' ||
                (emptyElements[i as number] as HTMLElement).style.borderBottom === '' ? true : false;
            }
            if (CONSTANT.SELF_CLOSING_TAGS.indexOf(emptyElements[i as number].tagName.toLowerCase()) < 0 && lineWithDiv) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[i as number]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
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
