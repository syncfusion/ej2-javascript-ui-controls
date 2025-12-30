import { BaseStylesProp, BlockModel, ContentModel, StyleModel, Styles } from '../../models/index';
import { decoupleReference, generateUniqueId, getAbsoluteOffset, normalizeRange, getDeepestTextNode } from '../../common/utils/common';
import { getSelectedRange, getTextOffset, setCursorPosition } from '../../common/utils/selection';
import { getBlockContentElement, getContentElementBasedOnId } from '../../common/utils/block';
import { NodeSelection } from '../../selection/selection';
import { ExecCommandOptions, LinkData } from '../../common/interface';
import { isNodeInsideElement, findClosestParent } from '../../common/utils/dom';
import { events } from '../../common/constant';
import { sanitizeBlock, sanitizeContent } from '../../common/utils/transform';
import { FormattingHelper } from '../../common/utils/isformatted';
import * as constants from '../../common/constant';
import { BlockType, ContentType } from '../../models/enums';
import { BlockFactory } from '../../block-manager/services/index';
import { BlockManager } from '../base/block-manager';
import { TableContext } from '../base/interface';

export class FormattingAction {
    private parent: BlockManager;
    /** @hidden */
    public nodeSelection: NodeSelection;
    /** @hidden */
    public lastRemovedFormat: keyof StyleModel = null;
    /** @hidden */
    public activeInlineFormats: Set<keyof StyleModel> = new Set();
    private formatCache: WeakMap<HTMLElement, Set<keyof StyleModel>> = new WeakMap<HTMLElement, Set<keyof StyleModel>>();
    private ignoredContentTypes: Set<string> = new Set<string>([ ContentType.Mention, ContentType.Label ]);
    private ignoredBlockTypes: Set<string> = new Set<string>([ BlockType.Callout, BlockType.Image, BlockType.Divider, BlockType.Code ]);

    constructor(manager?: BlockManager) {
        this.parent = manager;
        this.nodeSelection = new NodeSelection(this.parent.blockContainer);
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on(constants.FORMATTINGACTION, this.execCommand, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off(constants.FORMATTINGACTION, this.execCommand);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Executes the formatting command based on the provided options.
     *
     * @param {ExecCommandOptions} options - The options for the formatting command.
     * @returns {void}
     * @hidden
     */
    public execCommand(options: ExecCommandOptions): void {
        this.performOperation(options);
    }

    private performOperation(options: ExecCommandOptions): void {
        const blocksToFormat: BlockModel[] = this.resolveBlocksToFormat();
        if (!blocksToFormat || blocksToFormat.length === 0) { return; }

        this.nodeSelection.saveSelection();

        const { blockIDs, oldBlockModels, updatedBlockModels } = this.applyFormattingToBlocks(blocksToFormat, options);

        this.nodeSelection.restoreSelection();

        this.parent.undoRedoAction.trackFormattingForUndoRedo(
            blockIDs,
            oldBlockModels,
            updatedBlockModels,
            options.isTypingWithFormat,
            this.nodeSelection.savedSelectionState
        );

        this.parent.observer.notify('formatting-performed', options);
    }

    private applyFormattingToBlocks(
        blocks: BlockModel[],
        options: ExecCommandOptions
    ): { blockIDs: string[]; oldBlockModels: BlockModel[]; updatedBlockModels: BlockModel[] } {
        const blockIDs: string[] = [];
        const oldBlockModels: BlockModel[] = [];
        const updatedBlockModels: BlockModel[] = [];


        for (const block of blocks) {
            if (this.ignoredBlockTypes.has(block.blockType) || block.content.length <= 0) {
                continue;
            }

            const contentEl: HTMLElement = getBlockContentElement(this.parent.getBlockElementById(block.id));
            if (!contentEl || contentEl.textContent.trim() === '') {
                continue;
            }

            blockIDs.push(block.id);
            oldBlockModels.push(decoupleReference(sanitizeBlock(block)));

            this.processFormattingActions(block, options);
            this.removeRootContentId(getBlockContentElement(this.parent.getBlockElementById(block.id)));

            updatedBlockModels.push(decoupleReference(sanitizeBlock(block)));
        }

        return { blockIDs, oldBlockModels, updatedBlockModels };
    }

    private processFormattingActions(block: BlockModel, options: ExecCommandOptions): void {
        const oldBlock: BlockModel = decoupleReference(sanitizeBlock(block));
        const newContents: ContentModel[] = this.processContentModel(block, options);

        /* Model */
        this.parent.blockService.updateContent(block.id, newContents);
        this.parent.stateManager.updateManagerBlocks();

        /* DOM */
        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: block, oldBlock: oldBlock } ]
        }});
    }

    private processContentModel(
        block: BlockModel,
        options: ExecCommandOptions
    ): ContentModel[] {
        const newContent: ContentModel[] = [];
        const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
        const range: Range = this.getBlockSpecificRange(getSelectedRange(), blockElement);
        const selectedContents: ContentModel[] = this.getSelectedContents(range, block.content, blockElement);
        const formatIntent: boolean = this.getFormatIntent(selectedContents, options.command);
        for (const content of block.content) {
            const contentText: string = content.content;
            const contentLength: number = contentText.length;

            const contentElement: HTMLElement = getContentElementBasedOnId(content.id, blockElement);
            const isStartInsideContent: boolean = isNodeInsideElement(range.startContainer, contentElement);
            const isEndInsideContent: boolean = isNodeInsideElement(range.endContainer, contentElement);
            const isContentFullyInsideSelection: boolean = this.isContentFullyInsideSelection(contentElement, range);
            if ((!isStartInsideContent && !isEndInsideContent && !isContentFullyInsideSelection)
                || this.ignoredContentTypes.has(content.contentType)) {
                // Fully outside selection — just copy as-it-is
                newContent.push({ ...content });
                continue;
            }
            const startContentElement: HTMLElement = findClosestParent(range.startContainer, `#${content.id}`) as HTMLElement;
            const endContentElement: HTMLElement = findClosestParent(range.endContainer, `#${content.id}`) as HTMLElement;

            const localOffsets: { start: number, end: number } = this.calculateLocalOffsets(
                contentLength, contentElement, isStartInsideContent, isEndInsideContent, range
            );

            const beforeText: string = contentText.substring(0, localOffsets.start);
            const selectedText: string = contentText.substring(localOffsets.start, localOffsets.end);
            const afterText: string = contentText.substring(localOffsets.end);

            /* If both start and end are outside the content and content is fully inside selection,
            then current content element is the reference node */
            const isMiddleNode: boolean = !isStartInsideContent && !isEndInsideContent && isContentFullyInsideSelection;
            const isOnlyContentSelected: boolean = (
                isStartInsideContent && isEndInsideContent && isContentFullyInsideSelection &&
                (startContentElement === endContentElement) && (startContentElement === contentElement)
            );
            if (beforeText) {
                newContent.push(
                    this.processSurroundSegment(beforeText, content, false)
                );
            }
            if (selectedText) {
                newContent.push(
                    this.processSelectedSegment(
                        options, selectedText, content,
                        !isOnlyContentSelected, formatIntent, isMiddleNode
                    )
                );
            }
            if (afterText) {
                newContent.push(
                    this.processSurroundSegment(afterText, content, true)
                );
            }
        }

        return newContent;
    }

    private processSurroundSegment(
        text: string,
        content: ContentModel,
        isAfterText: boolean
    ): ContentModel {
        const newId: string = isAfterText ? generateUniqueId(constants.CONTENT_ID_PREFIX) : null;
        const processedContent: ContentModel = BlockFactory.createContentFromPartial({
            ...decoupleReference(sanitizeContent(content)),
            id: newId,
            content: text
        });

        return processedContent;
    }

    private processSelectedSegment(
        options: ExecCommandOptions,
        selectedText: string,
        content: ContentModel,
        shouldForce: boolean,
        formatIntent: boolean,
        isMiddleNode: boolean
    ): ContentModel {
        let selectedContent: ContentModel = decoupleReference(sanitizeContent(content));

        if (!isMiddleNode) {
            const newId: string = generateUniqueId(constants.CONTENT_ID_PREFIX);
            selectedContent = BlockFactory.createContentFromPartial({
                ...selectedContent,
                id: newId,
                content: selectedText
            });
        }

        return this.toggleFormat(selectedContent, options, shouldForce, formatIntent);
    }

    private toggleFormat(content: ContentModel, options: ExecCommandOptions, force: boolean, formatIntent: boolean): ContentModel {
        /* Handle if it is sub command */
        if (!options.command && (content.contentType === ContentType.Link || options.subCommand === ContentType.Link)) {
            return this.parent.blockService.applyLinkFormatting(content, options.value as LinkData);
        }

        /* Command handling */
        return this.parent.blockService.toggleContentStyles(content, options.command, force, formatIntent, options.value as string);
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

        this.parent.stateManager.updateContentOnUserTyping(blockElement);
        const createdRange: Range = this.nodeSelection.createRangeWithOffsets(
            range.startContainer, range.startContainer, range.startOffset - 1, range.startOffset
        );

        this.activeInlineFormats.forEach((format: keyof StyleModel) => {
            if (this.isNodeFormattedWith(currentNode, format)) {
                // Skip this format since it's already applied
                return;
            }
            this.execCommand({ command: format, isTypingWithFormat: true });
        });

        createdRange.collapse(false);
        this.parent.editorMethods.selectRange(createdRange);

        setCursorPosition(contentElement, absoluteOffset);
        return true;
    }

    private removeFormatToLastCharacter(
        blockElement: HTMLElement,
        contentElement: HTMLElement,
        range: Range,
        absoluteOffset: number
    ): boolean {
        this.parent.stateManager.updateContentOnUserTyping(blockElement);
        const createdRange: Range = this.nodeSelection.createRangeWithOffsets(
            range.startContainer, range.startContainer, range.startOffset - 1, range.startOffset
        );

        this.execCommand({ command: this.lastRemovedFormat, isTypingWithFormat: true });

        this.lastRemovedFormat = null;
        createdRange.collapse(false);
        this.parent.editorMethods.selectRange(createdRange);
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

    private getBlockSpecificRange(globalRange: Range, blockElement: HTMLElement): Range {
        const contentElement: HTMLElement = getBlockContentElement(blockElement);

        const blockRange: Range = document.createRange();
        const startTextNode: Node = contentElement.firstChild.nodeType === Node.ELEMENT_NODE
            ? (getDeepestTextNode((contentElement.firstChild as HTMLElement)) || contentElement.firstChild) : contentElement.firstChild;
        const endTextNode: Node = contentElement.lastChild.nodeType === Node.ELEMENT_NODE ?
            (getDeepestTextNode((contentElement.lastChild as HTMLElement)) || contentElement.lastChild) : contentElement.lastChild;
        const tableEle: HTMLElement = blockElement.closest('.' + constants.TABLE_BLOCK_CLS) as HTMLElement;
        const hasActiveSel: boolean = this.parent.tableSelectionManager.hasActiveTableSelection(tableEle);
        blockRange.selectNodeContents(contentElement);
        blockRange.setStart(startTextNode, 0);
        blockRange.setEnd(endTextNode, endTextNode.textContent.length);

        if (!globalRange || hasActiveSel) { return blockRange; }

        if (isNodeInsideElement(globalRange.startContainer, blockElement)) {
            blockRange.setStart(globalRange.startContainer, globalRange.startOffset);
        }

        if (isNodeInsideElement(globalRange.endContainer, blockElement)) {
            blockRange.setEnd(globalRange.endContainer, globalRange.endOffset);
        }

        return blockRange;
    }

    private isContentFullyInsideSelection(contentElement: HTMLElement, range: Range): boolean {
        const selectionRange: Range = range.cloneRange();
        const contentRange: Range = document.createRange();
        contentRange.selectNodeContents(contentElement);
        return selectionRange.compareBoundaryPoints(Range.START_TO_END, contentRange) > 0 &&
               selectionRange.compareBoundaryPoints(Range.END_TO_START, contentRange) < 0;
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

    private getFormatIntent(selectedContents: ContentModel[], format: keyof StyleModel): boolean {
        // If even one content doesn't have the format, we intend to apply it
        for (const content of selectedContents) {
            const styles: Styles = (content.properties as BaseStylesProp).styles;
            if (this.ignoredContentTypes.has(content.contentType) || (styles && format in styles && styles[format as keyof StyleModel])) {
                // Continue checking others
                continue;
            }
            return true; // At least one lacks the format → apply
        }
        return false; // All have the format → remove
    }

    private getSelectedContents(range: Range, contents: ContentModel[], blockElement: HTMLElement): ContentModel[] {
        const selected: ContentModel[] = [];
        const normalizedRange: Range = normalizeRange(this.getBlockSpecificRange(range, blockElement));
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
        if (contentElement.id && contentElement.firstChild.nodeType === Node.ELEMENT_NODE) {
            contentElement.removeAttribute('id');
        }
    }

    private resolveBlocksToFormat(): BlockModel[] {
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        const range: Range = getSelectedRange();

        // Case A: Whole blocks are selected (including possible Table blocks)
        if (selectedBlocks && selectedBlocks.length > 0) {
            return this.expandSelectedBlocks(selectedBlocks);
        }

        // Case B: No block selection → likely table cell selection
        if ((!range) && (!selectedBlocks || selectedBlocks.length === 0)) {
            return this.getSelectedCellBlocksFromTable();
        }

        // Fallback: should never happen
        return [];
    }

    private expandSelectedBlocks(selectedBlocks: BlockModel[]): BlockModel[] {
        const result: BlockModel[] = [];

        for (const block of selectedBlocks) {
            if (block.blockType === BlockType.Table) {
                const tableEl: HTMLElement = this.parent.getBlockElementById(block.id);
                result.push(...this.parent.tableSelectionManager.getAllCellBlocks(tableEl));
            } else {
                result.push(block);
            }
        }
        return result;
    }

    private getSelectedCellBlocksFromTable(): BlockModel[] {
        const tableCtx: TableContext = this.parent.blockRenderer.tableRenderer.resolveTableContext();
        if (tableCtx && tableCtx.tableBlockEl) {
            return this.parent.tableSelectionManager.getSelectedCellBlocks(tableCtx.tableBlockEl);
        }
        return [];
    }

    public destroy(): void {
        this.removeEventListeners();
        this.lastRemovedFormat = null;
        this.activeInlineFormats = null;
        this.nodeSelection = null;
        this.formatCache = null;
        this.activeInlineFormats = null;
        this.ignoredContentTypes = null;
        this.ignoredBlockTypes = null;
    }
}
