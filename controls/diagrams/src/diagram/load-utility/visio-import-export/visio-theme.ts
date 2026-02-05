import { VisioTextAlignmentModel, VisioTextDecorationModel } from './visio-annotations';
import { VisioConnector, VisioDecoratorModel } from './visio-connectors';
import { LINE_PATTERN_MAP, TransformKey, VALID_TYPES } from './visio-constants';
import { inchToPoint, isObject } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { VisioTheme } from './visio-models';
import { getTextAlign, getTextDecoration } from './visio-nodes';
import { ConnectorInput, ConnectorResolvedStyle, ConnectorStrokeList, FlatTransform, FormattedColors, ParsedXmlObject, ResolvedAnnotationStyle, Transform, VarStyle, VisioNode } from './visio-types';

// ==================== Configuration ====================

/**
 * Theme module configuration.
 * @interface ThemeConfig
 */
export interface ThemeConfig {
    /** Enable theme caching */
    enableCache?: boolean;
    /** Default fill color */
    defaultFill?: string;
    /** Default stroke color */
    defaultStroke?: string;
    /** Minimum stroke width in points */
    minStrokeWidth?: number;
    /** Maximum stroke width in points */
    maxStrokeWidth?: number;
}

/**
 * Global theme configuration.
 * @type {ThemeConfig}
 * @private
 */
const themeConfig: ThemeConfig = {
    enableCache: true,
    defaultFill: 'white',
    defaultStroke: 'black',
    minStrokeWidth: 0.5,
    maxStrokeWidth: 100
};

// ==================== Constants ====================

/**
 * Default fill color used when no other fill is specified.
 *
 * @type {string}
 */
const defaultFill: string = 'white';

/**
 * Default stroke color used when no other stroke is specified.
 * Exported for use in other modules.
 *
 * @type {string}
 */
export const defaultStroke: string = 'black';

/**
 * Array tracking theme indices during processing.
 * Used for managing theme color selection during shape styling.
 *
 * @type {number[]}
 */
const themeIndex: number[] = [];

/**
 * Theme cache for avoiding repeated lookups.
 * @type {Map<string, any>}
 * @private
 */
const themeCache: Map<string, any> = new Map<string, any>();

/**
 * Conversion factor from EMU (English Metric Units) to inches.
 * OOXML uses EMUs for precise measurement (1 inch = 914400 EMUs).
 *
 * @type {number}
 */
const EMU_PER_INCH: number = 914400;

/**
 * Default minimum stroke width in points.
 * @type {number}
 */
const MIN_STROKE_WIDTH: number = 0.5;

/**
 * Default maximum stroke width in points.
 * @type {number}
 */
const MAX_STROKE_WIDTH: number = 100;

/**
 * Threshold for treating saturation as zero (near-achromatic).
 * @type {number}
 */
const SATURATION_THRESHOLD: number = 0.001;

/**
 * Near-zero difference threshold for RGB components.
 * Used when calculating hue/saturation from near-grey colors.
 * @type {number}
 */
const RGB_DIFF_THRESHOLD: number = 0.01;

/**
 * Default hue value for achromatic colors (grey).
 * @type {number}
 */
const ACHROMATIC_HUE: number = 0;

/**
 * Matrix value offset for standard colors.
 * Standard colors: 100-106 range becomes 0-6.
 * @type {number}
 */
const STANDARD_COLOR_OFFSET: number = 100;

/**
 * Matrix value offset for premium colors.
 * Premium colors: 200-206 range becomes 0-6.
 * @type {number}
 */
const PREMIUM_COLOR_OFFSET: number = 200;

/**
 * Valid matrix range (0-6).
 * @type {number}
 */
const MAX_MATRIX_INDEX: number = 6;

/**
 * Scale factor for hue modifiers in OOXML (60000ths of degree).
 * @type {number}
 */
const HUE_SCALE_FACTOR: number = 60000;

/**
 * Scale factor for other color modifiers in OOXML.
 * @type {number}
 */
const COLOR_MODIFIER_SCALE_FACTOR: number = 100000;

/**
 * Font family mapping for theme-specified fonts to web-safe alternatives.
 * Maps Visio/Office font names to CSS-compatible generic font stacks.
 * Used when applying theme fonts to ensure cross-platform compatibility.
 *
 * @type {Object<string, string>}
 * @example
 * fontMapping['Arial Rounded MT Bold'] = 'Arial, sans-serif'
 */
export const fontMapping: { [key: string]: string } = {
    'Arial Rounded MT Bold': 'Arial, sans-serif',
    'Eras Light ITC': 'Georgia, serif',
    'Franklin Gothic Demi': 'Verdana, sans-serif'
};

// ==================== Validation Utilities ====================

/**
 * Validates and normalizes opacity value.
 *
 * Ensures opacity is in 0-1 range. Returns 1 if invalid.
 *
 * @param {number} opacity - Raw opacity value.
 * @returns {number} Normalized opacity (0-1).
 * @private
 */
function normalizeOpacity(opacity: number | undefined): number {
    if (!Number.isFinite(opacity)) {
        return 1;
    }
    return Math.max(0, Math.min(1, opacity));
}

/**
 * Validates and normalizes stroke width.
 *
 * Ensures stroke width is within acceptable range.
 *
 * @param {number} width - Stroke width in points.
 * @returns {number} Normalized width (between minStrokeWidth and maxStrokeWidth).
 * @private
 */
function normalizeStrokeWidth(width: number | undefined): number {
    if (!Number.isFinite(width) || width === undefined) {
        return 1;
    }
    const min: number = themeConfig.minStrokeWidth;
    const max: number = themeConfig.maxStrokeWidth;
    return Math.max(min, Math.min(max, width));
}

/**
 * Validates if a color value is safe to use.
 *
 * Checks for invalid values and validates hex format.
 *
 * @param {string} color Color to validate.
 * @param {boolean} isAnnotation Color to validate.
 * @returns {boolean} True if valid color.
 * @private
 */
export function isValidColor(color: string, isAnnotation?: boolean): boolean {
    if (typeof color !== 'string') {
        return false;
    }

    const s: string = color.trim();

    // Common invalid values
    if (s === '' || s === 'undefined' || s === 'null') {
        return false;
    }

    // Validate hex colors: #RGB, #RRGGBB, optionally #RRGGBBAA
    if (s.charAt(0) === '#') {
        const len: number = s.length;
        if (len !== 4 && len !== 7 && len !== 9) {
            return false;
        }
        // Safer explicit alternation (no optional quantified group)
        return /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(s);
    }

    // Accept named colors (basic validation)
    const lower: string = s.toLowerCase();
    const validNamedColors: string[] = [
        'black', 'white', 'red', 'green', 'blue', 'yellow',
        'cyan', 'magenta', 'gray', 'grey', 'transparent'
    ];
    if (validNamedColors.indexOf(lower) !== -1) {
        return true;
    }

    // For unknown strings, assume valid (browser will handle)
    if (isAnnotation) {
        return false;
    }

    return true;
}

/**
 * Gets or caches a theme element.
 * Avoids repeated lookups of the same theme values.
 *
 * @param {string} key Cache key.
 * @param {function(): any} getter Function to get value if not cached.
 * @returns {any} Cached or computed value.
 *
 * @private
 */
function getCachedThemeValue(key: string, getter: () => any): any {
    if (!themeConfig.enableCache) {
        return getter();
    }

    if (!themeCache.has(key)) {
        const value: any = getter();
        themeCache.set(key, value);
    }
    return themeCache.get(key);
}

// ==================== Main Functions ====================

/**
 * Extracts and resolves node styling properties (colors, gradients, strokes).
 *
 * This function:
 * 1. Validates node input and applies defaults for groups
 * 2. Applies fill pattern transparency (fillPattern = 0 means transparent)
 * 3. Resolves fill color or gradient from active theme if available
 * 4. Resolves stroke color from active theme if available
 * 5. Applies gradient effects if gradient is enabled
 * 6. Converts units (EMU to inches to points)
 * 7. Maps stroke dash patterns to EJ2 format
 * 8. Applies opacity adjustments
 *
 * For group shapes:
 * - Fill and stroke are transparent by default
 * - No gradients are applied
 *
 * For regular shapes:
 * - Theme application depends on QuickStyle properties
 * - Existing styles take precedence over theme defaults
 * - Opacity is inverted (1 - opacity) for rendering
 *
 * @param {NodeInput} node - The shape node with style and theme properties.
 * @param {ParsingContext} context - Parser context containing theme data.
 * @param {boolean} isGroup - Whether this node is a group shape.
 *
 * @returns {NodeResolvedStyle} Resolved style object with:
 *   - fill: hex color or default 'white'
 *   - strokeColor: hex color or default 'black'
 *   - strokeWidth: points (between minStrokeWidth and maxStrokeWidth)
 *   - opacity: 0-1 range
 *   - strokeDashArray: EJ2 dash pattern or empty string
 *   - gradient: gradient definition if applicable, else undefined
 *
 * @throws {Error} Never throws - returns safe defaults on any error
 *
 * @example
 * const style = getNodeStyle(visioShape, context, false);
 * // Returns: { fill: '#FF0000', strokeColor: '#000000', strokeWidth: 2, ... }
 *
 * @example
 * // Group shape example (always transparent)
 * const groupStyle = getNodeStyle(groupShape, context, true);
 * // Returns: { fill: 'transparent', strokeColor: 'transparent', strokeWidth: 0, ... }
 *
 * @private
 */
export function getNodeStyle(node: NodeInput, context: ParsingContext, isGroup: boolean): NodeResolvedStyle {
    // ==================== Validate Node Input ====================
    if (!node || typeof node !== 'object') {
        return {
            fill: defaultFill,
            strokeColor: defaultStroke,
            strokeWidth: 1,
            opacity: 1,
            strokeDashArray: '',
            gradient: undefined
        };
    }

    // ==================== Initialize Style Properties ====================
    // For groups, use transparent defaults; for regular shapes, use node values
    let fill: string | undefined = isGroup ? 'transparent' : node.style.fillColor;
    let strokeColor: string | undefined = isGroup ? 'transparent' : node.style.strokeColor;
    let strokeDashArray: string | undefined = isGroup ? '' : node.style.strokeDashArray;
    let strokeWidth: number | undefined = isGroup ? 0 : node.style.strokeWidth;
    let isGradientAccent: boolean = false;
    let gradient: ResolvedGradientStyle | undefined;

    // ==================== Apply Fill Pattern Logic ====================
    // FillPattern = 0 => No fill (transparent)
    // FillPattern = 1 => Solid fill
    const fillPattern: number = Number(node.style.fillPattern);
    if (fillPattern === 0) {
        fill = 'transparent';
    }

    // ==================== Check if Active Theme is Applied ====================
    // Determines if the current theme should be used for styling
    const activeTheme: ActiveThemeResult = isActiveThemeApplied((node as VisioNode), context) || { isThemeApplied: false };

    // ==================== Resolve Fill Color or Gradient ====================
    if (!fill) {
        if (activeTheme.isThemeApplied) {
            const range: number = activeTheme.range;
            // Get fill type from theme (solid fill or gradient)
            const themeElement: AccentColorDefinition = getType(activeTheme.currentTheme, range);

            if (themeElement && themeElement.name) {
                // Handle gradient fill
                if (themeElement.name === 'a:gradFill') {
                    const findGradient: VisioLinearGradient = convertVisioGradientToEJ2(themeElement);
                    if (findGradient) {
                        gradient = resolveGradientAccent(findGradient, activeTheme.theme, activeTheme.fillIdxColor);
                        isGradientAccent = true;
                    }
                } else {
                    // Handle solid fill or pattern fill
                    const fillColorElement: AccentColorDefinition = (themeElement.name === 'a:pattFill')
                        ? (themeElement.value as PatternFillValue)['a:bgClr'] as AccentColorDefinition
                        : themeElement;
                    const colorModifiers: ColorInfo = extractColorWithModifiers(fillColorElement as SolidFillValue);
                    if (colorModifiers) {
                        fill = resolveAccentColor(colorModifiers, activeTheme.theme, activeTheme.fillIdxColor);
                    }
                }
            }
        } else {
            // Use default if no theme
            fill = defaultFill;
        }
    }

    // ==================== Resolve Stroke Color ====================
    if (!strokeColor) {
        if (activeTheme.isThemeApplied) {
            const range: number = activeTheme.range;
            // Get stroke type from theme (line style)
            const strokeElement: AccentColorDefinition = getStrokeType(activeTheme.currentTheme, range);

            if (strokeElement && strokeElement.value) {
                const strokeValue: any = strokeElement.value;

                if (strokeValue && strokeValue['$'] && strokeValue['$'].w) {
                    const strokeInInches: number = emuToInches(strokeValue.$.w);
                    strokeWidth = (strokeWidth !== undefined) ? strokeWidth : strokeInInches;
                }

                if (strokeValue && strokeValue['a:prstDash'] && strokeValue['a:prstDash']['$']) {
                    const prstDash: string = strokeValue['a:prstDash'].$.val;
                    if (prstDash) {
                        const themeDashArray: StrokeDashArrayValue = mapPrstDashToStrokeDashArray(prstDash, strokeWidth || 0);
                        strokeDashArray = (strokeDashArray !== undefined) ? strokeDashArray : themeDashArray;
                    }
                }

                if (strokeValue && strokeValue['a:solidFill'] && !strokeColor) {
                    const solidFillData: ColorInfo = extractColorWithModifiers(strokeValue['a:solidFill']);
                    if (solidFillData) {
                        strokeColor = resolveAccentColor(solidFillData, activeTheme.theme, activeTheme.fillIdxColor);
                    }
                }
            }
        } else {
            // No explicit stroke from shape and no theme -> do not invent a border
            const noExplicitStroke: boolean = !isGroup
                && node.style
                && node.style.strokeColor === undefined
                && node.style.strokeWidth === undefined
                && node.style.strokeDashArray === '0';

            if (noExplicitStroke) {
                strokeColor = 'transparent';
                strokeWidth = 0;
                strokeDashArray = '';
            } else {
                // Fallback to default only when stroke is clearly intended
                strokeColor = defaultStroke;
            }
        }
    }

    // ==================== Validate Final Colors ====================
    fill = isValidColor(fill) ? fill : defaultFill;
    // If we intentionally made stroke transparent, keep it; otherwise validate/fallback
    strokeColor = (strokeColor === 'transparent') ? 'transparent' : (isValidColor(strokeColor) ? strokeColor : defaultStroke);

    // ==================== Build and Return Resolved Style ====================
    const finalStrokeWidth: number = normalizeStrokeWidth(inchToPoint(strokeWidth));
    const finalOpacity: number = normalizeOpacity((1 - node.style.opacity) || 1);

    const result: NodeResolvedStyle = {
        fill: fill,
        strokeColor: strokeColor,
        strokeWidth: finalStrokeWidth,
        opacity: finalOpacity,
        strokeDashArray: LINE_PATTERN_MAP[String(strokeDashArray)] || '',
        gradient: isGradientAccent ? setGratient(gradient, undefined) : setGratient(node.style as any, isGroup)
    };

    return result;
}

/**
 * Determines if an active theme is applied to a node.
 *
 * Validates that:
 * - A theme is available and current
 * - The node has theme properties (QuickStyle cells)
 * - The page theme matches the current theme
 *
 * Extracts fill matrix and color indices from Quick Style properties.
 * Returns null if no theme is applicable.
 *
 * @param {VisioNode} node - The shape node to check for theme application.
 * @param {ParsingContext} context - Parser context containing theme data.
 * @returns {ActiveThemeResult} Either { isThemeApplied: false } or complete theme result
 *                              with theme, currentTheme, range, and fillIdxColor.
 *
 * @example
 * const result = isActiveThemeApplied(shape, context);
 * if (result.isThemeApplied) {
 *     console.log(`Theme range: ${result.range}`);
 *     console.log(`Fill hex: ${result.fillIdxColor}`);
 * }
 *
 * @private
 */
export function isActiveThemeApplied(node: VisioNode, context: ParsingContext): ActiveThemeResult {
    // ==================== Validate Inputs ====================
    // if (!node || typeof node !== 'object') {
    //     return null;
    // }

    // if (!context || !context.data) {
    //     return null;
    // }

    // ==================== Extract Theme Data ====================
    const theme: VisioTheme[] = context.data.themes;
    const currentTheme: VisioTheme = context.data.currentTheme;

    // Return null if no themes available or theme index is 0 (no theme)
    if (!(theme.length && currentTheme) || node.ThemeIndex === 0) { return null; }

    // ==================== Validate Theme Match ====================
    const enumIndex: number = Number(currentTheme.schemeEnum);
    const isThemeApplied: boolean = context.data.pages && theme && currentTheme &&
        context.data.currentPage.theme === enumIndex;

    // ==================== Extract QuickStyle Properties ====================
    // These properties determine which theme elements to use
    const fillMatrix: number = extractFillMatrix(node);
    const fillColor: number = extractFillColor(node);
    const valueForColor: number | undefined =
        (typeof fillColor === 'number') ? fillColor : (isThemeApplied ? 100 : undefined);

    // Track color for fallback
    if (valueForColor !== undefined) {
        themeIndex.push(fillColor);
    }

    // ==================== Resolve Color Index ====================
    // Use extracted color or fallback to last known color
    const resolvedColorIndex: number = valueForColor !== undefined ? valueForColor : themeIndex.length > 0 ?
        themeIndex[themeIndex.length - 1] : undefined;

    // Convert to matrix index
    const matrix: number = getMatrix(resolvedColorIndex);

    // Get hex color from variation colors
    const fillIdxColor: string = getHexColorByIndex(matrix, currentTheme.hexColors);

    // ==================== Extract Range (Which Fill/Stroke to Use) ====================
    let range: number;
    if (fillMatrix !== undefined && fillMatrix < 7) {
        // Direct matrix value
        range = getMatrix(fillMatrix);
    } else {
        // Use variant style index
        const index: number = fillMatrix ? getMatrix(fillMatrix) : 0;
        const variant: VarStyle = currentTheme.variant[parseInt(index.toString(), 10)];
        range = node.IsConnector ? 1 : Number(variant.$.fillIdx);
    }

    return {
        isThemeApplied,
        theme,
        currentTheme,
        range,
        fillIdxColor
    };
}

/**
 * Extracts fill color from node Quick Style properties with fallback chain.
 *
 * Prioritized fallback:
 * 1. QuickFillColor - Direct fill color index
 * 2. QuickStyleLineColor - Line color as fallback
 * 3. QuickStyleFontColor - Font color as last resort
 *
 * @param {VisioNode} node - The shape node with Quick Style properties.
 * @returns {number | undefined} The fill color index or undefined if none found.
 *
 * @private
 */
function extractFillColor(node: VisioNode): number | undefined {
    // ==================== Try Primary Fill Color ====================
    if (typeof node.QuickFillColor === 'number') {
        return node.QuickFillColor;
    }

    // ==================== Try Line Color Fallback ====================
    if (typeof node.QuickStyleLineColor === 'number') {
        return node.QuickStyleLineColor;
    }

    // ==================== Try Font Color Fallback ====================
    if (typeof node.QuickStyleFontColor === 'number') {
        return node.QuickStyleFontColor;
    }

    return undefined;
}

/**
 * Extracts fill matrix from node Quick Style properties with fallback chain.
 *
 * Matrix determines which fill style set to use from the theme.
 * Prioritized fallback:
 * 1. QuickFillMatrix - Direct fill matrix index
 * 2. QuickStyleLineMatrix - Line matrix as fallback
 * 3. QuickStyleFontMatrix - Font matrix as last resort
 *
 * @param {VisioNode} node - The shape node with Quick Style properties.
 * @returns {number | undefined} The fill matrix index or undefined if none found.
 *
 * @private
 */
function extractFillMatrix(node: VisioNode): number | undefined {
    // ==================== Try Primary Fill Matrix ====================
    if (typeof node.QuickFillMatrix === 'number') {
        return node.QuickFillMatrix;
    }

    // ==================== Try Line Matrix Fallback ====================
    if (typeof node.QuickStyleLineMatrix === 'number') {
        return node.QuickStyleLineMatrix;
    }

    // ==================== Try Font Matrix Fallback ====================
    if (typeof node.QuickStyleFontMatrix === 'number') {
        return node.QuickStyleFontMatrix;
    }

    return undefined;
}

/**
 * Maps preset dash pattern names to stroke dash array values.
 *
 * Converts OOXML preset dash (prstDash) names to EJ2 stroke dash patterns.
 * Currently supported patterns:
 * - solid: Continuous line
 * - dash/sysDash: Regular dashes
 * - dot/sysDot: Dotted line
 *
 * Other patterns (lgDash, lgDashDot, etc.) default to solid.
 *
 * @param {string} prstDash - The preset dash pattern name from OOXML.
 * @param {number} strokeWidth - The stroke width (used for scaling if needed).
 * @returns {StrokeDashArrayValue} The corresponding stroke dash array value.
 *
 * @example
 * mapPrstDashToStrokeDashArray('dash', 2)   // Returns StrokeDashArrayValue.Dash
 * mapPrstDashToStrokeDashArray('sysDot', 2) // Returns StrokeDashArrayValue.Dot
 *
 * @private
 */
function mapPrstDashToStrokeDashArray(prstDash: string, strokeWidth: number): StrokeDashArrayValue {
    // ==================== Validate Input ====================
    // if (!prstDash || typeof prstDash !== 'string') {
    //     return StrokeDashArrayValue.Solid;
    // }

    // ==================== Match Pattern Name ====================
    switch (prstDash.toLowerCase()) {
    // ==================== Regular Dash Patterns ====================
    // case 'dash':
    case 'sysdash':
        return StrokeDashArrayValue.Dash;

    // ==================== Dotted Line Patterns ====================
    // case 'dot':
    case 'sysdot':
        return StrokeDashArrayValue.Dot;

        // // ==================== Dash-Dot Patterns ====================
        // case 'dashdot':
        // case 'sysdashdot':
        //     return StrokeDashArrayValue.DashDot;

        // // ==================== Large Dash Patterns ====================
        // case 'lgdash':
        //     return StrokeDashArrayValue.LargeDash;

        // case 'lgdashdot':
        //     return StrokeDashArrayValue.LargeDashDot;

        // case 'lgdashdotdot':
        //     return StrokeDashArrayValue.LargeDashDotDot;

    // ==================== Default to Solid ====================
    // ==================== Continuous Solid Line ====================
    default:
        return StrokeDashArrayValue.Solid;
    }
}

/**
 * Converts a 1-based range to a zero-based index, clamped to minimum of 0.
 *
 * Used when accessing arrays indexed from 0 but theme ranges are 1-based.
 *
 * @param {number} range - The 1-based range value to convert.
 * @returns {number} The zero-based index (range - 1), minimum 0.
 *
 * @example
 * toZeroBasedIndex(1)  // Returns 0
 * toZeroBasedIndex(5)  // Returns 4
 * toZeroBasedIndex(0)  // Returns 0 (clamped)
 *
 * @private
 */
export function toZeroBasedIndex(range: number): number {
    // Ensure integer value
    const r: number = Number.isFinite(range) ? Math.floor(range) : 1;
    // Clamp to minimum 0
    return Math.max(0, r - 1);
}

/**
 * Converts a value in EMUs (English Metric Units) to inches.
 *
 * OOXML (including VSDX) uses EMUs for precise measurement:
 * - 1 inch = 914400 EMUs
 * - 1 centimeter = 360000 EMUs
 *
 * This conversion is needed when extracting dimensions from theme/style data.
 *
 * @param {number} emu - The value in EMUs to convert.
 * @returns {number} The equivalent value in inches.
 *
 * @example
 * emuToInches(914400)  // Returns 1.0
 * emuToInches(457200)  // Returns 0.5
 *
 * @private
 */
function emuToInches(emu: number): number {
    if (!Number.isFinite(emu)) {
        return 0;
    }
    const emuValue: number = emu / EMU_PER_INCH;
    return emuValue;
}

/**
 * Retrieves the connector line style for the given theme range.
 *
 * Accesses the connector-specific stroke styles from theme, which defines
 * line width, dash pattern, and color for connectors/edges.
 *
 * @param {VisioTheme} VisioTheme - The current theme object.
 * @param {number} range - The 1-based range index for the fill type.
 * @returns {AccentColorDefinition} The connector line style definition.
 *
 * @private
 */
function connectorType(VisioTheme: VisioTheme, range: number): AccentColorDefinition {
    // ==================== Validate Input ====================
    // if (!VisioTheme || !VisioTheme.connectorStroke) {
    //     return null;
    // }

    // ==================== Convert to Zero-Based Index ====================
    const rangeIndex: number = toZeroBasedIndex(range);

    // ==================== Access Connector Stroke Style ====================
    const accent: AccentColorDefinition = (VisioTheme.connectorStroke as
        ConnectorStrokeList)['a:ln'][parseInt(rangeIndex.toString(), 10)] as unknown as AccentColorDefinition;
    return accent;
}

/**
 * Retrieves the connector font style for the given theme range.
 *
 * Accesses connector-specific font properties like typeface and sizing.
 *
 * @param {VisioTheme} VisioTheme - The current theme object.
 * @param {number} range - The 1-based range index for the font type.
 * @returns {AccentColorDefinition} The connector font style definition.
 *
 * @private
 */
export function getConnectorFontType(VisioTheme: VisioTheme, range: number): AccentColorDefinition {
    // ==================== Validate Input ====================
    // if (!VisioTheme || !VisioTheme.connectorFont) {
    //     return null;
    // }

    // ==================== Convert to Zero-Based Index ====================
    const rangeIndex: number = toZeroBasedIndex(range);

    // ==================== Access Connector Font Style ====================
    const accent: AccentColorDefinition = VisioTheme.connectorFont[parseInt(rangeIndex.toString(), 10)] as unknown as AccentColorDefinition;
    return accent;
}

/**
 * Retrieves the font style for the given theme range.
 *
 * Accesses regular (non-connector) font properties including typeface, bold, italic, etc.
 *
 * @param {VisioTheme} VisioTheme - The current theme object.
 * @param {number} range - The 1-based range index for the font type.
 * @returns {FontSchemeEntry} The font style definition with attributes and color.
 *
 * @private
 */
export function getFontType(VisioTheme: VisioTheme, range: number): FontSchemeEntry {
    // ==================== Validate Input ====================
    // if (!VisioTheme || !VisioTheme.fontStyles) {
    //     return null;
    // }

    // ==================== Convert to Zero-Based Index ====================
    const rangeIndex: number = toZeroBasedIndex(range);

    // ==================== Access Font Style ====================
    const accent: FontSchemeEntry = VisioTheme.fontStyles[parseInt(rangeIndex.toString(), 10)] as FontSchemeEntry;
    return accent;
}

/**
 * Retrieves the fill style for the given theme range.
 *
 * Accesses fill definitions (solid colors or gradients) from the theme.
 *
 * @param {VisioTheme} VisioTheme - The current theme object.
 * @param {number} range - The 1-based range index for the fill type.
 * @returns {AccentColorDefinition} The fill style definition.
 *
 * @private
 */
function getType(VisioTheme: VisioTheme, range: number): AccentColorDefinition {
    // ==================== Validate Input ====================
    // if (!VisioTheme || !VisioTheme.fmtSchemeFill) {
    //     return null;
    // }

    // ==================== Convert to Zero-Based Index ====================
    const rangeIndex: number = toZeroBasedIndex(range);

    // ==================== Access Fill Style ====================
    const cacheKey: string = `fill_${range}_${rangeIndex}`;
    return getCachedThemeValue(cacheKey, () => {
        const accent: AccentColorDefinition = VisioTheme.fmtSchemeFill[parseInt(rangeIndex.toString(), 10)] as AccentColorDefinition;
        return accent;
    });
}

/**
 * Retrieves the stroke/line style for the given theme range.
 *
 * Accesses line width, dash pattern, and color definitions from the theme.
 *
 * @param {VisioTheme} VisioTheme - The current theme object.
 * @param {number} range - The 1-based range index for the stroke type.
 * @returns {AccentColorDefinition} The stroke style definition.
 *
 * @private
 */
function getStrokeType(VisioTheme: VisioTheme, range: number): AccentColorDefinition {
    // ==================== Validate Input ====================
    // if (!VisioTheme || !VisioTheme.fmtSchemeStroke) {
    //     return null;
    // }

    // ==================== Convert to Zero-Based Index ====================
    const rangeIndex: number = toZeroBasedIndex(range);

    // ==================== Access Stroke Style ====================
    const cacheKey: string = `stroke_${range}_${rangeIndex}`;
    return getCachedThemeValue(cacheKey, () => {
        const accent: AccentColorDefinition = VisioTheme.fmtSchemeStroke[parseInt(rangeIndex.toString(), 10)] as AccentColorDefinition;
        return accent;
    });
}

/**
 * Converts style gradient properties to resolved gradient definition for rendering.
 *
 * Handles both linear and radial gradient types. Returns undefined for non-gradient styles
 * or when applied to group shapes.
 *
 * @param {ResolvedGradientStyle} style - The style object with gradient properties.
 * @param {boolean} isGroup - Whether this is a group shape (groups can't have gradients).
 * @returns {ResolvedGradientStyle | undefined} Resolved gradient definition or undefined.
 *
 * @example
 * const gradient = setGratient(nodeStyle, false);
 * if (gradient) {
 *     console.log(gradient.type); // 'Linear' or 'Radial'
 * }
 *
 * @private
 */
function setGratient(style: ResolvedGradientStyle, isGroup: boolean): ResolvedGradientStyle {
    // ==================== Return Undefined for Groups or Missing Style ====================
    if (!style || isGroup) { return undefined; }

    // ==================== Return Undefined if Gradient Not Enabled ====================
    if (!style.isGradientEnabled) {
        return undefined;
    }


    // Linear gradient
    if (style.gradientType === 'Linear') {
        const coords: any = style.gradientCoordinates;
        const x1: number = typeof coords.x1 === 'number' ? coords.x1 : 0;
        const y1: number = typeof coords.y1 === 'number' ? coords.y1 : 0;
        const x2: number = typeof coords.x2 === 'number' ? coords.x2 : 1;
        const y2: number = typeof coords.y2 === 'number' ? coords.y2 : 1;
        const stops: GradientStop[] = Array.isArray(style.gradientStops) ? style.gradientStops : [];

        return {
            type: 'Linear',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stops: stops
        } as any;
    }

    // Radial gradient
    const rcoords: any = style.gradientCoordinates;
    const cx: number = typeof rcoords.cx === 'number' ? rcoords.cx : 0.5;
    const cy: number = typeof rcoords.cy === 'number' ? rcoords.cy : 0.5;
    const fx: number = typeof rcoords.fx === 'number' ? rcoords.fx : 0.5;
    const fy: number = typeof rcoords.fy === 'number' ? rcoords.fy : 0.5;
    const r: number = typeof rcoords.r === 'number' ? rcoords.r : 0.5;
    const rstops: any = Array.isArray(style.gradientStops) ? style.gradientStops : [];

    return {
        type: 'Radial',
        cx: cx,
        cy: cy,
        fx: fx,
        fy: fy,
        r: r,
        stops: rstops
    } as any;
}

/**
 * Type-safe predicate for checking if a value is a finite number.
 *
 * Used to validate numeric inputs before arithmetic operations.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if value is a number and finite, false otherwise.
 *
 * @example
 * isFiniteNumber(5)      // true
 * isFiniteNumber(NaN)    // false
 * isFiniteNumber("5")    // false
 *
 * @private
 */
function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Applies theme-based styling values to connector properties.
 *
 * Similar to getNodeStyle but specialized for connectors/edges.
 * Extracts stroke color, width, and dash pattern from connector theme styles.
 *
 * @param {ConnectorInput | VisioConnector | VisioDecoratorModel} connector - The connector object with style properties.
 * @param {ParsingContext} context - Parser context containing theme data.
 * @returns {ConnectorResolvedStyle} Resolved connector style with stroke properties.
 *
 * @example
 * const style = applyThemeStyles(connector, context);
 * console.log(style.strokeColor);   // Theme color
 * console.log(style.strokeWidth);   // Theme width in points
 *
 * @private
 */
export function applyThemeStyles(connector: ConnectorInput | VisioConnector | VisioDecoratorModel,
                                 context: ParsingContext): ConnectorResolvedStyle {
    // ==================== Validate Input ====================
    // if (!connector || !connector.style) {
    //     return {
    //         strokeColor: defaultStroke,
    //         strokeDashArray: '',
    //         strokeWidth: 1,
    //         opacity: 1
    //     };
    // }

    // ==================== Extract Style Properties ====================
    let { strokeColor, strokeDashArray, strokeWidth } = connector.style as unknown as ConnectorInput;
    const opacity: number = normalizeOpacity(connector.style.opacity);

    // ==================== Check if Active Theme is Applied ====================
    const activeTheme: ActiveThemeResult = isActiveThemeApplied(connector as VisioNode, context) || { isThemeApplied: false };

    // ==================== Apply Theme Styles if Available ====================
    if (activeTheme && activeTheme.isThemeApplied) {
        // ==================== Validate and Normalize Range ====================
        const range: number = isFiniteNumber(activeTheme.range) ? Math.floor(activeTheme.range) : 1;
        // if (range < 1) {
        //     range = 1;
        // }

        // ==================== Extract Connector Line Element ====================
        const LineElement: any = connectorType(activeTheme.currentTheme, range);

        // ==================== Check if LineElement is valid ====================
        if (LineElement && LineElement['$']) {
            // ==================== Extract Width and Convert ====================
            if (LineElement['$'].w) {
                const widthInInches: number = emuToInches(LineElement.$.w);
                strokeWidth = strokeWidth !== undefined ? strokeWidth : widthInInches;
            }

            // ==================== Extract Dash Pattern ====================
            if (LineElement['a:prstDash'] && LineElement['a:prstDash']['$'] && LineElement['a:prstDash']['$'].val) {
                const lineDashArray: StrokeDashArrayValue = mapPrstDashToStrokeDashArray(
                    LineElement['a:prstDash'].$.val,
                    strokeWidth as number || 0
                );
                strokeDashArray = (strokeDashArray !== undefined) ? strokeDashArray : lineDashArray;
            }

            // ==================== Extract Stroke Color ====================
            if (LineElement['a:solidFill'] && !strokeColor) {
                const findFill: ColorInfo = extractColorWithModifiers(LineElement['a:solidFill']);
                if (findFill) {
                    strokeColor = resolveAccentColor(findFill, activeTheme.theme, activeTheme.fillIdxColor);
                }
            }
        }
    }

    // ==================== Ensure Final Values Have Defaults ====================
    const finalStrokeColor: string =
        (strokeColor !== undefined && strokeColor !== null && strokeColor !== '' && isValidColor(strokeColor as string))
            ? strokeColor as string
            : defaultStroke;
    const finalStrokeDashArray: string =
        (strokeDashArray !== undefined && strokeDashArray !== null) ? strokeDashArray as string : '';

    const result: ConnectorResolvedStyle = {
        strokeColor: finalStrokeColor,
        strokeDashArray: finalStrokeDashArray,
        strokeWidth: normalizeStrokeWidth(inchToPoint(strokeWidth as number)),
        opacity: opacity
    };

    return result;
}

/**
 * Converts a theme matrix value to a normalized index (0-6).
 *
 * Theme matrix values in OOXML can be:
 * - 200-206: Premium colors (subtract 200 to get 0-6)
 * - 100-106: Standard colors (subtract 100 to get 0-6)
 * - Direct 0-6: Already normalized
 *
 * Anything out-of-range values default to 0.
 *
 * @param {number} matrix - The matrix value to normalize.
 * @returns {number} The normalized index (0-6).
 *
 * @example
 * getMatrix(201)  // Returns 1 (premium color)
 * getMatrix(102)  // Returns 2 (standard color)
 * getMatrix(3)    // Returns 3 (direct index)
 * getMatrix(999)  // Returns 0 (out of range, default)
 *
 * @private
 */
export function getMatrix(matrix: number): number {
    // ==================== Convert to Number ====================
    let index: number = typeof matrix === 'number'
        ? matrix
        : Number.parseInt(String(matrix || ''), 10);

    // ==================== Validate Input ====================
    // if (!Number.isFinite(index)) {
    //     return 0;
    // }

    // ==================== Handle Premium Color Range (200-206) ====================
    if (index >= PREMIUM_COLOR_OFFSET && index <= PREMIUM_COLOR_OFFSET + MAX_MATRIX_INDEX) {
        index -= PREMIUM_COLOR_OFFSET;
    }
    // ==================== Handle Standard Color Range (100-106) ====================
    else if (index >= STANDARD_COLOR_OFFSET && index <= STANDARD_COLOR_OFFSET + MAX_MATRIX_INDEX) {
        index -= STANDARD_COLOR_OFFSET;
    }

    // ==================== Clamp to Valid Range (0-6) ====================
    // if (index < 0 || index > MAX_MATRIX_INDEX) {
    //     index = 0;
    // }

    return index;
}

/**
 * Gets the hex color from a color array by normalized index.
 *
 * Returns the hex color at the specified index, or defaultFill if not found.
 * Used to look up theme colors from variation color palettes.
 *
 * @param {number} index - The normalized index (0-6) into the hex colors array.
 * @param {string[] | null | undefined} hexColors - Array of hex color values from theme.
 * @returns {string} The hex color at index, or defaultFill if not available.
 *
 * @example
 * getHexColorByIndex(0, ['#FFFFFF', '#000000', ...])  // Returns '#FFFFFF'
 * getHexColorByIndex(9, ['#FFFFFF', '#000000'])       // Returns 'white' (default)
 *
 * @private
 */
export function getHexColorByIndex(
    index: number,
    hexColors: string[] | null | undefined
): string {
    // ==================== Validate Input ====================
    // if (!Number.isFinite(index) || !hexColors || !Array.isArray(hexColors)) {
    //     return defaultFill;
    // }

    if (hexColors[parseInt(index.toString(), 10)]) {
        const color: string = hexColors[parseInt(index.toString(), 10)];
        return isValidColor(color) ? color : defaultFill;
    }
    return defaultFill;
}

/**
 * Normalizes a range value to valid threshold.
 *
 * Ensures range is:
 * - An integer (not fractional)
 * - At least 1 (minimum valid theme range)
 *
 * Used when resolving theme style indices.
 *
 * @param {number} range - The range value to normalize.
 * @returns {number} The normalized range (minimum 1).
 *
 * @example
 * normalizeRange(3.7)  // Returns 3 (floored, still valid)
 * normalizeRange(0)    // Returns 1 (clamped to minimum)
 * normalizeRange(-5)   // Returns 1 (clamped to minimum)
 *
 * @private
 */
export function normalizeRange(range: number): number {
    // ==================== Ensure Integer ====================
    const n: number = Number.isFinite(range) ? Math.floor(range) : 1;
    // ==================== Clamp to Minimum 1 ====================
    return n < 1 ? 1 : n;
}

/**
 * Resolves annotation (text) styling from theme and node properties.
 *
 * This function:
 * 1. Extracts incoming annotation style properties
 * 2. Applies theme font family if available
 * 3. Resolves text color from theme or incoming data
 * 4. Extracts font bold/italic from theme font style
 * 5. Resolves text alignment and decoration
 *
 * Theme colors override incoming colors unless incoming specifies 'Themed'.
 *
 * @param {any} node - The shape node with annotation properties.
 * @param {ParsingContext} context - Parser context containing theme data.
 * @returns {ResolvedAnnotationStyle} Complete text styling with font, color, size, alignment.
 *
 * @example
 * const textStyle = setAnnotationStyle(shape, context);
 * console.log(textStyle.fontFamily);  // Theme font or fallback
 * console.log(textStyle.color);       // Theme or node color
 * console.log(textStyle.bold);        // From theme font style
 *
 * @private
 */
export function setAnnotationStyle(node: any, context: ParsingContext): ResolvedAnnotationStyle {
    // ==================== Validate Input ====================
    // if (!node) {
    //     return {
    //         color: 'Black',
    //         fontFamily: undefined,
    //         fill: undefined,
    //         fontSize: 8 * 1.33,
    //         opacity: 1,
    //         bold: false,
    //         italic: false,
    //         textAlign: 'Center',
    //         textDecoration: 'None'
    //     };
    // }

    // ==================== Extract Incoming Style ====================
    const incoming: IncomingAnnotationStyle =
        node && node.annotation && node.annotation.style ? node.annotation.style : {};

    // ==================== Initialize Color Tracking ====================
    const incomingColor: string | undefined = typeof incoming.color === 'string' ? incoming.color : undefined;
    let resolvedColor: string = incomingColor ? incomingColor : '';
    let resolvedFontFamily: string | undefined = typeof incoming.fontFamily === 'string' ? incoming.fontFamily : undefined;
    let Bold: boolean;

    // ==================== Check if Active Theme is Applied ====================
    const activeTheme: ActiveThemeResult = isActiveThemeApplied(node, context) || { isThemeApplied: false };
    let themeApplied: boolean = false;
    let themeColorApplied: boolean = false;

    // ==================== Apply Theme Properties ====================
    if (activeTheme && activeTheme.isThemeApplied) {
        // ==================== Extract Theme Font Family ====================
        const firstThemeEntry: ThemeEntry = activeTheme.theme[0];
        if (!resolvedFontFamily && firstThemeEntry && typeof firstThemeEntry.fontFamily === 'string') {
            let themeFont: string = firstThemeEntry.fontFamily;
            // Map to web-safe font if available
            if (fontMapping && fontMapping[`${themeFont}`]) {
                themeFont = fontMapping[`${themeFont}`];
            }
            resolvedFontFamily = themeFont;
            themeApplied = true;
        }

        // ==================== Extract Theme Color ====================
        if (!incomingColor || incomingColor === 'Themed') {
            // Get range-specific font entry from theme
            const range: number = normalizeRange(activeTheme.range);
            const fontEntry: FontSchemeEntry = getFontType(activeTheme.currentTheme, range);

            if (fontEntry && fontEntry['vt:color']) {
                const colorNode: ThemeColorElement = fontEntry['vt:color'];
                const colorModifiers: ColorInfo = extractColorWithModifiers(colorNode);
                if (colorModifiers) {
                    const themeColor: string = resolveAccentColor(colorModifiers, activeTheme.theme, activeTheme.fillIdxColor);
                    if (typeof themeColor === 'string' && themeColor !== '' && isValidColor(themeColor)) {
                        resolvedColor = themeColor;
                        themeColorApplied = true;
                    }
                }
            }

            // ==================== Extract Bold from Font Style ====================
            if (fontEntry && fontEntry['$']) {
                const styleRaw: string = fontEntry.$.style;
                const style: number = typeof styleRaw === 'string' ? parseInt(styleRaw, 10) : Number(styleRaw);
                // Bit 0 indicates bold
                Bold = (style & 1) !== 0;
            }
        }
    }

    // ==================== Finalize All Properties ====================
    const finalColor: string =
        (themeColorApplied ? resolvedColor : (incoming.color !== undefined && incoming.color !== null ? incoming.color : 'Black')) as string;

    const finalFontFamily: string | undefined = themeApplied ? resolvedFontFamily : incoming.fontFamily;

    const finalFontSize: number = typeof incoming.fontSize === 'number' ? incoming.fontSize : 8 * 1.33;
    const finalOpacity: number = normalizeOpacity(incoming.opacity);

    const finalBold: boolean = (Bold === true)
        ? !(incoming.TEXT_STYLE_NONE === true) // Override if no-style is active
        : (typeof incoming.bold === 'boolean' ? incoming.bold : false);

    const finalItalic: boolean = typeof incoming.italic === 'boolean' ? incoming.italic : false;

    const finalTextAlign: 'Left' | 'Center' | 'Right' | 'Justify' =
        incoming.textAlign ? getTextAlign(incoming.textAlign) : 'Center';

    const finalTextDecoration: 'None' | 'Underline' | 'Overline' | 'LineThrough' =
        getTextDecoration(incoming.textDecoration);

    const result: ResolvedAnnotationStyle = {
        color: isValidColor(finalColor) ? finalColor : 'Black',
        fontFamily: finalFontFamily,
        fill: incoming.fill,
        fontSize: finalFontSize,
        opacity: finalOpacity,
        bold: finalBold,
        italic: finalItalic,
        textAlign: finalTextAlign,
        textDecoration: finalTextDecoration
    };

    return result;
}

/**
 * Safe hasOwnProperty check for any object.
 *
 * Used to check if an object has a property as its own property (not inherited).
 *
 * @param {object} obj - The object to check.
 * @param {string} prop - The property name to check for.
 * @returns {boolean} True if obj has prop as own property, false otherwise.
 *
 * @example
 * hasOwn({ a: 1 }, 'a')      // true
 * hasOwn({}, 'toString')     // false (inherited)
 * hasOwn(null, 'a')          // false (not an object)
 *
 * @private
 */
export function hasOwn(obj: object, prop: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Resolves a Visio gradient to EJ2 format with endpoint calculation.
 *
 * Converts Visio gradient angle and stops to EJ2 linear gradient with normalized coordinates.
 *
 * @param {VisioLinearGradient} VisioGradient - Visio gradient with angle and stops.
 * @param {VisioTheme[]} theme - Theme array for color resolution.
 * @param {string} baseColor - Base color for placeholder colors.
 * @returns {ResolvedGradientStyle} EJ2-compatible gradient definition.
 *
 * @private
 */
function resolveGradientAccent(VisioGradient: VisioLinearGradient, theme: VisioTheme[], baseColor: string): ResolvedGradientStyle {
    // ==================== Validate Input ====================
    // if (!VisioGradient || !theme || !theme.length) {
    //     return {
    //         gradientStops: [],
    //         isGradientEnabled: false,
    //         gradientCoordinates: { x1: 0, y1: 0, x2: 1, y2: 1 },
    //         gradientType: 'Linear'
    //     };
    // }

    // ==================== Convert Angle to Endpoints ====================
    const { x1, y1, x2, y2 } = angleToLinearEndpoints(VisioGradient.angle);

    // ==================== Process Gradient Stops ====================
    const stops: GradientStop[] = applyOfficeColorModifiers(VisioGradient, theme, baseColor);

    // ==================== Build Gradient Coordinates ====================
    const gradientCoordinates: LinearGradientEndpoints = { x1: x1, y1: y1, x2: x2, y2: y2 };

    // ==================== Build Result ====================
    const style: ResolvedGradientStyle = {
        gradientStops: stops,
        isGradientEnabled: true,
        gradientCoordinates,
        gradientType: 'Linear'
    };
    return style;
}

/**
 * Converts a gradient angle in degrees to linear gradient endpoints.
 *
 * Uses trigonometry to calculate start (x1, y1) and end (x2, y2) points for a linear gradient
 * with the given angle, centered in normalized space (0.5, 0.5).
 *
 * @param {number} thetaDeg - Gradient angle in degrees (0-360).
 * @returns {LinearGradientEndpoints} Start and end points { x1, y1, x2, y2 }.
 *
 * @example
 * angleToLinearEndpoints(0)    // Right pointing
 * angleToLinearEndpoints(90)   // Up pointing
 * angleToLinearEndpoints(180)  // Left pointing
 * angleToLinearEndpoints(270)  // Down pointing
 *
 * @private
 */
function angleToLinearEndpoints(thetaDeg: number): LinearGradientEndpoints {
    // ==================== Validate Input ====================
    // if (!Number.isFinite(thetaDeg)) {
    //     thetaDeg = 0;
    // }

    // ==================== Convert Angle to Radians ====================
    const t: number = (thetaDeg % 360) * Math.PI / 180;

    // ==================== Calculate Direction Vector ====================
    const dx: number = Math.cos(t) * 100;
    const dy: number = Math.sin(t) * 100;

    // ==================== Calculate Endpoints from Center ====================
    const x1: number = 0.5 - dx / 2;
    const y1: number = 0.5 - dy / 2;
    const x2: number = 0.5 + dx / 2;
    const y2: number = 0.5 + dy / 2;

    return { x1, y1, x2, y2 };
}

/**
 * Converts a Visio gradient to EJ2 format.
 *
 * Extracts gradient stops and angle from OOXML gradient element.
 *
 * @param {AccentColorDefinition} gradFillValue - OOXML gradient fill definition.
 * @returns {VisioLinearGradient} Visio gradient format with stops and angle.
 *
 * @private
 */
function convertVisioGradientToEJ2(gradFillValue: AccentColorDefinition): VisioLinearGradient {
    if (!gradFillValue || !gradFillValue.value) {
        return null;
    }

    // ==================== Extract Gradient Stops ====================
    const gradStopLst: GradientStopList = (gradFillValue.value as GradientFillValue)['a:gsLst'];

    // ==================== Extract Gradient Angle ====================
    const linElement: VisioLinearGradientAngle = (gradFillValue.value as any)['a:lin'];

    // ==================== Process Stops ====================
    const stops: ProcessedGradientStop[] = extractGradientStops(gradStopLst);

    // ==================== Extract Angle ====================
    const officeAngle: number = extractGradientAngle(linElement);

    // ==================== Build Gradient ====================
    const gradient: VisioLinearGradient = {
        stops: stops,
        angle: officeAngle
    };

    return gradient;
}

/**
 * Processes gradient stops from OOXML format to EJ2 format.
 *
 * Applies color modifiers (tint, shade, saturation, etc.) to each stop color.
 *
 * @param {VisioLinearGradient} gradStopArray - Visio gradient with stops.
 * @param {VisioTheme[]} theme - Theme for color resolution.
 * @param {string} baseColor - Base/placeholder color.
 * @returns {GradientStop[]} Array of processed gradient stops with offset, color, opacity.
 *
 * @private
 */
function applyOfficeColorModifiers(gradStopArray: VisioLinearGradient,
                                   theme: VisioTheme[], baseColor: string): { offset: number; color: string; opacity: number; }[] {
    // ==================== Validate Input ====================
    const stops: ProcessedGradientStop[] = gradStopArray.stops && Array.isArray(gradStopArray.stops)
        ? gradStopArray.stops
        : [];

    // if (!stops.length) {
    //     return [];
    // }

    // ==================== Define Helpers ====================
    const ensureHash: (hex?: string) => string = (hex?: string) =>
        hex ? (hex.startsWith('#') ? hex : `#${hex}`) : '#000000';

    const toPercent: (pos: number) => number = (pos: number) => {
        let p: number = Number(pos);
        // if (!Number.isFinite(p)) { p = 0; }
        // If user supplies 0�1, convert to percent; if already 0�100, keep it
        if (p <= 1) { p = p * 100; }
        // Clamp to 0�100
        return Math.max(0, Math.min(100, p));
    };

    // ==================== Process Each Stop ====================
    return stops
        .map((s: ProcessedGradientStop) => {
            const colorType: unknown = s.colorType;

            // ==================== Resolve Base Color ====================
            const baseHex: string =
                colorType === 'srgb'
                    ? ensureHash(s.color) : (s.color === 'phClr') ? ensureHash(baseColor)
                        : resolveSchemeColor(s.color, theme[0].fontColor);

            // ==================== Apply Color Transforms ====================
            const color: string = applyTransformsOOXML(baseHex, s.modifiers as Transform);
            const opacity: number = 1;
            const offset: number = toPercent(s.position);

            return { offset, color, opacity };
        });
}

/**
 * Converts a hex color string to an RGB tuple.
 *
 * Handles both 3-digit and 6-digit hex colors by expanding 3-digit to 6-digit.
 *
 * @param {string} hex - Hex color (with or without '#', 3 or 6 digits).
 * @returns {[number, number, number]} RGB values [0-255, 0-255, 0-255].
 *
 * @example
 * hexToRgb('#FFFFFF')  // Returns [255, 255, 255]
 * hexToRgb('000000')   // Returns [0, 0, 0]
 *
 * @private
 */
function hexToRgb(hex: string): [number, number, number] {
    // ==================== Validate Input ====================
    // if (!hex || typeof hex !== 'string') {
    //     return [0, 0, 0];
    // }

    // ==================== Remove Hash and Normalize ====================
    const s: string = hex.replace('#', '');

    // ==================== Expand 3-digit to 6-digit if needed ====================
    const n: string = s.length === 3 ? s.split('').map((c: string) => c + c).join('') : s;

    // ==================== Parse and Extract Components ====================
    const num: number = parseInt(n, 16);
    // if (!Number.isFinite(num)) {
    //     return [0, 0, 0];
    // }
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Converts RGB values to HSL (Hue, Saturation, Lightness).
 *
 * Used for applying color modifiers (tint, shade, saturation) which work better in HSL space.
 *
 * @param {number} r - Red value (0-255).
 * @param {number} g - Green value (0-255).
 * @param {number} b - Blue value (0-255).
 * @returns {[number, number, number]} HSL values [0-1, 0-1, 0-1].
 *
 * @private
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    // ==================== Normalize RGB to 0-1 ====================
    r /= 255; g /= 255; b /= 255;

    // ==================== Find Min and Max ====================
    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);
    let h: number = ACHROMATIC_HUE;
    let s: number = 0;
    const l: number = (max + min) / 2;

    // ==================== Calculate Hue and Saturation ====================
    if (max !== min) {
        const d: number = max - min;

        // ==================== Handle Near-Achromatic Colors ====================
        // If difference is tiny, treat as grey
        if (d < RGB_DIFF_THRESHOLD) {
            s = 0;
            h = ACHROMATIC_HUE;
        } else {
            // ==================== Calculate Saturation ====================
            if (l < 0.5) {
                s = d / (max + min);
            } else {
                s = d / (2 - max - min);
            }

            // ==================== Calculate Hue ====================
            switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
    }

    return [h, s, l];
}
/* eslint-disable valid-jsdoc */
/**
 * Normalizes a color modifier value based on its transform type.
 *
 * Different transform types use different value ranges:
 * - hueOff/hueShift: 0-1 or 0-360000 (60000ths of degree)
 * - Others: 0-1 or 0-100000
 *
 * Converts to normalized 0-1 range.
 *
 * @param {Transform['type']} type - The transform type.
 * @param {number} v - The value to normalize.
 * @returns {number} Normalized value (0-1).
 *
 * @private
 */
/* eslint-enable valid-jsdoc */
function normValByType(type: Transform['type'], v: number): number {
    // if (!Number.isFinite(v)) { return 0; }

    // // ==================== Hue-based transforms ====================
    // if (type === 'hueOff' || type === 'hueShift') {
    //     // If already 0..1, keep; else convert from 0..360000 (60000ths of a degree)
    //     return v > 1 ? clampToUnit(v / HUE_SCALE_FACTOR) : clampToUnit(v);
    // }

    // ==================== Other transforms (tint, shade, satMod, etc.) ====================
    // All others use 0..100000 scale
    return v > 1 ? clampToUnit(v / COLOR_MODIFIER_SCALE_FACTOR) : clampToUnit(v);
}

/**
 * Normalizes and validates color transform definitions.
 *
 * Handles both canonical { type, val } format and flat { propertyName: value } format.
 * Validates transform types against VALID_TYPES.
 *
 * @param {Transform | Transform[]} input - Single or array of transform definitions.
 * @returns {Transform[]} Array of validated transforms with normalized values.
 *
 * @private
 */
function normalizeTransforms(input: Transform): Transform[] {
    // ==================== Handle Empty Input ====================
    if (input == null) { return []; }

    // ==================== Normalize to Array ====================
    const arr: Transform[] = Array.isArray(input) ? input : [input];

    const out: Transform[] = [];

    // ==================== Process Each Transform ====================
    for (const item of arr) {
        if (!item) {
            continue;
        }

        // ==================== Case A: Canonical { type, val } Format ====================
        if ((item as Transform).type && (item as Transform).val != null) {
            const transform: Transform = item as Transform;
            if (VALID_TYPES.has(transform.type)) {
                out.push({ type: transform.type, val: normValByType(transform.type, Number(transform.val)) } as Transform);
            }
            continue;
        }

        // ==================== Case B: Flat Object Format ====================
        // Like { tint: 0.3 } or { shade: 75000, satMod: 85000 }
        const flat: Partial<Record<TransformKey, number>> = item as FlatTransform;
        const keys: (TransformKey)[] = Object.keys(flat) as (keyof FlatTransform)[];

        for (const key of keys) {
            // Skip invalid types
            const raw: number = (flat)[`${key}`];
            const v: number = Number(raw);
            if (!VALID_TYPES.has(key) || raw == null || !Number.isFinite(v)) { continue; }
            out.push({ type: key as Transform['type'], val: normValByType(key, v) } as Transform);
        }
    }

    return out;
}

/**
 * Applies OOXML color transforms (tint, shade, saturation, etc.) to a base hex color.
 *
 * Converts to HSL space, applies modifications, then converts back to RGB/hex.
 * Supports: shade, tint, lumMod, satMod (and more in commented code).
 *
 * @param {string} baseHex - Base hex color (with '#').
 * @param {Transform} transforms - Color modifier transforms to apply.
 * @returns {string} Modified hex color (with '#').
 *
 * @private
 */
function applyTransformsOOXML(baseHex: string, transforms: Transform): string {
    // // ==================== Validate Input ====================
    // if (!baseHex || !isValidColor(baseHex)) {
    //     return '#000000';
    // }

    // ==================== Convert to RGB ====================
    const [r0, g0, b0] = hexToRgb(baseHex);

    // ==================== Convert to HSL ====================
    let [h, s, l] = rgbToHsl(r0, g0, b0);
    h = h * 1; // Ensure h is a number

    // ==================== Normalize Transforms ====================
    const mods: Transform[] = normalizeTransforms(transforms);

    // ==================== Apply Each Transform ====================
    for (let i: number = 0; i < mods.length; i++) {
        const t: Transform = mods[parseInt(i.toString(), 10)];

        switch (t.type) {
        // ==================== Shade: Darken by multiplying lightness ====================
        case 'shade':
            l = clampToUnit(l * t.val);
            break;

        // ==================== Tint: Lighten by moving toward white ====================
        case 'tint':
            l = clampToUnit(l + (1 - l) * t.val);
            break;

        // ==================== Luminance Mod: Multiply lightness ====================
        case 'lumMod':
            l = clampToUnit(l * t.val);
            break;

        // ==================== Saturation Mod: Multiply saturation ====================
        case 'satMod':
            s = clampToUnit(s * t.val);
            break;

        // Other transforms (hueOff, hueShift, satOff, lumOff, alpha, alphaMod, etc.)
        // are reserved for future implementation
        }
    }

    // ==================== Convert Back to RGB ====================
    const [r, g, b] = hslToRgb(h, s, l);

    // ==================== Convert to Hex ====================
    return rgbToHex(r, g, b);
}

/**
 * Converts RGB values to hex color string.
 *
 * @param {number} r - Red value (0-255).
 * @param {number} g - Green value (0-255).
 * @param {number} b - Blue value (0-255).
 * @returns {string} Hex color (e.g., "#FFFFFF").
 *
 * @private
 */
function rgbToHex(r: number, g: number, b: number): string {
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

/**
 * Converts a single byte value (0-255) to a 2-character hex string.
 *
 * @param {number} n - The byte value (0-255).
 * @returns {string} 2-character hex string (e.g., "FF", "00").
 *
 * @private
 */
function toHex2(n: number): string {
    const s: string = n.toString(16);
    return ('0' + s).slice(-2);
}

/**
 * Converts HSL values back to RGB.
 *
 * Uses the inverse algorithm of rgbToHsl for color conversion.
 *
 * @param {number} h - Hue (0-1).
 * @param {number} s - Saturation (0-1).
 * @param {number} l - Lightness (0-1).
 * @returns {[number, number, number]} RGB values [0-255, 0-255, 0-255].
 *
 * @private
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number;
    let g: number;
    let b: number;

    // ==================== Achromatic Case (No Saturation) ====================
    if (s === 0 || s < SATURATION_THRESHOLD) {  // Add threshold check
        r = g = b = l;
    } else {
        // ==================== Ensure Hue is Valid ====================
        if (!Number.isFinite(h) || isNaN(h)) {
            h = ACHROMATIC_HUE; // Default to red hue if undefined
        }
        h = ((h % 1) + 1) % 1;  // Normalize h to 0-1

        // ==================== Helper for Hue-to-RGB Conversion ====================
        const hue2rgb: (p: number, q: number, t: number) => number = (p: number, q: number, t: number) => {
            // ==================== Normalize t to 0-1 Range ====================
            if (t < 0) { t += 1; }
            if (t > 1) { t -= 1; }

            // ==================== Convert Hue Sector to RGB ====================
            if (t < 1 / 6) { return p + (q - p) * 6 * t; }
            if (t < 1 / 2) { return q; }
            if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
            return p;
        };

        // ==================== Calculate Midpoints ====================
        const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p: number = 2 * l - q;

        // ==================== Convert Each Channel ====================
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Clamps a value to the unit range [0, 1].
 *
 * Used when normalizing HSL and other color values.
 *
 * @param {number} x - The value to clamp.
 * @returns {number} The clamped value (0-1).
 *
 * @private
 */
function clampToUnit(x: number): number {
    return Math.max(0, Math.min(1, x));
}

/**
 * Resolves a scheme color name to a hex value from the theme palette.
 *
 * Handles both direct hex values and theme color names like 'lt1', 'dk1', 'accent1', etc.
 *
 * @param {string} name - The color name or hex value.
 * @param {FormattedColors} palette - Theme color palette for scheme color lookup.
 * @returns {string} Hex color (with '#'), or black if not resolved.
 *
 * @private
 */
function resolveSchemeColor(name: string, palette: FormattedColors): string {
    // ==================== Validate Input ====================
    if (!name || typeof name !== 'string') {
        return '#000000';
    }

    // ==================== Check if Direct Hex ====================
    if (/^#?[0-9A-Fa-f]{6}$/.test(name)) {
        return name.startsWith('#') ? name.toUpperCase() : ('#' + name).toUpperCase();
    }

    // ==================== Look Up in Theme Palette ====================
    if (palette && palette[`${name}`]) {
        return palette[`${name}`].toUpperCase();
    }

    return '#000000';
}

/**
 * Extracts gradient angle from OOXML linear gradient element.
 *
 * OOXML stores angles in 60000ths of degrees (0-21600000 for 0-360 degrees).
 *
 * @param {VisioLinearGradientAngle} linElement - The a:lin element with angle.
 * @returns {number} Angle in degrees (0-360), or 90 (vertical) as default.
 *
 * @private
 */
function extractGradientAngle(linElement: VisioLinearGradientAngle): number {
    // if (!linElement || !linElement['$']) {
    //     return 90; // Default vertical
    // }

    // ==================== Extract Angle Value ====================
    const angValue: number = parseInt(linElement['$'].ang, 10);

    // // ==================== Validate ====================
    // if (!Number.isFinite(angValue)) {
    //     return 90;
    // }

    // ==================== Convert from 60000ths of Degree ====================
    const degrees: number = angValue / HUE_SCALE_FACTOR;

    // ==================== Normalize to 0-360 ====================
    return ((degrees % 360) + 360) % 360;
}

/**
 * Extracts gradient stops from an OOXML gradient stop list.
 *
 * Processes position and color information for each stop.
 *
 * @param {GradientStopList} gsLst - The a:gsLst containing a:gs elements.
 * @returns {ProcessedGradientStop[]} Array of processed gradient stops.
 *
 * @private
 */
function extractGradientStops(gsLst: GradientStopList): ProcessedGradientStop[] {
    // ==================== Validate Input ====================
    // if (!gsLst || !gsLst['a:gs']) {
    //     return [];
    // }

    // ==================== Normalize to Array ====================
    const gsArray: FillColorElement[] = Array.isArray(gsLst['a:gs'])
        ? gsLst['a:gs']
        : [gsLst['a:gs']];

    // ==================== Process Each Stop ====================
    return gsArray.map((gs: FillColorElement) => {
        // ==================== Extract Position ====================
        // Position is in percentage * 1000 (0-100000)
        const position: number = parseInt(gs['$'].pos, 10) / 1000; // Convert to 0-100

        // ==================== Extract Color ====================
        const colorInfo: ColorInfo = extractColorWithModifiers(gs as SolidFillValue);

        return {
            position,
            color: (colorInfo && colorInfo.colorValue),
            colorType: (colorInfo && colorInfo.colorType),
            modifiers: (colorInfo && colorInfo.modifiers)
        };
    }) as unknown as ProcessedGradientStop[];
}

/**
 * Resolves an accent color with modifiers applied.
 *
 * Handles scheme colors (theme colors), sRGB colors, and placeholder colors.
 * Applies color modifiers (tint, shade, saturation, etc.) to get final color.
 *
 * @param {ColorInfo} result - Color information with type, value, and modifiers.
 * @param {VisioTheme[]} theme - Theme array for palette lookup.
 * @param {string} baseColor - Base/placeholder color.
 * @returns {string} Resolved and modified hex color.
 *
 * @private
 */
export function resolveAccentColor(result: ColorInfo, theme: VisioTheme[], baseColor: string): string {
    // ==================== Validate Input ====================
    // if (!result || !theme || !theme.length) {
    //     return defaultFill;
    // }

    // ==================== Extract Theme Palette ====================
    const palette: FormattedColors = theme[0].fontColor;
    const { colorType, colorValue, modifiers } = result;

    // ==================== Initialize Color Resolution ====================
    let colored: boolean = false;
    let hex: string;

    // ==================== Determine Base Hex ====================
    const valueLower: string = String(colorValue).toLowerCase();

    if (String(colorType).toLowerCase() === 'srgb' && isHexColor(colorValue)) {
        // Direct SRGB color
        hex = ensureHashHex(colorValue);
        colored = true;
    } else if (valueLower === 'phclr') {
        // Placeholder color
        hex = baseColor && isValidColor(baseColor) ? baseColor : defaultFill;
        colored = true;
    }

    // ==================== Resolve Theme Color if Not Direct ====================
    hex = colored ? hex : resolveThemeColor(palette, valueLower);

    // ==================== Validate Resolved Color ====================
    // if (!hex || !isValidColor(hex)) {
    //     return defaultFill;
    // }

    // ==================== Apply Color Modifiers ====================
    const color: string = applyTransformsOOXML(hex, modifiers as Transform);

    return isValidColor(color) ? color : defaultFill;
}

/**
 * Resolves a theme color role name to its hex value.
 *
 * Looks up color names like 'lt1', 'dk1', 'accent1', etc. in the theme palette.
 *
 * @param {VisioTheme} theme - The theme palette (fontColor map).
 * @param {string} roleName - The color role name.
 * @returns {string | undefined} Hex color or undefined if not found.
 *
 * @private
 */
function resolveThemeColor(theme: VisioTheme, roleName: string): string | undefined {
    // if (!roleName || !theme) {
    //     return undefined;
    // }

    const key: string = roleName.trim();
    const color: string = theme[`${key}`] as string;

    return (color && isValidColor(color)) ? color : undefined;
}

/**
 * Checks if a string is a valid hex color (3, 6, or 8 digits).
 *
 * @param {string} str - The string to validate.
 * @returns {boolean} True if valid hex color format.
 *
 * @private
 */
function isHexColor(str: string): boolean {
    // if (typeof str !== 'string') { return false; }

    const s: string = str.trim();
    return /^[0-9a-fA-F]{3}$/.test(s) ||
        /^[0-9a-fA-F]{6}$/.test(s) ||
        /^[0-9a-fA-F]{8}$/.test(s);
}

/**
 * Ensures a hex color string has a '#' prefix and is uppercase.
 *
 * @param {string} str - The hex color string.
 * @returns {string} Hex color with '#' prefix and uppercase.
 *
 * @private
 */
function ensureHashHex(str: string): string {
    // if (!str || typeof str !== 'string') {
    //     return '#000000';
    // }
    const s: string = str.trim();
    return s.startsWith('#') ? s.toUpperCase() : ('#' + s.toUpperCase());
}

/**
 * Extracts color value and modifiers from a solid fill element.
 *
 * Handles multiple color types:
 * - a:srgbClr: Direct RGB hex color
 * - a:schemeClr: Theme/scheme color name with optional modifiers
 * - a:sysClr: System color name
 * - a:prstClr: Preset color name
 *
 * For scheme colors, extracts modifiers like tint, shade, saturation, etc.
 *
 * @param {SolidFillValue | ThemeColorElement} solidFill - The solid fill element to extract color from.
 * @returns {ColorInfo} Color information with type, value, and modifiers.
 *
 * @private
 */
export function extractColorWithModifiers(solidFill: SolidFillValue | ThemeColorElement): ColorInfo {
    // ==================== Validate Input ====================
    // if (!solidFill) {
    //     return null;
    // }

    // ==================== Get Value Object ====================
    const solidFillValue: SolidFillValue = (solidFill.value || solidFill) as SolidFillValue;
    let colorType: string = '';
    let colorValue: string = '';

    const modifiers: ColorModifiers = {};

    // ==================== Determine Color Type ====================
    if (solidFillValue['a:srgbClr']) {
        colorType = 'srgb';
        colorValue = solidFillValue['a:srgbClr']['$'].val;
    } else if (solidFillValue['a:schemeClr']) {
        colorType = 'scheme';
        colorValue = solidFillValue['a:schemeClr']['$'].val;
    } else if (solidFillValue['a:sysClr']) {
        colorType = 'system';
        colorValue = solidFillValue['a:sysClr']['$'].val;
    } else if (solidFillValue['a:prstClr']) {
        colorType = 'preset';
        colorValue = solidFillValue['a:prstClr']['$'].val;
    } else {
        return null;
    }

    // ==================== Extract Scheme Color Modifiers ====================
    if (solidFillValue['a:schemeClr']) {
        const schemeClr: SchemeColor = solidFillValue['a:schemeClr'];

        // Extract tint (lighten)
        if (schemeClr['a:tint']) {
            modifiers.tint = parseInt(schemeClr['a:tint']['$'].val, 10);
        }

        // Extract shade (darken)
        if (schemeClr['a:shade']) {
            modifiers.shade = parseInt(schemeClr['a:shade']['$'].val, 10);
        }

        // Extract luminance multiply
        if (schemeClr['a:lumMod']) {
            modifiers.lumMod = parseInt(schemeClr['a:lumMod']['$'].val, 10);
        }

        // Extract saturation multiply
        if (schemeClr['a:satMod']) {
            modifiers.satMod = parseInt(schemeClr['a:satMod']['$'].val, 10);
        }

        // // Extract alpha/opacity
        // if (schemeClr['a:alpha']) {
        //     modifiers.alpha = parseInt(schemeClr['a:alpha']['$'].val, 10);
        // }

        // // Extract alpha multiply
        // if (schemeClr['a:alphaMod']) {
        //     modifiers.alphaMod = parseInt(schemeClr['a:alphaMod']['$'].val, 10);
        // }

        // Other modifiers (lumOff, satOff, hueShift, alphaOff) reserved for future implementation
    }

    return {
        colorType,
        colorValue,
        modifiers
    };
}

// ==================== Interface Definitions ====================

/**
 * Input interface for node style extraction.
 * Represents the minimal node data needed for style resolution.
 *
 * @interface NodeInput
 */
interface NodeInput extends VisioNode {
    /** Node styling properties */
    style: NodeStyle;
    /** Theme index (0 = no theme) */
    ThemeIndex: number;
    /** Quick style fill color index */
    QuickFillColor?: number;
    /** Quick style fill matrix */
    QuickFillMatrix?: number;
}

/**
 * Node style properties interface.
 * Represents all styling applied to a shape.
 *
 * @interface NodeStyle
 */
interface NodeStyle {
    /** Fill color (hex or color name) */
    fillColor?: string;
    /** Stroke color (hex or color name) */
    strokeColor?: string;
    /** Stroke dash pattern */
    strokeDashArray?: string;
    /** Stroke width in inches */
    strokeWidth?: number;
    /** Fill opacity (0-1) */
    opacity?: number;
    /** Whether gradient fill is enabled */
    isGradientEnabled?: boolean;
    /** Gradient type (Linear or Radial) */
    gradientType?: GradientType;
    /** Gradient endpoint/center coordinates */
    gradientCoordinates: Partial<GradientCoordinatesLinear & GradientCoordinatesRadial>;
    /** Gradient color stops */
    gradientStops: FillColorElement[];
    /** Fill pattern (0 = no fill/transparent, 1 = solid fill) */
    fillPattern: number;
}

/**
 * Linear gradient coordinates (start and end points).
 *
 * @interface GradientCoordinatesLinear
 */
interface GradientCoordinatesLinear {
    /** Start X (0-1) */
    x1: number;
    /** Start Y (0-1) */
    y1: number;
    /** End X (0-1) */
    x2: number;
    /** End Y (0-1) */
    y2: number;
}

/**
 * Radial gradient coordinates (center, focal point, radius).
 *
 * @interface GradientCoordinatesRadial
 */
interface GradientCoordinatesRadial {
    /** Center X (0-1) */
    cx: number;
    /** Center Y (0-1) */
    cy: number;
    /** Focal point X (0-1) */
    fx: number;
    /** Focal point Y (0-1) */
    fy: number;
    /** Radius (0-1) */
    r: number;
}

/**
 * Gradient type discriminator.
 *
 * @typedef {('Linear' | 'Radial')} GradientType
 */
type GradientType = 'Linear' | 'Radial';

/**
 * Gradient color stop definition.
 *
 * @interface GradientStop
 */
interface GradientStop {
    /** Position in gradient (0-100) */
    offset: number;
    /** Hex color at this stop */
    color: string;
    /** Opacity (0-1) */
    opacity?: number;
}

/**
 * Resolved node style output.
 * All values normalized and converted to EJ2 units.
 *
 * @typedef {Object} NodeResolvedStyle
 */
type NodeResolvedStyle = {
    /** Fill color (hex) */
    fill: string;
    /** Stroke color (hex) */
    strokeColor: string;
    /** Stroke width (pixels) */
    strokeWidth: number;
    /** Opacity (0-1) */
    opacity: number;
    /** Stroke dash array pattern */
    strokeDashArray?: string;
    /** Gradient definition if applicable */
    gradient?: ResolvedGradientStyle;
};

/**
 * Enum for stroke dash array values.
 * Maps to EJ2 predefined dash patterns.
 *
 * @enum {string}
 */
enum StrokeDashArrayValue {
    /** Continuous line (no dashes) */
    Solid = '',
    /** Regular dashes */
    Dash = '2',
    /** Dotted line */
    Dot = '3',
    /** Dash followed by dot */
    DashDot = '4',
    /** Large dashes */
    LargeDash = '7',
    /** Large dash + dot */
    LargeDashDot = '18',
    /** Large dash + dot + dot */
    LargeDashDotDot = '19'
}

/**
 * Incoming annotation style properties.
 * Raw styling data before theme application.
 *
 * @interface IncomingAnnotationStyle
 */
export interface IncomingAnnotationStyle {
    /** Text color */
    color?: string;
    /** Font family name */
    fontFamily?: string;
    /** Background fill */
    fill?: string;
    /** Font size */
    fontSize?: number;
    /** Opacity (0-1) */
    opacity?: number;
    /** Bold flag */
    bold?: boolean;
    /** Italic flag */
    italic?: boolean;
    /** Text alignment */
    textAlign?: VisioTextAlignmentModel;
    /** Text decoration (underline, strikethrough) */
    textDecoration?: VisioTextDecorationModel;
    /** No text style flag */
    TEXT_STYLE_NONE: boolean;
}

/**
 * Theme entry in font styles array.
 *
 * @interface ThemeEntry
 */
export interface ThemeEntry {
    /** Font family name */
    fontFamily?: string;
    /** Extensible properties */
    [key: string]: unknown;
}

/**
 * Font scheme entry from theme.
 * Contains font attributes and color.
 *
 * @interface FontSchemeEntry
 */
interface FontSchemeEntry {
    /** Font attributes (style, typeface, etc.) */
    $?: {
        style: string;
        typeface?: string;
        panose?: string;
        pitchFamily?: string;
        charset?: string;
    };
    /** Theme color for this font */
    'vt:color'?: ThemeColorElement;
}

/**
 * Theme color element interface.
 *
 * @interface ThemeColorElement
 */
export interface ThemeColorElement {
    /** Extensible properties */
    [key: string]: unknown;
}

/**
 * Resolved gradient style for rendering.
 *
 * @interface ResolvedGradientStyle
 */
export interface ResolvedGradientStyle {
    /** Gradient color stops */
    gradientStops: GradientStop[]
    /** Gradient enabled flag */
    isGradientEnabled: boolean;
    /** Gradient coordinate endpoints */
    gradientCoordinates: LinearGradientEndpoints;
    /** Gradient type (always Linear for this interface) */
    gradientType: 'Linear';
}

/**
 * Active theme result discriminated union.
 * Either indicates no theme applied or provides complete theme data.
 *
 * @typedef {Object} ActiveThemeResult
 */
export type ActiveThemeResult =
    | { isThemeApplied: false }
    | {
        isThemeApplied: boolean;
        theme: VisioTheme[];
        currentTheme: VisioTheme;
        range: number;
        fillIdxColor: string;
    }

/**
 * Accent color definition from theme.
 *
 * @interface AccentColorDefinition
 */
export interface AccentColorDefinition {
    /** Attributes */
    $: string;
    /** Value object */
    value: SolidFillValue | PatternFillValue | GradientFillValue | ParsedXmlObject;
    /** Element name */
    name: string;
    /** Order metadata */
    order: VisioOrderItem[];
}

/**
 * Visio order item for element ordering.
 *
 * @interface VisioOrderItem
 */
interface VisioOrderItem {
    /** Element name */
    name: string;
    /** Element value with optional ordering */
    value: VisioColorElement & {
        order?: VisioOrderItem[];
    };
}

/**
 * Visio color element in theme.
 *
 * @interface VisioColorElement
 */
interface VisioColorElement {
    /** Element attributes */
    $: {
        val: string;
    };
    /** Tint modifier */
    'a:tint'?: {
        $: {
            val: string;
        };
    };
    /** Shade modifier */
    'a:shade'?: {
        $: {
            val: string;
        };
    };
}

/**
 * Color modifiers that can be applied to scheme colors.
 *
 * @interface ColorModifiers
 */
interface ColorModifiers {
    /** Lighten modifier */
    tint?: number;
    /** Darken modifier */
    shade?: number;
    /** Luminance multiply */
    lumMod?: number;
    /** Luminance offset */
    lumOff?: number;
    /** Saturation multiply */
    satMod?: number;
    /** Saturation offset */
    satOff?: number;
    /** Hue shift */
    hueShift?: number;
    /** Alpha/opacity value */
    alpha?: number;
    /** Alpha multiply */
    alphaMod?: number;
    /** Alpha offset */
    alphaOff?: number;
}

/**
 * Visio linear gradient definition.
 *
 * @interface VisioLinearGradient
 */
interface VisioLinearGradient {
    /** Gradient angle in degrees */
    angle: number;
    /** Gradient color stops */
    stops: ProcessedGradientStop[]
}

/**
 * Fill color element from theme.
 * Can be solid, pattern, or gradient fill.
 *
 * @interface FillColorElement
 */
interface FillColorElement {
    /** Element attributes (position) */
    $: GradientStopAttributes;
    /** Element name */
    name: 'a:solidFill' | 'a:pattFill' | 'a:gradFill';
    /** Element value (color or gradient data) */
    value: SolidFillValue | PatternFillValue | GradientFillValue;
    /** Order metadata */
    order?: OrderEntry[];
}

/**
 * Solid fill value object.
 * Contains color definition (srgb, scheme, system, or preset).
 *
 * @interface SolidFillValue
 */
interface SolidFillValue {
    /** Recursive value property */
    value: SolidFillValue;
    /** sRGB color */
    'a:srgbClr'?: SrgbColor
    /** Scheme/theme color */
    'a:schemeClr'?: SchemeColor
    /** System color */
    'a:sysClr'?: SystemColor
    /** Preset color */
    'a:prstClr'?: SystemColor
}

/**
 * Pattern fill value object.
 * Contains foreground and background colors.
 *
 * @interface PatternFillValue
 */
interface PatternFillValue {
    /** Foreground color */
    'a:fgClr'?: SolidFillValue;
    /** Background color */
    'a:bgClr'?: SolidFillValue;
}

/**
 * Gradient fill value object.
 * Contains stops and linear gradient angle.
 *
 * @interface GradientFillValue
 */
interface GradientFillValue {
    /** Gradient stop list */
    'a:gsLst': GradientStopList
    /** Linear gradient angle element */
    'a:lin': {
        $: { ang: string; flip?: string };
    };
}

/**
 * Gradient stop list container.
 *
 * @interface GradientStopList
 */
interface GradientStopList {
    /** Array of gradient stop elements */
    'a:gs': FillColorElement[]
}

/**
 * Gradient stop attributes.
 *
 * @interface GradientStopAttributes
 */
interface GradientStopAttributes {
    /** Position in 1/1000ths of percent ("0", "24000", "54000", etc.) */
    pos: string;
}

/**
 * Scheme/theme color with optional modifiers.
 *
 * @interface SchemeColor
 */
interface SchemeColor {
    /** Color attributes (color name like 'accent1') */
    $: SchemeColorAttributes;
    /** Tint (lighten) modifier */
    'a:tint'?: ColorModifier;
    /** Shade (darken) modifier */
    'a:shade'?: ColorModifier;
    /** Luminance multiply modifier */
    'a:lumMod'?: ColorModifier;
    /** Luminance offset modifier */
    'a:lumOff'?: ColorModifier;
    /** Saturation multiply modifier */
    'a:satMod'?: ColorModifier;
    /** Saturation offset modifier */
    'a:satOff'?: ColorModifier;
    /** Hue multiply modifier */
    'a:hueMod'?: ColorModifier;
    /** Hue offset modifier */
    'a:hueOff'?: ColorModifier;
    /** Alpha/opacity modifier */
    'a:alpha'?: ColorModifier;
    /** Alpha multiply modifier */
    'a:alphaMod'?: ColorModifier;
    /** Alpha offset modifier */
    'a:alphaOff'?: ColorModifier;
    /** Hue shift modifier */
    'a:hueShift'?: ColorModifier;
    /** Order metadata */
    order?: OrderEntry[];
}

/**
 * Scheme color attributes.
 *
 * @interface SchemeColorAttributes
 */
interface SchemeColorAttributes {
    /** Color role name like 'phClr', 'lt1', 'dk1', 'accent1'-'accent6' */
    val: string;
}

/**
 * sRGB color definition from OOXML.
 *
 * @interface SrgbColor
 */
export interface SrgbColor {
    /** Hex color value */
    $: {
        val: string
    };
    /** Optional alpha modifier */
    'a:alpha'?: ColorModifier;
    /** Order metadata */
    order?: OrderEntry[];
}

/**
 * System or preset color definition.
 *
 * @interface SystemColor
 */
interface SystemColor {
    /** System/preset color name */
    $: {
        val: string;
    };
    /** Order metadata */
    order?: OrderEntry[];
}

/**
 * Color modifier element (tint, shade, saturation, etc.).
 *
 * @interface ColorModifier
 */
interface ColorModifier {
    /** Modifier value (0-100000) */
    $: {
        val: string;
    };
}

/**
 * Order entry for XML element sequencing metadata.
 *
 * @interface OrderEntry
 */
interface OrderEntry {
    /** Element name */
    name: string;
    /** Element value */
    value: SchemeColor | ColorModifier | ParsedXmlObject;
}

/**
 * Processed gradient stop after extraction.
 *
 * @interface ProcessedGradientStop
 */
interface ProcessedGradientStop {
    /** Stop position (0-100) */
    position: number;
    /** Stop color */
    color: string;
    /** Color type for resolution */
    colorType: ColorInfo;
    /** Color modifiers to apply */
    modifiers: ColorModifiers;
}

/**
 * Complete color information with type, value, and modifiers.
 *
 * @interface ColorInfo
 */
export interface ColorInfo {
    /** Color type (srgb, scheme, system, preset) */
    colorType: string
    /** Color value (hex or color name) */
    colorValue: string;
    /** Modifiers (tint, shade, etc.) */
    modifiers: ColorModifiers;
}

/**
 * Linear gradient endpoint coordinates.
 *
 * @interface LinearGradientEndpoints
 */
interface LinearGradientEndpoints {
    /** Start X (0-1) */
    x1: number;
    /** Start Y (0-1) */
    y1: number;
    /** End X (0-1) */
    x2: number;
    /** End Y (0-1) */
    y2: number;
}

/**
 * Visio linear gradient angle element.
 *
 * @interface VisioLinearGradientAngle
 */
interface VisioLinearGradientAngle {
    /** Angle element attributes */
    $: {
        /** Angle in 60000ths of degrees */
        ang: string;
        /** Scaled flag */
        scaled: string;
    };
}

/**
 * Extension list type alias.
 *
 * @typedef {ThemeExtension[]} ExtLst
 */
export type ExtLst = ThemeExtension[];

/**
 * Theme extension element.
 *
 * @interface ThemeExtension
 */
interface ThemeExtension {
    /** Extension attributes */
    $: {
        uri: string;
    };
    /** Scheme ID extension */
    'vt:schemeID'?: SchemeIDStrict;
    /** Background extension */
    'vt:bkgnd'?: BackgroundStrict;
    /** Variation color scheme list */
    'vt:variationClrSchemeLst'?: VariationColorSchemeListStrict;
}

/**
 * Scheme ID strict definition.
 *
 * @interface SchemeIDStrict
 */
interface SchemeIDStrict {
    $: {
        'xmlns:vt': string;
        schemeEnum: string;
        schemeGUID: string;
    };
}

/**
 * Background element definition.
 *
 * @interface BackgroundStrict
 */
interface BackgroundStrict {
    $: {
        'xmlns:vt': string;
    };
    'a:srgbClr'?: SrgbClrAttr;
}

/**
 * Variation color scheme list definition.
 *
 * @interface VariationColorSchemeListStrict
 */
interface VariationColorSchemeListStrict {
    $: {
        'xmlns:vt': string;
    };
    'vt:variationClrScheme': VariationColorSchemeStrict[];
}

/**
 * Variation color scheme definition.
 * Contains 8 variation colors (varColor0-varColor7).
 *
 * @interface VariationColorSchemeStrict
 */
interface VariationColorSchemeStrict {
    /** Monotone flag */
    $?: {
        monotone: string;
    };
    /** Variation color 0 */
    'vt:varColor0': VariationColors;
    /** Variation color 1 */
    'vt:varColor1': VariationColors;
    /** Variation color 2 */
    'vt:varColor2': VariationColors;
    /** Variation color 3 */
    'vt:varColor3': VariationColors;
    /** Variation color 4 */
    'vt:varColor4': VariationColors;
    /** Variation color 5 */
    'vt:varColor5': VariationColors;
    /** Variation color 6 */
    'vt:varColor6': VariationColors;
    /** Variation color 7 */
    'vt:varColor7': VariationColors;
}

/**
 * Variation color with sRGB value.
 *
 * @interface VariationColors
 */
export interface VariationColors {
    /** sRGB color definition */
    'a:srgbClr': SrgbClrAttr;
}

interface SrgbClrAttr { val: string; }
