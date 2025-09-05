import { isNullOrUndefined as isNOU, detach } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { BaseChildrenProp, BlockModel, ContentModel } from '../models/index';
import { IAddBlockInteraction, IAddBulkBlocksInteraction, IDeleteBlockInteraction, IToBlockData, IFromBlockData, IIndentOperation, IMoveBlocksInteraction, ISplitContentData } from '../base/interface';
import { getBlockModelById, getBlockIndexById, getBlockContentElement, isListTypeBlock, isDividerBlock, getClosestContentElementInDocument, getContentElementBasedOnId } from '../utils/block';
import { generateUniqueId, isolateModel, getDeepestTextNode } from '../utils/common';
import { sanitizeBlock, sanitizeContent, sanitizeContents } from '../utils/transform';
import { getSelectedRange, setCursorPosition } from '../utils/selection';
import { clearBreakTags } from '../utils/dom';
import { actionType } from '../base/constant';
import * as constants from '../base/constant';
import { BlockType, DeletionType } from '../base/enums';
import { BlockFactory } from '../services/index';

/**
 * Manages all block-related commands in the BlockEditor
 */
export class BlockCommandManager {

    private editor: BlockEditor
    /**
     * Creates a new BlockCommandManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     */
    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Adds a new block to the editor
     *
     * @param {IAddBlockInteraction} args Options for adding new block
     * @returns {HTMLElement} The newly created block element
     * @hidden
     */
    addNewBlock(args: IAddBlockInteraction): HTMLElement {
        const { block, contentElement, contentModel, preventUIUpdate, isAfter = true }: IAddBlockInteraction = args;

        if (!args.targetBlockId && args.targetBlock) {
            args.targetBlockId = args.targetBlock.id;
        }
        if (!args.targetBlock && args.targetBlockId) {
            args.targetBlock = this.editor.getBlockElementById(args.targetBlockId);
        }
        args.targetBlockModel = args.targetBlockId
            ? getBlockModelById(args.targetBlockId, this.editor.getEditorBlocks())
            : null;

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        const addedBlock: BlockModel = this.editor.blockService.addBlock({
            block: this.prepareBlock(args),
            targetBlockId: args.targetBlockId,
            isAfter: isAfter
        });

        this.editor.isProtectedOnChange = prevOnChange;

        this.editor.stateManager.updatePropChangesToModel();

        if (!block && (!contentModel || contentModel.length === 0)) {
            this.editor.stateManager.updateContentModelBasedOnDOM(contentElement, addedBlock);
        }

        /* Process DOM */
        const blockElement: HTMLElement = this.editor.blockRendererManager.createBlockElement(addedBlock, contentElement);

        this.editor.blockRendererManager.insertBlockElementInDOM(blockElement, args.targetBlock, isAfter);

        if (!preventUIUpdate) {
            this.editor.blockRendererManager.setFocusAndUIForNewBlock(blockElement);
        }

        if (isListTypeBlock(addedBlock.type)) {
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }

        this.adjustViewForFocusedBlock();

        this.editor.undoRedoAction.trackBlockAdditionForUndoRedo(args, blockElement, addedBlock);
        this.editor.eventManager.triggerBlockAdditionEvent(addedBlock);
        return blockElement;
    }

    /**
     * Handles Clipboard paste of bulk blocks in to the editor
     *
     * @param {IAddBulkBlocksInteraction} args Options for the bulk block addition
     * @returns {void}
     * @hidden
     */
    addBulkBlocks(args: IAddBulkBlocksInteraction): void {
        const { blocks, targetBlockId, insertionType }: IAddBulkBlocksInteraction = args;
        if (blocks.length === 0) {
            return;
        }

        let newInsertedBlockElement: HTMLElement;
        for (let i: number = 0; i < blocks.length; i++) {
            newInsertedBlockElement = this.addNewBlock(
                {
                    block: blocks[i as number],
                    targetBlock: this.editor.getBlockElementById(i === 0 ? targetBlockId : newInsertedBlockElement.id),
                    isUndoRedoAction: true //Prevent undo redo push for each block insertion
                });
        }

        this.editor.listBlockAction.recalculateMarkersForListItems();
        this.editor.blockRendererManager.setCursorAfterBulkBlockAddition(insertionType);
        this.editor.undoRedoAction.trackClipboardPasteForUndoRedo(args);
    }

    /**
     * Deletes a block from the editor
     *
     * @param {IDeleteBlockInteraction} args Options for the deletion
     * @returns {void}
     * @hidden
     */
    deleteBlock(args: IDeleteBlockInteraction): void {
        if (!args.blockElement) { return; }

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        const { removedBlock, blockIndex }: { removedBlock: BlockModel, blockIndex: number } =
            this.editor.blockService.removeBlock({ blockId: args.blockElement.id });

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();

        if (!removedBlock) { return; }

        this.editor.undoRedoAction.trackBlockRemovalForUndoRedo(args, args.blockElement.id, removedBlock, blockIndex);
        detach(args.blockElement);
        this.editor.eventManager.triggerBlockRemovedEvent(removedBlock, blockIndex, !args.isMethod);
    }

    /**
     * Moves a block or group of blocks to a new position
     *
     * @param {IMoveBlocksInteraction} args Options for moving the block
     * @returns {void}
     * @hidden
     */
    moveBlock(args: IMoveBlocksInteraction): void {
        const { fromBlockIds = [], toBlockId, isInteracted = true } = args;
        if (fromBlockIds.length === 0 || !toBlockId) { return; }

        const toBlockElement: HTMLElement = this.editor.getBlockElementById(toBlockId);
        if (!toBlockElement) { return; }
        const allBlocks: HTMLElement[] = Array.from(this.editor.blockWrapper.children) as HTMLElement[];

        const fromElements: HTMLElement[] = fromBlockIds
            .map((id: string): Element | null => this.editor.getBlockElementById(id))
            .filter((el: Element | null): el is HTMLElement => el instanceof HTMLElement);

        const destination: IToBlockData = this.getDestinationBlockDataForMove(toBlockId);
        if (!destination) { return; }

        const toBlockDOM: HTMLElement = (destination.toParentBlockModel
            ? allBlocks[destination.toParentBlockIndex as number].querySelectorAll('.' + constants.BLOCK_CLS)[destination.toBlockIndex as number]
            : allBlocks[destination.toBlockIndex as number]) as HTMLElement;

        const isMovingUp: boolean = fromElements[0].getBoundingClientRect().top > toBlockDOM.getBoundingClientRect().top;

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        const movedBlocks: IFromBlockData[] = this.editor.blockService.moveBlocks({
            blockIds: fromBlockIds,
            toBlockId: toBlockId,
            isMovingUp: isMovingUp
        });

        this.editor.stateManager.updatePropChangesToModel();

        this.editor.isProtectedOnChange = prevOnChange;

        const parentElement: HTMLElement = this.getParentElementToInsert(destination, allBlocks);
        const targetToInsert: HTMLElement = (isMovingUp ? toBlockDOM : toBlockDOM.nextSibling) as HTMLElement;
        fromElements.forEach((el: HTMLElement) => {
            parentElement.insertBefore(el, targetToInsert);
        });

        this.editor.eventManager.triggerBlockMovedEvent(
            movedBlocks,
            destination.toParentBlockModel ? destination.toParentBlockModel.id : '',
            fromElements[0].id,
            isInteracted
        );

        this.editor.undoRedoAction.trackBlockMoveForUndoRedo(
            args,
            movedBlocks,
            destination.toBlockIndex,
            destination.toParentBlockModel ? destination.toParentBlockModel.id : '',
            isMovingUp
        );

        const selection: Selection = window.getSelection();
        if (selection) { selection.removeAllRanges(); }

        this.updateFocusAndCursor(fromElements.length > 0 ? fromElements[0] : null);
    }

    /**
     * Duplicates a block and inserts it above or below the original
     *
     * @param {HTMLElement} blockElement The block element to duplicate
     * @param {'below' | 'above'} direction The direction to insert the duplicated block
     * @returns {void}
     * @hidden
     */
    duplicateBlock(blockElement: HTMLElement, direction: 'below' | 'above' = 'below'): void {
        if (!blockElement) { return; }

        const duplicatedBlock: BlockModel = this.editor.blockService.duplicateBlock({ blockId: blockElement.id });

        if (duplicatedBlock) {
            this.editor.blockCommandManager.addNewBlock({
                block: duplicatedBlock,
                targetBlockId: blockElement.id,
                isAfter: direction === 'below'
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
    handleBlockIndentation(args: IIndentOperation): void {
        const { blockIDs, shouldDecrease }: IIndentOperation = args;
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        blockIDs.forEach((blockId: string) => {
            const updatedBlock: BlockModel = this.editor.blockService.applyIndentation({
                blockId: blockId,
                shouldDecrease: shouldDecrease
            });

            this.editor.blockRendererManager.updateBlockIndentAttribute(
                this.editor.getBlockElementById(blockId),
                updatedBlock.indent
            );

        });
        this.editor.isProtectedOnChange = prevOnChange;

        this.editor.listBlockAction.recalculateMarkersForListItems();
        this.editor.undoRedoAction.trackIndentActionForUndoRedo(args);
    }

    /**
     * Splits the current block at cursor position and creates a new block
     *
     * @param {IAddBlockInteraction} args Options for creating the new block
     * @returns {void}
     * @hidden
     */
    splitAndCreateNewBlockAtCursor(args?: IAddBlockInteraction): void {
        const blockElement: HTMLElement = (args && args.isUndoRedoAction) ? args.targetBlock : this.editor.currentFocusedBlock;
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        const contentElement: HTMLElement = getBlockContentElement(blockElement);

        const splitContent: ISplitContentData = this.splitBlockAtCursor(blockElement, args);
        const isTextNode: boolean = isNOU(splitContent.beforeFragment.lastChild) ||
            (splitContent.beforeFragment.lastChild.nodeType === Node.TEXT_NODE);
        const lastChild: HTMLElement = isTextNode ? contentElement : splitContent.beforeFragment.lastChild as HTMLElement;

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        const afterBlockContents: ContentModel[] = this.getContentModelForFragment(
            splitContent.afterFragment,
            blockModel,
            lastChild
        );

        contentElement.innerHTML = '';
        if (splitContent.beforeFragment.textContent !== '') {
            contentElement.appendChild(splitContent.beforeFragment);
        } else {
            this.editor.blockService.updateContent(blockModel.id, []);
        }
        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updateContentChangesToModel(blockElement, contentElement);

        if (isNOU(args)) {
            this.addNewBlock({
                blockType: isListTypeBlock(blockModel.type) ? blockModel.type : BlockType.Paragraph,
                targetBlock: blockElement,
                contentElement: splitContent.afterFragment,
                contentModel: afterBlockContents,
                splitOffset: splitContent.splitOffset,
                lastChild: lastChild
            });
        } else if (args.isUndoRedoAction) {
            this.addNewBlock({
                targetBlock: args.targetBlock,
                blockType: args.blockType,
                blockID: args.blockID,
                contentModel: args.contentModel,
                isUndoRedoAction: args.isUndoRedoAction,
                contentElement: args.contentElement
            });
        }
    }

    /**
     * Creates a default empty block
     *
     * @param {boolean} shouldUpdateDom Whether to update the DOM
     * @param {string} blockId Optional block ID to use
     * @returns {BlockModel} The created block model or null
     * @hidden
     */
    createDefaultEmptyBlock(shouldUpdateDom?: boolean, blockId?: string): BlockModel {
        if (this.editor.getEditorBlocks().length === 0) {
            const newBlock: BlockModel = this.prepareBlock({
                blockID: blockId,
                blockType: BlockType.Paragraph,
                contentModel: [BlockFactory.createTextContent()]
            });

            this.editor.setEditorBlocks([newBlock]);
            this.editor.stateManager.updatePropChangesToModel();

            if (shouldUpdateDom) {
                this.editor.blockRendererManager.clearEditorAndRenderDefaultBlock();
            }

            return this.editor.getEditorBlocks()[0];
        }

        return null;
    }

    /**
     * Creates a new block model based on provided arguments
     *
     * @param {IAddBlockInteraction} args - Options for creating the block
     * @returns {BlockModel} - The new block model
     * @hidden
     */
    private prepareBlock(args: IAddBlockInteraction): BlockModel {
        const { block, targetBlockModel, blockID, blockType, contentModel }: IAddBlockInteraction = args;

        if (!block) {
            return BlockFactory.createBlockFromPartial({
                id: blockID || generateUniqueId(constants.BLOCK_ID_PREFIX),
                parentId: targetBlockModel ? targetBlockModel.parentId : '',
                type: (blockType || BlockType.Paragraph) as BlockType,
                content: contentModel || [],
                indent: targetBlockModel ? targetBlockModel.indent : 0
            });
        }
        if (!args.isUndoRedoAction) {
            this.editor.stateManager.populateUniqueIds([block]);
        }

        return block;
    }

    /**
     * Handles the selective deletion of blocks
     *
     * @param {KeyboardEvent} event The keyboard event
     * @returns {boolean} Whether the event was handled
     * @hidden
     */
    public handleSelectiveDeletions(event: KeyboardEvent): boolean {
        const selectedBlocks: BlockModel[] = this.editor.getSelectedBlocks();
        if (selectedBlocks.length <= 0) { return false; }
        this.editor.isEntireEditorSelected = this.editor.nodeSelection.checkIsEntireEditorSelected();
        if (this.editor.isEntireEditorSelected) {
            this.handleEntireBlockDeletion(event);
            return true;
        }
        else if (selectedBlocks && selectedBlocks.length > 1) {
            this.handleMultipleBlockDeletion(selectedBlocks, event.key === 'Backspace' ? 'previous' : 'next');
            event.preventDefault();
            return true;
        }
        return false;
    }

    private handleEntireBlockDeletion(event: KeyboardEvent): void {
        const prevFocusedBlockid: string = this.editor.currentFocusedBlock.id;
        const allBlocks: BlockModel[] = this.editor.getEditorBlocks().map((block: BlockModel) => isolateModel(sanitizeBlock(block)));
        this.editor.setEditorBlocks([]);

        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.multipleBlocksDeleted,
            oldBlockModel: this.createDefaultEmptyBlock(true),
            data: {
                deletedBlocks: allBlocks,
                deletionType: DeletionType.Entire,
                cursorBlockId: prevFocusedBlockid
            }
        });

        this.editor.isEntireEditorSelected = false;
        event.preventDefault();
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
    handleMultipleBlockDeletion(
        selectedBlocks: BlockModel[],
        direction: 'previous' | 'next' = 'previous',
        isUndoRedoAction?: boolean
    ): boolean {
        const prevFocusedBlockid: string = this.editor.currentFocusedBlock ? this.editor.currentFocusedBlock.id : '';
        const selectedClones: BlockModel[] = selectedBlocks.map((block: BlockModel) => isolateModel(sanitizeBlock(block)));
        const firstBlock: BlockModel = selectedBlocks[0];
        const lastBlock: BlockModel = selectedBlocks[selectedBlocks.length - 1];
        const firstBlockElement: HTMLElement = this.editor.getBlockElementById(firstBlock.id);
        const lastBlockElement: HTMLElement = this.editor.getBlockElementById(lastBlock.id);
        const range: Range = getSelectedRange();

        if (!range || !firstBlockElement || !lastBlockElement) { return false; }

        for (let i: number = 1; i < selectedBlocks.length - 1; i++) {
            this.deleteBlock({
                blockElement: this.editor.getBlockElementById(selectedBlocks[parseInt(i.toString(), 10)].id),
                isUndoRedoAction: true
            }
            );
        }

        const firstBlockContent: HTMLElement = getBlockContentElement(firstBlockElement);
        const firstSplit: ISplitContentData = this.splitContent(firstBlockContent, range.startContainer, range.startOffset);
        this.updateAndCleanContentModels(firstBlock, firstSplit, 'keepBefore');

        const lastBlockContent: HTMLElement = getBlockContentElement(lastBlockElement);
        const lastSplit: ISplitContentData = this.splitContent(lastBlockContent, range.endContainer, range.endOffset);
        this.updateAndCleanContentModels(lastBlock, lastSplit, 'keepAfter');

        firstBlockContent.innerHTML = '';
        firstBlockContent.appendChild(firstSplit.beforeFragment);
        lastBlockContent.innerHTML = '';
        lastBlockContent.appendChild(lastSplit.afterFragment);

        this.deleteBlockAtCursor({
            blockElement: direction === 'previous' ? lastBlockElement : firstBlockElement,
            mergeDirection: direction,
            isUndoRedoAction: true
        });

        if (!isUndoRedoAction) {
            this.editor.undoRedoAction.pushActionIntoUndoStack({
                action: actionType.multipleBlocksDeleted,
                data: {
                    deletedBlocks: selectedClones,
                    deletionType: DeletionType.Partial,
                    direction: direction,
                    firstBlockIndex: getBlockIndexById(firstBlock.id, this.editor.getEditorBlocks()),
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
        const blockElement: HTMLElement = this.editor.getBlockElementById(block.id);

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
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

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

        this.editor.blockService.updateContent(block.id, newContentModels);
        this.editor.isProtectedOnChange = prevOnChange;
    }

    /**
     * Splits a block at the cursor position
     *
     * @param {HTMLElement} blockElement The block element to split
     * @param {IAddBlockInteraction} args Optional additional arguments
     * @returns {ISplitContentData | null} The split content object or null
     * @hidden
     */
    public splitBlockAtCursor(blockElement: HTMLElement, args?: IAddBlockInteraction): ISplitContentData | null {
        const isUndoRedoAction: boolean = args && args.isUndoRedoAction;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return null; }

        const range: Range = this.editor.nodeSelection.getRange();
        if (isUndoRedoAction) {
            if (!args.lastChild) { return null; }
            return this.splitContent(
                contentElement,
                args.lastChild.nodeType === Node.ELEMENT_NODE ? getDeepestTextNode(args.lastChild) : args.lastChild,
                args.splitOffset
            );
        }
        if (!range.startContainer) { return null; }

        return this.splitContent(contentElement, range.startContainer, range.startOffset);
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
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();

        if (isDividerBlock(blockElement) || editorBlocks.length === 1) {
            const adjacentBlockElement: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            const isDivider: boolean = isDividerBlock(blockElement);

            this.deleteBlock({ ...args, blockElement: blockElement });
            this.createDefaultEmptyBlock(true);

            if (isDivider && !isNOU(adjacentBlockElement)) {
                const adjacentContent: HTMLElement = getBlockContentElement(adjacentBlockElement);
                if (adjacentContent.innerHTML === '<br>') {
                    clearBreakTags(adjacentBlockElement);
                }
                this.editor.setFocusToBlock(adjacentBlockElement);
                this.editor.togglePlaceholder(adjacentBlockElement, true);
                setCursorPosition(adjacentContent, 0);
                this.editor.floatingIconManager.showFloatingIcons(adjacentBlockElement);
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
        const targetBlock: HTMLElement = mergeDirection === 'previous' ? adjacentBlock : blockElement;
        const sourceBlockModel: BlockModel = getBlockModelById(sourceBlock.id, editorBlocks);
        const targetBlockModel: BlockModel = getBlockModelById(targetBlock.id, editorBlocks);
        const sourceContent: HTMLElement = getBlockContentElement(sourceBlock) as HTMLElement;
        const targetContent: HTMLElement = getBlockContentElement(targetBlock) as HTMLElement;
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading, BlockType.Callout, 'Table', BlockType.Code, BlockType.Image];

        if (!sourceContent || !targetContent || specialTypes.indexOf(adjacentBlockModel.type) !== -1) { return; }
        const newCursorPos: number = targetContent.textContent.length;
        const lastChildId: string = targetContent.childNodes.length > 0 ?
            (targetContent.lastChild.nodeType === Node.ELEMENT_NODE
                ? (targetContent.lastChild as HTMLElement).id : targetContent.id) : '';
        const lastChild: HTMLElement = (lastChildId !== '') ? targetBlock.querySelector('#' + lastChildId) : null;

        this.updateContentModelsForDeletion(sourceContent, targetContent, targetBlockModel, sourceBlockModel);

        this.mergeBlocksAtDOMLevel(sourceContent, targetContent);

        this.editor.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, newCursorPos);
        this.editor.togglePlaceholder(targetBlock, true);
        this.editor.floatingIconManager.showFloatingIcons(targetBlock);

        this.deleteBlock({
            ...args,
            blockElement: sourceBlock,
            lastChild: lastChild,
            splitOffset: lastChild ? lastChild.textContent.length : 0,
            contentElement: sourceContent
        });

        if (isListTypeBlock(sourceBlockModel.type) || isListTypeBlock(targetBlockModel.type)) {
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
    }

    private mergeBlocksAtDOMLevel(sourceContent: HTMLElement, targetContent: HTMLElement): void {
        const sourceBlockModel: BlockModel = getBlockModelById(
            sourceContent.closest('.' + constants.BLOCK_CLS).id, this.editor.getEditorBlocks()
        );

        sourceContent.childNodes.forEach((node: ChildNode, index: number) => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (targetContent.childNodes.length === 0) {
                    targetContent.appendChild(document.createTextNode(node.textContent));
                } else {
                    const lastTargetNode: ChildNode = targetContent.lastChild;
                    if (lastTargetNode.nodeType === Node.TEXT_NODE) {
                        lastTargetNode.textContent += node.textContent;
                    } else {
                        const span: HTMLElement = document.createElement('span');
                        span.textContent = node.textContent;

                        const sourceContentModel: ContentModel = sourceBlockModel.content[index as number];
                        if (sourceContentModel.id) {
                            span.id = sourceContentModel.id;
                        }
                        targetContent.appendChild(span);
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (targetContent.childNodes.length === 1 && targetContent.firstChild.nodeType === Node.TEXT_NODE) {
                    const span: HTMLElement = document.createElement('span');
                    span.id = targetContent.id;
                    span.textContent = targetContent.firstChild.textContent;
                    targetContent.replaceChild(span, targetContent.firstChild);
                    targetContent.removeAttribute('id');
                }
                targetContent.appendChild(node.cloneNode(true));
            }
        });
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
        const clonedTargetContent: ContentModel[] = isolateModel(sanitizeContents(targetBlockModel.content));
        const clonedSourceContent: ContentModel[] = isolateModel(sanitizeContents(sourceBlockModel.content));

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
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        this.editor.blockService.updateContent(targetBlockModel.id, mergedContent);
        this.editor.isProtectedOnChange = prevOnChange;
    }

    /**
     * Splits the content of a block at a specified node and offset.
     *
     * @param {HTMLElement} contentElement - The content element of the block.
     * @param {Node} splitNode - The node at which to split the content.
     * @param {number} splitOffset - The offset within the split node at which to split the content.
     * @returns {ISplitContentData} - An object containing the before and after fragments of the split content.
     * @hidden
     */
    public splitContent(contentElement: HTMLElement, splitNode: Node, splitOffset: number): ISplitContentData {
        const beforeFragment: DocumentFragment = document.createDocumentFragment();
        const afterFragment: DocumentFragment = document.createDocumentFragment();
        let isSplitting: boolean = false;

        const processNode: (node: Node, container: Node, parentChain: Node[], isAfter?: boolean) => void = (
            node: Node,
            container: Node,
            parentChain: Node[] = [],
            isAfter: boolean = false
        ): void => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textNode: Text = node as Text;
                const fullText: string = textNode.textContent;
                if (!isAfter && node === splitNode) {
                    const beforeText: string = fullText.slice(0, splitOffset);
                    const afterText: string = fullText.slice(splitOffset);

                    if (beforeText) { container.appendChild(document.createTextNode(beforeText)); }

                    if (afterText) {
                        // Build after tree from deepest to root
                        let afterNode: Node = document.createTextNode(afterText);
                        for (let i: number = parentChain.length - 1; i >= 0; i--) {
                            const cloned: HTMLElement = (parentChain[i as number] as HTMLElement)
                                .cloneNode(false) as HTMLElement;
                            // Only re-generate id for the root node
                            if (i === 0) {
                                cloned.id = generateUniqueId(constants.CONTENT_ID_PREFIX);
                            }
                            cloned.appendChild(afterNode);
                            afterNode = cloned;
                        }
                        afterFragment.appendChild(afterNode);
                    }

                    isSplitting = true;
                } else {
                    container.appendChild(document.createTextNode(fullText));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                const clone: HTMLElement = element.cloneNode(false) as HTMLElement;
                const newParentChain: Node[] = [...parentChain, element];

                if (!isAfter && (element.contains(splitNode) || element === splitNode)) {
                    for (const child of Array.from(element.childNodes)) {
                        if (!isSplitting && (child.contains(splitNode) || child === splitNode)) {
                            processNode(child, clone, newParentChain);
                        } else {
                            processNode(child, clone, newParentChain, isSplitting);
                        }
                    }
                    container.appendChild(clone);
                } else {
                    if (isAfter) {
                        container.appendChild(element.cloneNode(true));
                    } else {
                        container.appendChild(clone);
                        for (const child of Array.from(element.childNodes)) {
                            processNode(child, clone, newParentChain, isAfter);
                        }
                    }
                }
            }
        };

        for (const node of Array.from(contentElement.childNodes)) {
            if (!isSplitting) {
                processNode(node, beforeFragment, []);
            } else {
                afterFragment.appendChild(node.cloneNode(true));
            }
        }

        return { beforeFragment, afterFragment, splitOffset };
    }

    private transformToggleBlocksAsRegular(blockElement: HTMLElement): void {
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const block: BlockModel = getBlockModelById(blockElement.id, editorBlocks);

        if (!block || !block.type.startsWith('Collapsible')) { return; }

        const headerContentElement: HTMLElement = blockElement.querySelector('.e-toggle-header .e-block-content') as HTMLElement;
        const toggleContentElement: HTMLElement = blockElement.querySelector('.' + constants.TOGGLE_CONTENT_CLS) as HTMLElement;
        const childBlockElements: NodeListOf<HTMLElement> = toggleContentElement.querySelectorAll('.' + constants.BLOCK_CLS) as NodeListOf<HTMLElement>;

        const newType: string = block.type.replace(/^Collapsible/, '');
        const children: BlockModel[] = (block.props as BaseChildrenProp).children;
        block.type = newType as BlockType;
        children.forEach((childBlock: BlockModel) => {
            if (childBlock) {
                childBlock.parentId = '';
            }
        });

        editorBlocks.splice(getBlockIndexById(blockElement.id, editorBlocks) + 1, 0, ...children);
        (block.props as BaseChildrenProp).children = [];

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
        this.editor.setFocusToBlock(cloneMainBlock);
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
                    const newContent: ContentModel = isolateModel(sanitizeContent(previousContent)) as ContentModel;
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
     * Adjusts the view to focus on the current block
     *
     * @returns {void}
     * @hidden
     */
    private adjustViewForFocusedBlock(): void {
        if (!this.editor.currentFocusedBlock) {
            return;
        }

        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const lastBlock: BlockModel = editorBlocks[editorBlocks.length - 1];
        const containerRect: DOMRect = this.editor.element.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = this.editor.currentFocusedBlock.getBoundingClientRect() as DOMRect;

        if (lastBlock && lastBlock.id === this.editor.currentFocusedBlock.id) {
            this.editor.element.scrollTo({ top: this.editor.element.scrollHeight });
        } else if (blockRect.bottom > containerRect.bottom) {
            this.editor.element.scrollTop += blockRect.bottom - containerRect.bottom;
        }
    }

    private getParentElementToInsert(destination: IToBlockData, allBlocks: HTMLElement[]): HTMLElement {
        const wrapperClassName: string = destination.toParentBlockModel
            ? (destination.toParentBlockModel.type === BlockType.Callout ? '.' + constants.CALLOUT_CONTENT_CLS :
                destination.toParentBlockModel.type.toString().startsWith('Collapsible') ? '.' + constants.TOGGLE_CONTENT_CLS : '')
            : '';
        return wrapperClassName
            ? allBlocks[destination.toParentBlockIndex as number].querySelector(wrapperClassName)
            : this.editor.blockWrapper;
    }

    /**
     * Generates new IDs for the block and its content.
     *
     * @param {string} destinationBlockId The ID of the destination block.
     * @returns {IToBlockData | null} The destination block data or null if not found.
     * @hidden
     */
    public getDestinationBlockDataForMove(destinationBlockId: string): IToBlockData | null {
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const toBlockModel: BlockModel = getBlockModelById(destinationBlockId, editorBlocks);
        const toBlockIndex: number = getBlockIndexById(destinationBlockId, editorBlocks);

        if (toBlockIndex < 0) { return null; }

        const toParentBlockModel: BlockModel = getBlockModelById(toBlockModel.parentId, editorBlocks);
        const toParentBlockIndex: number = toParentBlockModel ? getBlockIndexById(toParentBlockModel.id, editorBlocks) : -1;

        return { toBlockModel, toParentBlockModel, toBlockIndex, toParentBlockIndex };
    }

    updateFocusAndCursor(blockElement: HTMLElement): void {
        if (blockElement) {
            const content: HTMLElement = getBlockContentElement(blockElement);
            this.editor.setFocusToBlock(blockElement);
            setCursorPosition(content, 0);
            this.editor.floatingIconManager.showFloatingIcons(blockElement);
        }
    }
}
