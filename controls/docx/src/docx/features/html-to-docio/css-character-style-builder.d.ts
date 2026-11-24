/**
 * CSS Character Style Cache
 *
 * Manages creation and caching of character styles generated from CSS class selectors
 *
 * @private
 */
import { WordDocument } from '../document/document';
/**
 * @private
 * Cache for character styles created from CSS classes.
 * Avoids creating duplicate styles when the same class is used multiple times.
 */
export declare class CSSCharacterStyleCache {
    private _document;
    private _styleCache;
    constructor(document: WordDocument);
    /**
     * Gets or creates a character style for a CSS class selector.
     * Returns the style ID to use in w:rStyle, or undefined if no style was created.
     *
     * @param {string} className - The CSS class name (e.g., 'red-text', 'bold-italic')
     * @param {Record<string, string>} styles - The CSS properties for this class
     * @returns {string | undefined} The style ID to use, or undefined if creation failed
     * @private
     */
    getOrCreateCharacterStyle(className: string, styles: Record<string, string>): string | undefined;
    /**
     * Creates a new character style in styles.xml
     *
     * @param {string} className - The class name.
     * @param {Record<string, string>} styles - The styles.
     * @returns {string | undefined} The result of the operation.
     * @private
     */
    private _createCharacterStyle;
}
