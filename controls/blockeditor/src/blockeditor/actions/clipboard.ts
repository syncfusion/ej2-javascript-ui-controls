import { BlockEditor } from '../base/blockeditor';
import { BlockModel, ContentModel, StyleModel } from '../models/index';
import { BlockType, ContentType } from '../base/enums';
import { generateUniqueId, deepClone } from '../utils/common';
import { getBlockContentElement, getBlockIndexById, getBlockModelById, getClosestContentElementInDocument, getContentElementBasedOnId, getContentModelById, isAtStartOfBlock, isListTypeBlock } from '../utils/block';
import { findClosestParent, isElementEmpty } from '../utils/dom';
import { convertHtmlElementToBlocks, getBlockDataAsHTML, convertInlineElementsToContentModels } from '../utils/html-parser';
import { sanitizeBlock, sanitizeContent } from '../utils/transform';
import { getSelectionRange, setCursorPosition } from '../utils/selection';
import { IClipboardPayload, ISplitContent } from '../base/interface';
import { ClipboardCleanupModule } from '../plugins/index';
import { BeforePasteEventArgs } from '../base/eventargs';
import { events } from '../base/constant';

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

/**
 * Handles clipboard operations (copy, cut, paste) for the Block Editor.
 */
export class ClipboardAction {
    private editor: BlockEditor;
    /** @hidden */
    public clipboardCleanupModule: ClipboardCleanupModule;
    private isSelectivePaste: boolean;

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
     * @returns {IClipboardPayload} - The clipboard payload containing HTML, text, and Block Editor data.
     * @hidden
     */
    public getClipboardPayload(): IClipboardPayload {
        const range: Range = getSelectionRange();
        let blockeditorData: string = '';
        let html: string = '';
        let text: string = '';

        if (range.toString().trim().length > 0) {
            const fragment: DocumentFragment = range.cloneContents();
            const tempDiv: HTMLDivElement = document.createElement('div');
            tempDiv.appendChild(fragment);

            const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
            const blocks: BlockModel[] = this.createPartialBlockModels(tempDiv, selectedBlocks);
            if (selectedBlocks.length > 1) {
                blockeditorData = JSON.stringify({ blocks });
            } else {
                const contents: ContentModel[] = this.createPartialContentModels(tempDiv, selectedBlocks[0]);
                blockeditorData = JSON.stringify({ contents });
            }

            html = getBlockDataAsHTML(blocks);
            text = this.generatePlainTextForExternalClipboard(blocks);
        } else {
            const blockModel: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.blocksInternal);
            const sanitizedBlock: BlockModel = sanitizeBlock(blockModel);
            sanitizedBlock.id = generateUniqueId('block');

            blockeditorData = JSON.stringify({ block: sanitizedBlock });
            html = getBlockDataAsHTML([blockModel]);
            text = this.generatePlainTextForExternalClipboard([blockModel]);
        }

        return { html, text, blockeditorData };
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

        const { html, text, blockeditorData }: IClipboardPayload = this.getClipboardPayload();

        e.clipboardData.setData('text/html', html);
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/blockeditor', blockeditorData);
    }

    private createPartialBlockModels(selectionContainer: HTMLElement, originalBlocks: BlockModel[]): BlockModel[] {
        if (originalBlocks.length === 0) { return []; }
        const partialBlocks: BlockModel[] = [];
        originalBlocks.forEach((block: BlockModel) => {
            const blockElement: HTMLElement = selectionContainer.querySelector('.e-block#' + block.id) as HTMLElement;
            let contentElement: HTMLElement = getBlockContentElement(blockElement);
            if (!contentElement) {
                contentElement = selectionContainer;
            }
            partialBlocks.push({
                id: block.id,
                type: block.type,
                indent: block.indent,
                content: this.createPartialContentModels(contentElement, block),
                isChecked: block.isChecked,
                isExpanded: block.isExpanded
            });
        });
        return partialBlocks;
    }

    private createPartialContentModels(selectionContainer: HTMLElement, originalBlock: BlockModel): ContentModel[] {
        const contents: ContentModel[] = [];
        Array.from(selectionContainer.childNodes).forEach((node: Node) => {
            if (node.textContent === '') {
                return;
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                const contentElement: HTMLElement = getClosestContentElementInDocument(element);
                const originalContentModel: ContentModel = getContentModelById(contentElement.id, originalBlock.content);
                if (!originalContentModel) { return; }
                const [clonedContent]: ContentModel[] = sanitizeContent([originalContentModel]);
                if (clonedContent.type === ContentType.Label || clonedContent.type === ContentType.Mention) {
                    clonedContent.dataId = generateUniqueId(clonedContent.type.toLowerCase());
                }
                else {
                    clonedContent.id = generateUniqueId('content');
                    clonedContent.content = element.textContent;
                }
                contents.push(clonedContent);
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                contents.push({
                    id: generateUniqueId('content'),
                    type: ContentType.Text,
                    content: node.textContent
                });
            }
        });
        return contents;
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

    private performCutOperation(): void {
        const range: Range = getSelectionRange();
        if (range.toString().trim().length > 0) {
            this.performDeletionOperation(range);
        } else {
            const blockElement: HTMLElement = this.editor.currentFocusedBlock as HTMLElement;
            const nextBlock: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            const previousBlock: HTMLElement = blockElement.previousElementSibling as HTMLElement;
            this.editor.blockAction.deleteBlock({
                blockElement: this.editor.currentFocusedBlock
            });
            if (nextBlock) {
                this.editor.setFocusToBlock(nextBlock);
            }
            else if (previousBlock) {
                this.editor.setFocusToBlock(previousBlock);
            }
        }
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

        const blockeditorData: string = e.clipboardData.getData('text/blockeditor');
        const html: string = e.clipboardData.getData('text/html');
        const text: string = e.clipboardData.getData('text/plain');
        const file: File = e.clipboardData.items.length > 0 && e.clipboardData.items[0].getAsFile();

        this.performPasteOperation({
            blockeditorData, html, text, file
        });
    }

    private triggerAfterPasteEvent(text: string): void {
        this.editor.trigger('afterPaste', { content: text });
    }

    private performPasteOperation(args: IClipboardPayload): void {
        const { blockeditorData, html, text, file } = args;
        const range: Range = getSelectionRange();

        if (file) {
            this.editor.blockAction.imageRenderer.handleFilePaste(file);
            return;
        }

        const currentBlock: BlockModel = getBlockModelById(this.editor.currentFocusedBlock.id, this.editor.blocksInternal);

        const beforePasteEventArgs: BeforePasteEventArgs = { cancel: false, content: text };
        this.editor.trigger('beforePaste', beforePasteEventArgs);
        if (beforePasteEventArgs.cancel) { return; }

        if (range.toString().trim().length > 0) {
            this.isSelectivePaste = true;
            this.performDeletionOperation(range);
        }

        if (currentBlock.type === 'Code') {
            this.handleCodeBlockContentPaste(text, currentBlock);
            this.triggerAfterPasteEvent(text);
            return;
        }

        if (blockeditorData) {
            this.handleBlockEditorPaste(blockeditorData);
            this.triggerAfterPasteEvent(text);
            return;
        }

        const cleanedData: string = this.clipboardCleanupModule.cleanupPaste({
            html: html,
            plainText: text
        });
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
            contentElement.childNodes.forEach((node: Node) => {
                if (node.textContent.trim() === '') {
                    (node as HTMLElement).remove();
                }
            });
            this.editor.updateContentOnUserTyping(blockElement);
            this.editor.blockAction.setFocusAndUIForNewBlock(blockElement);
            if (selectedBlocks[0].type === 'Code') {
                if (contentElement && contentElement.textContent.trim() === '') {
                    contentElement.innerHTML = '<br>';
                }
            }
            return;
        }
        this.editor.handleSelectiveDeletions(new KeyboardEvent('keydown', { key: 'Backspace' }));
    }

    private handleBlockEditorPaste(data: string): void {
        try {
            const parsedData: any = JSON.parse(data);
            const props: string = Object.keys(parsedData)[0];
            switch (props) {
            case 'blocks':
                this.handleMultiBlocksPaste(parsedData.blocks);
                break;
            case 'block': {
                this.editor.blockAction.addBulkBlocks({
                    blocks: [parsedData.block],
                    targetBlockId: this.editor.currentFocusedBlock.id,
                    insertionType: 'block',
                    isSelectivePaste: this.isSelectivePaste
                });
                break;
            }
            case 'contents':
                this.handleContentPasteWithinBlock(parsedData.contents);
                break;
            default:
                break;
            }
        } catch (error) {
            console.error('Error parsing Block Editor clipboard data:', error);
        }
    }

    private handleContentPasteWithinBlock(content: ContentModel[]): void {
        if (!content.length) { return; }

        const range: Range = getSelectionRange();
        if (!range) { return; }

        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.e-block');
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.editor.blocksInternal);
        const oldContent: ContentModel[] = deepClone(sanitizeContent(cursorBlock.content));

        const splitContent: ISplitContent = this.editor.blockAction.splitBlockAtCursor(cursorBlockElement);

        const beforeModels: ContentModel[] = this.editor.getContentModelForFragment(
            splitContent.beforeFragment,
            cursorBlock,
            null
        );
        const afterModels: ContentModel[] = this.editor.getContentModelForFragment(
            splitContent.afterFragment,
            cursorBlock,
            splitContent.beforeFragment.lastChild
        );
        cursorBlock.content = [
            ...beforeModels,
            ...content,
            ...afterModels
        ];
        this.editor.reRenderBlockContent(cursorBlock);
        const lastNode: HTMLElement = getContentElementBasedOnId(content.pop(), cursorBlockElement);
        setCursorPosition(lastNode, lastNode.textContent.length);

        this.editor.undoRedoAction.pushToUndoStack({
            action: 'clipboardPaste',
            data: {
                type: 'content',
                oldContent: oldContent,
                newContent: deepClone(sanitizeContent(cursorBlock.content)),
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

        const range: Range = getSelectionRange();
        if (!range) { return; }

        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.e-block');
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.editor.blocksInternal);
        const oldCursorBlock: BlockModel = deepClone(sanitizeBlock(cursorBlock));
        const cursorBlockIndex: number = getBlockIndexById(cursorBlockElement.id, this.editor.blocksInternal);
        const contentElement: HTMLElement = getBlockContentElement(cursorBlockElement);
        const isContentEmpty: boolean = contentElement && isElementEmpty(contentElement);
        const isCursorAtStart: boolean = isAtStartOfBlock(contentElement);

        if (isContentEmpty) {
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            this.editor.blockAction.generateNewIdsForBlock(blocks[0]);
            blocks[0].id = cursorBlockElement.id;
            const parentBlock: BlockModel = getBlockModelById(cursorBlock.parentId, this.editor.blocksInternal);
            if (parentBlock) {
                const parentIndex: number = getBlockIndexById(parentBlock.id, this.editor.blocksInternal);
                parentBlock.children.splice(cursorBlockIndex, 1, blocks[0]);
                (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any).setProperties({ children: parentBlock.children }, true);
            }
            else {
                this.editor.blocksInternal.splice(cursorBlockIndex, 1, blocks[0]);
            }
            this.editor.blockAction.updatePropChangesToModel();
            const updatedBlockModel: BlockModel = getBlockModelById(blocks[0].id, this.editor.blocksInternal);
            const newBlockElement: HTMLElement = this.editor.blockAction.createBlockElement(updatedBlockModel);
            cursorBlockElement.replaceWith(newBlockElement);
            (this.editor as any).isProtectedOnChange = prevOnChange;
        }
        else if (!isCursorAtStart) {
            // First perform block splitting, similar to pressing Enter at blocks.
            this.editor.splitAndCreateNewBlockAtCursor();

            const updatedCursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.editor.blocksInternal);
            if (!updatedCursorBlock) { return; }

            const isContentEmptyAfterSplit: boolean = !updatedCursorBlock.content || (updatedCursorBlock.content
                && updatedCursorBlock.content.length === 1 && updatedCursorBlock.content[0].content === '');

            // Update current block with first part and pasted content models
            updatedCursorBlock.content = isContentEmptyAfterSplit ? [...blocks[0].content] : [
                ...updatedCursorBlock.content,
                ...blocks[0].content
            ];

            this.editor.reRenderBlockContent(updatedCursorBlock);
        }

        // 1. Remaining clipboard blocks (blocks[1..n])
        const newBlocks: BlockModel[] = blocks.slice((isCursorAtStart && !isContentEmpty) ? 0 : 1).map((block: BlockModel) =>
            this.editor.blockAction.generateNewIdsForBlock(block)
        );

        this.editor.blockAction.addBulkBlocks({
            blocks: newBlocks,
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
        const codeBlockElement: HTMLElement = document.getElementById(blockModel.id);
        const codeBlockContentElement: HTMLElement = codeBlockElement.querySelector('.e-code-content');
        codeBlockContentElement.textContent += content;
        // eslint-disable @typescript-eslint/no-explicit-any
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        blockModel.content[0].content = codeBlockContentElement.textContent;
        (this.editor as any).isProtectedOnChange = prevOnChange;
        // eslint-enable @typescript-eslint/no-explicit-any
    }

    private handleHtmlPaste(html: string): void {
        let tempDiv: HTMLElement = document.createElement('div') as HTMLElement;
        tempDiv.innerHTML = html;
        tempDiv = this.unWrapContainer(tempDiv);
        if (this.isBlockLevelContent(tempDiv)) {
            const blocks: BlockModel[] = convertHtmlElementToBlocks(tempDiv, this.editor.pasteSettings.keepFormat);
            this.handleMultiBlocksPaste(blocks);
        } else {
            const inlineContents: ContentModel[] = convertInlineElementsToContentModels(tempDiv, this.editor.pasteSettings.keepFormat);
            this.handleContentPasteWithinBlock(inlineContents);
        }
    }

    private handlePlainTextPaste(text: string): void {
        const lines: string[] = text.split(/\r?\n/);
        const blocks: BlockModel[] = [];

        lines.forEach((line: string) => {
            if (line.trim() === '') {
                return;
            }

            const bulletMatch: RegExpMatchArray = line.match(/^[\s]*[•\-*]\s+(.*)/);
            if (bulletMatch) {
                blocks.push({
                    id: generateUniqueId('block'),
                    type: BlockType.BulletList,
                    content: [{
                        id: generateUniqueId('content'),
                        type: ContentType.Text,
                        content: bulletMatch[1]
                    }]
                });
                return;
            }

            const numberedMatch: RegExpMatchArray = line.match(/^[\s]*(\d+)[.)]\s+(.*)/);
            if (numberedMatch) {
                blocks.push({
                    id: generateUniqueId('block'),
                    type: BlockType.NumberedList,
                    content: [{
                        id: generateUniqueId('content'),
                        type: ContentType.Text,
                        content: numberedMatch[2]
                    }]
                });
                return;
            }

            blocks.push({
                id: generateUniqueId('block'),
                type: BlockType.Paragraph,
                content: [{
                    id: generateUniqueId('content'),
                    type: ContentType.Text,
                    content: line
                }]
            });
        });
        this.handleMultiBlocksPaste(blocks);
    }

    private getBlockText(block: BlockModel): string {
        if (!block.content || block.content.length === 0) {
            return '';
        }

        return block.content.map((content: ContentModel) => content.content).join('');
    }

    private generatePlainTextForExternalClipboard(blocks: BlockModel[]): string {
        let text: string = '';

        blocks.forEach((block: BlockModel) => {
            if (block.type === BlockType.BulletList) {
                text += '• ' + this.getBlockText(block) + '\n';
            } else if (block.type === BlockType.NumberedList) {
                const blockElement: HTMLElement = this.editor.getBlockElementById(block.id);
                const listItem: HTMLElement = blockElement.querySelector('li');
                const computedStyle: CSSStyleDeclaration = window.getComputedStyle(listItem);
                const marker: string = computedStyle.getPropertyValue('list-style-type');
                text += marker + this.getBlockText(block) + '\n';
            } else if (block.type === BlockType.Divider) {
                text += '---\n';
            } else {
                text += this.getBlockText(block) + '\n';
            }
        });

        return text;
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
        const { html, text }: IClipboardPayload = this.getClipboardPayload();

        await (navigator as any).clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            })
        ]);
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

    private isBlockLevelContent(container: HTMLElement): boolean {
        const blockTags: string[] = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'TABLE', 'IMG'];
        return Array.from(container.querySelectorAll('*')).some((el: Element) => blockTags.indexOf(el.tagName) !== -1);
    }

    private unWrapContainer(container: HTMLElement): HTMLElement {
        const firstChild: HTMLElement = container.firstElementChild as HTMLElement;

        if (
            container.childElementCount === 1 &&
            firstChild.tagName === 'SPAN'
        ) {
            const innerHasBlock: boolean = this.isBlockLevelContent(firstChild);

            if (innerHasBlock) {
                const newContainer: HTMLElement = document.createElement('div');
                Array.from(firstChild.childNodes).forEach((child: ChildNode) => newContainer.appendChild(child.cloneNode(true)));
                return newContainer;
            }
        }
        return container;
    }

    public destroy(): void {
        this.unwireEvents();
        this.editor = null;
        this.clipboardCleanupModule = null;
    }
}
