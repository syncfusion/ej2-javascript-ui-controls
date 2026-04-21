import { IHtmlKeyboardEvent, IHtmlSubCommands } from '../base/interface';
import { IEditorModel } from '../../common/interface';
import * as EVENTS from './../../common/constant';
import * as CONSTANT from './../base/constant';
import { createElement, isNullOrUndefined, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { SelectionCommands } from './selection-commands';
import { DOMMethods } from './dom-tree';

/**
 * Auto Format internal component
 *
 * @hidden
 * @private
 */
export class AutoFormatPlugin {

    private parent: IEditorModel;

    /**
     * Constructor for creating the Auto Format plugin
     *
     * @param {IEditorModel} parent - specifies the parent element.
     * @returns {void}
     * @hidden
     * @private
     */
    public constructor(parent: IEditorModel) {
        this.parent = parent;
        this.addEventListener();
    }
    private enterkey: string;

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.AUTO_FORMAT_ACTIONS, this.autoFormat, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.AUTO_FORMAT_ACTIONS, this.autoFormat);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
    }

    public findAutoFormatCommandInRange(range: Range, text: string = null): boolean {
        const commandsArray: string[] = ['*', '~', '`', '_'];

        // Early return if range is null/undefined, use text-based check
        if (!range) {
            return commandsArray.some((command: string) => text.includes(command));
        }

        const startContainer: Node = range.startContainer;
        // Early return if not a text node
        if (startContainer.nodeType !== Node.TEXT_NODE) {
            return false;
        }

        const textContent: string = startContainer.textContent || '';
        const cursorPos: number = range.startOffset;
        // Early return if no text before cursor
        if (cursorPos <= 0) {
            return false;
        }
        const textBeforeCursor: string = textContent.substring(0, cursorPos); // converting without space
        // Use some() to exit early on first match
        return commandsArray.some((command: string) => textBeforeCursor.endsWith(command));
    }

    public findBlockAutoFormatCommandInRange(range: Range, text: string = null): { tag: string; format: string } | null {
        const editorValue: string = range.startContainer.textContent.slice(0, range.startOffset - 1);
        const result: { tag: string; format: string } | null = this.isValidBlockAutoFormatCommand(editorValue, range);
        return result;
    }

    private autoFormat(e: IHtmlSubCommands): void {
        const eventArgs: KeyboardEventArgs = e.event as KeyboardEventArgs;
        eventArgs.preventDefault();

        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const isCollapsed: boolean = range && range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        if (!range || !isCollapsed) {
            return; // Ensure cursor is in a valid, collapsed range
        }

        const startContainer: Node = range.startContainer;
        const cursorPos: number = range.startOffset;

        // Find the nearest parent element
        const firstBlockParent: Node | null = this.findFirstBlockParent(startContainer);
        if (!firstBlockParent) {
            return; // No valid inline parent found
        }

        if (firstBlockParent.nodeName === 'PRE' && !(isNullOrUndefined((firstBlockParent as HTMLElement).getAttribute('data-language')))) {
            return; // Not processing the inline auto formats for code block elements
        }

        // Get text and nodes for the current line
        const textAndOffset: { text: string; adjustedCursorPos: number; nodes: Node[] } =
            this.getLineTextAndNodes(firstBlockParent, startContainer, cursorPos);
        const text: string = textAndOffset.text;
        if (!text) {
            return; // No text to process
        }

        // Find Markdown pattern match
        const matchInfo: { match: RegExpMatchArray; tag: string; syntax: string; } | null =
            this.findMarkdownMatch(text.slice(0, text.length)); // converting without space
        if (!matchInfo) {
            return; // No Markdown pattern matched
        }

        const matchedRange: {
            startNodeIndex: number;
            endNodeIndex: number;
            startPosition: number; endPosition: number
        } | null = this.findMarkdownStartEndNodes(textAndOffset.nodes, matchInfo);

        if (!matchedRange) {
            return;
        }

        this.processMarkdownMatch(matchInfo, textAndOffset.nodes, matchedRange);
        this.callBack(e, e.subCommand);
    }

    private callBack(event: IHtmlKeyboardEvent | IHtmlSubCommands, action: string): void {
        if (event.callBack) {
            event.callBack({
                requestType: action,
                event: event.event,
                editorMode: 'HTML',
                isKeyboardEvent: (event as IHtmlKeyboardEvent).name === EVENTS.KEY_DOWN_HANDLER ? true : false,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }

    private findFirstBlockParent(startContainer: Node): Node | null {
        let node: Node | null = startContainer;
        while (node && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0) {
            node = node.parentNode;
        }
        return node;
    }

    private getLineTextAndNodes(firstBlockParent: Node, startContainer: Node,
                                cursorPos: number): { text: string; adjustedCursorPos: number; nodes: Node[] } {
        const text: string = '';
        const adjustedCursorPos: number = cursorPos;
        const nodes: Node[] = [];
        const foundTarget: boolean = false;

        const result: { text: string; adjustedCursorPos: number; nodes: Node[]; foundTarget: boolean } =
            this.traverseNodes(firstBlockParent, startContainer, cursorPos, text, adjustedCursorPos, nodes, foundTarget, firstBlockParent);

        return { text: result.text, adjustedCursorPos: result.adjustedCursorPos, nodes: result.nodes };
    }

    private traverseNodes(
        firstBlockParent: Node,
        startContainer: Node,
        cursorPos: number,
        text: string,
        adjustedCursorPos: number,
        nodes: Node[],
        foundTarget: boolean,
        currentParent: Node
    ): { text: string; adjustedCursorPos: number; nodes: Node[]; foundTarget: boolean } {
        const nodeName: string = firstBlockParent.nodeName;
        if (nodeName === 'BR') {
            if (!foundTarget) {
                nodes = [];
                text = '';
                adjustedCursorPos = 0;
            }
        }
        if (firstBlockParent.nodeType === Node.TEXT_NODE) {
            const nodeText: string = firstBlockParent.textContent || '';
            nodes.push(firstBlockParent);
            if (firstBlockParent === startContainer) {
                text += nodeText.slice(0, cursorPos);
                foundTarget = true;
                return { text, adjustedCursorPos, nodes, foundTarget }; // Stop at cursor position
            } else {
                text += nodeText;
                adjustedCursorPos += nodeText.length;
            }
        } else if (firstBlockParent.nodeType === Node.ELEMENT_NODE) {
            const childNodes: NodeList = firstBlockParent.childNodes;
            for (let i: number = 0; i < childNodes.length; i++) {
                const childResult: { text: string; adjustedCursorPos: number; nodes: Node[]; foundTarget: boolean } = this.traverseNodes(
                    childNodes[i as number],
                    startContainer,
                    cursorPos,
                    text,
                    adjustedCursorPos,
                    nodes,
                    foundTarget,
                    currentParent
                );
                text = childResult.text;
                adjustedCursorPos = childResult.adjustedCursorPos;
                nodes = childResult.nodes;
                foundTarget = childResult.foundTarget;
                if (foundTarget) {
                    return { text, adjustedCursorPos, nodes, foundTarget }; // Stop if target found or no progress
                }
            }
        }
        return { text, adjustedCursorPos, nodes, foundTarget };
    }

    private findMarkdownMatch(text: string): { match: RegExpMatchArray; tag: string; syntax: string; } | null {
        // Define Markdown patterns/
        const patterns: Array<{ regex: RegExp; tag: string; syntax: string; }> = [
            { regex: /\*\*\*([^*]+)\*\*\*$/, tag: 'em-strong', syntax: '***' }, // ***italic and bold***
            { regex: /___([^_]+)___$/, tag: 'em-strong', syntax: '___' }, // ___italic and bold___
            { regex: /\*\*([^*]+)\*\*$/, tag: 'strong', syntax: '**' }, // **bold**
            { regex: /__([^_]+)__$/, tag: 'strong', syntax: '__' }, // __bold__
            { regex: /\*([^*]+)\*$/, tag: 'em', syntax: '*' }, // *italic*
            { regex: /_([^_]+)_$/, tag: 'em', syntax: '_' }, // _italic_
            { regex: /`([^`]+)`$/, tag: 'code', syntax: '`' }, // `inline code`
            { regex: /~~([^~]+)~~$/, tag: 's', syntax: '~~' } // ~~strikethrough~~
        ];
        const notAllowedMatches: Array< { regex: RegExp }> = [
            { regex: /\*+[^*]+\*+$/ },
            { regex: /_+[^_]+_+$/ }
        ];

        for (let i: number = 0; i < patterns.length; i++) {
            const pattern: { regex: RegExp; tag: string; syntax: string } = patterns[i as number];
            const match: RegExpMatchArray | null = text.match(pattern.regex);
            if (match && match[1]) {
                if (pattern.tag === 'strong' || pattern.tag === 'em') {
                    for (let j: number = 0; j < notAllowedMatches.length; j++) {
                        const notAllowedMatch: { regex: RegExp } = notAllowedMatches[j as number];
                        const notAllowedMatchResult: RegExpMatchArray | null = text.match(notAllowedMatch.regex);
                        if (notAllowedMatchResult && notAllowedMatchResult[0] === match[0]) {
                            return { match, tag: pattern.tag, syntax: pattern.syntax };
                        }
                    }
                } else {
                    return { match: match, tag: pattern.tag, syntax: pattern.syntax };
                }
            }
        }
        return null;
    }

    private isValidBlockAutoFormatCommand(editorValue: string, range: Range): { tag: string; format: string } | null {
        const patterns: Array<{regex: RegExp, tag: string, format: string}> = [
            { regex: /^#$/, tag: 'h1', format: 'Formats' },
            { regex: /^##$/, tag: 'h2', format: 'Formats' },
            { regex: /^###$/, tag: 'h3', format: 'Formats' },
            { regex: /^####$/, tag: 'h4', format: 'Formats' },
            { regex: /^#####$/, tag: 'h5', format: 'Formats' },
            { regex: /^######$/, tag: 'h6', format: 'Formats' },
            { regex: /^>$/, tag: 'blockquote', format: 'Formats' },
            { regex: /^(---|___)$/, tag: 'hr', format: 'InsertHtml' },
            { regex: /^```$/, tag: 'CodeBlock', format: 'CodeBlock'}
        ];
        const domMethods: DOMMethods = new DOMMethods(this.parent.editableElement as HTMLDivElement);
        const parentElement: HTMLElement = (CONSTANT.BLOCK_TAGS.indexOf(range.startContainer.nodeName.toLocaleLowerCase()) > -1) ?
            range.startContainer as HTMLElement : domMethods.getParentBlockNode(range.startContainer) as HTMLElement;
        const headingTags: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const notAllowedInCodeBlock: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'CodeBlock'];
        for (let i: number = 0; i < patterns.length; i++) {
            const pattern: { regex: RegExp; tag: string; format: string } = patterns[i as number];
            const match: RegExpMatchArray | null = editorValue.match(pattern.regex);
            if (match && (pattern.tag !== parentElement.tagName.toLowerCase() || pattern.tag === 'blockquote')
                && !(parentElement.tagName === 'PRE'  && !isNullOrUndefined(parentElement.getAttribute('data-language')) && notAllowedInCodeBlock.indexOf(pattern.tag) > -1)) {
                if (pattern.tag === 'CodeBlock' && isNullOrUndefined(this.parent.codeBlockObj)) {
                    return null;
                }
                // Remove the text content
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                // If the text node is now empty, replace it with a <br> element
                const emptyTextNode: Node = range.startContainer;
                if (emptyTextNode.nodeType === Node.TEXT_NODE && emptyTextNode.textContent === '') {
                    const brElement: HTMLElement = createElement('br');
                    const parentNode: Node = emptyTextNode.parentNode;
                    if (parentNode) {
                        parentNode.replaceChild(brElement, emptyTextNode);
                    }
                }
                return { tag: pattern.tag, format: pattern.format };
            } else if (match && headingTags.indexOf(pattern.tag) > -1  && pattern.tag === parentElement.tagName.toLowerCase()) {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, parentElement, 0);
                return { tag: 'p', format: pattern.format };
            }
        }
        return null;
    }

    private findMarkdownStartEndNodes(textNodes: Node[], matchInfo: { match: RegExpMatchArray; tag: string; syntax: string; }): {
        startNodeIndex: number; endNodeIndex: number;
        startPosition: number; endPosition: number
    } | null {
        const match: RegExpMatchArray = matchInfo.match;
        const matchedText: string = match[0];
        const startIndex: number = match.index;
        const deleteLength: number = (matchedText.length - match[1].length) / 2;
        const syntax: string = matchInfo.syntax.slice(0, deleteLength > 1 ? deleteLength - 1 : 0);
        const endIndex: number = (startIndex + matchedText.length) - deleteLength;

        let cumulativeLength: number = 0;
        let startNodeIndex: number = -1;
        let endNodeIndex: number = -1;
        let startPosition: number = -1;
        let endPosition: number = -1;

        for (let i: number = 0; i < textNodes.length; i++) {
            const nodeText: string = textNodes[i as number].textContent || '';
            let nextCumulativeLength: number = cumulativeLength + nodeText.length;

            // Check if start index falls within this node
            if (startNodeIndex === -1 && startIndex >= cumulativeLength && startIndex < nextCumulativeLength) {
                startNodeIndex = i;
                startPosition = startIndex - cumulativeLength;
                nextCumulativeLength = nextCumulativeLength + this.deleteMarkerFromNodes(textNodes, i, startPosition, deleteLength, syntax);
            }

            // Check if end index falls within this nodes
            if (endIndex >= cumulativeLength && endIndex < nextCumulativeLength) {
                endNodeIndex = i;
                endPosition = endIndex - cumulativeLength;
                if (startNodeIndex === endNodeIndex) {
                    endPosition = endPosition - deleteLength;
                }
                nextCumulativeLength = nextCumulativeLength + this.deleteMarkerFromNodes(textNodes, i, endPosition, deleteLength, syntax);
                break; // End index found, no need to continue
            }

            cumulativeLength = nextCumulativeLength;
        }

        if (startNodeIndex === -1 || endNodeIndex === -1 || startPosition === -1 || endPosition === -1) {
            return null; // Match spans nodes incorrectly or not found
        }

        return { startNodeIndex, endNodeIndex, startPosition, endPosition };
    }

    private deleteMarkerFromNodes(textNodes: Node[], currentIndex: number, startPosition: number,
                                  deleteLength: number, syntax: string): number {
        const currentNode: Text = textNodes[currentIndex as number] as Text;
        const currentText: string = currentNode.textContent || '';

        // Ensure startPosition is within bounds
        if (startPosition < 0 || startPosition >= currentText.length) {
            return 0;
        }

        // Calculate portion to delete from current node
        const deleteFromCurrent: number = Math.min(deleteLength, currentText.length - startPosition);
        if (deleteFromCurrent > 0) {
            currentNode.deleteData(startPosition, deleteFromCurrent);
        }

        // Handle remaining length if marker spans to next node
        const remainingLength: number = deleteLength - deleteFromCurrent;
        if (remainingLength > 0 && currentIndex + 1 < textNodes.length) {
            const nextNode: Text = textNodes[currentIndex + 1] as Text;
            const nextText: string = nextNode.textContent || '';
            if (nextText.startsWith(syntax.repeat(remainingLength))) {
                nextNode.deleteData(0, remainingLength);
            }
            return remainingLength;
        }
        return 0;
    }

    private processMarkdownMatch(matchInfo: { match: RegExpMatchArray; tag: string; syntax: string }, textNodes: Node[],
                                 macthedRange: { startNodeIndex: number; endNodeIndex: number; startPosition: number;
                                     endPosition: number }): void {
        const tag: string = matchInfo.tag;

        switch (tag) {
        case 'em-strong':
            // Wrap content with <em><strong> tags
            this.wrapContentWithTags(textNodes, macthedRange, 'italic', 'bold');
            break;
        case 'strong':
            // Wrap content with <strong> tag
            this.wrapContentWithTags(textNodes, macthedRange, 'bold');
            break;
        case 'em':
            // Wrap content with <em> tag
            this.wrapContentWithTags(textNodes, macthedRange, 'italic');
            break;
        case 'code':
            // Wrap content with <code> tag
            this.wrapContentWithTags(textNodes, macthedRange, 'inlinecode');
            break;
        case 's':
            // Wrap content with <s> tag for strikethrough
            this.wrapContentWithTags(textNodes, macthedRange, 'strikethrough');
            break;
        }
    }

    private wrapContentWithTags(textNodes: Node[], macthedRange: { startNodeIndex: number; endNodeIndex: number;
        startPosition: number; endPosition: number }, ...tags: string[]): void {
        // Implementation to wrap content with specified tags
        // This is a placeholder; actual DOM manipulation would depend on your editor's API
        const range: Range = document.createRange();
        let startNode: Text = textNodes[macthedRange.startNodeIndex as number] as Text;
        const endNode: Text = textNodes[macthedRange.endNodeIndex as number] as Text;
        if (startNode.textContent.length === macthedRange.startPosition) {
            startNode = textNodes[macthedRange.startNodeIndex + 1] as Text;
            macthedRange.startPosition = 0;
        }

        range.setStart(startNode, macthedRange.startPosition);
        range.setEnd(endNode, macthedRange.endPosition);
        this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, range.startContainer, range.endContainer,
                                                   range.startOffset, range.endOffset);
        SelectionCommands.applyFormat(this.parent.currentDocument, tags[0], this.parent.editableElement, this.enterkey);
        if  (!isNullOrUndefined(tags[1])) {
            SelectionCommands.applyFormat(this.parent.currentDocument, tags[1], this.parent.editableElement, this.enterkey);
        }
        const selectedNodes: Node[] = this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument);
        const selectedContent: Node = selectedNodes[selectedNodes.length - 1];
        const isBoldItalic: boolean = tags.length === 2;
        const isRevert: boolean = this.isReverted(selectedContent, tags);
        this.setCursorPoint(selectedContent, isBoldItalic, isRevert);
    }
    private setCursorPoint(selectedContent: Node, isBoldItalic: boolean, isRevert: boolean): void {
        const doc: Document = this.parent.currentDocument;
        if (isRevert) {
            this.parent.nodeSelection.setCursorPoint(doc, (selectedContent as HTMLElement), selectedContent.textContent.length);
        } else if (!isBoldItalic) {
            selectedContent.parentElement.insertAdjacentText('afterend', '\u200B'); // added a zero width space and focused
            this.parent.nodeSelection.setCursorPoint(doc, (selectedContent.parentElement.nextSibling as HTMLElement), 1);
        } else {
            selectedContent.parentElement.parentElement.insertAdjacentText('afterend', '\u200B'); // added a zero width space and focused
            this.parent.nodeSelection.setCursorPoint(doc, (selectedContent.parentElement.parentElement.nextSibling as HTMLElement), 1);
        }
    }
    private isReverted (selectedContent: Node, tags: string[]): boolean {
        const element: string = tags[tags.length - 1];
        const parentElement: HTMLElement = selectedContent.parentElement;
        let appliedFormat: string;
        switch (element) {
        case 'bold':
            appliedFormat = 'STRONG';
            break;
        case 'italic':
            appliedFormat = 'EM';
            break;
        case 'inlinecode':
            appliedFormat = 'CODE';
            break;
        case 'strikethrough':
            appliedFormat = 'SPAN';
            break;
        }
        if (appliedFormat === 'SPAN') {
            if (parentElement.nodeName === 'SPAN' && parentElement.style.textDecoration === 'line-through') {
                return false;
            } else {
                return true;
            }
        }
        if (parentElement.nodeName === appliedFormat) {
            return false;
        } else {
            return true;
        }
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
