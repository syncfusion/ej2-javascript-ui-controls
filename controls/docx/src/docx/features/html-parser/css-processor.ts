/**
 * CSS stylesheet processing for HTML parser.
 * Parses CSS rules and applies them to HTML elements during parsing.
 * This allows both document and PDF consumers to use pre-resolved styles.
 *
 * @private
 */

import { _HTMLElement } from './dom-node';

/**
 * Represents a parsed CSS rule with selector and declarations.
 *
 * @private
 */
export interface _CSSRule {
    selector: {
        type: 'class' | 'element' | 'id' | 'compound' | 'descendant' | 'unknown';
        className?: string;
        tagName?: string;
        id?: string;
        value?: string;
    };
    declarations: Record<string, string>;
}

/**
 * Parser for CSS rules extracted from <style> elements.
 * Extracts and normalizes CSS declarations into a standardized format.
 *
 * @private
 */
export class _CSSProcessor {
    /**
     * Parse CSS text and extract rules.
     *
     * @param {string} cssText - Raw CSS text from <style> element
     * @returns {_CSSRule[]} Array of parsed CSS rules
     * @private
     */
    static parseCSS(cssText: string): _CSSRule[] {
        const rules: _CSSRule[] = [];

        // Remove comments
        const cleanCSS: string = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

        // Match rules: selector { declarations }
        const rulePattern: RegExp = /([^{]+)\{([^}]+)\}/g;
        let match: RegExpExecArray | null;

        // eslint-disable-next-line no-cond-assign
        while ((match = rulePattern.exec(cleanCSS)) !== null) {
            const selector: string = match[1].trim();
            const declarations: string = match[2].trim();

            // Parse declarations
            const parsedDeclarations: Record<string, string> = this._parseDeclarations(declarations);
            if (Object.keys(parsedDeclarations).length === 0) {
                continue;
            }

            // Selector lists ("h1, h2") produce one rule per selector
            for (const single of selector.split(',')) {
                const parsedSelector: _CSSRule['selector'] = this._parseSelector(single);
                if (!parsedSelector) {
                    continue;
                }
                rules.push({
                    selector: parsedSelector,
                    declarations: { ...parsedDeclarations }
                });
            }
        }

        return rules;
    }

    /**
     * Parse a CSS selector.
     * Supports: .class, #id, element, element.class, etc.
     *
     * @param {string} selector - CSS selector string
     * @returns {Object | null} Parsed selector object or null if unsupported
     * @private
     */
    private static _parseSelector(selector: string): _CSSRule['selector'] | null {
        selector = selector.trim();

        if (!selector) {
            return null;
        }

        // Class selector: .classname
        const classMatch: RegExpMatchArray = selector.match(/^\.([a-zA-Z0-9_-]+)$/);
        if (classMatch) {
            return {
                type: 'class',
                className: classMatch[1]
            };
        }

        // ID selector: #id
        const idMatch: RegExpMatchArray = selector.match(/^#([a-zA-Z0-9_-]+)$/);
        if (idMatch) {
            return {
                type: 'id',
                id: idMatch[1]
            };
        }

        // Element selector: tagname
        // eslint-disable-next-line security/detect-unsafe-regex
        const elementMatch: RegExpMatchArray = selector.match(/^([a-zA-Z][a-zA-Z0-9]*)(\.([a-zA-Z0-9_-]+))?$/);
        if (elementMatch) {
            if (elementMatch[3]) {
                // Element with class: p.classname
                return {
                    type: 'compound',
                    tagName: elementMatch[1],
                    className: elementMatch[3]
                };
            }
            return {
                type: 'element',
                tagName: elementMatch[1]
            };
        }

        // Descendant selector: element element (e.g., "div p")
        const parts: string[] = selector.split(/\s+/).filter((p: string) => p.length > 0);
        if (parts.length > 1) {
            return {
                type: 'descendant',
                value: selector
            };
        }

        // Unknown selector
        return {
            type: 'unknown',
            value: selector
        };
    }

    /**
     * Parse CSS declarations.
     *
     * @param {string} declarationsText - CSS declarations text (e.g., "color: red; font-size: 12px;")
     * @returns {Record<string, string>} Object with property names and values
     * @private
     */
    private static _parseDeclarations(declarationsText: string): Record<string, string> {
        const declarations: Record<string, string> = {};

        // Split by semicolon
        const parts: string[] = declarationsText.split(';');

        for (const part of parts) {
            const trimmed: string = part.trim();
            if (!trimmed) {
                continue;
            }

            const colonIndex: number = trimmed.indexOf(':');
            if (colonIndex === -1) {
                continue;
            }

            const property: string = trimmed.substring(0, colonIndex).trim().toLowerCase();
            const value: string = trimmed.substring(colonIndex + 1).trim();

            if (property && value) {
                // Normalize property names to camelCase
                const camelCase: string = this._toCamelCase(property);
                // eslint-disable-next-line security/detect-object-injection
                declarations[camelCase] = value;
            }
        }

        return declarations;
    }

    /**
     * Convert CSS property name to camelCase.
     * Example: font-size -> fontSize
     *
     * @param {string} property - CSS property name (kebab-case)
     * @returns {string} camelCase property name
     * @private
     */
    private static _toCamelCase(property: string): string {
        return property.replace(/-([a-z])/g, (_match: string, char: any) => char.toUpperCase());
    }

    /**
     * Apply CSS rules to an element using the CSS cascade.
     *
     * Matching rules are ordered by specificity (id > class > element), then by
     * source order, so later/more specific rules override earlier ones. Inline
     * styles already stored in `element._styles` always win. Element-level
     * descendant matches additionally record `_descendantSelectorId` so the
     * document mapper can create a reusable paragraph style for them.
     *
     * @param {_HTMLElement} element - The HTML element to apply styles to
     * @param {_CSSRule[]} rules - Array of CSS rules to match against
     * @returns {void}
     * @private
     */
    static applyStylesToElement(element: _HTMLElement, rules: _CSSRule[]): void {
        const matched: Array<{ rule: _CSSRule; spec: number; order: number }> = [];
        for (let i: number = 0; i < rules.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const rule: _CSSRule = rules[i];
            const spec: number = this._matchRule(element, rule);
            if (spec !== undefined) {
                matched.push({ rule: rule, spec: spec, order: i });
            }
        }
        if (matched.length === 0) {
            return;
        }
        matched.sort((
            a: { rule: _CSSRule; spec: number; order: number; },
            b: { rule: _CSSRule; spec: number; order: number; }
        ) => a.spec - b.spec || a.order - b.order);

        const inline: Record<string, string> = { ...element._styles };
        const cascaded: Record<string, string> = {};
        let descendant: _CSSRule | undefined;
        for (const m of matched) {
            Object.assign(cascaded, m.rule.declarations);
            if (m.rule.selector.type === 'descendant') {
                descendant = m.rule;
            }
        }
        element._styles = { ...cascaded, ...inline };

        if (descendant && descendant.selector.value) {
            const normalized: string = descendant.selector.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_|_$/g, '');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (element as any)._descendantSelectorId = 'CSS_desc_' + normalized;
        }
    }

    /**
     * Returns the specificity (a*10000 + b*100 + c) if the rule matches the element.
     *
     * @param {_HTMLElement} element - The element.
     * @param {_CSSRule} rule - The rule.
     * @returns {number | undefined} The result of the operation.
     * @private
     */
    private static _matchRule(element: _HTMLElement, rule: _CSSRule): number | undefined {
        const sel: _CSSRule['selector'] = rule.selector;
        const tagName: string = element.tagName.toLowerCase();
        const classAttr: string = element._attributes.get('class');
        const classes: string[] = classAttr ? classAttr.split(/\s+/).filter((c: string) => c.length > 0) : [];
        const idAttr: string = element._attributes.get('id');

        switch (sel.type) {
        case 'class':
            return classes.indexOf(sel.className || '') !== -1 ? 100 : undefined;
        case 'id':
            return idAttr !== undefined && idAttr === sel.id ? 10000 : undefined;
        case 'element':
            return tagName === (sel.tagName || '').toLowerCase() ? 1 : undefined;
        case 'compound':
            return tagName === (sel.tagName || '').toLowerCase() && classes.indexOf(sel.className || '') !== -1
                ? 101 : undefined;
        case 'descendant':
        default:
            return sel.value ? this._matchComplex(element, sel.value) : undefined;
        }
    }

    /**
     * Matches complex selectors made of compounds (tag, .class, #id) joined by
     * descendant (space) or child (>) combinators. Unsupported syntax
     * (attributes, pseudo-classes, sibling combinators) never matches.
     *
     * @param {_HTMLElement} element - The element.
     * @param {string} selector - The selector.
     * @returns {number | undefined} The result of the operation.
     * @private
     */
    private static _matchComplex(element: _HTMLElement, selector: string): number | undefined {
        const tokens: string[] = selector.replace(/\s*>\s*/g, ' > ').trim().split(/\s+/);
        const compounds: string[] = [];
        const combinators: string[] = []; // combinator preceding compounds[i] (i>0)
        let pending: string = ' ';
        for (const t of tokens) {
            if (t === '>') {
                pending = '>';
            } else {
                if (compounds.length > 0) {
                    combinators.push(pending);
                }
                compounds.push(t);
                pending = ' ';
            }
        }
        let specificity: number = 0;
        for (const c of compounds) {
            const parsed: { tag?: string; classes: string[]; id?: string; } = this._parseCompound(c);
            if (!parsed) {
                return undefined;
            }
            specificity += parsed.id ? 10000 : 0;
            specificity += parsed.classes.length * 100 + (parsed.tag ? 1 : 0);
        }
        if (!this._matchCompoundAt(element, compounds, combinators, compounds.length - 1)) {
            return undefined;
        }
        return specificity;
    }

    /**
     * Matches a compound selector at the given index, walking up the ancestor chain
     * according to the combinator that precedes it.
     *
     * @param {_HTMLElement|null} element - The element to match against.
     * @param {string[]} compounds - The compound selectors of the selector.
     * @param {string[]} combinators - The combinators between compound selectors.
     * @param {number} index - The compound selector index to match.
     * @returns {boolean} True when the element and its ancestors match the selector chain.
     * @private
     */
    private static _matchCompoundAt(
        element: _HTMLElement | null,
        compounds: string[],
        combinators: string[],
        index: number
    ): boolean {
        // eslint-disable-next-line security/detect-object-injection
        if (!element || !this._compoundMatches(element, compounds[index])) {
            return false;
        }
        if (index === 0) {
            return true;
        }
        if (combinators[index - 1] === '>') {
            return this._matchCompoundAt(element._parentNode, compounds, combinators, index - 1);
        }
        let ancestor: _HTMLElement = element._parentNode;
        while (ancestor) {
            if (this._matchCompoundAt(ancestor, compounds, combinators, index - 1)) {
                return true;
            }
            ancestor = ancestor._parentNode;
        }
        return false;
    }

    /**
     * Parses a compound selector into its tag, class, and id parts.
     *
     * @param {string} text - The compound selector text (e.g. "div.myClass#myId").
     * @returns {Object|undefined} The parsed tag, classes, and id, or undefined when unparsable.
     * @private
     */
    private static _parseCompound(text: string): { tag?: string; classes: string[]; id?: string } | undefined {
        // eslint-disable-next-line security/detect-unsafe-regex
        const m: RegExpMatchArray = text.match(/^([a-zA-Z][a-zA-Z0-9-]*|\*)?((?:[.#][a-zA-Z0-9_-]+)*)$/);
        if (!m || (!m[1] && !m[2])) {
            return undefined;
        }
        const result: { tag?: string; classes: string[]; id?: string } = { classes: [] };
        if (m[1] && m[1] !== '*') {
            result.tag = m[1].toLowerCase();
        }
        const rest: string = m[2] || '';
        const re: RegExp = /([.#])([a-zA-Z0-9_-]+)/g;
        let r: RegExpExecArray | null;
        // eslint-disable-next-line no-cond-assign
        while ((r = re.exec(rest)) !== null) {
            if (r[1] === '.') {
                result.classes.push(r[2]);
            } else {
                result.id = r[2];
            }
        }
        return result;
    }

    /**
     * Determines whether an element matches a single compound selector.
     *
     * @param {_HTMLElement} element - The element to test.
     * @param {string} compound - The compound selector to match against.
     * @returns {boolean} True when the element matches the compound selector.
     * @private
     */
    private static _compoundMatches(element: _HTMLElement, compound: string): boolean {
        const parsed: { tag?: string; classes: string[]; id?: string; } = this._parseCompound(compound);
        if (!parsed || !element._attributes || typeof element.tagName !== 'string') {
            return false;
        }
        if (parsed.tag && element.tagName.toLowerCase() !== parsed.tag) {
            return false;
        }
        if (parsed.id && element._attributes.get('id') !== parsed.id) {
            return false;
        }
        if (parsed.classes.length > 0) {
            const attr: string = element._attributes.get('class');
            const have: string[] = attr ? attr.split(/\s+/) : [];
            for (const c of parsed.classes) {
                if (have.indexOf(c) === -1) {
                    return false;
                }
            }
        }
        return true;
    }
}
