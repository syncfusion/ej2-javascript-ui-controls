import { createElement, addClass } from '@syncfusion/ej2-base';
import { BlockModel, IQuoteBlockSettings } from '../../../models/index';
import { BlockManager } from '../../base/block-manager';
import * as constants from '../../../common/constant';

export class QuoteRenderer {
    private parent: BlockManager;

    constructor(manager: BlockManager) {
        this.parent = manager;
    }

    /**
     * Renders a quote block with container structure for children
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @returns {HTMLElement} - The rendered quote block element.
     */
    public renderQuote(block: BlockModel, blockElement: HTMLElement): HTMLElement {
        const quoteProps: IQuoteBlockSettings = block.properties as IQuoteBlockSettings;

        // Mark outer block
        addClass([blockElement], constants.QUOTE_BLOCK_CLS);

        // Wrapper (can be contenteditable=false if you want to restrict editing to children only)
        const wrapper: HTMLElement = createElement('div', {
            className: 'e-quote-wrapper',
            attrs: { contenteditable: 'true' }  // or 'false' depending on UX preference
        });

        // The visible quote area
        const content: HTMLElement = createElement('blockquote', {
            className: constants.QUOTE_CONTENT_CLS,
            attrs: { contenteditable: 'true' }
        });

        // Render child blocks (this is the key difference)
        quoteProps.children.forEach((childBlock: BlockModel) => {
            const childEl: HTMLElement = this.parent.blockRenderer.createBlockElement(childBlock);
            content.appendChild(childEl);
        });

        wrapper.appendChild(content);
        return wrapper;
    }
}
