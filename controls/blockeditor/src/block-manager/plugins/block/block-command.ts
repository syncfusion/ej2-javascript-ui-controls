import { isNullOrUndefined as isNOU, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, BlockProperties, ContentModel } from '../../../models/index';
import { IAddBlockInteraction, IAddBulkBlocksInteraction, IDeleteBlockInteraction, IToBlockData, IFromBlockData, IIndentOperation, IMoveBlocksInteraction, ISplitContentData, ITransformBlockInteraction, RangePath } from '../../../common/interface';
import { getBlockModelById, getBlockIndexById, getBlockContentElement, isListTypeBlock, isDividerBlock, getClosestContentElementInDocument, getContentElementBasedOnId, cleanCheckmarkElement } from '../../../common/utils/block';
import { generateUniqueId, decoupleReference, sanitizeBlock, sanitizeContent, setCursorPosition, sanitizeContents, getSelectedRange, getAbsoluteOffset, captureSelectionState, extractBlockTypeFromElement } from '../../../common/utils/index';
import * as constants from '../../../common/constant';
import { actionType, events } from '../../../common/constant';
import { BlockType } from '../../../models/enums';
import { DeletionType } from '../../../common/enums';
import { BlockFactory } from '../../services/index';
import { BlockManager } from '../../base/block-manager';
import { clearBreakTags, findClosestParent } from '../../../common/utils/dom';
import { NodeCutter } from '../common/node';


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
        const { block, contentElement, contentModel, isAfter = true }: IAddBlockInteraction = args;
        if (!args.targetBlockId && args.targetBlock) {
            args.targetBlockId = args.targetBlock.id;
        }
        if (!args.targetBlock && args.targetBlockId) {
            args.targetBlock = this.parent.getBlockElementById(args.targetBlockId);
        }
        args.targetBlockModel = args.targetBlockId
            ? getBlockModelById(args.targetBlockId, this.parent.getEditorBlocks())
            : null;

        /* Process Model */
        const addedBlock: BlockModel = this.parent.blockService.addBlock({
            block: this.prepareBlock(args),
            targetBlockId: args.targetBlockId,
            isAfter: isAfter
        });

        this.parent.stateManager.updateManagerBlocks();

        if (!block && (!contentModel || contentModel.length === 0)) {
            this.parent.stateManager.updateContentModelBasedOnDOM(contentElement, addedBlock);
        }

        this.parent.undoRedoAction.trackBlockAdditionForUndoRedo(args, addedBlock);

        this.parent.observer.notify('modelChanged', {
            type: 'AddBlock',
            state: {
                ...args,
                isAfter,
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
        this.parent.blockCommand.createDefaultEmptyBlock(true);
    }

    /**
     * Splits the current block at cursor position and creates a new block
     *
     * @param {IAddBlockInteraction} args - Options to split the block
     * @returns {void}
     * @hidden
     */
    public splitBlock(args?: IAddBlockInteraction): void {
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        const range: Range = this.parent.nodeSelection.getRange();
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const blockBeforeSplit: BlockModel = decoupleReference(sanitizeBlock(blockModel));
        const currBlockType: BlockType | string = blockModel.blockType;
        const currBlkProps: BlockProperties = blockModel.properties;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        const splitContent: ISplitContentData = NodeCutter.splitContent(
            getBlockContentElement(blockElement), range.startContainer, range.startOffset
        );
        const isTextNode: boolean = isNOU(splitContent.beforeFragment.lastChild) ||
            (splitContent.beforeFragment.lastChild.nodeType === Node.TEXT_NODE);
        const lastChild: HTMLElement = isTextNode ? contentElement : splitContent.beforeFragment.lastChild as HTMLElement;
        const isIgnoredTypes: string[] = [BlockType.Callout, BlockType.CollapsibleHeading, BlockType.CollapsibleParagraph];
        const isIgnored: boolean = isIgnoredTypes.indexOf(currBlockType) !== -1;

        const afterBlockContents: ContentModel[] = this.getContentModelForFragment(splitContent.afterFragment, blockModel, lastChild);
        let currBlockContents: ContentModel[] = [];

        if (splitContent.beforeFragment.textContent !== '') {
            currBlockContents = this.getContentModelForFragment(splitContent.beforeFragment, blockModel, null);
            if (splitContent.beforeFragment.childNodes && splitContent.beforeFragment.childNodes[0].nodeType === Node.TEXT_NODE) {
                currBlockContents[0].id = contentElement.id;
            }
        }
        else {
            currBlockContents.push(BlockFactory.createTextContent());
        }

        if (!isIgnored) {
            this.parent.blockService.updateContent(blockModel.id, currBlockContents);
        }

        if (!isIgnored && splitContent.splitOffset === 0) {
            this.transformBlock({
                block: blockModel,
                blockElement: blockElement,
                newBlockType: BlockType.Paragraph,
                shouldPreventUpdates: true,
                preventEventTrigger: true
            });
        }

        this.addBlock({
            blockType: (isListTypeBlock(currBlockType) || (!isIgnored && splitContent.splitOffset === 0))
                ? currBlockType : BlockType.Paragraph,
            properties: (!isIgnored && splitContent.splitOffset === 0) ? currBlkProps : {},
            targetBlock: this.parent.getBlockElementById(blockElement.id),
            contentElement: splitContent.afterFragment,
            contentModel: afterBlockContents,
            splitOffset: splitContent.splitOffset,
            isSplitting: true,
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
        const childTypes: string[] = [BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading,
            BlockType.Callout, BlockType.Table];
        const isChildrenBlock: boolean = (childTypes.indexOf(extractBlockTypeFromElement(blockElement.closest('.e-block') as HTMLElement)) !== -1)
            || !isNullOrUndefined(blockElement.closest('.' + constants.TABLE_BLOCK_CLS));

        if (isDividerBlock(blockElement) || (!isChildrenBlock && editorBlocks.length === 1)) {
            const adjacentBlockElement: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            const isDivider: boolean = isDividerBlock(blockElement);

            /* When there is only single block in editor, on deletion of it, we should create a default empty paragraph */
            this.deleteBlock({ ...args, blockElement: blockElement });
            this.createDefaultEmptyBlock(true);

            if (isDivider && !isNOU(adjacentBlockElement)) {
                const adjacentContent: HTMLElement = getBlockContentElement(adjacentBlockElement);
                if (adjacentContent.innerHTML === '<br>') {
                    clearBreakTags(adjacentBlockElement);
                }
                this.parent.setFocusToBlock(adjacentBlockElement);
                this.parent.togglePlaceholder(adjacentBlockElement, true);
                setCursorPosition(adjacentContent, 0);
                this.parent.floatingIconAction.showFloatingIcons(adjacentBlockElement);
            }
            return;
        }

        if (blockElement.getAttribute('data-block-type').startsWith('Collapsible')) {
            this.transformToggleBlocksAsRegular(blockElement);
        }

        const getAdjacentBlock: (element: HTMLElement, direction: 'previous' | 'next') => HTMLElement | null =
            (element: HTMLElement, direction: 'previous' | 'next'): HTMLElement | null => {
                return (direction === 'previous' ? element.previousElementSibling : element.nextElementSibling) as HTMLElement;
            };

        const adjacentBlock: HTMLElement | null = getAdjacentBlock(blockElement, mergeDirection);
        if (!adjacentBlock) { return; }
        const adjacentBlockModel: BlockModel = getBlockModelById(adjacentBlock.id, editorBlocks);
        /*
        sourceBlock - the block that will be deleted after merging its content with the targetBlock
        targetBlock - the block that will remain after merging
        */
        const sourceBlock: HTMLElement = mergeDirection === 'previous' ? blockElement : adjacentBlock;
        let targetBlock: HTMLElement = mergeDirection === 'previous' ? adjacentBlock : blockElement;
        const sourceBlockModel: BlockModel = getBlockModelById(sourceBlock.id, editorBlocks);
        const targetBlockModel: BlockModel = getBlockModelById(targetBlock.id, editorBlocks);
        const sourceContent: HTMLElement = getBlockContentElement(sourceBlock) as HTMLElement;
        let targetContent: HTMLElement = getBlockContentElement(targetBlock) as HTMLElement;
        const blocksBeforeDelete: BlockModel[] = [
            decoupleReference(sanitizeBlock(targetBlockModel)),
            decoupleReference(sanitizeBlock(sourceBlockModel))
        ];
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading,
            BlockType.Callout, BlockType.Table, BlockType.Code, BlockType.Image];

        if (!sourceContent || !targetContent || specialTypes.indexOf(adjacentBlockModel.blockType) !== -1) { return; }
        const newCursorPos: number = targetContent.textContent.length;
        const lastChildId: string = targetContent.childNodes.length > 0 ?
            (targetContent.lastChild.nodeType === Node.ELEMENT_NODE
                ? (targetContent.lastChild as HTMLElement).id : targetContent.id) : '';
        const lastChild: HTMLElement = (lastChildId !== '') ? targetBlock.querySelector('#' + lastChildId) : null;

        this.updateContentModelsForDeletion(sourceContent, targetContent, targetBlockModel, sourceBlockModel);

        if (newCursorPos === 0) {
            this.parent.blockService.replaceBlock(targetBlockModel.id, sourceBlockModel);
            this.parent.stateManager.updateManagerBlocks();
            targetBlock = this.parent.blockRenderer.createAndReplaceBlockElement(
                targetBlockModel.id, sourceBlockModel.id
            );
            targetContent = getBlockContentElement(targetBlock);
        }
        else {
            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: targetBlockModel, oldBlock: blocksBeforeDelete[0] } ],
                preventEventTrigger: true,
                preventChangesTracking: args.preventChangesTracking
            }});
        }

        this.parent.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, newCursorPos);
        this.parent.togglePlaceholder(targetBlock, true);
        this.parent.floatingIconAction.showFloatingIcons(targetBlock);

        this.deleteBlock({
            ...args,
            blockElement: sourceBlock,
            isSplitting: true,
            splitOffset: lastChild ? lastChild.textContent.length : 0,
            contentElement: sourceContent,
            blocksAfterSplit: blocksBeforeDelete,
            blockBeforeSplit: targetBlockModel,
            targetBlockModel: targetBlockModel,
            newCursorPos: newCursorPos
        });

        if (isListTypeBlock(sourceBlockModel.blockType) || isListTypeBlock(targetBlockModel.blockType)) {
            this.parent.listPlugin.recalculateMarkersForListItems();
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
            const oldBlock: BlockModel = decoupleReference(sanitizeBlock(getBlockModelById(blockId, this.parent.getEditorBlocks())));
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
        if (!destination) { return; }

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
            const decoupledBlock: BlockModel = decoupleReference(sanitizeBlock(block));
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
        const selectedClones: BlockModel[] = selectedBlocks.map((block: BlockModel) => decoupleReference(sanitizeBlock(block)));
        const firstBlock: BlockModel = selectedBlocks[0];
        const firstBlockIndex: number = getBlockIndexById(firstBlock.id, this.parent.getEditorBlocks());
        const lastBlock: BlockModel = selectedBlocks[selectedBlocks.length - 1];
        const firstBlockElement: HTMLElement = this.parent.getBlockElementById(firstBlock.id);
        const lastBlockElement: HTMLElement = this.parent.getBlockElementById(lastBlock.id);
        const range: Range = getSelectedRange();

        if (!range || !firstBlockElement || !lastBlockElement) { return false; }

        /* First Block */
        const firstBlockContent: HTMLElement = getBlockContentElement(firstBlockElement);
        const firstSplit: ISplitContentData = NodeCutter.splitContent(
            firstBlockContent, range.startContainer, range.startOffset
        );
        this.updateAndCleanContentModels(firstBlock, firstSplit, 'keepBefore');
        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: firstBlock, oldBlock: selectedClones[0] } ],
            preventEventTrigger: true
        }});

        /* Middle blocks */
        for (let i: number = 1; i < selectedBlocks.length - 1; i++) {
            this.parent.execCommand({ command: 'DeleteBlock', state: {
                blockElement: this.parent.getBlockElementById(selectedBlocks[parseInt(i.toString(), 10)].id),
                isUndoRedoAction: true,
                preventEventTrigger: true
            }});
        }

        /* Last Block */
        const lastBlockContent: HTMLElement = getBlockContentElement(lastBlockElement);
        const lastSplit: ISplitContentData = NodeCutter.splitContent(lastBlockContent, range.endContainer, range.endOffset);
        this.updateAndCleanContentModels(lastBlock, lastSplit, 'keepAfter');
        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: lastBlock, oldBlock: selectedClones[selectedClones.length - 1] } ],
            preventEventTrigger: true,
            preventChangesTracking: true
        }});

        /* Merge Last with First */
        this.deleteBlockAtCursor({
            blockElement: direction === 'previous' ? lastBlockElement : firstBlockElement,
            mergeDirection: direction,
            isUndoRedoAction: true,
            preventEventTrigger: true,
            preventChangesTracking: true
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

    private updateAndCleanContentModels(
        block: BlockModel,
        splitContent: ISplitContentData,
        mode: 'keepBefore' | 'keepAfter'
    ): void {
        const newContentModels: ContentModel[] = [];
        const beforeFragmentNodes: ChildNode[] = Array.from(splitContent.beforeFragment.childNodes);
        const afterFragmentNodes: ChildNode[] = Array.from(splitContent.afterFragment.childNodes);
        const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);

        const range: Range = getSelectedRange();
        const splitNode: Node = mode === 'keepBefore' ? range.startContainer : range.endContainer;
        const splitOffset: number = mode === 'keepBefore' ? range.startOffset : range.endOffset;
        const contentElementOfSplitNode: HTMLElement = getClosestContentElementInDocument(splitNode);
        const isContentFoundInCollection: (element: Node, collection: ChildNode[]) => boolean =
            (element: Node, collection: ChildNode[]) => {
                return collection.some((node: Node) => {
                    return (node.contains(element) || node === element || (node as HTMLElement).id === (element as HTMLElement).id);
                });
            };

        block.content.forEach((content: ContentModel) => {
            let isSplitted: boolean = false;
            const contentEl: HTMLElement = getContentElementBasedOnId(content.id, blockElement);

            const isCurrentContentIntersectsNode: boolean = range.intersectsNode(contentEl);
            const isCurrentContentFoundInAfterNodes: boolean = isContentFoundInCollection(contentEl, afterFragmentNodes);
            if (mode === 'keepBefore' && isCurrentContentFoundInAfterNodes && isCurrentContentIntersectsNode) {
                return;
            }
            if (contentEl === contentElementOfSplitNode) {
                content.content = mode === 'keepBefore'
                    ? splitNode.textContent.substring(0, splitOffset)
                    : (splitNode.textContent.substring(splitOffset) || '');
                if (mode === 'keepAfter') {
                    content.id = afterFragmentNodes.length && (afterFragmentNodes[0].nodeType === Node.ELEMENT_NODE
                        ? (afterFragmentNodes[0] as HTMLElement).id : content.id);
                }
                isSplitted = true;
            }
            const isCurrentContentFoundInBeforeNodes: boolean = isContentFoundInCollection(contentEl, beforeFragmentNodes);
            if (!isSplitted && mode === 'keepAfter' && isCurrentContentFoundInBeforeNodes && isCurrentContentIntersectsNode) {
                return;
            }
            if (content.content.trim()) {
                newContentModels.push(content);
            }
        });

        this.parent.blockService.updateContent(block.id, newContentModels);
    }

    /**
     * Handles block transformation, converting one block type to another
     *
     * @param {ITransformBlockInteraction} args - Arguments for block transformation
     * @returns {void}
     * @hidden
     */
    public handleBlockTransformation(args: ITransformBlockInteraction): void {
        const { block, blockElement, newBlockType, isUndoRedoAction } = args;
        const rangePath: RangePath = this.parent.nodeSelection.getStoredBackupRange();
        this.parent.mentionAction.cleanMentionArtifacts(blockElement, true);
        this.parent.mentionAction.removeMentionQueryKeysFromModel('/', args.isUndoRedoAction);
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading,
            BlockType.Callout, BlockType.Table, BlockType.Code];
        const isClosestCallout: HTMLElement = findClosestParent(blockElement, '.' + constants.CALLOUT_BLOCK_CLS);
        const isClosestToggle: HTMLElement = findClosestParent(blockElement, '.' + constants.TOGGLE_BLOCK_CLS);
        let transformedElement: HTMLElement = blockElement;
        const isSpecialType: boolean = (specialTypes.indexOf(newBlockType) > -1) || (specialTypes.indexOf(block.blockType) > -1);
        const isBlockNotEmpty: boolean = blockElement.textContent.length > 0;
        let nextSiblingOfTransformedEle: HTMLElement;

        // Proceed to add new block rather than transforming current block for below conditions
        if (isSpecialType && (isBlockNotEmpty || (isClosestCallout || isClosestToggle))) {
            const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
                targetBlock: isClosestCallout || isClosestToggle || blockElement,
                blockType: newBlockType,
                properties: args.props,
                preventEventTrigger: true,
                forceIgnoreTargetUpdate: true
            });
            transformedElement = this.parent.getBlockElementById(addedBlock.id);
        } else {
            cleanCheckmarkElement(blockElement);
            transformedElement = this.transformBlock({
                block: block,
                blockElement: blockElement,
                newBlockType: newBlockType,
                isUndoRedoAction: isUndoRedoAction,
                props: args.props,
                preventEventTrigger: true
            });
        }

        // Add a new paragraph block after the transformed block if it is a special type block.
        if (isSpecialType && !isUndoRedoAction) {
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

        if (transformedElement.getAttribute('data-block-type') === BlockType.Callout) {
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

        if (newBlockType === BlockType.Divider && nextSiblingOfTransformedEle) {
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
        const oldBlockClone: BlockModel = decoupleReference(sanitizeBlock(block));

        block.blockType = newBlockType;
        block.properties = props || {};

        block = this.parent.blockService.updateBlock(block.id, BlockFactory.createBlockFromPartial({
            ...oldBlockClone,
            blockType: newBlockType,
            properties: props || {}
        }));
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
     * @param {BlockModel} blockModel The block model
     * @param {Node} referenceNode Reference node
     * @returns {ContentModel[]} Array of content models
     * @hidden
     */
    public getContentModelForFragment(
        fragment: DocumentFragment,
        blockModel: BlockModel,
        referenceNode: Node
    ): ContentModel[] {
        const newContents: ContentModel[] = [];

        fragment.childNodes.forEach((node: Node) => {
            if (node.nodeType === Node.ELEMENT_NODE && (node instanceof HTMLElement)) {
                const content: ContentModel = blockModel.content.find((content: ContentModel) => content.id === node.id);
                if (content) {
                    content.content = node.textContent;
                    newContents.push(content);
                } else {
                    /*
                    On Enter in middle of a formatted element, we clone the previous model,
                    and reuse it to preserve formatting (e.g., split '<strong>Hello</strong>' into 'He' and 'llo').
                    */
                    const previousContent: ContentModel = blockModel.content.find((content: ContentModel) => {
                        return content.id === (referenceNode as HTMLElement).id;
                    });
                    const newContent: ContentModel = decoupleReference(sanitizeContent(previousContent)) as ContentModel;
                    newContent.id = node.id;
                    newContent.content = node.textContent;
                    newContents.push(newContent);
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                newContents.push(BlockFactory.createTextContent({ content: node.textContent }));
            }
        });

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

        if (toBlockIndex < 0) { return null; }

        const toParentBlockModel: BlockModel = getBlockModelById(toBlockModel.parentId, editorBlocks);
        const toParentBlockIndex: number = toParentBlockModel ? getBlockIndexById(toParentBlockModel.id, editorBlocks) : -1;

        return { toBlockModel, toParentBlockModel, toBlockIndex, toParentBlockIndex };
    }

    private updateContentModelsForDeletion(
        sourceContent: HTMLElement,
        targetContent: HTMLElement,
        targetBlockModel: BlockModel,
        sourceBlockModel: BlockModel
    ): void {
        const mergedContent: ContentModel[] = [];

        const targetHasSingleTextNode: boolean = targetContent.textContent.length === 0 || (targetContent.childNodes.length === 1 &&
            targetContent.firstChild.nodeType === Node.TEXT_NODE);
        const sourceHasSingleTextNode: boolean = sourceContent.textContent.length === 0 || (sourceContent.childNodes.length === 1 &&
            sourceContent.firstChild.nodeType === Node.TEXT_NODE);
        const clonedTargetContent: ContentModel[] = decoupleReference(sanitizeContents(targetBlockModel.content));
        const clonedSourceContent: ContentModel[] = decoupleReference(sanitizeContents(sourceBlockModel.content));

        if (targetHasSingleTextNode && sourceHasSingleTextNode) {
            // Case: Both blocks had plain text nodes → merge source content's text and target content's text
            if (sourceBlockModel.content.length === 0) {
                mergedContent.push(...clonedTargetContent);
            } else if (targetBlockModel.content.length === 0) {
                mergedContent.push(...clonedSourceContent);
            } else if (targetBlockModel.content.length > 0 && sourceBlockModel.content.length > 0) {
                const t: ContentModel = targetBlockModel.content[0];
                const s: ContentModel = sourceBlockModel.content[0];
                mergedContent.push(BlockFactory.createTextContent({
                    id: t.id,
                    content: (t.content) + (s.content)
                }));
            }
        } else if ((!targetHasSingleTextNode && sourceHasSingleTextNode)) {
            // Case: Target has formatted, source has plain text → just append the target content
            mergedContent.push(...clonedTargetContent);
            const source: ContentModel = sourceBlockModel.content[0];
            if (source && source.content !== '') {
                mergedContent.push(BlockFactory.createTextContent({
                    id: source.id,
                    content: source.content
                }));
            }
        } else if ((targetHasSingleTextNode && !sourceHasSingleTextNode)) {
            const target: ContentModel = targetBlockModel.content[0];
            if (target && target.content !== '') {
                mergedContent.push(BlockFactory.createTextContent({
                    id: target.id,
                    content: target.content
                }));
            }
            // Case: Source has formatted, Target has plain text → just append the source content
            mergedContent.push(...clonedSourceContent);
        }
        else {
            // Case: All other cases → merge both content arrays
            mergedContent.push(...clonedTargetContent, ...clonedSourceContent);
        }
        this.parent.blockService.updateContent(targetBlockModel.id, mergedContent);
        this.parent.stateManager.updateManagerBlocks();
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
                content: contentModel || [],
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
