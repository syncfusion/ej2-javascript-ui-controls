/**
 * Stylesheet Collection and Stylesheet Manager
 *
 * Manages CSS stylesheets and rules extracted from <style> elements.
 *
 * @private
 */

import { CSSRuleDefinition, parseCSSRules } from './css-selector-parser.js';

/**
 * Represents a single CSS stylesheet.
 *
 * @private
 */
export class CSSStyleSheet {
    /** Stylesheet title (if present) */
    title: string | undefined;

    /** URL for external stylesheets (or undefined for embedded) */
    href: string | undefined;

    /** Whether the stylesheet is disabled */
    disabled: boolean = false;

    /** Array of CSS rules in this stylesheet */
    cssRules: CSSRuleDefinition[] = [];

    /**
     * Creates a CSS stylesheet.
     *
     * @param cssText - The CSS text content
     * @param href - Optional URL for external stylesheet
     * @param title - Optional stylesheet title
     */
    constructor(cssText: string, href?: string, title?: string) {
        this.href = href;
        this.title = title;
        this.cssRules = parseCSSRules(cssText);
    }
}

/**
 * Manages a collection of stylesheets.
 *
 * @private
 */
export class StyleSheetCollection {
    /** Array of stylesheets */
    private _sheets: CSSStyleSheet[] = [];

    /**
     * Gets the number of stylesheets.
     *
     * @private
     */
    get length(): number {
        return this._sheets.length;
    }

    /**
     * Adds a stylesheet to the collection.
     *
     * @param sheet - The stylesheet to add
     * @private
     */
    add(sheet: CSSStyleSheet): void {
        if (sheet) {
            this._sheets.push(sheet);
        }
    }

    /**
     * Gets a stylesheet by index.
     *
     * @param index - The index
     * @returns The stylesheet or undefined
     * @private
     */
    item(index: number): CSSStyleSheet | undefined {
        return this._sheets[index];
    }

    /**
     * Gets all stylesheets.
     *
     * @returns Array of stylesheets
     * @private
     */
    getAll(): CSSStyleSheet[] {
        return [...this._sheets];
    }

    /**
     * Gets all CSS rules from all stylesheets.
     *
     * Returns rules in order (respects cascade).
     *
     * @returns Array of CSS rules
     * @private
     */
    getAllRules(): CSSRuleDefinition[] {
        const allRules: CSSRuleDefinition[] = [];

        for (const sheet of this._sheets) {
            if (!sheet.disabled) {
                allRules.push(...sheet.cssRules);
            }
        }

        return allRules;
    }

    /**
     * Clears all stylesheets.
     *
     * @private
     */
    clear(): void {
        this._sheets = [];
    }
}
