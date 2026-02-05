// visio-core.ts - Corrected version

import { DECORATOR_SHAPE_MAP, DECORATOR_SIZE_MAP, LAYOUT_METRICS, UNIT_CONVERSION } from './visio-constants';
import { VisioShape } from './visio-models';
import {
    Attributes,
    AugmentedGeometry,
    Bounds,
    CellMapValue,
    GeometryItem,
    GeometryRowCoordinates,
    GeometryWithRows,
    GlobalOrigin,
    GradientStop,
    GradientVector,
    OneOrMany,
    ParsedXmlObject,
    PathConfig,
    PathCoordinates,
    PathOptions,
    RadialGradientConfig,
    ScalingFunctions,
    ShapeAttributes,
    ShapeData,
    ShapeLikeStructure,
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
            // Prefer formula over value for position-related cells
            if ((cell.$.N === 'LocPinX' || cell.$.N === 'LocPinY') && cell.$.F) {
                map.set(cell.$.N, cell.$.F);
            }
            else {
                map.set(cell.$.N, cell.$.V);
            }
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
    const value: CellMapValue = cellMap.get(key);
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
    const value: CellMapValue = cellMap.get(key);
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
    const cell: VisioCell = cells.find((c: VisioCell) => c && c.$ && c.$.N === name);
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
 * Gets master ID from shape attributes.
 * Handles multiple possible attribute names (Master, MasterID, MasterId) for
 * compatibility with different Visio versions and XML representations.
 *
 * The master ID is critical for looking up shape styling and properties from
 * the master shapes collection.
 *
 * @param {unknown} shape - Shape node or its attributes object
 * @returns {string | null} Master ID as a string, or null if not found
 * @remarks
 * Checks multiple attribute names in order:
 * 1. Master (most common)
 * 2. MasterID (alternate naming)
 * 3. MasterId (camelCase variant)
 *
 * Returns null if shape is invalid, not an object, or has no master ID.
 *
 * @example
 * // Get master ID from shape
 * const masterId = getMasterId(shape);
 * // Result: 'M1' or null
 */
export function getMasterId(shape: unknown): string | null {
    if (!shape || typeof shape !== 'object') { return null; }

    // The attributes can be directly on the object or nested under '$'
    const attrs: ShapeAttributes | ParsedXmlObject =
        '$' in shape && typeof (shape as ParsedXmlObject).$ === 'object'
            ? (shape as ParsedXmlObject).$ as ShapeAttributes
            : shape as ParsedXmlObject;

    if (!attrs) { return null; }

    // Try multiple attribute name variants
    const rawId: unknown = 'Master' in attrs ? attrs.Master :
        'MasterID' in attrs ? (attrs as ParsedXmlObject).MasterID :
            'MasterId' in attrs ? (attrs as ParsedXmlObject).MasterId :
                null;

    if (rawId === null || rawId === undefined) { return null; }

    const id: string = String(rawId).trim();
    return id.length > 0 ? id : null;
}

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
    const attrs: any = (shape as ParsedXmlObject).$;
    return attrs && typeof attrs === 'object' && 'Type' in attrs && String(attrs.Type).toLowerCase() === 'group';
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
 * Checks if a master ID is valid and non-empty.
 * Validates that the master ID is a non-empty string before use.
 *
 * @param {string} masterId - Master ID to validate
 * @returns {boolean} True if it is a non-empty string, false otherwise
 * @example
 * // Validate master ID
 * isValidMasterId('M1'); // Result: true
 * isValidMasterId(''); // Result: false
 * isValidMasterId(null); // Result: false
 */
export function isValidMasterId(masterId: string): boolean {
    return typeof masterId === 'string' && masterId.trim().length > 0;
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
 * Finds all geometries (local and child) in a shape recursively.
 * Extracts geometry sections from a shape and its child shapes.
 *
 * Creates augmented geometry objects that include spatial information
 * (width, height, pin position, local pin position) needed for path generation.
 *
 * @param {ShapeData} shapeData - The shape data object containing geometry information
 * @returns {AugmentedGeometry[]} An array of all geometries found in the shape and its children
 * @remarks
 * Algorithm:
 * 1. Extract dimension and position properties from shape cells
 * 2. Find all Geometry sections in shape
 * 3. Augment each geometry with spatial properties
 * 4. Recursively process child shapes
 * 5. Combine all geometries in order
 *
 * @example
 * // Find all geometries in a shape
 * const geometries = findAllGeometries(shapeData);
 * // Result: Array of augmented geometry objects
 */
export function findAllGeometries(shapeData: ShapeData): AugmentedGeometry[] {
    if (shapeData === undefined || shapeData === null) {
        return [];
    }

    // Extract cell data and create property map
    const cells: OneOrMany<VisioCell> = shapeData.Cell;
    const cellArray: VisioCell[] = ensureArray(cells);
    const properties: Map<string, CellMapValue> = createCellMap(cellArray);

    // Extract shape dimensions and position
    const width: number = safeNumber(properties.get('Width'));
    const height: number = safeNumber(properties.get('Height'));
    const pinX: number = safeNumber(properties.get('PinX'));
    const pinY: number = safeNumber(properties.get('PinY'));
    const locPinX: number = safeNumber(properties.get('LocPinX'));
    const locPinY: number = safeNumber(properties.get('LocPinY'));

    // Find local geometry sections
    const sections: VisioSection[] = ensureArray((shapeData as ShapeLikeStructure).Section);
    const localGeometries: AugmentedGeometry[] = sections
        .filter((sec: VisioSection) => isVisioSection(sec) && sec.$ && sec.$.N === 'Geometry')
        .map((geometrySection: VisioSection) => ({
            Row: geometrySection.Row,
            width,
            height,
            pinX,
            pinY,
            LocPinX: locPinX,
            LocPinY: locPinY
        }));

    // Recursively find child geometries
    const childGeometries: AugmentedGeometry[] = [];
    const shapeLike: ShapeLikeStructure = shapeData as ShapeLikeStructure;
    if (shapeLike.Shapes && shapeLike.Shapes.Shape) {
        const childShapes: VisioShapeNode[] = ensureArray(shapeLike.Shapes.Shape);
        for (const childShape of childShapes) {
            childGeometries.push(...findAllGeometries(childShape as ShapeData));
        }
    }

    return [...localGeometries, ...childGeometries];
}

/**
 * Normalizes group shapes and computes global bounding box.
 * Calculates the overall bounds encompassing all geometries in a group.
 *
 * This is used for group shapes to establish a coordinate system for all
 * contained geometries.
 *
 * @param {GeometryItem[]} geometries - Array of geometry items to normalize
 * @returns {{globalOrigin: GlobalOrigin, normalizedGeometries: GeometryItem[]}} An object containing the global origin and normalized geometries
 * @remarks
 * Algorithm:
 * 1. Calculate bounds for each geometry based on position and dimensions
 * 2. Find global minimum and maximum X/Y coordinates
 * 3. Calculate global width and height
 * 4. Return normalized geometries with global origin
 * 5. Use 1x1 default if no bounds available
 *
 * @example
 * // Normalize group geometries
 * const result = normalizeGroupShapes(geometries);
 * // Result: { globalOrigin: {...}, normalizedGeometries: [...] }
 */
export function normalizeGroupShapes(geometries: GeometryItem[]): {
    globalOrigin: GlobalOrigin; normalizedGeometries: GeometryItem[];
} {
    // Calculate bounds for each geometry
    const bounds: Bounds[] = geometries.map((geom: GeometryItem) => ({
        minX: safeNumber(geom.pinX) - safeNumber(geom.width) / 2,
        minY: safeNumber(geom.pinY) - safeNumber(geom.height) / 2,
        maxX: safeNumber(geom.pinX) + safeNumber(geom.width) / 2,
        maxY: safeNumber(geom.pinY) + safeNumber(geom.height) / 2
    }));

    // Handle empty geometry case
    if (bounds.length === 0) {
        return {
            globalOrigin: { minX: 0, minY: 0, width: 1, height: 1 },
            normalizedGeometries: geometries
        };
    }

    // Find global bounding box
    const globalMinX: number = Math.min(...bounds.map((b: Bounds) => b.minX));
    const globalMinY: number = Math.min(...bounds.map((b: Bounds) => b.minY));
    const globalMaxX: number = Math.max(...bounds.map((b: Bounds) => b.maxX));
    const globalMaxY: number = Math.max(...bounds.map((b: Bounds) => b.maxY));

    // Calculate global dimensions
    const globalWidth: number = globalMaxX - globalMinX;
    const globalHeight: number = globalMaxY - globalMinY;

    return {
        globalOrigin: {
            minX: globalMinX,
            minY: globalMinY,
            width: globalWidth > 0 ? globalWidth : 1,
            height: globalHeight > 0 ? globalHeight : 1
        },
        normalizedGeometries: geometries
    };
}

/**
 * Creates a combined SVG path from multiple geometries in a group.
 * Merges individual geometry paths into a single path string.
 *
 * @param {VisioSection} geometries - The geometries section containing the shape data to combine
 * @param {string} name - The name for the combined path (used for special processing rules)
 * @returns {string} The combined path string created from all geometries
 * @remarks
 * Special handling for certain shape names (e.g., 'cube') may use local scaling
 * instead of global scaling for path generation.
 *
 * @example
 * // Create combined path from geometries
 * const pathData = createCombinedPathFromGeometries(geometriesSection, 'MyShape');
 * // Result: 'M ... L ... A ...' (SVG path string)
 */
export function createCombinedPathFromGeometries(geometries: VisioSection, name: string): string {
    // Get rows from geometries (each row is a geometry item)
    const multipleGeometries: VisioRow[] = ensureArray(geometries.Row);

    if (multipleGeometries.length === 0) {
        return '';
    }

    // Normalize geometries and get global origin
    const { globalOrigin, normalizedGeometries } = normalizeGroupShapes(multipleGeometries as any);

    let combinedPathData: string = '';

    // Process each geometry individually
    for (const geom of normalizedGeometries) {
        // Create node options for geometry
        const node: PathOptions = {
            pinX: safeNumber(geom.pinX),
            pinY: safeNumber(geom.pinY),
            Width: safeNumber(geom.width),
            Height: safeNumber(geom.height)
        };

        // Some shapes (like cube) use local scaling
        const useLocalScaling: boolean = String(name).toLowerCase() === 'cube';

        // Generate path data for this geometry
        const singlePathData: string = createPathFromGeometry(geom as GeometryWithRows, node, globalOrigin, { useLocalScaling });

        if (singlePathData) {
            combinedPathData += singlePathData + ' ';
        }
    }

    return combinedPathData.trim();
}

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

    // Local scaling functions: scale to geometry dimensions
    const scaleXLocal: (v: number | string | undefined) => number = (v: number | string | undefined): number =>
        roundToPrecisionLocal(safeNumber(v) * width);

    const scaleYLocal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
        const num: number = safeNumber(v);
        return roundToPrecisionLocal((flipY ? 1 - num : num) * height);
    };

    // Global scaling functions: normalize to global bounds
    const scaleXGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
        if (!globalOrigin) { return 0; }
        return roundToPrecisionLocal(
            (shapeOriginX + safeNumber(v) - globalOrigin.minX) / globalOrigin.width
        );
    };

    const scaleYGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
        if (!globalOrigin) { return 0; }
        const absY: number = shapeOriginY + safeNumber(v) - globalOrigin.minY;
        return roundToPrecisionLocal(
            flipY ? (1 - absY / globalOrigin.height) : (absY / globalOrigin.height)
        );
    };

    // Radius scaling functions (for arc operations)
    const radiusXGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
        if (!globalOrigin) { return 0; }
        return roundToPrecisionLocal(safeNumber(v) / globalOrigin.width);
    };

    const radiusYGlobal: (v: number | string | undefined) => number = (v: number | string | undefined): number => {
        if (!globalOrigin) { return 0; }
        return roundToPrecisionLocal(safeNumber(v) / globalOrigin.height);
    };

    const radiusXLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => roundToPrecisionLocal(safeNumber(v));
    const radiusYLocal: (v: number | string | undefined) => number =
        (v: number | string | undefined): number => roundToPrecisionLocal(safeNumber(v));

    // Select appropriate scaling functions
    const scaleX: (v: number | string | undefined) => number = useLocal ? scaleXLocal : scaleXGlobal;
    const scaleY: (v: number | string | undefined) => number = useLocal ? scaleYLocal : scaleYGlobal;
    const radiusX: (v: number | string | undefined) => number = useLocal ? radiusXLocal : radiusXGlobal;
    const radiusY: (v: number | string | undefined) => number = useLocal ? radiusYLocal : radiusYGlobal;

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
        const X: number | undefined = cellMap.get('X');
        const Y: number | undefined = cellMap.get('Y');
        const A: number | undefined = cellMap.get('A');
        const B: number | undefined = cellMap.get('B');
        const C: number | undefined = cellMap.get('C');
        const D: number | undefined = cellMap.get('D');

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
        // Move to position (no line drawn)
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `M ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'RelLineTo':
    case 'LineTo': {
        // Draw line to position
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `L ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'ArcTo': {
        // Draw circular arc from last point to (X, Y)
        const rX: number = Math.abs(X - lastCoords.lastX);
        const rY: number = Math.abs(Y - lastCoords.lastY);
        const r: number = Math.max(rX, rY);
        const aValue: number = A;
        const sweepFlag: number = aValue < 0 ? 1 : 0;
        const largeArcFlag: number = 0;

        lastCoords.lastX = X;
        lastCoords.lastY = Y;

        return `A ${radiusX(r)} ${radiusY(r)} 0 ${largeArcFlag} ${sweepFlag} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'EllipticalArcTo': {
        // Draw elliptical arc with rotation and specific parameters
        const rX: number = Math.abs(X - lastCoords.lastX);
        const rY: number = Math.abs(Y - lastCoords.lastY);
        const r: number = Math.max(rX, rY);
        const xAxisRot: number = C;
        const largeArcFlag: number = 0;
        const sweepFlag: number = flipY ? 0 : 1;

        lastCoords.lastX = X;
        lastCoords.lastY = Y;

        return `A ${radiusX(r)} ${radiusY(r)} ${roundToPrecision(xAxisRot)} ${largeArcFlag} ${sweepFlag} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'RelCubBezTo':
    case 'CubicBezierTo': {
        // Draw cubic Bezier curve with control points (A, B) and (C, D) and end point (X, Y)
        lastCoords.lastX = X;
        lastCoords.lastY = Y;
        return `C ${scaleX(A)} ${scaleY(B)} ${scaleX(C)} ${scaleY(D)} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'QuadBezierTo': {
        // Draw quadratic Bezier curve with control point (A, B) and end point (X, Y)
        return `Q ${scaleX(A)} ${scaleY(B)} ${scaleX(X)} ${scaleY(Y)}`;
    }

    case 'Ellipse': {
        // Draw complete ellipse with radii A and B
        const rx: number = radiusX(A);
        const ry: number = radiusY(B);

        if (rx <= 0 || ry <= 0) { return ''; }

        // Create ellipse using two arc commands
        const cx: number = scaleX(A);
        const cy: number = scaleY(B);
        const startX: number = cx - rx;
        const startY: number = cy;
        const endX: number = cx + rx;
        const endY: number = cy;
        const largeArcFlag: number = 0;
        const sweepFlag: number = 1;

        return `M ${startX} ${startY} A ${rx} ${ry} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} A ${rx} ${ry} 0 ${largeArcFlag} ${sweepFlag} ${startX} ${startY}`;
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

/**
 * Runtime type guard: checks if a value is a valid VisioSection.
 * Used to identify Visio section objects with required structure.
 *
 * @private
 * @param {unknown} value - The value to check
 * @returns {boolean} True if value is a VisioSection, false otherwise
 */
function isVisioSection(value: unknown): value is VisioSection {
    if (!value || typeof value !== 'object') { return false; }
    const section: ParsedXmlObject = value as ParsedXmlObject;
    return '$' in section && 'N' in (section.$ as ParsedXmlObject);
}
