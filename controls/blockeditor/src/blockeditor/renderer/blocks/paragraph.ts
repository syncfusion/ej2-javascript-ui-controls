import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { handleExistingContentElement } from './block-utils';


export class ParagraphRenderer {
    private editor: BlockEditor;
    private parent: BlockAction;

    constructor(editor: BlockEditor, parent: BlockAction) {
        this.editor = editor;
        this.parent = parent;
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
        const paragraph: HTMLElement = this.editor.createElement('p', {
            attrs: {
                contenteditable: 'true',
                placeholder: this.editor.getPlaceholderValue('Paragraph', block.placeholder)
            }
        });
        if (existingContentElement) {
            handleExistingContentElement(block, blockElement, paragraph, existingContentElement);
        } else {
            this.parent.contentRenderer.renderContent(block, paragraph);
        }

        return paragraph;
    }
}
