import { addClass, createElement, detach } from '@syncfusion/ej2-base';
import { BaseChildrenProp, BlockModel, IChecklistBlockSettings } from '../../../models/index';
import { IFromBlockData, BlockDatas, IToBlockData } from '../../../common/interface';
import { BlockType } from '../../../models/enums';
import { getBlockContentElement, getBlockModelById, isAlwaysOnPlaceHolderBlk, isChildrenTypeBlock, isListTypeBlock } from '../../../common/utils/block';
import { CalloutRenderer, CommonBlocksRenderer, HeadingRenderer, ListRenderer, ParagraphRenderer,
    QuoteRenderer, CodeRenderer, ImageRenderer, CollapsibleRenderer, TableRenderer } from '../../renderer/blocks/index';
import { setCursorPosition } from '../../../common/utils/selection';
import { events } from '../../../common/constant';
import * as constants from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';
import { ContentRenderer } from '../../renderer/content/content-renderer';

/**
 * Manages all block rendering operations in the BlockEditor
 */
export class BlockRenderer {

    private parent: BlockManager;
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

    /** @hidden */
    public tableRenderer: TableRenderer;

    /**
     * Creates a new BlockRendererManager instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
        this.contentRenderer = new ContentRenderer(this.parent);
        this.initializeRenderers();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.parent.observer.on('modelChanged', this.handleBlockUIUpdates, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.parent.observer.off('modelChanged', this.handleBlockUIUpdates);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Initializes all the renderers used by this manager
     *
     * @returns {void}
     */
    private initializeRenderers(): void {
        this.paragraphRenderer = new ParagraphRenderer(this.parent);
        this.headingRenderer = new HeadingRenderer(this.parent);
        this.listRenderer = new ListRenderer(this.parent);
        this.quoteRenderer = new QuoteRenderer(this.parent);
        this.codeRenderer = new CodeRenderer(this.parent);
        this.imageRenderer = new ImageRenderer(this.parent);
        this.calloutRenderer = new CalloutRenderer(this.parent);
        this.collapsibleRenderer = new CollapsibleRenderer(this.parent);
        this.commonBlocksRenderer = new CommonBlocksRenderer(this.parent);
        this.tableRenderer = new TableRenderer(this.parent);
    }

    /**
     * Creates a new block element based on the given block model.
     *
     * @param {BlockModel} block - The block model to create the element for.
     * @returns {HTMLElement} The created block element.
     * @hidden
     */
    public createBlockElement(block: BlockModel): HTMLElement {
        const blockElement: HTMLElement = createElement('div', {
            id: block.id,
            className: `e-block ${isListTypeBlock(block.blockType) ? 'e-list-block' : ''}${block.cssClass ? ' ' + block.cssClass : ''}`,
            attrs: {
                'data-block-type': block.blockType
            }
        });

        this.updateBlockCssClass(blockElement, block.cssClass);
        this.updateBlockIndentAttribute(blockElement, block.indent);

        if (block.blockType === BlockType.Divider) {
            blockElement.setAttribute('contenteditable', 'false');
        }

        if (isChildrenTypeBlock(block.blockType)) {
            this.renderNestedTypeBlockContent(block, blockElement);
        } else {
            this.renderBlockContent(block, blockElement);
        }

        return blockElement;
    }

    /**
     * Creates a new block element based on the given model and replaces it with current element.
     *
     * @param {string} currentBlockId - The current block Id to replace
     * @param {string} newBlockId - The new block Id to create element for.
     * @returns {HTMLElement} The replaced block element.
     * @hidden
     */
    public createAndReplaceBlockElement(currentBlockId: string, newBlockId: string): HTMLElement {
        const newBlockElement: HTMLElement = this.createBlockElement(
            getBlockModelById(newBlockId, this.parent.getEditorBlocks())
        );
        const currentElement: HTMLElement = this.parent.getBlockElementById(currentBlockId);
        currentElement.replaceWith(newBlockElement);

        return this.parent.getBlockElementById(newBlockId);
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
    public insertBlockElementInDOM(blockElement: HTMLElement, targetElement?: HTMLElement, isAfter?: boolean): void {
        if (targetElement) {
            targetElement.insertAdjacentElement(isAfter ? 'afterend' : 'beforebegin', blockElement);
        } else {
            this.parent.blockContainer.appendChild(blockElement);
        }
    }

    /**
     * Renders the content of a block element based on the given block model.
     *
     * @param {BlockModel} block - The block model to render.
     * @param {HTMLElement} blockElement - The block element to render the content into.
     * @returns {void}
     * @hidden
     */
    public renderBlockContent(block: BlockModel, blockElement: HTMLElement): void {
        blockElement.setAttribute('data-block-type', block.blockType);
        let contentElement: HTMLElement;

        switch (block.blockType) {
        case BlockType.Paragraph:
            contentElement = this.paragraphRenderer.renderParagraph(block);
            break;
        case BlockType.Heading:
            contentElement = this.headingRenderer.renderHeading(block);
            break;
        case BlockType.BulletList:
        case BlockType.NumberedList:
        case BlockType.Checklist:
            contentElement = this.listRenderer.renderListItem(block, blockElement);
            break;
        case BlockType.Code:
            contentElement = this.codeRenderer.renderCodeBlock(block);
            break;
        case BlockType.Image:
            contentElement = this.imageRenderer.renderImage(block);
            break;
        case BlockType.Table:
            contentElement = this.tableRenderer.renderTable(block, blockElement);
            break;
        case BlockType.Quote:
            contentElement = this.quoteRenderer.renderQuote(block);
            blockElement.classList.add('e-quote-block');
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
        if (isListTypeBlock(block.blockType)) {
            const listItem: HTMLElement = contentElement.querySelector('li');
            if (listItem) {
                listItem.classList.add('e-block-content');
            }
        } else if (notAllowedTypes.indexOf(block.blockType) === -1) {
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
    public renderNestedTypeBlockContent(block: BlockModel, blockElement: HTMLElement): void {
        let contentElement: HTMLElement;

        if (block.blockType === BlockType.Callout) {
            contentElement = this.calloutRenderer.renderCallout(block, blockElement);
        }
        else if (block.blockType.toString().startsWith('Collapsible')) {
            contentElement = this.collapsibleRenderer.renderCollapsibleBlock(block, blockElement);
        }

        if (contentElement) {
            blockElement.appendChild(contentElement);
        }
    }

    /**
     * Re-renders the content of a block
     *
     * @param {BlockModel} block The block model to re-render
     * @returns {void}
     * @hidden
     */
    public reRenderBlockContent(block: BlockModel): void {
        if (!block) { return; }

        const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
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
    public renderBlocks(blocks: BlockModel[]): void {
        if (blocks.length <= 0) {
            return;
        }

        blocks.forEach((block: BlockModel) => {
            const blockElement: HTMLElement = this.createBlockElement(block);
            this.insertBlockIntoDOM(blockElement);
            if (!isAlwaysOnPlaceHolderBlk(block.blockType)) {
                this.parent.togglePlaceholder(blockElement, false);
            }

            if (isListTypeBlock(block.blockType)) {
                this.parent.listPlugin.updateListItemMarkers(blockElement);
            }
            if (isChildrenTypeBlock(block.blockType) && (block.properties as BaseChildrenProp).children.length > 0) {
                (block.properties as BaseChildrenProp).children.forEach((childBlock: BlockModel) => {
                    if (isListTypeBlock(childBlock.blockType)) {
                        this.parent.listPlugin.updateListItemMarkers(
                            blockElement.querySelector('#' + childBlock.id)
                        );
                    }
                });
            }
        });

        requestAnimationFrame(() => {
            if (this.parent) {
                blocks.forEach((block: BlockModel) => {
                    if (block.blockType === BlockType.Checklist && this.listRenderer) {
                        this.listRenderer.toggleCheckedState(block, (block.properties as IChecklistBlockSettings).isChecked, true);
                    }
                });
            }
        });
    }

    /**
     * Updates the CSS class for a block
     *
     * @param {HTMLElement} blockElement The block element to update
     * @param {string} customClass The CSS class to apply
     * @returns {void}
     * @hidden
     */
    public updateBlockCssClass(blockElement: HTMLElement, customClass: string): void {
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
    public updateBlockIndentAttribute(blockElement: HTMLElement, indentValue: number): void {
        blockElement.style.setProperty(constants.INDENT_KEY, (indentValue * 20).toString());

        if (this.parent.rootEditorElement.contains(blockElement)) {
            this.parent.floatingIconAction.showFloatingIcons(blockElement);
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
            this.parent.blockContainer.insertBefore(blockElement, afterElement.nextSibling);
        } else {
            this.parent.blockContainer.appendChild(blockElement);
        }
    }

    /**
     * Clears the editor and renders the default block
     *
     * @returns {void}
     * @hidden
     */
    public clearEditorAndRenderDefaultBlock(): void {
        this.parent.blockContainer.innerHTML = '';

        const blockElement: HTMLElement = this.createBlockElement(this.parent.getEditorBlocks()[0]);
        this.parent.blockContainer.appendChild(blockElement);

        this.parent.setFocusToBlock(blockElement);
        setCursorPosition(getBlockContentElement(blockElement), 0);
        this.parent.floatingIconAction.showFloatingIcons(blockElement);
    }

    public handleBlockUIUpdates(options: any): void {
        switch (options.type) {
        case 'AddBlock': {
            const { addedBlock, targetBlockModel, preventUIUpdate, isAfter, preventEventTrigger,
                preventUpdateAction, forceIgnoreTargetUpdate } = options.state;
            const isIgnoredTypes: string[] = [BlockType.Callout, BlockType.CollapsibleHeading, BlockType.CollapsibleParagraph,
                BlockType.Divider];
            const isIgnored: boolean = forceIgnoreTargetUpdate ||
                (targetBlockModel && isIgnoredTypes.indexOf(targetBlockModel.blockType) !== -1);

            if (!isIgnored && targetBlockModel) {
                this.reRenderBlockContent(targetBlockModel);
                if (!preventUpdateAction) {
                    this.parent.eventService.addChange({
                        action: 'Update',
                        data: { block: targetBlockModel }
                    });
                }
            }

            const blockElement: HTMLElement = this.createBlockElement(addedBlock);
            const targetElement: HTMLElement = targetBlockModel ? this.parent.getBlockElementById(targetBlockModel.id) : null;
            this.insertBlockElementInDOM(blockElement, targetElement, isAfter);

            if (!preventUIUpdate) {
                this.parent.setFocusAndUIForNewBlock(blockElement);
            }
            else {
                this.parent.togglePlaceholder(blockElement, false);
            }
            if (isListTypeBlock(addedBlock.blockType)) {
                this.parent.listPlugin.recalculateMarkersForListItems();
            }
            this.parent.adjustViewForFocusedBlock();

            this.parent.eventService.addChange({
                action: 'Insertion',
                data: {
                    block: addedBlock,
                    targetId: targetBlockModel ? targetBlockModel.id : ''
                } as BlockDatas
            });
            if (!preventEventTrigger) {
                this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            }
            break;
        }
        case 'DeleteBlock': {
            detach(options.state.blockElement);
            this.parent.eventService.addChange({
                action: 'Deletion',
                data: { block: options.state.removedBlock }
            });
            if (!options.state.preventEventTrigger) {
                this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            }
            break;
        }
        case 'MoveBlock': {
            const { destination, fromElements, isMovingUp, toBlockDOM, movedBlocks } = options.state as any;
            const allBlocks: HTMLElement[] = Array.from(this.parent.blockContainer.children) as HTMLElement[];
            const parentElement: HTMLElement = this.getParentElementToInsert(destination, allBlocks);
            const targetToInsert: HTMLElement = (isMovingUp ? toBlockDOM : toBlockDOM.nextSibling) as HTMLElement;
            fromElements.forEach((el: HTMLElement) => {
                parentElement.insertBefore(el, targetToInsert);
            });

            const reversedFromModels: IFromBlockData[] = [...movedBlocks].reverse();
            movedBlocks.forEach((data: IFromBlockData) => {
                const prevParent: IFromBlockData = reversedFromModels.find(
                    (fromModel: IFromBlockData) => fromModel.parent !== null
                );
                this.parent.eventService.addChange({
                    action: 'Moved',
                    data: {
                        block: data.model,
                        targetId: toBlockDOM.id,
                        isMovingUp: isMovingUp,
                        prevParent: prevParent ? prevParent.model : undefined,
                        currentParent: options.state.destination.toParentBlockModel
                            ? options.state.destination.toParentBlockModel
                            : undefined
                    } as BlockDatas
                });
            });
            this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            break;
        }
        case 'TransformBlock': {
            const { block, shouldPreventUpdates, oldBlockClone, preventEventTrigger } = options.state;
            const blockElement: HTMLElement = this.parent.getBlockElementById(block.id);
            const newBlockElement: HTMLElement = this.createBlockElement(block);
            blockElement.replaceWith(newBlockElement);

            if (!shouldPreventUpdates) {
                this.parent.eventService.addChange({
                    action: 'Update',
                    data: {
                        block: block,
                        prevBlock: oldBlockClone
                    }
                });
                if (!preventEventTrigger) {
                    this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
                }
            }
            break;
        }
        case 'IndentBlock':
            this.updateBlockIndentAttribute(
                this.parent.getBlockElementById(options.state.blockId), options.state.newIndent
            );
            break;
        case 'ReplaceBlock': {
            const { block, oldBlock, targetBlockId, preventEventTrigger } = options.state;
            const blockElement: HTMLElement = this.parent.getBlockElementById(targetBlockId);
            const newBlockElement: HTMLElement = this.createBlockElement(block);
            blockElement.replaceWith(newBlockElement);

            this.parent.eventService.addChange({
                action: 'Update',
                data: {
                    block: block,
                    prevBlock: oldBlock
                }
            });
            if (!preventEventTrigger) {
                this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            }
            break;
        }
        case 'DefaultEmptyBlock':
            this.clearEditorAndRenderDefaultBlock();
            this.parent.eventService.addChange({
                action: 'Insertion',
                data: { block: this.parent.getEditorBlocks()[0] }
            });
            this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            break;
        case 'ReRenderBlockContent': {
            const data: any = options.state.data;
            data.forEach((data: { block: BlockModel, oldBlock: BlockModel }) => {
                this.reRenderBlockContent(data.block);
                if (!options.state.preventChangesTracking) {
                    this.parent.eventService.addChange({
                        action: 'Update',
                        data: {
                            block: data.block,
                            prevBlock: data.oldBlock
                        }
                    });
                }
            });
            if (!options.state.preventEventTrigger) {
                this.parent.observer.notify('triggerBlockChange', this.parent.eventService.getChanges());
            }
            break;
        }
        }
    }

    private getParentElementToInsert(destination: IToBlockData, allBlocks: HTMLElement[]): HTMLElement {
        const wrapperClassName: string = destination.toParentBlockModel
            ? (destination.toParentBlockModel.blockType === BlockType.Callout ? '.' + constants.CALLOUT_CONTENT_CLS :
                destination.toParentBlockModel.blockType.toString().startsWith('Collapsible') ? '.' + constants.TOGGLE_CONTENT_CLS : '')
            : '';
        return wrapperClassName
            ? allBlocks[destination.toParentBlockIndex as number].querySelector(wrapperClassName)
            : this.parent.blockContainer;
    }



    public destroy(): void {
        this.removeEventListeners();
        this.contentRenderer = null;
        this.paragraphRenderer = null;
        this.headingRenderer = null;
        this.listRenderer = null;
        this.codeRenderer = null;
        this.quoteRenderer = null;
        this.calloutRenderer = null;
        this.collapsibleRenderer = null;
        this.commonBlocksRenderer = null;
        this.tableRenderer = null;
    }
}
