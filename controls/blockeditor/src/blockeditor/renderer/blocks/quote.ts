import { BlockAction } from '../../actions/index';
import { BlockEditor } from '../../base/index';
import { BlockModel } from '../../models/index';
import { generateUniqueId } from '../../utils/common';
import { appendDocumentNodes } from './block-utils';


export class QuoteRenderer {
    private editor: BlockEditor;
    private parent: BlockAction;

    constructor(editor: BlockEditor, parent: BlockAction) {
        this.editor = editor;
        this.parent = parent;
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
        const quoteElement: HTMLElement = this.editor.createElement('blockquote', {
            attrs: {
                contenteditable: 'true',
                placeholder: this.editor.getPlaceholderValue(block.type, block.placeholder)
            }
        });
        blockElement.classList.add('e-quote-block');
        if (existingContentElement) {
            if (existingContentElement instanceof HTMLElement) {
                quoteElement.innerHTML = existingContentElement.innerHTML;
                if (existingContentElement.id) {
                    quoteElement.id = existingContentElement.id;
                }
            }
            else if (existingContentElement instanceof Node) {
                existingContentElement.childNodes.forEach((node: Node) => {
                    quoteElement.appendChild(node.cloneNode(true));
                });
                const childLen: number = existingContentElement.childNodes.length;
                if ((childLen === 0) || (childLen === 1 && existingContentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
                    quoteElement.id = block.content && block.content.length === 1
                        ? block.content[0].id
                        : generateUniqueId('content');
                }
            }
            appendDocumentNodes(blockElement, quoteElement, existingContentElement);
        } else {
            this.parent.contentRenderer.renderContent(block, quoteElement);
        }

        return quoteElement;
    }
}
