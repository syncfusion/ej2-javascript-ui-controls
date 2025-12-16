import * as EVENTS from '../../common/constant';
import { IEditorModel } from '../../common';
import { ClipboardWriteEventArgs } from '../../common/interface';
import { createElement, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as CONSTANT from './../base/constant';

/**
 * ClipBoardCleanup internal component
 *
 * @hidden
 */
export class ClipBoardCleanupAction {
    private parent: IEditorModel;
    private editableElement: Element;
    private isTableSelection: boolean;

    /**
     * Constructor for creating the component
     *
     * @param {IEditorModel} parent - specifies the parent element
     * @hidden
     * @private
     */
    public constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
    }

    /* Attaches event listeners for ClopBoard Cleanup operations */
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    /* Attaches event listeners for ClopBoard Cleanup operations */
    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    /**
     * Handles the clipboard data processing for cut/copy operations
     *
     * @param {Range} range - The current selection range in the document
     * @param {Element} editableElement - The editable container element
     * @param {string} operation - The clipboard operation type ('cut', 'copy')
     * @returns {ClipboardWriteEventArgs} - An object containing HTML and plain text content for clipboard operations
     */
    public handleClipboardProcessing(range: Range, editableElement: Element, operation: string): ClipboardWriteEventArgs {
        this.editableElement = editableElement;
        // Extract HTML and plain text from the selected range
        let { htmlContent, plainTextContent } = this.extractClipboardContentFromSelection(range);
        const isFullBlockSelection: boolean = this.isSelectionCoveringSingleBlock(range, htmlContent);
        const isFullLISelected: boolean = this.isFullLISelected(range, htmlContent);
        // Wrap list items if selection is within a list
        if (this.parent.domNode.isList(range.commonAncestorContainer as Element)) {
            const formattedClipboardData: ClipboardWriteEventArgs =
                this.wrapListStructureForClipboard(range, htmlContent, plainTextContent);
            htmlContent = formattedClipboardData.htmlContent;
            plainTextContent = formattedClipboardData.plainTextContent;
        } else if (isFullLISelected) {
            // when whole li is selected
            let closestList: HTMLElement = range.commonAncestorContainer as HTMLElement;
            // If it's a text node, move to its parent
            if (closestList.nodeName === '#text') {
                closestList = closestList.parentElement;
            }
            // If it's an LI, use it; otherwise, find the closest LI
            const liElement: HTMLElement = closestList.nodeName === 'LI' ? closestList : closestList.closest('li');
            // Get the parent list (UL or OL)
            const closestListParent: HTMLElement = liElement.parentElement;
            const listContainer: HTMLElement = createElement(closestListParent.tagName);
            listContainer.appendChild(createElement('li'));
            listContainer.firstElementChild.innerHTML = htmlContent;
            htmlContent = listContainer.outerHTML;
            const temporaryWrapper: HTMLElement = createElement('div');
            temporaryWrapper.innerHTML = htmlContent;
            plainTextContent = this.extractTextFromHtmlNode(temporaryWrapper);
        }
        // Handle cut operation
        if (operation === 'cut') {
            //check if table is in selection
            const tables: HTMLTableElement[] = this.collectTablesFromSelection(range);
            if (tables.length > 1 || (tables.length === 1 && !this.isSelectionInsideNestedTable(range))) {
                //handle table cut behavior
                this.isTableSelection = true;
                this.clearSelectedTableContent(range);
            } else {
                //check if a whole block level element is selected
                this.isTableSelection = false;
                const isSelectionSameBlock: boolean =
                    (this.parent.domNode.getImmediateBlockNode(range.startContainer) ===
                    this.parent.domNode.getImmediateBlockNode(range.endContainer));
                //check if media element alone is selected
                const containsMediaContent: boolean = this.containsMediaElement(range);
                // Normalize inline elements at the boundaries
                this.cleanEmptyInlineBoundaries(range);
                //to get the nested list range end container
                let nestedListEndContainer: HTMLElement;
                let rootParentLIElement: HTMLElement;
                if (range.commonAncestorContainer.nodeName === 'LI') {
                    rootParentLIElement = (range.commonAncestorContainer as HTMLElement);
                    nestedListEndContainer = this.parent.domNode.getImmediateBlockNode(range.endContainer) as HTMLElement;
                }
                range.deleteContents();
                const sharedContainer: HTMLElement = range.commonAncestorContainer as HTMLElement;
                if (containsMediaContent) {
                    this.adjustCursorAfterMediaCut(range);
                } else if (isFullBlockSelection) {
                    this.fullBlockElementCursorPosition(sharedContainer as HTMLElement);
                } else if (range.collapsed && sharedContainer.nodeName !== '#text' && !isSelectionSameBlock &&
                    !isNOU(range.startContainer.childNodes[range.startOffset])) {
                    this.restructureContentPostCut(range, rootParentLIElement, nestedListEndContainer);
                }
            }
        }
        return { htmlContent, plainTextContent, operation };
    }

    /* Sets the cursor position after a block-level element is cut*/
    private fullBlockElementCursorPosition(blockContainer: HTMLElement): void {
        const resolvedBlockElement: HTMLElement = this.parent.domNode.getImmediateBlockNode(blockContainer) as HTMLElement;
        const brElement: HTMLElement = document.createElement('br');
        if (resolvedBlockElement.childElementCount === 2) {
            const focusElement: HTMLElement = this.getFirstBlockElement(resolvedBlockElement);
            focusElement.appendChild(brElement);
            resolvedBlockElement.innerHTML = resolvedBlockElement.firstElementChild.outerHTML;
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, resolvedBlockElement.firstElementChild, 0);
        } else {
            resolvedBlockElement.innerHTML = '<br>';
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, resolvedBlockElement, 0);
        }
    }

    /*Adjusts the cursor position after a media element is cut from the document*/
    private adjustCursorAfterMediaCut(selectionRange: Range): void {
        const startNode: HTMLElement = selectionRange.startContainer as HTMLElement;
        const isVideoWrapperSpan: boolean = startNode.nodeName === 'SPAN' && startNode.className === 'e-video-wrap';
        if (isVideoWrapperSpan) {
            const mediaContainer: HTMLElement = startNode as HTMLElement;
            const contentContainer: HTMLElement =
                this.parent.domNode.getImmediateBlockNode(mediaContainer) as HTMLElement;
            let mediaIndex: number;
            for (let index: number = 0; index < contentContainer.childNodes.length; index++) {
                if (contentContainer.childNodes[index as number] === mediaContainer) {
                    mediaIndex = index;
                    break;
                }
            }
            if (mediaIndex === 0) {
                this.setCursorPosition(contentContainer);
            } else {
                this.setCursorPosition(contentContainer.childNodes[mediaIndex - 1]);
            }
            contentContainer.removeChild(mediaContainer);
        } else {
            const brElement: HTMLElement = document.createElement('br');
            if (!isNOU(startNode.childNodes[selectionRange.startOffset]) &&
                startNode.childNodes[selectionRange.startOffset].textContent.trim() === '' &&
                this.isContentContainerEmpty(startNode as HTMLElement)) {
                startNode.replaceChild(
                    brElement, startNode.childNodes[selectionRange.startOffset]);
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument, (startNode as HTMLElement), startNode.childElementCount);
            } else if (this.isContentContainerEmpty(startNode)) {
                startNode.appendChild(brElement);
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument, (startNode as HTMLElement), startNode.childElementCount);
            } else {
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument, (startNode as HTMLElement), selectionRange.startOffset);
            }
        }
    }

    /* Determines whether the li element is fully selected. */
    private isFullLISelected(range: Range, htmlContent: string): boolean {
        let selectedElement: HTMLElement;
        if ((range.commonAncestorContainer as Element).nodeName === '#text') {
            selectedElement = (range.commonAncestorContainer as HTMLElement).parentElement;
        } else {
            selectedElement = range.commonAncestorContainer as HTMLElement;
        }
        if ((selectedElement.nodeName === 'LI' || selectedElement.closest('li'))
            && this.isSelectionCoveringSingleBlock(range, htmlContent)) {
            return true;
        }
        return false;
    }

    /* Wraps list elements (UL/OL) with their parent container if the selection is inside <li> */
    private wrapListStructureForClipboard(selectionRange: Range, htmlContent: string, plainTextContent: string): ClipboardWriteEventArgs {
        const listContainerTag: string = selectionRange.commonAncestorContainer.nodeName.toLowerCase();
        const listContainer: HTMLElement = createElement(listContainerTag);
        listContainer.innerHTML = htmlContent;
        const listItems: HTMLLIElement[] = Array.from(listContainer.querySelectorAll('li'));
        if (listItems.length > 1) {
            htmlContent = listContainer.outerHTML;
        }
        const temporaryWrapper: HTMLElement = createElement('div');
        temporaryWrapper.innerHTML = htmlContent;
        plainTextContent = this.extractTextFromHtmlNode(temporaryWrapper);
        return { htmlContent, plainTextContent };
    }

    /* Extracts both HTML and plain text content from the current selection range. */
    private extractClipboardContentFromSelection(range: Range): ClipboardWriteEventArgs {
        let htmlContent : string = '';
        let plainTextContent : string = '';
        htmlContent = this.getHTMLFromSelectionRange(range);
        const temporaryContainer: HTMLElement = createElement('div');
        temporaryContainer.innerHTML = htmlContent;
        htmlContent = this.normalizeInlineElementWrapping(range, htmlContent);
        // If fails this operation will be handled in wrapListStructureForClipboard method
        if (!(this.parent.domNode.isList(range.commonAncestorContainer as Element) ||
            this.isFullLISelected(range, htmlContent))) {
            plainTextContent = this.extractTextFromHtmlNode(temporaryContainer);
        }
        return { htmlContent, plainTextContent };
    }

    /* Extracts HTML content and ensures inline elements are properly wrapped if present in the selection.*/
    private normalizeInlineElementWrapping(selectionRange: Range, htmlContent: string): string {
        const startNode: Node = selectionRange.startContainer;
        // Check if the selection starts with non-empty text
        if (startNode.textContent.trim() !== '') {
            const ancestorNode: Node = selectionRange.commonAncestorContainer;
            const isTextNode: boolean = ancestorNode.nodeName === '#text';
            const isNonBlockNode: boolean = !this.parent.domNode.isBlockNode(
                (isTextNode ? ancestorNode.parentNode : ancestorNode) as HTMLElement);
            if (isNonBlockNode) {
                htmlContent = this.getWrappedAroundInlineElement(
                    (isTextNode ? ancestorNode.parentNode : ancestorNode) as HTMLElement, htmlContent);
            }
        }
        // Special handling for video wrapper elements
        const isVideoWrapper: boolean = startNode.nodeName === 'SPAN' &&
            (startNode as HTMLElement).classList.length > 0 && (startNode as HTMLElement).classList.contains('e-video-wrap');
        if (isVideoWrapper) {
            htmlContent = (startNode as HTMLElement).outerHTML;
        }
        return htmlContent;
    }

    /* Extracts HTML content from the current selection range by wrapping it in a temporary container */
    private getHTMLFromSelectionRange(selectionRange: Range): string {
        const clonedSelection: DocumentFragment = selectionRange.cloneContents();
        const temporaryContainer: HTMLElement = createElement('div');
        temporaryContainer.appendChild(clonedSelection);
        return temporaryContainer.innerHTML;
    }

    /* Returns the outer HTML of the nearest inline-level ancestor after replacing its inner content with the provided HTML content. */
    private getWrappedAroundInlineElement(inlineAncestor: HTMLElement, contentToWrap: string): string {
        const contentContainer: HTMLElement = createElement('div');
        contentContainer.innerHTML = contentToWrap;
        //to retrieve only the wrapper inline element without any inner html in it
        do {
            const clonedInlineAncestor: HTMLElement = inlineAncestor.cloneNode(true) as HTMLElement;
            //swapping the existing html and cloned inline wrapper
            clonedInlineAncestor.innerHTML = contentContainer.innerHTML;
            contentContainer.innerHTML = clonedInlineAncestor.outerHTML;
            inlineAncestor = inlineAncestor.parentElement;
        } while (!isNOU(inlineAncestor) && !this.parent.domNode.isBlockNode(inlineAncestor as HTMLElement));
        return contentContainer.innerHTML;
    }

    /* Checks if the current selection range contains a media element (IMG, VIDEO, AUDIO). */
    private containsMediaElement(range: Range): boolean {
        const potentialMediaNode: HTMLElement | null = !isNOU(range.commonAncestorContainer.childNodes[range.startOffset]) ?
            (range.commonAncestorContainer.childNodes[range.startOffset]) as HTMLElement : null;
        return (!isNOU(potentialMediaNode) &&
            ((potentialMediaNode.nodeName === 'IMG') ||
            (potentialMediaNode.nodeName === 'VIDEO') || (potentialMediaNode.nodeName === 'AUDIO')));
    }

    /* Retrieves all unique table elements within the current selection range. */
    private collectTablesFromSelection(selectionRange: Range): HTMLTableElement[] {
        const identifiedTables: HTMLTableElement[] = [];
        // Get the parent table for startContainer
        const startTable: HTMLTableElement =
            this.locateOutermostTableAncestor(selectionRange.startContainer, selectionRange);
        if (!isNOU(startTable) && identifiedTables.indexOf(startTable) < 0) {
            identifiedTables.push(startTable);
        }
        // Get the parent table for endContainer
        const endTable: HTMLTableElement = this.locateOutermostTableAncestor(selectionRange.endContainer, selectionRange);
        if (!isNOU(endTable) && identifiedTables.indexOf(endTable) < 0) {
            identifiedTables.push(endTable);
        }
        return identifiedTables;
    }

    /* Locates the outermost parent table element that contains the given node. */
    private locateOutermostTableAncestor(currentNode: Node, selectionRange: Range): HTMLTableElement {
        let traversalNode: Node | null = currentNode;
        let detectedTable: HTMLTableElement = null;
        if (traversalNode === this.editableElement) {
            const offsetIndex: number = selectionRange.startContainer === traversalNode ?
                selectionRange.startOffset : selectionRange.endOffset;
            const candidateElement: HTMLElement = selectionRange.commonAncestorContainer.childNodes[offsetIndex as number] as HTMLElement;
            return !isNOU(candidateElement) ? candidateElement.nodeName === 'TABLE' ? candidateElement as HTMLTableElement : null : null;
        } else {
            traversalNode = this.parent.domNode.getImmediateBlockNode(traversalNode);
            while (!isNOU((traversalNode as HTMLElement).closest('table')) &&
                this.editableElement.contains((traversalNode as HTMLElement).closest('table'))) {
                traversalNode = detectedTable = (traversalNode as HTMLElement).closest('table') as HTMLTableElement;
                // to get the root parent element of table
                traversalNode = traversalNode.parentElement;
            }
            return detectedTable;
        }
    }

    /* Determines whether the current selection is within a nested table structure. */
    private isSelectionInsideNestedTable(selectionRange: Range): boolean {
        if (selectionRange.startContainer !== this.editableElement && selectionRange.endContainer !== this.editableElement) {
            const startContainer: HTMLElement = selectionRange.startContainer.nodeName === '#text' ?
                selectionRange.startContainer.parentElement : selectionRange.startContainer as HTMLElement;
            const endContainer: HTMLElement = selectionRange.endContainer.nodeName === '#text' ?
                selectionRange.endContainer.parentElement : selectionRange.endContainer as HTMLElement;
            return startContainer.closest('table') === endContainer.closest('table');
        }
        return false;
    }

    /* Clears selected content within tables and manages cursor positioning after cut operation. */
    private clearSelectedTableContent(selectionRange: Range): void {
        const activeSelection: Selection = window.getSelection();
        const tablesToClean: HTMLTableElement[] = [];
        const selectedNodes: Node[] = Array.from(selectionRange.commonAncestorContainer.childNodes).filter((childNode: Node) => {
            if (childNode.nodeName === 'TABLE') {
                tablesToClean.push(childNode as HTMLTableElement);
            }
            return selectionRange.intersectsNode(childNode);
        });
        // Remove intermediate nodes
        selectedNodes.forEach((node: Node) => {
            this.processSelectedContentWithinRange(node, selectionRange, tablesToClean);
        });
        // Clean up empty tables
        this.removeEmptyTables(tablesToClean);
        // Position cursor
        selectionRange.collapse(true);
        activeSelection.removeAllRanges();
        activeSelection.addRange(selectionRange);
        this.adjustCursorPostTableCut(selectionRange);
    }

    /* Removes intermediateNodes that are fully selected within the given range. */
    private removeSelectedNodes(
        inspectedElement: HTMLElement,
        selectionRange: Range): boolean {
        if (!isNOU(inspectedElement) && selectionRange.intersectsNode(inspectedElement)) {
            const isFullySelected: boolean = this.isFullHTMLElementSelected(inspectedElement, selectionRange);
            if (isFullySelected) {
                // Entire element is selected
                inspectedElement.remove();
                return true;
            }
        }
        return false;
    }

    /*  Recursively filters and processes selected content within a range, including table cells and block-level elements. */
    private processSelectedContentWithinRange(
        contentFragment: Node,
        selectionRange: Range,
        tablesToClean: HTMLTableElement[]): void {
        if (!isNOU(contentFragment) && selectionRange.intersectsNode(contentFragment)) {
            let isElementRemoved: boolean = false;
            if (this.parent.domNode.isBlockNode(contentFragment as HTMLElement) &&
                ['TD', 'TH'].indexOf(contentFragment.nodeName) < 0) {
                if (contentFragment.nodeName === 'TR' && isNOU((contentFragment as HTMLElement).querySelector('th'))) {
                    isElementRemoved = this.removeSelectedNodes(contentFragment as HTMLElement, selectionRange);
                } else if (contentFragment.nodeName !== 'TR') {
                    isElementRemoved = this.removeSelectedNodes(contentFragment as HTMLElement, selectionRange);
                }
            }
            if (!isElementRemoved) {
                if (contentFragment.nodeName === 'TABLE') {
                    tablesToClean.push(contentFragment as HTMLTableElement);
                    const parentTable: HTMLTableElement = contentFragment as HTMLTableElement;
                    const selectedRows: ChildNode[] = Array.from(parentTable.querySelectorAll('tr')).filter((rowCandidate: Node) => {
                        return rowCandidate.nodeName === 'TR' && selectionRange.intersectsNode(rowCandidate) &&
                        (rowCandidate as HTMLElement).closest('table') === parentTable;
                    });
                    selectedRows.forEach((tableRow: HTMLTableRowElement) => {
                        this.processSelectedContentWithinRange(tableRow, selectionRange, tablesToClean);
                    });
                } else if (contentFragment.nodeName === 'TR') {
                    const associatedTable: HTMLTableElement = (contentFragment as HTMLElement).closest('table');
                    const selectedCells: ChildNode[] = Array.from(contentFragment.childNodes).filter((cellCandidate: Node) => {
                        return cellCandidate.nodeName !== '#text' && ['TD', 'TH'].indexOf(cellCandidate.nodeName) >= 0 &&
                            selectionRange.intersectsNode(cellCandidate) &&
                            (cellCandidate as HTMLElement).closest('table') === associatedTable;
                    });
                    selectedCells.forEach((tableCell: HTMLTableCellElement) => {
                        this.processSelectedContentWithinRange(tableCell, selectionRange, tablesToClean);
                    });
                } else if (this.parent.domNode.isBlockNode(contentFragment as HTMLElement) &&
                    ['TD', 'TH'].indexOf(contentFragment.nodeName) >= 0 &&
                    this.isFullHTMLElementSelected(contentFragment as HTMLElement, selectionRange)) {
                    (contentFragment as HTMLElement).innerHTML = '';
                } else if ((this.parent.domNode.isBlockNode(contentFragment as HTMLElement) &&
                    contentFragment.nodeName !== 'TABLE' && this.hasContainsAnyBlockNode(contentFragment as HTMLElement)) ||
                    (['TD', 'TH'].indexOf(contentFragment.nodeName) >= 0)) {
                    const selectedChildNodes: ChildNode[] = Array.from(contentFragment.childNodes);
                    selectedChildNodes.forEach((nestedNode: Node) => {
                        if (nestedNode.nodeName === 'TABLE') {
                            tablesToClean.push(nestedNode as HTMLTableElement);
                            const parentTable: HTMLTableElement = nestedNode as HTMLTableElement;
                            const selectedRows: ChildNode[] =
                                Array.from(parentTable.querySelectorAll('tr')).filter((rowCandidate: Node) => {
                                    return rowCandidate.nodeName === 'TR' && selectionRange.intersectsNode(rowCandidate) &&
                                        (rowCandidate as HTMLElement).closest('table') === nestedNode;
                                });
                            selectedRows.forEach((tableRow: HTMLTableRowElement) => {
                                this.processSelectedContentWithinRange(tableRow, selectionRange, tablesToClean);
                            });
                        } else {
                            this.processSelectedContentWithinRange(nestedNode, selectionRange, tablesToClean);
                        }
                    });
                } else if (contentFragment.nodeType === Node.ELEMENT_NODE &&
                    isNOU((contentFragment as HTMLElement).closest('table')) &&
                    contentFragment !== this.parent.domNode.getImmediateBlockNode(selectionRange.startContainer) &&
                    contentFragment !== this.parent.domNode.getImmediateBlockNode(selectionRange.endContainer)) {
                    const partialRange: Range = selectionRange.cloneRange();
                    partialRange.setEnd(contentFragment, contentFragment.childNodes.length);
                    partialRange.deleteContents();
                } else if (contentFragment.nodeType === Node.ELEMENT_NODE) {
                    this.traverseElementTextNodes(contentFragment as Element, selectionRange);
                } else {
                    this.clearIntersectingContent(contentFragment, selectionRange);
                }
            }
        }
    }

    /* To retrive the text nodes in element and remove using the help of clearIntersectingContent method */
    private traverseElementTextNodes(elementNode: Element, selectionRange: Range): void {
        // Traverse inline text nodes within the fragment
        const intersectingTextNodes: Node[] = [];
        const textNodeIterator: NodeIterator = document.createNodeIterator(
            elementNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (textCandidate: Node) => {
                    // Filter out empty or whitespace-only text nodes
                    return (selectionRange.intersectsNode(textCandidate) && textCandidate.textContent.trim()) ?
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );
        let currentTextNode: Node = textNodeIterator.nextNode();
        while (currentTextNode) {
            intersectingTextNodes.push(currentTextNode);
            currentTextNode = textNodeIterator.nextNode() as Text | null;
        }
        intersectingTextNodes.forEach((textNode: Node) => {
            this.clearIntersectingContent(textNode, selectionRange);
        });
    }

    /* To check and remove the element if full element is selected */
    private isFullHTMLElementSelected(blockElement: HTMLElement, selectionRange: Range): boolean {
        const elementRange: Range = document.createRange();
        elementRange.selectNode(blockElement);
        return selectionRange.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
            selectionRange.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
    }

    /* To check if any block level elements constains inside */
    private hasContainsAnyBlockNode(blockElement: HTMLElement): boolean {
        return !isNOU(blockElement) && this.parent.domNode.isBlockNode(blockElement) &&
            CONSTANT.BLOCK_TAGS.some((tag: string) => blockElement.querySelector(tag) !== null);
    }

    /* Iterates through table list and removes any table that is empty. */
    private removeEmptyTables(tableElements: HTMLTableElement[]): void {
        for (let tableIndex: number = tableElements.length - 1; tableIndex >= 0; tableIndex--) {
            this.removeEmptyTableElement(tableElements[tableIndex as number]);
        }
    }

    /* Sets the cursor position appropriately after a table cut operation within an editable container. */
    private adjustCursorPostTableCut(selectionRange: Range): void {
        let cursorElement: HTMLElement = selectionRange.startContainer as HTMLElement;
        if (this.isContentContainerEmpty(this.editableElement as HTMLElement) &&
            this.editableElement.childElementCount === 0) {
            if (this.editableElement.innerHTML === '') {
                this.editableElement.innerHTML = '<p><br></p>';
            }
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, this.editableElement.firstChild as HTMLElement, 0);
        } else if (cursorElement.nodeName === '#text' &&
            cursorElement.textContent === '' && this.isContentContainerEmpty(cursorElement.parentElement)) {
            cursorElement = this.parent.domNode.getImmediateBlockNode(cursorElement) as HTMLElement;
            cursorElement.appendChild(document.createElement('br'));
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, cursorElement, cursorElement.childElementCount);
        } else if (cursorElement.nodeName === '#text' &&
            cursorElement.textContent.length > 0) {
            this.setCursorPosition(cursorElement);
        } else if (this.parent.domNode.isBlockNode(cursorElement)) {
            if (cursorElement.nodeName === 'TABLE') {
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, cursorElement, 0);
            } else {
                this.setCursorPosition(cursorElement);
            }
        } else {
            cursorElement = selectionRange.commonAncestorContainer.childNodes[selectionRange.startOffset] as HTMLElement;
            if (!isNOU(cursorElement)) {
                if (this.isContentContainerEmpty(cursorElement)) {
                    cursorElement.appendChild(document.createElement('br'));
                    this.parent.nodeSelection.setCursorPoint(
                        this.parent.currentDocument, cursorElement, cursorElement.childElementCount);
                } else {
                    this.setCursorPosition(cursorElement);
                }
            }
        }
    }

    /* Removes a table element if it lacks meaningful content. */
    private removeEmptyTableElement(tableElement: HTMLTableElement | HTMLTableRowElement): boolean {
        if (!isNOU(tableElement.parentElement)) {
            const isContentInsignificant: boolean = this.isContentContainerEmpty(tableElement);
            const isElementAttached: boolean = tableElement.parentElement.contains(tableElement);
            if (isContentInsignificant && isElementAttached) {
                tableElement.parentElement.removeChild(tableElement);
                return true;
            }
        }
        return false;
    }

    /* Removes content from a given DOM fragment that intersects with the selection range. */
    private clearIntersectingContent(contentFragment: Node, selectionRange: Range): void {
        if (!isNOU(contentFragment) && selectionRange.intersectsNode(contentFragment)) {
            let updatedTextContent: string;
            // Handle partial text node selection
            if (contentFragment.nodeName === '#text') {
                updatedTextContent = this.extractUnselectedTextContent(contentFragment, selectionRange);
                contentFragment.textContent = updatedTextContent;
            }
            const EndRangeBlockAncestor: HTMLElement =
                    this.parent.domNode.getImmediateBlockNode(selectionRange.endContainer) as HTMLElement;
            const inlineWrapperParent: HTMLElement =
                this.parent.domNode.getImmediateBlockNode(contentFragment) as HTMLElement;
            // Cleanup if the updated text content is empty
            if (updatedTextContent === '' &&
                !this.parent.domNode.isBlockNode(contentFragment.parentElement)) {
                let inlineWrapper: HTMLElement = contentFragment.parentElement;
                while (!this.parent.domNode.isBlockNode(inlineWrapper.parentElement)) {
                    if (inlineWrapper.parentElement.childNodes.length === 1) {
                        inlineWrapper = inlineWrapper.parentElement;
                    } else {
                        break;
                    }
                }
                this.removeEmptyContentContainer(inlineWrapper);
            }
            if (this.parent.domNode.isBlockNode(inlineWrapperParent) && this.isContentContainerEmpty(inlineWrapperParent) &&
                inlineWrapperParent === EndRangeBlockAncestor &&
                this.isTableSelection && ['TD', 'TH'].indexOf(inlineWrapperParent.nodeName) < 0) {
                if ((!this.editableElement.contains(inlineWrapperParent.closest('table'))) ||
                    (this.editableElement.contains(inlineWrapperParent.closest('table')) &&
                    inlineWrapperParent.childElementCount === 0)) {
                    // remove element if it is not inside table selection
                    this.removeDomElement(inlineWrapperParent, inlineWrapperParent.parentElement);
                }
            }
        }
    }

    /* Removes a parent container from the DOM if it is empty and still attached. */
    private removeEmptyContentContainer(containerCandidate: HTMLElement): void {
        if (!isNOU(containerCandidate) && (['TD', 'TH'].indexOf(containerCandidate.nodeName) < 0) &&
            containerCandidate !== this.editableElement) {
            const isContainerEmpty: boolean = this.isContentContainerEmpty(containerCandidate);
            const isContainerAttached: boolean = containerCandidate.parentElement.contains(containerCandidate);
            if (isContainerEmpty && isContainerAttached) {
                containerCandidate.parentElement.removeChild(containerCandidate);
            }
        }
    }

    /* Preserves text outside the selection range in a partially selected text node. */
    private extractUnselectedTextContent(textFragment: Node, range: Range): string {
        const fullText: string = textFragment.textContent;
        let startIndex: number = 0;
        let endIndex: number = fullText.length;
        if (range.startContainer === textFragment) {
            startIndex = range.startOffset;
        }
        if (range.endContainer === textFragment) {
            endIndex = range.endOffset;
        }
        const leadingText: string = fullText.substring(0, startIndex);
        const trailingText: string = fullText.substring(endIndex);
        return leadingText + trailingText;
    }

    /* Checks whether a given container is visually and semantically empty. */
    private isContentContainerEmpty(containerElement: HTMLElement): boolean {
        return !isNOU(containerElement) && containerElement.nodeName !== '#text' &&
            isNOU(containerElement.querySelector('video')) &&
            isNOU(containerElement.querySelector('audio')) &&
            isNOU(containerElement.querySelector('img')) &&
            containerElement.textContent.trim().length === 0;
    }

    /* Check if the element has more than one BR element */
    private hasMoreThanOneBRElement(currentEle: HTMLElement): boolean {
        const lastChild: HTMLElement = !isNOU(currentEle) ? currentEle.lastChild as HTMLElement : null;
        const previousSibling: Node = !isNOU(lastChild) ? lastChild.previousSibling : null;
        return lastChild && lastChild.nodeName === 'BR' &&
            (!isNOU(previousSibling) && previousSibling.nodeName === 'BR');
    }

    /* Removes empty inline text nodes at the start and end of a selection range. */
    private cleanEmptyInlineBoundaries(selectionRange: Range): void {
        const isStartTextNode: boolean = selectionRange.startContainer.nodeName === '#text';
        const isEndTextNode: boolean = selectionRange.endContainer.nodeName === '#text';
        const startWrapperEle: Element = selectionRange.startContainer.parentElement;
        const endWrapperEle: Element = selectionRange.endContainer.parentElement;
        if (isStartTextNode && !this.parent.domNode.isBlockNode(startWrapperEle) &&
            this.extractUnselectedTextContent(selectionRange.startContainer, selectionRange) === '') {
            this.removeInlineWrapper(startWrapperEle, selectionRange);
        }
        if (isEndTextNode && !this.parent.domNode.isBlockNode(endWrapperEle) &&
            this.extractUnselectedTextContent(selectionRange.endContainer, selectionRange) === '') {
            this.removeInlineWrapper(endWrapperEle, selectionRange);
        }
    }

    /* To remove the inline element wrapper around it */
    private removeInlineWrapper(wrapperEle: Element, selectionRange: Range): void {
        const partialRange: Range = selectionRange.cloneRange();
        partialRange.setEnd(wrapperEle, wrapperEle.childNodes.length);
        partialRange.deleteContents();
        if (wrapperEle.textContent.trim() === '' && wrapperEle.childElementCount === 0 &&
            !isNOU(wrapperEle.parentElement)) {
            while (!this.parent.domNode.isBlockNode(wrapperEle.parentElement) &&
                this.isContentContainerEmpty(wrapperEle.parentElement) &&
                wrapperEle.parentElement.childElementCount === 1 &&
                wrapperEle.parentElement.firstElementChild === wrapperEle) {
                wrapperEle =  wrapperEle.parentElement;
            }
            if (!isNOU(wrapperEle.parentElement) && wrapperEle.parentElement.contains(wrapperEle)) {
                wrapperEle.parentElement.removeChild(wrapperEle);
            }
        }
    }

    /* Updates the DOM structure and cursor position after cutting selected content. */
    private restructureContentPostCut(
        selectionRange: Range, rootParentLIElement: HTMLElement, nestedListEndContainer: HTMLElement): void {
        //range End container Element after cut
        const rangeEndContainer: HTMLElement = selectionRange.startContainer.childNodes[selectionRange.startOffset] as HTMLElement;
        //range Start container Element after cut
        const rangeStartContainer: HTMLElement = this.isParentLIEmpty(rootParentLIElement) ?
            rootParentLIElement : rangeEndContainer.previousSibling as HTMLElement;
        // check if the start range element is empty
        const emptyElementAtStart: HTMLElement = this.getStartRangeEmptyElement(
            this.parent.domNode.getImmediateBlockNode(rangeStartContainer) as HTMLElement, selectionRange);
        // check if the end range element is empty
        const emptyElementAtEnd: HTMLElement | null = this.getEndRangeEmptyElement(
            rangeEndContainer as HTMLElement, nestedListEndContainer);
        const brElement: HTMLElement = document.createElement('br');
        if (!isNOU(emptyElementAtStart) && !isNOU(emptyElementAtEnd)) {
            // When both start and end range element empty, cursor placement and empty element removal
            if (this.isParentLIEmpty(rootParentLIElement)) {
                // Place cursor at parent LI element
                rootParentLIElement.insertBefore(brElement, rootParentLIElement.firstElementChild);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, rootParentLIElement, 0);
            } else {
                emptyElementAtStart.appendChild(brElement);
                // to set the cursor position at the last br element if element has n number of br element inside it
                this.parent.nodeSelection.setCursorPoint(
                    this.parent.currentDocument, emptyElementAtStart, emptyElementAtStart.childElementCount);
            }
            this.removeDomElement(emptyElementAtEnd, emptyElementAtEnd.parentElement);
        } else if (!isNOU(emptyElementAtEnd) && !isNOU(rangeStartContainer)) {
            // When only end range element empty, cursor placement and empty element removal
            if (selectionRange.commonAncestorContainer.nodeName === 'LI') {
                // Place cursor at parent LI element
                this.setParentLICursorPosition(rangeStartContainer);
            } else {
                this.setCursorPosition(this.getDeeptestBlockElement(rangeStartContainer));
            }
            this.removeDomElement(emptyElementAtEnd, emptyElementAtEnd.parentElement);
        } else if (selectionRange.commonAncestorContainer.nodeName === 'LI') {
            // when nested cut selection is done
            this.mergeContentWithinSameContainer(rangeStartContainer, rangeEndContainer, nestedListEndContainer);
        } else {
            // Across elements cut selection is done
            this.mergeContentAcrossBlocks(rangeStartContainer, rangeEndContainer);
        }
    }

    /* To set cursor position at root parent list in nested selection use case */
    private setParentLICursorPosition(rangeStartContainer: HTMLElement): void {
        const rootParentLIElement: HTMLElement = this.parent.domNode.getImmediateBlockNode(rangeStartContainer) as HTMLElement;
        const brElement: HTMLElement = document.createElement('br');
        const nearestBlockElement: HTMLElement = rootParentLIElement.querySelector('ul') ||
            rootParentLIElement.querySelector('ol');
        if (rangeStartContainer.nodeName === 'BR' || (rangeStartContainer.nodeName === '#text' &&
            rangeStartContainer.textContent.trim() === '' && !isNOU(rangeStartContainer.previousElementSibling) &&
            rangeStartContainer.previousElementSibling.nodeName === 'BR')) {
            // if parent li has br element as last child
            if (rangeStartContainer.nodeName === 'BR') {
                rootParentLIElement.insertBefore(brElement, nearestBlockElement);
            } else {
                rootParentLIElement.replaceChild(brElement, rangeStartContainer);
            }
            let cursorOffset: number;
            const cursorBRElement: HTMLElement = nearestBlockElement.previousElementSibling as HTMLElement;
            for (let index: number = 0; index < rootParentLIElement.childNodes.length; index++) {
                if (rootParentLIElement.childNodes[index as number] === cursorBRElement) {
                    cursorOffset = index;
                    break;
                }
            }
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, rootParentLIElement, cursorOffset);
        } else if (rangeStartContainer === rootParentLIElement) {
            rangeStartContainer.insertBefore(brElement, rangeStartContainer.firstElementChild);
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, rangeStartContainer, 0);
        } else {
            this.setCursorPosition(rangeStartContainer);
        }
    }

    /* To get the range Start container empty element */
    private getStartRangeEmptyElement(emptyElement: HTMLElement, selectionRange: Range): HTMLElement | null {
        if (!isNOU(emptyElement)) {
            let elementToRemove: HTMLElement;
            if (selectionRange.commonAncestorContainer.nodeName === 'LI') {
                if (this.isParentLIEmpty(selectionRange.commonAncestorContainer as HTMLElement)) {
                    elementToRemove = selectionRange.commonAncestorContainer as HTMLElement;
                } else {
                    return null;
                }
            } else {
                elementToRemove = this.getDeeptestBlockElement(emptyElement);
                elementToRemove = this.isContentContainerEmpty(elementToRemove) ? elementToRemove : null;
            }
            return elementToRemove;
        } else {
            return null;
        }
    }

    /* To get the range end container empty element */
    private getEndRangeEmptyElement(emptyElement: HTMLElement, nestedListEndContainer: HTMLElement): HTMLElement | null {
        if (!isNOU(emptyElement)) {
            let elementToRemove: HTMLElement;
            if (isNOU(nestedListEndContainer)) {
                elementToRemove = this.getFirstBlockElement(emptyElement);
            } else {
                elementToRemove = nestedListEndContainer;
            }
            elementToRemove = this.isContentContainerEmpty(elementToRemove) ? elementToRemove : null;
            return elementToRemove;
        } else {
            return null;
        }
    }

    /* To get the LI element which has UL as its first child */
    private isParentLIEmpty(liElement: HTMLElement): boolean {
        if (!isNOU(liElement) && liElement.nodeName === 'LI' && !isNOU(liElement.firstElementChild)) {
            if (this.parent.domNode.isList(liElement.firstElementChild)) {
                const nearestBlockElement: HTMLElement = liElement.firstElementChild as HTMLElement;
                if (isNOU(nearestBlockElement.previousSibling) || (nearestBlockElement.previousSibling.textContent.trim() === '' &&
                    nearestBlockElement.previousSibling.nodeName === '#text' &&
                    isNOU((nearestBlockElement.previousSibling as HTMLElement).previousElementSibling))) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    /* Checks if the current selection range fully covers a single block-level element. */
    private isSelectionCoveringSingleBlock(selectionRange: Range, htmlContent: string): boolean {
        let blockContainer: HTMLElement;
        if (!this.parent.domNode.isBlockNode(selectionRange.commonAncestorContainer as HTMLElement)) {
            blockContainer = this.parent.domNode.getImmediateBlockNode(selectionRange.commonAncestorContainer) as HTMLElement;
        } else {
            blockContainer = selectionRange.commonAncestorContainer as HTMLElement;
        }
        return blockContainer.innerHTML.trim() === htmlContent.trim();
    }

    /* Removes a specified DOM element from its container with special handling for <code> elements. */
    private removeDomElement(removableElement: HTMLElement | Node, containerElement: HTMLElement): void {
        if (!isNOU(removableElement) && !isNOU(containerElement) && removableElement !== this.editableElement) {
            if (this.hasMoreThanOneBRElement(removableElement as HTMLElement)) {
                removableElement.removeChild(removableElement.lastChild);
            } else {
                //To get any parent element of container if they are empty
                while (this.isContentContainerEmpty(removableElement.parentElement) &&
                    removableElement.parentElement.childElementCount === 1 &&
                    removableElement.parentElement !== this.editableElement) {
                    removableElement = removableElement.parentElement;
                    containerElement = removableElement.parentElement;
                }
                if (!isNOU(removableElement.nodeName) && removableElement.nodeName === 'CODE' &&
                    removableElement.parentElement.nodeName === 'PRE') {
                    removableElement = containerElement;
                    containerElement = containerElement.parentElement;
                }
                if (containerElement.contains(removableElement)) {
                    containerElement.removeChild(removableElement);
                }
            }
        }
    }

    /* Extracts and removes inline elements from a block container while preserving their content. */
    private extractInlineContentFromBlock(blockContainer: HTMLElement): HTMLElement {
        const inlineContentWrapper: HTMLElement = createElement('div');
        const childNodesList: Node[] = Array.from(blockContainer.childNodes);
        for (let index: number = 0; index < childNodesList.length; index++) {
            if (!this.parent.domNode.isBlockNode(childNodesList[index as number] as HTMLElement)) {
                if (childNodesList[index as number].nodeName === 'BR') {
                    // to remove first occuring br tag
                    this.removeDomElement(childNodesList[index as number], blockContainer);
                    break;
                }
                if (childNodesList[index as number].nodeName === 'CODE' &&
                    !isNOU(childNodesList[index as number].parentElement) &&
                    childNodesList[index as number].parentElement.nodeName === 'PRE') {
                    inlineContentWrapper.innerHTML += (childNodesList[index as number] as HTMLElement).innerHTML;
                } else {
                    inlineContentWrapper.innerHTML += childNodesList[index as number].nodeName === '#text' ?
                        childNodesList[index as number].textContent :
                        (childNodesList[index as number] as HTMLElement).outerHTML;
                }
                this.removeDomElement(childNodesList[index as number], blockContainer);
            }
        }
        if (this.isContentContainerEmpty(blockContainer)) {
            this.removeDomElement(blockContainer, blockContainer.parentElement);
        }
        blockContainer = inlineContentWrapper;
        return blockContainer;
    }

    /* Returns the inner most block element */
    private getDeeptestBlockElement(blockContainer: HTMLElement): HTMLElement {
        if (!isNOU(blockContainer) && this.parent.domNode.isBlockNode(blockContainer)) {
            while (!isNOU(blockContainer.lastElementChild) &&
                this.parent.domNode.isBlockNode(blockContainer.lastElementChild)) {
                blockContainer = blockContainer.lastElementChild as HTMLElement;
            }
            return blockContainer;
        }
        return null;
    }

    /* Returns the first occuring block element */
    private getFirstBlockElement(blockContainer: HTMLElement): HTMLElement {
        if (!isNOU(blockContainer) && this.parent.domNode.isBlockNode(blockContainer)) {
            while (!isNOU(blockContainer.firstChild) && !isNOU(blockContainer.firstElementChild)) {
                if ((blockContainer.firstChild.nodeType === Node.TEXT_NODE &&
                    blockContainer.firstChild.textContent.trim().length > 0) ||
                    (blockContainer.firstChild.nodeType !== Node.TEXT_NODE &&
                    !this.parent.domNode.isBlockNode(blockContainer.firstChild as HTMLElement))) {
                    break;
                }
                blockContainer = blockContainer.firstElementChild as HTMLElement;
            }
            return blockContainer;
        }
        return null;
    }

    /* Merges content between two elements located in different block containers and handles cleanup. */
    private mergeContentAcrossBlocks(startBlockElement: HTMLElement, endBlockElement: HTMLElement): void {
        // Traverse to the deepest inline element within the start block
        if (this.parent.domNode.isBlockNode(startBlockElement as HTMLElement)) {
            startBlockElement = this.getDeeptestBlockElement(startBlockElement);
        }
        // Traverse to the shallowest inline element within the end block
        if (this.parent.domNode.isBlockNode(endBlockElement as HTMLElement)) {
            endBlockElement = this.getFirstBlockElement(endBlockElement);
        }
        // Extract inline content from the end block if needed
        if (this.parent.domNode.isBlockNode(endBlockElement)) {
            endBlockElement = this.extractInlineContentFromBlock(endBlockElement);
        }
        if (!isNOU(startBlockElement)) {
            if (!isNOU(startBlockElement.lastChild)) {
                // Set cursor to the last child of the start block
                this.setCursorPosition(startBlockElement.lastChild);
            } else {
                this.setCursorPosition(startBlockElement);
            }
            // Merge content
            startBlockElement.insertAdjacentHTML('beforeend', endBlockElement.innerHTML);
        }
    }

    /* Merges content between two elements that share the same parent container and performs cleanup. */
    private mergeContentWithinSameContainer(
        startLiElement: HTMLElement, endLiElement: HTMLElement, nestedListEndContainer: HTMLElement): void {
        const canMergeListElement: boolean = startLiElement.nodeName !== 'LI' && (startLiElement.textContent.trim() !== '' ||
            (startLiElement.nodeName === '#text' && !isNOU(startLiElement.previousElementSibling) &&
            startLiElement.previousElementSibling.nodeName !== 'BR'));
        if (!isNOU(nestedListEndContainer) && this.isParentLIEmpty(nestedListEndContainer)) {
            this.setParentLICursorPosition(startLiElement);
        } else if (canMergeListElement) {
            // Traverse to the shallowest inline element within the end block
            if (this.parent.domNode.isBlockNode(endLiElement as HTMLElement)) {
                endLiElement = this.getFirstBlockElement(endLiElement);
            }
            // Extract inline content if end element is still a block
            if (this.parent.domNode.isBlockNode(endLiElement)) {
                endLiElement = this.extractInlineContentFromBlock(endLiElement);
            }
            // Set cursor position at the start element
            this.setCursorPosition(startLiElement);
            const sharedContainer: HTMLElement = startLiElement.parentElement;
            const contentFragment: DocumentFragment = document.createDocumentFragment();
            // Move all children from end element into the fragment
            while (!isNOU(endLiElement.firstChild)) {
                contentFragment.appendChild(endLiElement.firstChild);
            }
            // Insert the fragment after the start element
            sharedContainer.insertBefore(contentFragment, startLiElement.nextSibling);
        }
    }

    /* Sets the cursor position at the end of the specified element or its content. */
    private setCursorPosition(focusTarget: HTMLElement | Node): void {
        let cursorOffset: number;
        if (!isNOU(focusTarget)) {
            if (focusTarget.nodeName === '#text') {
                if (focusTarget.textContent.length > 0) {
                    cursorOffset = focusTarget.textContent.length;
                } else {
                    const focusChildNodes: Node[] = Array.from(focusTarget.parentElement.childNodes);
                    for (let index: number = 0; index < focusChildNodes.length; index++) {
                        if (focusChildNodes[index as number] === focusTarget) {
                            cursorOffset = index;
                            break;
                        }
                    }
                    focusTarget = focusTarget.parentElement;
                }
            } else {
                // Handle media or special wrappers
                if (focusTarget.nodeName !== '#text' && !isNOU(focusTarget.childNodes) &&
                    (focusTarget.nodeName === 'IMG' || (focusTarget as HTMLElement).classList.contains('e-audio-wrap') ||
                    (focusTarget as HTMLElement).classList.contains('e-video-wrap'))) {
                    cursorOffset = 1;
                } else {
                    if (this.parent.domNode.isBlockNode(focusTarget as HTMLElement) && !isNOU(focusTarget.lastChild) &&
                        ((focusTarget.lastChild.nodeName === 'BR') || (focusTarget.lastChild.textContent.trim() === '' &&
                        !isNOU((focusTarget.lastChild as HTMLElement).previousElementSibling) &&
                        (focusTarget.lastChild as HTMLElement).previousElementSibling.nodeName === 'BR'))) {
                        // if element has br tag as last element child
                        (focusTarget as HTMLElement).appendChild(document.createElement('br'));
                        for (let index: number = 0; index < focusTarget.childNodes.length; index++) {
                            if (focusTarget.childNodes[index as number].nodeName === 'BR') {
                                cursorOffset = index;
                            }
                        }
                    } else {
                        // Traverse to the deepest valid child
                        while (!isNOU(focusTarget.lastChild)) {
                            focusTarget = focusTarget.lastChild;
                        }
                        cursorOffset = focusTarget.textContent.length;
                    }
                }
            }
            this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, focusTarget as HTMLElement, cursorOffset);
        }
    }

    /* Recursively extracts plain text content from an HTML node hierarchy. */
    private extractTextFromHtmlNode(sourceNode: HTMLElement | Node): string {
        let plainText: string = '';
        for (const childNode of Array.from(sourceNode.childNodes)) {
            if (childNode.nodeType === Node.TEXT_NODE) {
                plainText += childNode.nodeValue;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                const tagName: string = childNode.nodeName.toLowerCase();
                switch (tagName) {
                case 'br':
                    plainText += '\r\n';
                    break;
                case 'p':
                case 'div':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'blockquote':
                case 'li':
                case 'pre':
                    plainText += this.extractTextFromHtmlNode(childNode) + '\r\n';
                    break;
                case 'table':
                    if (tagName === 'table' && sourceNode.nodeName.toLowerCase() === 'td') {
                        plainText += this.serializeTableToPlainText(childNode as HTMLElement);
                        continue;
                    } else {
                        plainText += this.serializeTableToPlainText(childNode as HTMLElement) + '\r\n';
                    }
                    break;
                case 'img':
                case 'audio':
                case 'video': {
                    plainText += '';
                    break;
                }
                default:
                    plainText += this.extractTextFromHtmlNode(childNode);
                }
            }
        }
        return plainText;
    }

    /* Converts an HTML table element into a plain text format using tabs and newlines. */
    private serializeTableToPlainText(tableElement: HTMLElement): string {
        let plainText: string = '';
        const tableRows: HTMLTableRowElement[] = Array.from(tableElement.querySelectorAll('tr')).filter((row: HTMLTableRowElement) => {
            return (row.closest('table') === tableElement);
        });
        for (let index: number = 0; index < tableRows.length; index ++) {
            const tableCells: ChildNode[] = Array.from(
                tableRows[index as number].querySelectorAll('th, td')).filter((cell: ChildNode) => {
                return ((cell as HTMLElement).closest('tr') === tableRows[index as number]);
            });
            let rowContent: string = '';
            for (const cellNode of tableCells) {
                const cellText : string = this.extractTextFromHtmlNode(cellNode);
                rowContent += cellText.includes('\r\n') ? cellText : (cellText + '\t');
            }
            plainText += rowContent + '\r\n';
        }
        return plainText;
    }

    /**
     * Cleans up resources when the component is destroyed
     *
     * @returns {void} - No return value
     * @public
     */
    public destroy(): void {
        this.removeEventListener();
    }
    // ClipBoard Cleanup Module Logics End
}
