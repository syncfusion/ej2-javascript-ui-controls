import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforePasteCleanupEventArgs, BlockModel, ContentModel, ITableBlockSettings, TableCellModel, TableRowModel } from '../../models/index';
import { BlockType } from '../../models/enums';
import { generateUniqueId, decoupleReference, getAbsoluteOffset } from '../../common/utils/common';
import { findCellById, getBlockContentElement, getBlockModelById, getClosestContentElementInDocument, getContentElementBasedOnId, getContentModelById, isAtStartOfBlock } from '../../common/utils/block';
import { findClosestParent, isElementEmpty } from '../../common/utils/dom';
import { convertHtmlElementToBlocks, getBlockDataAsHTML, convertInlineElementsToContentModels } from '../../common/utils/html-parser';
import { sanitizeBlock, sanitizeContent, sanitizeContents } from '../../common/utils/transform';
import { getSelectedRange, setCursorPosition } from '../../common/utils/selection';
import { BeforePasteEventProps, IClipboardPayloadOptions, ISplitContentData } from '../../common/interface';
import { ClipboardCleanupModule } from '../plugins/common/clipboard-cleanup';
import { actionType, events } from '../../common/constant';
import * as constants from '../../common/constant';
import { createBlocksFromPlainText, createCellsPayloadFromExternal, extractPlainTextMatrixFromPayload,
    generatePlainTextForExternalClipboard, htmlTableFromMatrix, isBlockLevelContent, tsvFromMatrix,
    unWrapContainer, writeTableClipboardPayload, buildTableClipboardPayload
} from '../../common/utils/clipboard-utils';
import { BlockFactory } from '../../block-manager/services/index';
import { BlockManager } from '../base/block-manager';
import { NodeCutter } from '../plugins/common/node';
import { ColMeta, TableClipboardPayload, TableContext } from '../base/interface';
import { doesHtmlHasTable, getDataCell, toDomRow, toModelRow } from '../../common/utils/table-utils';

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
    private parent: BlockManager;
    private isSelectivePaste: boolean;
    /** @hidden */
    public clipboardCleanupModule: ClipboardCleanupModule;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.clipboardCleanupModule = new ClipboardCleanupModule(this.parent);
        this.wireEvents();
    }

    private wireEvents(): void {
        this.parent.observer.on(events.copy, this.handleCopy, this);
        this.parent.observer.on(events.cut, this.handleCut, this);
        this.parent.observer.on(events.paste, this.handlePaste, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private unwireEvents(): void {
        this.parent.observer.off(events.copy, this.handleCopy);
        this.parent.observer.off(events.cut, this.handleCut);
        this.parent.observer.off(events.paste, this.handlePaste);
        this.parent.observer.off(events.destroy, this.destroy);
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

        const focusedEl: HTMLElement = this.parent.currentFocusedBlock;
        const tableBlockEl: HTMLElement = focusedEl && focusedEl.closest('.' + constants.TABLE_BLOCK_CLS) as HTMLElement;
        const range: Range = getSelectedRange();
        const hasActiveSel: boolean = this.parent.tableSelectionManager.hasActiveTableSelection(tableBlockEl);
        if (tableBlockEl && (hasActiveSel || findClosestParent(range.startContainer, '.e-action-handle'))) {
            const { payload, html, plainText } = this.getTablePayload(tableBlockEl);

            writeTableClipboardPayload(e.clipboardData, payload, html, plainText);
            return;
        }
        const { html, text, blockeditorData }: IClipboardPayloadOptions = this.getClipboardPayload();

        e.clipboardData.setData('text/html', html);
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/blockeditor', blockeditorData);

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

        this.performPasteOperation({
            blockeditorData: e.clipboardData.getData('text/blockeditor'),
            html: e.clipboardData.getData('text/html'),
            text: e.clipboardData.getData('text/plain'),
            file: this.extractFileFromClipboard(e)
        });
        this.parent.stateManager.updateManagerBlocks();
    }

    private extractFileFromClipboard(e: ClipboardEvent): File {
        if (!e.clipboardData || !e.clipboardData.items || (e.clipboardData.items && e.clipboardData.items.length === 0)) {
            return null;
        }
        const items: DataTransferItemList = e.clipboardData.items;
        const file: File = items[0].getAsFile();
        if (file !== null) { return file; }

        return !isNullOrUndefined(items[1 as number]) ? items[1 as number].getAsFile() : null;
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

            const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
            const blocks: BlockModel[] = this.createPartialBlockModels(tempDiv, selectedBlocks);

            return {
                blockeditorData: selectedBlocks && (selectedBlocks.length > 1
                    ? JSON.stringify({ blocks })
                    : JSON.stringify({ contents: this.createPartialContentModels(tempDiv, selectedBlocks[0]) })),
                html: getBlockDataAsHTML(blocks, this.parent.rootEditorElement.id),
                text: generatePlainTextForExternalClipboard(blocks)
            };
        }

        const blockModel: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
        const sanitizedBlock: BlockModel = sanitizeBlock(blockModel);
        sanitizedBlock.id = generateUniqueId(constants.BLOCK_ID_PREFIX);

        return {
            blockeditorData: JSON.stringify({ block: sanitizedBlock }),
            html: getBlockDataAsHTML([blockModel], this.parent.rootEditorElement.id),
            text: generatePlainTextForExternalClipboard([blockModel])
        };
    }

    public getTablePayload(tableBlockEl: HTMLElement): { payload: TableClipboardPayload, html: string, plainText: string } {
        const blockModel: BlockModel = getBlockModelById(tableBlockEl.id, this.parent.getEditorBlocks());
        const payload: TableClipboardPayload = buildTableClipboardPayload(tableBlockEl, blockModel);
        const matrixText: string[][] = extractPlainTextMatrixFromPayload(payload, blockModel);
        const html: string = htmlTableFromMatrix(
            matrixText, { hasHeader: payload.meta.enableHeader, hasRowNumbers: payload.meta.enableRowNumbers }
        );
        const plainText: string = tsvFromMatrix(matrixText);

        return { payload, html, plainText };
    }

    private createPartialBlockModels(selectionContainer: HTMLElement, originalBlocks: BlockModel[]): BlockModel[] {
        return originalBlocks.length === 0 ? [] : originalBlocks.map((block: BlockModel) => {
            const blockElement: HTMLElement = selectionContainer.querySelector('.e-block#' + block.id) as HTMLElement;
            const contentElement: HTMLElement = getBlockContentElement(blockElement) || selectionContainer;
            return BlockFactory.createBlockFromPartial({
                ...decoupleReference(sanitizeBlock(block)),
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

    public performCutOperation(): void {
        const tableCtx: TableContext = this.parent.blockRenderer.tableRenderer.resolveTableContext();
        const range: Range = getSelectedRange();
        if (range && range.toString().trim().length > 0) {
            this.performDeletionOperation(range);
        }
        else if (tableCtx) {
            this.performCellCut(tableCtx);
        }
        else {
            const blockElement: HTMLElement = this.parent.currentFocusedBlock as HTMLElement;
            const nextBlock: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            const previousBlock: HTMLElement = blockElement.previousElementSibling as HTMLElement;

            this.parent.execCommand({ command: 'DeleteBlock', state: { blockElement: this.parent.currentFocusedBlock }});
            this.parent.setFocusToBlock(nextBlock || previousBlock);
        }
    }

    public performPasteOperation(args: IClipboardPayloadOptions): void {
        const { blockeditorData, html, text, file }: IClipboardPayloadOptions = args;

        // (Taking a snip in windows, automatically gets copied as file and not HTML. Hence below handling)
        if (file && (file.size < MAX_IMAGE_SIZE)) {
            this.parent.blockRenderer.imageRenderer.handleFilePaste(file);
            const url: string = URL.createObjectURL(file);
            URL.revokeObjectURL(url); // Immediately revoke to free memory
            return;
        }

        const beforePasteEventArgs: BeforePasteEventProps = {
            cancel: false,
            content: text,
            callback: (args: BeforePasteCleanupEventArgs) => {
                if (args.cancel) { return; }

                const range: Range = getSelectedRange();
                if (range && range.toString().trim().length > 0) {
                    this.isSelectivePaste = true;
                    this.performDeletionOperation(range);
                }

                // Detect external HTML table when inside a table cell
                const tableCtx: TableContext = this.parent.blockRenderer.tableRenderer.resolveTableContext();
                if (tableCtx && doesHtmlHasTable(html, text)) {
                    this.handleCellPasteInsideTable(tableCtx, html, text);
                    this.triggerAfterPasteEvent(text);
                    return;
                }

                const currentBlock: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
                if (currentBlock.blockType === BlockType.Code) {
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
                if (html && !this.parent.pasteCleanupSettings.plainText) {
                    this.handleHtmlPaste(this.parent.serializeValue(cleanedData));
                } else if (text) {
                    this.handlePlainTextPaste(text);
                }
                this.triggerAfterPasteEvent(text);

                this.isSelectivePaste = false;
            }
        };
        this.parent.observer.notify('beforePaste', beforePasteEventArgs);
    }

    private performDeletionOperation(range: Range): void {
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        if (selectedBlocks && selectedBlocks.length === 1) {
            const blockElement: HTMLElement = this.parent.getBlockElementById(selectedBlocks[0].id);
            range.deleteContents();
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            Array.from(contentElement.childNodes).forEach((node: Node) => {
                if (node.textContent.trim() === '') {
                    (node as HTMLElement).remove();
                }
            });

            this.parent.stateManager.updateContentOnUserTyping(blockElement);
            this.parent.setFocusAndUIForNewBlock(blockElement);
            setCursorPosition(contentElement, getAbsoluteOffset(contentElement, range.startContainer, range.startOffset));

            if (selectedBlocks[0].blockType === BlockType.Code && contentElement && contentElement.textContent.trim() === '') {
                contentElement.innerHTML = '<br>';
            }
            return;
        }
        this.parent.blockCommand.handleSelectiveDeletions(new KeyboardEvent('keydown', { key: 'Backspace' }));
    }

    private handleBlockEditorPaste(data: string, text: string): void {
        try {
            const parsedData: any = JSON.parse(data);
            const props: string = Object.keys(parsedData)[0];
            switch (props) {
            case 'blocks':
                this.handleMultiBlocksPaste(parsedData.blocks);
                break;
            case 'block': {
                const blocksToPaste: BlockModel[] = [decoupleReference(sanitizeBlock(parsedData.block))];
                const cursorBlock: BlockModel = getBlockModelById(this.parent.currentFocusedBlock.id, this.parent.getEditorBlocks());
                const parentBlock: BlockModel = getBlockModelById(cursorBlock.parentId, this.parent.getEditorBlocks());
                if (parentBlock) {
                    this.parent.blockService.assignParentIdToBlocks(blocksToPaste, parentBlock.id);
                }
                this.parent.blockCommand.addBulkBlocks({
                    blocks: blocksToPaste,
                    targetBlockId: this.parent.currentFocusedBlock.id,
                    insertionType: 'block',
                    isSelectivePaste: this.isSelectivePaste
                });
                break;
            }
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

        const range: Range = this.parent.nodeSelection.getRange();
        if (!range) { return; }

        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.parent.getEditorBlocks());
        const oldBlock: BlockModel = decoupleReference(sanitizeBlock(cursorBlock));

        const splitContent: ISplitContentData = NodeCutter.splitContent(
            getBlockContentElement(cursorBlockElement), range.startContainer, range.startOffset
        );

        const beforeModels: ContentModel[] = this.parent.blockCommand.getContentModelForFragment(
            splitContent.beforeFragment,
            cursorBlock,
            null
        );
        const afterModels: ContentModel[] = this.parent.blockCommand.getContentModelForFragment(
            splitContent.afterFragment,
            cursorBlock,
            splitContent.beforeFragment.lastChild
        );

        /* Update model */
        this.parent.blockService.updateContent(cursorBlock.id, [
            ...beforeModels,
            ...content,
            ...afterModels
        ]);

        /* Update DOM */
        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: cursorBlock, oldBlock: oldBlock } ]
        }});

        const lastNode: HTMLElement = getContentElementBasedOnId(content.pop().id, cursorBlockElement);
        setCursorPosition(lastNode, lastNode.textContent.length);

        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.clipboardPaste,
            data: {
                type: 'content',
                oldContent: oldBlock.content,
                newContent: decoupleReference(sanitizeContents(cursorBlock.content)),
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

        const range: Range = this.parent.nodeSelection.getRange();
        if (!range) { return; }

        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const cursorBlockElement: HTMLElement = findClosestParent(range.startContainer, '.' + constants.BLOCK_CLS);
        const cursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, editorBlocks);
        const oldCursorBlock: BlockModel = decoupleReference(sanitizeBlock(cursorBlock));
        const contentElement: HTMLElement = getBlockContentElement(cursorBlockElement);
        const isContentEmpty: boolean = contentElement && isElementEmpty(contentElement);
        const isCursorAtStart: boolean = isAtStartOfBlock(contentElement);
        const parentBlock: BlockModel | TableCellModel = getBlockModelById(cursorBlock.parentId, editorBlocks)
            || findCellById(cursorBlock.parentId, editorBlocks);
        const specialTypes: string[] = [BlockType.Table, BlockType.Image];
        const isFirstBlkSpecialType: boolean = specialTypes.indexOf(blocks[0].blockType) !== -1;
        let isFirstBlkProcessed: boolean = false;

        if (parentBlock) {
            this.parent.blockService.assignParentIdToBlocks(blocks, parentBlock.id);
        }
        if (isContentEmpty) {
            isFirstBlkProcessed = true;
            this.parent.blockService.generateNewIdsForBlock(blocks[0]);
            blocks[0].id = cursorBlockElement.id;

            this.parent.blockService.replaceBlock(cursorBlock.id, blocks[0]);

            this.parent.stateManager.updateManagerBlocks();
            this.parent.observer.notify('modelChanged', { type: 'ReplaceBlock', state: {
                targetBlockId: cursorBlock.id,
                block: getBlockModelById(blocks[0].id, this.parent.getEditorBlocks()),
                oldBlock: oldCursorBlock,
                preventEventTrigger: true
            }});
        }
        else if (!isCursorAtStart && !isFirstBlkSpecialType) {
            isFirstBlkProcessed = true;
            this.parent.execCommand({ command: 'SplitBlock', state: { preventEventTrigger: true } });

            const updatedCursorBlock: BlockModel = getBlockModelById(cursorBlockElement.id, this.parent.getEditorBlocks());
            if (!updatedCursorBlock) { return; }

            const isContentEmptyAfterSplit: boolean = !updatedCursorBlock.content || (updatedCursorBlock.content
                && updatedCursorBlock.content.length === 1 && updatedCursorBlock.content[0].content === '');

            const contentToUpdate: ContentModel[] = isContentEmptyAfterSplit ? [...blocks[0].content] : [
                ...updatedCursorBlock.content,
                ...blocks[0].content
            ];

            this.parent.blockService.updateContent(updatedCursorBlock.id, contentToUpdate);

            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: updatedCursorBlock, oldBlock: oldCursorBlock } ],
                preventEventTrigger: true
            }});
        }

        this.parent.blockCommand.addBulkBlocks({
            blocks: blocks.slice(!isFirstBlkProcessed ? 0 : 1)
                .map((block: BlockModel) => this.parent.blockService.generateNewIdsForBlock(block)),
            targetBlockId: cursorBlock.id,
            isUndoRedoAction: isUndoRedoAction,
            insertionType: 'blocks',
            clipboardBlocks: blocks.map((block: BlockModel) => decoupleReference(sanitizeBlock(block))),
            oldBlockModel: oldCursorBlock,
            isPastedAtStart: isCursorAtStart,
            isSelectivePaste: this.isSelectivePaste
        });

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
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
            this.handleMultiBlocksPaste(convertHtmlElementToBlocks(tempDiv, this.parent.pasteCleanupSettings.keepFormat));
        } else {
            this.handleContentPasteWithinBlock(convertInlineElementsToContentModels(tempDiv, this.parent.pasteCleanupSettings.keepFormat));
        }
    }

    private handlePlainTextPaste(text: string): void {
        this.handleMultiBlocksPaste(createBlocksFromPlainText(text));
    }

    public handleCellPasteInsideTable(tableCtx: TableContext, html: string, text?: string): void {
        const cleanedData: string = this.clipboardCleanupModule.cleanupPaste({ html: html, plainText: text });
        const payloadFromExternal: TableClipboardPayload = createCellsPayloadFromExternal(cleanedData, text);
        if (payloadFromExternal && payloadFromExternal.cells && payloadFromExternal.cells.length) {
            this.performCellPaste(payloadFromExternal, tableCtx);
            this.triggerAfterPasteEvent(text);
            this.isSelectivePaste = false;
            return;
        }
    }

    private performCellPaste(payload: TableClipboardPayload, ctx: TableContext): void {
        if (!(payload.cells && payload.cells.length)) { return; }

        // Snapshot old blocks and track structure delta for undo/redo
        const oldNewPairs: Array<{ dataRow: number; dataCol: number; oldBlocks: BlockModel[]; newBlocks: BlockModel[] }> = [];
        const structureDelta: { rowsAdded?: number[]; colsAdded?: number[] } = {};

        const needRows: number = Math.max(0, (ctx.startDataRow + payload.cells.length) - ctx.props.rows.length);
        if (needRows > 0) {
            structureDelta.rowsAdded = [];
            for (let i: number = 0; i < needRows; i++) {
                const at: number = ctx.props.rows.length;
                structureDelta.rowsAdded.push(at);
                this.parent.tableService.addRowAt({ blockId: ctx.tableBlockEl.id, rowIndex: at });
            }
        }
        const needCols: number = Math.max(0, (ctx.startDataCol + payload.cells[0].length) - ctx.props.columns.length);
        if (needCols > 0) {
            structureDelta.colsAdded = [];
            for (let i: number = 0; i < needCols; i++) {
                const at: number = ctx.props.columns.length;
                structureDelta.colsAdded.push(at);
                this.parent.tableService.addColumnAt({ blockId: ctx.tableBlockEl.id, colIndex: at });
            }
        }

        this.parent.tableService.removeCellFocus(ctx.tableEl);
        for (let r: number = 0; r < payload.cells.length; r++) {
            for (let c: number = 0; c < payload.cells[r as number].length; c++) {
                const targetRow: number = ctx.startDataRow + r;
                const targetCol: number = ctx.startDataCol + c;
                const oldBlocks: BlockModel[] = (ctx.props.rows[targetRow as number].cells[targetCol as number].blocks)
                    .map((b: BlockModel) => decoupleReference(sanitizeBlock(b)));
                const newBlocks: BlockModel[] = payload.cells[r as number][c as number];
                oldNewPairs.push({ dataRow: targetRow, dataCol: targetCol, oldBlocks, newBlocks });
                this.parent.tableService.setCellBlocks(ctx.tableEl, targetRow, targetCol, newBlocks);
                if (c === 0 && r === 0) {
                    const cellToFocus: HTMLElement = getDataCell(
                        ctx.tableEl, toDomRow(targetRow, ctx.props.enableHeader), targetCol
                    );
                    this.parent.tableService.addCellFocus(cellToFocus, true);
                }
            }
        }

        // Push undo stack entry for table cells paste
        this.parent.undoRedoAction.trackTableCellsPasteForUndoRedo({
            blockId: ctx.tableBlockEl.id,
            cells: oldNewPairs,
            structureDelta
        });
    }

    private performCellCut(tableCtx: TableContext): void {
        const selectedCells: HTMLTableCellElement[] = Array.from(
            this.parent.tableSelectionManager.getSelectedCells(tableCtx.tableBlockEl)
        );
        const tableEl: HTMLTableElement = tableCtx.tableEl;
        const props: ITableBlockSettings = tableCtx.props;

        if (!selectedCells.length) { return; }

        const dataPositions: Array<{ r: number; c: number }> = selectedCells.map((td: HTMLTableCellElement) => ({
            r: props.enableHeader ? (parseInt(td.dataset.row, 10) - 1) : parseInt(td.dataset.row, 10),
            c: parseInt(td.dataset.col, 10)
        })).filter((p: { r: number, c: number }) => !isNaN(p.r) && !isNaN(p.c) && p.r >= 0 && p.c >= 0);

        const totalRows: number = props.rows.length;
        const totalCols: number = props.columns.length;
        const selectedKeySet: Set<string> = new Set(dataPositions.map((p: { r: number, c: number }) => `${p.r}:${p.c}`));

        // Build counts per row and per column
        const rowCounts: Map<number, number> = new Map();
        const colCounts: Map<number, number> = new Map();
        dataPositions.forEach((p: { r: number, c: number }) => {
            rowCounts.set(p.r, (rowCounts.get(p.r) || 0) + 1);
            colCounts.set(p.c, (colCounts.get(p.c) || 0) + 1);
        });

        const fullRows: number[] = Array.from(rowCounts.entries())
            .filter(([_, count]: number[]) => count === totalCols)
            .map(([r]: number[]) => r)
            .sort((a: number, b: number) => a - b);
        const onlyFullRowsSelected: boolean = fullRows.length > 0 && (fullRows.length * totalCols === selectedKeySet.size);

        const fullCols: number[] = Array.from(colCounts.entries())
            .filter(([_, count]: number[]) => count === totalRows)
            .map(([c]: number[]) => c)
            .sort((a: number, b: number) => a - b);
        const onlyFullColsSelected: boolean = fullCols.length > 0 && (fullCols.length * totalRows === selectedKeySet.size);

        if (onlyFullRowsSelected) {
            const rowsMeta: Array<{ index: number; rowModel: TableRowModel }> = fullRows.map((r: number) => ({
                index: r,
                rowModel: decoupleReference(props.rows[r as number])
            }));
            // Push single undo entry for all rows
            this.parent.undoRedoAction.trackBulkRowDeletionForUndoRedo({
                blockId: tableCtx.tableBlockEl.id, rows: rowsMeta
            });

            const rowsToDeleteDom: number[] = fullRows
                .map((r: number) => (props.enableHeader ? r + 1 : r))
                .sort((a: number, b: number) => b - a);
            rowsToDeleteDom.forEach((domRowIdx: number) => this.parent.tableService.deleteRowAt({
                blockId: tableCtx.tableBlockEl.id,
                modelIndex: toModelRow(domRowIdx, props.enableHeader),
                isUndoRedoAction: true
            }));
            return;
        }
        if (onlyFullColsSelected) {
            const colsMeta: Array<ColMeta> = fullCols.map((c: number) => ({
                index: c,
                columnModel: decoupleReference(props.columns[c as number]),
                columnCells: props.rows.map((r: TableRowModel) => decoupleReference(r.cells[c as number]))
            }));
            this.parent.undoRedoAction.trackBulkColumnDeletionForUndoRedo({
                blockId: tableCtx.tableBlockEl.id, cols: colsMeta
            });

            // Delete columns from right to left (data col indices)
            fullCols.sort((a: number, b: number) => b - a).forEach((dataColIdx: number) =>
                this.parent.tableService.deleteColumnAt({
                    blockId: tableCtx.tableBlockEl.id,
                    colIndex: dataColIdx,
                    isUndoRedoAction: true
                }));
            return;
        }

        // Partial selection: clear cell contents
        this.parent.tableService.clearCellContents(tableEl, selectedCells);
    }

    private triggerAfterPasteEvent(text: string): void {
        this.parent.observer.notify('afterPaste', { content: text });
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
        let html: string = '';
        let text: string = '';
        let file: Blob | File;
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
        this.performPasteOperation({ html, text, file: file as File});
    }

    public destroy(): void {
        this.unwireEvents();
        this.clipboardCleanupModule = null;
    }
}
