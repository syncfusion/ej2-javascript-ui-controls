import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { handleExistingContentElement } from './block-utils';


export class HeadingRenderer {
    private editor: BlockEditor;
    private parent: BlockAction;

    constructor(editor: BlockEditor, parent: BlockAction) {
        this.editor = editor;
        this.parent = parent;
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
        const level: string = block.type.charAt(block.type.length - 1);

        const heading: HTMLElement = this.editor.createElement(`h${level}`, {
            attrs: {
                contenteditable: 'true',
                placeholder: this.editor.getPlaceholderValue(block.type, block.placeholder)
            }
        });
        if (existingContentElement) {
            handleExistingContentElement(block, blockElement, heading, existingContentElement);
        } else {
            this.parent.contentRenderer.renderContent(block, heading);
        }

        return heading;
    }
}
