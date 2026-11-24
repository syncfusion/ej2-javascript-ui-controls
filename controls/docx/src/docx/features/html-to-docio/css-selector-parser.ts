/**
 * CSS Selector Parser
 *
 * Parses CSS rules from <style> elements and extracts class selectors.
 *
 * @private
 */

/**
 * Represents a single CSS rule parsed from a stylesheet.
 *
 * @private
 */
export interface CSSRuleDefinition {
    /** The selector text (e.g., ".title", "#header", "p", "div p") */
    selectorText: string;
    /** Extracted selector type and name */
    selector: SelectorInfo;
    /** CSS declarations as key-value pairs (camelCase keys) */
    declarations: Record<string, string>;
}

/**
 * Information about a parsed CSS selector.
 *
 * @private
 */
export interface SelectorInfo {
    /** Type: 'class', 'id', 'element', 'descendant', 'compound', or 'unknown' */
    type: 'class' | 'id' | 'element' | 'descendant' | 'compound' | 'unknown';
    /** The selector name (without prefix) or full selector for complex selectors */
    name: string;
    /** For class selectors, the class name (without dot) */
    className?: string;
    /** For ID selectors, the ID name (without hash) */
    idName?: string;
}

/**
 * Parses CSS style text from a <style> element.
 *
 * Handles multiple rules, comments, and cascading properties.
 *
 * @param {string} styleText - The complete CSS text from a <style> element
 * @returns {CSSRuleDefinition[]} Array of parsed CSS rules
 * @private
 */
export function parseCSSRules(styleText: string): CSSRuleDefinition[] {
    const rules: CSSRuleDefinition[] = [];

    if (!styleText || typeof styleText !== 'string') {
        return rules;
    }

    // Remove comments
    const cleaned: string = styleText.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split by closing braces to find rule blocks
    const ruleBlocks: string[] = cleaned.split('}');

    for (const block of ruleBlocks) {
        const trimmed: string = block.trim();
        if (!trimmed) {
            continue;
        }

        // Find the opening brace
        const braceIndex: number = trimmed.indexOf('{');
        if (braceIndex === -1) {
            continue;
        }

        // Extract selector and declarations
        const selectorText: string = trimmed.substring(0, braceIndex).trim();
        const declarationsText: string = trimmed.substring(braceIndex + 1).trim();

        if (!selectorText || !declarationsText) {
            continue;
        }

        // Parse selector
        const selector: SelectorInfo = parseSelector(selectorText);

        // Parse declarations
        const declarations: Record<string, string> = parseDeclarations(declarationsText);

        if (Object.keys(declarations).length > 0) {
            rules.push({
                selectorText,
                selector,
                declarations
            });
        }
    }

    return rules;
}

/**
 * Parses a single CSS selector.
 *
 * @param {string} selectorText - The selector text (e.g., ".title", "#header", "p")
 * @returns {SelectorInfo} Information about the selector
 * @private
 */
export function parseSelector(selectorText: string): SelectorInfo {
    const trimmed: string = selectorText.trim();

    // Class selector (.className)
    if (trimmed.startsWith('.')) {
        const className: string = trimmed.substring(1).trim();
        return {
            type: 'class',
            name: className,
            className: className
        };
    }

    // ID selector (#idName)
    if (trimmed.startsWith('#')) {
        const idName: string = trimmed.substring(1).trim();
        return {
            type: 'id',
            name: idName,
            idName: idName
        };
    }

    // Descendant selector (e.g., "div p", "div > p")
    if (trimmed.includes(' ') || trimmed.includes('>')) {
        return {
            type: 'descendant',
            name: trimmed
        };
    }

    // Element selector
    if (/^[a-z][a-z0-9]*$/i.test(trimmed)) {
        return {
            type: 'element',
            name: trimmed.toLowerCase()
        };
    }

    // Compound or unknown selector
    if (trimmed.includes('.') || trimmed.includes('#')) {
        return {
            type: 'compound',
            name: trimmed
        };
    }

    // Unknown selector
    return {
        type: 'unknown',
        name: trimmed
    };
}

/**
 * Parses CSS declarations from rule body.
 *
 * @param {string} declarationsText - The CSS declarations text (e.g., "color: red; font-weight: bold;")
 * @returns {Record<string, string>} Object with camelCase property names and values
 * @private
 */
export function parseDeclarations(declarationsText: string): Record<string, string> {
    const declarations: Record<string, string> = {};

    if (!declarationsText || typeof declarationsText !== 'string') {
        return declarations;
    }

    // Split by semicolon
    const parts: string[] = declarationsText.split(';');

    for (const part of parts) {
        const trimmed: string = part.trim();
        if (!trimmed) {
            continue;
        }

        // Split by first colon
        const colonIndex: number = trimmed.indexOf(':');
        if (colonIndex === -1) {
            continue;
        }

        const property: string = trimmed.substring(0, colonIndex).trim();
        const value: string = trimmed.substring(colonIndex + 1).trim();

        if (!property || !value) {
            continue;
        }

        // Remove !important flag if present (keep the value without the flag)
        const cleanValue: string = value.replace(/\s*!important\s*$/i, '').trim();

        if (cleanValue) {
            // Convert kebab-case to camelCase
            const camelProperty: string = kebabToCamelCase(property);
            // eslint-disable-next-line security/detect-object-injection
            declarations[camelProperty] = cleanValue;
        }
    }

    return declarations;
}

/**
 * Converts kebab-case string to camelCase.
 *
 * @param {string} kebabCase - The kebab-case string (e.g., "font-weight")
 * @returns {string} CamelCase version (e.g., "fontWeight")
 * @private
 */
export function kebabToCamelCase(kebabCase: string): string {
    return kebabCase.replace(/-([a-z0-9])/g, (match: string, letter: string) => letter.toUpperCase());
}

/**
 * Checks if a selector is a class selector.
 *
 * @param {SelectorInfo} selector - The selector info
 * @returns {boolean} true if it's a simple class selector
 * @private
 */
export function isClassSelector(selector: SelectorInfo): boolean {
    return selector.type === 'class' && selector.className !== undefined;
}

/**
 * Extracts class name from a class selector.
 *
 * @param {SelectorInfo} selector - The selector info
 * @returns {string | undefined} The class name without dot, or undefined if not a class selector
 * @private
 */
export function getClassName(selector: SelectorInfo): string | undefined {
    return selector.className;
}
