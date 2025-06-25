import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { generateUniqueId } from '../../utils/index';
import { appendDocumentNodes } from './block-utils';


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
            if (existingContentElement instanceof HTMLElement) {
                paragraph.innerHTML = existingContentElement.innerHTML;
                if (existingContentElement.id) {
                    paragraph.id = existingContentElement.id;
                }
            }
            else if (existingContentElement instanceof Node) {
                existingContentElement.childNodes.forEach((node: Node) => {
                    paragraph.appendChild(node.cloneNode(true));
                });
                const childLen: number = existingContentElement.childNodes.length;
                if ((childLen === 0) || (childLen === 1 && existingContentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    paragraph.id = block.content && block.content.length === 1
                        ? block.content[0].id
                        : generateUniqueId('content');
                }
            }
            appendDocumentNodes(blockElement, paragraph, existingContentElement);
        } else {
            this.parent.contentRenderer.renderContent(block, paragraph);
        }

        return paragraph;
    }
}
