import { BlockEditor } from '../base/blockeditor';
import { BaseStylesProp, BlockModel, ContentModel, StyleModel } from '../models/index';
import { isolateModel, generateUniqueId, getAbsoluteOffset, normalizeRange } from '../utils/common';
import { getSelectedRange, getTextOffset, captureSelectionState, setCursorPosition } from '../utils/selection';
import { getBlockContentElement, getBlockModelById, getContentElementBasedOnId, getParentBlock } from '../utils/block';
import { NodeSelection } from '../plugins/index';
import { ExecCommandOptions, LinkData } from '../base/interface';
import { isNodeInsideElement, createFormattingElement, findClosestParent } from '../utils/dom';
import { actionType, events } from '../base/constant';
import { sanitizeBlock, sanitizeContent } from '../utils/transform';
import { FormattingHelper } from '../utils/isformatted';
import * as constants from '../base/constant';
import { ContentType } from '../base/enums';
import { BlockFactory } from '../services/index';

export class FormattingAction {
    protected editor: BlockEditor;
    private nodeSelection: NodeSelection;
    /** @hidden */
    public lastRemovedFormat: keyof StyleModel = null;
    /** @hidden */
    public activeInlineFormats: Set<keyof StyleModel> = new Set();
    private formatCache: WeakMap<HTMLElement, Set<keyof StyleModel>> = new WeakMap<HTMLElement, Set<keyof StyleModel>>();

    constructor(editor?: BlockEditor) {
        this.editor = editor;
        this.nodeSelection = new NodeSelection(this.editor);
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Executes the formatting command based on the provided options.
     *
     * @param {ExecCommandOptions} options - The options for the formatting command.
     * @returns {void}
     * @hidden
     */
    execCommand(options: ExecCommandOptions): void {
        this.handleFormatting(options);
        this.editor.notify('formatting-performed', options);
    }

    private handleFormatting(options: ExecCommandOptions): void {
        const range: Range = getSelectedRange();
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
        if (!range || (selectedBlocks && selectedBlocks.length > 1)) { return; }
        const parentBlock: HTMLElement = getParentBlock(range.startContainer);
        if (!parentBlock) { return; }
        const contentElement: HTMLElement = getBlockContentElement(parentBlock);
        if (!contentElement) { return; }
        const block: BlockModel = getBlockModelById(parentBlock.id, this.editor.getEditorBlocks());
        if (!block) { return; }

        const oldBlockModel: BlockModel = isolateModel(sanitizeBlock(block));

        // Save the curent selection to restore again after DOM manipulation
        this.nodeSelection.saveSelection(contentElement);
        this.editor.previousSelection = captureSelectionState();

        // Process main actions
        this.processFormattingActions(block, range, options);

        this.removeRootContentId(contentElement);

        // Restore the selection again
        this.nodeSelection.restoreSelection(contentElement);

        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.formattingAction,
            data: { blockId: block.id },
            oldBlockModel: oldBlockModel,
            updatedBlockModel: isolateModel(sanitizeBlock(block)),
            isFormattingOnUserTyping: options.isFormattingOnUserTyping
        });
    }

    private processFormattingActions(block: BlockModel, range: Range, options: ExecCommandOptions): void {
        const updatedContents: ContentModel[] = this.processContentAndDOM(
            block.content,
            range,
            options
        );
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        this.editor.blockService.updateContent(block.id, updatedContents);

        this.editor.isProtectedOnChange = prevOnChange;
    }

    private processContentAndDOM(
        existingContent: ContentModel[],
        range: Range,
        options: ExecCommandOptions
    ): ContentModel[] {
        const newContent: ContentModel[] = [];
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        const contentWrapper: HTMLElement = findClosestParent(startContainer, '.' + constants.CONTENT_CLS) as HTMLElement;
        const blockElement: HTMLElement = findClosestParent(startContainer, '.' + constants.BLOCK_CLS) as HTMLElement;
        const selectedContents: ContentModel[] = this.getSelectedContents(range, existingContent, blockElement);
        const formatKey: keyof StyleModel = options.command;
        const formatIntent: boolean = this.getFormatIntent(selectedContents, formatKey);
        let isFreshFormatting: boolean = false;

        for (const content of existingContent) {
            const contentText: string = content.content;
            const contentLength: number = contentText.length;

            const contentElement: HTMLElement = getContentElementBasedOnId(content.id, blockElement);
            const isStartInsideContent: boolean = isNodeInsideElement(startContainer, contentElement);
            const isEndInsideContent: boolean = isNodeInsideElement(endContainer, contentElement);
            const isContentFullyInsideSelection: boolean = this.isContentFullyInsideSelection(contentElement, range);
            if (!isStartInsideContent && !isEndInsideContent && !isContentFullyInsideSelection) {
                // Fully outside selection — just copy as-it-is
                newContent.push({ ...content });
                continue;
            }
            const sanitizedContent: ContentModel = sanitizeContent(content);
            const startContentElement: HTMLElement = findClosestParent(startContainer, `#${content.id}`) as HTMLElement;
            const endContentElement: HTMLElement = findClosestParent(endContainer, `#${content.id}`) as HTMLElement;
            isFreshFormatting = startContentElement === contentWrapper && endContentElement === contentWrapper;

            const localOffsets: { start: number, end: number } = this.calculateLocalOffsets(
                contentLength, contentElement, isStartInsideContent, isEndInsideContent, range
            );

            const beforeText: string = contentText.substring(0, localOffsets.start);
            const selectedText: string = contentText.substring(localOffsets.start, localOffsets.end);
            const afterText: string = contentText.substring(localOffsets.end);

            /* If both start and end are outside the content and content is fully inside selection,
            then current content element is the reference node */
            const isMiddleNode: boolean = !isStartInsideContent && !isEndInsideContent && isContentFullyInsideSelection;
            const referenceNode: HTMLElement = this.determineReferenceNode(
                isStartInsideContent, startContentElement,
                endContentElement, contentElement, isMiddleNode
            );
            const isOnlyContentSelected: boolean = (
                isStartInsideContent && isEndInsideContent && isContentFullyInsideSelection &&
                startContentElement === endContentElement && startContentElement === contentElement
            );
            const shouldForce: boolean = !isOnlyContentSelected;
            if (beforeText) {
                newContent.push(
                    this.processSurroundSegment(
                        contentWrapper, referenceNode,
                        beforeText, sanitizedContent, isFreshFormatting, false
                    )
                );
            }
            if (selectedText) {
                newContent.push(
                    this.processSelectedSegment(
                        options, contentWrapper, referenceNode,
                        selectedText, sanitizedContent,
                        isFreshFormatting, shouldForce, formatIntent, isMiddleNode
                    )
                );
            }
            if (afterText) {
                newContent.push(
                    this.processSurroundSegment(
                        contentWrapper, referenceNode,
                        afterText, sanitizedContent, isFreshFormatting, true
                    )
                );
            }
            if (!isFreshFormatting) {
                contentWrapper.removeChild(referenceNode);
            }
        }
        if (isFreshFormatting) {
            contentWrapper.removeChild(startContainer);
        }
        return newContent;
    }

    private processSurroundSegment(
        contentWrapper: HTMLElement,
        referenceNode: HTMLElement,
        text: string,
        sanitizedContent: ContentModel,
        isFreshFormatting: boolean,
        isAfterText: boolean
    ): ContentModel {
        const newId: string = isAfterText ? generateUniqueId(constants.CONTENT_ID_PREFIX) : null;
        const processedContent: ContentModel = BlockFactory.createContentFromPartial({
            ...isolateModel(sanitizedContent),
            id: newId,
            content: text
        });

        const formattedElement: HTMLElement = createFormattingElement(processedContent);

        if (isFreshFormatting) {
            contentWrapper.appendChild(formattedElement);
        } else {
            contentWrapper.insertBefore(formattedElement, referenceNode);
        }

        return processedContent;
    }

    private processSelectedSegment(
        options: ExecCommandOptions,
        contentWrapper: HTMLElement,
        referenceNode: HTMLElement,
        selectedText: string,
        sanitizedContent: ContentModel,
        isFreshFormatting: boolean,
        shouldForce: boolean,
        formatIntent: boolean,
        isMiddleNode: boolean
    ): ContentModel {
        let selectedContent: ContentModel = sanitizedContent;

        if (!isMiddleNode) {
            const newId: string = generateUniqueId(constants.CONTENT_ID_PREFIX);
            selectedContent = BlockFactory.createContentFromPartial({
                ...isolateModel(sanitizedContent),
                id: newId,
                content: selectedText
            });
        }

        const processedContent: ContentModel = this.toggleFormat(selectedContent, options, shouldForce, formatIntent);

        const selectedElement: HTMLElement = createFormattingElement(
            processedContent, options.value
        );

        if (isFreshFormatting) {
            contentWrapper.appendChild(selectedElement);
        } else {
            contentWrapper.insertBefore(selectedElement, referenceNode);
        }

        return processedContent;
    }

    /**
     * Handles formatting action on user typing.
     *
     * @returns {boolean} - Returns true if formatting was applied, false otherwise.
     * @hidden
     */
    public handleTypingWithActiveFormats(): boolean {
        const selection: Selection = window.getSelection();
        if (!selection.isCollapsed) { return false; }

        const range: Range = selection.getRangeAt(0);
        const currentNode: Node = range.startContainer;
        const blockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const absoluteOffset: number = getAbsoluteOffset(contentElement, range.startContainer, range.startOffset);

        if (this.lastRemovedFormat && this.isNodeFormattedWith(currentNode, this.lastRemovedFormat)) {
            return this.removeFormatToLastCharacter(blockElement, contentElement, range, absoluteOffset);
        }

        if (this.areAllActiveFormatsApplied(currentNode)) {
            return false;
        }

        this.editor.stateManager.updateContentOnUserTyping(blockElement);
        const createdRange: Range = this.nodeSelection.createRangeWithOffsets(
            range.startContainer, range.startContainer, range.startOffset - 1, range.startOffset
        );

        this.activeInlineFormats.forEach((format: keyof StyleModel) => {
            if (this.isNodeFormattedWith(currentNode, format)) {
                // Skip this format since it's already applied
                return;
            }
            this.execCommand({ command: format, isFormattingOnUserTyping: true });
        });

        createdRange.collapse(false);
        this.editor.selectRange(createdRange);

        setCursorPosition(contentElement, absoluteOffset);
        return true;
    }

    private removeFormatToLastCharacter(
        blockElement: HTMLElement,
        contentElement: HTMLElement,
        range: Range,
        absoluteOffset: number
    ): boolean {
        this.editor.stateManager.updateContentOnUserTyping(blockElement);
        const createdRange: Range = this.nodeSelection.createRangeWithOffsets(
            range.startContainer, range.startContainer, range.startOffset - 1, range.startOffset
        );

        this.execCommand({ command: this.lastRemovedFormat, isFormattingOnUserTyping: true });

        this.lastRemovedFormat = null;
        createdRange.collapse(false);
        this.editor.selectRange(createdRange);
        setCursorPosition(contentElement, absoluteOffset);
        return true;
    }

    /**
     * Toggles the active inline formats when formatting.
     * Triggers when user presses keys such as Ctrl+B, Ctrl+I, Ctrl+U and Ctrl+Shift+X.
     *
     * @param {string} command - The formatting command to toggle.
     * @returns {void}
     * @hidden
     */
    public toggleActiveFormats(command: keyof StyleModel): void {
        if (this.activeInlineFormats.has(command)) {
            this.activeInlineFormats.delete(command);
            this.lastRemovedFormat = command;
        } else {
            this.activeInlineFormats.add(command);
            this.lastRemovedFormat = null;
        }
    }

    private isContentFullyInsideSelection(contentElement: HTMLElement, range: Range): boolean {
        const selectionRange: Range = range.cloneRange();
        const contentRange: Range = document.createRange();
        contentRange.selectNodeContents(contentElement);
        return selectionRange.compareBoundaryPoints(Range.START_TO_END, contentRange) > 0 &&
               selectionRange.compareBoundaryPoints(Range.END_TO_START, contentRange) < 0;
    }

    private toggleFormat(content: ContentModel, options: ExecCommandOptions, force: boolean, formatIntent: boolean): ContentModel {
        /* Handle if it is sub command */
        if (!options.command && (content.type === ContentType.Link || options.subCommand === ContentType.Link)) {
            return this.editor.blockService.applyLinkFormatting(content, options.value as LinkData);
        }

        /* Command handling */
        return this.editor.blockService.toggleContentStyles(content, options.command, force, formatIntent, options.value as string);
    }

    private calculateLocalOffsets(
        contentLength: number,
        contentElement: HTMLElement,
        isStartInsideContent: boolean,
        isEndInsideContent: boolean,
        range: Range
    ): { start: number, end: number } {
        let localStart: number = 0;
        let localEnd: number = contentLength;

        if (isStartInsideContent) {
            localStart = range.startOffset + getTextOffset(range.startContainer, contentElement);
        }

        if (isEndInsideContent) {
            localEnd = range.endOffset + getTextOffset(range.endContainer, contentElement);
        }

        localStart = Math.max(0, Math.min(contentLength, localStart));
        localEnd = Math.max(localStart, Math.min(contentLength, localEnd));

        return { start: localStart, end: localEnd };
    }

    private determineReferenceNode(
        isStartInsideContent: boolean,
        startContentElement: HTMLElement,
        endContentElement: HTMLElement,
        contentElement: HTMLElement,
        isMiddleNode: boolean
    ): HTMLElement {
        let referenceNode: HTMLElement = isStartInsideContent ? startContentElement : endContentElement;

        if (isMiddleNode) {
            referenceNode = contentElement;
        }

        return referenceNode;
    }

    private getFormatIntent(selectedContents: ContentModel[], format: keyof StyleModel): boolean {
        // If even one content doesn't have the format, we intend to apply it
        for (const content of selectedContents) {
            const styles: Partial<Record<keyof StyleModel, string | boolean>> = (content.props as BaseStylesProp).styles;
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const currentValue: boolean = styles && (styles as any)[format as any] as boolean;
            if (!currentValue) {
                return true; // Apply
            }
        }
        return false; // Remove
    }

    private getSelectedContents(range: Range, contents: ContentModel[], blockElement: HTMLElement): ContentModel[] {
        const selected: ContentModel[] = [];
        const normalizedRange: Range = normalizeRange(range);
        for (const content of contents) {
            const contentElement: HTMLElement = getContentElementBasedOnId(content.id, blockElement);
            const isStartInside: boolean = isNodeInsideElement(normalizedRange.startContainer, contentElement);
            const isEndInside: boolean = isNodeInsideElement(normalizedRange.endContainer, contentElement);
            const isFullyInside: boolean = this.isContentFullyInsideSelection(contentElement, normalizedRange);

            if (isStartInside || isEndInside || isFullyInside) {
                selected.push(content);
            }
        }

        return selected;
    }

    private areAllActiveFormatsApplied(node: Node): boolean {
        let allApplied: boolean = true;

        this.activeInlineFormats.forEach((format: keyof StyleModel) => {
            if (!this.isNodeFormattedWith(node, format)) {
                allApplied = false;
            }
        });

        return allApplied;
    }

    private isNodeFormattedWith(node: Node, format: keyof StyleModel): boolean {
        let currentElement: HTMLElement = node.nodeType === Node.TEXT_NODE ?
            node.parentElement : node as HTMLElement;

        if (currentElement && this.formatCache.has(currentElement)) {
            return this.formatCache.get(currentElement)!.has(format);
        }

        const formats: Set<keyof StyleModel> = new Set<keyof StyleModel>();
        while (currentElement) {
            if (this.doesElementHaveFormat(currentElement, format)) {
                formats.add(format);
            }
            // Stop if we've reached an element with an id (root content element)
            if (currentElement.id) {
                break;
            }
            currentElement = currentElement.parentElement;
        }
        if (currentElement) { this.formatCache.set(currentElement, formats); }
        return formats.has(format);
    }

    private doesElementHaveFormat(element: HTMLElement, format: keyof StyleModel): boolean {
        switch (format) {
        case 'bold':
            return FormattingHelper.isBold(element);
        case 'italic':
            return FormattingHelper.isItalic(element);
        case 'underline':
            return FormattingHelper.isUnderline(element);
        case 'strikethrough':
            return FormattingHelper.isStrikethrough(element);
        default:
            return false;
        }
    }

    private removeRootContentId(contentElement: HTMLElement): void {
        if (contentElement.id) { contentElement.removeAttribute('id'); }
    }

    public destroy(): void {
        this.removeEventListeners();
        this.nodeSelection = null;
        this.formatCache = null;
        this.activeInlineFormats = null;
        this.editor = null;
    }
}
