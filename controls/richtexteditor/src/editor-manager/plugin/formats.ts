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
 * @hidden
 * @deprecated
 */
export class Formats {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.FORMAT_TYPE, this.applyFormats, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
    }

    private getParentNode(node: Node): Node {
        for (; node.parentNode && node.parentNode !== this.parent.editableElement; null) {
            node = node.parentNode;
        }
        return node;
    }

    private onKeyDown(e: IHtmlSubCommands): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let startCon: Node = (range.startContainer.textContent.length === 0 || range.startContainer.nodeName === 'PRE')
        ? range.startContainer : range.startContainer.parentElement;
        let endCon: Node = (range.endContainer.textContent.length === 0 || range.endContainer.nodeName === 'PRE')
        ? range.endContainer : range.endContainer.parentElement;
        let preElem: Element = closest(startCon, 'pre');
        let endPreElem: Element = closest(endCon, 'pre');
        let liParent: boolean = !isNOU(preElem) && !isNOU(preElem.parentElement) && preElem.parentElement.tagName === 'LI';
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
            let lastEmpty: Node = range.startContainer.childNodes[range.endOffset];
            let lastBeforeBr: Node = range.startContainer.childNodes[range.endOffset - 1];
            let startParent: Node = range.startContainer;
            if (!isNOU(lastEmpty) && !isNOU(lastBeforeBr) && isNOU(lastEmpty.nextSibling) &&
            lastEmpty.nodeName === 'BR' && lastBeforeBr.nodeName === 'BR') {
                this.paraFocus(range.startContainer as Element);
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

    private removeCodeContent(range: Range): void {
        let regEx: RegExp = new RegExp(String.fromCharCode(65279), 'g');
        if (!isNOU(range.endContainer.textContent.match(regEx))) {
            let pointer: number = range.endContainer.textContent.charCodeAt(range.endOffset - 1) === 65279 ?
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

    private paraFocus(referNode: Element): void {
        let pTag: HTMLElement = createElement('p');
        pTag.innerHTML = '<br>';
        this.parent.domNode.insertAfter(pTag, referNode);
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, pTag, 0);
    }

    private isNotEndCursor(preElem: Element, range: Range): void {
        let nodeCutter: NodeCutter = new NodeCutter();
        let isEnd: boolean = range.startOffset === preElem.lastChild.textContent.length &&
        preElem.lastChild.textContent === range.startContainer.textContent;
        //Cursor at start point
        if (preElem.textContent.indexOf(range.startContainer.textContent) === 0 &&
        ((range.startOffset === 0 && range.endOffset === 0) || range.startContainer.nodeName === 'PRE')) {
            this.insertMarker(preElem, range);
            let brTag: HTMLElement = createElement('br');
            preElem.childNodes[range.endOffset].parentElement.insertBefore(brTag, preElem.childNodes[range.endOffset]);
        } else {
            //Cursor at middle
            let cloneNode: HTMLElement = nodeCutter.SplitNode(range, preElem as HTMLElement, true) as HTMLElement;
            this.insertMarker(preElem, range);
            let previousSib: Element = preElem.previousElementSibling;
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
        let markerElem: Element = this.parent.editableElement.querySelector('.tempSpan');
        let mrkParentElem: HTMLElement = markerElem.parentElement;
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
                let brElm : HTMLElement = createElement('br');
                this.parent.domNode.insertAfter(brElm, markerElem);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, markerElem, 0);
                detach(markerElem);
            }
        } else {
            isEmpty ? this.focusSelectionParent(markerElem, mrkParentElem) : detach(markerElem);
        }
    }

    private focusSelectionParent(markerElem: Element, tempSpanPElem: HTMLElement): void {
        detach(markerElem);
        tempSpanPElem.innerHTML = '\u200B';
        this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, tempSpanPElem, 0);
    }

    private insertMarker(preElem: Element, range: Range): void {
        let tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
        if (range.startContainer.nodeName === 'PRE') {
            preElem.childNodes[range.endOffset].parentElement.insertBefore(tempSpan, preElem.childNodes[range.endOffset]);
        } else {
            range.startContainer.parentElement.insertBefore(tempSpan, range.startContainer);
        }
    }

    private applyFormats(e: IHtmlSubCommands): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let isSelectAll: boolean = false;
        if (this.parent.editableElement === range.endContainer &&
        !isNOU(this.parent.editableElement.children[range.endOffset - 1]) &&
        this.parent.editableElement.children[range.endOffset - 1].tagName === 'TABLE') {
            isSelectAll = true;
        }
        let save: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.parent.domNode.setMarker(save);
        let formatsNodes: Node[] = this.parent.domNode.blockNodes();
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
                (parentNode.tagName === 'LI' && e.subCommand.toLowerCase() !== 'pre') ||
                (parentNode.tagName === 'TABLE' && e.subCommand.toLowerCase() === 'pre')) {
                continue;
            }
            this.cleanFormats(parentNode, e.subCommand);
            let replaceNode: string = (e.subCommand.toLowerCase() === 'pre' &&  parentNode.tagName.toLowerCase() === 'pre') ?
            'p' : e.subCommand;
            let replaceTag: string = this.parent.domNode.createTagString(
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
        if (isIDevice()) { setEditFrameFocus(this.parent.editableElement, e.selector); }
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

    private preFormatMerge(): void {
        let preNodes: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('PRE');
        if (!isNOU(preNodes)) {
            for (let i: number = 0; i < preNodes.length; i++) {
                let previousSib: Element = (preNodes[i] as HTMLElement).previousElementSibling;
                if (!isNOU(previousSib) && previousSib.tagName === 'PRE') {
                    previousSib.insertAdjacentHTML('beforeend', '<br>' + (preNodes[i] as HTMLElement).innerHTML);
                    detach(preNodes[i]);
                }
            }
        }
    }

    private cleanFormats(element: Element, tagName: string): void {
        let ignoreAttr: string[] = ['display', 'font-size', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'font-weight'];
        tagName = tagName.toLowerCase();
        for (let i: number = 0; i < ignoreAttr.length && (tagName !== 'p' && tagName !== 'blockquote' && tagName !== 'pre'); i++) {
            (element as HTMLElement).style.removeProperty(ignoreAttr[i]);
        }
    }
}