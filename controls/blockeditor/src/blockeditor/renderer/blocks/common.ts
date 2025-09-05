import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';

export class CommonBlocksRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders a divider block
     *
     * @param {HTMLElement} blockElement - The block element.
     * @returns {HTMLElement} - The created or updated element.
     */
    public renderDivider(blockElement: HTMLElement): HTMLElement {
        const dividerElementWrapper: HTMLElement = this.editor.createElement('div', {
            className: 'e-be-hr-wrapper',
            attrs: {
                contenteditable: 'false'
            }
        });
        const dividerElement: HTMLElement = this.editor.createElement('hr', {
            className: 'e-be-hr',
            attrs: {
                contenteditable: 'false'
            }
        });
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
        blockElement.style.outline = 'none';
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
        const itemEle: HTMLElement = this.editor.createElement('div', {
            className: 'e-block-template e-block-content',
            id: block.id,
            attrs: { 'tabindex': '-1' }
        });
        blockElement.appendChild(itemEle);
        this.editor.renderTemplate(block, itemEle);
        return itemEle;
    }
}
