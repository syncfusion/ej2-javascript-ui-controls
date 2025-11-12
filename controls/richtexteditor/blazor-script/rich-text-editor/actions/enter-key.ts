import { isNullOrUndefined as isNOU, KeyboardEventArgs, detach, createElement, Browser } from '../../../base'; /*externalscript*/
import * as events from '../constant';
import { SfRichTextEditor } from '../sf-richtexteditor-fn';
import { NotifyArgs, ActionBeginEventArgs } from '../../editor-scripts/common/interface';
import { ActionCompleteEventArgs } from '../../editor-scripts/common/interface';
import { ImageOrTableCursor } from '../interfaces';
/**
 * `EnterKey` module is used to handle enter key press actions.
 */
export class EnterKeyAction {
    private parent: SfRichTextEditor;
    private range: Range;
    private startNode: Element;
    private endNode: Element;
    private formatTags: string[];
    public constructor(parent?: SfRichTextEditor) {
        this.parent = parent;
        this.addEventListener();
    }
    protected addEventListener(): void {
        this.parent.observer.on(events.enterHandler, this.beforeEnterHandler, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }
    private destroy(): void {
        this.removeEventListener();
    }
    private removeEventListener(): void {
        this.parent.observer.off(events.enterHandler, this.beforeEnterHandler);
        this.parent.observer.off(events.destroy, this.destroy);
    }
    private getRangeNode(): void {
        this.range = this.parent.getRange();
        this.startNode = this.range.startContainer.nodeName === '#text' ? this.range.startContainer.parentElement :
            this.range.startContainer as Element;
        this.endNode = this.range.endContainer.nodeName === '#text' ? this.range.endContainer.parentElement :
            this.range.endContainer as Element;
    }
    private beforeEnterHandler(e: NotifyArgs): void {
        if (!isNOU(document.querySelector('.e-mention.e-popup-open'))) { return; }
        this.getRangeNode();
        let isTableEnter: boolean = true;
        this.formatTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'];
        const tableImagCursor: ImageOrTableCursor = this.processedTableImageCursor();
        const codeBlockPasteAction: Element = (this.parent.formatter.editorManager.codeBlockObj
            .isValidCodeBlockStructure(this.range.startContainer) ||
            this.parent.formatter.editorManager.codeBlockObj.isValidCodeBlockStructure(this.range.endContainer));
        if (!isNOU(codeBlockPasteAction)) {
            this.parent.observer.notify(events.codeBlockEnter, e);
            return;
        }
        if (tableImagCursor.start || tableImagCursor.end) {
            if (tableImagCursor.startName === 'TABLE' || tableImagCursor.endName === 'TABLE') { // Default browser action prevented and hanled manually.
                this.handleCursorAtTableSide(e, tableImagCursor.start, tableImagCursor.end);
                return;
            }
        }
        if (tableImagCursor.start || tableImagCursor.end || this.range.startContainer.nodeName === 'IMG') {
            if (this.parent.enterKey === 'BR' &&  (tableImagCursor.startName === 'IMG' || tableImagCursor.endName === 'IMG' || this.range.startContainer.nodeName === 'IMG' )) { // Default browser action prevented and hanled manually.
                this.handleEnterKeyAtImageSide(e, tableImagCursor.start, tableImagCursor.end);
                return;
            }
        }
        if (!isNOU(this.startNode.closest('TABLE')) && !isNOU(this.endNode.closest('TABLE'))) {
            isTableEnter = false;
            let curElement: HTMLElement = this.startNode as HTMLElement;
            let blockElement: HTMLElement = curElement;
            while (!this.parent.formatter.editorManager.domNode.isBlockNode(curElement)) {
                curElement = curElement.parentElement;
                blockElement = curElement;
            }
            isTableEnter = blockElement.tagName === 'TH' || blockElement.tagName === 'TD' || blockElement.tagName === 'TBODY' ? false : true;
        }
        const eventArgs: KeyboardEventArgs = e.args as KeyboardEventArgs;
        if (eventArgs.which === 13 && !eventArgs.ctrlKey && (!Browser.isDevice ? (eventArgs.code === 'Enter' || eventArgs.code === 'NumpadEnter') : eventArgs.key === 'Enter' )) {
            if (isNOU(this.startNode.closest('LI, UL, OL')) && isNOU(this.endNode.closest('LI, UL, OL')) &&
            isNOU(this.startNode.closest('.e-img-inner')) && isTableEnter &&
            isNOU(this.startNode.closest('PRE')) && isNOU(this.endNode.closest('PRE')) &&
            isNOU(this.startNode.closest('BLOCKQUOTE')) && isNOU(this.endNode.closest('BLOCKQUOTE'))) {
                (e.args as KeyboardEvent).preventDefault();
                if (this.parent.actionBeginEnabled) {
                    const actionBeginArgs: ActionBeginEventArgs = {
                        name: events.actionBegin,
                        requestType: (e.args as KeyboardEventArgs).shiftKey ? 'ShiftEnterAction' : 'EnterAction',
                        originalEvent: (e.args as KeyboardEventArgs),
                        cancel: false
                    };
                    (this.parent.dotNetRef.invokeMethodAsync(
                        // eslint-disable-next-line max-len
                        events.actionBeginEvent, actionBeginArgs as any) as unknown as Promise<ActionBeginEventArgs>).then((actionBeginArgs: ActionBeginEventArgs) => {
                        if (!actionBeginArgs.cancel) {
                            this.enterHanlder(e, isTableEnter);
                        }
                    });
                } else {
                    this.enterHanlder(e, isTableEnter);
                    this.parent.inputElement.dispatchEvent(new Event('input'));
                }
            }
        }
    }

    private enterHanlder(e: NotifyArgs, isTableEnter: boolean): void {
        (e.args as KeyboardEventArgs).preventDefault();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        const shiftKey: boolean = (e.args as KeyboardEventArgs).shiftKey;
        if (!(this.range.startOffset === this.range.endOffset && this.range.startContainer === this.range.endContainer)) {
            if (this.range.startContainer.nodeType === Node.TEXT_NODE || !((this.range.startContainer.nodeName === 'IMG' || (this.range.startContainer as HTMLElement).querySelector('img')) ||
                this.range.startContainer.nodeName === 'SPAN' && ((this.range.startContainer as HTMLElement).classList.contains('e-video-wrap') ||
                    (this.range.startContainer as HTMLElement).classList.contains('e-audio-wrap')))) {
                this.range.deleteContents();
            }
            if (this.range.startContainer.nodeName === '#text' && this.range.startContainer.textContent.length === 0 &&
            this.range.startContainer.parentElement !== this.parent.inputElement) {
                if (this.parent.enterKey === 'BR') {
                    this.range.startContainer.parentElement.innerHTML = '&#8203;';
                } else {
                    this.range.startContainer.parentElement.innerHTML = '<br>';
                }
            } else if (this.range.startContainer === this.parent.inputElement && (this.range.startContainer as HTMLElement).innerHTML === '') {
                if (this.parent.enterKey === 'P') {
                    (this.range.startContainer as HTMLElement).innerHTML = '<p><br></p>';
                } else if (this.parent.enterKey === 'DIV') {
                    (this.range.startContainer as HTMLElement).innerHTML = '<div><br></div>';
                } else {
                    (this.range.startContainer as HTMLElement).innerHTML = '<br>';
                }
                const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(),
                    focusElem as Element, 0);
            } else if (this.parent.inputElement === this.range.startContainer) {
                const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
                if (focusElem.nodeName === '#text' && focusElem.textContent.length === 0) {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(),
                        focusElem as Element,
                        focusElem.textContent.length === 0 ? 0 : focusElem.previousSibling.textContent.length);
                } else {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(),
                        focusElem as Element, focusElem.textContent.length >= 0 ? 0 : 1);
                    if (focusElem.previousSibling.textContent.length === 0) {
                        detach(focusElem.previousSibling);
                        if (!shiftKey) {
                            let currentFocusElem: Node = !isNOU(focusElem.lastChild) ? focusElem.lastChild : focusElem;
                            while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text' && currentFocusElem.nodeName !== 'BR') {
                                currentFocusElem = currentFocusElem.lastChild;
                            }
                            if (currentFocusElem.nodeName !== 'BR' && currentFocusElem.parentElement.textContent.length === 0 && currentFocusElem.parentElement.innerHTML.length === 0 &&
                            currentFocusElem.parentElement.nodeName !== 'BR') {
                                currentFocusElem.parentElement.appendChild(createElement('BR'));
                            }
                            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                this.parent.getDocument(),
                                currentFocusElem.nodeName === 'BR' ? currentFocusElem as Element : currentFocusElem.parentElement as Element,
                                currentFocusElem.parentElement.textContent.length >= 0 || currentFocusElem.nodeName === 'BR' ? 0 : 1);
                        }
                    } else if (focusElem.textContent.length === 0) {
                        let currentFocusElem: Node = focusElem.previousSibling.nodeName === '#text' ? focusElem.previousSibling : focusElem.previousSibling.lastChild;
                        while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text') {
                            currentFocusElem = currentFocusElem.lastChild;
                        }
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(),
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
            if (!isNOU(this.range.startContainer.childNodes[this.range.startOffset]) &&
            !isNOU((this.range.startContainer.childNodes[this.range.startOffset] as Element).previousElementSibling) &&
            (this.parent.tableModule && this.parent.tableModule.tableObj &&
                this.range.startContainer.childNodes[this.range.startOffset] as Element).previousElementSibling.nodeName === 'TABLE') {
                this.parent.tableModule.tableObj.removeResizeElement();
            }
            if (!(this.parent.inputElement.childNodes.length === 1 && this.parent.inputElement.childNodes[0].nodeName === 'TABLE')) {
                if (isNOU(this.range.startContainer.childNodes[this.range.startOffset] as Element)) {
                    let currentLastElem: Element = this.range.startContainer.childNodes[this.range.startOffset - 1] as Element;
                    while (currentLastElem.lastChild !== null && currentLastElem.nodeName !== '#text') {
                        currentLastElem = currentLastElem.lastChild as Element;
                    }
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(),
                        currentLastElem, (currentLastElem.nodeName === 'BR' ? 0 : currentLastElem.textContent.length));
                } else {
                    this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                        this.parent.getDocument(),
                        this.range.startContainer.childNodes[this.range.startOffset] as Element, 0);
                }
            }
            this.getRangeNode();
        }
        const isImageAtStartNode: boolean = (this.range.startContainer.childNodes.length > 0 && this.range.startContainer.childNodes[0].textContent.trim() === ''
            && !isNOU(this.range.startContainer.childNodes[this.range.startOffset]) && this.range.startContainer.childNodes[this.range.startOffset].nodeName === 'IMG');
        if ((this.parent.enterKey === 'P' && !shiftKey) || (this.parent.enterKey === 'DIV' && !shiftKey) ||
        (this.parent.shiftEnterKey === 'P' && shiftKey) ||
        (this.parent.shiftEnterKey === 'DIV' && shiftKey)) {
            if ((this.range.startOffset === 1 && this.parent.inputElement.childNodes.length === 1 && this.parent.inputElement.childNodes[0].nodeName === 'TABLE')) {
                const newElem: Element = this.createInsertElement(shiftKey);
                newElem.appendChild(createElement('BR'));
                this.parent.inputElement.appendChild(newElem);
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(), newElem, 0);
            } else {
                let nearBlockNode: Element;
                if (isTableEnter && this.parent.formatter.editorManager.domNode.isBlockNode(this.startNode)) {
                    if (this.range.startContainer.nodeName === '#text' && !isNOU(this.range.startContainer.previousSibling) && this.range.startContainer.previousSibling.nodeName === 'HR') {
                        nearBlockNode = this.range.startContainer.nextSibling as Element;
                    } else {
                        nearBlockNode = this.startNode;
                    }
                } else {
                    nearBlockNode = this.parent.formatter.editorManager.domNode.blockParentNode(this.startNode);
                }
                let isMediaNode: boolean = false;
                let isFocusedFirst: boolean = false;
                const parentElement: HTMLElement = this.range.startContainer.parentElement;
                let isTextWrapApplied: boolean = false;
                let isPreWrapApplied: boolean = false;
                if (parentElement) {
                    const computedStyle: CSSStyleDeclaration = this.parent.getDocument()
                        .defaultView.getComputedStyle(parentElement);
                    isPreWrapApplied = computedStyle.getPropertyValue('white-space') === 'pre-wrap';
                    isTextWrapApplied = computedStyle.getPropertyValue('text-wrap') === 'nowrap';
                }
                if (this.range.startOffset !== 0 && this.range.endOffset !== 0 &&
                    this.range.startContainer === this.range.endContainer && !(!isNOU(nearBlockNode.childNodes[0])
                    && (nearBlockNode.childNodes[0].nodeName === 'IMG' || nearBlockNode.querySelectorAll('img, audio, video').length > 0))) {
                    const startNodeText: string = this.range.startContainer.textContent;
                    const splitFirstText: string = startNodeText.substring(0, this.range.startOffset);
                    const lastCharBeforeCursor: number = splitFirstText.charCodeAt(this.range.startOffset - 1);
                    let isSplitTextEmpty: boolean = splitFirstText.trim().length === 0;
                    if (isSplitTextEmpty && this.range.startContainer.nodeName !== '#text' && this.range.startContainer.firstChild &&
                        this.range.startContainer.firstChild.nodeType === Node.ELEMENT_NODE && (this.range.startContainer.firstChild as HTMLElement).getAttribute('contenteditable') === 'false') {
                        isSplitTextEmpty = startNodeText.trim().length === 0;
                    }
                    const hasContentAfterCursor: boolean = startNodeText.slice(this.range.startOffset).trim().length !== 0;
                    const isCursorAtStartNonPreWrap: boolean = lastCharBeforeCursor !== 160
                        && isSplitTextEmpty && !isPreWrapApplied && !isTextWrapApplied;
                    const isCursorAtStartPreWrapWithContent: boolean = lastCharBeforeCursor === 32
                        && (isPreWrapApplied || isTextWrapApplied) && isSplitTextEmpty && hasContentAfterCursor;
                    if ((isCursorAtStartNonPreWrap || isCursorAtStartPreWrapWithContent) &&
                        !this.range.startContainer.previousSibling) {
                        isFocusedFirst = true;
                    }
                } else if (this.range.startOffset === 0 && this.range.endOffset === 0 ||
                                  (this.range.startOffset === 1 && this.range.endOffset === 1 && isImageAtStartNode)) {
                    isFocusedFirst = true;
                }
                this.removeBRElement(nearBlockNode);
                const fireFoxEnterAtMiddle: boolean = Browser.userAgent.indexOf('Firefox') !== -1 && this.range.startOffset === 0 && this.range.startContainer === this.range.endContainer &&
                    this.range.startContainer.nodeName === '#text' && !isNOU(this.range.startContainer.previousSibling) && !this.parent.formatter.editorManager.domNode.isBlockNode(this.range.startContainer.previousSibling as Element) &&
                    this.range.startContainer.parentElement === this.range.startContainer.previousSibling.parentElement;
                const preventEnterkeyShiftKey: boolean = (this.range.startContainer.nodeName === '#text' || this.range.startContainer.nodeName === 'BR') &&
                    (this.range.startOffset === 0 && this.range.endOffset === 0) && this.range.startContainer.parentElement === this.parent.inputElement && this.parent.enterKey === 'BR' && shiftKey;
                // eslint-disable-next-line max-len
                if (!preventEnterkeyShiftKey && !fireFoxEnterAtMiddle && ((this.range.startOffset === 0 && this.range.endOffset === 0) || isFocusedFirst) &&
                !(!isNOU(this.range.startContainer.previousSibling) &&
                (this.range.startContainer.previousSibling.nodeName === 'IMG' || this.range.startContainer.previousSibling.nodeName === 'BR'))) {
                    let isNearBlockLengthZero: boolean;
                    let newElem: Node;
                    if (!isNOU(this.range.startContainer.childNodes) && (this.range.startContainer as HTMLElement).nodeName !== '#text' &&
                    (this.range.startContainer.textContent.length === 0 ||
                    (!isNOU((this.range.startContainer  as HTMLElement).querySelector('.e-video-clickelem')) &&
                    (this.range.startContainer  as HTMLElement).querySelector('.e-video-clickelem').textContent.length === 0)) &&
                    ((this.range.startContainer as HTMLElement).querySelectorAll('img, audio, video').length > 0 ||
                    !isNOU((this.range.startContainer as HTMLElement).querySelector('.e-video-clickelem')) ||
                    this.range.startContainer.nodeName === 'IMG' || this.range.startContainer.nodeName === 'TABLE' )) {
                        newElem = this.createInsertElement(shiftKey);
                        isMediaNode = true;
                        isNearBlockLengthZero = false;
                    } else {
                        if ((nearBlockNode.textContent.trim().length !== 0 ||
                            (!isNOU(nearBlockNode.childNodes[0]) && nearBlockNode.childNodes[0].nodeName === 'IMG') ||
                        (nearBlockNode.textContent.trim() === '' && nearBlockNode.querySelectorAll('img, audio, video').length > 0))) {
                            if ((this.range.startOffset === this.range.endOffset && this.range.startOffset !== 0)) {
                                newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                    this.range, (nearBlockNode as HTMLElement), false).cloneNode(true);
                            } else {
                                newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                    this.range, (nearBlockNode as HTMLElement), true).cloneNode(true);
                                isMediaNode = true;
                            }
                            isNearBlockLengthZero = false;
                        } else {
                            newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                                this.range, (nearBlockNode as HTMLElement), true).cloneNode(true);
                            isNearBlockLengthZero = true;
                        }
                    }
                    let insertElem: HTMLElement;
                    if (this.formatTags.indexOf(newElem.nodeName.toLocaleLowerCase()) < 0) {
                        insertElem = this.createInsertElement(shiftKey);
                    }
                    else {
                        insertElem = createElement(newElem.nodeName);
                    }
                    while (newElem.firstChild) {
                        insertElem.appendChild(newElem.firstChild);
                    }
                    const isImageElement: boolean = this.range.startContainer !== nearBlockNode && nearBlockNode.querySelector('img') ? true : false;
                    const isAudioVideo: boolean = this.range.startContainer !== nearBlockNode && (nearBlockNode.querySelector('.e-video-wrap') ||
                        nearBlockNode.querySelector('.e-audio-wrap') && (this.range.startContainer as HTMLElement).classList.contains('e-clickelem')) ? true : false;
                    if (isAudioVideo) {
                        this.parent.formatter.editorManager.domNode.insertAfter(insertElem as Element, nearBlockNode);
                    }
                    else {
                        nearBlockNode.parentElement.insertBefore(insertElem, nearBlockNode);
                    }
                    if (!isNearBlockLengthZero) {
                        let currentFocusElem: Node = insertElem;
                        let finalFocusElem: Node;
                        if (this.range.startOffset === this.range.endOffset && this.range.startOffset !== 0) {
                            while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text' &&
                            currentFocusElem.nodeName !== 'BR') {
                                finalFocusElem = currentFocusElem;
                                currentFocusElem = currentFocusElem.lastChild;
                            }
                        } else {
                            finalFocusElem = currentFocusElem;
                        }
                        (finalFocusElem as HTMLElement).innerHTML = '<br>';
                        if (!isMediaNode) {
                            detach(nearBlockNode);
                        }
                    }
                    if (isAudioVideo || isImageElement) {
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), (insertElem as Element),
                            0);
                    }
                    else {
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), (insertElem as Element).nextElementSibling,
                            0);
                    }
                } else if (nearBlockNode !== this.parent.inputElement && nearBlockNode.textContent.length === 0 &&
                    !(!isNOU(nearBlockNode.childNodes[0]) && nearBlockNode.childNodes[0].nodeName === 'IMG')) {
                    if (!isNOU(nearBlockNode.children[0]) && nearBlockNode.children[0].tagName !== 'BR') {
                        const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                            this.range, (nearBlockNode as HTMLElement), false).cloneNode(true);
                        this.parent.formatter.editorManager.domNode.insertAfter((newElem as Element), nearBlockNode);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), (newElem as Element),
                            newElem.textContent.length >= 0 ? 0 : 1);
                    } else {
                        const insertElem: HTMLElement = this.createInsertElement(shiftKey);
                        insertElem.innerHTML = '<br>';
                        this.parent.formatter.editorManager.domNode.insertAfter(insertElem, nearBlockNode);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), insertElem, 0);
                    }
                } else if (this.range.startContainer === this.range.endContainer && this.range.startContainer.nodeType !== Node.TEXT_NODE && ((this.range.startContainer.nodeName === 'IMG' || (this.range.startContainer as HTMLElement).querySelector('img')) ||
                    (this.range.startContainer.nodeName === 'SPAN' && ((this.range.startContainer as HTMLElement).classList.contains('e-video-wrap') ||
                        (this.range.startContainer as HTMLElement).classList.contains('e-audio-wrap'))))) {
                    if (nearBlockNode.textContent.trim().length > 0) {
                        const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                            this.range, (nearBlockNode as HTMLElement), true);
                        const audioVideoElem: Node = !isNOU((newElem.previousSibling as HTMLElement).querySelector('.e-video-wrap')) ?
                            (newElem.previousSibling as HTMLElement).querySelector('.e-video-wrap') : (newElem.previousSibling as HTMLElement).querySelector('.e-audio-wrap');
                        let isBRInserted: boolean = false;
                        if (!isNOU(audioVideoElem)) {
                            let lastNode: Node = audioVideoElem.previousSibling;
                            while (!isNOU(lastNode) && lastNode.nodeName !== '#text') {
                                lastNode = lastNode.lastChild;
                            }
                            if (isNOU(lastNode)) {
                                const brElm: HTMLElement = createElement('br');
                                audioVideoElem.parentElement.appendChild(brElm);
                                isBRInserted = true;
                            }
                            if (isBRInserted) {
                                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                    this.parent.getDocument(), audioVideoElem.parentElement, 0);
                            } else {
                                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                    this.parent.getDocument(), lastNode as Element, lastNode.textContent.length);
                            }
                            detach(audioVideoElem);
                        }
                    } else {
                        const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                            this.range, (nearBlockNode as HTMLElement), true);
                        let focusElem: Node = newElem.hasChildNodes() ? newElem.previousSibling : newElem;
                        const imageElem: Node = !isNOU((newElem as HTMLElement).querySelector('img')) ?
                            (newElem as HTMLElement).querySelector('img') : null;
                        const insertElem: HTMLElement = this.createInsertElement(shiftKey);
                        if (!isNOU(imageElem)) {
                            if (isFocusedFirst) {
                                newElem.parentElement.insertBefore(insertElem, newElem as HTMLElement);
                                focusElem = newElem.previousSibling;
                            }
                            else {
                                this.parent.formatter.editorManager.domNode.insertAfter(insertElem, newElem as HTMLElement);
                                focusElem = newElem.nextSibling;
                            }
                        }
                        else if (isNOU(imageElem) && (focusElem as HTMLElement).querySelector('img')) {
                            focusElem = newElem;
                        }
                        while (!isNOU(focusElem.firstChild)) {
                            detach(focusElem.firstChild);
                        }
                        const brElm: HTMLElement = createElement('br');
                        focusElem.appendChild(brElm);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), focusElem as Element, 0);
                    }
                    if (!isNOU(this.parent.audioModule)) {
                        this.parent.audioModule.hideAudioQuickToolbar();
                    }
                    if (!isNOU(this.parent.videoModule)) {
                        this.parent.videoModule.hideVideoQuickToolbar();
                    }
                } else if (this.parent.enterKey === 'BR' && shiftKey && this.range.startContainer.nodeType === Node.TEXT_NODE && this.range.startContainer.parentElement && this.range.startContainer.parentElement === this.parent.inputElement) {
                    const range: Range = this.range;
                    const startContainer: Node = range.startContainer;
                    const startOffset: number = range.startOffset;
                    const newElement: HTMLElement = createElement(this.parent.shiftEnterKey);
                    if (startContainer.nodeType === Node.TEXT_NODE && range.endOffset !== 0 && range.startOffset !== 0) {
                        const textNode: Text = startContainer as Text;
                        if (startOffset < textNode.length) {
                            const newTextNode: Text = textNode.splitText(startOffset);
                            newElement.appendChild(newTextNode);
                        } else {
                            newElement.innerHTML = '<br>';
                        }
                        textNode.parentNode.insertBefore(newElement, textNode.nextSibling);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(),
                            newElement,
                            0
                        );
                    } else if (startOffset === 0 && range.endOffset === 0) {
                        newElement.innerHTML = '<br>';
                        if (range.endOffset === startContainer.textContent.length) {
                            const brElement: Element = createElement('br');
                            startContainer.parentNode.insertBefore(brElement, startContainer);
                        }
                        startContainer.parentNode.insertBefore(newElement, startContainer);
                        const cursorTarget: Node = (range.endOffset === startContainer.textContent.length)
                            ? newElement : newElement.nextSibling;
                        startContainer.parentNode.insertBefore(newElement, startContainer);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), (cursorTarget as Element), 0);
                    }
                } else {
                    let previousSiblingBR: boolean = false;
                    let insertedZWSP: Node | null = null;
                    if (this.range.startContainer === this.range.endContainer) {
                        const cursorFocusNode: Node = this.getCursorNode(this.range);
                        if (cursorFocusNode && cursorFocusNode.parentNode) {
                            const cursorElement: Element = cursorFocusNode as Element;
                            const isPreviousSiblingBR: boolean = cursorElement.previousElementSibling && cursorElement.previousElementSibling.nodeName === 'BR';
                            const isCursorNodeBR: boolean = cursorFocusNode.nodeName === 'BR';
                            if (isPreviousSiblingBR || isCursorNodeBR) {
                                const isBlockEnter: boolean = ((this.parent.enterKey === 'P' || this.parent.enterKey === 'DIV') && !shiftKey);
                                const cursorInText: boolean = cursorFocusNode.nodeName === '#text' && this.range.startContainer === cursorFocusNode && this.range.startOffset > 0;
                                if (!(isBlockEnter && cursorInText)) {
                                    insertedZWSP = document.createTextNode('\u200B');
                                    cursorFocusNode.parentNode.insertBefore(insertedZWSP, cursorFocusNode);
                                    if (isCursorNodeBR && !cursorElement.previousElementSibling) {
                                        cursorFocusNode.parentNode.insertBefore(document.createElement('br'), insertedZWSP);
                                    }
                                    this.range.setStartAfter(insertedZWSP);
                                    this.range.setEndBefore(cursorFocusNode);
                                    previousSiblingBR = true;
                                }
                            }
                        }
                    }
                    const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                        this.range, (nearBlockNode as HTMLElement), true);
                    if (previousSiblingBR && insertedZWSP && insertedZWSP.parentNode && insertedZWSP.textContent === '\u200B') {
                        insertedZWSP.parentNode.removeChild(insertedZWSP);
                    }
                    if (!isNOU(newElem.childNodes[0]) && newElem.childNodes[0].nodeName === '#text' &&
                        newElem.childNodes[0].textContent.length === 0) {
                        detach(newElem.childNodes[0]);
                    }
                    if (newElem.textContent.trim().length === 0) {
                        const brElm: HTMLElement = createElement('br');
                        if (this.startNode.nodeName === 'A' || this.startNode.closest('a')) {
                            this.startNode = this.startNode.nodeName === 'A' ? this.startNode :
                                this.startNode.closest('a');
                            const startParentElem: HTMLElement = this.startNode.parentElement;
                            this.startNode.parentElement.insertBefore(brElm, this.startNode);
                            detach(this.startNode);
                            this.startNode = startParentElem;
                        } else {
                            if (this.startNode.nodeName !== 'BR') {
                                this.startNode.appendChild(brElm);
                            }
                        }
                        if (newElem.childNodes[0].textContent === '\n') {
                            detach(newElem.childNodes[0]);
                        }
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), this.startNode, 0);
                    }
                    if (((this.parent.enterKey === 'P' || this.parent.enterKey === 'DIV') && !shiftKey) || ((this.parent.shiftEnterKey === 'DIV' ||
                        this.parent.shiftEnterKey === 'P') && shiftKey)) {
                        const isHeadingTag: number = this.formatTags.indexOf(newElem.nodeName.toLocaleLowerCase());
                        if ((isHeadingTag < 0) || (isHeadingTag >= 0 && newElem.textContent.trim().length === 0)) {
                            const insertElm: HTMLElement = this.createInsertElement(shiftKey);
                            while (newElem.firstChild) {
                                insertElm.appendChild(newElem.firstChild);
                            }
                            this.parent.formatter.editorManager.domNode.insertAfter(insertElm, (newElem as HTMLElement));
                            detach(newElem);
                            let curElement: HTMLElement | Node = this.parent.formatter.editorManager.domNode.
                                isBlockNode(this.startNode) ? insertElm : this.startNode;
                            let cusrPos: number = 0;
                            if (curElement && (curElement.nodeName === 'A' || (curElement as HTMLElement).closest('a'))) {
                                curElement = curElement.nodeName === 'A' ? curElement :
                                    (curElement as HTMLElement).closest('a');
                                curElement = this.getFirstTextNode(curElement);
                                curElement.nodeValue = '\u200B' + curElement.nodeValue;
                                cusrPos = 1;
                            }
                            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                this.parent.getDocument(), curElement as HTMLElement, cusrPos);
                        }
                    }
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
            const currentParentStyle: CSSStyleDeclaration = window.getComputedStyle(currentParent);
            this.removeBRElement(currentParent);
            let isEmptyBrInserted: boolean = false;
            let currentParentLastChild: Node = currentParent.lastChild;
            while (!isNOU(currentParentLastChild) && !(currentParentLastChild.nodeName === '#text' || currentParentLastChild.nodeName === 'BR'
                    || currentParentLastChild.nodeName === 'IMG')) {
                currentParentLastChild = currentParentLastChild.lastChild;
            }
            const isLastNodeLength: number = this.range.startContainer === currentParentLastChild ?
                this.range.startContainer.textContent.length : currentParent.textContent.length;
            const isImageElement: boolean = (this.range.startContainer.nodeName === 'IMG' || (this.range.startContainer.nodeType === 1 && (this.range.startContainer as HTMLElement).querySelector('img') !== null) || (this.range.startContainer.childNodes.length > 0
                && !isNOU(this.range.startContainer.childNodes[this.range.startOffset]) && this.range.startContainer.childNodes[this.range.startOffset].nodeName === 'IMG'));
            if (currentParent !== this.parent.inputElement &&
                this.parent.formatter.editorManager.domNode.isBlockNode(currentParent) &&
                this.range.startOffset === this.range.endOffset &&
                (this.range.startOffset === isLastNodeLength ||
                (currentParent.textContent.trim().length === 0 && isImageElement))) {
                const focusBRElem: HTMLElement = createElement('br');
                if (this.range.startOffset === 0 && this.range.startContainer.nodeName === 'TABLE') {
                    this.range.startContainer.parentElement.insertBefore(focusBRElem, this.range.startContainer);
                } else {
                    if (currentParentLastChild.nodeName === 'BR' && currentParent.textContent.length === 0) {
                        this.parent.formatter.editorManager.domNode.insertAfter(
                            focusBRElem, (currentParentLastChild as Element));
                    } else if (this.range.startOffset === 0 && this.range.endOffset === 0 && isImageElement) {
                        const imageElement: Node = this.range.startContainer.nodeName === 'IMG' ? this.range.startContainer :
                            this.range.startContainer.childNodes[this.range.startOffset];
                        currentParent.insertBefore(focusBRElem, imageElement);
                    } else if (this.range.startOffset === 1 && this.range.endOffset === 1 && isImageAtStartNode) {
                        currentParent.insertBefore(focusBRElem, this.range.startContainer);
                    } else {
                        const lineBreakBRElem: HTMLElement = createElement('br');
                        const parentElement: HTMLElement = this.range.startContainer.parentElement;
                        let anchorElement: Node;
                        if (parentElement && parentElement.nodeName === 'A' &&
                            parentElement.textContent.length === this.range.startOffset) {
                            anchorElement = parentElement;
                        } else if (parentElement) {
                            const closestAnchor: Element | null = parentElement.closest('a');
                            anchorElement = closestAnchor ? closestAnchor : this.range.startContainer;
                        }
                        this.parent.formatter.editorManager.domNode.insertAfter(
                            focusBRElem, (anchorElement as Element));
                        this.parent.formatter.editorManager.domNode.insertAfter(
                            lineBreakBRElem, (anchorElement as Element));
                        const brSibling: Element = (anchorElement as Element).nextElementSibling;
                        const brNextSibling: Element = !isNOU(brSibling) ? brSibling.nextElementSibling : null;
                        if (!isNOU(brSibling) && !isNOU(brNextSibling) && !isNOU(brNextSibling.nextElementSibling) &&
                                brSibling.nodeName === 'BR' && brNextSibling.nodeName === 'BR' && brNextSibling.nextElementSibling.nodeName === 'BR'
                        ) {
                            brNextSibling.nextElementSibling.remove();
                        }
                    }
                }
                this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                    this.parent.getDocument(), focusBRElem, 0);
            } else if (!isNOU(currentParent) && currentParent !== this.parent.inputElement && currentParent.nodeName !== 'BR') {
                if (currentParent.textContent.trim().length === 0 || (currentParent.textContent.trim().length === 1 &&
                    currentParent.textContent.charCodeAt(0) === 8203)) {
                    if ((currentParent.childElementCount > 0 && currentParent.lastElementChild.nodeName === 'IMG') ||
                        (currentParent.lastElementChild && currentParent.lastElementChild.nodeName === 'BR') ||
                        !isNOU(currentParent.firstElementChild) &&
                        (currentParent.querySelector('.e-video-wrap') || currentParent.querySelector('.e-audio-wrap'))) {
                        this.insertBRElement();
                    } else {
                        const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                            this.range, currentParent, true).cloneNode(true);
                        this.parent.formatter.editorManager.domNode.insertAfter((newElem as HTMLElement), currentParent);
                        const outerBRElem: HTMLElement = createElement('br');
                        newElem.parentElement.insertBefore(outerBRElem, newElem);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), newElem as Element, 0);
                    }
                } else {
                    let newElem: Node;
                    const outerBRElem: HTMLElement = createElement('br');
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
                            this.parent.getDocument(), currentFocusElem as Element, 0);
                        isEmptyBrInserted = true;
                    } else if (currentParent !== this.parent.inputElement &&
                        (currentParentStyle.display === 'inline' || currentParentStyle.display === 'inline-block')) {
                        newElem = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                            this.range, currentParent, true).cloneNode(true);
                        currentParent.parentElement.insertBefore(outerBRElem, currentParent);
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(), currentParent as Element, 0);
                        this.insertFocusContent();
                    } else if (this.startNode.nodeName === 'A' || this.startNode.closest('A')) {
                        this.startNode = this.startNode.nodeName === 'A' ? this.startNode : this.startNode.closest('A');
                        this.parent.formatter.editorManager.nodeCutter.
                            SplitNode(this.range, this.startNode as HTMLElement, true).cloneNode(true);
                        this.startNode.parentElement.insertBefore(outerBRElem, this.startNode);
                        this.startNode.innerHTML = '\u200B' + this.startNode.innerHTML;
                        this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                            this.parent.getDocument(),  this.startNode as HTMLElement, 1);
                    } else {
                        this.insertBRElement();
                    }
                }
            } else {
                this.insertBRElement();
            }
            (e.args as KeyboardEventArgs).preventDefault();
        }
        if (this.parent.actionCompleteEnabled) {
            this.triggerActionComplete(e, shiftKey);
        }
    }
    private getCursorNode(range: Range): Node | null {
        const container: Node = range.startContainer;
        const offset: number = range.startOffset;
        if (container.nodeType === Node.TEXT_NODE) {
            return container;
        }
        if (container.nodeType === Node.ELEMENT_NODE) {
            const childNode: Node = container.childNodes[offset as number];
            return childNode || container;
        }
        return null;
    }
    private getFirstTextNode(node: Node): Node | null {
        const treeWalker: TreeWalker = this.parent.getDocument().createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null
        );
        const firstTextNode: Node | null = treeWalker.nextNode();
        return firstTextNode;
    }
    private removeBRElement(currentElement: Node): void {
        if (Browser.userAgent.indexOf('Firefox') !== -1 &&
        this.range.endOffset === currentElement.textContent.length && (currentElement.textContent.length !== 0 ||
        (currentElement as HTMLElement).querySelectorAll('BR').length > 1) &&
        !isNOU(currentElement.lastChild) && currentElement.lastChild.nodeName === 'BR') {
            detach(currentElement.lastChild);
        }
    }

    private insertBRElement(): void {
        let isEmptyBrInserted: boolean = false;
        let isFocusTextNode: boolean = true;
        let isImageElement: boolean = false;
        if (this.range.endContainer.textContent.length === 0 && this.range.startContainer.nodeName === 'BR') {
            isFocusTextNode = false;
        }
        const brElm: HTMLElement = createElement('br');
        let findAnchorLastChild: Node = this.startNode;
        while (findAnchorLastChild.lastChild) {
            findAnchorLastChild = findAnchorLastChild.lastChild;
        }
        const findAnchorElement: boolean = this.startNode.nodeName === 'A' && this.endNode.nodeName === 'A' &&
            !isNOU(this.range.startContainer.parentElement) && this.range.startOffset === this.range.endOffset &&
            this.range.startContainer.textContent.trim().length === findAnchorLastChild.textContent.trim().length;
        if (this.startNode.nodeName === 'BR' && this.endNode.nodeName === 'BR' && this.range.startOffset === 0 && this.range.startOffset === this.range.endOffset) {
            this.parent.formatter.editorManager.domNode.insertAfter(brElm, this.startNode);
            isEmptyBrInserted = true;
        } else {
            if (this.startNode === this.parent.inputElement && !isNOU(this.range.startContainer.previousSibling) &&
                this.range.startContainer.previousSibling.nodeName === 'BR' && this.range.startContainer.textContent.length === 0) {
                isEmptyBrInserted = true;
            }
            if (findAnchorElement) {
                this.parent.formatter.editorManager.domNode.insertAfter(brElm, this.startNode);
            }
            else if (this.startNode.tagName === 'SPAN' && (this.startNode.classList.contains('e-video-wrap') || this.startNode.classList.contains('e-audio-wrap'))) {
                this.startNode.parentElement.insertBefore(brElm, this.startNode);
                const nearBlockNode: Node = this.parent.formatter.editorManager.domNode.blockParentNode(this.startNode);
                const newElem: Node = this.parent.formatter.editorManager.nodeCutter.SplitNode(
                    this.range, (nearBlockNode as HTMLElement), true);
                detach(newElem.previousSibling.childNodes[1]);
                isEmptyBrInserted = true;
            }
            else if (this.startNode !== this.parent.inputElement && this.startNode.nodeType === Node.ELEMENT_NODE && this.startNode.childElementCount > 0 && this.startNode.lastElementChild.nodeName === 'IMG') {
                this.startNode.parentElement.insertBefore(brElm, this.startNode);
                isEmptyBrInserted = true;
                isImageElement = true;
            }
            else {
                this.range.insertNode(brElm);
                isEmptyBrInserted = true;
            }
        }
        const isBRNextElement: boolean = ((!isNOU(brElm.nextSibling) && (brElm.nextSibling.textContent.length > 0 || brElm.nextSibling.nodeName !== '#text' && (brElm.nextSibling as Element).querySelectorAll('audio,video,table,img').length > 0)) || (!isNOU(brElm.nextElementSibling) && brElm.nextElementSibling.tagName === 'BR') || this.range.startContainer.nodeName === 'BR');
        const isMediaElement: boolean = !isNOU(brElm.nextSibling) && (!isNOU((brElm.nextSibling as HTMLElement).classList) && ((brElm.nextSibling as HTMLElement).classList.contains('e-video-wrap') || (brElm.nextSibling as HTMLElement).classList.contains('e-audio-wrap')));
        if (isBRNextElement && (isEmptyBrInserted || (!isNOU(brElm.nextSibling) && brElm.nextSibling.nodeName === '#text' && brElm.nextSibling.textContent.trim().length === 0 && !isNOU(brElm.nextSibling.nextSibling) && brElm.nextSibling.nextSibling.textContent.trim().length > 0))) {
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                this.parent.getDocument(),
                !isNOU(brElm.nextSibling) && isFocusTextNode
                && !isImageElement && !isMediaElement  ? (brElm.nextSibling as Element) : brElm, 0);
            isEmptyBrInserted = false;
        } else {
            const brElements: HTMLElement = createElement('br');
            if (findAnchorElement) {
                this.parent.formatter.editorManager.domNode.insertAfter(brElements, this.startNode);
            }
            else {
                this.range.insertNode(brElements);
            }
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                this.parent.getDocument(), brElm, 0);
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
            insertElem = createElement('div');
        } else if ((this.parent.enterKey === 'P' && !shiftKey) || (this.parent.shiftEnterKey === 'P' && shiftKey)) {
            insertElem = createElement('p');
        }
        const previousBlockNode: Element = this.parent.formatter.editorManager.domNode.blockNodes()[0].previousSibling as Element;
        const nextBlockNode: Element = this.parent.formatter.editorManager.domNode.blockNodes()[0].nextSibling as Element;
        if (!isNOU(previousBlockNode) && previousBlockNode.nodeName !== '#text' && previousBlockNode.hasAttribute('style') && previousBlockNode.nodeName !== 'TABLE') {
            insertElem.style.cssText = previousBlockNode.getAttribute('style');
        }
        if (isNOU(previousBlockNode) && !isNOU(nextBlockNode) && nextBlockNode.nodeName !== '#text' && nextBlockNode.hasAttribute('style') && nextBlockNode.nodeName !== 'TABLE') {
            insertElem.style.cssText = nextBlockNode.getAttribute('style');
        }
        return insertElem;
    }

    private handleCursorAtTableSide(e: NotifyArgs, isStart: boolean, isEnd: boolean): void {
        if (this.parent.enterKey !== 'BR') {
            const shiftKey: boolean = (e.args as KeyboardEventArgs).shiftKey;
            const newElement: HTMLElement = createElement(this.parent.enterKey);
            newElement.innerHTML = '<br>';
            let tableElement: HTMLTableElement;
            if (isStart) {
                tableElement = this.range.startContainer.childNodes[this.range.startOffset] as HTMLTableElement;
                tableElement.parentElement.insertBefore(newElement, tableElement);
            }
            if (isEnd) {
                tableElement = this.range.startContainer.childNodes[this.range.startOffset - 1] as HTMLTableElement;
                if (!isNOU(tableElement.nextSibling)) {
                    tableElement.parentElement.insertBefore(newElement, tableElement.nextSibling);
                }
                else if (isNOU(tableElement.nextSibling)) {
                    tableElement.parentElement.appendChild(newElement);
                }
            }
            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(this.parent.getDocument(), newElement, 0);
            (e.args as KeyboardEventArgs).preventDefault();
            const actionCompleteArgs: ActionCompleteEventArgs = {
                name: events.actionComplete,
                requestType: shiftKey ? 'ShiftEnterAction' : 'EnterAction',
                event: (e.args as KeyboardEventArgs)
            };
            if (this.parent.actionCompleteEnabled) {
                this.parent.dotNetRef.invokeMethodAsync('ActionCompleteEvent', actionCompleteArgs);
            }
        }
    }
    private triggerActionComplete(e: NotifyArgs, shiftKey: boolean): void {
        const actionCompleteArgs: ActionCompleteEventArgs = {
            name: events.actionComplete,
            requestType: shiftKey ? 'ShiftEnterAction' : 'EnterAction',
            event: (e.args as KeyboardEventArgs)
        };
        this.parent.dotNetRef.invokeMethodAsync('ActionCompleteEvent', actionCompleteArgs);
    }
    private handleEnterKeyAtImageSide(e: NotifyArgs, isStart: boolean, isEnd: boolean): void {
        const actionBeginArgs: ActionBeginEventArgs = {
            cancel: false,
            name: events.actionBegin,
            requestType: (e.args as KeyboardEventArgs).shiftKey ? 'ShiftEnterAction' : 'EnterAction',
            originalEvent: (e.args as KeyboardEventArgs)
        };
        let directRange: boolean = false;
        if (this.range.startContainer.nodeName === 'IMG' && this.range.startOffset === 0) {
            directRange = true;
        }
        this.parent.dotNetRef.invokeMethodAsync(events.actionBegin, actionBeginArgs, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                if (this.parent.enterKey === 'BR') {
                    const newElement: HTMLElement = createElement('br');
                    let imageElement: HTMLImageElement;
                    if (directRange) {
                        imageElement = this.range.startContainer as HTMLImageElement;
                        imageElement.parentElement.insertBefore(newElement, imageElement);
                        this.parent.formatter.editorManager.nodeSelection.
                            setCursorPoint(this.parent.getDocument(), imageElement, 0);
                    }
                    if (isStart) {
                        imageElement = this.range.startContainer.childNodes[this.range.startOffset] as HTMLImageElement;
                        imageElement.parentElement.insertBefore(newElement, imageElement);
                        this.parent.formatter.editorManager.nodeSelection.
                            setCursorPoint(this.parent.getDocument(), imageElement, 0);
                    }
                    if (isEnd) {
                        imageElement = this.range.startContainer.childNodes[this.range.startOffset - 1] as HTMLImageElement;
                        if (!isNOU(imageElement.nextSibling)) {
                            imageElement.parentElement.insertBefore(newElement, imageElement.nextSibling);
                            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                this.parent.getDocument(), newElement.nextSibling as Element, 0);
                        }
                        else if (isNOU(imageElement.nextSibling)) {
                            imageElement.parentElement.appendChild(newElement);
                            const brElement: HTMLElement = createElement('BR');
                            imageElement.parentElement.appendChild(brElement);
                            this.parent.formatter.editorManager.nodeSelection.setCursorPoint(
                                this.parent.getDocument(), brElement, 0);
                        }
                    }
                    (e.args as KeyboardEventArgs).preventDefault();
                    this.triggerActionComplete(e, (e.args as KeyboardEventArgs).shiftKey);
                }
            }
        });
    }

    private isTableOrImageStart(): { start: boolean; startNodeName: string} {
        const customHandlerElements: string[] = ['IMG', 'TABLE'];
        const startContainer: Element = this.range.startContainer as Element;
        const startOffset: number = this.range.startOffset;
        const isCursorAtStart: boolean = this.range.collapsed && (startContainer.nodeType === 1) &&
        (startContainer as HTMLElement).isContentEditable && startContainer.childNodes[startOffset as number] &&
        (customHandlerElements.indexOf((startContainer.childNodes[startOffset as number] as HTMLElement).nodeName) > -1);
        if (isCursorAtStart) {
            return { start : isCursorAtStart, startNodeName: (startContainer.childNodes[startOffset as number] as HTMLElement).nodeName };
        } else {
            return { start : false, startNodeName: ''};
        }
    }

    private isTableOrImageEnd(): { end: boolean; endNodeName: string} {
        const customHandlerElements: string[] = ['IMG', 'TABLE'];
        const startContainer: Element = this.range.startContainer as Element;
        const startOffset: number = this.range.startOffset;
        const isCursorAtEnd: boolean = this.range.collapsed && (startContainer.nodeType === 1) &&
        (startContainer as HTMLElement).isContentEditable && startContainer.childNodes[startOffset - 1] &&
        (customHandlerElements.indexOf((startContainer.childNodes[startOffset - 1] as HTMLElement).nodeName) > -1);
        if (isCursorAtEnd) {
            return { end : isCursorAtEnd, endNodeName: (startContainer.childNodes[startOffset - 1] as HTMLElement).nodeName };
        } else {
            return { end : false, endNodeName: ''};
        }
    }

    private processedTableImageCursor(): ImageOrTableCursor  {
        const { start, startNodeName }: { start: boolean; startNodeName: string } = this.isTableOrImageStart();
        const { end, endNodeName}: { end: boolean; endNodeName: string} = this.isTableOrImageEnd();
        return { start, startName: startNodeName, end, endName: endNodeName };
    }
}
