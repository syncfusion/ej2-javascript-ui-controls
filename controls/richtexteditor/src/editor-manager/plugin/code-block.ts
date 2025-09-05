import { createElement, detach, KeyboardEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CodeBlockPosition, IHtmlItem, IHtmlSubCommands } from '../base/interface';
import * as EVENTS from '../../common/constant';
import { ICodeBlockItem, IEditorModel } from '../../common/interface';

/**
 * Code Block internal component
 *
 * @hidden
 * @deprecated
 */
export class CodeBlockPlugin {
    private parent: IEditorModel;

    /**
     * Constructor for creating the Code Block plugin
     *
     * @param {IEditorModel} parent - specifies the parent element
     * @hidden
     * @deprecated
     */
    public constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
    }
    /* Attaches event listeners for code block operations */
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.CODE_BLOCK, this.applyCodeBlockHandler, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
        this.parent.observer.on(EVENTS.CODEBLOCK_INDENTATION, this.handleCodeBlockIndentation, this);
    }
    /* Removes all event listeners attached by this plugin */
    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.CODE_BLOCK, this.applyCodeBlockHandler);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
        this.parent.observer.off(EVENTS.CODEBLOCK_INDENTATION, this.handleCodeBlockIndentation);
    }
    /* Destroys the code block plugin instance and cleans up resources */
    public destroy(): void {
        this.removeEventListener();
    }

    // Handles code block operations based on event type
    private applyCodeBlockHandler(e: IHtmlItem): void {
        if (e.subCommand === 'CodeBlock' && !isNullOrUndefined(e.item) && !isNullOrUndefined((e as IHtmlItem ).item.action) && (!isNullOrUndefined(e.event) || (e as IHtmlItem ).item.action === 'createCodeBlock')) {
            switch ((e as IHtmlItem ).item.action) {
            case 'createCodeBlock':
                this.codeBlockCreation(e);
                break;
            case 'codeBlockPaste':
                this.codeBlockPasteAction(e);
                break;
            case 'codeBlockEnter':
                this.codeBlockEnterAction(e);
                break;
            case 'codeBlockBackSpace':
                this.codeBlockBackSpaceAction(e);
                break;
            case 'codeBlockTabAction':
                this.codeBlockTabAction(e);
                break;
            case 'codeBlockShiftTabAction':
                this.codeBlockShiftTabAction(e);
                break;
            }
            this.callBack(e);
        }
    }

    // Executes the callback function with event details
    private callBack (event: IHtmlItem): void {
        if (event.callBack) {
            event.callBack({
                requestType: event.subCommand,
                action: event.item.action,
                event: event.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes(true) as Element[]
            });
        }
    }

    /**
     * Determines if a node is inside a valid code block structure
     *
     * This method checks if the given node is within a proper code block structure
     * (a PRE element containing a CODE element as its first child).
     *
     * @param {Node} node - The node to check
     * @returns {HTMLElement|null} - The PRE element if the node is inside a valid code block, otherwise null
     * @public
     */
    public isValidCodeBlockStructure(node: Node): HTMLElement | null {
        const parentNodes: Node = (node.nodeName === '#text' ? node.parentElement : node) as HTMLElement;
        if (parentNodes !== this.parent.editableElement && !isNullOrUndefined((parentNodes as HTMLElement).closest('pre')) && (parentNodes as HTMLElement).closest('pre').hasAttribute('data-language')
            && !isNullOrUndefined((parentNodes as HTMLElement).closest('pre').firstChild) && (parentNodes as HTMLElement).closest('pre').firstChild.nodeName === 'CODE') {
            return (parentNodes as HTMLElement).closest('pre');
        }
        return null;
    }
    /* Determines if the 'Enter' action occurs within a valid code block structure. */
    public isCodeBlockEnterAction(range: Range, e: KeyboardEvent): boolean {
        const cursorAtPointer: boolean = range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset;
        if (e.keyCode === 13 && cursorAtPointer && !isNullOrUndefined(this.isValidCodeBlockStructure(range.startContainer))) {
            return true;
        } else {
            return false;
        }
    }

    // Handles backspace operations within code blocks
    private codeBlockBackSpaceAction(e: IHtmlItem): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const startContainer: Node = range.startContainer.nodeName === '#text' ?
            range.startContainer.parentElement : range.startContainer;
        const endContainer: Node = range.endContainer.nodeName === '#text' ?
            range.endContainer.parentElement : range.endContainer;

        if (e.event.type === 'keyup') {
            this.handleKeyUpBackspace(range, startContainer, endContainer);
        } else if (e.event.type === 'keydown') {
            this.handleKeyDownBackspace(e, range, startContainer, endContainer);
        }
    }

    // Handles keyup backspace operations within code blocks
    private handleKeyUpBackspace(range: Range, startContainer: Node, endContainer: Node): void {
        if (this.isCodeBlockElement(startContainer) && this.isCodeBlockElement(endContainer)) {
            const codeBlockTarget: Element = (startContainer as HTMLElement).closest('pre[data-language]');
            const codeBlock: Element = codeBlockTarget.querySelector('code');
            // Handles case when an entire code block is selected and content is deleted
            if (isNullOrUndefined(codeBlock) && range.startOffset === 0 &&
                range.endOffset === 0 && range.startContainer.nodeName === 'PRE' &&
                range.endContainer.nodeName === 'PRE') {
                (startContainer as HTMLElement).closest('pre[data-language]').firstChild.remove();
                const br: HTMLElement = createElement('br');
                const codeElement: HTMLElement = createElement('code');
                codeElement.appendChild(br);
                codeBlockTarget.appendChild(codeElement);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, br, 0);
            }
        }
    }

    // Checks if a node is inside a code block element
    private isCodeBlockElement(node: Node): boolean {
        return !isNullOrUndefined((node as HTMLElement).closest('pre[data-language]'));
    }

    // Handles keydown backspace operations within code blocks
    private handleKeyDownBackspace(e: IHtmlItem, range: Range, startContainer: Node, endContainer: Node): void {
        // Handle cases where selection spans across code block boundaries
        if (isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            !isNullOrUndefined(this.isValidCodeBlockStructure(endContainer))) {
            this.handleSelectionAcrossCodeBlockBoundary(e, range, startContainer, endContainer);
            return;
        }
        // Handle cases where selection spans from code block to regular content
        if (!isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            isNullOrUndefined(this.isValidCodeBlockStructure(endContainer))) {
            this.handleSelectionFromCodeBlockToRegular(e, range, startContainer);
            return;
        }
        // Handle single point deletion (Delete or Backspace at a specific position)
        if (((e.event as KeyboardEvent).which === 46 || (e.event as KeyboardEvent).which === 8) &&
            range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
            this.handleSinglePointDeletion(e, range, startContainer);
        }
    }

    // Handles selection across code block boundary
    private handleSelectionAcrossCodeBlockBoundary(
        e: IHtmlItem, range: Range, startContainer: Node, endContainer: Node
    ): void {
        e.event.preventDefault();
        const codeBlockTarget: Element = this.isValidCodeBlockStructure(endContainer);
        const parentNode: Node = this.parent.domNode.getImmediateBlockNode(startContainer);
        range.deleteContents();
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(parentNode);
        const parentCursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(codeBlockTarget.previousSibling);
        const textWrapper: ChildNode = codeBlockTarget.firstChild;
        if (textWrapper && parentNode && parentNode.textContent !== '') {
            this.moveContentToParent(textWrapper, parentNode, codeBlockTarget);
        }
        this.setCursorAfterBoundaryOperation(parentNode, codeBlockTarget, cursorOffset, parentCursorOffset);
        this.cleanupEmptyElements(codeBlockTarget, parentNode);
    }

    // Moves content from code block to parent node
    private moveContentToParent(textWrapper: ChildNode, parentNode: Node, codeBlockTarget: Element): void {
        while (textWrapper && textWrapper.firstChild) {
            if (parentNode === this.parent.editableElement) {
                parentNode.insertBefore(textWrapper.firstChild, codeBlockTarget);
            } else {
                parentNode.appendChild(textWrapper.firstChild);
            }
        }
    }

    // Sets cursor position after boundary operation
    private setCursorAfterBoundaryOperation(
        parentNode: Node,
        codeBlockTarget: Element,
        cursorOffset: { node: Node; offset: number } | null,
        parentCursorOffset: { node: Node; offset: number } | null
    ): void {
        if (parentNode.textContent === '') {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                codeBlockTarget.firstChild as Element,
                0
            );
        } else if (parentNode === this.parent.editableElement) {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                parentCursorOffset.node as Element,
                parentCursorOffset.offset
            );
        } else {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                cursorOffset.node as Element,
                cursorOffset.offset
            );
        }
    }

    // Cleans up empty elements after operation
    private cleanupEmptyElements(codeBlockTarget: Element, parentNode: Node): void {
        if (codeBlockTarget.textContent.trim() === '') {
            codeBlockTarget.remove();
        }
        if (parentNode.textContent === '') {
            (parentNode as Element).remove();
        }
    }

    /* Handles selection from code block to regular content */
    private handleSelectionFromCodeBlockToRegular(e: IHtmlItem, range: Range, startContainer: Node): void {
        const codeBlockTarget: Element = this.isValidCodeBlockStructure(startContainer);
        const blockNodes: Node[] = this.parent.domNode.blockNodes(true);
        range.deleteContents();
        // Get code element and add BR element if missing
        const codeElement: Element = codeBlockTarget.querySelector('code');
        if (this.addBrElementIfMissing(codeElement, range)) {
            e.event.preventDefault();
            return;
        }
        const items: ICodeBlockItem = (e.item as ICodeBlockItem).currentFormat;
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(codeBlockTarget);
        this.parent.nodeSelection.setCursorPoint(
            this.parent.currentDocument,
            cursorOffset.node as Element,
            cursorOffset.offset
        );
        range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const validBlockNodes: Node[] = blockNodes.filter((node: Node) =>
            this.parent.editableElement.contains(node));
        this.setCursorMarkers(range);
        this.processCodeBlockAction(range, validBlockNodes, items);
        e.event.preventDefault();
    }
    /* Method to add a BR element to the code element if one doesn't exist */
    private addBrElementIfMissing(codeElement: Element, range: Range): boolean {
        if (!isNullOrUndefined(codeElement) && codeElement.childNodes.length === 0) {
            const br: HTMLElement = createElement('br');
            codeElement.appendChild(br);
            range.setStartBefore(br);
            range.setEndBefore(br);
            return true;
        }
        return false;
    }
    // Handles single point deletion (Delete or Backspace)
    private handleSinglePointDeletion(e: IHtmlItem, range: Range, startContainer: Node): void {
        const keyCode: number = (e.event as KeyboardEvent).which;
        const codeBlockElement: HTMLElement = this.isValidCodeBlockStructure(startContainer);
        // Process delete key at code block boundary
        if (keyCode === 46) {
            this.handleDeleteKeyAtCodeBlockBoundary(e, range, codeBlockElement);
        }
        // Process next sibling code block deletion
        this.handleNextSiblingCodeBlockDeletion(e, range, keyCode);
        // Process backspace at code block start
        this.handleBackspaceAtCodeBlockStart(e, range, keyCode, codeBlockElement);
        // Process backspace after code block
        this.handleBackspaceAfterCodeBlock(e, range, keyCode);
    }

    // Handles delete key press at code block boundary
    private handleDeleteKeyAtCodeBlockBoundary(
        e: IHtmlItem, range: Range, codeBlockElement: HTMLElement
    ): void {
        if (!codeBlockElement) {
            return;
        }
        const rangeElement: Node = (range.startContainer.nodeName === 'CODE')
            ? range.startContainer.childNodes[range.startOffset]
            : range.startContainer;
        const isCursorAtPointer: boolean = range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset;
        // Check if the cursor is at a single point and the last child of the code block is a <br>, then remove the <br> to clean up the code block.
        if (isCursorAtPointer && this.isBrAsLastChildInCodeBlock(codeBlockElement)) {
            const codeElement: HTMLElement = codeBlockElement.querySelector('code');
            if (codeElement && codeElement.lastChild && codeElement.lastChild.nodeName === 'BR') {
                codeElement.removeChild(codeElement.lastChild);
            }
        }
        const rangeIsAtFirstPosition: boolean = isCursorAtPointer && codeBlockElement.querySelector('code').childNodes.length === 1 &&
            codeBlockElement.querySelector('code').childNodes[0].nodeName === 'BR' && (codeBlockElement.querySelector('code').firstChild === rangeElement);
        const isDeleteKey: boolean = (e.event as KeyboardEvent).which === 46;
        // Finds the next sibling to merge its content into the code block when the delete key is pressed,
        // the cursor is at the end of the code block, and the next sibling is not null.
        const elementNextSibling: HTMLElement = this.findNextValidSibling(codeBlockElement) as HTMLElement;
        const lastNode: boolean = isDeleteKey &&
            !isNullOrUndefined(codeBlockElement) &&
            !isNullOrUndefined(elementNextSibling) &&
            (this.isValidCodeBlockStructure(range.startContainer).querySelector('code').lastChild === rangeElement) &&
            rangeElement.textContent.length === (rangeElement.nodeName === 'BR' ? 0 : range.startOffset);
        const codeBlockNextSiblingIsNull: boolean = rangeIsAtFirstPosition && isNullOrUndefined(elementNextSibling);
        const codeBlockNextSibling: boolean = rangeIsAtFirstPosition && !isNullOrUndefined(elementNextSibling);
        const codeBlockPreviousSiblingIsNull: boolean = rangeIsAtFirstPosition && isNullOrUndefined(codeBlockElement.previousSibling);
        if (codeBlockNextSiblingIsNull && codeBlockPreviousSiblingIsNull) {
            this.handleActionWhenNextSiblingIsNull(e, codeBlockElement);
        } else if (codeBlockNextSibling) {
            this.handleActionWhenNextSiblingExists(e, codeBlockElement, elementNextSibling);
        } else if (lastNode) {
            e.event.preventDefault();
            this.mergeNextContentIntoCodeBlock(codeBlockElement, rangeElement);
        }
    }
    /* This method checks if the last child of the code block's code element is a <br>
     and ensures it is not preceded by another <br> to prevent consecutive empty lines. */
    private isBrAsLastChildInCodeBlock(codeBlockElement: HTMLElement): boolean {
        const codeElement: HTMLElement = codeBlockElement.querySelector('code');
        const lastChild: Node = codeElement.lastChild;
        const previousSibling: Node = lastChild ? lastChild.previousSibling : null;
        return lastChild && lastChild.nodeName === 'BR' &&
            (!isNullOrUndefined(previousSibling) && previousSibling.nodeName !== 'BR');
    }
    /*
     * Handle action when the next sibling is null
    */
    private handleActionWhenNextSiblingIsNull(e: IHtmlItem, codeBlockElement: HTMLElement): void {
        e.event.preventDefault();
        this.nodeCreateBasedOnEnterAction(codeBlockElement, e.enterAction);
        detach(codeBlockElement);
    }
    /*
     * Handle action when the next sibling exists
     */
    private handleActionWhenNextSiblingExists(
        e: IHtmlItem,
        codeBlockElement: HTMLElement,
        elementNextSibling: HTMLElement | null
    ): void {
        e.event.preventDefault();
        const firstPosition: { node: Node; position: number } =
            this.parent.nodeSelection.findFirstContentNode(elementNextSibling);
        if (firstPosition.node.nodeName === 'BR') {
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartBefore(firstPosition.node);
            newRange.setEndBefore(firstPosition.node);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
        } else {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument, firstPosition.node as Element, 0
            );
        }
        this.processListElement(codeBlockElement);
    }

    /*
     * Process the list element for the code block
     */
    private processListElement(codeBlockElement: HTMLElement): void {
        let listElement: HTMLElement | null = codeBlockElement.parentElement;
        if (listElement && listElement.nodeName !== 'LI' && listElement.lastChild === codeBlockElement) {
            listElement = codeBlockElement.closest('li');
        }
        detach(codeBlockElement);
        if (listElement && listElement.nodeName === 'LI') {
            const parentList: HTMLElement | null = listElement.parentElement;
            detach(listElement);
            if (parentList &&
                (parentList.nodeName === 'UL' || parentList.nodeName === 'OL') &&
                !parentList.querySelector('li')
            ) {
                detach(parentList);
            }
        }
    }
    /*
     * Finds the next valid sibling element until reaching the parent.editableElement.
     * If no sibling exists, climbs up through parents to find a sibling.
     * @param element The current element to start searching from
     * @returns The next valid sibling HTMLElement or null if none found
     */
    private findNextValidSibling(element: HTMLElement): Node | null {
        let current: Node | null = element.nextSibling;
        if (isNullOrUndefined(current) && element !== this.parent.editableElement) {
            let parent: HTMLElement | null = element.parentElement;
            while (parent && parent !== this.parent.editableElement) {
                current = parent.nextSibling;
                while (current && !this.isValidNode(current)) {
                    current = current.nextSibling;
                }
                if (current && (current.nodeName === 'TH' || current.nodeName === 'TD')) {
                    return null;
                }
                if (current) {
                    break;
                }
                parent = parent.parentElement;
            }
        }
        // If the current node is a list, find the first <li> within it.
        if (current && (current.nodeName === 'UL' || current.nodeName === 'OL')) {
            const firstListItem: Node | null = this.findFirstListItem(current as HTMLElement);
            if (firstListItem) {
                return firstListItem;
            }
        }
        return current;
    }
    /* Helper method to find the first <li> in (potentially nested) lists */
    private findFirstListItem(listElement: HTMLElement): Node | null {
        for (let i: number = 0; i < listElement.childNodes.length; i++) {
            const child: Node = listElement.childNodes[i as number];
            if (child.nodeName === 'LI') {
                const nestedList: Element = (child as Element).querySelector('OL,UL');
                if (nestedList) {
                    const nestedListItem: Node = this.findFirstListItem(nestedList as HTMLElement);
                    if (nestedListItem) {
                        return nestedListItem;
                    }
                }
                return child;
            }
        }
        return null;
    }
    private isValidNode(node: Node): boolean {
        if (node.nodeType === Node.ELEMENT_NODE) {
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim().length > 0;
        }
        return false;
    }
    private nodeCreateBasedOnEnterAction(target: Node, enterAction: string): void {
        const enterElement: HTMLElement = createElement(enterAction);
        const br: HTMLElement = createElement('br');
        if (enterAction === 'P' || enterAction === 'DIV') {
            enterElement.appendChild(br);
        }
        target.parentNode.insertBefore(enterElement, target);
        if (enterAction === 'BR') {
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartBefore(enterElement);
            newRange.setEndBefore(enterElement);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
        } else {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, enterElement, 0);
        }
    }
    // Merges next content into code block
    private mergeNextContentIntoCodeBlock(codeBlockElement: HTMLElement, rangeElement: Node): void {
        const nextSibling: Node = this.findNextValidSibling(codeBlockElement) as HTMLElement;
        const codeElement: HTMLElement = codeBlockElement.querySelector('code');
        if (nextSibling.nodeName === 'BR') {
            this.processNode(nextSibling, codeElement);
            detach(nextSibling);
        } else if (!isNullOrUndefined(nextSibling)) {
            if (rangeElement.nodeName === 'BR') {
                detach(rangeElement);
            }
            if (!this.parent.domNode.isBlockNode(nextSibling as Element)) {
                this.processInlineNextSiblings(nextSibling, codeElement);
            } else {
                this.processNode(nextSibling, codeElement);
                if (nextSibling && nextSibling.nodeName === 'LI' && nextSibling.parentElement.querySelectorAll('li').length === 1) {
                    detach(nextSibling.parentElement);
                } else {
                    nextSibling.parentNode.removeChild(nextSibling);
                }
            }
        }
    }

    // Processes inline next siblings into code block
    private processInlineNextSiblings(startNode: Node, codeElement: HTMLElement): void {
        let nextSibling: Node = startNode;
        let shouldContinue: boolean = true;
        while (nextSibling && shouldContinue) {
            const currentSibling: Node = nextSibling;
            nextSibling = nextSibling.nextSibling;
            if (currentSibling.nodeName !== 'BR' &&
                !this.parent.domNode.isBlockNode(currentSibling as Element)) {
                this.processNode(currentSibling, codeElement);
                currentSibling.parentNode.removeChild(currentSibling);
            } else {
                shouldContinue = false;
            }
        }
    }


    // Handles next sibling code block deletion
    private handleNextSiblingCodeBlockDeletion(e: IHtmlItem, range: Range, keyCode: number): void {
        const immediateBlockNode: Node = this.parent.domNode.getImmediateBlockNode(range.startContainer);
        const blockNode: Node = immediateBlockNode !== this.parent.editableElement ?
            immediateBlockNode : range.startContainer;
        const lastPosition: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(blockNode);
        const cursorAtLastPosition: boolean = lastPosition &&
            lastPosition.node === range.startContainer &&
            lastPosition.offset === range.startOffset;
        const isNextSiblingCodeBlock: { currentNode: Node, nextSibling: Node } | null =
            this.findParentOrNextSiblingCodeBlock(range);
        const nextSiblingElemCodeBlock: boolean = (keyCode === 46) &&
            !isNullOrUndefined(isNextSiblingCodeBlock) && cursorAtLastPosition;
        if (nextSiblingElemCodeBlock) {
            e.event.preventDefault();
            this.mergeCodeBlockWithCurrentNode(isNextSiblingCodeBlock);
        }
    }

    // Merges code block with current node
    private mergeCodeBlockWithCurrentNode(
        nodeInfo: { currentNode: Node, nextSibling: Node }
    ): void {
        const codeBlockElement: HTMLElement = nodeInfo.nextSibling as HTMLElement;
        const codeElement: HTMLElement = codeBlockElement.querySelector('code');
        const currentNode: Node = nodeInfo.currentNode;

        if (this.parent.domNode.isBlockNode(currentNode as Element)) {
            while (codeElement.firstChild) {
                const child: ChildNode = codeElement.firstChild;
                currentNode.appendChild(child);
            }
            codeBlockElement.parentNode.removeChild(codeBlockElement);
        } else {
            const parentNode: Node = currentNode.parentNode;
            const nextSibling: Node = currentNode.nextSibling;

            while (codeElement.firstChild) {
                const child: Node = codeElement.firstChild;
                parentNode.insertBefore(child, nextSibling);
            }
            codeBlockElement.parentNode.removeChild(codeBlockElement);
        }
    }

    // Handles backspace at code block start position
    private handleBackspaceAtCodeBlockStart(
        e: IHtmlItem, range: Range, keyCode: number, codeBlockElement: HTMLElement
    ): void {
        const firstPosition: { node: Node; position: number } =
            this.parent.nodeSelection.findFirstContentNode(
                this.parent.domNode.getImmediateBlockNode(range.startContainer)
            );
        const cursorAtFirstPosition: boolean = firstPosition.node &&
            firstPosition.node === (range.startContainer.nodeName === 'CODE' ?
                range.startContainer.firstChild : range.startContainer) &&
            range.startOffset === 0;
        const isCodeBlockCurrentElement: boolean = (keyCode === 8) &&
            !isNullOrUndefined(codeBlockElement) && cursorAtFirstPosition;
        if (isCodeBlockCurrentElement) {
            e.event.preventDefault();
            const codeElement: HTMLElement = codeBlockElement.querySelector('code');
            if (!isNullOrUndefined(codeBlockElement.previousSibling)){
                const previousElement: Node = codeBlockElement.previousSibling;
                const cursorOffset: { node: Node; offset: number } | null =
                    this.parent.nodeSelection.findLastTextPosition(previousElement);
                this.mergePreviousElementWithCodeBlock(previousElement, codeElement, codeBlockElement);
                if (!isNullOrUndefined(previousElement)) {
                    this.parent.nodeSelection.setCursorPoint(
                        this.parent.currentDocument,
                        cursorOffset.node as Element,
                        cursorOffset.offset
                    );
                }
            } else if (isNullOrUndefined(codeBlockElement.previousSibling)) {
                if (codeBlockElement.textContent.length === 0) {
                    this.nodeCreateBasedOnEnterAction(codeBlockElement, e.enterAction);
                    detach(codeBlockElement);
                }
            }
        }
    }

    // Merges previous element with code block
    private mergePreviousElementWithCodeBlock(
        previousElement: Node, codeElement: HTMLElement, codeBlockElement: HTMLElement
    ): void {
        if (this.parent.domNode.isBlockNode(previousElement as Element)) {
            while (codeElement.firstChild) {
                const child: ChildNode = codeElement.firstChild;
                previousElement.appendChild(child);
            }
            codeBlockElement.parentNode.removeChild(codeBlockElement);
        } else {
            // Logic for inline elements
            const parentNode: Node = previousElement.parentNode;
            const nextSibling: Node = previousElement.nextSibling;
            while (codeElement.firstChild) {
                const child: Node = codeElement.firstChild;
                parentNode.insertBefore(child, nextSibling);
            }
            codeBlockElement.parentNode.removeChild(codeBlockElement);
        }
    }

    // Handles backspace after code block
    private handleBackspaceAfterCodeBlock(e: IHtmlItem, range: Range, keyCode: number): void {
        const immediateBlockNode: Node = this.parent.domNode.getImmediateBlockNode(range.startContainer);
        const blockNode: Node = immediateBlockNode !== this.parent.editableElement ? immediateBlockNode : range.startContainer;
        const firstPosition: { node: Node; position: number } =
            this.parent.nodeSelection.findFirstContentNode(blockNode);
        const cursorAtFirstPosition: boolean = firstPosition.node &&
            firstPosition.node === (range.startContainer.nodeName === 'CODE' ?
                range.startContainer.firstChild : range.startContainer) &&
            range.startOffset === 0;
        const isBlockElement: { currentNode: Node, previousSibling: Node } | null =
            this.findParentOrPreviousSiblingCodeBlock(range);
        // Check if the current node is a table
        const isCurrentNodeTable: boolean = isBlockElement && isBlockElement.currentNode.nodeName === 'TABLE';
        const backspacePreviousCodeBlock: boolean = (keyCode === 8) &&
            !isNullOrUndefined(isBlockElement) && cursorAtFirstPosition && !isCurrentNodeTable;
        if (backspacePreviousCodeBlock) {
            e.event.preventDefault();
            this.mergePreviousCodeBlockWithCurrent(isBlockElement);
        }
    }

    // Merges previous code block with current element
    private mergePreviousCodeBlockWithCurrent(
        blockInfo: { currentNode: Node, previousSibling: Node }
    ): void {
        const codeBlockElement: HTMLElement = blockInfo.previousSibling as HTMLElement;
        const codeElement: HTMLElement = codeBlockElement.querySelector('code');
        const currentNode: Node = blockInfo.currentNode;
        let insertPosition: Node = null;
        let isFirstNode: boolean = true;
        const processAndTrackNode: (node: Node, targetElement: HTMLElement) => void =
            (node: Node, targetElement: HTMLElement) => {
                this.processNode(node, targetElement);
                if (isFirstNode) {
                    insertPosition = targetElement.lastChild;
                    isFirstNode = false;
                }
            };
        if (this.parent.domNode.isBlockNode(currentNode as Element)) {
            this.processMergeBlockNode(currentNode, codeElement, processAndTrackNode);
        } else {
            this.processMergeInlineNode(currentNode, codeElement, processAndTrackNode);
        }
        if (insertPosition) {
            if (insertPosition.nodeType === Node.TEXT_NODE) {
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument,
                    insertPosition as Element,
                    0
                );
            }
        }
    }


    // Processes merge of block node with code element
    private processMergeBlockNode(
        currentNode: Node,
        codeElement: HTMLElement,
        processFunc: (node: Node, targetElement: HTMLElement) => void
    ): void {
        while (currentNode.firstChild) {
            const child: ChildNode = currentNode.firstChild;
            currentNode.removeChild(child);
            processFunc(child, codeElement);
        }
        currentNode.parentNode.removeChild(currentNode);
    }

    // Processes merge of inline node with code element
    private processMergeInlineNode(
        startNode: Node,
        codeElement: HTMLElement,
        processFunc: (node: Node, targetElement: HTMLElement) => void
    ): void {
        let node: Node = startNode;
        while (node) {
            const nextSibling: Node = node.nextSibling;
            if (node.nodeName === 'BR' || this.parent.domNode.isBlockNode(node as Element)) {
                break;
            }
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            processFunc(node, codeElement);
            node = nextSibling;
        }
    }

    // Handles Enter key press within code blocks
    private codeBlockEnterAction(e: IHtmlItem): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const startContainer: Node = range.startContainer.nodeName === '#text' ?
            range.startContainer.parentElement : range.startContainer;
        const endContainer: Node = range.endContainer.nodeName === '#text' ?
            range.endContainer.parentElement : range.endContainer;
        // Check if cursor is inside a code block at a specific position
        if (this.isCodeBlockPointSelection(range, startContainer, endContainer)) {
            this.handleCodeBlockPointSelection(e, range, startContainer);
        }
        // Handle selection entirely within code block
        else if (this.isSelectionWithinCodeBlock(range, startContainer, endContainer)) {
            this.handleSelectionWithinCodeBlock(e, range);
        }
        // Handle selection starting outside code block but ending inside
        else if (this.isSelectionOutsideToInside(startContainer, endContainer)) {
            this.handleOutsideToInsideSelection(e, range, endContainer);
        }
        // Handle selection starting inside code block but ending outside
        else if (this.isSelectionInsideToOutside(startContainer, endContainer)) {
            this.handleInsideToOutsideSelection(e, range, startContainer);
        }
    }
    // Checks if the selection is a point selection inside a code block
    private isCodeBlockPointSelection(range: Range, startContainer: Node, endContainer: Node): boolean {
        const isPointSelection: boolean = range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset;
        const inCodeBlock: boolean = !isNullOrUndefined((startContainer as HTMLElement).closest('pre[data-language]')) &&
            !isNullOrUndefined((endContainer as HTMLElement).closest('pre[data-language]'));
        if (!isPointSelection || !inCodeBlock) {
            return false;
        }
        const firstAppend: boolean = this.isFirstAppendScenario(range);
        const lastAppend: boolean = this.isLastAppendScenario(range);
        return firstAppend || lastAppend;
    }

    // Checks if it's a first append scenario inside a code block
    private isFirstAppendScenario(range: Range): boolean {
        return range.startOffset === 0 && range.endOffset === 0 &&
            range.startContainer.nodeName === 'CODE' &&
            range.startContainer.childNodes[range.startOffset] &&
            range.endContainer.childNodes[range.endOffset] &&
            range.startContainer.childNodes[range.endOffset].nodeName === 'BR' &&
            range.startContainer.childNodes.length > 1 &&
            !isNullOrUndefined(range.startContainer.childNodes[range.endOffset + 1]);
    }

    // Checks if it's a last append scenario inside a code block
    private isLastAppendScenario(range: Range): boolean {
        return range.startContainer.nodeName === 'CODE' &&
            range.startContainer.childNodes[range.startOffset] &&
            range.startContainer.childNodes[range.startOffset].nodeName === 'BR' &&
            range.startContainer.lastChild === range.startContainer.childNodes[range.startOffset] &&
            !isNullOrUndefined(range.startContainer.childNodes[range.startOffset - 1]) &&
            range.startContainer.childNodes[range.startOffset - 1].nodeName === 'BR' &&
            !isNullOrUndefined(range.startContainer.childNodes[range.startOffset - 2]) &&
            range.startContainer.childNodes[range.startOffset - 2].nodeName === 'BR';
    }

    // Handles point selection inside a code block
    private handleCodeBlockPointSelection(e: IHtmlItem, range: Range, startContainer: Node): void {
        const codeBlock: Element = this.isValidCodeBlockStructure(startContainer);
        // Check if the code block is inside a list
        const listElement: Element = codeBlock.closest('UL,OL');
        if (!isNullOrUndefined(listElement)) {
            e.event.preventDefault();
            // Create new list item element based on enter action
            const enterElement: HTMLElement = createElement('LI');
            const br: HTMLElement = createElement('br');
            enterElement.appendChild(br);
            const isFirstAppend: boolean = this.isFirstAppendScenario(range);
            const codeBlockCodeElement: Node = codeBlock.querySelector('code');
            if (isFirstAppend) {
                detach(codeBlockCodeElement.firstChild);
                listElement.insertBefore(enterElement, codeBlock.closest('li'));
            } else {
                detach(codeBlockCodeElement.lastChild);
                detach(codeBlockCodeElement.lastChild);
                const currentListItem: Element = codeBlock.closest('li');
                const nextListElement: NodeListOf<Element> = currentListItem.querySelectorAll('UL,OL');
                for (let i: number = 0; i < nextListElement.length; i++) {
                    if (nextListElement[i as number].nodeName === 'UL' || nextListElement[i as number].nodeName === 'OL') {
                        enterElement.appendChild(nextListElement[i as number]);
                    }
                }
                listElement.insertBefore(enterElement, currentListItem.nextElementSibling);
            }
            this.setNewRangeBeforeBrElement(br);
        } else {
            e.event.preventDefault();
            // Create new element based on enter action
            const enterElement: HTMLElement = createElement(e.enterAction);
            const br: HTMLElement = createElement('br');
            if (e.enterAction === 'P' || e.enterAction === 'DIV') {
                enterElement.appendChild(br);
            }
            const isFirstAppend: boolean = this.isFirstAppendScenario(range);
            const codeBlockCodeElement: Node = codeBlock.querySelector('code');
            if (isFirstAppend) {
                detach(codeBlockCodeElement.firstChild);
                codeBlock.parentElement.insertBefore(enterElement, codeBlock);
            } else {
                detach(codeBlockCodeElement.lastChild);
                detach(codeBlockCodeElement.lastChild);
                codeBlock.parentElement.insertBefore(enterElement, codeBlock.nextElementSibling);
            }
            this.setNewRangeBeforeBrElement(br);
        }
    }
    private setNewRangeBeforeBrElement(element: HTMLElement): void {
        const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
        newRange.setStartBefore(element);
        newRange.setEndBefore(element);
        this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
    }
    // Checks if selection is entirely within a code block
    public isSelectionWithinCodeBlock(range: Range, startContainer: Node, endContainer: Node): boolean {
        return (!isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            !isNullOrUndefined(this.isValidCodeBlockStructure(endContainer)));
    }

    // Handles selection that's entirely within a code block
    private handleSelectionWithinCodeBlock(e: IHtmlItem, range: Range): void {
        e.event.preventDefault();
        const codeBlock: HTMLElement = this.isValidCodeBlockStructure(range.startContainer);
        // Delete selection contents if range spans multiple positions
        if (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset) {
            range.deleteContents();
        }
        const codeElement: Element = range.endContainer.nodeName === '#text' ?
            (range.endContainer.parentElement as HTMLElement).closest('code') :
            (range.endContainer as HTMLElement).closest('code');
        const isAtEnd: boolean = codeElement && codeElement.lastChild === range.startContainer &&
            (range.endOffset === (range.endContainer.nodeType === Node.TEXT_NODE ?
                range.endContainer.textContent.length : range.endContainer.childNodes.length));
        const addExtraBrElement: boolean = isAtEnd &&
            (isNullOrUndefined(range.startContainer.nextSibling) ||
                (!isNullOrUndefined(range.startContainer.nextSibling) &&
                    range.startContainer.nextSibling.nodeName !== 'BR'));
        const br: HTMLElement = createElement('br');
        range.insertNode(br);
        if (addExtraBrElement) {
            const extraBr: HTMLElement = createElement('br');
            br.parentNode.insertBefore(extraBr, br.nextSibling);
        }
        codeBlock.normalize();
        // Check if there's a text node after the BR
        const nextNode: Node = br.nextSibling;
        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
            // Set range to beginning of the text node
            range.setStart(nextNode, 0);
            range.setEnd(nextNode, 0);
        } else {
            range.setStartAfter(br);
            range.setEndAfter(br);
        }
        this.parent.nodeSelection.setRange(this.parent.currentDocument, range);
    }


    // Checks if selection starts outside code block but ends inside
    private isSelectionOutsideToInside(startContainer: Node, endContainer: Node): boolean {
        return isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            !isNullOrUndefined(this.isValidCodeBlockStructure(endContainer));
    }


    // Handles selection from outside to inside code block
    private handleOutsideToInsideSelection(e: IHtmlItem, range: Range, endContainer: Node): void {
        e.event.preventDefault();
        const codeBlock: Element = this.isValidCodeBlockStructure(endContainer);
        const codeElement: Element = codeBlock.querySelector('code');
        const codeBlockPreviousSibling: Node = codeBlock.previousSibling;
        // Determine if the entire content of the code block is selected
        const isFullCodeBlockSelection: boolean =
            range.endContainer === codeElement.lastChild &&
            range.endOffset === codeElement.lastChild.textContent.length;
        range.deleteContents();
        if (isFullCodeBlockSelection && codeBlockPreviousSibling.textContent.length === 0) {
            this.nodeCreateBasedOnEnterAction(codeBlock, e.enterAction);
            codeBlock.parentNode.removeChild(codeBlock);
            if (codeBlockPreviousSibling.textContent.length === 0) {
                codeBlockPreviousSibling.parentNode.removeChild(codeBlockPreviousSibling);
            }
        } else if (codeElement && codeElement.childNodes.length !== 0 && codeElement.textContent !== '') {
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, codeBlock, 0);
        } else if (codeElement && codeElement.children.length === 0 &&
            codeElement.childNodes[0] && codeElement.childNodes[0].nodeName !== 'BR') {
            const br: HTMLElement = createElement('br');
            codeElement.appendChild(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
        }
    }

    // Checks if selection starts inside code block but ends outside
    private isSelectionInsideToOutside(startContainer: Node, endContainer: Node): boolean {
        return !isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            isNullOrUndefined(this.isValidCodeBlockStructure(endContainer));
    }

    // Handles selection from inside to outside code block
    private handleInsideToOutsideSelection(e: IHtmlItem, range: Range, startContainer: Node): void {
        e.event.preventDefault();
        range.deleteContents();
        const codeBlock: Element = this.isValidCodeBlockStructure(startContainer);
        const codeElement: Element = codeBlock.querySelector('code');
        if (codeElement && codeElement.innerHTML === '' &&
            codeElement.childNodes[0] && codeElement.childNodes[0].nodeName !== 'BR') {
            const br: HTMLElement = createElement('br');
            codeElement.appendChild(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
        }
        // Set cursor to next node after the code block
        const nextNode: Element = codeBlock.nextSibling as Element;
        if (nextNode) {
            if (nextNode.nodeType === Node.TEXT_NODE) {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, nextNode, 0);
            } else {
                const firstTextNode: Node = this.findFirstTextNode(nextNode as Node);
                if (firstTextNode) {
                    this.parent.nodeSelection.setCursorPoint(
                        this.parent.currentDocument, firstTextNode as Element, 0);
                } else {
                    this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, nextNode, 0);
                }
            }
        }
    }
    /* Recursively searches for the first text node within a DOM element
     * Returns the first text node found during depth-first search
     * or null if no text nodes exist within the element
     */
    private findFirstTextNode(node: Node): Node | null {
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        for (let i: number = 0; i < node.childNodes.length; i++) {
            const textNode: Node = this.findFirstTextNode(node.childNodes[i as number]);
            if (!isNullOrUndefined(textNode)) {
                return textNode;
            }
        }
        return null;
    }
    /* Gets the current selection range from the document
    * Returns the first range in the current selection
    */
    private getSelectionRange(): Range {
        const selection: Selection = this.parent.editableElement.ownerDocument.defaultView.getSelection();
        return selection.getRangeAt(0);
    }

    // Handles paste operations in code blocks by processing clipboard data
    private codeBlockPasteAction(e: IHtmlItem): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const startContainer: Node = range.startContainer.nodeName === '#text' ?
            range.startContainer.parentElement : range.startContainer;
        const endContainer: Node = range.endContainer.nodeName === '#text' ?
            range.endContainer.parentElement : range.endContainer;
        if (!this.isValidCodeBlockStructure(startContainer) &&
            !this.isValidCodeBlockStructure(endContainer)) {
            return;
        }
        (e.event as ClipboardEvent).preventDefault();
        const clipboardData: DataTransfer = (e.event as ClipboardEvent).clipboardData;
        const plainText: string = clipboardData.getData('text/plain');
        if (!range) {
            return;
        }
        if (this.isPointSelection(range)) {
            this.handlePointSelectionPaste(range, plainText);
        } else if (this.isSameCodeBlockSelection(startContainer, endContainer)) {
            this.handleSameCodeBlockPaste(range, plainText);
        } else {
            this.handleCrossCodeBlockPaste(range, plainText, startContainer, endContainer, e);
        }
    }
    /* Determines if the range represents a collapsed selection (caret position)
    * Returns true if selection is a single point rather than a range of content
    */
    private isPointSelection(range: Range): boolean {
        return range.startContainer === range.endContainer && range.startOffset === range.endOffset;
    }
    // Determines if both selection endpoints are within the same code block
    private isSameCodeBlockSelection(startContainer: Node, endContainer: Node): boolean {
        return !isNullOrUndefined(this.isValidCodeBlockStructure(endContainer)) &&
            !isNullOrUndefined(this.isValidCodeBlockStructure(startContainer)) &&
            this.isValidCodeBlockStructure(endContainer) === this.isValidCodeBlockStructure(startContainer);
    }

    // Inserts plain text at cursor position when there's a point selection
    private handlePointSelectionPaste(range: Range, plainText: string): void {
        const codeBlockElement: Element = this.isValidCodeBlockStructure(range.startContainer);
        const textNode: Text = document.createTextNode(plainText);
        range.insertNode(textNode);
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(textNode);
        if (cursorOffset && cursorOffset.node) {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                cursorOffset.node as Element,
                cursorOffset.offset
            );
        }
        codeBlockElement.normalize();
    }

    // Replaces selected content with pasted text when selection is within same code block
    private handleSameCodeBlockPaste(range: Range, plainText: string): void {
        const textNode: Text = document.createTextNode(plainText);
        range.deleteContents();
        range.insertNode(textNode);
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(textNode);
        if (cursorOffset && cursorOffset.node) {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                cursorOffset.node as Element,
                cursorOffset.offset
            );
        }
    }

    // Handles complex paste operations that span across code blocks or between code block and regular content
    private handleCrossCodeBlockPaste(
        range: Range,
        plainText: string,
        startContainer: Node,
        endContainer: Node,
        e: IHtmlItem
    ): void {
        const blockNodes: Node[] = this.parent.domNode.blockNodes();
        range.deleteContents();
        const textNode: Text = document.createTextNode(plainText);
        if (this.isValidCodeBlockStructure(endContainer)) {
            const codeElement: HTMLElement = this.isValidCodeBlockStructure(endContainer)
                .querySelector('code');
            codeElement.insertBefore(textNode, codeElement.firstChild);
        } else if (this.isValidCodeBlockStructure(startContainer)) {
            const codeElement: HTMLElement = this.isValidCodeBlockStructure(startContainer)
                .querySelector('code');
            codeElement.appendChild(textNode);
        }
        const cursorOffset: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(textNode);
        if (cursorOffset && cursorOffset.node) {
            this.parent.nodeSelection.setCursorPoint(
                this.parent.currentDocument,
                cursorOffset.node as Element,
                cursorOffset.offset
            );
            const updatedRange: Range = this.getSelectionRange();
            const validBlockNodes: Node[] = blockNodes.filter((node: Node) =>
                this.parent.editableElement.contains(node));
            this.setCursorMarkers(updatedRange);
            const items: ICodeBlockItem = (e.item as ICodeBlockItem).currentFormat;
            this.processCodeBlockAction(updatedRange, validBlockNodes, items);
        }
    }

    // Extracts content from code block and converts it to regular elements
    private extractAndWrapCodeBlockContent(codeBlock: Element, enterAction: string): Node[] {
        const codeElement: Element = codeBlock.querySelector('code');
        const parentNode: Element = codeBlock.parentElement;
        const childNodes: NodeListOf<ChildNode> = codeElement.childNodes;
        const fragments: Node[] = [];
        let newDiv: Element | null = this.parent.currentDocument.createElement(enterAction);
        for (let i: number = 0; i < childNodes.length; i++) {
            if (enterAction !== 'BR') {
                if (childNodes[i as number].nodeName !== 'BR') {
                    const clone: Node = childNodes[i as number].cloneNode(true);
                    newDiv.appendChild(clone);
                    if (!childNodes[i as number + 1]) {
                        fragments.push(newDiv);
                        newDiv = null;
                    }
                } else if (childNodes[i as number].nodeName === 'BR') {
                    if (newDiv.childNodes.length !== 0) {
                        fragments.push(newDiv);
                    }
                    newDiv = this.parent.currentDocument.createElement(enterAction);
                    if (i + 1 < childNodes.length && childNodes[i + 1].nodeName === 'BR') {
                        const element: Element = this.parent.currentDocument.createElement(enterAction);
                        element.innerHTML = '<br>';
                        fragments.push(element);
                    }
                }
            } else {
                fragments.push(childNodes[i as number].cloneNode(true));
            }
        }
        for (let j: number = 0; j < fragments.length; j++) {
            parentNode.insertBefore(fragments[j as number], codeBlock);
        }
        if (enterAction !== 'BR') {
            this.parent.editableElement.querySelectorAll('.e-rte-cursor-marker').forEach((marker: Element) => {
                if (marker.parentElement.textContent.length === 0) {
                    marker.parentElement.appendChild(createElement('BR'));
                }
            });
        }
        codeBlock.remove();
        return fragments;
    }
    // Determines if the current operation is meant to revert a code block to normal text
    private isRevertCodeBlock(e: IHtmlItem, range: Range): boolean {
        const isSplitButtonClick: boolean =
            (e.event && (e.event as KeyboardEventArgs).target &&
                ((e.event as KeyboardEventArgs).target as Node).parentElement &&
                ((e.event as KeyboardEventArgs).target as Node).parentElement.classList.contains('e-split-btn')) ||
            (e.event && (e.event as KeyboardEventArgs).target &&
                ((e.event as KeyboardEventArgs).target as Element).classList.contains('e-split-btn'));
        if (!isSplitButtonClick) {
            return false;
        }
        const isOutsideCodeBlock: boolean =
            !isNullOrUndefined(this.isValidCodeBlockStructure(range.startContainer)) &&
            !isNullOrUndefined(this.isValidCodeBlockStructure(range.endContainer));
        return isOutsideCodeBlock;
    }
    /* Handles code block creation or reversion based on current selection and event */
    private codeBlockCreation(e: IHtmlItem): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        if (this.isRevertCodeBlock(e, range)) {
            this.revertCodeBlockToNormalText(range, e.enterAction);
            this.disableToolbarItems();
        } else {
            this.createNewCodeBlock(range, e);
        }
    }
    /* Converts a code block back to normal text with appropriate formatting */
    private revertCodeBlockToNormalText(range: Range, enterAction: string): void {
        this.setCursorMarkers(range);
        const blockNodes: Node[] = this.getBlockNodes();
        const revertElements: Node[] = [];
        for (let i: number = 0; i < blockNodes.length; i++) {
            const node: Node = blockNodes[i as number];
            const codeBlock: Element = this.isValidCodeBlockStructure(node);
            if (codeBlock) {
                const extractedElements: Node[] = this.extractAndWrapCodeBlockContent(codeBlock, enterAction);
                revertElements.push(...extractedElements);
            }
        }
        this.restoreCursorFromMarkers();
        for (let i: number = 0; i < revertElements.length; i++) {
            revertElements[i as number].normalize();
        }
    }
    /* Creates a new code block from the current selection */
    private createNewCodeBlock(range: Range, e: IHtmlItem): void {
        this.setCursorMarkers(range);
        const blockNodes: Node[] = this.getBlockNodes();
        const items: ICodeBlockItem = (e.item as ICodeBlockItem);
        const { hasTableNodes, itemList } = this.checkTableElementInsideSelection(blockNodes);
        if (this.isRangeInsideTable(range) || hasTableNodes) {
            if (hasTableNodes) {
                for (const node of itemList) {
                    const singleNodeArray: Node[] = node;
                    this.processCodeBlockAction(range, singleNodeArray, items);
                }
            } else {
                // Process each node individually if they're in a table
                for (const node of blockNodes) {
                    // Create a temporary array with just this node
                    const singleNodeArray: Node[] = [node];
                    // Process this individual node
                    this.processCodeBlockAction(range, singleNodeArray, items);
                }
            }
        } else {
            // If not in table, process all nodes together as before
            this.processCodeBlockAction(range, blockNodes, items);
        }
    }
    private checkTableElementInsideSelection(blockNodes: Node[]): {
        hasTableNodes: boolean;
        itemList: Node[][];
    } {
        const itemList: Node[][] = [];
        let nonTableNodes: Node[] = [];
        let blockQuotes: Node[] = [];
        let hasTableNodes: boolean = false;
        for (const node of blockNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element: Element = node as Element;
                const closestCell: Element | null = element.closest('td, th, thead, tbody, tr');
                const closestBlockquote: Element | null = element.closest('blockquote');
                if ((element && element.nodeName === 'TABLE') || (closestCell && !closestCell.classList.contains('e-cell-select'))) {
                    if (nonTableNodes.length > 0) {
                        itemList.push(nonTableNodes);
                    }
                    if (blockQuotes.length > 0) {
                        itemList.push(blockQuotes);
                    }
                    nonTableNodes = [];
                    blockQuotes = [];
                    hasTableNodes = true;
                } else if (closestBlockquote) {
                    if (nonTableNodes.length > 0) {
                        itemList.push(nonTableNodes);
                    }
                    blockQuotes.push(element);
                    nonTableNodes = [];
                    hasTableNodes = true;
                } else {
                    if (blockQuotes.length > 0) {
                        itemList.push(blockQuotes);
                    }
                    nonTableNodes.push(element);
                    blockQuotes = [];
                }
            }
        }
        if (nonTableNodes.length > 0) {
            itemList.push([...nonTableNodes]);
        }
        if (blockQuotes.length > 0) {
            itemList.push([...blockQuotes]);
        }
        return {
            hasTableNodes,
            itemList
        };
    }
    /* Checks if the range is entirely within a table element */
    private isRangeInsideTable(range: Range): boolean {
        const startElement: Element = range.startContainer.nodeType === 1 ?
            range.startContainer as Element :
            range.startContainer.parentElement;
        const endElement: Element = range.endContainer.nodeType === 1 ?
            range.endContainer as Element :
            range.endContainer.parentElement;
        const startTableParent: HTMLTableElement = startElement.closest('table');
        const endTableParent: HTMLTableElement = endElement.closest('table');
        const inSameTable: boolean = startTableParent && endTableParent && startTableParent === endTableParent;
        if (!inSameTable) {
            return false;
        }
        // Check for multi-cell selection by looking for the e-multi-cells-select class
        const multiCellsSelected: boolean = this.parent.editableElement.querySelectorAll('td.e-multi-cells-select, th.e-multi-cells-select').length > 0;
        return multiCellsSelected;
    }
    /* Identifies block nodes that should be included in code block operations */
    private getBlockNodes(): Node[] {
        const node: Node[] = this.getTextAndBrNodes();
        return node;
    }
    /*
     * Retrieves a list of relevant text and <br> nodes for code block formatting in the RTE.
     * Traverses selection, handles cursor marker spans, multi-cell table selection, and block nodes.
     */
    private getTextAndBrNodes(): Node[] {
        const result: Node[] = [];
        let range: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const doc: Document = this.parent.editableElement.ownerDocument;
        const rangePoint: Element = this.parent.editableElement.querySelector('.e-rte-cursor-marker[data-cursor-pos="point"]');
        const rangeStart: Node = this.parent.editableElement.querySelector('.e-rte-cursor-marker[data-cursor-pos="start"]');
        const rangeEnd: Node = this.parent.editableElement.querySelector('.e-rte-cursor-marker[data-cursor-pos="end"]');
        if (!isNullOrUndefined(rangePoint)) {
            const nodeRange: Range = doc.createRange();
            nodeRange.setStartBefore(rangePoint);
            nodeRange.setEndBefore(rangePoint);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, nodeRange);
        }
        range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
        const commonAncestor: Node = range.commonAncestorContainer;
        this.includeFullNodeForRange(rangeStart, rangeEnd, rangePoint);
        const treeWalker: TreeWalker = doc.createTreeWalker(
            commonAncestor,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node: Node): number => {
                    const isTextNode: boolean = node.nodeType === Node.ELEMENT_NODE && node.previousSibling && node.previousSibling.nodeName === 'SPAN' && (node.previousSibling as Element).classList.contains('e-rte-cursor-marker');
                    const range: Range = this.parent.nodeSelection.getRange(this.parent.editableElement.ownerDocument);
                    if ((node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR' || isTextNode)
                        && node !== this.parent.editableElement && range.intersectsNode(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
        let currentNode: Node | null = treeWalker.currentNode;
        while (currentNode) {
            if (currentNode !== this.parent.editableElement && currentNode.nodeName !== 'UL' && currentNode.nodeName !== 'OL' && currentNode.nodeName !== 'TD' && currentNode.nodeName !== 'TH' && currentNode.nodeName !== 'BLOCKQUOTE' &&
                ((currentNode.nodeName === '#text' && currentNode.textContent !== '' && !(currentNode.textContent.length === 1 && currentNode.textContent.charCodeAt(0) === 32))
                    || currentNode.nodeName === 'BR')
            ) {
                result.push(currentNode);
            }
            currentNode = treeWalker.nextNode();
        }
        const blockNodes: Node[] = [];
        const rangeAtPoint: boolean = range.startContainer === range.endContainer &&
            range.startOffset === range.endOffset;
        for (let i: number = 0; i < result.length; i++) {
            const findMultiSelect: Node = result[0].nodeName === '#text' ? result[0].parentElement : result[0];
            const tableCellMultiSelect: boolean = findMultiSelect && (findMultiSelect as Element).closest('td,th') && (findMultiSelect as Element).closest('td,th').classList.contains('e-multi-cells-select');
            if (result[i as number].nodeName === 'BR') {
                if (tableCellMultiSelect) {
                    this.wrapTableElementToList(blockNodes);
                } else if ((i + 1 < result.length && result[i + 1].nodeName === 'BR') || (rangeAtPoint && i === result.length - 1)) {
                    this.processNodeForBlockNodes(result[i as number], blockNodes);
                }
            } else {
                if (tableCellMultiSelect) {
                    this.wrapTableElementToList(blockNodes);
                } else {
                    this.processNodeForBlockNodes(result[i as number], blockNodes);
                }
            }
        }
        return blockNodes;
    }
    /*
     * Ensures the selection covers the entire relevant node(s) based on start, end, or cursor marker.
     * Extends selection range to appropriate boundaries for formatting operations.
     */
    private includeFullNodeForRange(start: Node, end: Node, cursorPointer: Node): void {
        let previousBlockNode: Node = null;
        let nextSiblingBlockNode: Node = null;
        if ((start && end) || cursorPointer) {
            start = start != null ? start : cursorPointer;
            previousBlockNode = this.parent.domNode.getImmediateBlockNode(start as Element);
            if (previousBlockNode === this.parent.editableElement || (previousBlockNode && (previousBlockNode.nodeName === 'TH' || previousBlockNode.nodeName === 'TD'))) {
                previousBlockNode = start;
                while (
                    previousBlockNode &&
                    previousBlockNode.previousSibling &&
                    previousBlockNode.previousSibling.nodeName !== 'BR' &&
                    !this.parent.domNode.isBlockNode(previousBlockNode.previousSibling as Element)
                ) {
                    const isBlockNode: Node = this.parent.domNode.getImmediateBlockNode(previousBlockNode as Element);
                    if (isBlockNode !== this.parent.editableElement && isBlockNode.nodeName !== 'TD' && isBlockNode.nodeName !== 'TH') {
                        break;
                    }
                    previousBlockNode = previousBlockNode.previousSibling;
                }
            }
            end = end != null ? end : cursorPointer;
            nextSiblingBlockNode = this.parent.domNode.getImmediateBlockNode(end as Element);
            if (nextSiblingBlockNode === this.parent.editableElement || (nextSiblingBlockNode && (nextSiblingBlockNode.nodeName === 'TH' || nextSiblingBlockNode.nodeName === 'TD'))) {
                nextSiblingBlockNode = end;
                const endElement: Element = end as Element;
                const isCursorMarker: boolean = nextSiblingBlockNode && nextSiblingBlockNode.nextSibling && nextSiblingBlockNode.nextSibling.nodeName === 'BR' &&
                    end && end.nodeName === 'SPAN' && endElement.className && (endElement.className.indexOf('e-rte-cursor-marker') !== -1);
                while ((nextSiblingBlockNode && nextSiblingBlockNode.nextSibling && nextSiblingBlockNode.nextSibling.nodeName !== 'BR' &&
                    !this.parent.domNode.isBlockNode(nextSiblingBlockNode.nextSibling as Element)) || isCursorMarker) {
                    if (
                        nextSiblingBlockNode.nextSibling &&
                        nextSiblingBlockNode.nextSibling.nodeName === 'BR' &&
                        end && end.nodeName === 'SPAN' &&
                        endElement.className && (endElement.className.indexOf('e-rte-cursor-marker') !== -1)
                    ) {
                        nextSiblingBlockNode = nextSiblingBlockNode.nextSibling;
                        break;
                    }
                    nextSiblingBlockNode = nextSiblingBlockNode.nextSibling;
                }
            }
        }
        if (!previousBlockNode || !nextSiblingBlockNode) {
            return;
        }
        const doc: Document = this.parent.editableElement ? this.parent.editableElement.ownerDocument : document;
        const nodeRange: Range = doc.createRange();
        nodeRange.setStartBefore(previousBlockNode);
        nodeRange.setEndAfter(nextSiblingBlockNode);
        this.parent.nodeSelection.setRange(this.parent.currentDocument, nodeRange);
    }
    /*
     * Wraps selected table cell content in a <div> for code block operations, adjusting blockNodes array.
     */
    private wrapTableElementToList(blockNodes: Node[]): void {
        const tableNodes: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('table td.e-multi-cells-select, table th.e-multi-cells-select');
        for (let i: number = 0; i < tableNodes.length; i++) {
            const cell: Element = tableNodes[i as number];
            const wrapperDiv: Element = document.createElement('div');
            while (cell.childNodes.length > 0) {
                wrapperDiv.appendChild(cell.childNodes[0]);
            }
            cell.appendChild(wrapperDiv);
            blockNodes.push(wrapperDiv);
        }
    }
    private processNodeForBlockNodes(node: Node, blockNodes: Node[]): void {
        const blockNode: Node = this.parent.domNode.getImmediateBlockNode(node);
        if (blockNode && blockNode !== this.parent.editableElement && blockNode.nodeName !== 'TD' && blockNode.nodeName !== 'TH' && blockNode.nodeName !== 'UL' && blockNode.nodeName !== 'OL' && blockNode.nodeName !== 'BLOCKQUOTE') {
            if (blockNodes.indexOf(blockNode) === -1) {
                blockNodes.push(blockNode);
            }
        } else {
            let startNode: Node = node;
            let endNode: Node = node;
            let prevNode: Node = node.previousSibling;
            while (prevNode && prevNode.nodeName !== 'BR' && !this.parent.domNode.isBlockNode(prevNode as Element)) {
                startNode = prevNode;
                prevNode = prevNode.previousSibling;
            }
            let nextNode: Node = node.nextSibling;
            while (nextNode && nextNode.nodeName !== 'BR' && !this.parent.domNode.isBlockNode(nextNode as Element)) {
                endNode = nextNode;
                nextNode = nextNode.nextSibling;
            }
            const wrapper: Node = this.parent.editableElement.ownerDocument.createElement('div');
            let currentNode: Node = startNode;
            const nodesToWrap: Node[] = [];
            while (currentNode) {
                nodesToWrap.push(currentNode);
                if (currentNode === endNode) {
                    break;
                }
                currentNode = currentNode.nextSibling;
            }
            for (const nodeToWrap of nodesToWrap) {
                wrapper.appendChild(nodeToWrap.cloneNode(true));
            }
            if (startNode.parentNode) {
                startNode.parentNode.insertBefore(wrapper, startNode);
                for (const nodeToWrap of nodesToWrap) {
                    if (nodeToWrap.parentNode) {
                        nodeToWrap.parentNode.removeChild(nodeToWrap);
                    }
                }
                blockNodes.push(wrapper);
            }
        }
    }
    /* Processes code block creation/modification for the selected block nodes
    * Handles code block formatting with the specified language settings
    */
    private processCodeBlockAction(range: Range, blockNodes: Node[], items?: ICodeBlockItem): void {
        if (blockNodes.length === 0) {
            return;
        }
        this.formatCodeBlock(range, blockNodes, items);
    }
    // Converts selected block nodes into a formatted code block with syntax highlighting
    private formatCodeBlock(range: Range, blockNodes: Node[], items: ICodeBlockItem): void {
        const fragment: DocumentFragment = this.parent.editableElement.ownerDocument.createDocumentFragment();
        const pre: HTMLElement = createElement('pre');
        pre.setAttribute('data-language', items.label);
        pre.setAttribute('spellcheck', 'false');
        const code: HTMLElement = createElement('code');
        code.className = `language-${items.language.toLowerCase().replace(/\s+/g, '')}`;
        blockNodes.forEach((node: Node, index: number) => {
            this.processNode(node, code);
            if (index < blockNodes.length - 1) {
                code.appendChild(createElement('br'));
            }
        });
        pre.appendChild(code);
        fragment.appendChild(pre);
        const firstNode: Node = blockNodes[0];
        const parentNode: HTMLElement = firstNode.parentElement;
        this.insertFragmentAtNode(fragment, firstNode, parentNode);
        this.removeNodes(blockNodes as HTMLElement[]);
        this.restoreCursorFromMarkers();
        pre.normalize();
        this.disableToolbarItems();
    }
    private disableToolbarItems(): void {
        this.parent.observer.notify(EVENTS.CODEBLOCK_DISABLETOOLBAR, {});
    }
    // Inserts a document fragment at the appropriate position, handling list items specially
    private insertFragmentAtNode(fragment: DocumentFragment, firstNode: Node, parentNode: Node): void {
        let liParent: HTMLLIElement | null = null;
        let currentNode: Node | null = firstNode;
        while (currentNode && currentNode !== this.parent.editableElement) {
            if (currentNode.nodeName === 'LI') {
                liParent = currentNode as HTMLLIElement;
                break;
            }
            currentNode = currentNode.parentNode;
        }
        if (liParent) {
            const li: HTMLElement = createElement('li');
            li.appendChild(fragment);
            liParent.parentNode.insertBefore(li, liParent);
            if (liParent.textContent.trim() === '') {
                liParent.remove();
            }
        } else {
            parentNode.insertBefore(fragment, firstNode);
        }
    }
    // Removes original nodes after they've been processed into a code block
    private removeNodes(nodes: HTMLElement[]): void {
        for (let i: number = 0; i < nodes.length; i++) {
            const node: HTMLElement = nodes[i as number];
            if (node.nodeName !== '#text' && (node as HTMLElement).closest('li')) {
                const li: HTMLElement = (node as HTMLElement).closest('li');
                li.remove();
            } else if (node.nodeName === 'LI') {
                node.remove();
            } else {
                node.remove();
            }
        }
    }
    // Recursively processes nodes to preserve content structure when creating code blocks
    private processNode(node: Node, code: HTMLElement): void {
        if (node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).classList &&
            (node as HTMLElement).classList.contains('e-rte-cursor-marker')
        ) {
            code.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE) {
            code.appendChild(this.parent.editableElement.ownerDocument.createTextNode(node.textContent));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element: Element = node as Element;
            if (element.tagName.toLowerCase() === 'br') {
                code.appendChild(createElement('br'));
            } else {
                Array.from(element.childNodes).forEach((child: Node) => this.processNode(child, code));
            }
        }
    }

    // Inserts marker elements to track cursor position during DOM modifications
    private setCursorMarkers(range: Range): { startMarker: HTMLElement, endMarker: HTMLElement } {
        const marker: HTMLSpanElement = createElement('span');
        marker.className = 'e-rte-cursor-marker';
        const isPoint: boolean = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        if (isPoint) {
            marker.setAttribute('data-cursor-pos', 'point');
            const tempRange: Range = range.cloneRange();
            tempRange.insertNode(marker);
            return { startMarker: marker, endMarker: null };
        } else {
            const startMarker: HTMLSpanElement = createElement('span');
            startMarker.className = 'e-rte-cursor-marker';
            startMarker.setAttribute('data-cursor-pos', 'start');
            startMarker.style.display = 'inline';
            const endMarker: HTMLSpanElement = createElement('span');
            endMarker.className = 'e-rte-cursor-marker';
            endMarker.setAttribute('data-cursor-pos', 'end');
            endMarker.style.display = 'inline';
            let tempRange: Range = range.cloneRange();
            tempRange.collapse(false); // Collapse to the end
            tempRange.insertNode(endMarker);
            tempRange = range.cloneRange();
            tempRange.collapse(true); // Collapse to the start
            tempRange.insertNode(startMarker);
            return { startMarker, endMarker };
        }
    }

    // Restores cursor position using previously placed marker elements
    private restoreCursorFromMarkers(): void {
        const pointMarker: Element = this.parent.editableElement.querySelector('[data-cursor-pos="point"]');
        if (pointMarker) {
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartBefore(pointMarker);
            newRange.setStartAfter(pointMarker);
            const previousSibling: Node = pointMarker.previousSibling;
            pointMarker.parentNode.removeChild(pointMarker);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
            if (previousSibling) {
                const cursorOffset: {
                    node: Node;
                    offset: number;
                } = this.parent.nodeSelection.findLastTextPosition(previousSibling);
                if (cursorOffset) {
                    this.parent.nodeSelection.setCursorPoint(
                        this.parent.currentDocument,
                        cursorOffset.node as Element,
                        cursorOffset.offset
                    );
                }
            }
        }
        const startMarkerElement: Element = this.parent.editableElement.querySelector('[data-cursor-pos="start"]');
        const endMarkerElement: Element = this.parent.editableElement.querySelector('[data-cursor-pos="end"]');
        if (startMarkerElement && endMarkerElement) {
            const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
            newRange.setStartAfter(startMarkerElement);
            newRange.setEndBefore(endMarkerElement);
            startMarkerElement.parentNode.removeChild(startMarkerElement);
            endMarkerElement.parentNode.removeChild(endMarkerElement);
            this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
        }
    }
    /**
     * Searches for code block elements that are siblings or parents of the current selection
     *
     * This method traverses up the DOM tree from the selection's start container,
     * checking each next sibling to find code block structures. It's used primarily
     * for delete operations to determine if pressing Delete at the end of content
     * should merge with a following code block.
     *
     * @param {Range} range - The current selection range
     * @returns {Object|null} - Object containing current node and its next sibling code block,
     * with properties currentNode (Node) and nextSibling (Node), or null if no code block is found
     * @public
     */
    public findParentOrNextSiblingCodeBlock(range: Range): { currentNode: Node, nextSibling: Node } | null {
        let currentNode: Node = range.startContainer;
        while (currentNode && isNullOrUndefined(this.isValidCodeBlockStructure(currentNode)) &&
            currentNode !== this.parent.editableElement) {
            let nextSibling: Node = currentNode.nextSibling;
            while (nextSibling && nextSibling.nodeName !== 'BR' && this.parent.domNode.isBlockNode(nextSibling as Element)) {
                if (this.isValidCodeBlockStructure(nextSibling)) {
                    return {
                        currentNode: currentNode,
                        nextSibling: nextSibling
                    };
                }
                if (this.parent.domNode.isBlockNode(nextSibling as Element)) {
                    break;
                }
                nextSibling = nextSibling.nextSibling;
            }
            currentNode = currentNode.parentElement;
            if (currentNode === this.parent.editableElement) {
                break;
            }
        }
        return null;
    }
    /**
     * Searches for code block elements that are siblings or parents before the current selection
     *
     * This method traverses up the DOM tree from the selection's start container,
     * checking each previous sibling to find code block structures. It's used primarily
     * for backspace operations to determine if pressing Backspace at the beginning of content
     * should merge with a preceding code block.
     *
     * @param {Range} range - The current selection range
     * @returns {Object|null} - Object containing current node and its previous sibling code block,
     * with properties currentNode (Node) and previousSibling (Node), or null if no code block is found
     * @public
     */
    public findParentOrPreviousSiblingCodeBlock(range: Range): { currentNode: Node, previousSibling: Node } | null {
        let currentNode: Node = range.startContainer;
        while (currentNode && isNullOrUndefined(this.isValidCodeBlockStructure(currentNode)) &&
            currentNode !== this.parent.editableElement) {
            let previousSibling: Node = currentNode.previousSibling;
            while (previousSibling && previousSibling.nodeName !== 'BR' && this.parent.domNode.isBlockNode(previousSibling as Element)) {
                const findPreviousElementLastNode: { node: Node; offset: number } | null = this.parent.nodeSelection.
                    findLastTextPosition(previousSibling as Node);
                if (findPreviousElementLastNode && findPreviousElementLastNode.node &&
                    this.isValidCodeBlockStructure(findPreviousElementLastNode.node)) {
                    return {
                        currentNode: currentNode,
                        previousSibling: this.isValidCodeBlockStructure(findPreviousElementLastNode.node)
                    };
                }
                if (this.isValidCodeBlockStructure(previousSibling)) {
                    return {
                        currentNode: currentNode,
                        previousSibling: previousSibling
                    };
                }
                if (this.parent.domNode.isBlockNode(previousSibling as Element)) {
                    break;
                }
                previousSibling = previousSibling.previousSibling;
            }
            currentNode = currentNode.parentElement;
            if (currentNode === this.parent.editableElement) {
                break;
            }
        }
        return null;
    }
    /* Analyzes the current selection position relative to code blocks
    * Returns information about block nodes, cursor position, and adjacent code blocks
    * Used to determine appropriate actions for code block operations
    */
    public getCodeBlockPosition(range: Range): CodeBlockPosition {
        const immediateBlockNode: Node = this.parent.domNode.getImmediateBlockNode(range.startContainer);
        const blockNode: Node = immediateBlockNode !== this.parent.editableElement ? immediateBlockNode : range.startContainer;
        const lastPosition: { node: Node; offset: number } | null =
            this.parent.nodeSelection.findLastTextPosition(blockNode);
        const cursorAtLastPosition: boolean = lastPosition &&
            lastPosition.node === range.startContainer &&
            lastPosition.offset === range.startOffset;
        const nextSiblingCodeBlockElement: { currentNode: Node, nextSibling: Node } | null =
            this.findParentOrNextSiblingCodeBlock(range);
        return {
            blockNode,
            cursorAtLastPosition,
            nextSiblingCodeBlockElement
        };
    }
    /**
     * Determines if a keyboard action should be disallowed within a code block
     *
     * This method checks if the current selection is within a code block and if the
     * keyboard action being performed is not in the list of allowed actions for code blocks.
     * It helps maintain proper code block behavior by preventing formatting operations
     * that would break code block structure.
     *
     * @param {KeyboardEvent} e - The keyboard event being processed
     * @param {Range} range - The current selection range
     * @returns {boolean} - True if the action should be disallowed, false otherwise
     * @public
     */
    public isActionDisallowedInCodeBlock(e: KeyboardEvent, range: Range): boolean {
        const codeBlockStructure: boolean = !isNullOrUndefined(this.isValidCodeBlockStructure(range.startContainer)) ||
            !isNullOrUndefined(this.isValidCodeBlockStructure(range.endContainer));
        if (codeBlockStructure) {
            const allowedActions: string[] = [
                'paste', 'cut', 'copy', 'decrease-fontsize', 'increase-fontsize', 'maximize', 'minimize', 'tab', 'undo', 'redo', 'backspace', 'enter', 'delete', 'code-block', 'space', 'full-screen', 'escape', 'down',
                'up', 'home', 'end', 'toolbar-focus', 'indents', 'outdents', 'ordered-list', 'unordered-list', 'shift-tab'
            ];
            const currentAction: string = (e as KeyboardEventArgs).action;
            if (!isNullOrUndefined(currentAction) && allowedActions.indexOf(currentAction) === -1) {
                return true;
            }
        }
        return false;
    }
    private codeBlockTabAction(e: IHtmlItem): void {
        const subCommandArgs: IHtmlSubCommands = {
            subCommand: 'TabAction',
            callBack: e.callBack
        };
        this.handleCodeBlockIndentation(subCommandArgs);
    }
    private codeBlockShiftTabAction(e: IHtmlItem): void {
        const subCommandArgs: IHtmlSubCommands = {
            subCommand: 'ShiftTabAction',
            callBack: e.callBack
        };
        this.handleCodeBlockIndentation(subCommandArgs);
    }
    /*
     * Handles indentation of code blocks when the user performs indentation actions
     * inside a code block element.
    */
    private handleCodeBlockIndentation(e: IHtmlSubCommands): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const isOutdent: boolean = e.subCommand === 'Outdent' || e.subCommand === 'ShiftTabAction';
        const codeBlockElement: HTMLElement = this.isValidCodeBlockStructure(range.startContainer);
        const allSelectedNode: Node[] = this.parent.nodeSelection.getSelectedNodes(this.parent.editableElement.ownerDocument);
        if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
            if (isOutdent) {
                if (range.startOffset > 0 && range.startContainer.textContent[range.startOffset - 1] === '\t') {
                    const content: string = range.startContainer.textContent;
                    const startContent: string = content.substring(0, range.startOffset - 1);
                    const endContent: string = content.substring(range.startOffset);
                    const startNode: Text = this.parent.currentDocument.createTextNode(startContent);
                    const endNode: Text = this.parent.currentDocument.createTextNode(endContent);
                    const parentNode: HTMLElement = range.startContainer.parentElement;
                    parentNode.replaceChild(endNode, range.startContainer);
                    parentNode.insertBefore(startNode, endNode);
                    const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
                    newRange.setStart(endNode, 0);
                    newRange.setEnd(endNode, 0);
                    this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
                }
            } else {
                const tabChar: string = '\t';
                const textNode: Text = this.parent.currentDocument.createTextNode(tabChar);
                range.insertNode(textNode);
                const newRange: Range = this.parent.editableElement.ownerDocument.createRange();
                newRange.setStartAfter(textNode);
                newRange.setEndAfter(textNode);
                this.parent.nodeSelection.setRange(this.parent.currentDocument, newRange);
            }
        }
        else {
            if (allSelectedNode && allSelectedNode.length > 0) {
                this.setCursorMarkers(range);
                for (let i: number = 0; i < allSelectedNode.length; i++) {
                    const node: Node = allSelectedNode[i as number];
                    if (node.nodeType === 3) {
                        const content: string = node.textContent || '';
                        if (isOutdent) {
                            if (content.startsWith('\t')) {
                                node.textContent = content.substring(1);
                            }
                        } else {
                            node.textContent = '\t' + content;
                        }
                    }
                }
                this.restoreCursorFromMarkers();
            }
        }
        codeBlockElement.normalize();
        if (e.subCommand !== 'TabAction' && e.subCommand !== 'ShiftTabAction'){
            if (e.callBack) {
                e.callBack({
                    requestType: e.subCommand,
                    editorMode: 'HTML',
                    event: e.event,
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: codeBlockElement
                });
            }
        }
    }
}
