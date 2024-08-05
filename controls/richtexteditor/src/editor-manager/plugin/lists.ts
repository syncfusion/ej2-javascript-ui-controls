import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { createElement, detach, prepend, append, attributes, KeyboardEventArgs, Browser } from '@syncfusion/ej2-base';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { DOMNode, markerClassName } from './dom-node';
import * as EVENTS from './../../common/constant';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { isNullOrUndefined, isNullOrUndefined as isNOU, closest } from '@syncfusion/ej2-base';
import { IAdvanceListItem } from '../../common';

/**
 * Lists internal component
 *
 * @hidden
 * @deprecated
 */
export class Lists {
    private parent: EditorManager;
    private startContainer: Element;
    private endContainer: Element;
    private saveSelection: NodeSelection;
    private domNode: DOMNode;
    private currentAction: string;
    private commonLIParent: Element
    /**
     * Constructor for creating the Lists plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
        this.parent = parent;
        this.domNode = this.parent.domNode;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.LIST_TYPE, this.applyListsHandler, this);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, this.onKeyUp, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler, this);
        this.parent.observer.on(EVENTS.SPACE_ACTION, this.spaceKeyAction, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.LIST_TYPE, this.applyListsHandler);
        this.parent.observer.off(EVENTS.KEY_UP_HANDLER, this.onKeyUp);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler);
        this.parent.observer.off(EVENTS.SPACE_ACTION, this.spaceKeyAction);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }
    private testList(elem: Element): boolean {
        const olListRegex: RegExp[] = [/^[\d]+[.]+$/,
            /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})[.]$/gi,
            /^[a-zA-Z][.]+$/];
        const elementStart: string = !isNullOrUndefined(elem) ? (elem as HTMLElement).innerText.trim().split('.')[0] + '.' : null;
        if (!isNullOrUndefined(elementStart)) {
            for (let i: number = 0; i < olListRegex.length; i++) {
                if (olListRegex[i as number].test(elementStart)) {
                    return true;
                }
            }
        }
        return false;
    }
    private testCurrentList(range: Range): boolean {
        const olListStartRegex: RegExp[] = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            const currentContent : string = range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim();
            for (let i: number = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i as number].test(currentContent) && currentContent.length === 2) {
                    return true;
                }
            }
        }
        return false;
    }
    private spaceList(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        const startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        // eslint-disable-next-line
        const endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        const preElement: Element = startNode.previousElementSibling;
        const nextElement: Element = startNode.nextElementSibling;
        const preElemULStart: string =  !isNullOrUndefined(preElement) ?
            (preElement as HTMLElement).innerText.trim().substring(0, 1) : null;
        const nextElemULStart: string =  !isNullOrUndefined(nextElement) ?
            (nextElement as HTMLElement).innerText.trim().substring(0, 1) : null;
        const startElementOLTest: boolean = this.testCurrentList(range);
        const preElementOLTest : boolean = this.testList(preElement);
        const nextElementOLTest : boolean = this.testList(nextElement);
        if (!preElementOLTest && !nextElementOLTest && preElemULStart !== '*' && nextElemULStart !== '*') {
            const brElement: HTMLElement = createElement('br');
            if (startElementOLTest) {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                if (range.startContainer.nodeName === '#text' && range.startContainer.textContent.length === 0) {
                    this.parent.domNode.insertAfter(brElement, range.startContainer as Element);
                }
                this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                e.event.preventDefault();
            } else if (range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim() === '*' ||
            range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim() === '-') {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                if (range.startContainer.nodeName === '#text' && range.startContainer.textContent.length === 0) {
                    this.parent.domNode.insertAfter(brElement, range.startContainer as Element);
                }
                this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                e.event.preventDefault();
            }
        }
    }
    private enterList(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const startNode: Element = range.startContainer.nodeName === 'LI' ? (range.startContainer as Element) :
            range.startContainer.parentElement.closest('LI');
        const endNode: Element = range.endContainer.nodeName === 'LI' ? (range.endContainer as Element) :
            range.endContainer.parentElement.closest('LI');
        // Checks for Image, Audio , Video Element inside List Element
        let hasMediaElem: boolean = false;
        if (!isNOU(startNode)) {
            const videoElemList : NodeList = startNode.querySelectorAll('.e-video-clickelem');
            const embedVideoElem : boolean = videoElemList.length > 0 && videoElemList[0].childNodes[0].nodeName === 'IFRAME';
            hasMediaElem = startNode.querySelectorAll('IMG').length > 0 || startNode.querySelectorAll('AUDIO').length > 0 || startNode.querySelectorAll('VIDEO').length > 0 || embedVideoElem;
        }
        if (!isNOU(startNode) && !isNOU(endNode) && startNode === endNode && startNode.tagName === 'LI' &&
            startNode.textContent.trim() === '' && !hasMediaElem ) {
            if (startNode.innerHTML.indexOf('&nbsp;') >= 0) {
                return;
            }
            if (startNode.textContent.charCodeAt(0) === 65279) {
                startNode.textContent = '';
            }
            const startNodeParent: HTMLElement = startNode.parentElement;
            const parentOfCurrentOLUL: HTMLElement = startNodeParent.parentElement;
            if (isNOU(parentOfCurrentOLUL.closest('UL')) && isNOU(parentOfCurrentOLUL.closest('OL'))) {
                if (!isNOU(startNode.nextElementSibling)) {
                    const nearBlockNode: Element = this.parent.domNode.blockParentNode(startNode);
                    this.parent.nodeCutter.GetSpliceNode(range, (nearBlockNode as HTMLElement));
                }
                let insertTag: HTMLElement;
                if (e.enterAction === 'DIV') {
                    insertTag = createElement('div');
                    insertTag.innerHTML = '<br>';
                } else if (e.enterAction === 'P') {
                    insertTag = createElement('p');
                    insertTag.innerHTML = '<br>';
                } else {
                    insertTag = createElement('br');
                }
                if (!isNOU(parentOfCurrentOLUL) && parentOfCurrentOLUL.nodeName === 'BLOCKQUOTE') {
                    this.parent.observer.notify('blockquote_list_handled', {});
                }
                this.parent.domNode.insertAfter(insertTag, startNodeParent);
                e.event.preventDefault();
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, insertTag, 0);
                if (startNodeParent.textContent === '' && (startNodeParent.querySelectorAll('audio,video').length === 0 )) {
                    detach(startNodeParent);
                } else {
                    detach(startNode);
                }
            }
            // To handle the nested enter key press in the list for the first LI element
            if (!isNOU(parentOfCurrentOLUL) && (!isNOU(parentOfCurrentOLUL.closest('UL')) || !isNOU(parentOfCurrentOLUL.closest('OL'))) &&
                parentOfCurrentOLUL.nodeName === 'LI' && parentOfCurrentOLUL.style.listStyleType === 'none' &&
                parentOfCurrentOLUL.textContent === '' && startNode.textContent === '' && startNode === startNodeParent.firstElementChild &&
                isNOU(startNode.nextSibling)) {
                detach(startNodeParent);
                parentOfCurrentOLUL.style.removeProperty('list-style-type');
                e.event.preventDefault();
            }
        }
    }

    private backspaceList(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        startNode = startNode.nodeName === 'BR' ? startNode.parentElement : startNode;
        endNode = endNode.nodeName === 'BR' ? endNode.parentElement : endNode;
        if (startNode === endNode && !isNullOrUndefined(closest(startNode, 'li')) &&
            ((startNode.textContent.trim() === '' && startNode.textContent.charCodeAt(0) === 65279) ||
            (startNode.textContent.length === 1 && startNode.textContent.charCodeAt(0) === 8203))) {
            startNode.textContent = '';
        }
        if (startNode === endNode && startNode.tagName === 'LI' && startNode.textContent.length === 0 &&
            isNOU(startNode.previousElementSibling)) {
            startNode.removeAttribute('style');
        }
        if (startNode === endNode && startNode.textContent === '') {
            if (startNode.parentElement.tagName === 'LI' && endNode.parentElement.tagName === 'LI') {
                detach(startNode);
            } else if (startNode.closest('ul') || startNode.closest('ol')) {
                const parentList: HTMLElement = !isNOU(startNode.closest('ul')) ? startNode.closest('ul') : startNode.closest('ol');
                if (parentList.firstElementChild === startNode && !isNOU(parentList.children[1]) &&
                    (parentList.children[1].tagName === 'OL' || parentList.children[1].tagName === 'UL')) {
                    if (parentList.tagName === parentList.children[1].tagName) {
                        while (parentList.children[1].lastChild) {
                            this.parent.domNode.insertAfter(parentList.children[1].lastChild as Element, parentList.children[1]);
                        }
                        detach(parentList.children[1]);
                    } else {
                        parentList.parentElement.insertBefore(parentList.children[1], parentList);
                    }
                }
            }
        } else if (!isNOU(startNode.firstChild) && startNode.firstChild.nodeName === 'BR' &&
        (!isNullOrUndefined(startNode.childNodes[1]) && (startNode.childNodes[1].nodeName === 'UL' ||
        startNode.childNodes[1].nodeName === 'OL'))) {
            const parentList: HTMLElement = !isNOU(startNode.closest('ul')) ? startNode.closest('ul') : startNode.closest('ol');
            if (parentList.tagName === startNode.childNodes[1].nodeName) {
                while (startNode.childNodes[1].lastChild) {
                    this.parent.domNode.insertAfter(startNode.children[1].lastChild as Element, startNode);
                }
                detach(startNode.childNodes[1]);
            } else {
                parentList.parentElement.insertBefore(startNode.children[1], parentList);
            }
        }
        this.removeList(range, e);
        this.firstListBackSpace(range, e);
    }
    private removeList(range: Range, e: IHtmlKeyboardEvent): void{
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = (!isNOU(range.endContainer.parentElement.closest('li')) && range.endContainer.parentElement.closest('li').childElementCount > 1 && range.endContainer.nodeName === '#text') ? range.endContainer as Element :  this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        const parentList: Element = (range.startContainer.nodeName === '#text') ? range.startContainer.parentElement.closest('li') : (range.startContainer as HTMLElement).closest('li');
        let fullContent: string = '';
        if (!isNOU(parentList) && !isNOU(parentList.firstChild)) {
            parentList.childNodes.forEach((e: ChildNode) => {
                fullContent = fullContent + e.textContent;
            });
        }
        startNode = startNode.nodeName === 'BR' ? startNode.parentElement : startNode;
        endNode = endNode.nodeName === 'BR' ? endNode.parentElement : endNode;
        startNode = startNode.nodeName !== 'LI' && !isNOU(startNode.closest('LI')) ? startNode.closest('LI') : startNode;
        endNode = endNode.nodeName !== 'LI' && endNode.nodeName !== '#text' && !isNOU(endNode.closest('LI')) ? endNode.closest('LI') : endNode;
        if (((range.commonAncestorContainer.nodeName === 'OL' || range.commonAncestorContainer.nodeName === 'UL' || range.commonAncestorContainer.nodeName === 'LI') &&
        isNOU(endNode.nextElementSibling) && endNode.textContent.length === range.endOffset &&
        isNOU(startNode.previousElementSibling) && range.startOffset === 0) ||
        (Browser.userAgent.indexOf('Firefox') !== -1 && range.startContainer === range.endContainer && range.startContainer === this.parent.editableElement &&
        range.startOffset === 0 && range.endOffset === 1)) {
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                detach(range.commonAncestorContainer.childNodes[0]);
            } else if (range.commonAncestorContainer.nodeName === 'LI') {
                detach(range.commonAncestorContainer.parentElement);
            } else {
                detach(range.commonAncestorContainer);
            }
            e.event.preventDefault();
        }
        else if (!isNOU(parentList) && !range.collapsed && parentList.textContent === fullContent ){
            range.deleteContents();
            this.parent.editableElement.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                if (!li.firstChild || li.textContent.trim() === '') {
                    li.parentNode.removeChild(li);
                }
            });
            this.parent.editableElement.querySelectorAll('ol').forEach((ol: HTMLOListElement) => {
                if (!ol.firstChild || ol.textContent.trim() === '') {
                    ol.parentNode.removeChild(ol);
                }
            });
            this.parent.editableElement.querySelectorAll('ul').forEach((ul: HTMLUListElement) => {
                if (!ul.firstChild || ul.textContent.trim() === '') {
                    ul.parentNode.removeChild(ul);
                }
            });
            e.event.preventDefault();
        }
    }
    private onKeyUp(e: IHtmlKeyboardEvent): void {
        if (!isNOU(this.commonLIParent) && !isNOU(this.commonLIParent.querySelector('.removeList'))){
            const currentLIElem: Element = this.commonLIParent.querySelector('.removeList');
            while (!isNOU(currentLIElem.firstChild)) {
                this.parent.domNode.insertAfter((currentLIElem.firstChild as Element), currentLIElem);
            }
            detach(currentLIElem);
        }
        if (e.event.keyCode === 13) {
            const listElements: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('UL, OL');
            for (let i: number = 0; i < listElements.length; i++) {
                if (!isNullOrUndefined(listElements[i as number]) && !isNOU(listElements[i as number].parentElement) && !isNullOrUndefined(listElements[i as number].previousElementSibling) && (listElements[i as number].parentElement.nodeName === 'UL' || listElements[i as number].parentElement.nodeName === 'OL')) {
                    listElements[i as number].previousElementSibling.appendChild(listElements[i as number]);
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private firstListBackSpace(range: Range, _e: IHtmlKeyboardEvent): void {
        const startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        if (!isNOU(startNode.closest('OL'))) {
            this.commonLIParent = startNode.closest('OL');
        } else if (!isNOU(startNode.closest('UL'))) {
            this.commonLIParent = startNode.closest('UL');
        }
        if (startNode.nodeName === 'LI' && range.startOffset === 0 && range.endOffset === 0 &&
        isNOU(startNode.previousSibling) && !isNOU(this.commonLIParent) && isNOU(this.commonLIParent.previousSibling) &&
        (isNOU(this.commonLIParent.parentElement.closest('OL')) && isNOU(this.commonLIParent.parentElement.closest('UL')) &&
        isNOU(this.commonLIParent.parentElement.closest('LI')))) {
            const currentElem : HTMLElement = createElement('P');
            currentElem.innerHTML = '&#8203;';
            startNode.classList.add('removeList');
            this.commonLIParent.parentElement.insertBefore(currentElem, this.commonLIParent);
        }
    }

    private keyDownHandler(e: IHtmlKeyboardEvent): void {
        if (e.event.which === 13) {
            this.enterList(e);
        }
        if (e.event.which === 32) {
            this.spaceList(e);
        }
        if (e.event.which === 8) {
            this.backspaceList(e);
        }
        if ((e.event.which === 46 && e.event.action === 'delete') || (e.event.which === 88 && e.event.action === 'cut')) {
            const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            const commonAncestor: Node = range.commonAncestorContainer;
            const startEle: Node = range.startContainer;
            const endEle: Node = range.endContainer;
            const startNode: Node = startEle.nodeType === 3 ? this.domNode.blockParentNode((startEle as Element)) : startEle;
            const endNode: Node = endEle.nodeType === 3 ? this.domNode.blockParentNode((endEle as Element)) : endEle;
            if ((commonAncestor.nodeName === 'UL' || commonAncestor.nodeName === 'OL') && startNode !== endNode
                && (!isNullOrUndefined(closest(startNode, 'ul')) || !isNullOrUndefined(closest(startNode, 'ol')))
                && (!isNullOrUndefined(closest(endNode, 'ul')) || !isNullOrUndefined(closest(endNode, 'ol')))
                && (((commonAncestor as HTMLElement).lastElementChild === closest(endNode, 'li') && commonAncestor.lastChild !== endNode)) && !range.collapsed) {
                if (this.areAllListItemsSelected(commonAncestor as HTMLElement, range)) {
                    detach(commonAncestor);
                }
            }
            this.removeList(range, e);
        }
        if (e.event.which === 9) {
            const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            if (!(e.event.action && e.event.action === 'indent')) {
                this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            }
            let blockNodes: Element[];
            const startOffset: number = range.startOffset;
            const endOffset: number = range.endOffset;
            const startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
            const endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
            if ((startNode === endNode && (startNode.nodeName === 'BR' || startNode.nodeName === '#text') &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((startNode.parentNode as Element).tagName.toLocaleLowerCase()) >= 0)) {
                return;
            } else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.domNode.setMarker(this.saveSelection);
                }
                blockNodes = <Element[]>this.domNode.blockNodes();
            }
            const nodes: Element[] = [];
            let isNested: boolean = true;
            for (let i: number = 0; i < blockNodes.length; i++) {
                if ((blockNodes[i as number].parentNode as Element).tagName === 'LI') {
                    nodes.push(blockNodes[i as number].parentNode as Element);
                } else if (blockNodes[i as number].tagName === 'LI' && (blockNodes[i as number].childNodes[0] as Element).tagName !== 'P' &&
                    ((blockNodes[i as number].childNodes[0] as Element).tagName !== 'OL' &&
                        (blockNodes[i as number].childNodes[0] as Element).tagName !== 'UL')) {
                    nodes.push(blockNodes[i as number]);
                }
            }
            if (nodes.length > 1 || nodes.length === 1) {
                e.event.preventDefault();
                e.event.stopPropagation();
                this.currentAction = this.getAction(nodes[0]);
                if (e.event.shiftKey) {
                    this.revertList(nodes as HTMLElement[], e);
                    this.revertClean();
                } else {
                    isNested = this.nestedList(nodes);
                }
                if (isNested) {
                    this.cleanNode();
                    (this.parent.editableElement as HTMLElement).focus();
                }
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection);
                    this.saveSelection.restore();
                    if (e.callBack) {
                        e.callBack({
                            requestType: this.currentAction,
                            editorMode: 'HTML',
                            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                            elements: this.parent.domNode.blockNodes() as Element[],
                            event: e.event
                        });
                    }
                }
            } else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    if (e.event && e.event.shiftKey && e.event.key === 'Tab') {
                        e.event.action = 'tab';
                    }
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection);
                    this.saveSelection.restore();
                }
            }
        } else {
            switch ((e.event as KeyboardEventArgs).action) {
            case 'ordered-list':
                this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                e.event.preventDefault();
                break;
            case 'unordered-list':
                this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                e.event.preventDefault();
                break;
            }
        }
    }

    private spaceKeyAction(e: IHtmlKeyboardEvent): void {
        if (e.event.which === 32) {
            this.spaceList(e);
        }
    }

    private getAction(element: Element): string {
        const parentNode: Element = element.parentNode as Element;
        return (parentNode.nodeName === 'OL' ? 'OL' : 'UL');
    }

    private revertClean(): void {
        const collectionNodes: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul, ol');
        for (let i: number = 0; i < collectionNodes.length; i++) {
            const listNodes: Element[] = <NodeListOf<Element> & Element[]>collectionNodes[i as number].querySelectorAll('ul, ol');
            if (listNodes.length > 0) {
                for (let j: number = 0; j < listNodes.length; j++) {
                    const prevSibling: Element = listNodes[j as number].previousSibling as Element;
                    if (prevSibling && prevSibling.tagName === 'LI') {
                        prevSibling.appendChild(listNodes[j as number]);
                    }
                }
            }
        }
    }

    private noPreviousElement(elements: Node): void {
        let firstNode: Element;
        let firstNodeOL: Element;
        const siblingListOL: Element[] = <NodeListOf<Element> & Element[]>(elements as Element).querySelectorAll('ol, ul');
        const siblingListLI: NodeListOf<HTMLLIElement> = (elements as Element)
            .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
        const siblingListLIFirst: Node = this.domNode.contents(siblingListLI[0] as Element)[0];
        if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
            firstNode = siblingListLI[0];
        } else {
            firstNodeOL = siblingListOL[0];
        }
        if (firstNode) {
            for (let h: Node = this.domNode.contents(elements as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                const nextSibling: Element = h.nextSibling as Element;
                prepend([h as Element], firstNode);
                setStyleAttribute(elements as HTMLElement, { 'list-style-type': 'none' });
                setStyleAttribute(firstNode as HTMLElement, { 'list-style-type': '' });
                h = nextSibling;
            }
        } else if (firstNodeOL) {
            const nestedElement: Element = createElement('li');
            prepend([nestedElement], firstNodeOL);
            for (let h: Node = this.domNode.contents(elements as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                const nextSibling: Element = h.nextSibling as Element;
                nestedElement.appendChild(h as Element);
                h = nextSibling;
            }
            prepend([firstNodeOL], (elements.parentNode as Element));
            detach(elements);
            const nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], (firstNodeOL.parentNode as Element));
            append([firstNodeOL], nestedElementLI);
        } else {
            const nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], (elements.parentNode as Element));
            const nestedElement: Element = createElement((elements.parentNode as Element).tagName);
            prepend([nestedElement], nestedElementLI);
            append([elements as Element], nestedElement);
        }
    }
    private nestedList(elements: Node[]): boolean {
        let isNested: boolean = false;
        for (let i: number = 0; i < elements.length; i++) {
            const prevSibling: Element = this.domNode.getPreviousNode(elements[i as number] as Element);
            if (prevSibling) {
                isNested = true;
                let firstNode: Element;
                let firstNodeLI: Element;
                const siblingListOL: Element[] = <NodeListOf<Element> & Element[]>(elements[i as number] as Element).querySelectorAll('ol, ul');
                const siblingListLI: NodeListOf<HTMLLIElement> = (elements[i as number] as Element)
                    .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                const siblingListLIFirst: Node = this.domNode.contents(siblingListLI[0] as Element)[0];
                if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
                    firstNodeLI = siblingListLI[0];
                } else {
                    firstNode = siblingListOL[0];
                }
                if (firstNode) {
                    const nestedElement: Element = createElement('li');
                    prepend([nestedElement], firstNode);
                    for (let h: Node = this.domNode.contents(elements[i as number] as Element)[0];
                        h && !this.domNode.isList(h as Element); null) {
                        const nextSibling: Element = h.nextSibling as Element;
                        nestedElement.appendChild(h as Element);
                        h = nextSibling;
                    }
                    append([firstNode], prevSibling);
                    detach(elements[i as number]);
                } else if (firstNodeLI) {
                    if (prevSibling.tagName === 'LI') {
                        for (let h: Node = this.domNode.contents(elements[i as number] as Element)[0];
                            h && !this.domNode.isList(h as Element); null) {
                            const nextSibling: Element = h.nextSibling as Element;
                            prepend([h as Element], firstNodeLI);
                            setStyleAttribute(elements[i as number] as HTMLElement, { 'list-style-type': 'none' });
                            setStyleAttribute(firstNodeLI as HTMLElement, { 'list-style-type': '' });
                            h = nextSibling;
                        }
                        append([firstNodeLI.parentNode as Element], prevSibling);
                        detach(elements[i as number]);
                    }
                } else {
                    if (prevSibling.tagName === 'LI') {
                        const nestedElement: Element = createElement((elements[i as number].parentNode as Element).tagName);
                        (nestedElement as HTMLElement).style.listStyleType =
                            (elements[i as number].parentNode as HTMLElement).style.listStyleType;
                        append([nestedElement], prevSibling as Element);
                        append([elements[i as number] as Element], nestedElement);
                    } else if (prevSibling.tagName === 'OL' || prevSibling.tagName === 'UL') {
                        append([elements[i as number] as Element], prevSibling as Element);
                    }
                }
            } else {
                const element: Node = elements[i as number];
                isNested = true;
                this.noPreviousElement(element);
            }
        }
        return isNested;
    }

    private applyListsHandler(e: IHtmlSubCommands): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        if (Browser.userAgent.indexOf('Firefox') !== -1 && range.startContainer === range.endContainer && range.startContainer === this.parent.editableElement) {
            const startChildNodes: NodeListOf<Node> = range.startContainer.childNodes;
            const startNode: Element = <Element>((startChildNodes[(range.startOffset > 0) ? (range.startOffset - 1) :
                range.startOffset]) || range.startContainer);
            const endNode: Element = <Element>(range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) :
                range.endOffset] || range.endContainer);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let lastSelectionNode: any = endNode.lastChild.nodeName === 'BR' ? (isNOU(endNode.lastChild.previousSibling) ? endNode
                : endNode.lastChild.previousSibling) : endNode.lastChild;
            while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
            lastSelectionNode.nodeName !== 'BR' && lastSelectionNode.nodeName !== 'HR') {
                lastSelectionNode = lastSelectionNode.lastChild;
            }
            this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, startNode, lastSelectionNode, 0,
                                                       lastSelectionNode.textContent.length);
            range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        }
        if (range.startContainer === range.endContainer && range.startContainer === this.parent.editableElement &&
        range.startOffset === range.endOffset && range.startOffset === 0 &&
        this.parent.editableElement.textContent.length === 0 && (this.parent.editableElement.childNodes[0].nodeName !== 'TABLE' &&
        this.parent.editableElement.childNodes[0].nodeName !== 'IMG')) {
            const focusNode: Node = range.startContainer.childNodes[0];
            this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, focusNode, focusNode, 0, 0);
            range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        }
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.currentAction = e.subCommand;
        this.currentAction = e.subCommand = this.currentAction === 'NumberFormatList' ? 'OL' : this.currentAction === 'BulletFormatList' ? 'UL' : this.currentAction;
        this.domNode.setMarker(this.saveSelection);
        let listsNodes: Node[] = this.domNode.blockNodes(true);
        if (e.enterAction === 'BR') {
            this.setSelectionBRConfig();
            this.parent.domNode.convertToBlockNodes(this.parent.domNode.blockNodes(), true);
            this.setSelectionBRConfig();
            listsNodes = this.parent.domNode.blockNodes();
        }
        for (let i: number = 0; i < listsNodes.length; i++) {
            if ((listsNodes[i as number] as Element).tagName === 'TABLE' && !range.collapsed) {
                listsNodes.splice(i, 1);
            }
            if (listsNodes.length > 0 && (listsNodes[i as number] as Element).tagName !== 'LI'
                && 'LI' === (listsNodes[i as number].parentNode as Element).tagName) {
                listsNodes[i as number] = listsNodes[i as number].parentNode;
            }
        }
        this.applyLists(listsNodes as HTMLElement[], this.currentAction, e.selector, e.item, e);
        if (e.callBack) {
            e.callBack({
                requestType: this.currentAction,
                event: e.event,
                editorMode: 'HTML',
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

    private applyLists(elements: HTMLElement[], type: string, selector?: string, item?: IAdvanceListItem, e?: IHtmlSubCommands): void {
        let isReverse: boolean = true;
        if (this.isRevert(elements, type, item) && isNOU(item)) {
            this.revertList(elements, e);
            this.removeEmptyListElements();
        } else {
            this.checkLists(elements, type, item);
            let marginLeftAttribute: string = '';
            if (elements[0].style.marginLeft !== '') {
                marginLeftAttribute = ' style = "margin-left: ' + elements[0].style.marginLeft + ';"';
            }
            for (let i: number = 0; i < elements.length; i++) {
                if (!isNOU(item) && !isNOU(item.listStyle)) {
                    if (item.listStyle === 'listImage') {
                        setStyleAttribute(elements[i as number], { 'list-style-image': item.listImage });
                    }
                    else {
                        setStyleAttribute(elements[i as number], { 'list-style-image': 'none' });
                        setStyleAttribute(elements[i as number], { 'list-style-type': item.listStyle.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase() });
                    }
                }
                elements[i as number].style.removeProperty('margin-left');
                const elemAtt: string = elements[i as number].tagName === 'IMG' || elements[i as number].classList.contains('e-editor-select-start') ? '' : this.domNode.attributes(elements[i as number]);
                if (elements[i as number].getAttribute('contenteditable') === 'true'
                    && elements[i as number].childNodes.length === 1 && elements[i as number].childNodes[0].nodeName === 'TABLE') {
                    const listEle: Element = document.createElement(type);
                    listEle.innerHTML = '<li><br/></li>';
                    elements[i as number].appendChild(listEle);
                } else if ('LI' !== elements[i as number].tagName && isNOU(item) &&
                    elements[i as number].nodeName === 'BLOCKQUOTE') {
                    isReverse = false;
                    const openTag: string = '<' + type + marginLeftAttribute + '>';
                    const closeTag: string = '</' + type + '>';
                    const newTag: string = 'li' + elemAtt;
                    const replaceHTML: string = elements[i as number].innerHTML;
                    const innerHTML: string = this.domNode.createTagString(newTag, null, replaceHTML);
                    const collectionString: string = openTag + innerHTML + closeTag;
                    elements[i as number].innerHTML = collectionString;
                } else if ('LI' !== elements[i as number].tagName && isNOU(item)) {
                    isReverse = false;
                    const openTag: string = '<' + type + marginLeftAttribute + '>';
                    const closeTag: string = '</' + type + '>';
                    const newTag: string = 'li' + elemAtt;
                    const replaceHTML: string = (elements[i as number].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG ?
                        elements[i as number].innerHTML : elements[i as number].outerHTML);
                    const innerHTML: string = this.domNode.createTagString(newTag, null, replaceHTML);
                    const collectionString: string = openTag + innerHTML + closeTag;
                    this.domNode.replaceWith(elements[i as number], collectionString);
                }
                else if (!isNOU(item) && 'LI' !== elements[i as number].tagName) {
                    // eslint-disable-next-line
                    isReverse = false;
                    const currentElemAtt: string = elements[i as number].tagName === 'IMG' ? '' : this.domNode.attributes(elements[i as number]);
                    const openTag: string = '<' + type + currentElemAtt + '>';
                    const closeTag: string = '</' + type + '>';
                    const newTag: string = 'li';
                    const replaceHTML: string = (elements[i as number].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG ?
                        elements[i as number].innerHTML : elements[i as number].outerHTML);
                    const innerHTML: string = this.domNode.createTagString(newTag, null, replaceHTML);
                    const collectionString: string = openTag + innerHTML + closeTag;
                    this.domNode.replaceWith(elements[i as number], collectionString);
                }
            }
        }
        this.cleanNode();
        if (e.enterAction === 'BR') {
            const spansToRemove: NodeListOf<Element> = document.querySelectorAll('span#removeSpan');
            spansToRemove.forEach((span: Element) => {
                const fragment: DocumentFragment = document.createDocumentFragment();
                while (span.firstChild) {
                    fragment.appendChild(span.firstChild);
                }
                span.parentNode.replaceChild(fragment, span);
            });
        }
        (this.parent.editableElement as HTMLElement).focus();
        if (isIDevice()) {
            setEditFrameFocus(this.parent.editableElement, selector);
        }
        this.saveSelection = this.domNode.saveMarker(this.saveSelection);
        this.saveSelection.restore();
    }
    private removeEmptyListElements(): void {
        const listElem: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('ol, ul');
        for (let i: number = 0; i < listElem.length; i++) {
            if (listElem[i as number].textContent.trim() === '') {
                detach(listElem[i as number]);
            }
        }
    }
    private isRevert(nodes: Element[], tagName: string, item?: IAdvanceListItem): boolean {
        let isRevert: boolean = true;
        for (let i: number = 0; i < nodes.length; i++) {
            if (nodes[i as number].tagName !== 'LI') {
                return false;
            }
            if ((nodes[i as number].parentNode as Element).tagName !== tagName ||
            isNOU(item) && (nodes[i as number].parentNode as HTMLElement).style.listStyleType !== '') {
                isRevert = false;
            }
            if ((nodes[i as number].parentNode as Element).tagName === tagName && (nodes[i as number].parentNode as HTMLElement).style.listStyleType !== '') {
                isRevert = true;
            }
        }
        return isRevert;
    }

    private checkLists(nodes: Element[], tagName: string, item?: IAdvanceListItem): void {
        const nodesTemp: Element[] = [];
        for (let i: number = 0; i < nodes.length; i++) {
            const node: Element = nodes[i as number].parentNode as Element;
            if (!isNOU(item) && 'LI' === nodes[i as number].tagName && !isNOU(item.listStyle)) {
                if (item.listStyle === 'listImage') {
                    setStyleAttribute(node as HTMLElement, { 'list-style-image': item.listImage });
                }
                else {
                    setStyleAttribute(node as HTMLElement, { 'list-style-image': 'none' });
                    setStyleAttribute(node as HTMLElement, { 'list-style-type': item.listStyle.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase() });
                }
            }
            if ((nodes[i as number].tagName === 'LI' && node.tagName !== tagName && nodesTemp.indexOf(node) < 0) ||
             (nodes[i as number].tagName === 'LI' && node.tagName === tagName && nodesTemp.indexOf(node) < 0 && item !== null)) {
                nodesTemp.push(node);
            }
            if (isNOU(item) && (node.tagName === tagName ||
            ((node.tagName === 'UL' || node.tagName === 'OL') && node.hasAttribute('style')))) {
                if (node.hasAttribute('style')) {
                    node.removeAttribute('style');
                }
            }
        }
        for (let j: number = nodesTemp.length - 1; j >= 0; j--) {
            const h: Element = nodesTemp[j as number];
            const replace: string = '<' + tagName.toLowerCase() + ' '
                + this.domNode.attributes(h) + '>' + h.innerHTML + '</' + tagName.toLowerCase() + '>';
            this.domNode.replaceWith(nodesTemp[j as number], replace);
        }
    }

    private cleanNode(): void {
        const liParents: Element[] = <Element[] & NodeListOf<Element>>this.parent.editableElement.querySelectorAll('ol + ol, ul + ul');
        let listStyleType: string;
        let firstNodeOL: Element;
        for (let c: number = 0; c < liParents.length; c++) {
            const node: Element = liParents[c as number];
            let toFindtopOlUl: boolean = true;
            let containsListElements: Element = node;
            while (containsListElements.parentElement) {
                if (containsListElements.parentElement && containsListElements.parentElement.tagName !== 'LI' && containsListElements.parentElement.tagName !== 'OL' && containsListElements.parentElement.tagName !== 'UL') {
                    break;
                }
                containsListElements = containsListElements.parentElement;
            }
            if (toFindtopOlUl && (liParents[c as number].parentElement.parentElement.nodeName === 'OL' || liParents[c as number].parentElement.parentElement.nodeName === 'UL')) {
                toFindtopOlUl = false;
                const preElement: HTMLElement = liParents[c as number].parentElement.parentElement;
                listStyleType = preElement.style.listStyleType;
                firstNodeOL = node.previousElementSibling;
            }
            if (this.domNode.isList(node.previousElementSibling as Element) &&
                this.domNode.openTagString(node) === this.domNode.openTagString(node.previousElementSibling as Element)) {
                const contentNodes: Node[] = this.domNode.contents(node);
                for (let f: number = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling.appendChild(contentNodes[f as number]);
                }
                node.parentNode.removeChild(node);
            } else if (!isNOU(node.getAttribute('level'))) {
                if (node.tagName === node.previousElementSibling.tagName) {
                    (node.previousElementSibling.lastChild as HTMLElement).append(node);
                }
            } else if (this.domNode.isList(node.previousElementSibling) && containsListElements.contains(node.previousElementSibling) && ((node.tagName === 'OL' || node.tagName === 'UL') && (node.previousElementSibling.nodeName === 'OL' || node.previousElementSibling.nodeName === 'UL'))) {
                const contentNodes: Node[] = this.domNode.contents(node);
                for (let f: number = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling.appendChild(contentNodes[f as number]);
                }
                node.parentNode.removeChild(node);
            }
        }
        if (firstNodeOL) {
            (firstNodeOL as HTMLElement).style.listStyleType = listStyleType;
            const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            let listOlUlElements: Node[] = [];
            if (range.commonAncestorContainer.nodeName === 'UL' || range.commonAncestorContainer.nodeName === 'OL') {
                if (range.commonAncestorContainer instanceof Element) {
                    listOlUlElements.push(range.commonAncestorContainer);
                }
                listOlUlElements = listOlUlElements.concat(Array.from((range.commonAncestorContainer as Element).querySelectorAll('ol, ul')));
            }
            else {
                listOlUlElements = Array.from((range.commonAncestorContainer as Element).querySelectorAll('ol, ul'));
            }
            for (let k: number = 0; k < listOlUlElements.length; k++) {
                let listStyle: string;
                let listElements: HTMLElement | Element = listOlUlElements[k as number] as HTMLElement;
                while (listElements) {
                    if (listElements.nodeName === 'OL' || listElements.nodeName === 'OL') {
                        if ((listElements as HTMLElement).style.listStyleType !== '' && (listElements as HTMLElement).style.listStyleType !== 'none' && (listElements as HTMLElement).nodeName !== 'LI') {
                            listStyle = (listElements as HTMLElement).style.listStyleType;
                        }
                        else if (!isNOU(listStyle) && ((listElements as HTMLElement).style.listStyleType === '' || (listElements as HTMLElement).style.listStyleType === 'none') &&
                            (listElements as HTMLElement).nodeName !== 'LI' && ((listElements as HTMLElement).nodeName === 'UL' || (listElements as HTMLElement).nodeName === 'OL')) {
                            (listElements as HTMLElement).style.listStyleType = listStyle;
                        }
                    }
                    listElements = listElements.querySelector('UL,OL');
                }
            }
        }
    }
    private findUnSelected(temp: HTMLElement[], elements: HTMLElement[]): void {
        temp = temp.slice().reverse();
        if (temp.length > 0) {
            const rightIndent: Element[] = [];
            const indentElements: Element[] = [];
            const lastElement: Element = elements[elements.length - 1];
            let lastElementChild: Element[] = [];
            const childElements: Element[] = [];
            lastElementChild = <NodeListOf<Element> & Element[]>(lastElement.childNodes);
            for (let z: number = 0; z < lastElementChild.length; z++) {
                if (lastElementChild[z as number].tagName === 'OL' || lastElementChild[z as number].tagName === 'UL') {
                    const childLI: NodeListOf<HTMLLIElement> = (lastElementChild[z as number] as Element)
                        .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                    if (childLI.length > 0) {
                        for (let y: number = 0; y < childLI.length; y++) {
                            childElements.push(childLI[y as number]);
                        }
                    }
                }
            }
            for (let i: number = 0; i < childElements.length; i++) {
                let count: number = 0;
                for (let j: number = 0; j < temp.length; j++) {
                    if (!childElements[i as number].contains((temp[j as number]))) {
                        count = count + 1;
                    }
                }
                if (count === temp.length) {
                    indentElements.push(childElements[i as number]);
                }
            }
            if (indentElements.length > 0) {
                for (let x: number = 0; x < indentElements.length; x++) {
                    if (this.domNode.contents(indentElements[x as number])[0].nodeName !== 'OL' &&
                        this.domNode.contents(indentElements[x as number])[0].nodeName !== 'UL') {
                        rightIndent.push(indentElements[x as number]);
                    }
                }
            }
            if (rightIndent.length > 0) {
                this.nestedList(rightIndent);
            }
        }
    }

    private revertList(elements: HTMLElement[], e?: IHtmlSubCommands | IHtmlKeyboardEvent): void {
        const temp: Element[] = [];
        for (let i: number = elements.length - 1; i >= 0; i--) {
            for (let j: number = i - 1; j >= 0; j--) {
                if (elements[j as number].contains((elements[i as number])) || elements[j as number] === elements[i as number]) {
                    temp.push(elements[i as number]);
                    elements.splice(i, 1);
                    break;
                }
            }
        }
        this.findUnSelected(temp as HTMLElement[], elements as HTMLElement[]);
        const viewNode: Element[] = [];
        for (let i: number = 0; i < elements.length; i++) {
            const element: Element = elements[i as number];
            if (this.domNode.contents(element)[0].nodeType === 3 && this.domNode.contents(element)[0].textContent.trim().length === 0) {
                detach(this.domNode.contents(element)[0]);
            }
            let parentNode: Element = elements[i as number].parentNode as Element;
            let className: string = element.getAttribute('class');
            if (temp.length === 0) {
                const siblingList: Element[] = <NodeListOf<Element> & Element[]>(elements[i as number] as Element).querySelectorAll('ul, ol');
                const firstNode: Element = siblingList[0];
                if (firstNode) {
                    const child: NodeListOf<HTMLLIElement> = firstNode
                        .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                    if (child) {
                        const nestedElement: Element = createElement(firstNode.tagName);
                        append([nestedElement], firstNode.parentNode as Element);
                        const nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
                        append([nestedElementLI], nestedElement);
                        append([firstNode], nestedElementLI);
                    }
                }
            }
            if (element.parentNode.insertBefore(this.closeTag(parentNode.tagName) as Element, element),
            'LI' === (parentNode.parentNode as Element).tagName || 'OL' === (parentNode.parentNode as Element).tagName ||
                'UL' === (parentNode.parentNode as Element).tagName) {
                element.parentNode.insertBefore(this.closeTag('LI') as Element, element);
            } else {
                let classAttr: string = '';
                if (className) {
                    // eslint-disable-next-line
                    classAttr += ' class="' + className + '"';
                }
                if (CONSTANT.DEFAULT_TAG && 0 === element.querySelectorAll(CONSTANT.BLOCK_TAGS.join(', ')).length) {
                    const wrapperclass: string = isNullOrUndefined(className) ? ' class="e-rte-wrap-inner"' :
                        ' class="' + className + ' e-rte-wrap-inner"';
                    const parentElement: HTMLElement = parentNode as HTMLElement;
                    if (elements.length === parentElement.querySelectorAll('li').length) {
                        if (!isNOU(parentElement.style.listStyleType)) {
                            (parentNode as HTMLElement).style.removeProperty('list-style-type');
                        }
                        if (!isNOU(parentElement.style.listStyleImage)) {
                            (parentNode as HTMLElement).style.removeProperty('list-style-image');
                        }
                        if (parentElement.style.length === 0) {
                            parentNode.removeAttribute('style');
                        }
                    }
                    const wrapper: string = '<' + e.enterAction + wrapperclass + this.domNode.attributes(element) + '></' + e.enterAction + '>';
                    if (e.enterAction !== 'BR') {
                        this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(wrapper));
                    }
                    else {
                        const wrapperSpan: string = '<span class=e-rte-wrap-inner id=removeSpan></span>';
                        const br: HTMLElement = document.createElement('br');
                        this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(wrapperSpan));
                        element.appendChild(br);
                    }
                } else if (this.domNode.contents(element)[0].nodeType === 3) {
                    const replace: string = this.domNode.createTagString(
                        CONSTANT.DEFAULT_TAG, parentNode, this.parent.domNode.encode(this.domNode.contents(element)[0].textContent));
                    this.domNode.replaceWith(this.domNode.contents(element)[0] as Element, replace);
                } else if ((this.domNode.contents(element)[0] as HTMLElement).classList.contains(markerClassName.startSelection) ||
                    (this.domNode.contents(element)[0] as HTMLElement).classList.contains(markerClassName.endSelection)) {
                    const replace: string = this.domNode.createTagString(
                        CONSTANT.DEFAULT_TAG, parentNode, (this.domNode.contents(element)[0] as HTMLElement).outerHTML);
                    this.domNode.replaceWith(this.domNode.contents(element)[0] as Element, replace);
                } else {
                    const childNode: Element = element.firstChild as Element;
                    if (childNode) {
                        const attributes: NamedNodeMap = element.parentElement.attributes;
                        if (attributes.length > 0) {
                            for (let d: number = 0; d < attributes.length; d++) {
                                const e: Attr = attributes[d as number];
                                const existingValue: string = childNode.getAttribute(e.nodeName);
                                const parentValue: string = (element.parentElement).getAttribute(e.nodeName);
                                childNode.setAttribute(e.nodeName, existingValue ? parentValue + ' ' + existingValue : parentValue);
                            }
                        }
                    }
                    className = childNode.getAttribute('class');
                    if (className && childNode.getAttribute('class')) {
                        attributes(childNode, { 'class': className + ' ' + childNode.getAttribute('class') });
                    }
                }
                append([this.openTag('LI') as Element], element);
                prepend([this.closeTag('LI') as Element], element);
            }
            this.domNode.insertAfter(this.openTag(parentNode.tagName), element);
            if ((parentNode.parentNode as Element).tagName === 'LI') {
                parentNode = parentNode.parentNode.parentNode as Element;
            }
            if (viewNode.indexOf(parentNode) < 0) {
                viewNode.push(parentNode);
            }
        }
        for (let i: number = 0; i < viewNode.length; i++) {
            const node: Element = viewNode[i as number] as Element;
            let nodeInnerHtml: string = node.innerHTML;
            const closeTag: RegExp = /<span class="e-rte-list-close-([a-z]*)"><\/span>/g;
            const openTag: RegExp = /<span class="e-rte-list-open-([a-z]*)"><\/span>/g;
            nodeInnerHtml = nodeInnerHtml.replace(closeTag, '</$1>');
            nodeInnerHtml = nodeInnerHtml.replace(openTag, '<$1 ' + this.domNode.attributes(node) + '>');
            this.domNode.replaceWith(node, this.domNode.openTagString(node) + nodeInnerHtml.trim() + this.domNode.closeTagString(node));
        }
        const emptyUl: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i: number = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i as number]);
        }
        const emptyLi: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li:empty');
        for (let i: number = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i as number]);
        }
    }

    private openTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-open-' + type.toLowerCase() + '"></span>');
    }

    private closeTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-close-' + type.toLowerCase() + '"></span>');
    }
    public destroy(): void {
        this.removeEventListener();
        if (this.domNode) {
            this.domNode = null;
        }
    }
    public areAllListItemsSelected(list: HTMLElement, range: Range): boolean {
        const listItems: NodeListOf<HTMLLIElement> = list.querySelectorAll('li');
        for (let i: number = 0; i < listItems.length; i++) {
            const listItem: HTMLLIElement = listItems[i as number];
            const listItemRange: Range = this.parent.currentDocument.createRange();
            listItemRange.selectNodeContents(listItem);
            if (!range.intersectsNode(listItem)) {
                return false;
            }
        }
        return true;
    }
}
