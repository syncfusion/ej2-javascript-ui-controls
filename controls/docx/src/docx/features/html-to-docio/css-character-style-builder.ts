/**
 * CSS Character Style Cache
 *
 * Manages creation and caching of character styles generated from CSS class selectors
 *
 * @private
 */

import { applyCharacterDeclarations } from './css-paragraph-style-builder';
import { WordDocument } from '../document/document';
import { cssToCharacterFormat, CharacterFormatDelta } from './css-character-format-converter';
import { CharacterStyle } from '../styles/style-base';

/**
 * @private
 * Cache for character styles created from CSS classes.
 * Avoids creating duplicate styles when the same class is used multiple times.
 */
export class CSSCharacterStyleCache {
    private _document: WordDocument;
    private _styleCache: Map<string, string> = new Map(); // className -> styleId

    constructor(document: WordDocument) {
        this._document = document;
    }

    /**
     * Gets or creates a character style for a CSS class selector.
     * Returns the style ID to use in w:rStyle, or undefined if no style was created.
     *
     * @param {string} className - The CSS class name (e.g., 'red-text', 'bold-italic')
     * @param {Record<string, string>} styles - The CSS properties for this class
     * @returns {string | undefined} The style ID to use, or undefined if creation failed
     * @private
     */
    getOrCreateCharacterStyle(className: string, styles: Record<string, string>): string | undefined {
        // Return cached style if already created
        if (this._styleCache.has(className)) {
            return this._styleCache.get(className);
        }

        // Skip if no document styles collection
        if (!this._document || !this._document.styles) {
            return undefined;
        }

        // Skip if no meaningful styles
        if (!styles || Object.keys(styles).length === 0) {
            return undefined;
        }

        // Convert CSS properties to CharacterFormat
        const delta: CharacterFormatDelta = cssToCharacterFormat(styles);

        if (Object.keys(delta).length === 0) {
            return undefined;
        }

        // Create character style
        const styleId: string = this._createCharacterStyle(className, styles);

        if (styleId) {
            this._styleCache.set(className, styleId);
        }

        return styleId;
    }

    /**
     * Creates a new character style in styles.xml
     *
     * @param {string} className - The class name.
     * @param {Record<string, string>} styles - The styles.
     * @returns {string | undefined} The result of the operation.
     * @private
     */
    private _createCharacterStyle(className: string, styles: Record<string, string>): string | undefined {
        try {
            const styleId: string = className.replace(/[^A-Za-z0-9_-]+/g, '_');
            const existing: CharacterStyle = this._document.styles.getCharacterStyle(styleId);
            const style: CharacterStyle = existing ? existing : this._document.styles.addCharacterStyle(styleId);
            const d: Record<string, string> = {};
            for (const key of Object.keys(styles)) {
                // eslint-disable-next-line security/detect-object-injection
                const v: string = styles[key];
                if (typeof v === 'string' && v.trim() !== '') {
                    // eslint-disable-next-line security/detect-object-injection
                    d[key] = v.trim().toLowerCase();
                }
            }
            applyCharacterDeclarations(style.characterFormat, d, styles.fontFamily);
            return styleId;
        } catch (error) {
            return undefined;
        }
    }
}
