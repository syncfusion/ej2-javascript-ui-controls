import { BlockModel, ContentModel, StyleModel, Styles } from '../../models/index';
import { decoupleReference, getAbsoluteOffset, getDeepestTextNode } from '../../common/utils/common';
import { getSelectedRange, setCursorPosition } from '../../common/utils/selection';
import { getBlockContentElement, getBlockSpecificRange } from '../../common/utils/block';
import { NodeSelection } from '../../selection/selection';
import { ExecCommandOptions, LinkData } from '../../common/interface';
import { isNodeInsideElement, findClosestParent, getNodesInRange } from '../../common/utils/dom';
import { events } from '../../common/constant';
import { FormattingHelper } from '../../common/utils/isformatted';
import * as constants from '../../common/constant';
import { BlockType, ContentType } from '../../models/enums';
import { BlockManager } from '../base/block-manager';
import { TableContext } from '../base/interface';
import { FormattingHandler } from '../plugins/formatting/formatting-handler';
import { convertInlineElementsToContentModels } from '../../common/utils/html-parser';

export class FormattingAction {
    private parent: BlockManager;
    /** @hidden */
    public nodeSelection: NodeSelection;
    /** @hidden */
    public lastRemovedFormat: keyof StyleModel = null;
    /** @hidden */
    public activeInlineFormats: Set<keyof StyleModel> = new Set();
    private formatCache: WeakMap<HTMLElement, Set<keyof StyleModel>> = new WeakMap<HTMLElement, Set<keyof StyleModel>>();
    private ignoredBlockTypes: Set<string> = new Set<string>([ BlockType.Callout,
        BlockType.Quote, BlockType.Image, BlockType.Divider, BlockType.Code ]);
    private formattingHandler: FormattingHandler;

    constructor(manager?: BlockManager) {
        this.parent = manager;
        this.nodeSelection = new NodeSelection(this.parent.blockContainer);
        this.formattingHandler = new FormattingHandler(this.parent);
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

        if (!options.isRemoteChanges) { this.nodeSelection.saveSelection(); }

        const { blockIDs, oldBlockModels, updatedBlockModels } = this.applyFormattingToBlocks(blocksToFormat, options);

        if (!options.isRemoteChanges) { this.nodeSelection.restoreSelection(); }

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

        options.shouldRemoveGlobally = this.shouldRemoveFormatGlobally(blocks, options);

        for (const block of blocks) {
            if (this.ignoredBlockTypes.has(block.blockType) || block.content.length <= 0) {
                continue;
            }

            blockIDs.push(block.id);
            oldBlockModels.push(decoupleReference(block));

            this.processFormattingActions(block, options);

            updatedBlockModels.push(decoupleReference(block));
        }

        return { blockIDs, oldBlockModels, updatedBlockModels };
    }

    private processFormattingActions(block: BlockModel, options: ExecCommandOptions): void {
        const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const oldBlock: BlockModel = decoupleReference(block);

        const globalRange: Range = getSelectedRange();
        const blockRange: Range = getBlockSpecificRange(globalRange, blockElement);

        // Apply formatting using new handler
        const format: string = options.subCommand ? options.subCommand.toString() : options.command.toString();
        this.formattingHandler.executeFormat(blockRange, format, options);

        // Parse updated DOM back to model using html-parser utility
        const newContents: ContentModel[] = convertInlineElementsToContentModels(contentElement, true);
        this.parent.blockService.updateContent(block.id, newContents);
        this.parent.stateManager.updateManagerBlocks();

        // For event track
        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: block, oldBlock: oldBlock } ],
            excludeDomUpdate: true,
            preventEventTrigger: options.isRemoteChanges
        }});
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
     * Determines whether formatting should be removed or applied across all selected blocks.
     * This is critical for multi-block selections to ensure consistent behavior.
     *
     * For example, if 3 blocks are selected where block 2 is already bold:
     * - Without global check: Block 1 gets bold applied, Block 2 gets bold removed, Block 3 gets bold applied
     * - With global check: All blocks get bold applied consistently
     *
     * @param {BlockModel[]} blocks - All blocks in the selection
     * @param {ExecCommandOptions} options - Formatting options
     * @returns {boolean} - True if format should be removed, false if it should be applied
     */
    private shouldRemoveFormatGlobally(blocks: BlockModel[], options: ExecCommandOptions): boolean {
        const format: string = options.subCommand ? options.subCommand.toString() : options.command.toString();

        // Value-based formats (color, backgroundColor, link) should never be "removed" in toggle sense
        const valueBasedFormats: string[] = ['color', 'backgroundColor', 'link'];
        if (valueBasedFormats.indexOf(format) !== -1) {
            return false;
        }

        // Collect all text nodes from all blocks
        const globalRange: Range = getSelectedRange();
        const allNodes: Node[] = [];

        for (const block of blocks) {
            if (this.ignoredBlockTypes.has(block.blockType) || block.content.length <= 0) {
                continue;
            }

            const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
            const blockRange: Range = getBlockSpecificRange(globalRange, blockElement);
            const nodes: Node[] = getNodesInRange(blockRange);
            allNodes.push(...nodes);
        }

        // Use FormattingHelper to determine if all nodes have the format
        return FormattingHelper.shouldRemoveFormat(allNodes, format);
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

    private resolveBlocksToFormat(): BlockModel[] {
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();

        // Case A: Whole blocks are selected (including possible Table blocks)
        if (selectedBlocks && selectedBlocks.length > 0) {
            return this.expandSelectedBlocks(selectedBlocks);
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

    public destroy(): void {
        this.removeEventListeners();
        this.lastRemovedFormat = null;
        this.activeInlineFormats = null;
        this.nodeSelection = null;
        this.formatCache = null;
        this.activeInlineFormats = null;
        this.ignoredBlockTypes = null;
    }
}
