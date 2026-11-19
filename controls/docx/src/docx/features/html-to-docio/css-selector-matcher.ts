/**
 * CSS Selector Matcher
 *
 * Matches CSS class selectors against HTML elements and their class attributes.
 *
 * @private
 */

import { _HTMLElement } from '../html-parser/dom-node.js';
import { SelectorInfo, isClassSelector, getClassName } from './css-selector-parser.js';

/**
 * Represents a matched class and its corresponding CSS rules.
 *
 * @private
 */
export interface MatchedClassSelector {
    /** The class name that matched */
    className: string;
    /** CSS declarations for this class */
    declarations: Record<string, string>;
}

/**
 * Matches CSS selectors against an HTML element.
 *
 * Currently supports class selectors only. Element and ID selectors
 * can be added in future enhancements.
 *
 * @param element - The HTML element to check
 * @param selector - The selector to match
 * @returns true if the selector matches the element
 * @private
 */
export function matchesSelector(element: _HTMLElement, selector: SelectorInfo): boolean {
    // Currently only support class selectors
    if (!isClassSelector(selector)) {
        return false;
    }

    const className = getClassName(selector);
    if (!className) {
        return false;
    }

    return elementHasClass(element, className);
}

/**
 * Checks if an element has a specific class.
 *
 * @param element - The HTML element to check
 * @param className - The class name to look for (without dot)
 * @returns true if the element has this class
 * @private
 */
export function elementHasClass(element: _HTMLElement, className: string): boolean {
    // Get the class attribute
    const classAttr = element._attributes.get('class');

    if (!classAttr) {
        return false;
    }

    // Split by whitespace and check
    const classes = classAttr.split(/\s+/).filter((c) => c.length > 0);

    return classes.indexOf(className) !== -1;
}

/**
 * Gets all classes from an element.
 *
 * @param element - The HTML element
 * @returns Array of class names
 * @private
 */
export function getElementClasses(element: _HTMLElement): string[] {
    const classAttr = element._attributes.get('class');

    if (!classAttr) {
        return [];
    }

    return classAttr
        .split(/\s+/)
        .filter((c) => c.length > 0);
}

/**
 * Finds all matching selectors for an element from a list of rules.
 *
 * @param element - The HTML element
 * @param selectors - Array of selector info objects with their declarations
 * @returns Array of matching selectors with their declarations
 * @private
 */
export function findMatchingSelectors(
    element: _HTMLElement,
    selectors: Array<{ selector: SelectorInfo; declarations: Record<string, string> }>
): MatchedClassSelector[] {
    const matched: MatchedClassSelector[] = [];
    const elementClasses = getElementClasses(element);

    for (const rule of selectors) {
        if (!isClassSelector(rule.selector)) {
            continue;
        }

        const className = getClassName(rule.selector);
        if (!className) {
            continue;
        }

        if (elementClasses.indexOf(className) !== -1) {
            matched.push({
                className,
                declarations: rule.declarations
            });
        }
    }

    return matched;
}

/**
 * Merges declarations from multiple matched selectors.
 *
 * Later selectors override earlier ones (respecting cascade order).
 *
 * @param matchedSelectors - Array of matched selectors
 * @returns Merged declarations
 * @private
 */
export function mergeMatchedDeclarations(
    matchedSelectors: MatchedClassSelector[]
): Record<string, string> {
    const merged: Record<string, string> = {};

    for (const matched of matchedSelectors) {
        // Merge declarations (later ones override earlier)
        Object.assign(merged, matched.declarations);
    }

    return merged;
}
