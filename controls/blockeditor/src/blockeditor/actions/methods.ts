import { Browser, detach, print as printWindow } from '@syncfusion/ej2-base';
import { BlockEditor, BuiltInToolbar } from '../base/index';
import { BlockModel, StyleModel, ToolbarItem, ToolbarItemModel } from '../models/index';
import { deepClone, getBlockContentElement, getBlockIndexById, getBlockModelById, getSelectionRange, isListTypeBlock, sanitizeBlock, setCursorPosition, setSelectionRange } from '../utils/index';
import { getBlockDataAsHTML } from '../utils/html-parser';

export class BlockEditorMethods {
    protected editor: BlockEditor;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
    }

    public addBlock(block: BlockModel, targetId?: string, isAfter?: boolean): HTMLElement {
        return this.editor.blockAction.addNewBlock({
            block: block,
            targetBlock: this.editor.blockWrapper.querySelector(`#${targetId}`),
            isAfter: isAfter
        });
    }

    public removeBlock(blockId: string): void {
        const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`);
        this.editor.blockAction.deleteBlock({ blockElement: blockElement, isMethod: true, isUndoRedoAction: false });
    }

    public getBlock(blockId: string): BlockModel | null {
        return getBlockModelById(blockId, this.editor.blocksInternal);
    }

    public moveBlock(fromBlockId: string, toBlockId: string): void {
        this.editor.blockAction.moveBlock({
            fromBlockIds: [fromBlockId],
            toBlockId: toBlockId,
            isInteracted: false
        });
    }

    public updateBlock(blockId: string, properties: Partial<BlockModel>): boolean {
        const block: BlockModel = this.getBlock(blockId);
        if (block) {
            const indexToUpdate: number = getBlockIndexById(blockId, this.editor.blocksInternal);
            const oldBlockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`);
            // Update only the received properties and leave the rest as is.
            const clonedBlock: BlockModel = deepClone(sanitizeBlock(block));
            const newBlock: BlockModel = { ...clonedBlock, ...properties };
            const parentBlock: BlockModel = getBlockModelById(newBlock.parentId, this.editor.blocksInternal);
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            if (parentBlock) {
                const parentIndex: number = getBlockIndexById(parentBlock.id, this.editor.blocksInternal);
                parentBlock.children.splice(indexToUpdate, 1, newBlock);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any).setProperties({ children: parentBlock.children }, true);
            }
            else {
                this.editor.blocksInternal.splice(indexToUpdate, 1, newBlock);
            }
            (this.editor as any).isProtectedOnChange = prevOnChange;
            /* eslint-enable @typescript-eslint/no-explicit-any */
            this.editor.blockAction.updatePropChangesToModel();

            const updatedBlockModel: BlockModel = getBlockModelById(blockId, this.editor.blocksInternal);
            const newBlockElement: HTMLElement = this.editor.blockAction.createBlockElement(updatedBlockModel);
            if (parentBlock) {
                const parentBlockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${parentBlock.id}`);
                const selector: string = updatedBlockModel.type === 'Callout' ? '.e-callout-content' : '.e-toggle-content';
                const wrapper: HTMLElement = parentBlockElement.querySelector(selector);
                wrapper.insertBefore(newBlockElement, oldBlockElement);
            }
            this.editor.blockWrapper.insertBefore(
                newBlockElement,
                this.editor.blockWrapper.children[parseInt(indexToUpdate.toString(), 10)]
            );
            detach(oldBlockElement);
            if (isListTypeBlock(updatedBlockModel.type)) {
                this.editor.listBlockAction.recalculateMarkersForListItems();
            }
            return true;
        }
        return false;
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
        const callout: HTMLElement = this.editor.currentFocusedBlock.closest('.e-callout-block') as HTMLElement;
        const toggle: HTMLElement = this.editor.currentFocusedBlock.closest('.e-toggle-block') as HTMLElement;
        let blockElements: NodeListOf<HTMLElement> = this.editor.blockWrapper.querySelectorAll('.e-block');
        if (callout) {
            blockElements = callout.querySelectorAll('.e-block');
        }
        else if (toggle) {
            blockElements = toggle.querySelectorAll('.e-block');
        }
        blockElements.forEach((blockElement: HTMLElement) => {
            const blockRange: Range = document.createRange();
            blockRange.selectNodeContents(blockElement);

            if (range.intersectsNode(blockElement)) {
                const block: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
                if (block) { selectedBlocks.push(block); }
            }
        });

        return selectedBlocks;
    }

    public getRange(): Range | null {
        return getSelectionRange();
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
            if (selection) { selection.removeAllRanges(); }
        }
    }

    public getBlockCount(): number {
        return this.editor.blocks.length;
    }

    public enableDisableToolbarItems(itemId: string | string[], enable: boolean): void {
        const toolbarPopup: HTMLElement = document.querySelector('.e-blockeditor-inline-toolbar-popup');
        if (!toolbarPopup) { return; }

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
            if (item) {
                parentToolbarElements.push(element);
            }
        });
        this.editor.inlineToolbarModule.toolbarObj.enableItems(parentToolbarElements, enable);
    }

    public getDataAsJson(blockId?: string): any {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.editor.blocksInternal);
            return block ? sanitizeBlock(block) : null;
        } else {
            return this.editor.blocksInternal.map((block: BlockModel) => sanitizeBlock(block));
        }
    }

    public getDataAsHtml(blockId?: string): string {
        if (blockId) {
            const block: BlockModel = getBlockModelById(blockId, this.editor.blocksInternal);
            return block ? getBlockDataAsHTML([block]) : null;
        } else {
            return getBlockDataAsHTML(this.editor.blocksInternal);
        }
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
