import { createElement } from '@syncfusion/ej2-base';
import { BlockModel, IParagraphBlockSettings } from '../../../models/index';
import { BlockManager } from '../../base/block-manager';

export class ParagraphRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders paragraph block
     *
     * @param {BlockModel} block - specifies the block.
     * @returns {HTMLElement} - the created or updated element
     * @hidden
     */
    public renderParagraph(block: BlockModel): HTMLElement {
        const paragraphProps: IParagraphBlockSettings = block.properties as IParagraphBlockSettings;
        paragraphProps.placeholder = this.parent.getPlaceholderValue(block);
        const paragraph: HTMLElement = createElement('p', {
            attrs: {
                contenteditable: 'true',
                placeholder: paragraphProps.placeholder
            }
        });
        this.parent.blockRenderer.contentRenderer.renderContent(block, paragraph);

        return paragraph;
    }
}
