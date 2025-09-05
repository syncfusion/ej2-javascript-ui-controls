import { BlockEditorModel, BlockType } from '../base/index';
import { BlockEditor } from '../base/blockeditor';
import { BaseChildrenProp, BlockModel, ContentModel } from '../models/index';
import { sanitizeBlock, sanitizeContent } from '../utils/transform';
import { getSelectedRange } from '../utils/selection';
import { getBlockModelById, getBlockContentElement, isChildrenProp } from '../utils/block';
import { isolateModel, generateUniqueId } from '../utils/common';
import { isNodeAroundSpecialElements } from '../utils/common';
import { findClosestParent, wrapNodeWithTag } from '../utils/dom';
import * as constants from '../base/constant';
import { BlockFactory } from '../services/index';

/**
 * Manages state and data in the BlockEditor
 */
export class StateManager {
    private editor: BlockEditor
    /**
     * Creates a new StateManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     */
    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Updates content changes to the model
     *
     * @param {HTMLElement} blockElement The block element being updated
     * @param {HTMLElement} contentElement The content element being updated
     * @returns {void}
     * @hidden
     */
    updateContentChangesToModel(blockElement: HTMLElement, contentElement: HTMLElement): void {
        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        if (!blockModel) { return; }

        this.updateContentModelBasedOnDOM(contentElement, blockModel);
        this.updatePropChangesToModel();
    }

    /**
     * Updates content in the block model
     *
     * @param {Node} contentElement The content element
     * @param {BlockModel} blockModel The block model to update
     * @returns {void}
     * @hidden
     */
    updateContentModelBasedOnDOM(contentElement: Node, blockModel: BlockModel): void {
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
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
            this.editor.blockService.updateContent(blockModel.id, content);
        }
        this.editor.isProtectedOnChange = prevOnChange;
    }

    /**
     * Updates the internal content models based on user typing
     *
     * @param {HTMLElement} blockElement - The block element being updated
     * @param {Event} updateEvent - The original input event that triggered the update (optional)
     * @returns {void}
     * @hidden
     */
    updateContentOnUserTyping(blockElement: HTMLElement, updateEvent?: Event): void {
        if (!blockElement) { return; }

        const block: BlockModel = getBlockModelById(blockElement.id, this.editor.getEditorBlocks());
        if (!block) { return; }

        const oldBlockModel: BlockModel = isolateModel(sanitizeBlock(block));
        const contentElement: HTMLElement = this.getContentElementForUpdate(getSelectedRange(), blockElement);
        if (!contentElement) { return; }

        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        if (!block.content || contentElement.childNodes.length === 0) {
            this.editor.blockService.updateContent(block.id, []);
        }
        let previousContent: ContentModel;
        let newContentId: string = '';

        contentElement.childNodes.forEach((node: ChildNode) => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent) {
                    if (block.content.length === 0) {
                        this.editor.blockService.updateContent(
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
                            previousContent = isolateModel(sanitizeContent(block.content[0]));
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
                        previousContent = isolateModel(sanitizeContent(existingContent));
                        existingContent.content = element.innerText;
                        newContentId = existingContent.id;
                    } else {
                        const newId: string = newContentId = element.id || generateUniqueId(constants.CONTENT_ID_PREFIX);
                        block.content.push(BlockFactory.createTextContent({ id: newId, content: element.innerText }));
                    }
                }
            }
        });

        if (block.type !== BlockType.Code) {
            this.cleanUpStaleContents(block, contentElement);
        }

        this.editor.isProtectedOnChange = prevOnChange;
        const clonedBlock: BlockModel = isolateModel(sanitizeBlock(block));

        this.editor.notify('contentChanged', { oldBlockModel: oldBlockModel, updatedBlockModel: clonedBlock });
        this.editor.trigger('contentChanged', {
            event: updateEvent,
            // user: this.getCurrentUser(),
            previousContent: previousContent,
            content: block.content.find((c: ContentModel) => c.id === newContentId)
        });
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
    cleanUpStaleContents(block: BlockModel, contentElement: HTMLElement): void {
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
            this.editor.blockService.updateContent(block.id, currentContent);
        }
    }

    /**
     * Updates read-only state of editable elements in the editor
     *
     * @returns {void}
     * @hidden
     */
    updateEditorReadyOnlyState(): void {
        const defaultNonEditableElements: string[] = ['e-checkmark', 'e-callout-icon', 'e-toggle-icon', 'e-be-hr'];
        let editableElements: HTMLElement[] = Array.from(this.editor.element.querySelectorAll(`[contenteditable='${this.editor.readOnly}']`));

        editableElements = editableElements.filter((element: HTMLElement) => {
            return !defaultNonEditableElements.some((className: string) => element.classList.contains(className));
        });

        editableElements.forEach((element: HTMLElement) => {
            element.contentEditable = (!this.editor.readOnly).toString();
        });

        this.editor.element.classList.toggle('e-readonly', this.editor.readOnly);
    }

    handleBlockPropertyChanges(e: { [key: string]: BlockEditorModel }, args?: { isChildren: boolean, parentIndex: number }): void {
        const blockIndices: string[] = Object.keys(e.newProp.blocks);
        for (let i: number = 0; i < blockIndices.length; i++) {
            const blockIndex: number = parseInt(blockIndices[parseInt(i.toString(), 10)].toString(), 10);
            const newBlock: BlockModel = e.newProp.blocks[parseInt(blockIndex.toString(), 10)];
            const oldBlock: BlockModel = e.oldProp.blocks[parseInt(blockIndex.toString(), 10)];
            const changedProps: string[] = Object.keys(newBlock);

            for (let j: number = 0; j < changedProps.length; j++) {
                const property: keyof BlockModel = changedProps[parseInt(j.toString(), 10)] as keyof BlockModel;
                const editorBlocks: BlockModel[] = this.editor.getEditorBlocks();
                const block: BlockModel = (args && args.isChildren)
                    ? (editorBlocks[parseInt(args.parentIndex.toString(), 10)].props as BaseChildrenProp)
                        .children[parseInt(blockIndex.toString(), 10)]
                    : editorBlocks[parseInt(blockIndex.toString(), 10)];

                this.updateBlockProperties(oldBlock, block, property);

                if (property === 'props' && (newBlock.props as BaseChildrenProp).children) {
                    this.handleBlockPropertyChanges(
                        {
                            newProp: { blocks: (newBlock.props as BaseChildrenProp).children },
                            oldProp: { blocks: (oldBlock.props as BaseChildrenProp).children }
                        },
                        { isChildren: true, parentIndex: blockIndex }
                    );
                }
            }
        }
    }

    private updateBlockProperties(oldBlock: BlockModel, newBlock: BlockModel, prop: keyof BlockModel): void {
        const blockElement: HTMLElement = this.editor.element.querySelector('#' + newBlock.id);
        if (!blockElement) { return; }
        switch (prop) {
        case 'type':
            this.editor.blockRendererManager.handleBlockTransformation({
                block: newBlock,
                blockElement: blockElement,
                newBlockType: newBlock.type
            });
            break;
        case 'cssClass':
            if (oldBlock.cssClass) { blockElement.classList.remove(oldBlock.cssClass); }
            this.editor.blockRendererManager.updateBlockCssClass(blockElement, newBlock.cssClass);
            break;
        case 'indent':
            this.editor.blockRendererManager.updateBlockIndentAttribute(blockElement, newBlock.indent);
            break;
        default:
            break;
        }
    }

    /**
     * Populates blocks with missing properties if they don't have them
     *
     * @param {BlockModel[]} blocks Array of block models
     * @param {string} parentId The id of the parent block
     * @returns {BlockModel[]} Updated array of block models
     */
    populateBlockProperties(blocks: BlockModel[], parentId?: string): BlockModel[] {
        const populatedBlocks: BlockModel[] = blocks.map((block: BlockModel) => {
            if (parentId) { block.parentId = parentId; }

            const updatedBlock: BlockModel = BlockFactory.createBlockFromPartial(block);

            if (updatedBlock.content && updatedBlock.content.length > 0) {
                updatedBlock.content = updatedBlock.content.map((originalContent: ContentModel) => {
                    return BlockFactory.createContentFromPartial(originalContent);
                });
            }

            const props: BaseChildrenProp = updatedBlock.props as BaseChildrenProp;
            if ((isChildrenProp(updatedBlock)) && props.children.length > 0) {
                props.children = this.populateBlockProperties(props.children, block.id);
            }

            return updatedBlock;
        });

        return populatedBlocks;
    }

    /**
     * Populates blocks with unique IDs if they don't have them
     *
     * @param {BlockModel[]} blocks Array of block models
     * @param {string} parentBlockId Optional parent block ID
     * @returns {void}
     * @hidden
     */
    populateUniqueIds(blocks: BlockModel[], parentBlockId?: string): void {
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;
        blocks.forEach((block: BlockModel) => {
            if (!block.id) { block.id = generateUniqueId(constants.BLOCK_ID_PREFIX); }
            if (parentBlockId) { block.parentId = parentBlockId; }

            if (block.content) {
                block.content.forEach((content: ContentModel) => {
                    if (!content.id) { content.id = generateUniqueId(constants.CONTENT_ID_PREFIX); }
                });
            }

            const props: BaseChildrenProp = block.props as BaseChildrenProp;
            if ((isChildrenProp(block)) && props.children.length > 0) {
                this.populateUniqueIds(props.children, block.id);
            }
        });
        this.editor.isProtectedOnChange = prevOnChange;
    }

    /**
     * Removes all placeholder attributes from block contents
     * and refreshes the placeholder for the current focused block
     *
     * @returns {void}
     * @hidden
     */
    refreshPlaceholder(): void {
        this.editor.element.querySelectorAll('.' + constants.CONTENT_CLS).forEach((el: HTMLElement) => {
            if (el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', '');
            }
        });
        if (this.editor.currentFocusedBlock) {
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        }
    }

    /**
     * Updates the property changes to the model
     *
     * @returns {void}
     * @hidden
     */
    updatePropChangesToModel(): void {
        this.editor.setProperties({ blocks: this.editor.getEditorBlocks() }, true);
        this.editor.setEditorBlocks(this.editor.blocks.slice());
    }
}
