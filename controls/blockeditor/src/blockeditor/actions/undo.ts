import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { ContentType, DeletionType } from '../base/enums';
import { BlockModel, ContentModel } from '../models/index';
import { getBlockContentElement, getBlockIndexById, getBlockModelById } from '../utils/block';
import { setCursorPosition, getNodeFromPath, captureSelectionState } from '../utils/selection';
import { sanitizeBlock } from '../utils/transform';
import { deepClone } from '../utils/common';
import { UndoRedoEventArgs } from '../base/eventargs';
import { ContentRenderer } from '../renderer/index';
import { IUndoRedoState, IMoveBlock, IData, IAdd, IMoveBlockArgs, IUndoRedoSelection, ITransform, IMultipleBlockDeletion, IClipboardPasteUndoRedo, IAddBlockArgs, IDeleteBlockArgs, IIndentBlockArgs } from '../base/interface';
import { findClosestParent } from '../utils/dom';

/**
 * `UndoRedoManager` module is used to handle undo and redo actions.
 */
export class UndoRedoAction {
    private editor: BlockEditor;
    private contentRenderer: ContentRenderer;
    public undoStack: IUndoRedoState[] = [];
    public redoStack: IUndoRedoState[] = [];
    private isUndoing: boolean = false;
    private isRedoing: boolean = false;

    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.contentRenderer = new ContentRenderer(this.editor);
        this.addEventListener();
    }

    private addEventListener(): void {
        this.editor.on('contentChanged', this.onContentChanged, this);
        this.editor.on('blockAdded', this.onBlockAddition, this);
        this.editor.on('blockRemoved', this.onBlockRemoval, this);
        this.editor.on('blockMoved', this.onBlockMove, this);
        this.editor.on('blockTransformed', this.onBlockTransform, this);
    }
    private onContentChanged(args: any): void {
        this.pushToUndoStack({
            oldBlockModel: args.oldBlockModel,
            updatedBlockModel: args.updatedBlockModel,
            action: 'contentChanged',
            data: { blockId: args.updatedBlockModel.id }
        });
    }
    private onBlockAddition(args: any): void {
        this.pushToUndoStack({
            action: 'blockAdded',
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
        this.pushToUndoStack({
            action: 'blockRemoved',
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
    private onBlockMove(args: IMoveBlockArgs): void {
        this.pushToUndoStack({
            action: 'blockMoved',
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
    private onBlockTransform(args: any): void {
        this.pushToUndoStack({
            action: 'blockTransformed',
            data: {
                blockId: args.blockId,
                oldBlockType: args.oldBlockType,
                newBlockType: args.newBlockType
            }
        });
    }
    pushToUndoStack(state?: IUndoRedoState): void {
        if (this.editor.blocksInternal.length === 0) {
            return;
        }
        const isSelectionPresent: boolean = !isNOU(this.editor.previousSelection);
        const isTextSelected: boolean = isSelectionPresent && !this.editor.previousSelection.isCollapsed;
        const currentState: IUndoRedoState = {
            ...state,
            undoSelection: isSelectionPresent ? this.editor.previousSelection : captureSelectionState(),
            redoSelection: ((isTextSelected && !(state.action === 'formattingAction')) || (isSelectionPresent && state.action === 'blockTransformed')) ? this.editor.previousSelection : captureSelectionState()
        };
        this.undoStack = [...this.undoStack, currentState];
        this.redoStack = [];
        if (this.undoStack.length > this.editor.undoRedoStack) {
            this.undoStack.shift();
        }
        // Clear pre-change selection after pushing to stack
        this.editor.previousSelection = undefined;
    }

    /**
     * Handles the undo operation.
     *
     * @returns {void}
     * @hidden
     */
    public undo(): void {
        this.editor.inlineToolbarModule.hideInlineToolbar();
        if (this.undoStack.length < 1) {
            return;
        }
        if (this.canUndo()) {
            this.isUndoing = true;

            const currentState: IUndoRedoState = this.undoStack.pop();
            if (currentState) {
                this.updateBlockEditor(currentState);
                this.updatePlaceHolder();
            }
            this.redoStack = [...this.redoStack, currentState];
            this.isUndoing = false;
            const eventArgs: UndoRedoEventArgs = {
                isUndo: true,
                // user: this.editor.getCurrentUser(),
                content: currentState.oldBlockModel,
                previousContent: currentState.updatedBlockModel
            };
            this.editor.trigger('undoRedoPerformed', eventArgs);
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
    }

    /**
     * Handles the redo operation.
     *
     * @returns {void}
     * @hidden
     */
    public redo(): void {
        this.editor.inlineToolbarModule.hideInlineToolbar();
        if (this.redoStack.length === 0) {
            return;
        }
        if (this.canRedo()) {
            this.isRedoing = true;

            const nextState: IUndoRedoState = this.redoStack.pop();
            if (nextState) {
                this.updateBlockEditor(nextState);
                this.updatePlaceHolder();
            }
            this.undoStack = [...this.undoStack, nextState];

            this.isRedoing = false;
            const eventArgs: UndoRedoEventArgs = {
                isUndo: false,
                // user: this.editor.getCurrentUser(),
                content: nextState.updatedBlockModel,
                previousContent: nextState.oldBlockModel
            };
            this.editor.trigger('undoRedoPerformed', eventArgs);
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
    }
    private updatePlaceHolder(): void {
        const blockContents: NodeListOf<HTMLElement> = this.editor.element.querySelectorAll('.e-block-content');
        blockContents.forEach((el: HTMLElement) => {
            if (el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', '');
            }
        });
        if (this.editor.currentFocusedBlock) {
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        }
    }
    private updateBlockEditor(currentState: IUndoRedoState): void {
        this.updateBlocks(currentState);
        if (currentState.action === 'blockAdded'
            || currentState.action === 'blockRemoved'
            || currentState.action === 'blockMoved') {
            return;
        }
        this.updateCursorSelection(currentState);
    }
    private updateCursorSelection(currentState: IUndoRedoState): void {
        const selection: IUndoRedoSelection = this.isUndoing ? currentState.undoSelection : currentState.redoSelection;
        if (selection) {
            const startBlock: HTMLElement = document.getElementById(selection.startBlockId);
            const endBlock: HTMLElement = document.getElementById(selection.endBlockId);

            if (startBlock && endBlock) {
                const startNode: Node = getNodeFromPath(startBlock, selection.startContainerPath);
                const endNode: Node = getNodeFromPath(endBlock, selection.endContainerPath);
                const isSelectivePaste: boolean = currentState.action === 'clipboardPaste'
                    && (currentState.data as IClipboardPasteUndoRedo).isSelectivePaste;
                const canRestoreForActions: boolean = currentState.action === 'indent' || currentState.action === 'formattingAction'
                    || currentState.action === 'multipleBlocksDeleted';
                if ((this.isUndoing || (canRestoreForActions && this.isRedoing))
                    && !selection.isCollapsed && startNode && endNode && !currentState.isFormattingOnUserTyping) {
                    this.restoreSelection(startNode, endNode, selection.startOffset, selection.endOffset);
                }
                else if (!isSelectivePaste && ((this.isRedoing && startNode) || selection.isCollapsed && startNode)) {
                    const blockElement: HTMLElement = findClosestParent(startNode, '.e-block');
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
    private restoreSelection(startNode: Node, endNode: Node, startOffset: number, endOffset: number): void {
        const selection: Selection | null = window.getSelection();
        const range: Range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    private updateBlocks(currentState: IUndoRedoState): void {
        switch (currentState.action) {
        case 'contentChanged':
        case 'formattingAction': {
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            const isFormattingOnUserTyping: boolean = currentState.action === 'formattingAction' && currentState.isFormattingOnUserTyping;
            if (isFormattingOnUserTyping) {
                // On Redo, restore the contentchange action first and proceed with formatting action
                if (this.isRedoing) {
                    const contentChangedAction: IUndoRedoState = this.redoStack.pop();
                    this.undoStack = this.undoStack.concat([contentChangedAction]);
                    if (contentChangedAction) {
                        this.updateBlockEditor(contentChangedAction);
                    }
                }
            }
            const targetBlockModel: BlockModel = getBlockModelById((currentState.data as IData).blockId, this.editor.blocksInternal);
            const indexToInsert: number = getBlockIndexById(targetBlockModel.id, this.editor.blocksInternal);
            const parentBlock: BlockModel = getBlockModelById(targetBlockModel.parentId, this.editor.blocksInternal);
            if (parentBlock) {
                const parentIndex: number = getBlockIndexById(parentBlock.id, this.editor.blocksInternal);
                parentBlock.children.splice(indexToInsert, 1, this.isUndoing ? currentState.oldBlockModel : currentState.updatedBlockModel);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any).setProperties({ children: parentBlock.children }, true);
            }
            else {
                this.editor.blocksInternal.splice(
                    indexToInsert,
                    1,
                    this.isUndoing ? currentState.oldBlockModel : currentState.updatedBlockModel
                );
            }
            (this.editor as any).isProtectedOnChange = prevOnChange;
            this.editor.blockAction.updatePropChangesToModel();
            const blockId: string = currentState.data ? (currentState.data as IData).blockId : null;
            const blockModel: BlockModel = this.isUndoing ? currentState.oldBlockModel : currentState.updatedBlockModel;
            const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`) as HTMLElement;
            const contentBlock: HTMLElement = blockElement.querySelector('.e-block-content') as HTMLElement;
            if (contentBlock) {
                this.contentRenderer.renderContent(blockModel, contentBlock);
            }
            if (isFormattingOnUserTyping) {
                // On Undo, restore the contentchange action after formatting action
                if (this.isUndoing) {
                    const contentChangedAction: IUndoRedoState = this.undoStack.pop();
                    this.redoStack = this.redoStack.concat([contentChangedAction]);
                    if (contentChangedAction) {
                        this.updateBlockEditor(contentChangedAction);
                    }
                }
            }
            break;
        }
        case 'indent': {
            if (this.isUndoing) {
                this.editor.blockAction.handleBlockIndentation({
                    blockIDs: (currentState.data as IIndentBlockArgs).blockIDs,
                    shouldDecrease: true,
                    isUndoRedoAction: true
                });
            }
            else {
                this.editor.blockAction.handleBlockIndentation({
                    blockIDs: (currentState.data as IIndentBlockArgs).blockIDs,
                    shouldDecrease: false,
                    isUndoRedoAction: true
                });
            }
            break;
        }
        case 'lineBreakAdded': {
            const state: IData = currentState.data as IData;
            const blockModel: BlockModel = getBlockModelById(state.blockId, this.editor.blocksInternal);
            // Re-render the block with the corresponding contents
            if (blockModel) {
                blockModel.content = this.isUndoing ? currentState.oldContents : currentState.newContents;
                this.editor.reRenderBlockContent(blockModel);
            }
            break;
        }
        case 'blockAdded': {
            if (this.isUndoing) {
                this.removeBlock(currentState);
            }
            else {
                this.createBlock(currentState);
            }
            break;
        }
        case 'blockRemoved':
            if (this.isUndoing) {
                this.createBlock(currentState);
            }
            else {
                this.removeBlock(currentState);
            }
            break;
        case 'blockMoved': {
            const moveData: IMoveBlock = currentState.data as IMoveBlock;
            const isUndoing: boolean = this.isUndoing;
            this.editor.blockAction.moveBlock({
                fromBlockIds: moveData.blockIds,
                fromIndex: moveData.fromIndex,
                toBlockId: moveData.toBlockId,
                toIndex: moveData.toIndex,
                fromParentId: moveData.fromParentId,
                toParentId: moveData.toParentId,
                isUndoRedoAction: true,
                isUndoing: isUndoing,
                isMovedUp: moveData.isMovedUp
            });
            break;
        }
        case 'multipleBlocksDeleted': {
            this.handleMultipleBlocksUndoRedo(currentState);
            break;
        }
        case 'blockTransformed': {
            const blockId: string = currentState.data ? (currentState.data as ITransform).blockId : null;
            const blockModel: BlockModel = blockId ? getBlockModelById(blockId, this.editor.blocksInternal) : null;
            const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`) as HTMLElement;
            const selectedItem: string = this.isUndoing
                ? (currentState.data as ITransform).oldBlockType
                : (currentState.data as ITransform).newBlockType;
            const specialTypes: string[] = ['Divider', 'ToggleParagraph', 'ToggleHeading1', 'ToggleHeading2', 'ToggleHeading3',
                'ToggleHeading4', 'Callout', 'Table', 'Image', 'Code'];
            const isSpecialType: boolean = (specialTypes.indexOf((currentState.data as ITransform).newBlockType) > -1);
            if (isSpecialType && this.isUndoing) {
                if ((currentState.data as ITransform).newBlockType === 'Image') {
                    (currentState.data as ITransform).block = deepClone(sanitizeBlock(blockModel));
                }
                this.handleSpecialTypeBlockTransform(blockId, blockElement, selectedItem);
                return;
            }
            if ((!this.isUndoing && selectedItem === 'Image')) {
                blockModel.imageSettings = (currentState.data as ITransform).block.imageSettings;
            }
            this.editor.handleBlockTransformation({
                block: blockModel,
                blockElement: blockElement,
                newBlockType: selectedItem,
                isUndoRedoAction: true
            });
            break;
        }
        case 'clipboardPaste': {
            const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
            (this.editor as any).isProtectedOnChange = true;
            if (this.isUndoing) {
                this.handleClipboardUndo(currentState);
            }
            else {
                this.handleClipboardRedo(currentState);
            }
            (this.editor as any).isProtectedOnChange = prevOnChange;
            break;
        }
        }
    }

    private handleMultipleBlocksUndoRedo(currentState: IUndoRedoState): void {
        if (this.isUndoing) {
            this.restoreDeletedBlocks(currentState);
        } else if (this.isRedoing) {
            this.reDeleteBlocks(currentState);
        }
    }

    private restoreDeletedBlocks(state: IUndoRedoState): void {
        const data: IMultipleBlockDeletion = state.data as IMultipleBlockDeletion;
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;

        if (data.deletionType === DeletionType.Entire) {
            this.restoreEntireEditor(data.deletedBlocks);
            setTimeout(() => {
                this.editor.selectAllBlocks();
            });
        }
        else if (data.deletionType === DeletionType.Partial) {
            this.restorePartialDeletion(state);
        }

        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.editor.blockAction.updatePropChangesToModel();
    }

    private restoreEntireEditor(deletedBlocks: BlockModel[]): void {
        this.editor.blocksInternal = deletedBlocks;
        this.editor.blockWrapper.innerHTML = '';
        this.editor.renderBlocks(deletedBlocks);
    }

    private restorePartialDeletion(state: IUndoRedoState): void {
        const { deletedBlocks, firstBlockIndex }: IMultipleBlockDeletion = state.data as IMultipleBlockDeletion;
        if (!deletedBlocks.length) { return; }

        const [firstBlock, ...middleBlocks]: BlockModel[] = deletedBlocks;
        const lastBlock: BlockModel = middleBlocks.pop();

        const firstBlockParent: BlockModel = getBlockModelById(firstBlock.parentId, this.editor.blocksInternal);
        const targetIndex: number = (firstBlockIndex - 1) >= 0 ? (firstBlockIndex - 1) : 0;
        let targetBlockElement: HTMLElement = this.editor.blockWrapper.children[targetIndex as number] as HTMLElement;
        if (firstBlockParent) {
            const childBlocks: NodeListOf<HTMLElement> = this.editor.getBlockElementById(firstBlockParent.id).querySelectorAll('.e-block');
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
        let blockElement: HTMLElement = this.editor.getBlockElementById(block.id);
        const parent: BlockModel = getBlockModelById(block.parentId, this.editor.blocksInternal);
        const deleteCount: number = isFirstBlock ? 1 : 0;

        if (parent) {
            const parentIndex: number = getBlockIndexById(parent.id, this.editor.blocksInternal);
            this.editor.blocksInternal[parentIndex as number].children.splice(insertIndex, deleteCount, block);
        } else {
            this.editor.blocksInternal.splice(insertIndex, deleteCount, block);
        }

        if (blockElement) {
            this.editor.reRenderBlockContent(block);
            return blockElement;
        }
        blockElement = this.editor.blockAction.createBlockElement(block);
        // remove the placeholder for the added block element
        this.editor.togglePlaceholder(blockElement, false);
        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', blockElement);
        }

        return blockElement;
    }

    private restoreMiddleBlocks(middleBlocks: BlockModel[], targetElement: HTMLElement): void {
        let currentInsertionPoint: HTMLElement = targetElement;

        for (const block of middleBlocks) {
            currentInsertionPoint = this.editor.blockAction.addNewBlock({
                block,
                targetBlock: currentInsertionPoint,
                isUndoRedoAction: true
            });
            // remove the placeholder for the added block element
            this.editor.togglePlaceholder(currentInsertionPoint, false);
        }
    }

    private reDeleteBlocks(state: IUndoRedoState): void {
        const data: IMultipleBlockDeletion = state.data as IMultipleBlockDeletion;
        if (data.deletionType === DeletionType.Entire) {
            this.editor.blocksInternal = [];
            this.editor.blockAction.createDefaultEmptyBlock(true, state.oldBlockModel ? state.oldBlockModel.id : '');
        }
        else if (data.deletionType === DeletionType.Partial) {
            const blocksToDelete: BlockModel[] = [];
            for (let i: number = 0; i < data.deletedBlocks.length; i++) {
                const block: BlockModel = data.deletedBlocks[i as number];
                const currentBlockModel: BlockModel = getBlockModelById(block.id, this.editor.blocksInternal);
                if (currentBlockModel) {
                    blocksToDelete.push(currentBlockModel);
                }
            }
            if (blocksToDelete.length > 0) {
                this.updateCursorSelection(state);
                this.editor.handleMultipleBlockDeletion(blocksToDelete, data.direction || 'previous', true);
            }
        }
    }

    private handleClipboardUndo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, oldContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteUndoRedo = currentState.data as IClipboardPasteUndoRedo;
        const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.blocksInternal);
        if (type === 'blocks') {
            const clipboardBlocks: BlockModel[] = clipboardData.blocks;
            const oldBlock: BlockModel = currentState.oldBlockModel;
            const isEmptyTargetBlock: boolean = oldBlock && oldBlock.content
                && ((oldBlock.content.length === 1 && oldBlock.content[0].type === 'Text' && oldBlock.content[0].content === '')
                || !oldBlock.content.length);
            if (blocks && blocks.length > 0) {
                blocks.forEach((block: BlockModel) => {
                    this.editor.blockAction.deleteBlock({
                        blockElement: this.editor.getBlockElementById(block.id),
                        isUndoRedoAction: true
                    });
                });
            }

            if (isEmptyTargetBlock) {
                const newBlockElement: HTMLElement = this.editor.blockAction.createBlockElement(oldBlock);
                const targetElement: HTMLElement = this.editor.getBlockElementById(targetBlockId);
                targetElement.replaceWith(newBlockElement);
                targetBlock.content = oldBlock.content;
            }
            else if (!isPastedAtStart) {
                const pastedContentIds: Set<string> = new Set(clipboardBlocks[0].content.map((c: ContentModel) => c.id));
                targetBlock.content = targetBlock.content.filter((content: ContentModel) => !pastedContentIds.has(content.id));
                this.editor.reRenderBlockContent(targetBlock);
                const splittedBlockState: IUndoRedoState = this.undoStack.pop();
                this.redoStack = [...this.redoStack, splittedBlockState];
                if (splittedBlockState) {
                    this.updateBlockEditor(splittedBlockState);
                }
            }
        }
        else if (type === 'block') {
            this.editor.blockAction.deleteBlock({
                blockElement: this.editor.getBlockElementById(blocks[0].id),
                isUndoRedoAction: true
            });
        }
        else if (type === 'content') {
            const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.blocksInternal);
            targetBlock.content = oldContent;
            this.editor.reRenderBlockContent(targetBlock);
        }
        // Pop the deletion action from the undo stack if user selected a content and pasted
        if (isSelectivePaste) {
            const deletionState: IUndoRedoState = this.undoStack.pop();
            this.redoStack = [...this.redoStack, deletionState];
            if (deletionState) {
                this.updateBlockEditor(deletionState);
            }
        }
        this.editor.blockAction.updatePropChangesToModel();
    }

    private handleClipboardRedo(currentState: IUndoRedoState): void {
        const { type, blocks, targetBlockId, clipboardData, newContent, isPastedAtStart,
            isSelectivePaste }: IClipboardPasteUndoRedo = currentState.data as IClipboardPasteUndoRedo;

        // Pop the deletion action from the redo stack if user selected a content and pasted
        if (isSelectivePaste) {
            const nextState: IUndoRedoState = this.redoStack.pop();
            this.undoStack = [...this.undoStack, nextState];
            if (nextState) {
                this.updateBlockEditor(nextState);
            }
        }

        const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.blocksInternal);
        const targetBlockElement: HTMLElement = this.editor.getBlockElementById(targetBlockId);
        const targetBlockIndex: number = getBlockIndexById(targetBlockId, this.editor.blocksInternal);

        if (type === 'blocks') {
            const clipboardBlocks: BlockModel[] = clipboardData.blocks;
            const isEmptyTargetBlock: boolean = targetBlock && targetBlock.content
                && ((targetBlock.content.length === 1 && targetBlock.content[0].type === 'Text' && targetBlock.content[0].content === '')
                || !currentState.oldBlockModel.content.length);
            if (isEmptyTargetBlock) {
                const block: BlockModel = clipboardBlocks[0];
                this.editor.blockAction.generateNewIdsForBlock(block);
                block.id = targetBlockId;
                const parentBlock: BlockModel = getBlockModelById(targetBlock.parentId, this.editor.blocksInternal);
                if (parentBlock) {
                    const parentIndex: number = getBlockIndexById(parentBlock.id, this.editor.blocksInternal);
                    parentBlock.children.splice(targetBlockIndex, 1, block);
                    (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any)
                        .setProperties({ children: parentBlock.children }, true);
                }
                else {
                    this.editor.blocksInternal.splice(targetBlockIndex, 1, block);
                }
                this.editor.blockAction.updatePropChangesToModel();
                const updatedBlockModel: BlockModel = getBlockModelById(block.id, this.editor.blocksInternal);
                const newBlockElement: HTMLElement = this.editor.blockAction.createBlockElement(updatedBlockModel);
                targetBlockElement.replaceWith(newBlockElement);
            }
            else if (!isPastedAtStart) {
                const nextState: IUndoRedoState = this.redoStack.pop();
                this.undoStack = [...this.undoStack, nextState];
                if (nextState) {
                    this.updateBlockEditor(nextState);
                }

                const originalBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.blocksInternal);
                originalBlock.content = [
                    ...originalBlock.content,
                    ...clipboardBlocks[0].content
                ];
                this.editor.blockAction.updatePropChangesToModel();
                this.editor.reRenderBlockContent(originalBlock);
            }

            const newBlocks: BlockModel[] = [];

            if (clipboardBlocks.length > 1) {
                newBlocks.push(...clipboardBlocks.slice((isPastedAtStart && !isEmptyTargetBlock) ? 0 : 1));
            }

            this.editor.blockAction.addBulkBlocks({
                blocks: newBlocks,
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'blocks'
            });
        }
        else if (type === 'block') {
            this.editor.blockAction.addBulkBlocks({
                blocks: blocks,
                targetBlockId: targetBlockId,
                isUndoRedoAction: true,
                insertionType: 'block'
            });
        }
        else if (type === 'content') {
            const targetBlock: BlockModel = getBlockModelById(targetBlockId, this.editor.blocksInternal);
            targetBlock.content = newContent;
            this.editor.reRenderBlockContent(targetBlock);
        }
        this.editor.blockAction.updatePropChangesToModel();
    }

    private handleSpecialTypeBlockTransform(blockId: string, blockElement: HTMLElement, selectedItem: string): void {
        let targetElement: HTMLElement = blockElement.previousElementSibling as HTMLElement;
        let isAfter: boolean = true;
        if (!targetElement && blockElement.nextElementSibling) {
            targetElement = blockElement.nextElementSibling as HTMLElement;
            isAfter = false;
        }
        this.editor.blockAction.deleteBlock({ blockElement: blockElement, isUndoRedoAction: true });
        this.editor.blockAction.addNewBlock({
            blockID: blockId,
            blockType: selectedItem,
            targetBlock: targetElement,
            isAfter: isAfter,
            isUndoRedoAction: true
        });
    }

    private createBlock(currentState: IUndoRedoState): void {
        const deletedBLockIndex: number = currentState.data ? (currentState.data as IAdd).currentIndex : -1;
        if (deletedBLockIndex < 0) { return; }
        const parentBlock: BlockModel = getBlockModelById(currentState.oldBlockModel.parentId, this.editor.blocksInternal);
        const parentElement: HTMLElement = parentBlock ? this.editor.blockWrapper.querySelector('#' + parentBlock.id) : null;
        const targetIndex: number = (deletedBLockIndex === 0) ? (deletedBLockIndex) : (deletedBLockIndex - 1);
        const afterBlockModel: BlockModel = parentBlock
            ? parentBlock.children[targetIndex as number]
            : this.editor.blocksInternal[targetIndex as number];
        if (!afterBlockModel) { return; }
        const afterBlockElement: HTMLElement = parentBlock
            ? parentElement.querySelectorAll('.e-block')[targetIndex as number] as HTMLElement
            : this.editor.blockWrapper.querySelector('#' + afterBlockModel.id) as HTMLElement;
        const specialTypes: string[] = ['Divider', 'ToggleParagraph', 'ToggleHeading1', 'ToggleHeading2', 'ToggleHeading3',
            'ToggleHeading4', 'Callout', 'Table', 'Image', 'Code'];
        const isSpecialType: boolean = (specialTypes.indexOf(currentState.oldBlockModel.type) > -1);
        // specialType block addition handling
        if (isSpecialType || isNOU((currentState.data as IAdd).lastChild)) {
            this.editor.blockAction.addNewBlock({
                targetBlock: afterBlockElement,
                blockType: currentState.oldBlockModel.type,
                block: currentState.oldBlockModel,
                isAfter: deletedBLockIndex > 0,
                isUndoRedoAction: true
            });
            return;
        }
        const lastChild: HTMLElement = (currentState.data as IAdd).lastChild;
        const lastChildElement: HTMLElement = lastChild
            ? this.editor.blockWrapper.querySelector('#' + lastChild.id)
            : null;
        this.editor.splitAndCreateNewBlockAtCursor({
            targetBlock: afterBlockElement,
            blockType: currentState.oldBlockModel.type,
            blockID: currentState.oldBlockModel.id,
            contentModel: currentState.oldBlockModel.content,
            isUndoRedoAction: true,
            splitOffset: (currentState.data as IAdd).splitOffset,
            lastChild: lastChildElement,
            contentElement: (currentState.data as IAdd).contentElement
        });
    }

    private removeBlock(currentState: IUndoRedoState): void {
        const { splitOffset, lastChild, contentElement }: IDeleteBlockArgs = (currentState.data) as IDeleteBlockArgs;
        const blockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${(currentState.data as IData).blockId}`) as HTMLElement;
        const shouldNeedsMerge: boolean = !isNOU(splitOffset) && splitOffset > -1 && !isNOU(lastChild) && !isNOU(contentElement);
        if (shouldNeedsMerge) {
            this.editor.blockAction.deleteBlockAtCursor({ blockElement: blockElement, isUndoRedoAction: true, mergeDirection: 'previous' });
        }
        else {
            const adjacentBlock: HTMLElement = (blockElement.nextElementSibling || blockElement.previousElementSibling) as HTMLElement;
            if (adjacentBlock) {
                this.editor.blockAction.setFocusAndUIForNewBlock(adjacentBlock);
            }
            this.editor.blockAction.deleteBlock({ blockElement: blockElement, isUndoRedoAction: true });
        }
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
        this.editor.notify('undoStackChanged', { canUndo: false, canRedo: false });
    }

    public destroy(): void {
        this.removeEventListener();
        this.clear();
    }

    protected removeEventListener(): void {
        this.editor.off('contentChanged', this.onContentChanged);
        this.editor.off('blockAdded', this.onBlockAddition);
        this.editor.off('blockRemoved', this.onBlockRemoval);
        this.editor.off('blockMoved', this.onBlockMove);
        this.editor.off('blockTransformed', this.onBlockTransform);
    }
}
