import { BaseChildrenProp, BlockModel, ContentModel } from '../../models/index';
import { getSelectedRange } from '../../common/utils/selection';
import { getBlockModelById, getBlockContentElement, isChildrenProp } from '../../common/utils/block';
import { decoupleReference, generateUniqueId } from '../../common/utils/common';
import { findClosestParent } from '../../common/utils/dom';
import * as constants from '../../common/constant';
import { BlockFactory } from './block-factory';
import { BlockManager } from '../base/block-manager';
import { convertInlineElementsToContentModels } from '../../common/utils/html-parser';

/**
 * Manages state and data in the BlockEditor
 */
export class StateManager {
    private parent: BlockManager
    /**
     * Creates a new StateManager instance
     *
     * @param {BlockManager} parent The parent BlockManager instance
     */
    constructor(parent: BlockManager) {
        this.parent = parent;
    }

    /**
     * Updates the internal content models based on user typing
     *
     * @param {HTMLElement} blockElement - The block element being updated
     * @param {Event} updateEvent - The original input event that triggered the update (optional)
     * @returns {void}
     * @hidden
     */
    public updateContentOnUserTyping(blockElement: HTMLElement, updateEvent?: Event): void {
        if (!blockElement) { return; }

        const block: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        if (!block || (block && (block.blockType === 'Code' || block.blockType === 'Table'))) { return; }

        const oldBlockModel: BlockModel = decoupleReference(block);
        const contentElement: HTMLElement = this.getContentElementForUpdate(getSelectedRange(), blockElement);
        if (!contentElement) { return; }

        if (!block.content || contentElement.childNodes.length === 0) {
            this.parent.blockService.updateContent(block.id, []);
        }

        const newContents: ContentModel[] = convertInlineElementsToContentModels(contentElement, true);
        this.parent.blockService.updateContent(block.id, newContents);

        const clonedBlock: BlockModel = decoupleReference(block);

        this.parent.undoRedoAction.trackContentChangedForUndoRedo(oldBlockModel, clonedBlock);
        this.parent.eventService.addChange({
            action: 'Update',
            data: {
                block: clonedBlock,
                prevBlock: oldBlockModel
            }
        });
        this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
        this.updateManagerBlocks();
    }

    private getContentElementForUpdate(range: Range, blockElement: HTMLElement): HTMLElement {
        let contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return null; }

        if (blockElement.closest('.' + constants.TOGGLE_BLOCK_CLS)) {
            const toggleHeader: HTMLElement = findClosestParent(range.startContainer, '.e-toggle-header');
            if (toggleHeader) {
                contentElement = toggleHeader.querySelector('.' + constants.CONTENT_CLS);
            }
        }

        return contentElement;
    }

    /**
     * Populates blocks with unique IDs if they don't have them
     *
     * @param {BlockModel[]} blocks Array of block models
     * @param {string} parentBlockId Optional parent block ID
     * @returns {void}
     * @hidden
     */
    public populateUniqueIds(blocks: BlockModel[], parentBlockId?: string): void {
        blocks.forEach((block: BlockModel) => {
            if (!block.id) { block.id = generateUniqueId(constants.BLOCK_ID_PREFIX); }
            if (parentBlockId) { block.parentId = parentBlockId; }

            const props: BaseChildrenProp = block.properties as BaseChildrenProp;
            if ((isChildrenProp(block)) && props.children.length > 0) {
                this.populateUniqueIds(props.children, block.id);
            }
        });
    }

    /**
     * Updates the property changes to the model
     *
     * @returns {void}
     * @hidden
     */
    public updateManagerBlocks(): void {
        this.parent.blocks = this.parent.getEditorBlocks();
        this.parent.observer.notify('updateEditorBlocks', { blocks: this.parent.blocks });
    }
}
