import { BlockManager } from '../../../block-manager/base/block-manager';
import { BlockType } from '../../../models/enums';
import * as constants from '../../../common/constant';
import { getBlockModelById } from '../../../common/utils/index';
import { BlockModel } from '../../../models/index';
import { createElement } from '@syncfusion/ej2-base';

/**
 * Selection overlay to visually indicate a selection over a target content element.
 * It draws an absolutely positioned box inside the editor root, without affecting layout.
 */
export class SelectionOverlay {
    private parent: BlockManager;
    private overlayEl: HTMLElement | null = null;
    public selectionOverlayInfo: { element: HTMLElement; direction: 'previous' | 'next' } | null = null;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    public show(targetId: string): void {
        const el: HTMLElement = this.ensureOverlay();
        this.positionTo(targetId);
        el.style.display = 'block';
    }

    public hide(): void {
        if (this.overlayEl) {
            this.overlayEl.style.display = 'none';
        }
    }

    public reposition(): void {
        if (!this.overlayEl || this.overlayEl.style.display === 'none') { return; }
        const targetId: string | null = this.overlayEl.getAttribute('data-target-id');
        this.positionTo(targetId);
    }

    public destroy(): void {
        if (this.overlayEl && this.overlayEl.parentElement) {
            this.overlayEl.parentElement.removeChild(this.overlayEl);
        }
        this.overlayEl = null;
    }

    public clearSelectionOverlay(): void {
        const dragIcon: HTMLElement = this.parent.floatingIconAction.floatingIconContainer.querySelector('.e-block-drag-icon') as HTMLElement;
        if (dragIcon) { dragIcon.classList.remove('e-drag-icon-selected'); }
        this.selectionOverlayInfo = null;
        if (this.parent.selectionOverlay) { this.parent.selectionOverlay.hide(); }
    }

    private ensureOverlay(): HTMLElement {
        if (this.overlayEl && this.overlayEl.parentElement) { return this.overlayEl; }
        const overlay: HTMLElement = createElement('div', {
            className: 'e-be-selection-overlay'
        });
        overlay.id = this.parent.rootEditorElement.id + '_softSelOverlay';
        overlay.style.display = 'none';

        this.parent.rootEditorElement.appendChild(overlay);
        this.overlayEl = overlay;
        return overlay;
    }

    private positionTo(targetId: string): void {
        const isMultipleBlockSeleceted: boolean =
            this.parent.editorMethods.getSelectedBlocks() && this.parent.editorMethods.getSelectedBlocks().length > 1;
        if (this.overlayEl && !isMultipleBlockSeleceted) {
            const targetBlock: HTMLElement = this.parent.getBlockElementById(targetId);
            if (targetBlock) {
                const rootRect: DOMRect = this.parent.rootEditorElement.getBoundingClientRect() as DOMRect;
                const targetRect: DOMRect = targetBlock.getBoundingClientRect() as DOMRect;
                const isRtl: boolean = this.parent.rootEditorElement.classList.contains('e-rtl');
                const styles: CSSStyleDeclaration = getComputedStyle(targetBlock);
                const paddingLeft: string = styles.getPropertyValue('padding-left');
                const marginLeft: string = styles.getPropertyValue('margin-left');
                const paddingRight: string = styles.getPropertyValue('padding-right');
                const marginRight: string = styles.getPropertyValue('margin-right');
                const left: number =
                    (targetRect.left - rootRect.left + parseInt(paddingLeft, 10) - parseInt(marginLeft, 10) +
                    (!isRtl ? -3 : parseInt(paddingRight, 10) - 6.5 + parseInt(marginRight, 10))) +
                    this.parent.rootEditorElement.scrollLeft;
                const top: number = (targetRect.top - rootRect.top) + this.parent.rootEditorElement.scrollTop;
                this.overlayEl.style.left = left + 'px';
                this.overlayEl.style.top = top + 'px';
                this.overlayEl.style.width = targetRect.width - 50 - (parseInt(targetBlock.style.getPropertyValue('--block-indent'), 10)) + 'px';
                this.overlayEl.style.height = targetRect.height + 'px';
                this.overlayEl.setAttribute('data-target-id', targetId);
            }
        }
    }
}
