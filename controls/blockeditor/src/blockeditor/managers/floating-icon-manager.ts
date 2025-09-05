import { EventHandler } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { BlockEditor, BlockType } from '../base/index';
import { getElementRect } from '../utils/dom';
import { getBlockContentElement, isNonContentEditableBlock } from '../utils/block';
import { events } from '../base/constant';
import * as constants from '../base/constant';

export class FloatingIconManager {
    private editor: BlockEditor
    public addIconTooltip: Tooltip;
    public dragIconTooltip: Tooltip;

    /**
     * Creates a new FloatingIconManager instance
     *
     * @param {BlockEditor} editor The parent BlockEditor instance
     */
    constructor(editor: BlockEditor) {
        this.editor = editor;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.editor.on(events.destroy, this.destroy, this);
    }

    private removeEventListeners(): void {
        this.editor.off(events.destroy, this.destroy);
    }

    /**
     * Creates the floating icons for the editor
     *
     * @returns {void}
     * @hidden
     */
    createFloatingIcons(): void {
        this.editor.floatingIconContainer = this.editor.createElement('div', { className: 'e-floating-icons' });
        const addIcon: HTMLElement = this.editor.createElement('span', { className: 'e-floating-icon e-icons e-block-add-icon' });
        EventHandler.add(addIcon, 'click', this.handleAddIconClick, this);
        this.editor.floatingIconContainer.appendChild(addIcon);

        const dragIcon: HTMLElement = this.editor.createElement('span', { className: 'e-floating-icon e-icons e-block-drag-icon', attrs: { draggable: 'true' } });
        EventHandler.add(dragIcon, 'click', this.handleDragIconClick, this);
        this.editor.floatingIconContainer.appendChild(dragIcon);

        this.editor.floatingIconContainer.style.position = 'absolute';
        this.editor.floatingIconContainer.style.display = 'none';
        this.editor.floatingIconContainer.style.pointerEvents = 'none';

        document.body.appendChild(this.editor.floatingIconContainer);
        this.renderFloatingIconTooltips();
    }

    private renderFloatingIconTooltips(): void {
        this.addIconTooltip = this.editor.tooltipRenderer.renderTooltip({
            element: this.editor.floatingIconContainer,
            target: '.e-block-add-icon',
            position: 'TopCenter',
            showTipPointer: true,
            windowCollision: true,
            cssClass: 'e-be-floating-icon-tooltip',
            content: this.getTooltipContent('add')
        });

        this.dragIconTooltip = this.editor.tooltipRenderer.renderTooltip({
            element: this.editor.floatingIconContainer,
            target: '.e-block-drag-icon',
            position: 'TopCenter',
            showTipPointer: true,
            windowCollision: true,
            cssClass: 'e-be-floating-icon-tooltip',
            content: this.getTooltipContent('drag')
        });
    }

    private getTooltipContent(iconType: 'add' | 'drag'): HTMLElement {
        if (iconType === 'add') {
            const bold: HTMLElement = document.createElement('b');
            bold.textContent = this.editor.l10n.getConstant('addIconTooltip');
            return bold;
        }

        const container: HTMLElement = document.createElement('div');
        container.innerHTML = `
            <b>${this.editor.l10n.getConstant('dragIconTooltipActionMenu')}</b><br>
            <span>${this.editor.l10n.getConstant('dragIconTooltip')}</span>
        `;
        return container;
    }

    /**
     * Updates the tooltip content for the floating icons.
     *
     * @returns {void}
     * @hidden
     */
    updateFloatingIconTooltipContent(): void {
        if (this.addIconTooltip) {
            this.addIconTooltip.content = this.getTooltipContent('add');
            this.addIconTooltip.dataBind();
        }
        if (this.dragIconTooltip) {
            this.dragIconTooltip.content = this.getTooltipContent('drag');
            this.dragIconTooltip.dataBind();
        }
    }

    private isFullyVisibleInEditor(blockElement: HTMLElement): boolean {
        const editorRect: DOMRect = this.editor.element.getBoundingClientRect() as DOMRect;
        const blockRect: DOMRect = blockElement.getBoundingClientRect() as DOMRect;

        return (
            blockRect.top >= editorRect.top &&
            blockRect.bottom <= editorRect.bottom
        );
    }

    /**
     * Shows the floating icons
     *
     * @param {HTMLElement} target - The target element to show the floating icons for.
     * @returns {void}
     * @hidden
     */
    public showFloatingIcons(target: HTMLElement): void {
        if (this.editor.readOnly) { return; }
        let blockElement: HTMLElement = target;
        this.hideDragIconForEmptyBlock(blockElement);
        const calloutContent: HTMLElement = blockElement.closest('.' + constants.CALLOUT_CONTENT_CLS) as HTMLElement;
        if ((calloutContent && blockElement === calloutContent.firstElementChild) || !this.isFullyVisibleInEditor(blockElement)) {
            // Do not show floating icons for the first child of a callout content block
            this.hideFloatingIcons();
            return;
        }
        this.editor.floatingIconContainer.style.display = 'flex';
        const isToggleBlock: boolean = blockElement.classList.contains('e-toggle-block');
        blockElement = isToggleBlock ? blockElement.querySelector('.e-toggle-header') as HTMLElement : blockElement;

        const rect: DOMRect = getElementRect(blockElement) as DOMRect;
        const styles: CSSStyleDeclaration = window.getComputedStyle(blockElement);
        const floatingIconRect: DOMRect = this.editor.floatingIconContainer.getBoundingClientRect() as DOMRect;
        const marginTop: number = parseFloat(styles.marginTop) || 0;
        const marginLeft: number = parseFloat(styles.marginLeft) || 0;
        const paddingTop: number = parseFloat(styles.paddingTop) || 0;
        const paddingLeft: number = parseFloat(styles.paddingLeft) || 0;

        const baseTopOffset: number = rect.top + window.scrollY + marginTop;
        const hasHeading: boolean = ['h1', 'h2', 'h3', 'h4'].some((tag: string) => blockElement.querySelector(tag) !== null);
        const topOffset: number = hasHeading
            ? baseTopOffset + (rect.height / 2 - floatingIconRect.height / 2)
            : baseTopOffset + paddingTop;
        const adjustedLeft: number = (rect.left + window.scrollX - marginLeft) + paddingLeft - (floatingIconRect.width + 5);

        this.editor.floatingIconContainer.style.top = `${topOffset}px`;
        this.editor.floatingIconContainer.style.left = `${adjustedLeft}px`;
        this.editor.floatingIconContainer.style.pointerEvents = 'auto';
    }

    /**
     * Hides the drag icon for empty block
     *
     * @param {HTMLElement} target - The target element to show the floating icons for.
     * @returns {void}
     * @hidden
     */
    public hideDragIconForEmptyBlock(target: HTMLElement): void {
        const dragIcon: HTMLElement = this.editor.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        dragIcon.style.display = 'flex';
        const ignoredTypes: string[] = [BlockType.Code, BlockType.Callout, BlockType.Divider, BlockType.CollapsibleHeading,
            BlockType.CollapsibleParagraph, BlockType.Image];
        const blockType: string = target.getAttribute('data-block-type');
        const isIgnoredtype: boolean = blockType && ignoredTypes.indexOf(blockType) !== -1;
        const contentElement: HTMLElement = getBlockContentElement(target);
        if (!isIgnoredtype && (contentElement && !contentElement.textContent)) {
            dragIcon.style.display = 'none';
        }
    }

    /**
     * Hides the floating icons
     *
     * @returns {void}
     * @hidden
     */
    public hideFloatingIcons(): void {
        this.editor.floatingIconContainer.style.display = 'none';
        this.editor.currentHoveredBlock = null;
    }

    private handleDragIconClick(event: MouseEvent): void {
        if (!this.editor.blockActionsMenu.enable) { return; }

        this.editor.popupRenderer.adjustPopupPositionRelativeToTarget(
            this.editor.currentHoveredBlock,
            this.editor.blockActionMenuModule.popupObj
        );

        const popupElement: HTMLElement = document.querySelector('.' + constants.BLOCKACTION_POPUP_CLS);
        this.editor.blockActionMenuModule.toggleBlockActionPopup(popupElement.classList.contains('e-popup-open'), event);
    }

    private handleAddIconClick(): void {
        let block: HTMLElement = this.editor.currentHoveredBlock;
        if ((this.editor.currentHoveredBlock.innerText.length > 0) || (isNonContentEditableBlock(block.getAttribute('data-block-type')))) {
            block = this.editor.blockCommandManager.addNewBlock({
                targetBlock: this.editor.currentHoveredBlock
            });
        }
        else {
            this.editor.blockRendererManager.setFocusAndUIForNewBlock(block);
        }
        if (this.editor.slashCommandModule) {
            this.editor.isPopupOpenedOnAddIconClick = true;
            this.editor.slashCommandModule.showPopup();
        }
    }

    public destroy(): void {
        EventHandler.remove((this.editor.floatingIconContainer.firstChild as HTMLElement), 'click', this.handleAddIconClick);
        if (this.addIconTooltip) {
            this.editor.tooltipRenderer.destroyTooltip(this.addIconTooltip);
            this.addIconTooltip = null;
        }
        if (this.dragIconTooltip) {
            this.editor.tooltipRenderer.destroyTooltip(this.dragIconTooltip);
            this.dragIconTooltip = null;
        }
        this.removeEventListeners();
    }
}
