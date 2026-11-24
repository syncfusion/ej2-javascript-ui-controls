/**
 * CSS to Paragraph Style Builder
 *
 * Converts CSS class selector declarations to Word paragraph styles with
 * both paragraph formatting (ParagraphFormat) and character formatting (CharacterFormat).
 *
 * Maps CSS properties to:
 * - ParagraphFormat: alignment, spacing, indentation, borders, background
 * - CharacterFormat: font, size, weight, color, decorations
 *
 * @private
 */
import { WordDocument } from '../document/document';
import { ParagraphStyle } from '../styles/style-base';
import { ParagraphFormat } from '../document/paragraph-format';
import { CharacterFormat } from '../document/character-format';
/**
 * Generates a unique, OOXML-compliant style ID from a CSS class name or selector.
 *
 * Handles both class selectors and ID selectors:
 * - Class selector: "title" → "User_defined_title"
 * - ID selector: "CSS_title" → "CSS_title" (already prefixed)
 *
 * @param {string} cssClassName - The CSS class name or selector ID (e.g., "title", "my-class", "CSS_title")
 * @returns {string} Style ID in format "User_defined_<normalized_name>" or "CSS_<normalized_name>"
 * @private
 */
export declare function createStyleIdFromClassName(cssClassName: string): string;
/**
 * Parses a CSS color value to a hex string for Word Color enum conversion.
 *
 * Supports:
 * - Named colors (red, blue, green, etc.)
 * - Hex colors (#FF0000, #F00)
 * - RGB colors (rgb(255, 0, 0))
 * - Returns hex string (RRGGBB format, no #) for use with colorFromWire
 *
 * @param {string} colorValue - CSS color value
 * @returns {string | undefined} Hex color string (RRGGBB, no #) or undefined if invalid
 * @private
 */
export declare function parseColorValue(colorValue: string): string | undefined;
/**
 * Parses CSS font-size value to points.
 *
 * Supports: px, pt, em, rem, %
 * Conversion: px→pt (×0.75), em→pt (×12), rem→pt (×12), %→pt (×0.12)
 *
 * @param {string} sizeValue - CSS font-size value (e.g., "16px", "12pt", "1.5em")
 * @returns {number | undefined} Size in points, or undefined if invalid
 * @private
 */
export declare function parseFontSize(sizeValue: string): number | undefined;
/**
 * Applies CSS declarations to a paragraph style.
 *
 * Maps CSS properties (camelCase keys) to {@link ParagraphFormat} and
 * {@link CharacterFormat}. All lengths are converted to **points**, the unit
 * used by the format setters. Unrecognised properties/values are ignored.
 *
 * ParagraphFormat:
 * - `textAlign` → horizontalAlignment; `direction` → bidi
 * - `marginLeft/Right/Top/Bottom` → leftIndent/rightIndent/beforeSpacing/afterSpacing
 * - `textIndent` → firstLineIndent
 * - `lineHeight` → lineSpacingCount (unitless/%) or lineSpacing (length, exact)
 * - `backgroundColor` → backColor
 * - `border`, `borderTop/Right/Bottom/Left`, `borderStyle/Color/Width` → borders
 * - `pageBreakBefore/After`, `breakBefore/After` → pageBreakBefore/After
 * - `pageBreakInside`, `breakInside` → keepLines; `breakAfter: avoid` → keepFollow
 * - `widows`/`orphans` → widowControl; `hyphens` → suppressAutoHyphens
 * - `overflowWrap`/`wordWrap` → wordWrap; `writingMode` → textDirection
 *
 * CharacterFormat:
 * - `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `fontVariant`, `color`
 * - `textDecoration` (+ `Line`/`Style`/`Color`) → underlineStyle, underlineColor,
 *   strikethrough, doubleStrikethrough
 * - `textTransform: uppercase|none` → allCaps/smallCaps
 * - `letterSpacing` → characterSpacing; `verticalAlign` → subSuperScript or position
 * - `display: none` → hidden; `visibility: hidden` → webHidden; `textShadow` → shadow
 * - `textEmphasisStyle` → emphasisMark
 *
 * @param {ParagraphStyle} style - The ParagraphStyle to configure
 * @param {Record<string, string>} declarations - CSS declarations as key-value pairs (camelCase keys)
 * @returns {void}
 * @private
 */
export declare function applyDeclarationsToStyle(style: ParagraphStyle, declarations: Record<string, string>): void;
export declare function applyParagraphDeclarations(pFormat: ParagraphFormat, d: Record<string, string>): void;
export declare function applyCharacterDeclarations(cFormat: CharacterFormat, d: Record<string, string>, rawFontFamily?: string): void;
/**
 * Parses a CSS color to an RRGGBB hex string (named, hex, rgb()).
 *
 * @param {string | undefined} value - The value.
 * @returns {string | undefined} The result of the operation.
 */
export declare function parseCssHex(value: string | undefined): string | undefined;
/**
 * Manages CSS class styles created for a document.
 *
 * Caches created paragraph styles to prevent duplicates.
 * Provides getOrCreate semantics for consistent style references.
 *
 * @private
 */
export declare class CSSStyleCache {
    private readonly document;
    private readonly styleMap;
    /**
     * Create a new CSS style cache.
     *
     * @param {WordDocument} document - The WordDocument to create styles in
     * @private
     */
    constructor(document: WordDocument);
    /**
     * Get or create a paragraph style for a CSS class.
     *
     * Returns cached style if already created, otherwise creates new style,
     * applies declarations, caches it, and returns it.
     *
     * @param {string} cssClassName - The CSS class name (e.g., "title")
     * @param {Record<string, string>} declarations - CSS property declarations (camelCase keys)
     * @returns {ParagraphStyle} The created or cached ParagraphStyle
     * @private
     */
    getOrCreateStyle(cssClassName: string, declarations: Record<string, string>): ParagraphStyle;
    /**
     * Check if a style has been created for a CSS class.
     *
     * @param {string} cssClassName - The CSS class name
     * @returns {boolean} True if style exists in cache or document
     * @private
     */
    hasStyle(cssClassName: string): boolean;
    /**
     * Get a previously created style.
     *
     * @param {string} cssClassName - The CSS class name
     * @returns {ParagraphStyle | undefined} The ParagraphStyle or undefined if not created
     * @private
     */
    getStyle(cssClassName: string): ParagraphStyle | undefined;
    /**
     * Clear all cached styles.
     *
     * @returns {void}
     * @private
     */
    clear(): void;
}
