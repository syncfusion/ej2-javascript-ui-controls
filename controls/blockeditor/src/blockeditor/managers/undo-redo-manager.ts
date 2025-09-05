import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { BlockType, ContentType, DeletionType } from '../base/enums';
import { BaseChildrenProp, BlockModel, ContentModel } from '../models/index';
import { getBlockContentElement, getBlockModelById, isNonContentEditableBlock } from '../utils/block';
import { IUndoRedoState, IMoveOperation, IBlockData, IAddOperation, IMoveBlocksInteraction, ITransformOperation, IMultiDeleteOperation, IClipboardPasteOperation, IDeleteBlockInteraction, IFromBlockData } from '../base/interface';
import { UndoRedoAction } from '../actions/index';
import * as constants from '../base/constant';

/**
 * Manages undo redo actions for the BlockEditor component
 */
export class UndoRedoManager {

    public editor: BlockEditor;
    public undoRedoAction: UndoRedoAction;
    /**
     * Creates a new StateManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     * @param {UndoRedoAction} action The UndoRedoAction instance
     */
    constructor(editor: BlockEditor, action: UndoRedoAction) {
        this.editor = editor;
        this.undoRedoAction = action;
    }

    /**
     * Renders the block with the previous state
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public reRenderWithPreviousState(currentState: IUndoRedoState): void {
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        const isFormattingOnUserTyping: boolean = currentState.action === 'formattingAction' && currentState.isFormattingOnUserTyping;

        // On Redo, restore the contentchange action first and proceed with formatting action(applicable only for format on user typing)
        if (this.undoRedoAction.isRedoing && isFormattingOnUserTyping) {
            this.popLastActionFromStack();
        }

        const blockId: string = currentState.data ? (currentState.data as IBlockData).blockId : '';
        const targetBlockModel: BlockModel = getBlockModelById(blockId, this.editor.getEditorBlocks());
        if (!targetBlockModel) { return; }
        const newBlock: BlockModel = this.undoRedoAction.isUndoing ? currentState.oldBlockModel : currentState.updatedBlockModel;

        /* Model */
        this.editor.blockService.replaceBlock(targetBlockModel.id, newBlock);

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();

        /* DOM */
        const blockElement: HTMLElement = this.editor.getBlockElementById(blockId);
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        this.editor.blockRendererManager.contentRenderer.renderContent(newBlock, contentElement);

        // On Undo, restore the contentchange action after formatting action(applicable only for format on user typing)
        if (this.undoRedoAction.isUndoing && isFormattingOnUserTyping) {
            this.popLastActionFromStack();
        }
    }

    private popLastActionFromStack(): void {
        const action: IUndoRedoState = this.undoRedoAction.isRedoing
            ? this.undoRedoAction.redoStack.pop()
            : this.undoRedoAction.undoStack.pop();
        if (this.undoRedoAction.isRedoing) {
            this.undoRedoAction.undoStack.push(action);
        } else {
            this.undoRedoAction.redoStack.push(action);
        }
        this.undoRedoAction.processUndoRedoAction(action);
    }

    /**
     * Moves the blocks into its original position
     *
     * @param {IMoveBlocksInteraction} args - Specifies the arguments for moving the blocks
     * @returns {void} - Returns void
     * @hidden
     */
    private moveBlocksIntoOriginalPosition(args: IMoveBlocksInteraction): void {
        const { fromBlockIds, fromIndex, fromParentId, toParentId } = args;
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        // Collect current indexes before mutating the array
        const fromEntries: IFromBlockData[] = this.editor.blockService.gatherBlocksInfoForMove(fromBlockIds);

        let oldDatas: IFromBlockData[] = this.editor.blockService.removeBlocksForMove(fromEntries);

        // Collect the old data models
        oldDatas = [...fromEntries].reverse()
            .map((fromEntry: IFromBlockData, i: number) => {
                const index: number = fromIndex[parseInt(i.toString(), 10)];
                const parent: BlockModel = getBlockModelById(fromParentId[parseInt(i.toString(), 10)], editorBlocks);
                return { ...fromEntry, index, parent };
            });

        // insert in its old position
        for (const entry of oldDatas) {
            const { model: entryModel, index, parent } = entry;
            const insertToArray: BlockModel[] = parent ? (parent.props as BaseChildrenProp).children : editorBlocks;
            entryModel.parentId = parent ? parent.id : '';
            insertToArray.splice(index, 0, entryModel);
        }

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();

        // DOM updates
        for (const entry of args.isMovedUp ? oldDatas.reverse() : oldDatas) {
            const { blockId, index, parent }: IFromBlockData = entry;

            const fromElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`) as HTMLElement;
            const allBlocks: HTMLElement[] = Array.from(this.editor.blockWrapper.children) as HTMLElement[];
            // should reduce index only when any block is moved into a special block or last child block is moved outside from a special block (Callout, Toggle)
            const shouldReduceIndex: boolean = parent
                ? (parent.props as BaseChildrenProp).children[((parent.props as BaseChildrenProp)
                    .children.length - 1) as number].id === blockId
                : toParentId !== '';
            const indexVal: number = shouldReduceIndex ? index - 1 : index;
            const parentElement: HTMLElement = (parent ? this.editor.blockWrapper.querySelector(`#${parent.id}`) : null);
            const toBlockDOM: HTMLElement = (parent
                ? parentElement.querySelectorAll('.' + constants.BLOCK_CLS)[parseInt(indexVal.toString(), 10)]
                : allBlocks[parseInt(indexVal.toString(), 10)]) as HTMLElement;

            const wrapperClassName: string = parent
                ? parent.type === BlockType.Callout ? '.' + constants.CALLOUT_CONTENT_CLS
                    : parent.type.toString().startsWith('Collapsible') ? '.' + constants.TOGGLE_CONTENT_CLS
                        : ''
                : '';

            const wrapperElement: HTMLElement = wrapperClassName
                ? parentElement.querySelector(wrapperClassName)
                : this.editor.blockWrapper;

            let targetToInsert: HTMLElement;
            if (!args.isMovedUp) {
                targetToInsert = (shouldReduceIndex
                    ? (toBlockDOM ? toBlockDOM.nextElementSibling : toBlockDOM)
                    : toBlockDOM) as HTMLElement;
            } else {
                targetToInsert = (toBlockDOM ? toBlockDOM.nextElementSibling : toBlockDOM) as HTMLElement;
            }
            wrapperElement.insertBefore(fromElement, targetToInsert);
        }
        const blockIdToFocus: string = fromBlockIds[0];
        const blockElementToFocus: HTMLElement = this.editor.getBlockElementById(blockIdToFocus);
        this.editor.blockCommandManager.updateFocusAndCursor(blockElementToFocus);
    }

    /**
     * Handles the block movement undo redo action
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public handleBlockMovement(currentState: IUndoRedoState): void {
        const moveData: IMoveOperation = currentState.data as IMoveOperation;
        const moveBlockArgs: IMoveBlocksInteraction = {
            fromBlockIds: moveData.blockIds,
            fromIndex: moveData.fromIndex,
            toBlockId: moveData.toBlockId,
            toIndex: moveData.toIndex,
            fromParentId: moveData.fromParentId,
            toParentId: moveData.toParentId,
            isUndoRedoAction: true,
            isMovedUp: moveData.isMovedUp
        };
        if (this.undoRedoAction.isUndoing) {
            this.moveBlocksIntoOriginalPosition(moveBlockArgs);
        }
        else {
            this.editor.blockCommandManager.moveBlock(moveBlockArgs);
        }
    }

    /**
     * Re-transforms the block with the previous state
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public reTransformBlocks(currentState: IUndoRedoState): void {
        const transformedData: ITransformOperation = currentState.data as ITransformOperation;
        if (!transformedData) { return; }
        const currentBlockModel: BlockModel = transformedData.blockId
            ? getBlockModelById(transformedData.blockId, this.editor.getEditorBlocks()) : null;
        const storedBlockModel: BlockModel = this.undoRedoAction.isUndoing
            ? transformedData.oldBlockModel : transformedData.newBlockModel;
        const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${transformedData.blockId}`) as HTMLElement;
        const newBlockType: string = this.undoRedoAction.isUndoing
            ? transformedData.oldBlockModel.type : transformedData.newBlockModel.type;

        this.editor.blockRendererManager.handleBlockTransformation({
            block: currentBlockModel,
            blockElement: blockElement,
            newBlockType: newBlockType,
            isUndoRedoAction: true,
            props: storedBlockModel.props
        });
    }

    /**
     * Handles undo redo action for multiple block deletions
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public handleMultipleBlocksUndoRedo(currentState: IUndoRedoState): void {
        if (this.undoRedoAction.isUndoing) {
            this.restoreDeletedBlocks(currentState);
        } else if (this.undoRedoAction.isRedoing) {
            this.reDeleteBlocks(currentState);
        }
    }

    private restoreDeletedBlocks(state: IUndoRedoState): void {
        const data: IMultiDeleteOperation = state.data as IMultiDeleteOperation;
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        if (data.deletionType === DeletionType.Entire) {
            this.restoreEntireEditor(data.deletedBlocks);
            setTimeout(() => {
                this.editor.selectAllBlocks();
            });
        }
        else if (data.deletionType === DeletionType.Partial) {
            this.restorePartialDeletion(state);
        }

        this.editor.isProtectedOnChange = prevOnChange;
        this.editor.stateManager.updatePropChangesToModel();
    }

    private restoreEntireEditor(deletedBlocks: BlockModel[]): void {
        this.editor.setEditorBlocks(deletedBlocks);
        this.editor.blockWrapper.innerHTML = '';
        this.editor.renderBlocks(deletedBlocks);
    }

    private restorePartialDeletion(state: IUndoRedoState): void {
        const { deletedBlocks, firstBlockIndex }: IMultiDeleteOperation = state.data as IMultiDeleteOperation;
        if (!deletedBlocks.length) { return; }

        const [firstBlock, ...middleBlocks]: BlockModel[] = deletedBlocks;
        const lastBlock: BlockModel = middleBlocks.pop();

        const firstBlockParent: BlockModel = getBlockModelById(firstBlock.parentId, this.editor.getEditorBlocks());
        const targetIndex: number = (firstBlockIndex - 1) >= 0 ? (firstBlockIndex - 1) : 0;
        let targetBlockElement: HTMLElement = this.editor.blockWrapper.children[targetIndex as number] as HTMLElement;

        if (firstBlockParent) {
            const childBlocks: NodeListOf<HTMLElement> = this.editor.getBlockElementById(firstBlockParent.id).querySelectorAll('.' + constants.BLOCK_CLS);
            targetBlockElement = childBlocks[targetIndex as number] as HTMLElement;
        }

        const firstBlockElement: HTMLElement = this.restoreSingleBlock(
            firstBlock,
            firstBlockIndex,
            targetBlockElement,
            true
        );

        this.restoreSingleBlock(
            lastBlock,
            firstBlockIndex + 1,
            firstBlockElement
        );

        if (middleBlocks.length) {
            this.restoreMiddleBlocks(middleBlocks, firstBlockElement);
        }

        this.editor.listBlockAction.recalculateMarkersForListItems();
    }

    private restoreSingleBlock(
        block: BlockModel,
        insertIndex: number,
        targetElement?: HTMLElement,
        isFirstBlock?: boolean
    ): HTMLElement | null {
        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        let blockElement: HTMLElement = this.editor.getBlockElementById(block.id);
        const parent: BlockModel = getBlockModelById(block.parentId, editorBlocks);
        const deleteCount: number = isFirstBlock ? 1 : 0;
        const blocksArray: BlockModel[] = parent ? (parent.props as BaseChildrenProp).children : editorBlocks;

        blocksArray.splice(insertIndex, deleteCount, block);

        if (blockElement) {
            this.editor.blockRendererManager.reRenderBlockContent(block);
            return blockElement;
        }

        blockElement = this.editor.blockRendererManager.createBlockElement(block);
        this.editor.togglePlaceholder(blockElement, false);

        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', blockElement);
        }

        return blockElement;
    }

    private restoreMiddleBlocks(middleBlocks: BlockModel[], targetElement: HTMLElement): void {
        let currentInsertionPoint: HTMLElement = targetElement;

        for (const block of middleBlocks) {
            currentInsertionPoint = this.editor.blockCommandManager.addNewBlock({
                block,
                targetBlock: currentInsertionPoint,
                isUndoRedoAction: true
            });
            this.editor.togglePlaceholder(currentInsertionPoint, false);
        }
    }

    private reDeleteBlocks(state: IUndoRedoState): void {
        const data: IMultiDeleteOperation = state.data as IMultiDeleteOperation;
        if (data.deletionType === DeletionType.Entire) {
            this.editor.setEditorBlocks([]);
            this.editor.blockCommandManager.createDefaultEmptyBlock(true, state.oldBlockModel ? state.oldBlockModel.id : '');
        }
        else if (data.deletionType === DeletionType.Partial) {
            const blocksToDelete: BlockModel[] = [];
            for (let i: number = 0; i < data.deletedBlocks.length; i++) {
                const block: BlockModel = data.deletedBlocks[i as number];
                const currentBlockModel: BlockModel = getBlockModelById(block.id, this.editor.getEditorBlocks());
                if (currentBlockModel) {
                    blocksToDelete.push(currentBlockModel);
                }
            }
            if (blocksToDelete.length > 0) {
                this.undoRedoAction.restoreSelectionState(state);
                this.editor.blockCommandManager.handleMultipleBlockDeletion(blocksToDelete, data.direction || 'previous', true);
            }
        }
    }

    /**
     * Handles the clipboard undo redo action
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public handleClipboardActions(currentState: IUndoRedoState): void {
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        if (this.undoRedoAction.isUndoing) {
            this.handleClipboardUndo(currentState);
        }
        else {
            this.handleClipboardRedo(currentState);
        }
        this.editor.isProtectedOnChange = prevOnChange;
    }

    private handleClipboardUndo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, oldContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteOperation = currentState.data as IClipboardPasteOperation;
        const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.getEditorBlocks());

        if (type === 'blocks') {
            const clipboardBlocks: BlockModel[] = clipboardData.blocks;
            const oldBlock: BlockModel = currentState.oldBlockModel;
            const isEmptyTargetBlock: boolean = oldBlock && oldBlock.content
                && ((oldBlock.content.length === 1 && oldBlock.content[0].type === ContentType.Text && oldBlock.content[0].content === '')
                || !oldBlock.content.length);

            if (blocks && blocks.length > 0) {
                blocks.forEach((block: BlockModel) => {
                    this.editor.blockCommandManager.deleteBlock({
                        blockElement: this.editor.getBlockElementById(block.id),
                        isUndoRedoAction: true
                    });
                });
            }

            if (isEmptyTargetBlock) {
                this.editor.blockService.updateContent(targetBlock.id, oldBlock.content);

                const targetElement: HTMLElement = this.editor.getBlockElementById(targetBlockId);
                targetElement.replaceWith(this.editor.blockRendererManager.createBlockElement(oldBlock));
            }
            else if (!isPastedAtStart) {
                const pastedContentIds: Set<string> = new Set(clipboardBlocks[0].content.map((c: ContentModel) => c.id));
                const newContent: ContentModel[] = targetBlock.content.filter((content: ContentModel) => !pastedContentIds.has(content.id));
                this.editor.blockService.updateContent(targetBlock.id, newContent);

                this.editor.blockRendererManager.reRenderBlockContent(targetBlock);
                this.popLastActionFromStack();
            }
        }
        else if (type === 'block') {
            this.editor.blockCommandManager.deleteBlock({
                blockElement: this.editor.getBlockElementById(blocks[0].id),
                isUndoRedoAction: true
            });
        }
        else if (type === 'content') {
            this.editor.blockService.updateContent(targetBlock.id, oldContent);

            this.editor.blockRendererManager.reRenderBlockContent(targetBlock);
        }
        // Pop the deletion action from the undo stack if user selected a content and pasted
        if (isSelectivePaste) {
            this.popLastActionFromStack();
        }
        this.editor.stateManager.updatePropChangesToModel();
    }

    private handleClipboardRedo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, newContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteOperation = currentState.data as IClipboardPasteOperation;
        // Pop the deletion action from the redo stack if user selected a content and pasted
        if (isSelectivePaste) {
            this.popLastActionFromStack();
        }

        const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
        const targetBlock: BlockModel = getBlockModelById(targetBlockId, editorBlocks);
        const targetBlockElement: HTMLElement = this.editor.getBlockElementById(targetBlockId);

        if (type === 'blocks') {
            const clipboardBlocks: BlockModel[] = clipboardData.blocks;
            const isEmptyTargetBlock: boolean = targetBlock && targetBlock.content
                && ((targetBlock.content.length === 1 && targetBlock.content[0].type === ContentType.Text && targetBlock.content[0].content === '')
                || !currentState.oldBlockModel.content.length);

            if (isEmptyTargetBlock) {
                const block: BlockModel = clipboardBlocks[0];
                this.editor.blockService.generateNewIdsForBlock(block);
                block.id = targetBlockId;

                this.editor.blockService.replaceBlock(targetBlock.id, block);
                this.editor.stateManager.updatePropChangesToModel();

                const updatedBlockModel: BlockModel = getBlockModelById(block.id, this.editor.getEditorBlocks());
                targetBlockElement.replaceWith(this.editor.blockRendererManager.createBlockElement(updatedBlockModel));
            }
            else if (!isPastedAtStart) {
                this.popLastActionFromStack();

                const originalBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.getEditorBlocks());
                this.editor.blockService.updateContent(originalBlock.id, [
                    ...originalBlock.content,
                    ...clipboardBlocks[0].content
                ]);
                this.editor.stateManager.updatePropChangesToModel();
                this.editor.blockRendererManager.reRenderBlockContent(originalBlock);
            }

            this.editor.blockCommandManager.addBulkBlocks({
                blocks: (clipboardBlocks.length > 1) ? (clipboardBlocks.slice((isPastedAtStart && !isEmptyTargetBlock) ? 0 : 1)) : [],
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'blocks'
            });
        }
        else if (type === 'block') {
            this.editor.blockCommandManager.addBulkBlocks({
                blocks: blocks,
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'block'
            });
        }
        else if (type === 'content') {
            this.editor.blockService.updateContent(targetBlock.id, newContent);
            this.editor.blockRendererManager.reRenderBlockContent(targetBlock);
        }
        this.editor.stateManager.updatePropChangesToModel();
    }

    /**
     * Creates block with given state
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public createBlock(currentState: IUndoRedoState): void {
        const deletedBLockIndex: number = currentState.data ? (currentState.data as IAddOperation).currentIndex : -1;
        if (deletedBLockIndex < 0) { return; }

        const parentBlock: BlockModel = getBlockModelById(currentState.oldBlockModel.parentId, this.editor.getEditorBlocks());
        const parentElement: HTMLElement = parentBlock ? this.editor.blockWrapper.querySelector('#' + parentBlock.id) : null;
        const targetIndex: number = (deletedBLockIndex === 0) ? (deletedBLockIndex) : (deletedBLockIndex - 1);
        const afterBlockModel: BlockModel = parentBlock
            ? (parentBlock.props as BaseChildrenProp).children[targetIndex as number]
            : this.editor.getEditorBlocks()[targetIndex as number];
        if (!afterBlockModel) { return; }

        const afterBlockElement: HTMLElement = parentBlock
            ? parentElement.querySelectorAll('.' + constants.BLOCK_CLS)[targetIndex as number] as HTMLElement
            : this.editor.blockWrapper.querySelector('#' + afterBlockModel.id) as HTMLElement;
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading,
            BlockType.Callout, BlockType.Image, BlockType.Code];
        const isSpecialType: boolean = (specialTypes.indexOf(currentState.oldBlockModel.type) > -1);

        if (isSpecialType || isNOU((currentState.data as IAddOperation).lastChild)) {
            const newBlockElement: HTMLElement = this.editor.blockCommandManager.addNewBlock({
                targetBlock: afterBlockElement,
                blockType: currentState.oldBlockModel.type,
                block: currentState.oldBlockModel,
                isAfter: deletedBLockIndex > 0,
                isUndoRedoAction: true
            });
            if (isNonContentEditableBlock(currentState.oldBlockModel.type)) {
                const adjacentSibling: HTMLElement = (newBlockElement.nextElementSibling
                    || newBlockElement.previousElementSibling) as HTMLElement;
                if (adjacentSibling) {
                    this.editor.blockRendererManager.setFocusAndUIForNewBlock(adjacentSibling);
                }
            }
            return;
        }

        const lastChild: HTMLElement = (currentState.data as IAddOperation).lastChild;

        this.editor.blockCommandManager.splitAndCreateNewBlockAtCursor({
            targetBlock: afterBlockElement,
            blockType: currentState.oldBlockModel.type,
            blockID: currentState.oldBlockModel.id,
            contentModel: currentState.oldBlockModel.content,
            isUndoRedoAction: true,
            splitOffset: (currentState.data as IAddOperation).splitOffset,
            lastChild: lastChild ? this.editor.blockWrapper.querySelector('#' + lastChild.id) : null,
            contentElement: (currentState.data as IAddOperation).contentElement
        });
    }

    /**
     * Removes block with given state
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public removeBlock(currentState: IUndoRedoState): void {
        const { splitOffset, lastChild, contentElement }: IDeleteBlockInteraction = (currentState.data) as IDeleteBlockInteraction;
        const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${(currentState.data as IBlockData).blockId}`) as HTMLElement;
        const shouldNeedsMerge: boolean = !isNOU(splitOffset) && splitOffset > -1 && !isNOU(lastChild) && !isNOU(contentElement);
        if (shouldNeedsMerge) {
            this.editor.blockCommandManager.deleteBlockAtCursor({ blockElement: blockElement, isUndoRedoAction: true, mergeDirection: 'previous' });
        }
        else {
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.editor.blockRendererManager.setFocusAndUIForNewBlock(adjacentBlock);
            }
            this.editor.blockCommandManager.deleteBlock({ blockElement: blockElement, isUndoRedoAction: true });
        }
    }
}
