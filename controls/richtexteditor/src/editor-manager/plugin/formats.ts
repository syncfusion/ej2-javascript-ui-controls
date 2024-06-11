import { EditorManager } from './../base/editor-manager';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';
import { isNullOrUndefined as isNOU, detach, createElement, closest } from '@syncfusion/ej2-base';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { markerClassName } from './dom-node';
import { NodeCutter } from './nodecutter';
/**
 * Formats internal component
 *
 * @hidden
 * @deprecated
 */
export class Formats {
    private parent: EditorManager;
    private blockquotePrevent: boolean = false;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the parent element.
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.FORMAT_TYPE, this.applyFormats, this);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, this.onKeyUp, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
        this.parent.observer.on(EVENTS.BLOCKQUOTE_LIST_HANDLE, this.blockQuotesHandled, this);
    }

    private getParentNode(node: Node): Node {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
    }
    private blockQuotesHandled(): void {
        this.blockquotePrevent = true;
    }
    private onKeyUp(e: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const endCon: Node = range.endContainer;
        const lastChild: Node = endCon.lastChild;
        if (e.event.which === 13 && range.startContainer === endCon && endCon.nodeType !== 3) {
            const pTag: HTMLElement = createElement('p');
            pTag.innerHTML = '<br>';
            if (!isNOU(lastChild) && lastChild && lastChild.nodeName === 'BR' && (lastChild.previousSibling && lastChild.previousSibling.nodeName === 'TABLE')) {
                endCon.replaceChild(pTag, lastChild);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, pTag, 0);
            } else {
                const brNode: Node = this.parent.nodeSelection.getSelectionNodeCollectionBr(range)[0];
                if (!isNOU(brNode) && brNode.nodeName === 'BR' && (brNode.previousSibling && brNode.previousSibling.nodeName === 'TABLE')) {
                    endCon.replaceChild(pTag, brNode);
                    this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, pTag, 0);
                }
            }
        }
        if (e.enterAction !== 'BR' && !isNOU(range.startContainer) && !isNOU(range.startContainer.parentElement) && range.startContainer === range.endContainer && range.startContainer.nodeName === '#text' && range.startContainer.parentElement.classList.contains('e-content') && range.startContainer.parentElement.isContentEditable) {
            const pTag: HTMLElement = createElement(e.enterAction as string);
            range.startContainer.parentElement.insertBefore(pTag, range.startContainer);
            pTag.appendChild(range.startContainer);
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, pTag, 1);
        }
    }
    private getBlockParent(node: Node, endNode: Element): Node {
        let currentParent: Node = node;
        while (node !== endNode) {
            currentParent = node;
            node = node.parentElement;
        }
        return currentParent;
    }

    private onKeyDown(e: IHtmlSubCommands): void {
        if (e.event.which === 13 && !this.blockquotePrevent) {
            let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            const startCon: Node = (range.startContainer.textContent.length === 0 || range.startContainer.nodeName === 'PRE')
                ? range.startContainer : range.startContainer.parentElement;
            const endCon: Node = (range.endContainer.textContent.length === 0 || range.endContainer.nodeName === 'PRE')
                ? range.endContainer : range.endContainer.parentElement;
            const preElem: Element = closest(startCon, 'pre');
            const endPreElem: Element = closest(endCon, 'pre');
            const blockquoteEle: Element = closest(startCon, 'blockquote');
            const endBlockquoteEle: Element = closest(endCon, 'blockquote');
            const liParent: boolean = !isNOU(preElem) && !isNOU(preElem.parentElement) && preElem.parentElement.tagName === 'LI';
            if (liParent) {
                return;
            }
            if (((isNOU(preElem) && !isNOU(endPreElem)) || (!isNOU(preElem) && isNOU(endPreElem)))) {
                e.event.preventDefault();
                this.deleteContent(range);
                this.removeCodeContent(range);
                range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, endCon as Element, 0);
            }
            if (e.event.which === 13 && ((!isNOU(blockquoteEle) && !isNOU(endBlockquoteEle)) ||
                (!isNOU(blockquoteEle) && isNOU(endBlockquoteEle)))) {
                const startParent: Node = this.getBlockParent(range.startContainer, blockquoteEle);
                if ((startParent.textContent.charCodeAt(0) === 8203 &&
                    startParent.textContent.length === 1) || (startParent.textContent.length === 0 &&
                    (startParent as HTMLElement).querySelectorAll('img').length === 0 &&
                    (startParent as HTMLElement).querySelectorAll('table').length === 0)) {
                    e.event.preventDefault();
                    if (isNOU((startParent as HTMLElement).nextElementSibling)) {
                        this.paraFocus(startParent.parentElement === this.parent.editableElement ?
                            (startParent as HTMLElement) : startParent.parentElement); //Revert from blockquotes while pressing enter key
                    } else {
                        const nodeCutter: NodeCutter = new NodeCutter();
                        const newElem: Node = nodeCutter.SplitNode(
                            range, (startParent.parentElement as HTMLElement), false).cloneNode(true);
                        this.paraFocus(startParent.parentElement === this.parent.editableElement ?
                            (startParent as HTMLElement) : startParent.parentElement);
                    }
                }
            }
            if (e.event.which === 13 && !isNOU(preElem) && !isNOU(endPreElem)) {
                e.event.preventDefault();
                this.deleteContent(range);
                this.removeCodeContent(range);
                range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
                const lastEmpty: Node = range.startContainer.childNodes[range.endOffset];
                const lastBeforeBr: Node = range.startContainer.childNodes[range.endOffset - 1];
                let startParent: Node = range.startContainer;
                if (!isNOU(lastEmpty) && !isNOU(lastBeforeBr) && isNOU(lastEmpty.nextSibling) &&
                    lastEmpty.nodeName === 'BR' && lastBeforeBr.nodeName === 'BR') {
                    this.paraFocus(range.startContainer as Element, e.enterAction);
                } else if ((startParent.textContent.charCodeAt(0) === 8203 &&
                    startParent.textContent.length === 1) || startParent.textContent.length === 0) {
                    //Double enter with any parent tag for the node
                    while (startParent.parentElement.nodeName !== 'PRE' &&
                        (startParent.textContent.length === 1 || startParent.textContent.length === 0)) {
                        startParent = startParent.parentElement;
                    }
                    if (!isNOU(startParent.previousSibling) && startParent.previousSibling.nodeName === 'BR' &&
                        isNOU(startParent.nextSibling)) {
                        this.paraFocus(startParent.parentElement);
                    } else {
                        this.isNotEndCursor(preElem, range);
                    }
                } else {
                    //Cursor at start and middle
                    this.isNotEndCursor(preElem, range);
                }
            }
        }
        this.blockquotePrevent = false;
    }

    private removeCodeContent(range: Range): void {
        const regEx: RegExp = new RegExp('\uFEFF', 'g');
        if (!isNOU(range.endContainer.textContent.match(regEx))) {
            const pointer: number = range.endContainer.textContent.charCodeAt(range.endOffset - 1) === 65279 ?
                range.endOffset - 2 : range.endOffset;
            range.endContainer.textContent = range.endContainer.textContent.replace(regEx, '');
            if (range.endContainer.textContent === '') {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, range.endContainer.parentElement, 0);
            } else {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, range.endContainer as Element, pointer);
            }
        }
    }

    private deleteContent(range: Range): void {
        if (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset) {
            range.deleteContents();
        }
    }

    private paraFocus(referNode: Element, enterAction?: string): void {
        let insertTag: HTMLElement;
        if (enterAction === 'DIV') {
            insertTag = createElement('div');
            insertTag.innerHTML = '<br>';
        } else if (enterAction === 'BR') {
            insertTag = createElement('br');
        } else {
            insertTag = createElement('p');
            insertTag.innerHTML = '<br>';
        }
        this.parent.domNode.insertAfter(insertTag, referNode);
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, insertTag, 0);
        detach(referNode.lastChild);
    }

    private isNotEndCursor(preElem: Element, range: Range): void {
        const nodeCutter: NodeCutter = new NodeCutter();
        const isEnd: boolean = range.startOffset === preElem.lastChild.textContent.length &&
            preElem.lastChild.textContent === range.startContainer.textContent;
        //Cursor at start point
        if (preElem.textContent.indexOf(range.startContainer.textContent) === 0 &&
            ((range.startOffset === 0 && range.endOffset === 0) || range.startContainer.nodeName === 'PRE')) {
            this.insertMarker(preElem, range);
            const brTag: HTMLElement = createElement('br');
            preElem.childNodes[range.endOffset].parentElement.insertBefore(brTag, preElem.childNodes[range.endOffset]);
        } else {
            //Cursor at middle
            const cloneNode: HTMLElement = nodeCutter.SplitNode(range, preElem as HTMLElement, true) as HTMLElement;
            this.insertMarker(preElem, range);
            const previousSib: Element = preElem.previousElementSibling;
            if (previousSib.tagName === 'PRE') {
                previousSib.insertAdjacentHTML('beforeend', '<br>' + (cloneNode as HTMLElement).innerHTML);
                detach(preElem);
            }
        }
        //To place the cursor position
        this.setCursorPosition(isEnd, preElem);
    }
    private setCursorPosition(isEnd: boolean, preElem: Element): void {
        let isEmpty: boolean = false;
        const markerElem: Element = this.parent.editableElement.querySelector('.tempSpan');
        const mrkParentElem: HTMLElement = markerElem.parentElement;
        // eslint-disable-next-line
        markerElem.parentNode.textContent === '' ? isEmpty = true :
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
        if (isEnd) {
            if (isEmpty) {
                //Enter press when pre element is empty
                if (mrkParentElem === preElem) {
                    this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
                    detach(markerElem);
                } else {
                    this.focusSelectionParent(markerElem, mrkParentElem);
                }
            } else {
                const brElm: HTMLElement = createElement('br');
                this.parent.domNode.insertAfter(brElm, markerElem);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
                detach(markerElem);
            }
        } else {
            // eslint-disable-next-line
            isEmpty ? this.focusSelectionParent(markerElem, mrkParentElem) : detach(markerElem);
        }
    }

    private focusSelectionParent(markerElem: Element, tempSpanPElem: HTMLElement): void {
        detach(markerElem);
        tempSpanPElem.innerHTML = '\u200B';
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, tempSpanPElem, 0);
    }

    private insertMarker(preElem: Element, range: Range): void {
        const tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
        if (range.startContainer.nodeName === 'PRE') {
            preElem.childNodes[range.endOffset].parentElement.insertBefore(tempSpan, preElem.childNodes[range.endOffset]);
        } else {
            range.startContainer.parentElement.insertBefore(tempSpan, range.startContainer);
        }
    }

    private applyFormats(e: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let isSelectAll: boolean = false;
        if (this.parent.editableElement === range.endContainer &&
            !isNOU(this.parent.editableElement.children[range.endOffset - 1]) &&
            this.parent.editableElement.children[range.endOffset - 1].tagName === 'TABLE' && !range.collapsed) {
            isSelectAll = true;
        }
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let formatsNodes: Node[] = this.parent.domNode.blockNodes(true);
        if (e.enterAction === 'BR') {
            this.setSelectionBRConfig();
            const allSelectedNode: Node[] = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument);
            const selectedNodes: Node[] = this.parent.nodeSelection.getSelectionNodes(allSelectedNode);
            const currentFormatNodes: Node[] = [];
            if (selectedNodes.length === 0) {
                selectedNodes.push(formatsNodes[0]);
            }
            for (let i: number = 0; i < selectedNodes.length; i++) {
                let currentNode: Node = selectedNodes[i as number];
                let previousCurrentNode: Node;
                while (!this.parent.domNode.isBlockNode(currentNode as Element) && currentNode !== this.parent.editableElement) {
                    previousCurrentNode = currentNode;
                    currentNode = currentNode.parentElement;
                }
                if (this.parent.domNode.isBlockNode(currentNode as Element) && currentNode === this.parent.editableElement) {
                    currentFormatNodes.push(previousCurrentNode);
                }
            }
            for (let i: number = 0; i < currentFormatNodes.length; i++) {
                if (!this.parent.domNode.isBlockNode(currentFormatNodes[i as number] as Element)) {
                    let currentNode: Node = currentFormatNodes[i as number];
                    let previousNode: Node = currentNode;
                    while (currentNode === this.parent.editableElement) {
                        previousNode = currentNode;
                        currentNode = currentNode.parentElement;
                    }
                    let tempElem: HTMLElement;
                    if (this.parent.domNode.isBlockNode(previousNode.parentElement) &&
                        previousNode.parentElement === this.parent.editableElement) {
                        tempElem = createElement('div');
                        previousNode.parentElement.insertBefore(tempElem, previousNode);
                        tempElem.appendChild(previousNode);
                        if (previousNode.textContent.length === 0) {
                            previousNode.appendChild(createElement('br'));
                        }
                    } else {
                        tempElem = previousNode as HTMLElement;
                    }
                    let preNode: Node = tempElem.previousSibling;
                    while (!isNOU(preNode) && preNode.nodeName !== 'BR' &&
                        !this.parent.domNode.isBlockNode(preNode as Element)) {
                        tempElem.firstChild.parentElement.insertBefore(preNode, tempElem.firstChild);
                        preNode = tempElem.previousSibling;
                    }
                    if (!isNOU(preNode) && preNode.nodeName === 'BR') {
                        detach(preNode);
                    }
                    let postNode: Node = tempElem.nextSibling;
                    while (!isNOU(postNode) && postNode.nodeName !== 'BR' &&
                        !this.parent.domNode.isBlockNode(postNode as Element)) {
                        tempElem.appendChild(postNode);
                        postNode = tempElem.nextSibling;
                    }
                    if (!isNOU(postNode) && postNode.nodeName === 'BR') {
                        detach(postNode);
                    }
                }
            }
            this.setSelectionBRConfig();
            formatsNodes = this.parent.domNode.blockNodes();
        }
        let isWholeBlockquoteNotSelected: boolean = false;
        let isPartiallySelected: boolean = false;
        for (let i: number = 0; i < formatsNodes.length; i++) {
            if (isNOU(closest(formatsNodes[0], 'blockquote')) ||
                isNOU(closest(formatsNodes[formatsNodes.length - 1], 'blockquote'))) {
                isPartiallySelected = true;
            }
        }
        for (let i: number = 0; i < formatsNodes.length; i++) {
            let parentNode: Element;
            let replaceHTML: string;
            if (e.subCommand.toLowerCase() === 'blockquote') {
                parentNode = this.getParentNode(formatsNodes[i as number]) as Element;
                if (e.enterAction === 'BR') {
                    replaceHTML = parentNode.innerHTML;
                } else {
                    if (!isNOU(closest(formatsNodes[i as number], 'table')) && this.parent.editableElement.contains(closest(formatsNodes[i as number], 'table'))) {
                        replaceHTML = !isNOU(closest((formatsNodes[i as number]), 'blockquote')) ?
                            closest((formatsNodes[i as number]), 'blockquote').outerHTML :
                            ((formatsNodes[i as number]) as Element).outerHTML;
                    } else {
                        replaceHTML = parentNode.outerHTML;
                    }
                }
            } else {
                parentNode = formatsNodes[i as number] as Element;
                replaceHTML = parentNode.innerHTML;
            }
            if ((e.subCommand.toLowerCase() === 'blockquote' && e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() && isPartiallySelected) ||
                ((e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() &&
                (e.subCommand.toLowerCase() !== 'pre' && e.subCommand.toLowerCase() !== 'blockquote' ||
                    (!isNOU(e.exeValue) && e.exeValue.name === 'dropDownSelect'))) ||
                isNOU(parentNode.parentNode) || (parentNode.tagName === 'TABLE' && e.subCommand.toLowerCase() === 'pre'))) {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            const replaceNode: string = (e.subCommand.toLowerCase() === 'pre' && parentNode.tagName.toLowerCase() === 'pre') ?
                'p' : e.subCommand;
            const isToggleBlockquoteList: boolean = e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() &&
                e.subCommand.toLowerCase() === 'blockquote' && this.parent.domNode.isList((parentNode as HTMLElement).firstElementChild);
            const ensureNode: Element = parentNode.tagName === 'TABLE' ?
                (!isNOU(closest((formatsNodes[i as number]), 'blockquote')) ? closest((formatsNodes[i as number]), 'blockquote') : parentNode) : parentNode;
            const isToggleBlockquote: boolean = (e.subCommand.toLowerCase() === ensureNode.tagName.toLowerCase())
                && e.subCommand.toLowerCase() === 'blockquote';
            let replaceTag: string;
            if (isToggleBlockquoteList) {
                replaceTag = replaceHTML.replace('<blockquote>', '').replace('</blockquote>', '');
            } else if (isToggleBlockquote && closest(formatsNodes[0], 'blockquote') && closest(formatsNodes[formatsNodes.length - 1], 'blockquote')) {
                if ( isNOU(formatsNodes[0].previousSibling) && isNOU(formatsNodes[formatsNodes.length - 1].nextSibling)) {
                    replaceTag = replaceHTML.replace(/<blockquote[^>]*>|<\/blockquote>/g, '');
                } else {
                    isWholeBlockquoteNotSelected = true;
                    if (i === 0) {
                        const tempCloseSpanElem: HTMLElement = createElement('span');
                        tempCloseSpanElem.classList.add('e-rte-blockquote-close');
                        formatsNodes[i as number].parentNode.insertBefore(tempCloseSpanElem, formatsNodes[i as number]);
                    }
                    if (i === formatsNodes.length - 1) {
                        const tempOpenSpanElem: HTMLElement = createElement('span');
                        tempOpenSpanElem.classList.add('e-rte-blockquote-open');
                        this.parent.domNode.insertAfter(tempOpenSpanElem, formatsNodes[i as number] as Element);
                    }
                }
            } else {
                replaceTag = this.parent.domNode.createTagString(
                    replaceNode, (e.subCommand.toLowerCase() === 'blockquote' ? null : parentNode), replaceHTML.replace(/>\s+</g, '><'));
            }
            if (parentNode.tagName === 'LI') {
                parentNode.innerHTML = '';
                parentNode.insertAdjacentHTML('beforeend', replaceTag);
            } else if (!isWholeBlockquoteNotSelected) {
                const currentTag: Element = ((!isNOU(closest(formatsNodes[i as number], 'table')) && this.parent.editableElement.contains(closest(formatsNodes[i as number], 'table'))) ?
                    (!isNOU(closest((formatsNodes[i as number]), 'blockquote')) ? closest((formatsNodes[i as number]), 'blockquote') : formatsNodes[i as number] as Element) : parentNode);
                this.parent.domNode.replaceWith(currentTag , replaceTag);
            }
        }
        if (isWholeBlockquoteNotSelected) {
            const blockquoteElem: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('.e-rte-blockquote-open, .e-rte-blockquote-close');
            for (let i: number = 0; i < blockquoteElem.length; i++) {
                const blockquoteNode: Element = blockquoteElem[i as number].parentElement;
                let blockquoteContent: string = blockquoteNode.innerHTML;
                blockquoteContent = blockquoteContent.replace(/<span class="e-rte-blockquote-open"><\/span>/g, '<blockquote>');
                blockquoteContent = blockquoteContent.replace(/<span class="e-rte-blockquote-close"><\/span>/g, '</blockquote>');
                if (blockquoteElem[0].parentElement === blockquoteElem[1].parentElement) {
                    this.parent.domNode.replaceWith(
                        blockquoteNode,
                        this.parent.domNode.openTagString(blockquoteNode) +
                        blockquoteContent.trim() + this.parent.domNode.closeTagString(blockquoteNode));
                    break;
                } else if (i === blockquoteElem.length - 1 && !isNOU(blockquoteElem[i as number]) && !isNOU(blockquoteElem[i - 1]) &&
                    blockquoteElem[i as number].parentElement !== blockquoteElem[i - 1].parentElement) {
                    this.parent.domNode.replaceWith(blockquoteNode, blockquoteContent.trim());
                } else {
                    this.parent.domNode.replaceWith(
                        blockquoteNode,
                        this.parent.domNode.openTagString(blockquoteNode) +
                        blockquoteContent.trim() + this.parent.domNode.closeTagString(blockquoteNode));
                }
            }
        }
        this.preFormatMerge();
        this.blockquotesFormatMerge(e.enterAction);
        let startNode: Node = this.parent.editableElement.querySelector('.' + markerClassName.startSelection);
        let endNode: Node = this.parent.editableElement.querySelector('.' + markerClassName.endSelection);
        if (!isNOU(startNode) && !isNOU(endNode)) {
            startNode = startNode.lastChild;
            endNode = endNode.lastChild;
        }
        save = this.parent.domNode.saveMarker(save);
        if (isIDevice()) {
            setEditFrameFocus(this.parent.editableElement, e.selector);
        }
        if (isSelectAll) {
            this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, startNode, endNode, 0, endNode.textContent.length);
        } else {
            save.restore();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes() as Element[]
            });
        }
    }

    private setSelectionBRConfig(): void {
        const startElem: Element = this.parent.editableElement.querySelector('.' + markerClassName.startSelection);
        const endElem: Element = this.parent.editableElement.querySelector('.' + markerClassName.endSelection);
        if (isNOU(endElem)) {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, startElem, 0);
        } else {
            this.parent.nodeSelection.setSelectionText(
                this.parent.currentDocument, startElem, endElem, 0, 0);
        }
    }

    private preFormatMerge(): void {
        const preNodes: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('PRE');
        if (!isNOU(preNodes)) {
            for (let i: number = 0; i < preNodes.length; i++) {
                const previousSib: Element = (preNodes[i as number] as HTMLElement).previousElementSibling;
                if (!isNOU(previousSib) && previousSib.tagName === 'PRE') {
                    previousSib.insertAdjacentHTML('beforeend', '<br>' + (preNodes[i as number] as HTMLElement).innerHTML);
                    detach(preNodes[i as number]);
                }
            }
        }
    }
    private blockquotesFormatMerge(enterAction: string): void {
        const blockquoteNodes: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('BLOCKQUOTE');
        if (!isNOU(blockquoteNodes)) {
            for (let i: number = 0; i < blockquoteNodes.length; i++) {
                if ((blockquoteNodes[i as number] as HTMLElement).innerHTML.trim() === '' ) {
                    detach(blockquoteNodes[i as number]);
                }
                const previousSib: Element = (blockquoteNodes[i as number] as HTMLElement).previousElementSibling;
                if (!isNOU(previousSib) && previousSib.tagName === 'BLOCKQUOTE') {
                    previousSib.insertAdjacentHTML(
                        'beforeend',
                        (enterAction === 'BR' ? '<br>' : '') + (blockquoteNodes[i as number] as HTMLElement).innerHTML);
                    detach(blockquoteNodes[i as number]);
                }
            }
        }
    }

    private cleanFormats(element: Element, tagName: string): void {
        const ignoreAttr: string[] = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (let i: number = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            (element as HTMLElement).style.removeProperty(ignoreAttr[i as number]);
        }
    }
}
