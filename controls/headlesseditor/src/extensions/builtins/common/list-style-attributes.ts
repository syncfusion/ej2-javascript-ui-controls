/**
 * Shared building blocks for list marker styles.
 *
 * Every list container extension (bulletList, orderedList) repeats the same
 * wiring:
 *
 *   1. A `listStyleType: string` node attribute with an explicit default
 *      (`'disc'` for bullets, `'decimal'` for ordered).
 *   2. A toDOM branch that merges a `list-style-type: <value>` declaration
 *      onto the container's HTML attribute bag.
 *   3. A parseDOM branch that recognizes both the CSS inline style and the
 *      legacy HTML `<ol type>` attribute, normalizing everything to
 *      CSS `list-style-type` values.
 *
 * This module is the single source of truth for all three. List extensions
 * import the attribute factories here and the style merge/parse helpers —
 * never hand-roll the mapping table.
 */

import type { AttributeDefinition } from '../../../schema/types/attribute-definition';
import {
    DEFAULT_BULLET_LIST_STYLE,
    DEFAULT_ORDERED_LIST_STYLE
} from '../../../commands/builtins/list/list-style-defaults';

export { DEFAULT_BULLET_LIST_STYLE, DEFAULT_ORDERED_LIST_STYLE };

/**
 * The `listStyleType` attribute for `bulletList` containers.
 */
export const bulletListStyleTypeAttribute: AttributeDefinition = {
    name: 'listStyleType',
    type: 'string',
    default: DEFAULT_BULLET_LIST_STYLE
};

/**
 * The `listStyleType` attribute for `orderedList` containers.
 */
export const orderedListStyleTypeAttribute: AttributeDefinition = {
    name: 'listStyleType',
    type: 'string',
    default: DEFAULT_ORDERED_LIST_STYLE
};

/**
 * Read the `list-style-type` CSS property from an element's inline `style`
 * attribute, if present.
 *
 * @param {HTMLElement} dom - The parsed DOM element.
 * @returns {string | null} The CSS value, or null when not declared inline.
 */
function readInlineListStyleType(dom: HTMLElement): string | null {
    const style: string | null = dom.getAttribute('style');
    if (!style) { return null; }
    // Split declarations robustly: values themselves never contain ';'.
    for (const declaration of style.split(';')) {
        const parts: string[] = declaration.split(':');
        if (parts.length < 2) { continue; }
        if (parts[0].trim().toLowerCase() === 'list-style-type') {
            return parts.slice(1).join(':').trim();
        }
    }
    return null;
}

/**
 * Normalize a marker-style candidate to a CSS `list-style-type` value.
 *
 * Recognized inputs:
 *   - CSS values directly (`'disc'`, `'decimal'`, `'lower-alpha'`, ...)
 *   - Legacy HTML `<ol type>` values (`'1'`, `'a'`, `'A'`, `'i'`, `'I'`)
 *
 * Anything else is returned as-is — the model accepts any string so
 * custom/future CSS values pass through untouched.
 *
 * @param {string} candidate - The raw value read from DOM or code.
 * @returns {string} The normalized CSS `list-style-type` value.
 */
function normalizeListStyleType(candidate: string): string {
    switch (candidate) {
    case '1': return 'decimal';
    case 'a':
        return 'lower-alpha';
    case 'A':
        return 'upper-alpha';
    case 'i':
        return 'lower-roman';
    case 'I':
        return 'upper-roman';
    default:
        return candidate;
    }
}

/**
 * Extract the `listStyleType` attribute from a parsed `<ul>` or `<ol>` element.
 *
 * Resolution order:
 *   1. Inline CSS `list-style-type` (the canonical serialization format).
 *   2. Legacy HTML `type` attribute (`<ol type="a">`) — converted to its
 *      CSS equivalent.
 *   3. Fall back to the schema default for the container type.
 *
 * @param {HTMLElement} dom - The parsed list container element.
 * @param {string} fallback - The schema default for the container type.
 * @returns {object} The `listStyleType` attribute bag.
 */
export function parseListStyleType(
    dom: HTMLElement,
    fallback: string
): Record<string, string> {
    const inlineStyle: string | null = readInlineListStyleType(dom);
    if (inlineStyle) {
        return { listStyleType: normalizeListStyleType(inlineStyle) };
    }
    const htmlType: string | null = dom.getAttribute('type');
    if (htmlType) {
        return { listStyleType: normalizeListStyleType(htmlType) };
    }
    return { listStyleType: fallback };
}

/**
 * Merge a `list-style-type: <value>` declaration onto a base HTML attribute
 * bag for list containers.
 *
 * The returned object is always a fresh shallow copy so callers can safely
 * layer additional attributes (like `start`) on top without aliasing the
 * caller's readonly bag.
 *
 * @param {Readonly<Record<string, string>>} baseAttrs - Existing HTML attribute bag (e.g. from `htmlAttributes` option).
 * @param {*} listStyleType - The `listStyleType` node attribute value.
 * @returns {Record<string, string>} A new bag with the style declaration merged in.
 */
export function mergeListStyleTypeStyle(
    baseAttrs: Readonly<Record<string, string>>,
    listStyleType: unknown
): Record<string, string> {
    if (typeof listStyleType !== 'string' || listStyleType.length === 0) {
        return { ...baseAttrs };
    }
    const styleDeclaration: string = `list-style-type: ${listStyleType}`;
    const merged: Record<string, string> = { ...baseAttrs };
    const existingStyle: string | undefined = merged['style'];
    merged['style'] = existingStyle
        ? `${existingStyle.trim().replace(/;$/, '')}; ${styleDeclaration}`
        : styleDeclaration;
    return merged;
}
