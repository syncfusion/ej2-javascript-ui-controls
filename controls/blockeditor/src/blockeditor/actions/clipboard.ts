import { BlockEditor } from '../base/blockeditor';
import { BlockModel, ContentModel } from '../models/index';
import { BlockType } from '../base/enums';
import { generateUniqueId, isolateModel, getAbsoluteOffset } from '../utils/common';
import { getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentElementBasedOnId, getContentModelById, isAtStartOfBlock } from '../utils/block';
import { findClosestParent, isElementEmpty } from '../utils/dom';
import { convertHtmlElementToBlocks, getBlockDataAsHTML, convertInlineElementsToContentModels } from '../utils/html-parser';
import { sanitizeBlock, sanitizeContent, sanitizeContents } from '../utils/transform';
import { getSelectedRange, setCursorPosition } from '../utils/selection';
import { IClipboardPayloadOptions, ISplitContentData } from '../base/interface';
import { ClipboardCleanupModule } from '../plugins/index';
import { BeforePasteEventArgs } from '../base/eventargs';
import { actionType, events } from '../base/constant';
import * as constants from '../base/constant';
import { createBlocksFromPlainText, generatePlainTextForExternalClipboard, isBlockLevelContent, unWrapContainer } from '../utils/clipboard-utils';
import { BlockFactory } from '../services/index';

/* eslint-disable @typescript-eslint/no-misused-new, no-redeclare */
interface ClipboardItem {
    new (items: { [mimeType: string]: Blob }): ClipboardItem;
    types: string[];
    getType: (type: string) => Promise<Blob>;
}
declare let ClipboardItem: any;

interface Blob {
    text(): Promise<string>;
}

declare const Blob: {
    prototype: Blob;
    new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};
/* eslint-enable @typescript-eslint/no-misused-new, no-redeclare */

const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024; // 5MB limit

/**
 * Handles clipboard operations (copy, cut, paste) for the Block Editor.
 */
export class ClipboardAction {
    private editor: BlockEditor;
    private isSelectivePaste: boolean;
    /** @hidden */
    public clipboardCleanupModule: ClipboardCleanupModule;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.wireEvents();
        this.clipboardCleanupModule = new ClipboardCleanupModule(this.editor);
    }

    private wireEvents(): void {
        this.editor.on(events.copy, this.handleCopy, this);
        this.editor.on(events.cut, this.handleCut, this);
        this.editor.on(events.paste, this.handlePaste, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    private unwireEvents(): void {
        this.editor.off(events.copy, this.handleCopy);
        this.editor.off(events.cut, this.handleCut);
        this.editor.off(events.paste, this.handlePaste);
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Gets the clipboard payload for the current selection.
     *
     * @returns {IClipboardPayloadOptions} - The clipboard payload containing HTML, text, and Block Editor data.
     * @hidden
     */
    public getClipboardPayload(): IClipboardPayloadOptions {
        if (getSelectedRange().toString().trim().length > 0) {
            const tempDiv: HTMLElement = document.createElement('div');
            tempDiv.appendChild(getSelectedRange().cloneContents());

            const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
            const blocks: BlockModel[] = this.createPartialBlockModels(tempDiv, selectedBlocks);

            return {
                blockeditorData: selectedBlocks.length > 1
                    ? JSON.stringify({ blocks })
                    : JSON.stringify({ contents: this.createPartialContentModels(tempDiv, selectedBlocks[0]) }),
                html: getBlockDataAsHTML(blocks),
                text: generatePlainTextForExternalClipboard(blocks)
            };
        }

        const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        const sanitizedBlock: BlockModel = sanitizeBlock(blockModel);
        sanitizedBlock.id = generateUniqueId(constants.BLOCK_ID_PREFIX);

        return {
            blockeditorData: JSON.stringify({ block: sanitizedBlock }),
            html: getBlockDataAsHTML([blockModel]),
            text: generatePlainTextForExternalClipboard([blockModel])
        };
    }

    /**
     * Handles the cut operation.
     *
     * @param {ClipboardEvent} e - The clipboard event.
     * @returns {void}
     * @hidden
     */
    public handleCut(e: ClipboardEvent): void {
        this.handleCopy(e);
        this.performCutOperation();
    }

    /**
     * Handles the copy operation.
     *
     * @param {ClipboardEvent} e - The clipboard event.
     * @returns {void}
     * @hidden
     */
    public handleCopy(e: ClipboardEvent): void {
        e.preventDefault();

        const { html, text, blockeditorData }: IClipboardPayloadOptions = this.getClipboardPayload();

        e.clipboardData.setData('text/html', html);
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/blockeditor', blockeditorData);

        this.editor.contextMenuModule.updateClipboardCacheState();
    }

    /**
     * Handles the paste operation.
     *
     * @param {ClipboardEvent} e - The clipboard event.
     * @returns {void}
     * @hidden
     */
    public handlePaste(e: ClipboardEvent): void {
        e.preventDefault();

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        this.performPasteOperation({
            blockeditorData: e.clipboardData.getData('text/blockeditor'),
            html: e.clipboardData.getData('text/html'),
            text: e.clipboardData.getData('text/plain'),
            file: (e.clipboardData.items && e.clipboardData.items.length) > 0 ? e.clipboardData.items[0].getAsFile() : null
        });

        this.editor.isProtectedOnChange = prevOnChange;
    }

    private createPartialBlockModels(selectionContainer: HTMLElement, originalBlocks: BlockModel[]): BlockModel[] {
        return originalBlocks.length === 0 ? [] : originalBlocks.map((block: BlockModel) => {
            const blockElement: HTMLElement = selectionContainer.querySelector('.e-block#' + block.id) as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement) || selectionContainer;
            return BlockFactory.createBlockFromPartial({
                ...isolateModel(sanitizeBlock(block)),
                content: this.createPartialContentModels(contentElement, block)
            });
        });
    }

    private createPartialContentModels(selectionContainer: HTMLElement, originalBlock: BlockModel): ContentModel[] {
        return Array.from(selectionContainer.childNodes)
            .filter((node: Node) => node.textContent !== '')
            .map((node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const contentElement: HTMLElement = getClosestContentElementInDocument(node);
                    const originalContentModel: ContentModel = getContentModelById(contentElement.id, originalBlock.content);
                    if (!originalContentModel) { return null; }

                    const clonedContent: ContentModel = sanitizeContent(originalContentModel);
                    clonedContent.id = generateUniqueId(constants.CONTENT_ID_PREFIX);
                    clonedContent.content = node.textContent;
                    return clonedContent;
                }
                return node.nodeType === Node.TEXT_NODE
                    ? BlockFactory.createTextContent({ content: node.textContent })
                    : null;
            })
            .filter(Boolean);
    }

    private performCutOperation(): void {
        if (getSelectedRange().toString().trim().length > 0) {
            this.performDeletionOperation(getSelectedRange());
        } else {
            const blockElement: HTMLElement = this.editor.currentFocusedBlock as HTMLElement;
            const nextBlock: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            const previousBlock: HTMLElement = blockElement.previousElementSibling as HTMLElement;

            this.editor.blockCommandManager.deleteBlock({ blockElement: this.editor.currentFocusedBlock });
            this.editor.setFocusToBlock(nextBlock || previousBlock);
        }
    }

    private performPasteOperation(args: IClipboardPayloadOptions): void {
        const { blockeditorData, html, text, file }: IClipboardPayloadOptions = args;

        if (file && (file.size < MAX_IMAGE_SIZE)) {
            this.editor.blockRendererManager.imageRenderer.handleFilePaste(file);
            const url: string = URL.createObjectURL(file);
            URL.revokeObjectURL(url); // Immediately revoke to free memory
            return;
        }

        const beforePasteEventArgs: BeforePasteEventArgs = { cancel: false, content: text };
        this.editor.trigger('beforePaste', beforePasteEventArgs);
        if (beforePasteEventArgs.cancel) { return; }

        if (getSelectedRange().toString().trim().length > 0) {
            this.isSelectivePaste = true;
            this.performDeletionOperation(getSelectedRange());
        }

        const currentBlock: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.getEditorBlocks());
        if (currentBlock.type === BlockType.Code) {
            this.handleCodeBlockContentPaste(text, currentBlock);
            this.triggerAfterPasteEvent(text);
            return;
        }

        if (blockeditorData) {
            this.handleBlockEditorPaste(blockeditorData, text);
            this.triggerAfterPasteEvent(text);
            return;
        }

        const cleanedData: string = this.clipboardCleanupModule.cleanupPaste({ html: html, plainText: text });
        if (html && !this.editor.pasteSettings.plainText) {
            this.handleHtmlPaste(cleanedData);
        } else if (text) {
            this.handlePlainTextPaste(text);
        }
        this.triggerAfterPasteEvent(text);

        this.isSelectivePaste = false;
    }

    private performDeletionOperation(range: Range): void {
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
        if (selectedBlocks.length === 1) {
            const blockElement: HTMLElement = this.editor.getBlockElementById(selectedBlocks[0].id);
            range.deleteContents();
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            Array.from(contentElement.childNodes).forEach((node: Node) => {
                if (node.textContent.trim() === '') {
                    (node as HTMLElement).remove();
                }
            });

            this.editor.stateManager.updateContentOnUserTyping(blockElement);
            this.editor.blockRendererManager.setFocusAndUIForNewBlock(blockElement);
            setCursorPosition(contentElement, getAbsoluteOffset(contentElement, range.startContainer, range.startOffset));

            if (selectedBlocks[0].type === BlockType.Code && contentElement && contentElement.textContent.trim() === '') {
                contentElement.innerHTML = '<br>';
            }
            return;
        }
        this.editor.blockCommandManager.handleSelectiveDeletions(new KeyboardEvent('keydown', { key: 'Backspace' }));
    }

    private handleBlockEditorPaste(data: string, text: string): void {
        try {
            const parsedData: any = JSON.parse(data);
            const props: string = Object.keys(parsedData)[0];
            switch (props) {
            case 'blocks':
                this.handleMultiBlocksPaste(parsedData.blocks);
                break;
            case 'block':
                this.editor.blockCommandManager.addBulkBlocks({
                    blocks: [parsedData.block],
                    targetBlockId: this.editor.currentFocusedBlock.id,
                    insertionType: 'block',
                    isSelectivePaste: this.isSelectivePaste
                });
                break;
            case 'contents':
                this.handleContentPasteWithinBlock(parsedData.contents);
                break;
            }
        } catch (error) {
            console.error('Error parsing Block Editor clipboard data:', error);
            // Fallback to plain text paste
            this.handlePlainTextPaste(text);
        }
    }

    private handleContentPasteWithinBlock(content: ContentModel[]): void {
        if (!content.length) { return; }

        const range: Range = this.editor.nodeSelection.getRange();
        if (!range) { return; }

        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.editor.getEditorBlocks());
        const oldContent: ContentModel[] = isolateModel(sanitizeContents(cursorBlock.content));

        const splitContent: ISplitContentData = this.editor.blockCommandManager.splitBlockAtCursor(cursorBlockElement);

        const beforeModels: ContentModel[] = this.editor.blockCommandManager.getContentModelForFragment(
            splitContent.beforeFragment,
            cursorBlock,
            null
        );
        const afterModels: ContentModel[] = this.editor.blockCommandManager.getContentModelForFragment(
            splitContent.afterFragment,
            cursorBlock,
            splitContent.beforeFragment.lastChild
        );

        /* Update model */
        this.editor.blockService.updateContent(cursorBlock.id, [
            ...beforeModels,
            ...content,
            ...afterModels
        ]);

        /* Update DOM */
        this.editor.blockRendererManager.reRenderBlockContent(cursorBlock);
        const lastNode: HTMLElement = getContentElementBasedOnId(content.pop().id, cursorBlockElement);
        setCursorPosition(lastNode, lastNode.textContent.length);

        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.clipboardPaste,
            data: {
                type: 'content',
                oldContent: oldContent,
                newContent: isolateModel(sanitizeContents(cursorBlock.content)),
                targetBlockId: cursorBlock.id,
                isSelectivePaste: this.isSelectivePaste
            }
        });
    }

    /**
     * Handles multi-block paste operation.
     *
     * @param {BlockModel[]} blocks - The blocks to be pasted.
     * @param {boolean} isUndoRedoAction - Indicates if the action is part of an undo/redo operation.
     * @returns {void}
     * @hidden
     */
    public handleMultiBlocksPaste(blocks: BlockModel[], isUndoRedoAction: boolean = false): void {
        if (!blocks.length) { return; }

        const range: Range = this.editor.nodeSelection.getRange();
        if (!range) { return; }

        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, editorBlocks);
        const oldCursorBlock: BlockModel = isolateModel(sanitizeBlock(cursorBlock));
        const contentElement: HTMLElement = getBlockContentElement(cursorBlockElement);
        const isContentEmpty: boolean = contentElement && isElementEmpty(contentElement);
        const isCursorAtStart: boolean = isAtStartOfBlock(contentElement);
        const parentBlock: BlockModel = getBlockModelById(cursorBlock.parentId, editorBlocks);

        if (parentBlock) {
            this.editor.blockService.assignParentIdToBlocks(blocks, parentBlock.id);
        }
        if (isContentEmpty) {
            this.editor.blockService.generateNewIdsForBlock(blocks[0]);
            blocks[0].id = cursorBlockElement.id;

            this.editor.blockService.replaceBlock(cursorBlock.id, blocks[0]);

            this.editor.stateManager.updatePropChangesToModel();
            cursorBlockElement.replaceWith(
                this.editor.blockRendererManager.createBlockElement(getBlockModelById(blocks[0].id, this.editor.getEditorBlocks()))
            );
        }
        else if (!isCursorAtStart) {
            this.editor.blockCommandManager.splitAndCreateNewBlockAtCursor();

            const updatedCursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.editor.getEditorBlocks());
            if (!updatedCursorBlock) { return; }

            const isContentEmptyAfterSplit: boolean = !updatedCursorBlock.content || (updatedCursorBlock.content
                && updatedCursorBlock.content.length === 1 && updatedCursorBlock.content[0].content === '');

            const contentToUpdate: ContentModel[] = isContentEmptyAfterSplit ? [...blocks[0].content] : [
                ...updatedCursorBlock.content,
                ...blocks[0].content
            ];

            this.editor.blockService.updateContent(updatedCursorBlock.id, contentToUpdate);

            this.editor.blockRendererManager.reRenderBlockContent(updatedCursorBlock);
        }

        this.editor.blockCommandManager.addBulkBlocks({
            blocks: blocks.slice((isCursorAtStart && !isContentEmpty) ? 0 : 1)
                .map((block: BlockModel) => this.editor.blockService.generateNewIdsForBlock(block)),
            targetBlockId: cursorBlock.id,
            isUndoRedoAction: isUndoRedoAction,
            insertionType: 'blocks',
            clipboardBlocks: blocks,
            oldBlockModel: oldCursorBlock,
            isPastedAtStart: isCursorAtStart,
            isSelectivePaste: this.isSelectivePaste
        });
    }

    private handleCodeBlockContentPaste(content: string, blockModel: BlockModel): void {
        const codeBlockContentElement: HTMLElement = document.getElementById(blockModel.id).querySelector('.e-code-content');
        codeBlockContentElement.textContent += content;
        blockModel.content[0].content = codeBlockContentElement.textContent;
    }

    private handleHtmlPaste(html: string): void {
        const tempDiv: HTMLElement = unWrapContainer((() => {
            const div: HTMLElement = document.createElement('div');
            div.innerHTML = html;
            return div;
        })());

        if (isBlockLevelContent(tempDiv)) {
            this.handleMultiBlocksPaste(convertHtmlElementToBlocks(tempDiv, this.editor.pasteSettings.keepFormat));
        } else {
            this.handleContentPasteWithinBlock(convertInlineElementsToContentModels(tempDiv, this.editor.pasteSettings.keepFormat));
        }
    }

    private handlePlainTextPaste(text: string): void {
        this.handleMultiBlocksPaste(createBlocksFromPlainText(text));
    }

    private triggerAfterPasteEvent(text: string): void {
        this.editor.trigger('afterPaste', { content: text });
    }

    /**
     * Checks if the clipboard is empty.
     *
     * @returns {Promise<boolean>} - A promise that resolves to true if the clipboard is empty, false otherwise.
     * @hidden
     */
    public async isClipboardEmpty(): Promise<boolean> {
        const clipboardItems: ClipboardItem[] = await (navigator as any).clipboard.read();
        return clipboardItems.length === 0;
    }

    /**
     * Handles the context copy operation.
     *
     * @returns {Promise<void>} - A promise that resolves when the copy operation is complete.
     * @hidden
     */
    public async handleContextCopy(): Promise<void> {
        const { html, text }: IClipboardPayloadOptions = this.getClipboardPayload();

        await (navigator as any).clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            })
        ]);
        this.editor.contextMenuModule.updateClipboardCacheState();
    }

    /**
     * Handles the context cut operation.
     *
     * @returns {Promise<void>} - A promise that resolves when the cut operation is complete.
     * @hidden
     */
    public async handleContextCut(): Promise<void> {
        await this.handleContextCopy();
        this.performCutOperation();
    }

    /**
     * Handles the context paste operation.
     *
     * @returns {Promise<void>} - A promise that resolves when the paste operation is complete.
     * @hidden
     */
    public async handleContextPaste(): Promise<void> {
        // eslint-disable @typescript-eslint/no-explicit-any
        let html: string = '';
        let text: string = '';
        let file: any;
        try {
            const clipboardItems: ClipboardItem[] = await (navigator as any).clipboard.read();
            for (const item of clipboardItems) {
                if (item.types.indexOf('text/html') !== -1) {
                    html = await (await item.getType('text/html') as Blob).text();
                }
                if (item.types.indexOf('text/plain') !== -1) {
                    text = await (await item.getType('text/plain') as Blob).text();
                }
                if (item.types.indexOf('image/png') !== -1) {
                    file = await item.getType('image/png');
                }
            }
        } catch (err) {
            // Fallback for insecure context
            text = await (navigator as any).clipboard.readText();
        }
        this.performPasteOperation({ html, text, file });
        // eslint-enable @typescript-eslint/no-explicit-any
    }

    public destroy(): void {
        this.unwireEvents();
        this.editor = null;
        this.clipboardCleanupModule = null;
    }
}
