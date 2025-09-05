import { Browser, detach, print as printWindow } from '@syncfusion/ej2-base';
import { BlockEditor, BlockType, BuiltInToolbar } from '../base/index';
import { BlockModel, ChecklistProps, StyleModel, ToolbarItemModel } from '../models/index';
import { getBlockContentElement, getBlockModelById, getSelectedRange, isListTypeBlock, sanitizeBlock, setCursorPosition, setSelectionRange } from '../utils/index';
import { getBlockDataAsHTML } from '../utils/html-parser';
import * as constants from '../base/constant';

export class BlockEditorMethods {
    protected editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    public addBlock(block: BlockModel, targetId?: string, isAfter?: boolean, preventUIUpdate?: boolean): HTMLElement {
        const populatedBlock: BlockModel[] = this.editor.stateManager.populateBlockProperties([block]);
        return this.editor.blockCommandManager.addNewBlock({
            block: populatedBlock[0],
            targetBlock: this.editor.blockWrapper.querySelector(`#${targetId}`),
            isAfter: isAfter,
            preventUIUpdate: preventUIUpdate
        });
    }

    public removeBlock(blockId: string): void {
        const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`);
        this.editor.blockCommandManager.deleteBlock({ blockElement: blockElement, isMethod: true, isUndoRedoAction: false });
    }

    public getBlock(blockId: string): BlockModel | null {
        return getBlockModelById(blockId, this.editor.getEditorBlocks());
    }

    public moveBlock(fromBlockId: string, toBlockId: string): void {
        this.editor.blockCommandManager.moveBlock({
            fromBlockIds: [fromBlockId],
            toBlockId: toBlockId,
            isInteracted: false
        });
    }

    public updateBlock(blockId: string, properties: Partial<BlockModel>): boolean {
        if (!blockId || !properties) { return false; }
        const block: BlockModel = this.getBlock(blockId);

        if (!block) { return false; }

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        /* Model Updates */
        this.editor.blockService.updateBlock(blockId, properties);

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();

        /* UI Updates */
        const updatedBlockModel: BlockModel = this.getBlock(blockId);
        const oldBlockElement: HTMLElement = this.editor.getBlockElementById(blockId);
        const newBlockElement: HTMLElement = this.editor.blockRendererManager.createBlockElement(updatedBlockModel);
        const parentBlock: BlockModel = getBlockModelById(updatedBlockModel.parentId, this.editor.getEditorBlocks());
        let wrapper: HTMLElement = this.editor.blockWrapper;
        if (parentBlock) {
            const parentBlockElement: HTMLElement = this.editor.getBlockElementById(parentBlock.id);
            const selector: string = parentBlock.type === BlockType.Callout
                ? '.' + constants.CALLOUT_CONTENT_CLS
                : '.' + constants.TOGGLE_CONTENT_CLS;
            wrapper = parentBlockElement.querySelector(selector);
        }

        wrapper.insertBefore(newBlockElement, oldBlockElement);
        detach(oldBlockElement);

        if (isListTypeBlock(updatedBlockModel.type)) {
            this.editor.listBlockAction.recalculateMarkersForListItems();
            if (block.type === BlockType.Checklist) {
                if (this.editor.blockRendererManager.listRenderer) {
                    this.editor.blockRendererManager.listRenderer.toggleCheckedState(
                        updatedBlockModel, (updatedBlockModel.props as ChecklistProps).isChecked
                    );
                }
            }
        }
        return true;
    }

    public executeToolbarAction(command: BuiltInToolbar, value?: string): void {
        const builtInCommands: string[] = Object.keys(BuiltInToolbar);
        if (builtInCommands.indexOf(command) !== -1) {
            const convertedCommand: keyof StyleModel = command.toLowerCase() as unknown as keyof StyleModel;
            this.editor.formattingAction.execCommand({ command: convertedCommand, value: value });
        }
    }

    public setSelection(contentId: string, start: number, end: number): void {
        const contentElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${contentId}`);
        if (contentElement) {
            setSelectionRange((contentElement.lastChild as HTMLElement), start, end);
        }
    }

    public setCursorPosition(blockId: string, position: number): void {
        const blockElement: HTMLElement = this.editor.getBlockElementById(blockId);
        if (blockElement) {
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, position);
        }
    }

    public getSelectedBlocks(): BlockModel[] | null {
        const range: Range = this.getRange();
        if (!range || !this.editor.currentFocusedBlock) { return null; }

        const selectedBlocks: BlockModel[] = [];
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const callout: HTMLElement = this.editor.currentFocusedBlock.closest('.' + constants.CALLOUT_BLOCK_CLS) as HTMLElement;
        const toggle: HTMLElement = this.editor.currentFocusedBlock.closest('.' + constants.TOGGLE_BLOCK_CLS) as HTMLElement;
        let blockElements: NodeListOf<HTMLElement> = this.editor.blockWrapper.querySelectorAll('.' + constants.BLOCK_CLS);
        if (callout) {
            blockElements = callout.querySelectorAll('.' + constants.BLOCK_CLS);
        }
        else if (toggle) {
            blockElements = toggle.querySelectorAll('.' + constants.BLOCK_CLS);
        }
        blockElements.forEach((blockElement: HTMLElement) => {
            const blockRange: Range = document.createRange();
            blockRange.selectNodeContents(blockElement);

            if (range.intersectsNode(blockElement)) {
                const block: BlockModel = getBlockModelById(blockElement.id, editorBlocks);
                if (block) { selectedBlocks.push(block); }
            }
        });

        return selectedBlocks;
    }

    public getRange(): Range | null {
        return getSelectedRange();
    }

    public selectRange(range: Range): void {
        const selection: Selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    public selectBlock(blockId: string): void {
        const blockElement: HTMLElement = this.editor.getBlockElementById(blockId);
        if (blockElement) {
            const range: Range = document.createRange();
            range.selectNodeContents(blockElement);
            this.selectRange(range);
        }
    }

    public selectAllBlocks(): void {
        const range: Range = document.createRange();
        range.selectNodeContents(this.editor.blockWrapper);
        this.selectRange(range);
    }

    public focusIn(): void {
        if (this.editor.blockWrapper) {
            this.editor.blockWrapper.focus();
        }
    }

    public focusOut(): void {
        if (this.editor.blockWrapper) {
            this.editor.blockWrapper.blur();
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
        }
    }

    public getBlockCount(): number {
        return this.editor.blocks.length;
    }

    public enableDisableToolbarItems(itemId: string | string[], enable: boolean): void {
        const toolbarPopup: HTMLElement = document.querySelector('.' + constants.INLINE_TBAR_POPUP_CLS);

        const ids: string[] = typeof itemId === 'string' ? [itemId] : itemId;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parentToolbarElements: any = [];
        const tbarItemModels: ToolbarItemModel[] = [];

        ids.forEach((id: string) => {
            this.editor.inlineToolbar.items.filter((item: ToolbarItemModel) => {
                if (item.id === id) {
                    tbarItemModels.push(item);
                }
            });
        });

        tbarItemModels.forEach((item: ToolbarItemModel) => {
            const element: HTMLElement = toolbarPopup.querySelector(`[data-command=${item.item}]`) as HTMLElement;
            parentToolbarElements.push(element);
        });
        this.editor.inlineToolbarModule.toolbarObj.enableItems(parentToolbarElements, enable);
    }

    public getDataAsJson(blockId?: string): any {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.editor.getEditorBlocks());
            return block ? sanitizeBlock(block) : null;
        } else {
            return this.editor.getEditorBlocks().map((block: BlockModel) => sanitizeBlock(block));
        }
    }

    public getDataAsHtml(blockId?: string): string {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.editor.getEditorBlocks());
            return block ? getBlockDataAsHTML([block]) : null;
        } else {
            return getBlockDataAsHTML(this.editor.getEditorBlocks());
        }
    }

    public renderBlocksFromJson(
        json: object | string,
        replace: boolean,
        targetBlockId: string
    ): boolean {
        try {
            const blocksJson: object | BlockModel[] = typeof json === 'string' ? JSON.parse(json as string) : json;

            const blocks: BlockModel[] = this.extractBlocks(blocksJson);

            const sanitizedBlocks: BlockModel[] = blocks.map((block: BlockModel) => sanitizeBlock(block));
            this.editor.stateManager.populateUniqueIds(sanitizedBlocks);

            if (replace) {
                return this.replaceAllBlocks(sanitizedBlocks);
            } else {
                return this.insertBlocksAtPosition(sanitizedBlocks, targetBlockId);
            }
        } catch (e) {
            console.error('Error rendering blocks from JSON:', e);
            return false;
        }
    }

    private extractBlocks(blocksJson: object | BlockModel[]): BlockModel[] {
        let blocks: BlockModel[] = [];

        if (Array.isArray(blocksJson)) {
            blocks = blocksJson;
        }
        else if (blocksJson && typeof blocksJson === 'object') {
            if (Array.isArray((blocksJson as any).blocks)) {
                blocks = (blocksJson as any).blocks;
            }
            else {
                // Try to convert single object to block if it looks like a block
                if ((blocksJson as any).type) {
                    blocks = [blocksJson as BlockModel];
                }
            }
        }
        return blocks;
    }

    /**
     * Replaces all blocks in the editor with the provided blocks.
     *
     * @param {BlockModel[]} blocks - The blocks to render
     * @returns {boolean} - True if operation was successful, false otherwise
     * @private
     */
    private replaceAllBlocks(blocks: BlockModel[]): boolean {
        this.editor.setEditorBlocks([]);
        this.editor.blockWrapper.innerHTML = '';
        if (blocks.length === 0) {
            this.editor.blockCommandManager.createDefaultEmptyBlock(true);
            return true;
        }
        this.editor.setEditorBlocks(blocks);
        this.editor.stateManager.updatePropChangesToModel();
        this.editor.renderBlocks(this.editor.getEditorBlocks());
        return true;
    }

    /**
     * Inserts blocks at a specific position in the editor.
     *
     * @param {BlockModel[]} blocks - The blocks to insert
     * @param {string} targetBlockId - ID of the block to insert after, uses focused block if not provided
     * @returns {boolean} - True if operation was successful, false otherwise
     * @private
     */
    private insertBlocksAtPosition(blocks: BlockModel[], targetBlockId?: string): boolean {
        if (blocks.length === 0) {
            return false;
        }

        let insertionPointId: string = targetBlockId;

        if (!insertionPointId) {
            if (this.editor.currentFocusedBlock) {
                insertionPointId = this.editor.currentFocusedBlock.id;
            } else {
                insertionPointId = this.editor.getEditorBlocks()[this.editor.getEditorBlocks().length - 1].id;
                const blockElement: HTMLElement = this.editor.getBlockElementById(insertionPointId);
                this.editor.setFocusToBlock(blockElement);
            }
        }

        let lastInsertedElement: HTMLElement;

        for (let i: number = 0; i < blocks.length; i++) {
            const block: BlockModel = blocks[i as number];
            const targetId: string = i === 0 ? insertionPointId : lastInsertedElement.id;
            lastInsertedElement = this.addBlock(block, targetId, true);
        }

        if (lastInsertedElement) {
            const contentElement: HTMLElement = getBlockContentElement(lastInsertedElement);
            this.editor.setFocusToBlock(lastInsertedElement);
            setCursorPosition(contentElement, contentElement.innerText.length);
        }

        return true;
    }

    public print(): void {
        const blockHtml: string = getBlockDataAsHTML(this.editor.blocks);
        const tempDiv: HTMLElement = this.editor.createElement('div');
        tempDiv.innerHTML = blockHtml;
        let printWind: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
        if (Browser.info.name === 'msie') {
            printWind.resizeTo(screen.availWidth, screen.availHeight);
        }
        printWind = printWindow(tempDiv, printWind);
    }
}
