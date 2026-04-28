import { detach, updateCSSText } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { BlockEditor } from '../base/blockeditor';
import { events } from '../../common/constant';

export class FloatingIconRenderer {
    private editor: BlockEditor;
    public addIconTooltip: Tooltip;
    public dragIconTooltip: Tooltip;
    public floatingIconContainer: HTMLElement;

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
    public createFloatingIcons(): void {
        this.floatingIconContainer = this.editor.createElement('div', { className: 'e-floating-icons', id: `${this.editor.element.id}_floatingicons` });
        const addIcon: HTMLElement = this.editor.createElement('span', { className: 'e-floating-icon e-icons e-block-add-icon' });
        const dragIcon: HTMLElement = this.editor.createElement('span', { className: 'e-floating-icon e-icons e-block-drag-icon', attrs: { draggable: 'true' } });
        this.floatingIconContainer.appendChild(addIcon);
        this.floatingIconContainer.appendChild(dragIcon);

        const cssText: string = 'position: absolute; display: none; pointer-events: none;';
        updateCSSText(this.floatingIconContainer, cssText);

        this.editor.element.appendChild(this.floatingIconContainer);
        this.renderFloatingIconTooltips();

        this.editor.blockManager.observer.notify('floatingIconsCreated');
    }

    private renderFloatingIconTooltips(): void {
        this.addIconTooltip = this.editor.tooltipRenderer.renderTooltip({
            element: this.floatingIconContainer,
            target: '.e-block-add-icon',
            position: 'TopCenter',
            showTipPointer: true,
            windowCollision: true,
            cssClass: 'e-be-floating-icon-tooltip',
            content: this.getTooltipContent('add')
        });

        this.dragIconTooltip = this.editor.tooltipRenderer.renderTooltip({
            element: this.floatingIconContainer,
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
            const spenEle: HTMLElement = document.createElement('span');
            spenEle.textContent = this.editor.l10n.getConstant('addIconTooltip');
            return spenEle;
        }

        const container: HTMLElement = document.createElement('div');
        container.innerHTML = `
            <span>${this.editor.l10n.getConstant('dragIconTooltipActionMenu')}</span><br>
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
    public updateFloatingIconTooltipContent(): void {
        this.addIconTooltip.content = this.getTooltipContent('add');
        this.addIconTooltip.dataBind();
        this.dragIconTooltip.content = this.getTooltipContent('drag');
        this.dragIconTooltip.dataBind();
    }

    public destroy(): void {
        this.removeEventListeners();
        this.editor.tooltipRenderer.destroyTooltip(this.addIconTooltip);
        this.addIconTooltip = null;
        this.editor.tooltipRenderer.destroyTooltip(this.dragIconTooltip);
        this.dragIconTooltip = null;
        detach(this.floatingIconContainer);
        this.floatingIconContainer = null;
    }
}
