import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockModel } from '../../models/index';
import { getBlockContentElement, getBlockIndexById, getBlockModelById } from '../../common/utils/block';
import { setCursorPosition, getNodeFromPath, captureSelectionState } from '../../common/utils/selection';
import { IUndoRedoState, IBlockData, IMoveBlocksInteraction, IBlockSelectionState, IClipboardPasteOperation, IIndentOperation, IAddBlockInteraction, IAddBulkBlocksInteraction, IDeleteBlockInteraction, IFromBlockData, ITransformOperation, ILineBreakOperation, IFormattingOperation } from '../../common/interface';
import { findClosestParent } from '../../common/utils/dom';
import { actionType, BLOCK_CLS, events } from '../../common/constant';
import { decoupleReference } from '../../common/utils/common';
import { sanitizeBlock } from '../../common/utils/transform';
import { BlockType } from '../../models/enums';
import { BlockManager } from '../base/block-manager';
import { UndoRedoManager } from '../plugins/common/undo-manager';
import { IBulkColumnsDeleteOperation, IBulkRowsDeleteOperation, ITableCellsClearOperation, ITableCellsPasteOperation, ITableColumnInsertOptions, ITableHeaderInputOperation, ITableRowInsertOptions } from '../base/interface';

/**
 * `UndoRedoManager` module is used to handle undo and redo actions.
 */
export class UndoRedoAction {
    private parent: BlockManager;
    /** @hidden */
    public undoRedoManager: UndoRedoManager;
    /** @hidden */
    public undoRedoStack: IUndoRedoState[] = [];
    /** @hidden */
    public index: number = -1; // points to the last applied action; -1 means no actions applied
    /** @hidden */
    public isUndoing: boolean = false;
    /** @hidden */
    public isRedoing: boolean = false;

    constructor(manager: BlockManager) {
        this.parent = manager;
        this.undoRedoManager = new UndoRedoManager(this.parent, this);
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off(events.destroy, this.destroy);
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

    /**
     * Executes undo or redo operation, updating editor state and notifying observers.
     * Processes sibling actions for formatting or paste, then applies the target state.
     *
     * @param {boolean} isUndo - True for undo, false for redo.
     * @param {string} flagName - State flag ('isUndoing' or 'isRedoing') to prevent recursion.
     * @returns {void}
     */
    private performUndoRedo(
        isUndo: boolean,
        flagName: 'isUndoing' | 'isRedoing'
    ): void {
        this.parent.inlineToolbarModule.hideInlineToolbar();

        const canPerform: boolean = isUndo ? this.canUndo() : this.canRedo();
        if (!canPerform) { return; }

        (this as any)[`${flagName}`] = true;
        const siblingAction: IUndoRedoState = this.undoRedoStack[this.index + 2];
        const shouldProcessSiblingAction: boolean = !isUndo && siblingAction !== undefined && (
            // Case 1: Formatting while typing (Press ctrlB and type)
            (siblingAction.data as IFormattingOperation).isTypingWithFormat ||

            // Case 2: Clipboard paste - (with blocks, not at start) or (selective paste)
            (siblingAction.action === 'clipboardPaste' &&
                ((siblingAction.data as IClipboardPasteOperation).type === 'blocks' &&
                !(siblingAction.data as IClipboardPasteOperation).isPastedAtStart) ||
                (siblingAction.data as IClipboardPasteOperation).isSelectivePaste
            )
        );
        this.index = shouldProcessSiblingAction ? this.index + 1 : this.index;
        const state: IUndoRedoState = isUndo ? this.undoRedoStack[this.index] : this.undoRedoStack[this.index + 1];
        if (isUndo) { this.updateFileUploadPropsOnStack(state); }

        if (state) {
            // Process the action first
            this.processUndoRedoAction(state);
            // Then move the pointer
            this.index = isUndo ? this.index - 1 : this.index + 1;

            const eventArgs: any = {
                isUndo,
                content: isUndo ? state.oldBlockModel : state.updatedBlockModel,
                previousContent: isUndo ? state.updatedBlockModel : state.oldBlockModel
            };
            this.parent.observer.notify('undoRedoPerformed', eventArgs);
            this.parent.listPlugin.recalculateMarkersForListItems();
            this.parent.stateManager.updateManagerBlocks();
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
        const isSelectionPresent: boolean = !isNOU(this.parent.previousSelection);
        const isTextSelected: boolean = isSelectionPresent && !this.parent.previousSelection.isCollapsed;
        const currentState: IUndoRedoState = {
            ...state,
            undoSelection: isSelectionPresent ? this.parent.previousSelection : captureSelectionState(),
            redoSelection: ((isTextSelected && !(state.action === actionType.formattingAction))
                || (isSelectionPresent && state.action === actionType.blockTransformed))
                ? this.parent.previousSelection
                : captureSelectionState()
        };

        // Truncate any future states if we are not at the end
        if (this.index < this.undoRedoStack.length - 1) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.index + 1);
        }
        // Push new state
        this.undoRedoStack.push(currentState);
        // Enforce max size
        if (this.undoRedoStack.length > this.parent.undoRedoStack) {
            const excess: number = this.undoRedoStack.length - this.parent.undoRedoStack;
            this.undoRedoStack = this.undoRedoStack.slice(excess);
            this.index = Math.max(this.index - excess, -1);
        }
        // Point to the last item
        this.index = this.undoRedoStack.length - 1;
        this.parent.previousSelection = undefined;
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
        const action: string = currentState.action;
        const isTableAction: boolean = action === actionType.tableRowInserted || action === actionType.tableRowDeleted
            || action === actionType.tableColumnDeleted || action === actionType.tableColumnInserted;
        const preventRestoreSelection: boolean = action === actionType.blockAdded || action === actionType.blockRemoved
            || action === actionType.blockMoved || action === actionType.formattingAction || isTableAction;
        if (!preventRestoreSelection) {
            this.restoreSelectionState(currentState);
        }
        this.parent.refreshPlaceholder();
    }

    private applyUndoRedoChange(currentState: IUndoRedoState): void {
        switch (currentState.action) {
        case actionType.contentChanged: {
            const blockId: string = currentState.data ? (currentState.data as IBlockData).blockId : '';
            this.undoRedoManager.reRenderWithPreviousState(blockId, currentState.oldBlockModel, currentState.updatedBlockModel);
            break;
        }
        case actionType.formattingAction:
            this.undoRedoManager.handleFormattingUndoRedo(currentState);
            break;
        case actionType.isExpanded: {
            const blockElement: HTMLElement = this.parent.getBlockElementById((currentState.data as IBlockData).blockId);
            const updatedState: boolean = this.isUndoing ? !(currentState.data as IBlockData).isExpanded
                : (currentState.data as IBlockData).isExpanded;
            this.parent.blockRenderer.collapsibleRenderer.updateCollapsibleBlockExpansion(blockElement, updatedState, true);
            break;
        }
        case actionType.indent: {
            if (this.isUndoing) {
                this.parent.execCommand({ command: 'IndentBlock', state: {
                    blockIDs: (currentState.data as IIndentOperation).blockIDs,
                    shouldDecrease: !(currentState.data as IIndentOperation).shouldDecrease,
                    isUndoRedoAction: true
                }});
            }
            else {
                this.parent.execCommand({ command: 'IndentBlock', state: {
                    blockIDs: (currentState.data as IIndentOperation).blockIDs,
                    shouldDecrease: (currentState.data as IIndentOperation).shouldDecrease,
                    isUndoRedoAction: true
                }});
            }
            break;
        }
        case actionType.checked: {
            const block: BlockModel = getBlockModelById((currentState.data as IBlockData).blockId, this.parent.getEditorBlocks());
            const updatedState: boolean = this.isUndoing ? !(currentState.data as IBlockData).isChecked
                : (currentState.data as IBlockData).isChecked;
            this.parent.blockRenderer.listRenderer.toggleCheckedState(block, updatedState, true);
            break;
        }
        case actionType.lineBreakAdded: {
            const state: IBlockData = currentState.data as IBlockData;
            const blockModel: BlockModel = getBlockModelById(state.blockId, this.parent.getEditorBlocks());
            const oldBlock: BlockModel = decoupleReference(sanitizeBlock(blockModel));
            this.parent.blockService.updateContent(blockModel.id, this.isUndoing ? currentState.oldContents : currentState.newContents);

            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: blockModel, oldBlock: oldBlock } ]
            }});
            break;
        }
        case actionType.blockAdded:
        case actionType.blockRemoved:
            this.undoRedoManager.blockAdditionDeletionUndoRedo(currentState);
            break;
        case actionType.blockMoved:
            this.undoRedoManager.handleBlockMovement(currentState);
            break;
        case actionType.multipleBlocksDeleted:
            this.undoRedoManager.handleMultipleBlocksUndoRedo(currentState);
            break;
        case actionType.blockTransformed:
            this.undoRedoManager.reTransformBlocks(currentState);
            break;
        case actionType.clipboardPaste:
            this.undoRedoManager.handleClipboardActions(currentState);
            break;
        case actionType.tableRowInserted:
            this.undoRedoManager.processRowAction(currentState.data as ITableRowInsertOptions, 'insert');
            break;
        case actionType.tableRowDeleted:
            this.undoRedoManager.processRowAction(currentState.data as ITableRowInsertOptions, 'delete');
            break;
        case actionType.tableColumnInserted:
            this.undoRedoManager.processColumnAction(currentState.data as ITableColumnInsertOptions, 'insert');
            break;
        case actionType.tableColumnDeleted:
            this.undoRedoManager.processColumnAction(currentState.data as ITableColumnInsertOptions, 'delete');
            break;
        case actionType.tableRowsDeleted:
            this.undoRedoManager.handleBulkRowsDeleted(currentState);
            break;
        case actionType.tableColumnsDeleted:
            this.undoRedoManager.handleBulkColumnsDeleted(currentState);
            break;
        case actionType.tableCellsCleared:
            this.undoRedoManager.handleTableCellsCleared(currentState);
            break;
        case actionType.tableCellsPasted:
            this.undoRedoManager.handleTableCellsPasted(currentState);
            break;
        case actionType.tableHeaderInput:
            this.undoRedoManager.handleTableHeaderUndoRedo(currentState);
            break;
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
        const selection: IBlockSelectionState = this.isUndoing ? currentState.undoSelection : currentState.redoSelection;
        if (selection) {
            const startBlock: HTMLElement = this.parent.rootEditorElement.querySelector('#' + selection.startBlockId);
            const endBlock: HTMLElement = this.parent.rootEditorElement.querySelector('#' + selection.endBlockId);

            if (startBlock && endBlock) {
                const startNode: Node = getNodeFromPath(startBlock, selection.startContainerPath);
                const endNode: Node = getNodeFromPath(endBlock, selection.endContainerPath);
                const isSelectivePaste: boolean = currentState.action === actionType.clipboardPaste
                    && (currentState.data as IClipboardPasteOperation).isSelectivePaste;
                const canRestoreForActions: boolean = currentState.action === actionType.indent
                    || currentState.action === actionType.formattingAction
                    || currentState.action === actionType.multipleBlocksDeleted;
                if ((this.isUndoing || (canRestoreForActions && this.isRedoing))
                    && !selection.isCollapsed && startNode && endNode) {
                    this.parent.nodeSelection.createRangeWithOffsets(startNode, endNode, selection.startOffset, selection.endOffset);
                }
                else if (!isSelectivePaste && ((this.isRedoing && startNode) || selection.isCollapsed && startNode)) {
                    const blockElement: HTMLElement = findClosestParent(startNode, '.' + BLOCK_CLS);
                    this.parent.setFocusToBlock(blockElement);
                    setCursorPosition(startNode.parentElement as HTMLElement, selection.startOffset);
                }
            }
        } else {
            // Fallback
            if (this.parent.currentFocusedBlock && document.contains(this.parent.currentFocusedBlock)) {
                const contentElement: HTMLElement = getBlockContentElement(this.parent.currentFocusedBlock);
                if (contentElement) {
                    this.parent.setFocusToBlock(this.parent.currentFocusedBlock);
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
            && validTypes.indexOf(blockModel.blockType) !== -1);

        if (isValid) {
            // Update the props such as src into the stack
            const currentUpdatedBlock: BlockModel = getBlockModelById(blockModel.id, this.parent.getEditorBlocks());
            blockModel.properties = { ...currentUpdatedBlock.properties };
        }
    }

    public trackCheckedStateForUndoRedo(blockId: string, state: boolean): void {
        this.pushActionIntoUndoStack({
            action: actionType.checked,
            data: { blockId: blockId, isChecked: state }
        });
    }

    public trackContentChangedForUndoRedo(oldBlock: BlockModel, updatedBlock: BlockModel): void {
        this.pushActionIntoUndoStack({
            oldBlockModel: oldBlock,
            updatedBlockModel: updatedBlock,
            action: actionType.contentChanged,
            data: { blockId: updatedBlock.id }
        });
    }

    public trackFormattingForUndoRedo(
        blockIDs: string[],
        oldBlockModels: BlockModel[],
        updatedBlockModels: BlockModel[],
        isTypingWithFormat: boolean,
        selection: IBlockSelectionState
    ): void {
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.formattingAction,
            data: {
                blockIDs,
                oldBlockModels,
                updatedBlockModels,
                isTypingWithFormat,
                selectionState: selection
            }
        });
    }

    /**
     * Handles undo/redo recording for block addition
     *
     * @param {IAddBlockInteraction} args - The arguments for adding a block.
     * @param {BlockModel} blockModel - The block model.
     * @returns {void}
     * @hidden
     */
    public trackBlockAdditionForUndoRedo(args: IAddBlockInteraction, blockModel: BlockModel): void {
        if (args.isUndoRedoAction) { return; }
        const decoupledBlock: BlockModel = decoupleReference(sanitizeBlock(blockModel));
        const targetBlockModel: BlockModel = args.targetBlockModel ? decoupleReference(sanitizeBlock(args.targetBlockModel)) : null;
        const blockBeforeSplit: BlockModel = args.blockBeforeSplit ? decoupleReference(sanitizeBlock(args.blockBeforeSplit)) : null;

        this.pushActionIntoUndoStack({
            action: actionType.blockAdded,
            data: {
                blockId: blockModel.id,
                currentIndex: getBlockIndexById(blockModel.id, this.parent.getEditorBlocks()),
                splitOffset: args.splitOffset,
                isSplitting: args.isSplitting,
                blockBeforeSplit: blockBeforeSplit,
                blocksAfterSplit: [targetBlockModel, decoupledBlock]
            },
            oldBlockModel: decoupledBlock
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
        this.pushActionIntoUndoStack({
            action: actionType.blockRemoved,
            data: {
                blockId: blockId,
                currentIndex: blockIndex,
                splitOffset: args.splitOffset,
                isSplitting: args.isSplitting,
                contentElement: args.contentElement,
                blocksAfterSplit: args.blocksAfterSplit,
                blockBeforeSplit: args.blockBeforeSplit
            },
            oldBlockModel: decoupleReference(sanitizeBlock(blockModel))
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
        this.pushActionIntoUndoStack({
            action: actionType.blockMoved,
            data: {
                blockIds: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.blockId),
                fromIndex: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.index),
                toBlockId: args.toBlockId,
                toIndex: toBlockIndex,
                fromParentId: reversedFromModels.map((fromModel: IFromBlockData) => fromModel.parent ? fromModel.parent.id : ''),
                toParentId: toParentId,
                isMovedUp: isMovingUp
            }
        });
    }

    /**
     * Triggers event notification for block transformation
     *
     * @param {HTMLElement} blockElement The block element
     * @param {BlockModel} newBlock - The new transformed block
     * @param {BlockModel} oldBlock - The old block for reference
     * @param {boolean} isUndoRedoAction - Specifies whether it is undo redo action
     * @returns {void}
     * @hidden
     */
    public trackBlockTransformForUndoRedo(
        blockElement: HTMLElement,
        newBlock: BlockModel,
        oldBlock: BlockModel,
        isUndoRedoAction: boolean
    ): void {
        if (isUndoRedoAction) { return; }

        this.pushActionIntoUndoStack({
            action: actionType.blockTransformed,
            data: {
                blockId: blockElement.id,
                oldBlockModel: oldBlock,
                newBlockModel: decoupleReference(sanitizeBlock(newBlock))
            }
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
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.clipboardPaste,
            oldBlockModel: args.oldBlockModel,
            data: {
                type: args.insertionType,
                blocks: decoupleReference(args.blocks.map((block: BlockModel) => sanitizeBlock(block))),
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
        this.parent.undoRedoAction.pushActionIntoUndoStack({
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
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.lineBreakAdded,
            oldContents: args.oldContent,
            newContents: args.newContent,
            data: {
                blockId: args.blockId
            }
        });
    }

    /**
     * Handles expanded state of collapsible block for undo redo
     *
     * @param {string} blockId - The id of the block
     * @param {boolean} state - The collapsed state
     * @returns {void}
     * @hidden
     */
    public trackExpandedStateForUndoRedo(blockId: string, state: boolean): void {
        this.pushActionIntoUndoStack({
            action: actionType.isExpanded,
            data: { blockId: blockId, isExpanded: state }
        });
    }

    /**
     * Handles undo/redo recording for table block row addition
     *
     * @param {ITableRowInsertOptions} args - The arguments for adding a row.
     * @returns {void}
     * @hidden
     */
    public trackTableRowInsertionForUndoRedo(args: ITableRowInsertOptions): void {
        if (args.isUndoRedoAction) { return; }

        this.pushActionIntoUndoStack({
            action: actionType.tableRowInserted,
            data: { blockId: args.blockId, rowIndex: args.rowIndex, rowModel: args.rowModel }
        });
    }

    /**
     * Handles undo/redo recording for table block row deletion
     *
     * @param {ITableRowInsertOptions} args - The arguments for adding a row.
     * @returns {void}
     * @hidden
     */
    public trackTableRowDeletionForUndoRedo(args: ITableRowInsertOptions): void {
        if (args.isUndoRedoAction) { return; }

        this.pushActionIntoUndoStack({
            action: actionType.tableRowDeleted,
            data: { blockId: args.blockId, rowIndex: args.rowIndex, rowModel: args.rowModel }
        });
    }

    /**
     * Handles undo/redo recording for table block column addition
     *
     * @param {ITableColumnInsertOptions} args - The arguments for adding a row.
     * @returns {void}
     * @hidden
     */
    public trackTableColumnInsertionForUndoRedo(args: ITableColumnInsertOptions): void {
        if (args.isUndoRedoAction) { return; }

        this.pushActionIntoUndoStack({
            action: actionType.tableColumnInserted,
            data: {
                blockId: args.blockId,
                colIndex: args.colIndex,
                columnModel: args.columnModel,
                columnCells: args.columnCells
            }
        });
    }

    /**
     * Handles undo/redo recording for table block row deletion
     *
     * @param {ITableColumnInsertOptions} args - The arguments for adding a row.
     * @returns {void}
     * @hidden
     */
    public trackTableColumnDeletionForUndoRedo(args: ITableColumnInsertOptions): void {
        if (args.isUndoRedoAction) { return; }

        this.pushActionIntoUndoStack({
            action: actionType.tableColumnDeleted,
            data: {
                blockId: args.blockId,
                colIndex: args.colIndex,
                columnModel: args.columnModel,
                columnCells: args.columnCells
            }
        });
    }

    /**
     * Handles undo/redo recording for table cell clearance.
     *
     * @param {ITableCellsClearOperation} args - The arguments for table cell clearance.
     * @returns {void}
     * @hidden
     */
    public trackTableCellsClearForUndoRedo(args: ITableCellsClearOperation): void {
        this.pushActionIntoUndoStack({
            action: actionType.tableCellsCleared,
            data: {
                blockId: args.blockId,
                cells: args.cells
            }
        });
    }

    /**
     * Handles undo/redo recording for table cell level paste.
     *
     * @param {ITableCellsPasteOperation} args - The arguments for table cell paste.
     * @returns {void}
     * @hidden
     */
    public trackTableCellsPasteForUndoRedo(args: ITableCellsPasteOperation): void {
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.tableCellsPasted,
            data: {
                blockId: args.blockId,
                cells: args.cells,
                structureDelta: args.structureDelta
            }
        });
    }

    /**
     * Handles undo/redo recording for table header input.
     *
     * @param {ITableHeaderInputOperation} args - The arguments for table header input.
     * @returns {void}
     * @hidden
     */
    public trackTableHeaderInputForUndoRedo(args: ITableHeaderInputOperation): void {
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.tableHeaderInput,
            data: {
                blockId: args.blockId,
                oldColumns: args.oldColumns,
                updatedColumns: args.updatedColumns
            }
        });
    }

    /**
     * Handles undo/redo recording for table bulk row deletions
     *
     * @param {IBulkRowsDeleteOperation} args - The arguments for bulk rows deletion.
     * @returns {void}
     * @hidden
     */
    public trackBulkRowDeletionForUndoRedo(args: IBulkRowsDeleteOperation): void {
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.tableRowsDeleted,
            data: { blockId: args.blockId, rows: args.rows }
        });
    }

    /**
     * Handles undo/redo recording for table bulk column deletions
     *
     * @param {IBulkColumnsDeleteOperation} args - The arguments for bulk column deletion.
     * @returns {void}
     * @hidden
     */
    public trackBulkColumnDeletionForUndoRedo(args: IBulkColumnsDeleteOperation): void {
        this.parent.undoRedoAction.pushActionIntoUndoStack({
            action: actionType.tableColumnsDeleted,
            data: { blockId: args.blockId, cols: args.cols }
        });
    }

    /**
     * Checks whether the undo stack is empty or not.
     *
     * @returns {boolean} Returns true if the undo stack is not empty.
     * @hidden
     */
    public canUndo(): boolean {
        return this.index >= 0 && this.undoRedoStack.length > 0;
    }

    /**
     * Checks whether the redo stack is empty or not.
     *
     * @returns {boolean} Returns true if the redo stack is not empty.
     * @hidden
     */
    public canRedo(): boolean {
        return this.undoRedoStack.length > 0 && this.index < this.undoRedoStack.length - 1;
    }

    /**
     * Clears the undo and redo stack.
     *
     * @returns {void}
     * @hidden
     */
    public clear(): void {
        this.undoRedoStack = [];
        this.index = -1;
    }

    public destroy(): void {
        this.removeEventListener();
        this.clear();
        this.undoRedoManager = null;
    }

    /**
     * Adjusts undo and redo stacks to respect the new undoRedoStack limit
     *
     * @returns {void}
     * @hidden
     */
    public adjustUndoRedoStacks(): void {
        if (this.undoRedoStack.length > this.parent.undoRedoStack) {
            // Trim from the start to keep the most recent items
            const excess: number = this.undoRedoStack.length - this.parent.undoRedoStack;
            this.undoRedoStack = this.undoRedoStack.slice(excess);
            this.index = Math.max(this.index - excess, -1);
        }
        // Ensure index stays within bounds
        if (this.index >= this.undoRedoStack.length) {
            this.index = this.undoRedoStack.length - 1;
        }
    }

    /**
     * Applies the next future action during redo without emitting external push/pop changes.
     * Used internally for formatting flows to replay adjacent actions.
     *
     * @returns {void}
     */
    public applyNextRedoSibling(): void {
        // For redo, we don't need to increase the index values since those are handled automatically
        if (this.canRedo()) {
            const nextState: IUndoRedoState = this.undoRedoStack[this.index];
            if (nextState) {
                this.processUndoRedoAction(nextState);
            }
        }
    }

    /**
     * Applies the previous action during undo without emitting external push/pop changes.
     * Used internally for formatting flows to replay adjacent actions.
     *
     * @returns {void}
     */
    public applyNextUndoSibling(): void {
        if (this.canUndo()) {
            const prevState: IUndoRedoState = this.undoRedoStack[this.index - 1];
            if (prevState) {
                this.processUndoRedoAction(prevState);
                this.index--;
            }
        }
    }
}
