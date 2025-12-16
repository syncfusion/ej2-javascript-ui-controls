import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { createElement, detach, prepend, append, attributes, KeyboardEventArgs, Browser, addClass, removeClass } from '@syncfusion/ej2-base';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { DOMNode, markerClassName } from './dom-node';
import * as EVENTS from './../../common/constant';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { isNullOrUndefined, isNullOrUndefined as isNOU, closest } from '@syncfusion/ej2-base';
import { IAdvanceListItem } from '../../common';
import { InsertHtml } from './inserthtml';
import { DOMMethods } from './dom-tree';

/**
 * Lists internal component
 *
 * @hidden
 * @private
 */
export class Lists {
    private parent: EditorManager;
    private startContainer: Element;
    private endContainer: Element;
    private saveSelection: NodeSelection;
    private domNode: DOMNode;
    private currentAction: string;
    private commonLIParent: Element
    private listTabIndentation: boolean = false;
    /**
     * Constructor for creating the Lists plugin
     *
     * @param {EditorManager} parent - specifies the parent element
     * @hidden
     * @private
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
    private isOrderedList(range: Range): boolean {
        const olListStartRegex: RegExp[] = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            const editorValue: string = range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim();
            for (let i: number = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i as number].test(editorValue) && editorValue.length === 2) {
                    return true;
                }
            }
        }
        return false;
    }
    private isUnOrderedList(range: Range): boolean {
        const ulListStartRegex: RegExp[] = [/^[*]$/, /^[-]$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            const editorValue: string = range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim();
            for (let i: number = 0; i < ulListStartRegex.length; i++) {
                if (ulListStartRegex[i as number].test(editorValue)) {
                    return true;
                }
            }
        }
        return false;
    }
    private isCheckList(range: Range): boolean {
        // Updated regex to match checkbox patterns with at most one space: [], [x], [ ], [x ], [ x], [ x ]
        const ulListStartRegex: RegExp[] = [/^\[\s?\]$/, /^\[\s?x\s?\]$/i];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            const editorValue: string = range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim();
            for (let i: number = 0; i < ulListStartRegex.length; i++) {
                if (ulListStartRegex[i as number].test(editorValue)) {
                    return true;
                }
            }
        }
        return false;
    }

    private createAutoList(enterKey: string, shiftEnterKey: string): boolean {
        const autoListRules: Record<string, Record<string, boolean>> = {
            BR: { BR: true, P: true, DIV: true },
            P: { BR: false, P: true, DIV: true },
            DIV: { BR: false, P: true, DIV: true }
        };
        if (autoListRules[enterKey as string] && autoListRules[enterKey as string][shiftEnterKey as string] !== undefined) {
            return autoListRules[enterKey as string][shiftEnterKey as string];
        }
        return false;
    }
    private isInsideSameListType(startNode: Node | null, range: Range): boolean {
        if (!startNode) {
            return false;
        }
        // Find the closest <li> ancestor of the startNode
        const listItem: HTMLElement | null = (startNode as HTMLElement).closest('li');
        if (!listItem) {
            return false; // Not inside a list item
        }
        // Get the parent list element (either <ul> or <ol>)
        const parentList: Element | null = listItem.closest('ul, ol');
        if (!parentList) {
            return false; // No valid list container found
        }
        // Check if parentList is OL or UL and compare with startElementOLTest
        if (this.isOrderedList(range) && parentList.tagName === 'OL') {
            return true;
        } else if (this.isUnOrderedList(range) && parentList.tagName === 'UL' && !parentList.classList.contains('e-rte-checklist')) {
            return true;
        } else if (this.isCheckList(range) && parentList.tagName === 'UL' && parentList.classList.contains('e-rte-checklist')) {
            return true;
        } else {
            return false;
        }
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
        const startElementOLTest: boolean = this.isOrderedList(range);
        const preElementOLTest : boolean = this.testList(preElement);
        const nextElementOLTest : boolean = this.testList(nextElement);
        const isInsideSameListType: boolean = this.isInsideSameListType(startNode, range);
        const nextElementBRTest : boolean = (range.startContainer as Element).previousElementSibling && (range.startContainer as Element).previousElementSibling.tagName === 'BR';
        if (!isInsideSameListType && !preElementOLTest && !nextElementOLTest && preElemULStart !== '*' && nextElemULStart !== '*' && (this.createAutoList(e.enterKey, e.shiftEnterKey) || !nextElementBRTest)) {
            const brElement: HTMLElement = createElement('br');
            if (startElementOLTest) {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                if (range.startContainer.nodeName === '#text' && range.startContainer.textContent.length === 0) {
                    this.parent.domNode.insertAfter(brElement, range.startContainer as Element);
                }
                this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack, enterAction: e.enterKey });
                e.event.preventDefault();
            } else if (range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim() === '*' ||
            range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim() === '-') {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                if (range.startContainer.nodeName === '#text' && range.startContainer.textContent.length === 0) {
                    this.parent.domNode.insertAfter(brElement, range.startContainer as Element);
                }
                this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack, enterAction: e.enterKey });
                e.event.preventDefault();
            } else if (this.isCheckList(range)) {
                const isChecked: boolean = /^\[\s*x\s*\]$/i.test(range.startContainer.textContent.replace(/\u200B/g, '').slice(0, range.startOffset).trim());
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                if (range.startContainer.nodeName === '#text' && range.startContainer.textContent.length === 0) {
                    this.parent.domNode.insertAfter(brElement, range.startContainer as Element);
                }
                this.applyListsHandler({ subCommand: 'Checklist', callBack: e.callBack, enterAction: e.enterKey }, isChecked);
                e.event.preventDefault();
            }
        }
    }
    private isCtrlEnterInChecklist(e: IHtmlKeyboardEvent): void {
        let storeIntoStack: boolean = false;
        if (e.event && (e.event.ctrlKey || e.event.metaKey) && (e.event as KeyboardEventArgs).key === 'Enter' && e.event.action === 'checklist-toggle') {
            const domMethods: DOMMethods = new DOMMethods(this.parent.editableElement as HTMLDivElement);
            const li: HTMLElement[] = domMethods.getLiElementsInRange();
            for (let i: number = 0; i < li.length; i++) {
                if (li[i as number].nodeName === 'LI' && li[i as number].parentElement.nodeName === 'UL'
                    && !li[i as number].classList.contains('e-rte-checklist-hidden')
                    && li[i as number].parentElement.classList.contains('e-rte-checklist')) {
                    storeIntoStack = true;
                    if (li[i as number].classList.contains('e-rte-checklist-checked')) {
                        li[i as number].classList.remove('e-rte-checklist-checked');
                    } else {
                        li[i as number].classList.add('e-rte-checklist-checked');
                    }
                }
            }
        }
        if (storeIntoStack) {
            if (e.callBack) {
                e.callBack({
                    requestType: this.currentAction,
                    editorMode: 'HTML',
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: this.parent.domNode.blockNodes() as Element[],
                    event: e.event
                });
            }
            storeIntoStack = false;
        }
    }
    private enterList(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const startNode: Element = range.startContainer.nodeName === 'LI' ? (range.startContainer as Element) :
            range.startContainer.parentElement.closest('LI');
        const endNode: Element = range.endContainer.nodeName === 'LI' ? (range.endContainer as Element) :
            range.endContainer.parentElement.closest('LI');
        // Command handler for Ctrl+Enter or Cmd+Enter checklist toggle
        this.isCtrlEnterInChecklist(e as IHtmlKeyboardEvent);
        let hasMediaElem: boolean = false;
        if (!isNOU(startNode)) {
            const videoElemList : NodeList = startNode.querySelectorAll('.e-video-clickelem');
            const embedVideoElem : boolean = videoElemList.length > 0 && videoElemList[0].childNodes[0].nodeName === 'IFRAME';
            hasMediaElem = startNode.querySelectorAll('IMG').length > 0 || startNode.querySelectorAll('AUDIO').length > 0 || startNode.querySelectorAll('VIDEO').length > 0 || embedVideoElem;
        }
        let startNodeParent: HTMLElement;
        let parentOfCurrentOLUL: HTMLElement;
        if (startNode) {
            startNodeParent = startNode.parentElement;
            if (startNodeParent) {
                parentOfCurrentOLUL = startNodeParent.parentElement;
            }
        }
        const tableElement: HTMLElement = !isNullOrUndefined(startNode) ? startNode.querySelector('TABLE') : null;
        if (!isNOU(startNode) && !isNOU(endNode) && startNode === endNode && startNode.tagName === 'LI' &&
            startNode.textContent.trim() === '' && !hasMediaElem  && isNOU(tableElement)) {
            if (startNode.innerHTML.indexOf('&nbsp;') >= 0) {
                return;
            }
            if (startNode.textContent.charCodeAt(0) === 65279) {
                startNode.textContent = '';
            }
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
                const immediateBlock: Node = this.domNode.getImmediateBlockNode(range.startContainer);
                const { formattedElement, cursorTarget } = this.applyFormattingFromRange(insertTag, range, immediateBlock, e.enterAction);
                insertTag = formattedElement;
                if (!isNOU(parentOfCurrentOLUL) && parentOfCurrentOLUL.nodeName === 'BLOCKQUOTE') {
                    this.parent.observer.notify('blockquote_list_handled', {});
                }
                this.parent.domNode.insertAfter(insertTag, startNodeParent);
                e.event.preventDefault();
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, cursorTarget, 0);
                if (startNodeParent.textContent === '' && (startNodeParent.querySelectorAll('audio,video,table').length === 0 )) {
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
        const startContainer: Node = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement : range.startContainer;
        const isCloseTableOrEditableElem: boolean = this.isNodeInListNotTable(startContainer);
        if (!isNOU(startNode) && !isNOU(endNode) && startNode === endNode && startNode.tagName === 'LI' && startNode.textContent.length !== 0 && isCloseTableOrEditableElem && e.event && !e.event.shiftKey && !(e.event.ctrlKey || e.event.metaKey)) {
            this.splitListAtCursor(range, startNode, startNodeParent);
            e.event.preventDefault();
            return;
        }
        this.handleNestedEnterKeyForLists(e, parentOfCurrentOLUL, startNode, startNodeParent);
    }
    /*
    * Splits a list item at the cursor position, creating a new list item with content after the cursor.
    * This method handles both simple and complex list structures, including nested lists.
    */
    private splitListAtCursor(range: Range, startNode: Element, startNodeParent: HTMLElement): void {
        const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
        const selfClosingElements: string[] = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'SOURCE', 'TRACK', 'WBR'];
        const startContainer: Node = range.startContainer;
        const startOffset: number = range.startOffset;
        let clonedContent: DocumentFragment;
        if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
            newRange.setStart(startContainer, startOffset);
            newRange.setEndAfter(startNode);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
            const getNewRange: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
            clonedContent = getNewRange.cloneContents();
            this.cleanupListElements(clonedContent, selfClosingElements);
            newRange.deleteContents();
        } else {
            range.deleteContents();
            newRange.setStart(startContainer, startOffset);
            newRange.setEndAfter(startNode);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
            const getNewRange: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
            clonedContent = getNewRange.cloneContents();
            this.cleanupListElements(clonedContent, selfClosingElements);
            newRange.deleteContents();
        }
        if (startNode.querySelectorAll('*:empty').length > 0) {
            const emptyElem: NodeListOf<Element> = startNode.querySelectorAll('*:empty');
            for (let i: number = 0; i < emptyElem.length; i++) {
                if (selfClosingElements.indexOf(emptyElem[i as number].nodeName) === -1) {
                    detach(emptyElem[i as number]);
                }
            }
        }
        if (startNode.innerHTML === '') {
            startNode.innerHTML = '<br>';
        }
        clonedContent.normalize();
        const firstPosition: { node: Node; position: number } =
            this.parent.nodeSelection.findFirstContentNode(clonedContent);
        if (startNode.nextElementSibling) {
            startNodeParent.insertBefore(clonedContent, startNode.nextElementSibling);
        } else {
            startNodeParent.appendChild(clonedContent);
        }
        if (firstPosition.node.nodeName === 'BR') {
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartBefore(firstPosition.node);
            newRange.setEndBefore(firstPosition.node);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
        } else {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, firstPosition.node as Element, 0);
        }
    }
    /*
    * Cleans up empty elements within list content and ensures proper structure.
    * This method removes empty elements and adds necessary <br> elements for proper display.
    */
    private cleanupListElements(content: DocumentFragment | Element, selfClosingElements: string[]): void {
        // Find and remove empty elements
        const liElement: Element = content.firstElementChild;
        const emptyElement: NodeListOf<Element> = liElement.querySelectorAll('*:empty');
        for (let i: number = 0; i < emptyElement.length - 1; i++) {
            if (selfClosingElements.indexOf(emptyElement[i as number].nodeName) === -1) {
                detach(emptyElement[i as number]);
            }
        }
        this.ensureListItemContent(content);
    }
    /*
     * Ensures list items have proper content by adding <br> elements to empty list items or to list items that only contain nested lists.
     */
    private ensureListItemContent(content: DocumentFragment | Element): void {
        const listItems: NodeListOf<Element> = content.querySelectorAll('li');
        for (let i: number = 0; i < listItems.length; i++) {
            const li: Element = listItems[i as number];
            // Check if list item has no text content or only contains nested lists
            const hasOnlyLists: boolean = li.childNodes.length > 0 && ((li.firstChild &&
                (li.firstChild.nodeName === 'UL' || li.firstChild.nodeName === 'OL')) ||
                (li.firstElementChild && (li.firstElementChild.nodeName === 'UL' || li.firstElementChild.nodeName === 'OL'))) &&
                !(li.firstChild && li.firstChild.nodeName === '#text' && li.firstChild.textContent.trim().length > 0);
            if (hasOnlyLists || li.innerHTML === '') {
                const brElement: HTMLBRElement = document.createElement('br');
                if (li.firstChild) {
                    li.insertBefore(brElement, li.firstChild);
                } else {
                    li.appendChild(brElement);
                }
            } else {
                const emptyElement: Element = li.querySelector('*:empty');
                if (emptyElement) {
                    emptyElement.appendChild(document.createElement('br'));
                }
            }
        }
    }
    /*
     * Checks if a node is inside a table or list element.
     * Returns true if the node is inside a list and not inside a table.
     * Returns false if the node is inside a table or not inside a list element.
     */
    private isNodeInListNotTable(node: Node): boolean {
        let currentNode: Node = node;
        // Traverse up the DOM tree until reaching the editable element or body
        while (currentNode && currentNode !== this.parent.editableElement) {
            if (currentNode.nodeName === 'TABLE') {
                // If a table is found, return false regardless of whether a list is found or not
                return false;
            } else if ((currentNode.nodeName === 'UL' || currentNode.nodeName === 'OL')) {
                // Mark that we found a list element
                return true;
            }
            currentNode = currentNode.parentNode;
        }
        // Return true only if a list was found and no table was encountered
        return false;
    }
    private applyFormattingFromRange(element: HTMLElement, range: Range, blockNode: Node, enterAction: string)
        : { formattedElement: HTMLElement, cursorTarget: HTMLElement } {
        let cursorTarget: HTMLElement = element;
        const formatTags: { tag: string, element: HTMLElement }[] = [];
        if (blockNode) {
            let currentNode: Node = range.startContainer;
            const blockElements: string[] = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'ol', 'table', 'tr', 'td', 'th'];
            while (currentNode && currentNode !== blockNode) {
                const nodeName: string = currentNode.nodeName.toLowerCase();
                if (blockElements.indexOf(nodeName) === -1 && currentNode.nodeType === Node.ELEMENT_NODE) {
                    formatTags.push({
                        tag: nodeName,
                        element: currentNode as HTMLElement
                    });
                }
                currentNode = currentNode.parentNode;
            }
            if (formatTags.length > 0) {
                element = (enterAction === 'BR') ? createElement('DIV') : element;
                element.innerHTML = '';
                let currentElement: HTMLElement = element;
                formatTags.reverse().forEach((format: { tag: string, element: HTMLElement }) => {
                    const newElement: HTMLElement = createElement(format.tag);
                    Array.from((format.element as Element).attributes).forEach((attr: Attr) => {
                        newElement.setAttribute(attr.name, attr.value);
                    });
                    currentElement.appendChild(newElement);
                    currentElement = newElement;
                });
                const brElement: HTMLElement = createElement('br');
                currentElement.appendChild(brElement);
                cursorTarget = currentElement;
            }
        }
        return { formattedElement: (enterAction === 'BR' && formatTags.length > 0) ? element.firstChild as HTMLElement : element, cursorTarget };
    }
    private handleNestedEnterKeyForLists(e: IHtmlKeyboardEvent, parentOfCurrentOLUL: HTMLElement, startNode: Element,
                                         startNodeParent: HTMLElement): void {
        let hasIgnoredElement: boolean = false;
        if (!isNOU(startNode) && startNode.querySelectorAll('audio,video,table,img,HR').length > 0) {
            hasIgnoredElement = true;
        }
        if (!isNOU(parentOfCurrentOLUL) && (!isNOU(parentOfCurrentOLUL.closest('UL')) || !isNOU(parentOfCurrentOLUL.closest('OL')) || startNodeParent.nodeName === 'UL' || startNodeParent.nodeName === 'OL') &&
            (parentOfCurrentOLUL.nodeName === 'LI' || startNode.nodeName === 'LI') && (parentOfCurrentOLUL.style.listStyleType === 'none' || parentOfCurrentOLUL.style.listStyleType === '') &&
            parentOfCurrentOLUL.textContent !== '' && (!isNOU(startNode.lastElementChild) && startNode.lastElementChild.textContent !== '') && startNode.firstElementChild && (startNode.firstElementChild.textContent === '' && !hasIgnoredElement) && (startNode === startNodeParent.firstElementChild || startNode.nodeName === 'LI')) {
            const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            this.domNode.setMarker(this.saveSelection);
            e.event.preventDefault();
            const nodes: Element[] = [];
            if (startNode === startNodeParent.firstElementChild) {
                nodes.push(startNodeParent.firstElementChild);
            } else if (startNode.nodeName === 'LI') {
                nodes.push(startNode);
            }
            this.revertList(nodes as HTMLElement[], e);
            this.revertClean();
            this.saveSelection = this.domNode.saveMarker(this.saveSelection);
            this.saveSelection.restore();
        }
    }

    private backspaceList(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        startNode = startNode.nodeName === 'BR' ? startNode.parentElement : startNode;
        endNode = endNode.nodeName === 'BR' ? endNode.parentElement : endNode;
        if (!isNOU(startNode) && startNode.closest('li')) {
            const listCursorInfo: ListCursorInfo = this.getListCursorInfo(range);
            const isFirst: boolean = startNode.previousElementSibling === null;
            const allowedCursorSelections: ListCursorPosition[] = ['StartParent'];
            const allowedSelections: ListSelectionState[] = ['SingleFull', 'MultipleFull'];
            const blockNodes: HTMLElement[] = this.parent.domNode.blockNodes() as HTMLElement[];
            const isAllListSelected: boolean = this.isAllListNodesSelected(startNode.closest('li').parentElement as HTMLUListElement | HTMLOListElement);
            const hasIndent: boolean = listCursorInfo.position === 'StartNested' && startNode && startNode.parentElement &&
                                    startNode.parentElement.closest('li') && startNode.parentElement.closest('li').getAttribute('style')
                                    && startNode.parentElement.closest('li').getAttribute('style').indexOf('list-style-type: none;') !== -1;
            if (isFirst && (allowedCursorSelections.indexOf(listCursorInfo.position) > -1 || hasIndent)) {
                e.event.preventDefault();
                let saveSelection: NodeSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
                this.domNode.setMarker(saveSelection);
                for (let i: number = 0; i < blockNodes.length; i++) {
                    if (blockNodes.length > 0 && (blockNodes[i as number] as Element).tagName !== 'LI'
                        && (blockNodes[i as number].parentNode as Element).tagName === 'LI') {
                        blockNodes[i as number] = blockNodes[i as number].parentNode as HTMLElement;
                    }
                }
                this.revertList([blockNodes[0] as HTMLElement], e);
                this.revertClean();
                saveSelection = this.domNode.saveMarker(saveSelection);
                saveSelection.restore();
                return;
            } else if (allowedSelections.indexOf(listCursorInfo.selectionState) > -1 && isAllListSelected) {
                e.event.preventDefault();
                blockNodes[0].innerHTML = '';
                range.deleteContents();
                if (blockNodes.length > 1) {
                    for (let i: number = 0; i < blockNodes.length; i++) {
                        if (i === 0) {
                            continue; // First List is needed after the removal of list items.
                        }
                        const list: HTMLElement = blockNodes[i as number];
                        detach(list);
                    }
                }
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, blockNodes[0], 0);
                return;
            }
        }
        if (startNode === endNode && !isNullOrUndefined(closest(startNode, 'li')) &&
            ((startNode.textContent.trim() === '' && startNode.textContent.charCodeAt(0) === 65279) ||
            (startNode.textContent.length === 1 && startNode.textContent.charCodeAt(0) === 8203))) {
            startNode.textContent = '';
        }
        if (startNode === endNode && startNode.tagName === 'LI' && startNode.textContent.length === 0 &&
            isNOU(startNode.previousElementSibling)) {
            startNode.removeAttribute('style');
        }
        if (startNode === endNode && startNode.textContent === '' && !this.hasMediaElement(startNode)) {
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
            if (!isNOU(parentList) && parentList.tagName === startNode.childNodes[1].nodeName) {
                while (startNode.childNodes[1].lastChild) {
                    this.parent.domNode.insertAfter(startNode.children[1].lastChild as Element, startNode);
                }
                detach(startNode.childNodes[1]);
            } else if (!isNOU(parentList)) {
                parentList.parentElement.insertBefore(startNode.children[1], parentList);
            }
        }
        if (startNode === endNode && startNode.tagName === 'LI' && this.isAtListStart(startNode, range) && !isNOU(startNode.closest('ul, ol'))) {
            const currentList: Element | null = startNode.closest('ul, ol');
            const parentListItem: HTMLElement | null = currentList.parentElement;
            const prevSibling: Element | null = startNode.previousElementSibling;
            const nestedList: HTMLElement | null = startNode.querySelector('ol, ul');
            if ((!isNOU(parentListItem) && parentListItem.tagName === 'LI' && !isNOU(currentList.previousSibling)) || (!isNOU(prevSibling) && prevSibling.nodeName === 'LI')) {
                if (!isNOU(nestedList) && (isNOU(prevSibling) || !isNOU(prevSibling))) {
                    e.event.preventDefault();
                    // Preventing a default content editable div behaviour and Handles rearrangement of nested lists when press the backspace while the cursor is at the nested list structure and also redistributes child nodes and maintains cursor position after rearrangement
                    this.handleNestedListRearrangement(startNode, currentList, parentListItem, prevSibling, nestedList);
                }
            }
        }
        this.removeList(range, e);
        this.firstListBackSpace(range, e);
    }

    private hasMediaElement(element: Element): boolean {
        if (!element) {
            return false;
        }
        const videoElemList : NodeList = element.querySelectorAll('.e-video-clickelem');
        const embedVideoElem : boolean = videoElemList.length > 0 && videoElemList[0].childNodes[0].nodeName === 'IFRAME';
        if (element.querySelectorAll('audio,video,table,img,hr').length > 0 || ['AUDIO', 'VIDEO', 'TABLE', 'IMG', 'HR'].indexOf(element.tagName) !== -1 || embedVideoElem) {
            return true;
        }
        return false;
    }

    private handleNestedListRearrangement(
        startNode: Element,
        currentList: Element,
        parentListItem: HTMLElement,
        prevSibling: Element | null,
        nestedList: HTMLElement
    ): void {
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(!isNOU(prevSibling) ? prevSibling : currentList.previousSibling);
        const childNodes: ChildNode[] = Array.from(startNode.childNodes);
        for (let i: number = 0; i < childNodes.length; i++) {
            const child: ChildNode = childNodes[i as number];
            if (child === nestedList && nestedList) {
                while (nestedList.firstChild) {
                    currentList.insertBefore(nestedList.firstChild, startNode);
                    const emptyOL: HTMLElement | null = startNode.querySelector('OL:empty,UL:empty');
                    if (emptyOL) {
                        startNode.remove();
                    }
                }
            } else {
                if (!isNOU(prevSibling)) {
                    cursorOffset.node.parentElement.closest('li').appendChild(child);
                }
                else {
                    parentListItem.insertBefore(child, currentList);
                }
            }
        }
        this.parent.nodeSelection.setCursorPoint(
            this.parent.currentDocument,
            cursorOffset.node as Element,
            cursorOffset.offset);
    }

    private findPreviousElementForCursor(currentElement: Element): Element {
        let previousNode: Element = null;
        // Try to find a previous sibling first
        if (currentElement.previousElementSibling) {
            previousNode = currentElement.previousElementSibling;
        }
        // If no previous sibling, try the parent (if not the editable element itself)
        else if (currentElement.parentElement && currentElement.parentElement !== this.parent.editableElement) {
            previousNode = currentElement.parentElement;
        }
        return previousNode;
    }

    private handleCursorPositioningAfterListRemoval(previousNode: Element): void {
        if (!previousNode) {
            return;
        }
        // For Safari, explicitly set the cursor position
        if (this.parent.userAgentData.isSafari()) {
            const cursorPosition: { node: Node; offset: number } | null = this.parent.nodeSelection.findLastTextPosition(previousNode);
            if (cursorPosition) {
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument,
                    cursorPosition.node as Element,
                    cursorPosition.offset
                );
            } else {
                // If we can't find a text position, place at the end of the element
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument,
                    previousNode,
                    previousNode.childNodes.length
                );
            }
        }
    }

    private removeList(range: Range, e: IHtmlKeyboardEvent): void{
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = (!isNOU(range.endContainer.parentElement.closest('li')) && range.endContainer.parentElement.closest('li').childElementCount > 1 && range.endContainer.nodeName === '#text') ? range.endContainer as Element :  this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        let parentList: Element = (range.startContainer.nodeName === '#text') ? range.startContainer.parentElement.closest('li') : (range.startContainer as HTMLElement).closest('li');
        const endParentList: Element = (range.endContainer.nodeName === '#text') ? range.endContainer.parentElement.closest('li') : (range.endContainer as HTMLElement).closest('li');
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
        const endNodeNextElementSibling: boolean = (!isNOU(endParentList) && isNOU(endParentList.nextElementSibling));
        if (((range.commonAncestorContainer.nodeName === 'OL' || range.commonAncestorContainer.nodeName === 'UL' || range.commonAncestorContainer.nodeName === 'LI') &&
        isNOU(endNode.nextElementSibling) && endNode.textContent.length === range.endOffset && endNodeNextElementSibling &&
        isNOU(startNode.previousElementSibling) && range.startOffset === 0) ||
        (Browser.userAgent.indexOf('Firefox') !== -1 && range.startContainer === range.endContainer && range.startContainer === this.parent.editableElement &&
        range.startOffset === 0 && range.endOffset === 1)) {
            // Find where to place the cursor before removing elements for safari
            let previousNode: Element;
            if (Browser.userAgent.indexOf('Firefox') !== -1) {
                previousNode =  this.findPreviousElementForCursor(range.commonAncestorContainer.childNodes[0] as Element);
                detach(range.commonAncestorContainer.childNodes[0]);
            } else if (range.commonAncestorContainer.nodeName === 'LI') {
                previousNode =  this.findPreviousElementForCursor(range.commonAncestorContainer.parentElement);
                detach(range.commonAncestorContainer.parentElement);
            } else {
                previousNode =  this.findPreviousElementForCursor(range.commonAncestorContainer as Element);
                detach(range.commonAncestorContainer);
            }

            e.event.preventDefault();
            // Handle cursor positioning for safari
            this.handleCursorPositioningAfterListRemoval(previousNode);
            parentList = (range.startContainer.nodeName === '#text') ? range.startContainer.parentElement.closest('li') : (range.startContainer as HTMLElement).closest('li');
        }
        let previousNode: Element;
        if ((!isNOU(endParentList) && range.commonAncestorContainer === this.parent.editableElement) || (!isNOU(parentList) && (!range.collapsed || (parentList.textContent.trim() === '' && isNOU(parentList.previousElementSibling) && isNOU(parentList.nextElementSibling))) && parentList.textContent === fullContent)) {
            range.deleteContents();
            const listItems: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('li');
            for (let i: number = 0; i < listItems.length; i++) {
                if (!isNOU((listItems[i as number] as HTMLElement).childNodes)) {
                    listItems[i as number].childNodes.forEach((child: Element) => {
                        if (child.nodeName === 'A' && child.textContent === '') {
                            listItems[i as number].removeChild(child);
                        }
                    });
                }
                if ((!listItems[i as number].firstChild || listItems[i as number].textContent.trim() === '' && !this.hasMediaElement(listItems[i as number])) && (listItems[i as number] === startNode || listItems[i as number] === endNode || listItems[i as number] === endParentList)) {
                    previousNode = this.findPreviousElementForCursor(listItems[i as number]);
                    listItems[i as number].parentNode.removeChild(listItems[i as number]);
                }
            }
            this.parent.editableElement.querySelectorAll('ol').forEach((ol: HTMLOListElement) => {
                if (!ol.firstChild || ol.textContent.trim() === '' && !this.hasMediaElement(ol)) {
                    previousNode = this.findPreviousElementForCursor(ol);
                    ol.parentNode.removeChild(ol);
                }
            });
            this.parent.editableElement.querySelectorAll('ul').forEach((ul: HTMLUListElement) => {
                if (!ul.firstChild || ul.textContent.trim() === '' && !this.hasMediaElement(ul)) {
                    previousNode = this.findPreviousElementForCursor(ul);
                    ul.parentNode.removeChild(ul);
                }
            });
            e.event.preventDefault();
            // Handle cursor positioning for safari
            this.handleCursorPositioningAfterListRemoval(previousNode);
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
        const listItem: Element = startNode.closest('LI');
        if (!isNOU(listItem) && !this.isAtListStart(listItem, range)) {
            return;
        }
        if (!isNOU(startNode.closest('OL'))) {
            this.commonLIParent = startNode.closest('OL');
        } else if (!isNOU(startNode.closest('UL'))) {
            this.commonLIParent = startNode.closest('UL');
        }
        if (!isNOU(listItem) && range.startOffset === 0 && range.endOffset === 0 &&
        isNOU(startNode.previousSibling) && !isNOU(this.commonLIParent) && isNOU(this.commonLIParent.previousSibling) &&
        (isNOU(this.commonLIParent.parentElement.closest('OL')) && isNOU(this.commonLIParent.parentElement.closest('UL')) &&
        isNOU(this.commonLIParent.parentElement.closest('LI')))) {
            const currentElem : HTMLElement = createElement('P');
            currentElem.innerHTML = '&#8203;';
            startNode.classList.add('removeList');
            this.commonLIParent.parentElement.insertBefore(currentElem, this.commonLIParent);
        }
    }

    private isAtListStart(startNode: Element, range: Range): boolean {
        if (startNode.nodeName !== 'LI') {
            return false;
        }
        const listItem: HTMLLIElement = startNode as HTMLLIElement;
        const firstTextNode: Node | null = this.getFirstTextNode(listItem);
        return firstTextNode === range.startContainer && range.startOffset === 0;
    }
    private getFirstTextNode(element: Node): Node | null {
        if (element.nodeType === Node.TEXT_NODE) {
            return element;
        }
        if (element.nodeName === 'BR') {
            return element;
        }
        for (let i: number = 0; i < element.childNodes.length; i++) {
            const firstTextNode: Node = this.getFirstTextNode(element.childNodes[i as number]);
            if (firstTextNode) {
                return firstTextNode;
            }
        }
        return null;
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
        if ((e.event.which === 46 && e.event.action === 'delete')) {
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
            if (e.enableTabKey) {
                this.handleListIndentation(e);
            }
            let blockNodes: Element[];
            const startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
            const endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
            if ((startNode === endNode && (startNode.nodeName === 'BR' || startNode.nodeName === '#text') &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((startNode.parentNode as Element).tagName.toLocaleLowerCase()) >= 0)) {
                return;
            } else {
                if (!(e.event.action && (e.event.action === 'indent')) && !this.listTabIndentation) {
                    this.domNode.setMarker(this.saveSelection);
                }
                blockNodes = <Element[]>this.domNode.blockNodes();
            }
            const nodes: Element[] = [];
            let isNested: boolean = true;
            for (let i: number = 0; i < blockNodes.length; i++) {
                if ((blockNodes[i as number].parentNode as Element).tagName === 'LI') {
                    nodes.push(blockNodes[i as number].parentNode as Element);
                } else if (!closest(blockNodes[i as number], 'OL') && !closest(blockNodes[i as number], 'UL') && closest(blockNodes[i as number], 'LI')) {
                    nodes.push(closest(blockNodes[i as number], 'LI'));
                }
                else if (blockNodes[i as number].tagName === 'LI' && (blockNodes[i as number].childNodes[0] as Element).tagName !== 'P' &&
                    ((blockNodes[i as number].childNodes[0] as Element).tagName !== 'OL' &&
                        (blockNodes[i as number].childNodes[0] as Element).tagName !== 'UL')) {
                    nodes.push(blockNodes[i as number]);
                }
            }
            if (nodes.length > 1 || nodes.length === 1) {
                e.event.preventDefault();
                e.event.stopPropagation();
                this.currentAction = this.getAction(nodes[0]);
                if (e.event.shiftKey && (!e.enableTabKey || (e.enableTabKey && !this.listTabIndentation))) {
                    this.revertList(nodes as HTMLElement[], e);
                    this.revertClean();
                } else if (!e.enableTabKey || (e.enableTabKey && !this.listTabIndentation)) {
                    if (this.indentTab(e)) {
                        isNested = this.nestedList(nodes);
                    }
                }
                if (isNested) {
                    this.cleanNode();
                    (this.parent.editableElement as HTMLElement).focus({ preventScroll: true });
                }
                if (!(e.event.action && (e.event.action === 'indent')) && !this.listTabIndentation) {
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
                if (!(e.event.action && (e.event.action === 'indent')) && !this.listTabIndentation) {
                    if (e.event && e.event.shiftKey && e.event.key === 'Tab') {
                        e.event.action = 'tab';
                    }
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection);
                    this.saveSelection.restore();
                }
            }
            this.listTabIndentation = false;
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
            case 'checklist':
                this.applyListsHandler({ subCommand: 'Checklist', callBack: e.callBack});
                e.event.preventDefault();
                break;
            }
        }
    }

    private handleListIndentation(e: IHtmlKeyboardEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const parentNodeList: Node[] = this.saveSelection.getParentNodeCollection(range);
        if (!this.indentTab(e)) {
            return;
        }
        if ((parentNodeList[0].nodeName === 'LI' || closest(parentNodeList[0] as HTMLElement, 'li'))
            && !this.isCursorAtStartOfLI(range)) {
            const startParentNode: Element = parentNodeList[parentNodeList.length - 1] as Element;
            const endParentNode: Element = parentNodeList[0] as Element;
            const startElementTextNode: Node = range.startContainer;
            if (startParentNode && endParentNode) {
                range.deleteContents();
                if (startParentNode !== endParentNode) {
                    let currentBlockNode: Element = startElementTextNode as Element;
                    while (currentBlockNode.parentElement) {
                        if (this.parent.domNode.isBlockNode(currentBlockNode.parentElement)) {
                            currentBlockNode = currentBlockNode.parentElement;
                            break;
                        }
                        currentBlockNode = currentBlockNode.parentElement;
                    }
                    let cursorPosition: number;
                    const tabSpaceHTML: string = '&nbsp;&nbsp;&nbsp;&nbsp;<span class="rte-tab-space"></span>';
                    if (this.parent.domNode.isBlockNode(startParentNode.lastChild as Element)) {
                        startElementTextNode.nodeValue += '\u00A0\u00A0\u00A0\u00A0';
                        cursorPosition = startElementTextNode.nodeValue.length;
                    } else {
                        startParentNode.innerHTML += tabSpaceHTML;
                    }
                    const listItemFirstChild: Node = endParentNode.firstChild;
                    if (listItemFirstChild && this.parent.domNode.isBlockNode(listItemFirstChild as Element)) {
                        while (listItemFirstChild.firstChild) {
                            currentBlockNode.appendChild(listItemFirstChild.firstChild);
                        }
                        (listItemFirstChild as Element).remove();
                    }
                    while (endParentNode.firstChild) {
                        if (this.parent.domNode.isBlockNode(endParentNode.firstChild as Element)) {
                            this.parent.domNode.insertAfter(endParentNode.firstChild as Element, currentBlockNode);
                        } else {
                            startParentNode.appendChild(endParentNode.firstChild);
                        }
                    }
                    endParentNode.remove();
                    const tabSpanElement: Element = startParentNode.querySelector('.rte-tab-space');
                    if (tabSpanElement && tabSpanElement.previousSibling) {
                        this.saveSelection.setCursorPoint(this.parent.currentDocument, tabSpanElement.previousSibling as Element,
                                                          tabSpanElement.previousSibling.textContent.length);
                        tabSpanElement.parentNode.removeChild(tabSpanElement);
                    } else {
                        this.saveSelection.setCursorPoint(this.parent.currentDocument, startElementTextNode as Element, cursorPosition);
                    }
                } else {
                    InsertHtml.Insert(this.parent.currentDocument, '&nbsp;&nbsp;&nbsp;&nbsp;', this.parent.editableElement);
                }
                this.listTabIndentation = true;
            }
        }
    }
    /**
     * Checks if inserting a tab would exceed the maxLength constraint.
     *
     * @param {IHtmlKeyboardEvent} e - The keyboard event containing the maxLength constraint
     * @returns {boolean} True if allowed, false if it would exceed maxLength.
     */
    private indentTab(e: IHtmlKeyboardEvent): boolean {
        const tabSpaceLength: number = 4;
        const maxLength: number = (typeof e.maxLength === 'number') ? e.maxLength : -1;
        const currentLength: number = this.parent.editableElement.textContent
            .replace(/(\r\n|\n|\r|\t)/gm, '')
            .replace(/\u200B/g, '').length;
        const selectionLength: number = this.parent.currentDocument.getSelection().toString().length;
        return maxLength === -1 || (currentLength - selectionLength + tabSpaceLength) <= maxLength;
    }

    private isCursorAtStartOfLI(range: Range): boolean {
        let node: Node = range.startContainer;
        while (node && node.nodeName !== 'LI') {
            node = node.parentNode;
        }
        if (!node) {
            return false;
        }
        const tempRange: Range = range.cloneRange();
        tempRange.selectNodeContents(node);
        tempRange.setEnd(range.startContainer, range.startOffset);
        return tempRange.toString().trim() === '';
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
        if (siblingListLI.length > 0 && (siblingListOL.length <= 1 || siblingListOL[0].childNodes.length > 1) && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
            firstNode = siblingListLI[0];
        } else {
            firstNodeOL = siblingListOL[0];
        }
        if (firstNode) {
            for (let h: Node = this.domNode.contents(elements as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                const nextSibling: Element = h.nextSibling as Element;
                prepend([h as Element], firstNode);
                setStyleAttribute(elements as HTMLElement, { 'list-style-type': 'none' });
                const listHasCheckListClass: boolean = (elements.parentNode as Element) && (elements.parentNode as Element).classList.contains('e-rte-checklist');
                if (listHasCheckListClass) {
                    addClass([elements as Element], ['e-rte-checklist-hidden']);
                }
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
            const listHasCheckListClass: boolean = (elements.parentNode as Element) && (elements.parentNode as Element).classList.contains('e-rte-checklist');
            prepend([firstNodeOL], (elements.parentNode as Element));
            detach(elements);
            const nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            if (listHasCheckListClass) {
                addClass([nestedElementLI], ['e-rte-checklist-hidden']);
            }
            prepend([nestedElementLI], (firstNodeOL.parentNode as Element));
            append([firstNodeOL], nestedElementLI);
        } else {
            const nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], (elements.parentNode as Element));
            const nestedElement: Element = createElement((elements.parentNode as Element).tagName);
            if ((elements.parentNode as Element).classList.contains('e-rte-checklist')) {
                addClass([nestedElement], ['e-rte-checklist']);
                addClass([nestedElementLI], ['e-rte-checklist-hidden']);
            }
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
                if (siblingListLI.length > 0 && (siblingListOL.length <= 1 || siblingListOL[0].childNodes.length > 1) && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
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
                    if (prevSibling.parentNode && (prevSibling.parentNode as Element).classList.contains('e-rte-checklist')) {
                        addClass([firstNode], ['e-rte-checklist']);
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
                        if ((elements[i as number].parentNode as Element).classList.contains('e-rte-checklist')) {
                            addClass([nestedElement], ['e-rte-checklist']);
                        }
                        (nestedElement as HTMLElement).style.listStyleType =
                            (elements[i as number].parentNode as HTMLElement).style.listStyleType;
                        // Compare inline styles of prevSibling with computed styles of current element
                        const prevInlineStyle: string | null = prevSibling.getAttribute('style');
                        const computedStyles: CSSStyleDeclaration = getComputedStyle(elements[i as number] as Element);
                        const currentInlineStyle: CSSStyleDeclaration = (elements[i as number] as HTMLElement).style;
                        if (prevInlineStyle) {
                            const stylePairs: string[] = prevInlineStyle.split(';').filter(Boolean);
                            stylePairs.forEach((style: string) => {
                                const [prop, value] = style.split(':').map((s: string) => s.trim());
                                if (prop && value && prop !== 'list-style-type') {
                                    const computedValue: string = computedStyles.getPropertyValue(prop).trim();
                                    const currentInlineValue: string = currentInlineStyle.getPropertyValue(prop).trim();
                                    if (computedValue !== value && !currentInlineValue) {
                                        // Set the inline style to match the computed style
                                        (elements[i as number] as HTMLElement).style.setProperty(prop, computedValue);
                                    }
                                }
                            });
                        }
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
    private isCursorBeforeTable(range: Range): boolean {
        return range.startOffset === range.endOffset &&
            range.startContainer.childNodes.length > 0 && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            range.startContainer.childNodes[range.startOffset].nodeName === 'TABLE';
    }
    private isCursorAtEndOfTable(range: Range): boolean {
        return (range.startOffset === range.endOffset &&
            range.startContainer.childNodes.length > 0 && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            range.startContainer.childNodes[range.startOffset - 1].nodeName === 'TABLE');
    }
    private isListItemWithTableChild(node: Node): boolean {
        return node.nodeName === 'LI' && !isNOU(node.firstChild) &&
            node.firstChild.nodeName === 'TABLE';
    }
    private handleChecklistToggle(e: IHtmlSubCommands): void {
        const target: HTMLElement = <HTMLElement>e.event.target;
        if ((target as HTMLElement).tagName === 'LI' || !isNullOrUndefined(closest(target, '.' + 'e-rte-checklist'))) {
            e.event.preventDefault();
            e.event.stopPropagation();
            if (target.classList.contains('e-rte-checklist-checked')) {
                target.classList.remove('e-rte-checklist-checked');
            } else {
                target.classList.add('e-rte-checklist-checked');
            }
        }
    }
    private isCaretImmediatelyBeforeTable(range: Range): boolean {
        let cursorBeforeTable: boolean = false;
        let table: HTMLElement | null = null;
        const isBeforeFirstTable: boolean = range.collapsed && range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset &&
            range.startContainer.nodeType === Node.ELEMENT_NODE &&
            range.startContainer.childNodes[range.startOffset] && range.startContainer.childNodes[range.startOffset].nodeName === 'TABLE';
        if (isBeforeFirstTable) {
            table = range.startContainer.childNodes[range.startOffset] as HTMLElement;
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartBefore(table);
            newRange.setEndBefore(table);
            cursorBeforeTable = range.startContainer === newRange.startContainer &&
                range.endContainer === newRange.endContainer &&
                range.startOffset === newRange.startOffset &&
                range.endOffset === newRange.endOffset;
        }
        if (cursorBeforeTable && !isNOU(table)) {
            table.classList.add('temp-cursor-table');
            return true;
        }
        return false;
    }
    private applyListsHandler(e: IHtmlSubCommands, isCheckedCheckList?: boolean): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const isRangeBeforeTable: boolean = this.isCaretImmediatelyBeforeTable(range);
        const checkListToggleAction: boolean = e.subCommand === 'Checklist' && e.item && e.item.action === 'toggleChecklist';
        if (checkListToggleAction) {
            this.handleChecklistToggle(e);
        } else {
            const selectedNode: Element = (range.startContainer.nodeName === 'HR' ? range.startContainer as HTMLElement : range.startContainer.childNodes[range.startOffset] as HTMLElement);
            const lastSelectedNode: Element = (selectedNode ? (selectedNode.nodeName === 'HR' ? (selectedNode as HTMLElement).nextElementSibling : null) : null);
            const checkCursorPointer: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
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
                if (this.isCursorBeforeTable(range)) {
                    listsNodes = [range.startContainer.childNodes[range.startOffset]];
                } else if (this.isCursorAtEndOfTable(range)) {
                    listsNodes = [range.startContainer.childNodes[range.startOffset - 1]];
                } else if (listsNodes.length === 1 && this.isListItemWithTableChild(listsNodes[0])) {
                    listsNodes[0] = listsNodes[0].firstChild as Node;
                } else {
                    this.setSelectionBRConfig();
                    this.parent.domNode.convertToBlockNodes(this.parent.domNode.blockNodes(), true);
                    this.setSelectionBRConfig();
                    listsNodes = this.parent.domNode.blockNodes();
                }
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
            this.applyLists(listsNodes as HTMLElement[], this.currentAction, e.selector, e.item, e, checkCursorPointer, isCheckedCheckList);
            if (lastSelectedNode && range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, lastSelectedNode, 0);
            }
            if (isRangeBeforeTable) {
                const table: HTMLElement = this.parent.editableElement.ownerDocument.querySelector('.temp-cursor-table');
                if (!isNullOrUndefined(table)) {
                    const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
                    newRange.setStartBefore(table);
                    newRange.setEndBefore(table);
                    this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
                    removeClass([table], ['temp-cursor-table']);
                }
            }
        }
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

    // This method identifies unique list items and their top-level UL/OL parents from a given set of elements, returning both in separate arrays.
    private commonRevertList(elements: HTMLElement[]): { commonList: HTMLElement[]; commonListParent: HTMLElement[] } {
        const commonList: HTMLElement[] = [];
        const commonListParent: HTMLElement[] = [];
        let commonElement: HTMLElement;
        for (let i: number = 0; i < elements.length; i++) {
            let commonParentULorOL: HTMLElement = elements[i as number].parentElement;
            while (this.isListTag(commonParentULorOL.parentElement.nodeName)) {
                commonParentULorOL = commonParentULorOL.parentElement;
            }
            if (i === 0) {
                commonList.push(elements[i as number]);
                commonElement = commonParentULorOL;
                commonListParent.push(commonElement);
                continue;
            }
            if (commonParentULorOL !== commonElement) {
                commonList.push(elements[i as number]);
                commonElement = commonParentULorOL;
                commonListParent.push(commonElement);
            }
        }
        return { commonList, commonListParent };
    }

    private applyLists(elements: HTMLElement[], type: string, selector?: string,
                       item?: IAdvanceListItem, e?: IHtmlSubCommands, checkCursorPointer?: boolean, isCheckedCheckList?: boolean): void {
        let isReverse: boolean = true;
        if (type === 'Checklist') {
            type = 'UL';
        }
        if (this.isRevert(elements, type, item, e.subCommand) && isNOU(item)) {
            const revertListELements: { commonList: HTMLElement[]; commonListParent: HTMLElement[] } = this.commonRevertList(elements);
            this.completeRevertList(revertListELements, e.enterAction);
        } else {
            this.checkLists(elements, type, item, checkCursorPointer, e.subCommand, isCheckedCheckList);
            const targetEl: HTMLElement = elements[0];
            const marginLeftAttribute: { [key: string]: string }[] = [];
            if (targetEl.style.marginLeft !== '') {
                marginLeftAttribute.push({ 'margin-left': targetEl.style.marginLeft });
            }
            const listStyles: { [key: string]: string }[] = [];
            for (let i: number = 0; i < elements.length; i++) {
                if (!isNOU(item) && !isNOU(item.listStyle) && e.subCommand !== 'Checklist') {
                    if (item.listStyle === 'listImage') {
                        listStyles.push({ 'list-style-image': item.listImage });
                    }
                    else {
                        const formattedStyle: string = this.formatListStyle(item.listStyle);
                        listStyles.push({
                            'list-style-image': 'none',
                            'list-style-type': formattedStyle
                        });
                    }
                }
                elements[i as number].style.removeProperty('margin-left');
                const elemAtt: Record<string, string> = elements[i as number].tagName === 'IMG' || elements[i as number].classList.contains('e-editor-select-start') || elements[i as number].tagName === 'TABLE' ? {} : this.extractAllAttributes(elements[i as number]);
                if (elements[i as number].getAttribute('contenteditable') === 'true'
                    && elements[i as number].childNodes.length === 1 && elements[i as number].childNodes[0].nodeName === 'TABLE') {
                    const listEle: Element = document.createElement(type);
                    listEle.innerHTML = '<li><br/></li>';
                    elements[i as number].appendChild(listEle);
                } else if ('LI' !== elements[i as number].tagName && isNOU(item) &&
                    elements[i as number].nodeName === 'BLOCKQUOTE') {
                    isReverse = false;
                    const tempElement: HTMLElement = this.parent.editableElement.ownerDocument.createElement('div');
                    const ul: HTMLElement = this.parent.editableElement.ownerDocument.createElement(type);
                    this.applyListStyles(ul, marginLeftAttribute);
                    this.applyListStyles(ul, listStyles);

                    const replaceHTML: string = elements[i as number].innerHTML;
                    const li: HTMLElement = this.parent.editableElement.ownerDocument.createElement('li');
                    this.applyAllAttributes(li, elemAtt);
                    if (isCheckedCheckList) {
                        li.classList.add('e-rte-checklist-checked');
                    }
                    li.innerHTML = replaceHTML;
                    ul.appendChild(li);
                    tempElement.appendChild(ul);
                    let collectionString: string = tempElement.innerHTML;
                    if (e.subCommand === 'Checklist') {
                        collectionString = this.addCheckListClass(collectionString);
                    }
                    elements[i as number].innerHTML = collectionString;
                } else if ('LI' !== elements[i as number].tagName && isNOU(item)) {
                    isReverse = false;
                    // const tempElement: HTMLElement = this.parent.editableElement.ownerDocument.createElement('div');
                    const ul: HTMLElement = this.parent.editableElement.ownerDocument.createElement(type);
                    this.applyListStyles(ul, marginLeftAttribute);
                    this.applyListStyles(ul, listStyles);
                    let replaceHTML: string;
                    if (elements[i as number].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG || elements[i as number].tagName === 'DIV') {
                        replaceHTML = elements[i as number].innerHTML;
                    } else {
                        replaceHTML = elements[i as number].outerHTML;
                    }
                    if (elements[i as number].tagName === 'HR' &&
                        elements[i as number].firstElementChild &&
                        elements[i as number].firstElementChild.tagName === 'SPAN' &&
                        elements[i as number].firstElementChild.hasAttribute('class') &&
                        elements[i as number].firstElementChild.className === 'e-editor-select-start') {
                        replaceHTML = elements[i as number].firstElementChild.outerHTML + elements[i as number].outerHTML;
                    }
                    const li: HTMLElement = this.parent.editableElement.ownerDocument.createElement('li');
                    this.applyAllAttributes(li, elemAtt);
                    if (isCheckedCheckList) {
                        li.classList.add('e-rte-checklist-checked');
                    }
                    li.innerHTML = replaceHTML;
                    let innerHTML: string = li.outerHTML;
                    innerHTML = this.setStyle(innerHTML);
                    ul.innerHTML = innerHTML;
                    let collectionString: string = ul.outerHTML;
                    if (e.subCommand === 'Checklist') {
                        collectionString = this.addCheckListClass(collectionString);
                    }
                    this.domNode.replaceWith(elements[i as number], collectionString);
                }
                else if (!isNOU(item) && 'LI' !== elements[i as number].tagName) {
                    // eslint-disable-next-line
                    isReverse = false;
                    const tempElement: HTMLElement = this.parent.editableElement.ownerDocument.createElement('div');
                    const ul: HTMLElement = this.parent.editableElement.ownerDocument.createElement(type);
                    this.applyListStyles(ul, listStyles);
                    tempElement.appendChild(ul);
                    let replaceHTML: string;
                    if (elements[i as number].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG || elements[i as number].tagName === 'DIV') {
                        replaceHTML = elements[i as number].innerHTML;
                    } else {
                        replaceHTML = elements[i as number].outerHTML;
                    }
                    const li: HTMLElement = this.parent.editableElement.ownerDocument.createElement('li');
                    this.applyAllAttributes(li, elemAtt);
                    if (isCheckedCheckList) {
                        li.classList.add('e-rte-checklist-checked');
                    }
                    li.innerHTML = replaceHTML;
                    const innerHTML: string = li.outerHTML;
                    ul.innerHTML = innerHTML;
                    let collectionString: string = tempElement.innerHTML;
                    if (e.subCommand === 'Checklist') {
                        collectionString = this.addCheckListClass(collectionString);
                    }
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
        (this.parent.editableElement as HTMLElement).focus({ preventScroll: true });
        if (isIDevice()) {
            setEditFrameFocus(this.parent.editableElement, selector);
        }
        this.saveSelection = this.domNode.saveMarker(this.saveSelection);
        this.saveSelection.restore();
    }
    private extractAllAttributes(element: HTMLElement | null): Record<string, string> {
        const attributes: Record<string, string> = {};
        if (element && element.attributes) {
            Array.from(element.attributes).forEach((attr: Attr) => {
                attributes[attr.name] = attr.value;
            });
        }
        return attributes;
    }
    private applyAllAttributes(element: HTMLElement, attributes: Record<string, string>): void {
        Object.keys(attributes).forEach((key: string) => {
            element.setAttribute(key, attributes[key as string]);
        });
    }
    private applyListStyles(element: HTMLElement, listStyles: { [key: string]: string }[]): void {
        for (let i: number = 0; i < listStyles.length; i++) {
            const styleObj: { [key: string]: string } = listStyles[i as number];
            for (const key in styleObj) {
                if (Object.prototype.hasOwnProperty.call(styleObj, key)) {
                    element.style.setProperty(key, styleObj[key as string]);
                }
            }
        }
    }
    private addCheckListClass(collectionString: string): string {
        const divElement: HTMLElement = createElement('div');
        divElement.innerHTML = collectionString;
        const checkLists: Element = divElement.firstElementChild;
        this.applyCheckListClasses(checkLists);
        return divElement.innerHTML;
    }
    private applyCheckListClasses(element: Element): void {
        addClass([element], 'e-rte-checklist');
    }
    private setStyle(innerHTML: string): string {
        const tempDiv: HTMLElement = document.createElement('div');
        tempDiv.innerHTML = innerHTML;
        const liElement: HTMLElement | null = tempDiv.querySelector('li');
        if (!liElement) {
            return innerHTML;
        }
        const targetProps: string[] = ['color', 'font-size', 'font-family', 'font-weight', 'font-style'];
        const styleTextMap: Map<string, Map<string, string>> = new Map(); // Map<styleProp, Map<styleValue, text>>
        const walker: TreeWalker = this.parent.currentDocument.createTreeWalker(
            liElement,
            NodeFilter.SHOW_TEXT,
            null
        );
        let node: Node | null = walker.nextNode();
        while (node) {
            const text: string = node.textContent || '';
            let current: HTMLElement | null = node.parentElement;
            const styleSnapshot: Map<string, string> = new Map();
            // Traverse up to <li> and collect inline styles and semantic tags
            while (current && current !== liElement) {
                targetProps.forEach((prop: string) => {
                    const inlineValue: string = current.style.getPropertyValue(prop);
                    if (inlineValue && !styleSnapshot.has(prop)) {
                        styleSnapshot.set(prop, inlineValue);
                    }
                });
                if ((current.tagName === 'B' || current.tagName === 'STRONG') && !styleSnapshot.has('font-weight')) {
                    styleSnapshot.set('font-weight', 'bold');
                }
                if ((current.tagName === 'I' || current.tagName === 'EM') && !styleSnapshot.has('font-style')) {
                    styleSnapshot.set('font-style', 'italic');
                }
                current = current.parentElement;
            }
            // Merge text into styleTextMap
            styleSnapshot.forEach((value: string, prop: string) => {
                if (!styleTextMap.has(prop)) {
                    styleTextMap.set(prop, new Map());
                }
                const valueMap: Map<string, string> = styleTextMap.get(prop) || new Map<string, string>();
                const existingText: string = valueMap.get(value) || '';
                valueMap.set(value, existingText + text);
            });
            node = walker.nextNode();
        }
        // Apply styles where the accumulated text matches li's full text
        styleTextMap.forEach((valueMap: Map<string, string>, prop: string) => {
            valueMap.forEach((text: string, styleValue: string) => {
                if (text === liElement.textContent) {
                    liElement.style.setProperty(prop, styleValue);
                }
            });
        });
        return tempDiv.innerHTML;
    }
    private isRevert(nodes: Element[], tagName: string, item?: IAdvanceListItem, subCommand?: string): boolean {
        let isRevert: boolean = true;
        for (let i: number = 0; i < nodes.length; i++) {
            if (nodes[i as number].tagName !== 'LI') {
                return false;
            }
            if ((nodes[i as number].parentNode as Element).tagName !== tagName ||
            isNOU(item) && (nodes[i as number].parentNode as HTMLElement).style.listStyleType !== '' ||
            ((nodes[i as number].parentNode as HTMLElement).tagName === 'UL' && (nodes[i as number].parentNode as HTMLElement).classList.contains('e-rte-checklist') && subCommand !== 'Checklist'))
            {
                isRevert = false;
            }
            if ((nodes[i as number].parentNode as Element).tagName === tagName && (nodes[i as number].parentNode as HTMLElement).style.listStyleType !== '') {
                isRevert = true;
            }
            if ((nodes[i as number].parentNode as Element).tagName === 'UL' && !(nodes[i as number].parentNode as HTMLElement).classList.contains('e-rte-checklist') && subCommand === 'Checklist'){
                isRevert = false;
            }
        }
        return isRevert;
    }

    private checkLists(nodes: Element[], tagName: string, item?: IAdvanceListItem, checkCursorPointer?: boolean,
                       subCommand?: string, isCheckedCheckList?: boolean): void {
        const nodesTemp: Element[] = [];
        for (let i: number = 0; i < nodes.length; i++) {
            const node: Element = nodes[i as number].parentNode as Element;
            if ((nodes[i as number].tagName === 'LI' && node.tagName !== tagName && nodesTemp.indexOf(node) < 0) ||
            (nodes[i as number].tagName === 'LI' && node.tagName === tagName && nodesTemp.indexOf(node) < 0 && item !== null) ||
            (nodes[i as number].tagName === 'LI' && node.tagName === tagName && subCommand === 'Checklist' && nodesTemp.indexOf(node) < 0) ||
            (nodes[i as number].tagName === 'LI' && node.tagName === tagName && subCommand !== 'Checklist' && nodesTemp.indexOf(node) < 0 && node.classList.contains('e-rte-checklist'))
            ) {
                nodesTemp.push(node);
            }
            if (isNOU(item) && (node.tagName === tagName ||
            ((node.tagName === 'UL' || node.tagName === 'OL') && node.hasAttribute('style')))) {
                if (node.hasAttribute('style')) {
                    node.removeAttribute('style');
                }
            }
        }
        this.convertListType(nodes, tagName, nodesTemp, checkCursorPointer, item, subCommand, isCheckedCheckList);
    }
    /*
     * Convert list type based on the different list
     * Transforms selected list items between ordered and unordered lists
     */
    private convertListType(nodes: Element[], tagName: string, nodesTemp: Element[], checkCursorPointer: boolean,
                            item?: IAdvanceListItem | null, subCommand?: string, isCheckedCheckList?: boolean): void {
        tagName = subCommand === 'Checklist' ? 'Checklist' : tagName;
        // Add classes to selected LI elements for tracking
        for (let k: number = 0; k < nodes.length; k++) {
            nodes[k as number].classList.add('list-temp-element');
            if (isCheckedCheckList) {
                nodes[k as number].classList.add('e-rte-checklist-checked');
            }
        }
        // First call with reverse order because when elements are changed in the DOM during nested list usecase,
        // the DOM element has already changed and we can no longer get that element in the collection.
        // So the nested use case is not working. That's why we reverse and convert with the normal order.
        // For the reverse order, most of them are converted however some of that not working because of nested list,
        // so once again call the convert with the normal order - that way it works well.
        const reversedParentLists: Element[] = Array.from(new Set<Element>(
            nodes.map((node: Element) => node.parentNode as Element)
                .filter((parent: Element) => parent.tagName === 'OL' || parent.tagName === 'UL')
        )).reverse();
        this.convertListTypeInternal(reversedParentLists, nodes, tagName, nodesTemp, checkCursorPointer, item, subCommand);
        // Update nodes reference to point to converted elements in DOM
        nodes = Array.from(this.parent.currentDocument.querySelectorAll('.list-temp-element'));
        // Second call without reverse - process any remaining unconverted elements from first pass
        const naturalOrderParentLists: Element[] = Array.from(new Set<Element>(
            nodes.map((node: Element) => node.parentNode as Element)
                .filter((parent: Element) => parent.tagName === 'OL' || parent.tagName === 'UL')
        ));
        this.convertListTypeInternal(naturalOrderParentLists, nodes, tagName, nodesTemp, checkCursorPointer, item, subCommand);
        // Update nodes reference again after second conversion
        nodes = Array.from(this.parent.currentDocument.querySelectorAll('.list-temp-element'));
        nodes.forEach((el: Element) => {
            el.classList.remove('list-temp-element');
            if (el.classList.length === 0) {
                el.removeAttribute('class');
            }
        });
    }
    private convertListTypeInternal(initialNodesTemp: Element[], nodes: Element[], tagName: string,
                                    nodesTemp: Element[], checkCursorPointer: boolean,
                                    item?: IAdvanceListItem | null, subCommand?: string): void {
        for (let i: number = 0; i < initialNodesTemp.length; i++) {
            const list: Element = initialNodesTemp[i as number];
            if (!checkCursorPointer && (list.tagName === 'UL' || list.tagName === 'OL')) {
                const newFragment: DocumentFragment = this.parent.currentDocument.createDocumentFragment();
                let currentTagName: string = list.tagName;
                // Track if current list is a checklist
                let isCurrentChecklist: boolean = list.classList.contains('e-rte-checklist');
                // Determine if target is a checklist
                const isTargetChecklist: boolean = tagName === 'Checklist';
                let newList: HTMLElement = this.parent.currentDocument.createElement(
                    isTargetChecklist ? 'ul' : tagName.toLowerCase()
                );
                // Add class for checklist if target is checklist
                if (isTargetChecklist) {
                    this.applyCheckListClasses(newList);
                }
                const listElements: Element[] = Array.from(list.children).filter((child: Element) => child.tagName === 'LI');
                listElements.forEach((child: Element) => {
                    if (nodes.indexOf(child) !== -1) {
                        // Check if we're dealing with the same list type
                        if ((currentTagName === (isTargetChecklist ? 'ul' : tagName.toLowerCase())) &&
                            (isCurrentChecklist === isTargetChecklist)) {
                            const clonedChild: HTMLElement = child.cloneNode(true) as HTMLElement;
                            if (!isCurrentChecklist && clonedChild.classList.contains('e-rte-checklist-checked')) {
                                clonedChild.classList.remove('e-rte-checklist-checked');
                            }
                            newList.appendChild(clonedChild);
                        } else {
                            // Create new list for different type
                            const createNodeName: string = isTargetChecklist ? 'UL' : tagName;
                            newList = this.parent.currentDocument.createElement(createNodeName.toLowerCase());
                            if (currentTagName === tagName && !(list.classList.contains('e-rte-checklist') && tagName === 'UL')) {
                                this.transferAttributes(list, newList);
                            }
                            // Add class for checklist if target is checklist
                            if (isTargetChecklist) {
                                this.applyCheckListClasses(newList);
                            }
                            currentTagName = isTargetChecklist ? 'ul' : tagName.toLowerCase();
                            // Store the current checklist state BEFORE processing child
                            isCurrentChecklist = isTargetChecklist;
                            newFragment.appendChild(newList);
                            const clonedChild: HTMLElement = child.cloneNode(true) as HTMLElement;
                            this.applyListItemStyle(newList, item);
                            if (!isCurrentChecklist && clonedChild.classList.contains('e-rte-checklist-checked')) {
                                clonedChild.classList.remove('e-rte-checklist-checked');
                            }
                            newList.appendChild(clonedChild);
                        }
                    } else {
                        if (currentTagName !== list.tagName.toLowerCase() || isCurrentChecklist !== list.classList.contains('e-rte-checklist')) {
                            currentTagName = list.tagName.toLowerCase();
                            isCurrentChecklist = list.classList.contains('e-rte-checklist');
                            newList = this.parent.currentDocument.createElement(currentTagName);
                            // Add class for checklist if it's a checklist
                            if (isCurrentChecklist) {
                                this.applyCheckListClasses(newList);
                            }
                            this.transferAttributes(list, newList);
                            newFragment.appendChild(newList);
                        }
                        newList.appendChild(child.cloneNode(true));
                    }
                });
                list.parentNode.replaceChild(newFragment, list);
            } else if (checkCursorPointer) {
                for (let j: number = nodesTemp.length - 1; j >= 0; j--) {
                    const h: Element = nodesTemp[j as number];
                    const createNodeName: string = tagName === 'Checklist' ? 'ul' : tagName;
                    const replace: string = '<' + createNodeName.toLowerCase() + ' '
                        + this.domNode.attributes(h) + '>' + h.innerHTML + '</' + createNodeName.toLowerCase() + '>';
                    const tempDiv: HTMLDivElement = document.createElement('div');
                    tempDiv.innerHTML = replace;
                    this.applyListItemStyle(tempDiv.firstChild as Element, item);
                    if (subCommand === 'Checklist') {
                        // Add the check list class to the list so we can convert that list into the check list.
                        tempDiv.innerHTML = this.addCheckListClass(tempDiv.innerHTML);
                    } else {
                        // Revert the check list element when converting to other type of list
                        const listElement: NodeListOf<HTMLLIElement> = tempDiv.querySelectorAll('li');
                        for (let k: number = 0; k < listElement.length; k++) {
                            this.revertChecklistItem(listElement[k as number]);
                        }
                        // If converting a check list to another type of list, remove the check list class from the list.
                        if (tempDiv.firstElementChild && tempDiv.firstElementChild.classList.contains('e-rte-checklist')) {
                            tempDiv.firstElementChild.classList.remove('e-rte-checklist');
                            if (tempDiv.firstElementChild.classList.length === 0) {
                                tempDiv.firstElementChild.removeAttribute('class');
                            }
                        }
                    }
                    this.domNode.replaceWith(nodesTemp[j as number], tempDiv.innerHTML);
                }
            }
        }
    }

    /*
     * Applies list style to a list item element
     * @param node The list item element to apply styles to
     * @param item The advanced list item configuration
     */
    private applyListItemStyle(node: Element, item?: IAdvanceListItem): void {
        if (!isNOU(item) && !isNOU(item.listStyle)) {
            if (item.listStyle === 'listImage') {
                setStyleAttribute(node as HTMLElement, { 'list-style-image': item.listImage });
            }
            else {
                setStyleAttribute(node as HTMLElement, { 'list-style-image': 'none' });
                const formattedStyle: string = this.formatListStyle(item.listStyle);
                setStyleAttribute(node as HTMLElement, { 'list-style-type': formattedStyle});
            }
        }
    }
    /*
     * Transfers attributes from source element to target element
     */
    private transferAttributes(
        sourceList: Element,
        targetList: HTMLElement
    ): void {
        for (let j: number = 0; j < sourceList.attributes.length; j++) {
            const attr: Attr = sourceList.attributes[j as number];
            targetList.setAttribute(attr.name, attr.value);
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
            // Check if the current node is part of the same list structure as its previous sibling
            const isSameList: boolean = this.domNode.isList(node.previousElementSibling) && node.parentElement === node.previousElementSibling.parentElement && node.parentElement.tagName === 'LI';
            if (this.domNode.isList(node.previousElementSibling as Element) &&
                (this.domNode.openTagString(node) === this.domNode.openTagString(node.previousElementSibling as Element)) || isSameList) {
                const contentNodes: Node[] = this.domNode.contents(node);
                for (let f: number = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling.appendChild(contentNodes[f as number]);
                }
                node.parentNode.removeChild(node);
            } else if (!isNOU(node.getAttribute('level'))) {
                if (node.tagName === node.previousElementSibling.tagName) {
                    (node.previousElementSibling.lastChild as HTMLElement).append(node);
                }
            } else if (this.domNode.isList(node.previousElementSibling) && containsListElements.contains(node.previousElementSibling) && ((node.tagName === 'OL' || node.tagName === 'UL') && (node.previousElementSibling.nodeName === 'OL' || node.previousElementSibling.nodeName === 'UL')) &&
            ((node.previousElementSibling.classList.contains('e-rte-checklist') && node.classList.contains('e-rte-checklist')) && !(node.previousElementSibling.classList.contains('e-rte-checklist') && node.classList.contains('e-rte-checklist')))) {
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
    public revertChecklistItem(li: Element): void {
        if (li && li.parentElement && li.parentElement.classList.contains('e-rte-checklist')) {
            li.parentElement.classList.remove('e-rte-checklist');
        }
        if (li && li.classList.contains('e-rte-checklist-checked')) {
            li.classList.remove('e-rte-checklist-checked');
        }
    }

    // This method checks if a given tag name is a list-related element (UL, OL, or LI).
    private isListTag(elementName: string): boolean {
        return elementName === 'OL' || elementName === 'UL' || elementName === 'LI';
    }

    // This method inserts closing tags for all ancestor lists above a selected list item until reaching the specified main list, ensuring proper HTML structure.
    private closeAncestorsBeforeSelection(selectionLi: HTMLElement, parentOfMainUlorOL: HTMLElement): void {
        const parentOfSelectionLi: HTMLElement = selectionLi.parentElement;
        const insertBeforElement: HTMLElement = selectionLi;
        while (this.isListTag(selectionLi.parentElement.nodeName) && selectionLi.parentElement !== parentOfMainUlorOL) {
            parentOfSelectionLi.insertBefore(this.closeTag(selectionLi.parentElement.nodeName), insertBeforElement);
            selectionLi = selectionLi.parentElement;
        }
    }

    // This method inserts closing tags for list elements after the end of a selection, climbing up until the common parent or main list, then reopens the list structure to maintain valid HTML.
    private closeAncestorsAfterSelection(endElement: HTMLElement, endSelectionLi: HTMLElement,
                                         startLi: HTMLElement, endLi: HTMLElement, parentOfMainUlorOL: HTMLElement): void {
        let endInsertAfterElement: HTMLElement = endElement;
        this.domNode.insertAfter(this.closeTag(endSelectionLi.nodeName), endInsertAfterElement);
        endInsertAfterElement = endInsertAfterElement.nextSibling as HTMLElement;
        let endSelectionElement: HTMLElement = endSelectionLi.parentElement;
        let allClosed: boolean = false;
        if (startLi !== endLi) {
            // Close until we reach the common parent with the start LI
            if (endSelectionElement === startLi.parentElement || endSelectionElement === parentOfMainUlorOL) {
                allClosed = true;
            }
            while (!allClosed) {
                this.domNode.insertAfter(this.closeTag(endSelectionElement.nodeName), endInsertAfterElement);
                endInsertAfterElement = endInsertAfterElement.nextSibling as HTMLElement;
                endSelectionElement = endSelectionElement.parentElement;
                if (endSelectionElement === startLi.parentElement || endSelectionElement === parentOfMainUlorOL) {
                    allClosed = true;
                }
            }
        }
        this.reopenListStructure(endSelectionLi, endInsertAfterElement, parentOfMainUlorOL);
    }
    // This method inserts opening tags for ancestor lists after a selection to restore the original nested list structure and adjusts classes for proper formatting.
    private reopenListStructure(endSelectionLi: HTMLElement, endInsertAfterElement: HTMLElement, parentOfMainUlorOL: HTMLElement): void {
        while (this.isListTag(endSelectionLi.parentElement.nodeName) && endSelectionLi.parentElement !== parentOfMainUlorOL) {
            this.domNode.insertAfter(this.openTag(endSelectionLi.parentElement.nodeName), endInsertAfterElement);
            endSelectionLi = endSelectionLi.parentElement;
            endInsertAfterElement = endInsertAfterElement.nextSibling as HTMLElement;
            const closeClasses: string[] = ['e-rte-list-close-li', 'e-rte-list-close-ol', 'e-rte-list-close-ul'];
            const openClasses: string[] = ['e-rte-list-open-ol', 'e-rte-list-open-ul'];
            const hasCloseClass: boolean = endInsertAfterElement.previousElementSibling &&
                closeClasses.indexOf(endInsertAfterElement.previousElementSibling.classList[0]) > -1;
            const hasOpenClass: boolean = openClasses.indexOf(endInsertAfterElement.classList[0]) > -1;
            if (hasCloseClass && hasOpenClass) {
                // To mark the beginning of a reopened list structure after a selection operation. This class is added
                endInsertAfterElement.classList.add('e-rte-list-start');
            }
        }
    }
    // This Method completely revert the selected List items
    private completeRevertList(elements: { commonList: HTMLElement[]; commonListParent: HTMLElement[] }, enterAction: string = 'P'): void {
        for (let i: number = 0; i < elements.commonList.length; i++) {
            // Find the top-most UL/OL/LI ancestor that owns the selection
            const mainParentULorOL: HTMLElement = elements.commonListParent[i as number];

            const classListOfMainUlorOl: string = mainParentULorOL.getAttribute('class');
            const styleListOfMainUlorOl: string = mainParentULorOL.getAttribute('style');
            const parentOfMainUlorOL: HTMLElement = mainParentULorOL.parentElement;
            // Locate selection start and normalize to its LI container
            const startElement: HTMLElement = mainParentULorOL.querySelector('.e-editor-select-start');
            let selectionLi: HTMLElement = startElement ? startElement.parentElement : null;
            if (isNOU(selectionLi)) {
                selectionLi = elements.commonList[i as number];
            }
            while (selectionLi && selectionLi.nodeName !== 'LI') {
                selectionLi = selectionLi.parentElement;
            }
            selectionLi.classList.add('e-rte-select-list-start');
            const startLi: HTMLElement = selectionLi;
            this.closeAncestorsBeforeSelection(selectionLi, parentOfMainUlorOL);
            // Locate selection end marker; fallback to start if missing
            let endElement: HTMLElement = mainParentULorOL.querySelector('.e-editor-select-end');
            if (isNullOrUndefined(endElement) && elements.commonList.length === 1) {
                endElement = startElement;
            }
            // Normalize to the containing LI for the end marker
            let endSelectionLi: HTMLElement = endElement ? endElement.parentElement : null;
            if (isNOU(endSelectionLi)) {
                endSelectionLi = mainParentULorOL.lastElementChild as HTMLElement;
                endElement = endSelectionLi.childNodes[endSelectionLi.childNodes.length - 1] as HTMLElement;
            }
            while (endSelectionLi.nodeName !== 'LI') {
                endSelectionLi = endSelectionLi.parentElement;
            }
            endSelectionLi.classList.add('e-rte-select-list-end');
            const endLi: HTMLElement = endSelectionLi;
            // Expand endElement to the nearest block boundary, then to the last inline sibling in that block
            while (!this.parent.domNode.isBlockNode(endElement)) {
                if (endElement.parentElement.tagName !== 'LI') {
                    endElement = endElement.parentElement;
                } else {
                    break;
                }
            }
            while (endElement.nextSibling && !this.isListTag(endElement.nextSibling.nodeName)) {
                endElement = endElement.nextSibling as HTMLElement;
            }
            if (endElement.nodeName === 'TD' || endElement.nodeName === 'TH') {
                endElement = endLi.childNodes[endLi.childNodes.length - 1] as HTMLElement;
                while (endElement && this.isListTag(endElement.nodeName)) {
                    endElement = endElement.previousSibling as HTMLElement;
                }
            }
            this.closeAncestorsAfterSelection(endElement, endSelectionLi, startLi, endLi, parentOfMainUlorOL);
            mainParentULorOL.outerHTML = this.processSplitedList(
                this.replaceCustomSpans(mainParentULorOL.outerHTML, classListOfMainUlorOl, styleListOfMainUlorOl), enterAction);
        }
    }
    // This method merges new attributes into an element, avoids duplicates for class and style, removes unnecessary classes and list-related styles, and cleans up empty attributes.
    private addAllAttributes(element: HTMLElement, attributes: Record<string, string>): void {
        Object.keys(attributes).forEach((key: string) => {
            const newValue: string = attributes[key as string];
            // Check if the attribute already exists
            const existingValue: string = element.getAttribute(key);
            if (existingValue) {
                // Merge values for attributes like class, style, etc.
                if (key === 'class' || key === 'style') {
                    // Avoid duplicate values
                    const mergedValue: string = Array.from(new Set((existingValue + ' ' + newValue).trim().split(/\s+/))).join(' ');
                    element.setAttribute(key, mergedValue);
                } else {
                    // For other attributes, you can decide to overwrite or merge based on your needs
                    element.setAttribute(key, newValue); // Overwrite by default
                }
            } else {
                // If attribute doesn't exist, just set it
                element.setAttribute(key, newValue);
            }
        });
        const classesToRemove: string[] = ['e-rte-checklist', 'e-rte-select-list-start', 'e-rte-select-list-end', 'e-rte-checklist-checked'];
        let classRemoved: boolean = false;
        classesToRemove.forEach((cls: string) => {
            if (element.classList.contains(cls)) {
                element.classList.remove(cls);
                classRemoved = true;
            }
        });
        // Remove 'class' attribute if no classes remain
        if (classRemoved && element.classList.length === 0) {
            element.removeAttribute('class');
        }
        if (element.style) {
            const styles: CSSStyleDeclaration = element.style;
            for (let i: number = 0; i < styles.length; i++) {
                if (styles[i as number] === 'list-style-image' || styles[i as number] === 'list-style-type') {
                    element.style.removeProperty(styles[i as number]);
                    i--;
                }
            }
            if (element.style.length === 0) {
                element.removeAttribute('style');
            }
        }
    }
    // This method processes a split list by wrapping selected items, preserving attributes, cleaning up empty lists, and applying styles before returning the updated HTML content.
    private processSplitedList(content: string, enterAction: string): string {
        const tempElement: HTMLElement  = createElement('div');
        tempElement.innerHTML = content;
        const startLi: HTMLElement = tempElement.querySelector('.e-rte-select-list-start');
        let startElement: HTMLElement = startLi;
        let mainUlOlAttributes: Record<string, string>;
        if (startLi.previousElementSibling && (startLi.previousElementSibling.nodeName === 'OL' || startLi.previousElementSibling.nodeName === 'UL')) {
            mainUlOlAttributes = this.extractAllAttributes(startLi.previousElementSibling as HTMLElement);
        }
        if (startLi) {
            // Adding the class for processing the list element
            startLi.classList.add('e-rte-insertAfterElement');
            this.wrapperAction(startLi, enterAction, tempElement, mainUlOlAttributes);
            startElement = startLi.nextElementSibling as HTMLElement;
            detach(startLi);
        }
        while (startElement  && !(startElement.nodeName === 'OL' || startElement.nodeName === 'UL')) {
            if (startElement.nodeName === 'LI') {
                startElement.classList.add('e-rte-insertAfterElement');
                this.wrapperAction(startElement, enterAction, tempElement, mainUlOlAttributes);
                const nextLi: HTMLElement = startElement.nextElementSibling as HTMLElement;
                detach(startElement);
                startElement = nextLi;
            } else {
                startElement = startElement.nextElementSibling as HTMLElement;
            }
        }
        if (startElement.classList.contains('e-rte-checklist')) {
            const ulList: NodeList = startElement.querySelectorAll('ul');
            for (let i: number = 0; i < ulList.length; i++) {
                (ulList[i as number] as HTMLElement).classList.add('e-rte-checklist');
            }
            const liElements: NodeList = startElement.querySelectorAll('li');
            for (let i: number = 0; i < liElements.length; i++) {
                if ((liElements[i as number] as HTMLElement).style.listStyleType === 'none') {
                    (liElements[i as number] as HTMLElement).classList.add('e-rte-checklist-hidden');
                }
            }
        }
        const element: HTMLElement = tempElement.querySelector('.e-rte-insertAfterElement');
        if (element) {
            element.classList.remove('e-rte-insertAfterElement');
            const classAttribute: string = element.getAttribute('class');
            if (!classAttribute) {
                element.removeAttribute('class');
            }
        }
        // Adding style for nested list of lastly splitted list elements
        this.addStyleForNestedList(tempElement);
        this.clearEmptyList(tempElement);
        return tempElement.innerHTML.trim();
    }
    // This method applies the style of the last nested list to its parent list element if the parent lacks that style, ensuring consistent formatting for deeply nested lists.
    private addStyleForNestedList(tempElement: HTMLElement): void {
        if (tempElement.lastElementChild && (tempElement.lastElementChild.nodeName === 'OL' || tempElement.lastElementChild.nodeName === 'UL')) {
            const lastItem: HTMLElement = tempElement.lastElementChild.firstElementChild as HTMLElement;
            const textNode: Node = !isNOU(lastItem) ? this.getFirstTextNode(lastItem) : null;
            if (!isNOU(textNode)) {
                let parentOfTextNode: HTMLElement = textNode.parentNode as HTMLElement;
                if (parentOfTextNode.nodeName !== 'OL' && parentOfTextNode.nodeName !== 'UL') {
                    while (parentOfTextNode && parentOfTextNode.nodeName !== 'LI') {
                        parentOfTextNode = parentOfTextNode.parentElement as HTMLElement;
                    }
                    parentOfTextNode = parentOfTextNode.parentElement as HTMLElement;
                }
                const styles: string = lastItem.parentElement.getAttribute('style');
                if ((!parentOfTextNode.getAttribute('style') || !parentOfTextNode.getAttribute('style').includes(styles)) && !isNOU(styles)) {
                    parentOfTextNode.setAttribute('style', styles);
                }
            }
        }
    }
    // This method removes empty <ul>, <ol>, and <li> elements from the container unless they contain media elements, ensuring clean and valid HTML structure.
    private clearEmptyList(tempElement: HTMLElement): void {
        const emptyListElements: NodeListOf<HTMLElement> = tempElement.querySelectorAll('ul, ol');
        for (let i: number = 0; i < emptyListElements.length; i++) {
            const element: HTMLElement = emptyListElements[i as number];
            const hasMediaElem: HTMLElement = element.querySelector('img, video, audio, table');
            const isEmptyText: boolean = element.textContent.trim() === '';
            if (isEmptyText && !hasMediaElem) {
                detach(element);
            }
        }
        const emptyList: NodeListOf<HTMLElement> = tempElement.querySelectorAll('li:empty');
        for (let i: number = 0; i < emptyList.length; i++) {
            detach(emptyList[i as number]);
        }
    }
    // This method moves the marker class from the current element to its next sibling, ensuring the correct position for subsequent insertions.
    private updateInsertAfterMarker(marker: HTMLElement): void {
        const nextElement: HTMLElement = marker.nextElementSibling as HTMLElement;
        marker.classList.remove('e-rte-insertAfterElement');
        const classAttribute: string = marker.getAttribute('class');
        if (!classAttribute) {
            marker.removeAttribute('class');
        }
        if (nextElement) {
            nextElement.classList.add('e-rte-insertAfterElement');
        }
    }
    // This method appends collected inline nodes into a wrapper element (or inserts them with a <br> if needed), places it after the marker in the container, and resets the inline node list.
    private flushWrap(wrapElement: HTMLElement, inlineNodes: Node[], container: HTMLElement): Node[] {
        if (inlineNodes.length === 0) { return []; }
        if (wrapElement.nodeName !== 'BR') {
            for (let i: number = 0; i < inlineNodes.length; i++) {
                wrapElement.appendChild(inlineNodes[i as number]);
            }
            if (wrapElement.innerHTML.trim() !== '') {
                const marker: HTMLElement = container.querySelector('.e-rte-insertAfterElement');
                if (marker) {
                    this.domNode.insertAfter(wrapElement, marker);
                    this.updateInsertAfterMarker(marker);
                }
            }
        } else {
            const marker: HTMLElement = container.querySelector('.e-rte-insertAfterElement');
            let needToinsertBr: boolean = false;
            for (let i: number = 0; i < inlineNodes.length; i++) {
                if (inlineNodes[i as number].textContent.trim() !== '') {
                    container.insertBefore(inlineNodes[i as number], marker);
                    needToinsertBr = true;
                }
            }
            if (needToinsertBr) {
                container.insertBefore(wrapElement, marker);
            }
        }
        return [];
    }
    // This method creates a new wrapper element based on the specified tag (enterAction), applies attributes from the main list and the current element, and returns it for use in wrapping content.
    private createWrapElement(enterAction: string, mainUlOlAttributes: Record<string, string>, element: HTMLElement): HTMLElement {
        const wrapElement: HTMLElement = createElement(enterAction);
        if (wrapElement.nodeName !== 'BR') {
            if (!isNOU(mainUlOlAttributes)) {
                this.applyAllAttributes(wrapElement, mainUlOlAttributes);
            }
            const allAttributes: Record<string, string> = this.extractAllAttributes(element);
            this.addAllAttributes(wrapElement, allAttributes);
        }
        if (wrapElement.getAttribute('style')) {
            const removableStyles: string[] = ['color', 'font-size', 'font-family', 'font-weight', 'font-style'];
            removableStyles.forEach((prop: string) => {
                if (wrapElement.style.getPropertyValue(prop)) {
                    wrapElement.style.removeProperty(prop);
                }
            });
            // Remove the style attribute if no styles remain
            if (wrapElement.style.length === 0) {
                wrapElement.removeAttribute('style');
            }
        }
        return wrapElement;
    }
    // This method processes the child nodes of a list item, wrapping inline content into blocks, handling nested lists recursively, and preserving attributes for proper structure and formatting.
    private wrapperAction(element: HTMLElement, enterAction: string, tempElement: HTMLElement,
                          mainUlOlAttributes: Record<string, string>): void {
        const childNodes: Node[] = Array.from(element.childNodes);
        let inlineNodes: Node[] = [];
        for (let i: number = 0; i < childNodes.length; i++) {
            const node: Node = childNodes[i as number];
            if (node.nodeType === Node.ELEMENT_NODE) {
                const liChildNodes: HTMLElement = node as HTMLElement;
                if (this.domNode.isBlockNode(liChildNodes) && !this.isListTag(liChildNodes.nodeName)) {
                    // Output collected inline nodes as a wrapped block, then emit the block element
                    const wrapElement: HTMLElement = this.createWrapElement(enterAction, mainUlOlAttributes, element);
                    inlineNodes = this.flushWrap(wrapElement, inlineNodes, tempElement);
                    const marker: HTMLElement = tempElement.querySelector('.e-rte-insertAfterElement');
                    if (marker) {
                        if (liChildNodes.innerHTML.trim() !== '' || liChildNodes.nodeName === 'HR') {
                            if (!isNOU(mainUlOlAttributes)) {
                                this.addAllAttributes(liChildNodes, mainUlOlAttributes);
                            }
                            let parentLi: HTMLElement = liChildNodes.parentElement as HTMLElement;
                            while (parentLi && parentLi.nodeName !== 'LI' && parentLi.nodeName !== 'OL' && parentLi.nodeName !== 'UL') {
                                parentLi = parentLi.parentElement as HTMLElement;
                            }
                            const allAttributes: Record<string, string> = this.extractAllAttributes(parentLi);
                            this.addAllAttributes(liChildNodes, allAttributes);
                            this.domNode.insertAfter(liChildNodes, marker);
                            this.updateInsertAfterMarker(marker);
                        }
                    }
                } else if (this.isListTag(liChildNodes.nodeName)) {
                    // Finish current inline run, then recurse into nested lists
                    const wrapElement: HTMLElement = this.createWrapElement(enterAction, mainUlOlAttributes, element);
                    inlineNodes = this.flushWrap(wrapElement, inlineNodes, tempElement);
                    this.wrapperAction(liChildNodes, enterAction, tempElement, mainUlOlAttributes);
                } else {
                    inlineNodes.push(node);
                }
            } else {
                inlineNodes.push(node);
            }
        }
        // Flush any remaining inline nodes
        const wrapElement: HTMLElement = this.createWrapElement(enterAction, mainUlOlAttributes, element);
        this.flushWrap(wrapElement, inlineNodes, tempElement);
    }
    // This method replaces placeholder <span> tags in the input string with actual <ul>, <ol>, and <li> tags, applying optional classes and styles for proper list rendering.
    private replaceCustomSpans(input: string, mainListClass: string, mainListStyle: string): string {
        const hasStyle: boolean = !isNOU(mainListStyle);
        const hasClass: boolean = !isNOU(mainListClass);
        let openUlReplacement: string = '<ul';
        if (hasClass) {
            openUlReplacement += ' class="' + mainListClass + '"';
        }
        if (hasStyle) {
            openUlReplacement += ' style="' + mainListStyle + '"';
        }
        openUlReplacement += '>';
        let openOlReplacement: string = '<ol';
        if (hasClass) {
            openOlReplacement += ' class="' + mainListClass + '"';
        }
        if (hasStyle) {
            openOlReplacement += ' style="' + mainListStyle + '"';
        }
        openOlReplacement += '>';
        const openLiReplacement: string = (!isNOU(mainListClass) && mainListClass.indexOf('e-rte-checklist-hidden') >= 0) ? '<li class="e-rte-checklist-hidden" style="list-style-type: none;">' : '<li style="list-style-type: none;">';
        const replacements: { pattern: RegExp, replacement: string }[] = [
            {
                pattern: /<span class="e-rte-list-close-ul"><\/span>/g,
                replacement: '</ul>'
            },
            {
                pattern: /<span class="e-rte-list-close-li"><\/span>/g,
                replacement: '</li>'
            },
            {
                pattern: /<span class="e-rte-list-close-ol"><\/span>/g,
                replacement: '</ol>'
            },
            {
                pattern: /<span class="e-rte-list-open-ul e-rte-list-start"><\/span>/g,
                replacement: openUlReplacement
            },
            {
                pattern: /<span class="e-rte-list-open-ol e-rte-list-start"><\/span>/g,
                replacement: openOlReplacement
            },
            {
                pattern: /<span class="e-rte-list-open-ul"><\/span>/g,
                replacement: '<ul>'
            },
            {
                pattern: /<span class="e-rte-list-open-li"><\/span>/g,
                replacement: openLiReplacement
            },
            {
                pattern: /<span class="e-rte-list-open-ol"><\/span>/g,
                replacement: '<ol>'
            }
        ];
        let output: string = input;
        for (let i: number = 0; i < replacements.length; i++) {
            output = output.replace(replacements[i as number].pattern, replacements[i as number].replacement);
        }
        return output;
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
                const closestListMargin: string = this.getClosestListParentMargin(element);
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
                    const wrapperTag: string = isNullOrUndefined(e.enterAction) ? CONSTANT.DEFAULT_TAG : e.enterAction;
                    const targetElement: HTMLElement = element as HTMLElement;
                    if (targetElement.getAttribute('style')) {
                        const removableStyles: string[] = ['color', 'font-size', 'font-family', 'font-weight', 'font-style'];
                        removableStyles.forEach((prop: string) => {
                            if (targetElement.style.getPropertyValue(prop)) {
                                targetElement.style.removeProperty(prop);
                            }
                        });
                        // Remove the style attribute if no styles remain
                        if (targetElement.style.length === 0) {
                            targetElement.removeAttribute('style');
                        }
                    }
                    const wrapper: string = '<' + wrapperTag + wrapperclass + this.domNode.attributes(element) + '></' + wrapperTag + '>';
                    const tempElement: HTMLElement = document.createElement('div');
                    tempElement.innerHTML = wrapper;
                    if (closestListMargin !== '') {
                        (tempElement.firstElementChild as HTMLElement).style.marginLeft = closestListMargin;
                    }
                    if (e.enterAction !== 'BR') {
                        this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(tempElement.innerHTML));
                    }
                    else if (element.textContent !== '') {
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
                    let replace: string = this.domNode.createTagString(
                        CONSTANT.DEFAULT_TAG, parentNode, '<br>' + (this.domNode.contents(element)[0] as HTMLElement).outerHTML);
                    if (this.domNode.contents(element)[1] as Element && (this.domNode.contents(element)[1] as Element).tagName === 'BR') {
                        (this.domNode.contents(element)[1] as Element).remove();
                        replace = this.domNode.createTagString(CONSTANT.DEFAULT_TAG, parentNode, '<br>' + (this.domNode.contents(element)[0] as HTMLElement).outerHTML);
                    } else {
                        replace = this.domNode.createTagString(
                            CONSTANT.DEFAULT_TAG, parentNode, (this.domNode.contents(element)[0] as HTMLElement).outerHTML);
                    }
                    this.domNode.replaceWith(this.domNode.contents(element)[0] as Element, replace);
                } else {
                    const childNode: Element = element.firstChild as Element;
                    if (childNode) {
                        const attributes: NamedNodeMap = element.parentElement.attributes;
                        if (attributes.length > 0) {
                            for (let d: number = 0; d < attributes.length; d++) {
                                const e: Attr = attributes[d as number];
                                const clean: (v: string) => string = (v: string): string =>
                                    v ? v.split(';').filter((s: string): boolean => !/list-style-(image|type):/.test(s.trim())).join(';').trim() : '';
                                const existingValue: string = clean(childNode.getAttribute(e.nodeName));
                                const parentValue: string = clean(element.parentElement.getAttribute(e.nodeName));
                                if (existingValue && existingValue !== parentValue ) {
                                    childNode.setAttribute(e.nodeName, existingValue ? parentValue + ' ' + existingValue : parentValue);
                                } else {
                                    childNode.setAttribute(e.nodeName, parentValue);
                                }
                                if ((childNode as HTMLElement).style.length === 0) {
                                    childNode.removeAttribute('style');
                                }
                            }
                        }
                    }
                    className = childNode.getAttribute('class');
                    if (className && childNode.getAttribute('class') && className !== childNode.getAttribute('class')) {
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
        this.revertCheckListClasses();
    }
    private revertCheckListClasses(): void {
        const searchContainer: Element = this.parent.editableElement;
        const checkListElements: NodeListOf<Element> = searchContainer.querySelectorAll('.e-rte-checklist');
        checkListElements.forEach((element: Element) => {
            if (element.nodeName !== 'UL' && element.classList.contains('e-rte-checklist')) {
                removeClass([element], ['e-rte-checklist']);
                if (element.getAttribute('class') === '') {
                    element.removeAttribute('class');
                }
            }
        });
        const checkedListContainers: NodeListOf<Element> = searchContainer.querySelectorAll('.e-rte-checklist-checked');
        checkedListContainers.forEach((element: Element) => {
            if (element.nodeName !== 'LI') {
                removeClass([element], ['e-rte-checklist-checked']);
                if (element.getAttribute('class') === '') {
                    element.removeAttribute('class');
                }
            }
        });
    }
    private getClosestListParentMargin(element: Element): string {
        let current: Element | null = element;
        while (current && current !== this.parent.editableElement) {
            if (current.nodeName === 'UL' || current.nodeName === 'OL') {
                return (current as HTMLElement).style.marginLeft;
            }
            current = current.parentElement;
        }
        return '';
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
    private areAllListItemsSelected(list: HTMLElement, range: Range): boolean {
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

    private getListCursorInfo(range: Range): ListCursorInfo {
        let position: ListCursorPosition;
        let selectionState: ListSelectionState;
        const domMethods: DOMMethods = new DOMMethods(this.parent.editableElement as HTMLDivElement);
        const startNode: Node = range.startContainer.nodeType === Node.TEXT_NODE ?
            domMethods.getTopMostNode(range.startContainer as Text) : range.startContainer;
        const endNode: Node = range.endContainer.nodeType === Node.TEXT_NODE ?
            domMethods.getTopMostNode(range.endContainer as Text) : range.endContainer;
        const isSelection: boolean = !range.collapsed;
        const startList: HTMLLIElement = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement.closest('li') :
            (startNode as HTMLElement).closest('li');
        const endList: HTMLLIElement = endNode.nodeType === Node.TEXT_NODE ? endNode.parentElement.closest('li') :
            (endNode as HTMLElement).closest('li');
        const isNestedStart: boolean = startList && startList.closest('ol, ul') ? this.checkIsNestedList(startList.closest('ol, ul') as HTMLElement) : false;
        const isNestedEnd: boolean = endList && endList.closest('ol, ul') ? this.checkIsNestedList(endList.closest('ol, ul') as HTMLElement) : false;
        const blockNodes: HTMLElement[] = this.parent.domNode.blockNodes() as HTMLElement[];
        const length: number = blockNodes.length;
        const itemType: ListItemType = this.getListSelectionType(isNestedStart ? 'Nested' : 'Parent', isNestedEnd ? 'Nested' : 'Parent');
        if (isSelection) {
            if (blockNodes.length === 1) {
                selectionState = range.startOffset === 0 && range.endOffset === startList.textContent.length ? 'SingleFull' : 'SinglePartial';
            } else {
                selectionState = range.startOffset === 0 && range.endOffset === blockNodes[length - 1].textContent.length ? 'MultipleFull' : 'MultiplePartial';
            }
            position = 'None';
        } else {
            if (range.startOffset === 0 && startNode.previousSibling === null) {
                position = isNestedStart ? 'StartNested' : 'StartParent';
            } else if (range.startOffset === startList.textContent.length && startNode.nextSibling === null) {
                position = isNestedStart ? 'EndNested' : 'EndParent';
            } else {
                position = isNestedStart ? 'MiddleNested' : 'MiddleParent';
            }
            selectionState = 'None';
        }
        return { position, selectionState, itemType };
    }

    private checkIsNestedList(listParent: HTMLElement): boolean {
        const isDirectParent: boolean = listParent.parentElement === this.parent.editableElement as HTMLElement;
        if (isDirectParent) { // Check if the list is directly under the editable element.
            return false;
        }
        if (listParent.closest('li')) {
            return true;
        }
        return false;
    }

    private getListSelectionType(start: ListItemType, end: ListItemType): ListItemType {
        if (start === 'Nested' && end === 'Nested') {
            return 'Nested';
        } else if (start === 'Parent' && end === 'Parent') {
            return 'Parent';
        } else {
            return 'Mixed';
        }
    }

    private isAllListNodesSelected(list: HTMLOListElement | HTMLUListElement): boolean {
        const selection: Selection = this.parent.currentDocument.getSelection();
        let isAllSelected: boolean = false;
        const liNodes: NodeListOf<HTMLLIElement> = list.querySelectorAll('li');
        for (let i: number = 0; i < liNodes.length; i++) {
            if (selection.containsNode(liNodes[i as number], false)) {
                isAllSelected = true;
            } else {
                isAllSelected = false;
                break;
            }
        }
        return isAllSelected;
    }
    private formatListStyle(listStyle: string): string {
        // Handle known lowercase patterns like "lowergreek"
        const knownPattern: RegExp = /^(lower|upper)(greek|alpha|roman)$/i;
        if (knownPattern.test(listStyle)) {
            return listStyle.replace(knownPattern, (_ : string, p1 : string, p2 : string) => `${p1}-${p2}`).toLowerCase();
        }
        // Handle camelCase like "lowerGreek"
        return listStyle.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}

/**
 * @hidden
 */
type ListCursorPosition =
    | 'StartParent'    // Cursor is at the start of a parent list item
    | 'StartNested'    // Cursor is at the start of a nested list item
    | 'MiddleParent'   // Cursor is in the middle of a parent list item
    | 'MiddleNested'   // Cursor is in the middle of a nested list item
    | 'EndParent'      // Cursor is at the end of a parent list item
    | 'EndNested'      // Cursor is at the end of a nested list item
    | 'None';          // Selection range

/**
 * @hidden
 */
type ListSelectionState =
    | 'None'           // Cursor range
    | 'SingleFull'     // Single list item fully selected
    | 'SinglePartial'  // Single list item partially selected
    | 'MultipleFull'   // Multiple list items fully selected
    | 'MultiplePartial'; // Multiple list items partially selected

/**
 * @hidden
 */
type ListItemType =
| 'Parent'      // Basic List
| 'Nested'      // Nested List
| 'Mixed';      // Both Parent and Nested List

/**
 * To get the details of the Current list selection.
 *
 * @hidden
 */
interface ListCursorInfo {
    /**
     *  Gives the current cursor position when the `range.collapsed` is `true`.
     */
    position: ListCursorPosition;
    /**
     * Gives the current selection state when the `range.collapsed` is `false`.
     */
    selectionState: ListSelectionState;
    /**
     * Gives the current list item type.
     */
    itemType: ListItemType;
}
