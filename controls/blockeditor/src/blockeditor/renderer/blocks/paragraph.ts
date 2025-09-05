import { BlockEditor } from '../../base/index';
import { BasePlaceholderProp, BlockModel, ParagraphProps } from '../../models/index';
import { BlockFactory } from '../../services';
import { handleExistingContentElement } from './block-utils';

export class ParagraphRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders paragraph block
     *
     * @param {BlockModel} block - specifies the block.
     * @param {HTMLElement} blockElement - specifies the block element.
     * @param {HTMLElement} existingContentElement - existing element to transform (optional)
     * @returns {HTMLElement} - the created or updated element
     * @hidden
     */
    public renderParagraph(block: BlockModel, blockElement: HTMLElement, existingContentElement?: HTMLElement | Node): HTMLElement {
        const paragraphProps: ParagraphProps = block.props as ParagraphProps;
        paragraphProps.placeholder = this.editor.getPlaceholderValue(block);
        const paragraph: HTMLElement = this.editor.createElement('p', {
            attrs: {
                contenteditable: 'true',
                placeholder: paragraphProps.placeholder
            }
        });
        if (existingContentElement) {
            handleExistingContentElement(block, blockElement, paragraph, existingContentElement);
        } else {
            this.editor.blockRendererManager.contentRenderer.renderContent(block, paragraph);
        }

        return paragraph;
    }
}
