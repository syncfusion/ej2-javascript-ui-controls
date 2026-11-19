/**
 * @private
 */

/**
 * Parse inline CSS styles into a record.
 *
 * @private
 * @param {string} styleString - The CSS style attribute value (e.g., "color: red; font-size: 14px")
 * @returns {Record<string, string>} Map of CSS properties (camelCase) to values
 */
export function parseInlineStyles(styleString: string): Record<string, string> {
    const styles: Record<string, string> = {};

    if (!styleString || typeof styleString !== 'string') {
        return styles;
    }

    // Split by semicolon to get individual declarations
    const declarations: string[] = styleString.split(';');

    for (const decl of declarations) {
        const trimmed: string = decl.trim();
        if (!trimmed) {
            continue;
        }

        // Split by first colon to get property and value
        const colonIndex: number = trimmed.indexOf(':');
        if (colonIndex === -1) {
            continue;
        }

        const property: string = trimmed.substring(0, colonIndex).trim();
        const value: string = trimmed.substring(colonIndex + 1).trim();

        if (!property || !value) {
            continue;
        }

        // Convert kebab-case property to camelCase
        const camelCaseProperty: string = kebabToCamelCase(property);
        // eslint-disable-next-line security/detect-object-injection
        styles[camelCaseProperty] = value;
    }

    return styles;
}

/**
 * Convert kebab-case string to camelCase.
 *
 * @private
 * @param {string} kebabCase - The kebab-case string
 * @returns {string} CamelCase version
 */
function kebabToCamelCase(kebabCase: string): string {
    return kebabCase.replace(/-([a-z0-9])/g, (match: string, letter: string) => letter.toUpperCase());
}
