import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { BlockModel } from '../models/index';
import { getBlockContentElement, getBlockIndexById, getBlockModelById } from '../utils/block';
import { setCursorPosition, getNodeFromPath, captureSelectionState } from '../utils/selection';
import { UndoRedoEventArgs } from '../base/eventargs';
import { IUndoRedoState, IBlockData, IMoveBlocksInteraction, IUndoRedoSelectionState, IClipboardPasteOperation, IIndentOperation, IAddBlockInteraction, IAddBulkBlocksInteraction, IDeleteBlockInteraction, IFromBlockData, ITransformOperation, ILineBreakOperation } from '../base/interface';
import { findClosestParent } from '../utils/dom';
import { UndoRedoManager } from '../managers/index';
import { actionType, BLOCK_CLS, events } from '../base/constant';
import { isolateModel } from '../utils/common';
import { sanitizeBlock } from '../utils/transform';
import { BlockType } from '../base/enums';

/**
 * `UndoRedoManager` module is used to handle undo and redo actions.
 */
export class UndoRedoAction {
    private editor: BlockEditor;
    /** @hidden */
    public undoRedoManager: UndoRedoManager
    /** @hidden */
    public undoStack: IUndoRedoState[] = [];
    /** @hidden */
    public redoStack: IUndoRedoState[] = [];
    /** @hidden */
    public isUndoing: boolean = false;
    /** @hidden */
    public isRedoing: boolean = false;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.undoRedoManager = new UndoRedoManager(this.editor, this);
        this.addEventListener();
    }

    private addEventListener(): void {
        this.editor.on(events.contentChanged, this.onContentChanged, this);
        this.editor.on(events.blockAdded, this.onBlockAddition, this);
        this.editor.on(events.blockRemoved, this.onBlockRemoval, this);
        this.editor.on(events.blockMoved, this.onBlockMove, this);
        this.editor.on(events.blockTransformed, this.onBlockTransform, this);
        this.editor.on(events.destroy, this.destroy, this);
    }

    /**
     * Handles the undo operation.
     *
     * @returns {void}
     * @hidden
     */
    public undo(): void {
        this.performUndoRedo(true, 'isUndoing');
    }

    /**
     * Handles the redo operation.
     *
     * @returns {void}
     * @hidden
     */
    public redo(): void {
        this.performUndoRedo(false, 'isRedoing');
    }

    private performUndoRedo(
        isUndo: boolean,
        flagName: 'isUndoing' | 'isRedoing'
    ): void {
        this.editor.inlineToolbarModule.hideInlineToolbar();

        const canPerform: boolean = isUndo ? this.canUndo() : this.canRedo();
        const emptyStack: boolean = isUndo ? this.undoStack.length < 1 : this.redoStack.length < 1;
        if (emptyStack || !canPerform) { return; }

        (this as any)[`${flagName}`] = true;
        const state: IUndoRedoState = isUndo ? this.undoStack.pop() : this.redoStack.pop();
        if (isUndo) { this.updateFileUploadPropsOnStack(state); }

        if (state) {
            this.processUndoRedoAction(state);
            if (isUndo) { this.redoStack.push(state); }
            else { this.undoStack.push(state); }

            const eventArgs: UndoRedoEventArgs = {
                isUndo,
                content: isUndo ? state.oldBlockModel : state.updatedBlockModel,
                previousContent: isUndo ? state.updatedBlockModel : state.oldBlockModel
            };
            this.editor.trigger('undoRedoPerformed', eventArgs);
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
        (this as any)[`${flagName}`] = false;
    }

    /**
     * Pushes the given state into the undo stack
     *
     * @param {IUndoRedoState} state - The current state.
     * @returns {void}
     * @hidden
     */
    public pushActionIntoUndoStack(state?: IUndoRedoState): void {
        if (this.editor.getEditorBlocks().length === 0) { return; }

        const isSelectionPresent: boolean = !isNOU(this.editor.previousSelection);
        const isTextSelected: boolean = isSelectionPresent && !this.editor.previousSelection.isCollapsed;
        const currentState: IUndoRedoState = {
            ...state,
            undoSelection: isSelectionPresent ? this.editor.previousSelection : captureSelectionState(),
            redoSelection: ((isTextSelected && !(state.action === actionType.formattingAction))
                || (isSelectionPresent && state.action === actionType.blockTransformed))
                ? this.editor.previousSelection
                : captureSelectionState()
        };

        this.undoStack.push(currentState);
        this.redoStack.length = 0;
        if (this.undoStack.length > this.editor.undoRedoStack) {
            this.undoStack.shift();
        }
        this.editor.previousSelection = undefined;
    }

    /**
     * Processes the undo/redo action.
     *
     * @param {IUndoRedoState} currentState - The current undo/redo state.
     * @returns {void}
     * @hidden
     */
    public processUndoRedoAction(currentState: IUndoRedoState): void {
        /* Perform core actions */
        this.applyUndoRedoChange(currentState);

        /* UI and selection refresh */
        const preventRestoreSelection: boolean = currentState.action === actionType.blockAdded
            || currentState.action === actionType.blockRemoved || currentState.action === actionType.blockMoved;
        if (!preventRestoreSelection) {
            this.restoreSelectionState(currentState);
        }
        this.editor.stateManager.refreshPlaceholder();
    }

    private applyUndoRedoChange(currentState: IUndoRedoState): void {
        switch (currentState.action) {
        case actionType.contentChanged:
        case actionType.formattingAction: {
            this.undoRedoManager.reRenderWithPreviousState(currentState);
            break;
        }
        case actionType.indent: {
            if (this.isUndoing) {
                this.editor.blockCommandManager.handleBlockIndentation({
                    blockIDs: (currentState.data as IIndentOperation).blockIDs,
                    shouldDecrease: true,
                    isUndoRedoAction: true
                });
            }
            else {
                this.editor.blockCommandManager.handleBlockIndentation({
                    blockIDs: (currentState.data as IIndentOperation).blockIDs,
                    shouldDecrease: false,
                    isUndoRedoAction: true
                });
            }
            break;
        }
        case actionType.lineBreakAdded: {
            const state: IBlockData = currentState.data as IBlockData;
            const blockModel: BlockModel = getBlockModelById(state.blockId, this.editor.getEditorBlocks());
            if (blockModel) {
                blockModel.content = this.isUndoing ? currentState.oldContents : currentState.newContents;
                this.editor.blockRendererManager.reRenderBlockContent(blockModel);
            }
            break;
        }
        case actionType.blockAdded: {
            if (this.isUndoing) {
                this.undoRedoManager.removeBlock(currentState);
            }
            else {
                this.undoRedoManager.createBlock(currentState);
            }
            break;
        }
        case actionType.blockRemoved:
            if (this.isUndoing) {
                this.undoRedoManager.createBlock(currentState);
            }
            else {
                this.undoRedoManager.removeBlock(currentState);
            }
            break;
        case actionType.blockMoved: {
            this.undoRedoManager.handleBlockMovement(currentState);
            break;
        }
        case actionType.multipleBlocksDeleted: {
            this.undoRedoManager.handleMultipleBlocksUndoRedo(currentState);
            break;
        }
        case actionType.blockTransformed: {
            this.undoRedoManager.reTransformBlocks(currentState);
            break;
        }
        case actionType.clipboardPaste: {
            this.undoRedoManager.handleClipboardActions(currentState);
            break;
        }
        }
    }

    /**
     * Restores the selection after undo/redo action.
     *
     * @param {IUndoRedoState} currentState - The current undo/redo state.
     * @returns {void}
     * @hidden
     */
    public restoreSelectionState(currentState: IUndoRedoState): void {
        const selection: IUndoRedoSelectionState = this.isUndoing ? currentState.undoSelection : currentState.redoSelection;
        if (selection) {
            const startBlock: HTMLElement = this.editor.element.querySelector('#' + selection.startBlockId);
            const endBlock: HTMLElement = this.editor.element.querySelector('#' + selection.endBlockId);

            if (startBlock && endBlock) {
                const startNode: Node = getNodeFromPath(startBlock, selection.startContainerPath);
                const endNode: Node = getNodeFromPath(endBlock, selection.endContainerPath);
                const isSelectivePaste: boolean = currentState.action === actionType.clipboardPaste
                    && (currentState.data as IClipboardPasteOperation).isSelectivePaste;
                const canRestoreForActions: boolean = currentState.action === actionType.indent
                    || currentState.action === actionType.formattingAction
                    || currentState.action === actionType.multipleBlocksDeleted;
                if ((this.isUndoing || (canRestoreForActions && this.isRedoing))
                    && !selection.isCollapsed && startNode && endNode && !currentState.isFormattingOnUserTyping) {
                    this.editor.nodeSelection.createRangeWithOffsets(startNode, endNode, selection.startOffset, selection.endOffset);
                }
                else if (!isSelectivePaste && ((this.isRedoing && startNode) || selection.isCollapsed && startNode)) {
                    const blockElement: HTMLElement = findClosestParent(startNode, '.' + BLOCK_CLS);
                    this.editor.setFocusToBlock(blockElement);
                    const cursorPos: number = selection.startOffset + (currentState.isFormattingOnUserTyping ? 1 : 0);
                    setCursorPosition(startNode.parentElement as HTMLElement, cursorPos);
                }
            }
        } else {
            // Fallback
            if (this.editor.currentFocusedBlock && document.contains(this.editor.currentFocusedBlock)) {
                const contentElement: HTMLElement = getBlockContentElement(this.editor.currentFocusedBlock);
                if (contentElement) {
                    this.editor.setFocusToBlock(this.editor.currentFocusedBlock);
                    const position: number = contentElement.textContent.length;
                    setCursorPosition(contentElement, position);
                }
            }
        }
    }

    private updateFileUploadPropsOnStack(state?: IUndoRedoState): void {
        /* The block model stored on stack might not have proper src since it is pushed before user uploads
            a file. Hence we are updating here as it surely has updated src in current block model in the editor */
        const validTypes: string[] = [BlockType.Image];
        const blockModel: BlockModel = (state.data as ITransformOperation).newBlockModel;
        const isValid: boolean = (state.action === actionType.blockTransformed
            && validTypes.indexOf(blockModel.type) !== -1);

        if (isValid) {
            // Update the props such as src into the stack
            const currentUpdatedBlock: BlockModel = getBlockModelById(blockModel.id, this.editor.getEditorBlocks());
            blockModel.props = { ...currentUpdatedBlock.props };
        }
    }

    private onContentChanged(args: any): void {
        this.pushActionIntoUndoStack({
            oldBlockModel: args.oldBlockModel,
            updatedBlockModel: args.updatedBlockModel,
            action: actionType.contentChanged,
            data: { blockId: args.updatedBlockModel.id }
        });
    }

    private onBlockAddition(args: any): void {
        this.pushActionIntoUndoStack({
            action: actionType.blockAdded,
            data: {
                blockId: args.blockId,
                currentIndex: args.currentIndex,
                splitOffset: args.splitOffset,
                lastChild: args.lastChild,
                contentElement: args.contentEle
            },
            oldBlockModel: args.blockModel
        });
    }

    private onBlockRemoval(args: any): void {
        this.pushActionIntoUndoStack({
            action: actionType.blockRemoved,
            data: {
                blockId: args.blockId,
                currentIndex: args.currentIndex,
                splitOffset: args.splitOffset,
                lastChild: args.lastChild,
                contentElement: args.contentEle
            },
            oldBlockModel: args.oldBlockModel
        });
    }

    private onBlockMove(args: IMoveBlocksInteraction): void {
        this.pushActionIntoUndoStack({
            action: actionType.blockMoved,
            data: {
                blockIds: args.fromBlockIds,
                toBlockId: args.toBlockId,
                fromIndex: args.fromIndex,
                toIndex: args.toIndex,
                fromParentId: args.fromParentId,
                toParentId: args.toParentId,
                isMovedUp: args.isMovedUp
            }
        });
    }

    private onBlockTransform(args: ITransformOperation): void {
        this.pushActionIntoUndoStack({
            action: actionType.blockTransformed,
            data: {
                blockId: args.blockId,
                oldBlockModel: args.oldBlockModel,
                newBlockModel: args.newBlockModel
            }
        });
    }

    /**
     * Handles undo/redo recording for block addition
     *
     * @param {IAddBlockInteraction} args - The arguments for adding a block.
     * @param {HTMLElement} blockElement - The block element.
     * @param {BlockModel} blockModel - The block model.
     * @returns {void}
     * @hidden
     */
    public trackBlockAdditionForUndoRedo(args: IAddBlockInteraction, blockElement: HTMLElement, blockModel: BlockModel): void {
        if (args.isUndoRedoAction) { return; }
        this.editor.notify('blockAdded', {
            blockId: blockElement.id,
            currentIndex: getBlockIndexById(blockElement.id, this.editor.getEditorBlocks()),
            blockModel: isolateModel(sanitizeBlock(blockModel)),
            splitOffset: args.splitOffset,
            lastChild: args.lastChild,
            contentEle: getBlockContentElement(blockElement)
        });
    }

    /**
     * Records block removal for undo/redo
     *
     * @param {IDeleteBlockInteraction} args - The arguments for deleting a block.
     * @param {string} blockId - The ID of the block.
     * @param {BlockModel} blockModel - The block model.
     * @param {number} blockIndex - The index of the block.
     * @returns {void}
     * @hidden
     */
    public trackBlockRemovalForUndoRedo(
        args: IDeleteBlockInteraction,
        blockId: string,
        blockModel: BlockModel,
        blockIndex: number
    ): void {
        if (args.isUndoRedoAction) { return; }
        this.editor.notify('blockRemoved', {
            blockId: blockId,
            currentIndex: blockIndex,
            splitOffset: args.splitOffset,
            lastChild: args.lastChild,
            contentEle: args.contentElement,
            oldBlockModel: isolateModel(sanitizeBlock(blockModel))
        });
    }

    /**
     * Records a block move operation for undo/redo
     *
     * @param {IMoveBlocksInteraction} args - The arguments for moving a block.
     * @param {IFromBlockData[]} movedBlocks - The blocks that are moved.
     * @param {number} toBlockIndex - The index of the block to which the blocks are moved.
     * @param {string} toParentId - The ID of the parent block to which the blocks are moved.
     * @param {boolean} isMovingUp - Indicates whether the blocks are moved up.
     * @returns {void}
     * @hidden
     */
    public trackBlockMoveForUndoRedo(
        args: IMoveBlocksInteraction,
        movedBlocks: IFromBlockData[],
        toBlockIndex: number,
        toParentId: string,
        isMovingUp: boolean
    ): void {
        if (args.isUndoRedoAction) { return; }
        const reversedFromModels: IFromBlockData[] = movedBlocks.slice().reverse();
        this.editor.notify('blockMoved', {
            ...args,
            fromBlockIds: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.blockId),
            fromIndex: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.index),
            toIndex: toBlockIndex,
            fromParentId: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.parent ? fromModel.parent.id : ''),
            toParentId: toParentId,
            isMovedUp: isMovingUp
        });
    }

    /**
     * Handles undo/redo recording for clipboard paste
     *
     * @param {IAddBulkBlocksInteraction} args - The arguments of clipboard paste.
     * @returns {void}
     * @hidden
     */
    public trackClipboardPasteForUndoRedo(args: IAddBulkBlocksInteraction): void {
        if (args.isUndoRedoAction) { return; }
        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.clipboardPaste,
            oldBlockModel: args.oldBlockModel,
            data: {
                type: args.insertionType,
                blocks: isolateModel(args.blocks.map((block: BlockModel) => sanitizeBlock(block))),
                targetBlockId: args.targetBlockId,
                isPastedAtStart: args.isPastedAtStart,
                isSelectivePaste: args.isSelectivePaste,
                clipboardData: {
                    blocks: args.clipboardBlocks
                }
            }
        });
    }

    /**
     * Handles indent action for undo redo
     *
     * @param {IIndentOperation} args - The arguments for indenting blocks
     * @returns {void}
     * @hidden
     */
    public trackIndentActionForUndoRedo(args: IIndentOperation): void {
        if (args.isUndoRedoAction) { return; }
        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.indent,
            data: {
                blockIDs: args.blockIDs,
                shouldDecrease: args.shouldDecrease,
                isUndoRedoAction: args.isUndoRedoAction
            }
        });
    }

    /**
     * Handles Line break action for undo redo
     *
     * @param {ILineBreakOperation} args - The arguments of inserted line breaks
     * @returns {void}
     * @hidden
     */
    public trackLineBreakActionForUndoRedo(args: ILineBreakOperation): void {
        if (args.isUndoRedoAction) { return; }
        this.editor.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.lineBreakAdded,
            oldContents: args.oldContent,
            newContents: args.newContent,
            data: {
                blockId: args.blockId
            }
        });
    }

    /**
     * Checks whether the undo stack is empty or not.
     *
     * @returns {boolean} Returns true if the undo stack is not empty.
     * @hidden
     */
    public canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    /**
     * Checks whether the redo stack is empty or not.
     *
     * @returns {boolean} Returns true if the redo stack is not empty.
     * @hidden
     */
    public canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    /**
     * Clears the undo and redo stack.
     *
     * @returns {void}
     * @hidden
     */
    public clear(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.editor.notify(events.undoStackChanged, { canUndo: false, canRedo: false });
    }

    public destroy(): void {
        this.removeEventListener();
        this.clear();
        this.undoRedoManager = null;
        this.editor = null;
    }

    protected removeEventListener(): void {
        this.editor.off(events.contentChanged, this.onContentChanged);
        this.editor.off(events.blockAdded, this.onBlockAddition);
        this.editor.off(events.blockRemoved, this.onBlockRemoval);
        this.editor.off(events.blockMoved, this.onBlockMove);
        this.editor.off(events.blockTransformed, this.onBlockTransform);
        this.editor.off(events.destroy, this.destroy);
    }
}
