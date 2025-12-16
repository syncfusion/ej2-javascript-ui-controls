import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockType, ContentType } from '../../../models/enums';
import { DeletionType } from '../../../common/enums';
import { BaseChildrenProp, BlockModel, ContentModel, TableCellModel, ITableBlockSettings, TableColumnModel } from '../../../models/index';
import { getBlockContentElement, getBlockModelById, isNonContentEditableBlock } from '../../../common/utils/block';
import { IUndoRedoState, IMoveOperation, IBlockData, IAddOperation, IMoveBlocksInteraction, ITransformOperation, IMultiDeleteOperation, IClipboardPasteOperation, IDeleteBlockInteraction, IFromBlockData, IFormattingOperation } from '../../../common/interface';
import { UndoRedoAction } from '../../actions/undo';
import * as constants from '../../../common/constant';
import { actionType } from '../../../common/constant';
import { setCursorPosition } from '../../../common/utils/selection';
import { BlockManager } from '../../base/block-manager';
import { decoupleReference, findCellById, getDataCell, getTableElements, sanitizeBlock, toDomRow } from '../../../common/index';
import { ColMeta, IBulkColumnsDeleteOperation, IBulkRowsDeleteOperation, ITableCellsClearOperation, ITableCellsPasteOperation, ITableColumnInsertOptions, ITableHeaderInputOperation, ITableRowInsertOptions, PastedCellContext, RowMeta } from '../../base/interface';

/**
 * Manages undo redo actions for the BlockEditor component
 */
export class UndoRedoManager {

    private parent: BlockManager;
    public undoRedoAction: UndoRedoAction;

    constructor(manager: BlockManager, action: UndoRedoAction) {
        this.parent = manager;
        this.undoRedoAction = action;
    }

    /**
     * Renders the block with the previous state
     *
     * @param {string} blockId - Specifies the block id
     * @param {BlockModel} oldBlock - Specifies the old block model
     * @param {BlockModel} newBlock - Specifies the new block model
     * @returns {void} - Returns void
     * @hidden
     */
    public reRenderWithPreviousState(blockId: string, oldBlock: BlockModel, newBlock: BlockModel): void {
        const targetBlockModel: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        if (!targetBlockModel) { return; }
        const blockToReplace: BlockModel = this.undoRedoAction.isUndoing ? oldBlock : newBlock;

        this.parent.blockService.replaceBlock(targetBlockModel.id, blockToReplace);

        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
            data: [ { block: blockToReplace, oldBlock: oldBlock } ]
        }});
    }

    /**
     * Handles the undo redo for formatting action
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public handleFormattingUndoRedo(currentState: IUndoRedoState): void {
        const data: IFormattingOperation = currentState.data as IFormattingOperation;

        // On Redo, restore the contentchange action first and proceed with formatting action(applicable only for format on user typing)
        if (this.undoRedoAction.isRedoing && data.isTypingWithFormat) {
            this.undoRedoAction.applyNextRedoSibling();
        }

        data.blockIDs.forEach((blockId: string) => {
            this.reRenderWithPreviousState(
                blockId,
                data.oldBlockModels.find((block: BlockModel) => block.id === blockId),
                data.updatedBlockModels.find((block: BlockModel) => block.id === blockId)
            );
        });

        // On Undo, restore the contentchange action after processing formatting action(applicable only for format on user typing)
        if (this.undoRedoAction.isUndoing && data.isTypingWithFormat) {
            this.undoRedoAction.applyNextUndoSibling();
        }

        if (!data.isTypingWithFormat) {
            this.parent.formattingAction.nodeSelection.savedSelectionState = data.selectionState;
            this.parent.formattingAction.nodeSelection.restoreSelection();
        }
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
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();

        // Collect current indexes before mutating the array
        const fromEntries: IFromBlockData[] = this.parent.blockService.gatherBlocksInfoForMove(fromBlockIds);

        let oldDatas: IFromBlockData[] = this.parent.blockService.removeBlocksForMove(fromEntries);

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
            const insertToArray: BlockModel[] = parent ? (parent.properties as BaseChildrenProp).children : editorBlocks;
            entryModel.parentId = parent ? parent.id : '';
            insertToArray.splice(index, 0, entryModel);
        }

        this.parent.stateManager.updateManagerBlocks();

        // DOM updates
        for (const entry of args.isMovedUp ? oldDatas.reverse() : oldDatas) {
            const { blockId, index, parent }: IFromBlockData = entry;

            const fromElement: HTMLElement = this.parent.blockContainer.querySelector(`#${blockId}`) as HTMLElement;
            const allBlocks: HTMLElement[] = Array.from(this.parent.blockContainer.children) as HTMLElement[];
            // should reduce index only when any block is moved into a special block or last child block is moved outside from a special block (Callout, Toggle)
            const shouldReduceIndex: boolean = parent
                ? (parent.properties as BaseChildrenProp).children[((parent.properties as BaseChildrenProp)
                    .children.length - 1) as number].id === blockId
                : toParentId !== '';
            const indexVal: number = shouldReduceIndex ? index - 1 : index;
            const parentElement: HTMLElement = (parent ? this.parent.blockContainer.querySelector(`#${parent.id}`) : null);
            const toBlockDOM: HTMLElement = (parent
                ? parentElement.querySelectorAll('.' + constants.BLOCK_CLS)[parseInt(indexVal.toString(), 10)]
                : allBlocks[parseInt(indexVal.toString(), 10)]) as HTMLElement;

            const wrapperClassName: string = parent
                ? parent.blockType === BlockType.Callout ? '.' + constants.CALLOUT_CONTENT_CLS
                    : parent.blockType.toString().startsWith('Collapsible') ? '.' + constants.TOGGLE_CONTENT_CLS
                        : ''
                : '';

            const wrapperElement: HTMLElement = wrapperClassName
                ? parentElement.querySelector(wrapperClassName)
                : this.parent.blockContainer;

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
        const blockElementToFocus: HTMLElement = this.parent.getBlockElementById(blockIdToFocus);
        this.parent.updateFocusAndCursor(blockElementToFocus);
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
            this.parent.execCommand({ command: 'MoveBlock', state: moveBlockArgs });
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
            ? getBlockModelById(transformedData.blockId, this.parent.getEditorBlocks()) : null;
        const storedBlockModel: BlockModel = this.undoRedoAction.isUndoing
            ? transformedData.oldBlockModel : transformedData.newBlockModel;
        const blockElement: HTMLElement = this.parent.blockContainer.querySelector(`#${transformedData.blockId}`) as HTMLElement;
        const newBlockType: string = this.undoRedoAction.isUndoing
            ? transformedData.oldBlockModel.blockType : transformedData.newBlockModel.blockType;

        this.parent.blockCommand.handleBlockTransformation({
            block: currentBlockModel,
            blockElement: blockElement,
            newBlockType: newBlockType,
            isUndoRedoAction: true,
            props: storedBlockModel.properties
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

        if (data.deletionType === DeletionType.Entire) {
            this.restoreEntireEditor(data.deletedBlocks);
            setTimeout(() => {
                this.parent.editorMethods.selectAllBlocks();
            });
        }
        else if (data.deletionType === DeletionType.Partial) {
            this.restorePartialDeletion(state);
        }

        this.parent.stateManager.updateManagerBlocks();
    }

    private restoreEntireEditor(deletedBlocks: BlockModel[]): void {
        this.parent.setEditorBlocks(deletedBlocks);
        this.parent.blockContainer.innerHTML = '';
        this.parent.blockRenderer.renderBlocks(deletedBlocks);
    }

    private restorePartialDeletion(state: IUndoRedoState): void {
        const { deletedBlocks, firstBlockIndex }: IMultiDeleteOperation = state.data as IMultiDeleteOperation;
        if (!deletedBlocks.length) { return; }

        const [firstBlock, ...middleBlocks]: BlockModel[] = deletedBlocks;
        const lastBlock: BlockModel = middleBlocks.pop();

        const firstBlockParent: BlockModel | TableCellModel = getBlockModelById(firstBlock.parentId, this.parent.getEditorBlocks())
            || findCellById(firstBlock.parentId, this.parent.getEditorBlocks());
        const targetIndex: number = (firstBlockIndex - 1) >= 0 ? (firstBlockIndex - 1) : 0;
        let targetBlockElement: HTMLElement = this.parent.blockContainer.children[targetIndex as number] as HTMLElement;

        if (firstBlockParent) {
            const childBlocks: NodeListOf<HTMLElement> = this.parent.getBlockElementById(firstBlockParent.id).querySelectorAll('.' + constants.BLOCK_CLS);
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

        this.parent.listPlugin.recalculateMarkersForListItems();

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    private restoreSingleBlock(
        block: BlockModel,
        insertIndex: number,
        targetElement?: HTMLElement,
        isFirstBlock?: boolean
    ): HTMLElement | null {
        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        let blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
        const parent: BlockModel = getBlockModelById(block.parentId, editorBlocks);
        const tableParent: TableCellModel = findCellById(block.parentId, editorBlocks);
        const deleteCount: number = isFirstBlock ? 1 : 0;
        const insertArray: BlockModel[] = parent
            ? (parent.properties as BaseChildrenProp).children
            : (tableParent ? tableParent.blocks : editorBlocks);
        insertArray.splice(insertIndex, deleteCount, decoupleReference(sanitizeBlock(block)));

        if (blockElement) {
            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: block } ],
                preventEventTrigger: true
            }});
            return blockElement;
        }

        this.parent.eventService.addChange({
            action: 'Insertion',
            data: { block: block }
        });
        blockElement = this.parent.blockRenderer.createBlockElement(block);
        this.parent.togglePlaceholder(blockElement, false);

        if (targetElement) {
            targetElement.insertAdjacentElement(insertIndex === 0 ? 'beforebegin' : 'afterend', blockElement);
        }

        return blockElement;
    }

    private restoreMiddleBlocks(middleBlocks: BlockModel[], targetElement: HTMLElement): void {
        let currentInsertionPoint: HTMLElement = targetElement;

        for (const block of middleBlocks) {
            this.parent.execCommand({ command: 'AddBlock', state: {
                block,
                targetBlock: currentInsertionPoint,
                isUndoRedoAction: true,
                preventEventTrigger: true
            }});
            currentInsertionPoint = this.parent.getBlockElementById(block.id);
            this.parent.togglePlaceholder(currentInsertionPoint, false);
        }
    }

    private reDeleteBlocks(state: IUndoRedoState): void {
        const data: IMultiDeleteOperation = state.data as IMultiDeleteOperation;
        if (data.deletionType === DeletionType.Entire) {
            this.parent.setEditorBlocks([]);
            this.parent.blockCommand.createDefaultEmptyBlock(true, state.oldBlockModel ? state.oldBlockModel.id : '');
        }
        else if (data.deletionType === DeletionType.Partial) {
            const blocksToDelete: BlockModel[] = [];
            for (let i: number = 0; i < data.deletedBlocks.length; i++) {
                const block: BlockModel = data.deletedBlocks[i as number];
                const currentBlockModel: BlockModel = getBlockModelById(block.id, this.parent.getEditorBlocks());
                if (currentBlockModel) {
                    blocksToDelete.push(currentBlockModel);
                }
            }
            if (blocksToDelete.length > 0) {
                this.undoRedoAction.restoreSelectionState(state);
                this.parent.blockCommand.handleMultipleBlockDeletion(blocksToDelete, data.direction || 'previous', true);
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
        if (this.undoRedoAction.isUndoing) {
            this.handleClipboardUndo(currentState);
        }
        else {
            this.handleClipboardRedo(currentState);
        }
    }

    /**
     * Applies a table row action for undo/redo.
     * Decides whether to insert or delete a row based on action intent and current undo/redo phase.
     * When apply is 'insert':
     *  - Undo => perform delete
     *  - Redo => perform insert
     * When apply is 'delete':
     *  - Undo => perform insert
     *  - Redo => perform delete
     *
     * @param { ITableRowInsertOptions } data Payload that includes blockId, rowIndex and optional rowModel
     * @param { string } apply Indicates target action recorded in the stack ('insert' | 'delete')
     * @returns {void} - Returns void
     * @hidden
     */
    public processRowAction(data: ITableRowInsertOptions, apply: 'insert' | 'delete'): void {
        const shouldInsert: boolean = (apply === 'insert' && !this.undoRedoAction.isUndoing)
            || (apply === 'delete' && this.undoRedoAction.isUndoing);

        if (shouldInsert) {
            this.parent.tableService.addRowAt({
                blockId: data.blockId,
                rowIndex: data.rowIndex,
                rowModel: data.rowModel,
                isUndoRedoAction: true
            });
        } else {
            this.parent.tableService.deleteRowAt({
                blockId: data.blockId,
                modelIndex: data.rowIndex,
                isUndoRedoAction: true
            });
        }
    }

    /**
     * Applies a table column action for undo/redo.
     * Decides whether to insert or delete a column based on action intent and current undo/redo phase.
     * When apply is 'insert':
     *  - Undo => perform delete
     *  - Redo => perform insert
     * When apply is 'delete':
     *  - Undo => perform insert
     *  - Redo => perform delete
     *
     * @param { ITableColumnInsertOptions } data Payload that includes blockId, colIndex and optional columnModel
     * @param { string } apply Indicates target action recorded in the stack ('insert' | 'delete')
     * @returns {void} - Returns void
     * @hidden
     */
    public processColumnAction(data: ITableColumnInsertOptions, apply: 'insert' | 'delete'): void {
        const shouldInsert: boolean = (apply === 'insert' && !this.undoRedoAction.isUndoing)
            || (apply === 'delete' && this.undoRedoAction.isUndoing);

        if (shouldInsert) {
            this.parent.tableService.addColumnAt({
                blockId: data.blockId,
                colIndex: data.colIndex,
                columnModel: data.columnModel,
                columnCells: data.columnCells,
                isUndoRedoAction: true
            });
        } else {
            this.parent.tableService.deleteColumnAt({
                blockId: data.blockId,
                colIndex: data.colIndex,
                isUndoRedoAction: true
            });
        }
    }

    /**
     * Handles undo/redo for table cell clearing.
     * On undo: restores each affected cell's previous blocks.
     * On redo: clears the blocks for each affected cell.
     *
     * @param { IUndoRedoState } state that contains blockId and a list of cells with previous blocks
     * @returns {void} - Returns void
     * @hidden
     */
    public handleTableCellsCleared(state: IUndoRedoState): void {
        const data: ITableCellsClearOperation = state.data as ITableCellsClearOperation;
        const ctx: { table: HTMLTableElement, props: ITableBlockSettings } = getTableElements(
            data.blockId,
            this.parent.rootEditorElement,
            this.parent.getEditorBlocks()
        );
        if (!ctx) { return; }
        const { table } = ctx;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(data.blockId, this.parent.getEditorBlocks()));
        if (this.undoRedoAction.isUndoing) {
            data.cells.forEach((cell: { dataRow: number; dataCol: number; prevBlocks: BlockModel[] }) => {
                this.parent.tableService.setCellBlocks(table, cell.dataRow, cell.dataCol, cell.prevBlocks);
            });
        } else {
            data.cells.forEach((cell: { dataRow: number; dataCol: number; prevBlocks: BlockModel[] }) => {
                this.parent.tableService.setCellBlocks(table, cell.dataRow, cell.dataCol, []);
            });
        }
        const updatedBlock: BlockModel = decoupleReference(getBlockModelById(data.blockId, this.parent.getEditorBlocks()));
        this.parent.tableService.triggerBlockUpdate(updatedBlock, oldBlock);
    }


    public handleTableCellsPasted(state: IUndoRedoState): void {
        const data: ITableCellsPasteOperation = state.data as ITableCellsPasteOperation;
        const ctx: { table: HTMLTableElement, props: ITableBlockSettings } = getTableElements(
            data.blockId,
            this.parent.rootEditorElement,
            this.parent.getEditorBlocks()
        );
        if (!ctx) { return; }
        const { table, props } = ctx;
        const oldBlock: BlockModel = decoupleReference(getBlockModelById(data.blockId, this.parent.getEditorBlocks()));

        const applyBlocks: (useNew: boolean) => void = (useNew: boolean) => {
            data.cells.forEach((cell: PastedCellContext) => {
                const blocks: BlockModel[] = useNew ? cell.newBlocks : cell.oldBlocks;
                this.parent.tableService.setCellBlocks(table, cell.dataRow, cell.dataCol, blocks);
            });
        };

        if (this.undoRedoAction.isUndoing) {
            // Remove structure added on paste
            if (data.structureDelta) {
                if (data.structureDelta.colsAdded && data.structureDelta.colsAdded.length) {
                    [...data.structureDelta.colsAdded].sort((a: number, b: number) => b - a).forEach((c: number) => {
                        this.parent.tableService.deleteColumnAt({ blockId: data.blockId, colIndex: c, isUndoRedoAction: true });
                    });
                }
                if (data.structureDelta.rowsAdded && data.structureDelta.rowsAdded.length) {
                    [...data.structureDelta.rowsAdded].sort((a: number, b: number) => b - a).forEach((r: number) => {
                        this.parent.tableService.deleteRowAt({ blockId: data.blockId, modelIndex: r, isUndoRedoAction: true });
                    });
                }
            }
            applyBlocks(false);
        } else {
            // Rebuild structure before reapplying new blocks
            if (data.structureDelta) {
                if (data.structureDelta.rowsAdded && data.structureDelta.rowsAdded.length) {
                    [...data.structureDelta.rowsAdded].sort((a: number, b: number) => a - b).forEach((r: number) => {
                        this.parent.tableService.addRowAt({ blockId: data.blockId, rowIndex: r, isUndoRedoAction: true });
                    });
                }
                if (data.structureDelta.colsAdded && data.structureDelta.colsAdded.length) {
                    [...data.structureDelta.colsAdded].sort((a: number, b: number) => a - b).forEach((c: number) => {
                        this.parent.tableService.addColumnAt({ blockId: data.blockId, colIndex: c, isUndoRedoAction: true });
                    });
                }
            }
            applyBlocks(true);
        }

        // Restore cell focus to first cell
        if (data.cells[0]) {
            const cellToFocus: HTMLElement = getDataCell(
                table, toDomRow(data.cells[0].dataRow, props.enableHeader), data.cells[0].dataCol
            );
            this.parent.tableService.removeCellFocus(table);
            this.parent.tableService.addCellFocus(cellToFocus, true);
        }

        const updatedBlock: BlockModel = decoupleReference(getBlockModelById(data.blockId, this.parent.getEditorBlocks()));
        this.parent.tableService.triggerBlockUpdate(updatedBlock, oldBlock);
    }

    public handleBulkRowsDeleted(currentState: IUndoRedoState): void {
        const data: IBulkRowsDeleteOperation = currentState.data as IBulkRowsDeleteOperation;
        const ctx: { table: HTMLTableElement, props: ITableBlockSettings } = getTableElements(
            data.blockId, this.parent.rootEditorElement, this.parent.getEditorBlocks()
        );
        if (!ctx) { return; }

        if (this.undoRedoAction.isUndoing) {
            // Re-insert rows at their original indices (ascending)
            [...data.rows].sort((a: RowMeta, b: RowMeta) => a.index - b.index).forEach((r: RowMeta) => {
                this.parent.tableService.addRowAt({
                    blockId: data.blockId,
                    rowIndex: r.index,
                    rowModel: r.rowModel,
                    isUndoRedoAction: true
                });
            });
        } else {
            // Re-delete rows (descending DOM order)
            [...data.rows].sort((a: RowMeta, b: RowMeta) => b.index - a.index).forEach((r: RowMeta) => {
                this.parent.tableService.deleteRowAt({
                    blockId: data.blockId,
                    modelIndex: r.index,
                    isUndoRedoAction: true
                });
            });
        }
    }

    public handleBulkColumnsDeleted(currentState: IUndoRedoState): void {
        const data: IBulkColumnsDeleteOperation = currentState.data as IBulkColumnsDeleteOperation;
        const ctx: { table: HTMLTableElement, props: ITableBlockSettings } = getTableElements(
            data.blockId, this.parent.rootEditorElement, this.parent.getEditorBlocks()
        );
        if (!ctx) { return; }

        if (this.undoRedoAction.isUndoing) {
            // Re-insert columns (ascending index)
            [...data.cols].sort((a: ColMeta, b: ColMeta) => a.index - b.index).forEach((c: ColMeta) => {
                this.parent.tableService.addColumnAt({
                    blockId: data.blockId,
                    colIndex: c.index,
                    columnModel: c.columnModel,
                    columnCells: c.columnCells,
                    isUndoRedoAction: true
                });
            });
        } else {
            // Re-delete columns (descending index)
            [...data.cols].sort((a: ColMeta, b: ColMeta) => b.index - a.index).forEach((c: ColMeta) => {
                this.parent.tableService.deleteColumnAt({
                    blockId: data.blockId,
                    colIndex: c.index,
                    isUndoRedoAction: true
                });
            });
        }
    }

    public handleTableHeaderUndoRedo(state: IUndoRedoState): void {
        const data: ITableHeaderInputOperation = state.data as ITableHeaderInputOperation;
        const blockModel: BlockModel = getBlockModelById(data.blockId, this.parent.getEditorBlocks());
        if (!blockModel) { return; }

        const blockElement: HTMLElement = this.parent.getBlockElementById(blockModel.id);
        const props: ITableBlockSettings = blockModel.properties as ITableBlockSettings;
        const tableHeaders: NodeListOf<HTMLTableCellElement> = blockElement.querySelectorAll('thead th:not(.e-row-number)');
        const columnsToReplace: TableColumnModel[] = this.undoRedoAction.isUndoing ? data.oldColumns : data.updatedColumns;
        tableHeaders.forEach((headerElement: HTMLTableCellElement) => {
            const colIndex: number = parseInt(headerElement.getAttribute('data-col'), 10);
            const textToUpdate: string = columnsToReplace[colIndex as number].headerText;

            //DOM and Model
            headerElement.textContent = props.columns[colIndex as number].headerText = textToUpdate;
        });
    }

    private handleClipboardUndo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, oldContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteOperation = currentState.data as IClipboardPasteOperation;
        const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.parent.getEditorBlocks());
        const oldTargetBlock: BlockModel = decoupleReference(sanitizeBlock(targetBlock));

        if (type === 'blocks') {
            const clipboardBlocks: BlockModel[] = clipboardData.blocks;
            const oldBlock: BlockModel = decoupleReference(sanitizeBlock(currentState.oldBlockModel));
            const isEmptyTargetBlock: boolean = oldBlock && oldBlock.content
                && ((oldBlock.content.length === 1 && oldBlock.content[0].contentType === ContentType.Text &&
                    (oldBlock.content[0].content === '' || !oldBlock.content[0].content))
                || !oldBlock.content.length);

            if (blocks && blocks.length > 0) {
                blocks.forEach((block: BlockModel) => {
                    this.parent.blockCommand.deleteBlock({
                        blockElement: this.parent.getBlockElementById(block.id),
                        isUndoRedoAction: true,
                        preventEventTrigger: true
                    });
                });
            }

            if (isEmptyTargetBlock) {
                this.parent.blockService.replaceBlock(targetBlock.id, oldBlock);

                this.parent.observer.notify('modelChanged', { type: 'ReplaceBlock', state: {
                    targetBlockId: targetBlockId,
                    block: oldBlock,
                    oldBlock: oldTargetBlock,
                    preventEventTrigger: true
                }});
            }
            else if (!isPastedAtStart) {
                const pastedContentIds: Set<string> = new Set(clipboardBlocks[0].content.map((c: ContentModel) => c.id));
                const newContent: ContentModel[] = targetBlock.content.filter((content: ContentModel) => !pastedContentIds.has(content.id));
                this.parent.blockService.updateContent(targetBlock.id, newContent);

                this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                    data: [ { block: targetBlock, oldBlock: oldTargetBlock } ],
                    preventEventTrigger: true
                }});
                this.undoRedoAction.applyNextUndoSibling();
            }
        }
        else if (type === 'block') {
            this.parent.blockCommand.deleteBlock({
                blockElement: this.parent.getBlockElementById(blocks[0].id),
                isUndoRedoAction: true,
                preventEventTrigger: true
            });
        }
        else if (type === 'content') {
            this.parent.blockService.updateContent(targetBlock.id, oldContent);

            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: targetBlock, oldBlock: oldTargetBlock } ],
                preventEventTrigger: true
            }});
        }
        // Pop the deletion action from the undo stack if user selected a content and pasted
        if (isSelectivePaste) {
            this.undoRedoAction.applyNextUndoSibling();
        }
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    private handleClipboardRedo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, newContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteOperation = currentState.data as IClipboardPasteOperation;
        // Pop the deletion action from the redo stack if user selected a content and pasted
        if (isSelectivePaste) {
            this.undoRedoAction.applyNextRedoSibling();
        }

        const editorBlocks: BlockModel[] = this.parent.getEditorBlocks();
        const targetBlock: BlockModel = getBlockModelById(targetBlockId, editorBlocks);
        const oldTargetBlock: BlockModel = decoupleReference(sanitizeBlock(targetBlock));
        const clipboardBlocks: BlockModel[] = clipboardData ? clipboardData.blocks : null;
        const specialTypes: string[] = [BlockType.Table, BlockType.Image];
        const isFirstBlkSpecialType: boolean = clipboardBlocks ? specialTypes.indexOf(clipboardData.blocks[0].blockType) !== -1 : false;
        let isFirstBlkProcessed: boolean = false;

        if (type === 'blocks') {
            const isEmptyTargetBlock: boolean = targetBlock && targetBlock.content
                && ((targetBlock.content.length === 1 && targetBlock.content[0].contentType === ContentType.Text &&
                    ((targetBlock.content[0].content === '' || !targetBlock.content[0].content)))
                || !currentState.oldBlockModel.content.length);

            if (isEmptyTargetBlock) {
                isFirstBlkProcessed = true;
                const block: BlockModel = decoupleReference(sanitizeBlock(clipboardBlocks[0]));
                this.parent.blockService.generateNewIdsForBlock(block);
                block.id = targetBlockId;

                this.parent.blockService.replaceBlock(targetBlock.id, block);
                this.parent.stateManager.updateManagerBlocks();

                const updatedBlockModel: BlockModel = getBlockModelById(block.id, this.parent.getEditorBlocks());
                this.parent.observer.notify('modelChanged', { type: 'ReplaceBlock', state: {
                    targetBlockId: targetBlockId,
                    block: updatedBlockModel,
                    oldBlock: oldTargetBlock,
                    preventEventTrigger: true
                }});
            }
            else if (!isPastedAtStart && !isFirstBlkSpecialType) {
                isFirstBlkProcessed = true;
                this.undoRedoAction.applyNextRedoSibling();

                const originalBlock: BlockModel = getBlockModelById(targetBlockId, this.parent.getEditorBlocks());
                const originalClone: BlockModel = decoupleReference(sanitizeBlock(originalBlock));
                this.parent.blockService.updateContent(originalBlock.id, [
                    ...originalBlock.content,
                    ...clipboardBlocks[0].content
                ]);
                this.parent.stateManager.updateManagerBlocks();
                this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                    data: [ { block: originalBlock, oldBlock: originalClone } ],
                    preventEventTrigger: true
                }});
            }

            this.parent.blockCommand.addBulkBlocks({
                blocks: (clipboardBlocks.slice(!isFirstBlkProcessed ? 0 : 1)),
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'blocks'
            });
        }
        else if (type === 'block') {
            this.parent.blockCommand.addBulkBlocks({
                blocks: blocks,
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'block'
            });
        }
        else if (type === 'content') {
            this.parent.blockService.updateContent(targetBlock.id, newContent);
            this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                data: [ { block: targetBlock, oldBlock: oldTargetBlock } ],
                preventEventTrigger: true
            }});
        }
        this.parent.stateManager.updateManagerBlocks();

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    /**
     * Handles undo redo for block addition and deletion
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public blockAdditionDeletionUndoRedo(currentState: IUndoRedoState): void {
        switch (currentState.action) {
        case actionType.blockAdded: {
            if (this.undoRedoAction.isUndoing) {
                this.removeBlock(currentState);
            }
            else {
                this.createBlock(currentState);
            }
            break;
        }
        case actionType.blockRemoved:
            if (this.undoRedoAction.isUndoing) {
                this.createBlock(currentState);
            }
            else {
                this.removeBlock(currentState);
            }
            break;
        }
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

        const { blockBeforeSplit, blocksAfterSplit, isSplitting, splitOffset }: IAddOperation = (currentState.data) as IAddOperation;
        const parentId: string = blockBeforeSplit ? blockBeforeSplit.parentId : currentState.oldBlockModel.parentId;
        const parentBlock: BlockModel = getBlockModelById(parentId, this.parent.getEditorBlocks());
        const parentCell: TableCellModel = findCellById(parentId, this.parent.getEditorBlocks());
        const targetIndex: number = deletedBLockIndex === 0 ? deletedBLockIndex : deletedBLockIndex - 1;
        const afterBlockModel: BlockModel = parentBlock
            ? (parentBlock.properties as BaseChildrenProp).children[targetIndex as number]
            : (parentCell ? parentCell.blocks[targetIndex as number] : this.parent.getEditorBlocks()[targetIndex as number]);
        let currentBlockElement: HTMLElement;

        const addedBlock: BlockModel = this.parent.blockCommand.addBlock({
            targetBlock: currentBlockElement || this.parent.blockContainer.querySelector('#' + afterBlockModel.id),
            blockType: isSplitting ? blocksAfterSplit[1].blockType : currentState.oldBlockModel.blockType,
            block: isSplitting ? blocksAfterSplit[1] : currentState.oldBlockModel,
            isAfter: deletedBLockIndex > 0,
            isUndoRedoAction: true,
            preventEventTrigger: true
        });

        if (isSplitting && blocksAfterSplit) {
            const currentId: string = (currentState.action === 'blockRemoved' && splitOffset === 0)
                ? blocksAfterSplit[1].id
                : blocksAfterSplit[0].id;
            this.parent.blockService.replaceBlock(currentId, blocksAfterSplit[0]);
            this.parent.stateManager.updateManagerBlocks();

            if (splitOffset === 0) {
                currentBlockElement = this.parent.blockRenderer.createAndReplaceBlockElement(currentId, blocksAfterSplit[0].id);
            }
            else {
                this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                    data: [ { block: getBlockModelById(blocksAfterSplit[0].id, this.parent.getEditorBlocks()) } ],
                    preventEventTrigger: true
                }});
            }
        }

        if (!isSplitting) {
            const newBlockElement: HTMLElement = this.parent.getBlockElementById(addedBlock.id);
            if (isNonContentEditableBlock(currentState.oldBlockModel.blockType)) {
                const adjacentSibling: HTMLElement = (newBlockElement.nextElementSibling
                    || newBlockElement.previousElementSibling) as HTMLElement;
                if (adjacentSibling) {
                    this.parent.setFocusAndUIForNewBlock(adjacentSibling);
                }
            }
            if (currentState.oldBlockModel.blockType === BlockType.Callout) {
                this.parent.setFocusAndUIForNewBlock(newBlockElement.querySelector('.' + constants.BLOCK_CLS));
            }
        }

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }

    /**
     * Removes block with given state
     *
     * @param {IUndoRedoState} currentState - Specifies the current state of the undo redo action
     * @returns {void} - Returns void
     * @hidden
     */
    public removeBlock(currentState: IUndoRedoState): void {
        const { splitOffset, isSplitting }: IDeleteBlockInteraction = (currentState.data) as IDeleteBlockInteraction;
        const { blockBeforeSplit, blocksAfterSplit }: IAddOperation = (currentState.data) as IAddOperation;
        const blockElement: HTMLElement = this.parent.blockContainer.querySelector(`#${(currentState.data as IBlockData).blockId}`) as HTMLElement;
        const shouldNeedsMerge: boolean = !isNOU(splitOffset) && splitOffset > -1 && isSplitting;

        if (shouldNeedsMerge) {
            let targetBlockElement: HTMLElement = this.parent.getBlockElementById(blockBeforeSplit.id);
            const newCursorPos: number = getBlockContentElement(targetBlockElement).textContent.length;
            const newBlock: BlockModel = (currentState.action === 'blockRemoved' && splitOffset === 0)
                ? blocksAfterSplit[1]
                : blockBeforeSplit;
            this.parent.blockCommand.deleteBlock({ blockElement: blockElement, isUndoRedoAction: true, preventEventTrigger: true });
            this.parent.blockService.replaceBlock(blockBeforeSplit.id, newBlock);
            this.parent.stateManager.updateManagerBlocks();

            if (splitOffset === 0) {
                targetBlockElement = this.parent.blockRenderer.createAndReplaceBlockElement(blockBeforeSplit.id, newBlock.id);
            }
            else {
                this.parent.observer.notify('modelChanged', { type: 'ReRenderBlockContent', state: {
                    data: [ { block: getBlockModelById(blockBeforeSplit.id, this.parent.getEditorBlocks()) } ],
                    preventEventTrigger: true
                }});
            }
            this.parent.setFocusToBlock(targetBlockElement);
            setCursorPosition(getBlockContentElement(targetBlockElement), newCursorPos);
        }
        else {
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.parent.setFocusAndUIForNewBlock(adjacentBlock);
            }
            this.parent.blockCommand.deleteBlock({ blockElement: blockElement, isUndoRedoAction: true, preventEventTrigger: true });
        }

        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
    }
}
