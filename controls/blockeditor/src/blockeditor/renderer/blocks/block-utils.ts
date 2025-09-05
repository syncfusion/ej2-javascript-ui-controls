import * as constants from '../../base/constant';
import { BlockModel } from '../../models/index';
import { generateUniqueId } from '../../utils/common';

/**
 * Handles the case where existing content element persists.
 *
 * @param {BlockModel} block - The block model containing data.
 * @param {HTMLElement} blockElement - The block container element.
 * @param {HTMLElement} contentElement - The content element to be updated.
 * @param {HTMLElement | Node} existingContentElement - The existing element to transform.
 * @returns {void}
 */
export function handleExistingContentElement(
    block: BlockModel,
    blockElement: HTMLElement,
    contentElement: HTMLElement,
    existingContentElement: HTMLElement | Node
): void {
    if (existingContentElement instanceof HTMLElement) {
        contentElement.innerHTML = existingContentElement.innerHTML;
        if (existingContentElement.id) {
            contentElement.id = existingContentElement.id;
        }
    }
    else if (existingContentElement instanceof Node) {
        existingContentElement.childNodes.forEach((node: Node) => {
            contentElement.appendChild(node.cloneNode(true));
        });
        const childLen: number = existingContentElement.childNodes.length;
        if ((childLen === 0) || (childLen === 1 && existingContentElement.childNodes[0].nodeType === Node.TEXT_NODE)) {
            contentElement.id = block.content && block.content.length === 1
                ? block.content[0].id
                : generateUniqueId(constants.CONTENT_ID_PREFIX);
        }
    }
    blockElement.appendChild(contentElement);
}
