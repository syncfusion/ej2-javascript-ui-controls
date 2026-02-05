import { AnnotationConstraints, FlipDirection, NodeConstraints } from '../../enum/enum';
import { PointModel } from '../../primitives/point-model';
import { VisioMarginModel, VisioTextAlignmentModel, VisioTextDecorationModel } from './visio-annotations';
import { ParsingContext } from './visio-import-export';
import { VisioNodeShadow } from './visio-models';
import { SrgbColor } from './visio-theme';

/**
 * Centralized Visio type definitions to eliminate duplication across modules.
 * This file serves as the single source of truth for all Visio structure interfaces,
 * providing consistent typing for XML parsing, data transformation, and diagram rendering.
 *
 * Organization:
 * - Section 1: XML parsing types (ZIP/XML structures)
 * - Section 2: Theme types (colors, fonts, styles)
 * - Section 3: Coordinate and point types
 * - Section 4: Gradient and styling types
 * - Section 5: Parsed output types
 * - Section 6: Utility types
 * - Section 7: Connector types
 * - Section 8: BPMN shapes (discriminated union)
 * - Section 9: Geometry and path types
 * - Section 10: Annotation and text binding types
 * - Section 11: Connector geometry utilities
 * - Section 12: UML shape types
 *
 * @private
 */

// ============================================================================
// Shared Helper Types
// ============================================================================

/**
 * Helper alias to express fields that can be a single item or an array of items.
 * Useful for XML-to-JSON conversions where elements may repeat or appear as singles.
 *
 * @typedef {(T | T[])} OneOrMany
 * @template T - The element type.
 *
 * @example
 * type Rows = OneOrMany<VisioRow>; // Can be single Row or Row[]
 *
 * @private
 */
export type OneOrMany<T> = T | T[];

/**
 * Helper alias for typical Visio/DrawingML scalar values.
 * Values may appear as direct primitives or wrapped in an object with a `value` field
 * depending on how the XML is parsed.
 *
 * @typedef ValueLike
 * @type {(string | number | {value: string})}
 *
 * @example
 * const val: ValueLike = "100"; // Direct string
 * const val2: ValueLike = { value: "100" }; // Wrapped in object
 *
 * @private
 */
export type ValueLike = string | number | { value: string };

// ============================================================================
// SECTION 1: XML STRUCTURE TYPES (ZIP/XML Parsing)
// ============================================================================

/**
 * Represents cell attributes from Visio XML.
 * XML attributes are parsed into this structure during document loading.
 *
 * Properties:
 * - `N`: Cell Name (e.g., 'LineWeight', 'FillForegnd')
 * - `V`: Cell Value (the actual data)
 * - `F`: Optional Formula that generates the value
 * - `U`: Optional Unit specification
 *
 * @interface CellAttribute
 *
 * @example
 * const attr: CellAttribute = {
 *     N: 'LineWeight',
 *     V: '2 pt',
 *     F: 'GUARD(2 pt)',
 *     U: 'pt'
 * };
 *
 * @private
 */
export interface CellAttribute {
    /** Cell name identifier */
    N: string;
    /** Cell value */
    V: CellMapValue;
    /** Optional formula that generates the value */
    F?: string;
    /** Optional unit specification */
    U?: string;
}

/**
 * Represents a single `<Cell>` element from Visio XML.
 * Cells are the basic data storage units in Visio, containing attributes and values.
 *
 * The `$` property is a common XML-to-JSON parsing convention that holds element attributes.
 *
 * @interface VisioCell
 *
 * @example
 * const cell: VisioCell = {
 *     $: { N: 'LineWeight', V: '2 pt' }
 * };
 *
 * @private
 */
export interface VisioCell {
    /** Cell attributes (XML element attributes) */
    readonly $: CellAttribute;
}

/**
 * Represents a `<Row>` element in Visio XML.
 * Rows are collections of cells typically representing a single record or data entity.
 *
 * Properties:
 * - `N`: Row name/identifier
 * - `T`: Row type (used for geometry shapes, connection points, etc.)
 * - `IX`: Index within the section
 * - `Del`: Deleted flag ('1' indicates deleted)
 *
 * @interface VisioRow
 *
 * @example
 * const row: VisioRow = {
 *     $: { N: 'MoveTo', T: 'MoveTo', IX: '1' },
 *     Cell: [ { $: { N: 'X', V: '0' } }, { $: { N: 'Y', V: '0' } } ]
 * };
 *
 * @private
 */
export interface VisioRow {
    /** Row attributes */
    readonly $: {
        /** Row name or identifier */
        readonly N?: string;
        /** Row type (for geometry: MoveTo, LineTo, ArcTo, etc.) */
        readonly T?: RowType;
        /** Index within the section */
        readonly IX?: string;
        /** Deleted flag ('1' if deleted) */
        readonly Del?: string;
    };
    /** Cell elements within this row */
    readonly Cell: OneOrMany<VisioCell>;
}

/**
 * Valid Visio row types.
 * These types are primarily used in Geometry sections to define shape paths.
 *
 * Geometry row types:
 * - MoveTo/RelMoveTo: Move drawing point
 * - LineTo/RelLineTo: Draw line
 * - ArcTo/EllipticalArcTo: Draw arc
 * - CubicBezierTo/RelCubBezTo: Draw cubic Bezier curve
 * - QuadBezierTo: Draw quadratic Bezier curve
 * - Ellipse: Draw complete ellipse
 * - Connection: Connection point
 * - NURBSTo: NURBS curve point
 * - Spline*: Spline control points
 * - Custom*: Custom row types
 *
 * @typedef RowType
 * @type {string}
 *
 * @private
 */
export type RowType =
    | 'MoveTo'
    | 'RelMoveTo'
    | 'RelLineTo'
    | 'LineTo'
    | 'ArcTo'
    | 'EllipticalArcTo'
    | 'RelCubBezTo'
    | 'CubicBezierTo'
    | 'QuadBezierTo'
    | 'Ellipse'
    | 'Connection'
    | 'NURBSTo'
    | 'SplineStart'
    | 'SplineKnot'
    | 'Custom1'
    | 'Custom2';

/**
 * Represents a `<Section>` element in Visio XML.
 * Sections group related rows and cells (e.g., Geometry section contains shape paths,
 * Property section contains user-defined properties, etc.).
 *
 * Common section names:
 * - Geometry: Shape path definition
 * - Property: User-defined properties
 * - Connection: Connection points
 * - Layer: Layer definitions
 * - FillGradient: Gradient fill stops
 * - Actions: Custom actions
 *
 * @interface VisioSection
 *
 * @example
 * const section: VisioSection = {
 *     $: { N: 'Geometry' },
 *     Row: [ ]
 * };
 *
 * @private
 */
export interface VisioSection {
    /** Section attributes */
    readonly $: {
        /** Section name (e.g., 'Geometry', 'Property', 'Connection') */
        readonly N: string;
    };
    /** Rows within this section */
    readonly Row?: OneOrMany<VisioRow>;
    /** Cells within this section */
    readonly Cell?: OneOrMany<VisioCell>;
}

/**
 * Narrows the known Visio XML shape kind types.
 * These are the primary shape types found in Visio documents.
 *
 * @typedef VisioShapeKind
 * @type {('Shape' | 'Group' | 'Page')}
 *
 * - Shape: Regular drawable shape
 * - Group: Container grouping multiple shapes
 * - Page: Page element (special case)
 *
 * @private
 */
export type VisioShapeKind = 'Shape' | 'Group' | 'Page' | 'Guide' | 'Foreign';

/**
 * Represents shape attributes from Visio XML.
 * Different Visio file versions may use different property names for the same concept
 * (e.g., Master vs MasterID vs MasterId), so this interface accepts all variants.
 *
 * Properties:
 * - ID: Unique shape identifier
 * - Master/MasterID/MasterId: References to master shape definition
 * - NameU: Universal name (language-independent)
 * - Name: Display name
 * - Type: Shape kind (Shape, Group, Page)
 * - BackPage/Background: Background page indicators
 *
 * @interface ShapeAttributes
 *
 * @example
 * const attrs: ShapeAttributes = {
 *     ID: 'Shape1',
 *     Master: 'Master1',
 *     NameU: 'Rectangle.1',
 *     Name: 'Rectangle',
 *     Type: 'Shape'
 * };
 *
 * @private
 */
export interface ShapeAttributes {
    /** Unique shape identifier */
    ID: string;
    /** Reference to master shape (variant 1) */
    Master?: string;
    /** Reference to master shape (variant 2) */
    MasterID?: string;
    /** Reference to master shape (variant 3) */
    MasterId?: string;
    /** Universal/language-independent name */
    NameU?: string;
    /** Display name */
    Name?: string;
    /** Shape kind (narrowed from string) */
    Type?: VisioShapeKind;
    /** Background page indicator (variant 1) */
    BackPage?: string;
    /** Background page indicator (variant 2) */
    Background?: string;
    /**
     * Index signature to safely capture any other attributes from the XML.
     * Allows flexibility for version differences and custom attributes.
     */
    [key: string]: unknown;
}

/**
 * Represents a complete Visio shape node (`<Shape>`) from XML.
 * This is the raw parsed XML structure before transformation to diagram format.
 *
 * Structure:
 * - `$`: XML attributes
 * - Cell: Cell elements (direct properties)
 * - Section: Section elements (collections of rows)
 * - Shapes: Child shapes (for group shapes)
 * - Text: Text content
 *
 * @interface VisioShapeNode
 *
 * @example
 * const shapeNode: VisioShapeNode = {
 *     $: { ID: 'Shape1', Name: 'Rectangle' },
 *     Cell: [ ],
 *     Section: [ ]
 * };
 *
 * @private
 */
export interface VisioShapeNode {
    /** Shape attributes (XML element attributes) */
    readonly $?: ShapeAttributes;
    /** Cell elements (direct shape properties) */
    readonly Cell: OneOrMany<VisioCell>;
    /** Section elements (grouped rows and cells) */
    readonly Section?: OneOrMany<VisioSection>;
    /** Child shapes (for group shapes) */
    readonly Shapes?: {
        readonly Shape: OneOrMany<VisioShapeNode>;
    };
    /**
     * Text content of the shape.
     * The nested `value` property is a common result of XML-to-JSON conversion
     * for elements with text content (e.g., <Text>Hello</Text> becomes { value: "Hello" }).
     */
    readonly Text?: {
        readonly value?: string;
    };
    /** Shape attributes (XML element attributes) */
    readonly ForeignData?: any;
}

/**
 * Common snap and grid-related settings extracted to eliminate duplication.
 * These settings appear in both Window configurations and Document settings.
 * Uses ValueLike to accommodate raw primitives or objects with a `value` property.
 *
 * @interface SnapAndGridSettings
 *
 * @private
 */
export interface SnapAndGridSettings {
    /** Snap behavior setting (bitfield controlling snap targets) */
    readonly snapSettings?: ValueLike;
    /** Extended snap target specification */
    readonly snapExtensions?: ValueLike;
    /** Snap angle configuration */
    readonly snapAngles?: ValueLike;
}

/**
 * Common display visibility settings extracted to eliminate duplication.
 * These settings appear in Window configurations.
 * Uses ValueLike to accommodate raw primitives or objects with a `value` property.
 *
 * @interface DisplaySettings
 *
 * @private
 */
export interface DisplaySettings {
    /** Show rulers toggle */
    readonly showRulers?: ValueLike;
    /** Show grid toggle */
    readonly showGrid?: ValueLike;
    /** Show page breaks toggle */
    readonly showPageBreaks?: ValueLike;
    /** Show guides toggle */
    readonly showGuides?: ValueLike;
    /** Show connection points toggle */
    readonly showConnectionPoints?: ValueLike;
}

/**
 * Window root-level attributes from the window root element.
 * These represent the top-level dimensions of the window container.
 *
 * @interface WindowRootAttributes
 *
 * @private
 */
export interface WindowRootAttributes {
    /** Client window width */
    ClientWidth?: string;
    /** Client window height */
    ClientHeight?: string;
}

/**
 * A generic cell object like `{ value: "1" }`.
 * Used in window configurations where cells contain simple values.
 * The value property is optional to accommodate empty cells `{}`.
 *
 * @interface VisioCellValue
 *
 * @private
 */
export interface VisioCellValue {
    /** Cell value string */
    value?: string;
}

/**
 * Known window type values in Visio.
 * Can be extended with additional types as needed.
 *
 * @typedef WindowType
 * @type {('Drawing' | 'Stencil' | string)}
 *
 * - Drawing: Main drawing window
 * - Stencil: Shape stencil window
 *
 * @private
 */
export type WindowType = 'Drawing' | 'Stencil' | string;

/**
 * Attributes inside each Window entry in the Windows array.
 * Contains window position, size, view settings, and type-specific properties.
 *
 * Drawing window attributes:
 * - WindowType: 'Drawing'
 * - WindowLeft/Top/Width/Height: Window position and size
 * - ViewScale: Zoom level
 * - ViewCenterX/Y: View center coordinates
 *
 * Stencil window attributes:
 * - WindowType: 'Stencil'
 * - Document: Referenced document
 * - ParentWindow: Parent window reference
 *
 * @interface WindowAttributes
 *
 * @private
 */
export interface WindowAttributes {
    /** Window identifier */
    ID?: string;
    /** Window type (Drawing, Stencil, etc.) */
    WindowType?: WindowType;
    /** Window state */
    WindowState?: string;
    /** Window left position */
    WindowLeft?: string;
    /** Window top position */
    WindowTop?: string;
    /** Window width */
    WindowWidth?: string;
    /** Window height */
    WindowHeight?: string;

    /** Container type (e.g., "Page") */
    ContainerType?: string;
    /** Associated page */
    Page?: string;
    /** View zoom scale (1.0 = 100%) */
    ViewScale?: string;
    /** View center X coordinate */
    ViewCenterX?: string;
    /** View center Y coordinate */
    ViewCenterY?: string;

    /** Stencil group name */
    Document?: string;
    /** Parent window reference */
    ParentWindow?: string;
}

/**
 * A single Window element entry in the windows array.
 * Represents a window (drawing, stencil, etc.) in the Visio document.
 *
 * Drawing windows include display toggles and snap settings.
 * Stencil windows include stencil-specific properties.
 *
 * @interface WindowElement
 *
 * @private
 */
export interface WindowElement {
    /** Window attributes */
    $?: WindowAttributes;

    // ==================== Drawing Window Display Toggles ====================
    /** Show rulers toggle */
    ShowRulers?: VisioCellValue;
    /** Show grid toggle */
    ShowGrid?: VisioCellValue;
    /** Show page breaks toggle */
    ShowPageBreaks?: VisioCellValue;
    /** Show guides toggle */
    ShowGuides?: VisioCellValue;
    /** Show connection points toggle */
    ShowConnectionPoints?: VisioCellValue;

    // ==================== Drawing Window Numeric Settings ====================
    /** Glue behavior setting */
    GlueSettings?: VisioCellValue;
    /** Snap behavior setting */
    SnapSettings?: VisioCellValue;
    /** Snap extension setting */
    SnapExtensions?: VisioCellValue;
    /** Snap angles (can be {} for empty) */
    SnapAngles?: VisioCellValue;
    /** Dynamic grid toggle */
    DynamicGridEnabled?: VisioCellValue;
    /** Tab splitter position */
    TabSplitterPos?: VisioCellValue;

    // ==================== Stencil Window Fields ====================
    /** Stencil group identifier */
    StencilGroup?: VisioCellValue;
    /** Stencil group position */
    StencilGroupPos?: VisioCellValue;
}

/**
 * Represents a `<Window>` element, defining view settings like zoom and grid visibility.
 * The `value` properties are artifacts of the XML parsing process where cell values
 * are wrapped in objects.
 *
 * @interface WindowRootElement
 *
 * @private
 */
export interface WindowRootElement {
    /** Root window attributes */
    readonly $?: WindowRootAttributes,
    /** Array of child window elements */
    Window?: WindowElement[]
}

/**
 * Full page content from visio/pages/pageN.xml.
 * Includes the page's PageSheet (properties) and Shapes (contents).
 *
 * @interface VisioPageContent
 *
 * @private
 */
export interface VisioPageContent {
    /** Page attributes */
    readonly $: {
        /** Page identifier */
        readonly ID: string;
        /** Background page reference */
        readonly BackPage?: string;
        /** Background page flag */
        readonly Background?: string;
    };
    /** Page properties (PageSheet) */
    readonly PageSheet: VisioPageSheet;
    /** Shapes on this page */
    readonly Shapes?: {
        readonly Shape: OneOrMany<VisioShapeNode>;
    };
}

/**
 * Represents a `<PageSheet>`, containing the properties of a page.
 * Similar to shape sheets but at the page level.
 *
 * @interface VisioPageSheet
 *
 * @private
 */
export interface VisioPageSheet {
    /** Page property cells */
    Cell: VisioCell[];
    /** Page sections (e.g., Layers, Properties) */
    Section?: OneOrMany<VisioSection>;
}

/**
 * Represents document-level settings from DocumentSettings element.
 * Includes grid, snap, and protection settings that apply to the entire document.
 *
 * @interface DocumentSettingsElement
 *
 * @private
 */
export interface DocumentSettingsElement extends SnapAndGridSettings {
    /** Glue settings */
    GlueSettings: { value: string };
    /** Dynamic grid toggle */
    DynamicGridEnabled?: { value: string };
    /** Protect styles flag */
    ProtectStyles?: { value: string };
    /** Protect shapes flag */
    ProtectShapes?: { value: string };
    /** Protect masters flag */
    ProtectMasters?: { value: string };
    /** Protect backgrounds flag */
    ProtectBkgnds?: { value: string };
}

/**
 * Represents a `<Master>` element from the XML.
 * Masters are template shapes that can be reused in diagrams.
 *
 * @interface MasterElement
 *
 * @private
 */
export interface MasterElement {
    /** Master attributes */
    readonly $: ShapeAttributes;
    /** Master sheet properties */
    readonly PageSheet?: {
        /** Master property cells */
        Cell: VisioCell[];
    }
}

/**
 * Represents a single `<Connect>` element defining a connection between two shapes.
 * Used in the Connects section to specify where connectors attach to shapes.
 *
 * @interface VisioConnectElement
 *
 * @private
 */
export interface VisioConnectElement {
    /** Connection attributes */
    readonly $: {
        /** Source shape ID */
        readonly FromSheet: string;
        /** Source cell (connection point) */
        readonly FromCell: string;
        /** Target shape ID */
        readonly ToSheet: string;
        /** Optional target cell */
        readonly ToCell?: string;
    };
}

/**
 * Represents a `<Connects>` wrapper element containing all connections on a page.
 *
 * @interface ConnectsElement
 *
 * @private
 */
export interface ConnectsElement {
    /** Array of connection elements */
    Connect: OneOrMany<VisioConnectElement>;
}

/**
 * The root structure of a parsed Visio page or master XML file.
 * Contains parsed elements from the XML with DrawingML (a:) prefixes preserved during parsing.
 *
 * Standard properties are mapped to specific interfaces:
 * - Window: View/window configuration
 * - Page: Page definition
 * - DocumentSettings: Document-level settings
 * - Master: Master shape definitions
 * - Shapes: Shape elements on page
 * - Connects: Connection definitions
 * - a:themeElements: Theme definition
 *
 * Extension properties are stored for flexibility.
 *
 * @interface VisioDocumentStructure
 *
 * @private
 */
export interface VisioDocumentStructure {
    /** Window configuration */
    Window?: ParsedXmlObject;
    /** Page definition */
    Page?: ParsedXmlObject;
    /** Document settings */
    DocumentSettings?: ParsedXmlObject;
    /** Master definitions */
    Master?: ParsedXmlObject;
    /** Relationship definitions */
    Relationship?: ParsedXmlObject;
    /** Connection definitions */
    Connects?: ParsedXmlObject;
    /** Shape elements */
    Shapes?: ParsedXmlObject;
    /** Relationship ID for the current page */
    PageRelId?: string;
    /** Theme elements (DrawingML namespace preserved) */
    'a:themeElements'?: ParsedXmlObject;

    /** Extension elements not mapped to standard properties */
    __Extensions?: Record<string, ParsedXmlObject>;
    /** Binary file parts (images, media, etc.) */
    __BinaryParts?: Record<string, Uint8Array>;
}

/**
 * Minimal port input with just required identification and position.
 * Used as the base for all port definitions during shape processing.
 *
 * @interface VisioPortInput
 *
 * @private
 */
export interface VisioPortInput {
    /** Port identifier */
    readonly id: string;
    /** Port X coordinate */
    x: number;
    /** Port Y coordinate */
    y: number;
}

/**
 * Extended port with direction and metadata.
 * Explicitly extends VisioPortInput to show the inheritance relationship.
 *
 * Used internally during shape processing to store complete port information
 * including direction vectors and connection behavior flags.
 *
 * @interface VisioPort
 * @extends VisioPortInput
 *
 * @private
 */
export interface VisioPort extends VisioPortInput {
    /** Direction X component */
    dirX: number;
    /** Direction Y component */
    dirY: number;
    /** Port type identifier */
    type: number;
    /** Auto-generation flag */
    autoGen: number;
    /** Port prompt text */
    prompt: string;
}

// ============================================================================
// SECTION 2: THEME TYPES
// ============================================================================

/**
 * Generic "order" entry used throughout the parsed XML structure.
 * Many nodes include an "order" array with { name, value } entries.
 * Used to preserve element ordering during JSON parsing.
 *
 * @interface OrderEntry
 *
 * @private
 */
export interface OrderEntry {
    /** Element name */
    readonly name: string;
    /** Element value */
    readonly value: unknown;
}

/**
 * Represents an `<a:srgbClr>` element.
 * Contains an sRGB color value in hex format.
 *
 * @interface SrgbClr
 *
 * @private
 */
export interface SrgbClr {
    /** Color attributes */
    readonly $: {
        /** Hex color value (e.g., "FFFFFF") */
        readonly val: string;
    };
}

/**
 * Represents an `<a:schemeClr>` element with optional shade.
 * Appears in font styling areas in theme data.
 *
 * @interface SchemeClr
 *
 * @private
 */
export interface SchemeClr {
    /** Color attributes */
    readonly $: {
        /** Scheme color name (e.g., 'accent1', 'lt1') */
        readonly val: string;
    };
    /** Optional shade modifier */
    readonly 'a:shade'?: {
        readonly $: {
            /** Shade value */
            readonly val: string;
        };
    };
}

/**
 * Represents a theme color object with an sRGB color and optional order metadata.
 *
 * @interface ThemeColorObject
 *
 * @private
 */
export interface ThemeColorObject {
    /** sRGB color definition */
    readonly 'a:srgbClr'?: SrgbClr;
    /** Order metadata for preserving element sequence */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * Represents a theme's color scheme (`<a:clrScheme>`).
 * Includes all standard theme color keys.
 *
 * Color keys:
 * - Dark/Light 1-2: Primary colors
 * - Accent 1-6: Accent colors
 * - hlink: Hyperlink color
 * - folHlink: Followed hyperlink color
 *
 * @interface ThemeColorScheme
 *
 * @private
 */
export interface ThemeColorScheme {
    /** Color scheme attributes */
    readonly $: {
        /** Scheme name */
        readonly name: string;
    };

    /** Dark color 1 */
    readonly 'a:dk1'?: ThemeColorObject;
    /** Light color 1 */
    readonly 'a:lt1'?: ThemeColorObject;
    /** Dark color 2 */
    readonly 'a:dk2'?: ThemeColorObject;
    /** Light color 2 */
    readonly 'a:lt2'?: ThemeColorObject;

    /** Accent color 1 */
    readonly 'a:accent1'?: ThemeColorObject;
    /** Accent color 2 */
    readonly 'a:accent2'?: ThemeColorObject;
    /** Accent color 3 */
    readonly 'a:accent3'?: ThemeColorObject;
    /** Accent color 4 */
    readonly 'a:accent4'?: ThemeColorObject;
    /** Accent color 5 */
    readonly 'a:accent5'?: ThemeColorObject;
    /** Accent color 6 */
    readonly 'a:accent6'?: ThemeColorObject;

    /** Hyperlink color */
    readonly 'a:hlink'?: ThemeColorObject;
    /** Followed hyperlink color */
    readonly 'a:folHlink'?: ThemeColorObject;

    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * a:fillStyleLst holder for fill style list data.
 * Contains ordered fill style definitions from the format scheme.
 *
 * @interface FillStyleList
 *
 * @private
 */
export interface FillStyleList {
    /** Ordered fill style entries */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * a:lnStyleLst holder for line style list data.
 * Contains ordered line/stroke style definitions from the format scheme.
 *
 * @interface LineStyleList
 *
 * @private
 */
export interface LineStyleList {
    /** Ordered line style entries */
    readonly order?: ReadonlyArray<OrderEntry>;
    /** Optional line style elements */
    readonly 'vt:lineStyle'?: ReadonlyArray<{
        /** Line extension element */
        readonly 'vt:lineEx'?: {
            readonly $: Record<string, string>;
        };
        /** Order metadata */
        readonly order?: ReadonlyArray<OrderEntry>;
    }>;
}

/**
 * Represents `<a:fmtScheme>` where you read $.name, a:fillStyleLst.order, a:lnStyleLst.order.
 * Contains formatting scheme with fill and line style lists.
 *
 * @interface FmtScheme
 *
 * @private
 */
export interface FmtScheme {
    /** Format scheme attributes */
    readonly $: {
        /** Scheme name */
        readonly name: string;
    };
    /** Fill style list */
    readonly 'a:fillStyleLst'?: FillStyleList;
    /** Line style list */
    readonly 'a:lnStyleLst'?: LineStyleList;
}

/**
 * Represents `<a:fontScheme>` containing font definitions.
 * Extracts majorFont/latin/@typeface for the primary font family.
 *
 * @interface FontScheme
 *
 * @private
 */
export interface FontScheme {
    /** Major font definition (regular text) */
    readonly 'a:majorFont': {
        /** Latin font specification */
        readonly 'a:latin': {
            /** Font attributes */
            readonly $: {
                /** Font name/typeface */
                readonly typeface: string;
            };
        };
    };
}

/**
 * vt:schemeID extension entry for theme scheme identification.
 * Contains scheme enumeration and GUID.
 *
 * @interface SchemeIdExt
 *
 * @private
 */
export interface SchemeIdExt {
    /** Scheme ID attributes */
    readonly $: {
        /** VT namespace declaration */
        readonly 'xmlns:vt'?: string;
        /** Scheme enumeration value */
        readonly schemeEnum: string;
        /** Scheme GUID */
        readonly schemeGUID?: string;
    };
}

/**
 * Variation color item (vt:varColorN) representing a color in a variation scheme.
 *
 * @interface VariationColor
 *
 * @private
 */
export interface VariationColor {
    /** sRGB color definition */
    readonly 'a:srgbClr'?: SrgbClr;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * One variation color scheme entry inside vt:variationClrSchemeLst.
 * Contains 7 variation colors (varColor1-7) representing color variations.
 *
 * @interface VariationClrScheme
 *
 * @private
 */
export interface VariationClrScheme {
    /** Variation scheme attributes */
    readonly $?: {
        /** Monotone flag */
        readonly monotone?: string;
    };
    /** Variation color 1 */
    readonly 'vt:varColor1'?: VariationColor;
    /** Variation color 2 */
    readonly 'vt:varColor2'?: VariationColor;
    /** Variation color 3 */
    readonly 'vt:varColor3'?: VariationColor;
    /** Variation color 4 */
    readonly 'vt:varColor4'?: VariationColor;
    /** Variation color 5 */
    readonly 'vt:varColor5'?: VariationColor;
    /** Variation color 6 */
    readonly 'vt:varColor6'?: VariationColor;
    /** Variation color 7 */
    readonly 'vt:varColor7'?: VariationColor;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * vt:variationClrSchemeLst container for variation color schemes.
 *
 * @interface VariationClrSchemeList
 *
 * @private
 */
export interface VariationClrSchemeList {
    /** List attributes */
    readonly $?: {
        /** VT namespace declaration */
        readonly 'xmlns:vt'?: string;
    };
    /** Array of variation color schemes */
    readonly 'vt:variationClrScheme': ReadonlyArray<VariationClrScheme>;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * vt:fontProps entry used in font styles areas.
 * Represents a font style with color information.
 *
 * @interface FontPropsColor
 *
 * @private
 */
export interface FontPropsColor {
    /** Scheme color definition */
    readonly 'a:schemeClr'?: SchemeClr;
    /** sRGB color definition */
    readonly 'a:srgbClr'?: SrgbClr;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * Font properties entry with style and color information.
 *
 * @interface FontProps
 *
 * @private
 */
export interface FontProps {
    /** Font attributes (style code) */
    readonly $: {
        /** Font style code (bitfield: bold, italic, underline, etc.) */
        readonly style: string;
    };
    /** Font color definition */
    readonly 'vt:color': FontPropsColor;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * Font styles group container.
 *
 * @interface FontStyles
 *
 * @private
 */
export interface FontStyles {
    /** Array of font properties */
    readonly 'vt:fontProps': ReadonlyArray<FontProps>;
}

/**
 * Font styles group containing regular and connector font styles.
 *
 * @interface FontStylesGroup
 *
 * @private
 */
export interface FontStylesGroup {
    /** Regular font styles */
    readonly 'vt:fontStyles': FontStyles;
    /** Connector-specific font styles */
    readonly 'vt:connectorFontStyles': FontStyles;
}

/**
 * vt:fmtConnectorScheme holder for connector formatting scheme.
 *
 * @interface FmtConnectorScheme
 *
 * @private
 */
export interface FmtConnectorScheme {
    /** Connector line style list */
    readonly 'a:lnStyleLst': LineStyleList;
}

/**
 * vt:varStyle entry representing a style variant.
 * Contains indices for fill, line, effect, and font styles.
 *
 * @interface VarStyle
 *
 * @private
 */
export interface VarStyle {
    /** Style variant attributes */
    readonly $: {
        /** Fill style index */
        readonly fillIdx: string;
        /** Line style index */
        readonly lineIdx: string;
        /** Effect style index */
        readonly effectIdx: string;
        /** Font style index */
        readonly fontIdx: string;
    };
}

/**
 * Variation style scheme containing style variants.
 *
 * @interface VariationStyleScheme
 *
 * @private
 */
export interface VariationStyleScheme {
    /** Scheme attributes */
    readonly $: {
        /** Embellishment type */
        readonly embellishment: string;
    };
    /** Array of style variants */
    readonly 'vt:varStyle': ReadonlyArray<VarStyle>;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * vt:variationStyleSchemeLst container for variation style schemes.
 *
 * @interface VariationStyleSchemeList
 *
 * @private
 */
export interface VariationStyleSchemeList {
    /** List attributes */
    readonly $?: {
        /** VT namespace declaration */
        readonly 'xmlns:vt'?: string;
    };
    /** Array of variation style schemes */
    readonly 'vt:variationStyleScheme': ReadonlyArray<VariationStyleScheme>;
    /** Order metadata */
    readonly order?: ReadonlyArray<OrderEntry>;
}

/**
 * Single a:ext element inside either a:clrScheme/a:extLst or root a:extLst.
 * Contains extension data for colors, fonts, connectors, or styles.
 *
 * @interface ThemeExtension
 *
 * @private
 */
export interface ThemeExtension {
    /** Extension attributes */
    readonly $?: {
        /** Extension URI identifier */
        readonly uri: string;
    };

    /** Scheme ID extension */
    readonly 'vt:schemeID'?: SchemeIdExt;
    /** Variation color scheme list extension */
    readonly 'vt:variationClrSchemeLst'?: VariationClrSchemeList;

    /** Font styles group extension */
    readonly 'vt:fontStylesGroup'?: FontStylesGroup;
    /** Connector format scheme extension */
    readonly 'vt:fmtConnectorScheme'?: FmtConnectorScheme;
    /** Variation style scheme list extension */
    readonly 'vt:variationStyleSchemeLst'?: VariationStyleSchemeList;
}

/**
 * a:extLst holder for extensions list.
 *
 * @interface ThemeExtList
 *
 * @private
 */
export interface ThemeExtList {
    /** Array of theme extensions */
    readonly 'a:ext': ReadonlyArray<ThemeExtension>;
}

/**
 * Root object type that matches theme elements structure.
 * Contains color scheme, format scheme, font scheme, and extensions.
 *
 * @interface ThemeElements
 *
 * @private
 */
export interface ThemeElements {
    /** Color scheme with optional extensions */
    readonly 'a:clrScheme': ThemeColorScheme & {
        readonly 'a:extLst'?: ThemeExtList;
    };
    /** Format scheme (fills and strokes) */
    readonly 'a:fmtScheme': FmtScheme;
    /** Font scheme */
    readonly 'a:fontScheme': FontScheme;
    /** Root extensions */
    readonly 'a:extLst': ThemeExtList;
}

/**
 * Formatted colors mapping from theme color names to hex values.
 *
 * @typedef FormattedColors
 * @type {Record<string, string>}
 *
 * @example
 * const colors: FormattedColors = {
 *     dk1: '#000000',
 *     lt1: '#FFFFFF',
 *     accent1: '#0563C1'
 * };
 *
 * @private
 */
export type FormattedColors = Record<string, string>;

// ============================================================================
// SECTION 3: CONSOLIDATED COORDINATE & POINT TYPES
// ============================================================================

/**
 * Core 2D point representation. This is the canonical type for all coordinate operations.
 * Use this as your primary point type throughout the codebase.
 *
 * @interface Point
 *
 * @example
 * const point: Point = { x: 100, y: 200 };
 *
 * @private
 */
export interface Point {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
}

/**
 * Immutable 2D vector. Use for read-only coordinate operations.
 * Provides type safety for cases where mutation should not be allowed.
 *
 * @typedef Vec2
 * @type {Readonly<Point>}
 *
 * @private
 */
export type Vec2 = Readonly<Point>;

/**
 * Color transformation operation for Visio themes.
 * Defines luminance, saturation, hue, tint, and shade modifications.
 * Use this to apply color adjustments to theme colors in the diagram.
 *
 * Supported transformations:
 * - lumMod/lumOff: Luminance multiply/offset
 * - satMod/satOff: Saturation multiply/offset
 * - hueMod/hueOff/hueShift: Hue adjustments
 * - tint/shade: Lighten/darken
 * - alpha/alphaMod/alphaOff: Opacity adjustments
 *
 * @typedef Transform
 * @type {Object}
 *
 * @private
 */
export type Transform =
    | { type: 'lumMod'; val: number }
    | { type: 'lumOff'; val: number }
    | { type: 'satMod'; val: number }
    | { type: 'satOff'; val: number }
    | { type: 'hueMod'; val: number }
    | { type: 'hueOff'; val: number }
    | { type: 'tint'; val: number }
    | { type: 'shade'; val: number }
    | { type: 'hueShift'; val: number }
    | { type: 'alpha'; val: number }
    | { type: 'alphaMod'; val: number }
    | { type: 'alphaOff'; val: number };

/**
 * Flattened representation of transform operations.
 * Allows partial application of color transformations as a dictionary.
 * Use this as an alternative to Transform for easier manipulation of multiple transforms.
 *
 * @typedef FlatTransform
 * @type {Partial<Record<Transform['type'], number>>}
 *
 * @example
 * const transforms: FlatTransform = { tint: 0.3, satMod: 1.2 };
 *
 * @private
 */
export type FlatTransform = Partial<Record<Transform['type'], number>>;

/**
 * Visio diagram node with styling matrix references.
 * Contains theme indices and quick style references for fill, line, and font styling.
 * Use this to access and apply theme-based styling information from Visio documents.
 *
 * @interface VisioNode
 *
 * @private
 */
export interface VisioNode {
    /** Theme index (0 = no theme) */
    ThemeIndex: number;
    /** Quick fill matrix index */
    QuickFillMatrix?: number;
    /** Quick line matrix index */
    QuickStyleLineMatrix?: number;
    /** Quick font matrix index */
    QuickStyleFontMatrix?: number;
    /** Quick fill color index */
    QuickFillColor?: number;
    /** Quick line color index */
    QuickStyleLineColor?: number;
    /** Quick font color index */
    QuickStyleFontColor?: number;
    /** Extensible properties */
    [key: string]: unknown;
}

/**
 * Resolved connector stroke styling properties.
 * Contains computed color, dash pattern, width, and opacity values.
 * Use this for rendering connector lines with consistent visual properties.
 *
 * @interface ConnectorResolvedStyle
 *
 * @private
 */
export interface ConnectorResolvedStyle {
    /** Stroke color in hex format */
    strokeColor: string;
    /** Stroke dash array pattern */
    strokeDashArray: string;
    /** Stroke width in points */
    strokeWidth: number;
    /** Stroke opacity (0-1) */
    opacity: number;
}

/**
 * Resolved annotation text styling properties.
 * Contains computed font, color, alignment, and text decoration values.
 * Use this for rendering diagram annotations with consistent typography.
 *
 * @interface ResolvedAnnotationStyle
 *
 * @private
 */
export interface ResolvedAnnotationStyle {
    /** Text color in hex format */
    color: string;
    /** Font family name */
    fontFamily: string | undefined;
    /** Background fill color */
    fill: string | undefined;
    /** Font size in points */
    fontSize: number;
    /** Text opacity (0-1) */
    opacity: number;
    /** Bold font flag */
    bold: boolean;
    /** Italic font flag */
    italic: boolean;
    /** Text horizontal alignment */
    textAlign: 'Left' | 'Center' | 'Right' | 'Justify';
    /** Text decoration style */
    textDecoration: 'None' | 'Underline' | 'Overline' | 'LineThrough';
}

/**
 * Extended point with optional type metadata.
 * Use when a point needs to carry additional type information (e.g., path command type).
 *
 * @interface PointWithType
 * @extends Point
 *
 * @private
 */
export interface PointWithType extends Point {
    /** Optional type metadata (e.g., 'MoveTo', 'LineTo', 'CurveTo') */
    type?: string;
}

/**
 * Cardinal directions for routing and positioning.
 * Used for annotation directions, connector routing, etc.
 *
 * @typedef Direction
 * @type {('Top' | 'Bottom' | 'Left' | 'Right')}
 *
 * @private
 */
export type Direction = 'Top' | 'Bottom' | 'Left' | 'Right';

// ============================================================================
// SECTION 4: GRADIENT & STYLING TYPES
// ============================================================================

/**
 * Represents a vector for defining a linear gradient's direction.
 * Contains start (x1, y1) and end (x2, y2) points in normalized coordinates (0-1).
 *
 * @interface GradientVector
 *
 * @example
 * const gradient: GradientVector = { x1: 0, y1: 0, x2: 1, y2: 1 }; // Diagonal
 *
 * @private
 */
export interface GradientVector {
    /** Start point X coordinate (0-1) */
    x1: number;
    /** Start point Y coordinate (0-1) */
    y1: number;
    /** End point X coordinate (0-1) */
    x2: number;
    /** End point Y coordinate (0-1) */
    y2: number;
}

/**
 * Represents the configuration for a radial gradient.
 * Contains center point, focal point, and radius in normalized coordinates.
 *
 * @interface RadialGradientConfig
 *
 * @example
 * const radial: RadialGradientConfig = {
 *     type: 'Radial',
 *     cx: 0.5, cy: 0.5,     // Center
 *     fx: 0.5, fy: 0.5,     // Focal point
 *     r: 0.5                // Radius
 * };
 *
 * @private
 */
export interface RadialGradientConfig {
    /** Gradient type identifier */
    type: 'Radial';
    /** Center X coordinate (0-1) */
    cx: number;
    /** Center Y coordinate (0-1) */
    cy: number;
    /** Focal point X coordinate (0-1) */
    fx: number;
    /** Focal point Y coordinate (0-1) */
    fy: number;
    /** Gradient radius (0-1) */
    r: number;
}

/**
 * Represents a single color stop in a gradient definition.
 * Defines color, position, and opacity at a specific point in the gradient.
 *
 * @interface GradientStop
 *
 * @example
 * const stop: GradientStop = {
 *     color: '#FF0000',
 *     offset: 0,      // Start
 *     opacity: 1
 * };
 *
 * @private
 */
export interface GradientStop {
    /** Hex color at this stop */
    color: string;
    /** Position in gradient (0-1) */
    offset: number;
    /** Opacity at this stop (0-1) */
    opacity: number;
}

// ============================================================================
// SECTION 5: PARSED OUTPUT TYPES
// ============================================================================

/**
 * Represents a generic JavaScript object resulting from an XML-to-JSON conversion.
 * Used before the object is mapped to more specific, strongly-typed interfaces.
 * Provides flexibility for intermediate data structures.
 *
 * @typedef ParsedXmlObject
 * @type {Record<string, unknown>}
 *
 * @private
 */
export type ParsedXmlObject = Record<string, unknown>;

/**
 * Represents a relationship from a `.rels` file in the VSDX package.
 * OPC relationships define dependencies between parts in the document.
 *
 * @interface XmlRelationship
 *
 * @example
 * const rel: XmlRelationship = {
 *     $: {
 *         Id: 'rId1',
 *         Target: '../pages/page1.xml',
 *         Type: 'http://...'
 *     }
 * };
 *
 * @private
 */
export interface XmlRelationship {
    /** Relationship attributes */
    readonly $: {
        /** Relationship ID (e.g., 'rId1') */
        readonly Id: string;
        /** Target part path (relative or absolute) */
        readonly Target: string;
        /** OPC relationship type URI */
        readonly Type?: string;
        /** Target mode (Internal or External) */
        readonly TargetMode?: 'External' | 'Internal';
        /** Additional attributes */
        [key: string]: string | undefined;
    };
}

/**
 * Entry inside visio/pages/pages.xml (page listing/index).
 * Contains page metadata like ID and background flags, but not the actual page content.
 *
 * @interface VisioPageMetadata
 *
 * @private
 */
export interface VisioPageMetadata {
    /** Page metadata attributes */
    readonly $: {
        /** Page identifier */
        readonly ID?: string;
        /** Universal page ID */
        readonly IDU?: string;
        /** Numeric page ID */
        readonly IDN?: string;
        /** Background page indicator */
        readonly Background?: string;
        /** Background page reference */
        readonly BackgroundPage?: string;
    };
}

/**
 * Holds processed settings for the drawing window view.
 * Contains viewport configuration and display options.
 *
 * @interface DrawingWindow
 *
 * @private
 */
export interface DrawingWindow {
    /** Window width in pixels */
    windowWidth: number;
    /** Window height in pixels */
    windowHeight: number;
    /** Show page breaks toggle */
    showPageBreaks: boolean;
    /** Show grid toggle */
    showGrid: boolean;
    /** Show guides toggle */
    showGuides: boolean;
    /** View center X coordinate */
    viewCenterX: number;
    /** View center Y coordinate */
    viewCenterY: number;
    /** Snap extensions setting */
    snapExtensions: number;
    /** Snap angles setting */
    snapAngles: number;
    /** Show rulers toggle */
    showRulers: boolean;
}

/**
 * Extends the diagram's `addInfo` property with Visio-specific metadata.
 * Used to store warnings and limitations encountered during import.
 *
 * @interface DiagramAddInfo
 *
 * @private
 */
export interface DiagramAddInfo {
    /** Visio-specific metadata */
    visio: {
        /** List of feature limitations */
        limitations: string[];
        /** List of import warnings */
        warnings: string[];
    };
}

// ============================================================================
// SECTION 6: UTILITY TYPES
// ============================================================================

/**
 * Defines the possible value types for a Visio cell (`V` attribute).
 * Represents the raw cell value in the Visio XML structure.
 *
 * @typedef CellMapValue
 * @type {(string | number | boolean | undefined)}
 *
 * @private
 */
export type CellMapValue = string | number | boolean | undefined;

/**
 * A cache to store processed shape data for efficient lookups.
 * Maps shape IDs to VisioShapeData objects.
 *
 * @interface ShapeCache
 *
 * @private
 */
export interface ShapeCache {
    /** Shape data indexed by shape ID */
    [id: string]: VisioShapeData;
}

/**
 * Represents a processed, intermediate representation of a Visio shape.
 * Used for internal logic like handling subprocesses in BPMN diagrams.
 *
 * @interface VisioShapeData
 *
 * @private
 */
export interface VisioShapeData {
    /** Shape identifier */
    id: string | number;
    /** Shape name */
    name: string;
    /** Shape width */
    width: number;
    /** Shape height */
    height: number;
    /** Horizontal position */
    offsetX: number;
    /** Vertical position */
    offsetY: number;
    /** Shape definition and type */
    shape: {
        /** Shape type (Basic, Flow, Path, etc.) */
        type: string;
        /** BPMN activity configuration */
        activity?: {
            subProcess?: {
                /** Child process IDs */
                processes?: Array<string | number>;
            };
        };
    };
    /** Calculated margin around shape */
    calculatedMargin?: {
        /** Left margin */
        left: number;
        /** Top margin */
        top: number;
    };
    /** Flag indicating if shape is inside a subprocess */
    isChildOfSubprocess?: boolean;
}

// ============================================================================
// SECTION 7: CONNECTOR TYPES
// ============================================================================

/**
 * Represents the high-level type of a connector/edge routing algorithm.
 * Determines how the connector path is calculated and rendered.
 *
 * - Straight: Direct line between points
 * - Orthogonal: Horizontal/vertical lines (manhattan routing)
 * - Bezier: Curved connection with control points
 *
 * @typedef ConnectorType
 * @type {('Straight' | 'Orthogonal' | 'Bezier')}
 *
 * @private
 */
export type ConnectorType = 'Straight' | 'Orthogonal' | 'Bezier';

/**
 * Represents the available shapes for connector decorators (arrowheads).
 * Defines the visual style of endpoints on connectors.
 *
 * - None: No decorator
 * - Arrow/OpenArrow: Standard arrow styles
 * - Square/Circle/Diamond: Geometric decorators
 * - Fletch: Various fletching styles
 * - Custom: Custom decorator shape
 *
 * @typedef DecoratorShapes
 * @type {string}
 *
 * @private
 */
export type DecoratorShapes =
    | 'None' | 'Arrow' | 'OpenArrow' | 'Square' | 'Circle'
    | 'Diamond' | 'Fletch' | 'OpenFetch' | 'IndentedArrow'
    | 'OutdentedArrow' | 'DoubleArrow' | 'Custom';

// ============================================================================
// Diagram Input Models
// ============================================================================

/**
 * Shapes container node for grouping shape elements.
 *
 * @interface VisioShapesNode
 *
 * @private
 */
export interface VisioShapesNode {
    /** Optional shape element(s) */
    readonly Shape?: OneOrMany<VisioShapeNode>;
}

/**
 * Text style properties for annotations.
 *
 * @interface VisioTextStyleInput
 *
 * @private
 */
export interface VisioTextStyleInput {
    /** Text color */
    readonly color?: string;
    /** Font family name */
    readonly fontFamily?: string;
    /** Font size in points */
    readonly fontSize?: number;
    /** Bold flag */
    readonly bold?: boolean;
    /** Italic flag */
    readonly italic?: boolean;
    /** Background fill */
    readonly fill?: string;
    /** Opacity (0-1) */
    readonly opacity?: number;
}

/**
 * Hyperlink information for annotations.
 *
 * @interface VisioHyperlinkInput
 *
 * @private
 */
export interface VisioHyperlinkInput {
    /** Hyperlink URL */
    readonly link?: string;
    /** Hyperlink display text */
    readonly content?: string;
    /** Open in new window flag */
    readonly newWindow?: boolean;
}

/**
 * Shape definition input containing type and shape-specific data.
 *
 * @interface VisioShapeInput
 *
 * @private
 */
export interface VisioShapeInput {
    /** Shape type (Basic, Flow, Path, Image, or Bpmn) */
    readonly type: 'Basic' | 'Flow' | 'Path' | 'Image' | 'Bpmn';
    /** Shape subtype (e.g., 'Rectangle', 'Ellipse') */
    readonly shape?: string;
    /** SVG path data (for Path type) */
    readonly data?: string;
    /** Image source URL (for Image type) */
    readonly source?: string;
    /** Connection elements */
    readonly connect?: VisioConnectElement[]
    /** Extensible properties */
    readonly [key: string]: unknown;
}

/**
 * Annotation (text) content and positioning information.
 *
 * @interface VisioAnnotationInput
 *
 * @private
 */
export interface VisioAnnotationInput {
    /** Text content */
    readonly content: string;
    /** Text box pin X (relative to shape) */
    readonly txtPinX?: number;
    /** Text box pin Y (relative to shape) */
    readonly txtPinY?: number;
    /** Text box local pin X */
    readonly txtLocPinX?: number;
    /** Text box local pin Y */
    readonly txtLocPinY?: number;
    /** Text box width */
    readonly txtWidth?: number;
    /** Text box height */
    readonly txtHeight?: number;
    /** Text box angle */
    readonly txtAngle?: number;
    /** Text rotation angle */
    readonly rotateAngle?: number;
    /** Text visibility */
    readonly visible?: boolean;
    /** Segment angle flag (for connector text) */
    readonly segmentAngle?: boolean;
    /** Horizontal alignment */
    readonly horizontalAlignment?: 'Left' | 'Center' | 'Right';
    /** Vertical alignment */
    readonly verticalAlignment?: 'Top' | 'Center' | 'Bottom';
    /** Hyperlink configuration */
    readonly hyperlink?: VisioHyperlinkInput;
    /** Text styling */
    readonly style?: VisioTextStyleInput;
    /** Lock text edit flag */
    readonly lockTextEdit?: boolean;
    /** Lock rotation flag */
    readonly lockRotate?: boolean;
    /** Lock selection flag */
    readonly lockSelect?: boolean;
}

/**
 * Complete Visio node input with all properties and styling.
 * Represents the intermediate data structure for a shape being imported.
 *
 * @interface VisioNodeInput
 *
 * @private
 */
export interface VisioNodeInput {
    /** Shape identifier */
    readonly id: string;
    /** Horizontal pivot point (0-1) */
    readonly pivotX: number;
    /** Vertical pivot point (0-1) */
    readonly pivotY: number;
    /** Child node IDs (for groups) */
    readonly children?: VisioNodeInput[];
    /** Connection points (ports) */
    readonly ports: VisioPortInput[];
    /** Text annotation */
    readonly annotation: VisioAnnotationInput;
    /** Horizontal position */
    readonly offsetX: number;
    /** Vertical position */
    readonly offsetY: number;
    /** Pin Y coordinate */
    readonly pinY: number;
    /** Shape width */
    readonly width: number;
    /** Shape height */
    readonly height: number;
    /** Shape definition */
    readonly shape: VisioShapeInput;
    /** Rotation angle */
    readonly rotateAngle: number;
    /** Visibility flag */
    readonly visibility?: boolean;
    /** Tooltip text */
    readonly tooltip?: string;
    /** Calculated margins */
    readonly calculatedMargin?: Margin;
    /** Horizontal flip flag */
    readonly flipX?: number | boolean;
    /** Vertical flip flag */
    readonly flipY?: number | boolean;
    /** Shadow effects */
    readonly shadow: VisioNodeShadow;
    /** Corner radius for rounded shapes */
    readonly cornerRadius?: number;
    /** Lock height flag */
    readonly lockHeight?: boolean;
    /** Lock width flag */
    readonly lockWidth?: boolean;
    /** Lock X movement flag */
    readonly lockMoveX?: boolean;
    /** Lock Y movement flag */
    readonly lockMoveY?: boolean;
    /** Lock rotation flag */
    readonly lockRotate?: boolean;
    /** Lock deletion flag */
    readonly lockDelete?: boolean;
    /** Lock selection flag */
    readonly lockSelect?: boolean;
    /** Maintain aspect ratio flag */
    readonly lockAspect?: boolean;
    /** Lock text editing flag */
    readonly lockTextEdit?: boolean;
    /** Comment/tooltip text */
    comment?: string;
    /** Glue type identifier */
    glueType?: string;
    /** Glue value string */
    glueValue?: string;
    /** Allow drop flag (for BPMN) */
    AllowDrop?: boolean;
    /** Interaction constraints */
    readonly constraints?: NodeConstraints;
    /** Parent group ID */
    readonly parentId?: string;
    /** Imagee ID */
    imageId?: string;
}

/**
 * Represents an embedded media file in the Visio document.
 * Contains binary data and metadata for images and other media.
 *
 * @interface VisioMedia
 *
 * @private
 */
export interface VisioMedia {
    /** Media identifier */
    id: string;
    /** Media file name */
    name: string;
    /** Media MIME type */
    type: string;
    /** Binary media data */
    data: Uint8Array;
    /** Data URL for embedding (data: URI) */
    dataUrl?: string;
}

// ============================================================================
// Diagram Output Models
// ============================================================================

/**
 * Port as represented in the output diagram.
 * Note: Different property names (offset vs x/y) compared to VisioPort.
 * Use convertVisioPortToDiagramPort() to convert between types.
 *
 * @interface DiagramPort
 *
 * @private
 */
export interface DiagramPort {
    /** Port identifier */
    readonly id: string;
    /** Port position normalized to [0, 1] */
    readonly offset: Point;
    /** Port shape type (Circle, Square, etc.) */
    readonly shape: string;
    /** Port styling */
    readonly style: {
        /** Border color */
        strokeColor: string;
        /** Border width */
        strokeWidth: number;
    };
}

/**
 * Resolved annotation text styling for rendering.
 *
 * @interface AnnotationStyle
 *
 * @private
 */
export interface AnnotationStyle {
    /** Text color */
    readonly color: string;
    /** Background fill */
    readonly fill?: string;
    /** Font family */
    readonly fontFamily: string;
    /** Font size */
    readonly fontSize: number;
    /** Opacity (0-1) */
    readonly opacity: number;
    /** Bold flag */
    readonly bold: boolean;
    /** Italic flag */
    readonly italic: boolean;
    /** Text alignment */
    readonly textAlign: VisioTextAlignmentModel;
    /** Text decoration */
    readonly textDecoration: VisioTextDecorationModel;
}

/**
 * Hyperlink configuration for rendering.
 *
 * @interface DiagramHyperlink
 *
 * @private
 */
export interface DiagramHyperlink {
    /** Hyperlink URL */
    readonly link: string;
    /** Display text */
    readonly content: string;
    /** Open behavior (NewWindow or NewTab) */
    readonly hyperlinkOpenState: 'NewWindow' | 'NewTab';
    /** Hyperlink Color */
    readonly color: string;
    /** Hyperlink textDecoration */
    readonly textDecoration: string;
}

/**
 * Annotation element for rendering text on shapes.
 *
 * @interface DiagramAnnotation
 *
 * @private
 */
export interface DiagramAnnotation {
    /** Text content */
    readonly content: string;
    /** Annotation width */
    readonly width: number;
    /** Annotation height */
    readonly height: number;
    /** Visibility flag */
    readonly visibility: boolean;
    /** Hyperlink (if present) */
    readonly hyperlink?: DiagramHyperlink;
    /** Rotation angle */
    readonly rotateAngle: number;
    /** Interaction constraints */
    readonly constraints: AnnotationConstraints;
    /** Vertical alignment */
    readonly verticalAlignment: 'Top' | 'Center' | 'Bottom';
    /** Horizontal alignment */
    readonly horizontalAlignment: 'Left' | 'Center' | 'Right';
    /** Position relative to shape (0-1) */
    readonly offset: { x: number; y: number };
    /** Text styling */
    readonly style: AnnotationStyle;
}

/**
 * Shape definition for diagram rendering.
 *
 * @interface NodeShape
 *
 * @private
 */
export interface NodeShape {
    /** Shape type */
    readonly type: 'Basic' | 'Flow' | 'Path' | 'Image' | 'Bpmn' | 'UmlClassifier' | 'UmlActivity';
    /** Shape subtype */
    readonly shape?: string;
    /** SVG path data */
    readonly data?: string;
    /** Image source */
    readonly source?: string;
    /** Corner radius */
    readonly cornerRadius?: number;
    /** Extensible properties */
    [key: string]: unknown;
}

/**
 * Node styling for diagram rendering.
 *
 * @interface NodeStyle
 *
 * @private
 */
export interface NodeStyle {
    /** Extensible styling properties */
    [key: string]: unknown;
}

/**
 * Margin/padding configuration for shapes.
 *
 * @interface Margin
 *
 * @private
 */
export interface Margin {
    /** Left margin/padding */
    readonly left?: number;
    /** Right margin/padding */
    readonly right?: number;
    /** Top margin/padding */
    readonly top?: number;
    /** Bottom margin/padding */
    readonly bottom?: number;
}

/**
 * Padding is an alias for Margin used in diagram styling.
 *
 * @typedef Padding
 * @type {Margin}
 *
 * @private
 */
export type Padding = Margin;

/**
 * Shadow properties for shape rendering.
 *
 * @interface ShadowProps
 *
 * @private
 */
export interface ShadowProps {
    /** Shadow color */
    readonly color?: string;
    /** Shadow opacity (0-1) */
    readonly opacity?: number;
    /** Shadow direction angle (degrees) */
    readonly angle?: number;
    /** Shadow distance/offset (pixels) */
    readonly distance?: number;
}

/**
 * Complete diagram node for rendering.
 * Contains all shape, style, positioning, and interaction information.
 *
 * @interface DiagramNode
 *
 * @private
 */
export interface DiagramNode {
    /** Shape identifier */
    readonly id: string;
    /** Shape width (pixels) */
    readonly width: number;
    /** Shape height (pixels) */
    readonly height: number;
    /** Horizontal position (pixels) */
    readonly offsetX: number;
    /** Vertical position (pixels) */
    readonly offsetY: number;
    /** Shape definition */
    readonly shape: NodeShape;
    /** Shape styling */
    readonly style: NodeStyle;
    /** Interaction constraints */
    readonly constraints: NodeConstraints;
    /** Shadow effect */
    readonly shadow?: ShadowProps;
    /** Flip/mirror direction */
    readonly flip: FlipDirection;
    /** Visibility flag */
    readonly visible: boolean;
    /** Tooltip configuration */
    readonly tooltip: { content: string };
    /** Pivot point */
    readonly pivot: PointModel;
    /** Rotation angle (degrees) */
    readonly rotateAngle: number;
    /** Child shape IDs (for groups) */
    readonly children?: string[];
    /** Parent group ID */
    readonly parentId?: string;
    /** Internal padding */
    readonly padding: Padding;
    /** Connection points (ports) */
    readonly ports: DiagramPort[];
    /** External margins */
    readonly margin?: Margin;
    /** Text annotations */
    readonly annotations: DiagramAnnotation[];
}

// ============================================================================
// SECTION 8: BPMN SHAPES (Consolidated with Discriminated Union)
// ============================================================================

/**
 * BPMN Task properties defining task behavior and loop/compensation settings.
 *
 * @interface BPMNTask
 *
 * @private
 */
export interface BPMNTask {
    /** Task type (None, Service, User, Manual, etc.) */
    readonly type: string;
    /** Loop type (None, Standard, MultiInstance, etc.) */
    readonly loop: string;
    /** Compensation flag */
    readonly compensation: boolean;
    /** Call flag (call activity) */
    readonly call: boolean;
}

/**
 * BPMN SubProcess properties defining subprocess behavior.
 *
 * @interface BPMNSubProcess
 *
 * @private
 */
export interface BPMNSubProcess {
    /** SubProcess type */
    readonly type: string;
    /** Loop type */
    readonly loop: string;
    /** Compensation flag */
    readonly compensation: boolean;
    /** Ad-hoc flag */
    readonly adhoc: boolean;
    /** Collapsed state flag */
    readonly collapsed: boolean;
    /** Boundary event type */
    readonly boundary: string;
    /** Child process IDs */
    processes?: string[];
}
/**
 * BPMN SubProcess properties defining subprocess behavior inputs.
 *
 * @interface BPMNSubProcessInput
 *
 * @private
 */
export interface BPMNSubProcessInput {
    /** Loop type */
    loop: string;
    /** Compensation flag */
    compensation: boolean;
    /** Ad-hoc flag */
    adhoc: boolean;
    /** Collapsed state flag */
    collapsed: boolean;
    /** Boundary event type */
    boundary: string;
    /** Child process IDs */
    processes?: string[];
    /** SubProcess type */
    type?: string;
}

/**
 * Base interface for all BPMN shapes.
 * All BPMN shapes extend this to share the common `type: 'Bpmn'` discriminator.
 *
 * @interface BPMNShapeBase
 *
 * @private
 */
export interface BPMNShapeBase {
    /** BPMN type identifier */
    readonly type: 'Bpmn';
}

/**
 * BPMN Event shape (Start, Intermediate, End events).
 * Discriminator: shape = 'Event'
 *
 * @interface BPMNEventShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNEventShape extends BPMNShapeBase {
    /** Shape discriminator */
    readonly shape: 'Event';
    /** Event configuration */
    readonly event: {
        /** Event type (Start, End, Intermediate, etc.) */
        event: string;
        /** Event trigger/result type */
        trigger: string;
    };
}

/**
 * BPMN Gateway shape (Exclusive, Parallel, Inclusive gateways).
 * Discriminator: shape = 'Gateway'
 *
 * @interface BPMNGatewayShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNGatewayShape extends BPMNShapeBase {
    /** Shape discriminator */
    readonly shape: 'Gateway';
    /** Gateway configuration */
    readonly gateway: {
        /** Gateway type (Exclusive, Parallel, Inclusive, etc.) */
        type: string;
    };
}

/**
 * BPMN Activity shape (Tasks and SubProcesses).
 * Discriminator: shape = 'Activity'
 *
 * @interface BPMNActivityShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNActivityShape extends BPMNShapeBase {
    /** Shape discriminator */
    readonly shape: 'Activity';
    /** Activity configuration */
    readonly activity: {
        /** Activity type (Task, SubProcess) */
        activity: string;
        /** Task-specific properties */
        task?: BPMNTask;
        /** SubProcess-specific properties */
        subProcess?: BPMNSubProcess;
    };
}

/**
 * BPMN Data Object shape.
 * Discriminator: shape = 'DataObject'
 *
 * @interface BPMNDataObjectShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNDataObjectShape extends BPMNShapeBase {
    /** Shape discriminator */
    readonly shape: 'DataObject';
    /** Data object configuration */
    readonly dataObject: {
        /** Is collection flag */
        collection: boolean;
        /** Data object type */
        type: string;
    };
}

/**
 * BPMN Text Annotation shape.
 * Discriminator: shape = 'TextAnnotation'
 *
 * @interface BPMNTextAnnotationShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNTextAnnotationShape extends BPMNShapeBase {
    /** Shape discriminator */
    readonly shape: 'TextAnnotation';
    /** Text annotation configuration */
    readonly textAnnotation: {
        /** Annotation direction relative to target */
        textAnnotationDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
        /** ID of the annotated element */
        textAnnotationTarget: string;
    };
}

/**
 * BPMN Simple shapes (DataSource, Message, Group).
 * Discriminator: shape can be 'DataSource' | 'Message' | 'Group'
 *
 * @interface BPMNSimpleShape
 * @extends BPMNShapeBase
 *
 * @private
 */
export interface BPMNSimpleShape extends BPMNShapeBase {
    /** Shape discriminator (DataSource, Message, or Group) */
    readonly shape: 'DataSource' | 'Message' | 'Group';
}

/**
 * Union type of all BPMN shapes.
 * TypeScript will automatically narrow the type based on the `shape` discriminator.
 * Use type guards (isBPMNEventShape, etc.) to safely access shape-specific properties.
 *
 * @typedef BPMNShape
 * @type {(BPMNEventShape | BPMNGatewayShape | BPMNActivityShape | BPMNDataObjectShape | BPMNTextAnnotationShape | BPMNSimpleShape)}
 *
 * @private
 */
export type BPMNShape =
    | BPMNEventShape
    | BPMNGatewayShape
    | BPMNActivityShape
    | BPMNDataObjectShape
    | BPMNTextAnnotationShape
    | BPMNSimpleShape;

/**
 * Type guard to check if a shape is a BPMN Event.
 * Use this to safely access event-specific properties.
 *
 * @param {BPMNShape} shape - The shape to check.
 * @returns {boolean} True if the shape is a BPMNEventShape; otherwise, false.
 *
 * @example
 * if (isBPMNEventShape(shape)) {
 *     console.log(shape.event.event); // Safe access to event type
 * }
 *
 * @private
 */
export function isBPMNEventShape(shape: BPMNShape): shape is BPMNEventShape {
    return shape.shape === 'Event';
}

/**
 * Type guard to check if a shape is a BPMN Activity.
 * Use this to safely access activity-specific properties (task or subprocess).
 *
 * @param {BPMNShape} shape - The shape to check.
 * @returns {boolean} True if the shape is a BPMNActivityShape; otherwise, false.
 *
 * @example
 * if (isBPMNActivityShape(shape)) {
 *     console.log(shape.activity.activity); // Safe access to activity type
 * }
 *
 * @private
 */
export function isBPMNActivityShape(shape: BPMNShape): shape is BPMNActivityShape {
    return shape.shape === 'Activity';
}

/**
 * Type guard to check if a shape is a BPMN Gateway.
 * Use this to safely access gateway-specific properties.
 *
 * @param {BPMNShape} shape - The shape to check.
 * @returns {boolean} True if the shape is a BPMNGatewayShape; otherwise, false.
 *
 * @example
 * if (isBPMNGatewayShape(shape)) {
 *     console.log(shape.gateway.type); // Safe access to gateway type
 * }
 *
 * @private
 */
export function isBPMNGatewayShape(shape: BPMNShape): shape is BPMNGatewayShape {
    return shape.shape === 'Gateway';
}

/**
 * Property mapping for BPMN shape attributes.
 * Used to extract and store BPMN-specific metadata from parsed XML.
 *
 * @interface BPMNPropertyMap
 *
 * @private
 */
export interface BPMNPropertyMap {
    /** Event type identifier */
    readonly eventType?: string;
    /** Event trigger or result value */
    readonly triggerOrResult?: string;
    /** Gateway type identifier */
    readonly gatewayType?: string;
    /** Exclusive gateway type */
    readonly exclusiveType?: string;
    /** Activity type */
    readonly activityType?: string;
    /** Loop type */
    readonly loopType?: string;
    /** Data collection flag */
    readonly collection?: string;
    /** Compensation flag */
    readonly isForCompensation?: string;
    /** Ad-hoc flag */
    readonly adHoc?: string;
    /** Collapsed state */
    readonly isCollapsed?: string;
    /** Boundary event type */
    readonly boundaryType?: string;
}

// ============================================================================
// Geometry & Path Types
// ============================================================================

/**
 * Configuration options for path generation from shape geometry.
 *
 * @interface PathOptions
 *
 * @private
 */
export interface PathOptions {
    /** Pin X coordinate */
    readonly pinX: number;
    /** Pin Y coordinate */
    readonly pinY: number;
    /** Shape width */
    readonly Width: number;
    /** Shape height */
    readonly Height: number;
}

/**
 * Bounding box and origin information for a group of geometries.
 *
 * @interface GlobalOrigin
 *
 * @private
 */
export interface GlobalOrigin {
    /** Minimum X coordinate */
    readonly minX: number;
    /** Minimum Y coordinate */
    readonly minY: number;
    /** Total width */
    readonly width: number;
    /** Total height */
    readonly height: number;
}

/**
 * Bounding box coordinates.
 *
 * @interface Bounds
 *
 * @private
 */
export interface Bounds {
    /** Minimum X coordinate */
    readonly minX: number;
    /** Minimum Y coordinate */
    readonly minY: number;
    /** Maximum X coordinate */
    readonly maxX: number;
    /** Maximum Y coordinate */
    readonly maxY: number;
}

/**
 * Single geometry item with dimensions and rows.
 *
 * @interface GeometryItem
 *
 * @private
 */
export interface GeometryItem {
    /** Pin X coordinate */
    readonly pinX: string | number;
    /** Pin Y coordinate */
    readonly pinY: string | number;
    /** Geometry width */
    readonly width: string | number;
    /** Geometry height */
    readonly height: string | number;
    /** Optional name */
    readonly Name?: string;
    /** Geometry rows defining the path */
    readonly Row?: OneOrMany<VisioRow>;
}

/**
 * Geometry with augmented properties for rendering.
 *
 * @interface AugmentedGeometry
 *
 * @private
 */
export interface AugmentedGeometry {
    /** Geometry rows */
    readonly Row?: OneOrMany<VisioRow>;
    /** Calculated width */
    readonly width?: number;
    /** Calculated height */
    readonly height?: number;
    /** Pin X coordinate */
    readonly pinX?: number;
    /** Pin Y coordinate */
    readonly pinY?: number;
    /** Local pin X coordinate */
    readonly LocPinX?: number;
    /** Local pin Y coordinate */
    readonly LocPinY?: number;
}

/**
 * Normalized shape geometries for group processing.
 * Separates global and child geometries.
 *
 * @interface NormalizedGroupShapes
 *
 * @private
 */
export interface NormalizedGroupShapes {
    /** Global bounding box and origin */
    readonly globalOrigin: GlobalOrigin;
    /** Individual geometry items */
    readonly normalizedGeometries: GeometryItem[];
}

/**
 * Discriminated union type for shape determination results.
 * Each shape type has its own structure with discriminator field.
 * Used after parsing to identify the exact shape type and its properties.
 *
 * Supported types:
 * - Basic: Basic geometric shapes
 * - Flow: Flowchart shapes
 * - Path: Custom path shapes
 * - Image: Embedded images
 * - UmlActivity: UML activity diagram elements
 * - BPMNShape: BPMN diagram shapes
 *
 * @typedef DetermineShapeResult
 * @type {Object}
 *
 * @private
 */
export type DetermineShapeResult =
    | { type: 'Basic'; shape: string }
    | { type: 'Flow'; shape: string }
    | { type: 'Path'; data: string | undefined }
    | { type: 'Image'; source: string }
    | { type: 'UmlActivity', shape: string }
    | BPMNShape;

/**
 * Raw shape data from parsed XML before transformation.
 *
 * @interface ShapeData
 *
 * @private
 */
export interface ShapeData {
    /** Cell elements */
    readonly Cell?: OneOrMany<VisioCell>;
    /** Section elements */
    readonly Section?: OneOrMany<VisioSection>;
    /** Child shapes container */
    readonly Shapes?: VisioShapesNode;
    /** Shape attributes */
    readonly $?: {
        /** Shape ID */
        readonly ID?: string;
        /** Shape name */
        readonly Name?: string;
        /** Shape type */
        readonly Type?: string;
    };
}

/**
 * Result of finding and augmenting geometries from a shape.
 * Separates main geometries from child group geometries.
 *
 * @interface FindGeometriesResult
 *
 * @private
 */
export interface FindGeometriesResult {
    /** Main shape geometries */
    readonly geometries: AugmentedGeometry[];
    /** Child geometries (for groups) */
    readonly childGeometries: AugmentedGeometry[];
}

/**
 * Shape attributes for type determination and property extraction.
 *
 * @interface Attributes
 *
 * @private
 */
export interface Attributes {
    /** Shape name */
    readonly Name?: string;
    /** Master reference */
    readonly Master?: string;
    /** Extensible properties */
    readonly [key: string]: unknown;
}

/**
 * Shape properties related to flipping/mirroring.
 *
 * @interface FlippableShape
 *
 * @private
 */
export interface FlippableShape {
    /** Horizontal flip flag */
    readonly flipX?: number | boolean;
    /** Vertical flip flag */
    readonly flipY?: number | boolean;
}

/**
 * Properties for a group shape structure.
 *
 * @interface GroupShapeData
 *
 * @private
 */
export interface GroupShapeData {
    /** Type must be 'Group' */
    readonly Type: 'Group';
    /** Child shape IDs or references */
    readonly children: string[];
}

/**
 * Scaling functions for converting shape dimensions and coordinates.
 *
 * @interface ScalingFunctions
 *
 * @private
 */
export interface ScalingFunctions {
    /** Scales X coordinates */
    readonly scaleX: (v: unknown) => number;
    /** Scales Y coordinates */
    readonly scaleY: (v: unknown) => number;
    /** Scales X radius/width */
    readonly radiusX: (v: unknown) => number;
    /** Scales Y radius/height */
    readonly radiusY: (v: unknown) => number;
}

/**
 * Configuration for path generation.
 * Controls how paths are created from geometry data.
 *
 * @interface PathConfig
 *
 * @private
 */
export interface PathConfig {
    /** Use local shape coordinates instead of global */
    readonly useLocalScaling?: boolean;
}

/**
 * Tracks the last known point coordinates during path drawing.
 * Used to calculate relative coordinates in path commands.
 *
 * @interface PathCoordinates
 *
 * @private
 */
export interface PathCoordinates {
    /** Last X coordinate */
    lastX: number;
    /** Last Y coordinate */
    lastY: number;
}

// ============================================================================
// Types for annotation text, transforms, and binding
// ============================================================================

/**
 * Visio text content wrapper.
 *
 * @interface VisioText
 *
 * @private
 */
export interface VisioText {
    /** Text string content */
    readonly value?: string;
}

/**
 * Represents a Visio shape's transform (position, size, rotation).
 * Used for calculating text positioning relative to the shape.
 *
 * @interface VisioShapeTransform
 *
 * @private
 */
export interface VisioShapeTransform {
    /** Shape center X coordinate in inches */
    pinX: number;
    /** Shape center Y coordinate in inches */
    pinY: number;
    /** Shape width in inches */
    width: number;
    /** Shape height in inches */
    height: number;
    /** Optional shape rotation angle in radians */
    angle?: number;
    /** Shape vertical alignment */
    verticalAlignment?: string;
}

/**
 * Represents a Visio text block's transform properties.
 * Contains positioning and sizing information for text within/around a shape.
 *
 * @interface VisioTextTransform
 *
 * @private
 */
export interface VisioTextTransform {
    /** Text box margin settings */
    txtMargin?: VisioMarginModel;
    /** Text box width in inches */
    txtWidth: number;
    /** Text box height in inches */
    txtHeight: number;
    /** Text pin X coordinate (relative to shape) */
    txtPinX: number;
    /** Text pin Y coordinate (relative to shape) */
    txtPinY: number;
    /** Text local pin X coordinate */
    txtLocPinX: number;
    /** Text local pin Y coordinate */
    txtLocPinY: number;
    /** Text rotation in radians */
    txtAngle?: number;
}

/**
 * Represents a Syncfusion text binding with offset.
 * Result of text transform calculations for positioning annotations.
 *
 * @interface SyncfusionTextBinding
 *
 * @private
 */
export interface SyncfusionTextBinding {
    /** Text offset as normalized coordinates (0-1) */
    offset: { x: number; y: number };
}

// ============================================================================
// Connector Geometry & Utilities (shared)
// ============================================================================

/**
 * Weighted control point for NURBS curves.
 * Contains XY coordinates and weight value for curve calculation.
 *
 * @typedef WCP
 * @type {Object}
 *
 * @private
 */
export type WCP = {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Weight value for NURBS calculation */
    w: number;
};

/**
 * Extracted geometry data from a Visio shape path.
 * Identifies point sequences and segment characteristics.
 *
 * @interface GeometryData
 *
 * @private
 */
export interface GeometryData {
    /** Sequence of points with type metadata */
    points: PointWithType[];
    /** Has orthogonal (H/V) segments */
    hasOrthogonalSegment: boolean;
    /** Has diagonal (non-90°) segments */
    hasDiagonalSegment: boolean;
}

/**
 * Control point set parsed from a NURBS formula.
 * Represents a single control point in NURBS curve definition.
 *
 * @interface ControlPointSet
 *
 * @private
 */
export interface ControlPointSet {
    /** Point X coordinate */
    x: number;
    /** Point Y coordinate */
    y: number;
    /** Knot value */
    knot: number;
    /** Point weight */
    weight: number;
}

/**
 * Parsed NURBS curve parameters.
 * Contains degree, control points, and knot vector information.
 *
 * @interface NurbsParameters
 *
 * @private
 */
export interface NurbsParameters {
    /** Last knot value */
    knotLast: number;
    /** Curve degree (typically 3 for cubic) */
    degree: number;
    /** X coordinate type */
    xType: number;
    /** Y coordinate type */
    yType: number;
    /** Array of control points */
    controlPoints: ControlPointSet[];
}

/**
 * Extracted NURBS data from geometry rows.
 * Combines starting point and NURBS curve definitions.
 *
 * @interface ExtractedNurbsData
 *
 * @private
 */
export interface ExtractedNurbsData {
    /** Initial MoveTo point */
    moveTo: Point;
    /** NURBS curve definitions keyed by row index */
    nurbsTo: Record<string, { F?: string; V: string }>;
}

/**
 * Bezier segment in local shape coordinates.
 * Defines a cubic Bezier curve with control points.
 *
 * @interface BezierSegment
 *
 * @private
 */
export interface BezierSegment {
    /** Start point */
    p0: Vec2;
    /** First control point */
    c1: Vec2;
    /** Second control point */
    c2: Vec2;
    /** End point */
    p1: Vec2;
}

/**
 * Bezier segment mapped to page/global coordinates.
 * Represents a Bezier curve in the diagram's coordinate system.
 *
 * @interface PageBezierSegment
 *
 * @private
 */
export interface PageBezierSegment {
    /** Start point with type metadata */
    p0: PointWithType;
    /** First control point with type metadata */
    c1: PointWithType;
    /** Second control point with type metadata */
    c2: PointWithType;
    /** End point with type metadata */
    p1: PointWithType;
}

/**
 * Input container for connector parsing.
 * Provides shape elements and connection definitions for processing.
 *
 * @interface VisioConnectorInput
 *
 * @private
 */
export interface VisioConnectorInput {
    /** Shape elements to process */
    Shape: OneOrMany<VisioShapeNode>;
    /** Optional connection definitions */
    Connect?: OneOrMany<VisioConnectElement>;
}

/**
 * Segments configuration for a connector in the diagram.
 * Defines routing type and visual properties.
 *
 * @interface VisioSegmentsModel
 *
 * @private
 */
export interface VisioSegmentsModel {
    /** Number of segments */
    length?: number;
    /**
     * Direction enum string like 'Left' | 'Right' | 'Top' | 'Bottom'
     * Uses the shared Direction union for stronger typing.
     */
    direction?: Direction;
    /**
     * Routing algorithm type ('Orthogonal' | 'Straight' | 'Bezier')
     * Uses the shared ConnectorType union for stronger typing.
     */
    type?: ConnectorType;
}

// ============================================================================
// SECTION 9: UML SHAPE TYPES
// ============================================================================

/**
 * Represents a member in a UML class, interface, or enumeration.
 * Defines a single attribute, method, or enumeration value.
 *
 * @interface Member
 *
 * @private
 */
export interface Member {
    /** Member name */
    name: string;
}

/**
 * Represents a UML Enumeration classifier shape.
 * Defines an enumeration type with member values.
 *
 * @interface UmlEnumeration
 *
 * @private
 */
export interface UmlEnumeration {
    /** Type identifier ('UmlClassifier') */
    type: string;
    /** Classifier type ('Enumeration') */
    classifier: string;
    /** Enumeration definition */
    enumeration: {
        /** Enumeration name */
        name: string;
        /** Array of enumeration members */
        members: string[];
        /** Child shape IDs */
        childID: string[];
    };
}

/**
 * Represents a UML Interface classifier shape.
 * Defines an interface type with methods and attributes.
 *
 * @interface UmlInterfaceShape
 *
 * @private
 */
export interface UmlInterfaceShape {
    /** Classifier type ('Interface') */
    classifier: string;
    /** Type identifier ('UmlClassifier') */
    type: string;
    /** Interface definition */
    interface: {
        /** Interface name */
        name: string;
        /** Array of attributes/properties */
        attributes: any[];
        /** Array of methods */
        methods: any[];
        /** Child shape IDs for members */
        childID: string[];
    };
}

/**
 * Represents a UML Class classifier shape.
 * Defines a class type with attributes and methods.
 *
 * @interface UmlClassShape
 *
 * @private
 */
export interface UmlClassShape {
    /** Classifier type ('Class') */
    classifier: string;
    /** Type identifier ('UmlClassifier') */
    type: string;
    /** Class definition */
    class: {
        /** Class name */
        name: string;
        /** Array of class attributes/properties */
        attributes: any[];
        /** Array of class methods */
        methods: any[];
        /** Child shape IDs for members */
        childID: string[];
    };
}

/**
 * Property map for BPMN shapes extracted from Property section.
 * Maps property names to their string values.
 *
 * @typedef BPMNPropertyMapType
 * @type {Map<string, string>}
 *
 * @private
 */
export type BPMNPropertyMapType = Map<string, string>;

/**
 * Represents a BPMN Event shape result with type and configuration.
 *
 * @interface BPMNEventShapeResult
 *
 * @private
 */
export interface BPMNEventShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'Event';
    /** Event configuration */
    event: {
        /** Event type (Start, End, Intermediate, etc.) */
        event: string;
        /** Event trigger type */
        trigger: string;
    };
}

/**
 * Represents a BPMN Gateway shape result with type and configuration.
 *
 * @interface BPMNGatewayShapeResult
 *
 * @private
 */
export interface BPMNGatewayShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'Gateway';
    /** Gateway configuration */
    gateway: {
        /** Gateway type */
        type: string;
    };
}

/**
 * Represents a BPMN Activity shape result with type and configuration.
 *
 * @interface BPMNActivityShapeResult
 *
 * @private
 */
export interface BPMNActivityShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'Activity';
    /** Activity configuration */
    activity: {
        /** Activity type */
        activity: string;
        /** Task properties (if applicable) */
        task?: BPMNTask;
        /** SubProcess properties (if applicable) */
        subProcess?: BPMNSubProcess;
    };
}

/**
 * Represents a BPMN DataObject shape result.
 *
 * @interface BPMNDataObjectShapeResult
 *
 * @private
 */
export interface BPMNDataObjectShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'DataObject';
    /** DataObject configuration */
    dataObject: {
        /** Is collection flag */
        collection: boolean;
        /** DataObject type */
        type: string;
    };
}

/**
 * Represents a BPMN TextAnnotation shape result.
 *
 * @interface BPMNTextAnnotationShapeResult
 *
 * @private
 */
export interface BPMNTextAnnotationShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'TextAnnotation';
    /** TextAnnotation configuration */
    textAnnotation: {
        /** Annotation direction */
        textAnnotationDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
        /** Target element ID */
        textAnnotationTarget: string;
    };
}

/**
 * Represents a BPMN simple shape (DataSource, Message, Group).
 *
 * @interface BPMNSimpleShapeResult
 *
 * @private
 */
export interface BPMNSimpleShapeResult {
    /** Shape type */
    type: 'Bpmn';
    /** Shape subtype */
    shape: 'DataSource' | 'Message' | 'Group';
}

/**
 * Union type for all BPMN shape results from getBPMNShapes function.
 *
 * @typedef BPMNShapeResult
 * @type {(BPMNEventShapeResult | BPMNGatewayShapeResult | BPMNActivityShapeResult | BPMNDataObjectShapeResult | BPMNTextAnnotationShapeResult | BPMNSimpleShapeResult)}
 *
 * @private
 */
export type BPMNShapeResult =
    | BPMNEventShapeResult
    | BPMNGatewayShapeResult
    | BPMNActivityShapeResult
    | BPMNDataObjectShapeResult
    | BPMNTextAnnotationShapeResult
    | BPMNSimpleShapeResult;

/**
 * Represents a BPMN flow shape (connector) result.
 *
 * @interface BPMNFlowShapeResult
 *
 * @private
 */
export interface BPMNFlowShapeResult {
    /** Flow type */
    type: 'Bpmn';
    /** Flow subtype */
    flow: 'Association' | 'Sequence' | 'Message';
    /** Association direction (if applicable) */
    association?: 'Default' | 'BiDirectional' | 'Directional';
    /** Sequence type (if applicable) */
    sequence?: 'Default' | 'Normal' | 'Conditional';
    /** Message type (if applicable) */
    message?: 'Default';
}

/**
 * Represents a UML connector result with relationship information.
 *
 * @interface UMLConnectorResult
 *
 * @private
 */
export interface UMLConnectorResult {
    /** Connector type */
    type: 'UmlClassifier';
    /** Relationship type */
    relationship: string;
    /** Multiplicity information */
    multiplicity?: {
        /** Multiplicity type */
        type: string;
        /** Source multiplicity */
        source: {
            /** Optional flag */
            optional: boolean;
            /** Lower bound */
            lowerBounds: string;
            /** Upper bound */
            upperBounds: string;
        };
        /** Target multiplicity */
        target: {
            /** Optional flag */
            optional: boolean;
            /** Lower bound */
            lowerBounds: string;
            /** Upper bound */
            upperBounds: string;
        } | null;
    };
}

/**
 * Represents a UML Activity shape result.
 *
 * @interface UMLActivityShapeResult
 *
 * @private
 */
export interface UMLActivityShapeResult {
    /** Shape type */
    type: 'UmlActivity';
    /** Activity shape name */
    shape: string;
}

/**
 * Media mapping result with ID to dataUrl mapping.
 *
 * @interface MediaMappingItem
 *
 * @private
 */
export interface MediaMappingItem {
    /** Media ID */
    Id: string;
    /** Data URL for embedding */
    dataUrl: string;
}

/**
 * Node shape configuration for setNodeShape function.
 *
 * @interface NodeShapeConfig
 *
 * @private
 */
export interface NodeShapeConfig {
    /** Shape type */
    type: 'Basic' | 'Flow' | 'Path' | 'Image' | 'Bpmn' | 'UmlClassifier' | 'UmlActivity';
    /** Shape name (for Basic/Flow) */
    shape?: string;
    /** Path data (for Path shapes) */
    data?: string;
    /** Image source (for Image shapes) */
    source?: string;
    /** Corner radius */
    cornerRadius: number;
    /** Additional BPMN/UML properties */
    [key: string]: unknown;
}

// Add these types to visio-types.ts

/**
 * Configuration object for applying common node properties.
 * Contains all necessary data for populating a VisioShape instance.
 *
 * @interface ApplyCommonNodePropertiesArgs
 * @private
 */
export interface ApplyCommonNodePropertiesArgs {
    /** Map of cell name -> value for this shape */
    cellMap: Map<string, CellMapValue>;
    /** XML attributes from the shape element */
    attributes: ShapeAttributes;
    /** Default/fallback data from the master definition */
    defaultData: DefaultShapeData;
    /** Page height in pixels (for Y coordinate conversion) */
    pageHeight: number;
    /** Whether PinY cell exists on this shape */
    pinYExists: boolean;
    /** Parser context with page, theme, and master data */
    context: ParsingContext;
    /** Map of geometry-level cells (e.g., NoShow) */
    getcell: Map<string, CellMapValue>;
    /** The raw shape XML data object */
    shapeData: VisioShapeNode;
}

/**
 * Default shape data extracted from master definitions.
 * Contains fallback values for shape properties.
 *
 * @interface DefaultShapeData
 * @private
 */
export interface DefaultShapeData {
    /** Shape width in inches */
    Width?: number;
    /** Shape height in inches */
    Height?: number;
    /** Shape name/identifier */
    Name?: string;
    /** Y coordinate of shape pin */
    pinY?: number;
    /** X coordinate of shape pin */
    pinX?: number;
    /** Connection points/ports */
    Ports?: VisioPort[];
    /** Quick style line color index */
    QuickStyleLineColor?: number;
    /** Quick style fill color index */
    QuickStyleFillColor?: number;
    /** Quick style shadow color index */
    QuickStyleShadowColor?: number;
    /** Quick style line matrix index */
    QuickStyleLineMatrix?: number;
    /** Quick style fill matrix index */
    QuickStyleFillMatrix?: number;
    /** Quick style effects matrix index */
    QuickStyleEffectsMatrix?: number;
    /** Quick style font matrix index */
    QuickStyleFontMatrix?: number;
    /** Default shape style properties */
    shapeStyle?: StyleEntry[] | Record<string, CellMapValue>;
    /** Geometry rows defining the shape path */
    Row?: OneOrMany<VisioRow>;
    /** Master shape ID */
    masterID?: string;
    /** Shape type name */
    shapeName?: string;
    /** Shape type identifier */
    shapeType?: string;
}

/**
 * Geometry data object stored in context during shape parsing.
 * Contains processed geometry information for shape rendering.
 *
 * @interface GeometryData
 * @private
 */
export interface GeometryDataObject {
    /** Section name identifier */
    N: string;
    /** Geometry rows defining the path */
    Row?: OneOrMany<VisioRow>;
    /** Shape width */
    Width: number;
    /** Shape height */
    Height: number;
    /** Local pin X coordinate */
    LocPinX: number;
    /** Local pin Y coordinate */
    LocPinY: number;
    /** Begin X coordinate (for connectors) */
    beginX?: string;
    /** Begin Y coordinate (for connectors) */
    beginY?: string;
    /** End X coordinate (for connectors) */
    endX?: string;
    /** End Y coordinate (for connectors) */
    endY?: string;
    /** Master shape ID reference */
    masterID?: string;
    /** Shape name from master */
    shapeName?: string;
    /** Shape type from master */
    shapeType?: string;
    /** Connection points */
    ports: VisioPort[];
    /** Fill/background color */
    fillColor?: string;
    /** Default shape style */
    shapeStyle?: StyleEntry[];
    /** Text box width */
    txtWidth?: number;
    /** Text box height */
    txtHeight?: number;
    /** Text pin X coordinate */
    txtPinX?: number;
    /** Text pin Y coordinate */
    txtPinY?: number;
    /** Text local pin X coordinate */
    txtLocalPinX?: number;
    /** Text local pin Y coordinate */
    txtLocalPinY?: number;
    /** Quick style line color index */
    QuickStyleLineColor?: number;
    /** Quick style fill color index */
    QuickStyleFillColor?: number;
    /** Quick style shadow color index */
    QuickStyleShadowColor?: number;
    /** Quick style font color index */
    QuickStyleFontColor?: number;
    /** Quick style line matrix index */
    QuickStyleLineMatrix?: number;
    /** Quick style fill matrix index */
    QuickStyleFillMatrix?: number;
    /** Quick style effects matrix index */
    QuickStyleEffectsMatrix?: number;
    /** Quick style font matrix index */
    QuickStyleFontMatrix?: number;
}

/**
 * Type alias for style entry objects containing key-value pairs.
 * Used internally when converting between style array and object formats.
 *
 * @interface StyleEntry
 * @private
 */
export interface StyleEntry {
    /** The style property name (e.g., 'cornerRadius', 'strokeWidth') */
    readonly key: string;
    /** The style property value */
    readonly value: CellMapValue;
}

/**
 * Coordinate values for geometry row processing.
 * Contains all possible coordinate parameters used in different row types.
 *
 * @interface GeometryRowCoordinates
 * @private
 */
export interface GeometryRowCoordinates {
    /** X coordinate value */
    X?: number;
    /** Y coordinate value */
    Y?: number;
    /** A coordinate value (control point or radius) */
    A?: number;
    /** B coordinate value (control point or radius) */
    B?: number;
    /** C coordinate value (control point or angle) */
    C?: number;
    /** D coordinate value (control point) */
    D?: number;
}

/**
 * Represents a geometry object with rows and dimensional properties.
 * Used internally during path generation from shape geometries.
 *
 * @interface GeometryWithRows
 * @private
 */
export interface GeometryWithRows {
    /** Geometry name identifier */
    Name?: string;
    /** Geometry rows defining the path */
    Row?: OneOrMany<VisioRow>;
    /** Geometry height */
    height?: number;
    /** Geometry width */
    width?: number;
    /** Alternative height property name */
    Height?: number;
    /** Alternative width property name */
    Width?: number;
}

/**
 * Represents a shape-like structure that may contain child shapes.
 * Used for recursive geometry traversal in group shapes.
 *
 * @interface ShapeLikeStructure
 * @private
 */
export interface ShapeLikeStructure {
    /** Child shapes container */
    Shapes?: {
        /** Child shape elements */
        Shape: OneOrMany<VisioShapeNode>;
    };
    /** Cell elements */
    Cell?: OneOrMany<VisioCell>;
    /** Section elements */
    Section?: OneOrMany<VisioSection>;
}

// ======== ADDITIONS FOR THEME/STYLE TYPING (used by visio-theme.ts) ========

/**
 * Minimal representation of DrawingML "preset dash" holder for a line.
 */
export interface PrstDash {
    $: { val: string };
}

/**
 * Minimal representation of a Line Style element (a:ln) used by Visio theme
 * for stroke width, dash pattern and solid fill color.
 */
export interface LineStyleElement {
    /** Attributes: width in EMU (w) */
    $: { w: number };
    /** Preset dash pattern holder */
    'a:prstDash': PrstDash;
    /** Optional solid fill definition */
    'a:solidFill'?: SolidFillValue;
}

/**
 * Connector stroke list container inside VisioTheme (shape theme).
 * We only need the array of a:ln entries with above structure.
 */
export interface ConnectorStrokeList {
    'a:ln': LineStyleElement[];
}

/**
 * Color modifier element
 */
export interface ColorModifier {
    $: { val: string };
}

/**
 * Gradient stop attributes (pos in 1/1000ths of percent)
 */
export interface GradientStopAttributes {
    pos: string;
}

// DrawingML system/preset color element (a:sysClr or a:prstClr)
export interface SystemColor {
    $: { val: string };           // system/preset color name
    order?: ThemeOrderEntry[];    // optional ordering metadata
}

/**
 * Solid fill (a:solidFill) color value. The "value" property is used by our parser.
 */
export interface SolidFillValue {
    value?: SolidFillValue;
    'a:srgbClr'?: SrgbColor;
    'a:schemeClr'?: SchemeColor;
    'a:sysClr'?: SystemColor;
    'a:prstClr'?: SystemColor;
}

/**
 * Pattern fill (a:pattFill) value with foreground/background colors.
 */
export interface PatternFillValue {
    'a:fgClr'?: SolidFillValue;
    'a:bgClr'?: SolidFillValue;
}

/**
 * Scheme color element with optional modifiers.
 */
export interface SchemeColor {
    $: { val: string };
    'a:tint'?: ColorModifier;
    'a:shade'?: ColorModifier;
    'a:lumMod'?: ColorModifier;
    'a:lumOff'?: ColorModifier;
    'a:satMod'?: ColorModifier;
    'a:satOff'?: ColorModifier;
    'a:hueMod'?: ColorModifier;
    'a:hueOff'?: ColorModifier;
    'a:alpha'?: ColorModifier;
    'a:alphaMod'?: ColorModifier;
    'a:alphaOff'?: ColorModifier;
    'a:hueShift'?: ColorModifier;
    order?: ThemeOrderEntry[];
}

/**
 * Theme order entry used in various theme nodes.
 */
export interface ThemeOrderEntry {
    name: string;
    value: SchemeColor | ColorModifier | ParsedXmlObject;
}

/**
 * Node style subset used for gradient resolution in getNodeStyle().
 */
export interface NodeGradientStyleCoordinatesLinear {
    x1: number; y1: number; x2: number; y2: number;
}
export interface NodeGradientStyleCoordinatesRadial {
    cx: number; cy: number; fx: number; fy: number; r: number;
}
export type NodeGradientType = 'Linear' | 'Radial';

export interface NodeStyleForGradient {
    isGradientEnabled?: boolean;
    type?: NodeGradientType;
    gradientType?: NodeGradientType;
    gradientCoordinates: NodeGradientStyleCoordinatesLinear | NodeGradientStyleCoordinatesRadial;
    gradientStops: { offset: number; color: string; opacity?: number }[];
}

/**
 * Connector-like input used by applyThemeStyles().
 */
export interface ConnectorInput extends VisioNode {
    IsConnector?: boolean;
    style: {
        strokeColor?: string;
        strokeDashArray?: string;
        strokeWidth?: number;
        opacity: number;
    };
}

// Add below DefaultShapeData/GeometryDataObject in visio-types.ts

/**
 * Normalized default values returned by setDefaultData().
 * Combines common default/master fields used during parsing.
 */
export interface MasterDefaultValues {
    masterID?: string,
    shapeName?: string,
    Width?: number;
    Height?: number;
    LocPinX?: number;
    LocPinY?: number;
    Name?: string;
    beginX?: string;
    beginY?: string;
    endX?: string;
    endY?: string;
    N?: string;
    Row?: OneOrMany<VisioRow>;
    ports?: VisioPort[];
    shapeStyle?: StyleEntry[] | Record<string, CellMapValue>;
    txtWidth?: number;
    txtHeight?: number;
    txtPinX?: number;
    txtPinY?: number;
    txtLocalPinX?: number;
    txtLocalPinY?: number;
    Ports?: VisioPort[];
    QuickStyleLineColor?: number;
    QuickStyleFillColor?: number;
    QuickStyleShadowColor?: number;
    QuickStyleFontColor?: number;
    QuickStyleLineMatrix?: number;
    QuickStyleFillMatrix?: number;
    QuickStyleEffectsMatrix?: number;
    QuickStyleFontMatrix?: number;
    FillPattern?: string;
    FillForegndTrans?: number;
}

/**
 * The shape property that a connector can carry when it represents BPMN/UML connector metadata.
 * It is the union type that can be returned by getConnectorShape() in visio-connectors.ts
 */
export type ConnectorShapePayload = BPMNFlowShapeResult | UMLConnectorResult | undefined;

/**
 * Gradient used by connector decorators.
 * Linear connector gradient with stops.
 */
export interface LinearConnectorGradient {
    type: 'Linear';
    x1: number; y1: number; x2: number; y2: number;
    stops: GradientStop[];
}

/**
 * Radial connector gradient with stops.
 */
export interface RadialConnectorGradient {
    type: 'Radial';
    cx: number; cy: number; fx: number; fy: number; r: number;
    stops: GradientStop[];
}

/**
 * Union gradient type for connector decorators.
 */
export type ConnectorGradient = LinearConnectorGradient | RadialConnectorGradient;
