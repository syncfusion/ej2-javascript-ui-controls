import { EditorManager } from './../base/editor-manager';
import { NodeSelection } from './../../selection';
import { IHtmlSubCommands } from './../base/interface';
import * as EVENTS from './../../common/constant';
import { isNullOrUndefined as isNOU, detach, createElement, closest } from '@syncfusion/ej2-base';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { markerClassName } from './dom-node';
import { NodeCutter } from './nodecutter';
import { EnterKeyAction } from '../../rich-text-editor/actions/enter-key';
/**
 * Formats internal component
 *
 * @hidden
 * @deprecated
 */
export class Formats {
    private parent: EditorManager;
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
    }

    private getParentNode(node: Node): Node {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
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
    }

    private onKeyDown(e: IHtmlSubCommands): void {
        if (e.event.which === 13) {
            let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            const startCon: Node = (range.startContainer.textContent.length === 0 || range.startContainer.nodeName === 'PRE')
                ? range.startContainer : range.startContainer.parentElement;
            const endCon: Node = (range.endContainer.textContent.length === 0 || range.endContainer.nodeName === 'PRE')
                ? range.endContainer : range.endContainer.parentElement;
            const preElem: Element = closest(startCon, 'pre');
            const endPreElem: Element = closest(endCon, 'pre');
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
                startParent.textContent.length === 1) || startParent.textContent.length === 0 ) {
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
    }

    private removeCodeContent(range: Range): void {
        const regEx: RegExp = new RegExp(String.fromCharCode(65279), 'g');
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
                const brElm : HTMLElement = createElement('br');
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
        let formatsNodes: Node[] = this.parent.domNode.blockNodes();
        if (e.enterAction === 'BR') {
            this.setSelectionBRConfig();
            const allSelectedNode: Node[] = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument);
            const selectedNodes: Node[] = this.parent.nodeSelection.getSelectionNodes(allSelectedNode);
            const currentFormatNodes: Node[] = [];
            if (selectedNodes.length === 0) {
                selectedNodes.push(formatsNodes[0]);
            }
            for (let i: number = 0; i < selectedNodes.length; i++) {
                let currentNode: Node = selectedNodes[i];
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
                if (!this.parent.domNode.isBlockNode(currentFormatNodes[i] as Element)) {
                    let currentNode: Node = currentFormatNodes[i];
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
        for (let i: number = 0; i < formatsNodes.length; i++) {
            let parentNode: Element;
            let replaceHTML: string;
            if (e.subCommand.toLowerCase() === 'blockquote') {
                parentNode = this.getParentNode(formatsNodes[i]) as Element;
                replaceHTML = this.parent.domNode.isList(parentNode) ||
                    parentNode.tagName === 'TABLE' ? parentNode.outerHTML : parentNode.innerHTML;
            } else {
                parentNode = formatsNodes[i] as Element;
                replaceHTML = parentNode.innerHTML;
            }
            if ((e.subCommand.toLowerCase() === parentNode.tagName.toLowerCase() &&
                (e.subCommand.toLowerCase() !== 'pre' ||
                (!isNOU(e.exeValue) && e.exeValue.name === 'dropDownSelect'))) ||
                isNOU(parentNode.parentNode) ||
                (parentNode.tagName === 'TABLE' && e.subCommand.toLowerCase() === 'pre')) {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            const replaceNode: string = (e.subCommand.toLowerCase() === 'pre' &&  parentNode.tagName.toLowerCase() === 'pre') ?
                'p' : e.subCommand;
            const replaceTag: string = this.parent.domNode.createTagString(
                replaceNode, parentNode as Element, replaceHTML.replace(/>\s+</g, '><'));
            if (parentNode.tagName === 'LI') {
                parentNode.innerHTML = '';
                parentNode.insertAdjacentHTML('beforeend', replaceTag);
            } else {
                this.parent.domNode.replaceWith(parentNode, replaceTag);
            }
        }
        this.preFormatMerge();
        let startNode: Node = this.parent.editableElement.querySelector('.' + markerClassName.startSelection);
        let endNode: Node = this.parent.editableElement.querySelector('.' + markerClassName.endSelection);
        if (!isNOU(startNode) && !isNOU(endNode)) {
            startNode = startNode.lastChild;
            endNode = endNode.lastChild;
        }
        save = this.parent.domNode.saveMarker(save, null);
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
        if (isNOU(endElem)){
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
                const previousSib: Element = (preNodes[i] as HTMLElement).previousElementSibling;
                if (!isNOU(previousSib) && previousSib.tagName === 'PRE') {
                    previousSib.insertAdjacentHTML('beforeend', '<br>' + (preNodes[i] as HTMLElement).innerHTML);
                    detach(preNodes[i]);
                }
            }
        }
    }

    private cleanFormats(element: Element, tagName: string): void {
        const ignoreAttr: string[] = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (let i: number = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            (element as HTMLElement).style.removeProperty(ignoreAttr[i]);
        }
    }
}
