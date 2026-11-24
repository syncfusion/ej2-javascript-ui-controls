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

import { Color, colorFromWire, colorToHexWire } from '../document/color';
import { WordDocument } from '../document/document';
import { ParagraphStyle } from '../styles/style-base';
import { ParagraphAlignment } from '../document/alignment';
import { BorderStyle, ParagraphBorderFace, ParagraphBordersFace, ParagraphFormat } from '../document/paragraph-format';
import { UnderlineStyle } from '../document/underline-style';
import { SubSuperScript } from '../document/sub-super-script';
import { CharacterFormat, CharacterFormatSnapshot } from '../document/character-format';

/**
 * Returns `value` unless it is undefined/null, otherwise `fallback`.
 * Replaces the `??` operator, which the project's TypeScript version cannot parse.
 */
function coalesce<T>(value: T | undefined | null, fallback: T): T;
// eslint-disable-next-line no-redeclare
function coalesce<T>(value: T | undefined | null, fallback: T | undefined): T | undefined {
    return value !== undefined && value !== null ? value : fallback;
}

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
export function createStyleIdFromClassName(cssClassName: string): string {
    // If already prefixed with CSS_, preserve it and normalize the rest
    if (cssClassName.startsWith('CSS_')) {
        const suffix: string = cssClassName.substring(4); // Remove "CSS_" prefix
        const normalized: string = suffix
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');
        return `CSS_${normalized}`;
    }

    // Class selector: the style id is the class name itself
    return cssClassName.replace(/[^A-Za-z0-9_-]+/g, '_');
}

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
export function parseColorValue(colorValue: string): string | undefined {
    if (!colorValue || typeof colorValue !== 'string') {
        return undefined;
    }

    colorValue = colorValue.trim().toLowerCase();

    // Named colors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const namedColors: any = {
        red: 'FF0000',
        blue: '0000FF',
        green: '008000',
        black: '000000',
        white: 'FFFFFF',
        yellow: 'FFFF00',
        gray: '808080',
        grey: '808080',
        lightgray: 'D3D3D3',
        darkgray: 'A9A9A9',
        orange: 'FFA500',
        purple: '800080',
        cyan: '00FFFF',
        magenta: 'FF00FF',
        brown: 'A52A2A'
    };

    // eslint-disable-next-line security/detect-object-injection
    if (namedColors[colorValue]) {
        // eslint-disable-next-line security/detect-object-injection
        return namedColors[colorValue];
    }

    // Hex colors
    if (colorValue.startsWith('#')) {
        const hex: string = colorValue.substring(1);
        if (hex.length === 6 || hex.length === 3) {
            try {
                if (hex.length === 3) {
                    // Expand shorthand #RGB to #RRGGBB
                    return (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]).toUpperCase();
                } else {
                    return hex.toUpperCase();
                }
            } catch (e) {
                return undefined;
            }
        }
    }

    // RGB colors rgb(r, g, b)
    const rgbMatch: RegExpMatchArray = colorValue.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
        const r: number = parseInt(rgbMatch[1], 10);
        const g: number = parseInt(rgbMatch[2], 10);
        const b: number = parseInt(rgbMatch[3], 10);
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            let rHex: string = r.toString(16).toUpperCase();
            let gHex: string = g.toString(16).toUpperCase();
            let bHex: string = b.toString(16).toUpperCase();
            rHex = rHex.length === 1 ? '0' + rHex : rHex;
            gHex = gHex.length === 1 ? '0' + gHex : gHex;
            bHex = bHex.length === 1 ? '0' + bHex : bHex;
            return rHex + gHex + bHex;
        }
    }

    return undefined;
}

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
export function parseFontSize(sizeValue: string): number | undefined {
    if (!sizeValue || typeof sizeValue !== 'string') {
        return undefined;
    }

    sizeValue = sizeValue.trim();

    // Points
    if (sizeValue.endsWith('pt')) {
        const pts: number = parseFloat(sizeValue.substring(0, sizeValue.length - 2));
        return !isNaN(pts) && pts > 0 ? pts : undefined;
    }

    // Pixels (convert to points: 1px ≈ 0.75pt)
    if (sizeValue.endsWith('px')) {
        const px: number = parseFloat(sizeValue.substring(0, sizeValue.length - 2));
        if (!isNaN(px) && px > 0) {
            return Math.round(px * 0.75 * 10) / 10;
        }
        return undefined;
    }

    // EM (1em = 12pt default)
    if (sizeValue.endsWith('em')) {
        const em: number = parseFloat(sizeValue.substring(0, sizeValue.length - 2));
        if (!isNaN(em) && em > 0) {
            return Math.round(em * 12 * 10) / 10;
        }
        return undefined;
    }

    // REM (same as em for root)
    if (sizeValue.endsWith('rem')) {
        const rem: number = parseFloat(sizeValue.substring(0, sizeValue.length - 3));
        if (!isNaN(rem) && rem > 0) {
            return Math.round(rem * 12 * 10) / 10;
        }
        return undefined;
    }

    // Percentage (100% = 12pt)
    if (sizeValue.endsWith('%')) {
        const pct: number = parseFloat(sizeValue.substring(0, sizeValue.length - 1));
        if (!isNaN(pct) && pct > 0) {
            return Math.round((pct / 100) * 12 * 10) / 10;
        }
        return undefined;
    }

    // Unitless (treat as pixels)
    const num: number = parseFloat(sizeValue);
    return !isNaN(num) && num > 0 ? Math.round(num * 0.75 * 10) / 10 : undefined;
}

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
export function applyDeclarationsToStyle(
    style: ParagraphStyle,
    declarations: Record<string, string>
): void {
    if (!style || !declarations) {
        return;
    }
    const pFormat: ParagraphFormat = style.paragraphFormat;
    const cFormat: CharacterFormat = style.characterFormat;
    const d: Record<string, string> = {};
    for (const key of Object.keys(declarations)) {
        // eslint-disable-next-line security/detect-object-injection
        const v: string = declarations[key];
        if (typeof v === 'string' && v.trim() !== '') {
            // eslint-disable-next-line security/detect-object-injection
            d[key] = v.trim().toLowerCase();
        }
    }

    applyParagraphDeclarations(pFormat, d);
    // Border and background are already drawn by the paragraph itself; repeating them
    // as run border/shading would render them twice.
    const charDecls: Record<string, string> = { ...d };
    delete charDecls.border;
    delete charDecls.backgroundColor;
    delete charDecls.background;
    applyCharacterDeclarations(cFormat, charDecls, declarations.fontFamily);
}

const BORDER_STYLE_MAP: Record<string, BorderStyle> = {
    none: 'none',
    hidden: 'none',
    solid: 'single',
    dotted: 'dotted',
    dashed: 'dashed',
    double: 'double',
    groove: 'threeDEngrave',
    ridge: 'threeDEmboss',
    inset: 'inset',
    outset: 'outset'
};

interface ParsedBorder {
    style?: BorderStyle;
    width?: number;
    color?: string;
}

export function applyParagraphDeclarations(pFormat: ParagraphFormat, d: Record<string, string>): void {
    // Alignment
    switch (d.textAlign) {
    case 'left':
    case 'start':
        pFormat.horizontalAlignment = ParagraphAlignment.Left;
        break;
    case 'center':
        pFormat.horizontalAlignment = ParagraphAlignment.Center;
        break;
    case 'right':
    case 'end':
        pFormat.horizontalAlignment = ParagraphAlignment.Right;
        break;
    case 'justify':
        pFormat.horizontalAlignment = ParagraphAlignment.Justify;
        break;
    }

    if (d.direction === 'rtl') {
        pFormat.bidi = true;
    } else if (d.direction === 'ltr') {
        pFormat.bidi = false;
    }

    // Background shading
    const bg: string = coalesce(parseCssHex(d.backgroundColor), d.background ? firstHex(d.background) : undefined);
    if (bg !== undefined) {
        pFormat.backColor = bg;
    }

    // Indents and spacing (points)
    const mBox: { top?: number; right?: number; bottom?: number; left?: number; } = parseBox(d.margin);
    const left: number = coalesce(parseLengthPoints(d.marginLeft, true), mBox ? mBox.left : undefined);
    if (left !== undefined) {
        pFormat.leftIndent = left;
    }
    const right: number = coalesce(parseLengthPoints(d.marginRight, true), mBox ? mBox.right : undefined);
    if (right !== undefined) {
        pFormat.rightIndent = right;
    }
    const before: number = coalesce(parseLengthPoints(d.marginTop || d.marginTopPx, false), mBox ? mBox.top : undefined);
    if (before !== undefined) {
        pFormat.beforeSpacing = before;
    }
    const after: number = coalesce(parseLengthPoints(d.marginBottom || d.marginBottomPx, false), mBox ? mBox.bottom : undefined);
    if (after !== undefined) {
        pFormat.afterSpacing = after;
    }
    const indent: number = parseLengthPoints(d.textIndent, true);
    if (indent !== undefined) {
        pFormat.firstLineIndent = indent;
    }

    // Line height
    if (d.lineHeight && d.lineHeight !== 'normal') {
        const lh: string = d.lineHeight;
        if (/^\d*\.?\d+$/.test(lh)) {
            const n: number = parseFloat(lh);
            if (n >= 0 && n <= 100) {
                pFormat.lineSpacingCount = n;
            }
        } else if (lh.endsWith('%')) {
            const n: number = parseFloat(lh) / 100;
            if (!isNaN(n) && n >= 0 && n <= 100) {
                pFormat.lineSpacingCount = n;
            }
        } else {
            const pts: number = parseLengthPoints(lh, false);
            if (pts !== undefined && pts >= 0.7) {
                pFormat.lineSpacingRule = 'exact';
                pFormat.lineSpacing = pts;
            }
        }
    }

    // Pagination
    const breakBefore: string = d.pageBreakBefore || d.breakBefore;
    if (breakBefore === 'always' || breakBefore === 'page') {
        pFormat.pageBreakBefore = true;
    } else if (breakBefore === 'auto' || breakBefore === 'avoid') {
        pFormat.pageBreakBefore = false;
    }
    const breakAfter: string = d.pageBreakAfter || d.breakAfter;
    if (breakAfter === 'always' || breakAfter === 'page') {
        pFormat.pageBreakAfter = true;
    } else if (breakAfter === 'auto') {
        pFormat.pageBreakAfter = false;
    } else if (breakAfter === 'avoid') {
        pFormat.keepFollow = true;
    }
    const breakInside: string = d.pageBreakInside || d.breakInside;
    if (breakInside === 'avoid') {
        pFormat.keepLines = true;
    } else if (breakInside === 'auto') {
        pFormat.keepLines = false;
    }
    const widows: string = d.widows || d.orphans;
    if (widows && /^\d+$/.test(widows)) {
        pFormat.widowControl = parseInt(widows, 10) > 1;
    }

    // Misc flags
    if (d.hyphens === 'none') {
        pFormat.suppressAutoHyphens = true;
    } else if (d.hyphens === 'manual' || d.hyphens === 'auto') {
        pFormat.suppressAutoHyphens = false;
    }
    const wrap: string = d.overflowWrap || d.wordWrap;
    if (wrap === 'break-word' || wrap === 'anywhere') {
        pFormat.wordWrap = true;
    } else if (wrap === 'normal') {
        pFormat.wordWrap = false;
    }
    if (d.writingMode === 'horizontal-tb') {
        pFormat.textDirection = 'lrTb';
    } else if (d.writingMode === 'vertical-rl') {
        pFormat.textDirection = 'tbRl';
    } else if (d.writingMode === 'vertical-lr') {
        pFormat.textDirection = 'tbLrV';
    }

    applyBorderDeclarations(pFormat, d);
}

function applyBorderDeclarations(pFormat: ParagraphFormat, d: Record<string, string>): void {
    const borders: ParagraphBordersFace = pFormat.borders;
    const apply: (edge: ParagraphBorderFace, parsed: ParsedBorder) => void = function (
        edge: ParagraphBorderFace, parsed: ParsedBorder
    ): void {
        if (parsed.style !== undefined) {
            edge.borderType = parsed.style;
        }
        if (parsed.style === 'none') {
            return;
        }
        if (parsed.color !== undefined) {
            edge.color = parsed.color;
        }
        if (parsed.width !== undefined) {
            edge.lineWidth = parsed.width;
        }
    };
    const pBox: { top?: number; right?: number; bottom?: number; left?: number; } = parseBox(d.padding);
    const padKeys: Record<string, number | undefined> = {
        borderTop: coalesce(parseLengthPoints(d.paddingTop, false), pBox ? pBox.top : undefined),
        borderRight: coalesce(parseLengthPoints(d.paddingRight, false), pBox ? pBox.right : undefined),
        borderBottom: coalesce(parseLengthPoints(d.paddingBottom, false), pBox ? pBox.bottom : undefined),
        borderLeft: coalesce(parseLengthPoints(d.paddingLeft, false), pBox ? pBox.left : undefined)
    };

    // Whole-border shorthand and longhands (outer four edges)
    const all: ParsedBorder = d.border ? parseBorderShorthand(d.border) : {};
    if (d.borderStyle && BORDER_STYLE_MAP[d.borderStyle] !== undefined) {
        all.style = BORDER_STYLE_MAP[d.borderStyle];
    }
    if (d.borderColor) {
        all.color = coalesce(parseCssHex(d.borderColor), all.color);
    }
    if (d.borderWidth) {
        all.width = coalesce(parseBorderWidth(d.borderWidth), all.width);
    }
    const edges: Array<[string, ParagraphBorderFace]> = [
        ['borderTop', borders.top],
        ['borderRight', borders.right],
        ['borderBottom', borders.bottom],
        ['borderLeft', borders.left]
    ];
    for (const [key, face] of edges) {
        // eslint-disable-next-line security/detect-object-injection
        const own: ParsedBorder = d[key] ? parseBorderShorthand(d[key]) : {};
        const merged: ParsedBorder = {
            style: coalesce(own.style, all.style),
            color: coalesce(own.color, all.color),
            width: coalesce(own.width, all.width)
        };
        // A width/color without a style should still produce a visible border.
        if (merged.style === undefined && (own.width !== undefined || own.color !== undefined || d.border)) {
            merged.style = 'single';
        }
        apply(face, merged);
        // eslint-disable-next-line security/detect-object-injection
        const pad: number = padKeys[key];
        if (pad !== undefined && merged.style !== undefined && merged.style !== 'none') {
            face.space = Math.min(31, Math.round(pad));
        }
    }
}

function parseBorderWidth(token: string): number | undefined {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token === 'thin') {
        return 0.75;
    }
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token === 'medium') {
        return 2.25;
    }
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (token === 'thick') {
        return 3.75;
    }
    const pts: number = parseLengthPoints(token, false);
    if (pts === undefined) {
        return undefined;
    }
    // w:sz is 1/8 pt, valid range 2..96 (0.25–12 pt)
    return Math.min(12, Math.max(0.25, pts));
}

function parseBorderShorthand(value: string): ParsedBorder {
    const result: ParsedBorder = {};
    const tokens: string[] = value.replace(/\s*,\s*/g, ',').split(/\s+(?![^(]*\))/);
    for (const token of tokens) {
        // eslint-disable-next-line security/detect-object-injection
        if (BORDER_STYLE_MAP[token] !== undefined) {
            // eslint-disable-next-line security/detect-object-injection
            result.style = BORDER_STYLE_MAP[token];
            continue;
        }
        const width: number = parseBorderWidth(token);
        if (width !== undefined) {
            result.width = width;
            continue;
        }
        const color: string = parseCssHex(token);
        if (color !== undefined) {
            result.color = color;
        }
    }
    return result;
}

export function applyCharacterDeclarations(
    cFormat: CharacterFormat,
    d: Record<string, string>,
    rawFontFamily?: string
): void {
    // Font
    if (d.fontFamily) {
        const first: string = (rawFontFamily !== undefined && rawFontFamily !== null ? rawFontFamily : d.fontFamily).split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        if (first) {
            cFormat.fontName = first;
        }
    }
    if (d.fontSize) {
        const size: number = parseFontSize(d.fontSize);
        if (size !== undefined && size <= 1638) {
            cFormat.fontSize = size;
        }
    }
    if (d.fontWeight) {
        const w: string = d.fontWeight;
        if (w === 'bold' || w === 'bolder' || (/^\d+$/.test(w) && parseInt(w, 10) >= 600)) {
            cFormat.bold = true;
        } else if (w === 'normal' || w === 'lighter' || /^\d+$/.test(w)) {
            cFormat.bold = false;
        }
    }
    if (d.fontStyle) {
        if (d.fontStyle === 'italic' || d.fontStyle.startsWith('oblique')) {
            cFormat.italic = true;
        } else if (d.fontStyle === 'normal') {
            cFormat.italic = false;
        }
    }
    if (d.fontVariant) {
        if (d.fontVariant.includes('small-caps')) {
            cFormat.smallCaps = true;
        } else if (d.fontVariant === 'normal') {
            cFormat.smallCaps = false;
        }
    }

    // Color
    setCharacterColor(cFormat, 'textColorValue', parseCssHex(d.color));

    applyTextDecoration(cFormat, d);

    // Run background (w:shd) and border (w:bdr)
    const runBg: string = coalesce(parseCssHex(d.backgroundColor), d.background ? firstHex(d.background) : undefined);
    if (runBg !== undefined) {
        const snap: CharacterFormatSnapshot = cFormat.snapshot();
        snap.shadingValue = { pattern: 'clear', fill: runBg };
        cFormat.hydrate(snap);
    }
    const runBorder: ParsedBorder = d.border ? parseBorderShorthand(d.border) : undefined;
    if (runBorder !== undefined && runBorder.style !== undefined && runBorder.style !== 'none') {
        const snap: CharacterFormatSnapshot = cFormat.snapshot();
        snap.borderValue = {
            style: runBorder.style,
            color: coalesce(runBorder.color, 'auto'),
            size: Math.round(coalesce(runBorder.width, 0.75) * 8),
            space: 0
        };
        cFormat.hydrate(snap);
    }

    // Case
    if (d.textTransform === 'uppercase') {
        cFormat.allCaps = true;
    } else if (d.textTransform === 'none') {
        cFormat.allCaps = false;
        cFormat.smallCaps = false;
    }

    // Spacing and position
    if (d.letterSpacing) {
        const spacing: number = d.letterSpacing === 'normal' ? 0 : parseLengthPoints(d.letterSpacing, true);
        if (spacing !== undefined) {
            cFormat.characterSpacing = spacing;
        }
    }
    if (!d.letterSpacing && d.wordSpacing) {
        const ws: number = parseLengthPoints(d.wordSpacing, true);
        if (ws !== undefined) {
            cFormat.characterSpacing = ws;
        }
    }
    if (d.verticalAlign) {
        const va: string = d.verticalAlign;
        if (va === 'sub' || va === 'subscript') {
            cFormat.subSuperScript = SubSuperScript.SubScript;
        } else if (va === 'super' || va === 'superscript') {
            cFormat.subSuperScript = SubSuperScript.SuperScript;
        } else if (va === 'baseline') {
            cFormat.subSuperScript = SubSuperScript.None;
        } else {
            const raise: number = parseLengthPoints(va, true);
            if (raise !== undefined) {
                cFormat.position = raise;
            }
        }
    }

    // Visibility and effects
    if (d.display === 'none') {
        cFormat.hidden = true;
    }
    if (d.visibility === 'hidden') {
        cFormat.webHidden = true;
    } else if (d.visibility === 'visible') {
        cFormat.webHidden = false;
    }
    if (d.textShadow) {
        cFormat.shadow = d.textShadow !== 'none';
    }
    if (d.textEmphasisStyle) {
        const e: string = d.textEmphasisStyle;
        if (e === 'none') {
            cFormat.emphasisMark = 'none';
        } else if (e.includes('dot')) {
            cFormat.emphasisMark = 'dot';
        } else if (e.includes('circle')) {
            cFormat.emphasisMark = 'circle';
        } else if (e.includes('sesame')) {
            cFormat.emphasisMark = 'comma';
        }
    }
}

function applyTextDecoration(cFormat: CharacterFormat, d: Record<string, string>): void {
    const line: string = d.textDecorationLine || d.textDecoration;
    if (!line) {
        return;
    }
    if (line.split(/\s+/).indexOf('none') !== -1) {
        cFormat.underlineStyle = UnderlineStyle.None;
        cFormat.strikethrough = false;
        cFormat.doubleStrikethrough = false;
        return;
    }
    // Decoration style keyword may sit in the shorthand or in the longhand.
    const styleText: string = d.textDecorationStyle || d.textDecoration || '';
    const hasStyle: (kw: string) => boolean = function (kw: string): boolean {
        return styleText.split(/\s+/).indexOf(kw) !== -1;
    };
    if (line.includes('underline')) {
        if (hasStyle('double')) {
            cFormat.underlineStyle = UnderlineStyle.Double;
        } else if (hasStyle('dotted')) {
            cFormat.underlineStyle = UnderlineStyle.Dotted;
        } else if (hasStyle('dashed')) {
            cFormat.underlineStyle = UnderlineStyle.Dash;
        } else if (hasStyle('wavy')) {
            cFormat.underlineStyle = UnderlineStyle.Wavy;
        } else {
            cFormat.underlineStyle = UnderlineStyle.Single;
        }
        const uc: string = coalesce(parseCssHex(d.textDecorationColor), d.textDecoration ? firstHex(d.textDecoration) : undefined);
        setCharacterColor(cFormat, 'underlineColorValue', uc);
    }
    if (line.includes('line-through')) {
        if (hasStyle('double')) {
            cFormat.doubleStrikethrough = true;
        } else {
            cFormat.strikethrough = true;
        }
    }
}

/**
 * Parses a CSS color to an RRGGBB hex string (named, hex, rgb()).
 *
 * @param {string | undefined} value - The value.
 * @returns {string | undefined} The result of the operation.
 */
export function parseCssHex(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }
    const hex: string = parseColorValue(value);
    if (hex !== undefined) {
        return hex;
    }
    // Remaining CSS color names (pink, teal, ...) resolve via the Color enum.
    const named: Color = /^[a-z]+$/i.test(value.trim()) ? colorFromWire(value.trim()) : undefined;
    if (named === undefined || named === Color.Transparent) {
        return undefined;
    }
    const wire: string = colorToHexWire(named);
    return wire.length > 0 ? wire : undefined;
}

/**
 * Returns the first color token found in a multi-token value (e.g. `background`).
 *
 * @param {string} value - The value.
 * @returns {string | undefined} The result of the operation.
 */
function firstHex(value: string): string | undefined {
    for (const token of value.split(/\s+(?![^(]*\))/)) {
        const hex: string = parseCssHex(token);
        if (hex !== undefined) {
            return hex;
        }
    }
    return undefined;
}

/**
 * Expands a 1-4 value CSS box shorthand (margin/padding) to points.
 *
 * @param {string | undefined} value - The value.
 * @returns {Object} The result of the operation.
 */
function parseBox(value: string | undefined):
{ top?: number; right?: number; bottom?: number; left?: number } | undefined {
    if (!value) {
        return undefined;
    }
    const t: number[] = value.split(/\s+/).map(function (v: string): number {
        return parseLengthPoints(v, true);
    });
    if (t.length === 0 || t.length > 4) {
        return undefined;
    }
    const top: number = t[0];
    const right: number = t.length > 1 ? t[1] : top;
    const bottom: number = t.length > 2 ? t[2] : top;
    const left: number = t.length > 3 ? t[3] : right;
    return { top, right, bottom, left };
}

/**
 * Sets an arbitrary RGB colour on a run format. The public setters only take
 * the {@link Color} enum, so colours outside it are written through the
 * snapshot to keep the exact RGB value.
 *
 * @param {CharacterFormat} cFormat - The c format.
 * @param {string} field - The field.
 * @param {string | undefined} hex - The hex.
 * @returns {void}
 */
function setCharacterColor(
    cFormat: CharacterFormat,
    field: 'textColorValue' | 'underlineColorValue',
    hex: string | undefined
): void {
    if (hex === undefined) {
        return;
    }
    const snap: CharacterFormatSnapshot = cFormat.snapshot();
    // eslint-disable-next-line security/detect-object-injection
    snap[field] = hex;
    if (field === 'textColorValue') {
        snap.textColorTheme = undefined;
    }
    cFormat.hydrate(snap);
}

/**
 * Parses a CSS length to points. Returns undefined when invalid or outside
 * the ±1584 pt range accepted by the format setters.
 *
 * @param {string | undefined} value - The value.
 * @param {boolean} allowNegative - The allow negative.
 * @returns {number | undefined} The result of the operation.
 * @private
 */
function parseLengthPoints(value: string | undefined, allowNegative: boolean): number | undefined {
    if (!value) {
        return undefined;
    }
    const m: RegExpMatchArray = value.trim().toLowerCase().match(/^(-?\d*\.?\d+)(px|pt|in|cm|mm|pc|em|rem)?$/);
    if (!m) {
        return undefined;
    }
    const n: number = parseFloat(m[1]);
    const factors: Record<string, number> = {
        px: 0.75, pt: 1, in: 72, cm: 72 / 2.54, mm: 72 / 25.4, pc: 12, em: 12, rem: 12
    };
    const pts: number = Math.round(n * (m[2] !== undefined ? factors[m[2]] : 0.75) * 20) / 20;
    if (isNaN(pts) || (!allowNegative && pts < 0) || Math.abs(pts) > 1584) {
        return undefined;
    }
    return pts;
}

/**
 * Manages CSS class styles created for a document.
 *
 * Caches created paragraph styles to prevent duplicates.
 * Provides getOrCreate semantics for consistent style references.
 *
 * @private
 */
export class CSSStyleCache {
    private readonly document: WordDocument;
    private readonly styleMap: Map<string, ParagraphStyle> = new Map();

    /**
     * Create a new CSS style cache.
     *
     * @param {WordDocument} document - The WordDocument to create styles in
     * @private
     */
    constructor(document: WordDocument) {
        this.document = document;
    }

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
    getOrCreateStyle(cssClassName: string, declarations: Record<string, string>): ParagraphStyle {
        const styleId: string = createStyleIdFromClassName(cssClassName);

        // Return cached style if exists
        if (this.styleMap.has(styleId)) {
            return this.styleMap.get(styleId)!;
        }

        // Check if style already exists in document.styles
        const existingStyle: ParagraphStyle = this.document.styles.getParagraphStyle(styleId);
        if (existingStyle) {
            this.styleMap.set(styleId, existingStyle);
            return existingStyle;
        }

        // Create new style
        try {
            const style: ParagraphStyle = this.document.styles.addParagraphStyle(styleId);
            applyDeclarationsToStyle(style, declarations);
            this.styleMap.set(styleId, style);
            return style;
        } catch (ex) {
            const error: Error = ex as Error;
            // If error is due to style already existing, retrieve and cache it
            if (error && error.message && error.message.includes('already exists')) {
                const existingStyle: ParagraphStyle = this.document.styles.getParagraphStyle(styleId);
                if (existingStyle) {
                    this.styleMap.set(styleId, existingStyle);
                    return existingStyle;
                }
            }
            console.error(`Error creating paragraph style for class "${cssClassName}":`, error);
            // Fallback: try to get or create a minimal style without formatting
            try {
                const existingOrNew: ParagraphStyle = this.document.styles.getParagraphStyle(styleId);
                if (existingOrNew) {
                    this.styleMap.set(styleId, existingOrNew);
                    return existingOrNew;
                }
                // Last resort: create minimal style
                const style: ParagraphStyle = this.document.styles.addParagraphStyle(styleId);
                this.styleMap.set(styleId, style);
                return style;
            } catch (fallbackError) {
                console.error(`Fallback also failed for class "${cssClassName}":`, fallbackError);
                throw error;
            }
        }
    }

    /**
     * Check if a style has been created for a CSS class.
     *
     * @param {string} cssClassName - The CSS class name
     * @returns {boolean} True if style exists in cache or document
     * @private
     */
    hasStyle(cssClassName: string): boolean {
        const styleId: string = createStyleIdFromClassName(cssClassName);
        return (
            this.styleMap.has(styleId) || this.document.styles.hasStyle(styleId)
        );
    }

    /**
     * Get a previously created style.
     *
     * @param {string} cssClassName - The CSS class name
     * @returns {ParagraphStyle | undefined} The ParagraphStyle or undefined if not created
     * @private
     */
    getStyle(cssClassName: string): ParagraphStyle | undefined {
        const styleId: string = createStyleIdFromClassName(cssClassName);
        if (this.styleMap.has(styleId)) {
            return this.styleMap.get(styleId);
        }
        return this.document.styles.getParagraphStyle(styleId);
    }

    /**
     * Clear all cached styles.
     *
     * @returns {void}
     * @private
     */
    clear(): void {
        this.styleMap.clear();
    }
}
