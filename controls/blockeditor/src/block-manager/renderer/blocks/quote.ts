import { createElement } from '@syncfusion/ej2-base';
import { BlockModel, IQuoteBlockSettings } from '../../../models/index';
import { BlockManager } from '../../base/block-manager';

export class QuoteRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders a quote block
     *
     * @param {BlockModel} block - The block model containing data.
     * @returns {HTMLElement} - The created or updated element.
     */
    public renderQuote(block: BlockModel): HTMLElement {
        const quoteProps: IQuoteBlockSettings = block.properties as IQuoteBlockSettings;
        quoteProps.placeholder = this.parent.getPlaceholderValue(block);
        const quoteElement: HTMLElement = createElement('blockquote', {
            attrs: {
                contenteditable: 'true',
                placeholder: quoteProps.placeholder
            }
        });
        this.parent.blockRenderer.contentRenderer.renderContent(block, quoteElement);

        return quoteElement;
    }
}
