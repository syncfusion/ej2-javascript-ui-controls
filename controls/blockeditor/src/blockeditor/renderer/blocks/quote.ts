import { BlockEditor } from '../../base/index';
import { BasePlaceholderProp, BlockModel, QuoteProps } from '../../models/index';
import { handleExistingContentElement } from './block-utils';

export class QuoteRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders a quote block
     *
     * @param {BlockModel} block - The block model containing data.
     * @param {HTMLElement} blockElement - The block container element.
     * @param {HTMLElement} existingContentElement - The existing element to transform (optional).
     * @returns {HTMLElement} - The created or updated element.
     */
    public renderQuote(block: BlockModel, blockElement: HTMLElement, existingContentElement?: HTMLElement | Node): HTMLElement {
        const quoteProps: QuoteProps = block.props as QuoteProps;
        quoteProps.placeholder = this.editor.getPlaceholderValue(block);
        const quoteElement: HTMLElement = this.editor.createElement('blockquote', {
            attrs: {
                contenteditable: 'true',
                placeholder: quoteProps.placeholder
            }
        });
        blockElement.classList.add('e-quote-block');
        if (existingContentElement) {
            handleExistingContentElement(block, blockElement, quoteElement, existingContentElement);
        } else {
            this.editor.blockRendererManager.contentRenderer.renderContent(block, quoteElement);
        }

        return quoteElement;
    }
}
