import { DECORATOR_SHAPE_MAP, DECORATOR_SIZE_MAP, LAYOUT_METRICS, UNIT_CONVERSION } from './visio-constants';
import { isGeometryRowHidden, isGeometrySectionHidden } from './visio-nodes';
import {
    Attributes,
    CellMapValue,
    GeometryRowCoordinates,
    GeometryWithRows,
    GlobalOrigin,
    GradientStop,
    GradientVector,
    GroupTransform,
    ParsedXmlObject,
    PathConfig,
    PathCoordinates,
    PathOptions,
    RadialGradientConfig,
    ScalingFunctions,
    ShapeAttributes,
    VisioCell,
    VisioRow,
    VisioSection,
    VisioShapeNode
} from './visio-types';

/**
 * Core utilities and type guards for Visio import/export.
 * Centralizes common functions used across multiple modules.
 *
 * This module provides:
 * - Collection and array utilities
 * - Numeric parsing and validation
 * - Cell value extraction and mapping
 * - String formatting and conversion
 * - Master shape and grouping detection
 * - Angle and distance conversions
 * - Gradient and decorator processing
 * - Geometry and path generation
 * - Type guards and safe value access
 *
 * @module visio-core
 */

// ============================================================================
// SECTION 1: ARRAY & COLLECTION UTILITIES
// ============================================================================

/**
 * Ensures a value is wrapped in an array for consistent processing.
 * Handles undefined, single values, and arrays uniformly.
 *
 * This utility is essential for handling Visio XML where properties can be
 * either single elements or arrays of elements, providing a unified interface.
 *
 * @template T - The type of elements in the array
 * @param {T | T[] | undefined | null} value - The value to ensure is an array
 * @returns {T[]} An array containing the value(s), or an empty array if value is falsy
 * @example
 * // Single value becomes array
 * ensureArray('test'); // Result: ['test']
 *
 * // Array stays array
 * ensureArray(['a', 'b']); // Result: ['a', 'b']
 *
 * // Falsy values become empty array
 * ensureArray(null); // Result: []
 */
export function ensureArray<T>(value: T | T[] | undefined | null): T[] {
    if (!value) { return []; }
    return Array.isArray(value) ? value : [value];
}

/**
 * Creates a map from an array of cells for efficient O(1) lookup access.
 * Maps cell names to their values, significantly improving performance for
 * repeated cell value lookups compared to linear search through arrays.
 *
 * Special handling for LocPinX and LocPinY cells:
 * - If a formula is available (F attribute), the formula is used as the value
 * - Otherwise, the evaluated value (V attribute) is used
 *
 * @param {VisioCell[]} cells - Array of Visio cells to map
 * @returns {Map<string, CellMapValue>} A map with cell names as keys and cell values as values
 * @example
 * // Map cells for quick lookup
 * const cells = [
 *   { $: { N: 'Width', V: '100' } },
 *   { $: { N: 'Height', V: '50' } }
 * ];
 * const map = createCellMap(cells);
 * map.get('Width'); // Result: '100'
 */
export function createCellMap(cells: VisioCell[]): Map<string, CellMapValue> {
    const map: Map<string, CellMapValue> = new Map<string, CellMapValue>();

    for (const cell of cells) {
        if (cell && cell.$ && cell.$.N) {
            map.set(cell.$.N, cell.$.V);
        }
    }

    return map;
}

/**
 * Safely converts a value that may be a single cell or an array of cells
 * into a lookup map for convenient access.
 *
 * This is a wrapper around createCellMap that normalizes the input to always be
 * an array before creating the map, simplifying client code.
 *
 * @param {VisioCell | VisioCell[]} cells - A single cell or array of cells to map
 * @returns {Map<string, CellMapValue>} A map with cell names as keys and cell values as values
 * @example
 * // Works with both single cell and array
 * mapCellValues(singleCell); // Works
 * mapCellValues(cellArray); // Works
 */
export function mapCellValues(cells: VisioCell | VisioCell[]): Map<string, CellMapValue> {
    const cellArray: VisioCell[] = ensureArray(cells);
    return createCellMap(cellArray);
}

/**
 * Builds a cell map from a Visio shape node.
 * Converts the shape's Cell elements into a key-value map for easier lookup.
 *
 * @param {VisioShapeNode} node - Shape node containing Cell elements
 * @returns {Map<string, CellMapValue>} Map of cell names to values
 */
export function getCellMap(node: VisioShapeNode): Map<string, CellMapValue> {
    const cells: VisioCell[] = node && (node as any).Cell ? ensureArray((node as any).Cell) : [];
    return mapCellValues(cells);
}

/**
 * Merges two cell maps, overlaying instance values on top of master defaults.
 * Ensures that page-level overrides take precedence over master definitions.
 *
 * @param {Map<string, CellMapValue>} masterMap - Cell map from master shape
 * @param {Map<string, CellMapValue>} instMap - Cell map from instance shape
 * @returns {Map<string, CellMapValue>} Combined cell map with overrides applied
 */
export function mergeCellMaps(
    masterMap: Map<string, CellMapValue>,
    instMap: Map<string, CellMapValue>
): Map<string, CellMapValue> {
    const out: Map<string, CellMapValue> = new Map<string, CellMapValue>();
    // start from master defaults
    if (masterMap) {
        masterMap.forEach(function (v: any, k: string): void {
            out.set(k, v);
        });
    }
    // overlay with page overrides
    if (instMap) {
        instMap.forEach(function (v: any, k: string): void {
            out.set(k, v);
        });
    }
    return out;
}

/**
 * Safely retrieves a string attribute from an attributes object.
 * Returns an empty string if the key is missing or value is null/undefined.
 *
 * @param {object} attrs - Attributes object
 * @param {string} key - Attribute key to retrieve
 * @returns {string} Attribute value as string, or empty string
 */
export function getAttrString(
    attrs: Record<string, unknown>,
    key: string
): string {
    if (!attrs || typeof attrs !== 'object') {
        return '';
    }

    const desc: PropertyDescriptor | undefined =
        Object.getOwnPropertyDescriptor(attrs, key);

    const value: unknown = desc ? desc.value : undefined;
    return value == null ? '' : String(value);
}

/**
 * Trims a string value and returns it, or empty string if falsy.
 * Ensures no null/undefined values propagate.
 *
 * @param {string} value - Input string to trim
 * @returns {string} Trimmed string or empty string
 */
export function getTrimmedOrEmpty(value: string): string {
    if (!value) { return ''; }
    const t: string = String(value).trim();
    return t.length > 0 ? t : '';
}

// ============================================================================
// SECTION 2: NUMERIC PARSING UTILITIES
// ============================================================================

/**
 * Safely parses a numeric cell value with fallback to a default value.
 * Handles undefined, null, non-numeric strings, and NaN values gracefully.
 *
 * This utility prevents parsing errors and ensures a numeric value is always returned,
 * making it safe to use in calculations without additional null/undefined checks.
 *
 * @param {string | undefined} value - The string value to parse as a number
 * @param {number} defaultValue - The value to return if parsing fails (default: 0)
 * @returns {number} The parsed number if valid, otherwise the default value
 * @example
 * // Valid number
 * parseNumberCell('42.5'); // Result: 42.5
 *
 * // Invalid input returns default
 * parseNumberCell('abc', 10); // Result: 10
 *
 * // Undefined returns default
 * parseNumberCell(undefined, 50); // Result: 50
 */
export function parseNumberCell(value: string | undefined, defaultValue: number = 0): number {
    if (value === undefined || value === null) {
        return defaultValue;
    }

    const num: number = parseFloat(String(value));
    return Number.isFinite(num) ? num : defaultValue;
}

/**
 * Retrieves a numeric value from a map with a fallback.
 * Safely converts the stored value to a number or returns the fallback.
 *
 * @param {Map<string, any>} map - Map containing key-value pairs
 * @param {string} key - Key to look up in the map
 * @param {number} fallback - Value to return if lookup fails or is not numeric
 * @returns {number} Parsed number or fallback
 */
export function getNumberFromCellMap(map: Map<string, any>, key: string, fallback: number): number {
    if (!map) { return fallback; }
    const value: any = map.get(key);
    if (value === undefined || value === null || value === '') { return fallback; }
    const n: number = Number(value);
    return isNaN(n) ? fallback : n;
}

/**
 * Converts a value to boolean with flexible input handling.
 * Recognizes multiple false representations and validates Visio's boolean cell format.
 *
 * Visio represents booleans in cells as:
 * - '1' or true for true values
 * - '0' or false for false values
 *
 * This function handles all these cases plus common JavaScript boolean conversions.
 *
 * @param {string | undefined} value - The value to convert to boolean
 * @param {boolean} defaultValue - The fallback if value is null/undefined (default: false)
 * @returns {boolean} Boolean representation of the value
 * @example
 * // Visio format
 * toBoolean('1'); // Result: true
 * toBoolean('0'); // Result: false
 *
 * // String format
 * toBoolean('true'); // Result: true
 * toBoolean('false'); // Result: false
 *
 * // Numeric format
 * toBoolean(1); // Result: true
 * toBoolean(0); // Result: false
 *
 * // Undefined uses default
 * toBoolean(undefined, true); // Result: true
 */
export function toBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    if (value === undefined || value === null) { return defaultValue; }
    if (typeof value === 'boolean') { return value; }
    if (typeof value === 'number') { return value !== 0; }
    if (typeof value === 'string') { return value !== '0' && value.toLowerCase() !== 'false' && value.length > 0; }
    return defaultValue;
}

// ============================================================================
// SECTION 3: CELL VALUE EXTRACTION
// ============================================================================

/**
 * Gets a string value from a cell map with optional default.
 * Safely extracts string values from the cell lookup map.
 *
 * @param {Map<string, CellMapValue>} cellMap - Map of cell names to values
 * @param {string} key - Cell name to retrieve
 * @param {string} defaultValue - Default string value if key not found (default: '')
 * @returns {string} String value or default
 * @example
 * // Get existing value
 * getCellMapStringValue(cellMap, 'Name', 'Unknown');
 * // Result: cell value or 'Unknown'
 */
export function getCellMapStringValue(
    cellMap: Map<string, CellMapValue>,
    key: string,
    defaultValue: string = ''
): string {
    const value: CellMapValue | undefined = cellMap.get(key);
    return value !== undefined && value !== null ? String(value) : defaultValue;
}

/**
 * Gets a numeric value from a cell map with optional default.
 * Safely extracts and parses numeric values from the cell lookup map.
 *
 * @param {Map<string, CellMapValue>} cellMap - Map of cell names to values
 * @param {string} key - Cell name to retrieve
 * @param {number} defaultValue - Default numeric value if key not found (default: 0)
 * @returns {number} Parsed number or default
 * @example
 * // Get numeric value
 * getCellMapNumericValue(cellMap, 'Width', 100);
 * // Result: parsed width or 100
 */
export function getCellMapNumericValue(
    cellMap: Map<string, CellMapValue>,
    key: string,
    defaultValue: number = 0
): number {
    const value: string = getCellMapStringValue(cellMap, key, '');
    return value !== '' ? parseNumberCell(value, defaultValue) : defaultValue;
}

/**
 * Gets a boolean value from a cell map with optional default.
 * Safely extracts boolean values from the cell lookup map.
 * Recognizes Visio's '1' for true and '0' for false conventions.
 *
 * @param {Map<string, CellMapValue>} cellMap - Map of cell names to values
 * @param {string} key - Cell name to retrieve
 * @param {boolean} defaultValue - Default boolean value if key not found (default: false)
 * @returns {boolean} Boolean value or default
 * @remarks
 * Visio represents booleans as '1' (true) and '0' (false) in cell values.
 * This function normalizes those values to JavaScript booleans.
 *
 * @example
 * // Get boolean value
 * getCellMapBooleanValue(cellMap, 'Visible', true);
 * // Result: true or false based on cell value
 */
export function getCellMapBooleanValue(
    cellMap: Map<string, CellMapValue>,
    key: string,
    defaultValue: boolean = false
): boolean {
    const value: CellMapValue | undefined = cellMap.get(key);
    if (value === undefined || value === null) { return defaultValue; }
    // Visio standard for boolean cells is typically '1' for true and '0' for false.
    return String(value) === '1' || String(value).toLowerCase() === 'true';
}

// ============================================================================
// SECTION 4: CELL SEARCH & EXTRACTION
// ============================================================================

/**
 * Finds a cell by name in an array and returns its evaluated value.
 * Linear search through cell array to locate and extract a specific cell value.
 *
 * This is useful for one-time cell lookups where creating a full map is unnecessary.
 * For multiple lookups, use createCellMap instead for better performance.
 *
 * @param {VisioCell[]} cells - Array of cells to search
 * @param {string} name - Cell name to find
 * @returns {string | undefined} Cell value as a string, or undefined if not found
 * @example
 * // Find specific cell value
 * const width = findCellValue(cells, 'Width');
 * // Result: '100' or undefined
 */
export function findCellValue(cells: VisioCell[], name: string): string | undefined {
    const cell: VisioCell | undefined = cells.find((c: VisioCell) => c && c.$ && c.$.N === name);
    return (cell && cell.$ && cell.$.V !== undefined && cell.$.V !== null) ? String(cell.$.V) : undefined;
}

// ============================================================================
// SECTION 5: STRING & FORMATTING UTILITIES
// ============================================================================

/**
 * Converts a string from kebab-case or snake_case to lowerCamelCase.
 * Used extensively for converting Visio property names (e.g., 'Lock-Move-X')
 * to JavaScript naming conventions (e.g., 'lockMoveX').
 *
 * This function:
 * - Splits on hyphens (-) and underscores (_)
 * - Keeps first part lowercase
 * - Capitalizes first letter of subsequent parts
 * - Joins without separators
 *
 * @param {string} key - Property name to convert
 * @returns {string} lowerCamelCase version of the string
 * @example
 * // Convert Visio property names
 * toCamelCase('Lock-Move-X'); // Result: 'lockMoveX'
 * toCamelCase('Shape_Route_Style'); // Result: 'shapeRouteStyle'
 * toCamelCase('Width'); // Result: 'width'
 */
export function toCamelCase(key: string): string {
    if (!key || typeof key !== 'string') { return ''; }

    return key
        .split(/[-_]/)
        .map((part: string, index: number) => {
            if (part.length === 0) { return ''; }
            if (index === 0) { return part.charAt(0).toLowerCase() + part.slice(1); }
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('');
}

/**
 * Formats a coordinate value to a specified number of decimal places.
 * Rounds values to improve readability and reduces floating-point precision issues.
 *
 * This is commonly used for SVG path data and coordinate output where excessive
 * decimal places are unnecessary and increase file size.
 *
 * @param {number | null | undefined} value - Coordinate value to format
 * @param {number} precision - Number of decimal places (default: 2)
 * @returns {number | undefined} Formatted coordinate, or undefined if input is falsy
 * @example
 * // Format coordinate to 2 decimal places
 * formatCoordinate(42.123456); // Result: 42.12
 *
 * // Format with custom precision
 * formatCoordinate(3.14159, 4); // Result: 3.1416
 *
 * // Null/undefined returns undefined
 * formatCoordinate(null); // Result: undefined
 */
export function formatCoordinate(
    value: number | null | undefined,
    precision: number = 2
): number | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }

    return Number(value.toFixed(precision));
}

// ============================================================================
// SECTION 6: MASTER & SHAPE UTILITIES
// ============================================================================

/**
 * Checks if a shape is a group shape based on its `Type` attribute.
 * Group shapes contain other shapes and have special handling for positioning
 * and sizing calculations.
 *
 * @param {unknown} shape - The shape node to check
 * @returns {boolean} True if the shape is a group, false otherwise
 * @example
 * // Check if shape is a group
 * if (isGroupShape(shape)) {
 *   // Handle group-specific logic
 * }
 */
export function isGroupShape(shape: unknown): boolean {
    if (!shape || typeof shape !== 'object' || !('$' in shape)) { return false; }
    const attrs: ShapeAttributes | undefined = ((shape as ParsedXmlObject).$ as ShapeAttributes) || undefined;
    return attrs && typeof attrs === 'object' && 'Type' in attrs && String((attrs as any).Type).toLowerCase() === 'group';
}

/**
 * Applies a parent group's transform to a child cell map.
 * Handles flips, rotation, and pivot translation to convert
 * child pin coordinates into page coordinates.
 *
 * @param {Map<string, any>} mergedMap - Original cell map of the child shape
 * @param {GroupTransform} parentTx - Parent group transform details
 * @returns {Map<string, any>} New cell map with transformed PinX/PinY
 */
export function applyParentTransformToCellMap(
    mergedMap: Map<string, any>,
    parentTx: GroupTransform
): Map<string, any> {
    // If no parent transform, return original map
    if (!parentTx) { return mergedMap; }

    const out: Map<string, any> = new Map<string, any>();
    mergedMap.forEach(function (v: any, k: string): void {
        out.set(k, v);
    });

    const childPinX: number = getNumberFromCellMap(mergedMap, 'PinX', 0);
    const childPinY: number = getNumberFromCellMap(mergedMap, 'PinY', 0);

    // Convert child pin to be relative to parent's LocPin (pivot)
    let relX: number = childPinX - parentTx.locPinX;
    let relY: number = childPinY - parentTx.locPinY;

    // Apply flips (Visio group flips mirror children around group pivot)
    if (parentTx.flipX && parentTx.flipX !== 0) { relX = -relX; }
    if (parentTx.flipY && parentTx.flipY !== 0) { relY = -relY; }

    // Apply rotation around parent pivot
    const angle: number = parentTx.angle;
    if (angle && angle !== 0) {
        const cosA: number = Math.cos(angle);
        const sinA: number = Math.sin(angle);
        const rx: number = (relX * cosA) - (relY * sinA);
        const ry: number = (relX * sinA) + (relY * cosA);
        relX = rx;
        relY = ry;
    }

    // Convert back to absolute pin in page coordinates (inches)
    const absPinX: number = parentTx.pinX + relX;
    const absPinY: number = parentTx.pinY + relY;

    out.set('PinX', String(absPinX));
    out.set('PinY', String(absPinY));

    return out;
}

/**
 * Gets shape visibility status from its geometry section.
 * Checks for a 'NoShow' cell with value '1' which indicates hidden shapes.
 *
 * Visibility is stored in the Geometry section of shapes, and this function
 * searches both direct cells and row cells for the visibility flag.
 *
 * @param {VisioSection | VisioSection[] | undefined} sections - The Visio section(s) to check for visibility settings
 * @returns {boolean} True if the shape is visible (no 'NoShow' cell with value '1'), false if hidden
 * @remarks
 * Algorithm:
 * 1. Return true if no sections provided (assume visible by default)
 * 2. Find the Geometry section
 * 3. Search both direct cells and cells within rows
 * 4. Look for 'NoShow' cell with value '1'
 * 5. Return false if found (shape is hidden), true otherwise
 *
 * @example
 * // Check shape visibility
 * const isVisible = getVisibility(shape.Section);
 * if (!isVisible) {
 *   // Shape is hidden
 * }
 */
export function getVisibility(sections: VisioSection | VisioSection[] | undefined): boolean {
    if (!sections) { return true; }

    // Normalize sections to array
    const sectionArray: VisioSection[] = ensureArray(sections);

    // Find Geometry section which contains visibility properties
    const geometrySection: VisioSection = sectionArray.find((s: VisioSection) => s && s.$ && s.$.N === 'Geometry');
    if (!geometrySection) { return true; }

    // Check direct cells in geometry section
    if (geometrySection.Cell) {
        const cells: VisioCell[] = ensureArray(geometrySection.Cell);
        for (const cell of cells) {
            if (cell && cell.$ && cell.$.N === 'NoShow' && cell.$.V === '1') { return false; }
        }
    }

    // Check cells within rows of geometry section
    if (geometrySection.Row) {
        const rows: VisioRow[] = ensureArray(geometrySection.Row);
        for (const row of rows) {
            if (row && row.Cell) {
                const cells: VisioCell[] = ensureArray(row.Cell);
                for (const cell of cells) {
                    if (cell && cell.$ && cell.$.N === 'NoShow' && cell.$.V === '1') { return false; }
                }
            }
        }
    }

    return true;
}

/**
 * Gets tooltip/comment text from a shape's cell map.
 * Extracts the comment cell which stores tooltip text displayed on hover.
 *
 * @param {Map<string, CellMapValue>} cellMap - The cell map containing shape properties
 * @returns {string} The comment/tooltip text, or an empty string if not found
 * @example
 * // Extract tooltip text
 * const tooltip = getTooltip(cellMap);
 * // Result: 'Click to activate' or ''
 */
export function getTooltip(cellMap: Map<string, CellMapValue>): string {
    const contentCell: string = getCellMapStringValue(cellMap, 'Comment');
    return contentCell ? contentCell : '';
}

/**
 * Gets routing style flag from a shape's cell map.
 * Determines if a connector uses automatic line routing (Bezier or orthogonal).
 *
 * Specific routing style values indicate automatic routing should be enabled.
 * These values are defined in Visio's ShapeRouteStyle cell.
 *
 * @param {Map<string, CellMapValue>} cellMap - The cell map containing shape properties
 * @returns {boolean} The routing style flag value (true if automatic routing enabled)
 * @remarks
 * Routing values that enable automatic routing: 3, 4, 5, 6, 10, 11, 12, 13
 * All other values result in manual routing (returns false).
 *
 * @example
 * // Check if automatic routing is enabled
 * const hasRouting = getRouting(cellMap);
 * // Result: true or false
 */
export function getRouting(cellMap: Map<string, CellMapValue>): boolean {
    // Routing style values that indicate automatic line routing
    const routingArray: number[] = [3, 4, 5, 6, 10, 11, 12, 13];
    const routingCell: string = getCellMapStringValue(cellMap, 'ShapeRouteStyle');
    if (!routingCell) { return false; }
    const routingValue: number = parseInt(routingCell, 10);
    return routingArray.indexOf(routingValue) !== -1;
}

// ============================================================================
// SECTION 7: ANGLE & DISTANCE CONVERSIONS
// ============================================================================

/**
 * Converts radians to degrees using centralized constants.
 * Uses the RADIANS_TO_DEGREES constant from visio-constants for consistency.
 *
 * @param {number} radians - The angle value in radians to convert
 * @returns {number} The equivalent angle value in degrees
 * @example
 * // Convert common angles
 * radiansToDegrees(Math.PI); // Result: 180
 * radiansToDegrees(Math.PI / 2); // Result: 90
 */
export function radiansToDegrees(radians: number): number {
    return radians * UNIT_CONVERSION.RADIANS_TO_DEGREES;
}

/**
 * Converts inches to pixels based on configured screen DPI.
 * Uses SCREEN_DPI constant (96) as the standard conversion rate.
 *
 * Visio uses inches as its primary unit, while the diagram component uses pixels.
 * This conversion is fundamental to translating all Visio coordinates.
 *
 * @param {number} val - The value in inches to convert
 * @returns {number} The equivalent value in pixels
 * @example
 * // Convert Visio inches to pixels
 * inchToPx(1); // Result: 96 (96 pixels per inch)
 * inchToPx(0.5); // Result: 48
 */
export function inchToPx(val: number): number {
    return val * UNIT_CONVERSION.SCREEN_DPI;
}

/**
 * Converts inches to points (72 pt per inch).
 * Uses SCREEN_DPI as a single source of truth with point scaling factor.
 *
 * Points are used in typography (72 points = 1 inch).
 * This conversion is useful for font sizes and other typography-related measurements.
 *
 * @param {number} val - The value in inches to convert
 * @returns {number} The equivalent value in points
 * @remarks
 * Formula: inches * (96 DPI * (72 points / 96 pixels)) = inches * 72
 *
 * @example
 * // Convert inches to points
 * inchToPoint(1); // Result: 72 (72 points per inch)
 * inchToPoint(0.5); // Result: 36
 */
export function inchToPoint(val: number): number {
    return val * (UNIT_CONVERSION.SCREEN_DPI * (72 / 96));
}

// ============================================================================
// SECTION 8: SECTION EXTRACTION & GRADIENT UTILITIES
// ============================================================================

/**
 * Extracts gradient stops from a FillGradient or LineGradient section.
 * Converts Visio gradient data into standard objects with color, opacity, and offset.
 *
 * Gradient stops define the color and transparency at specific positions along
 * a gradient. This function normalizes Visio's representation to standard format.
 *
 * Stop object structure:
 * - color: hex color string (e.g., '#FF0000')
 * - opacity: 0-1 range (1 = fully opaque, calculated as 1 - transparency)
 * - offset: 0-1 range (normalized position along gradient)
 *
 * @param {VisioSection | null | undefined} fillGradientSection - The Visio FillGradient or LineGradient section to extract gradient stops from
 * @returns {GradientStop[]} Array of gradient stop objects containing color, opacity, and offset properties
 * @remarks
 * Skips rows marked as deleted (Del='1').
 * Uses default black (#000000) and fully opaque for missing color/opacity values.
 *
 * @example
 * // Extract gradient stops from fill section
 * const stops = extractGradientStops(fillGradientSection);
 * // Result: [
 * //   { color: '#FF0000', opacity: 1, offset: 0 },
 * //   { color: '#0000FF', opacity: 0.5, offset: 1 }
 * // ]
 */
export function extractGradientStops(fillGradientSection: VisioSection | null | undefined): GradientStop[] {
    const gradientStops: GradientStop[] = [];

    if (!fillGradientSection || !fillGradientSection.Row) {
        return gradientStops;
    }

    // Normalize rows to array
    const rows: VisioRow[] = ensureArray(fillGradientSection.Row);

    for (const row of rows) {
        // Skip invalid or deleted rows
        if (!row || !row.$ || row.$.Del === '1') {
            continue;
        }

        // Initialize stop with defaults
        let color: string = '#000000';
        let offset: number = 0;
        let opacity: number = 1;

        // Extract cell values from row
        const cells: VisioCell[] = ensureArray(row.Cell);
        for (const cell of cells) {
            const cellName: string = cell && cell.$ && cell.$.N;
            const cellValue: string = cell && cell.$ && cell.$.V as string;

            if (!cellName) { continue; }

            // Map cell names to gradient stop properties
            switch (cellName) {
            case 'GradientStopColor':
                color = cellValue;
                break;
            case 'GradientStopColorTrans': {
                // Transparency value (0-1); convert to opacity (1 - transparency)
                const t: number = parseNumberCell(cellValue, 0);
                opacity = Math.max(0, Math.min(1, 1 - t));
                break;
            }
            case 'GradientStopPosition': {
                // Position value (0-1); ensure it's within valid range
                const pos: number = parseNumberCell(cellValue, 0);
                offset = Math.max(0, Math.min(1, pos));
                break;
            }
            }
        }

        gradientStops.push({ color, offset, opacity });
    }

    return gradientStops;
}

/**
 * Computes a gradient vector from an angle in degrees using CSS-like semantics.
 * Returns endpoints for a linear gradient in normalized [0..100] space.
 *
 * CSS angle convention:
 * - 0 degrees: to the right (→)
 * - 90 degrees: upward (↑)
 * - 180 degrees: to the left (←)
 * - 270 degrees: downward (↓)
 *
 * The function computes a line through the center (50, 50) at the given angle,
 * then clamps the endpoints to the [0..100] square range.
 *
 * @param {number} angleDeg - The angle in degrees for gradient direction
 * @returns {GradientVector} A gradient vector object with computed endpoints in normalized space
 * @remarks
 * The line is extended far enough to ensure it crosses the bounding box,
 * then clamped to [0..100] for SVG compatibility.
 *
 * @example
 * // Get gradient vector for 45 degree angle
 * const vector = getGradientVectorByAngle(45);
 * // Result: { x1: 0, y1: 100, x2: 100, y2: 0 }
 *
 * // Get horizontal gradient (0 degrees)
 * const horizontal = getGradientVectorByAngle(0);
 * // Result: { x1: 0, y1: 50, x2: 100, y2: 50 }
 */
export function getGradientVectorByAngle(angleDeg: number): GradientVector {
    // Convert angle to radians
    const rad: number = angleDeg * UNIT_CONVERSION.DEGREES_TO_RADIANS;

    // Calculate direction vector components
    const dx: number = Math.cos(rad);
    const dy: number = Math.sin(rad);

    // Center point
    const cx: number = 50;
    const cy: number = 50;

    // Large enough half-length to ensure the line crosses the box
    const L: number = 100;

    // Calculate line endpoints
    const x1: number = cx - dx * L;
    const y1: number = cy - dy * L;
    const x2: number = cx + dx * L;
    const y2: number = cy + dy * L;

    // Clamp to [0..100] range
    const clamp: (n: number) => number = (n: number): number => Math.max(0, Math.min(100, n));

    return { x1: clamp(x1), y1: clamp(y1), x2: clamp(x2), y2: clamp(y2) };
}

/**
 * Represents a radial gradient by direction code.
 * Maps Visio's direction codes to radial gradient parameters.
 *
 * Radial gradients emanate from a focal point (fx, fy) and expand to a circle
 * with center (cx, cy) and radius r.
 *
 * @param {string | undefined} gradientDir - The gradient direction code string
 * @returns {RadialGradientConfig} A radial gradient configuration object
 * @remarks
 * Direction codes and their meanings:
 * - '1': Direction 1 (center-biased)
 * - '2': Direction 2 (left-bias)
 * - '3': Direction 3 (uniform radial)
 * - '6': Direction 6 (right-bias)
 * - '7': Direction 7 (upper-left bias)
 * - default: Returns centered zero-radius gradient
 *
 * @example
 * // Get radial gradient for direction '3'
 * const radial = getRadialGradient('3');
 * // Result: { type: 'Radial', cx: 50, cy: 50, fx: 50, fy: 50, r: 68 }
 */
export function getRadialGradient(gradientDir: string | undefined): RadialGradientConfig {
    const dir: string = gradientDir;

    // Map direction codes to gradient parameters
    switch (dir) {
    case '1':
        return { type: 'Radial', cx: 150, cy: 100, fx: 100, fy: 100, r: 180 };
    case '2':
        return { type: 'Radial', cx: 0, cy: 100, fx: 0, fy: 100, r: 140 };
    case '3':
        return { type: 'Radial', cx: 50, cy: 50, fx: 50, fy: 50, r: 68 };
    case '6':
        return { type: 'Radial', cx: 100, cy: 0, fx: 100, fy: 0, r: 100 };
    case '7':
        return { type: 'Radial', cx: 0, cy: 0, fx: 0, fy: 0, r: 140 };
    default:
        // Default: zero-radius gradient at origin
        return { type: 'Radial', cx: 0, cy: 0, fx: 0, fy: 0, r: 0 };
    }
}

// ============================================================================
// SECTION 9: DECORATOR UTILITIES
// ============================================================================

/**
 * Gets decorator shape name from Visio arrow type ID.
 * Handles special cases where multiple IDs map to the same shape.
 *
 * Uses the centralized DECORATOR_SHAPE_MAP for mapping, with special handling
 * for common arrow types that share shape properties.
 *
 * @param {number} arrowType - The Visio arrow type ID number
 * @returns {string} The decorator shape name (e.g., 'Arrow', 'Diamond', 'None')
 * @remarks
 * Special handling for arrow type codes 2, 4, and 13 which all map to 'Arrow'.
 * Falls back to 'Arrow' if type not found in decorator shape map.
 *
 * @example
 * // Get decorator shape
 * getDecoratorShape(4); // Result: 'Arrow'
 * getDecoratorShape(22); // Result: 'Diamond'
 * getDecoratorShape(0); // Result: 'None'
 */
export function getDecoratorShape(arrowType: number): string {
    // Special handling for arrow types that all represent standard arrow
    const arrowCode: Set<number> = new Set<number>([2, 4, 13]);
    if (arrowCode.has(arrowType)) { return 'Arrow'; }

    return DECORATOR_SHAPE_MAP[parseInt(arrowType.toString(), 10)] || 'Arrow';
}

/**
 * Returns decorator dimensions by size code and shape name.
 * Maps decorator size codes to width and height values.
 *
 * Process:
 * 1. Normalize shape name to lowercase
 * 2. Check if shape matches known arrow-like shapes
 * 3. Use appropriate size table (arrow shapes share same progression)
 * 4. Parse numeric size index from Visio (0-6)
 * 5. Clamp to available sizes
 * 6. Return dimensions or fallback to default
 *
 * @param {string} sizeType - The size code/index string from Visio (expects '0'..'6')
 * @param {string} arrowShape - The decorator shape name to lookup dimensions for
 * @returns {{width: number, height: number}} An object with width and height properties representing decorator dimensions
 * @remarks
 * Arrow-like shapes (arrow, opendarrow, fletch, etc.) share the same size progression.
 * Fallback: 8x8 pixels if shape not found in size map.
 *
 * @example
 * // Get dimensions for medium-sized arrow
 * const dims = getDecoratorDimensions('4', 'Arrow');
 * // Result: { width: 12.5, height: 12.5 }
 *
 * // Get dimensions for diamond
 * const dims2 = getDecoratorDimensions('2', 'Diamond');
 * // Result: { width: 20, height: 11 }
 */
export function getDecoratorDimensions(
    sizeType: string,
    arrowShape: string
): { width: number; height: number } {
    // Normalize shape name to lowercase for lookup
    const shapeKey: string = (arrowShape).toLowerCase();

    // Check if shape is arrow-like (all arrow-like shapes share size progression)
    const arrowLikeKey: string = ['arrow', 'outdentedarrow', 'fletch', 'openarrow', 'openfetch', 'indentedarrow']
        .find((k: string) => k === shapeKey);
    const resolvedKey: string = arrowLikeKey ? 'arrow' : shapeKey;

    // Look up size table for shape
    const sizes: { width: number; height: number; }[] = DECORATOR_SIZE_MAP[`${resolvedKey}`];
    if (!sizes || sizes.length === 0) {
        return { width: 8, height: 8 }; // Global fallback
    }

    // Parse size index and clamp to available range
    const idxRaw: number = parseInt(sizeType, 10);
    const idx: number = Number.isFinite(idxRaw) ? Math.max(0, Math.min(idxRaw, sizes.length - 1)) : 0;

    // Return size or fallback to largest available
    return sizes[parseInt(idx.toString(), 10)] !== undefined && sizes[parseInt(idx.toString(), 10)] !== null
        ? sizes[parseInt(idx.toString(), 10)]
        : sizes[sizes.length - 1];
}

// ============================================================================
// SECTION 10: GENERIC UTILITIES & TYPE GUARDS
// ============================================================================

/**
 * Runtime type guard: checks if a value is a non-null object.
 * Useful for narrowing types in conditional branches.
 *
 * @param {unknown} x - The value to check
 * @returns {boolean} True if the value is a non-null object, false otherwise
 * @example
 * // Type guard in conditional
 * if (isObject(value)) {
 *   // value is now typed as ParsedXmlObject
 * }
 */
export function isObject(x: unknown): x is ParsedXmlObject {
    return typeof x === 'object' && x !== null;
}

/**
 * Runtime type guard: checks if an object has an own property key.
 * Combines object check with property ownership verification.
 *
 * Uses Object.prototype.hasOwnProperty for accurate property detection,
 * avoiding issues with inherited properties.
 *
 * @param {unknown} obj - The object to check
 * @param {string} key - The property key to look for
 * @returns {boolean} True if the object has the specified own property key, false otherwise
 * @example
 * // Check if object has property
 * if (hasKey(obj, 'name')) {
 *   // obj.name exists and is own property
 * }
 */
export function hasKey(obj: unknown, key: string): obj is ParsedXmlObject {
    return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Safely converts a value to a number with fallback.
 * Handles NaN and Infinity cases, returning default value if conversion fails.
 *
 * @param {unknown} value - The value to convert to number
 * @param {number} defaultValue - The fallback if conversion fails (default: 0)
 * @returns {number} The converted number or default
 * @example
 * // Safe number conversion
 * safeNumber('42'); // Result: 42
 * safeNumber('abc', 10); // Result: 10
 * safeNumber(NaN, 5); // Result: 5
 */
export function safeNumber(value: unknown, defaultValue: number = 0): number {
    const num: number = Number(value);
    return isNaN(num) || !isFinite(num) ? defaultValue : num;
}

/**
 * Rounds a value to a specified decimal precision.
 * Uses the LAYOUT_METRICS precision as default for path data consistency.
 *
 * @param {number} value - The value to round
 * @param {number} precision - Number of decimal places (default: LAYOUT_METRICS.PATH_PRECISION)
 * @returns {number} The rounded value
 * @example
 * // Round to precision
 * roundToPrecision(3.14159, 2); // Result: 3.14
 * roundToPrecision(42.123); // Result: 42.1200 (using default precision of 4)
 */
export function roundToPrecision(
    value: number,
    precision: number = LAYOUT_METRICS.PATH_PRECISION
): number {
    if (!Number.isFinite(value)) { return 0; }
    return Number(value.toFixed(precision));
}

/**
 * Rounds a value to exactly 2 decimal places.
 * Commonly used for coordinate rounding in projections and calculations.
 *
 * @param {number} value - The value to round
 * @returns {number} The value rounded to 2 decimal places
 * @example
 * // Round to 2 decimals
 * roundTo2Decimals(3.14159); // Result: 3.14
 * roundTo2Decimals(42.126); // Result: 42.13
 */
export function roundTo2Decimals(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * Geometry and path processing utilities for Visio import/export.
 * Handles geometry extraction, path generation, Bezier curve processing, and text binding.
 *
 * This section provides the core functionality for converting Visio geometry data
 * to SVG path strings and processing complex shape paths.
 *
 * @private
 */

// ============================================================================
// SECTION 11: GEOMETRY & PATH PROCESSING
// ============================================================================

/**
 * Creates an SVG path string from Visio geometry data.
 * Converts Visio geometry rows (MoveTo, LineTo, ArcTo, etc.) to SVG path commands.
 *
 * The function applies coordinate transformations to convert from Visio's local
 * coordinate system to either local or global normalized coordinates.
 *
 * @param {GeometryWithRows | Attributes} geometry - The geometry data to convert to SVG path
 * @param {PathOptions | undefined} options - Optional path rendering options (pinX, pinY, Width, Height)
 * @param {GlobalOrigin | undefined} globalOrigin - Optional global origin for coordinate transformation
 * @param {PathConfig} [cfg] - Optional path configuration settings (e.g., useLocalScaling)
 * @returns {string} The SVG path string
 * @remarks
 * Scaling modes:
 * - Local: Scales to [0, width] x [0, height]
 * - Global: Normalizes to global bounds in [0, 1] range
 *
 * Y-axis is flipped to convert from Visio (Y increases up) to SVG (Y increases down).
 *
 * @example
 * // Create path from geometry
 * const pathData = createPathFromGeometry(geometry, options, globalOrigin);
 * // Result: 'M 10 20 L 30 40 A 5 5 0 0 1 50 60'
 */
export function createPathFromGeometry(
    geometry: GeometryWithRows | Attributes,
    options: PathOptions | undefined,
    globalOrigin: GlobalOrigin | undefined,
    cfg?: PathConfig
): string {
    if (!geometry || typeof geometry !== 'object') {
        return '';
    }

    const geom: GeometryWithRows = geometry as GeometryWithRows;

    // Get rendering parameters
    const precision: number = LAYOUT_METRICS.PATH_PRECISION;
    const flipY: boolean = true;

    // Get geometry dimensions
    const height: number = safeNumber(geom.height || geom.Height);
    const width: number = safeNumber(geom.width || geom.Width);
    const useLocal: boolean = cfg && cfg.useLocalScaling !== undefined && cfg.useLocalScaling !== null
        ? cfg.useLocalScaling
        : false;

    // Invalid dimensions result in empty path
    if (height <= 0 || width <= 0) {
        return '';
    }

    // Calculate shape origin for coordinate transformation
    let shapeOriginX: number = 0;
    let shapeOriginY: number = 0;

    if (geom.Name !== 'Path' && options) {
        shapeOriginX = options.pinX - options.Width / 2;
        shapeOriginY = options.pinY - options.Height / 2;
    }

    // Create scaling functions based on mode
    const roundToPrecisionLocal: (n: number) => number = (n: number): number => roundToPrecision(n, precision);

    // scale to geometry dimensions
    const scaleXLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => roundToPrecisionLocal(safeNumber(v));

    const scaleYLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => {
            const num: number = safeNumber(v);
            return roundToPrecisionLocal((flipY ? (height - num) : num));
        };

    // Global scaling functions (DISABLED): normalize to global bounds
    // NOTE: Global scaling is currently not used in our rendering pipeline.
    // These functions are kept here for reference but are commented out to
    // avoid accidental usage and to simplify path generation exclusively with
    // local scaling. If global normalization is needed in the future, restore
    // these implementations and update the selection below accordingly.
    //
    // const scaleXGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
    //     if (!globalOrigin) { return 0; }
    //     return roundToPrecisionLocal(
    //         (shapeOriginX + safeNumber(v) - globalOrigin.minX) / globalOrigin.width
    //     );
    // };
    //
    // const scaleYGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
    //     if (!globalOrigin) { return 0; }
    //     const absY: number = shapeOriginY + safeNumber(v) - globalOrigin.minY;
    //     return roundToPrecisionLocal(
    //         flipY ? (1 - absY / globalOrigin.height) : (absY / globalOrigin.height)
    //     );
    // };

    // Radius scaling functions (for arc operations) - GLOBAL (DISABLED)
    // NOTE: Global radius normalization is not used currently. Keeping the
    // implementations commented for future reference.
    // const radiusXGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
    //     if (!globalOrigin) { return 0; }
    //     return roundToPrecisionLocal(safeNumber(v) / globalOrigin.width);
    // };
    //
    // const radiusYGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
    //     if (!globalOrigin) { return 0; }
    //     return roundToPrecisionLocal(safeNumber(v) / globalOrigin.height);
    // };

    // Local radii must scale in the same coordinate space as X/Y (which is width/height scaled)
    const radiusXLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => roundToPrecisionLocal(safeNumber(v));

    const radiusYLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => roundToPrecisionLocal(safeNumber(v));

    // Select appropriate scaling functions
    // Global scaling disabled: always use local scaling for coordinates and radii.
    const scaleX: (v: number | string | undefined) => number = scaleXLocal;
    const scaleY: (v: number | string | undefined) => number = scaleYLocal;
    const radiusX: (v: number | string | undefined) => number = radiusXLocal;
    const radiusY: (v: number | string | undefined) => number = radiusYLocal;

    // Process geometry rows to build path
    let pathData: string = '';
    const lastCoords: PathCoordinates = { lastX: 0, lastY: 0 };
    const rows: VisioRow[] = ensureArray(geom.Row);

    if (!Array.isArray(rows)) {
        return '';
    }

    // Generate path commands from rows
    for (const row of rows) {
        if (!row || !row.$) { continue; }

        const rowType: string | undefined = row.$.T;

        // Build cell map for this row
        const cellArray: VisioCell[] = ensureArray(row.Cell);
        const cellMap: Map<string, number> = new Map<string, number>();

        for (const cell of cellArray) {
            if (cell && cell.$ && cell.$.N) {
                cellMap.set(cell.$.N, safeNumber(cell.$.V));
            }
        }

        // Extract coordinate values
        let X: number = safeNumber(cellMap.get('X'));
        let Y: number = safeNumber(cellMap.get('Y'));
        let A: number = safeNumber(cellMap.get('A'));
        let B: number = safeNumber(cellMap.get('B'));
        let C: number = safeNumber(cellMap.get('C'));
        let D: number = safeNumber(cellMap.get('D'));

        const rt: string = rowType ? String(rowType) : '';
        const isRel: boolean = rt.indexOf('Rel') === 0;

        // Convert relative rows to absolute inches before path generation
        if (isRel) {
            // X-like values scale by width
            X = X * width;
            A = A * width;

            // Y-like values scale by height
            Y = Y * height;
            B = B * height;

            // RelCubBezTo uses C/D as 2nd control point
            if (rt === 'RelCubBezTo') {
                C = C * width;
                D = D * height;
            }
        }

        // Generate path command for this row
        pathData += generatePathCommand(
            rowType,
            { X, Y, A, B, C, D },
            { scaleX, scaleY, radiusX, radiusY },
            lastCoords,
            flipY
        ) + ' ';
    }

    return pathData.trim();
}

/**
 * Creates a combined SVG path from one or more Visio Geometry sections.
 *
 * Each Visio <Section N='Geometry'> block is converted to an SVG subpath
 * (via `createPathFromGeometry`) and appended to form a single path string.
 * Subpaths that begin with a relative 'm' are converted to absolute 'M'
 * to prevent path drift between sections. If a Geometry section is filled
 * (NoFill cell is 0 or absent) the resulting subpath is closed with a
 * trailing 'Z' to ensure correct fill rendering; sections explicitly
 * marked NoFill will remain open.
 *
 * @param {VisioSection[] | VisioSection} geometrySections - One or more Visio Geometry sections to convert
 * @param {PathOptions} nodeOptions - Node sizing options used to provide width/height when building temporary geometry objects
 * @param {PathConfig | undefined} cfg - Optional configuration forwarded to `createPathFromGeometry`
 * @returns {string} Trimmed SVG path string combining all geometry subpaths
 */
export function createPathFromGeometrySections(
    geometrySections: VisioSection[],
    nodeOptions: PathOptions,
    cfg?: PathConfig
): string {
    const sections: VisioSection[] = ensureArray(geometrySections);
    if (!sections || sections.length === 0) { return ''; }

    // Build combined path while skipping hidden geometry
    let combinedPath: string = '';
    for (let i: number = 0; i < sections.length; i++) {
        const section: VisioSection = sections[parseInt(i.toString(), 10)];
        if (!section) { continue; }

        // Skip section if section-level NoShow=1
        const sectionHidden: boolean = isGeometrySectionHidden(section);
        if (sectionHidden) { continue; }

        // Filter out rows with row-level NoShow=1
        const allRows: VisioRow[] = ensureArray(section.Row);
        const visibleRows: VisioRow[] = [];
        for (let row: number = 0; row < allRows.length; row++) {
            const visioRow: VisioRow = allRows[parseInt(row.toString(), 10)];
            if (!visioRow) { continue; }
            const rowHidden: boolean = isGeometryRowHidden(visioRow);
            if (!rowHidden) {
                visibleRows.push(visioRow);
            }
        }
        if (visibleRows.length === 0) { continue; }

        // Build a geometry object using only visible rows
        const geom: GeometryWithRows = {
            Row: visibleRows,
            width: nodeOptions ? nodeOptions.Width : 0,
            height: nodeOptions ? nodeOptions.Height : 0
        } as GeometryWithRows;

        // Create subpath using local scaling
        const rawPart: string = createPathFromGeometry(
            geom,
            { pinX: 0, pinY: 0, Width: nodeOptions.Width, Height: nodeOptions.Height },
            undefined,
            cfg
        );
        if (!rawPart || rawPart.length === 0) { continue; }

        // Normalize subpath head to absolute 'M'
        let normalizedPart: string = rawPart.trim();
        if (normalizedPart.length > 0) {
            const firstChar: string = normalizedPart.charAt(0);
            if (firstChar === 'm') {
                normalizedPart = 'M' + normalizedPart.substring(1);
            }
        }

        // Close filled sections for reliable fill rendering
        let sectionNoFill: number = 0;
        if (section.Cell) {
            const cellMap: Map<string, CellMapValue> = createCellMap(ensureArray(section.Cell));
            sectionNoFill = safeNumber(cellMap.get('NoFill'));
        }
        if (sectionNoFill === 0) {
            const lastChar: string = normalizedPart.charAt(normalizedPart.length - 1);
            if (lastChar !== 'Z' && lastChar !== 'z') {
                normalizedPart = normalizedPart + ' Z';
            }
        }

        // Append subpath to combined path
        combinedPath = combinedPath + normalizedPart + ' ';
    }

    // Return trimmed combined path
    const finalPath: string = combinedPath.trim();
    return finalPath;
}

/**
 * Normalizes an angle value to radians.
 * If the input value appears to be in degrees (absolute value > 2π),
 * it is converted to radians. Otherwise, the value is returned unchanged.
 *
 * @param {number} val - The angle value to normalize.
 * @returns {number} The angle in radians.
 */
function normalizeAngleRadians(val: number): number {
    // If value looks like degrees, convert to radians
    if (Math.abs(val) > 6.283185307) { return val * Math.PI / 180; }
    return val;
}

/**
 * Generates an SVG path command from a Visio geometry row.
 * Handles various row types (MoveTo, LineTo, ArcTo, Bezier, etc.)
 * and converts their parameters to SVG path syntax.
 *
 * @param {string | undefined} rowType - Row kind identifier (e.g., 'MoveTo', 'LineTo', 'ArcTo')
 * @param {GeometryRowCoordinates} coords - Coordinate values used by the row
 * @param {ScalingFunctions} scaleFunctions - Functions to scale X and Y values
 * @param {PathCoordinates} lastCoords - The previous path coordinates for continuity
 * @param {boolean} flipY - Whether to invert the Y-axis during conversion
 * @returns {string} The generated SVG path command (e.g., 'M ...', 'L ...', 'A ...')
 * @remarks
 * Supported row types:
 * - MoveTo/RelMoveTo: Move to absolute/relative position
 * - LineTo/RelLineTo: Draw line to position
 * - ArcTo: Draw circular arc
 * - EllipticalArcTo: Draw elliptical arc
 * - CubicBezierTo/RelCubBezTo: Draw cubic Bezier curve
 * - QuadBezierTo: Draw quadratic Bezier curve
 * - Ellipse: Draw complete ellipse
 *
 * @example
 * // Generate move command
 * generatePathCommand('MoveTo', { X: 10, Y: 20 }, {...}, {...}, true);
 * // Result: 'M 10 20'
 *
 * // Generate line command
 * generatePathCommand('LineTo', { X: 30, Y: 40 }, {...}, {...}, true);
 * // Result: 'L 30 40'
 */
export function generatePathCommand(
    rowType: string | undefined,
    coords: GeometryRowCoordinates,
    scaleFunctions: ScalingFunctions,
    lastCoords: PathCoordinates,
    flipY: boolean
): string {
    const { X = 0, Y = 0, A = 0, B = 0, C = 0, D = 0 } = coords;
    const { scaleX, scaleY, radiusX, radiusY } = scaleFunctions;

    switch (rowType) {
    case 'MoveTo':
    case 'RelMoveTo': {
        // Move to position
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `M ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'RelLineTo':
    case 'LineTo': {
        // Draw line
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `L ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'ArcTo': {
        // Draw circular arc
        const deltaX: number = Math.abs(X - lastCoords.lastX);
        const deltaY: number = Math.abs(Y - lastCoords.lastY);
        const radius: number = Math.max(deltaX, deltaY);
        const sweepFlag: number = A < 0 ? 1 : 0;
        const largeArcFlag: number = 0;

        lastCoords.lastX = X;
        lastCoords.lastY = Y;

        return `A ${radiusX(radius)} ${radiusY(radius)} 0 ${largeArcFlag} ${sweepFlag} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'EllipticalArcTo':
    case 'RelEllipticalArcTo': {
        // Elliptical arc from last point to (X,Y) via (A,B)

        // Start, end, and mid points
        const startX: number = safeNumber(lastCoords.lastX);
        const startY: number = safeNumber(lastCoords.lastY);
        const endX: number = safeNumber(X);
        const endY: number = safeNumber(Y);
        let midX: number = safeNumber(A);
        let midY: number = safeNumber(B);

        // Fallback midpoint if missing
        if (
            (A === undefined || A === null) &&
            (B === undefined || B === null)
        ) {
            midX = (startX + endX) / 2;
            midY = (startY + endY) / 2;
        }

        // Scaled coordinates
        const scaledStartX: number = scaleX(startX);
        const scaledStartY: number = scaleY(startY);
        const scaledMidX: number = scaleX(midX);
        const scaledMidY: number = scaleY(midY);
        const scaledEndX: number = scaleX(endX);
        const scaledEndY: number = scaleY(endY);

        // Degenerate case → line
        const EPSILON: number = 1e-6;
        if (
            Math.abs(scaledStartX - scaledEndX) < EPSILON &&
            Math.abs(scaledStartY - scaledEndY) < EPSILON
        ) {
            lastCoords.lastX = endX;
            lastCoords.lastY = endY;
            return `L ${scaledEndX} ${scaledEndY}`;
        }

        // Rotation and axis ratio
        const rotationRad: number = normalizeAngleRadians(safeNumber(C));
        let axisRatio: number = Math.abs(safeNumber(D, 1));
        if (!isFinite(axisRatio) || axisRatio === 0) {
            axisRatio = 1;
        }

        // Transform to circle space
        const rotatePoint: (x: number, y: number, angle: number) => { x: number; y: number } = (x: number, y: number, angle: number) => {
            const cosA: number = Math.cos(angle);
            const sinA: number = Math.sin(angle);
            return { x: x * cosA + y * sinA, y: -x * sinA + y * cosA };
        };
        const toCircleSpace: (x: number, y: number) => { x: number; y: number } = (x: number, y: number) => {
            const rotated: { x: number; y: number } = rotatePoint(x, y, -rotationRad);
            return { x: rotated.x, y: rotated.y / axisRatio };
        };

        const circleStart: { x: number; y: number } = toCircleSpace(scaledStartX, scaledStartY);
        const circleMid: { x: number; y: number } = toCircleSpace(scaledMidX, scaledMidY);
        const circleEnd: { x: number; y: number } = toCircleSpace(scaledEndX, scaledEndY);

        // Solve circle through three points
        const deltaXStartMid: number = circleStart.x - circleMid.x;
        const deltaYStartMid: number = circleStart.y - circleMid.y;
        const deltaXStartEnd: number = circleStart.x - circleEnd.x;
        const deltaYStartEnd: number = circleStart.y - circleEnd.y;
        const halfDiff1: number =
            (circleStart.x ** 2 -
                circleMid.x ** 2 +
                (circleStart.y ** 2 - circleMid.y ** 2)) /
            2;
        const halfDiff2: number =
            (circleStart.x ** 2 -
                circleEnd.x ** 2 +
                (circleStart.y ** 2 - circleEnd.y ** 2)) /
            2;
        const determinant: number =
            deltaXStartMid * deltaYStartEnd - deltaYStartMid * deltaXStartEnd;

        if (Math.abs(determinant) < EPSILON) {
            // Collinear → quadratic Bezier
            lastCoords.lastX = endX;
            lastCoords.lastY = endY;
            return `Q ${scaleX(midX)} ${scaleY(midY)} ${scaledEndX} ${scaledEndY}`;
        }

        const centerX: number =
            (halfDiff1 * deltaYStartEnd - deltaYStartMid * halfDiff2) /
            determinant;
        const centerY: number =
            (deltaXStartMid * halfDiff2 - halfDiff1 * deltaXStartEnd) /
            determinant;
        const circleRadius: number = Math.sqrt(
            (circleStart.x - centerX) ** 2 + (circleStart.y - centerY) ** 2
        );

        // Angles
        const angleAt: (x: number, y: number) => number = (x: number, y: number) =>
            Math.atan2(y - centerY, x - centerX);
        const angleStart: number = angleAt(circleStart.x, circleStart.y);
        const angleMid: number = angleAt(circleMid.x, circleMid.y);
        const angleEnd: number = angleAt(circleEnd.x, circleEnd.y);

        const normalizeAngle: (angle: number) => number = (angle: number) => {
            let normalizedAngle: number = angle;
            while (normalizedAngle < 0) { normalizedAngle += Math.PI * 2; }
            while (normalizedAngle >= Math.PI * 2) { normalizedAngle -= Math.PI * 2; }
            return normalizedAngle;
        };
        const normStart: number = normalizeAngle(angleStart);
        const normMid: number = normalizeAngle(angleMid);
        const normEnd: number = normalizeAngle(angleEnd);

        const deltaPositive: number = normalizeAngle(normEnd - normStart);
        const isMidBetween: boolean =
            normalizeAngle(normMid - normStart) < deltaPositive;

        let sweepFlag: number;
        let arcAngle: number;
        if (isMidBetween) {
            sweepFlag = 1;
            arcAngle = deltaPositive;
        } else {
            sweepFlag = 0;
            arcAngle = normalizeAngle(normStart - normEnd);
        }
        const largeArcFlag: number = arcAngle > Math.PI ? 1 : 0;

        // Convert back to ellipse
        const ellipseRadiusX: number = roundToPrecision(circleRadius);
        const ellipseRadiusY: number = roundToPrecision(
            circleRadius * axisRatio
        );
        const rotationDeg: number = roundToPrecision(
            (rotationRad * 180) / Math.PI
        );

        // Update last coords
        lastCoords.lastX = endX;
        lastCoords.lastY = endY;

        return `A ${ellipseRadiusX} ${ellipseRadiusY} ${rotationDeg} ${largeArcFlag} ${sweepFlag} ${scaledEndX} ${scaledEndY}`;
    }

    case 'RelCubBezTo':
    case 'CubicBezierTo': {
        // Cubic Bezier curve
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `C ${scaleX(A)} ${scaleY(B)} ${scaleX(C)} ${scaleY(D)} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'QuadBezierTo': {
        // Quadratic Bezier curve
        return `Q ${scaleX(A)} ${scaleY(B)} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'Ellipse': {
        // Draw full ellipse using two arcs
        const centerX: number = scaleX(X);
        const centerY: number = scaleY(Y);

        const axisPointX: number = scaleX(A);
        const axisPointY: number = scaleY(B);

        const oppositeAxisPointX: number = scaleX(C);
        const oppositeAxisPointY: number = scaleY(D);

        // Radii are distances from center to axis points
        const radiusX: number = Math.abs(axisPointX - centerX);
        const radiusY: number = Math.abs(oppositeAxisPointY - centerY);

        if (radiusX <= 0 || radiusY <= 0) {
            return '';
        }

        // Start and end points for arcs
        const startX: number = centerX - radiusX;
        const startY: number = centerY;
        const endX: number = centerX + radiusX;
        const endY: number = centerY;

        // Use two half-arcs to complete the ellipse
        return `M ${startX} ${startY} A ${radiusX} ${radiusY} 0 0 1 ${endX} ${endY} A ${radiusX} ${radiusY} 0 0 1 ${startX} ${startY} Z`;
    }

    default:
        return '';
    }
}

/**
 * Formats an SVG path string by normalizing whitespace and commas.
 * Cleans up path data while preserving SVG validity and openness.
 *
 * The formatter:
 * - Adds spaces around SVG command letters
 * - Converts commas to spaces
 * - Normalizes multiple spaces to single spaces
 * - Does NOT add closing 'Z' command (keeps path open)
 *
 * @param {string} path - The raw SVG path data string to format
 * @returns {string} The formatted SVG path string
 * @remarks
 * Returns 'M 0 0' if input is invalid or empty.
 * Preserves all path data, only normalizes spacing.
 *
 * @example
 * // Format SVG path
 * formatPathData('M10,20L30,40A5,5,0,0,1,50,60');
 * // Result: 'M 10 20 L 30 40 A 5 5 0 0 1 50 60'
 */
export function formatPathData(path: string): string {
    if (!path || typeof path !== 'string') {
        return 'M 0 0';
    }

    const formattedPath: string = path
        .replace(/([MLCQAZ])/gi, ' $1 ')  // Add spaces around commands
        .replace(/,/g, ' ')                 // Replace commas with spaces
        .replace(/\s+/g, ' ')               // Normalize multiple spaces
        .trim();                            // Remove leading/trailing whitespace

    return formattedPath;
}

/**
 * Calculates shadow properties from offset and scale.
 * Converts Visio shadow offset values to distance and angle for CSS shadow properties.
 *
 * @param {number} visioOffsetX - The horizontal shadow offset from Visio
 * @param {number} visioOffsetY - The vertical shadow offset from Visio
 * @param {number} scalingFactor - The factor used to scale the offsets
 * @returns {{distance: number, angle: number}} The shadow distance (in pixels) and angle (in degrees)
 * @remarks
 * Algorithm:
 * 1. Calculate distance using Pythagorean theorem
 * 2. Apply scaling factor
 * 3. Calculate angle using atan2
 * 4. Convert angle to degrees
 * 5. Normalize angle to [0, 360) range
 *
 * @example
 * // Calculate shadow properties
 * const shadow = calculateShadowProperties(5, 5, 1);
 * // Result: { distance: 7.07, angle: 315 }
 */
export function calculateShadowProperties(
    visioOffsetX: number,
    visioOffsetY: number,
    scalingFactor: number
): { distance: number; angle: number } {
    // Validate scaling factor
    const scale: number = (scalingFactor && scalingFactor > 0) ? scalingFactor : 1;

    // Calculate distance using Pythagorean theorem
    const distanceInPixels: number = Math.sqrt(
        Math.pow(visioOffsetX, 2) + Math.pow(visioOffsetY, 2)
    ) * scale;

    // Calculate angle using atan2 (handles all quadrants correctly)
    const angleInRadians: number = Math.atan2(-visioOffsetY, visioOffsetX);
    let angleInDegrees: number = angleInRadians * UNIT_CONVERSION.RADIANS_TO_DEGREES;

    // Normalize angle to [0, 360) range
    if (angleInDegrees < 0) {
        angleInDegrees += 360;
    }

    return {
        distance: roundToPrecision(distanceInPixels, 2),
        angle: Math.round(angleInDegrees)
    };
}
