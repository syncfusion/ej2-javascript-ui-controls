// eslint-disable @typescript-eslint/no-explicit-any

import { BlockEditor } from '../base/blockeditor';
import { BlockType } from '../base/enums';
import { getSelectionRange, setCursorPosition } from '../utils/selection';
import { getBlockContentElement, getBlockIndexById, getBlockModelById, isListTypeBlock } from '../utils/block';
import { BlockModel, ContentModel } from '../models/index';
import { BlockAction } from './block';
import { ISplitContent } from '../base/interface';
import { generateUniqueId } from '../utils/common';

export class ListBlockAction {
    private editor: BlockEditor;
    private blockAction: BlockAction;

    constructor(editor: BlockEditor, blockAction: BlockAction) {
        this.editor = editor;
        this.blockAction = blockAction;
    }

    /**
     * Handles the key press event for list blocks.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {HTMLElement} blockElement - The block element.
     * @returns {void}
     * @hidden
     */
    public handleListKeyActions(event: KeyboardEvent, blockElement: HTMLElement): void {
        const range: Range = getSelectionRange();
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);

        switch (event.key) {
        case 'Enter':
            this.handleEnterKey(event, blockElement, range, blockModel);
            this.editor.isEntireEditorSelected = false;
            break;
        case 'Backspace':
            this.handleBackspaceKey(event, blockElement, range, blockModel);
            this.editor.isEntireEditorSelected = false;
            break;
        default:
            break;
        }
    }

    /**
     * Handles creation of new list item on particular key triggers
     *
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {HTMLElement} blockElement - The block element.
     * @param {BlockModel} blockModel - The block model.
     * @returns {void}
     * @hidden
     */
    public handleListTriggerKey(event: KeyboardEvent, blockElement: HTMLElement, blockModel: BlockModel): void {
        /**
         * Below are the list triggers for the block editor.
         * (*) or (-) for bullet list.
         * (1.) for numbered list.
         * ([]) for checklist.
         */
        const content: string = blockElement.textContent.trim();
        if (content.length <= 0) { return; }
        const validLength: number = (content.startsWith('*') || content.startsWith('-')) ? 1 : 2;
        const isListTrigger: boolean =
            content.startsWith('*') ||
            content.startsWith('-') ||
            content.startsWith('1.') ||
            content.startsWith('[]');
        if (isListTrigger && event.key === ' ' && event.code === 'Space' && content.length === validLength) {
            event.preventDefault();

            let listType: BlockType;
            switch (content) {
            case '*':
            case '-':
                listType = BlockType.BulletList;
                break;
            case '1.':
                listType = BlockType.NumberedList;
                break;
            case '[]':
                listType = BlockType.CheckList;
                break;
            }
            this.transformBlockToList(blockElement, blockModel, listType);
        }
    }

    private handleEnterKey(event: KeyboardEvent, blockElement: HTMLElement, range: Range, blockModel: BlockModel): void {
        event.preventDefault();
        const isEmpty: boolean = blockElement.textContent.trim() === '';

        if (isEmpty) {
            if (blockModel.indent > 0) {
                const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
                (this.editor as any).isProtectedOnChange = true;
                blockModel.indent--;
                (this.editor as any).isProtectedOnChange = prevOnChange;
                this.blockAction.updateBlockIndentAttribute(blockElement, blockModel.indent);
                this.blockAction.updatePropChangesToModel();
                this.recalculateMarkersForListItems();
            } else {
                this.blockAction.transformBlockToParagraph(blockElement, blockModel);
            }
        }
        else {
            this.editor.splitAndCreateNewBlockAtCursor();
        }
    }

    private handleBackspaceKey(event: KeyboardEvent, blockElement: HTMLElement, range: Range, blockModel: BlockModel): void {
        const isAtStart: boolean = range.collapsed && range.startOffset === 0;
        const isEmpty: boolean = blockElement.textContent.trim() === '';

        if (!isAtStart && !isEmpty) { return; }
        event.preventDefault();

        this.blockAction.transformBlockToParagraph(blockElement, blockModel);
        this.recalculateMarkersForListItems();
    }

    private transformBlockToList(blockElement: HTMLElement, blockModel: BlockModel, listType: BlockType): void {
        if (blockModel.content.length > 0) {
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            blockModel.content[0].content = '';
            (this.editor as any).isProtectedOnChange = prevOnChange;
        }
        blockElement.innerText = '';

        const newContentEle: HTMLElement = this.blockAction.transformBlock({
            block: blockModel,
            blockElement: blockElement,
            newBlockType: listType
        });
        blockElement.appendChild(newContentEle);
        if (newContentEle) {
            setCursorPosition(newContentEle, 0);
        }
        this.updateListItemMarkers(blockElement);
        this.blockAction.updatePropChangesToModel();
    }

    /**
     * Updates the list item markers the given block element.
     *
     * @param {HTMLElement} blockElement - The block element to update.
     * @returns {void}
     * @hidden
     */
    public updateListItemMarkers(blockElement: HTMLElement): void {
        const prevBlockType: string = blockElement.getAttribute('data-block-type');
        const listItem: HTMLElement = blockElement.querySelector('li');
        const isNumbered: boolean = prevBlockType === BlockType.NumberedList;
        const isChecklist: boolean = prevBlockType === BlockType.CheckList;

        if (isChecklist) { return; }
        if (!isNumbered) {
            listItem.style.setProperty('list-style-type', '"• "');
            return;
        }

        const index: number = this.getNumberedListItemIndex(blockElement);
        const indentLevel: number = this.getIndentLevel(blockElement);
        const marker: string = this.getListMarker(index, indentLevel);

        listItem.style.setProperty('list-style-type', `"${marker} "`);
    }

    private getNumberedListItemIndex(blockElement: HTMLElement): number {
        let index: number = 1;
        const allBlocks: HTMLElement[] = this.getAllBlockElements();
        const currentBlockIndex: number = allBlocks.indexOf(blockElement);
        if (currentBlockIndex < 0) { return index; }
        const currentIndentLevel: number = this.getIndentLevel(blockElement);


        // Count only blocks with same indent level and same type starting from current block
        for (let i: number = currentBlockIndex - 1; i >= 0; i--) {
            const prevBlock: HTMLElement = allBlocks[parseInt(i.toString(), 10)];
            const prevBlockType: string = prevBlock.getAttribute('data-block-type');
            const prevIndentLevel: number = this.getIndentLevel(prevBlock);

            if (prevBlockType !== 'NumberedList' || currentIndentLevel > prevIndentLevel) {
                break; // Stop when block type changes or indent level increases(new series)
            }

            if (prevIndentLevel === currentIndentLevel) {
                index++; // Increment only when indent level is same
            }
        }
        return index;
    }

    private getIndentLevel(blockElement: HTMLElement): number {
        return parseInt((blockElement.style.getPropertyValue('--block-indent')), 10) / 20; //20 is the per indent level
    }

    private getListMarker(index: number, indentLevel: number): string {
        const getRomanNumeral: (num: number) => string = (num: number): string => {
            const romanMap: [number, string][] = [
                [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'],
                [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
            ];
            let result: string = '';
            for (const [value, symbol] of romanMap) {
                while (num >= value) {
                    result += symbol;
                    num -= value;
                }
            }
            return result;
        };

        const getLetterSequence: (num: number) => string = (num: number): string => {
            let result: string = '';
            while (num > 0) {
                num--;
                result = String.fromCharCode(97 + (num % 26)) + result;
                num = Math.floor(num / 26);
            }
            return result;
        };

        switch (indentLevel % 3) {
        case 0:
            return `${index}.`;
        case 1:
            return `${getLetterSequence(index)}.`;
        case 2:
            return `${getRomanNumeral(index)}.`;
        default:
            return `${index}.`;
        }
    }

    /**
     * Recalculate the markers for all list items in the editor.
     *
     * @returns {void}
     * @hidden
     */
    public recalculateMarkersForListItems(): void {
        const allBlocks: HTMLElement[] = this.getAllBlockElements();
        allBlocks.forEach((block: HTMLElement) => {
            if (isListTypeBlock(block.getAttribute('data-block-type'))) {
                this.updateListItemMarkers(block);
            }
        });
    }

    private getAllBlockElements(): HTMLElement[] {
        const calloutBlock: HTMLElement = this.editor.currentFocusedBlock &&
        this.editor.currentFocusedBlock.closest('.e-callout-block') as HTMLElement;
        const toggleBlock: HTMLElement = this.editor.currentFocusedBlock &&
        this.editor.currentFocusedBlock.closest('.e-toggle-block') as HTMLElement;
        const nestedBlock: HTMLElement = calloutBlock ? calloutBlock : toggleBlock;
        const allBlocks: HTMLElement[] = nestedBlock
            ? Array.from(nestedBlock.querySelectorAll('.e-block')) as HTMLElement[]
            : Array.from(this.editor.blockWrapper.children) as HTMLElement[];
        return allBlocks;
    }
}
