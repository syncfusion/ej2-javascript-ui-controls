import { isNullOrUndefined as isNOU, KeyboardEventArgs, detach, Browser } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { IRichTextEditor, ActionBeginEventArgs } from '../base/interface';
import { NotifyArgs } from '../base/interface';

/**
 * `EnterKey` module is used to handle enter key press actions.
 */
export class EnterKeyAction {
    private parent: IRichTextEditor;
    private range: Range;
    private startNode: Element;
    private endNode: Element;
    public constructor(parent?: IRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.on(events.enterHandler, this.enterHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
    }
    private removeEventListener(): void {
        this.parent.off(events.enterHandler, this.enterHandler);
        this.parent.off(events.destroy, this.destroy);
    }
    private getRangeNode(): void {
        this.range = this.parent.getRange();
        this.startNode = this.range.startContainer.nodeName === '#text' ? this.range.startContainer.parentElement :
            this.range.startContainer as Element;
        this.endNode = this.range.endContainer.nodeName === '#text' ? this.range.endContainer.parentElement :
            this.range.endContainer as Element;
    }
    private enterHandler(e?: NotifyArgs): void {
        this.getRangeNode();
        let isTableEnter: boolean = true;
        if (!isNOU(this.startNode.closest('TABLE')) && !isNOU(this.endNode.closest('TABLE'))) {
            isTableEnter = false;
            let curElement: HTMLElement = this.startNode as HTMLElement;
            let blockElement: HTMLElement = curElement;
            while (!this.parent.formatter.editorManager.domNode.isBlockNode(curElement)) {
                blockElement = curElement;
                curElement = curElement.parentElement;
            }
            isTableEnter = blockElement.tagName === 'TD' ? false : true;
        }
        if ((e.args as KeyboardEventArgs).which === 13 && (e.args as KeyboardEventArgs).code === 'Enter') {
            if (isNOU(this.startNode.closest('LI')) && isNOU(this.endNode.closest('LI')) && isTableEnter &&
            isNOU(this.startNode.closest('PRE')) && isNOU(this.endNode.closest('PRE'))) {
                const shiftKey: boolean = (e.args as KeyboardEventArgs).shiftKey;
                const actionBeginArgs: ActionBeginEventArgs = {
                    cancel: false,
                    name: events.actionBegin,
                    requestType: shiftKey ? 'ShiftEnterAction' : 'EnterAction',
                    originalEvent: (e.args as KeyboardEventArgs)
                };
                this.parent.trigger(events.actionBegin, actionBeginArgs, (actionBeginArgs: ActionBeginEventArgs) => {
                    if (!actionBeginArgs.cancel) {
                        if (!(this.range.startOffset === this.range.endOffset && this.range.startContainer === this.range.endContainer)) {
                            this.range.deleteContents();
                            if (this.range.startContainer.nodeName === '#text' && this.range.startContainer.textContent.length === 0 &&
                            this.range.startContainer.parentElement !== this.parent.inputElement) {
                                if (this.parent.enterKey === 'BR') {
                                    this.range.startContainer.parentElement.innerHTML = '&#8203;';
                                } else {
                                    this.range.startContainer.parentElement.innerHTML = '<br>';
                                }
                            } else if (this.range.startContainer === this.parent.inputElement && (this.range.startContainer as HTMLElement).innerHTML === '') {
                                (this.range.startContainer as HTMLElement).innerHTML = '<br>';
                                const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
                                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                    this.parent.contentModule.getDocument(),
                                    focusElem as Element, 0);
                            } else if (this.parent.inputElement === this.range.startContainer) {
                                const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
                                if (focusElem.nodeName === '#text' && focusElem.textContent.length === 0) {
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(),
                                        focusElem as Element, focusElem.previousSibling.textContent.length);
                                } else {
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(),
                                        focusElem as Element, focusElem.textContent.length >= 0 ? 0 : 1);
                                    if (focusElem.previousSibling.textContent.length === 0) {
                                        detach(focusElem.previousSibling);
                                    } else if (focusElem.textContent.length === 0) {
                                        let currentFocusElem: Node = focusElem.previousSibling.lastChild;
                                        while (currentFocusElem.nodeName !== '#text') {
                                            currentFocusElem = currentFocusElem.lastChild;
                                        }
                                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                            this.parent.contentModule.getDocument(),
                                            currentFocusElem as Element, currentFocusElem.textContent.length);
                                        detach(focusElem);
                                    } else if (this.parent.enterKey !== 'BR' &&
                                    focusElem.previousSibling.textContent.length !== 0 && focusElem.textContent.length !== 0) {
                                        (e.args as KeyboardEventArgs).preventDefault();
                                        return;
                                    }
                                }
                                this.getRangeNode();
                            }
                        }
                        if (this.range.startContainer === this.range.endContainer &&
                            this.range.startOffset === this.range.endOffset && this.range.startContainer === this.parent.inputElement) {
                            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                this.parent.contentModule.getDocument(),
                                this.range.startContainer.childNodes[this.range.startOffset] as Element, 0);
                            this.getRangeNode();
                        }
                        if ((this.parent.enterKey === 'P' && !shiftKey) || (this.parent.enterKey === 'DIV' && !shiftKey) ||
                        (this.parent.shiftEnterKey === 'P' && shiftKey) ||
                        (this.parent.shiftEnterKey === 'DIV' && shiftKey)) {
                            let nearBlockNode: Element;
                            if (isTableEnter && this.parent.formatter.editorManager.domNode.isBlockNode(this.startNode)) {
                                nearBlockNode = this.startNode;
                            } else {
                                nearBlockNode = this.parent.formatter.editorManager.domNode.blockParentNode(this.startNode);
                            }
                            let isImageNode: boolean = false;
                            let isFocusedFirst: boolean = false;
                            if (this.range.startOffset != 0 && this.range.endOffset != 0 && this.range.startContainer === this.range.endContainer &&
                                !(!isNOU(nearBlockNode.childNodes[0]) && nearBlockNode.childNodes[0].nodeName === 'IMG')) {
                                let startNodeText: string = this.range.startContainer.textContent;
                                let splitFirstText: string = startNodeText.substring(0, this.range.startOffset);
                                if (splitFirstText.charCodeAt(this.range.startOffset - 1) != 160 && splitFirstText.trim().length === 0) {
                                    isFocusedFirst = true;
                                }
                            } else if (this.range.startOffset === 0 && this.range.endOffset === 0) {
                                isFocusedFirst = true;
                            }
                            this.removeBRElement(nearBlockNode);
                            if (((this.range.startOffset === 0 && this.range.endOffset === 0) || isFocusedFirst) &&
                                !(!isNOU(this.range.startContainer.previousSibling) &&
                                (this.range.startContainer.previousSibling.nodeName === 'IMG' || this.range.startContainer.previousSibling.nodeName === 'BR'))) {
                                let isNearBlockLengthZero: boolean;
                                let newElem: Node;
                                if (this.range.startContainer.nodeName === 'IMG') {
                                    newElem = this.createInsertElement(shiftKey);
                                    isImageNode = true;
                                    isNearBlockLengthZero = false;
                                } else {
                                    if (nearBlockNode.textContent.trim().length !== 0) {
                                        newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                            this.range, (nearBlockNode as HTMLElement), false).cloneNode(true);
                                        isNearBlockLengthZero = false;
                                    } else {
                                        newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                            this.range, (nearBlockNode as HTMLElement), true).cloneNode(true);
                                        isNearBlockLengthZero = true;
                                    }
                                }
                                const insertElem: HTMLElement = this.createInsertElement(shiftKey);
                                while (newElem.firstChild) {
                                    insertElem.appendChild(newElem.firstChild);
                                }
                                nearBlockNode.parentElement.insertBefore(insertElem, nearBlockNode);
                                if (!isNearBlockLengthZero) {
                                    let currentFocusElem: Node = insertElem;
                                    let finalFocusElem: Node;
                                    while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text') {
                                        finalFocusElem = currentFocusElem;
                                        currentFocusElem = currentFocusElem.lastChild;
                                    }
                                    (finalFocusElem as HTMLElement).innerHTML = '<br>';
                                    if (!isImageNode) {
                                        detach(nearBlockNode);
                                    }
                                }
                                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                    this.parent.contentModule.getDocument(), (insertElem as Element).nextElementSibling,
                                    0);
                            } else if (nearBlockNode.textContent.length === 0 && !(!isNOU(nearBlockNode.childNodes[0]) && nearBlockNode.childNodes[0].nodeName === 'IMG')) {
                                if (!isNOU(nearBlockNode.children[0]) && nearBlockNode.children[0].tagName !== 'BR') {
                                    const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                        this.range, (nearBlockNode as HTMLElement), false).cloneNode(true);
                                    this.parent.formatter.editorManager.domNode.insertAfter((newElem as Element), nearBlockNode);
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(), (newElem as Element),
                                        newElem.textContent.length >= 0 ? 0 : 1);
                                } else {
                                    const insertElem: HTMLElement = this.createInsertElement(shiftKey);
                                    insertElem.innerHTML = '<br>';
                                    this.parent.formatter.editorManager.domNode.insertAfter(insertElem, nearBlockNode);
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(), insertElem, 0);
                                }
                            } else {
                                const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                    this.range, (nearBlockNode as HTMLElement), true);
                                if (!isNOU(newElem.childNodes[0]) && newElem.childNodes[0].nodeName === '#text' &&
                                    newElem.childNodes[0].textContent.length === 0) {
                                    detach(newElem.childNodes[0]);
                                }
                                if (newElem.textContent.trim().length === 0) {
                                    const brElm: HTMLElement = this.parent.createElement('br');
                                    if (this.startNode.nodeName === 'A') {
                                        let startParentElem: HTMLElement = this.startNode.parentElement;
                                        this.startNode.parentElement.insertBefore(brElm, this.startNode);
                                        detach(this.startNode);
                                        this.startNode = startParentElem;
                                    } else {
                                        this.startNode.appendChild(brElm);
                                    }
                                    if (newElem.childNodes[0].textContent === '\n') {
                                        detach(newElem.childNodes[0]);
                                    }
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(), this.startNode, 0);
                                }
                                if (((this.parent.enterKey === 'P' || this.parent.enterKey === 'DIV') && !shiftKey) || ((this.parent.shiftEnterKey === 'DIV' ||
                                    this.parent.shiftEnterKey === 'P') && shiftKey)) {
                                    const insertElm: HTMLElement = this.createInsertElement(shiftKey);
                                    while (newElem.firstChild) {
                                        insertElm.appendChild(newElem.firstChild);
                                    }
                                    this.parent.formatter.editorManager.domNode.insertAfter(insertElm, (newElem as HTMLElement));
                                    detach(newElem);
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(),
                                        this.parent.formatter.editorManager.domNode.isBlockNode(this.startNode) ?
                                            insertElm : this.startNode, 0);
                                }
                            }
                            (e.args as KeyboardEventArgs).preventDefault();
                        }
                        if ((this.parent.enterKey === 'BR' && !shiftKey) || (this.parent.shiftEnterKey === 'BR' && shiftKey)) {
                            let currentParent: HTMLElement;
                            if (!this.parent.formatter.editorManager.domNode.isBlockNode(this.startNode)) {
                                let currentNode: Node = this.startNode;
                                let previousNode: Node = currentNode;
                                while (!this.parent.formatter.editorManager.domNode.isBlockNode(currentNode as HTMLElement)) {
                                    previousNode = currentNode;
                                    currentNode = currentNode.parentElement;
                                }
                                currentParent = currentNode === this.parent.inputElement ?
                                    (previousNode as HTMLElement) : (currentNode as HTMLElement);
                            }
                            else {
                                currentParent = this.startNode as HTMLElement;
                            }
                            this.removeBRElement(currentParent);
                            let isEmptyBrInserted: boolean = false;
                            let currentParentLastChild: Node = currentParent.lastChild; 
                            while (!isNOU(currentParentLastChild) && !(currentParentLastChild.nodeName === '#text' || currentParentLastChild.nodeName === 'BR')) {
                                currentParentLastChild = currentParentLastChild.lastChild;
                            }
                            const isLastNodeLength = this.range.startContainer === currentParentLastChild ?
                            this.range.startContainer.textContent.length : currentParent.textContent.length;
                            if (currentParent !== this.parent.inputElement &&
                                this.parent.formatter.editorManager.domNode.isBlockNode(currentParent) &&
                                this.range.startOffset === this.range.endOffset &&
                                this.range.startOffset === isLastNodeLength) {
                                const focusBRElem: HTMLElement = this.parent.createElement('br');
                                if (currentParentLastChild.nodeName === 'BR' && currentParent.textContent.length === 0) {
                                    this.parent.formatter.editorManager.domNode.insertAfter(focusBRElem, (currentParentLastChild as Element));
                                } else {
                                    const lineBreakBRElem: HTMLElement = this.parent.createElement('br');
                                    this.parent.formatter.editorManager.domNode.insertAfter(focusBRElem, (this.range.startContainer as Element));
                                    this.parent.formatter.editorManager.domNode.insertAfter(lineBreakBRElem, (this.range.startContainer as Element));
                                }
                                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                    this.parent.contentModule.getDocument(), focusBRElem, 0);
                            } else if (!isNOU(currentParent) && currentParent !== this.parent.inputElement && currentParent.nodeName !== 'BR') {
                                if (currentParent.textContent.trim().length === 0 || (currentParent.textContent.trim().length === 1 &&
                                    currentParent.textContent.charCodeAt(0) === 8203)) {
                                    const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                        this.range, currentParent, true).cloneNode(true);
                                    this.parent.formatter.editorManager.domNode.insertAfter((newElem as HTMLElement), currentParent);
                                    const outerBRElem: HTMLElement = this.parent.createElement('br');
                                    newElem.parentElement.insertBefore(outerBRElem, newElem);
                                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                        this.parent.contentModule.getDocument(), newElem as Element, 0);
                                } else {
                                    let newElem: Node;
                                    const outerBRElem: HTMLElement = this.parent.createElement('br');
                                    if (this.range.startOffset === 0 && this.range.endOffset === 0 &&
                                        !isNOU(currentParent.previousSibling) && currentParent.previousSibling.nodeName === 'BR') {
                                        newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                            this.range, currentParent, false).cloneNode(true);
                                        this.parent.formatter.editorManager.domNode.insertAfter(outerBRElem, currentParent);
                                        this.insertFocusContent();
                                        let currentFocusElem: Node = outerBRElem.nextSibling;
                                        while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text') {
                                            currentFocusElem = currentFocusElem.lastChild;
                                        }
                                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                            this.parent.contentModule.getDocument(), currentFocusElem as Element, 0);
                                        isEmptyBrInserted = true;
                                    } else {
                                        this.insertBRElement();
                                    }
                                }
                            } else {
                                this.insertBRElement();
                            }
                            (e.args as KeyboardEventArgs).preventDefault();
                        }
                        this.parent.trigger(events.actionComplete, { requestType: shiftKey ? 'ShiftEnterAction' : 'EnterAction', args: (e.args as KeyboardEventArgs) });
                    }
                });
            }
        }
    }
    
    private removeBRElement(currentElement: Node): void {
        if (Browser.userAgent.indexOf('Firefox') != -1 &&
        this.range.endOffset === currentElement.textContent.length && (currentElement.textContent.length !== 0 || 
        (currentElement as HTMLElement).querySelectorAll('BR').length > 1) &&
        !isNOU(currentElement.lastChild) && currentElement.lastChild.nodeName === 'BR') {
            detach(currentElement.lastChild);
        }
    }

    private insertBRElement(): void {
        let isEmptyBrInserted: boolean = false;
        const brElm: HTMLElement = this.parent.createElement('br');
        if (this.startNode.nodeName === 'BR' && this.endNode.nodeName === 'BR' && this.range.startOffset === 0 && this.range.startOffset === this.range.endOffset) {
            this.parent.formatter.editorManager.domNode.insertAfter(brElm, this.startNode);
            isEmptyBrInserted = true;
        } else {
            if (this.startNode === this.parent.inputElement && !isNOU(this.range.startContainer.previousSibling) &&
                this.range.startContainer.previousSibling.nodeName === 'BR' && this.range.startContainer.textContent.length === 0) {
                isEmptyBrInserted = true;
            }
            this.range.insertNode(brElm);
        }
        if (isEmptyBrInserted || (!isNOU(brElm.nextElementSibling) && brElm.nextElementSibling.tagName === 'BR') || (!isNOU(brElm.nextSibling) && brElm.nextSibling.textContent.length > 0)) {
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                this.parent.contentModule.getDocument(),
                !isNOU(brElm.nextSibling) ? (brElm.nextSibling as Element) : brElm, 0);
            isEmptyBrInserted = false;
        } else {
            const brElm2: HTMLElement = this.parent.createElement('br');
            this.range.insertNode(brElm2);
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                this.parent.contentModule.getDocument(), brElm, 0);
        }
    }
    private insertFocusContent(): void {
        if (this.range.startContainer.textContent.length === 0) {
            if (this.range.startContainer.nodeName === '#text') {
                this.range.startContainer.parentElement.innerHTML = '&#8203;';
            } else {
                (this.range.startContainer as HTMLElement).innerHTML = '&#8203;';
            }
        }
    }

    private createInsertElement(shiftKey: boolean): HTMLElement {
        let insertElem: HTMLElement;
        if ((this.parent.enterKey === 'DIV' && !shiftKey) || (this.parent.shiftEnterKey === 'DIV' && shiftKey)) {
            insertElem = this.parent.createElement('div');
        } else if ((this.parent.enterKey === 'P' && !shiftKey) || (this.parent.shiftEnterKey === 'P' && shiftKey)) {
            insertElem = this.parent.createElement('p');
        }
        return insertElem;
    }
}
