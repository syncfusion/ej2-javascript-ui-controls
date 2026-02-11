import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU, createElement, closest } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { updateTextNode, nestedListCleanUp, scrollToCursor, cleanHTMLString } from './../../common/util';
import { ImageOrTableCursor } from '../../common';
import { EditorManager } from '../base/editor-manager';
import { TablePasting } from './table-pasting';

/**
 * This InsertHtml class contains methods to insert HTML nodes or text into a document.
 *
 * @hidden
 * @private
 */
export class InsertHtml {
    public static inlineNode: string[] = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'title', 'u', 'tt', 'var', 'video', 'wbr'];
    public static contentsDeleted: boolean = false;
    private static isAnotherLiFromEndLi: boolean = false;
    /**
     * Inserts an HTML node or text into the specified document.
     *
     * @param {Document} docElement - The document where the node should be inserted.
     * @param {Node | string} insertNode - The node or text to be inserted. Can be a DOM Node or a string representing HTML.
     * @param {Element} [editNode] - The container or editor node where the insertion will occur.
     * @param {boolean} [isExternal] - Flag indicating if the node is from an external source. Optional.
     * @param {string} [enterAction] - Represents the action taken when 'Enter' is pressed. Optional.
     * @param {EditorManager} [editorManager] - Represents the EditorManager instance. Optional.
     * @returns {void}
     * @hidden
     * @private
     */
    public static Insert(
        docElement: Document, insertNode: Node | string,
        editNode: Element, isExternal?: boolean, enterAction?: string, editorManager?: EditorManager
    ): void {
        const insertedNode: Node = this.prepareInsertNode(insertNode, isExternal, editNode);
        const scrollHeight: number = !isNOU(editNode) ? editNode.scrollHeight : 0;
        const nodeSelection: NodeSelection = new NodeSelection(editNode as HTMLElement);
        const nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        //Adjusts the selection range to handle various edge cases for cursor positioning
        range = this.adjustSelectionRange(nodeSelection, docElement, editNode as HTMLElement, range);
        const isCursor: boolean = this.isCursorAtStartPoint(range);
        const isCollapsed: boolean = range.collapsed;
        const nodes: Node[] = this.getNodeCollection(range, nodeSelection, insertedNode);
        const isInsertedNodeTable: boolean = insertedNode.nodeName.toLowerCase() === 'table';
        let closestParentNode: Node = this.findRelevantParentNode(nodes, isInsertedNodeTable, range, editNode);
        // Handle BR parent case
        if (closestParentNode && closestParentNode.nodeName === 'BR') {
            closestParentNode = closestParentNode.parentNode;
        }
        // Handling the table insertion inside list items
        if (closestParentNode && closestParentNode.nodeName === 'LI' && isInsertedNodeTable) {
            this.handleTableInListItem(
                range, insertedNode, closestParentNode,
                nodes, nodeSelection, nodeCutter, editNode
            );
            return;
        }
        // Handle image insertion at empty cursor position
        const isImgOnlyNode: boolean = insertedNode.nodeName !== '#text' &&
            !isNOU((insertedNode as HTMLElement).children[0]) &&
            !isNOU((insertedNode as HTMLElement).children[0].tagName) &&
            (insertedNode as HTMLElement).children[0].tagName === 'IMG' &&
            (insertedNode as HTMLElement).children.length === 1;
        const isEmptyCursorPosition: boolean = isCursor &&
            range.startContainer.textContent === '' &&
            range.startContainer.nodeName !== 'BR' &&
            enterAction !== 'BR';
        if (isEmptyCursorPosition && isImgOnlyNode) {
            (range.startContainer as HTMLElement).innerHTML = '';
        }
        const isPasteContentOrInsertHtml: boolean = isExternal || (!isNOU(insertedNode) &&
            !isNOU((insertedNode as HTMLElement).classList) &&
            (insertedNode as HTMLElement).classList.contains('pasteContent'));
        const targetCells: NodeListOf<Element> = docElement.querySelectorAll('td.e-cell-select, th.e-cell-select');

        if (targetCells && targetCells.length > 1) {
            this.clearTargetCells(targetCells);
        }

        if (isPasteContentOrInsertHtml) {
            if (editorManager &&
                editorManager.tableObj &&
                editorManager.tableObj.tablePastingObj) {
                const tablePastingObj: TablePasting = editorManager.tableObj.tablePastingObj;
                const insertedTable: HTMLElement | null = tablePastingObj.getValidTableFromPaste(insertedNode as HTMLElement);
                const hasSelectedTargetCells: boolean = targetCells && targetCells.length > 0;

                if (hasSelectedTargetCells && insertedTable) {
                    // Delegate to the table pasting logic
                    tablePastingObj.handleTablePaste(insertedTable as HTMLTableElement, targetCells);
                    return;
                }
            }

            this.pasteInsertHTML(
                nodes, insertedNode, range, nodeSelection, nodeCutter, docElement,
                isCollapsed, closestParentNode, editNode, enterAction
            );
            return;
        }

        if (this.shouldInsertOutsideRange(editNode, range, isCollapsed, closestParentNode, insertedNode)) {
            this.handleContentInsertionOutsideRange(
                docElement, editNode, range, nodeSelection,
                nodeCutter, isCollapsed, closestParentNode, insertedNode, nodes, insertNode, isCursor, enterAction);
        } else {
            this.handleContentInsertionInsideRange(
                docElement, range, nodeSelection, nodeCutter,
                closestParentNode, insertedNode, isCursor);
        }
        // Scroll to cursor if needed for the image
        if (this.shouldScrollToCursor(editNode, scrollHeight, insertedNode)) {
            scrollToCursor(docElement, editNode as HTMLElement);
        }
    }

    /*
    * Clears the content of all target cells by setting their innerHTML to a line break
    */
    private static clearTargetCells(cells: NodeListOf<Element>): void {
        for (let i: number = 0; i < cells.length; i++) {
            cells[i as number].innerHTML = '<br>';
        }
    }

    // Prepares the node or HTML string for insertion, attaching it to a temporary container if necessary, and ensuring valid usage.
    private static prepareInsertNode(insertNode: string | Node, isExternal: boolean, editNode: Element): Node {
        if (typeof insertNode === 'string') {
            insertNode = cleanHTMLString(insertNode as string, editNode);
            const divNode: HTMLElement = createElement('div');
            divNode.innerHTML = insertNode.replace(/&(times|divide|ne)(;?)/g, '&amp;$1$2');
            return isExternal ? divNode : divNode.firstChild;
        } else {
            const isValidPasteContent: boolean = !isNOU(insertNode) &&
                !isNOU((insertNode as HTMLElement).classList) &&
                (insertNode as HTMLElement).classList.contains('pasteContent');
            if (isExternal && !isValidPasteContent) {
                const divNode: HTMLElement = createElement('div');
                divNode.appendChild(insertNode as Node);
                return divNode;
            } else {
                if (Browser.userAgent.indexOf('Firefox') !== -1) {
                    this.unwrapSpansAroundBlocks(insertNode as Node);
                }
                return insertNode as Node;
            }
        }
    }

    //Unwraps span elements that contain block-level elements within them.
    private static unwrapSpansAroundBlocks(node: Node): void {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        const element: HTMLElement = node as HTMLElement;
        // Recursively process child nodes first (bottom-up traversal)
        Array.from(element.childNodes).forEach((child: Node) => {
            this.unwrapSpansAroundBlocks(child);
        });
        if (element.tagName.toLowerCase() === 'span' && element.hasChildNodes()) {
            // Define a CSS selector for common block-level elements
            const blockSelectors: string = 'address, article, aside, blockquote, canvas, dd, div, dl, dt, ' +
                'fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, ' +
                'header, hr, li, main, nav, noscript, ol, p, pre, section, table, tfoot, ul, video';
            // Check if there is any block-level descendant
            const hasBlockDescendant: boolean = element.querySelector(blockSelectors) !== null;
            if (hasBlockDescendant && element.parentNode) {
                while (element.firstChild) {
                    element.parentNode.insertBefore(element.firstChild, element);
                }
                element.parentNode.removeChild(element);
            }
        }
    }

    // Adjusts the selection range to handle various edge cases for cursor positioning.
    private static adjustSelectionRange(
        nodeSelection: NodeSelection, docElement: Document,
        editNode: HTMLElement, range: Range
    ): Range {
        // Check if this is a collapsed selection at the beginning (offset 0)
        const isCollapsedAtStart: boolean = range.startContainer === range.endContainer &&
            range.startOffset === 0 && range.startOffset === range.endOffset;
        if (!isCollapsedAtStart) {
            return range; // Early return if not a collapsed selection at start
        }
        // Apply each adjustment in based on the cursor range.
        range = this.adjustEmptyEditorSelection(nodeSelection, docElement, editNode, range);
        range = this.adjustSelectionToFirstTextNode(nodeSelection, docElement, editNode, range);
        range = this.adjustBrElementSelection(nodeSelection, docElement, range);
        return range;
    }

    // Adjusts selection when the editor is empty with a single block element.
    private static adjustEmptyEditorSelection(
        nodeSelection: NodeSelection, docElement: Document,
        editNode: HTMLElement, range: Range
    ): Range {
        if (range.startContainer === editNode &&
            editNode.textContent.length === 0 &&
            (editNode.children[0].tagName === 'P' ||
            editNode.children[0].tagName === 'DIV' ||
            editNode.children[0].tagName === 'BR')) {
            nodeSelection.setSelectionText(
                docElement,
                (range.startContainer as HTMLElement).children[0],
                (range.startContainer as HTMLElement).children[0],
                0, 0
            );
            return nodeSelection.getRange(docElement);
        }
        return range;
    }

    // Adjusts selection to the first text node when cursor is at the start of content.
    private static adjustSelectionToFirstTextNode(
        nodeSelection: NodeSelection, docElement: Document,
        editNode: HTMLElement, range: Range
    ): Range {
        if (range.startContainer === editNode &&
            editNode.textContent.trim().length > 0 && (editNode.childNodes[0] as HTMLElement).tagName !== 'TABLE') {
            const focusNode: Node | null = this.findFirstTextNode(range.startContainer);
            if (!isNOU(focusNode)) {
                nodeSelection.setSelectionText(docElement, focusNode, focusNode, 0, 0);
                return nodeSelection.getRange(docElement);
            }
        }
        return range;
    }

    // Adjusts selection when cursor is on a BR element
    private static adjustBrElementSelection(nodeSelection: NodeSelection, docElement: Document, range: Range): Range {
        if (range.startContainer.nodeName === 'BR') {
            const currentIndex: number = Array.prototype.slice.call(
                range.startContainer.parentElement.childNodes
            ).indexOf(range.startContainer as HTMLElement);
            nodeSelection.setSelectionText(
                docElement,
                (range.startContainer as HTMLElement).parentElement,
                (range.startContainer as HTMLElement).parentElement,
                currentIndex, currentIndex
            );
            return nodeSelection.getRange(docElement);
        }
        return range;
    }

    // Handles the insertion of a table element within a list item context.
    private static handleTableInListItem(
        range: Range, insertedNode: Node, closestParentNode: Node, nodes: Node[],
        nodeSelection: NodeSelection, nodeCutter: NodeCutter, editNode: Element
    ): void {
        if (nodes.length === 0) {
            const tableCursor: ImageOrTableCursor = nodeSelection.processedTableImageCursor(range);
            if (tableCursor.startName === 'TABLE' || tableCursor.endName === 'TABLE') {
                const tableNode: HTMLElement = tableCursor.start ? tableCursor.startNode : tableCursor.endNode;
                nodes.push(tableNode);
            }
        }
        const lastClosestParentNode: HTMLElement = this.findClosestRelevantElement(
            nodes[nodes.length - 1].parentNode,
            editNode as Element
        ) as HTMLElement;
        this.insertTableInList(
            range, insertedNode as HTMLTableElement,
            closestParentNode, nodes[0], nodeCutter, lastClosestParentNode);
    }

    // Determines if the cursor is positioned at the start of the range.
    private static isCursorAtStartPoint(range: Range): boolean {
        return range.startOffset === 0 && range.startOffset === range.endOffset &&
            range.startContainer === range.endContainer;
    }

    // Identifies the most contextually relevant parent node for insertion based on various criteria.
    private static findRelevantParentNode(nodes: Node[], isInsertedNodeTable: boolean, range: Range, editNode: Element): Node {
        if (isInsertedNodeTable) {
            return (!isNOU(nodes[0]) && !isNOU(nodes[0].parentNode)) ?
                this.findClosestRelevantElement(nodes[0].parentNode, editNode) : range.startContainer;
        } else {
            return nodes[0];
        }
    }

    // Checks if the content should be inserted outside the existing selection range based on multiple checks.
    private static shouldInsertOutsideRange(
        editNode: Element, range: Range, isCollapsed: boolean,
        closestParentNode: Node, insertedNode: Node
    ): boolean {
        return editNode !== range.startContainer && (
            (!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (insertedNode.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1)
        );
    }

    // Handles insertion of content outside the specified selection range, managing complex cases including tables.
    private static handleContentInsertionOutsideRange(
        docElement: Document, editNode: Element, range: Range, nodeSelection: NodeSelection,
        nodeCutter: NodeCutter, isCollapsed: boolean, closestParentNode: Node,
        insertedNode: Node, nodes: Node[], insertNode: Node | string, isCursor: boolean, enterAction: string
    ): void {
        // Extract content and prepare for insertion
        const preNode: Node = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
        const sibNode: Node = preNode.previousSibling;
        const parentNode: Node = preNode.parentNode;
        // Update selection based on node structure
        if (nodes.length === 1) {
            nodeSelection.setSelectionContents(docElement, preNode);
            range = nodeSelection.getRange(docElement);
        } else if (parentNode && parentNode.nodeName !== 'LI') {
            let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
            lasNode = isNOU(lasNode) ? preNode : lasNode;
            nodeSelection.setSelectionText(
                docElement, preNode, lasNode, 0,
                (lasNode.nodeType === 3) ? lasNode.textContent.length : lasNode.childNodes.length);
            range = nodeSelection.getRange(docElement);
        }
        // Extract content or clean up nested lists
        this.extractOrCleanupContent(range, parentNode);
        // Handle table insertion specially
        if ((insertNode as HTMLElement).tagName === 'TABLE') {
            this.cleanupForTableInsertion(range, editNode);
        }
        // Remove original nodes after processing
        this.removeOriginalNodes(nodes);
        // Insert node at appropriate location
        this.insertNodeAtLocation(
            docElement, sibNode, parentNode, editNode, insertedNode, preNode, insertNode, isCursor, range, enterAction);
        this.removeEmptyElements(editNode as HTMLElement);
        this.setSelectionAfterInsertion(insertedNode, nodeSelection, docElement);
    }

    // Extracts content or cleans nested lists as required when managing inserts in outer content ranges.
    private static extractOrCleanupContent(range: Range, parentNode: Node): void {
        if (range.startContainer.parentElement.closest('ol,ul') !== null &&
            range.endContainer.parentElement.closest('ol,ul') !== null) {
            nestedListCleanUp(range, parentNode);
        } else {
            range.extractContents();
        }
    }

    // Performs cleanup operations necessary specifically for cases involving table insertions.
    private static cleanupForTableInsertion(range: Range, editNode: Element): void {
        const emptyElement: HTMLElement = closest(range.startContainer, 'blockquote') as HTMLElement;
        if (!isNOU(emptyElement) && emptyElement.childNodes.length > 0) {
            for (let i: number = emptyElement.childNodes.length - 1; i >= 0; i--) {
                const currentChild: HTMLElement = emptyElement.childNodes[i as number] as HTMLElement;
                if (!isNOU(currentChild) && currentChild.innerText.trim() === '') {
                    detach(currentChild);
                }
            }
        }
        this.removeEmptyElements(editNode as HTMLElement, false, emptyElement as HTMLElement);
    }

    // Removes the original nodes from the document tree after processing insertion operations.
    private static removeOriginalNodes(nodes: Node[]): void {
        for (let index: number = 0; index < nodes.length; index++) {
            if (nodes[index as number].nodeType !== 3 && nodes[index as number].parentNode != null) {
                if (nodes[index as number].nodeName === 'IMG') {
                    continue;
                }
                nodes[index as number].parentNode.removeChild(nodes[index as number]);
            }
        }
    }

    // Directly inserts the node at a calculated location, ensuring appropriate context and order.
    private static insertNodeAtLocation(
        docElement: Document,
        sibNode: Node,
        parentNode: Node,
        editNode: Element,
        insertedNode: Node,
        preNode: Node,
        insertNode: Node | string,
        isCursor: boolean,
        range: Range,
        enterAction: string
    ): void {
        if (!isNOU(sibNode) && !isNOU(sibNode.parentNode)) {
            if (docElement.contains(sibNode)) {
                InsertMethods.AppendBefore(insertedNode as HTMLElement, sibNode as HTMLElement, true);
            } else {
                range.insertNode(insertedNode);
            }
        } else {
            parentNode = this.findAppropriateParentNode(parentNode, editNode);
            this.insertNodeBasedOnContext(parentNode, editNode, insertedNode, insertNode, isCursor, range, preNode, enterAction);
        }
    }

    // Identifies an appropriate parent node which accommodates the insertion effectively.
    private static findAppropriateParentNode(parentNode: Node, editNode: Element): Node {
        let previousNode: Node = null;
        while (parentNode !== editNode && parentNode.firstChild &&
            (parentNode.textContent.trim() === '') && parentNode.nodeName !== 'LI') {
            const parentNode1: Node = parentNode.parentNode;
            previousNode = parentNode;
            parentNode = parentNode1;
        }
        return previousNode !== null ? previousNode : parentNode;
    }

    // Inserts nodes by considering established contexts like sibling nodes and nested elements.
    private static insertNodeBasedOnContext(
        parentNode: Node, editNode: Element, insertedNode: Node,
        insertNode: Node | string, isCursor: boolean, range: Range, preNode: Node, enterAction: string
    ): void {
        if (parentNode.firstChild && ((parentNode as HTMLElement) !== editNode ||
           (insertedNode.nodeName === 'TABLE' && isCursor && parentNode === range.startContainer &&
           parentNode === range.endContainer))) {
            if (parentNode.textContent.trim() === '' && parentNode !== editNode && parentNode.nodeName === 'LI') {
                parentNode.appendChild(insertedNode);
            } else if (parentNode.textContent.trim() === '' && (parentNode as HTMLElement) !== editNode) {
                if ((parentNode as HTMLElement).parentNode && (parentNode as HTMLElement).parentNode === editNode
                    && !this.isBlockElement(insertedNode) && !(enterAction && enterAction.toUpperCase() === 'BR')) {
                    const blockNode: HTMLElement = enterAction && enterAction.toUpperCase() === 'DIV' ? createElement('div') : createElement('p');
                    blockNode.appendChild(insertedNode as HTMLElement);
                    InsertMethods.AppendBefore(blockNode, parentNode as HTMLElement, false);
                } else {
                    InsertMethods.AppendBefore(insertedNode as HTMLElement, parentNode as HTMLElement, false);
                }
                detach(parentNode);
            } else {
                InsertMethods.AppendBefore(insertedNode as HTMLElement, parentNode.firstChild as HTMLElement, false);
            }
        } else if (isNOU(preNode.previousSibling) && (insertNode as HTMLElement).tagName === 'TABLE') {
            (parentNode as Element).prepend(insertedNode);
        } else {
            parentNode.appendChild(insertedNode);
        }
    }

    // Configures the node selection state after executing the insertion operation.
    private static setSelectionAfterInsertion(
        insertedNode: Node, nodeSelection: NodeSelection, docElement: Document
    ): void {
        if (insertedNode.nodeName === 'IMG') {
            this.imageFocus(insertedNode, nodeSelection, docElement);
        } else if (insertedNode.nodeType !== 3) {
            nodeSelection.setSelectionText(docElement, insertedNode, insertedNode, 0, insertedNode.childNodes.length);
        } else {
            nodeSelection.setSelectionText(docElement, insertedNode, insertedNode, 0, insertedNode.textContent.length);
        }
    }

    // Manages insertion operations when nodes are intended to be placed within the current range selection.
    private static handleContentInsertionInsideRange(
        docElement: Document, range: Range, nodeSelection: NodeSelection, nodeCutter: NodeCutter,
        closestParentNode: Node, insertedNode: Node, isCursor: boolean
    ): void {
        const liElement: HTMLElement = !isNOU(closestParentNode) ?
            closest(closestParentNode, 'li') as HTMLElement : null;
        if (this.shouldInsertInTableCell(closestParentNode, liElement, isCursor)) {
            range.extractContents();
            liElement.appendChild(insertedNode);
            this.removeEmptyNextLI(liElement);
        } else {
            this.insertWithRangeHandling(docElement, range, nodeCutter, insertedNode, isCursor);
        }
        this.setCursorAfterInsertion(docElement, insertedNode, nodeSelection);
    }

    // Determines if content should be inserted inside a table cell based on the specific conditions.
    private static shouldInsertInTableCell(
        closestParentNode: Node, liElement: HTMLElement, isCursor: boolean
    ): boolean {
        return (!isNOU(closestParentNode) &&
               (closestParentNode.nodeName === 'TD' || closestParentNode.nodeName === 'TH')) &&
               !isNOU(liElement) &&  !isCursor;
    }

    // Handles direct node insertions by accounting for document structure and browser compatibility factors.
    private static insertWithRangeHandling(
        docElement: Document, range: Range, nodeCutter: NodeCutter,
        insertedNode: Node, isCursor: boolean
    ): void {
        range.deleteContents();
        if (isCursor && range.startContainer.textContent === '' && range.startContainer.nodeName !== 'BR') {
            (range.startContainer as HTMLElement).innerHTML = '';
        }
        if (Browser.isIE) {
            const frag: DocumentFragment = docElement.createDocumentFragment();
            frag.appendChild(insertedNode);
            range.insertNode(frag);
        } else if (this.isHrElement(range)) {
            this.insertAfterHrElement(range, insertedNode);
        } else {
            this.insertBasedOnStartContainer(range, insertedNode, nodeCutter);
        }
    }

    // Handles direct node insertions by accounting for document structure and browser compatibility factors.
    private static isHrElement(range: Range): boolean {
        return range.startContainer.nodeType === 1 &&
               range.startContainer.nodeName.toLowerCase() === 'hr' &&
               range.endContainer.nodeName.toLowerCase() === 'hr';
    }

    // Handling inserting after horizontal rule elements.
    private static insertAfterHrElement(range: Range, insertedNode: Node): void {
        const paraElem: Element = (range.startContainer as HTMLElement).nextElementSibling;
        if (paraElem) {
            if (paraElem.querySelector('br')) {
                detach(paraElem.querySelector('br'));
            }
            paraElem.appendChild(insertedNode);
        }
    }

    // Inserts content based on the start container properties and current text structure.
    private static insertBasedOnStartContainer(range: Range, insertedNode: Node, nodeCutter: NodeCutter): void {
        let container: HTMLElement = range.startContainer as HTMLElement;
        if (range.startContainer.nodeName === 'BR') {
            range.startContainer.parentElement.insertBefore(insertedNode, range.startContainer);
        } else if (insertedNode.nodeName === 'TABLE' && (CONSTANT.ALLOWED_TABLE_BLOCK_TAGS.indexOf(container.nodeName.toLowerCase()) === -1
            && CONSTANT.TABLE_BLOCK_TAGS.indexOf(container.nodeName.toLowerCase()) === -1)) {
            while ((CONSTANT.ALLOWED_TABLE_BLOCK_TAGS.indexOf(container.parentNode.nodeName.toLowerCase()) === -1
                && CONSTANT.TABLE_BLOCK_TAGS.indexOf(container.parentNode.nodeName.toLowerCase()) === -1)) {
                container = container.parentNode as HTMLElement;
            }
            // Case 1: If cursor is at the start of the inline element
            if (range.startOffset === 0 && range.endOffset === 0 && container) {
                container.parentNode.insertBefore(insertedNode, container);
                const hasText: boolean = container.textContent.length > 0;
                const hasMediaElements: boolean = container.nodeName !== '#text' && container.querySelector('img, video, audio, table') !== null;
                const hasContent: boolean = hasText || hasMediaElements;
                if (!hasContent) {
                    detach(container);
                }
            } else if (range.startOffset === range.startContainer.textContent.length && range.endOffset ===
                range.startContainer.textContent.length &&
                container && container.parentNode) {
                // Case 2: If cursor is at the end of the inline element
                const nextSibling: Node = container.nextSibling;
                container.parentNode.insertBefore(insertedNode, nextSibling);
            } else {
                // Case 3: Handling middle insertion
                const spliceNode: Node = nodeCutter.GetSpliceNode(range, container);
                const nextNode: Node | null = spliceNode.nextSibling;
                container.parentNode.insertBefore(insertedNode, nextNode);
                detach(spliceNode);
            }
        } else {
            range.insertNode(insertedNode);
        }
    }

    // Sets the cursor position after completing the content insertion logic.
    private static setCursorAfterInsertion(
        docElement: Document,
        insertedNode: Node,
        nodeSelection: NodeSelection
    ): void {
        if (insertedNode.nodeType !== 3 && insertedNode.childNodes.length > 0) {
            nodeSelection.setSelectionText(docElement, insertedNode, insertedNode, 1, 1);
        } else if (insertedNode.nodeName === 'IMG') {
            this.imageFocus(insertedNode, nodeSelection, docElement);
        } else if (insertedNode.nodeType !== 3) {
            nodeSelection.setSelectionContents(docElement, insertedNode);
        } else {
            nodeSelection.setSelectionText(
                docElement, insertedNode, insertedNode,
                insertedNode.textContent.length, insertedNode.textContent.length
            );
        }
    }

    // Checks whether the editor should scroll to the cursor position after insertion.
    private static shouldScrollToCursor(editNode: Element, scrollHeight: number, insertedNode: Node): boolean {
        return !isNOU(editNode) &&
               scrollHeight < editNode.scrollHeight &&
               insertedNode.nodeType === 1 &&
               (insertedNode.nodeName === 'IMG' || !isNOU((insertedNode as HTMLElement).querySelector('img')));
    }

    // Removes empty list items from the associated list after node insertions.
    private static removeEmptyNextLI(liElement: HTMLElement): void {
        // Find the root-level list containing this list item
        let rootList: HTMLElement = closest(liElement, 'ul,ol') as HTMLElement;
        // Navigate to the topmost list if this is inside nested lists
        while (rootList && rootList.parentElement && rootList.parentElement.nodeName === 'LI') {
            rootList = closest(rootList.parentElement, 'ul,ol') as HTMLElement;
        }
        if (!rootList) {
            return;
        }
        // Collect all list items in the list
        const listItems: NodeListOf<HTMLLIElement> = rootList.querySelectorAll('li');
        // Define a helper to check if a list item is empty (no text and no media elements)
        const isEmptyListItem: (item: HTMLLIElement) => boolean = (item: HTMLLIElement): boolean => {
            return item.textContent.trim() === '' &&
                !item.querySelector('audio,video,img,table,br');
        };
        // Remove all empty list items
        listItems.forEach((item: HTMLLIElement) => {
            if (isEmptyListItem(item)) {
                detach(item);
            }
        });
    }

    // Recursively searches for and returns the first text node within the specified node.
    private static findFirstTextNode(node: Node | null): Node | null {
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        for (let i: number = 0; i < node.childNodes.length; i++) {
            const textNode: Node = this.findFirstTextNode(node.childNodes[i as number]);
            if (!isNOU(textNode)) {
                return textNode;
            }
        }
        return null;
    }

    // Handles HTML content pasting operations & insertHTML execCommand while ensuring context-specific adjustments.
    private static pasteInsertHTML(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeSelection: NodeSelection, nodeCutter: NodeCutter,
        docElement: Document, isCollapsed: boolean, closestParentNode: Node,
        editNode?: Element, enterAction?: string
    ): void {
        const blockElement: HTMLElement = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode) as HTMLElement;
        if (blockElement && blockElement.textContent.length === 0) {
            const brElement: HTMLBRElement | null = blockElement.querySelector('br:last-of-type');
            if (brElement) {
                brElement.classList.add('rte-temp-br');
            }
        }
        // Initialize key variables and adjust range if needed
        const isCursor: boolean = range.startOffset === range.endOffset && range.startContainer === range.endContainer;
        range = this.adjustRangeForEmptyEditor(nodes, range, nodeSelection, docElement, editNode, isCursor);
        // Setup variables for range manipulation
        const rangeInfo: {
            preNode: Node;
            sibNode: Node;
            lasNode: Node;
            isSingleNode: boolean;
            range: Range;
        } = this.setupRangeForPaste(
            nodes, insertedNode, range, nodeSelection, nodeCutter,
            docElement, isCollapsed, closestParentNode, editNode
        );
        range = rangeInfo.range;
        this.listStyleCleanup(insertedNode);
        // Process based on content structure
        const containsBlockNode: boolean = this.containsBlockElements(insertedNode);
        const lastSelectionNode: Node = containsBlockNode
            ? this.handleBlockNodeContent(nodes, insertedNode, range, nodeCutter, editNode, enterAction, isCollapsed)
            : this.handleInlineContent(
                nodes, insertedNode, range, nodeSelection, docElement,
                editNode, isCursor, rangeInfo.sibNode, rangeInfo.lasNode, rangeInfo.isSingleNode);
        // Process special cases
        const processedNode: Node = this.processSpecialNodes(lastSelectionNode, insertedNode, enterAction);
        // Position cursor appropriately
        this.positionCursorAfterPaste(
            processedNode, insertedNode, nodeSelection, docElement, editNode, enterAction
        );
        // Final cleanup
        this.alignCheck(editNode as HTMLElement);
        this.listCleanUp(nodeSelection, docElement);
        this.removeEmptyBrFromParagraph(editNode as HTMLElement);
    }

    // Clean up unnecessary line breaks after paste actions.
    private static removeEmptyBrFromParagraph(editNode: HTMLElement): void {
        const tempBr: HTMLBRElement | null = editNode.querySelector('br.rte-temp-br');
        if (tempBr) {
            tempBr.remove();
        }
    }

    // Cleans up inline styles applied to list items within the inserted content.
    private static listStyleCleanup(node: Node): void {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const listItems: NodeListOf<HTMLLIElement> = (node as HTMLElement).querySelectorAll('li');
            listItems.forEach((li: HTMLLIElement) => {
                if (li.style.display === 'block') {
                    li.style.removeProperty('display');
                    if (li.getAttribute('style') === '') {
                        li.removeAttribute('style');
                    }
                }
            });
        }
    }


    // Adjusts range settings when the editor is empty, covering cursor initialization aspects.
    private static adjustRangeForEmptyEditor(
        nodes: Node[], range: Range, nodeSelection: NodeSelection,
        docElement: Document, editNode: Element, isCursor: boolean
    ): Range {
        if (isCursor && range.startContainer === editNode &&
            editNode.textContent === '' && range.startOffset === 0 && range.endOffset === 0 && (editNode.childNodes[0] as HTMLElement).tagName !== 'TABLE') {
            const currentBlockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            nodeSelection.setSelectionText(docElement, currentBlockNode, currentBlockNode, 0, 0);
            return nodeSelection.getRange(docElement);
        }
        return range;
    }

    // Sets up parameters involving range, sibling nodes, and relevant options for pasting operations.
    private static setupRangeForPaste(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeSelection: NodeSelection, nodeCutter: NodeCutter,
        docElement: Document, isCollapsed: boolean, closestParentNode: Node, editNode: Element
    ): { preNode: Node, sibNode: Node, lasNode: Node, isSingleNode: boolean, range: Range } {
        let preNode: Node;
        let sibNode: Node;
        let lasNode: Node;
        let isSingleNode: boolean = false;
        if (editNode !== range.startContainer &&
            ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (insertedNode.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1)) && insertedNode.firstChild.nodeName !== 'HR') {
            preNode = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            if (!isNOU(preNode)) {
                sibNode = isNOU(preNode.previousSibling) ?
                    preNode.parentNode.previousSibling : preNode.previousSibling;
                if (nodes.length === 1) {
                    nodeSelection.setSelectionContents(docElement, preNode);
                    range = nodeSelection.getRange(docElement);
                    isSingleNode = true;
                } else {
                    const textContent: string = nodes[nodes.length - 1].textContent ? nodes[nodes.length - 1].textContent : '';
                    lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                    if (lasNode && lasNode.nodeName === 'LI' && lasNode.nextSibling && lasNode.nextSibling.nodeName === 'LI') {
                        this.isAnotherLiFromEndLi = textContent === lasNode.textContent ? false : true;
                    }
                    lasNode = isNOU(lasNode) ? preNode : lasNode;
                    nodeSelection.setSelectionText(
                        docElement, preNode, lasNode, 0,
                        (lasNode.nodeType === 3) ? lasNode.textContent.length : lasNode.childNodes.length
                    );
                    range = nodeSelection.getRange(docElement);
                    isSingleNode = false;
                }
            }
        }
        // Clean node content
        this.removingComments(insertedNode as HTMLElement);
        return { preNode, sibNode, lasNode, isSingleNode, range };
    }

    // Examines whether the inserted node contains block element.
    private static containsBlockElements(insertedNode: Node): boolean {
        const allChildNodes: NodeListOf<Node> = insertedNode.childNodes;
        for (let i: number = 0; i < allChildNodes.length; i++) {
            if (CONSTANT.BLOCK_TAGS.indexOf(allChildNodes[i as number].nodeName.toLowerCase()) >= 0) {
                return true;
            }
        }
        return false;
    }

    // Processes inline-only content during paste operations for correct insertion.
    private static handleInlineContent(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeSelection: NodeSelection, docElement: Document,
        editNode: Element, isCursor: boolean, sibNode: Node,
        lasNode: Node, isSingleNode: boolean
    ): Node {
        const fragment: DocumentFragment = document.createDocumentFragment();
        if (!isCursor) {
            return this.handleRegularInlineContent(
                insertedNode, range, fragment, editNode, sibNode,
                lasNode, isSingleNode
            );
        } else {
            return this.handleCursorInlineContent(
                nodes, insertedNode, range, nodeSelection, docElement,
                editNode, fragment
            );
        }
    }

    // Handles paste operations when dealing with non-collapsed inline selections.
    private static handleRegularInlineContent(
        insertedNode: Node, range: Range, fragment: DocumentFragment,
        editNode: Element, sibNode: Node, lasNode: Node,
        isSingleNode: boolean
    ): Node {
        let lastSelectionNode: Node;
        while (insertedNode.firstChild) {
            lastSelectionNode = insertedNode.firstChild;
            fragment.appendChild(insertedNode.firstChild);
        }
        if (isSingleNode) {
            range.deleteContents();
            this.removeEmptyElements(editNode as HTMLElement, true);
            range.insertNode(fragment);
        } else {
            const startContainerParent: Node = editNode === range.startContainer ?
                range.startContainer : range.startContainer.parentNode;
            const startIndex: number = Array.prototype.indexOf.call(
                startContainerParent.childNodes,
                (Browser.userAgent.indexOf('Firefox') !== -1 && editNode === range.startContainer) ?
                    range.startContainer.firstChild : range.startContainer
            );
            range.deleteContents();
            if (startIndex !== -1) {
                range.setStart(startContainerParent, startIndex);
                range.setEnd(startContainerParent, startIndex);
            }
            if (!isNOU(lasNode) && lasNode !== editNode &&
                editNode.childNodes.length > 0 && editNode.childNodes[0] !== lasNode) {
                detach(lasNode);
                this.removeEmptyElements(editNode as HTMLElement, true);
            }
            if (!isNOU(sibNode) && sibNode.parentNode !== editNode.parentNode) {
                if (sibNode.parentNode === editNode) {
                    sibNode.appendChild(fragment);
                } else {
                    sibNode.parentNode.appendChild(fragment);
                }
            } else {
                range.insertNode(fragment);
            }
        }
        return lastSelectionNode;
    }

    // Handles content insertion when the cursor is placed in an inline context without initial selection.
    private static handleCursorInlineContent(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeSelection: NodeSelection, docElement: Document,
        editNode: Element, fragment: DocumentFragment
    ): Node {
        let lastSelectionNode: Node;
        const immediateBlockNode: Node = this.getImmediateBlockNode(range.startContainer, editNode);
        const tempSpan: HTMLElement = createElement('span', { className: 'tempSpan' });
        if (this.shouldInsertInAnchor(range)) {
            this.insertInAnchor(range, tempSpan, editNode);
        } else if (this.isMentionChip(nodes)) {
            range.startContainer.parentElement.insertAdjacentElement('afterend', tempSpan);
        } else if (range.startOffset !== 0 && range.endOffset !== 0 && range.startOffset === range.endOffset
            && !(insertedNode as HTMLElement).querySelector('a') && range.endOffset === range.startContainer.textContent.length && immediateBlockNode.lastChild.contains(range.startContainer)) {
            immediateBlockNode.appendChild(tempSpan);
        } else {
            range.insertNode(tempSpan);
        }
        while (insertedNode.firstChild) {
            lastSelectionNode = insertedNode.firstChild;
            fragment.appendChild(insertedNode.firstChild);
        }
        return this.insertFragmentOrReplaceNode(
            tempSpan, fragment, lastSelectionNode, editNode
        );
    }

    //Determines if content should be inserted within an anchor element based on specified conditions.
    private static shouldInsertInAnchor(range: Range): boolean {
        const nearestAnchor: Element = closest(range.startContainer.parentElement, 'a');
        return range.startContainer.nodeType === 3 &&
            !isNOU(nearestAnchor) &&
            !isNOU(closest(nearestAnchor, 'span'));
    }

    // Specifically inserts nodes inside an anchor tag if conditions are met during paste.
    private static insertInAnchor(range: Range, tempSpan: HTMLElement, editNode: Element): void {
        const immediateBlockNode: Node = this.getImmediateBlockNode(range.startContainer, editNode);
        if ((immediateBlockNode as HTMLElement).querySelectorAll('br').length > 0) {
            detach((immediateBlockNode as HTMLElement).querySelector('br'));
        }
        const rangeElement: Element = closest(closest(range.startContainer.parentElement, 'a'), 'span');
        rangeElement.appendChild(tempSpan);
    }

    // Checks if the node includes a mentions chip for handling special paste scenarios.
    private static isMentionChip(nodes: Node[]): boolean {
        return nodes[0] &&
               nodes[0].nodeName === '#text' &&
               nodes[0].nodeValue.includes('\u200B') &&
               !isNOU(nodes[0].parentElement) &&
               !isNOU(nodes[0].parentElement.previousElementSibling) &&
               nodes[0].parentElement.previousElementSibling.classList.contains('e-mention-chip');
    }

    // Inserts a document fragment at a temporary span position or replaces a specific node.
    private static insertFragmentOrReplaceNode(
        tempSpan: HTMLElement, fragment: DocumentFragment, lastSelectionNode: Node, editNode: Element
    ): Node {
        const matchedElement: HTMLElement = this.getClosestMatchingElement(tempSpan.parentNode as HTMLElement, fragment, editNode);
        const hasMultipleChildNodes: boolean = fragment.firstChild && fragment.firstChild.childNodes.length > 1;
        if (fragment.childNodes.length === 1 && fragment.firstChild && !hasMultipleChildNodes && matchedElement) {
            return this.replaceWithMatchedContent(tempSpan, fragment, lastSelectionNode);
        } else {
            tempSpan.parentNode.replaceChild(fragment, tempSpan);
            return lastSelectionNode;
        }
    }

    // Replaces the temporary node with matched content, adjusting text nodes if required.
    private static replaceWithMatchedContent(tempSpan: HTMLElement, fragment: DocumentFragment, lastSelectionNode: Node): Node {
        const wrapperDiv: HTMLElement = document.createElement('div');
        wrapperDiv.innerHTML = (fragment.firstChild as HTMLElement).innerHTML || '';
        const result: Node = lastSelectionNode;
        if (!isNOU(wrapperDiv.firstChild)) {
            this.addCursorMarker(wrapperDiv, true);
            tempSpan.outerHTML = wrapperDiv.innerHTML;
        }
        wrapperDiv.remove();
        return result;
    }

    // Manages block node insertion during paste operations to align with document structure.
    private static handleBlockNodeContent(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeCutter: NodeCutter, editNode: Element,
        enterAction: string, isCollapsed: boolean
    ): Node {
        const parentElem: Node = this.findParentPreElement(range, editNode);
        if (!isNOU(insertedNode) && !isNOU(parentElem) && parentElem.nodeName === 'PRE') {
            range.insertNode(insertedNode);
            return insertedNode.lastChild;
        } else {
            return this.processBlockContent(
                nodes, insertedNode, range, nodeCutter,
                editNode, enterAction, isCollapsed
            );
        }
    }

    // Finds the nearest parent PRE element starting from the current range container.
    private static findParentPreElement(range: Range, editNode: Element): Node {
        let parentElem: Node = range.startContainer;
        while (!isNOU(parentElem) && parentElem.nodeName !== 'PRE' && parentElem !== editNode) {
            parentElem = parentElem.parentElement;
        }
        return parentElem;
    }

    /* Processes the inserted nodes, preserving initial nodes until first block element,
    then wrapping inline nodes between blocks with appropriate container elements */
    private static processInlineNodesBetweenBlocks(insertedNode: Node, enterAction: string): {fragment: DocumentFragment, lastNode: Node} {
        const fragment: DocumentFragment = document.createDocumentFragment();
        let foundFirstBlock: boolean = false;
        let currentGroup: HTMLElement = null;
        let lastNode: Node = null;
        const tempElement: HTMLElement = createElement('div', {id: 'pasteContent_rte'});
        while (insertedNode.firstChild) {
            const currentNode: Node = insertedNode.firstChild;
            // Skip empty text nodes
            if (currentNode.nodeName === '#text' && currentNode.textContent.trim() === '') {
                detach(currentNode);
                continue;
            }
            // Keep track of last processed node
            lastNode = currentNode;
            // Check if this is a block element
            const isBlockNode: boolean = this.isBlockElement(currentNode);
            if (!foundFirstBlock) {
                // Before first block is encountered, preserve original structure
                if (isBlockNode) {
                    // First block found, change mode
                    foundFirstBlock = true;
                    fragment.appendChild(currentNode);
                } else {
                    tempElement.appendChild(currentNode);
                    fragment.appendChild(tempElement);
                }
            } else {
                // After first block, apply wrapping logic
                if (isBlockNode) {
                    // Add block elements directly, close any open group
                    currentGroup = null;
                    fragment.appendChild(currentNode);
                } else {
                    // Wrap inline/text nodes
                    if (!currentGroup) {
                        // Create new wrapper if needed
                        currentGroup = enterAction === 'DIV' ?
                            createElement('div') : createElement('p');
                        fragment.appendChild(currentGroup);
                    }
                    // Add to current group
                    currentGroup.appendChild(currentNode);
                }
            }
        }
        return {fragment, lastNode};
    }

    // Checks whether the given node is a block element.
    private static isBlockElement(node: Node): boolean {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        const blockTags: string[] = CONSTANT.BLOCK_TAGS;
        const nodeName: string = node.nodeName.toLowerCase();
        for (let i: number = 0; i < blockTags.length; i++) {
            if (blockTags[i as number] === nodeName) {
                return true;
            }
        }
        return false;
    }

    // Processes block elements during insertion, wrapping and positioning elements as needed.
    private static processBlockContent(
        nodes: Node[], insertedNode: Node, range: Range,
        nodeCutter: NodeCutter, editNode: Element,
        enterAction: string, isCollapsed: boolean
    ): Node {
        let lastSelectionNode: Node = null;
        const insertedFragment: {fragment: DocumentFragment, lastNode: Node}  =
            this.processInlineNodesBetweenBlocks(insertedNode, enterAction);
        // Insert a temporary node and get ready to process content
        lastSelectionNode = this.insertTempNode(range, insertedFragment.fragment, nodes, nodeCutter, editNode);
        // Delete existing contents if needed
        if (!this.contentsDeleted) {
            this.cleanupBeforeBlockInsertion(range, editNode, isCollapsed);
        }
        const inlineNodeWrapper: HTMLElement = editNode.querySelector('#pasteContent_rte') as HTMLElement;
        if (!isNOU(inlineNodeWrapper)) {
            this.processFirstInlineNodeSet(inlineNodeWrapper, enterAction);
        }
        return lastSelectionNode;
    }

    // Performs necessary cleanup actions prior to block element insertion, like removing empties.
    private static cleanupBeforeBlockInsertion(range: Range, editNode: Element, isCollapsed: boolean): void {
        if (!isCollapsed &&
            range.startContainer.parentElement.textContent.length === 0 &&
            range.startContainer.nodeName === 'BR' &&
            range.startContainer.parentElement.nodeName === 'P') {
            editNode.removeChild(range.startContainer.parentElement);
        }
        range.deleteContents();
        this.removeEmptyElements(editNode as HTMLElement);
    }

    // Processes and adjusts the first set of inline nodes before any block.
    private static processFirstInlineNodeSet(insertedNode: Node, enterAction: string): Node {
        let lastSelectionNode: Node;
        while (insertedNode.firstChild) {
            lastSelectionNode = insertedNode.firstChild;
            if (this.isInlineElement(lastSelectionNode)) {
                lastSelectionNode = this.handleFirstBlockChild(insertedNode, enterAction);
            } else {
                break; // Prevent infinite loop
            }
        }
        detach(insertedNode);
        return lastSelectionNode;
    }

    // Moves the first set of inline nodes to the previous block element a block.
    private static handleFirstBlockChild(insertedNode: Node, enterAction: string): Node {
        const firstChild: Node = insertedNode.firstChild;
        // Ensure there's a previous element sibling
        if (isNOU((insertedNode as HTMLElement).previousElementSibling)) {
            const firstParaElm: HTMLElement = enterAction === 'DIV' ? createElement('div') : createElement('p');
            (insertedNode as HTMLElement).parentElement.insertBefore(firstParaElm, insertedNode);
        }
        // Insert based on previous sibling type
        if ((insertedNode as HTMLElement).previousElementSibling.nodeName === 'BR') {
            (insertedNode as HTMLElement).parentElement.insertBefore(insertedNode.firstChild, insertedNode);
        } else {
            (insertedNode as HTMLElement).previousElementSibling.appendChild(insertedNode.firstChild);
        }
        return firstChild;
    }

    // Checks if a given node is an inline node.
    private static isInlineElement(node: Node): boolean {
        return node.nodeName === '#text' ||
               (this.inlineNode.indexOf(node.nodeName.toLowerCase()) >= 0);
    }

    // Handles special cases in node structures that require custom processing post-insertion.
    private static processSpecialNodes(lastSelectionNode: Node, insertedNode: Node, enterAction: string): Node {
        if (!lastSelectionNode) {
            return null;
        }
        // Handle Google Sheets HTML
        if (lastSelectionNode instanceof Element && lastSelectionNode.nodeName === 'GOOGLE-SHEETS-HTML-ORIGIN') {
            return this.processGoogleSheetsTable(lastSelectionNode);
        }
        // Handle table nodes to insert paragraphs after tables if there is no content after table.
        if (lastSelectionNode.nodeName === 'TABLE') {
            return this.addParagraphAfterTable(lastSelectionNode, enterAction);
        }
        return lastSelectionNode;
    }

    // Processes table nodes that originate from Google Sheets for alignment adjustments.
    private static processGoogleSheetsTable(node: Element): Node {
        const tableEle: HTMLTableElement | null = node.querySelector('table');
        const colGroup: HTMLElement | null = tableEle.querySelector('colgroup');
        if (colGroup) {
            for (let i: number = 0; i < tableEle.rows.length; i++) {
                for (let k: number = 0; k < tableEle.rows[i as number].cells.length; k++) {
                    const col: HTMLElement = colGroup.querySelectorAll('col')[k as number];
                    if (col && col.hasAttribute('width')) {
                        const width: string = col.getAttribute('width');
                        tableEle.rows[i as number].cells[k as number].style.width = width + 'px';
                    }
                }
            }
        }
        return node;
    }

    // Inserts a paragraph after a table node to ensure continuity in the document.
    private static addParagraphAfterTable(tableNode: Node, enterAction: string): Node {
        const pTag: HTMLElement = createElement(enterAction === 'DIV' ? 'div' : 'p');
        pTag.appendChild(createElement('br'));
        tableNode.parentElement.insertBefore(pTag, tableNode.nextSibling);
        return pTag;
    }

    // Positions the editor cursor appropriately after completing a paste operation.
    private static positionCursorAfterPaste(
        lastSelectionNode: Node, insertedNode: Node,
        nodeSelection: NodeSelection, docElement: Document,
        editNode: Element, enterAction: string
    ): void {
        if (!lastSelectionNode) {
            return;
        }
        if (lastSelectionNode.nodeName === '#text') {
            this.placeCursorEnd(lastSelectionNode, insertedNode, nodeSelection, docElement, editNode);
        } else if (lastSelectionNode.nodeName === 'HR') {
            this.handleHRElementCursor(lastSelectionNode, nodeSelection, docElement, enterAction);
        } else if (editNode.contains(lastSelectionNode) && isNOU(editNode.querySelector('.paste-cursor'))) {
            this.cursorPos(lastSelectionNode, insertedNode, nodeSelection, docElement, editNode);
        } else {
            this.handleListElementCursor(insertedNode, editNode, nodeSelection, docElement);
        }
    }

    private static handleListElementCursor(insertedNode: Node, editNode: Element,
                                           nodeSelection: NodeSelection, docElement: Document): void {
        const cursorElm: HTMLElement = editNode.querySelector('.paste-cursor');
        const nodeList: NodeListOf<HTMLElement> = editNode.querySelectorAll('.pasteContent_RTE');
        const brElement: HTMLBRElement | null = editNode.querySelector('br.rte-temp-br');
        if (!isNOU(cursorElm)) {
            nodeSelection.setCursorPoint(docElement, cursorElm, 0);
            cursorElm.remove();
        }
        else if (nodeList.length > 0) {
            const lastElement: HTMLElement = nodeList[nodeList.length - 1];
            this.cursorPos(lastElement, insertedNode, nodeSelection, docElement, editNode);
        }
        else if (!isNOU(brElement)) {
            nodeSelection.setCursorPoint(docElement, brElement, 0);
        }
    }

    // Handles cursor placement after inserting horizontal rule elements in the document.
    private static handleHRElementCursor(
        lastSelectionNode: Node,
        nodeSelection: NodeSelection,
        docElement: Document,
        enterAction?: string
    ): Node {
        let nextSiblingNode: Node = lastSelectionNode.nextSibling;
        while (nextSiblingNode && nextSiblingNode.nodeName === '#text' && nextSiblingNode.textContent.trim() === '') {
            nextSiblingNode = nextSiblingNode.nextSibling;
        }
        const siblingTag: HTMLElement = createElement(enterAction === 'DIV' ? 'div' : 'p');
        siblingTag.appendChild(createElement('br'));
        let parentNode: Node = lastSelectionNode.parentNode;
        if (nextSiblingNode && (nextSiblingNode.nodeName === 'HR' || nextSiblingNode.nodeName === 'TABLE')) {
            parentNode.insertBefore(siblingTag, nextSiblingNode);
            lastSelectionNode = siblingTag;
        } else if (parentNode && parentNode.nodeName === 'LI') {
            let currentNode: Node = lastSelectionNode.nextSibling;
            // Traverse through siblings of the <hr> to find a valid non-empty node
            while (currentNode && (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim() === '')) {
                currentNode = currentNode.nextSibling;
            }
            // If no valid sibling is found, move up to the parent and check for the parent's siblings
            while (!currentNode && parentNode) {
                if (parentNode && (parentNode.nodeName === 'OL' || parentNode.nodeName === 'UL' || parentNode.nodeName === 'LI' || parentNode.nodeName === 'BLOCKQUOTE')) {
                    currentNode = parentNode.nextSibling;
                    // Traverse parent's siblings
                    while (currentNode && (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim() === '')) {
                        currentNode = currentNode.nextSibling;
                    }
                }
                parentNode = parentNode.parentNode;
            }
            if (isNOU(currentNode)) {
                lastSelectionNode.parentNode.appendChild(siblingTag);
            }
            lastSelectionNode = currentNode ? currentNode : siblingTag;
        } else if (nextSiblingNode) {
            const firstChildElement: HTMLElement = nextSiblingNode.firstChild as HTMLElement;
            if (firstChildElement && firstChildElement.nodeName !== '#text' && firstChildElement.hasAttribute('class') && firstChildElement.classList.contains('rte-temp-br')) {
                (nextSiblingNode.firstChild as HTMLElement).removeAttribute('class');
            }
            lastSelectionNode = nextSiblingNode;
        } else {
            parentNode.appendChild(siblingTag);
            parentNode.insertBefore(lastSelectionNode, siblingTag);
            lastSelectionNode = siblingTag;
        }
        nodeSelection.setSelectionText(docElement, lastSelectionNode, lastSelectionNode, 0, 0);
        return lastSelectionNode;
    }

    // Compares two elements to ensure they are equivalent in terms of tag and relevant attributes.
    private static compareParentElements(el1: HTMLElement | null, el2: HTMLElement | null): boolean {
        if (!el1 || !el2) {
            return false;
        }
        if (el1.tagName !== el2.tagName) {
            return false;
        }
        return this.getFilteredAttributes(el1) === this.getFilteredAttributes(el2);
    }

    // Retrieves attributes of an element, filtering out the non-relevant ones for comparison.
    private static getFilteredAttributes(element: HTMLElement): string {
        return Array.from(element.attributes)
            .map((attr: Attr): string => {
                if (attr.name === 'class') {
                    const filteredClass: string = attr.value.split(' ')
                        .filter((cls: string) => cls !== 'pasteContent_RTE')
                        .join(' ');
                    return filteredClass ? `class='${filteredClass}'` : '';
                }
                return `${attr.name}='${attr.value}'`;
            })
            .filter((attr: string) => attr.length > 0)
            .sort()
            .join(' ');
    }

    // Identifies the closest matching element in the document fragment from the current node.
    private static getClosestMatchingElement(startNode: HTMLElement | null, fragment: DocumentFragment,
                                             editNode: Element): HTMLElement | null {
        let currentNode: HTMLElement | null = startNode;
        while (currentNode && !currentNode.contains(editNode)) {
            const matchingPastedNode: HTMLElement | null = this.findMatchingChild(fragment, currentNode);
            if (matchingPastedNode) {
                return currentNode;
            }
            currentNode = currentNode.parentElement;
        }
        return null;
    }

    // Finds a child within a parent container that matches the target node by structural properties.
    private static findMatchingChild(fragment: ParentNode, targetNode: HTMLElement): HTMLElement | null {
        for (const node of Array.from(fragment.children) as HTMLElement[]) {
            if (this.compareParentElements(node, targetNode)) {
                return node;
            }
            const deeperMatch: HTMLElement | null = this.findMatchingChild(node, targetNode);
            if (deeperMatch) {
                return deeperMatch;
            }
        }
        return null;
    }

    // Executes cleanup operations on lists to ensure consistency after paste operation.
    private static listCleanUp(nodeSelection: NodeSelection, docElement: Document): void {
        const range: Range = nodeSelection.getRange(docElement);
        const startContainer: Node = range.startContainer;
        const startOffset: number = range.startOffset;
        const startParentElement: HTMLElement = range.startContainer.parentElement;
        const endParentElement: HTMLElement = range.endContainer.parentElement;
        if (!isNOU(startParentElement) && !isNOU(endParentElement)) {
            const startClosestList: HTMLElement = startParentElement.closest('ol, ul') as HTMLElement;
            const endClosestList: HTMLElement = endParentElement.closest('ol, ul') as HTMLElement;
            if (!isNOU(startClosestList) && !isNOU(endClosestList)) {
                const hasListCleanUp: boolean = this.cleanUpListItems(startClosestList);
                const hasListContainerCleanUp: boolean = this.cleanUpListContainer(startClosestList);
                if (hasListCleanUp || hasListContainerCleanUp) {
                    range.setStart(startContainer, startOffset);
                    range.setEnd(startContainer, startOffset);
                }
            }
        }
    }

    // Cleans up list items to restore structural integrity and resolve any post-paste issues.
    private static cleanUpListItems(parentContainer: HTMLElement): boolean {
        let hasListCleanUp: boolean = false;
        let listItems: NodeListOf<HTMLLIElement>;
        if (!isNOU(parentContainer.closest('ol, ul'))){
            listItems = parentContainer.closest('ol, ul').querySelectorAll('li');
        }
        if (isNOU(listItems) || listItems.length === 0) {
            return false;
        }
        let nearestListItem: HTMLElement | null = null;
        listItems.forEach((listItem: HTMLLIElement) => {
            const parentElement: HTMLElement = listItem.parentElement as HTMLElement;
            if (!isNOU(parentElement) && parentElement.nodeName !== 'OL' && parentElement.nodeName !== 'UL') {
                if (isNOU(nearestListItem)) {
                    nearestListItem = parentElement.closest('li');
                }
                if (!isNOU(nearestListItem)) {
                    const nextSibling: HTMLElement = listItem.nextSibling as HTMLElement;
                    if (!isNOU(nextSibling) && nextSibling.nodeName !== 'LI') {
                        const startIndex: number = Array.prototype.indexOf.call(parentElement.childNodes, nextSibling);
                        const clonedParent: HTMLElement = parentElement.cloneNode(false) as HTMLElement;
                        const totalChildren: number = parentElement.childNodes.length;
                        for (let i: number = startIndex; i < totalChildren; i++) {
                            clonedParent.appendChild(parentElement.childNodes[startIndex as number]);
                        }
                        if (clonedParent.childNodes.length > 0) {
                            const newListItem: HTMLElement = document.createElement('li');
                            newListItem.appendChild(clonedParent);
                            nearestListItem.insertAdjacentElement('afterend', newListItem);
                        } else {
                            (clonedParent as HTMLElement).remove();
                        }
                    }
                    const closestList: Element | null = parentElement.closest('ol, ul');
                    nearestListItem.insertAdjacentElement('afterend', listItem);
                    nearestListItem = nearestListItem.nextSibling as HTMLElement;
                    if (!isNOU(closestList)) {
                        this.removeEmptyElements(closestList as HTMLElement);
                    }
                    hasListCleanUp = true;
                }
            }
        });
        const cleanUpFlattenListContainer: boolean = this.cleanUpFlattenListContainer(parentContainer);
        hasListCleanUp = cleanUpFlattenListContainer ? cleanUpFlattenListContainer : hasListCleanUp;
        return hasListCleanUp;
    }

    // Manages cleanup processes for deeply nested list elements as necessary.
    private static cleanUpFlattenListContainer(parentContainer: HTMLElement): boolean {
        let hasListCleanUp: boolean = false;
        let listItems: NodeListOf<HTMLLIElement>;
        if (!isNOU(parentContainer.closest('ol, ul'))) {
            listItems = parentContainer.closest('ol, ul').querySelectorAll('li');
        }
        if (isNOU(listItems) || listItems.length === 0) {
            return false;
        }
        listItems.forEach((listItem: HTMLLIElement) => {
            if (!isNOU(listItem.firstChild) && (listItem.firstChild.nodeName === 'OL' || listItem.firstChild.nodeName === 'UL')) {
                listItem.style.listStyleType = 'none';
            }
            const nestedLi: HTMLLIElement = Array.from(listItem.children).find((child: HTMLElement) =>
                child.tagName === 'LI' && (child.parentElement && child.parentElement.tagName !== 'OL' && child.parentElement.tagName !== 'UL')
            ) as HTMLLIElement;
            if (!isNOU(nestedLi) && !isNOU(listItem.parentNode)) {
                listItem.parentNode.replaceChild(nestedLi, listItem);
                if (isNOU(nestedLi.textContent) || nestedLi.textContent.trim() === '') {
                    nestedLi.remove();
                }
                hasListCleanUp = true;
            }
        });
        return hasListCleanUp;
    }

    // Resolves inconsistencies within list containers, ensuring no stray elements are left.
    private static cleanUpListContainer(parentList: HTMLElement): boolean {
        let hasListContainerCleanUp: boolean = false;
        let nonLiElementCollection: ChildNode[] = [];
        const replacements: { elements: ChildNode[] }[] = [];
        if (!isNOU(parentList)) {
            for (let i: number = 0; i < parentList.childNodes.length; i++) {
                const childNode: ChildNode = parentList.childNodes[i as number];
                const isListNode: boolean = ['UL', 'OL'].indexOf(childNode.nodeName) !== -1;
                const hasEmptyTextSibling: boolean = isNOU(childNode.previousSibling) || (childNode.previousSibling &&
                    childNode.previousSibling.nodeType === Node.TEXT_NODE &&
                    childNode.previousSibling.textContent.trim() === '');
                const prevElement: Element = (childNode as HTMLElement).previousElementSibling;
                const isPrevLi: boolean = prevElement && prevElement.nodeName.toUpperCase() === 'LI';
                if (isListNode && hasEmptyTextSibling && isPrevLi) {
                    prevElement.appendChild(childNode);
                    this.cleanUpListContainer(childNode as HTMLElement);
                    i--;
                } else if ((childNode as HTMLElement).nodeName.toLocaleUpperCase() !== 'LI') {
                    nonLiElementCollection.push(childNode);
                }
                if (((childNode as HTMLElement).nodeName.toLocaleUpperCase() === 'LI' || parentList.lastChild === childNode) && nonLiElementCollection.length > 0) {
                    replacements.push({ elements: [...nonLiElementCollection] });
                    nonLiElementCollection = [];
                }
            }
            replacements.forEach(({ elements }: { elements: ChildNode[] }) => {
                const newListItem: HTMLElement = document.createElement('li');
                elements[0].parentNode.replaceChild(newListItem, elements[0]);
                elements.forEach((child: HTMLElement) => newListItem.appendChild(child));
                if (newListItem.textContent && newListItem.textContent.trim() === '' && !newListItem.querySelector('img')) {
                    parentList.removeChild(newListItem);
                }
                hasListContainerCleanUp = true;
            });
        }
        return hasListContainerCleanUp;
    }

    // Moves the cursor to the end of the content node, ensuring proper placement.
    private static placeCursorEnd(
        lastSelectionNode: Node, insertedNode: Node, nodeSelection: NodeSelection, docElement: Document, editNode?: Element): void {
        while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
        lastSelectionNode.nodeName !== 'BR' && lastSelectionNode.nodeName !== 'HR') {
            if (!isNOU(lastSelectionNode.lastChild) && (lastSelectionNode.lastChild.nodeName === 'P' &&
                (lastSelectionNode.lastChild as HTMLElement).innerHTML === '')) {
                const lineBreak: HTMLElement = createElement('br');
                lastSelectionNode.lastChild.appendChild(lineBreak);
            }
            lastSelectionNode = lastSelectionNode.lastChild;
        }
        lastSelectionNode = isNOU(lastSelectionNode) ? insertedNode : lastSelectionNode;
        if (lastSelectionNode.nodeName === 'IMG') {
            this.imageFocus(lastSelectionNode, nodeSelection, docElement);
        } else {
            nodeSelection.setSelectionText(
                docElement, lastSelectionNode, lastSelectionNode,
                lastSelectionNode.textContent.length, lastSelectionNode.textContent.length);
        }
        this.removeEmptyElements(editNode as HTMLElement);
    }

    // Retrieves a collection of nodes from the current selection range for insertion purposes.
    private static getNodeCollection (range: Range, nodeSelection: NodeSelection, insertedNode: Node): Node[] {
        let nodes: Node[] = [];
        if (range.startOffset === range.endOffset && range.startContainer === range.endContainer &&
            range.startContainer.nodeName !== 'BR' && range.startContainer.childNodes.length > 0 &&
            (range.startContainer.nodeName === 'TD' || (range.startContainer.nodeType !== 3 &&
            (insertedNode as HTMLElement).classList && (insertedNode as HTMLElement).classList.contains('pasteContent')))) {
            nodes.push(range.startContainer.childNodes[range.endOffset]);
        } else {
            nodes = nodeSelection.getInsertNodeCollection(range);
        }
        return nodes;
    }

    // Inserts a temporary node at the appropriate position based on range state and node types.
    private static insertTempNode(range: Range, insertedNode: Node, nodes: Node[], nodeCutter: NodeCutter, editNode?: Element): Node {
        let lastSelectionNode: Node = insertedNode.lastChild;
        // Handle insertion after a TABLE when selection is at editor root
        if (this.shouldInsertAfterTable(range, editNode)) {
            this.insertNodeAfterTable(range.startContainer, insertedNode, range.endOffset - 1);
            return lastSelectionNode;
        }
        // Handle insertion before a TABLE when selection is at editor root
        if (this.shouldInsertBeforeTable(range, editNode)) {
            this.insertNodeBeforeTable(range.startContainer, insertedNode, range.startOffset);
            return lastSelectionNode;
        }
        // Handle insertion at the end of editor when table is at cursor
        if (this.shouldAppendAfterTableAtCursor(range, editNode)) {
            range.startContainer.appendChild(insertedNode);
            return lastSelectionNode;
        }
        // Standard insertion cases
        lastSelectionNode = this.handleStandardNodeInsertion(range, insertedNode, nodes, nodeCutter, editNode);
        return lastSelectionNode;
    }

    // Checks if we should insert after a table element at editor root.
    private static shouldInsertAfterTable(range: Range, editNode: Element): boolean {
        const startContainer: Node = range.startContainer.nodeType === Node.TEXT_NODE
            ? range.startContainer.parentNode
            : range.startContainer;
        return ( startContainer === editNode || (startContainer as HTMLElement).closest('table')) &&
            !isNOU(startContainer.childNodes[range.endOffset - 1]) &&
            startContainer.childNodes[range.endOffset - 1].nodeName === 'TABLE';
    }

    // Inserts node after a table element.
    private static insertNodeAfterTable(container: Node, insertedNode: Node, index: number): void {
        if (isNOU(container.childNodes[index as number].nextSibling)) {
            container.appendChild(insertedNode);
        } else {
            container.insertBefore(insertedNode, container.childNodes[index as number].nextSibling);
        }
    }

    private static shouldInsertBeforeTable(range: Range, editNode: Element): boolean {
        return range.startContainer === editNode &&
            !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            range.startContainer.childNodes[range.startOffset].nodeName === 'TABLE';
    }

    private static insertNodeBeforeTable(container: Node, insertedNode: Node, index: number): void {
        if (index >= 0 && index < container.childNodes.length) {
            container.insertBefore(insertedNode, container.childNodes[index as number]);
        } else {
            container.appendChild(insertedNode);
        }
    }

    // Checks if we should append after a table at cursor position
    private static shouldAppendAfterTableAtCursor(range: Range, editNode: Element): boolean {
        return range.startContainer === editNode &&
            !isNOU(range.startContainer.childNodes[range.endOffset]) &&
            range.startContainer.childNodes[range.endOffset].nodeName === 'TABLE';
    }

    // Handles standard node insertion cases.
    private static handleStandardNodeInsertion(
        range: Range, insertedNode: Node, nodes: Node[],
        nodeCutter: NodeCutter, editNode: Element
    ): Node {
        // Find appropriate block node for insertion
        let blockNode: Node = this.findBlockNodeForInsertion(range, nodes, editNode);
        // Handle list-specific processing for inserted nodes
        this.processListItemsInNode(blockNode, insertedNode, editNode);
        const lastSelectionNode: Node = insertedNode.lastChild;
        // Handle table cell insertion
        if (this.isTableCellNode(blockNode)) {
            this.insertInTableCell(range, insertedNode, blockNode, nodeCutter);
            return lastSelectionNode;
        }
        const emptyBlockEle: HTMLElement | null = this.isHorizontalRuleInEmptyBlock(lastSelectionNode, range);
        // When inserting HR and selection is in a P/DIV with only BR
        if (!isNOU(emptyBlockEle)) {
            const containerParent: Node = emptyBlockEle.parentNode;
            containerParent.replaceChild(insertedNode, emptyBlockEle);
            return lastSelectionNode;
        }
        // Handle media elements
        if (this.isMediaElement(blockNode)) {
            blockNode = range.startContainer;
        }
        // Handle other insertion cases
        this.handleRegularInsertion(range, insertedNode, blockNode, nodeCutter, editNode);
        return lastSelectionNode;
    }

    // Finds appropriate block node for insertion.
    private static findBlockNodeForInsertion(range: Range, nodes: Node[], editNode: Element): Node {
        let blockNode: Node = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
        // Fallback to range end container if no block node found
        if ((isNOU(blockNode) || isNOU(blockNode.parentElement)) && range.endContainer.nodeType !== 3) {
            blockNode = range.endContainer;
            range.setEnd(blockNode, range.endContainer.textContent.length);
        }
        // Special handling for body/div block nodes
        if (blockNode && (
            blockNode.nodeName === 'BODY' ||
            (blockNode.nodeName === 'DIV' && range.startContainer === range.endContainer && range.startContainer.nodeType === 1)
        )) {
            blockNode = range.startContainer;
        }
        return blockNode;
    }

    // Processes list items in a node being inserted inside a list context.
    private static processListItemsInNode(blockNode: Node, insertedNode: Node, editNode: Element): void {
        this.wrapUnstructedLiWithUl(insertedNode);
        // Only process if we're in a list item and inserting a list
        if (!this.shouldProcessListItems(blockNode, insertedNode, editNode)) {
            return;
        }
        let liNode: HTMLElement;
        const insertedNodeAsHtml: HTMLElement  = insertedNode as HTMLElement;
        // Extract LI elements from the list and normalize their styles
        while (!isNOU(insertedNodeAsHtml.firstElementChild) &&
            insertedNodeAsHtml.firstElementChild.lastElementChild &&
            insertedNodeAsHtml.firstElementChild.lastElementChild.tagName === 'LI') {
            liNode = insertedNodeAsHtml.firstElementChild.lastElementChild as HTMLElement;
            this.removeChecklistStyle(blockNode, liNode);
            this.removeListItemMargins(liNode);
            insertedNodeAsHtml.firstElementChild.insertAdjacentElement('afterend', liNode);
        }
    }
    /*
    * Wraps loose `<li>` elements within a `<ul>` container to ensure proper list structure.
    */
    private static wrapUnstructedLiWithUl(insertedNode: Node): void {
        const orphanLIs: HTMLLIElement[] = Array.from((insertedNode as HTMLElement).querySelectorAll('li')).filter((li: HTMLLIElement) => {
            return ['UL', 'OL'].indexOf(li.parentNode.nodeName) === -1;
        });
        let ul: HTMLElement | null = null;
        let siblingFlag: boolean;
        for (let i: number = 0; i < orphanLIs.length; i++) {
            const currentLi: HTMLLIElement = orphanLIs[i as number];
            const isSibling: boolean = orphanLIs[i + 1] && currentLi.nextSibling === orphanLIs[i + 1];
            if (isNOU(ul) || !siblingFlag) {
                ul = createElement('ul');
                insertedNode.insertBefore(ul, currentLi);
            }
            ul.appendChild(currentLi);
            siblingFlag = isSibling;
        }
    }
    /*
    * Removes checklist-specific inline styles from a pasted list item (`<li>`).
    */
    private static removeChecklistStyle(blockNode: Node, liNode: HTMLElement): void {
        if (blockNode.nodeName === 'LI' && (blockNode as HTMLElement).parentElement &&
            ((blockNode as HTMLElement).parentElement.nodeName === 'UL' || (blockNode as HTMLElement).parentElement.nodeName === 'OL')
        ) {
            liNode.style.removeProperty('list-style');
            liNode.style.removeProperty('position');
            if (liNode.getAttribute('style') === '') {
                liNode.removeAttribute('style');
            }
        }
    }
    // Checks if we should process list items in the node.
    private static shouldProcessListItems(blockNode: Node, insertedNode: Node, editNode: Element): boolean {
        return blockNode &&
            blockNode.nodeName !== '#text' &&
            (blockNode as HTMLElement).closest('LI') &&
            editNode.contains((blockNode as HTMLElement).closest('LI')) &&
            blockNode.nodeName !== 'TD' &&
            blockNode.nodeName !== 'TH' &&
            blockNode.nodeName !== 'TR' &&
            insertedNode &&
            (insertedNode as HTMLElement).firstElementChild &&
            ((insertedNode as HTMLElement).firstElementChild.tagName === 'OL' ||
            (insertedNode as HTMLElement).firstElementChild.tagName === 'UL');
    }

    // Removes margin properties from a list item
    private static removeListItemMargins(liNode: HTMLElement): void {
        liNode.style.removeProperty('margin-left');
        liNode.style.removeProperty('margin-top');
        liNode.style.removeProperty('margin-bottom');
        if (liNode.getAttribute('style') === '') {
            liNode.removeAttribute('style');
        }
    }

    // Checks if the node is a table cell
    private static isTableCellNode(blockNode: Node): boolean {
        if (!blockNode) {
            return false;
        }
        const nodeName: string = blockNode.nodeName;
        return nodeName === 'TD' || nodeName === 'TH' || nodeName === 'TR' || nodeName === 'TABLE';
    }

    // Handles insertion in a table cell.
    private static insertInTableCell(range: Range, insertedNode: Node, blockNode: Node, nodeCutter: NodeCutter): void {
        let parentElem: Node = range.startContainer;
        // Check if parentElem is TD or TH and contains only a BR element
        if ((parentElem.nodeName === 'TD' || parentElem.nodeName === 'TH') && parentElem.childNodes.length === 1 && parentElem.firstChild.nodeName === 'BR') {
            // Replace BR with HR
            parentElem.replaceChild(insertedNode, parentElem.firstChild);
            this.contentsDeleted = true;
            return;  // Exit the function after directly replacing
        }
        // Find direct child of the table cell
        while (!isNOU(parentElem) && parentElem.parentElement !== blockNode) {
            parentElem = parentElem.parentElement as Node;
        }
        range.deleteContents();
        const splitedElm: Node = nodeCutter.GetSpliceNode(range, parentElem as HTMLElement);
        if (splitedElm) {
            splitedElm.parentNode.replaceChild(insertedNode, splitedElm);
        } else {
            range.insertNode(insertedNode);
        }
        this.contentsDeleted = true;
    }

    // Handles regular insertion cases.
    private static handleRegularInsertion(
        range: Range, insertedNode: Node, blockNode: Node,
        nodeCutter: NodeCutter, editNode: Element): void {
        const nodeSelection: NodeSelection = new NodeSelection(editNode as HTMLElement);
        const currentNodes: Node[] = this.getNodeCollection(range, nodeSelection, insertedNode);
        const currentNode: Node = currentNodes[currentNodes.length - 1];
        let splitedElm: Node;
        // Check if the node is an empty special node (BR, HR, or empty text in LI).
        if (this.isEmptySpecialNode(currentNode)) {
            splitedElm = currentNode;
            if (this.handleEmptySpecialNodeInsertion(range, insertedNode, currentNode)) {
                return; // Only return if fully handled.
            }
        }
        // Check if the node is text or BR in a list item with content.
        else if (this.isTextOrBrInListItem(currentNode, blockNode, editNode)) {
            splitedElm = currentNode;
            if (this.handleTextInListItem(range, insertedNode, currentNode, blockNode, nodeCutter, editNode)) {
                return; // Only return if fully handled.
            }
        }
        // Handle regular node insertion.
        else {
            splitedElm = this.getSplitElementForInsertion(range, nodeCutter, blockNode);
        }
        if (!isNOU(splitedElm) && splitedElm === editNode) {
            range.deleteContents();
            this.removeEmptyElements(editNode as HTMLElement);
            range.insertNode(insertedNode);
            this.contentsDeleted = true;
        }
        else if (splitedElm && splitedElm.nodeType === Node.ELEMENT_NODE && range.toString() === '' &&
            (splitedElm as Element).querySelector('img, video, audio') !== null) {
            splitedElm.parentNode.insertBefore(insertedNode, splitedElm);
        }
        else {
            // Common replacement logic for all paths that don't return early.
            splitedElm.parentNode.replaceChild(insertedNode, splitedElm);
        }
    }

    // Checks if the node is an empty special node (BR, HR or empty text in LI).
    private static isEmptySpecialNode(currentNode: Node): boolean {
        return !!currentNode &&
            ((currentNode.nodeName === 'BR' || currentNode.nodeName === 'HR' ||
                (currentNode.nodeName === '#text' &&
                !isNOU(currentNode.parentElement) &&
                currentNode.parentElement.nodeName === 'LI')) &&
                (!isNOU(currentNode.parentElement) &&
                currentNode.parentElement.textContent.trim().length === 0));
    }

    // Handles insertion when the current node is an empty special node.
    private static handleEmptySpecialNodeInsertion(range: Range, insertedNode: Node, currentNode: Node): boolean {
        if (currentNode.parentElement.nodeName === 'LI' &&
            !isNOU(currentNode.nextSibling) &&
            currentNode.nextSibling.nodeName === 'BR') {
            detach(currentNode.nextSibling);
        }
        if ((currentNode.parentElement.nodeName === 'LI' || currentNode.parentElement.closest('li')) &&
            currentNode.parentElement.textContent === '') {
            this.removeListfromPaste(range);
            if (currentNode.parentElement.childNodes.length === 1 &&
                currentNode.nodeName === 'BR') {
                detach(currentNode);
            }
            const filteredChildNodes: Node[] = Array.from(insertedNode.childNodes).filter((child: Node) => {
                return !(child.nodeName === 'LI' || child.nodeName === 'UL' || child.nodeName === 'OL');
            });
            const insertNodes: Node[] = this.extractChildNodes(insertedNode);
            if (filteredChildNodes.length > 0 && insertNodes.length > 1) {
                this.insertBlockNodesInLI(insertNodes, range);
            } else {
                const startContainerParent: HTMLElement = range.startContainer.parentElement;
                const nextSibling: Element = startContainerParent.nextElementSibling;
                if (range.startContainer.nodeName === 'DIV' && startContainerParent &&
                    startContainerParent.nodeName === 'LI' && startContainerParent.parentNode) {
                    startContainerParent.parentNode.insertBefore(insertedNode, nextSibling);
                    detach(startContainerParent); // Detach the parent element after inserting
                } else {
                    range.insertNode(insertedNode);
                }
            }
            this.contentsDeleted = true;
            return true; // Indicate we've fully handled this case.
        }
        return false; // Not fully handled, proceed to common replacement.
    }

    // Extracts child nodes of a node.
    private static extractChildNodes(node: Node): Node[] {
        const children: Node[] = [];
        for (let i: number = 0; i < node.childNodes.length; i++) {
            children.push(node.childNodes.item(i));
        }
        return children;
    }

    // Inserts a block nodes in separate list items.
    private static insertBlockNodesInLI(children: Node[], range: Range): void {
        children = this.processInsertNodes(children);
        const fragment: DocumentFragment = document.createDocumentFragment();
        for (const block of children) {
            const newLi: HTMLElement = createElement('li');
            newLi.appendChild(block.cloneNode(true));
            fragment.appendChild(newLi);
        }
        this.unwrapInlineWrappers(fragment);
        const startContainerParent: HTMLElement = range.startContainer.parentElement;
        const nextSibling: Element = startContainerParent.nextElementSibling;
        if (range.startContainer.nodeName === 'DIV' && startContainerParent &&
            startContainerParent.nodeName === 'LI' && startContainerParent.parentNode) {
            startContainerParent.parentNode.insertBefore(fragment, nextSibling);
            detach(startContainerParent); // Detach the parent element after inserting
        } else {
            range.insertNode(fragment);
        }
    }

    // Processes and adjusts the child nodes before any block.
    private static processInsertNodes(children: Node[]): Node[] {
        const result: Node[] = [];
        let inlineGroup: Node[] = [];
        for (const child of children) {
            const isBlock: boolean = child.nodeType === Node.ELEMENT_NODE &&
                CONSTANT.BLOCK_TAGS.indexOf((child as HTMLElement).nodeName.toLowerCase()) !== -1;
            if (isBlock) {
                if (inlineGroup.length > 0) {
                    result.push(this.wrapInlineElementsInSpan(inlineGroup));
                    inlineGroup = [];
                }
                result.push(child);
            } else {
                inlineGroup.push(child);
            }
        }
        if (inlineGroup.length > 0) {
            result.push(this.wrapInlineElementsInSpan(inlineGroup));
        }
        return result;
    }

    // Wraps inline elements in a span.
    private static wrapInlineElementsInSpan(inlineNodes: Node[]): HTMLElement {
        const wrapper: HTMLElement = createElement('span');
        wrapper.className = 'inline-wrapper';
        inlineNodes.forEach((node: Node) => wrapper.appendChild(node));
        return wrapper;
    }

    // Unwraps inline wrappers
    private static unwrapInlineWrappers(root: Node): void {
        const wrappers: NodeListOf<HTMLElement> = (root as HTMLElement).querySelectorAll('.inline-wrapper');
        wrappers.forEach((wrapper: HTMLElement) => {
            const parent: Node = wrapper.parentNode;
            if (!parent) {
                return;
            }
            while (wrapper.firstChild) {
                parent.insertBefore(wrapper.firstChild, wrapper);
            }
            parent.removeChild(wrapper);
        });
    }

    // Remove empty list items after start LI
    private static removeEmptyAfterStartLI(liElement: HTMLElement, editNode: HTMLElement): void {
        this.clearIfCompletelyEmpty(liElement);
        const rootList: HTMLElement = this.getRootList(liElement, editNode);
        if (!rootList) {
            return;
        }
        const listItems: NodeListOf<HTMLLIElement> = rootList.querySelectorAll('li');
        listItems.forEach((item: HTMLLIElement) => {
            if (this.isRemovableEmptyListItem(item, liElement)) {
                detach(item);
            }
        });
    }

    // Clear if completely empty
    private static clearIfCompletelyEmpty(liElement: HTMLElement): void {
        if (liElement.textContent.length === 0 && !liElement.querySelector('audio,video,img,table,br,hr')) {
            liElement.innerHTML = '';
        }
    }

    // Get root list
    private static getRootList(li: HTMLElement, editNode: HTMLElement): HTMLElement | null {
        let rootList: HTMLElement = closest(li, 'ul,ol') as HTMLElement;
        while (rootList && rootList.parentElement && editNode.contains(rootList.parentElement)) {
            const parentRootList: HTMLElement = closest(rootList.parentElement, 'ul,ol') as HTMLElement;
            if (editNode.contains(parentRootList)) {
                rootList = parentRootList;
            } else {
                return rootList;
            }
        }
        return rootList || null;
    }

    // Remove empty list items
    private static isRemovableEmptyListItem(item: HTMLLIElement, skipElement: HTMLElement): boolean {
        return item !== skipElement &&
            item.textContent.trim() === '' &&
            !item.querySelector('audio,video,img,table,br,hr');
    }

    // Checks if the node is a text or BR node in a list item.
    private static isTextOrBrInListItem(currentNode: Node, blockNode: Node, editNode: Element): boolean {
        return currentNode &&
            ((currentNode.nodeName === '#text' || currentNode.nodeName === 'BR' || currentNode.nodeName === 'HR') &&
                !isNOU(currentNode.parentElement) &&
                (currentNode.parentElement.nodeName === 'LI' ||
                currentNode.parentElement.closest('LI') ||
                (blockNode === editNode && currentNode.parentElement === blockNode)) &&
                currentNode.parentElement.textContent.trim().length > 0);
    }

    // Handles insertion when the current node is text in a list item.
    private static handleTextInListItem(range: Range, insertedNode: Node, currentNode: Node,
                                        parentNode: Node, nodeCutter: NodeCutter, editNode: Element): boolean {
        if (currentNode.parentElement.nodeName === 'LI' &&
            !isNOU(currentNode.nextSibling) &&
            currentNode.nextSibling.nodeName === 'BR') {
            detach(currentNode.nextSibling);
        }
        const filteredChildNodes: Node[] = Array.from(insertedNode.childNodes).filter((child: Node) => {
            return !(child.nodeName === 'LI' || child.nodeName === 'UL' || child.nodeName === 'OL');
        });
        const mergeNode: Node = currentNode.parentElement;
        let cloneRange: Range | null = null;
        const isCollapsed: boolean = range.collapsed;
        const parentLi: Node = isCollapsed ? currentNode.parentElement.closest('LI') : null;
        let startLi: Node | null = null;
        let endLi: Node | null = null;
        if (!range.collapsed) {
            const startContainer: Node = range.startContainer;
            const startOffset: number = range.startOffset;
            cloneRange = range.cloneRange();
            startLi = this.findLiFromContainer(cloneRange.startContainer);
            endLi = this.findLiFromContainer(cloneRange.endContainer);
            this.removeListfromPaste(range);
            if (startLi && filteredChildNodes.length > 0) {
                this.removeEmptyAfterStartLI(startLi as HTMLElement, editNode as HTMLElement);
            }
            range.setStart(startContainer, startOffset);
            range.setEnd(startContainer, startOffset);
        }
        const startContainerparentElement: HTMLElement = range.startContainer.parentElement;
        const blockNode: Node = this.getImmediateBlockNode(currentNode, insertedNode);
        if (insertedNode.firstChild.nodeName === 'HR') {
            let parentListItem: Element = null;
            if (startLi) {
                parentListItem = closest(startLi, 'li');
            } else {
                parentListItem = closest(parentNode, 'li');
            }
            parentNode = parentListItem ? parentListItem : parentNode;
            this.insertBlockElementInList(range, insertedNode as HTMLElement, parentNode, nodeCutter);
        } else if (isCollapsed && parentLi && filteredChildNodes.length > 0) {
            this.pasteLI(insertedNode, parentLi, mergeNode, blockNode, range, nodeCutter);
        } else if (!isCollapsed && startLi && endLi && filteredChildNodes.length > 0) {
            this.nonCollapsedInsertion(insertedNode, cloneRange, nodeCutter, endLi);
        } else if (isCollapsed && ((insertedNode.firstChild.nodeName === 'UL' ||
            insertedNode.firstChild.nodeName === 'OL') && currentNode.parentElement && currentNode.parentElement.nodeName === 'DIV')) {
            // Case 1: If cursor is at the start of the list item
            if (range.startOffset === 0 && range.endOffset === 0 && startContainerparentElement) {
                startContainerparentElement.parentNode.insertBefore(insertedNode, startContainerparentElement);
            }
            // Case 2: If cursor is at the end of the list item
            else if (range.startOffset === range.startContainer.textContent.length && range.endOffset ===
                range.startContainer.textContent.length &&
                startContainerparentElement && startContainerparentElement.parentNode) {
                const nextSibling: Node = startContainerparentElement.nextSibling;
                startContainerparentElement.parentNode.insertBefore(insertedNode, nextSibling);
            } else {
                const liElement: HTMLElement | null = startContainerparentElement.closest('li');
                // Use nodeCutter to split the node at the range
                const spliceNode: Node = nodeCutter.GetSpliceNode(range, startContainerparentElement);
                // Create a new <li> to hold the remaining content after the splice
                const newLi: HTMLLIElement = document.createElement('li');
                // Move all nodes after spliceNode into newLi
                const nextNode: Node | null = spliceNode.nextSibling;
                newLi.appendChild(nextNode);
                // Insert the pasted list items (insertedNode) after the current <li>
                insertedNode.appendChild(newLi);
                liElement.parentNode.insertBefore(insertedNode, liElement.nextSibling);
            }
        } else if (!isCollapsed && ((range.startContainer.nodeName === '#text' && startContainerparentElement.nodeName === 'DIV') ||
            (range.startContainer.nodeName === 'DIV' && startContainerparentElement.nodeName === 'LI'))) {
            const startContainer: Node = (range.startContainer.nodeName === '#text' && range.startContainer.textContent.trim().length === 0) ?
                startContainerparentElement : range.startContainer;
            if (startContainer && startContainer.parentElement.nodeName === 'LI') {
                startContainerparentElement.parentNode.insertBefore(insertedNode, startContainerparentElement.nextSibling);
            }
        } else {
            range.insertNode(insertedNode);
        }
        this.contentsDeleted = true;
        return true; // Indicate we've fully handled this case.
    }

    // Returns a LI node from any container
    private static findLiFromContainer(container: Node): Node | null {
        if (container.nodeName === 'LI') {
            return container;
        }
        let parent: Node = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
        parent = parent.nodeName === 'LI' ? parent : (parent as HTMLElement).closest('LI');
        return parent;
    }

    //Handles non-collapsed list insertion logic for splitting and merging list items based on selection range.
    private static nonCollapsedInsertion(insertedNode: Node, cloneRange: Range, nodeCutter: NodeCutter, endSelectionLi: Node): void {
        let children: Node[] = this.extractChildNodes(insertedNode);
        children = this.processInsertNodes(children);
        const startContainer: Node = cloneRange.startContainer;
        const endContainer: Node = cloneRange.endContainer;
        const isEndContainerLi: boolean = endContainer.nodeName === 'UL' || endContainer.nodeName === 'OL';
        const parentLi: HTMLElement = this.getClosestLi(startContainer);
        const previousLi: HTMLElement = this.getPreviousLi(parentLi);
        let endLi: HTMLElement = this.getNextLi(parentLi);
        const parentList: Node = parentLi.parentNode;
        if (endLi && parentList === endContainer) {
            if (isEndContainerLi && endSelectionLi.textContent === '') {
                endLi = null;
            }
        }
        if (startContainer === endContainer || (!endLi || (parentLi.contains(endContainer) && !isEndContainerLi)) &&
            !this.isAnotherLiFromEndLi || this.isAnotherLiFromEndLi && parentList !== endContainer && endContainer.nodeName !== 'A') {
            this.handleSingleLiInsertion(parentLi, previousLi, endLi, children, startContainer, cloneRange, nodeCutter, parentList);
        } else {
            this.handleMultiLiInsertion(parentLi, children, startContainer, endContainer, parentList);
        }
        this.unwrapInlineWrappers(parentList);
    }

    // Returns the nearest ancestor LI element for a given node
    private static getClosestLi(node: Node): HTMLElement {
        let current: Node = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
        while (current && current.nodeName !== 'LI') {
            current = current.parentNode;
        }
        return current as HTMLElement;
    }

    // Returns the previous LI sibling if available
    private static getPreviousLi(li: Node): HTMLElement {
        const prev: Node = li.previousSibling;
        return (prev && prev.nodeName === 'LI') ? prev as HTMLElement : null;
    }

    // Returns the next LI sibling if available
    private static getNextLi(li: Node): HTMLElement {
        const next: Node = li.nextSibling;
        return (next && next.nodeName === 'LI') ? next as HTMLElement : null;
    }

    // Appends list items to a fragment and returns the last appended list item
    private static appendListItems(fragment: DocumentFragment, children: Node[],
                                   startIndex: number, endIndex: number): HTMLLIElement | null {
        let lastNewLi: HTMLLIElement = null;
        for (let i: number = startIndex; i < endIndex; i++) {
            const li: HTMLLIElement = document.createElement('li');
            li.appendChild(children[i as number]);
            fragment.appendChild(li);
            lastNewLi = li;
        }
        return lastNewLi;
    }

    // Handles insertion when start and end container are in different LIs
    private static moveSiblingsToLiAndInsert(fromNode: Node, targetLi: HTMLElement, fragment: DocumentFragment,
                                             parentLi: HTMLElement, parentList: Node): void {
        const elementsToMove: ChildNode[] = [];
        while (fromNode) {
            elementsToMove.push(fromNode as ChildNode);
            fromNode = fromNode.nextSibling;
        }
        for (let i: number = 0; i < elementsToMove.length; i++) {
            if (parentLi.contains(elementsToMove[i as number])) {
                parentLi.removeChild(elementsToMove[i as number]);
            }
        }
        for (let i: number = 0; i < elementsToMove.length; i++) {
            targetLi.appendChild(elementsToMove[i as number]);
        }
        if (parentLi.nextSibling) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else {
            parentLi.appendChild(fragment);
        }
    }

    // Handles insertion when start and end container are in same LI or no end LI
    private static handleSingleLiInsertion(parentLi: HTMLElement, previousLi: HTMLElement, endLi: HTMLElement, children: Node[],
                                           startContainer: Node, cloneRange: Range, nodeCutter: NodeCutter, parentList: Node): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        this.extractNestedListsIntoNewListItem(parentLi);
        let middleLi: Node = null;
        let lastNode: Node = null;
        let preNode: Node = parentLi.hasChildNodes() &&
            (parentLi.lastChild.nodeType === Node.TEXT_NODE || parentLi.textContent === '')
            ? parentLi : parentLi.lastChild;
        if (startContainer && startContainer.textContent && startContainer.textContent.length > 0) {
            middleLi = nodeCutter.GetSpliceNode(cloneRange, startContainer as HTMLElement);
            preNode = middleLi.previousSibling !== previousLi ? middleLi.previousSibling : null;
            lastNode = middleLi.nextSibling !== endLi ? middleLi.nextSibling : null;
        }
        const firstBlock: Node = children[0];
        const isSingleBlock: boolean = children.length === 1;
        if (isSingleBlock) {
            if (lastNode) {
                this.addCursorMarker(lastNode);
                this.moveAllChildren(lastNode, firstBlock);
                lastNode.parentNode.removeChild(lastNode);
            } else {
                this.addCursorMarker(firstBlock, true);
            }
        }
        if (preNode && preNode !== previousLi && preNode.textContent && preNode.textContent.length > 0) {
            this.moveAllChildren(firstBlock, preNode);
        } else if (isSingleBlock && parentLi.textContent === '') {
            parentLi.appendChild(firstBlock);
        } else {
            const newLi: HTMLLIElement = createElement('li') as HTMLLIElement;
            newLi.appendChild(firstBlock);
            fragment.appendChild(newLi);
        }
        const lastNewLi: HTMLLIElement = this.appendListItems(fragment, children, 1, children.length);
        if (lastNewLi && lastNode) {
            this.addCursorMarker(lastNode);
            if (lastNode.nodeName === 'A') {
                lastNewLi.lastChild.appendChild(lastNode);
            } else {
                this.mergeLastNodeContent(lastNode, lastNewLi);
            }
        }
        const shouldInsertAfter: boolean = lastNode && (lastNode.nodeName === 'LI' || !lastNode.nextSibling);
        if (shouldInsertAfter) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
            if (lastNode && lastNode.parentNode && lastNode.textContent.length === 0) {
                lastNode.parentNode.removeChild(lastNode);
            }
        } else if (lastNewLi) {
            this.moveSiblingsToLiAndInsert(lastNode, lastNewLi, fragment, parentLi, parentList);
        }
        if (middleLi && middleLi.parentNode && middleLi.textContent === '') {
            middleLi.parentNode.removeChild(middleLi);
        }
        if (parentLi && parentLi.parentNode && parentLi.textContent === '') {
            parentLi.parentNode.removeChild(parentLi);
        }
    }

    // Handles insertion when selection spans multiple LIs
    private static handleMultiLiInsertion(parentLi: HTMLElement, children: Node[], startContainer: Node,
                                          endContainer: Node, parentList: Node): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        this.extractNestedListsIntoNewListItem(parentLi);
        const endLi: Node = parentLi.nextSibling;
        if (endLi) {
            this.extractNestedListsIntoNewListItem(endLi);
        }
        startContainer = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentNode : startContainer;
        if (endContainer.textContent === '' && endContainer.nextSibling) {
            endContainer = endContainer.nextSibling;
        }
        if (!endLi.contains(endContainer) || endContainer.nodeName === 'UL' || endContainer.nodeName === 'OL') {
            endContainer = endLi;
        }
        const firstBlock: Node = children[0];
        const lastBlock: Node = children[children.length - 1];
        if (endContainer.nodeType === Node.TEXT_NODE && children.length > 1) {
            lastBlock.appendChild(endContainer);
        } else if (children.length > 1) {
            this.addCursorMarker(endContainer);
            this.moveAllChildren(endContainer, lastBlock);
            endLi.insertBefore(lastBlock, endLi.firstChild);
        }
        if (children.length === 1) {
            this.addCursorMarker(endContainer);
            this.moveAllChildren(endContainer, firstBlock);
            if (endLi && endLi.parentNode) {
                endLi.parentNode.removeChild(endLi);
            }
        }
        let lastNewLi: HTMLLIElement = null;
        if (startContainer.textContent.length > 0 && parentLi.textContent.length > 0) {
            this.moveAllChildren(firstBlock, startContainer);
            if (startContainer.nodeName === 'A') {
                startContainer = startContainer.parentNode.lastChild;
            }
        } else {
            const newLi: HTMLLIElement = createElement('li') as HTMLLIElement;
            newLi.appendChild(firstBlock);
            fragment.appendChild(newLi);
            if (children.length === 1) {
                lastNewLi = newLi;
            }
        }
        if (isNOU(lastNewLi)) {
            lastNewLi = this.appendListItems(fragment, children, 1, children.length - 1);
        }
        if (isNOU(startContainer.nextSibling)) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else if (lastNewLi) {
            this.moveSiblingsToLiAndInsert(startContainer.nextSibling, lastNewLi, fragment, parentLi, parentList);
        } else {
            // nextSibling exists → insert before it
            parentList.insertBefore(fragment, startContainer.nextSibling);
        }
        if (parentLi.textContent === '' && parentLi.parentNode) {
            parentLi.parentNode.removeChild(parentLi);
        }
    }

    // Handles insertion for collapsed selection
    private static pasteLI(insertedNode: Node, parentLi: Node, mergeNode: Node,
                           blockNode: Node, range: Range, nodeCutter: NodeCutter): void {
        let children: Node[] = this.extractChildNodes(insertedNode);
        children = this.processInsertNodes(children);
        const blockNodeLength: number = this.getBlockNodeLength(blockNode);
        const parentList: Node = parentLi.parentNode;
        let isCursorAtStart: boolean = true;
        let isCursorAtEnd: boolean = false;
        if (parentLi.contains(mergeNode) && mergeNode.previousSibling && mergeNode.previousSibling.textContent.trim().length !== 0) {
            isCursorAtStart = false;
        }
        const isAtStart: boolean = range.startOffset === 0 && isCursorAtStart;
        if (!isAtStart) {
            let parentLiLastChild: Node | null = parentLi.lastChild;
            while (!isNOU(parentLiLastChild) && parentLiLastChild.nodeType === Node.ELEMENT_NODE &&
                !this.isBlockElement(parentLiLastChild) && !isNOU(parentLiLastChild.lastChild)) {
                parentLiLastChild = parentLiLastChild.lastChild;
            }
            if (range.startContainer === parentLiLastChild &&
                range.startContainer.textContent.length === range.startOffset) {
                isCursorAtEnd = true;
            } else if (parentLi.contains(mergeNode) && (isNOU(mergeNode.nextSibling) || mergeNode.nextSibling && ['LI', 'UL', 'OL'].indexOf(mergeNode.nextSibling.nodeName) !== -1) && range.startOffset === mergeNode.textContent.length) {
                let previousSib: Node = mergeNode.previousSibling;
                let textLength: number = range.startOffset;
                while (previousSib && previousSib.nodeName !== 'LI') {
                    textLength += previousSib.textContent.length;
                    previousSib = previousSib.previousSibling;
                }
                isCursorAtEnd = textLength === blockNodeLength;
            }
        }
        const isAtEnd: boolean = range.startOffset === blockNodeLength || isCursorAtEnd;
        if (isAtStart) {
            this.handlePasteAtStart(children, parentLi, mergeNode, parentList);
        } else if (isAtEnd) {
            this.handlePasteAtEnd(children, parentLi, mergeNode, parentList);
        } else {
            this.handlePasteInMiddle(children, parentLi, mergeNode, range, parentList, nodeCutter);
        }
        this.unwrapInlineWrappers(parentList);
    }

    // Handles insertion at start
    private static handlePasteAtStart(children: Node[], parentLi: Node, mergeNode: Node, parentList: Node): void {
        const lastBlock: Node = children[children.length - 1];
        this.addCursorMarker(mergeNode);
        this.moveAllChildren(mergeNode, lastBlock);
        parentLi.insertBefore(lastBlock, parentLi.firstChild);
        const fragment: DocumentFragment = this.createLiFragment(children, 0, children.length - 1); // exclude last
        parentList.insertBefore(fragment, parentLi);
    }

    // Handles insertion at end
    private static handlePasteAtEnd(children: Node[], parentLi: Node, mergeNode: Node, parentList: Node): void {
        const firstBlock: Node = children[0];
        const hasNestedList: HTMLElement | null = this.hasNestedListInsideLi(mergeNode);
        if (mergeNode.nodeName === 'LI' && hasNestedList) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, hasNestedList);
            this.moveAllChildren(firstBlock, mergeNode);
            movedNodes.forEach((node: Node) => mergeNode.appendChild(node));
        }
        else {
            this.moveAllChildren(firstBlock, mergeNode);
        }
        const fragment: DocumentFragment = this.createLiFragment(children, 1, children.length); // exclude first
        const lastNewLi: HTMLLIElement = fragment.lastChild as HTMLLIElement | null;
        let cursorNode: Node = parentLi;
        if (isNOU(lastNewLi)) {
            cursorNode = parentLi;
        } else {
            cursorNode = lastNewLi;
        }
        while (!isNOU(cursorNode.lastChild) && cursorNode.lastChild.nodeName !== '#text') {
            cursorNode = cursorNode.lastChild;
        }
        this.addCursorMarker(cursorNode, true);
        if (lastNewLi) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, hasNestedList ? hasNestedList : mergeNode.nextSibling);
            movedNodes.forEach((node: Node) => lastNewLi.appendChild(node));
            this.insertFragmentAfterLi(fragment, parentLi, parentList);
        }
    }

    // Handles insertion in middle
    private static handlePasteInMiddle(children: Node[], parentLi: Node, mergeNode: Node,
                                       range: Range, parentList: Node, nodeCutter: NodeCutter): void {
        const middleLi: Node = nodeCutter.GetSpliceNode(range, mergeNode as HTMLElement);
        const preNode: Node = middleLi.previousSibling;
        const lastNode: Node = middleLi.nextSibling;
        const firstBlock: Node = children[0];
        if (children.length === 1) {
            this.addCursorMarker(lastNode);
            this.moveAllChildren(lastNode, firstBlock);
        }
        this.moveAllChildren(firstBlock, preNode);
        const fragment: DocumentFragment = this.createLiFragment(children, 1, children.length); // exclude first
        const lastNewLi: HTMLLIElement = fragment.lastChild as HTMLLIElement | null;
        if (lastNewLi) {
            this.addCursorMarker(lastNode);
            if (lastNode.nodeName === 'A') {
                lastNewLi.lastChild.appendChild(lastNode);
            } else {
                this.mergeLastNodeContent(lastNode, lastNewLi);
            }
        }
        const hasNestedList: HTMLElement | null = this.hasNestedListInsideLi(parentLi);
        if ((lastNode && isNOU(lastNode.nextSibling) && lastNewLi && isNOU(hasNestedList)) || lastNode.nodeName === 'LI') {
            parentList.insertBefore(fragment, parentLi.nextSibling);
            if (lastNode.textContent.length === 0) {
                lastNode.parentNode.removeChild(lastNode);
            }
        } else if (lastNewLi) {
            const movedNodes: Node[] = this.collectAndRemoveFollowingNodes(parentLi, hasNestedList ? hasNestedList : lastNode);
            movedNodes.forEach((node: Node) => lastNewLi.appendChild(node));
            this.insertFragmentAfterLi(fragment, parentLi, parentList);
        }
        middleLi.parentNode.removeChild(middleLi);
    }

    // Checks if there is any nested list inside li
    private static hasNestedListInsideLi(node: Node): HTMLElement | null {
        if (node.nodeName === 'LI') {
            for (const child of Array.from((node as Element).children)) {
                if (child.tagName === 'UL' || child.tagName === 'OL') {
                    return child as HTMLElement;
                }
            }
        }
        const closestLi: HTMLElement = (node as Element).closest('LI') as HTMLElement;
        if (!closestLi) {
            return null;
        }
        for (const child of Array.from(closestLi.children)) {
            if (child.tagName === 'UL' || child.tagName === 'OL') {
                return child as HTMLElement;
            }
        }
        return null;
    }

    // Returns the length of block node
    private static getBlockNodeLength(blockNode: Node): number {
        if (blockNode.nodeName === 'LI') {
            let length: number = 0;
            for (const child of Array.from(blockNode.childNodes)) {
                if (child.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].indexOf((child as HTMLElement).tagName) !== -1) {
                    break;
                }
                length += child.textContent ? child.textContent.length : 0;
            }
            return length;
        }
        return blockNode.textContent ? blockNode.textContent.length : 0;
    }

    // Adds cursor marker
    private static addCursorMarker(lastNode: Node, isEnd?: boolean): void {
        const span: HTMLSpanElement = createElement('span');
        span.className = 'paste-cursor';
        if (isEnd) {
            lastNode.appendChild(span);
        } else {
            lastNode.insertBefore(span, lastNode.firstChild);
        }
    }

    // Checks if list item has another list
    private static extractNestedListsIntoNewListItem(listItem: Node): void {
        const childNodes: Node[] = Array.from(listItem.childNodes);
        const listNodes: Node[] = [];
        // Find ul/ol nodes
        for (const node of childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                ((node as HTMLElement).tagName === 'UL' || (node as HTMLElement).tagName === 'OL')) {
                listNodes.push(node);
            }
        }
        if (listNodes.length > 0) {
            // Create a new <li>
            const newLi: HTMLLIElement = createElement('li') as HTMLLIElement;
            // Move ul/ol into the new <li>
            for (const list of listNodes) {
                newLi.appendChild(list);
            }
            // Insert new <li> after mergeNode
            const parent: Node = listItem.parentNode;
            if (parent) {
                const next: Node = listItem.nextSibling;
                if (next) {
                    parent.insertBefore(newLi, next);
                } else {
                    parent.appendChild(newLi);
                }
            }
        }
    }

    // Creates a fragment of list items
    private static createLiFragment(nodes: Node[], start: number, end: number): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();
        if (nodes.length === 2 && start === 1 &&
            (nodes[1].nodeName === 'UL' || nodes[1].nodeName === 'OL')) {
            // execute this code only for nested list paste use case.
            fragment.appendChild(nodes[1]);
        } else {
            for (let i: number = start; i < end; i++) {
                if (nodes[i as number].nodeName === 'UL' || nodes[i as number].nodeName === 'OL') {
                    for (let j: number = 0; j < (nodes[i as number] as HTMLElement).childNodes.length; j++) {
                        if (this.isBlockElement(nodes[i as number].childNodes[j as number])) {
                            fragment.appendChild(nodes[i as number].childNodes[j as number]);
                        }
                    }
                } else {
                    const li: HTMLLIElement = createElement('li') as HTMLLIElement;
                    li.appendChild(nodes[i as number]);
                    fragment.appendChild(li);
                }
            }
        }
        return fragment;
    }

    // Collects and removes following nodes
    private static collectAndRemoveFollowingNodes(parentLi: Node, startNode: Node | null): ChildNode[] {
        const nodes: ChildNode[] = [];
        let current: ChildNode | null = startNode as ChildNode;
        while (current) {
            const next: Node = current.nextSibling;
            nodes.push(current);
            if (parentLi.contains(current)) {
                parentLi.removeChild(current);
            }
            current = next as ChildNode;
        }
        return nodes;
    }

    // Inserts fragment after list item
    private static insertFragmentAfterLi(fragment: DocumentFragment, parentLi: Node, parentList: Node): void {
        if (parentLi.nextSibling) {
            parentList.insertBefore(fragment, parentLi.nextSibling);
        } else {
            parentLi.appendChild(fragment);
        }
    }

    // Moves all children
    private static moveAllChildren(sourceNode: Node, targetNode: Node): void {
        const isAnchorInTargetNode: boolean = targetNode.nodeName === 'A';
        const isAnchorInSourceNode: boolean = sourceNode.nodeName === 'A';
        while (sourceNode.firstChild && !isAnchorInSourceNode) {
            const firstChild: ChildNode | null = sourceNode.firstChild;
            if (firstChild.nodeName === 'UL' || firstChild.nodeName === 'OL') {
                return;
            }
            if (isAnchorInTargetNode) {
                targetNode.parentNode.insertBefore(firstChild, targetNode.nextSibling);
                targetNode = targetNode.nextSibling;
            } else {
                targetNode.appendChild(firstChild);
            }
        }
        if (isAnchorInSourceNode) {
            targetNode.appendChild(sourceNode);
        }
    }

    // Merges last node content
    private static mergeLastNodeContent(lastNode: Node, lastNewLi: HTMLLIElement): void {
        while (lastNode && lastNode.firstChild) {
            const firstChild: ChildNode | null = lastNode.firstChild;
            if (!firstChild) {
                continue;
            }
            const isBlockTag: boolean = CONSTANT.BLOCK_TAGS.indexOf(firstChild.nodeName.toLowerCase()) >= 0;
            if (!isBlockTag) {
                lastNewLi.lastChild.appendChild(firstChild);
            } else if (firstChild.nodeName === 'UL' || firstChild.nodeName === 'OL') {
                lastNewLi.appendChild(firstChild);
            } else {
                this.moveAllChildren(firstChild, lastNewLi.lastChild);
                lastNode.removeChild(firstChild);
            }
        }
    }

    // Gets the appropriate node splice element based on selection and context.
    private static getSplitElementForInsertion(range: Range, nodeCutter: NodeCutter, blockNode: Node): Node {
        const isSelectionCollapsed: boolean = range.collapsed;
        const isAtNodeStart: boolean = range.startOffset === 0;
        const isAtNodeEnd: boolean = range.startContainer.nodeType === Node.TEXT_NODE ?
            range.startOffset === range.startContainer.textContent.length :
            range.startOffset === range.startContainer.childNodes.length;
        if (blockNode &&
            blockNode.nodeName === 'P' &&
            (isAtNodeStart || isAtNodeEnd || !isSelectionCollapsed) &&
            blockNode.textContent.trim() === '') {
            // Use a single split for empty paragraphs or paragraphs with only cursor position.
            return nodeCutter.SplitNode(range, blockNode as HTMLElement, true);
        } else {
            // Use full GetSpliceNode for other cases.
            return nodeCutter.GetSpliceNode(range, blockNode as HTMLElement);
        }
    }

    // Adjusts the cursor position post-insertion to ensure it is placed at the correct point.
    private static cursorPos(
        lastSelectionNode: Node, insertedNode: Node, nodeSelection: NodeSelection,
        docElement: Document, editNode?: Element
    ): void {
        (lastSelectionNode as HTMLElement).classList.add('lastNode');
        editNode.innerHTML = updateTextNode(editNode.innerHTML);
        lastSelectionNode = (editNode as HTMLElement).querySelector('.lastNode');
        if (!isNOU(lastSelectionNode)) {
            this.placeCursorEnd(lastSelectionNode, insertedNode, nodeSelection, docElement, editNode);
            (lastSelectionNode as HTMLElement).classList.remove('lastNode');
            if ((lastSelectionNode as HTMLElement).classList.length === 0) {
                (lastSelectionNode as HTMLElement).removeAttribute('class');
            }
        }
    }

    // Handles focus management specifically for image elements during insertion operations.
    private static imageFocus(node: Node, nodeSelection: NodeSelection, docElement: Document): void {
        const focusNode: Node = document.createTextNode('\u00A0');
        if (node.parentNode && node.parentNode.nodeName === 'A') {
            const anchorTag: Node = node.parentNode;
            const parentNode: Node = anchorTag.parentNode;
            parentNode.insertBefore(focusNode, anchorTag.nextSibling);
            parentNode.insertBefore(node, focusNode);
        }
        else {
            node.parentNode.insertBefore(focusNode, node.nextSibling);
        }
        nodeSelection.setSelectionText(docElement, node.nextSibling, node.nextSibling, 0, 0);
    }

    // Identifies the immediate block-level node, utilized for placement and alignment logic.
    // eslint-disable-next-line
    private static getImmediateBlockNode(node: Node, editNode: Node): Node {
        while (node && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0) {
            node = node.parentNode;
        }
        return node;
    }

    // Eliminates comments from a node to ensure the insertion is clean and comment-free.
    private static removingComments(insertedNode: HTMLElement): void {
        let innerElement: string = insertedNode.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        insertedNode.innerHTML = innerElement;
    }

    // Finds and detaches empty elements from the DOM.
    private static findDetachEmptyElem(
        element: Element, ignoreBlockNodes: boolean = false
    ): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            const hasNbsp: boolean = element.parentElement.textContent.length > 0 && element.parentElement.textContent.match(/\u00a0/g)
                && element.parentElement.textContent.match(/\u00a0/g).length > 0;
            const hasBr: boolean = !isNOU(element.parentElement.querySelector('br'));
            if (!hasNbsp && !hasBr && element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true' &&
                isNOU(element.parentElement.querySelector('img')) && element.parentElement.nodeName !== 'TD' && element.parentElement.nodeName !== 'TH' && isNOU(element.parentElement.querySelector('table td, table th'))) {
                removableElement = ignoreBlockNodes && CONSTANT.BLOCK_TAGS.indexOf(element.parentElement.tagName.toLowerCase()) !== -1 ?
                    element as HTMLElement : this.findDetachEmptyElem(element.parentElement, ignoreBlockNodes);
            } else {
                removableElement = ignoreBlockNodes && CONSTANT.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) !== -1 ? null :
                    element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }

    // Removes elements deemed empty if isolated.
    private static removeEmptyElements(element: HTMLElement, ignoreBlockNodes: boolean = false, emptyElemet: Element = null): void {
        const emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        const filteredEmptyElements: Element[] = Array.from(emptyElements).filter((element: Element) => {
            const tagName: string = element.tagName.toLowerCase();
            // Some empty tags suc as TD TH convey a meaning and hence should not be removed.
            const meaningfulEmptyTags: string[] = ['td', 'tr', 'th', 'textarea', 'input', 'img', 'video', 'audio', 'br', 'hr', 'iframe'];
            return !element.closest('svg') && !element.closest('canvas') && !(meaningfulEmptyTags.indexOf(tagName) > -1);
        });
        for (let i: number = 0; i < filteredEmptyElements.length; i++) {
            let lineWithDiv: boolean = true;
            const currentEmptyElem: HTMLElement = filteredEmptyElements[i as number] as HTMLElement;
            if (currentEmptyElem.tagName === 'DIV') {
                lineWithDiv = (currentEmptyElem as HTMLElement).style.borderBottom === 'none' ||
                currentEmptyElem.style.borderBottom === '' ? true : false;
            }
            if (currentEmptyElem.nodeName === 'COL') {
                if (!(currentEmptyElem as HTMLTableColElement).style.width) {
                    const colGroup: HTMLElement = currentEmptyElem.parentElement as HTMLElement;
                    detach(colGroup);
                }
                continue;
            }
            const isEmptyElement: boolean = !isNOU(emptyElemet) && currentEmptyElem === emptyElemet;
            if (CONSTANT.SELF_CLOSING_TAGS.indexOf(currentEmptyElem.tagName.toLowerCase()) < 0 && lineWithDiv && !isEmptyElement) {
                const detachableElement: HTMLElement = this.findDetachEmptyElem(
                    currentEmptyElem, ignoreBlockNodes);
                if (!isNOU(detachableElement) && !(detachableElement.nodeType === Node.ELEMENT_NODE && detachableElement.nodeName.toUpperCase() === 'TEXTAREA')) {
                    detach(detachableElement);
                }
            }
        }
    }

    // Finds the most relevant parent element considered in operations like insertion or cleanup.
    private static findClosestRelevantElement(sourceElement: Element | Node, editNode: Element): Element | null {
        // Cast to Element type for proper handling.
        let currentElement: Element = sourceElement as Element;
        // First check if the element is inside a table or list item.
        const relevantAncestorTags: string[] = ['table', 'li'];
        for (const ancestorTag of relevantAncestorTags) {
            const closestAncestorElement: Element = closest(currentElement, ancestorTag);
            if (closestAncestorElement && !closestAncestorElement.contains(editNode)) {
                return closestAncestorElement;
            }
        }
        // Traverse up the DOM tree until we reach a valid parent or run out of elements.
        while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
            const parentElement: Element = currentElement.parentNode as Element;
            if (parentElement === editNode) {
                return currentElement;
            }
            // Check if parent is one of the allowed block elements.
            const isParentTagValid: boolean = !isNOU(parentElement.tagName) && (
                this.isTagInList(parentElement.tagName, CONSTANT.IGNORE_BLOCK_TAGS) ||
                this.isTagInList(parentElement.tagName, CONSTANT.ALLOWED_TABLE_BLOCK_TAGS)
            );
            if (isParentTagValid) {
                return currentElement;
            }
            // Move up to the parent element.
            currentElement = parentElement;
        }
        return null;
    }

    // Determines if a provided tag matches any entries in a given list of permissible tags.
    private static isTagInList(tagName: string, tagList: string[]): boolean {
        return tagList.indexOf(tagName.toLowerCase()) !== -1;
    }

    // Facilitates the insertion of a table within a list structure, reorganizing elements as needed.
    private static insertTableInList(
        range: Range, insertNode: HTMLTableElement,
        parentNode: Node, currentNode: Node,
        nodeCutter: NodeCutter, lastclosestParentNode: HTMLElement): void {
        const parentList: Element = closest(parentNode, 'ul,ol');
        const totalLi: number = parentList ? parentList.querySelectorAll('li').length : 0;
        const preNode: HTMLElement = nodeCutter.SplitNode(range, parentNode as HTMLElement, true);
        const sibNode: HTMLElement = preNode.previousElementSibling as HTMLElement;
        // Get next sibling info for potential content movement.
        const nextSibNode: HTMLElement = lastclosestParentNode ? closest(lastclosestParentNode, 'li') as HTMLElement : null;
        const nextSibNodeInitialHTML: string = nextSibNode ? nextSibNode.innerHTML : null;
        // Determine if we have a valid previous sibling in a list with more items than the original.
        const hasSiblingInLargerList: boolean = sibNode && closest(sibNode, 'ol,ul') &&
            closest(sibNode, 'ol,ul').querySelectorAll('li').length > totalLi;
        if (hasSiblingInLargerList) {
            // Insert table inside previous sibling and move content there.
            sibNode.appendChild(insertNode);
            range.deleteContents();
            // Move content from preNode to sibNode if needed.
            if (preNode.childNodes.length > 0) {
                this.moveChildNodes(preNode, sibNode);
            }
            // Handle content movement from next sibling if necessary.
            const nextSiblingContentChanged: boolean = parentNode !== lastclosestParentNode &&
                nextSibNodeInitialHTML && nextSibNodeInitialHTML !== nextSibNode.innerHTML;
            if (nextSiblingContentChanged) {
                this.moveChildNodes(nextSibNode, sibNode);
            }
        } else {
            // Insert table at beginning of current node.
            range.deleteContents();
            preNode.insertBefore(insertNode, preNode.firstChild);
            // Move content if needed.
            if (parentNode !== lastclosestParentNode) {
                this.moveChildNodes(lastclosestParentNode, parentNode as HTMLElement);
            }
        }
        // Clean up and mark table.
        this.removeEmptyNextLI(closest(insertNode, 'li') as HTMLElement);
        insertNode.classList.add('ignore-table');
    }

    // Transfers child nodes from a source to target element to symmetrically manage content.
    private static moveChildNodes(source: HTMLElement, target: HTMLElement): void {
        while (!isNOU(source) && !isNOU(source.firstChild)) {
            target.appendChild(source.firstChild);
        }
    }

    // Checks and adjusts text alignment in elements affected by new content insertions.
    private static alignCheck (editNode: HTMLElement): void {
        const spanAligns: NodeListOf<Element> = editNode.querySelectorAll('span[style*="text-align"]');
        for (let i: number = 0; i < spanAligns.length; i++) {
            const spanAlign: HTMLElement = spanAligns[i as number] as HTMLElement;
            if (spanAlign) {
                const blockAlign: HTMLElement = this.getImmediateBlockNode(spanAlign, null) as HTMLElement;
                if (blockAlign) {
                    let totalSpanText: string = '';
                    for (let j: number = 0; j < spanAligns.length; j++) {
                        const span: HTMLElement = spanAligns[j as number] as HTMLElement;
                        if (blockAlign.contains(span)) {
                            totalSpanText += span.textContent;
                        }
                    }
                    if (blockAlign.textContent.trim() === totalSpanText.trim()) {
                        blockAlign.style.textAlign = spanAlign.style.textAlign;
                    }
                }
            }
        }
    }

    // Removes list structures from the pasted content, cleaning up unnecessary list items.
    private static removeListfromPaste (range: Range): void {
        range.deleteContents();
        const value: Node = range.startContainer;
        if (!isNOU(value) && value.nodeName === 'LI' && !isNOU(value.parentElement) && (value.parentElement.nodeName === 'OL' || value.parentElement.nodeName === 'UL') && value.textContent.trim() === '') {
            (value.parentElement as HTMLElement).querySelectorAll('li').forEach((item: HTMLLIElement) => {
                if (item.textContent.trim() === '' && item !== value) {
                    item.remove();
                }
            });
        }
    }

    // Check if we're inserting a horizontal rule in an empty block element
    private static isHorizontalRuleInEmptyBlock(node: Node, range: Range): HTMLElement | null {
        if (node.nodeName !== 'HR') {
            return null;
        }
        let container: HTMLElement = range.startContainer as HTMLElement;
        while (!this.isBlockElement(container) && !isNOU(container.parentElement)) {
            container = container.parentElement;
        }
        const isTextContentPresent: boolean = container.textContent.trim() !== '';
        const isMediaElementPresent: boolean = !isNOU(container.querySelector('video')) ||
            !isNOU(container.querySelector('audio')) || !isNOU(container.querySelector('img'));
        return !(isTextContentPresent || isMediaElementPresent) ? container : null;
    }

    // Check if the node is a media element
    private static isMediaElement(node: Node): boolean {
        if (node) {
            return node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO';
        }
        return false;
    }

    // Method to insert block elements correctly in a list structure
    private static insertBlockElementInList(
        range: Range, insertNode: HTMLElement,
        parentNode: Node, nodeCutter: NodeCutter): void {
        const parentList: Element = closest(parentNode, 'ul,ol');
        const totalListItems: number = parentList ? parentList.querySelectorAll('li').length : 0;
        const newListNode: HTMLElement = nodeCutter.SplitNode(range, parentNode as HTMLElement, true);
        const currentListNode: HTMLElement = newListNode.previousElementSibling as HTMLElement;
        // Insert the block element before the list or inside it based on context
        if (currentListNode && parentList && parentList.querySelectorAll('li').length > totalListItems) {
            currentListNode.appendChild(insertNode.firstChild);
            if (newListNode.childNodes.length > 0) {
                this.moveChildNodes(newListNode, currentListNode);
            }
        } else {
            if (newListNode.firstChild && newListNode.firstChild.nodeName === 'HR') {
                newListNode.insertBefore(insertNode.firstChild, newListNode.firstChild.nextSibling);
            }
            else {
                newListNode.insertBefore(insertNode.firstChild, newListNode.firstChild);
            }
        }
        // Cleanup and ensure the block element is set correctly
        if (newListNode.textContent.trim() === '' && newListNode.childNodes.length < 1) {
            detach(newListNode);
        }
    }
}
