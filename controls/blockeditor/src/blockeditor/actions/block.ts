// eslint-disable @typescript-eslint/no-explicit-any


import { createElement, detach, getElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BlockEditor, BlockEditorModel } from '../base/index';
import { BlockModel, ContentModel } from '../models/index';
import { deepClone, generateUniqueId, getDeepestTextNode } from '../utils/common';
import { BlockType, ContentType } from '../base/enums';
import { getAdjacentBlock, getBlockContentElement, getBlockIndexById, getBlockModelById, isDividerBlock, isListTypeBlock, isChildrenTypeBlock } from '../utils/block';
import { captureSelectionState, getSelectionRange, setCursorPosition } from '../utils/selection';
import { ISplitContent, IAddBlockArgs, IDeleteBlockArgs, IMoveBlockArgs, ITransformBlockArgs, IFromBlockArgs, IAddBulkBlocksArgs, IIndentBlockArgs, IUndoRedoSelection } from '../base/interface';
import { BlockAddedEventArgs, BlockMovedEventArgs, BlockRemovedEventArgs } from '../base/eventargs';
import { ContentRenderer, CalloutRenderer, CommonBlocksRenderer, HeadingRenderer, ListRenderer, ParagraphRenderer, QuoteRenderer, CodeRenderer, ImageRenderer, ToggleRenderer } from '../renderer/index';
import { clearBreakTags } from '../utils/dom';
import { events } from '../base/constant';
import { sanitizeBlock } from '../utils/transform';

export class BlockAction {
    protected editor: BlockEditor;

    /** @hidden */
    public contentRenderer: ContentRenderer;

    /** @hidden */
    public paragraphRenderer: ParagraphRenderer;

    /** @hidden */
    public headingRenderer: HeadingRenderer;

    /** @hidden */
    public listRenderer: ListRenderer;

    /** @hidden */
    public codeRenderer: CodeRenderer;

    /** @hidden */
    public imageRenderer: ImageRenderer;

    /** @hidden */
    public quoteRenderer: QuoteRenderer;

    /** @hidden */
    public calloutRenderer: CalloutRenderer;

    /** @hidden */
    public toggleRenderer: ToggleRenderer;

    /** @hidden */
    public commonBlocksRenderer: CommonBlocksRenderer;

    constructor(editor?: BlockEditor) {
        this.editor = editor;
        this.contentRenderer = new ContentRenderer(this.editor);
        this.intializeBlockRenderers();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.destroy, this.destroy);
    }

    private intializeBlockRenderers(): void {
        this.paragraphRenderer = new ParagraphRenderer(this.editor, this);
        this.headingRenderer = new HeadingRenderer(this.editor, this);
        this.listRenderer = new ListRenderer(this.editor, this);
        this.quoteRenderer = new QuoteRenderer(this.editor, this);
        this.codeRenderer = new CodeRenderer(this.editor, this);
        this.imageRenderer = new ImageRenderer(this.editor);
        this.calloutRenderer = new CalloutRenderer(this.editor, this);
        this.toggleRenderer = new ToggleRenderer(this.editor, this);
        this.commonBlocksRenderer = new CommonBlocksRenderer(this.editor);
    }

    private handleUndoMove(args: IMoveBlockArgs): void {
        const { fromBlockIds, fromIndex, fromParentId, toParentId } = args;
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        // Collect current indexes before mutating the array
        let oldDatas: IFromBlockArgs[] = [];
        const fromEntries: IFromBlockArgs[] = fromBlockIds
            .map((fromBlockId: string) => {
                const model: BlockModel = getBlockModelById(fromBlockId, this.editor.blocksInternal);
                const index: number = getBlockIndexById(fromBlockId, this.editor.blocksInternal);
                const parent: BlockModel = getBlockModelById(model.parentId, this.editor.blocksInternal);
                return { blockId: fromBlockId, model, index, parent };
            })
            .sort((a: IFromBlockArgs, b: IFromBlockArgs) => b.index - a.index); // Important: reverse sort to splice from highest index first

        // Splice safely from the highest index to avoid index shifts
        for (const entry of fromEntries) {
            const { blockId, model, index, parent } = entry;
            const [moved] = parent
                ? parent.children.splice(index, 1)
                : this.editor.blocksInternal.splice(index, 1);
            oldDatas.push({ blockId: blockId, model: moved });
        }
        // Collect the old data models
        oldDatas = [...fromEntries].reverse()
            .map((fromEntry: IFromBlockArgs, i: number) => {
                const index: number = fromIndex[parseInt(i.toString(), 10)];
                const parent: BlockModel = getBlockModelById(fromParentId[parseInt(i.toString(), 10)], this.editor.blocksInternal);
                return { ...fromEntry, index, parent };
            });
        // insert in its old position
        for (const entry of oldDatas) {
            const { model, index, parent } = entry;
            const insertToArray: BlockModel[] = parent ? parent.children : this.editor.blocksInternal;
            model.parentId = parent ? parent.id : '';
            insertToArray.splice(index, 0, model);
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.updatePropChangesToModel();
        // DOM updates
        for (const entry of args.isMovedUp ? oldDatas.reverse() : oldDatas) {
            const { blockId, index, parent } = entry;

            const fromElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${blockId}`) as HTMLElement;
            const parentBlockIndex: number = parent ? getBlockIndexById(parent.id, this.editor.blocksInternal) : -1;
            const allBlocks: HTMLElement[] = Array.from(this.editor.blockWrapper.children) as HTMLElement[];
            // should reduce index only when any block is moved into a special block or last child block is moved outside from a special block (Callout, Toggle)
            const shouldReduceIndex: boolean = parent ? parent.children[parseInt(parent.children.length.toString(), 10) - 1].id === blockId : toParentId !== '';
            const indexVal: number = shouldReduceIndex ? index - 1 : index;
            const toBlockDOM: HTMLElement = (parent
                ? this.editor.blockWrapper.querySelector(`#${parent.id}`).querySelectorAll('.e-block')[parseInt(indexVal.toString(), 10)]
                : allBlocks[parseInt(indexVal.toString(), 10)]) as HTMLElement;

            const wrapperClassName: string = parent
                ? parent.type === 'Callout' ? '.e-callout-content'
                    : parent.type.toString().startsWith('Toggle') ? '.e-toggle-content'
                        : ''
                : '';

            const wrapperElement: HTMLElement = wrapperClassName
                ? this.editor.blockWrapper.querySelector(`#${parent.id}`).querySelector(wrapperClassName)
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
        this.updateFocusAndCursor(blockElementToFocus);
    }

    /**
     * Adds a new block to the editor.
     *
     * @param {IAddBlockArgs} args options for adding new block
     * @returns {HTMLElement} - newly created block element
     * @hidden
     */
    addNewBlock(args: IAddBlockArgs): HTMLElement {
        const {
            block, targetBlock, blockID, blockType, contentElement, contentModel, preventUIUpdate, isAfter = true
        }: IAddBlockArgs = args;
        const indentValue: number = targetBlock ? parseInt(targetBlock.style.getPropertyValue('--block-indent'), 10) : 0;
        const targetBlockModel: BlockModel = targetBlock ? getBlockModelById(targetBlock.id, this.editor.blocksInternal) : null;
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        let newBlock: BlockModel;
        if (!block) {
            newBlock = {
                id: blockID ? blockID : generateUniqueId('block'),
                parentId: targetBlockModel ? targetBlockModel.parentId : '',
                type: blockType ? blockType : BlockType.Paragraph,
                content: contentModel ? contentModel : [],
                indent: (indentValue / 20)
            };
        }
        else if (!args.isUndoRedoAction) {
            this.editor.populateUniqueIds([block]);
        }
        const isListType: boolean = isListTypeBlock(block ? block.type : newBlock.type);
        const indexToInsert: number = this.getIndexToAdjust(targetBlock, isAfter);
        const parentBlock: BlockModel = targetBlockModel ? getBlockModelById(targetBlockModel.parentId, this.editor.blocksInternal) : null;
        if (parentBlock) {
            const parentIndex: number = getBlockIndexById(parentBlock.id, this.editor.blocksInternal);
            parentBlock.children.splice(indexToInsert, 0, block ? block : newBlock);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.editor.blocks[parseInt(parentIndex.toString(), 10)] as any).setProperties({ children: parentBlock.children }, true);
        }
        else {
            this.editor.blocksInternal.splice(indexToInsert, 0, block ? block : newBlock);
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.updatePropChangesToModel();
        const updatedBlockModel: BlockModel = parentBlock
            ? parentBlock.children[parseInt(indexToInsert.toString(), 10)]
            : this.editor.blocks[parseInt(indexToInsert.toString(), 10)];
        if (!block && (!contentModel || contentModel.length === 0)) {
            this.updateContentInBlock(contentElement, updatedBlockModel);
        }
        const blockElement: HTMLElement = this.createBlockElement(updatedBlockModel, contentElement);
        if (targetBlock) {
            targetBlock.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', blockElement);
        } else {
            this.editor.blockWrapper.appendChild(blockElement);
        }
        this.triggerBlockAdditionEvent(updatedBlockModel);
        if (!preventUIUpdate) {
            this.setFocusAndUIForNewBlock(blockElement);
        }
        if (isListType) {
            this.editor.listBlockAction.recalculateMarkersForListItems();
        }
        if (!args.isUndoRedoAction) {
            const contentEle: HTMLElement = getBlockContentElement(blockElement) as HTMLElement;
            const currentIndex: number = getBlockIndexById(blockElement.id, this.editor.blocksInternal);
            const addedblockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
            const addedBlockClone: BlockModel = deepClone(sanitizeBlock(addedblockModel));
            this.editor.notify('blockAdded', { blockId: blockElement.id, currentIndex: currentIndex, blockModel: addedBlockClone, splitOffset: args.splitOffset, lastChild: args.lastChild, contentEle: contentEle });
        }
        this.adjustViewForFocusedBlock();
        return blockElement;
    }

    /**
     * Updates the UI of the block.
     *
     * @param {HTMLElement} blockElement The element to delete
     * @returns {void}
     * @hidden
     */
    setFocusAndUIForNewBlock(blockElement: HTMLElement): void {
        const newContentElement: HTMLElement = getBlockContentElement(blockElement);
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
        this.editor.setFocusToBlock(blockElement);
        setCursorPosition(newContentElement, 0);
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        this.editor.showFloatingIcons(this.editor.currentFocusedBlock);
    }

    private updateFocusAndCursor(blockElement: HTMLElement): void {
        if (blockElement) {
            const content: HTMLElement = getBlockContentElement(blockElement);
            this.editor.setFocusToBlock(blockElement);
            setCursorPosition(content, 0);
            this.editor.showFloatingIcons(blockElement);
        }
    }

    addBulkBlocks(args: IAddBulkBlocksArgs): void {
        const { blocks, targetBlockId, isUndoRedoAction, clipboardBlocks,
            insertionType, oldBlockModel, isPastedAtStart, isSelectivePaste }: IAddBulkBlocksArgs = args;
        if (blocks.length === 0) {
            return;
        }

        let newInsertedBlockElement: HTMLElement;
        for (let i: number = 0; i < blocks.length; i++) {
            const targetId: string = i === 0 ? targetBlockId : newInsertedBlockElement.id;
            const targetElement: HTMLElement = this.editor.getBlockElementById(targetId);
            newInsertedBlockElement = this.editor.blockAction.addNewBlock(
                {
                    block: blocks[parseInt(i.toString(), 10)],
                    targetBlock: targetElement,
                    isUndoRedoAction: true //Prevent undo redo push for each block insertion
                });
        }
        this.editor.listBlockAction.recalculateMarkersForListItems();

        //Setting Cursor position
        let cursorElement: HTMLElement = this.editor.currentFocusedBlock;
        let cursorpos: number = cursorElement.textContent.length;
        if (insertionType === 'blocks') {
            cursorElement = (cursorElement.nextElementSibling ? cursorElement.nextElementSibling : cursorElement) as HTMLElement;
            cursorpos = 0;
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
            this.editor.togglePlaceholder(cursorElement, true);
        }
        this.editor.setFocusToBlock(cursorElement);
        setCursorPosition(getBlockContentElement(cursorElement), cursorpos);

        if (!isUndoRedoAction) {
            const pastedBlocks: BlockModel[] = blocks.map((block: BlockModel) => sanitizeBlock(block));
            this.editor.undoRedoAction.pushToUndoStack({
                action: 'clipboardPaste',
                oldBlockModel: oldBlockModel,
                data: {
                    type: insertionType,
                    blocks: deepClone(pastedBlocks),
                    targetBlockId,
                    isPastedAtStart,
                    isSelectivePaste,
                    clipboardData: {
                        blocks: clipboardBlocks
                    }
                }
            });
        }
    }

    /**
     * Deletes a block from the editor.
     *
     * @param {IDeleteBlockArgs} args args for the element to be deleted
     * @returns {void}
     * @hidden
     */
    deleteBlock(args: IDeleteBlockArgs): void {
        if (!args.blockElement) { return; }
        const blockModel: BlockModel = getBlockModelById(args.blockElement.id, this.editor.blocksInternal);
        const blockIndex: number = getBlockIndexById(args.blockElement.id, this.editor.blocksInternal);
        const parentBlock: BlockModel = getBlockModelById(blockModel.parentId, this.editor.blocksInternal);
        if (blockIndex === -1) { return; }
        let deletedBlocks: BlockModel[];
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        if (parentBlock) {
            deletedBlocks = parentBlock.children.splice(blockIndex, 1);
        }
        else {
            deletedBlocks = this.editor.blocksInternal.splice(blockIndex, 1);
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.updatePropChangesToModel();
        const removedBlockClone: BlockModel = deepClone(sanitizeBlock(blockModel));
        if (!args.isUndoRedoAction) {
            this.editor.notify('blockRemoved', {
                blockId: args.blockElement.id,
                currentIndex: blockIndex,
                splitOffset: args.splitOffset,
                lastChild: args.lastChild,
                contentEle: args.contentElement,
                oldBlockModel: removedBlockClone
            });
        }
        args.blockElement.remove();
        const eventArgs: BlockRemovedEventArgs = {
            block: deletedBlocks[0],
            parentID: deletedBlocks[0].id,
            index: blockIndex,
            isInteracted: !args.isMethod
        };
        this.editor.trigger('blockRemoved', eventArgs);
    }

    /**
     * Moves a block or group of blocks to a new position in the editor.
     *
     * @param {IMoveBlockArgs} args options for moving the block
     * @returns {void}
     * @hidden
     */
    moveBlock(args: IMoveBlockArgs): void {
        const { fromBlockIds = [], toBlockId, isInteracted = true } = args;
        if (args.isUndoRedoAction && args.isUndoing) {
            this.handleUndoMove(args);
            return;
        }
        if (fromBlockIds.length === 0 || toBlockId.length <= 0) { return; }
        const toBlockElement: HTMLElement = this.editor.blockWrapper.querySelector(`#${toBlockId}`);
        if (!toBlockElement) { return; }
        const toBlockModel: BlockModel = getBlockModelById(toBlockId, this.editor.blocksInternal);
        const toBlockIndex: number = getBlockIndexById(toBlockId, this.editor.blocksInternal);
        const toParentBlock: BlockModel = getBlockModelById(toBlockModel.parentId, this.editor.blocksInternal);
        const toParentBlockIndex: number = toParentBlock ? getBlockIndexById(toParentBlock.id, this.editor.blocksInternal) : -1;
        if (toBlockIndex < 0) { return; }
        const allFromModels: IFromBlockArgs[] = [];
        const allBlocks: HTMLElement[] = Array.from(this.editor.blockWrapper.children) as HTMLElement[];
        const toBlockDOM: HTMLElement = (toParentBlock
            ? allBlocks[parseInt(toParentBlockIndex.toString(), 10)].querySelectorAll('.e-block')[parseInt(toBlockIndex.toString(), 10)]
            : allBlocks[parseInt(toBlockIndex.toString(), 10)]) as HTMLElement;
        const fromElements: HTMLElement[] = fromBlockIds
            .map((id: string): Element | null => this.editor.blockWrapper.querySelector(`#${id}`))
            .filter((el: Element | null): el is HTMLElement => el instanceof HTMLElement);
        const isMovingUp: boolean = fromElements[0].getBoundingClientRect().top > toBlockDOM.getBoundingClientRect().top;
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;

        // Collect and sort original indexes before mutating the array
        const fromEntries: IFromBlockArgs[] = fromBlockIds
            .map((fromBlockId: string) => {
                const model: BlockModel = getBlockModelById(fromBlockId, this.editor.blocksInternal);
                const index: number = getBlockIndexById(fromBlockId, this.editor.blocksInternal);
                const parent: BlockModel = getBlockModelById(model.parentId, this.editor.blocksInternal);
                return { blockId: fromBlockId, model, index, parent };
            })
            .filter((entry: IFromBlockArgs) => entry.index >= 0)
            .sort((a: IFromBlockArgs, b: IFromBlockArgs) => b.index - a.index); // Important: reverse sort to splice from highest index first

        // Splice safely from the highest index to avoid index shifts
        for (const entry of fromEntries) {
            const { blockId, model, index, parent } = entry;
            const [moved] = parent
                ? parent.children.splice(index, 1)
                : this.editor.blocksInternal.splice(index, 1);

            allFromModels.push({ blockId: blockId, model: moved, parent, index }); // allFromModels has the original indexes and parentid before mutation in reverse order
        }
        // Insert into data model at the drop position
        const insertToArray: BlockModel[] = toParentBlock ? toParentBlock.children : this.editor.blocksInternal;
        const toIndex: number = getBlockIndexById(toBlockId, this.editor.blocksInternal) + (isMovingUp ? 0 : 1);
        for (const { model } of allFromModels) {
            model.parentId = toParentBlock ? toParentBlock.id : '';
            insertToArray.splice(toIndex, 0, model);
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.updatePropChangesToModel();

        // DOM Manipulation
        const wrapperClassName: string = toParentBlock
            ? (toParentBlock.type === 'Callout' ? '.e-callout-content' :
                toParentBlock.type.toString().startsWith('Toggle') ? '.e-toggle-content' : '')
            : '';
        const wrapperElement: HTMLElement = wrapperClassName
            ? allBlocks[parseInt(toParentBlockIndex.toString(), 10)].querySelector(wrapperClassName)
            : this.editor.blockWrapper;

        const targetToInsert: HTMLElement = (isMovingUp ? toBlockDOM : toBlockDOM.nextSibling) as HTMLElement;
        fromElements.forEach((el: HTMLElement) => {
            wrapperElement.insertBefore(el, targetToInsert);
        });

        const fromBlockId: string = fromElements[0].id;
        const draggedBlock: BlockModel = getBlockModelById(fromBlockId, this.editor.blocksInternal);
        const reversedFromModels: IFromBlockArgs[] = [...allFromModels].reverse();
        const eventArgs: BlockMovedEventArgs = {
            blocks: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.model),
            parentID: toParentBlock ? toParentBlock.id : '',
            previousParentID: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.parent ? fromModel.parent.id : ''),
            index:  getBlockIndexById(draggedBlock.id, this.editor.blocksInternal),
            previousIndex: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.index),
            isInteracted: isInteracted
        };
        this.editor.trigger('blockMoved', eventArgs);
        if (!args.isUndoRedoAction) {
            this.editor.notify('blockMoved', {
                ...args,
                fromBlockIds: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.blockId),
                fromIndex: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.index),
                toIndex: toBlockIndex,
                fromParentId: reversedFromModels.map((fromModel: IFromBlockArgs) => fromModel.parent ? fromModel.parent.id : ''),
                toParentId: toParentBlock ? toParentBlock.id : '',
                isMovedUp: isMovingUp
            });
        }
        //Remove the selection if any after drag and drop
        const selection: Selection = window.getSelection();
        if (selection) { selection.removeAllRanges(); }
        const blockElementToFocus: HTMLElement = fromElements.length > 0 ? fromElements[0] : null;
        this.updateFocusAndCursor(blockElementToFocus);
    }

    /**
     * Duplicates a block element and inserts it above or below the original
     *
     * @param {HTMLElement} blockElement - The block element to duplicate
     * @param {'below' | 'above'} direction - The direction to insert the duplicated block
     * @returns {void}
     * @hidden
     */
    duplicateBlock(blockElement: HTMLElement, direction: 'below' | 'above' = 'below'): void {
        if (!blockElement) { return; }

        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        const blockIndex: number = getBlockIndexById(blockElement.id, this.editor.blocksInternal);
        const parentBlock: BlockModel = getBlockModelById(blockModel.parentId, this.editor.blocksInternal);
        if (blockIndex === -1) { return; }

        // Deep clone the block model and generate new IDs
        const blockToClone: BlockModel = parentBlock
            ? parentBlock.children[parseInt(blockIndex.toString(), 10)]
            : this.editor.blocksInternal[parseInt(blockIndex.toString(), 10)];
        const clonedBlock: BlockModel = deepClone(sanitizeBlock(blockToClone));
        this.generateNewIdsForBlock(clonedBlock);
        this.addNewBlock({
            block: clonedBlock,
            targetBlock: blockElement,
            isAfter: direction === 'below'
        });
    }

    /**
     * Creates a new block element based on the given block model.
     *
     * @param {BlockModel} block - The block model to create the element for.
     * @param {HTMLElement} contentElement - The content element to be appended to the block element.
     * @returns {HTMLElement} The created block element.
     * @hidden
     */
    createBlockElement(block: BlockModel, contentElement?: HTMLElement | Node): HTMLElement {
        const isListType: boolean = isListTypeBlock(block.type);
        const blockElement: HTMLElement = createElement('div', {
            id: block.id,
            className: `e-block ${isListType ? 'e-list-block' : ''}${block.cssClass ? ' ' + block.cssClass : ''}`,
            attrs: {
                'data-block-type': block.type
            }
        });
        this.updateBlockCssClass(blockElement, block.cssClass);
        if (block.type === BlockType.Divider) {
            blockElement.setAttribute('contenteditable', 'false');
        }
        this.updateBlockIndentAttribute(blockElement, block.indent);
        if (isChildrenTypeBlock(block.type)) {
            this.renderNestedTypeBlockContent(block, blockElement);
        }
        else {
            this.renderBlockContent(block, blockElement, contentElement);
        }
        return blockElement;
    }

    /**
     * Renders the content for nested type blocks (e.g., Callout, Toggle).
     *
     * @param {BlockModel} block - The block model to render.
     * @param {HTMLElement} blockElement - The block element to render the content into.
     * @returns {void}
     * @hidden
     */
    renderNestedTypeBlockContent(block: BlockModel, blockElement: HTMLElement): void {
        let contentElement: HTMLElement;
        if (block.type === BlockType.Callout) {
            contentElement = this.calloutRenderer.renderCallout(block, blockElement);
        }
        else if (block.type.toString().startsWith('Toggle')) {
            contentElement = this.toggleRenderer.renderToggleBlock(block, blockElement);
        }
        if (contentElement) {
            blockElement.appendChild(contentElement);
        }
    }

    /**
     * Renders the content of a block element based on the given block model.
     *
     * @param {BlockModel} block - The block model to render.
     * @param {HTMLElement} blockElement - The block element to render the content into.
     * @param {HTMLElement | Node} existingContentElement - The existing content element to be updated.
     * @returns {void}
     * @hidden
     */
    renderBlockContent(block: BlockModel, blockElement: HTMLElement, existingContentElement?: HTMLElement | Node): void {
        blockElement.setAttribute('data-block-type', block.type);
        let contentElement: HTMLElement;
        switch (block.type) {
        case BlockType.Paragraph:
            contentElement = this.paragraphRenderer.renderParagraph(block, blockElement, existingContentElement);
            break;
        case BlockType.Heading1:
        case BlockType.Heading2:
        case BlockType.Heading3:
        case BlockType.Heading4:
            contentElement = this.headingRenderer.renderHeading(block, blockElement, existingContentElement);
            break;
        case BlockType.BulletList:
        case BlockType.NumberedList:
        case BlockType.CheckList:
            contentElement = this.listRenderer.renderListItem(block, blockElement, existingContentElement);
            break;
        case BlockType.Code:
            contentElement = this.codeRenderer.renderCodeBlock(block, blockElement);
            break;
        case BlockType.Image:
            contentElement = this.imageRenderer.renderImage(block, blockElement);
            break;
        case BlockType.Quote:
            contentElement = this.quoteRenderer.renderQuote(block, blockElement, existingContentElement);
            break;
        case BlockType.Divider:
            contentElement = this.commonBlocksRenderer.renderDivider(blockElement);
            break;
        case BlockType.Template:
            contentElement = this.commonBlocksRenderer.renderTemplateBlock(block, blockElement);
            break;
        default:
            break;
        }
        if (contentElement) {
            const notAllowedTypes: string[] = [BlockType.Code, BlockType.Callout]; //Table, Code, Callout etc.
            const isListType: boolean = isListTypeBlock(block.type);
            if (isListType) {
                const listItem: HTMLElement = contentElement.querySelector('li');
                if (listItem) {
                    listItem.classList.add('e-block-content');
                }
            } else if (notAllowedTypes.indexOf(block.type) === -1) {
                contentElement.classList.add('e-block-content');
            }
            blockElement.appendChild(contentElement);
        }
    }

    /**
     * Gets the index to adjust the block based on the given targetBlock.
     *
     * @param {HTMLElement} targetBlock - The block after which the new block should be inserted.
     * @param {boolean} isAfter - Specifies whether the new block should be inserted after the targetBlock.
     * @returns {number} - The index at which the new block should be inserted.
     */
    getIndexToAdjust(targetBlock?: HTMLElement, isAfter: boolean = true): number {
        let insertIndex: number = this.editor.blocksInternal.length;

        if (targetBlock) {
            const afterBlockIndex: number = getBlockIndexById(targetBlock.id, this.editor.blocksInternal);
            if (afterBlockIndex !== -1) {
                insertIndex = afterBlockIndex + (isAfter ? 1 : 0);
            }
        }
        return insertIndex;
    }

    /**
     * Transforms an existing block into a different type
     *
     * @param {ITransformBlockArgs} args options for transforming block
     * @returns {HTMLElement} - The transformed content element
     */
    transformBlock(args: ITransformBlockArgs): HTMLElement {
        this.editor.previousSelection = captureSelectionState();
        const { block, blockElement, newBlockType, isUndoRedoAction } = args;
        const oldBlockType: string = args.block.type;
        const existingContentElement: HTMLElement = getBlockContentElement(blockElement);
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;

        block.type = newBlockType;
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.updateBlockIndentAttribute(blockElement, block.indent);

        let newContentElement: HTMLElement;
        switch (newBlockType) {
        case BlockType.Paragraph:
            newContentElement = this.paragraphRenderer.renderParagraph(block, blockElement, existingContentElement);
            break;
        case BlockType.Heading1:
        case BlockType.Heading2:
        case BlockType.Heading3:
        case BlockType.Heading4:
            newContentElement = this.headingRenderer.renderHeading(block, blockElement, existingContentElement);
            break;
        case BlockType.BulletList:
        case BlockType.NumberedList:
        case BlockType.CheckList:
            newContentElement = this.listRenderer.renderListItem(block, blockElement, existingContentElement);
            break;
        case BlockType.Code:
            newContentElement = this.codeRenderer.renderCodeBlock(block, blockElement, true);
            break;
        case BlockType.Image:
            newContentElement = this.imageRenderer.renderImage(block, blockElement, true);
            break;
        case BlockType.Quote:
            newContentElement = this.quoteRenderer.renderQuote(block, blockElement, existingContentElement);
            break;
        case BlockType.Divider:
            newContentElement = this.commonBlocksRenderer.renderDivider(blockElement, existingContentElement);
            break;
        case BlockType.ToggleParagraph:
        case BlockType.ToggleHeading1:
        case BlockType.ToggleHeading2:
        case BlockType.ToggleHeading3:
        case BlockType.ToggleHeading4:
            newContentElement = this.toggleRenderer.renderToggleBlock(block, blockElement, true);
            break;
        case BlockType.Callout:
            newContentElement = this.calloutRenderer.renderCallout(block, blockElement, true);
            break;
        default:
            break;
        }
        const isListType: boolean = isListTypeBlock(newBlockType);
        if (newContentElement) {
            if (isListType) {
                const listItem: HTMLElement = newContentElement.querySelector('li');
                if (listItem) {
                    listItem.classList.add('e-block-content');
                }
            } else if (newBlockType.toLowerCase() === 'code') {
                const codeItem: HTMLElement = newContentElement.querySelector('code');
                if (codeItem) {
                    codeItem.classList.add('e-block-content');
                }
            }
            else if (!newBlockType.startsWith('Toggle') && !newBlockType.startsWith('Callout')) {
                newContentElement.classList.add('e-block-content');
            }
        }
        if (isListType) {
            blockElement.classList.add('e-list-block');
        }
        else {
            blockElement.classList.remove('e-list-block');
        }
        blockElement.setAttribute('data-block-type', newBlockType);
        if (!isUndoRedoAction) {
            const newBlockType: string = block.type;
            this.editor.notify('blockTransformed', { blockId: blockElement.id, oldBlockType: oldBlockType, newBlockType: newBlockType });
        }
        return newContentElement;
    }

    private transformToggleBlocksAsRegular(blockElement: HTMLElement): void {
        const blocksInternal: BlockModel[] = this.editor.blocksInternal;
        const blockId: string = blockElement.id;
        const block: BlockModel = getBlockModelById(blockId, blocksInternal);

        if (!block || !block.type.startsWith('Toggle')) { return; }

        const headerContentElement: HTMLElement = blockElement.querySelector('.e-toggle-header .e-block-content') as HTMLElement;
        const toggleContentElement: HTMLElement = blockElement.querySelector('.e-toggle-content') as HTMLElement;
        const childBlockElements: NodeListOf<HTMLElement> = toggleContentElement.querySelectorAll('.e-block') as NodeListOf<HTMLElement>;

        const newType: string = block.type.replace(/^Toggle/, '');
        block.type = newType;
        block.children.forEach((childBlock: BlockModel) => {
            if (childBlock) {
                childBlock.parentId = '';
            }
        });

        const blockIndex: number = getBlockIndexById(blockId, blocksInternal);
        blocksInternal.splice(blockIndex + 1, 0, ...block.children);

        block.children = [];

        // 4. Update DOM
        blockElement.classList.remove('e-toggle-block');
        blockElement.setAttribute('data-block-type', newType);
        blockElement.removeAttribute('data-collapsed');
        const cloneMainBlock: HTMLElement = blockElement.cloneNode(false) as HTMLElement;
        cloneMainBlock.appendChild(headerContentElement);

        blockElement.insertAdjacentElement('afterend', cloneMainBlock);

        childBlockElements.forEach((childBlockElement: HTMLElement) => {
            cloneMainBlock.insertAdjacentElement('afterend', childBlockElement);
        });

        // Remove the original toggle block element
        detach(blockElement);
        setCursorPosition(cloneMainBlock, 0);
        this.editor.setFocusToBlock(cloneMainBlock);
    }


    updatePropChangesToModel(): void {
        this.editor.setProperties({ blocks: this.editor.blocksInternal }, true);
        this.editor.blocksInternal = this.editor.blocks.slice();
    }

    updateBlockIndentAttribute(blockElement: HTMLElement, indentValue: number): void {
        const indentVal: number = indentValue * 20;
        blockElement.style.setProperty('--block-indent', indentVal.toString());
        if (this.editor.element.contains(blockElement)) {
            this.editor.showFloatingIcons(blockElement);
        }
    }

    updateBlockCssClass(blockElement: HTMLElement, customClass: string): void {
        if (customClass) {
            blockElement.classList.add(customClass);
        }
    }

    updateContentChangesToModel(blockElement: HTMLElement, contentElement: HTMLElement): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.blocksInternal);
        const blockIndex: number = getBlockIndexById(blockElement.id, this.editor.blocksInternal);
        if (blockIndex < 0) { return; }
        this.updateContentInBlock(contentElement, blockModel);
        this.updatePropChangesToModel();
    }

    updateContentInBlock(contentElement: Node, blockModel: BlockModel): void {
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        const childLen: number = contentElement ? contentElement.childNodes.length : 0;
        if ((childLen === 0) || (childLen === 1 && contentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
            const textNode: Node = contentElement ? contentElement.firstChild : null;
            const nodeValue: string = (textNode && textNode.nodeValue) ? textNode.nodeValue : '';
            if (blockModel.content.length === 0) {
                blockModel.content = [{ id: generateUniqueId('content'), content: nodeValue }];
            }
            else {
                blockModel.content[0].content = nodeValue;
            }
        } else {
            if (!contentElement) { return; }
            // Case 2: Multiple Child Elements (span, strong, em, etc.)
            const content: ContentModel[] = [];
            contentElement.childNodes.forEach((childNode: ChildNode) => {
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    const element: HTMLElement = childNode as HTMLElement;
                    const contentModel: ContentModel = blockModel.content.find((item: ContentModel) => item.id === element.id);
                    if (contentModel) {
                        contentModel.content = element.textContent;
                        content.push(contentModel);
                    }
                    else {
                        content.push({ id: element.id, content: element.textContent });
                    }
                }
            });
            blockModel.content = content;
        }
        (this.editor as any).isProtectedOnChange = prevOnChange;
    }

    splitBlockAtCursor(blockElement: HTMLElement, args?: IAddBlockArgs): ISplitContent | null {
        const isUndoRedoAction: boolean = args && args.isUndoRedoAction;
        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return null; }
        let startContainer: Node = null;
        const range: Range = getSelectionRange();
        if (isUndoRedoAction) {
            if (!args.lastChild) { return null; }
            startContainer = Node.ELEMENT_NODE === args.lastChild.nodeType ? getDeepestTextNode(args.lastChild) : args.lastChild;
        }
        else {
            if (!range.startContainer) { return null; }
            startContainer = range.startContainer;
        }
        const startOffset: number = isUndoRedoAction ? args.splitOffset : range.startOffset;
        const splitContent: ISplitContent = this.splitContent(contentElement, startContainer, startOffset);
        return splitContent;
    }

    /**
     * Splits the content of a block at a specified node and offset.
     *
     * @param {HTMLElement} contentElement - The content element of the block.
     * @param {Node} splitNode - The node at which to split the content.
     * @param {number} splitOffset - The offset within the split node at which to split the content.
     * @returns {ISplitContent} - An object containing the before and after fragments of the split content.
     * @hidden
     */
    public splitContent(contentElement: HTMLElement, splitNode: Node, splitOffset: number): ISplitContent {
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
                const fullText: string = textNode.textContent || '';
                if (!isAfter && node === splitNode) {
                    const beforeText: string = fullText.slice(0, splitOffset);
                    const afterText: string = fullText.slice(splitOffset);

                    if (beforeText) { container.appendChild(document.createTextNode(beforeText)); }

                    if (afterText) {
                        // Build after tree from deepest to root
                        let afterNode: Node = document.createTextNode(afterText);
                        for (let i: number = parentChain.length - 1; i >= 0; i--) {
                            const cloned: HTMLElement = (parentChain[parseInt(i.toString(), 10)] as HTMLElement)
                                .cloneNode(false) as HTMLElement;
                            // Only re-generate id for the root node
                            if (i === 0) {
                                cloned.id = generateUniqueId('content');
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

    deleteBlockAtCursor(args: IDeleteBlockArgs): void {
        const { blockElement, mergeDirection, isUndoRedoAction } = args;
        if (!blockElement) { return; }

        if (isDividerBlock(blockElement) || this.editor.blocksInternal.length === 1) {
            const copyElement: HTMLElement = blockElement.cloneNode(true) as HTMLElement;
            const adjacentBlockElement: HTMLElement = blockElement.nextElementSibling as HTMLElement;
            this.deleteBlock({ ...args, blockElement: blockElement });
            this.createDefaultEmptyBlock(true);
            if (isDividerBlock(copyElement)) {
                if (isNullOrUndefined(adjacentBlockElement)) {
                    return;
                }
                if (getBlockContentElement(adjacentBlockElement).innerHTML === '<br>') {
                    clearBreakTags(adjacentBlockElement);
                }
                this.editor.setFocusToBlock(adjacentBlockElement);
                this.editor.togglePlaceholder(adjacentBlockElement, true);
                setCursorPosition(getBlockContentElement(adjacentBlockElement), 0);
                this.editor.showFloatingIcons(adjacentBlockElement);
            }
            return;
        }
        if (blockElement.getAttribute('data-block-type').startsWith('Toggle')) {
            this.transformToggleBlocksAsRegular(blockElement);
        }
        const getAdjacentBlock: (element: HTMLElement, direction: 'previous' | 'next') => HTMLElement | null =
            (element: HTMLElement, direction: 'previous' | 'next'): HTMLElement | null => {
                const adjacent: HTMLElement = (direction === 'previous' ? element.previousElementSibling : element.nextElementSibling) as HTMLElement;
                return adjacent as HTMLElement | null;
            };
        const adjacentBlock: HTMLElement | null = getAdjacentBlock(blockElement, mergeDirection);
        if (!adjacentBlock) { return; }
        const adjacentBlockModel: BlockModel = getBlockModelById(adjacentBlock.id, this.editor.blocksInternal);
        /*
        sourceBlock - the block that will be deleted after merging its content with the targetBlock
        targetBlock - the block that will remain after merging
        */
        const sourceBlock: HTMLElement = mergeDirection === 'previous' ? blockElement : adjacentBlock;
        const targetBlock: HTMLElement = mergeDirection === 'previous' ? adjacentBlock : blockElement;
        const sourceBlockModel: BlockModel = getBlockModelById(sourceBlock.id, this.editor.blocksInternal);
        const targetBlockModel: BlockModel = getBlockModelById(targetBlock.id, this.editor.blocksInternal);
        const sourceContent: HTMLElement = getBlockContentElement(sourceBlock) as HTMLElement;
        const targetContent: HTMLElement = getBlockContentElement(targetBlock) as HTMLElement;
        const specialTypes: string[] = ['Divider', 'ToggleParagraph', 'ToggleHeading1', 'ToggleHeading2', 'ToggleHeading3',
            'ToggleHeading4', 'Callout', 'Table', 'Code', 'Image'];
        const isSpecialType: boolean = specialTypes.indexOf(adjacentBlockModel.type) !== -1;

        if (!sourceContent || !targetContent || isSpecialType) { return; }
        const newCursorPos: number = targetContent.textContent.length;
        const lastChildId: string = targetContent.childNodes.length > 0 ?
            (targetContent.lastChild.nodeType === Node.ELEMENT_NODE
                ? (targetContent.lastChild as HTMLElement).id : targetContent.id) : '';
        const lastChild: HTMLElement = (lastChildId !== '') ? targetBlock.querySelector('#' + lastChildId) : null;
        const splitOffset: number = lastChild ? lastChild.textContent.length : 0;
        this.mergeBlocksAtDOMLevel(sourceContent, targetContent);
        this.editor.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, newCursorPos);
        this.editor.togglePlaceholder(targetBlock, true);
        this.editor.showFloatingIcons(targetBlock);

        if (targetBlockModel.type === BlockType.Template) {
            const newHtmlContent: string = targetContent.innerHTML;
            targetBlockModel.template = newHtmlContent;
        }
        this.updateContentModelsAfterDeletion(sourceContent, targetContent, targetBlockModel, sourceBlockModel);
        this.deleteBlock({
            ...args,
            blockElement: sourceBlock,
            lastChild: lastChild,
            splitOffset: splitOffset,
            contentElement: sourceContent
        });
    }

    private mergeBlocksAtDOMLevel(sourceContent: HTMLElement, targetContent: HTMLElement): void {
        const sourceBlockModel: BlockModel = getBlockModelById(sourceContent.closest('.e-block').id, this.editor.blocksInternal);
        sourceContent.childNodes.forEach((node: ChildNode, index: number) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text: string = node.textContent || '';
                if (targetContent.childNodes.length === 0) {
                    targetContent.appendChild(document.createTextNode(text));
                } else {
                    const lastTargetNode: ChildNode = targetContent.lastChild;
                    if (lastTargetNode.nodeType === Node.TEXT_NODE) {
                        lastTargetNode.textContent += text;
                    } else {
                        const span: HTMLElement = document.createElement('span');
                        span.textContent = text;

                        const sourceContentModel: ContentModel = sourceBlockModel.content[parseInt(index.toString(), 10)];
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

    private updateContentModelsAfterDeletion(
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

        if (targetHasSingleTextNode && sourceHasSingleTextNode) {
            // Case: Both blocks had plain text nodes → merge source content's text and target content's text
            if (sourceBlockModel.content.length === 0) {
                mergedContent.push(...targetBlockModel.content);
            }
            else if (targetBlockModel.content.length === 0) {
                mergedContent.push(...sourceBlockModel.content);
            }
            else if (targetBlockModel.content.length > 0 && sourceBlockModel.content.length > 0) {
                const t: ContentModel = targetBlockModel.content[0];
                const s: ContentModel = sourceBlockModel.content[0];
                mergedContent.push({
                    id: t.id,
                    content: (t.content) + (s.content)
                });
            }
        } else if ((!targetHasSingleTextNode && sourceHasSingleTextNode) || (targetHasSingleTextNode && !sourceHasSingleTextNode)) {
            // Case: Target has formatted, source has plain text → just append the content
            // Case: Target has plain text, source has formatted → just append the content
            const source: ContentModel = sourceBlockModel.content[0];
            mergedContent.push(...targetBlockModel.content);
            if (source && source.content !== '') {
                mergedContent.push({
                    id: source.id,
                    content: source.content
                });
            }
        } else {
            // Case: All other cases → merge both content arrays
            mergedContent.push(...targetBlockModel.content, ...sourceBlockModel.content);
        }
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        targetBlockModel.content = mergedContent;
        (this.editor as any).isProtectedOnChange = prevOnChange;
    }

    transformBlockToParagraph(blockElement: HTMLElement, blockModel: BlockModel): void {
        blockElement.innerHTML = '';
        const transformedContentElement: HTMLElement = this.transformBlock({
            block: blockModel,
            blockElement: blockElement,
            newBlockType: BlockType.Paragraph
        });
        blockElement.appendChild(transformedContentElement);
        this.updatePropChangesToModel();
        this.editor.showFloatingIcons(blockElement);
    }

    /**
     * Generates new IDs for the block and its content.
     *
     * @param {BlockModel} block - The block model to generate new IDs for.
     * @returns {BlockModel} - The block model with new IDs.
     * @hidden
     */
    public generateNewIdsForBlock(block: BlockModel): BlockModel {
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        block.id = generateUniqueId('block');

        block.content = block.content && block.content.map((content: ContentModel) => {
            if (content.type === 'Label' || content.type === 'Mention') {
                content.dataId = generateUniqueId(content.id);
            } else {
                content.id = generateUniqueId('content');
            }

            return content;
        });

        block.children = block.children && block.children.map((child: BlockModel) =>
            this.generateNewIdsForBlock(child)
        );
        (this.editor as any).isProtectedOnChange = prevOnChange;
        return block;
    }

    handleBlockIndentation(args: IIndentBlockArgs): void {
        const { blockIDs, shouldDecrease, isUndoRedoAction } : IIndentBlockArgs = args;
        const prevOnChange: boolean = (this.editor as any).isProtectedOnChange;
        (this.editor as any).isProtectedOnChange = true;
        blockIDs.forEach((blockId: string) => {
            const blockElement: HTMLElement = this.editor.getBlockElementById(blockId);
            const blockModel: BlockModel = getBlockModelById(blockId, this.editor.blocksInternal);
            if (shouldDecrease) {
                if (blockModel.indent > 0) {
                    blockModel.indent--;
                }
            }
            else {
                // Indent - only allow if previous block is at same or higher level
                const previousBlockElement: HTMLElement = getAdjacentBlock(blockElement, 'previous');
                if (previousBlockElement) {
                    const previousBlockModel: BlockModel = getBlockModelById(previousBlockElement.id, this.editor.blocksInternal);
                    if (blockModel.indent <= previousBlockModel.indent) {
                        blockModel.indent++;
                    }
                }
                else {
                    blockModel.indent++;
                }
            }
            this.updateBlockIndentAttribute(blockElement, blockModel.indent);
        });
        (this.editor as any).isProtectedOnChange = prevOnChange;
        this.editor.listBlockAction.recalculateMarkersForListItems();

        if (!isUndoRedoAction) {
            this.editor.undoRedoAction.pushToUndoStack({
                action: 'indent',
                data: {
                    blockIDs,
                    shouldDecrease,
                    isUndoRedoAction
                }
            });
        }
    }

    triggerBlockAdditionEvent(block: BlockModel): void {
        const eventArgs: BlockAddedEventArgs = {
            block: block,
            parentID: block.parentId,
            index: getBlockIndexById(block.id, this.editor.blocksInternal),
            isPasted: false,
            isInteracted: true
        };
        this.editor.trigger('blockAdded', eventArgs);
    }

    createDefaultEmptyBlock(shouldUpdateDom?: boolean, blockId?: string): BlockModel {
        if ((this.editor.blocksInternal.length === 0)) {
            this.editor.blocksInternal.push(
                {
                    id: blockId ? blockId : generateUniqueId('block'),
                    type: BlockType.Paragraph
                }
            );
            this.updatePropChangesToModel();
            if (shouldUpdateDom) {
                this.editor.blockWrapper.innerHTML = '';
                const blockElement: HTMLElement = this.createBlockElement(this.editor.blocksInternal[0]);
                this.editor.blockWrapper.appendChild(blockElement);
                this.editor.setFocusToBlock(blockElement);
                setCursorPosition(getBlockContentElement(blockElement), 0);
                this.editor.showFloatingIcons(blockElement);
            }
            return this.editor.blocksInternal[0];
        }
        return null;
    }

    triggerWholeContentUpdate(block: BlockModel, content: ContentModel[]): void {
        const blockIndex: number = getBlockIndexById(block.id, this.editor.blocksInternal);
        const parentBlock: BlockModel = getBlockModelById(block.parentId, this.editor.blocksInternal);
        if (parentBlock) {
            (parentBlock.children[blockIndex as number] as any).setProperties({ content: content }, true);
        }
        else {
            (this.editor.blocksInternal[blockIndex as number] as any).setProperties({ content: content }, true);
        }
    }

    public destroy(): void {
        this.contentRenderer = null;
        this.paragraphRenderer = null;
        this.headingRenderer = null;
        this.listRenderer = null;
        this.codeRenderer = null;
        this.quoteRenderer = null;
        this.calloutRenderer = null;
        this.toggleRenderer = null;
        this.commonBlocksRenderer = null;
        this.removeEventListeners();
    }

    public handleBlockPropertyChanges(e: { [key: string]: BlockEditorModel }, args?: { isChildren: boolean, parentIndex: number }): void {
        const blockIndices: string[] = Object.keys(e.newProp.blocks);
        for (let i: number = 0; i < blockIndices.length; i++) {
            const blockIndex: number = parseInt(blockIndices[parseInt(i.toString(), 10)].toString(), 10);
            const newBlock: BlockModel = e.newProp.blocks[parseInt(blockIndex.toString(), 10)];
            const oldBlock: BlockModel = e.oldProp.blocks[parseInt(blockIndex.toString(), 10)];
            const changedProps: string[] = Object.keys(newBlock);

            for (let j: number = 0; j < changedProps.length; j++) {
                const property: keyof BlockModel = changedProps[parseInt(j.toString(), 10)] as keyof BlockModel;
                const block: BlockModel = (args && args.isChildren)
                    ? this.editor.blocksInternal[parseInt(args.parentIndex.toString(), 10)].children[parseInt(blockIndex.toString(), 10)]
                    : this.editor.blocksInternal[parseInt(blockIndex.toString(), 10)];
                if (!block) { continue; }

                this.updateBlockProperties(oldBlock, block, property);

                if (property === 'children') {
                    this.handleBlockPropertyChanges({
                        newProp: { blocks: newBlock.children },
                        oldProp: { blocks: oldBlock.children } }, { isChildren: true, parentIndex: blockIndex });
                }
            }
        }
    }

    private updateBlockProperties(oldBlock: BlockModel, newBlock: BlockModel, prop: keyof BlockModel): void {
        const blockElement: HTMLElement = document.querySelector(newBlock.id);
        if (!blockElement) { return; }
        switch (prop) {
        case 'type':
            this.editor.handleBlockTransformation({
                block: newBlock,
                blockElement: blockElement,
                newBlockType: newBlock.type
            });
            break;
        case 'placeholder':
            this.editor.togglePlaceholder(blockElement, blockElement === this.editor.currentFocusedBlock);
            break;
        case 'cssClass':
            if (oldBlock.cssClass) { blockElement.classList.remove(oldBlock.cssClass); }
            this.updateBlockCssClass(blockElement, newBlock.cssClass);
            break;
        case 'indent':
            this.updateBlockIndentAttribute(blockElement, newBlock.indent);
            break;
        case 'isExpanded':
            this.toggleRenderer.updateToggleBlockExpansion(blockElement, newBlock.isExpanded);
            break;
        case 'isChecked':
            this.listRenderer.toggleCheckedState(newBlock, newBlock.isChecked);
            break;
        default:
            break;
        }
    }

    private adjustViewForFocusedBlock(): void {
        const lastBlock: BlockModel = this.editor.blocksInternal[this.editor.blocksInternal.length - 1];
        if (!this.editor.currentFocusedBlock || !this.editor.element) {
            return;
        }
        const currentBlockElement: HTMLElement = this.editor.currentFocusedBlock;

        const container: HTMLElement = this.editor.element;
        const containerRect: DOMRect | ClientRect = container.getBoundingClientRect();
        const blockRect: DOMRect | ClientRect = currentBlockElement.getBoundingClientRect();
        // If currentFocusedBlock is the last block
        if (lastBlock && lastBlock.id === this.editor.currentFocusedBlock.id) {
            container.scrollTo({ top: container.scrollHeight });
        }
        // If interacted middle block reaches the end.
        else if (blockRect.bottom > containerRect.bottom) {
            const offset: number = blockRect.bottom - containerRect.bottom;
            container.scrollTop += offset;
        }
    }
}
