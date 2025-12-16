import { BlockType } from '../../../models/enums';
import { getSelectedRange, setCursorPosition } from '../../../common/utils/selection';
import { getBlockContentElement, getBlockModelById, isListTypeBlock } from '../../../common/utils/block';
import { BlockModel } from '../../../models/index';
import * as constants from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';

export class ListPlugin {
    private parent: BlockManager;
    private static readonly INDENT_STEP_SIZE: number = 20;
    // Lookup table for Roman numerals 1–20
    private static ROMANNUMERALLOOKUP: Record<number, string> = {
        1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v',
        6: 'vi', 7: 'vii', 8: 'viii', 9: 'ix', 10: 'x',
        11: 'xi', 12: 'xii', 13: 'xiii', 14: 'xiv', 15: 'xv',
        16: 'xvi', 17: 'xvii', 18: 'xviii', 19: 'xix', 20: 'xx'
    };

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Handles the key press event for list blocks.
     *
     * @param {KeyboardEvent} event - The keyboard event.
     * @param {HTMLElement} blockElement - The block element.
     * @returns {boolean} - Returns true if the event is handled.
     * @hidden
     */
    public handleListKeyActions(event: KeyboardEvent, blockElement: HTMLElement): boolean {
        const range: Range = getSelectedRange();
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        let isActionProcessed: boolean = false;

        switch (event.key) {
        case 'Enter':
            this.handleEnterKey(event, blockElement, range, blockModel);
            this.parent.isEntireEditorSelected = false;
            isActionProcessed = true;
            break;
        case 'Backspace':
            this.handleBackspaceKey(event, blockElement, range, blockModel);
            this.parent.isEntireEditorSelected = false;
            isActionProcessed = true;
            break;
        }
        return isActionProcessed;
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

            let listType: string;
            switch (content) {
            case '*':
            case '-':
                listType = BlockType.BulletList.toString();
                break;
            case '1.':
                listType = BlockType.NumberedList.toString();
                break;
            case '[]':
                listType = BlockType.Checklist.toString();
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
                this.parent.execCommand({ command: 'IndentBlock', state: {
                    blockIDs: [blockModel.id],
                    shouldDecrease: true
                }});
            } else {
                this.parent.blockCommand.transformBlockToParagraph(blockElement, blockModel);
            }
        }
        else {
            this.parent.execCommand({ command: 'SplitBlock' });
        }
    }

    private handleBackspaceKey(event: KeyboardEvent, blockElement: HTMLElement, range: Range, blockModel: BlockModel): void {
        const isAtStart: boolean = range.collapsed && range.startOffset === 0;
        const isEmpty: boolean = blockElement.textContent.trim() === '';

        if (!isAtStart && !isEmpty) { return; }
        event.preventDefault();

        this.parent.blockCommand.transformBlockToParagraph(blockElement, blockModel);
        this.recalculateMarkersForListItems();
    }

    private transformBlockToList(blockElement: HTMLElement, blockModel: BlockModel, listType: string): void {
        if (blockModel.content.length > 0) {
            blockModel.content[0].content = '';
        }

        const newBlockElement: HTMLElement = this.parent.blockCommand.transformBlock({
            block: blockModel,
            blockElement: blockElement,
            newBlockType: listType
        });

        const contentElement: HTMLElement = getBlockContentElement(newBlockElement);
        setCursorPosition(contentElement, 0);
        this.updateListItemMarkers(newBlockElement);
    }

    /**
     * Updates the list item markers the given block element.
     *
     * @param {HTMLElement} blockElement - The block element to update.
     * @returns {void}
     * @hidden
     */
    public updateListItemMarkers(blockElement: HTMLElement): void {
        const prevBlockType: BlockType | string = blockElement.getAttribute('data-block-type') as BlockType;
        const listItem: HTMLElement = blockElement.querySelector('li');
        const isNumbered: boolean = prevBlockType === BlockType.NumberedList;
        const isChecklist: boolean = prevBlockType === BlockType.Checklist;

        if (isChecklist || !isNumbered) { return; }

        const index: number = this.getNumberedListItemIndex(blockElement);
        const indentLevel: number = this.getIndentLevel(blockElement);
        const marker: string = this.getListMarker(index, indentLevel);

        listItem.style.setProperty('list-style-type', `"${marker} "`);
    }

    private getNumberedListItemIndex(blockElement: HTMLElement): number {
        let index: number = 1;
        const allBlocks: HTMLElement[] = this.getAllBlockElements(blockElement);
        const currentBlockIndex: number = allBlocks.indexOf(blockElement);
        if (currentBlockIndex < 0) { return index; }
        const currentIndentLevel: number = this.getIndentLevel(blockElement);

        // Count only blocks with same indent level and same type starting from current block
        for (let i: number = currentBlockIndex - 1; i >= 0; i--) {
            const prevBlock: HTMLElement = allBlocks[i as number];
            const prevBlockType: BlockType = prevBlock.getAttribute('data-block-type') as BlockType;
            const prevIndentLevel: number = this.getIndentLevel(prevBlock);

            if (prevBlockType !== BlockType.NumberedList || currentIndentLevel > prevIndentLevel) {
                break; // Stop when block type changes or indent level increases(new series)
            }

            if (prevIndentLevel === currentIndentLevel) {
                index++; // Increment only when indent level is same
            }
        }
        return index;
    }

    private getIndentLevel(blockElement: HTMLElement): number {
        return parseInt((blockElement.style.getPropertyValue(constants.INDENT_KEY)), 10) / ListPlugin.INDENT_STEP_SIZE;
    }

    private getListMarker(index: number, indentLevel: number): string {
        const getRomanNumeral: (num: number) => string = (num: number): string => {
            // Use lookup table for numbers 1–20 (Improved efficiency)
            if (num >= 1 && num <= 20) {
                return ListPlugin.ROMANNUMERALLOOKUP[num as number];
            }

            // Fallback algorithm for numbers >20
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
        const indexByIndent: Map<number, number> = new Map();

        for (const block of allBlocks) {
            const blockType: string = block.getAttribute('data-block-type') as BlockType;
            if (!isListTypeBlock(blockType) || blockType === BlockType.Checklist || blockType === BlockType.BulletList) {
                continue;
            }

            const indentLevel: number = this.getIndentLevel(block);
            const prevBlockIndex: number = allBlocks.indexOf(block) - 1;
            const prevBlock: HTMLElement = prevBlockIndex >= 0 ? allBlocks[prevBlockIndex as number] : null;
            const prevBlockType: string = prevBlock ? prevBlock.getAttribute('data-block-type') : '';
            const prevIndentLevel: number = prevBlock ? this.getIndentLevel(prevBlock) : -1;

            // Reset counters for deeper levels when we encounter a shallower or equal level
            if (prevBlock && (prevIndentLevel > indentLevel ||
                (prevIndentLevel === indentLevel && prevBlockType !== BlockType.NumberedList))) {
                for (const [level] of (indexByIndent as any)) {
                    if (level > indentLevel) {
                        indexByIndent.delete(level);
                    }
                }
            }

            if (prevBlockType !== BlockType.NumberedList || prevIndentLevel < indentLevel) {
                indexByIndent.set(indentLevel, 1); // Start new sequence
            } else {
                // prevIndentLevel > indentLevel - returning to shallower level
                const currentIndex: number = (indexByIndent.get(indentLevel) || 0) + 1;
                indexByIndent.set(indentLevel, currentIndex);
            }

            const index: number = indexByIndent.get(indentLevel) || 1;
            this.setNumberedListMarker(block, index, indentLevel);
        }
    }

    private setNumberedListMarker(blockElement: HTMLElement, index: number, indent: number): void {
        const listItem: HTMLElement = blockElement.querySelector('li');
        const marker: string = this.getListMarker(index, indent);
        listItem.style.setProperty('list-style-type', `"${marker} "`);
    }

    private getAllBlockElements(focusedBlock?: HTMLElement): HTMLElement[] {
        const currentElement: HTMLElement = focusedBlock || this.parent.currentFocusedBlock;
        const calloutBlock: HTMLElement = currentElement &&
        currentElement.closest('.' + constants.CALLOUT_BLOCK_CLS) as HTMLElement;
        const toggleBlock: HTMLElement = currentElement &&
        currentElement.closest('.' + constants.TOGGLE_BLOCK_CLS) as HTMLElement;
        const tableBlock: HTMLElement = currentElement &&
        currentElement.closest('.' + constants.TABLE_BLOCK_CLS) as HTMLElement;
        const parentBlock: HTMLElement = calloutBlock || toggleBlock || tableBlock;
        const allBlocks: HTMLElement[] = parentBlock
            ? Array.from(parentBlock.querySelectorAll('.' + constants.BLOCK_CLS)) as HTMLElement[]
            : Array.from(this.parent.blockContainer.children) as HTMLElement[];
        return allBlocks;
    }
}
