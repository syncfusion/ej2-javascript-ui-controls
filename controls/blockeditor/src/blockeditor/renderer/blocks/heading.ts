import { BlockEditor } from '../../base/index';
import { BlockModel, HeadingProps } from '../../models/index';
import { handleExistingContentElement } from './block-utils';

export class HeadingRenderer {
    private editor: BlockEditor;

    constructor(editor: BlockEditor) {
        this.editor = editor;
    }

    /**
     * Renders heading block
     *
     * @param {BlockModel} block - specifies the block.
     * @param {HTMLElement} blockElement - specifies the block element.
     * @param {HTMLElement} existingContentElement - existing content element to transform (optional)
     * @returns {HTMLElement} - the created or updated element
     * @hidden
     */
    public renderHeading(block: BlockModel, blockElement: HTMLElement, existingContentElement?: HTMLElement | Node): HTMLElement {
        const headingProps: HeadingProps = block.props as HeadingProps;
        headingProps.placeholder = this.editor.getPlaceholderValue(block);

        const heading: HTMLElement = this.editor.createElement(`h${headingProps.level}`, {
            attrs: {
                contenteditable: 'true',
                placeholder: headingProps.placeholder
            }
        });
        if (existingContentElement) {
            handleExistingContentElement(block, blockElement, heading, existingContentElement);
        } else {
            this.editor.blockRendererManager.contentRenderer.renderContent(block, heading);
        }

        return heading;
    }
}
