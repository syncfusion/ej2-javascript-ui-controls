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
 * @param styleText - The complete CSS text from a <style> element
 * @returns Array of parsed CSS rules
 * @private
 */
export function parseCSSRules(styleText: string): CSSRuleDefinition[] {
    const rules: CSSRuleDefinition[] = [];

    if (!styleText || typeof styleText !== 'string') {
        return rules;
    }

    // Remove comments
    let cleaned = styleText.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split by closing braces to find rule blocks
    const ruleBlocks = cleaned.split('}');

    for (const block of ruleBlocks) {
        const trimmed = block.trim();
        if (!trimmed) {
            continue;
        }

        // Find the opening brace
        const braceIndex = trimmed.indexOf('{');
        if (braceIndex === -1) {
            continue;
        }

        // Extract selector and declarations
        const selectorText = trimmed.substring(0, braceIndex).trim();
        const declarationsText = trimmed.substring(braceIndex + 1).trim();

        if (!selectorText || !declarationsText) {
            continue;
        }

        // Parse selector
        const selector = parseSelector(selectorText);

        // Parse declarations
        const declarations = parseDeclarations(declarationsText);

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
 * @param selectorText - The selector text (e.g., ".title", "#header", "p")
 * @returns Information about the selector
 * @private
 */
export function parseSelector(selectorText: string): SelectorInfo {
    const trimmed = selectorText.trim();

    // Class selector (.className)
    if (trimmed.startsWith('.')) {
        const className = trimmed.substring(1).trim();
        return {
            type: 'class',
            name: className,
            className: className
        };
    }

    // ID selector (#idName)
    if (trimmed.startsWith('#')) {
        const idName = trimmed.substring(1).trim();
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
 * @param declarationsText - The CSS declarations text (e.g., "color: red; font-weight: bold;")
 * @returns Object with camelCase property names and values
 * @private
 */
export function parseDeclarations(declarationsText: string): Record<string, string> {
    const declarations: Record<string, string> = {};

    if (!declarationsText || typeof declarationsText !== 'string') {
        return declarations;
    }

    // Split by semicolon
    const parts = declarationsText.split(';');

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) {
            continue;
        }

        // Split by first colon
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex === -1) {
            continue;
        }

        const property = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();

        if (!property || !value) {
            continue;
        }

        // Remove !important flag if present (keep the value without the flag)
        const cleanValue = value.replace(/\s*!important\s*$/i, '').trim();

        if (cleanValue) {
            // Convert kebab-case to camelCase
            const camelProperty = kebabToCamelCase(property);
            // eslint-disable-next-line security/detect-object-injection
            declarations[camelProperty] = cleanValue;
        }
    }

    return declarations;
}

/**
 * Converts kebab-case string to camelCase.
 *
 * @param kebabCase - The kebab-case string (e.g., "font-weight")
 * @returns CamelCase version (e.g., "fontWeight")
 * @private
 */
export function kebabToCamelCase(kebabCase: string): string {
    return kebabCase.replace(/-([a-z0-9])/g, (match: string, letter: string) => letter.toUpperCase());
}

/**
 * Checks if a selector is a class selector.
 *
 * @param selector - The selector info
 * @returns true if it's a simple class selector
 * @private
 */
export function isClassSelector(selector: SelectorInfo): boolean {
    return selector.type === 'class' && selector.className !== undefined;
}

/**
 * Extracts class name from a class selector.
 *
 * @param selector - The selector info
 * @returns The class name without dot, or undefined if not a class selector
 * @private
 */
export function getClassName(selector: SelectorInfo): string | undefined {
    return selector.className;
}
