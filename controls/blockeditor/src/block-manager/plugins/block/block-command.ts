import { isNullOrUndefined as isNOU, detach } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, BlockProperties, ContentModel } from '../../../models/index';
import { IAddBlockInteraction, IAddBulkBlocksInteraction, IDeleteBlockInteraction, IToBlockData, IFromBlockData, IIndentOperation, IMoveBlocksInteraction, ISplitContentData, ITransformBlockInteraction, RangePath } from '../../../common/interface';
import { generateUniqueId, decoupleReference, setCursorPosition, getSelectedRange, getAbsoluteOffset, captureSelectionState, convertInlineElementsToContentModels } from '../../../common/utils/index';
import { getBlockModelById, getBlockIndexById, getBlockContentElement, isListTypeBlock, cleanCheckmarkElement, isNonMergableBlock, getAdjacentBlock, getContainerInfo } from '../../../common/utils/block';
import * as constants from '../../../common/constant';
import { actionType, events } from '../../../common/constant';
import { BlockType } from '../../../models/enums';
import { DeletionType } from '../../../common/enums';
import { BlockFactory } from '../../services/block-factory';
import { BlockManager } from '../../base/block-manager';
import { TableContext } from '../../base/interface';
import { removeNodesAfterSplit } from '../../../common/utils/dom';

/**
 * Manages all block-related commands in the BlockEditor
 */
export class BlockCommand {
    private parent: BlockManager;
    /**
     * Creates a new BlockCommandManager instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(constants.ADDBLOCK, this.addBlock, this);
        this.parent.observer.on(constants.DELETEBLOCK, this.deleteBlock, this);
        this.parent.observer.on(constants.DELETEATCURSOR, this.deleteBlockAtCursor, this);
        this.parent.observer.on(constants.SPLITBLOCK, this.splitBlock, this);
        this.parent.observer.on(constants.MOVEBLOCK, this.moveBlock, this);
        this.parent.observer.on(constants.DUPLICATEBLOCK, this.duplicateBlock, this);
        this.parent.observer.on(constants.INDENTBLOCK, this.handleBlockIndentation, this);
        this.parent.observer.on(constants.DELETE_NON_MERGABLEBLOCK, this.deleteNonMergableBlock, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(constants.ADDBLOCK, this.addBlock);
        this.parent.observer.off(constants.DELETEBLOCK, this.deleteBlock);
        this.parent.observer.off(constants.DELETEATCURSOR, this.deleteBlockAtCursor);
        this.parent.observer.off(constants.SPLITBLOCK, this.splitBlock);
        this.parent.observer.off(constants.MOVEBLOCK, this.moveBlock);
        this.parent.observer.off(constants.DUPLICATEBLOCK, this.duplicateBlock);
        this.parent.observer.off(constants.INDENTBLOCK, this.handleBlockIndentation);
        this.parent.observer.off(constants.DELETE_NON_MERGABLEBLOCK, this.deleteNonMergableBlock);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Adds a new block to the editor
     *
     * @param {IAddBlockInteraction} args Options for adding new block
     * @returns {BlockModel} The newly created block model
     * @hidden
     */
    public addBlock(args: IAddBlockInteraction): BlockModel {
        const { isAfter = true } = args;
        this.populateTargetModelAndId(args);

        /* Process Model */
        const addedBlock: BlockModel = this.parent.blockService.addBlock({
            block: this.prepareBlock(args),
            targetBlockId: args.targetBlockId,
            isAfter: isAfter
        });

        this.parent.stateManager.updateManagerBlocks();

        this.parent.undoRedoAction.trackBlockAdditionForUndoRedo(args, addedBlock);

        this.parent.observer.notify('modelChanged', {
            type: 'AddBlock',
            state: {
                ...args,
                isAfter: isAfter,
                addedBlock
            }
        });
        return addedBlock;
    }

    /**
     * Deletes a block from the editor
     *
     * @param {IDeleteBlockInteraction} args Options for the deletion
     * @returns {void}
     * @hidden
     */
    public deleteBlock(args: IDeleteBlockInteraction): void {
        if (!args.blockElement) { return; }

        const { removedBlock, blockIndex }: { removedBlock: BlockModel, blockIndex: number } =
            this.parent.blockService.removeBlock({ blockId: args.blockElement.id });

        this.parent.stateManager.updateManagerBlocks();

        if (!removedBlock) { return; }

        this.parent.undoRedoAction.trackBlockRemovalForUndoRedo(args, args.blockElement.id, removedBlock, blockIndex);

        this.parent.observer.notify('modelChanged', {
            type: 'DeleteBlock',
            state: {
                ...args,
                removedBlock,
                blockIndex
            }
        });
        if (!args.preventMinimumOne) {
            this.parent.blockCommand.createDefaultEmptyBlock(true);
        }
    }

    /**
     * Splits the current block at cursor position and creates a new block
     *
     * @param {IAddBlockInteraction} args - Options to split the block
     * @returns {void}
     * @hidden
     */
    public splitBlock(args?: IAddBlockInteraction): void {
        let newBlockContents: ContentModel[] = [];
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        const range: Range = this.parent.nodeSelection.getRange();
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const blockBeforeSplit: BlockModel = decoupleReference(blockModel);
        const currBlockType: BlockType | string = blockModel.blockType;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const firstNode: Node = contentElement.childNodes[0];
        const isCursorAtStartNode: boolean = firstNode
            ? (firstNode.contains(range.startContainer) || firstNode === range.startContainer)
            : (contentElement === range.startContainer);
        const splitOffset: number = range.startOffset;
        const isSplitAtStart: boolean = splitOffset === 0 && isCursorAtStartNode;

        if (!isSplitAtStart) {
            /* Get split fragment for new block */
            const { afterFragment }: ISplitContentData = this.parent.nodeCutter.splitContent(
                getBlockContentElement(blockElement), range.startContainer, range.startOffset
            );
            /* Split node at cursor and remove everything after the split point */
            this.parent.nodeCutter.getSpliceNode(range, range.startContainer);
            removeNodesAfterSplit(range.startContainer, contentElement);

            const currBlockContents: ContentModel[] = convertInlineElementsToContentModels(contentElement, true);
            newBlockContents = this.getContentModelForFragment(afterFragment);
            this.parent.blockService.updateContent(
                blockModel.id,
                currBlockContents.length > 0 ? currBlockContents : [BlockFactory.createTextContent()]
            );
            // Trigger content change for event tracking alone, no dom renders
            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: blockModel, oldBlock: blockBeforeSplit } ],
                preventEventTrigger: true,
                excludeDomUpdate: true
            }});
        }

        this.addBlock({
            blockType: isListTypeBlock(currBlockType) ? currBlockType : BlockType.Paragraph,
            isAfter: isSplitAtStart ? false : true,
            targetBlock: this.parent.getBlockElementById(blockElement.id),
            contentModel: newBlockContents,
            splitOffset: splitOffset,
            isSplitting: !isSplitAtStart,
            blockBeforeSplit,
            preventEventTrigger: args ? args.preventEventTrigger : false
        });

        this.parent.stateManager.updateManagerBlocks();
    }

    /**
     * Deletes block at cursor
     *
     * @param {IDeleteBlockInteraction} args Optional additional arguments
     * @returns {void}
     * @hidden
     */
    public deleteBlockAtCursor(args: IDeleteBlockInteraction): void {
        const { blockElement, mergeDirection } = args;
        if (!blockElement) { return; }
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();

        if (blockElement.getAttribute('data-block-type').startsWith('Collapsible')) {
            this.transformToggleBlocksAsRegular(blockElement);
            return;
        }

        const getAdjacentBlock: (element: HTMLElement, direction: 'previous' | 'next') => HTMLElement | null =
            (element: HTMLElement, direction: 'previous' | 'next'): HTMLElement | null => {
                return (direction === 'previous' ? element.previousElementSibling : element.nextElementSibling) as HTMLElement;
            };

        const adjacentBlock: HTMLElement | null = getAdjacentBlock(blockElement, mergeDirection);
        if (!adjacentBlock) { return; }

        /*
        sourceBlock - the block that will be deleted after merging its content with the targetBlock
        targetBlock - the block that will remain after merging
        */
        const sourceBlock: HTMLElement = mergeDirection === 'previous' ? blockElement : adjacentBlock;
        const targetBlock: HTMLElement = mergeDirection === 'previous' ? adjacentBlock : blockElement;
        const sourceBlockModel: BlockModel = getBlockModelById(sourceBlock.id, editorBlocks);
        const targetBlockModel: BlockModel = getBlockModelById(targetBlock.id, editorBlocks);
        const sourceContent: HTMLElement = getBlockContentElement(sourceBlock) as HTMLElement;
        const targetContent: HTMLElement = getBlockContentElement(targetBlock) as HTMLElement;
        const newCursorPos: number = targetContent.textContent.length;
        const blocksBeforeDelete: BlockModel[] = [decoupleReference(targetBlockModel), decoupleReference(sourceBlockModel)];

        // Source block is trying to merge into an empty block
        if (targetContent.textContent.trim().length === 0) {
            /* At this point, do not merge Source into Target.
            Instead, simply delete the Empty Target. This approach requires Zero Re-rendering */
            this.deleteBlock({
                ...args,
                blockElement: targetBlock,
                isSplitting: false,
                isTargetDeletion: true
            });

            // Update the source model
            const newContents: ContentModel[] = convertInlineElementsToContentModels(sourceContent, true);
            this.parent.blockService.updateContent(sourceBlockModel.id, newContents);

            this.parent.setFocusAndUIForNewBlock(sourceBlock);
            return;
        }

        /* (Fallback to your standard merge logic for non-empty blocks) */
        const targetFragment: DocumentFragment = document.createDocumentFragment();
        while (sourceContent.firstChild) {
            targetFragment.appendChild(sourceContent.firstChild);
        }
        targetContent.appendChild(targetFragment);
        targetContent.normalize();

        const newContents: ContentModel[] = convertInlineElementsToContentModels(targetContent, true);
        this.parent.blockService.updateContent(targetBlockModel.id, newContents);

        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: targetBlockModel, oldBlock: blocksBeforeDelete[0] } ],
            preventEventTrigger: true,
            preventChangesTracking: args.preventChangesTracking,
            excludeDomUpdate: true
        }});

        this.parent.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, newCursorPos);
        this.parent.togglePlaceholder(targetBlock, true);
        this.parent.floatingIconAction.showFloatingIcons(targetBlock);

        /* Delete source block */
        this.deleteBlock({
            ...args,
            blockElement: sourceBlock,
            isSplitting: true,
            blocksAfterSplit: blocksBeforeDelete,
            blockBeforeSplit: targetBlockModel,
            targetBlockModel: targetBlockModel
        });

        if (isListTypeBlock(sourceBlockModel.blockType) || isListTypeBlock(targetBlockModel.blockType)) {
            this.parent.listPlugin.recalculateMarkersForListItems();
        }
    }

    /**
     * Deletes non mergable block
     *
     * @param {IDeleteBlockInteraction} args Optional additional arguments
     * @returns {void}
     * @hidden
     */
    public deleteNonMergableBlock(args: IDeleteBlockInteraction): void {
        const { array, containerType } = getContainerInfo(args.blockElement.id, this.parent.getEditorBlocks());
        if ((containerType === 'cell' || containerType === 'children') && (array && array.length === 1)) {
            this.transformBlock({
                block: getBlockModelById(args.blockElement.id, this.parent.getEditorBlocks()),
                blockElement: args.blockElement,
                newBlockType: BlockType.Paragraph
            });
            return;
        }
        else {
            const adjacentBlockElement: HTMLElement = getAdjacentBlock(args.blockElement, 'next')
                || getAdjacentBlock(args.blockElement, 'previous');

            this.deleteBlock({ ...args, blockElement: args.blockElement });
            /* When there is only single block in editor, on deletion of it, we should create a default empty paragraph */

            if (!isNOU(adjacentBlockElement)) {
                this.parent.setFocusAndUIForNewBlock(adjacentBlockElement);
            }
            return;
        }
    }

    /**
     * Handles Clipboard paste of bulk blocks in to the editor
     *
     * @param {IAddBulkBlocksInteraction} args Options for the bulk block addition
     * @returns {void}
     * @hidden
     */
    public addBulkBlocks(args: IAddBulkBlocksInteraction): void {
        const { blocks, targetBlockId, insertionType }: IAddBulkBlocksInteraction = args;
        if (blocks.length === 0) {
            this.parent.undoRedoAction.trackClipboardPasteForUndoRedo(args);
            return;
        }

        let insertedBlock: BlockModel;
        for (let i: number = 0; i < blocks.length; i++) {
            insertedBlock = this.addBlock(
                {
                    block: blocks[i as number],
                    targetBlock: this.parent.getBlockElementById(i === 0 ? targetBlockId : insertedBlock.id),
                    isUndoRedoAction: true,
                    preventEventTrigger: true,
                    preventUpdateAction: true,
                    forceIgnoreTargetUpdate: true
                });
        }

        this.parent.listPlugin.recalculateMarkersForListItems();
        this.parent.setCursorAfterBulkBlockAddition(insertionType);
        this.parent.undoRedoAction.trackClipboardPasteForUndoRedo(args);
    }

    /**
     * Duplicates a block and inserts it above or below the original
     *
     * @param {Object} args The options to duplicate
     * @param {HTMLElement} args.blockElement The block element to duplicate
     * @param {'below'|'above'} args.direction Direction to insert the duplicated block
     * @returns {void}
     * @hidden
     */
    public duplicateBlock(args: { blockElement: HTMLElement, direction: 'below' | 'above' }): void {
        if (!args.blockElement) { return; }

        const duplicatedBlock: BlockModel = this.parent.blockService.duplicateBlock({ blockId: args.blockElement.id });
        this.parent.stateManager.updateManagerBlocks();

        if (duplicatedBlock) {
            this.addBlock({
                block: duplicatedBlock,
                targetBlockId: args.blockElement.id,
                isAfter: args.direction === 'below',
                forceIgnoreTargetUpdate: true
            });
        }
    }

    /**
     * Handles the indentation of blocks
     *
     * @param {IIndentOperation} args - The arguments for indenting blocks
     * @returns {void}
     * @hidden
     */
    public handleBlockIndentation(args: IIndentOperation): void {
        const { blockIDs, shouldDecrease }: IIndentOperation = args;

        blockIDs.forEach((blockId: string) => {
            const oldBlock: BlockModel = decoupleReference(getBlockModelById(blockId, this.parent.getEditorBlocks()));
            const updatedBlock: BlockModel = this.parent.blockService.applyIndentation({
                blockId: blockId,
                shouldDecrease: shouldDecrease
            });

            this.parent.observer.notify('modelChanged', {
                type: 'IndentBlock',
                state: {
                    blockId,
                    newIndent: updatedBlock.indent
                }
            });

            this.parent.eventService.addChange({
                action: 'Update',
                data: {
                    block: updatedBlock,
                    prevBlock: oldBlock
                }
            });
        });

        this.parent.stateManager.updateManagerBlocks();
        this.parent.listPlugin.recalculateMarkersForListItems();
        this.parent.undoRedoAction.trackIndentActionForUndoRedo(args);
        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    /**
     * Moves a block or group of blocks to a new position
     *
     * @param {IMoveBlocksInteraction} args Options for moving the block
     * @returns {void}
     * @hidden
     */
    public moveBlock(args: IMoveBlocksInteraction): void {
        const { fromBlockIds = [], toBlockId, isInteracted = true } = args;
        if (fromBlockIds.length === 0 || !toBlockId) { return; }

        const toBlockElement: HTMLElement = this.parent.getBlockElementById(toBlockId);
        if (!toBlockElement) { return; }
        const allBlocks: HTMLElement[] = Array.from(this.parent.blockContainer.children) as HTMLElement[];

        const fromElements: HTMLElement[] = fromBlockIds
            .map((id: string): Element | null => this.parent.getBlockElementById(id))
            .filter((el: Element | null): el is HTMLElement => el instanceof HTMLElement);

        const destination: IToBlockData = this.getDestinationBlockDataForMove(toBlockId);
        const toBlockDOM: HTMLElement = (destination.toParentBlockModel
            ? allBlocks[destination.toParentBlockIndex as number].querySelectorAll('.' + constants.BLOCK_CLS)[destination.toBlockIndex as number]
            : allBlocks[destination.toBlockIndex as number]) as HTMLElement;

        const isMovingUp: boolean = fromElements[0].getBoundingClientRect().top > toBlockDOM.getBoundingClientRect().top;

        const movedBlocks: IFromBlockData[] = this.parent.blockService.moveBlocks({
            blockIds: fromBlockIds,
            toBlockId: toBlockId,
            isMovingUp: isMovingUp
        });

        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', {
            type: 'MoveBlock',
            state: {
                movedBlocks,
                destination,
                fromElements,
                isInteracted,
                isMovingUp,
                toBlockDOM
            }
        });

        this.parent.undoRedoAction.trackBlockMoveForUndoRedo(
            args,
            movedBlocks,
            destination.toBlockIndex,
            destination.toParentBlockModel ? destination.toParentBlockModel.id : '',
            isMovingUp
        );

        const selection: Selection = window.getSelection();
        if (selection) { selection.removeAllRanges(); }

        this.parent.updateFocusAndCursor(fromElements.length > 0 ? fromElements[0] : null);
    }

    /**
     * Handles the selective deletion of blocks
     *
     * @param {KeyboardEvent} event The keyboard event
     * @returns {boolean} Whether the event was handled
     * @hidden
     */
    public handleSelectiveDeletions(event: KeyboardEvent): boolean {
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        if (selectedBlocks && selectedBlocks.length <= 0 || (getSelectedRange() && getSelectedRange().collapsed)) { return false; }
        this.parent.isEntireEditorSelected = this.parent.nodeSelection.checkIsEntireEditorSelected();
        if (this.parent.isEntireEditorSelected) {
            this.handleEntireBlockDeletion();
            event.preventDefault();
            return true;
        }
        else if (selectedBlocks && selectedBlocks.length > 1) {
            this.handleMultipleBlockDeletion(selectedBlocks, event.key === 'Backspace' ? 'previous' : 'next');
            event.preventDefault();
            return true;
        }
        return false;
    }

    /**
     * Handles the deletion of entire blocks
     *
     * @returns {void}
     * @hidden
     */
    public handleEntireBlockDeletion(): void {
        const prevFocusedBlockid: string = this.parent.currentFocusedBlock.id;
        const allBlocks: BlockModel[] = this.parent.getEditorBlocks().map((block: BlockModel) => {
            const decoupledBlock: BlockModel = decoupleReference(block);
            this.parent.eventService.addChange({
                action: 'Deletion',
                data: { block: decoupledBlock }
            });
            return decoupledBlock;
        });
        this.parent.setEditorBlocks([]);

        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.multipleBlocksDeleted,
            oldBlockModel: this.createDefaultEmptyBlock(true),
            data: {
                deletedBlocks: allBlocks,
                deletionType: DeletionType.Entire,
                cursorBlockId: prevFocusedBlockid
            }
        });

        this.parent.isEntireEditorSelected = false;
    }

    /**
     * Handles multiple block deletion
     *
     * @param {BlockModel[]} selectedBlocks The selected blocks
     * @param {string} direction The direction of deletion ('previous' or 'next')
     * @param {boolean} isUndoRedoAction Whether the action is an undo/redo action
     * @returns {boolean} Whether the deletion was successful
     * @hidden
     */
    public handleMultipleBlockDeletion(
        selectedBlocks: BlockModel[],
        direction: 'previous' | 'next' = 'previous',
        isUndoRedoAction?: boolean
    ): boolean {
        const prevFocusedBlockid: string = this.parent.currentFocusedBlock ? this.parent.currentFocusedBlock.id : '';
        const selectedClones: BlockModel[] = selectedBlocks.map((block: BlockModel) => decoupleReference(block));
        const firstBlock: BlockModel = selectedBlocks[0];
        const firstBlockIndex: number = getBlockIndexById(firstBlock.id, this.parent.getEditorBlocks());
        const lastBlock: BlockModel = selectedBlocks[selectedBlocks.length - 1];
        const firstBlockElement: HTMLElement = this.parent.getBlockElementById(firstBlock.id);
        const lastBlockElement: HTMLElement = this.parent.getBlockElementById(lastBlock.id);
        const range: Range = getSelectedRange();

        if (!range || !firstBlockElement || !lastBlockElement) { return false; }

        /* Middle blocks */
        for (let i: number = 1; i < selectedBlocks.length - 1; i++) {
            this.parent.execCommand({ command: 'DeleteBlock', state: {
                blockElement: this.parent.getBlockElementById(selectedBlocks[parseInt(i.toString(), 10)].id),
                isUndoRedoAction: true,
                preventEventTrigger: true
            }});
        }

        // Trim suffix of first block
        const startRange: Range = document.createRange();
        startRange.setStart(range.startContainer, range.startOffset);
        startRange.setEndAfter(getBlockContentElement(firstBlockElement).lastChild);
        startRange.deleteContents(); // Native DOM removal. Identity preserved!

        // Trim prefix of last block
        const endRange: Range = document.createRange();
        endRange.setStartBefore(getBlockContentElement(lastBlockElement).firstChild);
        endRange.setEnd(range.endContainer, range.endOffset);
        endRange.deleteContents();

        /* Merge Last into First */
        this.deleteBlockAtCursor({
            blockElement: direction === 'previous' ? lastBlockElement : firstBlockElement,
            mergeDirection: direction,
            isUndoRedoAction: true,
            preventEventTrigger: true
        });

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());

        if (!isUndoRedoAction) {
            this.parent.undoRedoAction.pushActionIntoUndoStack({
                action: actionType.multipleBlocksDeleted,
                data: {
                    deletedBlocks: selectedClones,
                    deletionType: DeletionType.Partial,
                    direction: direction,
                    firstBlockIndex: firstBlockIndex,
                    cursorBlockId: prevFocusedBlockid
                }
            });
        }

        return true;
    }

    private populateTargetModelAndId(args: IAddBlockInteraction): void {
        if (!args.targetBlockId && args.targetBlock) {
            args.targetBlockId = args.targetBlock.id;
        }
        if (!args.targetBlock && args.targetBlockId) {
            args.targetBlock = this.parent.getBlockElementById(args.targetBlockId);
        }
        args.targetBlockModel = args.targetBlockId
            ? getBlockModelById(args.targetBlockId, this.parent.getEditorBlocks())
            : null;
    }

    /**
     * Handles block transformation, converting one block type to another
     *
     * @param {string} newBlockType - The new block type to transform to
     * @param {BlockProperties} props - Optional properties for the new block type
     * @returns {void}
     * @hidden
     */
    public transformBlocksForSelection(newBlockType: string, props?: BlockProperties): void {
        const range: Range = getSelectedRange();
        const currentRangeLength: number = range.toString().length;
        const blocksToTransform: BlockModel[] = this.resolveBlocksToTransform();
        const ignoredTypes: string[] = [BlockType.Callout, BlockType.Image, BlockType.Divider, BlockType.Code];
        if (currentRangeLength > 0){
            this.parent.nodeSelection.saveSelection();
        }

        // Begin batch mode for multiple block transformations
        if (blocksToTransform.length > 1) {
            this.parent.undoRedoAction.beginBatchTransform();
        }

        for (const block of blocksToTransform) {
            const isIgnored: boolean = ignoredTypes.indexOf(block.blockType) !== -1;
            const blockEl: HTMLElement = this.parent.getBlockElementById(block.id);
            if (isIgnored) { continue; }

            const model: BlockModel = getBlockModelById(block.id, this.parent.getEditorBlocks());
            this.handleBlockTransformation({
                block: model,
                blockElement: blockEl,
                newBlockType: newBlockType,
                props
            });
        }

        // End batch mode for multiple block transformations
        if (blocksToTransform.length > 1) {
            this.parent.undoRedoAction.endBatchTransform();
        }
        if (currentRangeLength > 0){
            this.parent.nodeSelection.restoreSelection();
        }
    }

    private resolveBlocksToTransform(): BlockModel[] {
        const selectedBlocks: BlockModel[] = this.parent.editorMethods.getSelectedBlocks();
        const range: Range = getSelectedRange();

        if (selectedBlocks && selectedBlocks.length > 0) {
            return this.expandSelectedBlocks(selectedBlocks);
        }

        if ((!range) && (!selectedBlocks || selectedBlocks.length === 0)) {
            const cellBlocks: BlockModel[] = this.getSelectedCellBlocksFromTable();
            if (cellBlocks && cellBlocks.length > 0) {
                return cellBlocks;
            }
        }

        // Fallback: if no selection or range, use the currently focused block
        if (this.parent.currentFocusedBlock) {
            const focusedBlockModel: BlockModel = getBlockModelById(
                this.parent.currentFocusedBlock.id,
                this.parent.getEditorBlocks()
            );
            if (focusedBlockModel) {
                return [focusedBlockModel];
            }
        }

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

    private getSelectedCellBlocksFromTable(): BlockModel[] {
        const tableCtx: TableContext = this.parent.blockRenderer.tableRenderer.resolveTableContext();
        if (tableCtx && tableCtx.tableBlockEl) {
            return this.parent.tableSelectionManager.getSelectedCellBlocks(tableCtx.tableBlockEl);
        }
        return [];
    }

    public handleBlockTransformation(args: ITransformBlockInteraction): void {
        const { block, blockElement, newBlockType, isUndoRedoAction } = args;
        const rangePath: RangePath = this.parent.nodeSelection.getStoredBackupRange();
        this.parent.mentionAction.cleanMentionArtifacts(blockElement, true);
        this.parent.mentionAction.removeMentionQueryKeysFromModel('/', args.isUndoRedoAction);
        const nestedTypes: Set<string> = new Set<string>([BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading,
            BlockType.Callout, BlockType.Quote, BlockType.Table]);
        const specialTypes: Set<string> = new Set<string>([BlockType.Divider , BlockType.Code, BlockType.Image]);
        const nestedSelectors: string = `.${constants.CALLOUT_BLOCK_CLS}, .${constants.TOGGLE_BLOCK_CLS}, .${constants.QUOTE_BLOCK_CLS}`;
        const closestParentEle: HTMLElement = blockElement.closest(nestedSelectors) as HTMLElement;
        let transformedElement: HTMLElement = blockElement;
        const doesBlockHasContent: boolean = blockElement.textContent.length > 0;
        let nextSiblingOfTransformedEle: HTMLElement;
        const isSpecialType: boolean = specialTypes.has(newBlockType) || specialTypes.has(block.blockType);
        const isNestedType: boolean = nestedTypes.has(newBlockType) || nestedTypes.has(block.blockType);

        // Proceed to add new block rather than transforming current block for below conditions
        if ((isSpecialType || isNestedType) && (doesBlockHasContent || (isNestedType && closestParentEle))) {
            const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
                blockID: isUndoRedoAction ? block.id : '',
                targetBlock: isNestedType ? closestParentEle || blockElement : blockElement,
                blockType: newBlockType,
                properties: args.props,
                preventEventTrigger: true,
                forceIgnoreTargetUpdate: true,
                isUndoRedoAction: isUndoRedoAction
            });
            // Delete the special block dom after adding a block of it's older type
            if (isUndoRedoAction) {
                this.deleteBlock({ blockElement, isUndoRedoAction: true });
            }
            transformedElement = this.parent.getBlockElementById(addedBlock.id);
        } else {
            cleanCheckmarkElement(blockElement);
            transformedElement = this.transformBlock({
                block: block,
                blockElement: blockElement,
                newBlockType: newBlockType,
                isUndoRedoAction: isUndoRedoAction,
                props: args.props,
                preventEventTrigger: true,
                oldBlockModel: args.oldBlockModel
            });
        }

        // Add a new paragraph block after the transformed block if it is a special type block.
        if ((isSpecialType || isNestedType) && !isUndoRedoAction) {
            const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
                targetBlock: transformedElement,
                blockType: BlockType.Paragraph,
                preventUIUpdate: true,
                preventEventTrigger: true,
                forceIgnoreTargetUpdate: true
            });
            nextSiblingOfTransformedEle = this.parent.getBlockElementById(addedBlock.id);
        }
        const contentElement: HTMLElement = getBlockContentElement(transformedElement);

        this.parent.togglePlaceholder(transformedElement, true);

        if (transformedElement.getAttribute('data-block-type') === BlockType.Callout ||
            transformedElement.getAttribute('data-block-type') === BlockType.Quote) {
            this.parent.setFocusToBlock(transformedElement.querySelector('.' + constants.BLOCK_CLS));
        }
        else {
            this.parent.setFocusToBlock(transformedElement);
        }

        if (rangePath && rangePath.endContainer && contentElement) {
            setCursorPosition(contentElement, getAbsoluteOffset(contentElement, rangePath.endContainer, rangePath.endOffset));
        }

        this.parent.listPlugin.recalculateMarkersForListItems();
        this.parent.floatingIconAction.showFloatingIcons(transformedElement);

        if ((newBlockType === BlockType.Divider || newBlockType === BlockType.Image) && nextSiblingOfTransformedEle) {
            this.parent.setFocusAndUIForNewBlock(nextSiblingOfTransformedEle);
        }
        else if (newBlockType === 'Table') {
            const firstCell: HTMLElement = transformedElement.querySelector('tbody td:not(.e-row-number)');
            this.parent.tableService.addCellFocus(firstCell, true);
        }

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    /**
     * Transforms an existing block into a different type
     *
     * @param {ITransformBlockInteraction} args options for transforming block
     * @returns {HTMLElement} - The transformed block element
     * @hidden
     */
    public transformBlock(args: ITransformBlockInteraction): HTMLElement {
        this.parent.previousSelection = captureSelectionState();
        const { newBlockType, isUndoRedoAction, props, shouldPreventUpdates, preventEventTrigger } = args;
        let { block } = args;
        const oldBlockClone: BlockModel = decoupleReference(block);

        let blockModel: BlockModel = oldBlockClone;
        if (isUndoRedoAction) {
            const isOldBlockTypeNonMergable: boolean = isNonMergableBlock(args.blockElement);
            blockModel = isOldBlockTypeNonMergable ? args.oldBlockModel : oldBlockClone;
        }
        block.blockType = newBlockType;
        block.properties = props || {};

        block = this.parent.blockService.updateBlock(
            block.id,
            BlockFactory.createBlockFromPartial({
                ...blockModel,
                blockType: newBlockType,
                properties: props || {}
            })
        );
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', { type: 'TransformBlock', state: {
            block, shouldPreventUpdates, oldBlockClone, isUndoRedoAction, preventEventTrigger
        }});

        const newBlockElement: HTMLElement = this.parent.getBlockElementById(block.id);

        if (!shouldPreventUpdates) {
            this.parent.setFocusAndUIForNewBlock(newBlockElement);
            this.parent.undoRedoAction.trackBlockTransformForUndoRedo(newBlockElement, block, oldBlockClone, isUndoRedoAction);
        }
        else {
            this.parent.togglePlaceholder(newBlockElement, false);
        }

        return newBlockElement;
    }

    /**
     * Transforms a block to normal paragraph block.
     *
     * @param {HTMLElement} blockElement - The block element to render the content into.
     * @param {BlockModel} blockModel - The block model to render.
     * @returns {void}
     * @hidden
     */
    public transformBlockToParagraph(blockElement: HTMLElement, blockModel: BlockModel): void {
        this.parent.floatingIconAction.showFloatingIcons(this.transformBlock({
            block: blockModel,
            blockElement: blockElement,
            newBlockType: BlockType.Paragraph
        }));
    }

    /**
     * Creates a default empty block
     *
     * @param {boolean} shouldUpdateDom Whether to update the DOM
     * @param {string} blockId Optional block ID to use
     * @returns {BlockModel} The created block model or null
     * @hidden
     */
    public createDefaultEmptyBlock(shouldUpdateDom?: boolean, blockId?: string): BlockModel {
        if (this.parent.getEditorBlocks().length === 0) {
            const newBlock: BlockModel = this.prepareBlock({
                blockID: blockId,
                blockType: BlockType.Paragraph,
                contentModel: [BlockFactory.createTextContent()]
            });

            this.parent.setEditorBlocks([newBlock]);
            this.parent.stateManager.updateManagerBlocks();

            if (shouldUpdateDom) {
                this.parent.observer.notify('modelChanged', { type: 'DefaultEmptyBlock' });
            }

            return this.parent.getEditorBlocks()[0];
        }

        return null;
    }


    /**
     * Creates content models from a document fragment
     *
     * @param {DocumentFragment} fragment The document fragment
     * @returns {ContentModel[]} Array of content models
     * @hidden
     */
    public getContentModelForFragment(
        fragment: DocumentFragment
    ): ContentModel[] {
        const tempContainer: HTMLElement = document.createElement('div');

        Array.from(fragment.childNodes).forEach((node: Node) => {
            tempContainer.appendChild(node.cloneNode(true));
        });

        const newContents: ContentModel[] = convertInlineElementsToContentModels(tempContainer, true);

        return newContents;
    }

    /**
     * Generates new IDs for the block and its content.
     *
     * @param {string} destinationBlockId The ID of the destination block.
     * @returns {IToBlockData | null} The destination block data or null if not found.
     * @hidden
     */
    public getDestinationBlockDataForMove(destinationBlockId: string): IToBlockData | null {
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const toBlockModel: BlockModel = getBlockModelById(destinationBlockId, editorBlocks);
        const toBlockIndex: number = getBlockIndexById(destinationBlockId, editorBlocks);
        const toParentBlockModel: BlockModel = getBlockModelById(toBlockModel.parentId, editorBlocks);
        const toParentBlockIndex: number = toParentBlockModel ? getBlockIndexById(toParentBlockModel.id, editorBlocks) : -1;

        return { toBlockModel, toParentBlockModel, toBlockIndex, toParentBlockIndex };
    }

    /**
     * Creates a new block model based on provided arguments
     *
     * @param {IAddBlockInteraction} args - Options for creating the block
     * @returns {BlockModel} - The new block model
     * @hidden
     */
    private prepareBlock(args: IAddBlockInteraction): BlockModel {
        const { block, targetBlockModel, blockID, blockType, contentModel, properties }: IAddBlockInteraction = args;

        if (!block) {
            return BlockFactory.createBlockFromPartial({
                id: blockID || generateUniqueId(constants.BLOCK_ID_PREFIX),
                parentId: targetBlockModel ? targetBlockModel.parentId : '',
                blockType: (blockType || BlockType.Paragraph) as BlockType,
                content: (contentModel && contentModel.length > 0) ? contentModel : [BlockFactory.createTextContent()],
                indent: targetBlockModel ? targetBlockModel.indent : 0,
                properties: properties || {}
            });
        }
        if (!args.isUndoRedoAction) {
            this.parent.stateManager.populateUniqueIds([block]);
        }

        return block;
    }

    public transformToggleBlocksAsRegular(blockElement: HTMLElement): void {
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const block: BlockModel = getBlockModelById(blockElement.id, editorBlocks);

        if (!block || !block.blockType.startsWith('Collapsible')) { return; }

        const headerContentElement: HTMLElement = blockElement.querySelector('.e-toggle-header .e-block-content') as HTMLElement;
        const toggleContentElement: HTMLElement = blockElement.querySelector('.' + constants.TOGGLE_CONTENT_CLS) as HTMLElement;
        const childBlockElements: NodeListOf<HTMLElement> = toggleContentElement.querySelectorAll('.' + constants.BLOCK_CLS) as NodeListOf<HTMLElement>;

        const newType: string = block.blockType.replace(/^Collapsible/, '');
        const children: BlockModel[] = (block.properties as BaseChildrenProp).children;
        block.blockType = newType as BlockType;
        children.forEach((childBlock: BlockModel) => {
            if (childBlock) {
                childBlock.parentId = '';
            }
        });

        editorBlocks.splice(getBlockIndexById(blockElement.id, editorBlocks) + 1, 0, ...children);
        (block.properties as BaseChildrenProp).children = [];

        blockElement.classList.remove('e-toggle-block');
        blockElement.setAttribute('data-block-type', newType);
        blockElement.removeAttribute('data-collapsed');

        const cloneMainBlock: HTMLElement = blockElement.cloneNode(false) as HTMLElement;
        cloneMainBlock.appendChild(headerContentElement);
        blockElement.insertAdjacentElement('afterend', cloneMainBlock);

        childBlockElements.forEach((childBlockElement: HTMLElement) => {
            cloneMainBlock.insertAdjacentElement('afterend', childBlockElement);
        });

        detach(blockElement);
        setCursorPosition(cloneMainBlock, 0);
        this.parent.setFocusToBlock(cloneMainBlock);
        this.parent.stateManager.updateManagerBlocks();
    }

    public destroy(): void {
        this.removeEventListener();
    }
}
