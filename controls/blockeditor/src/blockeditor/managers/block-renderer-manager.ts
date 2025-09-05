import { addClass, createElement } from '@syncfusion/ej2-base';
import { BlockEditor } from '../base/blockeditor';
import { BaseChildrenProp, BlockModel, ChecklistProps } from '../models/index';
import { ITransformBlockInteraction, ITransformOperation, RangePath } from '../base/interface';
import { BlockType } from '../base/enums';
import { cleanCheckmarkElement, getBlockContentElement, isChildrenTypeBlock, isListTypeBlock } from '../utils/block';
import { ContentRenderer, CalloutRenderer, CommonBlocksRenderer, HeadingRenderer, ListRenderer, ParagraphRenderer,
    QuoteRenderer, CodeRenderer, ImageRenderer, CollapsibleRenderer } from '../renderer/index';
import { setCursorPosition, captureSelectionState } from '../utils/selection';
import { findClosestParent } from '../utils/dom';
import { isolateModel, getAbsoluteOffset } from '../utils/common';
import { events } from '../base/constant';
import * as constants from '../base/constant';
import { BlockFactory } from '../services/index';
import { sanitizeBlock } from '../utils/transform';

/**
 * Manages all block rendering operations in the BlockEditor
 */
export class BlockRendererManager {

    private editor: BlockEditor
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
    public collapsibleRenderer: CollapsibleRenderer;

    /** @hidden */
    public commonBlocksRenderer: CommonBlocksRenderer;

    /**
     * Creates a new BlockRendererManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     */
    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.contentRenderer = new ContentRenderer(this.editor);
        this.initializeRenderers();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Initializes all the renderers used by this manager
     *
     * @returns {void}
     */
    private initializeRenderers(): void {
        this.paragraphRenderer = new ParagraphRenderer(this.editor);
        this.headingRenderer = new HeadingRenderer(this.editor);
        this.listRenderer = new ListRenderer(this.editor);
        this.quoteRenderer = new QuoteRenderer(this.editor);
        this.codeRenderer = new CodeRenderer(this.editor);
        this.imageRenderer = new ImageRenderer(this.editor);
        this.calloutRenderer = new CalloutRenderer(this.editor);
        this.collapsibleRenderer = new CollapsibleRenderer(this.editor);
        this.commonBlocksRenderer = new CommonBlocksRenderer(this.editor);
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
        const blockElement: HTMLElement = createElement('div', {
            id: block.id,
            className: `e-block ${isListTypeBlock(block.type) ? 'e-list-block' : ''}${block.cssClass ? ' ' + block.cssClass : ''}`,
            attrs: {
                'data-block-type': block.type
            }
        });

        this.updateBlockCssClass(blockElement, block.cssClass);
        this.updateBlockIndentAttribute(blockElement, block.indent);

        if (block.type === BlockType.Divider) {
            blockElement.setAttribute('contenteditable', 'false');
        }

        if (isChildrenTypeBlock(block.type)) {
            this.renderNestedTypeBlockContent(block, blockElement);
        } else {
            this.renderBlockContent(block, blockElement, contentElement);
        }

        return blockElement;
    }

    /**
     * Inserts a new block element into the DOM.
     *
     * @param {HTMLElement} blockElement - The block element to insert.
     * @param {HTMLElement} targetElement - The target element to insert the block element relative to.
     * @param {boolean} isAfter - Whether to insert the block element after the target element.
     * @returns {void}
     * @hidden
     */
    insertBlockElementInDOM(blockElement: HTMLElement, targetElement?: HTMLElement, isAfter?: boolean): void {
        if (targetElement) {
            targetElement.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', blockElement);
        } else {
            this.editor.blockWrapper.appendChild(blockElement);
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
        case BlockType.Heading:
            contentElement = this.headingRenderer.renderHeading(block, blockElement, existingContentElement);
            break;
        case BlockType.BulletList:
        case BlockType.NumberedList:
        case BlockType.Checklist:
            contentElement = this.listRenderer.renderListItem(block, blockElement, existingContentElement);
            break;
        case BlockType.Code:
            contentElement = this.codeRenderer.renderCodeBlock(block);
            break;
        case BlockType.Image:
            contentElement = this.imageRenderer.renderImage(block);
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
        }

        if (contentElement) {
            this.populateClassListsForContent(block, contentElement);
            blockElement.appendChild(contentElement);
        }
    }

    private populateClassListsForContent(block: BlockModel, contentElement: HTMLElement): void {
        const notAllowedTypes: string[] = [BlockType.Code, BlockType.Callout]; //Table, Code, Callout etc.
        if (isListTypeBlock(block.type)) {
            const listItem: HTMLElement = contentElement.querySelector('li');
            if (listItem) {
                listItem.classList.add('e-block-content');
            }
        } else if (notAllowedTypes.indexOf(block.type) === -1) {
            contentElement.classList.add('e-block-content');
        }
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
        else if (block.type.toString().startsWith('Collapsible')) {
            contentElement = this.collapsibleRenderer.renderCollapsibleBlock(block, blockElement);
        }

        if (contentElement) {
            blockElement.appendChild(contentElement);
        }
    }

    /**
     * Handles block transformation, converting one block type to another
     *
     * @param {ITransformBlockInteraction} args - Arguments for block transformation
     * @returns {void}
     * @hidden
     */
    public handleBlockTransformation(args: ITransformBlockInteraction): void {
        const { block, blockElement, newBlockType, isUndoRedoAction } = args;
        const rangePath: RangePath = this.editor.mentionRenderer.nodeSelection.getStoredBackupRange();
        this.editor.mentionRenderer.cleanMentionArtifacts(blockElement, true);
        this.editor.mentionRenderer.removeMentionQueryKeysFromModel('/', args.isUndoRedoAction);
        const specialTypes: string[] = [BlockType.Divider, BlockType.CollapsibleParagraph, BlockType.CollapsibleHeading, BlockType.Callout, 'Table', BlockType.Code];
        const isClosestCallout: HTMLElement = findClosestParent(blockElement, '.' + constants.CALLOUT_BLOCK_CLS);
        const isClosestToggle: HTMLElement = findClosestParent(blockElement, '.' + constants.TOGGLE_BLOCK_CLS);
        let transformedElement: HTMLElement = blockElement;
        const isSpecialType: boolean = (specialTypes.indexOf(newBlockType) > -1) || (specialTypes.indexOf(block.type) > -1);
        const isBlockNotEmpty: boolean = blockElement.textContent.length > 0;
        let nextSiblingOfTransformedEle: HTMLElement;

        // Proceed to add new block rather than transforming current block for below conditions
        if (isSpecialType && (isBlockNotEmpty || (isClosestCallout || isClosestToggle))) {
            transformedElement = this.editor.blockCommandManager.addNewBlock({
                targetBlock: isClosestCallout || isClosestToggle || blockElement,
                blockType: newBlockType
            });
        } else {
            cleanCheckmarkElement(blockElement);
            transformedElement = this.transformBlock({
                block: block,
                blockElement: blockElement,
                newBlockType: newBlockType,
                isUndoRedoAction: isUndoRedoAction,
                props: args.props
            });
        }

        // Add a new paragraph block after the transformed block if it is a special type block.
        if (isSpecialType && !isUndoRedoAction) {
            nextSiblingOfTransformedEle = this.editor.blockCommandManager.addNewBlock({
                targetBlock: transformedElement,
                blockType: BlockType.Paragraph,
                preventUIUpdate: true,
                contentElement: this.editor.createElement('p', {
                    className: constants.CONTENT_CLS,
                    innerHTML: '<br>', // Added to hide placeholder initially
                    attrs: {
                        contenteditable: 'true'
                    }
                })
            });
        }
        const contentElement: HTMLElement = getBlockContentElement(transformedElement);

        this.editor.togglePlaceholder(transformedElement, true);

        if (transformedElement.getAttribute('data-block-type') === BlockType.Callout) {
            this.editor.setFocusToBlock(transformedElement.querySelector('.' + constants.BLOCK_CLS));
        }
        else {
            this.editor.setFocusToBlock(transformedElement);
        }

        if (rangePath && rangePath.endContainer && contentElement) {
            setCursorPosition(contentElement, getAbsoluteOffset(contentElement, rangePath.endContainer, rangePath.endOffset));
        }

        this.editor.listBlockAction.recalculateMarkersForListItems();
        this.editor.floatingIconManager.showFloatingIcons(transformedElement);

        if (newBlockType === BlockType.Divider && nextSiblingOfTransformedEle) {
            this.setFocusAndUIForNewBlock(nextSiblingOfTransformedEle);
        }
    }

    /**
     * Transforms an existing block into a different type
     *
     * @param {ITransformBlockInteraction} args options for transforming block
     * @returns {HTMLElement} - The transformed block element
     * @hidden
     */
    transformBlock(args: ITransformBlockInteraction): HTMLElement {
        this.editor.previousSelection = captureSelectionState();
        const { blockElement, newBlockType, isUndoRedoAction, props } = args;
        let { block } = args;
        const oldBlockClone: BlockModel = isolateModel(sanitizeBlock(block));
        const prevOnChange: boolean = this.editor.isProtectedOnChange;
        this.editor.isProtectedOnChange = true;

        block.type = newBlockType;
        block.props = props || {};

        block = this.editor.blockService.updateBlock(block.id, BlockFactory.createBlockFromPartial({
            ...oldBlockClone,
            type: newBlockType,
            props: props || {}
        }));
        this.editor.stateManager.updatePropChangesToModel();
        this.editor.isProtectedOnChange = prevOnChange;

        const newBlockElement: HTMLElement = this.createBlockElement(block);
        blockElement.replaceWith(newBlockElement);

        this.editor.eventManager.triggerBlockTransformedEvent(newBlockElement, block, oldBlockClone, isUndoRedoAction);
        this.setFocusAndUIForNewBlock(newBlockElement);

        return newBlockElement;
    }

    /**
     * Transforms a block to normal paragraph block.
     *
     * @param {HTMLElement} blockElement - The block element to render the content into.
     * @param {BlockModel} blockModel - The block model to render.
     * @returns {void}
     * @hidden
     */
    transformBlockToParagraph(blockElement: HTMLElement, blockModel: BlockModel): void {
        this.editor.floatingIconManager.showFloatingIcons(this.transformBlock({
            block: blockModel,
            blockElement: blockElement,
            newBlockType: BlockType.Paragraph
        }));
    }

    /**
     * Re-renders the content of a block
     *
     * @param {BlockModel} block The block model to re-render
     * @returns {void}
     * @hidden
     */
    reRenderBlockContent(block: BlockModel): void {
        if (!block) { return; }

        const blockElement: HTMLElement = this.editor.getBlockElementById(block.id);
        if (!blockElement) { return; }

        const contentElement: HTMLElement = getBlockContentElement(blockElement);
        if (!contentElement) { return; }

        contentElement.innerHTML = '';
        this.contentRenderer.renderContent(block, contentElement);
    }

    /**
     * Renders multiple blocks
     *
     * @param {BlockModel} blocks Array of block models to render
     * @returns {void}
     * @hidden
     */
    renderBlocks(blocks: BlockModel[]): void {
        if (blocks.length <= 0) {
            return;
        }

        let lastBlockElement: HTMLElement; // Track the last block for caret positioning

        blocks.forEach((block: BlockModel) => {
            const blockElement: HTMLElement = this.createBlockElement(block);
            this.insertBlockIntoDOM(blockElement);
            this.editor.togglePlaceholder(blockElement, false);
            lastBlockElement = blockElement;

            if (isListTypeBlock(block.type)) {
                this.editor.listBlockAction.updateListItemMarkers(blockElement);
            }
            if (isChildrenTypeBlock(block.type) && (block.props as BaseChildrenProp).children.length > 0) {
                (block.props as BaseChildrenProp).children.forEach((childBlock: BlockModel) => {
                    if (isListTypeBlock(childBlock.type)) {
                        this.editor.listBlockAction.updateListItemMarkers(
                            blockElement.querySelector('#' + childBlock.id)
                        );
                    }
                });
            }
        });

        if (lastBlockElement) {
            if (lastBlockElement.classList.contains(constants.CALLOUT_BLOCK_CLS)) {
                lastBlockElement = lastBlockElement.querySelector('.' + constants.CALLOUT_CONTENT_CLS).lastChild as HTMLElement;
            }

            requestAnimationFrame(() => {
                this.editor.setFocusToBlock(lastBlockElement);
                this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
                setCursorPosition(getBlockContentElement(lastBlockElement), lastBlockElement ? lastBlockElement.textContent.length : 0);

                blocks.forEach((block: BlockModel) => {
                    if (block.type === BlockType.Checklist && this.listRenderer) {
                        this.listRenderer.toggleCheckedState(block, (block.props as ChecklistProps).isChecked);
                    }
                });
            });
        }
    }

    /**
     * Updates the CSS class for a block
     *
     * @param {HTMLElement} blockElement The block element to update
     * @param {string} customClass The CSS class to apply
     * @returns {void}
     * @hidden
     */
    updateBlockCssClass(blockElement: HTMLElement, customClass: string): void {
        if (customClass) {
            addClass([blockElement], customClass.trim().split(' '));
        }
    }

    /**
     * Updates the indentation attribute for a block
     *
     * @param {HTMLElement} blockElement The block element to update
     * @param {number} indentValue The indentation value to set
     * @returns {void}
     * @hidden
     */
    updateBlockIndentAttribute(blockElement: HTMLElement, indentValue: number): void {
        blockElement.style.setProperty(constants.INDENT_KEY, (indentValue * 20).toString());

        if (this.editor.element.contains(blockElement)) {
            this.editor.floatingIconManager.showFloatingIcons(blockElement);
        }
    }

    /**
     * Inserts a block element into the DOM
     *
     * @param {HTMLElement} blockElement The block element to insert
     * @param {HTMLElement} afterElement Optional element to insert after
     * @returns {void}
     * @hidden
     */
    private insertBlockIntoDOM(blockElement: HTMLElement, afterElement?: HTMLElement): void {
        if (afterElement) {
            this.editor.blockWrapper.insertBefore(blockElement, afterElement.nextSibling);
        } else {
            this.editor.blockWrapper.appendChild(blockElement);
        }
    }

    /**
     * Sets the focus and UI for a new block
     *
     * @param {HTMLElement} blockElement The block element to focus
     * @returns {void}
     * @hidden
     */
    setFocusAndUIForNewBlock(blockElement: HTMLElement): void {
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
        this.editor.setFocusToBlock(blockElement);
        setCursorPosition(getBlockContentElement(blockElement), 0);
        this.editor.togglePlaceholder(this.editor.currentFocusedBlock, true);
        this.editor.floatingIconManager.showFloatingIcons(this.editor.currentFocusedBlock);
    }

    /**
     * Clears the editor and renders the default block
     *
     * @returns {void}
     * @hidden
     */
    clearEditorAndRenderDefaultBlock(): void {
        this.editor.blockWrapper.innerHTML = '';

        const blockElement: HTMLElement = this.createBlockElement(this.editor.getEditorBlocks()[0]);
        this.editor.blockWrapper.appendChild(blockElement);

        this.editor.setFocusToBlock(blockElement);
        setCursorPosition(getBlockContentElement(blockElement), 0);
        this.editor.floatingIconManager.showFloatingIcons(blockElement);
    }

    /**
     * Sets the cursor position after adding a bulk block (Clipboard paste)
     *
     * @param {string} insertionType - The type of insertion (blocks or text)
     * @returns {void}
     * @hidden
     */
    setCursorAfterBulkBlockAddition(insertionType: string): void {
        let cursorElement: HTMLElement = this.editor.currentFocusedBlock;
        let cursorpos: number = cursorElement.textContent.length;

        if (insertionType === 'blocks') {
            cursorElement = (cursorElement.nextElementSibling || cursorElement) as HTMLElement;
            cursorpos = 0;
            this.editor.togglePlaceholder(this.editor.currentFocusedBlock, false);
            this.editor.togglePlaceholder(cursorElement, true);
        }

        this.editor.setFocusToBlock(cursorElement);
        setCursorPosition(getBlockContentElement(cursorElement), cursorpos);
    }

    public destroy(): void {
        this.contentRenderer = null;
        this.paragraphRenderer = null;
        this.headingRenderer = null;
        this.listRenderer = null;
        this.codeRenderer = null;
        this.quoteRenderer = null;
        this.calloutRenderer = null;
        this.collapsibleRenderer = null;
        this.commonBlocksRenderer = null;
        this.removeEventListeners();
    }
}
