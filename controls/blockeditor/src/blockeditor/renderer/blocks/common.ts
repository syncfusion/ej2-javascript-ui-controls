import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { appendDocumentNodes } from './block-utils';


export class CommonBlocksRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders a divider block
     *
     * @param {HTMLElement} blockElement - The block element.
     * @param {HTMLElement} existingContentElement - The existing content element.
     * @returns {HTMLElement} - The created or updated element.
     */
    public renderDivider(blockElement: HTMLElement, existingContentElement?: HTMLElement): HTMLElement {
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
        if (existingContentElement) {
            appendDocumentNodes(blockElement, dividerElementWrapper, existingContentElement);
        }
        return dividerElementWrapper;
    }

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
