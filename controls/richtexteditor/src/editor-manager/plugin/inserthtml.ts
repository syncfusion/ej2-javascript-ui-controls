import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU, createElement, closest } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { updateTextNode, nestedListCleanUp, scrollToCursor } from './../../common/util';
import { ImageOrTableCursor } from '../../common';

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
    private static isAnotherLiFromEndLi: boolean = false;
    public static Insert(
        docElement: Document, insertNode: Node | string,
        editNode?: Element, isExternal?: boolean, enterAction?: string): void {
        let node: Node;
        if (typeof insertNode === 'string') {
            const divNode: HTMLElement = document.createElement('div');
            divNode.innerHTML = insertNode.replace(/&(times|divide|ne)(;?)/g, '&amp;$1$2');
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
        const scrollHeight: number = !isNOU(editNode) ? editNode.scrollHeight : 0;
        const nodeSelection: NodeSelection = new NodeSelection(editNode as HTMLElement);
        const nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        if (range.startContainer === editNode && range.startContainer === range.endContainer && range.startOffset === 0 &&
            range.startOffset === range.endOffset && editNode.textContent.length === 0 &&
            (editNode.children[0].tagName === 'P' || editNode.children[0].tagName === 'DIV' || (editNode.children[0].tagName === 'BR'))) {
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
        let closestParentNode: Node = (node.nodeName.toLowerCase() === 'table') ? (!isNOU(nodes[0]) ? this.closestEle(nodes[0].parentNode, editNode) : range.startContainer) : nodes[0];
        if (closestParentNode && closestParentNode.nodeName === 'BR'){
            closestParentNode = closestParentNode.parentNode;
        }
        if (closestParentNode && closestParentNode.nodeName === 'LI' && node.nodeName.toLowerCase() === 'table') {
            if (nodes.length === 0) {
                const tableCursor: ImageOrTableCursor   = nodeSelection.processedTableImageCursor(range);
                if (tableCursor.startName === 'TABLE' || tableCursor.endName === 'TABLE') {
                    const tableNode: HTMLElement = tableCursor.start ? tableCursor.startNode : tableCursor.endNode;
                    nodes.push(tableNode);
                }
            }
            const lastclosestParentNode: HTMLElement = this.closestEle(nodes[nodes.length - 1].parentNode, editNode) as HTMLElement;
            this.insertTableInList(
                range, node as HTMLTableElement,
                closestParentNode,
                nodes[0], nodeCutter,
                lastclosestParentNode,
                editNode as HTMLElement);
            return;
        }
        if (isCursor && range.startContainer.textContent === '' && range.startContainer.nodeName !== 'BR' && enterAction !== 'BR' && node.nodeName !== '#text' && !isNOU((node as HTMLElement).children[0]) && !isNOU((node as HTMLElement).children[0].tagName) && (node as HTMLElement).children[0].tagName === 'IMG' && (node as HTMLElement).children.length === 1) {
            (range.startContainer as HTMLElement).innerHTML = '';
        }
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
            } else if (parentNode && parentNode.nodeName !== 'LI') {
                let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            if (range.startContainer.parentElement.closest('ol,ul') !== null && range.endContainer.parentElement.closest('ol,ul') !== null) {
                nestedListCleanUp(range, parentNode);
            } else {
                range.extractContents();
            }
            if ((insertNode as HTMLElement).tagName === 'TABLE') {
                const emptyElement: HTMLElement = closest(range.startContainer, 'blockquote') as HTMLElement;
                if (!isNOU(emptyElement) && emptyElement.childNodes.length > 0) {
                    for (let i: number = emptyElement.childNodes.length - 1; i >= 0; i--) {
                        const currentChild: HTMLElement = emptyElement.childNodes[i as number] as HTMLElement;
                        if (!isNOU(currentChild) && currentChild.innerText.trim() === '') {
                            detach(currentChild);
                        }
                    }
                }
                this.removeEmptyElements(editNode as HTMLElement, false, emptyElement as HTMLElement);
            }
            for (let index: number = 0; index < nodes.length; index++) {
                if (nodes[index as number].nodeType !== 3 && nodes[index as number].parentNode != null) {
                    if (nodes[index as number].nodeName === 'IMG') {
                        continue;
                    }
                    nodes[index as number].parentNode.removeChild(nodes[index as number]);
                }
            }
            if (!isNOU(sibNode) && !isNOU(sibNode.parentNode)) {
                if (docElement.contains(sibNode)) {
                    InsertMethods.AppendBefore(node as HTMLElement, sibNode as HTMLElement, true);
                } else {
                    range.insertNode(node);
                }
            } else {
                let previousNode: Node = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '') && parentNode.nodeName !== 'LI') {
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
                    if (parentNode.textContent.trim() === '' && parentNode !== editNode  && parentNode.nodeName === 'LI') {
                        parentNode.appendChild(node);
                    } else if (parentNode.textContent.trim() === '' && (parentNode as HTMLElement) !== editNode) {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode as HTMLElement, false);
                        detach(parentNode);
                    } else {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode.firstChild as HTMLElement, false);
                    }
                } else if (isNOU(preNode.previousSibling) && (insertNode as HTMLElement).tagName === 'TABLE') {
                    (parentNode as Element).prepend(node);
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
            const liElement: HTMLElement = !isNOU(closestParentNode) ? closest(closestParentNode, 'li') as HTMLElement : null;
            if ((!isNOU(closestParentNode) && (closestParentNode.nodeName === 'TD' || closestParentNode.nodeName === 'TH')) && !isNOU(liElement) && !isCursor) {
                range.extractContents();
                liElement.appendChild(node);
                this.removeEmptyNextLI(liElement);
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
                    const paraElem: Element = (range.startContainer as HTMLElement).nextElementSibling;
                    if (paraElem) {
                        if (paraElem.querySelector('br')) {
                            detach(paraElem.querySelector('br'));
                        }
                        paraElem.appendChild(node);
                    }
                } else {
                    if (range.startContainer.nodeName === 'BR') {
                        range.startContainer.parentElement.insertBefore(node, range.startContainer);
                    } else {
                        range.insertNode(node);
                    }
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
        if (!isNOU(editNode) && scrollHeight < editNode.scrollHeight && node.nodeType === 1 && (node.nodeName === 'IMG' || !isNOU((node as HTMLElement).querySelector('img')))) {
            scrollToCursor(docElement, editNode as HTMLElement);
        }
    }

    // Removes all empty list items from the list containing the provided list item.
    private static removeEmptyNextLI(liElement: HTMLElement): void {
        // Find the root-level list containing this list item
        let rootList: HTMLElement = closest(liElement, 'ul,ol') as HTMLElement;
        // Navigate to the topmost list if this is inside nested lists
        while (rootList && rootList.parentElement && rootList.parentElement.nodeName === 'LI') {
            rootList = closest(rootList.parentElement, 'ul,ol') as HTMLElement;
        }
        // If no list was found, exit early
        if (!rootList) {
            return;
        }
        // Collect all list items in the list
        const listItems: NodeListOf<HTMLLIElement> = rootList.querySelectorAll('li');
        // Define a helper to check if a list item is empty (no text and no media elements)
        const isEmptyListItem: (item: HTMLLIElement) => boolean = (item: HTMLLIElement): boolean => {
            return item.textContent.trim() === '' &&
                !item.querySelector('audio,video,img,table,br');
        };
        // Remove all empty list items
        listItems.forEach((item: HTMLLIElement) => {
            if (isEmptyListItem(item)) {
                detach(item);
            }
        });
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
        const blockElement: HTMLElement = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode) as HTMLElement;
        if (blockElement && blockElement.textContent.length === 0) {
            const brElement: HTMLBRElement | null = blockElement.querySelector('br:last-of-type');
            if (brElement) {
                brElement.classList.add('rte-temp-br');
            }
        }
        const isCursor: boolean = range.startOffset === range.endOffset &&
        range.startContainer === range.endContainer;
        if (isCursor && range.startContainer === editNode && editNode.textContent === '' && range.startOffset === 0 && range.endOffset === 0) {
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
            if (!isNOU(preNode)) {
                sibNode = isNOU(preNode.previousSibling) ? preNode.parentNode.previousSibling : preNode.previousSibling;
                if (nodes.length === 1) {
                    nodeSelection.setSelectionContents(docElement, preNode);
                    range = nodeSelection.getRange(docElement); isSingleNode = true;
                } else {
                    const textContent: string = nodes[nodes.length - 1].textContent ? nodes[nodes.length - 1].textContent : '';
                    lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                    if (lasNode && lasNode.nodeName === 'LI' && lasNode.nextSibling && lasNode.nextSibling.nodeName === 'LI') {
                        this.isAnotherLiFromEndLi = textContent === lasNode.textContent ? false : true;
                    }
                    lasNode = isNOU(lasNode) ? preNode : lasNode;
                    nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                        lasNode.textContent.length : lasNode.childNodes.length);
                    range = nodeSelection.getRange(docElement); isSingleNode = false;
                }
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
                    range.deleteContents();
                    this.removeEmptyElements(editNode as HTMLElement, true);
                    range.insertNode(fragment);
                } else {
                    const startContainerParent: Node = editNode === range.startContainer ?
                        range.startContainer : range.startContainer.parentNode;
                    // Get the index of the start container among its siblings
                    const startIndex: number = Array.prototype.indexOf.call(startContainerParent.childNodes, (Browser.userAgent.indexOf('Firefox') !== -1 && editNode === range.startContainer) ? range.startContainer.firstChild : range.startContainer);
                    range.deleteContents();
                    if (startIndex !== -1) {
                        range.setStart(startContainerParent, startIndex);
                        range.setEnd(startContainerParent, startIndex);
                    }
                    if (!isNOU(lasNode) && lasNode !== editNode) {
                        detach(lasNode);
                        this.removeEmptyElements(editNode as HTMLElement, true);
                    }
                    // eslint-disable-next-line
                    !isNOU(sibNode) ? (sibNode.parentNode === editNode ? sibNode.appendChild(fragment) : sibNode.parentNode.appendChild(fragment)) : range.insertNode(fragment);
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
                } else if (nodes[0] && nodes[0].nodeName === '#text' && nodes[0].nodeValue.includes('\u200B') && !isNOU(nodes[0].parentElement) && !isNOU(nodes[0].parentElement.previousElementSibling) && nodes[0].parentElement.previousElementSibling.classList.contains('e-mention-chip')) {
                    range.startContainer.parentElement.insertAdjacentElement('afterend', tempSpan);
                } else {
                    range.insertNode(tempSpan);
                }
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                const matchedElement: HTMLElement = this.getClosestMatchingElement(tempSpan.parentNode as HTMLElement, fragment);
                if (fragment.childNodes.length === 1 && fragment.firstChild && matchedElement) {
                    const wrapperDiv: HTMLElement = document.createElement('div');
                    const text: string = fragment.firstChild.textContent || '';
                    wrapperDiv.innerHTML = (fragment.firstChild as HTMLElement).innerHTML || '';
                    const replacementNode: Node = lastSelectionNode = wrapperDiv.firstChild;
                    if (replacementNode) {
                        matchedElement.replaceChild(replacementNode, tempSpan);
                        if (matchedElement.parentNode && replacementNode.nodeType === Node.TEXT_NODE && ((replacementNode.previousSibling &&
                            replacementNode.previousSibling.nodeType === Node.TEXT_NODE) ||
                            (replacementNode.nextSibling && replacementNode.nextSibling.nodeType === Node.TEXT_NODE))) {
                            matchedElement.parentNode.normalize();
                            const startOffset: number = range.startOffset + text.length;
                            nodeSelection.setCursorPoint(docElement, matchedElement.firstChild as HTMLElement, startOffset);
                            lastSelectionNode = null;
                        }
                    }
                    wrapperDiv.remove();
                } else {
                    tempSpan.parentNode.replaceChild(fragment, tempSpan);
                }
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
                    if (!isCollapsed && range.startContainer.parentElement.textContent.length === 0 && range.startContainer.nodeName === 'BR' && range.startContainer.parentElement.nodeName === 'P') {
                        editNode.removeChild(range.startContainer.parentElement);
                    }
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
                            const firstParaElm: HTMLElement = enterAction === 'DIV' ? createElement('div') : createElement('p');
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
                                paraElm = enterAction === 'DIV' ? createElement('div') : createElement('p');
                                paraElm.appendChild(node.firstChild); fragment.appendChild(paraElm);
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
                if (node.parentNode) {
                    node.parentNode.replaceChild(fragment, node);
                }
            }
        }
        if (lastSelectionNode instanceof Element && lastSelectionNode.nodeName === 'GOOGLE-SHEETS-HTML-ORIGIN') {
            const tableEle: HTMLTableElement | null = lastSelectionNode.querySelector('table');
            const colGroup: HTMLElement | null = tableEle.querySelector('colgroup');
            if (colGroup) {
                for (let i: number = 0; i < tableEle.rows.length; i++) {
                    for (let k: number = 0; k < tableEle.rows[i as number].cells.length; k++) {
                        if (colGroup.querySelectorAll('col')[k as number].hasAttribute('width')) {
                            const width: string = colGroup.querySelectorAll('col')[k as number].getAttribute('width');
                            tableEle.rows[i as number].cells[k as number].style.width = width + 'px';
                        }
                    }
                }
            }
        }

        if (lastSelectionNode && lastSelectionNode.nodeName === 'TABLE') {
            const pTag: HTMLElement = createElement('p');
            pTag.appendChild(createElement('br'));
            lastSelectionNode.parentElement.insertBefore(pTag, lastSelectionNode.nextSibling);
            lastSelectionNode = pTag;
        }
        if (lastSelectionNode && lastSelectionNode.nodeName === '#text') {
            this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        } else if (lastSelectionNode && lastSelectionNode.nodeName === 'HR') {
            const nextSiblingNode: HTMLElement = lastSelectionNode.nextSibling ? lastSelectionNode.nextSibling as HTMLElement : null;
            const siblingTag: HTMLElement = enterAction === 'DIV' ? createElement('div') : createElement('p');
            siblingTag.appendChild(createElement('br'));
            if (!isNOU(nextSiblingNode) && nextSiblingNode.nodeName === 'HR') {
                lastSelectionNode.parentNode.insertBefore(siblingTag, nextSiblingNode);
                lastSelectionNode = siblingTag;
            }
            else if (!isNOU(nextSiblingNode)) {
                lastSelectionNode = nextSiblingNode;
            }
            else {
                lastSelectionNode.parentNode.appendChild(siblingTag);
                lastSelectionNode.parentNode.insertBefore(lastSelectionNode, siblingTag);
                lastSelectionNode = siblingTag;
            }
            nodeSelection.setSelectionText(docElement, lastSelectionNode, lastSelectionNode, 0, 0);
        }
        else if (editNode.contains(lastSelectionNode) && isNOU(editNode.querySelector('.paste-cursor'))) {
            this.cursorPos(lastSelectionNode, node, nodeSelection, docElement, editNode);
        } else {
            const cursorElm: HTMLElement = editNode.querySelector('.paste-cursor');
            if (!isNOU(cursorElm)) {
                nodeSelection.setCursorPoint(docElement, cursorElm, 0);
                cursorElm.remove();
            }
            else {
                const nodeList: NodeListOf<HTMLElement> = editNode.querySelectorAll('.pasteContent_RTE');
                if (nodeList.length > 0) {
                    const lastElement: HTMLElement = nodeList[nodeList.length - 1];
                    this.cursorPos(lastElement, node, nodeSelection, docElement, editNode);
                }
            }
        }
        this.alignCheck(editNode as HTMLElement);
        this.listCleanUp(nodeSelection, docElement);
        this.removeEmptyBrFromParagraph(editNode as HTMLElement);
    }
    /**
     * Removes a <br> element that was temporarily marked with 'rte-temp-br' class.
     * This is used to clean up unnecessary line breaks after paste actions.
     *
     * @private
     * @param {HTMLElement} editNode - The container element where the temporary <br> may exist.
     * @returns {void}
     */
    private static removeEmptyBrFromParagraph(editNode: HTMLElement): void {
        const tempBr: HTMLBRElement | null = editNode.querySelector('br.rte-temp-br');
        if (tempBr) {
            tempBr.remove();
        }
    }

    private static compareParentElements(el1: HTMLElement | null, el2: HTMLElement | null): boolean {
        if (!el1 || !el2) {
            return false;
        }
        if (el1.tagName !== el2.tagName) {
            return false;
        }
        return this.getFilteredAttributes(el1) === this.getFilteredAttributes(el2);
    }

    private static getFilteredAttributes(element: HTMLElement): string {
        return Array.from(element.attributes)
            .map((attr: Attr): string => {
                if (attr.name === 'class') {
                    const filteredClass: string = attr.value.split(' ')
                        .filter((cls: string) => cls !== 'pasteContent_RTE')
                        .join(' ');
                    return filteredClass ? `class='${filteredClass}'` : '';
                }
                return `${attr.name}='${attr.value}'`;
            })
            .filter((attr: string) => attr.length > 0)
            .sort()
            .join(' ');
    }

    private static getClosestMatchingElement(startNode: HTMLElement | null, fragment: DocumentFragment): HTMLElement | null {
        let currentNode: HTMLElement | null = startNode;
        while (currentNode) {
            const matchingPastedNode: HTMLElement | null = this.findMatchingChild(fragment, currentNode);
            if (matchingPastedNode) {
                return currentNode;
            }
            currentNode = currentNode.parentElement;
        }
        return null;
    }

    private static findMatchingChild(fragment: ParentNode, targetNode: HTMLElement): HTMLElement | null {
        for (const node of Array.from(fragment.children) as HTMLElement[]) {
            if (this.compareParentElements(node, targetNode)) {
                return node;
            }
            const deeperMatch: HTMLElement | null = this.findMatchingChild(node, targetNode);
            if (deeperMatch) {
                return deeperMatch;
            }
        }
        return null;
    }

    private static listCleanUp(nodeSelection: NodeSelection, docElement: Document): void {
        const range: Range = nodeSelection.getRange(docElement);
        const startContainer: Node = range.startContainer;
        const startOffset: number = range.startOffset;
        const startParentElement: HTMLElement = range.startContainer.parentElement;
        const endParentElement: HTMLElement = range.endContainer.parentElement;
        if (!isNOU(startParentElement) && !isNOU(endParentElement)) {
            const startClosestList: HTMLElement = startParentElement.closest('ol, ul') as HTMLElement;
            const endClosestList: HTMLElement = endParentElement.closest('ol, ul') as HTMLElement;
            if (!isNOU(startClosestList) && !isNOU(endClosestList)) {
                const hasListCleanUp: boolean = this.cleanUpListItems(startClosestList);
                const hasListContainerCleanUp: boolean = this.cleanUpListContainer(startClosestList);
                if (hasListCleanUp || hasListContainerCleanUp) {
                    range.setStart(startContainer, startOffset);
                    range.setEnd(startContainer, startOffset);
                }
            }
        }
    }

    private static cleanUpListItems(parentContainer: HTMLElement): boolean {
        let hasListCleanUp: boolean = false;
        let listItems: NodeListOf<HTMLLIElement>;
        if (!isNOU(parentContainer.closest('ol, ul'))){
            listItems = parentContainer.closest('ol, ul').querySelectorAll('li');
        }
        if (isNOU(listItems) || listItems.length === 0) {
            return false;
        }
        let nearestListItem: HTMLElement | null = null;
        listItems.forEach((listItem: HTMLLIElement) => {
            const parentElement: HTMLElement = listItem.parentElement as HTMLElement;
            if (!isNOU(parentElement) && parentElement.nodeName !== 'OL' && parentElement.nodeName !== 'UL') {
                if (isNOU(nearestListItem)) {
                    nearestListItem = parentElement.closest('li');
                }
                if (!isNOU(nearestListItem)) {
                    const nextSibling: HTMLElement = listItem.nextSibling as HTMLElement;
                    if (!isNOU(nextSibling) && nextSibling.nodeName !== 'LI') {
                        const startIndex: number = Array.prototype.indexOf.call(parentElement.childNodes, nextSibling);
                        const clonedParent: HTMLElement = parentElement.cloneNode(false) as HTMLElement;
                        const totalChildren: number = parentElement.childNodes.length;
                        for (let i: number = startIndex; i < totalChildren; i++) {
                            clonedParent.appendChild(parentElement.childNodes[startIndex as number]);
                        }
                        if (clonedParent.childNodes.length > 0) {
                            const newListItem: HTMLElement = document.createElement('li');
                            newListItem.appendChild(clonedParent);
                            nearestListItem.insertAdjacentElement('afterend', newListItem);
                        } else {
                            (clonedParent as HTMLElement).remove();
                        }
                    }
                    const closestList: Element | null = parentElement.closest('ol, ul');
                    nearestListItem.insertAdjacentElement('afterend', listItem);
                    nearestListItem = nearestListItem.nextSibling as HTMLElement;
                    if (!isNOU(closestList)) {
                        this.removeEmptyElements(closestList as HTMLElement);
                    }
                    hasListCleanUp = true;
                }
            }
        });
        const cleanUpFlattenListContainer: boolean = this.cleanUpFlattenListContainer(parentContainer);
        hasListCleanUp = cleanUpFlattenListContainer ? cleanUpFlattenListContainer : hasListCleanUp;
        return hasListCleanUp;
    }

    private static cleanUpFlattenListContainer(parentContainer: HTMLElement): boolean {
        let hasListCleanUp: boolean = false;
        let listItems: NodeListOf<HTMLLIElement>;
        if (!isNOU(parentContainer.closest('ol, ul'))) {
            listItems = parentContainer.closest('ol, ul').querySelectorAll('li');
        }
        if (isNOU(listItems) || listItems.length === 0) {
            return false;
        }
        listItems.forEach((listItem: HTMLLIElement) => {
            if (!isNOU(listItem.firstChild) && (listItem.firstChild.nodeName === 'OL' || listItem.firstChild.nodeName === 'UL')) {
                listItem.style.listStyleType = 'none';
            }
            const nestedLi: HTMLLIElement = Array.from(listItem.children).find((child: HTMLElement) =>
                child.tagName === 'LI' && (child.parentElement && child.parentElement.tagName !== 'OL' && child.parentElement.tagName !== 'UL')
            ) as HTMLLIElement;
            if (!isNOU(nestedLi) && !isNOU(listItem.parentNode)) {
                listItem.parentNode.replaceChild(nestedLi, listItem);
                if (isNOU(nestedLi.textContent) || nestedLi.textContent.trim() === '') {
                    nestedLi.remove();
                }
                hasListCleanUp = true;
            }
        });
        return hasListCleanUp;
    }

    private static cleanUpListContainer(parentList: HTMLElement): boolean {
        let hasListContainerCleanUp: boolean = false;
        let nonLiElementCollection: ChildNode[] = [];
        const replacements: { elements: ChildNode[] }[] = [];
        if (!isNOU(parentList)) {
            parentList.childNodes.forEach((childNode: ChildNode) => {
                if ((childNode as HTMLElement).nodeName.toLocaleUpperCase() !== 'LI') {
                    nonLiElementCollection.push(childNode);
                }
                if (((childNode as HTMLElement).nodeName.toLocaleUpperCase() === 'LI' || parentList.lastChild === childNode) && nonLiElementCollection.length > 0) {
                    replacements.push({ elements: [...nonLiElementCollection] });
                    nonLiElementCollection = [];
                }
            });
            replacements.forEach(({ elements }: { elements: ChildNode[] }) => {
                const newListItem: HTMLElement = document.createElement('li');
                elements[0].parentNode.replaceChild(newListItem, elements[0]);
                elements.forEach((child: HTMLElement) => newListItem.appendChild(child));
                if (newListItem.textContent && newListItem.textContent.trim() === '' && !newListItem.querySelector('img')) {
                    parentList.removeChild(newListItem);
                }
                hasListContainerCleanUp = true;
            });
        }
        return hasListContainerCleanUp;
    }
    private static placeCursorEnd(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document, editNode?: Element): void {
        lastSelectionNode = lastSelectionNode.nodeName === 'BR' ? (isNOU(lastSelectionNode.previousSibling) ? lastSelectionNode.parentNode
            : lastSelectionNode.previousSibling) : lastSelectionNode;
        while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
        lastSelectionNode.nodeName !== 'BR' && lastSelectionNode.nodeName !== 'HR') {
            if (!isNOU(lastSelectionNode.lastChild) && (lastSelectionNode.lastChild.nodeName === 'P' &&
                (lastSelectionNode.lastChild as HTMLElement).innerHTML === '')) {
                const lineBreak: HTMLElement = createElement('br');
                lastSelectionNode.lastChild.appendChild(lineBreak);
            }
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
            range.startContainer.appendChild(node);
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
            if (blockNode && blockNode.nodeName === 'BODY' || blockNode.nodeName === 'DIV' && range.startContainer === range.endContainer && range.startContainer.nodeType === 1) {
                blockNode = range.startContainer;
            }

            if (blockNode && blockNode.nodeName !== '#text' && (blockNode as HTMLElement).closest('LI') && editNode.contains((blockNode as HTMLElement).closest('LI')) && blockNode.nodeName !== 'TD' && blockNode.nodeName !== 'TH' && blockNode.nodeName !== 'TR' && node && (node as HTMLElement).firstElementChild &&
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
            if (blockNode && blockNode.nodeName === 'TD' || blockNode.nodeName === 'TH' || blockNode.nodeName === 'TR') {
                let parentElem: Node = range.startContainer;
                while (!isNOU(parentElem) && parentElem.parentElement !== blockNode) {
                    parentElem = parentElem.parentElement as Node;
                }
                range.deleteContents();
                const splitedElm: Node = nodeCutter.GetSpliceNode(range, parentElem as HTMLElement);
                if (splitedElm) {
                    splitedElm.parentNode.replaceChild(node, splitedElm);
                } else {
                    range.insertNode(node);
                }
                this.contentsDeleted = true;
                return;
            } else {
                const nodeSelection: NodeSelection = new NodeSelection(editNode as HTMLElement);
                const currentNode: Node = this.getNodeCollection(range, nodeSelection, node)[this.getNodeCollection(
                    range, nodeSelection, node).length - 1];
                let splitedElm: Node;
                if (currentNode && ((currentNode.nodeName === 'BR' || currentNode.nodeName === 'HR' ||
                (currentNode.nodeName === '#text' && !isNOU(currentNode.parentElement) && currentNode.parentElement.nodeName === 'LI')) &&
                (!isNOU(currentNode.parentElement) && currentNode.parentElement.textContent.trim().length === 0))) {
                    splitedElm = currentNode;
                    if (currentNode.parentElement.nodeName === 'LI' && !isNOU(currentNode.nextSibling) &&
                        currentNode.nextSibling.nodeName === 'BR') {
                        detach(currentNode.nextSibling);
                    }
                    if ((currentNode.parentElement.nodeName === 'LI' || currentNode.parentElement.closest('li')) &&
                        currentNode.parentElement.textContent === '') {
                        this.removeListfromPaste(range);
                        if (currentNode.parentElement.childNodes.length === 1 && currentNode.nodeName === 'BR') {
                            detach(currentNode);
                        }
                        const filteredChildNodes: Node[] = Array.from(node.childNodes).filter((child: Node) => {
                            return !(child.nodeName === 'LI' || child.nodeName === 'UL' || child.nodeName === 'OL');
                        });
                        const insertNodes: Node[] = this.extractChildNodes(node);
                        if (filteredChildNodes.length > 0 && insertNodes.length > 1) {
                            this.insertBlockNodesInLI(insertNodes, range);
                        } else {
                            range.insertNode(node);
                        }
                        this.contentsDeleted = true;
                        return;
                    }
                } else if (currentNode && ((currentNode.nodeName === '#text' || currentNode.nodeName === 'BR') && !isNOU(currentNode.parentElement) &&
                (currentNode.parentElement.nodeName === 'LI' || currentNode.parentElement.closest('LI') || (blockNode === editNode && currentNode.parentElement === blockNode )) &&
                currentNode.parentElement.textContent.trim().length > 0)) {
                    splitedElm = currentNode;
                    if (currentNode.parentElement.nodeName === 'LI' && !isNOU(currentNode.nextSibling) &&
                    currentNode.nextSibling.nodeName === 'BR') {
                        detach(currentNode.nextSibling);
                    }
                    const filteredChildNodes: Node[] = Array.from(node.childNodes).filter((child: Node) => {
                        return !(child.nodeName === 'LI' || child.nodeName === 'UL' || child.nodeName === 'OL');
                    });
                    const mergeNode: Node = currentNode.parentElement;
                    let cloneRange: Range | null = null;
                    const isCollapsed: boolean = range.collapsed;
                    const parentLi: Node = isCollapsed ? currentNode.parentElement.closest('LI') : null;
                    let startLi: Node | null = null;
                    let endLi: Node | null = null;
                    if (!range.collapsed) {
                        const startContainer: Node = range.startContainer;
                        const startOffset: number = range.startOffset;
                        cloneRange = range.cloneRange();
                        startLi = this.findLiFromContainer(cloneRange.startContainer);
                        endLi = this.findLiFromContainer(cloneRange.endContainer);
                        this.removeListfromPaste(range);
                        if (startLi && filteredChildNodes.length > 0) {
                            this.removeEmptyAfterStartLI(startLi as HTMLElement, editNode as HTMLElement);
                        }
                        range.setStart(startContainer, startOffset);
                        range.setEnd(startContainer, startOffset);
                    }
                    const blockNode: Node = this.getImmediateBlockNode(currentNode, node);
                    if (isCollapsed && parentLi && filteredChildNodes.length > 0) {
                        this.pasteLI(node, parentLi, mergeNode, blockNode, range, nodeCutter);
                    } else if (!isCollapsed && startLi && endLi && filteredChildNodes.length > 0) {
                        this.nonCollapsedInsertion(node, cloneRange, nodeCutter, endLi);
                    } else {
                        range.insertNode(node);
                    }
                    this.contentsDeleted = true;
                    return;
                } else {
                    splitedElm = nodeCutter.GetSpliceNode(range, blockNode as HTMLElement);
                }
                splitedElm.parentNode.replaceChild(node, splitedElm);
            }
        }
    }
    // Extracts child nodes of a node.
    private static extractChildNodes(node: Node): Node[] {
        const children: Node[] = [];
        for (let i: number = 0; i < node.childNodes.length; i++) {
            children.push(node.childNodes.item(i));
        }
        return children;
    }

    // Inserts a block nodes in separate list items.
    private static insertBlockNodesInLI(children: Node[], range: Range): void {
        children = this.processInsertNodes(children);
        const fragment: DocumentFragment = document.createDocumentFragment();
        for (const block of children) {
            const newLi: HTMLElement = createElement('li');
            newLi.appendChild(block.cloneNode(true));
            fragment.appendChild(newLi);
        }
        this.unwrapInlineWrappers(fragment);
        range.insertNode(fragment);
    }

    // Processes and adjusts the child nodes before any block.
    private static processInsertNodes(children: Node[]): Node[] {
        const result: Node[] = [];
        let inlineGroup: Node[] = [];
        for (const child of children) {
            const isBlock: boolean = child.nodeType === Node.ELEMENT_NODE &&
                CONSTANT.BLOCK_TAGS.indexOf((child as HTMLElement).nodeName.toLowerCase()) !== -1;
            if (isBlock) {
                if (inlineGroup.length > 0) {
                    result.push(this.wrapInlineElementsInSpan(inlineGroup));
                    inlineGroup = [];
                }
                result.push(child);
            } else {
                inlineGroup.push(child);
            }
        }
        if (inlineGroup.length > 0) {
            result.push(this.wrapInlineElementsInSpan(inlineGroup));
        }
        return result;
    }

    // Wraps inline elements in a span.
    private static wrapInlineElementsInSpan(inlineNodes: Node[]): HTMLElement {
        const wrapper: HTMLElement = createElement('span');
        wrapper.className = 'inline-wrapper';
        inlineNodes.forEach((node: Node) => wrapper.appendChild(node));
        return wrapper;
    }

    // Unwraps inline wrappers
    private static unwrapInlineWrappers(root: Node): void {
        const wrappers: NodeListOf<HTMLElement> = (root as HTMLElement).querySelectorAll('.inline-wrapper');
        wrappers.forEach((wrapper: HTMLElement) => {
            const parent: Node = wrapper.parentNode;
            if (!parent) {
                return;
            }
            while (wrapper.firstChild) {
                parent.insertBefore(wrapper.firstChild, wrapper);
            }
            parent.removeChild(wrapper);
        });
    }

    // Remove empty list items after start LI
    private static removeEmptyAfterStartLI(liElement: HTMLElement, editNode: HTMLElement): void {
        this.clearIfCompletelyEmpty(liElement);
        const rootList: HTMLElement = this.getRootList(liElement, editNode);
        if (!rootList) {
            return;
        }
        const listItems: NodeListOf<HTMLLIElement> = rootList.querySelectorAll('li');
        listItems.forEach((item: HTMLLIElement) => {
            if (this.isRemovableEmptyListItem(item, liElement)) {
                detach(item);
            }
        });
    }

    // Clear if completely empty
    private static clearIfCompletelyEmpty(li: HTMLElement): void {
        if (li.textContent.length === 0 && !li.querySelector('audio,video,img,table,br,hr')) {
            li.innerHTML = '';
        }
    }

    // Get root list
    private static getRootList(li: HTMLElement, editNode: HTMLElement): HTMLElement | null {
        let rootList: HTMLElement = closest(li, 'ul,ol') as HTMLElement;
        while (rootList && rootList.parentElement && editNode.contains(rootList.parentElement)) {
            const parentRootList: HTMLElement = closest(rootList.parentElement, 'ul,ol') as HTMLElement;
            if (editNode.contains(parentRootList)) {
                rootList = parentRootList;
            } else {
                return rootList;
            }
        }
        return rootList || null;
    }

    // Remove empty list items
    private static isRemovableEmptyListItem(item: HTMLLIElement, skipElement: HTMLElement): boolean {
        return item !== skipElement &&
            item.textContent.trim() === '' &&
            !item.querySelector('audio,video,img,table,br');
    }

    // Resolves a LI node from any container
    private static findLiFromContainer(container: Node): Node | null {
        if (container.nodeName === 'LI') {
            return container;
        }

        let parent: Node = container.parentNode;
        while (parent && parent.nodeName !== 'LI') {
            parent = parent.parentNode;
        }
        return parent;
    }

    //Handles non-collapsed list insertion logic for splitting and merging list items based on selection range.
    private static nonCollapsedInsertion(node: Node, cloneRange: Range, nodeCutter: NodeCutter, endSelectionLi: Node): void {
        let children: Node[] = this.extractChildNodes(node);
        children = this.processInsertNodes(children);
        const startContainer: Node = cloneRange.startContainer;
        const endContainer: Node = cloneRange.endContainer;
        const parentLi: HTMLElement = this.getClosestLi(startContainer);
        const previousLi: HTMLElement = this.getPreviousLi(parentLi);
        let endLi: HTMLElement = this.getNextLi(parentLi);
        const parentList: Node = parentLi.parentNode;
        if (endLi && parentList === endContainer) {
            if ((endContainer.nodeName === 'UL' || endContainer.nodeName === 'OL') && endSelectionLi.textContent === '') {
                endLi = null;
            }
        }
        if (startContainer === endContainer || !endLi && !this.isAnotherLiFromEndLi ||
            this.isAnotherLiFromEndLi && parentList !== endContainer) {
            this.handleSingleLiInsertion(parentLi, previousLi, endLi, children, startContainer, cloneRange, nodeCutter, parentList);
        } else {
            this.handleMultiLiInsertion(parentLi, children, startContainer, endContainer, parentList);
        }
        this.unwrapInlineWrappers(parentList);
    }

    // Returns the nearest ancestor LI element for a given node
    private static getClosestLi(node: Node): HTMLElement {
        let current: Node = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
        while (current && current.nodeName !== 'LI') {
            current = current.parentNode;
        }
        return current as HTMLElement;
    }

    // Returns the previous LI sibling if available
    private static getPreviousLi(li: Node): HTMLElement {
        const prev: Node = li.previousSibling;
        return (prev && prev.nodeName === 'LI') ? prev as HTMLElement : null;
    }

    // Returns the next LI sibling if available
    private static getNextLi(li: Node): HTMLElement {
        const next: Node = li.nextSibling;
        return (next && next.nodeName === 'LI') ? next as HTMLElement : null;
    }

    // Appends list items to a fragment and returns the last appended list item
    private static appendListItems(fragment: DocumentFragment, children: Node[],
                                   startIndex: number, endIndex: number): HTMLLIElement | null {
        let lastNewLi: HTMLLIElement = null;
        for (let i: number = startIndex; i < endIndex; i++) {
            const li: HTMLLIElement = document.createElement('li');
            li.appendChild(children[i as number]);
            fragment.appendChild(li);
            lastNewLi = li;
        }
        return lastNewLi;
    }

    // Handles insertion when start and end container are in different LIs
    private static moveSiblingsToLiAndInsert(fromNode: Node, targetLi: HTMLElement, fragment: DocumentFragment,
                                             parentLi: HTMLElement, parentList: Node): void {
        const elementsToMove: ChildNode[] = [];
        while (fromNode) {
            elementsToMove.push(fromNode as ChildNode);
            fromNode = fromNode.nextSibling;
        }
        for (let i: number = 0; i < elementsToMove.length; i++) {
            if (parentLi.contains(elementsToMove[i as number])) {
                parentLi.removeChild(elementsToMove[i as number]);
            }
        }
        for (let i: number = 0; i < elementsToMove.length; i++) {
            targetLi.appendChild(elementsToMove[i as number]);
        }
        if (parentLi.nextSibling) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else {
            parentLi.appendChild(fragment);
        }
    }

    // Handles insertion when start and end container are in same LI or no end LI
    private static handleSingleLiInsertion(parentLi: HTMLElement, previousLi: HTMLElement, endLi: HTMLElement, children: Node[],
                                           startContainer: Node, cloneRange: Range, nodeCutter: NodeCutter, parentList: Node): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        this.extractNestedListsIntoNewListItem(parentLi);
        let middleLi: Node = null;
        let lastNode: Node = null;
        let preNode: Node = parentLi.hasChildNodes() &&
            (parentLi.lastChild.nodeType === Node.TEXT_NODE || parentLi.textContent === '')
            ? parentLi : parentLi.lastChild;
        if (startContainer && startContainer.textContent && startContainer.textContent.length > 0) {
            middleLi = nodeCutter.GetSpliceNode(cloneRange, startContainer as HTMLElement);
            preNode = middleLi.previousSibling !== previousLi ? middleLi.previousSibling : null;
            lastNode = middleLi.nextSibling !== endLi ? middleLi.nextSibling : null;
        }
        const firstBlock: Node = children[0];
        const isSingleBlock: boolean = children.length === 1;
        if (isSingleBlock) {
            if (lastNode) {
                this.addCursorMarker(lastNode);
                this.moveAllChildren(lastNode, firstBlock);
                lastNode.parentNode.removeChild(lastNode);
            } else {
                this.addCursorMarker(firstBlock, true);
            }
        }
        if (preNode && preNode !== previousLi && preNode.textContent && preNode.textContent.length > 0) {
            this.moveAllChildren(firstBlock, preNode);
        } else if (isSingleBlock && parentLi.textContent === '') {
            parentLi.appendChild(firstBlock);
        } else {
            const newLi: HTMLLIElement = document.createElement('li');
            newLi.appendChild(firstBlock);
            fragment.appendChild(newLi);
        }
        const lastNewLi: HTMLLIElement = this.appendListItems(fragment, children, 1, children.length);
        if (lastNewLi && lastNode) {
            this.addCursorMarker(lastNode);
            this.mergeLastNodeContent(lastNode, lastNewLi);
        }
        const shouldInsertAfter: boolean = lastNode && (lastNode.nodeName === 'LI' || !lastNode.nextSibling);
        if (shouldInsertAfter) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
            if (lastNode && lastNode.parentNode && lastNode.textContent.length === 0) {
                lastNode.parentNode.removeChild(lastNode);
            }
        } else if (lastNewLi) {
            this.moveSiblingsToLiAndInsert(lastNode, lastNewLi, fragment, parentLi, parentList);
        }
        if (middleLi && middleLi.parentNode && middleLi.textContent === '') {
            middleLi.parentNode.removeChild(middleLi);
        }
        if (parentLi && parentLi.parentNode && parentLi.textContent === '') {
            parentLi.parentNode.removeChild(parentLi);
        }
    }

    // Handles insertion when selection spans multiple LIs
    private static handleMultiLiInsertion(parentLi: HTMLElement, children: Node[], startContainer: Node,
                                          endContainer: Node, parentList: Node): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        this.extractNestedListsIntoNewListItem(parentLi);
        const endLi: Node = parentLi.nextSibling;
        this.extractNestedListsIntoNewListItem(endLi);
        startContainer = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentNode : startContainer;
        if (endContainer.textContent === '' && endContainer.nextSibling) {
            endContainer = endContainer.nextSibling;
        }
        if (!endLi.contains(endContainer) || endContainer.nodeName === 'UL' || endContainer.nodeName === 'OL') {
            endContainer = endLi;
        }
        const firstBlock: Node = children[0];
        const lastBlock: Node = children[children.length - 1];
        if (endContainer.nodeType === Node.TEXT_NODE && children.length > 1) {
            lastBlock.appendChild(endContainer);
        } else if (children.length > 1) {
            this.addCursorMarker(endContainer);
            this.moveAllChildren(endContainer, lastBlock);
            endLi.insertBefore(lastBlock, endLi.firstChild);
            (endLi as HTMLElement).style.removeProperty('list-style-type');
        }
        if (children.length === 1) {
            this.addCursorMarker(endContainer);
            this.moveAllChildren(endContainer, firstBlock);
            if (endLi && endLi.parentNode) {
                endLi.parentNode.removeChild(endLi);
            }
        }
        let lastNewLi: HTMLLIElement = null;
        if (startContainer.textContent.length > 0 && parentLi.textContent.length > 0) {
            this.moveAllChildren(firstBlock, startContainer);
        } else {
            const newLi: HTMLLIElement = document.createElement('li');
            newLi.appendChild(firstBlock);
            fragment.appendChild(newLi);
            if (children.length === 1) {
                lastNewLi = newLi;
            }
        }
        if (isNOU(lastNewLi)) {
            lastNewLi = this.appendListItems(fragment, children, 1, children.length - 1);
        }
        if (isNOU(startContainer.nextSibling)) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else if (lastNewLi) {
            this.moveSiblingsToLiAndInsert(startContainer.nextSibling, lastNewLi, fragment, parentLi, parentList);
        }
        if (parentLi.textContent === '' && parentLi.parentNode) {
            parentLi.parentNode.removeChild(parentLi);
        }
    }

    // Handles insertion for collapsed selection
    private static pasteLI(node: Node, parentLi: Node, mergeNode: Node, blockNode: Node, range: Range, nodeCutter: NodeCutter): void {
        let children: Node[] = this.extractChildNodes(node);
        children = this.processInsertNodes(children);
        const blockNodeLength: number = this.getBlockNodeLength(blockNode);
        const parentList: Node = parentLi.parentNode;
        let isStart: boolean = true;
        let isEnd: boolean = false;
        if (parentLi.contains(mergeNode) && mergeNode.previousSibling && mergeNode.previousSibling.nodeName !== 'LI') {
            isStart = false;
        }
        if (parentLi.contains(mergeNode) && (isNOU(mergeNode.nextSibling) || mergeNode.nextSibling && ['LI', 'UL', 'OL'].indexOf(mergeNode.nextSibling.nodeName) !== -1) && range.startOffset === mergeNode.textContent.length) {
            let previousSib: Node = mergeNode.previousSibling;
            let textLength: number = range.startOffset;
            while (previousSib && previousSib.nodeName !== 'LI') {
                textLength += previousSib.textContent.length;
                previousSib = previousSib.previousSibling;
            }
            isEnd = textLength === blockNodeLength;
        }
        const isAtStart: boolean = range.startOffset === 0 && isStart;
        const isAtEnd: boolean = range.startOffset === blockNodeLength || isEnd;
        if (isAtStart) {
            this.handlePasteAtStart(children, parentLi, mergeNode, parentList);
        } else if (isAtEnd) {
            this.handlePasteAtEnd(children, parentLi, mergeNode, parentList);
        } else {
            this.handlePasteInMiddle(children, parentLi, mergeNode, range, parentList, nodeCutter);
        }
        this.unwrapInlineWrappers(parentList);
    }

    // Handles insertion at start
    private static handlePasteAtStart(children: Node[], parentLi: Node, mergeNode: Node, parentList: Node): void {
        const lastBlock: Node = children[children.length - 1];
        this.addCursorMarker(mergeNode);
        if (mergeNode.nodeType === Node.TEXT_NODE) {
            lastBlock.appendChild(mergeNode);
        } else {
            this.moveAllChildren(mergeNode, lastBlock);
            parentLi.insertBefore(lastBlock, parentLi.firstChild);
        }
        const fragment: DocumentFragment = this.createLiFragment(children, 0, children.length - 1); // exclude last
        parentList.insertBefore(fragment, parentLi);
    }

    // Handles insertion at end
    private static handlePasteAtEnd(children: Node[], parentLi: Node, mergeNode: Node, parentList: Node): void {
        const firstBlock: Node = children[0];
        const hasNestedList: HTMLElement | null = this.hasNestedListInsideLi(mergeNode);
        if (mergeNode.nodeName === 'LI' && hasNestedList) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, hasNestedList);
            this.moveAllChildren(firstBlock, mergeNode);
            movedNodes.forEach((node: Node) => mergeNode.appendChild(node));
        }
        else {
            this.moveAllChildren(firstBlock, mergeNode);
        }
        const fragment: DocumentFragment = this.createLiFragment(children, 1, children.length); // exclude first
        const lastNewLi: HTMLLIElement = fragment.lastChild as HTMLLIElement | null;
        if (isNOU(mergeNode.nextSibling) && isNOU(hasNestedList) || mergeNode.nodeName === 'LI' && isNOU(hasNestedList)) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else if (lastNewLi) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, hasNestedList ? hasNestedList : mergeNode.nextSibling);
            movedNodes.forEach((node: Node) => lastNewLi.appendChild(node));
            this.insertFragmentAfterLi(fragment, parentLi, parentList);
        }
    }

    // Handles insertion in middle
    private static handlePasteInMiddle(children: Node[], parentLi: Node, mergeNode: Node,
                                       range: Range, parentList: Node, nodeCutter: NodeCutter): void {
        const middleLi: Node = nodeCutter.GetSpliceNode(range, mergeNode as HTMLElement);
        const preNode: Node = middleLi.previousSibling;
        const lastNode: Node = middleLi.nextSibling;
        const firstBlock: Node = children[0];
        if (children.length === 1) {
            this.addCursorMarker(lastNode);
            this.moveAllChildren(lastNode, firstBlock);
        }
        this.moveAllChildren(firstBlock, preNode);
        const fragment: DocumentFragment = this.createLiFragment(children, 1, children.length); // exclude first
        const lastNewLi: HTMLLIElement = fragment.lastChild as HTMLLIElement | null;
        if (lastNewLi) {
            this.addCursorMarker(lastNode);
            this.mergeLastNodeContent(lastNode, lastNewLi);
        }
        if ((lastNode && isNOU(lastNode.nextSibling) && lastNewLi) || lastNode.nodeName === 'LI') {
            parentList.insertBefore(fragment, parentLi.nextSibling);
            if (lastNode.textContent.length === 0) {
                lastNode.parentNode.removeChild(lastNode);
            }
        } else if (lastNewLi) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, lastNode);
            movedNodes.forEach((node: Node) => lastNewLi.appendChild(node));
            this.insertFragmentAfterLi(fragment, parentLi, parentList);
        }
        middleLi.parentNode.removeChild(middleLi);
    }

    // Checks if there is any nested list inside li
    private static hasNestedListInsideLi(node: Node): HTMLElement | null {
        if (node.nodeName === 'LI') {
            for (const child of Array.from((node as Element).children)) {
                if (child.tagName === 'UL' || child.tagName === 'OL') {
                    return child as HTMLElement;
                }
            }
        }
        const closestLi: HTMLElement = (node as Element).closest('LI') as HTMLElement;
        if (!closestLi) {
            return null;
        }
        for (const child of Array.from(closestLi.children)) {
            if (child.tagName === 'UL' || child.tagName === 'OL') {
                return child as HTMLElement;
            }
        }
        return null;
    }

    // Returns the length of block node
    private static getBlockNodeLength(blockNode: Node): number {
        if (blockNode.nodeName === 'LI') {
            let length: number = 0;
            for (const child of Array.from(blockNode.childNodes)) {
                if (child.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].indexOf((child as HTMLElement).tagName) !== -1) {
                    break;
                }
                length += child.textContent ? child.textContent.length : 0;
            }
            return length;
        }
        return blockNode.textContent ? blockNode.textContent.length : 0;
    }

    // Adds cursor marker
    private static addCursorMarker(lastNode: Node, isEnd?: boolean): void {
        const span: HTMLSpanElement = document.createElement('span');
        span.className = 'paste-cursor';
        if (isEnd) {
            lastNode.appendChild(span);
        } else {
            lastNode.insertBefore(span, lastNode.firstChild);
        }
    }

    // Checks if list item has another list
    private static extractNestedListsIntoNewListItem(listItem: Node): void {
        const childNodes: Node[] = Array.from(listItem.childNodes);
        const listNodes: Node[] = [];
        // Find ul/ol nodes
        for (const node of childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                ((node as HTMLElement).tagName === 'UL' || (node as HTMLElement).tagName === 'OL')) {
                listNodes.push(node);
            }
        }
        if (listNodes.length > 0) {
            // Create a new <li>
            const newLi: HTMLLIElement = document.createElement('li');
            // Move ul/ol into the new <li>
            for (const list of listNodes) {
                newLi.appendChild(list);
            }
            // Insert new <li> after mergeNode
            const parent: Node = listItem.parentNode;
            if (parent) {
                const next: Node = listItem.nextSibling;
                if (next) {
                    parent.insertBefore(newLi, next);
                } else {
                    parent.appendChild(newLi);
                }
            }
        }
    }

    // Creates a fragment of list items
    private static createLiFragment(nodes: Node[], start: number, end: number): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();
        for (let i: number = start; i < end; i++) {
            const li: HTMLLIElement = document.createElement('li');
            li.appendChild(nodes[i as number]);
            fragment.appendChild(li);
        }
        return fragment;
    }

    // Collects and removes following nodes
    private static collectAndRemoveFollowingNodes(parentLi: Node, startNode: Node | null): ChildNode[] {
        const nodes: ChildNode[] = [];
        let current: ChildNode | null = startNode as ChildNode;
        while (current) {
            const next: Node = current.nextSibling;
            nodes.push(current);
            parentLi.removeChild(current);
            current = next as ChildNode;
        }
        return nodes;
    }

    // Inserts fragment after list item
    private static insertFragmentAfterLi(fragment: DocumentFragment, parentLi: Node, parentList: Node): void {
        if (parentLi.nextSibling) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else {
            parentLi.appendChild(fragment);
        }
    }

    // Moves all children
    private static moveAllChildren(sourceNode: Node, targetNode: Node): void {
        while (sourceNode.firstChild) {
            const firstChild: ChildNode | null = sourceNode.firstChild;
            if (firstChild.nodeName === 'UL' || firstChild.nodeName === 'OL') {
                return;
            }
            targetNode.appendChild(firstChild);
        }
    }

    // Merges last node content
    private static mergeLastNodeContent(lastNode: Node, lastNewLi: HTMLLIElement): void {
        while (lastNode && lastNode.firstChild) {
            const firstChild: ChildNode | null = lastNode.firstChild;
            if (!firstChild) {
                continue;
            }
            const isBlockTag: boolean = CONSTANT.BLOCK_TAGS.indexOf(firstChild.nodeName.toLowerCase()) >= 0;
            if (!isBlockTag) {
                lastNewLi.lastChild.appendChild(firstChild);
            } else if (firstChild.nodeName === 'UL' || firstChild.nodeName === 'OL') {
                lastNewLi.appendChild(firstChild);
            } else {
                this.moveAllChildren(firstChild, lastNewLi.lastChild);
                lastNode.removeChild(firstChild);
            }
        }
    }
    private static cursorPos(
        lastSelectionNode: Node, node: Node, nodeSelection: NodeSelection, docElement: Document,
        editNode?: Element): void {
        (lastSelectionNode as HTMLElement).classList.add('lastNode');
        editNode.innerHTML = updateTextNode(editNode.innerHTML);
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
        if (node.parentNode && node.parentNode.nodeName === 'A') {
            const anchorTag: Node = node.parentNode;
            const parentNode: Node = anchorTag.parentNode;
            parentNode.insertBefore(focusNode, anchorTag.nextSibling);
            parentNode.insertBefore(node, focusNode);
        }
        else {
            node.parentNode.insertBefore(focusNode, node.nextSibling);
        }
        nodeSelection.setSelectionText(docElement, node.nextSibling, node.nextSibling, 0, 0);
    }

    // eslint-disable-next-line
    private static getImmediateBlockNode(node: Node, editNode: Node): Node {
        while (node && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0) {
            node = node.parentNode;
        }
        return node;
    }

    private static removingComments(elm: HTMLElement): void {
        let innerElement: string = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    }

    private static findDetachEmptyElem(element: Element,
                                       ignoreBlockNodes: boolean = false): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            const hasNbsp: boolean = element.parentElement.textContent.length > 0 && element.parentElement.textContent.match(/\u00a0/g)
                && element.parentElement.textContent.match(/\u00a0/g).length > 0;
            if (!hasNbsp && element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true' &&
                isNOU(element.parentElement.querySelector('img')) && element.parentElement.nodeName !== 'TD' && element.parentElement.nodeName !== 'TH') {
                removableElement = ignoreBlockNodes && CONSTANT.BLOCK_TAGS.indexOf(element.parentElement.tagName.toLowerCase()) !== -1 ?
                    element as HTMLElement : this.findDetachEmptyElem(element.parentElement, ignoreBlockNodes);
            } else {
                removableElement = ignoreBlockNodes && CONSTANT.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) !== -1 ? null :
                    element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }

    private static removeEmptyElements(element: HTMLElement, ignoreBlockNodes: boolean = false, emptyElemet: Element = null): void {
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        const filteredEmptyElements: Element[] = Array.from(emptyElements).filter((element: Element) => {
            const tagName: string = element.tagName.toLowerCase();
            // Some empty tags suc as TD TH convey a meaning and hence should not be removed.
            const meaningfulEmptyTags: string[] = ['td', 'th', 'textarea', 'input', 'img', 'video', 'audio', 'br', 'hr', 'iframe'];
            return !element.closest('svg') && !element.closest('canvas') && !(meaningfulEmptyTags.indexOf(tagName) > -1);
        });
        for (let i: number = 0; i < filteredEmptyElements.length; i++) {
            let lineWithDiv: boolean = true;
            const currentEmptyElem: HTMLElement = filteredEmptyElements[i as number] as HTMLElement;
            if (currentEmptyElem.tagName === 'DIV') {
                lineWithDiv = (currentEmptyElem as HTMLElement).style.borderBottom === 'none' ||
                currentEmptyElem.style.borderBottom === '' ? true : false;
            }
            if (currentEmptyElem.nodeName === 'COL') {
                const colGroup: HTMLElement = currentEmptyElem.parentElement as HTMLElement;
                detach(colGroup);
                continue;
            }
            const isEmptyElement: boolean = !isNOU(emptyElemet) && currentEmptyElem === emptyElemet;
            if (CONSTANT.SELF_CLOSING_TAGS.indexOf(currentEmptyElem.tagName.toLowerCase()) < 0 && lineWithDiv && !isEmptyElement) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(
                    currentEmptyElem, ignoreBlockNodes);
                if (!isNOU(detachableElement) && !(detachableElement.nodeType === Node.ELEMENT_NODE && detachableElement.nodeName.toUpperCase() === 'TEXTAREA')) {
                    detach(detachableElement);
                }
            }
        }
    }

    private static closestEle(element: Element | Node, editNode: Element): Element {
        let el: Element = <Element>element;
        if (closest(el, 'li')) {
            return closest(el, 'li');
        }
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNOU((el.parentNode as Element).tagName) &&
                        (CONSTANT.IGNORE_BLOCK_TAGS.indexOf((el.parentNode as Element).tagName.toLocaleLowerCase()) !== -1
                        || CONSTANT.ALLOWED_TABLE_BLOCK_TAGS.indexOf((el.parentNode as Element).tagName.toLocaleLowerCase()) !== -1))) {
                return el;
            }
            el = <Element>el.parentNode;
        }
        return null;
    }
    private static insertTableInList(range: Range, insertNode: HTMLTableElement,
                                     parentNode: Node, currentNode: Node,
                                     nodeCutter: NodeCutter, lastclosestParentNode: HTMLElement, editNode: HTMLElement): void {
        const totalLi: number = !isNOU(closest(parentNode, 'ul,ol')) ? closest(parentNode, 'ul,ol').querySelectorAll('li').length : 0;
        const preNode: HTMLElement = nodeCutter.SplitNode(range, parentNode as HTMLElement, true);
        const sibNode: HTMLElement = preNode.previousElementSibling as HTMLElement;
        const nextSibNode: HTMLElement = !isNOU(lastclosestParentNode) ? closest(lastclosestParentNode, 'li') as HTMLElement : null;
        const nextElementSiblingValue: string = !isNOU(nextSibNode) ? nextSibNode.innerHTML : null;
        if (!isNOU(sibNode) && !isNOU(closest(sibNode, 'ol,ul')) && closest(sibNode, 'ol,ul').querySelectorAll('li').length > totalLi) {
            sibNode.appendChild(insertNode);
            range.deleteContents();
            if (preNode.childNodes.length > 0) {
                this.moveChildNodes(preNode, sibNode);
            }
            if ((parentNode !== lastclosestParentNode) && !isNOU(nextElementSiblingValue)
                && nextElementSiblingValue !== nextSibNode.innerHTML) {
                this.moveChildNodes(nextSibNode, sibNode);
            }
        }
        else {
            range.deleteContents();
            preNode.insertBefore(insertNode, preNode.firstChild);
            if (parentNode !== lastclosestParentNode) {
                this.moveChildNodes(lastclosestParentNode, parentNode as HTMLElement);
            }
        }
        this.removeEmptyNextLI(closest(insertNode, 'li') as HTMLElement);
        insertNode.classList.add('ignore-table');
    }
    private static moveChildNodes(source: HTMLElement, target: HTMLElement): void {
        while (!isNOU(source) && !isNOU(source.firstChild)) {
            target.appendChild(source.firstChild);
        }
    }
    private static alignCheck (editNode: HTMLElement): void {
        const spanAligns: NodeListOf<Element> = editNode.querySelectorAll('span[style*="text-align"]');
        for (let i: number = 0; i < spanAligns.length; i++) {
            const spanAlign: HTMLElement = spanAligns[i as number] as HTMLElement;
            if (spanAlign) {
                const blockAlign: HTMLElement = this.getImmediateBlockNode(spanAlign, null) as HTMLElement;
                if (blockAlign) {
                    let totalSpanText: string = '';
                    for (let j: number = 0; j < spanAligns.length; j++) {
                        const span: HTMLElement = spanAligns[j as number] as HTMLElement;
                        if (blockAlign.contains(span)) {
                            totalSpanText += span.textContent;
                        }
                    }
                    if (blockAlign.textContent.trim() === totalSpanText.trim()) {
                        blockAlign.style.textAlign = spanAlign.style.textAlign;
                    }
                }
            }
        }
    }
    private static removeListfromPaste (range: Range): void {
        range.deleteContents();
        const value: Node = range.startContainer;
        if (!isNOU(value) && value.nodeName === 'LI' && !isNOU(value.parentElement) && (value.parentElement.nodeName === 'OL' || value.parentElement.nodeName === 'UL') && value.textContent.trim() === '') {
            (value.parentElement as HTMLElement).querySelectorAll('li').forEach((item: HTMLLIElement) => {
                if (item.textContent.trim() === '' && item !== value) {
                    item.remove();
                }
            });
        }
    }
}
