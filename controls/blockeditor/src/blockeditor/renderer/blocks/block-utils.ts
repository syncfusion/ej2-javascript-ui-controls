/**
 * Appends new content to the block element or replaces existing content if it exists.
 *
 * @param {HTMLElement} blockElement - The block element to which the new content will be appended or replaced.
 * @param {HTMLElement} newContentElement - The new content element to be appended or used for replacement.
 * @param {HTMLElement | Node} existingContentElement - The existing content element to be replaced, if it exists.
 * @returns {void} This function does not return a value.
 *
 */
export function appendDocumentNodes(
    blockElement: HTMLElement,
    newContentElement: HTMLElement,
    existingContentElement: HTMLElement | Node): void {
    if (existingContentElement instanceof HTMLElement &&
        existingContentElement.closest &&
        existingContentElement.closest('.e-block') === blockElement) {
        if (existingContentElement.tagName === 'LI') {
            blockElement.replaceChild(newContentElement, existingContentElement.parentElement);
        }
        else {
            blockElement.replaceChild(newContentElement, existingContentElement);
        }
    }
    else {
        blockElement.appendChild(newContentElement);
    }
}
