import { EventHandler, updateCSSText } from '@syncfusion/ej2-base';
import { BlockType } from '../../models/enums';
import { findClosestParent, getElementRect } from '../../common/utils/dom';
import { getBlockContentElement, isNonContentEditableBlock } from '../../common/utils/block';
import * as constants from '../../common/constant';
import { BlockManager } from '../base/block-manager';
import { events } from '../../common/constant';

export class FloatingIcon {
    private parent: BlockManager;
    public floatingIconContainer: HTMLElement;

    /**
     * Creates a new FloatingIcon instance
     *
     * @param {BlockManager} manager The parent BlockManager instance
     */
    constructor(manager: BlockManager) {
        this.parent = manager;
        this.wireGlobalEvents();
    }

    wireGlobalEvents(): void {
        this.parent.observer.on('floatingIconsCreated', this.handleFloatingIconsCreated, this);
        this.parent.observer.on('addIconClick', this.handleAddIconClick, this);
        this.parent.observer.on('dragIconClick', this.handleDragIconClick, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    unWireGlobalEvents(): void {
        this.parent.observer.off('floatingIconsCreated', this.handleFloatingIconsCreated);
        this.parent.observer.off('addIconClick', this.handleAddIconClick);
        this.parent.observer.off('dragIconClick', this.handleDragIconClick);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    private handleFloatingIconsCreated(): void {
        this.floatingIconContainer = document.getElementById(`${this.parent.rootEditorElement.id}_floatingicons`);
        const addIcon: HTMLElement = this.floatingIconContainer.querySelector('.e-floating-icon.e-block-add-icon');
        const dragIcon: HTMLElement = this.floatingIconContainer.querySelector('.e-floating-icon.e-block-drag-icon');
        EventHandler.add(addIcon, 'click', this.handleAddIconClick, this);
        EventHandler.add(dragIcon, 'click', this.handleDragIconClick, this);
    }

    /**
     * Shows the floating icons
     *
     * @param {HTMLElement} target - The target element to show the floating icons for.
     * @returns {void}
     * @hidden
     */
    public showFloatingIcons(target: HTMLElement): void {
        let blockElement: HTMLElement = target;
        this.hideDragIconForEmptyBlock(blockElement);
        const calloutContent: HTMLElement = blockElement.closest('.' + constants.CALLOUT_CONTENT_CLS) as HTMLElement;
        if (
            (calloutContent && blockElement === calloutContent.firstElementChild) ||
            !this.isFullyVisibleInEditor(blockElement) ||
            this.parent.readOnly
        ) {
            // Do not show floating icons for the first child of a callout content block
            this.hideFloatingIcons();
            return;
        }
        updateCSSText(this.floatingIconContainer, 'display: flex;');
        const isToggleBlock: boolean = blockElement.classList.contains('e-toggle-block');
        const tableBlock: HTMLElement = findClosestParent(target, '.' + constants.TABLE_BLOCK_CLS);
        blockElement = isToggleBlock
            ? blockElement.querySelector('.e-toggle-header') as HTMLElement
            : (tableBlock ? tableBlock : blockElement);

        const editorRect: DOMRect = getElementRect(this.parent.rootEditorElement) as DOMRect;
        const blockElementRect: DOMRect = getElementRect(blockElement) as DOMRect;
        const styles: CSSStyleDeclaration = window.getComputedStyle(blockElement);
        const floatingIconRect: DOMRect = this.floatingIconContainer.getBoundingClientRect() as DOMRect;
        const marginTop: number = parseFloat(styles.marginTop) || 0;
        const marginLeft: number = parseFloat(styles.marginLeft) || 0;
        const paddingTop: number = parseFloat(styles.paddingTop) || 0;
        const paddingLeft: number = parseFloat(styles.paddingLeft) || 0;
        const editorScrollTop: number = this.parent.rootEditorElement.scrollTop || 0;
        const baseTopOffset: number = blockElementRect.top + marginTop - editorRect.top + editorScrollTop;
        const hasHeading: boolean = ['h1', 'h2', 'h3', 'h4'].some((tag: string) => blockElement.querySelector(tag) !== null);
        const topOffset: number = hasHeading
            ? (baseTopOffset + floatingIconRect.height / 2 + paddingTop)
            : baseTopOffset + paddingTop;
        const adjustedLeft: number = (blockElementRect.left - marginLeft) + paddingLeft - (floatingIconRect.width + 5) - editorRect.left;

        const cssText: string = `top: ${topOffset}px; left: ${adjustedLeft}px; pointer-events: auto;`;
        updateCSSText(this.floatingIconContainer, cssText);
    }

    /**
     * Hides the drag icon for empty block
     *
     * @param {HTMLElement} target - The target element to show the floating icons for.
     * @returns {void}
     * @hidden
     */
    public hideDragIconForEmptyBlock(target: HTMLElement): void {
        const dragIcon: HTMLElement = this.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        updateCSSText(dragIcon, 'display: flex;');
        const ignoredTypes: string[] = [BlockType.Code, BlockType.Callout, BlockType.Divider, BlockType.CollapsibleHeading,
            BlockType.CollapsibleParagraph, BlockType.Image, BlockType.Table];
        const blockType: string = target.getAttribute('data-block-type');
        const isIgnoredtype: boolean = blockType && ignoredTypes.indexOf(blockType) !== -1;
        const contentElement: HTMLElement = getBlockContentElement(target);
        if (!isIgnoredtype && (contentElement && !contentElement.textContent)) {
            updateCSSText(dragIcon, 'display: none;');
        }
    }

    /**
     * Hides the floating icons
     *
     * @returns {void}
     * @hidden
     */
    public hideFloatingIcons(): void {
        if (this.floatingIconContainer) {
            updateCSSText(this.floatingIconContainer, 'display: none;');
        }
    }

    private handleDragIconClick(event: MouseEvent): void {
        if (!this.parent.blockActionMenuSettings.enable) { return; }

        this.parent.popupRenderer.adjustPopupPositionRelativeToTarget(
            this.floatingIconContainer,
            this.parent.blockActionMenuModule.popupObj
        );

        const popupElement: HTMLElement = document.querySelector('#' + this.parent.rootEditorElement.id + constants.BLOCKACTION_POPUP_ID);
        this.parent.blockActionMenuModule.toggleBlockActionPopup(popupElement.classList.contains('e-popup-open'), event);
    }

    private handleAddIconClick(): void {
        const block: HTMLElement = this.parent.currentHoveredBlock;
        if ((this.parent.currentHoveredBlock.innerText.length > 0) || (isNonContentEditableBlock(block.getAttribute('data-block-type')))) {
            this.parent.execCommand({
                command: 'AddBlock',
                state: {
                    targetBlock: this.parent.currentHoveredBlock,
                    preventUpdateAction: true,
                    forceIgnoreTargetUpdate: true
                }
            });
        }
        else {
            this.parent.setFocusAndUIForNewBlock(block);
        }
        if (this.parent.slashCommandModule) {
            this.parent.isPopupOpenedOnAddIconClick = true;
            this.parent.slashCommandModule.showPopup();
        }
    }

    private isFullyVisibleInEditor(blockElement: HTMLElement): boolean {
        const editorRect: DOMRect = this.parent.rootEditorElement.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;

        return (
            blockRect.top >= editorRect.top &&
            blockRect.bottom <= editorRect.bottom
        );
    }

    public destroy(): void {
        EventHandler.remove((this.floatingIconContainer.firstChild as HTMLElement), 'click', this.handleAddIconClick);
        EventHandler.remove((this.floatingIconContainer.lastChild as HTMLElement), 'click', this.handleDragIconClick);
        this.unWireGlobalEvents();
        this.floatingIconContainer = null;
    }
}
