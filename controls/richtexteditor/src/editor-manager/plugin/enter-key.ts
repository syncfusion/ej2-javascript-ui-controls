import { IEditorModel } from '../../common/interface';
import * as EVENTS from '../../common/constant';
import { EnterKey, IHTMLEnterKeyCallBack, ShiftEnterKey } from '../../common';
import { Browser, createElement, detach, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { scrollToCursor } from '../../common/util';
import { NodeSelection } from '../../selection/selection';
export class EnterKeyAction {
    private parent: IEditorModel;
    private range: Range;
    private startNode: Element;
    private endNode: Element;
    private specialElementCursor: SpecialElementCursor;
    private enterKey: EnterKey;
    private shiftEnterKey: ShiftEnterKey;
    private nodeSelection: NodeSelection;
    private isEntireRTE: boolean;
    private isEnterInCaption: boolean;
    constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
        this.nodeSelection = new NodeSelection(this.parent.editableElement as HTMLElement);
    }

    private destroy(): void {
        this.removeEventListener();
        this.nodeSelection = null;
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.ENTER_KEYDOWN_HANLDER, this.actionHandler, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.ENTER_KEYDOWN_HANLDER, this.actionHandler);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    private actionHandler(args: IHTMLEnterKeyCallBack): void {
        const keyboardArgs: KeyboardEvent = args.event as KeyboardEvent;
        this.isEntireRTE = args.isSelectAll;
        this.enterKey = args.enterAction;
        this.shiftEnterKey = args.shiftEnterAction;
        const isShiftEnter: boolean = !keyboardArgs.ctrlKey && !keyboardArgs.altKey && keyboardArgs.shiftKey;
        const captionContainer: HTMLElement = this.getCaptionContainerForRange();
        this.isEnterInCaption = captionContainer ? true : false;
        if ((this.enterKey === 'BR' && !isShiftEnter) || (this.shiftEnterKey === 'BR' && isShiftEnter) || captionContainer) {
            this.shiftEnterHandler(keyboardArgs, args);
        } else if ((this.enterKey === 'P' && !isShiftEnter) || (this.enterKey === 'DIV' && !isShiftEnter) ||
            (this.shiftEnterKey === 'P' && isShiftEnter) || (this.shiftEnterKey === 'DIV' && isShiftEnter)){
            this.enterHandler(keyboardArgs, args);
        }
    }

    private enterHandler(originalEvent: KeyboardEvent, args: IHTMLEnterKeyCallBack): void {
        const isValidSelection: boolean = !(this.range.startOffset === this.range.endOffset &&
            this.range.startContainer === this.range.endContainer);
        if (!this.range.collapsed && isValidSelection) {
            const stopProcessing: boolean = this.handleSelectionEnter(originalEvent);
            this.getRangeNode();
            this.specialElementCursor = this.processedTableImageCursor();
            if (stopProcessing) { // Partial selection of two nodes does not need inserting new node.
                originalEvent.preventDefault();
                this.triggerActionCompleteCallBack(args, args.event.shiftKey);
                return;
            }
        }
        if (this.specialElementCursor.start || this.specialElementCursor.end) {
            if (this.specialElementCursor.startName === 'TABLE' || this.specialElementCursor.endName === 'TABLE') { // Default browser action prevented and hanled manually.
                this.enterAtTableSide(originalEvent, this.specialElementCursor.start, this.specialElementCursor.end, args);
                return; // Early enter due to Edge case.
            } else {
                this.enterKeyAtMediaSide(originalEvent, this.specialElementCursor.start, this.specialElementCursor.end, args);
                return; // Early enter due to Edge case.
            }
        } else if ((this.range.startContainer.nodeName === 'HR') || (this.range.startContainer.nodeName !== '#text' && this.range.startContainer.childNodes[this.range.startOffset] && this.range.startContainer.childNodes[this.range.startOffset].nodeName === 'HR')) {
            this.enterAtHorizontalLine(originalEvent, args);
            return;
        }
        const isStart: boolean = this.isCursorAtStart();
        const isEnd: boolean = this.isCursorAtEnd();
        let startBlockParent: HTMLElement = this.getStartBlocKParent();
        if (startBlockParent === this.parent.editableElement) {
            const startElement: HTMLElement = this.range.startContainer as HTMLElement;
            if (startElement !== this.parent.editableElement) {
                startBlockParent = startElement;
            } else {
                const fallbackElement: HTMLElement = this.parent.editableElement.childNodes[this.range.startOffset] as HTMLElement;
                if (!isNOU(fallbackElement)) {
                    startBlockParent = fallbackElement;
                }
            }
        }
        const brBeforeTextNodeRange: boolean = this.hasOnlyBRBeforeCursor(startBlockParent); // Use case of <p><br>Content</p>, Cursort at C Text Node of zero.
        if (isEnd) {
            const insertElem: DocumentFragment = this.cloneNodePreservingStructure(this.range, true, originalEvent.shiftKey);
            const lastChild: Node = this.getLastChild(insertElem);
            if (lastChild.nodeName !== 'BR') {
                lastChild.appendChild(this.parent.currentDocument.createElement('br'));
            }
            InsertMethods.AppendBefore(insertElem, startBlockParent, true);
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, lastChild as Element, 0);
        } else if (isStart || brBeforeTextNodeRange) {
            const insertElem: DocumentFragment = this.cloneNodePreservingStructure(this.range, false, originalEvent.shiftKey);
            const lastChild: Node = this.getLastChild(insertElem);
            lastChild.appendChild(this.parent.currentDocument.createElement('br'));
            InsertMethods.AppendBefore(insertElem, startBlockParent, false);
        } else {// Middle cursor
            if (startBlockParent.nodeName !== '#text') {
                this.parent.nodeCutter.SplitNode(this.range, startBlockParent, this.range.collapsed);
            } else { // when cursor at text node middle
                let startNode: Node = startBlockParent;
                while (startNode.parentNode && startNode.parentNode !== this.parent.editableElement) {
                    startNode = startNode.parentNode;
                }
                const resultSplitNode: HTMLElement = this.parent.nodeCutter.
                    SplitNode(this.range, startNode as HTMLElement, this.range.collapsed) as HTMLElement;
                const firstSplitNode: Node = resultSplitNode.previousSibling;
                const insertElem: HTMLElement = createElement(originalEvent.shiftKey ? this.shiftEnterKey : this.enterKey);
                insertElem.appendChild(resultSplitNode);
                InsertMethods.AppendBefore(insertElem, firstSplitNode as HTMLElement, true);
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, insertElem, 0);
            }
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }

    private getRangeNode(): void {
        this.range = this.nodeSelection.getRange(this.parent.currentDocument);
        this.startNode = this.range.startContainer.nodeName === '#text' ? this.range.startContainer.parentElement :
            this.range.startContainer as Element;
        this.endNode = this.range.endContainer.nodeName === '#text' ? this.range.endContainer.parentElement :
            this.range.endContainer as Element;
    }

    /**
     * Returns the `.e-img-inner` container if both range start and end are inside the same caption.
     * Otherwise returns null.
     *
     * @returns {HTMLElement | null} The caption container when both ends are inside it, otherwise null.
     */
    private getCaptionContainerForRange(): HTMLElement | null {
        const startElem: HTMLElement = this.startNode as HTMLElement;
        const endElem: HTMLElement = this.endNode as HTMLElement;
        let startCaption: HTMLElement;
        let endCaption: HTMLElement;
        if (!this.parent.isBlazor) {
            startCaption = (startElem && startElem.closest) ? startElem.closest('.e-img-caption-text') as HTMLElement : null;
            endCaption = (endElem && endElem.closest) ? endElem.closest('.e-img-caption-text') as HTMLElement : null;
        } else {
            startCaption = (startElem && startElem.closest) ? startElem.closest('.e-img-inner') as HTMLElement : null;
            endCaption = (endElem && endElem.closest) ? endElem.closest('.e-img-inner') as HTMLElement : null;
        }
        return (startCaption && endCaption && startCaption === endCaption) ? startCaption : null;
    }

    public isEnterActionAllowed(originalEvent: KeyboardEvent): boolean {
        if (!originalEvent.ctrlKey && !originalEvent.altKey && (!Browser.isDevice ? (originalEvent.code === 'Enter' || originalEvent.code === 'NumpadEnter') : originalEvent.key === 'Enter')) {
            this.getRangeNode();
            if (!this.parent.editableElement.contains(this.startNode)) {
                return false;
            }
            this.specialElementCursor = this.processedTableImageCursor();
            if (this.specialElementCursor.start || this.specialElementCursor.end) {
                if (this.specialElementCursor.startName === 'TABLE' || this.specialElementCursor.endName === 'TABLE') {
                    return true; // No need to further process since the cursor infront of the table and image has unique range thus early return.
                }
            }
            if (this.specialElementCursor.start || this.specialElementCursor.end || this.range.startContainer.nodeName === 'IMG') {
                return true; // No need to further process since the cursor infront of the table and image has unique range thus early return.
            }
            const preventedSelectors: string = 'li, ul, ol, pre, pre code, blockquote';
            if (this.startNode.closest('table, tbody, td, th')) {
                const closestBlockParent: HTMLElement = this.parent.domTree.getParentBlockNode(this.startNode);
                const notAllowedTableElemTags: string[] = ['td', 'th', 'tbody'];
                if (notAllowedTableElemTags.indexOf(closestBlockParent.nodeName.toLowerCase()) > - 1 ||
                    !isNOU(closestBlockParent.closest(preventedSelectors))) {
                    return false;
                } else {
                    return true;
                }
            } else if (isNOU(this.startNode.closest(preventedSelectors)) && isNOU(this.endNode.closest(preventedSelectors))) {
                return true;
            }
            return false;
        }
        return false;
    }

    private enterAtTableSide(originalEvent: KeyboardEvent, isStart: boolean, isEnd: boolean, args: IHTMLEnterKeyCallBack): void {
        const newElement: HTMLElement = createElement(this.enterKey);
        newElement.innerHTML = '<br>';
        let tableElement: HTMLTableElement;
        if (isStart) {
            tableElement = this.range.startContainer.nodeName === 'TABLE' ? this.range.startContainer as HTMLTableElement :
                this.range.startContainer.childNodes[this.range.startOffset] as HTMLTableElement;
            tableElement.parentElement.insertBefore(newElement, tableElement);
        } else if (isEnd) {
            const offset: number = this.range.startOffset > 0 ? this.range.startOffset - 1 : this.range.startOffset;
            tableElement = this.range.startContainer.childNodes[offset as number] as HTMLTableElement;
            if (!isNOU(tableElement)) {
                if (!isNOU(tableElement.nextSibling)) {
                    tableElement.parentElement.insertBefore(newElement, tableElement.nextSibling);
                }
                else if (isNOU(tableElement.nextSibling)) {
                    tableElement.parentElement.appendChild(newElement);
                }
            }
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, newElement, 0);
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }

    private enterKeyAtMediaSide(originalEvent: KeyboardEvent, isStart: boolean, isEnd: boolean, args: IHTMLEnterKeyCallBack): void {
        const insertElem: HTMLElement = createElement(this.enterKey);
        insertElem.appendChild(createElement('br'));
        let startBlockParent: HTMLElement = this.parent.domTree.getParentBlockNode(this.range.startContainer);
        if (startBlockParent.nodeName === 'TD' || startBlockParent.nodeName === 'TR') {
            startBlockParent = this.range.startContainer as HTMLElement;
        }
        if (this.isValidSpecialElement(this.range.startContainer as HTMLElement)) {
            const isEnd: boolean = this.range.startOffset === 1;
            InsertMethods.AppendBefore(insertElem, startBlockParent, isEnd);
            if (isEnd) {
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, insertElem as Element, 0);
            }
        } else if (isStart) {
            const insertElem: DocumentFragment = this.cloneNodePreservingStructure(this.range, false, originalEvent.shiftKey);
            const lastChild: Node = this.getLastChild(insertElem);
            lastChild.appendChild(this.parent.currentDocument.createElement('br'));
            InsertMethods.AppendBefore(insertElem, startBlockParent, false);
        } else if (isEnd) {
            InsertMethods.AppendBefore(insertElem, startBlockParent, true);
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, insertElem as Element, 0);
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }

    private triggerActionCompleteCallBack(args: IHTMLEnterKeyCallBack, isShiftKey: boolean ): void {
        scrollToCursor(this.parent.currentDocument, this.parent.editableElement as HTMLElement);
        this.parent.editableElement.dispatchEvent(new Event('input'));
        args.callBack({
            requestType:  isShiftKey ? 'ShiftEnterAction' : 'EnterAction',
            event: args.event
        });
    }

    private isCursorAtStart(): boolean {
        const tempBlock: HTMLElement = this.parent.domTree.getParentBlockNode(this.range.startContainer);
        const startBlockParent: HTMLElement = tempBlock === this.parent.editableElement ?
            this.range.startContainer.parentElement : tempBlock;
        const isDirectBlockRange: boolean = this.range.startContainer.nodeType === Node.ELEMENT_NODE &&
            this.parent.domNode.isBlockNode(this.range.startContainer as HTMLElement);
        if (isDirectBlockRange && this.range.startOffset === 0) {
            return true; // Edge case of P as start container and then offset of 0.
        }
        const firstPosition: { node: Node, position: number} = this.nodeSelection.findFirstContentNode(startBlockParent);
        if (!isNOU(firstPosition)) {
            if (firstPosition.node.nodeName === 'BR') {
                const range: Range = this.range.cloneRange();
                range.setStartBefore(firstPosition.node);
                range.setEndBefore(firstPosition.node);
                return (range.startContainer === this.range.startContainer && range.startOffset === this.range.startOffset);
            }
            if (this.range.startContainer.firstChild === firstPosition.node && this.range.startOffset === firstPosition.position) {
                return true; // Edge case of strong as start container and then offset of 0. When stong element is wrapped inside the div or p element , this is rare browser selction case
            }
            if (this.range.startContainer === firstPosition.node && this.range.startOffset === firstPosition.position) {
                return true;
            }
        }
        return false;
    }

    private isCursorAtEnd(): boolean {
        const tempBlock: HTMLElement = this.isEnterInCaption ? this.startNode as HTMLElement :
            this.parent.domTree.getParentBlockNode(this.range.startContainer);
        let startBlockParent: HTMLElement = tempBlock === this.parent.editableElement ?
            this.range.startContainer.parentElement : tempBlock;
        if (this.enterKey === 'BR') {
            startBlockParent = startBlockParent === this.parent.editableElement ?
                this.range.startContainer as HTMLElement : startBlockParent;
        }
        const lastPosition: { node: Node, offset: number} = this.nodeSelection.findLastTextPosition(startBlockParent);
        if (this.isEndDirectRange()) {
            return true;
        }
        if (!isNOU(lastPosition)) {
            const isEmptyTextNodeAfterMention: boolean = this.isEmptyTextNodeAfterMentionChip(lastPosition.node, lastPosition.offset);
            if (isEmptyTextNodeAfterMention){
                return true;
            }
            if (lastPosition.node.nodeName === 'BR') {
                const range: Range = this.range.cloneRange();
                range.setStartBefore(lastPosition.node);
                range.setEndBefore(lastPosition.node);
                if (range.startContainer === this.parent.editableElement &&
                     this.parent.editableElement.childNodes[range.startOffset] === lastPosition.node) {
                    return true; // Edge case when current range is Br and cloned range startoffset is 0
                }
                // Check if cursor is positioned AFTER the BR (at the end)
                const rangeAfterBR: Range = this.range.cloneRange();
                rangeAfterBR.setStartAfter(lastPosition.node);
                rangeAfterBR.setEndAfter(lastPosition.node);
                if (rangeAfterBR.startContainer === this.range.startContainer && rangeAfterBR.startOffset === this.range.startOffset) {
                    return true;
                }
                // Check if cursor is positioned BEFORE the BR
                if (range.startContainer === this.range.startContainer && range.startOffset === this.range.startOffset) {
                    return true;
                }
            }
            return this.range.startContainer === lastPosition.node && this.range.startOffset === lastPosition.offset;
        }
        return false;
    }

    private getLastChild(node: Node): Node {
        let currentNode: Node = node;
        while (currentNode.lastChild) {
            currentNode = currentNode.lastChild;
        }
        return currentNode;
    }

    /**
     * Clones the DOM up to the given range position, even if nothing is selected.
     * Ensures parent hierarchy is preserved (e.g., <p><strong></strong></p>).
     *
     * @param {Range} range - The range where the cursor is placed.
     * @param {boolean} skipBlock - Whether to generate only a block element based on enter key configuration or not.
     * @param {boolean} isShiftKey - Whether the Shift key is pressed.
     *
     * @returns {DocumentFragment} - A fragment with empty structure up to the cursor.
     */
    public cloneNodePreservingStructure(range: Range, skipBlock: boolean, isShiftKey: boolean): DocumentFragment {
        const finalFragment: DocumentFragment = this.parent.currentDocument.createDocumentFragment();
        const textNode: Node = range.startContainer;
        let currentNode: Node = textNode;
        const isDirectRange: boolean = this.isStartDirectRange() || this.isEndDirectRange();
        if (isDirectRange) { // Direct range div with offset 1 where the element is Horizontal line.
            const tempStartNode: Node = this.range.startContainer.childNodes[this.range.startOffset];
            const endOffset: number = this.range.startOffset > 0 ? this.range.startOffset - 1 : this.range.startOffset;
            const tempEndNode: Node = this.range.startContainer.childNodes[endOffset as number];
            if ((!isNOU(tempStartNode) && tempStartNode.nodeName !== 'HR') || (!isNOU(tempEndNode) && tempEndNode.nodeName !== 'HR')) {
                currentNode = this.isStartDirectRange() ? tempStartNode : tempEndNode;
            }
        }
        let deepClone: Node = (currentNode.nodeType !== Node.TEXT_NODE && !this.isEndDirectRange()) ? currentNode.cloneNode(false) : null;
        //Edge case when directly setting the range at the end of the editableElements childNodes
        if (isDirectRange && this.isEndDirectRange()) {
            const lastPosition: { node: Node, offset: number} = this.nodeSelection.findLastTextPosition(currentNode as Element);
            if (!isNOU(lastPosition) && lastPosition.node.nodeName === '#text') {
                currentNode = lastPosition.node;
            }
        }
        while (currentNode !== null && !this.parent.domNode.isBlockNode(currentNode as Element)) {
            const parent: Node = currentNode.parentNode;
            if (parent === this.parent.editableElement) {
                currentNode = parent;
                break;
            }
            const shallowClone: Node = parent.cloneNode(false);
            if (isNOU(deepClone)) {
                deepClone = shallowClone;
            } else {
                shallowClone.appendChild(deepClone);
                deepClone = shallowClone;
            }
            currentNode = parent;
            if (this.parent.domNode.isBlockNode(parent as Element)) {
                break;
            }
        }
        if (!isNOU(deepClone) || currentNode === this.parent.editableElement) {
            if (skipBlock || isShiftKey) {
                const blockElem: HTMLElement = this.parent.currentDocument.createElement(isShiftKey ? this.shiftEnterKey : this.enterKey);
                const attributes: NamedNodeMap = !isNOU(deepClone) ? (deepClone as HTMLElement).attributes :  null;
                if (attributes && attributes.length > 0 && currentNode !== this.parent.editableElement) { // Copy if there are attributes exsist.
                    for (let i: number = 0; i < attributes.length; i++) {
                        const attr: Attr = attributes[i as number];
                        blockElem.setAttribute(attr.name, attr.value);
                    }
                }
                if (deepClone && deepClone.childNodes.length > 0) {
                    blockElem.appendChild(deepClone.firstChild.cloneNode(true));
                    finalFragment.appendChild(blockElem);
                } else {
                    finalFragment.appendChild(blockElem);
                }
            } else {
                finalFragment.appendChild(deepClone);
            }
        }

        const deniedTags: string = 'a';
        const deniedElements: NodeListOf<HTMLElement> = finalFragment.querySelectorAll(deniedTags);
        for (let i: number = 0; i < deniedElements.length; i++) {
            const element: HTMLElement = deniedElements[i as number];
            element.remove();
        }
        return finalFragment;
    }

    public cloneNodePreservingStructureBR(range: Range, skipBlock: boolean, isShiftKey: boolean): DocumentFragment {
        const finalFragment: DocumentFragment = this.parent.currentDocument.createDocumentFragment();
        const textNode: Node = range.startContainer;
        let currentNode: Node = textNode;
        let deepClone: Node = range.startContainer.nodeType !== Node.TEXT_NODE ? range.startContainer.cloneNode(false) : null;
        while (currentNode !== null && !this.parent.domNode.isBlockNode(currentNode as Element)) {
            const parent: Node = currentNode.parentNode;
            if (this.parent.domNode.isBlockNode(parent as Element) || parent === this.parent.editableElement) {
                break;
            }
            const shallowClone: Node = parent.cloneNode(false);
            if (isNOU(deepClone)) {
                deepClone = shallowClone;
            } else {
                shallowClone.appendChild(deepClone);
                deepClone = shallowClone;
            }
            currentNode = parent;
        }
        if (!isNOU(deepClone)) {
            if (skipBlock || isShiftKey) {
                const blockElem: HTMLElement = this.parent.currentDocument.createElement(isShiftKey ? this.shiftEnterKey : this.enterKey);
                const attributes: NamedNodeMap = (deepClone as HTMLElement).attributes;
                if (attributes.length > 0) { // Copy if there are attributes exsist.
                    for (let i: number = 0; i < attributes.length; i++) {
                        const attr: Attr = attributes[i as number];
                        blockElem.setAttribute(attr.name, attr.value);
                    }
                }
                if (deepClone.childNodes.length > 0) {
                    blockElem.appendChild(deepClone.firstChild.cloneNode(true));
                    finalFragment.appendChild(blockElem);
                } else {
                    finalFragment.appendChild(blockElem);
                }
            } else {
                finalFragment.appendChild(deepClone);
            }
        }

        const deniedTags: string = 'a';
        const deniedElements: NodeListOf<HTMLElement> = finalFragment.querySelectorAll(deniedTags);
        for (let i: number = 0; i < deniedElements.length; i++) {
            const element: HTMLElement = deniedElements[i as number];
            element.remove();
        }
        return finalFragment;
    }

    private isTableOrImageStart(): SpecialElementStartCursor {
        // 1) Range must be collapsed
        if (!this.range.collapsed && this.range.startContainer !== this.range.endContainer) {
            return { start: false };
        }
        const startContainer: HTMLElement = this.range.startContainer as HTMLElement;
        const isEmptyTextNodeInfrontOfImage: boolean = this.isTextNodeInfrontOfImage();
        if ((this.isValidSpecialElement(startContainer) && this.range.startOffset === 0) || isEmptyTextNodeInfrontOfImage) {
            const type: SpecialElementType = this.getSpecialElementType(startContainer);
            return { start: true, startName: type, startNode: startContainer };
        }
        // 2) Caret must be inside an editable element node
        if (startContainer.nodeType !== Node.ELEMENT_NODE || !startContainer.isContentEditable) {
            return { start: false };
        }
        // 3) Grab the child node at the caret position
        const child: HTMLElement = startContainer.childNodes[this.range.startOffset] as HTMLElement;
        if (isNOU(child)) {
            return { start: false };
        }
        // 4) Check node type
        if (this.isValidSpecialElement(child)) {
            const type: SpecialElementType = this.getSpecialElementType(child);
            return { start: true, startName: type, startNode: child };
        }
        return { start: false };
    }

    private isTableOrImageEnd(): SpecialElementEndCursor {
        // 1) Range must be collapsed
        if (!this.range.collapsed && this.range.startContainer !== this.range.endContainer) {
            return { end: false };
        }
        const startContainer: HTMLElement = this.range.startContainer as HTMLElement;
        if (this.isValidSpecialElement(startContainer) || this.isTextNodeAfterImage()) {
            const type: SpecialElementType = this.getSpecialElementType(startContainer);
            return { end: true, endName: type, endNode: startContainer };
        }
        const startOffset: number = this.range.startOffset;
        // 2) Caret must be inside an editable element node
        if (startContainer.nodeType !== Node.ELEMENT_NODE || !startContainer.isContentEditable) {
            return { end: false };
        }
        // 3) For "end" check, we need the node just before the caret (startOffset - 1)
        if (startOffset <= 0) {
            return { end: false };
        }
        const child: HTMLElement = startContainer.childNodes[startOffset - 1] as HTMLElement;
        if (isNOU(child)) {
            return { end: false };
        }
        // 4) Check node type and classes
        if (this.isValidSpecialElement(child) && isNOU(child.nextSibling)) {
            const type: SpecialElementType = this.getSpecialElementType(child);
            return { end: true, endName: type, endNode: child };
        }
        // 5) Check the cursor at the end of the table
        if (child.nodeName === 'TABLE' && startOffset !== 0) {
            return { end: true, endName: 'TABLE', endNode: child };
        }
        return { end: false };
    }

    private processedTableImageCursor(): SpecialElementCursor  {
        const { start, startName, startNode }: SpecialElementStartCursor = this.isTableOrImageStart();
        const { end, endName, endNode}: SpecialElementEndCursor = this.isTableOrImageEnd();
        return { start: start, startName: startName, startNode: startNode, end: end, endName: endName, endNode: endNode };
    }

    private shiftEnterHandler(originalEvent: KeyboardEvent, args: IHTMLEnterKeyCallBack): void {
        // Ensure range info is current before handling caption or special elements
        this.getRangeNode();
        if ((this.specialElementCursor.start || this.specialElementCursor.end) && !this.isEntireRTE) {
            if (this.specialElementCursor.startName === 'TABLE' || this.specialElementCursor.endName === 'TABLE') { // Default browser action prevented and hanled manually.
                this.shiftEnterAtTableSide(originalEvent, this.specialElementCursor.start, this.specialElementCursor.end, args);
                return; // Early enter due to Edge case.
            } else {
                this.shiftEnterAtMediaSide(originalEvent, this.specialElementCursor.start, this.specialElementCursor.end, args);
                return; // Early enter due to Edge case.
            }
        }
        const isValidSelection: boolean = !(this.range.startOffset === this.range.endOffset &&
            this.range.startContainer === this.range.endContainer);
        if (!this.range.collapsed && isValidSelection) {
            const stopProcessing: boolean = this.handleSelectionEnter(originalEvent);
            this.getRangeNode();
            if (stopProcessing) { // Partial selection of two nodes does not need inserting new node.
                originalEvent.preventDefault();
                this.triggerActionCompleteCallBack(args, args.event.shiftKey);
                return;
            }
        }
        const isStart: boolean = this.isCursorAtStart() || (this.range.collapsed && this.isEnterInCaption && this.range.startOffset === 0);
        const isEnd: boolean = this.isCursorAtEnd();
        if (isStart) {
            const startNode: Node = this.getBRInsertReferenceNode(this.range.startContainer, 'start');
            const fragment: DocumentFragment = this.parent.currentDocument.createDocumentFragment();
            fragment.appendChild(createElement('br'));
            InsertMethods.AppendBefore(fragment, startNode as HTMLElement, false);
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, (startNode as HTMLElement), 0);
            this.isEnterInCaption = false;
        } else if (isEnd) {
            const startNode: Node = this.getBRInsertReferenceNode(this.range.startContainer, 'end');
            const blockParent: Node = this.parent.domNode.getImmediateBlockNode(startNode);
            const hasBlockParent: boolean = blockParent.nodeType === Node.TEXT_NODE || (startNode.nodeName === 'BR' && blockParent === this.parent.editableElement);
            const fragment: DocumentFragment = hasBlockParent || this.isEnterInCaption ?
                this.parent.currentDocument.createDocumentFragment()
                : this.cloneNodePreservingStructureBR(this.range, false, false);
            const lastChild: Node = this.getLastChild(fragment);
            let insertElem: HTMLElement;
            if (lastChild.nodeName === 'BR') {
                insertElem = lastChild as HTMLElement;
            } else {
                insertElem = lastChild.appendChild(createElement('br'));
            }
            const afterElement: HTMLElement = (this.enterKey === 'BR' && blockParent !== this.parent.editableElement && !args.event.shiftKey) ? blockParent as HTMLElement : startNode as HTMLElement;
            const isNextNodeBR: boolean = afterElement.nodeName === '#text' && afterElement.nextSibling && afterElement.nextSibling.nodeName === 'BR';
            const isLastChildHasValidBR: boolean = lastChild.childNodes.length === 1 &&
             this.parent.domNode.isBlockNode(lastChild as HTMLElement) && lastChild.childNodes[0].nodeName === 'BR';
            if (afterElement === startNode && !isNextNodeBR && !isLastChildHasValidBR) {
                if (startNode.nodeName !== 'BR') {
                    fragment.prepend(createElement('br'));
                }
            }
            InsertMethods.AppendBefore(fragment, afterElement, true);
            const cursorElement: HTMLElement = isNextNodeBR && insertElem.nextSibling && insertElem.nextSibling.nodeName === 'BR' ? insertElem.nextSibling as HTMLElement : insertElem;
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, cursorElement, 0);
            this.isEnterInCaption = false;
        } else { // Middle of the text. Split the text and then insert the Br before the splitted text and set the cursor at the start of the splitted text.
            const startNode: Node = this.getBRInsertReferenceNode(this.range.startContainer, 'middle');
            let resultSplitNode: HTMLElement = this.parent.nodeCutter.
                SplitNode(this.range, startNode as HTMLElement, this.range.collapsed) as HTMLElement;
            const fragment: DocumentFragment = this.parent.currentDocument.createDocumentFragment();
            fragment.prepend(createElement('br'));
            resultSplitNode = !isNOU(resultSplitNode) ? resultSplitNode : (startNode.nodeName === 'BR' ? startNode as HTMLElement : null);
            InsertMethods.AppendBefore(fragment, resultSplitNode, false);
            this.isEnterInCaption = false;
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }

    private shiftEnterAtTableSide(originalEvent: KeyboardEvent, isStart: boolean, isEnd: boolean, args: IHTMLEnterKeyCallBack): void {
        const newElement: HTMLElement = createElement(this.enterKey);
        newElement.innerHTML = '<br>';
        let tableElement: HTMLTableElement;
        if (isStart) {
            tableElement = this.range.startContainer.nodeName === 'TABLE' ? this.range.startContainer as HTMLTableElement :
                this.range.startContainer.childNodes[this.range.startOffset] as HTMLTableElement;
            tableElement.parentElement.insertBefore(newElement, tableElement);
        } else if (isEnd) {
            const offset: number = this.range.startOffset > 0 ? this.range.startOffset - 1 : this.range.startOffset;
            tableElement = this.range.startContainer.childNodes[offset as number] as HTMLTableElement;
            if (!isNOU(tableElement.nextSibling)) {
                tableElement.parentElement.insertBefore(newElement, tableElement.nextSibling);
            }
            else if (isNOU(tableElement.nextSibling)) {
                tableElement.parentElement.appendChild(newElement);
            }
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, newElement, 0);
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }

    private shiftEnterAtMediaSide(originalEvent: KeyboardEvent, isStart: boolean, isEnd: boolean, args: IHTMLEnterKeyCallBack): void {
        let directRange: boolean = false;
        if (this.range.startContainer.nodeName === 'IMG' && this.range.startOffset === 0) {
            directRange = true;
        }
        const newElement: HTMLBRElement = this.parent.currentDocument.createElement('br');
        let imageElement: HTMLImageElement;
        if (directRange) {
            imageElement = this.range.startContainer as HTMLImageElement;
            imageElement.parentElement.insertBefore(newElement, imageElement);
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, imageElement, 0);
        } else if (isStart) {
            imageElement = this.range.startContainer.childNodes[this.range.startOffset] as HTMLImageElement;
            imageElement.parentElement.insertBefore(newElement, imageElement);
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, imageElement, 0);
        } else if (isEnd) {
            const offset: number = this.range.startOffset > 0 ? this.range.startOffset - 1 : this.range.startOffset;
            imageElement = this.range.startContainer.childNodes[offset as number] as HTMLImageElement;
            if (!isNOU(imageElement.nextSibling)) {
                imageElement.parentElement.insertBefore(newElement, imageElement.nextSibling);
                this.nodeSelection.setCursorPoint(
                    this.parent.currentDocument, newElement.nextSibling as Element, 0);
            }
            else if (isNOU(imageElement.nextSibling)) {
                imageElement.parentElement.appendChild(newElement);
                const brElement: HTMLBRElement = this.parent.currentDocument.createElement('br');
                imageElement.parentElement.appendChild(brElement);
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, brElement, 0);
            }
        }
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
        return;
    }

    private getBRInsertReferenceNode(startNode: Node, position: 'start' | 'middle' | 'end'): Node {
        if (this.isEnterInCaption) {
            return this.range.startContainer;
        }
        if ((startNode === this.parent.editableElement || position === 'start') && !isNOU(startNode.childNodes[this.range.startOffset])) {
            return (startNode.childNodes[this.range.startOffset]);
        }
        const inlineParent: HTMLElement = this.parent.domTree.getTopMostNode(startNode as Text) as HTMLElement;
        if (inlineParent.nodeType === Node.ELEMENT_NODE) {
            return inlineParent;
        }
        return startNode;
    }

    private isTextNodeInfrontOfImage(): boolean {
        const start: Node = this.range.startContainer;
        if (start.nodeType === Node.TEXT_NODE) {
            return false;
        }
        if (start.childNodes.length === 0) {
            return false;
        }
        const text: Node = start.childNodes[this.range.startOffset];
        if (!isNOU(text) && text.nodeType === Node.ELEMENT_NODE) {
            return false;
        }
        const isValid: boolean = !isNOU(start.childNodes[this.range.startOffset + 1]) &&
            this.isValidSpecialElement(start.childNodes[this.range.startOffset + 1] as HTMLElement);
        if (isValid && !isNOU(text) && text.nodeValue.trim() === '') {
            return true;
        }
        return false;
    }

    private isTextNodeAfterImage(): boolean {
        const start: Node = this.range.startContainer;
        if (start.nodeType === Node.TEXT_NODE) {
            return false;
        }
        if (start.childNodes.length === 0) {
            return false;
        }
        const offset: number = this.range.startOffset > 0 ? this.range.startOffset - 1 :
            this.range.startOffset;
        const text: Node = start.childNodes[offset + 1];
        if (!isNOU(text) && text.nodeType === Node.ELEMENT_NODE) {
            return false;
        }
        const isValid: boolean = !isNOU(start.childNodes[offset as number]) &&
            this.isValidSpecialElement(start.childNodes[offset as number] as HTMLElement);
        if (isValid && !isNOU(text) && text.nodeValue.trim() === '') {
            return true;
        }
        return false;
    }

    private handleSelectionEnter(keyboardArgs: KeyboardEvent): boolean {
        const shiftKey: boolean = keyboardArgs.shiftKey;
        let isEntireRTE: boolean = this.isEntireRTE;
        const hadMediaNode: boolean = this.hasMediaInSelectionRange();
        if (hadMediaNode && !isEntireRTE) {
            if (this.enterKey === 'BR') {
                this.range.startContainer.appendChild(this.parent.currentDocument.createElement('br'));
                const focusElem: HTMLElement = this.parent.currentDocument.createElement('br');
                this.range.startContainer.appendChild(focusElem);
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, focusElem, 0);
                return true;
            } else {
                const startElement: HTMLElement = this.range.startContainer as HTMLElement;
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, startElement, 1);
                return false;
            }
        }
        this.range.deleteContents(); // After Deleting the contents the Range start and end container changes and the following if conditions handle them for different use cases.
        if (isEntireRTE && this.parent.editableElement.textContent === '' ) {
            // This is a true "Select All". Clear the editor completely.
            this.parent.editableElement.innerHTML = '';
            isEntireRTE = false;
        }
        if (this.range.startContainer.nodeName === '#text' && this.range.startContainer.textContent.length === 0 &&
            this.range.startContainer.parentElement !== this.parent.editableElement &&
            (this.range.startContainer.parentElement.textContent == null ||
                this.range.startContainer.parentElement.textContent.length === 0)) { // <p>First Paragraph</p> => Full text content selected.
            if (this.enterKey === 'BR') {
                this.range.startContainer.parentElement.innerHTML = '&#8203;';
            } else {
                this.range.startContainer.parentElement.innerHTML = '<br>';
                if (this.isEnterInCaption) {
                    this.isEnterInCaption = false;
                    return true;
                }
            }
        } else if (this.range.startContainer === this.parent.editableElement && (this.range.startContainer as HTMLElement).innerHTML === '') {// Ctrl + A , Enter use case.
            if (this.enterKey === 'P') {
                (this.range.startContainer as HTMLElement).innerHTML = '<p><br></p>';
            } else if (this.enterKey === 'DIV') {
                (this.range.startContainer as HTMLElement).innerHTML = '<div><br></div>';
            } else {
                (this.range.startContainer as HTMLElement).innerHTML = '<br>';
            }
            const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
            this.nodeSelection.setCursorPoint(this.parent.currentDocument, focusElem as Element, 0);
        } else if (this.parent.editableElement === this.range.startContainer) {// <p>First Paragraph</p><p>Second Paragraph</p> => Full text content selected additionally, second p tag 0 offset is selected.
            const focusElem: Node = (this.range.startContainer as HTMLElement).childNodes[this.range.startOffset];
            if (focusElem.nodeName === '#text' && focusElem.textContent.length === 0) {
                const finalOffset: number = focusElem.textContent.length === 0 ? 0 : focusElem.previousSibling.textContent.length;
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, focusElem as Element, finalOffset);
            } else {
                // eslint-disable-next-line max-len
                this.nodeSelection.setCursorPoint(this.parent.currentDocument, focusElem as Element, focusElem.textContent.length >= 0 ? 0 : 1);
                if (focusElem.previousSibling.textContent.length === 0) {
                    detach(focusElem.previousSibling);
                    if (!shiftKey) {
                        let currentFocusElem: Node = !isNOU(focusElem.lastChild) ? focusElem.lastChild : focusElem;
                        while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text' && currentFocusElem.nodeName !== 'BR') {
                            currentFocusElem = currentFocusElem.lastChild;
                        }
                        if (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== 'BR' && currentFocusElem.parentElement.textContent.length === 0 && currentFocusElem.parentElement.innerHTML.length === 0 &&
                        currentFocusElem.parentElement.nodeName !== 'BR') {
                            currentFocusElem.parentElement.appendChild(this.parent.currentDocument.createElement('BR'));
                        }
                        if (!isNOU(currentFocusElem)) {
                            this.nodeSelection.setCursorPoint(
                                this.parent.currentDocument,
                                currentFocusElem.nodeName === 'BR' ? currentFocusElem as Element : currentFocusElem.parentElement as Element,
                                currentFocusElem.parentElement.textContent.length >= 0 || currentFocusElem.nodeName === 'BR' ? 0 : 1);
                        }
                    }
                } else if (focusElem.textContent.length === 0) {
                    let currentFocusElem: Node = focusElem.previousSibling.nodeName === '#text' ? focusElem.previousSibling : focusElem.previousSibling.lastChild;
                    while (!isNOU(currentFocusElem) && currentFocusElem.nodeName !== '#text') {
                        currentFocusElem = currentFocusElem.lastChild;
                    }
                    this.nodeSelection.setCursorPoint(
                        this.parent.currentDocument,
                        currentFocusElem as Element, currentFocusElem.textContent.length);
                    detach(focusElem);
                } else if (this.enterKey !== 'BR' &&
                focusElem.previousSibling.textContent.length !== 0 && focusElem.textContent.length !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private hasMediaInSelectionRange(): boolean {
        if (this.isValidSpecialElement(this.range.startContainer as HTMLElement) ||
        this.isValidSpecialElement(this.range.startContainer as HTMLElement)) {
            return true;
        }
        if ((this.range.startContainer.nodeName === 'P' || this.range.endContainer.nodeName === 'DIV') && this.range.startContainer.nodeName !== '#text') {
            if ((this.range.startContainer as HTMLElement).querySelector('img,audio,video,.e-embed-video-wrap')) {
                return true;
            }
        }
        return false;
    }

    private isStartDirectRange(): boolean {
        const inputElement: HTMLElement = this.parent.editableElement as HTMLElement;
        const start: Node = this.range.startContainer;
        if (start !== inputElement) {
            return false;
        }
        if (start.childNodes.length > 0 && start.childNodes.length > 0 && !isNOU(start.childNodes[this.range.startOffset])
        && this.parent.domNode.isBlockNode(start.childNodes[this.range.startOffset] as HTMLElement)) {
            return true;
        }
        return false;
    }

    private isEndDirectRange(): boolean {
        const inputElement: HTMLElement = this.parent.editableElement as HTMLElement;
        const start: Node = this.range.startContainer;
        if (start !== inputElement) {
            return false;
        }
        if (start.childNodes.length > 0 && start.childNodes.length > 0 && !isNOU(start.childNodes[this.range.startOffset - 1])
        && this.parent.domNode.isBlockNode(start.childNodes[this.range.startOffset - 1] as HTMLElement)) {
            return true;
        }
        return false;
    }

    private getStartBlocKParent(): HTMLElement {
        const isDirectStartRange: boolean = this.isStartDirectRange();
        const isDirectEndRange: boolean = this.isEndDirectRange();
        if (isDirectStartRange) {
            return this.range.startContainer.childNodes[this.range.startOffset] as HTMLElement;
        }
        if (isDirectEndRange) {
            return this.range.startContainer.childNodes[this.range.startOffset - 1] as HTMLElement;
        }
        return this.parent.domTree.getParentBlockNode(this.range.startContainer);
    }

    private isSpecialElemDirectStartRange(): boolean {
        const startContainer: Node = this.range.startContainer;
        const start: Node | null = !isNOU(startContainer.childNodes[this.range.startOffset]) ?
            startContainer.childNodes[this.range.startOffset] : null;
        if (isNOU(start)) {
            return false;
        }
        if (this.isValidSpecialElement(start as HTMLElement)) {
            return true;
        }
        return false;
    }

    private isSpecialElemDirectEndRange(): boolean {
        const startContainer: Node = this.range.startContainer;
        const start: Node | null = !isNOU(startContainer.childNodes[this.range.startOffset - 1]) ?
            startContainer.childNodes[this.range.startOffset] : null;
        if (isNOU(start)) {
            return false;
        }
        if (this.isValidSpecialElement(start as HTMLElement)) {
            return true;
        }
        return false;
    }

    private isValidSpecialElement(node: HTMLElement): boolean {
        if (node.nodeName === 'IMG' || node.nodeName === 'TABLE') {
            return true;
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-video-wrap')) {
            return true;
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-embed-video-wrap')) {
            return true;
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-audio-wrap')) {
            return true;
        }
        return false;
    }

    private getSpecialElementType(node: HTMLElement): SpecialElementType | null {
        if (node.nodeName === 'IMG') {
            return 'IMG';
        }
        if (node.nodeName === 'TABLE') {
            return 'TABLE';
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-video-wrap')) {
            return 'VIDEO';
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-embed-video-wrap')) {
            return 'EMBEDVIDEO';
        }
        if (node.nodeName === 'SPAN' && node.classList.contains('e-audio-wrap')) {
            return 'AUDIO';
        }
        return null;
    }

    // Method to check whether the current range is at the empty text node after the mention chip.
    private isEmptyTextNodeAfterMentionChip(node: Node, offset: number): boolean {
        if (offset === 0 && node.previousSibling && (node.previousSibling as HTMLElement).isContentEditable === false &&
        isNOU(node.nextSibling)) {
            return true;
        }
        return false;
    }

    /**
     * Checks if there's only BR elements (and/or whitespace) before the cursor position.
     * Used to determine if content should be preserved when pressing Enter.
     *
     * @param {HTMLElement} blockParent - The block element containing the cursor.
     * @returns {boolean} - True if only BRs and whitespace exist before cursor, false otherwise.
     */
    private hasOnlyBRBeforeCursor(blockParent: HTMLElement): boolean {
        const childNodes: NodeListOf<ChildNode> = blockParent.childNodes;
        // Iterate through child nodes up to cursor position
        for (let i: number = 0; i < blockParent.childNodes.length; i++) {
            const node: ChildNode = childNodes[i as number];
            // If we find a text node with non-whitespace content, return false
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent !== '' && blockParent.lastChild !== node) {
                    return false;
                }
            }
            // If we find an element that's not <br>, return false
            else if (node.nodeType === Node.ELEMENT_NODE) {
                if ((node as HTMLElement).nodeName !== 'BR') {
                    return false;
                }
            }
        }
        // If we only found <br> and/or whitespace, return true
        if (blockParent.childNodes.length > 1) {
            return true;
        }
        return false;
    }

    private enterAtHorizontalLine(originalEvent: KeyboardEvent, args: IHTMLEnterKeyCallBack): void {
        let hrElem: HTMLElement;
        if (!isNOU(this.range.startContainer.childNodes[this.range.startOffset - 1]) && this.range.startContainer.childNodes[this.range.startOffset - 1].nodeName === 'HR') {
            hrElem = this.range.startContainer.childNodes[this.range.startOffset - 1] as HTMLElement;
        } else if (!isNOU(this.range.startContainer.childNodes[this.range.startOffset]) && this.range.startContainer.childNodes[this.range.startOffset].nodeName === 'HR') {
            hrElem = this.range.startContainer.childNodes[this.range.startOffset] as HTMLElement;
        } else if (this.range.startContainer.nodeName === 'HR' && this.range.endContainer === this.range.startContainer) {
            hrElem = this.range.startContainer as HTMLElement;
        }
        const insertElem: HTMLElement = this.parent.currentDocument.createElement(this.enterKey);
        insertElem.appendChild(this.parent.currentDocument.createElement('br'));
        InsertMethods.AppendBefore(insertElem, hrElem, true);
        this.nodeSelection.setCursorPoint(this.parent.currentDocument, insertElem as Element, 0);
        originalEvent.preventDefault();
        this.triggerActionCompleteCallBack(args, args.event.shiftKey);
    }
}

type SpecialElementType = 'TABLE' | 'IMG' | 'VIDEO' | 'EMBEDVIDEO' | 'AUDIO';

interface SpecialElementCursor extends SpecialElementStartCursor, SpecialElementEndCursor {}

interface SpecialElementStartCursor {
    start: boolean;
    startNode?: HTMLElement;
    startName?: SpecialElementType;
}

interface SpecialElementEndCursor {
    end: boolean;
    endNode?: HTMLElement;
    endName?: SpecialElementType;
}
