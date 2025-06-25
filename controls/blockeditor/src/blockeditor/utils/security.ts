import { createElement, SanitizeHtmlHelper } from '@syncfusion/ej2-base';

/**
 * Sanitizes HTML content if enabled
 *
 * @param {string} html - The HTML content to sanitize.
 * @param {boolean} enableSanitizer - Whether to enable HTML sanitization.
 * @returns {string} - The sanitized HTML content.
 */
export function sanitizeHelper(html: string, enableSanitizer: boolean): string {
    if (!enableSanitizer) { return html; }

    return SanitizeHtmlHelper.sanitize(html);
}

/**
 * Decodes HTML entities in a string
 *
 * @param {string} value - specifies the string value
 * @returns {string} - returns the string
 */
export function decode(value: string): string {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}

/**
 * Encodes HTML entities in a string
 *
 * @param {string} value - specifies the string value
 * @returns {string} - returns the string
 */
export function encode(value: string): string {
    const divNode: HTMLElement = createElement('div');
    divNode.innerText = value.trim();
    // eslint-disable-next-line
    return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
}

export function escapeHTML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
