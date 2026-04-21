import { createElement, updateCSSText } from '@syncfusion/ej2-base';
import { BaseStylesProp, ContentModel, ILinkContentSettings, StyleModel } from '../../models/index';
import { LinkData } from '../../common/interface';
import { ContentType } from '../../models/enums';
import { normalizeRange } from './common';
import { getBlockContentElement } from './block';
import * as constants from '../../common/constant';

/**
 * Finds the closest parent element that matches the specified selector.
 *
 * @param {Node | HTMLElement} element - The starting element
 * @param {string} selector - The CSS selector to match
 * @returns {HTMLElement | null} The closest matching parent element or null if not found
 */
export function findClosestParent(element: Node | HTMLElement, selector: string): HTMLElement | null {
    if (element.nodeType === Node.TEXT_NODE) {
        return ((element.parentElement as HTMLElement).closest(selector) as HTMLElement) || null;
    }
    return ((element as HTMLElement).closest(selector) as HTMLElement);
}

/**
 * Gets the computed absolute position of an element relative to the document.
 *
 * @param {HTMLElement} element - The element to get the position for
 * @returns {DOMRect} The element's position and dimensions
 */
export function getElementRect(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect() as DOMRect;
}

/**
 * Checks if a node is contained within a container element.
 *
 * @param {Node} node - The node to check
 * @param {HTMLElement} container - The container element
 * @returns {boolean} True if the node is inside the container, false otherwise
 */
export function isNodeInsideElement(node: Node, container: HTMLElement): boolean {
    while (node) {
        if (node === container) { return true; }
        node = node.parentNode;
    }
    return false;
}

/**
 * Renders the given string in a temp element and returns the Dom text node.
 *
 * @param {string} content - The content to render
 * @returns {Node} - Rendered dom text node
 */
export function getDomTextNode(content: string): Node {
    const temp: HTMLElement = document.createElement('div');
    temp.innerHTML = content;
    return temp.childNodes[0];
}

/**
 * Get all text nodes within a range
 *
 * @param {Range} range - Range to get nodes from
 * @returns {Node[]} - Collection of nodes
 */
export function getNodesInRange(range: Range): Node[] {
    const textNodes: Node[] = [];
    const normalizedRange: Range = normalizeRange(range);
    const blockEle: HTMLElement = findClosestParent(normalizedRange.startContainer, `.${constants.BLOCK_CLS}`);
    const contentEle: HTMLElement = getBlockContentElement(blockEle);

    const walker: TreeWalker = document.createTreeWalker(contentEle, NodeFilter.SHOW_TEXT, {
        acceptNode: (node: Node) => {
            if (normalizedRange.intersectsNode(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        }
    });

    let node: Node = walker.nextNode();
    while (node) {
        textNodes.push(node);
        node = walker.nextNode();
    }

    return textNodes;
}

/**
 * Creates formatting element based on the content model.
 *
 * @param {ContentModel} content - Content model.
 * @param {string | LinkData} value - Value to be set for the content.
 * @returns {Node} - Returns the formatted node.
 *
 */
export function createFormattingElement(content: ContentModel, value?: string | LinkData): Node {
    const isInlineCode: boolean = (content.properties as BaseStylesProp).styles.inlineCode as boolean;
    const textNode: Node = document.createTextNode(content.content);
    const isLinkType: boolean = content.contentType === ContentType.Link;
    const styles: Partial<Record<keyof StyleModel, string | boolean>> = (content.properties as BaseStylesProp).styles;
    const keys: string[] = Object.keys(styles);

    // For code: preserve raw entities (&lt;, &gt;, &nbsp;, etc.)
    // For normal text: decode entities (allow &nbsp; → space)
    let formattedElement: Node = isInlineCode ? (textNode) : (getDomTextNode(content.content) || textNode);

    // If no formatting at all (and not a link), return raw text node
    if (keys.length === 0 && !isLinkType) {
        return textNode;
    }

    if (keys.length > 0) {
        for (const styleType of keys) {
            switch (styleType.toLowerCase()) {
            case 'bold':
                formattedElement = wrapNodeWithTag(formattedElement, 'strong');
                break;
            case 'italic':
                formattedElement = wrapNodeWithTag(formattedElement, 'em');
                break;
            case 'underline':
                formattedElement = wrapNodeWithTag(formattedElement, 'u');
                break;
            case 'strikethrough':
                formattedElement = wrapNodeWithTag(formattedElement, 's');
                break;
            case 'subscript':
                formattedElement = wrapNodeWithTag(formattedElement, 'sub');
                break;
            case 'superscript':
                formattedElement = wrapNodeWithTag(formattedElement, 'sup');
                break;
            case 'inlinecode':
                formattedElement = wrapNodeWithTag(formattedElement, 'code');
                (formattedElement as HTMLElement).className = 'e-be-inline-code';
                break;
            case 'color':
            case 'backgroundcolor':
            case 'uppercase':
            case 'lowercase':
                {
                    const val: string | boolean = styles[styleType as keyof StyleModel];
                    formattedElement = wrapNodeWithSpan(formattedElement, styleType, val);
                }
                break;
            }
        }
    }

    if (isLinkType) {
        const linkData: LinkData = value as LinkData;
        const props: ILinkContentSettings = content.properties as ILinkContentSettings;
        formattedElement = wrapNodeWithTag(formattedElement, 'a');

        if (linkData && !linkData.shouldRemoveLink) {
            (formattedElement as HTMLAnchorElement).href = props.url;
            (formattedElement as HTMLAnchorElement).target = '_blank';
            (formattedElement as HTMLAnchorElement).title = props.url;
        }
    }

    return formattedElement as HTMLElement;
}

/**
 * Wraps a node with a specified HTML tag.
 *
 * @param {Node} node - The node to wrap
 * @param {string} tagName - The HTML tag to wrap with
 * @returns {HTMLElement} The created wrapper element
 */
export function wrapNodeWithTag(node: Node, tagName: string): HTMLElement {
    const el: HTMLElement = createElement(tagName);
    el.appendChild(node);
    return el;
}

/**
 * Wraps a node with a span and applies the specified style.
 *
 * @param {Node} node - The node to wrap
 * @param {string} styleType - The type of style to apply
 * @param {string | boolean} value - The style value
 * @returns {HTMLElement} The created span element
 */
export function wrapNodeWithSpan(node: Node, styleType: string, value: string | boolean): HTMLElement {
    const span: HTMLElement = createElement('span');

    switch (styleType.toLowerCase()) {
    case 'color':
        updateCSSText(span, `color: ${value};`);
        break;
    case 'backgroundcolor':
        updateCSSText(span, `background-color: ${value};`);
        break;
    case 'uppercase':
        updateCSSText(span, `text-transform: ${value ? 'uppercase' : 'none'};`);
        break;
    case 'lowercase':
        updateCSSText(span, `text-transform: ${value ? 'lowercase' : 'none'};`);
        break;
    }

    span.appendChild(node);
    return span;
}

/**
 * Removes all break tags from an HTML element.
 *
 * @param {HTMLElement} element - The element to clean
 * @returns {void}
 */
export function clearBreakTags(element: HTMLElement): void {
    element.innerHTML = element.innerHTML.replace(/<br>/g, '').trim();
}

/**
 * Checks if an element is empty (contains only whitespace or a single <br> tag).
 *
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is empty, false otherwise
 */
export function isElementEmpty(element: HTMLElement): boolean {
    return element.innerText.trim() === '' || element.innerHTML === '<br>';
}

/**
 * Removes all content after the split point from the current block.
 * Handles nested structures by walking up the tree and removing siblings after each level.
 *
 * @param {Node} splitPoint - The node where split occurred (startContainer after split)
 * @param {HTMLElement} contentElement - The top-level .e-block-content element (stop boundary)
 * @returns {void}
 */
export function removeNodesAfterSplit(splitPoint: Node, contentElement: HTMLElement): void {
    let currentNode: Node = splitPoint;

    while (currentNode && currentNode !== contentElement) {
        const parent: Node = currentNode.parentNode;

        // Remove currentNode and all its next siblings in this level
        let sibling: Node = currentNode.nextSibling;
        while (sibling) {
            const nextSibling: Node = sibling.nextSibling;
            parent.removeChild(sibling);
            sibling = nextSibling;
        }

        // Move up one level — now remove everything after this parent
        currentNode = parent;
    }

    contentElement.normalize();
}

export function getDeepestNodeAndOffset(container: Node, offset: number): { node: Text; offset: number } {
    if (container.nodeType === Node.TEXT_NODE) {
        const textNode: Text = container as Text;
        const len: number = textNode.length;
        if (offset === len) {
            // At end → try to move to next text node
            const next: Node = textNode.nextSibling;
            if (next) {
                return { node: next as Text, offset: 0 };
            }
            // No next → stay at end
            return { node: textNode, offset: len };
        }
        return { node: textNode, offset: Math.min(offset, len) };
    }

    const walker: TreeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let currentOffset: number = 0;
    let textNode: Text = walker.nextNode() as Text;

    while (textNode) {
        const len: number = textNode.length;
        if (currentOffset + len > offset) {
            return { node: textNode, offset: offset - currentOffset };
        }
        currentOffset += len;
        textNode = walker.nextNode() as Text;
    }

    return null;
}
