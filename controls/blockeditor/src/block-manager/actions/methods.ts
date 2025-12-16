import { Browser, createElement, detach, print as printWindow } from '@syncfusion/ej2-base';
import { BlockType, CommandName } from '../../models/enums';
import { BlockModel, IChecklistBlockSettings, StyleModel } from '../../models/index';
import { getBlockContentElement, getBlockModelById, getInlineToolbarItems, getSelectedRange, isListTypeBlock, sanitizeBlock, setCursorPosition, setSelectionRange } from '../../common/utils/index';
import { convertHtmlElementToBlocks, getBlockDataAsHTML } from '../../common/utils/html-parser';
import * as constants from '../../common/constant';
import { BlockManager } from '../base/block-manager';
import { BlockFactory } from '../services/index';
import { IToolbarItemModel } from '../../models/interface';

export class BlockEditorMethods {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    public addBlock(block: BlockModel, targetId?: string, isAfter?: boolean, preventUIUpdate?: boolean): void {
        const targetBlockModel: BlockModel = getBlockModelById(targetId, this.parent.getEditorBlocks());
        const populatedBlock: BlockModel[] = BlockFactory.populateBlockProperties([block], targetBlockModel ? targetBlockModel.parentId : '');

        this.parent.execCommand({
            command: 'AddBlock',
            state: {
                block: populatedBlock[0],
                targetBlock: this.parent.blockContainer.querySelector(`#${targetId}`),
                isAfter: isAfter,
                preventUIUpdate: preventUIUpdate
            }
        });
    }

    public removeBlock(blockId: string): void {
        const blockElement: HTMLElement = this.parent.blockContainer.querySelector(`#${blockId}`);

        this.parent.execCommand({
            command: 'DeleteBlock',
            state: {
                blockElement: blockElement,
                isMethod: true,
                isUndoRedoAction: false
            }
        });
    }

    public getBlock(blockId: string): BlockModel | null {
        return getBlockModelById(blockId, this.parent.getEditorBlocks());
    }

    public moveBlock(fromBlockId: string, toBlockId: string): void {
        this.parent.execCommand({
            command: 'MoveBlock',
            state: {
                fromBlockIds: [fromBlockId],
                toBlockId: toBlockId,
                isInteracted: false
            }
        });
    }

    public updateBlock(blockId: string, properties: Partial<BlockModel>): boolean {
        if (!blockId || !properties) { return false; }
        const block: BlockModel = this.getBlock(blockId);

        if (!block) { return false; }

        /* Model Updates */
        this.parent.blockService.updateBlock(blockId, properties);

        this.parent.stateManager.updateManagerBlocks();

        /* UI Updates */
        const updatedBlockModel: BlockModel = this.getBlock(blockId);
        const oldBlockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        const newBlockElement: HTMLElement = this.parent.blockRenderer.createBlockElement(updatedBlockModel);
        const parentBlock: BlockModel = getBlockModelById(updatedBlockModel.parentId, this.parent.getEditorBlocks());
        let wrapper: HTMLElement = this.parent.blockContainer;
        if (parentBlock) {
            const parentBlockElement: HTMLElement = this.parent.getBlockElementById(parentBlock.id);
            const selector: string = parentBlock.blockType === BlockType.Callout
                ? '.' + constants.CALLOUT_CONTENT_CLS
                : '.' + constants.TOGGLE_CONTENT_CLS;
            wrapper = parentBlockElement.querySelector(selector);
        }

        wrapper.insertBefore(newBlockElement, oldBlockElement);
        detach(oldBlockElement);

        if (isListTypeBlock(updatedBlockModel.blockType)) {
            this.parent.listPlugin.recalculateMarkersForListItems();
            if (block.blockType === BlockType.Checklist) {
                if (this.parent.blockRenderer.listRenderer) {
                    this.parent.blockRenderer.listRenderer.toggleCheckedState(
                        updatedBlockModel, (updatedBlockModel.properties as IChecklistBlockSettings).isChecked
                    );
                }
            }
        }
        return true;
    }

    public executeToolbarAction(command: CommandName, value?: string): void {
        const builtInCommands: string[] = Object.keys(CommandName);
        if (builtInCommands.indexOf(command) !== -1) {
            const convertedCommand: keyof StyleModel = command.toLowerCase() as unknown as keyof StyleModel;
            this.parent.formattingAction.execCommand({ command: convertedCommand, value: value });
        }
    }

    public setSelection(contentId: string, start: number, end: number): void {
        const contentElement: HTMLElement = this.parent.blockContainer.querySelector(`#${contentId}`);
        if (contentElement) {
            setSelectionRange((contentElement.lastChild as HTMLElement), start, end);
        }
    }

    public setCursorPosition(blockId: string, position: number): void {
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        if (blockElement) {
            const contentElement: HTMLElement = getBlockContentElement(blockElement);
            setCursorPosition(contentElement, position);
        }
    }

    public getSelectedBlocks(): BlockModel[] | null {
        const range: Range = this.getRange();
        if (!range) { return null; }
        const tableBlk: HTMLElement = this.parent.currentFocusedBlock &&
            this.parent.currentFocusedBlock.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
        if (tableBlk && this.parent.tableSelectionManager.hasActiveTableSelection(tableBlk)) {
            return this.parent.tableSelectionManager.getSelectedCellBlocks(tableBlk);
        }

        const selectedBlocks: BlockModel[] = [];
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const blockElements: NodeListOf<HTMLElement> = this.parent.blockContainer.querySelectorAll('.' + constants.BLOCK_CLS);
        const parent: Node = range.commonAncestorContainer;
        const element: HTMLElement = parent.nodeType === Node.ELEMENT_NODE
            ? (parent as HTMLElement)
            : (parent.parentElement as HTMLElement);
        const isSelectionInsideChild: boolean = !!(element && element.closest(
            `.${constants.CALLOUT_CONTENT_CLS}, .${constants.TOGGLE_CONTENT_CLS}, .${constants.TABLE_CELL_BLK_CONTAINER}`
        ));
        blockElements.forEach((blockElement: HTMLElement) => {
            const blockRange: Range = document.createRange();
            blockRange.selectNodeContents(blockElement);

            const block: BlockModel = getBlockModelById(blockElement.id, editorBlocks);
            const isChildrenRootParent: boolean = isSelectionInsideChild &&
                (blockElement.classList.contains(constants.CALLOUT_BLOCK_CLS) ||
                blockElement.classList.contains(constants.TOGGLE_BLOCK_CLS) ||
                blockElement.classList.contains(constants.TABLE_BLOCK_CLS));
            const tableRootBlk: HTMLElement = blockElement.closest(`.${constants.TABLE_BLOCK_CLS}`) as HTMLElement;
            const isSelectionInsideTableCell: boolean = this.parent.currentFocusedBlock &&
                this.parent.currentFocusedBlock.contains(range.commonAncestorContainer);
            const canAllowTableBlks: boolean = (!tableRootBlk || blockElement.classList.contains('e-table-block')
                || isSelectionInsideTableCell);
            if (block && range.intersectsNode(blockElement) && !isChildrenRootParent && canAllowTableBlks) {
                selectedBlocks.push(block);
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
        const blockElement: HTMLElement = this.parent.getBlockElementById(blockId);
        if (blockElement) {
            const range: Range = document.createRange();
            range.selectNodeContents(blockElement);
            this.selectRange(range);
        }
    }

    public selectAllBlocks(): void {
        const range: Range = document.createRange();
        range.selectNodeContents(this.parent.blockContainer);
        this.selectRange(range);
    }

    public focusIn(): void {
        const startBlock: BlockModel = this.parent.getEditorBlocks()[0];
        const startBlkEle: HTMLElement = this.parent.getBlockElementById(startBlock.id);
        if (startBlkEle) {
            this.parent.setFocusAndUIForNewBlock(startBlkEle);
        }
    }

    public focusOut(): void {
        this.parent.removeFocusAndUIForBlock(this.parent.currentFocusedBlock);
        if (this.parent.blockContainer) {
            this.parent.blockContainer.blur();
            const selection: Selection = window.getSelection();
            selection.removeAllRanges();
        }
    }

    public getBlockCount(): number {
        return this.parent.blocks.length;
    }

    public enableDisableToolbarItems(itemId: string | string[], enable: boolean): void {
        const toolbarPopup: HTMLElement = document.querySelector('#' + this.parent.rootEditorElement.id + constants.INLINE_TBAR_POPUP_ID);

        const ids: string[] = typeof itemId === 'string' ? [itemId] : itemId;

        const parentToolbarElements: HTMLElement[] = [];
        const tbarItemModels: IToolbarItemModel[] = [];
        const items: (string | IToolbarItemModel)[] = this.parent.inlineToolbarSettings.items;

        ids.forEach((id: string) => {
            items.forEach((it: string | IToolbarItemModel) => {
                if (typeof it === 'string') {
                    if (it.toLowerCase === id.toLowerCase) {
                        const defaults: IToolbarItemModel[] = getInlineToolbarItems();
                        const match: IToolbarItemModel = defaults.find((d: IToolbarItemModel) =>
                            d.command && d.command.toLowerCase() === it.toLowerCase());
                        tbarItemModels.push(match);
                    }
                }
                else {
                    if (it.id === id) {
                        tbarItemModels.push(it);
                    }
                }
            });
        });

        tbarItemModels.forEach((item: IToolbarItemModel) => {
            const element: HTMLElement = toolbarPopup.querySelector(`[data-command=${item.command}]`) as HTMLElement;
            parentToolbarElements.push(element);
        });
        this.parent.observer.notify('enableDisableTbarItems', {
            items: parentToolbarElements,
            isEnable: enable
        });
    }

    public getDataAsJson(blockId?: string): BlockModel | BlockModel[] {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
            return block ? sanitizeBlock(block) : null;
        } else {
            return this.parent.getEditorBlocks().map((block: BlockModel) => sanitizeBlock(block));
        }
    }

    public getDataAsHtml(blockId?: string): string {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
            return block ? getBlockDataAsHTML([block], this.parent.rootEditorElement.id) : null;
        } else {
            return getBlockDataAsHTML(this.parent.getEditorBlocks(), this.parent.rootEditorElement.id);
        }
    }

    public parseHtmlToBlocks(html: string): BlockModel[] {
        const container: HTMLElement = createElement('div', { innerHTML: html });
        return convertHtmlElementToBlocks(container, true);
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
            this.parent.stateManager.populateUniqueIds(sanitizedBlocks);
            const populatedBlocks: BlockModel[] = BlockFactory.populateBlockProperties(sanitizedBlocks);

            if (replace) {
                return this.replaceAllBlocks(populatedBlocks);
            } else {
                return this.insertBlocksAtPosition(populatedBlocks, targetBlockId);
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
                if ((blocksJson as any).blockType) {
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
     * @hidden
     */
    public replaceAllBlocks(blocks: BlockModel[]): boolean {
        this.parent.setEditorBlocks([]);
        this.parent.blockContainer.innerHTML = '';
        if (blocks.length === 0) {
            this.parent.blockCommand.createDefaultEmptyBlock(true);
            return true;
        }
        this.parent.setEditorBlocks(blocks);
        this.parent.stateManager.updateManagerBlocks();
        this.parent.blockRenderer.renderBlocks(this.parent.getEditorBlocks());
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
            if (this.parent.currentFocusedBlock) {
                insertionPointId = this.parent.currentFocusedBlock.id;
            } else {
                insertionPointId = this.parent.getEditorBlocks()[this.parent.getEditorBlocks().length - 1].id;
                const blockElement: HTMLElement = this.parent.getBlockElementById(insertionPointId);
                this.parent.setFocusToBlock(blockElement);
            }
        }

        let lastInsertedElement: HTMLElement;

        for (let i: number = 0; i < blocks.length; i++) {
            const block: BlockModel = blocks[i as number];
            const targetId: string = i === 0 ? insertionPointId : lastInsertedElement.id;
            const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
                block,
                targetBlock: this.parent.getBlockElementById(targetId),
                isAfter: true,
                preventEventTrigger: true
            });
            lastInsertedElement = this.parent.getBlockElementById(addedBlock.id);
        }

        if (lastInsertedElement) {
            const contentElement: HTMLElement = getBlockContentElement(lastInsertedElement);
            this.parent.setFocusToBlock(lastInsertedElement);
            setCursorPosition(contentElement, contentElement.innerText.length);
        }

        return true;
    }

    public print(): void {
        const blockHtml: string = getBlockDataAsHTML(this.parent.blocks, this.parent.rootEditorElement.id);
        const tempDiv: HTMLElement = createElement('div');
        tempDiv.innerHTML = blockHtml;
        let printWind: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
        if (Browser.info.name === 'msie') {
            printWind.resizeTo(screen.availWidth, screen.availHeight);
        }
        printWind = printWindow(tempDiv, printWind);
    }
}
