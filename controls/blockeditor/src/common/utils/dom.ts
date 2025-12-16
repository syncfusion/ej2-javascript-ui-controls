import { createElement, updateCSSText } from '@syncfusion/ej2-base';
import { BaseStylesProp, ContentModel, ILinkContentSettings, StyleModel } from '../../models/index';
import { LinkData } from '../../common/interface';
import { ContentType } from '../../models/enums';

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
 * Creates formatting element based on the content model.
 *
 * @param {ContentModel} content - Content model.
 * @param {string | LinkData} value - Value to be set for the content.
 * @returns {HTMLElement} - Returns the formatted element.
 *
 */
export function createFormattingElement(
    content: ContentModel,
    value?: string | LinkData): HTMLElement {
    let formattedElement: Node = document.createTextNode(content.content);
    const isLinkType: boolean = content.contentType === ContentType.Link;

    // Apply styles based on recorded style order
    const styles: Partial<Record<keyof StyleModel, string | boolean>> = (content.properties as BaseStylesProp).styles || {};
    const keys: string[] = Object.keys(styles);
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
            case 'custom':
                {
                    const val: string | boolean = styles[styleType as keyof StyleModel];
                    formattedElement = wrapNodeWithSpan(formattedElement, styleType, val);
                }
                break;
            }
        }
    } else if (!isLinkType) {
        // No style applied, wrap in <span>
        const span: HTMLSpanElement = createElement('span');
        span.appendChild(formattedElement);
        formattedElement = span;
    }
    if (isLinkType) {
        const linkData: LinkData = value as LinkData;
        const props: ILinkContentSettings = content.properties as ILinkContentSettings;
        formattedElement = wrapNodeWithTag(
            formattedElement,
            (linkData && linkData.shouldRemoveLink) ? 'span' : 'a'
        );
        if (linkData && !linkData.shouldRemoveLink) {
            (formattedElement as HTMLAnchorElement).href = props.url;
            (formattedElement as HTMLAnchorElement).target = '_blank';
            (formattedElement as HTMLAnchorElement).title = linkData.title
                ? linkData.title
                : props.url;
        }
    }
    (formattedElement as HTMLElement).id = content.id;
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
    case 'custom':
        updateCSSText(span, value as string);
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
