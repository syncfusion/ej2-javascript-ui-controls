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
    const entityMap: Record<string, string> = {
        '&lt;': '<',
        '&gt;': '>',
        '&nbsp;': ' ',
        '&quot;': '"',
        '&#039;': '\'',
        '&apos;': '\'',
        '&amp;': '&'
    };

    return value.replace(/&(?:amp|lt|gt|nbsp|quot|#039|apos);/g, (match: string) => entityMap[match as string]);
}

/**
 * Encodes HTML entities in a string
 *
 * @param {string} value - specifies the string value
 * @returns {string} - returns the string
 */
export function encode(value: string): string {
    return value.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
}

export function escapeHTML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
