/**
 * CSS to CharacterFormat Converter
 *
 * Converts CSS declarations to CharacterFormat properties.
 *
 * @private
 */

import { Color, colorFromWire, normalizeColorHex } from '../document/color.js';
import { UnderlineStyle } from '../document/underline-style.js';
import { SubSuperScript } from '../document/sub-super-script.js';

/**
 * Represents the subset of CharacterFormat properties we can set from CSS.
 *
 * @private
 */
export interface CharacterFormatDelta {
    // Text Decoration & Style
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    doubleStrikethrough?: boolean;
    underlineStyle?: UnderlineStyle;
    underlineColor?: Color;
    
    // Typography & Font
    fontSize?: number;
    fontName?: string;
    characterSpacing?: number;
    
    // Color & Highlighting
    textColor?: Color;
    highlightColor?: Color;
    textBackgroundColor?: Color;
    /** Exact RRGGBB text color for values outside the {@link Color} enum. */
    textColorHex?: string;
    /** Exact RRGGBB background (shading fill) for values outside the {@link Color} enum. */
    textBackgroundHex?: string;
    
    // Advanced Formatting
    allCaps?: boolean;
    smallCaps?: boolean;
    subSuperScript?: SubSuperScript;
    
    // Visibility & Special
    noProof?: boolean;
    webHidden?: boolean;
}

/**
 * Converts CSS declarations to CharacterFormat delta.
 *
 * @param declarations - CSS declarations as key-value pairs (camelCase keys)
 * @returns CharacterFormat delta object
 * @private
 */
export function cssToCharacterFormat(declarations: Record<string, string>): CharacterFormatDelta {
    const delta: CharacterFormatDelta = {};

    if (!declarations || typeof declarations !== 'object') {
        return delta;
    }

    // Process each CSS property
    for (const key in declarations) {
        if (declarations.hasOwnProperty(key)) {
            const value: string = declarations[key];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setter = propertySetters[key as keyof typeof propertySetters] as
            | ((value: string, delta: CharacterFormatDelta) => void)
            | undefined;

            if (setter) {
                try {
                    setter(value, delta);
                } catch (error) {
                    // Log error but continue processing other properties
                    // eslint-disable-next-line no-console
                    console.warn('Failed to apply CSS property "' + key + ': ' + value + '":', error);
                }
            }
        }
    }

    return delta;
}

/**
 * Property setters map CSS properties to CharacterFormat updates.
 *
 * @private
 */
const propertySetters: Record<string, (value: string, delta: CharacterFormatDelta) => void> = {
    fontWeight: (value: string, delta: CharacterFormatDelta): void => {
        if (value === 'bold' || value === '600' || value === '700' || value === '800' || value === '900') {
            delta.bold = true;
        } else if (value === 'normal' || value === '400') {
            delta.bold = undefined;
        }
    },

    fontStyle: (value: string, delta: CharacterFormatDelta): void => {
        if (value === 'italic' || value === 'oblique') {
            delta.italic = true;
        } else if (value === 'normal') {
            delta.italic = undefined;
        }
    },

    fontSize: (value: string, delta: CharacterFormatDelta): void => {
        const size = parseFontSize(value);
        if (size !== undefined) {
            delta.fontSize = size;
        }
    },

    fontFamily: (value: string, delta: CharacterFormatDelta): void => {
        // Remove quotes and sanitize
        let fontName = value.replace(/^["']|["']$/g, '').trim();
        // Handle font-family lists (take first one)
        const firstFont = fontName.split(',')[0].trim();
        if (firstFont) {
            delta.fontName = firstFont;
        }
    },

    color: (value: string, delta: CharacterFormatDelta): void => {
        const color = parseColor(value);
        if (color !== undefined) {
            delta.textColor = color;
        } else {
            const hex = parseCssRgbHex(value);
            if (hex !== undefined) {
                delta.textColorHex = hex;
            }
        }
    },

    textDecoration: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'none') {
            delta.underlineStyle = UnderlineStyle.None;
            delta.strikethrough = undefined;
        } else {
            // Check for line styles
            if (lowerValue.includes('underline')) {
                // Check for double underline
                if (lowerValue.includes('double')) {
                    delta.underlineStyle = UnderlineStyle.Double;
                } else if (lowerValue.includes('dotted')) {
                    delta.underlineStyle = UnderlineStyle.Dotted;
                } else if (lowerValue.includes('dashed')) {
                    delta.underlineStyle = UnderlineStyle.Dash;
                } else if (lowerValue.includes('wavy')) {
                    delta.underlineStyle = UnderlineStyle.Wavy;
                } else if (lowerValue.includes('bold')) {
                    delta.underlineStyle = UnderlineStyle.Thick;
                } else {
                    delta.underlineStyle = UnderlineStyle.Single;
                }
            }
            
            if (lowerValue.includes('line-through')) {
                delta.strikethrough = true;
            }
            
            if (lowerValue.includes('double-strikethrough')) {
                delta.doubleStrikethrough = true;
            }
        }
    },

    textDecorationLine: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue.includes('underline')) {
            delta.underlineStyle = UnderlineStyle.Single;
        } else if (lowerValue.includes('line-through')) {
            delta.strikethrough = true;
        } else if (lowerValue === 'none') {
            delta.underlineStyle = UnderlineStyle.None;
            delta.strikethrough = undefined;
        }
    },

    textDecorationStyle: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        switch (lowerValue) {
            case 'solid':
                delta.underlineStyle = UnderlineStyle.Single;
                break;
            case 'double':
                delta.underlineStyle = UnderlineStyle.Double;
                break;
            case 'dotted':
                delta.underlineStyle = UnderlineStyle.Dotted;
                break;
            case 'dashed':
                delta.underlineStyle = UnderlineStyle.Dash;
                break;
            case 'wavy':
                delta.underlineStyle = UnderlineStyle.Wavy;
                break;
        }
    },

    textDecorationColor: (value: string, delta: CharacterFormatDelta): void => {
        const color = parseColor(value);
        if (color !== undefined) {
            delta.underlineColor = color;
        }
    },

    backgroundColor: (value: string, delta: CharacterFormatDelta): void => {
        const color = parseColor(value);
        if (color !== undefined) {
            delta.textBackgroundColor = color;
        } else {
            const hex = parseCssRgbHex(value);
            if (hex !== undefined) {
                delta.textBackgroundHex = hex;
            }
        }
    },

    textTransform: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        switch (lowerValue) {
            case 'uppercase':
                delta.allCaps = true;
                break;
            case 'lowercase':
                // Note: 'lowercase' in CSS typically means small-caps in Word
                delta.smallCaps = true;
                break;
            case 'capitalize':
                // CSS 'capitalize' capitalizes first letter of each word
                // Word doesn't have direct equivalent, but can use for styling context
                break;
            case 'none':
                delta.allCaps = undefined;
                delta.smallCaps = undefined;
                break;
        }
    },

    verticalAlign: (value: string, delta: CharacterFormatDelta): void => {
        if (value === 'super' || value === 'superscript') {
            delta.subSuperScript = SubSuperScript.SuperScript;
        } else if (value === 'sub' || value === 'subscript') {
            delta.subSuperScript = SubSuperScript.SubScript;
        }
    },

    letterSpacing: (value: string, delta: CharacterFormatDelta): void => {
        const spacing = parseLetterSpacing(value);
        if (spacing !== undefined) {
            delta.characterSpacing = spacing;
        }
    },

    // Alias for letter-spacing
    wordSpacing: (value: string, delta: CharacterFormatDelta): void => {
        const spacing = parseLetterSpacing(value);
        if (spacing !== undefined) {
            delta.characterSpacing = spacing;
        }
    },

    // Font variant for small caps
    fontVariant: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'small-caps') {
            delta.smallCaps = true;
        } else if (lowerValue === 'normal') {
            delta.smallCaps = undefined;
        }
    },

    // Visibility (hidden elements)
    visibility: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'hidden') {
            delta.webHidden = true;
        } else if (lowerValue === 'visible') {
            delta.webHidden = undefined;
        }
    },

    // Font weight with more granular support
    fontWeightEnhanced: (value: string, delta: CharacterFormatDelta): void => {
        const lowerValue = value.toLowerCase().trim();
        // Handle numeric weight values
        const weight = parseFloat(lowerValue);
        if (!isNaN(weight)) {
            if (weight >= 700) {
                delta.bold = true;
            } else {
                delta.bold = undefined;
            }
        } else if (lowerValue === 'bold' || lowerValue === 'bolder') {
            delta.bold = true;
        } else if (lowerValue === 'normal' || lowerValue === 'lighter') {
            delta.bold = undefined;
        }
    }
};

/**
 * Parses a CSS font-size value and returns it in points.
 *
 * Supports: px, pt, em, rem, %, and unitless values.
 *
 * @param value - The CSS font-size value (e.g., "16px", "12pt", "1.5em")
 * @returns Font size in points, or undefined if parsing fails
 * @private
 */
export function parseFontSize(value: string): number | undefined {
    if (!value || typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();

    // Pixels (1 px = 0.75 pt)
    if (trimmed.endsWith('px')) {
        const px = parseFloat(trimmed);
        if (!isNaN(px) && px > 0) {
            return Math.round((px * 0.75) * 100) / 100;
        }
    }

    // Points (direct)
    if (trimmed.endsWith('pt')) {
        const pt = parseFloat(trimmed);
        if (!isNaN(pt) && pt > 0) {
            return pt;
        }
    }

    // Em (relative to 16px base, convert to points: 16px * 0.75 = 12pt)
    if (trimmed.endsWith('em')) {
        const em = parseFloat(trimmed);
        if (!isNaN(em) && em > 0) {
            return Math.round((em * 12) * 100) / 100;
        }
    }

    // Rem (same as em, assuming 16px base)
    if (trimmed.endsWith('rem')) {
        const rem = parseFloat(trimmed);
        if (!isNaN(rem) && rem > 0) {
            return Math.round((rem * 12) * 100) / 100;
        }
    }

    // Percentage (relative to 16px base)
    if (trimmed.endsWith('%')) {
        const pct = parseFloat(trimmed);
        if (!isNaN(pct) && pct > 0) {
            return Math.round(((pct / 100) * 12) * 100) / 100;
        }
    }

    // Unitless (assume pixels)
    const unitless = parseFloat(trimmed);
    if (!isNaN(unitless) && unitless > 0) {
        return Math.round((unitless * 0.75) * 100) / 100;
    }

    return undefined;
}

/**
 * Parses a hex (#RGB, #RRGGBB) or rgb(r, g, b) CSS color to an RRGGBB string.
 *
 * @private
 */
function parseCssRgbHex(value: string): string | undefined {
    const trimmed = value.trim();
    const hex = normalizeColorHex(trimmed);
    if (hex !== undefined) {
        return hex;
    }
    const m = trimmed.toLowerCase().match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (!m) {
        return undefined;
    }
    const parts = [m[1], m[2], m[3]].map((n) => Math.min(255, parseInt(n, 10)));
    return parts.map((n) => (n < 16 ? '0' : '') + n.toString(16)).join('').toUpperCase();
}

/**
 * Parses a CSS color value and returns a Color enum value.
 *
 * Supports: hex (#RGB, #RRGGBB), rgb(r, g, b), named colors.
 * Falls back to undefined for unrecognized colors (letting caller handle raw value).
 *
 * @param value - The CSS color value
 * @returns Color enum value, or undefined if parsing fails
 * @private
 */
export function parseColor(value: string): Color | undefined {
    if (!value || typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim();

    // Try colorFromWire first (handles named colors, hex colors, etc.)
    // This function already handles:
    // - Named colors (case-insensitive)
    // - Hex colors (#RRGGBB, #RGB)
    // - 'auto', 'windowtext' -> Black
    // - 'transparent', 'none' -> Transparent
    const color = colorFromWire(trimmed);
    if (color !== undefined) {
        return color;
    }

    // Fallback: try rgb(r, g, b) format and match to known colors
    const lowerTrimmed = trimmed.toLowerCase();
    const rgbMatch = lowerTrimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch) {
        // Try to match common RGB values to Color enum
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);

        if (r === 255 && g === 0 && b === 0) return Color.Red;
        if (r === 0 && g === 128 && b === 0) return Color.Green;
        if (r === 0 && g === 0 && b === 255) return Color.Blue;
        if (r === 255 && g === 255 && b === 0) return Color.Yellow;
        if (r === 0 && g === 0 && b === 0) return Color.Black;
        if (r === 255 && g === 255 && b === 255) return Color.White;
        if (r === 255 && g === 165 && b === 0) return Color.Orange;
        if (r === 128 && g === 0 && b === 128) return Color.Purple;
        if (r === 128 && g === 128 && b === 128) return Color.Gray;
    }

    return undefined;
}

/**
 * Parses a CSS letter-spacing value and returns it in twips.
 *
 * Supports: px, pt, em, normal, and unitless values.
 * Word uses twips (1/20th of a point, 20 twips = 1 pt)
 *
 * @param value - The CSS letter-spacing value (e.g., "2px", "0.1em", "normal")
 * @returns Letter spacing in twips, or undefined if parsing fails
 * @private
 */
export function parseLetterSpacing(value: string): number | undefined {
    if (!value || typeof value !== 'string') {
        return undefined;
    }

    const trimmed = value.trim().toLowerCase();

    // 'normal' means 0 twips
    if (trimmed === 'normal') {
        return 0;
    }

    // Pixels (1 px = 0.75 pt = 15 twips)
    if (trimmed.endsWith('px')) {
        const px = parseFloat(trimmed);
        if (!isNaN(px)) {
            // Convert px to twips: px * 0.75 (pt) * 20 (twips)
            return Math.round(px * 15);
        }
    }

    // Points (1 pt = 20 twips)
    if (trimmed.endsWith('pt')) {
        const pt = parseFloat(trimmed);
        if (!isNaN(pt)) {
            return Math.round(pt * 20);
        }
    }

    // Em (1 em = 12pt = 240 twips)
    if (trimmed.endsWith('em')) {
        const em = parseFloat(trimmed);
        if (!isNaN(em)) {
            return Math.round(em * 240);
        }
    }

    // Unitless (assume pixels)
    const unitless = parseFloat(trimmed);
    if (!isNaN(unitless)) {
        return Math.round(unitless * 15);
    }

    return undefined;
}

/**
 * Applies inline CSS styles merged with class selector styles.
 *
 * Inline styles take precedence over class selector styles.
 *
 * @param inlineStyles - Styles from element's style attribute
 * @param classStyles - Styles from matching class selectors
 * @returns Merged CharacterFormatDelta
 * @private
 */
export function mergeStylesWithPrecedence(
    classStyles: Record<string, string>,
    inlineStyles: Record<string, string>
): CharacterFormatDelta {
    // First apply class selector styles
    const delta = cssToCharacterFormat(classStyles);

    // Then override with inline styles (higher precedence)
    const inlineDelta = cssToCharacterFormat(inlineStyles);

    // Merge with inline styles taking precedence
    return {
        ...delta,
        ...inlineDelta
    };
}
