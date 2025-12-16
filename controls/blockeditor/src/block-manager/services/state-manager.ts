import { BlockType } from '../../models/enums';
import { BaseChildrenProp, BlockModel, ContentModel } from '../../models/index';
import { sanitizeBlock, sanitizeContent } from '../../common/utils/transform';
import { getSelectedRange } from '../../common/utils/selection';
import { getBlockModelById, getBlockContentElement, isChildrenProp } from '../../common/utils/block';
import { decoupleReference, generateUniqueId } from '../../common/utils/common';
import { isNodeAroundSpecialElements } from '../../common/utils/common';
import { findClosestParent, wrapNodeWithTag } from '../../common/utils/dom';
import * as constants from '../../common/constant';
import { BlockFactory } from './index';
import { BlockManager } from '../base/block-manager';

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
     * Updates content in the block model
     *
     * @param {Node} contentElement The content element
     * @param {BlockModel} blockModel The block model to update
     * @returns {void}
     * @hidden
     */
    public updateContentModelBasedOnDOM(contentElement: Node, blockModel: BlockModel): void {
        const childLen: number = contentElement ? contentElement.childNodes.length : 0;
        if ((childLen === 0) || (childLen === 1 && contentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
            const textNode: Node = contentElement ? contentElement.firstChild : null;
            const nodeValue: string = (textNode && textNode.nodeValue) ? textNode.nodeValue : '';
            if (blockModel.content.length === 0) {
                blockModel.content = [BlockFactory.createTextContent({ content: nodeValue })];
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
                        content.push(BlockFactory.createTextContent({ id: element.id, content: element.textContent }));
                    }
                }
            });

            /* Model update */
            this.parent.blockService.updateContent(blockModel.id, content);
        }
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

        const oldBlockModel: BlockModel = decoupleReference(sanitizeBlock(block));
        const contentElement: HTMLElement = this.getContentElementForUpdate(getSelectedRange(), blockElement);
        if (!contentElement) { return; }

        if (!block.content || contentElement.childNodes.length === 0) {
            this.parent.blockService.updateContent(block.id, []);
        }
        let previousContent: ContentModel;
        let newContentId: string = '';

        contentElement.childNodes.forEach((node: ChildNode) => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent) {
                    if (block.content.length === 0) {
                        this.parent.blockService.updateContent(
                            block.id,
                            [BlockFactory.createTextContent(
                                { id: node.parentElement.id || generateUniqueId(constants.CONTENT_ID_PREFIX), content: node.textContent }
                            )]
                        );
                        contentElement.id = newContentId = block.content[0].id;
                    } else {
                        if (isNodeAroundSpecialElements(node)) {
                            const index: number = Array.from(contentElement.childNodes).indexOf(node);
                            block.content.splice(index, 0, BlockFactory.createTextContent({ content: node.textContent }));
                            const span: HTMLElement = wrapNodeWithTag(node.cloneNode(true), 'span');
                            span.id = newContentId = block.content[parseInt(index.toString(), 10)].id;
                            contentElement.insertBefore(span, node);
                            contentElement.removeChild(node);
                        }
                        else {
                            previousContent = decoupleReference(sanitizeContent(block.content[0]));
                            block.content[0].content = node.textContent;
                            newContentId = block.content[0].id;
                        }
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element: HTMLElement = node as HTMLElement;
                if (element.classList.contains('e-label-chip') || element.classList.contains('e-user-chip')) {
                    return;
                }
                if (element.innerText || element.childNodes.length > 0) {
                    const existingContent: ContentModel = block.content.find((c: ContentModel) => c.id === element.id);
                    if (existingContent) {
                        previousContent = decoupleReference(sanitizeContent(existingContent));
                        existingContent.content = element.innerText;
                        newContentId = existingContent.id;
                    } else {
                        const newId: string = newContentId = element.id || generateUniqueId(constants.CONTENT_ID_PREFIX);
                        block.content.push(BlockFactory.createTextContent({ id: newId, content: element.innerText }));
                    }
                }
            }
        });

        if (block.blockType !== BlockType.Code) {
            this.cleanUpStaleContents(block, contentElement);
        }

        const clonedBlock: BlockModel = decoupleReference(sanitizeBlock(block));

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
     * Cleans up stale content models from a block
     *
     * @param {BlockModel} block The block model to clean
     * @param {HTMLElement} contentElement The content element to check against
     * @returns {void}
     * @hidden
     */
    public cleanUpStaleContents(block: BlockModel, contentElement: HTMLElement): void {
        const idAttributes: string [] = ['id', 'data-label-id', 'data-user-id'];
        const domContentIds: Set<string> = new Set();

        for (const node of Array.from(contentElement.childNodes)) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                for (const attr of idAttributes) {
                    const value: string | null = (node as HTMLElement).getAttribute(attr);
                    if (value) {
                        domContentIds.add(value);
                    }
                }
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                if (node.parentElement) {
                    domContentIds.add(node.parentElement.id);
                }
            }
        }

        const currentContent: ContentModel[] = block.content.filter((c: ContentModel) => domContentIds.has(c.id));
        if (currentContent.length !== block.content.length) {
            this.parent.blockService.updateContent(block.id, currentContent);
        }
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

            if (block.content) {
                block.content.forEach((content: ContentModel) => {
                    if (!content.id) { content.id = generateUniqueId(constants.CONTENT_ID_PREFIX); }
                });
            }

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
