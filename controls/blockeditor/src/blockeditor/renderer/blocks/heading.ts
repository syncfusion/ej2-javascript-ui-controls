import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { generateUniqueId } from '../../utils/common';
import { appendDocumentNodes } from './block-utils';


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
            if (existingContentElement instanceof HTMLElement) {
                heading.innerHTML = existingContentElement.innerHTML;
                if (existingContentElement.id) {
                    heading.id = existingContentElement.id;
                }
            }
            else if (existingContentElement instanceof Node) {
                existingContentElement.childNodes.forEach((node: Node) => {
                    heading.appendChild(node.cloneNode(true));
                });
                const childLen: number = existingContentElement.childNodes.length;
                if ((childLen === 0) || (childLen === 1 && existingContentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    heading.id = block.content && block.content.length === 1
                        ? block.content[0].id
                        : generateUniqueId('content');
                }
            }
            appendDocumentNodes(blockElement, heading, existingContentElement);
        } else {
            this.parent.contentRenderer.renderContent(block, heading);
        }

        return heading;
    }
}
