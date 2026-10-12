import { createElement, updateCSSText } from '@syncfusion/ej2-base';
import { BlockModel } from '../../../models/index';
import { BlockManager } from '../../base/block-manager';

export class CommonBlocksRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders a divider block
     *
     * @param {HTMLElement} blockElement - The block element.
     * @returns {HTMLElement} - The created or updated element.
     */
    public renderDivider(blockElement: HTMLElement): HTMLElement {
        const dividerElementWrapper: HTMLElement = createElement('div', { className: 'e-be-hr-wrapper' });
        const dividerElement: HTMLElement = createElement('hr', { className: 'e-be-hr' });
        dividerElementWrapper.appendChild(dividerElement);

        blockElement.addEventListener('click', (): void => {
            blockElement.classList.add('e-divider-selected');
        });
        blockElement.addEventListener('blur', (): void => {
            blockElement.classList.remove('e-divider-selected');
        });
        dividerElementWrapper.appendChild(dividerElement);
        blockElement.classList.add('e-divider-block');
        blockElement.setAttribute('tabindex', '0');
        blockElement.setAttribute('contenteditable', 'false');
        updateCSSText(blockElement, 'outline: none;');
        return dividerElementWrapper;
    }

    /**
     * Renders a template block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @returns {HTMLElement} - The rendered template block element.
     * @hidden
     */
    public renderTemplateBlock(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        const templateElement: HTMLElement = createElement('div', {
            className: 'e-block-template e-block-content',
            id: block.id,
            attrs: { 'tabindex': '-1' }
        });
        blockElement.appendChild(templateElement);
        this.parent.observer.notify('renderTemplateBlock', { block, templateElement });
        return templateElement;
    }
}
