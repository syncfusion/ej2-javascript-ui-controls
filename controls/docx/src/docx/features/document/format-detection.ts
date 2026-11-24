/**
 * Format detection utilities for automatic HTML/DOCX format identification.
 *
 * @private
 */

/**
 * Detected format type.
 *
 * @private
 */
export type FormatType = 'html' | 'docx' | 'unknown';

/**
 * Detects whether the input contains HTML or DOCX (OOXML/ZIP) content.
 *
 * Detection strategy:
 * 1. Check for DOCX ZIP magic bytes (PK)
 * 2. Decode as UTF-8 and check for HTML start tags
 * 3. Return UNKNOWN if neither format detected
 *
 * @param {Uint8Array} bytes - The binary content to analyze
 * @returns {FormatType} The detected format: 'HTML', 'DOCX', or 'UNKNOWN'
 *
 * @private
 */
export function detectFormat(bytes: Uint8Array): FormatType {
    if (bytes.length === 0) {
        return 'unknown';
    }

    // Check for DOCX ZIP signature (PK)
    if (bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4B) {
        return 'docx';
    }

    // Try to decode as UTF-8 and detect HTML
    try {
        const text: string = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        const trimmed: string = text.replace(/^\s+/, '').toLowerCase();

        // Common HTML document starts
        const htmlStarts: string[] = [
            '<!doctype',
            '<html',
            '<head',
            '<body',
            '<p',
            '<div',
            '<span',
            '<table',
            '<tr',
            '<td',
            '<th',
            '<ul',
            '<ol',
            '<li',
            '<img',
            '<a',
            '<h1',
            '<h2',
            '<h3',
            '<h4',
            '<h5',
            '<h6',
            '<section',
            '<article',
            '<header',
            '<footer',
            '<nav',
            '<form',
            '<button',
            '<label',
            '<input',
            '<textarea',
            '<select',
            '<br',
            '<hr',
            '<blockquote'
        ];

        if (htmlStarts.some((tag: string) => trimmed.startsWith(tag))) {
            return 'html';
        }

        // Generic XML-like tag detection: <tag...
        // This catches HTML fragments and other XML-like content
        if (/^<\s*[a-zA-Z][a-zA-Z0-9:-]*[\s>/]/.test(trimmed)) {
            return 'html';
        }
    } catch {
        // Binary content that can't be decoded as UTF-8
        // Likely DOCX or other binary format
    }

    return 'unknown';
}
