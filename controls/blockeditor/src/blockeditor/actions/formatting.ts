import { BlockEditor } from '../base/blockeditor';
import { BlockModel, ContentModel, StyleModel } from '../models/index';
import { deepClone, generateUniqueId, getAbsoluteOffset, getInverseStyle, getNormalizedKey, normalizeUrl, normalizeRange } from '../utils/common';
import { getSelectionRange, getTextOffset, captureSelectionState, setCursorPosition } from '../utils/selection';
import { getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentElementBasedOnId, getParentBlock } from '../utils/block';
import { NodeSelection } from '../plugins/index';
import { ExecCommandOptions, LinkData, SubCommand } from '../base/interface';
import { isNodeInsideElement, createFormattingElement, wrapNodeWithTag, findClosestParent } from '../utils/dom';
import { ContentType } from '../base/enums';
import { events } from '../base/constant';
import { sanitizeBlock, sanitizeContent } from '../utils/transform';
import { FormattingHelper } from '../utils/isformatted';

export class FormattingAction {
    protected editor: BlockEditor;
    private options: ExecCommandOptions;
    private currentSelectionRange: Range;
    private nodeSelection: NodeSelection;
    /** @hidden */
    public lastRemovedFormat: keyof StyleModel = null;
    /** @hidden */
    public activeInlineFormats: Set<keyof StyleModel> = new Set();

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

    execCommand(args: ExecCommandOptions): void {
        this.options = args;
        this.handleFormatting(args);
        this.editor.notify('formatting-performed', args);
    }

    private handleFormatting(args: ExecCommandOptions): void {
        const range: Range = this.currentSelectionRange = getSelectionRange();
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
        if (!range || (selectedBlocks && selectedBlocks.length > 1)) { return; }
        const parentBlock: HTMLElement = getParentBlock(range.startContainer);
        if (!parentBlock) { return; }
        const contentElement: HTMLElement = getBlockContentElement(parentBlock);
        if (!contentElement) { return; }
        const block: BlockModel = getBlockModelById(parentBlock.id, this.editor.blocksInternal);
        if (!block) { return; }

        const oldBlockModel: BlockModel = deepClone(sanitizeBlock(block));
        this.nodeSelection.saveSelection(contentElement);
        this.editor.previousSelection = captureSelectionState();
        this.updateContentModel(block, range);
        if (contentElement.id) { contentElement.removeAttribute('id'); }

        this.nodeSelection.restoreSelection(contentElement);
        const newBlockModel: BlockModel = deepClone(sanitizeBlock(block));
        this.editor.undoRedoAction.pushToUndoStack({
            action: 'formattingAction',
            data: { blockId: block.id },
            oldBlockModel: oldBlockModel,
            updatedBlockModel: newBlockModel,
            isFormattingOnUserTyping: args.isFormattingOnUserTyping
        });
    }

    public toggleActiveFormats(command: keyof StyleModel): void {
        if (this.activeInlineFormats.has(command)) {
            this.activeInlineFormats.delete(command);
            this.lastRemovedFormat = command;
        } else {
            this.activeInlineFormats.add(command);
            this.lastRemovedFormat = null;
        }
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
        const blockElement: HTMLElement = findClosestParent(range.startContainer, '.e-block');
        if (!blockElement) { return false; }
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const absoluteOffset: number = getAbsoluteOffset(contentElement, range.startContainer, range.startOffset);

        if (this.lastRemovedFormat &&
            this.isNodeFormattedWith(currentNode, this.lastRemovedFormat)) {
            this.editor.updateContentOnUserTyping(blockElement);
            const newRange: Range = document.createRange();
            newRange.setStart(range.startContainer, range.startOffset - 1);
            newRange.setEnd(range.startContainer, range.startOffset);

            selection.removeAllRanges();
            selection.addRange(newRange);

            this.execCommand({ command: this.lastRemovedFormat, isFormattingOnUserTyping: true });

            this.lastRemovedFormat = null;
            newRange.collapse(false);
            selection.removeAllRanges();
            selection.addRange(newRange);
            setCursorPosition(contentElement, absoluteOffset);
            return true;
        }

        if (this.areAllActiveFormatsApplied(currentNode)) {
            return false;
        }

        this.editor.updateContentOnUserTyping(blockElement);
        const newRange: Range = document.createRange();
        newRange.setStart(range.startContainer, range.startOffset - 1);
        newRange.setEnd(range.startContainer, range.startOffset);

        selection.removeAllRanges();
        selection.addRange(newRange);

        this.activeInlineFormats.forEach((format: keyof StyleModel) => {
            if (this.isNodeFormattedWith(currentNode, format)) {
                // Skip this format since it's already applied
                return;
            }
            this.execCommand({ command: format, isFormattingOnUserTyping: true });
        });

        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);

        setCursorPosition(contentElement, absoluteOffset);
        return true;
    }

    private updateContentModel(block: BlockModel, range: Range): void {
        const updatedContents: ContentModel[] = this.createContentFragments(
            block.content,
            range
        );
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        block.content = updatedContents;
        (this.editor as any).isProtectedOnChange = prevOnChange;
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    private createContentFragments(
        existingContent: ContentModel[],
        range: Range
    ): ContentModel[] {
        const newContent: ContentModel[] = [];
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        const contentWrapper: HTMLElement = findClosestParent(startContainer, '.e-block-content') as HTMLElement;
        const blockElement: HTMLElement = findClosestParent(startContainer, '.e-block') as HTMLElement;
        const selectedContents: ContentModel[] = this.getSelectedContents(range, existingContent, blockElement);
        const formatKey: keyof StyleModel = this.options.command;
        const formatIntent: boolean = this.getFormatIntent(selectedContents, formatKey);
        let isFreshFormatting: boolean = false;

        for (const content of existingContent) {
            const contentText: string = content.content;
            const contentLength: number = contentText.length;

            const contentElement: HTMLElement = getContentElementBasedOnId(content, blockElement);
            const isStartInsideContent: boolean = isNodeInsideElement(this.currentSelectionRange.startContainer, contentElement);
            const isEndInsideContent: boolean = isNodeInsideElement(this.currentSelectionRange.endContainer, contentElement);
            const isContentFullyInsideSelection: boolean = this.isContentFullyInsideSelection(contentElement, range);
            if (!isStartInsideContent && !isEndInsideContent && !isContentFullyInsideSelection) {
                // Fully outside selection — just copy as-it-is
                newContent.push({ ...content });
                continue;
            }
            const newChunks: ContentModel[] = [];
            const [sanitizedContent]: ContentModel[] = sanitizeContent([content]);
            const startContentElement: HTMLElement = findClosestParent(startContainer, `#${content.id}`) as HTMLElement;
            const endContentElement: HTMLElement = findClosestParent(endContainer, `#${content.id}`) as HTMLElement;
            isFreshFormatting = startContentElement === contentWrapper && endContentElement === contentWrapper;

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

            const beforeText: string = contentText.substring(0, localStart);
            const selectedText: string = contentText.substring(localStart, localEnd);
            const afterText: string = contentText.substring(localEnd);

            let referenceNode: HTMLElement = isStartInsideContent ? startContentElement : endContentElement;
            /* If both start and end are outside the content and content is fully inside selection,
            then current content element is the reference node */
            const isMiddleNode: boolean = !isStartInsideContent && !isEndInsideContent && isContentFullyInsideSelection;
            const isOnlyContentSelected: boolean = (
                isStartInsideContent &&
                isEndInsideContent &&
                isContentFullyInsideSelection &&
                startContentElement === endContentElement &&
                startContentElement === contentElement
            );
            const shouldForce: boolean = !isOnlyContentSelected;
            if (isMiddleNode) {
                referenceNode = contentElement;
            }
            if (beforeText) {
                const beforeContent: ContentModel = deepClone(sanitizedContent);
                beforeContent.content = beforeText;
                newChunks.push(beforeContent);
                const beforeElement: HTMLElement = createFormattingElement(beforeContent);
                if (isFreshFormatting) {
                    contentWrapper.appendChild(beforeElement);
                }
                else {
                    contentWrapper.insertBefore(beforeElement, referenceNode);
                }
            }
            if (selectedText) {
                let selectedContent: ContentModel = content;
                if (!isMiddleNode) {
                    selectedContent = deepClone(sanitizedContent);
                    selectedContent.id = generateUniqueId('content');
                    selectedContent.content = selectedText;
                }
                this.toggleFormat(selectedContent, shouldForce, formatIntent);
                this.handleSubCommand(selectedContent);
                newChunks.push(selectedContent);
                const selectedElement: HTMLElement = createFormattingElement(
                    selectedContent, this.options.value
                );
                if (isFreshFormatting) {
                    contentWrapper.appendChild(selectedElement);
                }
                else {
                    contentWrapper.insertBefore(selectedElement, referenceNode);
                }
            }
            if (afterText) {
                const afterContent: ContentModel = deepClone(sanitizedContent);
                afterContent.id = generateUniqueId('content');
                afterContent.content = afterText;
                newChunks.push(afterContent);
                const afterElement: HTMLElement = createFormattingElement(afterContent);
                if (isFreshFormatting) {
                    contentWrapper.appendChild(afterElement);
                }
                else {
                    contentWrapper.insertBefore(afterElement, referenceNode);
                }
            }
            newContent.push(...newChunks);
            if (!isFreshFormatting) {
                contentWrapper.removeChild(referenceNode);
            }
        }
        if (isFreshFormatting) {
            contentWrapper.removeChild(startContainer);
        }
        return newContent;
    }

    private isContentFullyInsideSelection(contentElement: HTMLElement, range: Range): boolean {
        const selectionRange: Range = range.cloneRange();
        const contentRange: Range = document.createRange();
        contentRange.selectNodeContents(contentElement);
        return selectionRange.compareBoundaryPoints(Range.START_TO_END, contentRange) > 0 &&
               selectionRange.compareBoundaryPoints(Range.END_TO_START, contentRange) < 0;
    }

    private toggleFormat(content: ContentModel, force: boolean, formatIntent: boolean): void {
        const format: keyof StyleModel = this.options.command;
        const value: string = (this.options.value as string);
        const isBooleanStyle: boolean = ['bold', 'italic', 'underline', 'strikethrough',
            'superscript', 'subscript', 'uppercase', 'lowercase'].indexOf(format) !== -1;
        const isTogglePair: boolean = ['superscript', 'subscript', 'uppercase', 'lowercase'].indexOf(format) !== -1;
        const ignoredTypes: string[] = ['Link', 'Code', 'Emoji', 'Mention'];
        const isIgnoredtype: boolean = (ignoredTypes.indexOf(this.options.subCommand) !== -1);
        if (isIgnoredtype) {
            return;
        }
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (isBooleanStyle) {
            let newValue: boolean = !((content.styles as any)[`${format}`] as boolean);
            if (force) {
                newValue = formatIntent;
            }
            ((content.styles as any)[`${format}`] as boolean) = newValue;
            if (newValue) {
                if (content.stylesApplied.indexOf(format) === -1) {
                    content.stylesApplied = [...content.stylesApplied, format];
                }
            } else {
                content.stylesApplied = content.stylesApplied.filter((style: string) => style !== format);
            }
            if (isTogglePair) {
                const oppositeFormat: keyof StyleModel = getInverseStyle(format);
                ((content.styles as any)[`${oppositeFormat}`] as boolean) = false;
                content.stylesApplied = content.stylesApplied.filter((style: string) => style !== oppositeFormat);
            }
        } else {
            if (value) {
                ((content.styles as any)[`${format}`] as string) = value as string;
                if (content.stylesApplied.indexOf(format) === -1) {
                    content.stylesApplied = [...content.stylesApplied, format];
                }
            } else {
                ((content.styles as any)[`${format}`] as string) = '';
                content.stylesApplied = content.stylesApplied.filter((style: string) => style !== format);
            }
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    private handleSubCommand(content: ContentModel): void {
        const subCommand: SubCommand = this.options.subCommand;
        const linkData: LinkData = this.options.value as LinkData;
        if (!this.options.command && content.type === 'Link' || subCommand === 'Link') {
            if (!linkData.shouldRemoveLink) {
                content.type = ContentType.Link;
                content.linkSettings.openInNewWindow = linkData.openInNewWindow;
                content.linkSettings.url = linkData.url;
                if (linkData.text) {
                    content.content = linkData.text;
                }
            }
            else {
                content.type = ContentType.Text;
                content.linkSettings.url = '';
                content.linkSettings.openInNewWindow = false;
                content.content = linkData.text ? linkData.text : content.content;
            }
        }
    }

    private getFormatIntent(selectedContents: ContentModel[], format: keyof StyleModel): boolean {
        // If even one content doesn't have the format, we intend to apply it
        for (const content of selectedContents) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const currentValue: boolean = ((content.styles as any)[`${format}`] as boolean);
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
            const contentElement: HTMLElement = getContentElementBasedOnId(content, blockElement);
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

        while (currentElement) {
            if (this.doesElementHaveFormat(currentElement, format)) {
                return true;
            }
            // Stop if we've reached an element with an id (root content element)
            if (currentElement.id) {
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return false;
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

    public destroy(): void {
        this.nodeSelection = null;
        this.removeEventListeners();
    }
}
