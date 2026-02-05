import { VisioAnnotation } from './visio-annotations';
import { VisioConnector } from './visio-connectors';
import { shapeIndex } from './visio-nodes';
import { ConnectorType, DecoratorShapes, DetermineShapeResult, FontProps, FormattedColors, GradientStop, GradientVector, LineStyleList, OrderEntry, RadialGradientConfig, VarStyle, VisioMedia, VisioPort, VisioRow } from './visio-types';

/**
 * Represents the styling properties of a Visio shape (colors, gradients, strokes).
 * This class encapsulates all visual styling applied to a shape including fill, stroke,
 * and advanced gradient properties. Properties are optional to support partial styling.
 *
 * @example
 * const style = new VisioNodeStyle();
 * style.fillColor = '#FF0000';
 * style.strokeWidth = 2;
 * style.isGradientEnabled = true;
 * style.gradientType = 'Linear';
 *
 * @private
 */
export class VisioNodeStyle {
    /**
     * The fill color of the shape in hex format (e.g., "#FF0000" for red).
     * If undefined, the shape has no fill or uses a default fill.
     *
     * @type {string | undefined}
     */
    fillColor?: string;

    /**
     * The opacity/transparency of the shape's fill (0.0 = fully transparent, 1.0 = fully opaque).
     * Default is fully opaque (1). For images, this is parsed from the Transparency cell;
     * for other shapes, from FillForegndTrans cell.
     *
     * @type {number}
     * @default 1
     */
    opacity: number = 1;

    /**
     * The stroke (border) color of the shape in hex format.
     * If undefined, the shape has no stroke or uses a default stroke color.
     *
     * @type {string | undefined}
     */
    strokeColor?: string;

    /**
     * The dash pattern for strokes (e.g., "5,5" for dashed lines).
     * Default "0" represents a solid line. Note: Visio and EJ2 dash patterns are approximate.
     *
     * @type {string | undefined}
     * @default "0"
     */
    strokeDashArray?: string;

    /**
     * The width/thickness of the stroke in pixels.
     * Default is 1 pixel. Value is extracted from the LineWeight cell.
     *
     * @type {number}
     * @default 1
     */
    strokeWidth: number = 1;

    // ==================== Gradient Properties ====================

    /**
     * Indicates whether gradient fill is enabled for this shape.
     * When true, gradient settings (type, angle, stops, etc.) should be applied.
     * Gradients in EJ2 are approximations of Visio gradients.
     *
     * @type {boolean}
     * @default false
     */
    isGradientEnabled: boolean = false;

    /**
     * The type of gradient applied ('Linear' for linear gradients, 'Radial' for radial gradients).
     * Rectangle and path gradient types from Visio are not supported in EJ2.
     *
     * @type {'Linear' | 'Radial'}
     * @default 'Linear'
     */
    gradientType: 'Linear' | 'Radial' = 'Linear';

    /**
     * The angle of the gradient in degrees (0-360).
     * For linear gradients, this defines the direction of the gradient flow.
     * Converted from radians in Visio (FillGradientAngle cell).
     *
     * @type {number}
     * @default 0
     */
    gradientAngle: number = 0;

    /**
     * The gradient coordinate information defining start/end points or center/radius.
     * For linear gradients, this is a GradientVector with x1, y1, x2, y2.
     * For radial gradients, this is RadialGradientConfig with cx, cy, r, fx, fy.
     *
     * @type {GradientVector | RadialGradientConfig | undefined}
     */
    gradientCoordinates?: GradientVector | RadialGradientConfig;

    /**
     * Array of gradient color stops defining color transitions in the gradient.
     * Each stop contains a position (0-1) and color value.
     * Extracted from the FillGradient section of the shape.
     *
     * @type {GradientStop[] | undefined}
     */
    gradientStops?: GradientStop[];

    /**
     * The background/secondary color used in gradients.
     * This is the gradient destination color (extracted from FillBkgnd cell).
     * Default fallback color is '#1b2811' if not specified.
     *
     * @type {string}
     */
    gradient: string;

    /**
     * The fill pattern type for non-gradient fills (e.g., hatching, dots).
     * Falls back to defaultStyle.FillPattern if not explicitly set on the shape.
     *
     * @type {string | undefined}
     */
    fillPattern?: string;

    /**
     * The line pattern type for non-gradient lines (e.g., hatching, dots).
     *
     * @type {string | undefined}
     */
    linePattern?: string;
}

/**
 * Interface for shadow offset configuration providing type-safe distance and angle properties.
 * Used to represent the offset of a shadow effect applied to a shape.
 *
 * @example
 * const offset: VisioShadowOffset = {
 *     angle: 45,      // Shadow direction in degrees
 *     distance: 5     // Shadow distance in pixels
 * };
 *
 * @private
 */
export interface VisioShadowOffset {
    /**
     * The angle/direction of the shadow offset in degrees (0-360).
     * 0° typically means the shadow extends to the right,
     * 90° means downward, etc.
     *
     * @type {number}
     */
    angle: number;

    /**
     * The distance the shadow extends from the shape in pixels or coordinate units.
     * Determines how far the shadow appears from the shape edge.
     *
     * @type {number}
     */
    distance: number;
}

/**
 * Represents shadow properties applied to a Visio shape.
 * Encapsulates outer shadow effects with color, opacity, and offset information.
 * EJ2 only supports outer shadows; other shadow types (e.g., "offset center") cannot be replicated.
 *
 * @example
 * const shadow = new VisioNodeShadow();
 * shadow.shadowPattern = true;
 * shadow.shadowOpacity = 0.8;
 * shadow.shadowcolor = '#000000';
 * shadow.shadow = { angle: 45, distance: 5 };
 *
 * @private
 */
export class VisioNodeShadow {
    /**
     * Indicates whether a shadow pattern is enabled for this shape.
     * Corresponds to the ShdwPattern cell value (non-zero = shadow enabled).
     *
     * @type {boolean}
     * @default false
     */
    shadowPattern: boolean = false;

    /**
     * The shadow type identifier (e.g., '0' for Outer, '1' for Offset Center).
     * Only 'Outer' shadow type is supported in EJ2.
     * Extracted from the ShapeShdwType cell.
     *
     * @type {string | undefined}
     */
    shapeShadowType?: string;

    /**
     * The shadow visibility flag indicating whether the shadow should be displayed.
     * Extracted from the ShapeShdwShow cell.
     *
     * @type {string | undefined}
     */
    shapeShadowShow?: string;

    /**
     * The opacity/transparency of the shadow (0.0 = fully transparent, 1.0 = fully opaque).
     * Calculated as (1 - ShdwForegndTrans) to convert Visio transparency to opacity.
     * Default is fully opaque (1).
     *
     * @type {number}
     * @default 1
     */
    shadowOpacity: number = 1;

    /**
     * The color of the shadow in hex format (e.g., "#000000" for black).
     * Extracted from the ShdwForegnd cell.
     * Default fallback color is '#ffffff' if not specified.
     *
     * @type {string | undefined}
     */
    shadowcolor?: string;

    /**
     * The shadow offset configuration containing angle and distance properties.
     * Calculated from ShapeShdwOffsetX, ShapeShdwOffsetY, and ShapeShdwScaleFactor cells.
     * Defines how the shadow is displaced from the shape.
     *
     * @type {VisioShadowOffset | undefined}
     */
    shadow?: VisioShadowOffset;
}

/**
 * Represents default shape data template used for applying master defaults to shapes.
 * When a shape references a master, these defaults provide fallback dimensions,
 * ports, geometry, and styling properties if not explicitly set on the shape.
 *
 * @example
 * const defaults: VisioShapeDefaults = {
 *     masterID: 'M1',
 *     shapeName: 'Rectangle',
 *     Width: 100,
 *     Height: 50,
 *     Ports: [{ id: 'port0', x: 50, y: 0, ... }]
 * };
 *
 * @private
 */
export interface VisioShapeDefaults {
    /**
     * The unique identifier of the master this defaults object represents.
     * Used to match shapes to their corresponding master definition.
     *
     * @type {string | undefined}
     */
    masterID?: string;

    /**
     * The display name/label of the shape from the master definition.
     * Serves as a fallback shape name if the individual shape has no name.
     *
     * @type {string | undefined}
     */
    shapeName?: string;

    /**
     * The shape type category (e.g., 'Shape', 'Connector', 'Group').
     * Helps determine which rendering/processing logic to apply.
     *
     * @type {string | undefined}
     */
    shapeType?: string;

    /**
     * The default width of the shape in coordinate units (typically inches or centimeters).
     * Applied as fallback if the shape instance doesn't have an explicit width.
     *
     * @type {number | undefined}
     */
    Width?: number;

    /**
     * The default height of the shape in coordinate units.
     * Applied as fallback if the shape instance doesn't have an explicit height.
     *
     * @type {number | undefined}
     */
    Height?: number;

    /**
     * The local pin X coordinate (horizontal offset of the shape's pin from its left edge).
     * Used for positioning and rotation calculations.
     *
     * @type {string | number | undefined}
     */
    LocPinX?: string | number;

    /**
     * The local pin Y coordinate (vertical offset of the shape's pin from its bottom edge).
     * Used for positioning and rotation calculations.
     *
     * @type {string | number | undefined}
     */
    LocPinY?: string | number;

    /**
     * The X coordinate of the begin point for line/connector shapes.
     * Applies primarily to connector and line shapes.
     *
     * @type {string | undefined}
     */
    beginX?: string;

    /**
     * The Y coordinate of the begin point for line/connector shapes.
     * Applies primarily to connector and line shapes.
     *
     * @type {string | undefined}
     */
    beginY?: string;

    /**
     * The X coordinate of the end point for line/connector shapes.
     * Applies primarily to connector and line shapes.
     *
     * @type {string | undefined}
     */
    endX?: string;

    /**
     * The Y coordinate of the end point for line/connector shapes.
     * Applies primarily to connector and line shapes.
     *
     * @type {string | undefined}
     */
    endY?: string;

    /**
     * The geometry rows defining the shape's path/outline.
     * Can be a single row or array of rows from the Geometry section.
     *
     * @type {VisioRow | VisioRow[] | undefined}
     */
    Row?: VisioRow | VisioRow[];

    /**
     * Array of connection point definitions for this shape.
     * Each port represents a location where connectors can attach.
     *
     * @type {VisioPort[] | undefined}
     */
    Ports?: VisioPort[];

    /**
     * The default fill color for the shape in hex format.
     * Applied when the shape doesn't specify its own fill color.
     *
     * @type {string | undefined}
     */
    fillColor?: string;

    /**
     * The default name/label for the shape instances using this master.
     *
     * @type {string | undefined}
     */
    Name?: string;
}

/**
 * Interface for shape type information metadata.
 * Provides type classification and extensible properties for shape categorization.
 *
 * @example
 * const typeInfo: VisioShapeTypeInfo = {
 *     type: 'Process',
 *     category: 'Flowchart',
 *     isConnector: false
 * };
 *
 * @private
 */
export interface VisioShapeTypeInfo {
    /**
     * The primary type classification of the shape (e.g., 'Process', 'Decision', 'Connector').
     * Used to determine shape appearance and behavior.
     *
     * @type {string}
     */
    type: string;

    /**
     * Extensible properties map for storing additional type-related metadata.
     * Allows custom properties beyond the standard 'type' field.
     *
     * @type {Record<string, unknown>}
     */
    [key: string]: unknown;
}

/**
 * Represents a complete Visio shape (node) with all properties and styling.
 * This is the primary data model for a shape instance in the diagram,
 * including geometry, visual styling, positioning, and relationships.
 *
 * @example
 * const shape = new VisioShape();
 * shape.id = 'Shape1';
 * shape.name = 'Process Box';
 * shape.offsetX = 100;
 * shape.offsetY = 150;
 * shape.width = 80;
 * shape.height = 60;
 * shape.style = new VisioNodeStyle();
 *
 * @private
 */
export class VisioShape {
    /**
     * The unique identifier for this shape within the diagram.
     * Used to reference the shape in connector endpoints and relationships.
     *
     * @type {string}
     * @default ''
     */
    id: string = '';

    /**
     * The display name/label of the shape (text label shown in the diagram).
     * May differ from the shape type. Optional if shape has no text.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * The ID of the master shape this shape is based on.
     * Allows retrieval of default properties and geometry from the master definition.
     *
     * @type {string | undefined}
     */
    masterId?: string;

    /**
     * The determined shape result containing shape path/outline information.
     * Provides the visual representation of the shape (geometry, SVG path, etc.).
     *
     * @type {DetermineShapeResult | undefined}
     */
    shape?: DetermineShapeResult;

    /**
     * The primary type classification of the shape (e.g., 'Shape', 'Image', 'Group').
     * Default is 'Shape'; used to determine processing and rendering logic.
     *
     * @type {string}
     * @default 'Shape'
     */
    type: string = 'Shape';

    /**
     * The X coordinate of the shape's top-left corner in the page coordinate system.
     * Typically in inches, centimeters, or diagram units depending on page scale.
     *
     * @type {number}
     * @default 0
     */
    offsetX: number = 0;

    /**
     * The Y coordinate of the shape's bottom-left corner in the page coordinate system.
     * Note: Visio uses a bottom-left origin (Y increases upward).
     *
     * @type {number}
     * @default 0
     */
    offsetY: number = 0;

    /**
     * The width of the shape's bounding box in coordinate units.
     *
     * @type {number}
     * @default 0
     */
    width: number = 0;

    /**
     * The height of the shape's bounding box in coordinate units.
     *
     * @type {number}
     * @default 0
     */
    height: number = 0;

    /**
     * The visual styling properties of the shape (colors, gradients, strokes).
     * Contains fill color, stroke properties, and gradient configurations.
     *
     * @type {VisioNodeStyle | undefined}
     */
    style?: VisioNodeStyle;

    /**
     * The horizontal pivot point (0-1, where 0.5 = center).
     * Defines the horizontal axis point around which the shape rotates.
     * Default 0.5 is center of the shape.
     *
     * @type {number}
     * @default 0.5
     */
    pivotX: number = 0.5;

    /**
     * The vertical pivot point (0-1, where 0.5 = center).
     * Defines the vertical axis point around which the shape rotates.
     * Default 0.5 is center of the shape.
     *
     * @type {number}
     * @default 0.5
     */
    pivotY: number = 0.5;

    /**
     * The rotation angle of the shape in degrees (0-360).
     * Positive values rotate counterclockwise (following standard math convention).
     *
     * @type {number}
     * @default 0
     */
    rotateAngle: number = 0;

    /**
     * The corner radius for rounded rectangles/shapes in coordinate units.
     * A value of 0 means sharp corners. Larger values create more pronounced rounding.
     *
     * @type {number}
     * @default 0
     */
    cornerRadius: number = 0;

    /**
     * The layer index (0-based) that this shape belongs to.
     * Used to organize shapes into logical layers and control display ordering.
     *
     * @type {number | undefined}
     */
    layerMember?: number;

    /**
     * Constraint rules applied to the shape (e.g., 'NoResize', 'NoMove').
     * Controls user interaction capabilities in the diagram editor.
     *
     * @type {unknown}
     */
    constraints?: unknown;

    /**
     * The length of the shape (primarily used for line/connector shapes).
     * Calculated from begin and end points for connectors.
     *
     * @type {number | undefined}
     */
    length?: number;

    /**
     * Shadow properties applied to the shape (outer shadow effect).
     * Contains shadow color, opacity, and offset information.
     *
     * @type {VisioNodeShadow | undefined}
     */
    shadow?: VisioNodeShadow;

    /**
     * Annotation/text data associated with the shape (labels, text content).
     * Stores the text content and formatting applied to the shape.
     *
     * @type {VisioAnnotation | undefined}
     */
    annotation?: VisioAnnotation;

    /**
     * The Y coordinate of the shape's pin point (pivot point).
     * Used for positioning relative to this point in transformations.
     *
     * @type {number | undefined}
     */
    pinY?: number;

    /**
     * The fill color of the shape in hex format.
     * May be different from style.fillColor if explicitly overridden.
     *
     * @type {string | undefined}
     */
    fillColor?: string;

    /**
     * The ID of the parent shape if this shape is part of a group.
     * Used to establish parent-child relationships in hierarchical structures.
     *
     * @type {string | undefined}
     */
    parentId?: string;

    /**
     * Array of child shape IDs if this shape is a group container.
     * Represents all shapes that are grouped within this shape.
     *
     * @type {string[] | undefined}
     */
    children?: string[];

    /**
     * Quick style line color index or value from the QuickStyleLineColor cell.
     * Used to apply theme-based line colors quickly.
     *
     * @type {number | undefined}
     */
    QuickLineColor?: number;

    /**
     * Quick style fill color index or value from the QuickStyleFillColor cell.
     * Used to apply theme-based fill colors quickly.
     *
     * @type {number | undefined}
     */
    QuickFillColor?: number;

    /**
     * Quick style shadow color index or value from the QuickStyleShadowColor cell.
     * Used to apply theme-based shadow colors quickly.
     *
     * @type {number | undefined}
     */
    QuickShadowColor?: number;

    /**
     * Quick style line matrix index from the QuickStyleLineMatrix cell.
     * References a predefined line style matrix in the theme.
     *
     * @type {number | undefined}
     */
    QuickLineMatrix?: number;

    /**
     * Quick style fill matrix index from the QuickStyleFillMatrix cell.
     * References a predefined fill style matrix in the theme.
     *
     * @type {number | undefined}
     */
    QuickFillMatrix?: number;

    /**
     * Quick style effects/shadow matrix index from the QuickStyleEffectsMatrix cell.
     * References a predefined effects matrix in the theme.
     *
     * @type {number | undefined}
     */
    QuickShadowMatrix?: number;

    /**
     * The theme index applied to this shape.
     * References which theme variant to use for styling.
     *
     * @type {number | undefined}
     */
    ThemeIndex?: number;

    /**
     * The color scheme index for this shape within the theme.
     * Controls which color variation from the theme is applied.
     *
     * @type {number | undefined}
     */
    ColorSchemeIndex?: number;

    /**
     * Indicates whether the shape is flipped horizontally (mirrored left-right).
     * Non-zero value indicates shape is flipped.
     *
     * @type {number | undefined}
     */
    flipX?: number;

    /**
     * Indicates whether the shape is flipped vertically (mirrored top-bottom).
     * Non-zero value indicates shape is flipped.
     *
     * @type {number | undefined}
     */
    flipY?: number;

    /**
     * Indicates whether the shape is visible in the diagram.
     * Set to false to hide the shape from display without removing it.
     *
     * @type {boolean}
     * @default true
     */
    visibility: boolean = true;

    /**
     * Tooltip text displayed when user hovers over the shape.
     * Provides additional context or information about the shape.
     *
     * @type {string | undefined}
     */
    tooltip?: string;

    /**
     * Glue setting for this shape (determines how connectors attach).
     * Values like '0' (no glue), '1' (shape outline), '2' (connection points).
     *
     * @type {string | undefined}
     */
    glueValue?: string;

    /**
     * Array of connection points (ports) on this shape where connectors can attach.
     * Each port has coordinates and properties defining attachment behavior.
     *
     * @type {VisioPort[] | undefined}
     */
    ports?: VisioPort[];

    /**
     * The ID of the image/media file if this shape represents an embedded image.
     * Used to look up the actual image data in the medias collection.
     *
     * @type {string}
     */
    imageId: string;

    /**
     * The foreign data type for embedded objects (e.g., 'image/png', 'application/ole').
     * Indicates what type of external data is embedded in this shape.
     *
     * @type {string}
     */
    foreignType: string;
}

/**
 * Represents a Visio connector (line/edge) between shapes.
 * Note: The actual VisioConnector class is imported from './visio-connectors'.
 * This comment marks the conceptual location in the data model.
 *
 * Connectors link shapes together and may have their own styling and decorators.
 * They support various connector types (Straight, Curved, etc.) and endpoint decorators.
 *
 * @see VisioConnector in visio-connectors.ts for the complete implementation.
 * @private
 */
// export class VisioConnector {
//     id: string = '';
//     name?: string;
//     fromShape: string = '';
//     toShape: string = '';
//     fromCell?: string;
//     toCell?: string;
//     type: ConnectorType = 'Straight';
//     style?: VisioNodeStyle;
//     annotation?: unknown;
//     decoratorStart?: string;
//     decoratorEnd?: string;
// }

/**
 * Represents Visio window/view configuration and display settings.
 * Stores viewport properties, zoom levels, and display toggle flags
 * that configure how the diagram is viewed and interacted with.
 *
 * @example
 * const window = new VisioWindow();
 * window.viewScale = 1.0;  // 100% zoom
 * window.showGrid = true;
 * window.showRulers = true;
 *
 * @private
 */
export class VisioWindow {
    /**
     * The width of the client viewport area in pixels.
     * Represents the visible drawing area width.
     *
     * @type {number | undefined}
     */
    clientWidth?: number;

    /**
     * The height of the client viewport area in pixels.
     * Represents the visible drawing area height.
     *
     * @type {number | undefined}
     */
    clientHeight?: number;

    /**
     * The width of the drawing window in pixels.
     * May differ from client width if windows have borders or padding.
     *
     * @type {number | undefined}
     */
    windowWidth?: number;

    /**
     * The height of the drawing window in pixels.
     * May differ from client height if windows have borders or padding.
     *
     * @type {number | undefined}
     */
    windowHeight?: number;

    /**
     * The current zoom/view scale factor (1.0 = 100%, 0.5 = 50%, 2.0 = 200%).
     * Determines how much the diagram is magnified in the viewport.
     *
     * @type {number | undefined}
     */
    viewScale?: number;

    /**
     * The X coordinate of the center of the current view (in diagram coordinates).
     * Determines the horizontal pan position of the viewport.
     *
     * @type {number | undefined}
     */
    viewCenterX?: number;

    /**
     * The Y coordinate of the center of the current view (in diagram coordinates).
     * Determines the vertical pan position of the viewport.
     *
     * @type {number | undefined}
     */
    viewCenterY?: number;

    /**
     * Toggle flag for showing/hiding ruler guides along diagram edges.
     * Rulers help users measure and align shapes.
     *
     * @type {boolean}
     * @default false
     */
    showRulers: boolean = false;

    /**
     * Toggle flag for showing/hiding the grid overlay on the diagram.
     * Grid helps with shape alignment and snapping.
     *
     * @type {boolean}
     * @default false
     */
    showGrid: boolean = false;

    /**
     * Toggle flag for showing/hiding page break indicators on the diagram.
     * Useful when printing multiple pages.
     *
     * @type {boolean}
     * @default false
     */
    showPageBreaks: boolean = false;

    /**
     * Toggle flag for showing/hiding guide lines for alignment.
     * Guides are non-printing reference lines.
     *
     * @type {boolean}
     * @default false
     */
    showGuides: boolean = false;

    /**
     * Toggle flag for showing/hiding connection point indicators (ports) on shapes.
     * Connection points show where connectors can attach to shapes.
     *
     * @type {boolean}
     * @default false
     */
    showConnectionPoints: boolean = false;

    /**
     * Setting that controls automatic grid adjustments based on zoom level.
     * When enabled, grid spacing adjusts as user zooms in/out.
     *
     * @type {boolean}
     * @default false
     */
    dynamicGridEnabled: boolean = false;

    /**
     * Glue settings determining how shapes snap to guides and grids (0-3).
     * Controls connector attachment behavior and shape positioning.
     *
     * @type {number | undefined}
     */
    glueSettings?: number;

    /**
     * Snap settings determining snap-to-grid behavior (bitfield).
     * Controls which snap targets are active (shapes, guides, grid, etc.).
     *
     * @type {number | undefined}
     */
    snapSettings?: number;

    /**
     * Snap extensions determining extended snap target areas.
     * Controls the distance/area around snap targets that trigger snapping.
     *
     * @type {number | undefined}
     */
    snapExtensions?: number;

    /**
     * Snap angles configuration (0-7).
     * Controls angle snapping and rotation constraints.
     *
     * @type {number | undefined}
     */
    snapAngles?: number;

    /**
     * The position of the tab splitter dividing outline and drawing panes.
     * Value represents pixel offset from the left edge.
     *
     * @type {number | undefined}
     */
    tabSplitterPos?: number;

    /**
     * The window type classification (e.g., 'Drawing', 'Master').
     * Indicates what kind of window this represents.
     *
     * @type {string | undefined}
     */
    windowType?: string;
}

/**
 * Represents an organizational layer in a Visio page.
 * Layers provide a way to organize shapes, control visibility, and manage editing.
 * Multiple layers can be stacked, with each layer containing a subset of shapes.
 *
 * @example
 * const layer: VisioLayer = {
 *     name: 'Background',
 *     visible: true,
 *     print: true,
 *     objects: ['Shape1', 'Shape2']
 * };
 *
 * @private
 */
export interface VisioLayer {
    /**
     * The display name of the layer (shown in layers panel).
     * Used to identify and reference the layer in the UI.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * The color assigned to the layer for visual identification (RGB value or color index).
     * Helps distinguish layers visually in the layer panel.
     *
     * @type {number | undefined}
     */
    color?: number;

    /**
     * The status flag for the layer (specific meaning depends on Visio version).
     * May indicate layer state or special properties.
     *
     * @type {number | undefined}
     */
    status?: number;

    /**
     * Indicates whether the layer is visible in the diagram.
     * When false, shapes on this layer are hidden from view.
     *
     * @type {boolean | undefined}
     * @default true
     */
    visible?: boolean;

    /**
     * Indicates whether the layer is included when printing.
     * When false, shapes on this layer do not appear in print output.
     *
     * @type {boolean | undefined}
     * @default true
     */
    print?: boolean;

    /**
     * Indicates whether this is the currently active/editable layer.
     * Only one layer should be active at a time.
     *
     * @type {boolean | undefined}
     */
    active?: boolean;

    /**
     * Indicates whether the layer is locked (read-only for editing).
     * When locked, shapes on the layer cannot be modified.
     *
     * @type {boolean | undefined}
     */
    lock?: boolean;

    /**
     * Indicates whether shapes on this layer snap to guides and grids.
     * When false, shapes on the layer are excluded from snap behavior.
     *
     * @type {boolean | undefined}
     * @default true
     */
    snap?: boolean;

    /**
     * Indicates whether connectors glue to shapes on this layer.
     * When false, connectors cannot attach to shapes on this layer.
     *
     * @type {boolean | undefined}
     * @default true
     */
    glue?: boolean;

    /**
     * The universal/internal name of the layer (language-independent identifier).
     * Used in formulas and macro code to reference the layer reliably.
     *
     * @type {string | undefined}
     */
    nameUniv?: string;

    /**
     * Color transparency/opacity setting for the layer (0-100 scale).
     * Controls the transparency of all shapes on this layer.
     *
     * @type {number | undefined}
     */
    colorTrans?: number;

    /**
     * Z index setting for the layer.
     * Controls the z index on this layer.
     *
     * @type {number | undefined}
     */
    zIndex?: number;

    /**
     * Array of shape IDs that belong to this layer.
     * Provides quick access to all shapes on this layer.
     *
     * @type {string[]}
     */
    objects: string[];
}

/**
 * Represents the configuration and properties of a Visio page.
 * Pages are the primary containers for shapes and define page-level settings
 * like dimensions, scale, background, and layer organization.
 *
 * @example
 * const page = new VisioPage();
 * page.pageWidth = 11;
 * page.pageHeight = 8.5;
 * page.fillColor = '#FFFFFF';
 * page.bridging = 1;
 *
 * @private
 */
export class VisioPage {
    /**
     * The width of the page in inches (or coordinate units).
     * Defines the horizontal extent of the page/canvas.
     *
     * @type {number}
     * @default 0
     */
    pageWidth: number = 0;

    /**
     * The height of the page in inches (or coordinate units).
     * Defines the vertical extent of the page/canvas.
     *
     * @type {number}
     * @default 0
     */
    pageHeight: number = 0;

    /**
     * Reference to a background page if this page uses one.
     * Background pages provide common elements across multiple pages.
     *
     * @type {number}
     * @default 0
     */
    backPage: number = 0;

    /**
     * The fill color of the page background in hex format.
     * Applied to the entire page surface.
     *
     * @type {string}
     * @default ''
     */
    fillColor: string = '';

    /**
     * Indicates whether this is a background page template.
     * Background pages don't appear directly in navigation but provide shared content.
     *
     * @type {boolean}
     * @default false
     */
    isBackgroundPage: boolean = false;

    /**
     * The horizontal offset for page shadow effect (if enabled).
     * Defines how far shadow extends horizontally.
     *
     * @type {number}
     * @default 0
     */
    shdwOffsetX: number = 0;

    /**
     * The vertical offset for page shadow effect (if enabled).
     * Defines how far shadow extends vertically.
     *
     * @type {number}
     * @default 0
     */
    shdwOffsetY: number = 0;

    /**
     * The page scale factor used for converting page units to printed units.
     * Common values: 1 inch = X page units.
     *
     * @type {number}
     * @default 0
     */
    pageScale: number = 0;

    /**
     * The drawing scale for the diagram (1 inch = X units in drawing).
     * Controls the overall zoom/scale of the diagram.
     *
     * @type {number}
     * @default 0
     */
    drawingScale: number = 0;

    /**
     * Drawing size type (0 = custom, 1 = standard, 2 = drawing/poster).
     * Determines which page size to use.
     *
     * @type {number}
     * @default 0
     */
    drawingSizeType: number = 0;

    /**
     * Drawing scale type (0 = custom, 1 = architectural, 2 = metric, etc.).
     * Specifies predefined scale templates.
     *
     * @type {number}
     * @default 0
     */
    drawingScaleType: number = 0;

    /**
     * UI visibility setting controlling shape selection and editing constraints.
     * Bitfield that may restrict certain UI operations.
     *
     * @type {number}
     * @default 0
     */
    uiVisibility: number = 0;

    /**
     * Shadow type on the page (0 = no shadow, 1 = oblique, 2 = perspective).
     * Controls the style of shadow applied to page background.
     *
     * @type {number}
     * @default 0
     */
    shdwType: number = 0;

    /**
     * The angle of oblique shadow in degrees (typically 45°).
     * Only applies if shdwType is set to oblique shadow.
     *
     * @type {number}
     * @default 0
     */
    shdwObliqueAngle: number = 0;

    /**
     * Scale factor for shadow size relative to page (0-1 scale).
     * Controls how large or small the shadow appears.
     *
     * @type {number}
     * @default 0
     */
    shdwScaleFactor: number = 0;

    /**
     * Drawing resize type determining how shapes fit on the page.
     * Controls automatic page/shape resizing behavior.
     *
     * @type {number}
     * @default 0
     */
    drawingResizeType: number = 0;

    /**
     * Indicates whether page shape elements can be moved/split across pages.
     * When true, large shapes can extend beyond page boundaries.
     *
     * @type {boolean}
     * @default false
     */
    pageShapeSplit: boolean = false;

    /**
     * Print page orientation (0 = portrait, 1 = landscape).
     * Controls how the page is oriented when printed.
     *
     * @type {number}
     * @default 0
     */
    printPageOrientation: number = 0;

    /**
     * Array of layers defined for this page.
     * Each layer can contain multiple shapes and have its own visibility settings.
     *
     * @type {VisioLayer[]}
     */
    layers: VisioLayer[] = [];

    /**
     * Line jump code determining how connectors cross each other (0-4).
     * Controls connector routing: 0 = no bridging, 1 = no crossing, 2-4 = bridge styles.
     *
     * @type {number}
     * @default 1
     */
    bridging: number = 1;

    /**
     * Horizontal spacing for connector bridges/crossings in inches.
     * Controls the gap size when connectors bridge over each other.
     *
     * @type {number}
     * @default 0.6667
     */
    horizontalBridgeSpace: number = 0.6667;

    /**
     * Vertical spacing for connector bridges/crossings in inches.
     * Controls the gap size when connectors bridge over each other vertically.
     *
     * @type {number}
     * @default 0.6667
     */
    verticalBridgeSpace: number = 0.6667;

    /**
     * The theme index applied to this page.
     * References which theme variant is used for styling.
     *
     * @type {number | undefined}
     */
    theme?: number;

    /**
     * The variation style index within the theme (0-based).
     * Selects which color/style variation of the theme to apply.
     *
     * @type {number}
     * @default 0
     */
    variationStyleIndex: number = 0;

    /**
     * Default connector type for new connectors on this page (as string).
     * Examples: '0' = straight, '1' = curved, '2' = orthogonal.
     *
     * @type {string}
     * @default '0'
     */
    lineRouteExt: string = '0';
    /**
     * Default connector routing style for new connectors on this page (as string).
     *
     * @type {string}
     * @default '0'
     */
    routeStyle: string = '0';

    /**
     * Snap-to-grid inhibit flag (prevents snapping when true).
     * When true, shapes and connectors don't snap to grid.
     *
     * @type {boolean}
     * @default false
     */
    inhibitSnap: boolean = false;

    /**
     * Page lock replace flag preventing shape replacement.
     * When true, shapes cannot be replaced by dragging masters.
     *
     * @type {boolean}
     * @default false
     */
    pageLockReplace: boolean = false;

    /**
     * Page lock duplicate flag preventing shape duplication.
     * When true, shapes cannot be duplicated on this page.
     *
     * @type {boolean}
     * @default false
     */
    pageLockDuplicate: boolean = false;
}

/**
 * Represents a Visio master shape definition.
 * Masters are template shapes that can be reused across the diagram.
 * They provide default geometry, styling, and properties for shape instances.
 *
 * @example
 * const master = new VisioMaster();
 * master.id = 'M1';
 * master.name = 'Rectangle';
 * master.shapeType = 'Shape';
 * master.shapeKeywords = 'box,rectangle';
 *
 * @private
 */
export class VisioMaster {
    /**
     * The unique identifier for this master definition.
     * Used to reference the master when instantiating shapes.
     *
     * @type {string}
     * @default ''
     */
    id: string = '';

    /**
     * The shape type classification of this master (e.g., 'Shape', 'Connector', 'Picture').
     * Determines which processing/rendering logic applies.
     *
     * @type {string | undefined}
     */
    shapeType?: string;

    /**
     * The shape name/identifier from the master definition.
     * Used internally to distinguish different master shapes.
     *
     * @type {string | undefined}
     */
    shape?: string;

    /**
     * The display name of the master (shown in stencil/shapes panel).
     * User-friendly name for identifying the master.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * Space-separated keywords associated with the master.
     * Used for searching and categorizing masters in the shapes panel.
     * Example: 'process,flow,box'.
     *
     * @type {string}
     */
    shapeKeywords: string;
}

/**
 * Represents a Visio theme with color variants and styling information.
 * Themes provide cohesive color schemes, fonts, and effects that can be applied
 * to entire pages or individual shapes for visual consistency.
 *
 * @example
 * const theme = new VisioTheme();
 * theme.name = 'Office Theme';
 * theme.fontFamily = 'Calibri';
 * theme.fontColor = { dk1: '#000000', accent1: '#0563C1' };
 * theme.hexColors = ['#FF0000', '#00FF00'];
 *
 * @private
 */
export class VisioTheme {
    /**
     * Scheme enumeration value identifying the theme type/variant.
     * Examples: 'Office', 'Design', 'Custom'.
     *
     * @type {string | undefined}
     */
    schemeEnum?: string;

    /**
     * The display name of the theme.
     * Shown in theme/template selection UI.
     *
     * @type {string | undefined}
     */
    name?: string;

    /**
     * The primary font family used by this theme.
     * Applied to text in shapes and connectors using the theme.
     * Example: 'Calibri', 'Arial'.
     *
     * @type {string | undefined}
     */
    fontFamily?: string;

    /**
     * Mapping of standard theme color names to hex color values.
     * Includes colors like: dk1, lt1, accent1-6, hlink, folHlink.
     * Example: { dk1: '#000000', accent1: '#0563C1' }.
     *
     * @type {FormattedColors | undefined}
     */
    fontColor?: FormattedColors;

    /**
     * Ordered array of fill/background style definitions from the theme.
     * Each entry has a name and the style value/definition.
     *
     * @type {ReadonlyArray<OrderEntry> | undefined}
     */
    fmtSchemeFill?: ReadonlyArray<OrderEntry>;

    /**
     * Ordered array of line/stroke style definitions from the theme.
     * Each entry has a name and the style value/definition.
     *
     * @type {ReadonlyArray<OrderEntry> | undefined}
     */
    fmtSchemeStroke?: ReadonlyArray<OrderEntry>;

    /**
     * Array of font property definitions for regular text in the theme.
     * Each entry specifies font attributes (name, size, weight, etc.).
     *
     * @type {ReadonlyArray<FontProps> | undefined}
     */
    fontStyles?: ReadonlyArray<FontProps>;

    /**
     * Array of font property definitions for connectors/lines in the theme.
     * Allows different fonts for connector text vs. shape text.
     *
     * @type {ReadonlyArray<FontProps> | undefined}
     */
    connectorFont?: ReadonlyArray<FontProps>;

    /**
     * Line style list for connector/line styling in the theme.
     * Provides predefined stroke styles specific to connectors.
     *
     * @type {LineStyleList | undefined}
     */
    connectorStroke?: LineStyleList;

    /**
     * Array of style variation definitions for theme variants.
     * Each entry defines a complete style set for one theme variation.
     *
     * @type {ReadonlyArray<VarStyle> | undefined}
     */
    variant?: ReadonlyArray<VarStyle>;

    /**
     * Array of hex color values (#RRGGBB format) from the variation color scheme.
     * Extracted from vt:varColor1 through vt:varColor7 properties.
     * Example: ['#FF0000', '#00FF00', '#0000FF'].
     *
     * @type {string[] | undefined}
     */
    hexColors?: Array<string>;

    /**
     * Extensible property map for storing additional theme metadata.
     * Allows custom theme properties beyond the standard fields.
     *
     * @type {Record<string, unknown>}
     */
    [key: string]: unknown;
}

/**
 * Represents Visio document-level settings and protection flags.
 * These are global settings that apply to the entire document,
 * controlling snap behavior, glue behavior, and content protection.
 *
 * @example
 * const settings = new VisioDocumentSettings();
 * settings.glueSettings = 1;
 * settings.snapSettings = 255;
 * settings.protectShapes = false;
 *
 * @private
 */
export class VisioDocumentSettings {
    /**
     * Glue behavior setting (0-3) controlling how connectors attach to shapes.
     * 0 = no glue, 1 = shape outline, 2 = connection points, 3 = both.
     *
     * @type {number}
     * @default 0
     */
    glueSettings: number = 0;

    /**
     * Snap behavior setting (bitfield) controlling snap targets.
     * Bits control: grid, shapes, guides, page margins, connection points, etc.
     *
     * @type {number}
     * @default 0
     */
    snapSettings: number = 0;

    /**
     * Extended snap target specification (0-255).
     * Extends snap behavior beyond basic snapSettings.
     *
     * @type {number}
     * @default 0
     */
    snapExtensions: number = 0;

    /**
     * Angle snap configuration (0-7) for rotation constraints.
     * Restricts shape rotation to specific angle increments.
     *
     * @type {number}
     * @default 0
     */
    snapAngles: number = 0;

    /**
     * Enables dynamic grid that adjusts spacing as user zooms.
     * When true, grid becomes denser or sparser based on zoom level.
     *
     * @type {boolean}
     * @default false
     */
    dynamicGridEnabled: boolean = false;

    /**
     * Protects styles from modification (read-only styles).
     * When true, users cannot change or create new styles.
     *
     * @type {boolean}
     * @default false
     */
    protectStyles: boolean = false;

    /**
     * Protects shapes from deletion or modification.
     * When true, users cannot move, resize, or delete shapes.
     *
     * @type {boolean}
     * @default false
     */
    protectShapes: boolean = false;

    /**
     * Protects master shapes from modification or deletion.
     * When true, master definitions cannot be edited or removed.
     *
     * @type {boolean}
     * @default false
     */
    protectMasters: boolean = false;

    /**
     * Protects background pages from modification.
     * When true, background page content cannot be edited.
     *
     * @type {boolean}
     * @default false
     */
    protectBkgnds: boolean = false;
}

/**
 * Represents connection data between shapes before it's resolved into final connectors.
 * This is intermediate data used during parsing to track which shapes should be connected.
 * After resolution, these are converted into actual VisioConnector objects.
 *
 * @example
 * const connData = new VisioConnectionData();
 * connData.fromSheet = 'Shape1';
 * connData.toSheet = 'Shape2';
 * connData.sourceId = 'Shape1';
 * connData.targetId = 'Shape2';
 * connData.sourcePortId = 'port0';
 * connData.targetPortId = 'port1';
 *
 * @private
 */
export class VisioConnectionData {
    /**
     * The ID/name of the source shape that initiates the connection.
     * Corresponds to the "From" reference in Visio connection data.
     *
     * @type {string}
     */
    fromSheet: string;

    /**
     * The cell reference on the source shape where the connection originates.
     * Typically a connection point cell like "Connections.X1".
     *
     * @type {string}
     */
    fromCell: string;

    /**
     * The ID/name of the destination shape receiving the connection.
     * Corresponds to the "To" reference in Visio connection data.
     *
     * @type {string}
     */
    toSheet: string;

    /**
     * The cell reference on the destination shape where the connection terminates.
     * Optional; if not specified, uses the default connection point.
     *
     * @type {string | undefined}
     */
    toCell?: string;

    /**
     * The ID of the connector shape that represents this connection.
     * Links back to the actual connector object created from this data.
     *
     * @type {string | undefined}
     */
    connectorId?: string;

    /**
     * The resolved source shape ID (after ID mapping).
     * May differ from fromSheet after ID normalization during parsing.
     *
     * @type {string | undefined}
     */
    sourceId?: string;

    /**
     * The resolved target shape ID (after ID mapping).
     * May differ from toSheet after ID normalization during parsing.
     *
     * @type {string | undefined}
     */
    targetId?: string;

    /**
     * The port/connection point ID on the source shape.
     * Specifies which connection point the connector uses on the source.
     *
     * @type {string | undefined}
     */
    sourcePortId?: string;

    /**
     * The port/connection point ID on the target shape.
     * Specifies which connection point the connector uses on the target.
     *
     * @type {string | undefined}
     */
    targetPortId?: string;
}

/**
 * Represents media file relationships in a Visio document.
 * Contains references to embedded media files (images, documents, etc.)
 * with their IDs and target paths within the VSDX archive.
 *
 * @example
 * const relationship = new VisioRelationship();
 * relationship.media.push({
 *     Id: 'rId4',
 *     Target: '../media/image1.png'
 * });
 *
 * @private
 */
export class VisioRelationship {
    /**
     * Extensible property map for storing additional relationship data.
     * Can be used to extend the class with custom properties.
     *
     * @type {Record<string, any>}
     */
    [x: string]: any;

    /**
     * Array of media file references found in the document.
     * Each entry contains a relationship ID and the target path to the media file.
     * Example: { Id: 'rId4', Target: '../media/image1.png' }
     *
     * @type {Array<{Id: string; Target: string}>}
     */
    media: { Id: string; Target: string }[] = [];
}

/**
 * Data container for all parsed elements from a Visio file.
 * An instance of this class is created for each import operation and holds
 * all the parsed diagram data, shapes, connectors, themes, and settings.
 *
 * This is the primary data structure used throughout the import/parsing process
 * and is eventually converted to the target diagram format.
 *
 * @example
 * const diagramData = new VisioDiagramData();
 * diagramData.pageWidth = 1100;
 * diagramData.pageHeight = 850;
 * diagramData.shapes.push(new VisioShape());
 * diagramData.connectors.push(new VisioConnector());
 *
 * @private
 */
export class VisioDiagramData {
    /**
     * Array of window/view configuration objects for this document.
     * May contain multiple windows if the document has multiple views open.
     *
     * @type {VisioWindow[]}
     */
    windows: VisioWindow[] = [];

    /**
     * Array of all pages in this Visio document.
     * Each page contains shapes and their layer organization.
     *
     * @type {VisioPage[]}
     */
    pages: VisioPage[] = [];

    /**
     * Array of all master shape definitions used in this document.
     * Masters provide templates and default properties for shape instances.
     *
     * @type {VisioMaster[]}
     */
    masters: VisioMaster[] = [];

    /**
     * Array of all shape instances in the document.
     * This is the main collection of drawable elements (nodes).
     *
     * @type {VisioShape[]}
     */
    shapes: VisioShape[] = [];

    /**
     * Array of all connector instances in the document.
     * Connectors represent edges/relationships between shapes.
     *
     * @type {VisioConnector[] | undefined}
     */
    connectors?: VisioConnector[] = [];

    /**
     * Document-level settings and protection flags.
     * Contains snap behavior, glue settings, and content protection options.
     *
     * @type {VisioDocumentSettings | undefined}
     */
    documentSettings?: VisioDocumentSettings;

    /**
     * Array of connection relationships between shapes.
     * Intermediate representation of connections before final connector creation.
     *
     * @type {VisioConnections[]}
     */
    connections: VisioConnections[] = [];

    /**
     * Array of theme definitions available in this document.
     * Each theme provides color schemes, fonts, and styling guidelines.
     *
     * @type {VisioTheme[]}
     */
    themes: VisioTheme[] = [];

    /**
     * The currently active page being processed or displayed.
     * Reference to one of the pages in the pages array.
     *
     * @type {VisioPage | undefined}
     */
    currentPage?: VisioPage;

    /**
     * The currently active theme being applied to the diagram.
     * Reference to one of the themes in the themes array.
     *
     * @type {VisioTheme | undefined}
     */
    currentTheme?: VisioTheme;

    /**
     * Collection of shape IDs that represent expanded subprocess containers.
     * Used to track which subprocess shapes have been expanded in the diagram.
     *
     * @type {string[]}
     */
    expandedSubprocessCollection: string[] = [];

    /**
     * Array of media relationships in the document.
     * Contains references to embedded files like images and documents.
     *
     * @type {VisioRelationship[] | undefined}
     */
    relations?: VisioRelationship[] = [];

    /**
     * Map/record of media files indexed by their relationship ID.
     * Maps from rId (relationship ID) to VisioMedia object containing file data.
     * Example: { rId4: { name: 'image1.png', data: ... } }
     *
     * @type {Record<string, VisioMedia> | undefined}
     */
    medias?: Record<string, VisioMedia> = {};

    /**
     * Resets all data in this instance to empty/default values.
     * Useful for reusing the same object for multiple parsing operations
     * or clearing state between imports.
     *
     * @returns {void} - Clears all internal collections and state.
     *
     * @example
     * diagramData.clear();
     * // Now safe to reuse for another import
     *
     * @private
     */
    public clear(): void {
        this.windows = [];
        this.pages = [];
        this.masters = [];
        this.shapes = [];
        this.connectors = [];
        this.documentSettings = undefined;
        this.connections = [];
        this.themes = [];
        this.currentPage = undefined;
        this.currentTheme = undefined;
        this.expandedSubprocessCollection = [];
        this.relations = [];

        // Reset global shape index counter
        shapeIndex.value = 0;
    }
}

// ============================================================================
// Intermediate Parsing Models - To be moved later
// ============================================================================

/**
 * Intermediate model for style properties during parsing.
 * This is a temporary data structure used internally during the parsing process
 * and should be refactored into the final domain models (VisioNodeStyle, etc.).
 *
 * Note: This class is marked for future refactoring and movement to a separate file.
 *
 * @private
 */
export class VisioStyleModel {
    /**
     * The fill color of the style in hex format.
     *
     * @type {string | undefined}
     */
    fill?: string;

    /**
     * The stroke color of the style in hex format.
     *
     * @type {string | undefined}
     */
    strokeColor?: string;

    /**
     * The dash pattern for strokes (e.g., "5,5" for dashed).
     *
     * @type {string | undefined}
     */
    strokeDashArray?: string;

    /**
     * The width of the stroke in pixels.
     *
     * @type {number}
     * @default 0
     */
    strokeWidth: number = 0;

    /**
     * The opacity of the style (0-1).
     *
     * @type {number}
     * @default 0
     */
    opacity: number = 0;
}

/**
 * Intermediate model for decorator styling during parsing.
 * This is a temporary data structure used internally during parsing
 * for handling connector decorators (arrows, circles, etc.).
 *
 * Note: This class is marked for future refactoring and movement to a separate file.
 *
 * @private
 */
export class VisioDecoratorStyleModel {
    /**
     * The fill color of the decorator in hex format.
     *
     * @type {string | undefined}
     */
    fill?: string;

    /**
     * The opacity of the decorator (0-1).
     *
     * @type {number}
     * @default 0
     */
    opacity: number = 0;

    /**
     * The stroke color of the decorator in hex format.
     *
     * @type {string | undefined}
     */
    strokeColor?: string;

    /**
     * The gradient color for the decorator.
     *
     * @type {string | undefined}
     */
    gradient?: string;

    /**
     * The width of the decorator stroke in pixels.
     *
     * @type {number}
     * @default 0
     */
    strokeWidth: number = 0;

    /**
     * Indicates whether gradient fill is enabled for the decorator.
     *
     * @type {boolean}
     * @default false
     */
    isGradientEnabled: boolean = false;

    /**
     * The type of gradient ('Linear' or 'Radial').
     *
     * @type {string}
     * @default 'Linear'
     */
    gradientType: string = 'Linear';

    /**
     * The gradient coordinate information (start/end points or center/radius).
     *
     * @type {unknown}
     */
    gradientCoordinates: unknown;

    /**
     * Array of gradient color stops.
     *
     * @type {GradientStop[]}
     */
    gradientStops: GradientStop[];

    /**
     * The angle of the gradient in degrees (0-360).
     *
     * @type {number}
     * @default 0
     */
    gradientAngle: number = 0;
}

/**
 * Intermediate model for decorator properties during parsing.
 * This is a temporary data structure used internally during parsing
 * for handling connector start/end decorators (arrows, circles, etc.).
 *
 * Note: This class is marked for future refactoring and movement to a separate file.
 *
 * @private
 */
export class VisioDecoratorModel {
    /**
     * The height of the decorator shape in pixels.
     *
     * @type {number | undefined}
     */
    height?: number;

    /**
     * The width of the decorator shape in pixels.
     *
     * @type {number | undefined}
     */
    width?: number;

    /**
     * The decorator shape type (e.g., 'Arrow', 'Circle', 'Diamond').
     *
     * @type {DecoratorShapes | undefined}
     */
    shape?: DecoratorShapes;

    /**
     * The styling properties applied to the decorator.
     *
     * @type {VisioDecoratorStyleModel | undefined}
     */
    style?: VisioDecoratorStyleModel;

    /**
     * Quick line color index for theme-based coloring.
     *
     * @type {number | undefined}
     */
    QuickLineColor?: number;

    /**
     * Quick style matrix index for applying predefined style combinations.
     *
     * @type {number | undefined}
     */
    QuickStyleMatrix?: number;
}

/**
 * Represents resolved connection relationships between shapes.
 * This stores the final mapping of source and target shape IDs along with port information.
 *
 * @example
 * const connection = new VisioConnections();
 * connection.connectorId = 'Connector1';
 * connection.sourceId = 'Shape1';
 * connection.targetId = 'Shape2';
 * connection.sourcePortId = 'port0';
 *
 * @private
 */
export class VisioConnections {
    /**
     * The ID of the connector shape representing this connection.
     *
     * @type {string | undefined}
     */
    connectorId?: string;

    /**
     * The ID of the source/from shape.
     *
     * @type {string | undefined}
     */
    sourceId?: string;

    /**
     * The ID of the target/to shape.
     *
     * @type {string | undefined}
     */
    targetId?: string;

    /**
     * The port ID on the source shape where the connector starts.
     *
     * @type {string | undefined}
     */
    sourcePortId?: string;

    /**
     * The port ID on the target shape where the connector ends.
     *
     * @type {string | undefined}
     */
    targetPortId?: string;
}
