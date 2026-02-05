/**
 * Centralized constants for Visio import/export operations.
 * This file acts as a data dictionary, separating configuration and mappings
 * from application logic to improve maintainability and consistency.
 *
 * The constants are organized into logical sections:
 * - Global constants (units, conversions, defaults)
 * - BPMN properties and shape types
 * - Mapping tables for BPMN elements
 * - Shape categorization and transformations
 * - Line patterns and text styling
 * - Decorator mappings and limitations
 *
 * @module visio-constants
 */

// ============================================================================
// SECTION 1: GLOBAL CONSTANTS
// ============================================================================

/**
 * Constants for unit and angle conversions used throughout Visio processing.
 * These values are essential for converting between Visio's inch-based coordinate
 * system and pixel-based display coordinates, as well as angle measurements.
 *
 * @constant {Object} UNIT_CONVERSION
 * @property {number} SCREEN_DPI - Standard screen resolution (96 DPI)
 * @property {number} PIXEL_CONVERSION_FACTOR - Internal pixel calculation multiplier
 * @property {number} RADIANS_TO_DEGREES - Conversion multiplier for radians to degrees
 * @property {number} DEGREES_TO_RADIANS - Conversion multiplier for degrees to radians
 * @readonly
 */
export const UNIT_CONVERSION: Readonly<{
    SCREEN_DPI: number;
    PIXEL_CONVERSION_FACTOR: number;
    RADIANS_TO_DEGREES: number;
    DEGREES_TO_RADIANS: number;
}> = {
    /** Standard screen density for converting inches to pixels (1 inch = 96 pixels). */
    SCREEN_DPI: 96,
    /** A factor used in certain internal pixel calculations (1 inch = 100 units). */
    PIXEL_CONVERSION_FACTOR: 100,
    /** Conversion factor from radians to degrees (multiply radians by this to get degrees). */
    RADIANS_TO_DEGREES: 180 / Math.PI,
    /** Conversion factor from degrees to radians (multiply degrees by this to get radians). */
    DEGREES_TO_RADIANS: Math.PI / 180
};

/**
 * Default styling values for shapes and text when not specified in the Visio file.
 * These defaults are applied when Visio elements lack explicit style properties,
 * ensuring consistent rendering across imported diagrams.
 *
 * @constant {Object} DEFAULT_STYLES
 * @property {number} FONT_SIZE - Default font size in points
 * @property {string} FONT_FAMILY - Default font family name
 * @property {string} TEXT_COLOR - Default text color
 * @property {string} TEXT_FILL - Default text background fill
 * @property {number} OPACITY - Default opacity (fully opaque)
 * @property {string} STROKE_COLOR - Default stroke/line color
 * @property {number} STROKE_WIDTH - Default stroke width
 * @readonly
 */
export const DEFAULT_STYLES: Readonly<{
    FONT_SIZE: number;
    FONT_FAMILY: string;
    TEXT_COLOR: string;
    TEXT_FILL: string;
    OPACITY: number;
    STROKE_COLOR: string;
    STROKE_WIDTH: number;
}> = {
    /** Default font size in points (10pt) */
    FONT_SIZE: 10,
    /** Default font family name (Calibri) */
    FONT_FAMILY: 'Calibri',
    /** Default text color (Black) */
    TEXT_COLOR: 'Black',
    /** Default text background fill (transparent) */
    TEXT_FILL: 'transparent',
    /** Default opacity level (completely opaque) */
    OPACITY: 1,
    /** Default stroke color (medium gray) */
    STROKE_COLOR: '#757575',
    /** Default stroke width in pixels */
    STROKE_WIDTH: 1
};

/**
 * Default metrics for layout, padding, and geometric precision.
 * These values control the precision of mathematical calculations and spacing
 * around diagram elements during import and rendering.
 *
 * @constant {Object} LAYOUT_METRICS
 * @property {number} PATH_PRECISION - Decimal places for path data values
 * @property {number} PADDING_FOR_GROUP - Padding pixels around grouped shapes
 * @property {number} PADDING_FOR_SHAPE - Padding pixels around individual shapes
 * @readonly
 */
export const LAYOUT_METRICS: Readonly<{
    PATH_PRECISION: number;
    PADDING_FOR_GROUP: number;
    PADDING_FOR_SHAPE: number;
}> = {
    /** Precision for floating-point numbers in path data strings (4 decimal places). */
    PATH_PRECISION: 4,
    /** Padding applied around grouped shapes to maintain spacing (12 pixels). */
    PADDING_FOR_GROUP: 12,
    /** Default padding for individual shapes (no additional padding). */
    PADDING_FOR_SHAPE: 0
};

// ============================================================================
// SECTION 2: BPMN SECTION & PROPERTY NAMES
// ============================================================================

/**
 * Constant names for common Visio XML sections and cells used in BPMN processing.
 * These identify specific sections within Visio shape definitions where BPMN-specific
 * properties, user data, and action information are stored.
 *
 * @constant {Object} BPMN_PROPERTIES
 * @property {string} PROPERTY_SECTION - Section name for BPMN properties
 * @property {string} USER_SECTION - Section name for user-defined data
 * @property {string} RELATIONSHIPS_CELL - Cell name for shape relationships
 * @property {string} VALUE_CELL - Cell name for property values
 * @property {string} ACTIONS_SECTION - Section name for action definitions
 * @readonly
 */
export const BPMN_PROPERTIES: Readonly<{
    PROPERTY_SECTION: string;
    USER_SECTION: string;
    RELATIONSHIPS_CELL: string;
    VALUE_CELL: string;
    ACTIONS_SECTION: string;
}> = {
    /** Section name for BPMN properties ('Property') */
    PROPERTY_SECTION: 'Property',
    /** Section name for user-defined data ('User') */
    USER_SECTION: 'User',
    /** Cell name for shape relationships ('Relationships') */
    RELATIONSHIPS_CELL: 'Relationships',
    /** Cell name for property values ('Value') */
    VALUE_CELL: 'Value',
    /** Section name for action definitions ('Actions') */
    ACTIONS_SECTION: 'Actions'
};

/**
 * Set of valid color transform type names used in theme color modifications.
 * These transforms are applied to theme colors to adjust luminance, saturation,
 * hue, alpha, and other color properties in the diagram styling system.
 *
 * @constant {Set<string>} VALID_TYPES
 * @remarks
 * Supported transforms include:
 * - Luminance modifiers: lumMod, lumOff
 * - Saturation modifiers: satMod, satOff
 * - Hue modifiers: hueMod, hueOff, hueShift
 * - Alpha (opacity) modifiers: alpha, alphaMod, alphaOff
 * - Tint and shade operations: tint, shade
 */
export const VALID_TYPES: Set<string> = new Set<string>([
    'lumMod',      // Luminance modulation
    'lumOff',      // Luminance offset
    'satMod',      // Saturation modulation
    'satOff',      // Saturation offset
    'hueMod',      // Hue modulation
    'hueOff',      // Hue offset
    'tint',        // Tint (lighten with white)
    'shade',       // Shade (darken with black)
    'alpha',       // Alpha (opacity) value
    'alphaMod',    // Alpha modulation
    'alphaOff',    // Alpha offset
    'hueShift'     // Hue shift
]);

/**
 * Type definition for keys used in color transformation operations.
 * Represents all valid color transform property names.
 *
 * @typedef {string} TransformKey
 * @private
 */
export type TransformKey =
    | 'shade' | 'tint'
    | 'lumMod' | 'lumOff'
    | 'satMod' | 'satOff'
    | 'hueMod' | 'hueOff' | 'hueShift'
    | 'alpha' | 'alphaMod' | 'alphaOff';

/**
 * Standard BPMN shape types used for classification and categorization.
 * These define the primary categories of BPMN elements that can appear in diagrams,
 * helping organize shape processing logic by element type.
 *
 * @constant {Object} BPMN_SHAPE_TYPES
 * @property {string} EVENT - BPMN event shapes (start, intermediate, end)
 * @property {string} GATEWAY - BPMN gateway decision shapes
 * @property {string} ACTIVITY - BPMN task and process activity shapes
 * @property {string} DATA_OBJECT - BPMN data object shapes
 * @property {string} DATA_SOURCE - BPMN data source/store shapes
 * @property {string} TEXT_ANNOTATION - BPMN text annotation shapes
 * @property {string} MESSAGE - BPMN message flow shapes
 * @property {string} GROUP - BPMN grouping container shapes
 * @readonly
 */
export const BPMN_SHAPE_TYPES: Readonly<{
    EVENT: string;
    GATEWAY: string;
    ACTIVITY: string;
    DATA_OBJECT: string;
    DATA_SOURCE: string;
    TEXT_ANNOTATION: string;
    MESSAGE: string;
    GROUP: string;
}> = {
    /** Event shapes include start events, intermediate events, and end events */
    EVENT: 'Event',
    /** Gateway shapes for decision points and divergence */
    GATEWAY: 'Gateway',
    /** Activity shapes including tasks, sub-processes */
    ACTIVITY: 'Activity',
    /** Data object shapes for data inputs/outputs */
    DATA_OBJECT: 'DataObject',
    /** Data source or database shapes */
    DATA_SOURCE: 'DataSource',
    /** Text annotation shapes for additional documentation */
    TEXT_ANNOTATION: 'TextAnnotation',
    /** Message flow indicators */
    MESSAGE: 'Message',
    /** Grouping container shapes */
    GROUP: 'Group'
};

// ============================================================================
// SECTION 3: BPMN MAPPING TABLES
// ============================================================================

/**
 * Maps Visio's internal event names to standardized BPMN event types.
 * When Visio represents BPMN events with non-standard naming conventions,
 * this mapping translates them to the canonical BPMN event type names.
 *
 * @constant {Object} EVENT_NAME_MAP
 * @property {string} 'start(non-interrupting)' - Non-interrupting start event
 * @property {string} 'intermediate(non-interrupting)' - Non-interrupting intermediate event
 * @property {string} 'intermediate(throwing)' - Throwing intermediate event
 * @readonly
 * @example
 * // Maps Visio event names to BPMN standard names
 * const bpmnType = EVENT_NAME_MAP['start(non-interrupting)'];
 * // Result: 'NonInterruptingStart'
 */
export const EVENT_NAME_MAP: Readonly<Record<string, string>> = {
    /** Non-interrupting start event type */
    'start(non-interrupting)': 'NonInterruptingStart',
    /** Non-interrupting intermediate event type */
    'intermediate(non-interrupting)': 'NonInterruptingIntermediate',
    /** Throwing intermediate event type */
    'intermediate(throwing)': 'ThrowingIntermediate'
};

/**
 * Maps Visio's internal trigger names to standardized BPMN trigger types.
 * Trigger names define what causes an event to activate in the process flow.
 * This mapping normalizes Visio's naming to BPMN standard names.
 *
 * @constant {Object} TRIGGER_MAP
 * @property {string} 'parallelmultiple' - Parallel multiple trigger type
 * @readonly
 * @example
 * // Maps Visio trigger names to BPMN standard names
 * const bpmnTrigger = TRIGGER_MAP['parallelmultiple'];
 * // Result: 'Parallel'
 */
export const TRIGGER_MAP: Readonly<Record<string, string>> = {
    /** Parallel multiple trigger type normalized to 'Parallel' */
    'parallelmultiple': 'Parallel'
};

/**
 * Maps Visio's gateway names to standardized BPMN gateway types.
 * Gateways control flow splitting and merging in BPMN processes.
 * This mapping converts various Visio naming conventions to standard gateway types.
 *
 * @constant {Object} GATEWAY_MAP
 * @property {string} 'exclusive' - Exclusive gateway (default behavior)
 * @property {string} 'inclusive' - Inclusive gateway
 * @property {string} 'parallel' - Parallel gateway
 * @property {string} 'complex' - Complex gateway
 * @property {string} 'event' - Event-based gateway
 * @property {string} 'eventbased' - Alternative event-based gateway naming
 * @property {string} 'exclusiveevent(instantiate)' - Exclusive event-based instantiation
 * @property {string} 'parallelevent(instantiate)' - Parallel event-based instantiation
 * @readonly
 * @example
 * // Maps Visio gateway names to BPMN standard names
 * const bpmnGateway = GATEWAY_MAP['inclusive'];
 * // Result: 'Inclusive'
 */
export const GATEWAY_MAP: Readonly<Record<string, string>> = {
    /** Exclusive gateway type (default) */
    'exclusive': 'None',
    /** Inclusive gateway type */
    'inclusive': 'Inclusive',
    /** Parallel gateway type */
    'parallel': 'Parallel',
    /** Complex gateway type */
    'complex': 'Complex',
    /** Event-based gateway type */
    'event': 'EventBased',
    /** Alternative naming for event-based gateway */
    'eventbased': 'Exclusive',
    /** Exclusive event-based instantiation gateway */
    'exclusiveevent(instantiate)': 'ExclusiveEventBased',
    /** Parallel event-based instantiation gateway */
    'parallelevent(instantiate)': 'ParallelEventBased'
};

/**
 * Maps Visio's loop type names to standardized BPMN loop types.
 * Loop types define how activities can be repeated in a process.
 * This mapping normalizes various naming conventions to BPMN standard loop types.
 *
 * @constant {Object} LOOP_TYPE_MAP
 * @property {string} 'none' - No looping
 * @property {string} 'standard' - Standard loop
 * @property {string} 'parallelmultiinstance' - Parallel multi-instance loop
 * @property {string} 'sequentialmultiinstance' - Sequential multi-instance loop
 * @readonly
 * @example
 * // Maps Visio loop type names to BPMN standard names
 * const bpmnLoop = LOOP_TYPE_MAP['standard'];
 * // Result: 'Standard'
 */
export const LOOP_TYPE_MAP: Readonly<Record<string, string>> = {
    /** No looping */
    'none': 'None',
    /** Standard loop type */
    'standard': 'Standard',
    /** Parallel multi-instance loop type */
    'parallelmultiinstance': 'ParallelMultiInstance',
    /** Sequential multi-instance loop type */
    'sequentialmultiinstance': 'SequenceMultiInstance'
};

/**
 * Type definition for annotation orientation values.
 * Defines the valid positions where annotations can be placed relative to a shape.
 *
 * @typedef {string} Orientation
 * @private
 */
type Orientation = 'Top' | 'Bottom' | 'Left' | 'Right';

/**
 * Maps Visio's numeric orientation codes to human-readable orientation strings.
 * Used to interpret Visio's binary orientation flags and convert them to
 * directional values that describe where annotations are positioned.
 *
 * @constant {Object} ORIENTATION_MAP
 * @property {string} '1' - Right orientation
 * @property {string} '2' - Top orientation
 * @property {string} '3' - Left orientation
 * @property {string} '4' - Bottom orientation
 * @readonly
 * @example
 * // Maps Visio numeric codes to orientation strings
 * const orientation = ORIENTATION_MAP['2'];
 * // Result: 'Top'
 */
export const ORIENTATION_MAP: Readonly<Record<string, Orientation>> = {
    /** Right orientation (numeric code 1) */
    '1': 'Right',
    /** Top orientation (numeric code 2) */
    '2': 'Top',
    /** Left orientation (numeric code 3) */
    '3': 'Left',
    /** Bottom orientation (numeric code 4) */
    '4': 'Bottom'
};

// ============================================================================
// SECTION 4: SHAPE CATEGORIZATION
// ============================================================================

/**
 * Collections of shape names used for quick categorization during processing.
 * Organizing shapes into categories enables efficient filtering and specialized
 * handling based on shape type during import operations.
 *
 * @constant {Object} SHAPE_CATEGORIES
 * @property {Set<string>} BASIC - Basic geometric shapes
 * @property {Set<string>} FLOW - Flowchart-specific shapes
 * @property {Set<string>} BPMN - BPMN process diagram shapes
 * @readonly
 */
export const SHAPE_CATEGORIES: Readonly<{
    BASIC: Set<string>;
    FLOW: Set<string>;
    BPMN: Set<string>;
}> = {
    /**
     * Basic geometric shapes supported by the diagram component.
     * These are fundamental shapes used to create diagrams.
     */
    BASIC: new Set<string>([
        'Rectangle',      // Rectangular shapes
        'Ellipse',        // Circular and oval shapes
        'Triangle',       // Three-sided shapes
        'Pentagon',       // Five-sided shapes
        'Heptagon',       // Seven-sided shapes
        'Octagon',        // Eight-sided shapes
        'Trapezoid',      // Four-sided shapes with parallel sides
        'Decagon',        // Ten-sided shapes
        'RightTriangle',  // Right-angled triangle shapes
        'Parallelogram',  // Four-sided shapes with parallel opposite sides
        'Hexagon',        // Six-sided shapes
        'Cylinder',       // 3D cylindrical shapes
        'Diamond',        // Diamond-shaped (rotated square)
        'Polygon',        // Generic polygon shapes
        'Star',           // Star-shaped polygons
        'Plus'            // Plus/cross-shaped symbols
    ]),
    /**
     * Standard flowchart shapes used in process flow diagrams.
     * These shapes represent different process elements in flowcharts.
     */
    FLOW: new Set<string>([
        'Terminator',           // Start/end points
        'Process',              // Process steps
        'Decision',             // Decision points (diamonds)
        'Document',             // Document elements
        'Data',                 // Data elements
        'Or',                   // OR logic symbols
        'Collate',              // Data collation points
        'Merge',                // Flow merge points
        'Extract',              // Data extraction points
        'Sort',                 // Data sorting points
        'SummingJunction',      // Summation/junction points
        'MultiDocument',        // Multiple document stacks
        'OffPageReference',     // Off-page reference indicators
        'PreDefinedProcess',    // Pre-defined process symbols
        'DirectData',           // Direct database access
        'SequentialData',       // Sequential data access
        'PaperTap',             // Paper tape symbols
        'Card',                 // Card input/output symbols
        'ManualOperation',      // Manual operation symbols
        'StoredData',           // Stored data symbols
        'Preparation',          // Preparation step symbols
        'Display',              // Display/output symbols
        'Delay'                 // Delay indicators
    ]),
    /**
     * Standard BPMN process diagram shapes.
     * These shapes represent elements specific to Business Process Model and Notation.
     */
    BPMN: new Set<string>([
        'StartEvent',           // Process start event
        'EndEvent',             // Process end event
        'IntermediateEvent',    // Intermediate process events
        'Gateway',              // Process gateway/decision points
        'DataStore',            // Data storage elements
        'DataObject',           // Data object elements
        'TextAnnotation',       // Text annotations
        'Task',                 // Process task elements
        'CollapsedSubProcess',  // Collapsed sub-process
        'ExpandedSubProcess',   // Expanded sub-process
        'Group',                // Process grouping containers
        'Message'               // Message flow indicators
    ])
};

// ============================================================================
// SECTION 5: SHAPE TRANSFORMATIONS
// ============================================================================

/**
 * Maps legacy or alternative Visio shape names to their modern flowchart equivalents.
 * This enables backward compatibility with older Visio files that may use
 * deprecated or non-standard shape naming conventions.
 *
 * @constant {Map<string, string>} SHAPE_TRANSFORMATIONS
 * @remarks
 * When processing shapes, if a shape name is found in this map, it is renamed
 * to its mapped equivalent before further processing.
 *
 * @example
 * // Transform legacy shape names to modern equivalents
 * const modernName = SHAPE_TRANSFORMATIONS.get('Subprocess');
 * // Result: 'PreDefinedProcess'
 */
export const SHAPE_TRANSFORMATIONS: Readonly<Map<string, string>> = new Map([
    ['Subprocess', 'PreDefinedProcess'],          // Legacy subprocess to pre-defined process
    ['MagneticTape', 'SequentialData'],           // Magnetic tape to sequential data
    ['Database', 'DirectData'],                   // Database to direct data
    ['Microform', 'PaperTap'],                    // Microform to paper tape
    ['custom3', 'Card'],                          // Custom shape 3 to card
    ['custom2', 'ManualOperation'],               // Custom shape 2 to manual operation
    ['Start/End', 'Terminator'],                  // Start/End to terminator
    ['ExternalData', 'StoredData'],               // External data to stored data
    ['Custom4', 'Preparation']                    // Custom shape 4 to preparation
]);

/**
 * Maps alternative basic shape names to their standardized equivalents.
 * Handles alternative naming conventions for basic geometric shapes
 * that may appear in different Visio versions or custom templates.
 *
 * @constant {Map<string, string>} BASIC_TRANSFORMATIONS
 * @remarks
 * Similar to SHAPE_TRANSFORMATIONS but specifically for basic geometric shapes.
 * Applied when processing shape names that may have alternative naming conventions.
 *
 * @example
 * // Transform alternative shape names to standard names
 * const standardName = BASIC_TRANSFORMATIONS.get('Circle');
 * // Result: 'Ellipse'
 */
export const BASIC_TRANSFORMATIONS: Readonly<Map<string, string>> = new Map([
    ['Cross', 'Plus'],          // Cross symbol to plus sign
    ['5PointStar', 'Star'],     // Five-point star to standard star
    ['Circle', 'Ellipse'],      // Circle to ellipse
    ['Can', 'Cylinder']         // Can shape to cylinder
]);

// ============================================================================
// SECTION 6: LINE PATTERN MAPPINGS
// ============================================================================

/**
 * Maps Visio's numeric line pattern IDs to their corresponding SVG `stroke-dasharray` values.
 * Line patterns define dashing patterns for connector and shape borders.
 *
 * The SVG stroke-dasharray format uses space-separated numbers representing
 * the length of dashes and gaps in pixels. For example, '4 2' means 4px dash, 2px gap.
 *
 * @constant {Object} LINE_PATTERN_MAP
 * @remarks
 * Key: Visio line pattern ID (string, from 0-23).
 * Value: SVG stroke-dasharray string representation.
 *
 * Pattern descriptions:
 * - Solid lines: No entry (empty stroke-dasharray)
 * - Dashed: Various dash and gap combinations
 * - Dotted: Small dashes with regular spacing
 * - Complex patterns: Multiple dash/gap sequences
 *
 * @example
 * // Get the SVG dash pattern for Visio line pattern ID
 * const dashArray = LINE_PATTERN_MAP['2'];
 * // Result: '4 2' (medium dashes with small gaps)
 */
export const LINE_PATTERN_MAP: Readonly<Record<string, string>> = {
    /** Pattern 2: Medium dashes with small gaps */
    '2': '4 2',
    /** Pattern 3: Small dashes with small gaps */
    '3': '1 2',
    /** Pattern 4: Dash-dot pattern */
    '4': '4 2 1 2',
    /** Pattern 5: Complex dash-dot pattern */
    '5': '4 2 1 2 1 2',
    /** Pattern 6: Double dash-dot pattern */
    '6': '4 2 4 2 1 2',
    /** Pattern 7: Large dashes with small gaps */
    '7': '8 2 2 2',
    /** Pattern 8: Large dashes with multiple small gaps */
    '8': '8 2 2 2 2 2',
    /** Pattern 9: Simple dot pattern */
    '9': '2 2',
    /** Pattern 10: Very small dashes and gaps */
    '10': '1 1',
    /** Pattern 11: Dot-dash pattern */
    '11': '2 2 1 2',
    /** Pattern 12: Complex dot-dash pattern */
    '12': '2 2 1 2 1 2',
    /** Pattern 13: Double dot-dash pattern */
    '13': '2 2 2 2 1 2',
    /** Pattern 14: Medium dash-dot pattern */
    '14': '4 2 2 2',
    /** Pattern 15: Complex medium dash pattern */
    '15': '4 2 2 2 2 2',
    /** Pattern 16: Large dashes with equal gaps */
    '16': '8 4 8',
    /** Pattern 17: Dash with large gap */
    '17': '1 4',
    /** Pattern 18: Large dash with dot and gap */
    '18': '8 4 1 4',
    /** Pattern 19: Large dash with dots */
    '19': '8 2 1 2 1 2',
    /** Pattern 20: Large dashes with multiple dots */
    '20': '8 2 8 2 1 2',
    /** Pattern 21: Very large dashes with pattern */
    '21': '16 2 4 2',
    /** Pattern 22: Very large dashes with complex pattern */
    '22': '16 2 4 2 4 2',
    /** Pattern 23: Medium dashes repeated */
    '23': '4 2 4 2'
};

// ============================================================================
// SECTION 7: TEXT STYLE FLAGS
// ============================================================================

/**
 * Bitwise flags for text styling extracted from Visio's text properties.
 * Used to determine which text styling options (bold, italic, underline) are applied.
 *
 * These flags are typically stored in Visio's 'Style' cell as a single numeric value
 * where each bit represents a specific style. Bitwise AND operations extract individual flags.
 *
 * @enum {number}
 * @remarks
 * Example: A style value of 3 means both BOLD (1) and ITALIC (2) are applied.
 * Use bitwise AND to check: (styleValue & VisioTextStyleFlag.BOLD) !== 0
 *
 * @example
 * // Check if text is bold
 * const styleCode = 5; // represents BOLD (1) + UNDERLINE (4)
 * const isBold = (styleCode & VisioTextStyleFlag.BOLD) !== 0; // true
 * const isItalic = (styleCode & VisioTextStyleFlag.ITALIC) !== 0; // false
 */
export enum VisioTextStyleFlag {
    /** Bold text flag (bit 0, value 1) */
    BOLD = 1,
    /** Italic text flag (bit 1, value 2) */
    ITALIC = 2,
    /** Underline text flag (bit 2, value 4) */
    UNDERLINE = 4
}

/**
 * Maps Visio's numeric codes for horizontal text alignment.
 *
 * Refactored from an enum to a const object. This is a modern TypeScript
 * best practice that avoids enum overhead while providing the same type safety.
 * Used to interpret Visio's horizontal alignment cell values.
 *
 * @constant {Object} VisioHorizontalAlignValue
 * @property {string} LEFT - Left alignment code
 * @property {string} CENTER - Center alignment code
 * @property {string} RIGHT - Right alignment code
 * @property {string} JUSTIFY - Justified alignment code
 * @readonly
 * @remarks
 * These numeric strings match Visio's internal alignment cell values.
 *
 * @example
 * // Get horizontal alignment from Visio cell value
 * const alignValue = VisioHorizontalAlignValue.CENTER;
 * // Result: '1'
 */
export const VisioHorizontalAlignValue: Readonly<{
    LEFT: string;
    CENTER: string;
    RIGHT: string;
    JUSTIFY: string;
}> = {
    /** Left alignment (Visio code '0') */
    LEFT: '0',
    /** Center alignment (Visio code '1') */
    CENTER: '1',
    /** Right alignment (Visio code '2') */
    RIGHT: '2',
    /** Justified alignment (Visio code '3') */
    JUSTIFY: '3'
};

/**
 * Maps Visio's numeric codes for vertical text alignment.
 * Used to interpret Visio's vertical alignment cell values.
 *
 * @constant {Object} VisioVerticalAlignValue
 * @property {string} TOP - Top alignment code
 * @property {string} CENTER - Center alignment code
 * @property {string} BOTTOM - Bottom alignment code
 * @readonly
 * @remarks
 * These numeric strings match Visio's internal alignment cell values.
 *
 * @example
 * // Get vertical alignment from Visio cell value
 * const alignValue = VisioVerticalAlignValue.CENTER;
 * // Result: '1'
 */
export const VisioVerticalAlignValue: Readonly<{
    TOP: string;
    CENTER: string;
    BOTTOM: string;
}> = {
    /** Top alignment (Visio code '0') */
    TOP: '0',
    /** Center alignment (Visio code '1') */
    CENTER: '1',
    /** Bottom alignment (Visio code '2') */
    BOTTOM: '2'
};

// ============================================================================
// SECTION 8: DECORATOR SHAPE MAPPINGS
// ============================================================================

/**
 * Maps Visio's numeric decorator (arrowhead) IDs to their equivalent shape names.
 * Decorators are symbols displayed at the beginning or end of connectors.
 *
 * When a connector's 'EndArrow' or 'BeginArrow' cell contains a numeric code,
 * this map translates that code to a standardized decorator shape name used in Syncfusion.
 *
 * @constant {Object} DECORATOR_SHAPE_MAP
 * @remarks
 * Key: Numeric ID from Visio's EndArrow or BeginArrow cell.
 * Value: Standardized decorator shape name.
 *
 * Some Visio IDs may map to the same shape (e.g., 2, 4, 13 all map to 'Arrow')
 * to handle variations in Visio's internal representation.
 *
 * @example
 * // Get decorator shape from Visio arrow code
 * const shape = DECORATOR_SHAPE_MAP[4];
 * // Result: 'Arrow'
 */
export const DECORATOR_SHAPE_MAP: Readonly<Record<number, string>> = {
    /** Arrow code 0: No decorator */
    0: 'None',
    /** Arrow code 2: Standard arrow */
    2: 'Arrow',
    /** Arrow code 3: Open arrow (not filled) */
    3: 'OpenArrow',
    /** Arrow code 4: Standard arrow (alternate code) */
    4: 'Arrow',
    /** Arrow code 5: Indented/skewed arrow */
    5: 'IndentedArrow',
    /** Arrow code 6: Outdented/reverse skewed arrow */
    6: 'OutdentedArrow',
    /** Arrow code 7: Open feather/fork arrow */
    7: 'OpenFetch',
    /** Arrow code 8: Filled feather/fork arrow */
    8: 'Fletch',
    /** Arrow code 11: Square decorator */
    11: 'Square',
    /** Arrow code 13: Standard arrow (alternate code) */
    13: 'Arrow',
    /** Arrow code 22: Diamond decorator */
    22: 'Diamond',
    /** Arrow code 39: Double-headed arrow */
    39: 'DoubleArrow',
    /** Arrow code 42: Circular decorator */
    42: 'Circle'
};

// ============================================================================
// SECTION 9: DECORATOR SIZE TABLES
// ============================================================================

/**
 * Maps standardized decorator shape names to arrays of possible sizes.
 * Defines the dimensions (width and height) for each decorator at different size levels.
 *
 * The index into each array corresponds to Visio's EndArrowSize or BeginArrowSize cell value.
 * For example, size index 0 is the smallest, and index 6 is the largest.
 *
 * @constant {Object} DECORATOR_SIZE_MAP
 * @remarks
 * Key: Lowercase decorator shape name (e.g., 'arrow', 'square', 'diamond').
 * Value: Array of objects with width and height properties, indexed by size level (0-6).
 *
 * Dimensions are provided for 7 size levels:
 * - Index 0: Extra small (4-15 px)
 * - Index 1: Very small (5-18 px)
 * - Index 2: Small (6-20 px)
 * - Index 3: Small-medium (8-25 px)
 * - Index 4: Medium (10-30 px)
 * - Index 5: Large (20-60 px)
 * - Index 6: Extra large (40-120 px)
 *
 * @example
 * // Get dimensions for medium-sized arrow
 * const size = DECORATOR_SIZE_MAP['arrow'][4];
 * // Result: { width: 12.5, height: 12.5 }
 */
export const DECORATOR_SIZE_MAP: Readonly<Record<string, Array<{ width: number; height: number }>>> = {
    /** Arrow decorator size levels */
    arrow: [
        { width: 4, height: 4 },        // Size 0: 4x4 (extra small)
        { width: 6, height: 6 },        // Size 1: 6x6 (very small)
        { width: 8, height: 8 },        // Size 2: 8x8 (small)
        { width: 10, height: 10 },      // Size 3: 10x10 (small-medium)
        { width: 12.5, height: 12.5 },  // Size 4: 12.5x12.5 (medium)
        { width: 25, height: 25 },      // Size 5: 25x25 (large)
        { width: 50, height: 50 }       // Size 6: 50x50 (extra large)
    ],
    /** Square decorator size levels */
    square: [
        { width: 4, height: 4 },        // Size 0: 4x4 (extra small)
        { width: 5, height: 5 },        // Size 1: 5x5 (very small)
        { width: 6, height: 6 },        // Size 2: 6x6 (small)
        { width: 8, height: 8 },        // Size 3: 8x8 (small-medium)
        { width: 10, height: 10 },      // Size 4: 10x10 (medium)
        { width: 20, height: 20 },      // Size 5: 20x20 (large)
        { width: 40, height: 40 }       // Size 6: 40x40 (extra large)
    ],
    /** Diamond decorator size levels */
    diamond: [
        { width: 15, height: 8 },       // Size 0: 15x8 (extra small)
        { width: 18, height: 9 },       // Size 1: 18x9 (very small)
        { width: 20, height: 11 },      // Size 2: 20x11 (small)
        { width: 25, height: 13 },      // Size 3: 25x13 (small-medium)
        { width: 30, height: 15 },      // Size 4: 30x15 (medium)
        { width: 60, height: 30 },      // Size 5: 60x30 (large)
        { width: 120, height: 60 }      // Size 6: 120x60 (extra large)
    ]
};

// ============================================================================
// SECTION 10: IMPORT/EXPORT LIMITATIONS
// ============================================================================

/**
 * Lists known limitations when importing/exporting Visio files.
 * Documents features and properties that are not supported or have limited support
 * in the Visio import/export functionality, helping developers understand
 * what to expect and what might differ from the original Visio file.
 *
 * The array is organized with prefixes indicating the category of limitation:
 * - DiagramProp: Diagram-level properties
 * - NodeProp: Shape/node-level properties
 * - ConnectorProp: Connector/line-level properties
 *
 * Each entry is prefixed with a unique identifier (DiagramProp1, NodeProp5, etc.)
 * for tracking and documentation purposes.
 *
 * @constant {string[]} IMPORT_LIMITATIONS
 * @readonly
 * @remarks
 * These limitations should be communicated to users when they import or export
 * Visio files to set proper expectations about visual and functional differences.
 *
 * @example
 * // Check limitations during import processing
 * console.warn('Known limitations:', IMPORT_LIMITATIONS);
 */
export const IMPORT_LIMITATIONS: string[] = [
    // ========== DIAGRAM-LEVEL LIMITATIONS ==========

    /** Segment thumb customization not supported */
    'DiagramProp1: Segment thumb customization is not supported in Visio.',
    /** Context menu settings not preserved during import/export */
    'DiagramProp2: Context menu settings are not preserved.',
    /** Constraints and interaction modes ignored */
    'DiagramProp3: Constraints and interaction modes are ignored.',
    /** Automatic port creation not supported */
    'DiagramProp4: Automatic port creation is not supported.',
    /** Page-level editing features not preserved */
    'DiagramProp5: Page-level editing features are not preserved.',
    /** Tooltip settings not imported or exported */
    'DiagramProp6: Tooltip settings are not imported or exported.',
    /** Undo/Redo features not preserved */
    'DiagramProp7: Undo/Redo features are not preserved.',
    /** Zoom and scroll settings partially preserved */
    'DiagramProp8: Zoom and scroll settings are not fully preserved.',
    /** Tool customization not supported */
    'DiagramProp9: Tool customization is not supported.',
    /** Bridge direction not preserved */
    'DiagramProp10: Bridge direction is not preserved.',
    /** Only solid background colors, no gradients */
    'DiagramProp11: Only solid background colors supported, not gradients.',
    /** Grid and snap settings not fully compatible */
    'DiagramProp12: Grid and snap settings are not fully compatible.',
    /** Ruler settings approximated */
    'DiagramProp13: Ruler settings are approximated.',
    /** Page margins may require adjustment */
    'DiagramProp14: Page settings like margin may require adjustment.',
    /** Limited layer support */
    'DiagramProp15: Layering is limited (no multi-layer assignment).',
    /** Templates not imported or exported */
    'DiagramProp16: Templates are not imported or exported.',
    /** Custom property access not supported */
    'DiagramProp17: Custom property access is not supported.',
    /** Selection updates not preserved */
    'DiagramProp18: Selection updates are not preserved.',
    /** Zooming settings application-level */
    'DiagramProp19: Zooming settings are application-level.',
    /** Layout settings not imported */
    'DiagramProp20: Layout and model settings are not imported.',
    /** Command manager not supported */
    'DiagramProp21: Command manager is not supported.',

    // ========== NODE/SHAPE-LEVEL LIMITATIONS ==========

    /** Some shapes render differently */
    'NodeProp1: Some shape appearances differ (Parallelogram, Trapezoid, etc.).',
    /** Complex shapes render as paths */
    'NodeProp2: Shapes beyond 13 basic and 29 flow shapes render as paths.',
    /** Visio doesn't expose shape type directly */
    'NodeProp3: Visio does not expose shape type directly.',
    /** Grouped shapes not yet handled */
    'NodeProp4: Grouped shapes are not yet handled.',
    /** Gradient fills approximated */
    'NodeProp5: Gradient fills are approximated.',
    /** Only linear and radial gradients */
    'NodeProp6: Only linear and radial gradients supported.',
    /** Pattern fills not supported */
    'NodeProp7: Pattern fills are not supported.',
    /** Line gradients not supported */
    'NodeProp8: Line gradients are not supported.',
    /** Compound types not supported */
    'NodeProp9: Compound types are not supported.',
    /** Dashed patterns partially match */
    'NodeProp10: Dashed patterns partially match.',
    /** Cap type adjustment limited */
    'NodeProp11: Cap type adjustment only for rectangles.',
    /** Rounded ends simulation not available */
    'NodeProp12: No support for rounded ends simulation.',
    /** Shadow effects limited */
    'NodeProp13: Shadow effects have limited support.',
    /** Only outer shadows supported */
    'NodeProp14: Only outer shadows supported (no offset center).',
    /** Theme colors replicated, not patterns */
    'NodeProp15: Only theme colors replicated, not patterns.',
    /** Protection categories partially supported */
    'NodeProp16: Several protection categories not supported.',
    /** XY drag constraints not individually supported */
    'NodeProp17: Individual XY drag constraints not supported.',
    /** Stroke color applied internally to BPMN */
    'NodeProp18: Shape stroke color applied internally to BPMN elements.',
    /** Text annotations must be on same layer */
    'NodeProp19: Text annotations must be on same layer as target.',
    /** BPMN shapes visually differ */
    'NodeProp20: BPMN shapes visually differ.',

    // ========== CONNECTOR-LEVEL LIMITATIONS ==========

    /** No explicit connector type identifier */
    'ConnectorProp1: No explicit connector type identifier.',
    /** Only arc line jump style */
    'ConnectorProp2: Only arc line jump style supported.',
    /** Only horizontal line jumps */
    'ConnectorProp3: Only horizontal line jumps supported.',
    /** Drag constraints fully disabled if axis locked */
    'ConnectorProp4: Drag constraints fully disabled if any axis locked.',
    /** Bezier curves approximated */
    'ConnectorProp5: Bezier curves approximated.',
    /** Connector gradient not supported */
    'ConnectorProp6: Connector gradient not supported.',
    /** Limited decorator shapes */
    'ConnectorProp7: Limited decorator shapes (12 of 45).',
    /** Decorator sizes approximated */
    'ConnectorProp8: Decorator sizes approximated.',
    /** Gradient support differs */
    'ConnectorProp9: Gradient support differs.',
    /** Gradients approximated */
    'ConnectorProp10: Gradients approximated.',
    /** Connector routing constrained */
    'ConnectorProp11: Connector routing constrained by geometry data.',
    /** Stroke dash arrays differ */
    'ConnectorProp12: Stroke dash arrays differ.',
    /** Compound type and cap type not supported */
    'ConnectorProp13: Compound type and cap type not supported.',
    /** Corner radius differs */
    'ConnectorProp14: Corner radius differs.'
];
