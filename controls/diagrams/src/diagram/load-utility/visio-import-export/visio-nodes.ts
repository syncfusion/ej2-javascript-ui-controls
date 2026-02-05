import { AnnotationConstraints, FlipDirection, NodeConstraints } from '../../enum/enum';
import { Annotation } from '../../objects/annotation';
import { NodeModel, BpmnAnnotationModel } from '../../objects/node-model';
import { VisioTextAlignmentModel, VisioTextDecorationModel, VisioToSyncfusionTextBinder } from './visio-annotations';
import { VisioConnector } from './visio-connectors';
import { createCombinedPathFromGeometries, createPathFromGeometry, ensureArray, formatPathData, getCellMapStringValue, inchToPoint, inchToPx, mapCellValues, radiansToDegrees, toCamelCase } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { VisioMaster, VisioShape } from './visio-models';
import { getNodeStyle, setAnnotationStyle } from './visio-theme';
import {
    Attributes,
    CellMapValue,
    DetermineShapeResult,
    DiagramHyperlink,
    FlippableShape,
    Member,
    Point,
    ShadowProps,
    SyncfusionTextBinding,
    UmlClassShape,
    UmlEnumeration,
    UmlInterfaceShape,
    VisioShapeTransform,
    VisioTextTransform,
    BPMNPropertyMapType,
    BPMNShapeResult,
    BPMNEventShapeResult,
    BPMNGatewayShapeResult,
    BPMNActivityShapeResult,
    BPMNDataObjectShapeResult,
    BPMNTextAnnotationShapeResult,
    BPMNSimpleShapeResult,
    BPMNFlowShapeResult,
    UMLConnectorResult,
    UMLActivityShapeResult,
    MediaMappingItem,
    NodeShapeConfig,
    VisioSection,
    VisioCell,
    VisioShapeNode,
    VisioNodeInput,
    DiagramPort,
    VisioAnnotationInput,
    VisioShapeInput,
    BPMNSubProcessInput,
    BPMNSubProcess,
    VisioRow,
    VisioShapeData,
    VisioPort,
    DiagramAnnotation,
    AnnotationStyle,
    ResolvedAnnotationStyle
} from './visio-types';

/**
 * Global shape index counter used during parsing to track shape position.
 * Incremented for each shape processed and used to look up master data.
 *
 * @type {{ value: number }}
 */
export const shapeIndex: { value: number } = { value: 0 };

/**
 * Constant representing the 'Property' section name in Visio shapes.
 * Used to locate property definitions in shape sections.
 *
 * @type {string}
 */
const PROPERTY_SECTION: string = 'Property';

/**
 * Constant representing the 'User' section name in Visio shapes.
 * Used to locate user-defined properties in shape sections.
 *
 * @type {string}
 */
const USER_SECTION: string = 'User';

/**
 * Constant representing the 'Relationships' cell name.
 * Used to locate relationship/connection formulas in shape cells.
 *
 * @type {string}
 */
const RELATIONSHIPS_CELL: string = 'Relationships';

/**
 * Constant representing the 'Value' cell name.
 * Used to locate value properties within section rows.
 *
 * @type {string}
 */
const VALUE_CELL: string = 'Value';

/**
 * Constant representing the 'Actions' section name in Visio shapes.
 * Used to locate action/behavioral definitions in shape sections.
 *
 * @type {string}
 */
const ACTIONS_SECTION: string = 'Actions';

/**
 * Converts a Visio shape object into a Syncfusion diagram node format.
 * This is the main transformation function that takes parsed Visio data
 * and converts it to the EJ2 diagram format.
 *
 * Handles:
 * - Coordinate system conversion (inches to pixels)
 * - Text binding and positioning
 * - Port/connection point mapping
 * - Styling and constraints application
 * - Shape type determination
 * - Group shape padding
 *
 * @param {any} node - The VisioShape object to convert.
 * @param {ParsingContext} context - Parser context with theme and configuration data.
 * @param {VisioNodeInput[]} shapeGroup - Array of all shapes (used for group processing).
 * @returns {any} A Syncfusion diagram node object with all properties transformed.
 *
 * @example
 * const diagramNode = convertVisioShapeToNode(visioShape, context, allShapes);
 * console.log(diagramNode.id); // Shape ID
 * console.log(diagramNode.width); // Width in pixels
 * console.log(diagramNode.annotations); // Text annotations
 *
 * @private
 */
export function convertVisioShapeToNode(node: any, context: ParsingContext, shapeGroup: VisioShape[]): any {
    // ==================== Extract and Adjust Pivot Points ====================
    // Get pivot point (rotation center) from Visio coordinates
    const pivot: Point = getPivotFromVisioFormulas(node.pivotX, node.pivotY);
    // Invert Y pivot: Visio 0 (bottom) -> EJ2 1 (bottom), Visio 1 (top) -> EJ2 0 (top)
    pivot.y = (pivot.y === 1) ? 0 : ((pivot.y === 0) ? 1 : pivot.y);

    // ==================== Process Text Binding ====================
    // Text binding handles text positioning relative to shape bounds
    let textBinding: SyncfusionTextBinding | null = null;

    // Determine if this is a group (has multiple children)
    const isGroup: boolean = Array.isArray(node.children) && node.children.length > 1;

    // ==================== Convert Ports to Diagram Format ====================
    // Convert Visio ports to Syncfusion diagram ports with normalized coordinates
    const diagramPorts: DiagramPort[] = (node.ports || []).map((port: VisioPort) => ({
        id: port.id,
        // Normalize port position relative to shape dimensions
        offset: {
            x: port.x,
            y: port.y
        },
        shape: 'Circle',
        style: {
            strokeColor: '#757575',
            strokeWidth: 1
        }
    }));

    // ==================== Process Text Annotation Positioning ====================
    // If annotation has explicit text positioning, calculate text binding
    if (node.annotation && (node.annotation as VisioAnnotationInput).txtPinX !== undefined) {
        // Build shape transform object with position and size
        const shapeTransform: VisioShapeTransform = {
            pinX: node.offsetX,
            pinY: node.pinY / 96, // Convert from pixels to inches
            width: node.width,
            height: node.height,
            verticalAlignment: setVerticalAlignment(node)
        };

        // Build text transform object with text-specific positioning
        const textTransform: VisioTextTransform = {
            txtWidth: (node.annotation as VisioAnnotationInput).txtWidth,
            txtHeight: (node.annotation as VisioAnnotationInput).txtHeight,
            txtPinX: (node.annotation as VisioAnnotationInput).txtPinX,
            txtPinY: (node.annotation as VisioAnnotationInput).txtPinY,
            txtLocPinX: (node.annotation as VisioAnnotationInput).txtLocPinX,
            txtLocPinY: (node.annotation as VisioAnnotationInput).txtLocPinY,
            txtAngle: (node.annotation.rotateAngle || 0) * (Math.PI / 180),  // Convert to radians
            txtMargin: node.annotation.margin
        };

        // Bind Visio text positioning to Syncfusion format
        textBinding = VisioToSyncfusionTextBinder.bindVisioTextToSyncfusion(
            shapeTransform,
            textTransform
        );
    }
    const nodeStyle: ResolvedAnnotationStyle = setAnnotationStyle(node, context);
    // ==================== Build Syncfusion Node Object ====================
    return {
        // ==================== Basic Properties ====================
        id: node.id,
        width: inchToPx(node.width),
        height: inchToPx(node.height),
        offsetX: inchToPx(node.offsetX),
        offsetY: node.offsetY,

        // ==================== Shape and Styling ====================
        shape: setNodeShape(node, context),
        style: getNodeStyle(node, context, isGroup),

        // ==================== Behavior and Constraints ====================
        constraints: setConstraints(node, context),
        shadow: setShadow(node),
        flip: setFlip(node),
        visible: setVisibility(node),

        // ==================== Interaction Properties ====================
        tooltip: { content: node.tooltip || '' },
        pivot: pivot,
        rotateAngle: (360 - radiansToDegrees(node.rotateAngle)) % 360 || 0,

        // ==================== Hierarchy ====================
        children: node.children,
        parentId: node.parentId,
        padding: setPadding(isGroup),

        // ==================== Connectivity ====================
        ports: diagramPorts,
        margin: (node as VisioShapeData).calculatedMargin ? (node as VisioShapeData).calculatedMargin : undefined,

        // ==================== Text and Annotations ====================
        annotations: [
            {
                content: node.annotation.content,
                width: inchToPx((node.annotation as VisioAnnotationInput).txtWidth ?
                    (node.annotation as VisioAnnotationInput).txtWidth : node.width),
                height: inchToPx((node.annotation as VisioAnnotationInput).txtHeight ?
                    (node.annotation as VisioAnnotationInput).txtHeight : node.height),
                visibility: node.annotation.visible,
                hyperlink: setHyperLink(node, nodeStyle),
                rotateAngle: setRotateAngle(node),
                constraints: setAnnotationConstraints(node.annotation),
                // verticalAlignment: setVerticalAlignment(node),
                horizontalAlignment: setHorizontalAlignment(node),
                // Use calculated text binding offset or default center
                offset: (textBinding && textBinding.offset) || { x: 0.5, y: 0.5 },
                style: nodeStyle
            }
        ]
    };
}

/**
 * Determines the visibility state of a shape.
 * TextAnnotation shapes are always visible; other shapes use the visibility flag.
 *
 * @param {VisioNodeInput} node - The VisioShape object to check.
 * @returns {boolean} True if shape should be visible, false otherwise.
 *
 * @example
 * const visible = setVisibility(shape);
 * // Returns true for TextAnnotation, inverse of visibility for others
 *
 * @private
 */
function setVisibility(node: VisioNodeInput): boolean {
    // TextAnnotations are always visible
    return node.shape.shape === 'TextAnnotation' ? true : node.visibility !== undefined ? !node.visibility : true;
}

/**
 * Type definition for shape padding (all four sides).
 * Used to define spacing around group shapes.
 *
 * @typedef {Object} Padding
 * @property {number} left - Left padding in pixels.
 * @property {number} right - Right padding in pixels.
 * @property {number} top - Top padding in pixels.
 * @property {number} bottom - Bottom padding in pixels.
 */
type Padding = { left: number; right: number; top: number; bottom: number };

/**
 * Sets padding for a shape based on whether it's a group or regular shape.
 * Group shapes have internal padding to accommodate child shapes;
 * regular shapes have no padding.
 *
 * @param {boolean} isGroup - Whether the shape is a group/container.
 * @returns {Padding} A padding object with all sides set uniformly.
 *
 * @example
 * const padding = setPadding(true);  // { left: 12, right: 12, top: 12, bottom: 12 }
 * const padding = setPadding(false); // { left: 0, right: 0, top: 0, bottom: 0 }
 *
 * @private
 */
function setPadding(isGroup: boolean): Padding {
    const value: number = isGroup ? 12 : 0;
    return { left: value, right: value, top: value, bottom: value };
}

/**
 * Converts a Visio text decoration model to EJ2 text decoration format.
 * Maps underline and strikethrough properties to EJ2 supported values.
 *
 * @param {VisioTextDecorationModel | undefined} textDecoration - The Visio text decoration model.
 * @returns {'None' | 'Underline' | 'LineThrough'} The EJ2 text decoration value.
 *
 * @example
 * const decoration = getTextDecoration(visioModel);
 * // Returns 'Underline', 'LineThrough', or 'None'
 *
 * @private
 */
export function getTextDecoration(textDecoration?: VisioTextDecorationModel): 'None' | 'Underline' | 'LineThrough' {
    if (!textDecoration) {
        return 'None';
    }
    if (textDecoration.underline) {
        return 'Underline';
    }
    if (textDecoration.strikethrough) {
        return 'LineThrough';
    }
    return 'None';
}

/**
 * Calculates the rotation angle for text annotations.
 * Handles segment angles for connector text and applies 360-degree normalization.
 *
 * @param {VisioNodeInput} node - The VisioShape with annotation data.
 * @returns {number} The rotation angle in degrees (0-360).
 *
 * @example
 * const angle = setRotateAngle(shape);
 * // Returns adjusted rotation angle with segment angle if applicable
 *
 * @private
 */
function setRotateAngle(node: VisioNodeInput): number {
    let rotateAngle: number = 0;

    if (node.annotation && node.annotation.rotateAngle) {
        // Normalize angle to 0-360 range (inverse for EJ2)
        rotateAngle = (360 - (node.annotation.rotateAngle)) % 360;

        // Add 90 degrees for segment angle (used for connector text)
        // if (node.annotation && node.annotation.segmentAngle) {
        //     rotateAngle += 90;
        // }
        return rotateAngle;
    } else if (node.annotation && node.annotation.segmentAngle) {
        rotateAngle += 90;
    }
    return rotateAngle;
}

/**
 * Extracts horizontal text alignment from a shape's annotation.
 *
 * @param {VisioNodeInput} node - The VisioShape with annotation data.
 * @returns {string} The horizontal alignment value ('Left', 'Right', 'Center', 'Justify').
 *
 * @example
 * const align = setHorizontalAlignment(shape);
 *
 * @private
 */
function setHorizontalAlignment(node: VisioNodeInput): string {
    return node.annotation && node.annotation.horizontalAlignment;
}

/**
 * Extracts vertical text alignment from a shape's annotation.
 *
 * @param {VisioNodeInput} node - The VisioShape with annotation data.
 * @returns {string} The vertical alignment value ('Top', 'Middle', 'Bottom').
 *
 * @example
 * const align = setVerticalAlignment(shape);
 *
 * @private
 */
function setVerticalAlignment(node: VisioNodeInput): string {
    return node.annotation && node.annotation.verticalAlignment;
}

/**
 * Converts a Visio text alignment model to EJ2 text alignment format.
 * Maps left, right, justify properties to EJ2 supported values.
 *
 * @param {VisioTextAlignmentModel} alignment - The Visio text alignment model.
 * @returns {'Left' | 'Right' | 'Center' | 'Justify'} The EJ2 text alignment value.
 *
 * @example
 * const align = getTextAlign(visioAlignment);
 * // Returns 'Left', 'Right', 'Center', or 'Justify'
 *
 * @private
 */
export function getTextAlign(alignment: VisioTextAlignmentModel): 'Left' | 'Right' | 'Center' | 'Justify' {
    if (alignment.left) {
        return 'Left';
    }
    if (alignment.right) {
        return 'Right';
    }
    if (alignment.justify) {
        return 'Justify';
    }
    return 'Center';
}

/**
 * Sets annotation constraints based on shape lock properties.
 * Applies various constraints that control text editing, rotation, and selection.
 *
 * @param {VisioAnnotationInput} shape - The annotation/shape object with lock properties.
 * @returns {AnnotationConstraints} The EJ2 annotation constraints value.
 *
 * @example
 * const constraints = setAnnotationConstraints(annotation);
 *
 * @private
 */
function setAnnotationConstraints(shape: VisioAnnotationInput): AnnotationConstraints {
    let constraints: AnnotationConstraints = (shape as DiagramAnnotation).constraints;

    if (shape.lockTextEdit) {
        constraints = AnnotationConstraints.InheritReadOnly;
    }
    if (shape.lockRotate) {
        constraints &= ~AnnotationConstraints.Rotate;
    }
    if (shape.lockSelect) {
        constraints &= ~AnnotationConstraints.Select;
    }
    return constraints;
}

/**
 * Extracts hyperlink information from a shape's annotation.
 * Returns a hyperlink object if present, or undefined if no hyperlink exists.
 *
 * @param {VisioNodeInput} NodeData - The VisioShape with annotation data.
 * @param {ResolvedAnnotationStyle} nodeStyle - The VisioShape annotation style info.
 * @returns {DiagramHyperlink} The hyperlink object or undefined.
 *
 * @example
 * const hyperlink = setHyperLink(shape);
 * // Returns { link: '...', content: '...', hyperlinkOpenState: 'NewWindow' } or undefined
 *
 * @private
 */
function setHyperLink(NodeData: VisioNodeInput, nodeStyle: ResolvedAnnotationStyle): DiagramHyperlink {
    if (NodeData.annotation && NodeData.annotation.hyperlink && NodeData.annotation.hyperlink.link) {
        let textDecoration: string = 'None';
        if ((NodeData.annotation.style as AnnotationStyle).textDecoration.underline) {
            textDecoration = 'Underline';
        } else if ((NodeData.annotation.style as AnnotationStyle).textDecoration.strikethrough) {
            textDecoration = 'LineThrough';
        }
        return {
            link: NodeData.annotation.hyperlink.link,
            content: NodeData.annotation.content || '',
            hyperlinkOpenState: NodeData.annotation.hyperlink.newWindow ? 'NewWindow' : 'NewTab',
            color: nodeStyle.color || 'black',
            textDecoration: nodeStyle.textDecoration || 'None'
        };
    }
    return undefined;
}

/**
 * Extracts pivot point (rotation center) from Visio formulas.
 * Handles both numeric values and formula strings containing multiplication operators.
 * Clamps values to 0-1 range (relative positioning).
 *
 * @param {number} locPinX - Horizontal pivot from Visio (may be formula string or number).
 * @param {number} locPinY - Vertical pivot from Visio (may be formula string or number).
 * @returns {Point} A point object with x and y values clamped to [0, 1].
 *
 * @example
 * const pivot = getPivotFromVisioFormulas(0.5, 0.5);
 * // Returns { x: 0.5, y: 0.5 }
 *
 * @private
 */
function getPivotFromVisioFormulas(locPinX: number, locPinY: number): Point {
    /**
     * Helper parser for converting Visio pin formulas to normalized values (0-1).
     * Handles both direct numbers and formula strings like "Width*0.5".
     *
     * @param {number} pin - The pin value or formula string.
     * @returns {number} Normalized pivot value between 0 and 1, or 0.5 default.
     */
    const parse: (pin: string | number) => number = (pin: string | number): number => {
        // ==================== Direct Numeric Value ====================
        if (typeof pin === 'number') {
            return pin;
        }

        // ==================== Parse Formula String ===================
        // Extract value after multiplication operator (e.g., "Width*0.5" -> "0.5")
        if (typeof pin === 'string' && pin.includes('*')) {
            const valStr: string = pin.substring(pin.indexOf('*') + 1);
            return isNaN(parseFloat(valStr)) ? 0.5 : parseFloat(valStr);
        }

        // ==================== Invalid/Missing Value ====================
        return 0.5;
    };

    return {
        x: Math.min(Math.max(parse(locPinX), 0), 1),  // Clamp to 0-1
        y: Math.min(Math.max(parse(locPinY), 0), 1)   // Clamp to 0-1
    };
}

/**
 * Sets the shape object for a Syncfusion diagram node.
 * Handles different shape types (Basic, Flow, Path, Image, BPMN, UML).
 * Converts Visio shape properties to EJ2 format with proper type mapping.
 *
 * @param {VisioNodeInput} shape - The VisioShape object with shape type information.
 * @param {ParsingContext} context - Parser context for warnings and configuration.
 * @returns {NodeShapeConfig} A shape object with type and type-specific properties.
 *
 * @example
 * const shapeObj = setNodeShape(visioShape, context);
 * // Returns { type: 'Basic', shape: 'Rectangle', cornerRadius: 0 }
 *
 * @private
 */
function setNodeShape(shape: VisioNodeInput, context: ParsingContext): NodeShapeConfig {
    // ==================== Extract Shape Type ====================
    const type: 'Basic' | 'Flow' | 'Path' | 'Image' | 'Bpmn' | 'UmlClassifier' | 'UmlActivity' = shape.shape.type;
    const mainShapeObject: VisioShapeInput = shape && shape.shape;

    // ==================== Log Rounding Limitations ====================
    if (shape.cornerRadius) {
        context.addWarning('[WARNING] :: In EJ2, cap type and rounding can only be adjusted for rectangles; there is no support for adjusting these properties for all shapes.');
    }

    // ==================== Handle BPMN Shapes ====================
    if (type === 'Bpmn') {
        const { type: bpmnType, ...bpmnProperties } = mainShapeObject;
        return {
            type: 'Bpmn',
            ...bpmnProperties,
            cornerRadius: shape.cornerRadius ? inchToPoint(shape.cornerRadius) : 0
        };
    }

    // ==================== Handle UML Activity Shapes ====================
    if ((type as string) === 'UmlActivity') {
        return {
            type: 'UmlActivity',
            shape: mainShapeObject.shape,
            cornerRadius: shape.cornerRadius ? inchToPoint(shape.cornerRadius) : 0
        };
    }

    // ==================== Default Shape Type Handling ====================
    return {
        type,
        // ==================== Type-Specific Properties ====================
        ...(type === 'Basic' || type === 'Flow'
            ? { shape: shape.shape.shape }  // Basic/Flow shapes have 'shape' property
            : type === 'Path'
                ? { data: shape.shape.data }  // Path shapes have 'data' property
                : type === 'Image'
                    ? { source: shape.shape.source }  // Image shapes have 'source' property
                    : {}),
        cornerRadius: shape.cornerRadius ? inchToPoint(shape.cornerRadius) : 0
    };
}

/**
 * Sets node constraints based on shape lock properties.
 * Applies constraints that control resizing, rotation, selection, and other interactions.
 *
 * @param {VisioNodeInput} shape - The VisioShape object with lock properties.
 * @param {ParsingContext} context - Parser context for warnings.
 * @returns {NodeConstraints} The EJ2 node constraints value.
 *
 * @example
 * const constraints = setConstraints(shape, context);
 *
 * @private
 */
function setConstraints(shape: VisioNodeInput, context: ParsingContext): NodeConstraints {
    let constraints: NodeConstraints = shape.constraints;
    constraints = NodeConstraints.Default;

    // ==================== Size Constraints ====================
    if (shape.lockHeight) {
        constraints &= ~(NodeConstraints.ResizeNorth | NodeConstraints.ResizeSouth);
    }
    if (shape.lockWidth) {
        constraints &= ~(NodeConstraints.ResizeWest | NodeConstraints.ResizeEast);
    }
    if (shape.lockHeight && shape.lockWidth) {
        constraints &= ~NodeConstraints.Resize;
    }

    // ==================== Position Constraints ====================
    if (shape.lockMoveX || shape.lockMoveY) {
        context.addWarning('[WARNING] :: In EJ2, individual disabling of drag constraints for X and Y positions is not supported. Therefore, if enabled, a node cannot be dragged.');
        constraints &= ~NodeConstraints.Drag;
    }

    // ==================== Rotation Constraints ====================
    if (shape.lockRotate) {
        constraints &= ~NodeConstraints.Rotate;
    }

    // ==================== Deletion Constraints ====================
    if (shape.lockDelete) {
        constraints &= ~NodeConstraints.Delete;
    }

    // ==================== Selection Constraints ====================
    if (shape.lockSelect) {
        constraints &= ~NodeConstraints.Select;
    }

    // ==================== Aspect Ratio Constraints ====================
    if (shape.lockAspect) {
        constraints |= NodeConstraints.AspectRatio;
    }

    // ==================== Text Edit Constraints ====================
    if (shape.lockTextEdit) {
        constraints |= NodeConstraints.ReadOnly;
    }

    // ==================== Shadow Constraints ====================
    if (shape.shadow.shadowPattern) {
        constraints |= NodeConstraints.Shadow;
    }

    // ==================== Tooltip Constraints ====================
    if (shape.comment) {
        constraints |= NodeConstraints.Tooltip;
    }

    // ==================== Connection Constraints ====================
    if (shape.glueType && shape.glueValue === '8') {
        constraints &= ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
    }

    // ==================== Drop Target Constraints ====================
    if (shape.AllowDrop) {
        constraints |= NodeConstraints.AllowDrop;
    }

    return constraints;
}

/**
 * Sets shadow properties for a shape if shadow is enabled.
 *
 * @param {VisioNodeInput} node - The VisioShape with shadow data.
 * @returns {ShadowProps} Shadow properties or undefined if no shadow.
 *
 * @example
 * const shadow = setShadow(shape);
 * // Returns { color: '#000000', opacity: 0.8, angle: 45, distance: 500 } or undefined
 *
 * @private
 */
function setShadow(node: VisioNodeInput): ShadowProps {
    if (node.shadow.shadowPattern && node.shadow.shapeShadowShow) {
        const shadow: ShadowProps = {
            color: node.shadow.shadowcolor,
            opacity: node.shadow.shadowOpacity,
            angle: node.shadow.shadow.angle,
            distance: (node.shadow.shadow.distance) * 100  // Scale distance
        };
        return shadow;
    }
    return undefined;
}

/**
 * Determines flip/mirroring direction for a shape.
 * Handles horizontal, vertical, or both directions.
 *
 * @param {FlippableShape} shape - The shape with flipX and flipY properties.
 * @returns {FlipDirection} The flip direction enum value.
 *
 * @example
 * const flip = setFlip(shape);
 * // Returns FlipDirection.Both, Horizontal, Vertical, or None
 *
 * @private
 */
function setFlip(shape: FlippableShape): FlipDirection {
    if (shape.flipX && shape.flipY) {
        return FlipDirection.Both;
    }
    if (shape.flipX) {
        return FlipDirection.Horizontal;
    }
    if (shape.flipY) {
        return FlipDirection.Vertical;
    }
    return FlipDirection.None;
}

/**
 * Determines the shape type and properties based on shape attributes and master data.
 * Maps Visio shape names to EJ2 diagram shape types (Basic, Flow, BPMN, UML, etc.).
 * Handles shape transformations and generates path data for custom shapes.
 *
 * @param {Attributes} attributes - The shape's XML attributes (Name, Type, etc.).
 * @param {VisioSection} defaultData - Default/master data containing geometry information.
 * @param {VisioShapeNode} shapes - The raw shape XML object with Cell and Section data.
 * @param {VisioNodeInput} [Node] - Optional: The VisioShape node being processed.
 * @param {ParsingContext} [context] - Optional: Parser context for warnings.
 * @returns {DetermineShapeResult} Shape type and type-specific properties.
 *
 * @example
 * const shapeResult = determineShapeType(attributes, defaultData, shapes, node, context);
 * // Returns { type: 'Basic', shape: 'Rectangle' } or other shape type
 *
 * @private
 */
export function determineShapeType(attributes: Attributes, defaultData: VisioSection, shapes: VisioShapeNode,
                                   Node?: VisioShape, context?: ParsingContext): DetermineShapeResult {
    // ==================== Define Shape Category Sets ====================
    const basicShapes: ReadonlySet<string> = new Set<string>([
        'Rectangle', 'Ellipse', 'Triangle', 'Pentagon', 'Heptagon', 'Octagon', 'Trapezoid',
        'Decagon', 'RightTriangle', 'Parallelogram', 'Hexagon', 'Cylinder', 'Diamond',
        'Polygon', 'Star', 'Plus'
    ]);

    const flowShapes: ReadonlySet<string> = new Set<string>([
        'Terminator', 'Process', 'Decision', 'Document', 'Data', 'Or', 'Collate', 'Merge',
        'Extract', 'Sort', 'SummingJunction', 'MultiDocument', 'OffPageReference',
        'PreDefinedProcess', 'DirectData', 'SequentialData', 'PaperTap', 'Card',
        'ManualOperation', 'StoredData', 'Preparation', 'Display', 'Delay'
    ]);

    const bpmnShapes: ReadonlySet<string> = new Set<string>([
        'StartEvent', 'EndEvent', 'IntermediateEvent', 'Gateway', 'DataStore', 'DataObject',
        'TextAnnotation', 'Task', 'CollapsedSubProcess', 'ExpandedSubProcess', 'Group', 'Message'
    ]);

    const umlActivityShapes: ReadonlySet<string> = new Set<string>([
        'Action', 'Decision', 'MergeNode', 'InitialNode', 'FinalNode', 'ForkNode', 'JoinNode', 'Note'
    ]);

    const umlClassShapes: ReadonlySet<string> = new Set<string>([
        'Class', 'Member', 'Separator', 'Interface', 'Enumeration'
    ]);

    // ==================== Define Shape Transformation Maps ====================
    // Maps Visio shape names to EJ2 equivalents
    const shapeTransformations: ReadonlyMap<string, string> = new Map<string, string>([
        ['Subprocess', 'PreDefinedProcess'],
        ['MagneticTape', 'SequentialData'],
        ['Database', 'DirectData'],
        ['Microform', 'PaperTap'],
        ['custom3', 'Card'],
        ['custom2', 'ManualOperation'],
        ['Start/End', 'Terminator'],
        ['ExternalData', 'StoredData'],
        ['Custom4', 'Preparation']
    ]);

    // Maps for basic shape name normalization
    const basicTrans: ReadonlyMap<string, string> = new Map<string, string>([
        ['Cross', 'Plus'],
        ['5PointStar', 'Star'],
        ['Circle', 'Ellipse'],
        ['Can', 'Cylinder'],
        ['Square', 'Rectangle'],
        ['OnPageReference', 'Ellipse']
    ]);

    // ==================== Extract and Normalize Shape Name ====================
    const name: string = attributes.Name;
    let finalShape: string;

    if (name !== undefined) {
        // ==================== Normalize Shape Name ====================
        // Convert camelCase and remove hyphens/spaces
        let trimmedName: string = name.replace(/[-\s](.)/g, (match: string, letter: string) => letter.toUpperCase())
            .replace(/[-\s]/g, '');
        trimmedName = trimmedName.replace(/\.\d+$/, '').trim(); // Remove .digits suffix

        // ==================== Log Shape Appearance Warnings ====================
        if (name === 'Parallelogram' || name === 'Trapezoid' || name === 'Hexagon' ||
            name === 'Data' || name === 'Off-page reference' || name === 'Preparation' || name === 'Multi document') {
            context.addWarning(`[WARNING] :: In the Visio to EJ2 Basic import, the ${name} exist in the EJ2 diagram but their appearance differs.`);
        }

        // ==================== Apply Shape Transformations ====================
        const fromBasic: string = basicTrans.get(trimmedName);
        const fromTransform: string = shapeTransformations.get(trimmedName);

        finalShape = fromBasic !== undefined
            ? fromBasic
            : (fromTransform !== undefined ? fromTransform : trimmedName);

        // ==================== Special Handling for Decision Shape ====================
        // Decision could be UML or Flowchart - check master keywords
        if (finalShape === 'Decision') {
            const keywordsRaw: string = getShapeKeywordsFromMaster(shapes, context);
            const kw: string = (keywordsRaw || '').toLowerCase();

            const hasUml: boolean = kw.includes('uml');
            const hasFlow: boolean = kw.includes('flow') || kw.includes('flowchart');
            if (hasUml && !hasFlow) {
                if (finalShape === 'Decision') {
                    const shape: UMLActivityShapeResult = getUMLActivityShapes(shapes, finalShape);
                    return shape;
                }
            }
        }

        // ==================== Determine Final Shape Type ====================
        if (basicShapes.has(finalShape) || basicTrans.has(finalShape)) {
            return { type: 'Basic', shape: finalShape };
        }
        else if ((flowShapes.has(finalShape)) || shapeTransformations.has(finalShape)) {
            return { type: 'Flow', shape: finalShape };
        }
        else if (finalShape === 'Path') {
            // ==================== Generate Path Data for Custom Shapes ====================
            const drawpathData: string = createPathFromGeometry(attributes, undefined, undefined, { useLocalScaling: true });
            const drawformattedPath: string = formatPathData(drawpathData);
            return { type: 'Path', data: drawformattedPath };
        }
        else if (bpmnShapes.has(finalShape)) {
            const shape: BPMNShapeResult = getBPMNShapes(shapes, finalShape, Node, context);
            return shape;
        }
        else if (finalShape === 'Image') {
            return { type: 'Image', source: '' };
        }
        else if (umlActivityShapes.has(finalShape)) {
            const shape: UMLActivityShapeResult = getUMLActivityShapes(shapes, finalShape);
            return shape;
        }
        else if (finalShape === 'LineCallout') {
            return { type: 'Basic', shape: 'Rectangle' };
        }
        else {
            // ==================== Generate Path Data for Unknown Shapes ====================
            const geometrySection: VisioSection = defaultData;
            let formattedPath: string = undefined;

            if (geometrySection && (geometrySection as any).N === 'Geometry' && geometrySection.Row) {
                const pathData: string = createCombinedPathFromGeometries(geometrySection, name);
                formattedPath = formatPathData(pathData);
            }
            context.addWarning(`[WARNING] :: The ${name} shape is not predefined, So it is rendered as Path shape`);
            return { type: 'Path', data: formattedPath };
        }
    }

    // ==================== Default Shape ====================
    return { type: 'Basic', shape: 'Rectangle' };
}

/**
 * Retrieves shape keywords from the shape's master definition.
 * Keywords are used for shape categorization and UML/BPMN detection.
 *
 * @param {VisioShapeNode} shape - The shape XML object with Master reference.
 * @param {ParsingContext} context - Parser context containing master data.
 * @returns {string} The shape keywords as a space-separated string, or empty string if not found.
 *
 * @example
 * const keywords = getShapeKeywordsFromMaster(shapeObj, context);
 * // Returns "uml flow diagram" or similar
 *
 * @private
 */
export function getShapeKeywordsFromMaster(shape: VisioShapeNode, context: ParsingContext): string {
    // ==================== Extract Master ID ====================
    const masterId: string = (shape && shape.$ && shape.$.Master != null)
        ? shape.$.Master
        : undefined;

    if (masterId == null) { return ''; }

    // ==================== Search Masters ====================
    const masters: VisioMaster[] = (context.data.masters) || [];
    if (!Array.isArray(masters)) { return ''; }

    const master: VisioMaster = masters.find((m: any) => {
        const mid: string = (m && m.id != null) ? m.id : undefined;
        return String(mid) === String(masterId);
    });

    // ==================== Return Keywords ====================
    if (!master || !master.shapeKeywords) { return ''; }
    return String(master.shapeKeywords);
}

/**
 * Retrieves UML activity shapes (Action, Decision, etc.).
 * Returns a UML Activity shape definition.
 *
 * @param {VisioShapeNode} shapes - The shape XML object.
 * @param {string} shapeName - The name of the UML activity shape.
 * @returns {UMLActivityShapeResult} A UML Activity shape definition.
 *
 * @example
 * const umlShape = getUMLActivityShapes(shapeXml, 'Decision');
 * // Returns { type: 'UmlActivity', shape: 'Decision' }
 *
 * @private
 */
function getUMLActivityShapes(shapes: VisioShapeNode, shapeName: string): UMLActivityShapeResult {
    return {
        type: 'UmlActivity',
        shape: shapeName
    };
}

/**
 * Main dispatcher for BPMN shape type determination.
 * Identifies specific BPMN shape subtypes and returns appropriate shape definitions.
 *
 * @param {VisioShapeNode} shapes - The shape XML object with Property section and cells.
 * @param {string} shapeName - The base BPMN shape name to categorize.
 * @param {VisioNodeInput} Node - The diagram node being processed.
 * @param {ParsingContext} context - Parser context for logging.
 * @returns {BPMNShapeResult} BPMN shape definition with type and subtype-specific properties.
 *
 * @example
 * const bpmnShape = getBPMNShapes(shapeObj, 'Event', node, context);
 * // Returns complete BPMN shape definition
 *
 * @private
 */
function getBPMNShapes(shapes: VisioShapeNode, shapeName: string, Node: VisioShape, context: ParsingContext): BPMNShapeResult {
    // ==================== Extract Property Map ====================
    const sections: VisioSection[] = ensureArray(shapes.Section);
    const propertySection: VisioSection = sections.find((sec: VisioSection) => sec.$ && sec.$.N === PROPERTY_SECTION);
    const propertyMap: BPMNPropertyMapType = createPropertyMap(propertySection);

    // ==================== Dispatch to Specific Shape Handler ====================
    if (shapeName.toLowerCase().includes('event')) {
        return getEventShape(shapes, propertyMap, Node);
    }
    else if (shapeName.toLowerCase().includes('gateway')) {
        return getGatewayShape(shapes, propertyMap, sections);
    }
    else if (shapeName.toLowerCase().includes('datastore')) {
        return getDataSourceShape();
    }
    else if (shapeName.toLowerCase().includes('dataobject')) {
        return getDataObjectShape(shapes, propertyMap, Node);
    }
    else if (shapeName.toLowerCase().includes('textannotation')) {
        return getTextAnnotationShape(shapes);
    }
    else if (shapeName.toLowerCase().includes('task') || shapeName.toLowerCase().includes('collapsedsubprocess')) {
        return getActivityShape(shapes, propertyMap);
    }
    else if (shapeName.toLowerCase().includes('expandedsubprocess')) {
        return getExpandedSubProcessShape(shapes, propertyMap, Node, context);
    }
    else if (shapeName.toLowerCase().includes('group')) {
        return getGroupShape(shapes);
    }
    else if (shapeName.toLowerCase().includes('message')) {
        return getMessageShape();
    }

    // ==================== Default to Event ====================
    return getEventShape(shapes, propertyMap, Node);
}

/**
 * Retrieves and processes BPMN flow shape (connector) types.
 * Identifies Association, Sequence, and Message flows.
 *
 * @param {VisioShapeNode} shapes - The shape XML object.
 * @param {string} shapeName - The flow shape name.
 * @param {VisioNodeInput} Node - The diagram node being processed.
 * @returns {BPMNFlowShapeResult | undefined} BPMN flow shape definition or undefined.
 *
 * @example
 * const flow = getBPMNFlowShapes(shapeObj, 'Association', node);
 *
 * @private
 */
export function getBPMNFlowShapes(shapes: VisioShapeNode, shapeName: string,
                                  Node: VisioNodeInput | VisioConnector): BPMNFlowShapeResult | undefined {
    let name: string = shapeName;

    // ==================== Extract BPMN Type from Properties ====================
    const sections: VisioSection[] = ensureArray(shapes.Section);
    const propertySection: VisioSection = sections.find((sec: VisioSection) => sec.$ && sec.$.N === PROPERTY_SECTION);
    const propertyMap: BPMNPropertyMapType = createPropertyMap(propertySection);

    const bpmnConnectingObjectType: string = propertyMap.get('BpmnConnectingObjectType');
    if (bpmnConnectingObjectType) {
        name = bpmnConnectingObjectType;
    }

    // ==================== Normalize Name and Dispatch ====================
    const cleanedBpmnType: string = name.replace(/\s+/g, '').toLowerCase();

    if (cleanedBpmnType.includes('association')) {
        return getBPMNAssociationFlow(propertyMap);
    }
    else if (cleanedBpmnType.includes('sequenceflow')) {
        return getBPMNSequenceFlow(propertyMap);
    }
    else if (cleanedBpmnType.includes('messageflow')) {
        return getBPMNMessageFlow();
    }
    return undefined;
}

/**
 * Processes BPMN Association flow shapes.
 * Determines flow direction (None, BiDirectional, Directional).
 *
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @returns {BPMNFlowShapeResult} Association flow definition.
 *
 * @example
 * const flow = getBPMNAssociationFlow(propMap);
 * // Returns { type: 'Bpmn', flow: 'Association', association: 'BiDirectional' }
 *
 * @private
 */
function getBPMNAssociationFlow(propertyMap: BPMNPropertyMapType): BPMNFlowShapeResult {
    let direction: 'Default' | 'BiDirectional' | 'Directional' = 'Default';

    // ==================== Direction Mapping ====================
    const associationDirectionMap: { [key: string]: ('BiDirectional' | 'Directional' | 'Default') } = {
        'none': 'Default',
        'both': 'BiDirectional',
        'one': 'Directional'
    };

    // ==================== Extract Direction ====================
    const bpmnAssociationDirection: string = propertyMap.get('BpmnDirection');
    if (bpmnAssociationDirection) {
        const lookupKey: string = bpmnAssociationDirection.replace(/\s+/g, '').toLowerCase();
        direction = associationDirectionMap[`${lookupKey}`] || 'Default';
    }

    return {
        type: 'Bpmn',
        flow: 'Association',
        association: direction
    };
}

/**
 * Processes BPMN Sequence flow shapes.
 * Determines flow condition type (Normal, Conditional, Default).
 *
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @returns {BPMNFlowShapeResult} Sequence flow definition.
 *
 * @example
 * const flow = getBPMNSequenceFlow(propMap);
 * // Returns { type: 'Bpmn', flow: 'Sequence', sequence: 'Conditional' }
 *
 * @private
 */
function getBPMNSequenceFlow(propertyMap: BPMNPropertyMapType): BPMNFlowShapeResult {
    let sequence: 'Default' | 'Normal' | 'Conditional' = 'Normal';

    // ==================== Condition Type Mapping ====================
    const associationDirectionMap: { [key: string]: ('Normal' | 'Conditional' | 'Default') } = {
        'default': 'Default',
        'none': 'Normal',
        'conditional': 'Conditional'
    };

    // ==================== Extract Condition Type ====================
    const bpmnAssociationDirection: string = propertyMap.get('BpmnConditionType');
    if (bpmnAssociationDirection) {
        const lookupKey: string = bpmnAssociationDirection.replace(/\s+/g, '').toLowerCase();
        sequence = associationDirectionMap[`${lookupKey}`] || 'Normal';
    }

    return {
        type: 'Bpmn',
        flow: 'Sequence',
        sequence: sequence
    };
}

/**
 * Processes BPMN Message flow shapes.
 * Returns a generic Message flow definition.
 *
 * @returns {BPMNFlowShapeResult} Message flow definition.
 *
 * @example
 * const flow = getBPMNMessageFlow();
 * // Returns { type: 'Bpmn', flow: 'Message', message: 'Default' }
 *
 * @private
 */
function getBPMNMessageFlow(): BPMNFlowShapeResult {
    return {
        type: 'Bpmn',
        flow: 'Message',
        message: 'Default'
    };
}

/**
 * Retrieves UML connector relationship types.
 * Identifies Inheritance, Association, Composition, etc.
 *
 * @param {VisioShapeNode} shapes - The shape XML object with Action section.
 * @param {string} shapeName - The connector name.
 * @param {VisioNodeInput} Node - The diagram node being processed.
 * @returns {UMLConnectorResult | undefined} UML connector definition with multiplicity.
 *
 * @example
 * const umlConnector = getUMLConnectors(shapeObj, 'Inheritance', node);
 *
 * @private
 */
export function getUMLConnectors(shapes: VisioShapeNode, shapeName: string,
                                 Node: VisioNodeInput | VisioConnector): UMLConnectorResult | undefined {
    let multiplicity: UMLConnectorResult['multiplicity'];

    // ==================== Type Mapping ====================
    const typeMapping: { [key: string]: string } = {
        'Row_3': 'Aggregation',
        'Row_4': 'Association',
        'Row_5': 'Composition',
        'Row_6': 'Dependency',
        'Row_7': 'DirectedAssociation',
        'Row_8': 'Inheritance',
        'Row_9': 'Realization'
    };

    // ==================== Check if UML Connector ====================
    const sections: VisioSection[] = ensureArray(shapes.Section);
    if (shapeName.includes('Inheritance') || shapeName.includes('Association') || shapeName.includes('Dependency')
        || shapeName.includes('Composition') || shapeName.includes('Aggregation') || shapeName.includes('InterfaceRealization') || shapeName.includes('DirectedAssociation')) {
        let shapeType: string = shapeName;

        // ==================== Extract Type from Actions Section ====================
        const actionsSection: VisioSection = sections.find((sec: VisioSection) => sec.$ && sec.$.N === ACTIONS_SECTION);
        if (actionsSection && actionsSection.Row) {
            const rows: VisioRow[] = ensureArray(actionsSection.Row);
            for (const row of rows) {
                if (row && row.$ && row.Cell) {
                    const cells: VisioCell[] = ensureArray(row.Cell);
                    const checkedCell: VisioCell = cells.find((cell: VisioCell) =>
                        cell.$ && cell.$.N === 'Checked' && cell.$.V === '1'
                    );

                    if (checkedCell) {
                        const rowName: string = row.$.N;

                        // ==================== Build Multiplicity for First Row ====================
                        if (rowName === 'Row_1') {
                            multiplicity = buildMultiplicity(shapes);
                        }

                        // ==================== Map Row to Type ====================
                        if (rowName in typeMapping) {
                            shapeType = typeMapping[`${rowName}`];
                            break;
                        }
                    }
                }
            }
        }

        // ==================== Normalize Interface Realization ====================
        if (shapeType === 'InterfaceRealization') {
            shapeType = 'Realization';
        }

        return {
            type: 'UmlClassifier',
            relationship: shapeType,
            multiplicity: multiplicity
        };
    }
    return undefined;
}

/**
 * Extracts text content from a shape XML object.
 * Looks for Text cell value.
 *
 * @param {VisioShapeNode | undefined} shape - The shape XML object.
 * @returns {string} The shape text content or empty string.
 *
 * @example
 * const text = getShapeText(shapeObj);
 *
 * @private
 */
function getShapeText(shape: VisioShapeNode | undefined): string {
    if (!shape) { return ''; }
    if (shape.Text && typeof shape.Text.value === 'string') { return shape.Text.value; }
    return '';
}

/**
 * Builds multiplicity information from child shapes of a connector.
 * Extracts multiplicity bounds from child shape text.
 *
 * @param {VisioShapeNode} groupShape - The connector group containing multiplicity child shapes.
 * @returns {UMLConnectorResult} Multiplicity object with source and target bounds.
 *
 * @example
 * const mult = buildMultiplicity(connectorShape);
 * // Returns { type: 'ManyToMany', source: {...}, target: {...} }
 *
 * @private
 */
function buildMultiplicity(groupShape: VisioShapeNode): UMLConnectorResult['multiplicity'] {
    // ==================== Extract Child Shapes ====================
    const children: VisioShapeNode[] = ensureArray(groupShape && groupShape.Shapes && groupShape.Shapes.Shape);

    // ==================== Extract Multiplicity Values ====================
    const t0: string = getShapeText(children[0]) || 'M1';
    const t1: string = getShapeText(children[1]) || 'M2';
    const t2: string = getShapeText(children[2]) || 'M3';
    const t3: string = getShapeText(children[3]) || 'M4';

    const sourceLower: string = t0;
    const sourceUpper: string = t1;
    const targetLower: string = t2;
    const targetUpper: string = t3;

    const sourceOptional: boolean = true;
    const targetOptional: boolean = true;

    const type: string = 'ManyToMany';

    return {
        type: type,
        source: { optional: sourceOptional, lowerBounds: sourceLower, upperBounds: sourceUpper },
        target: { optional: targetOptional, lowerBounds: targetLower, upperBounds: targetUpper }
    };
}

/**
 * Safely extracts property value from a section row's cell.
 * Looks for the Value cell within the row.
 *
 * @param {VisioRow} row - The property section row.
 * @param {string} propertyName - The expected property name.
 * @returns {string | undefined} The cell value or undefined if not found.
 *
 * @example
 * const value = getPropertyValue(row, 'BpmnEventType');
 *
 * @private
 */
function getPropertyValue(row: VisioRow, propertyName: string): string | undefined {
    if (!row || !row.$ || row.$.N !== propertyName || !row.Cell) {
        return undefined;
    }
    const cells: VisioCell[] = ensureArray(row.Cell);
    const valueCell: VisioCell = cells.find((c: VisioCell) => c && c.$ && c.$.N === VALUE_CELL);
    return valueCell && valueCell.$ && valueCell.$.V != null ? String(valueCell.$.V).replace(/\s+/g, '') : undefined;
}

/**
 * Creates a property map from a Property or User section.
 * Converts rows into a Map for efficient property lookup.
 *
 * @param {VisioSection} section - The Property or User section from shape.
 * @returns {BPMNPropertyMapType} Map of property name -> value.
 *
 * @example
 * const propMap = createPropertyMap(propertySection);
 *
 * @private
 */
function createPropertyMap(section: VisioSection): BPMNPropertyMapType {
    const propertyMap: BPMNPropertyMapType = new Map<string, string>();
    if (section && section.Row) {
        const propertyRows: VisioRow[] = ensureArray(section.Row);
        propertyRows.forEach((row: VisioRow) => {
            if (row && row.$ && row.$.N) {
                const value: string = getPropertyValue(row, row.$.N);
                if (value !== undefined) {
                    propertyMap.set(row.$.N, value);
                }
            }
        });
    }
    return propertyMap;
}

/**
 * Processes BPMN Event shapes.
 * Determines event type (Start, End, Intermediate) and trigger/result.
 *
 * @param {VisioShapeNode} shapes - The event shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @param {VisioNodeInput} node - The diagram node being processed.
 * @returns {BPMNEventShapeResult} BPMN Event shape definition.
 *
 * @example
 * const event = getEventShape(shapeObj, propMap, node);
 * // Returns { type: 'Bpmn', shape: 'Event', event: {...} }
 *
 * @private
 */
function getEventShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType, node: VisioShape): BPMNEventShapeResult {
    let eventName: string = 'Start';
    let trigger: string = 'None';

    // ==================== Event Type Mapping ====================
    const eventNameMap: { [key: string]: string } = {
        'start(non-interrupting)': 'NonInterruptingStart',
        'intermediate(non-interrupting)': 'NonInterruptingIntermediate',
        'intermediate(throwing)': 'ThrowingIntermediate'
    };

    const triggerMap: { [key: string]: string } = {
        'parallelmultiple': 'Parallel'
    };

    // ==================== Extract Event Type from Shape Name ====================
    if (shapes.$.Name) {
        const nameParts: string[] = shapes.$.Name.split(' ').map((p: string) => p.trim().toLowerCase());
        eventName = nameParts[0];
    }

    // ==================== Extract from Properties ====================
    const bpmnEventType: string = propertyMap.get('BpmnEventType');
    if (bpmnEventType) {
        eventName = bpmnEventType;
    }

    const bpmnTriggerOrResult: string = propertyMap.get('BpmnTriggerOrResult');
    if (bpmnTriggerOrResult) {
        trigger = bpmnTriggerOrResult;
    }

    // ==================== Normalize Names ====================
    eventName = toCapitalizedWords(eventName);
    trigger = toCapitalizedWords(trigger);
    eventName = eventNameMap[eventName.toLowerCase()] || eventName;
    trigger = triggerMap[trigger.toLowerCase()] || trigger;

    // ==================== Extract Colors from Child Shapes ====================
    const childShapes: VisioShapeNode[] = shapes.Shapes && shapes.Shapes.Shape && ensureArray(shapes.Shapes.Shape);
    if (childShapes && childShapes.length > 0) {
        let fillColorFound: boolean = false;
        let strokeColorFound: boolean = false;

        for (const childShape of childShapes) {
            if (childShape && childShape.Cell) {
                const childCell: Map<string, CellMapValue> = mapCellValues(childShape.Cell);

                if (!fillColorFound) {
                    const fillColor: string = getCellMapStringValue(childCell, 'FillForegnd');
                    if (fillColor !== undefined) {
                        if ((node as VisioShape).style && (node as VisioShape).style.fillColor === undefined) {
                            (node as VisioShape).style.fillColor = fillColor;
                        }
                        fillColorFound = true;
                    }
                }

                if (!strokeColorFound) {
                    const strokeColor: string = getCellMapStringValue(childCell, 'LineColor');
                    if (strokeColor !== undefined) {
                        if ((node as VisioShape).style && (node as VisioShape).style.strokeColor === undefined) {
                            (node as VisioShape).style.strokeColor = strokeColor;
                        }
                        strokeColorFound = true;
                    }
                }

                if (fillColorFound && strokeColorFound) {
                    break;
                }
            }
        }
    }

    return {
        type: 'Bpmn',
        shape: 'Event',
        event: {
            event: eventName,
            trigger: trigger
        }
    };
}

/**
 * Processes BPMN Gateway shapes.
 * Determines gateway type (Exclusive, Inclusive, Parallel, etc.).
 *
 * @param {VisioShapeNode} shapes - The gateway shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @param {VisioSection[]} sections - All sections from the shape.
 * @returns {BPMNGatewayShapeResult} BPMN Gateway shape definition.
 *
 * @example
 * const gateway = getGatewayShape(shapeObj, propMap, sections);
 * // Returns { type: 'Bpmn', shape: 'Gateway', gateway: {...} }
 *
 * @private
 */
function getGatewayShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType, sections: VisioSection[]): BPMNGatewayShapeResult {
    let gatewayType: string = 'None'; // Default gateway type

    // ==================== Gateway Type Mapping ====================
    const gatewayMap: { [key: string]: string } = {
        'exclusive': 'None',
        'inclusive': 'Inclusive',
        'parallel': 'Parallel',
        'complex': 'Complex',
        'event': 'EventBased',
        'eventbased': 'Exclusive',
        'exclusiveevent(instantiate)': 'ExclusiveEventBased',
        'parallelevent(instantiate)': 'ParallelEventBased'
    };

    // ==================== Extract Gateway Type ====================
    const bpmnGatewayType: string = propertyMap.get('BpmnGatewayType');
    if (bpmnGatewayType) {
        gatewayType = bpmnGatewayType;
    } else {
        const bpmnExclusiveType: string = propertyMap.get('BpmnExclusiveType');
        if (bpmnExclusiveType) {
            gatewayType = bpmnExclusiveType;
        }
    }

    // ==================== Check for Event-Based Gateway Marker ====================
    const actionsSection: VisioSection = sections.find((sec: VisioSection) => sec.$ && sec.$.N === ACTIONS_SECTION);
    if (actionsSection && actionsSection.Row) {
        const actionRows: VisioRow[] = ensureArray(actionsSection.Row);
        const exclusiveDataWithMarkerRow: VisioRow = actionRows.find((row: VisioRow) => row && row.$ && row.$.N === 'ExclusiveDataWithMarker');
        if (exclusiveDataWithMarkerRow && exclusiveDataWithMarkerRow.Cell) {
            const checkedCell: VisioCell = ensureArray(exclusiveDataWithMarkerRow.Cell).find((cell: VisioCell) => cell && cell.$ && cell.$.N === 'Checked');
            if (checkedCell && checkedCell.$.V === '1') {
                gatewayType = 'eventbased';
            }
        }
    }

    // ==================== Map to EJ2 Gateway Type ====================
    const lookupKey: string = gatewayType.toLowerCase().replace(/\s/g, '');
    const GatewayType: string = gatewayMap[`${lookupKey}`] || 'None';

    return {
        type: 'Bpmn',
        shape: 'Gateway',
        gateway: {
            type: GatewayType
        }
    };
}

/**
 * Returns a DataSource shape definition for BPMN.
 *
 * @returns {BPMNSimpleShapeResult} DataSource shape definition.
 *
 * @example
 * const dataStore = getDataSourceShape();
 *
 * @private
 */
function getDataSourceShape(): BPMNSimpleShapeResult {
    return {
        type: 'Bpmn',
        shape: 'DataSource'
    };
}

/**
 * Returns a Message shape definition for BPMN.
 *
 * @returns {BPMNSimpleShapeResult} Message shape definition.
 *
 * @example
 * const message = getMessageShape();
 *
 * @private
 */
function getMessageShape(): BPMNSimpleShapeResult {
    return {
        type: 'Bpmn',
        shape: 'Message'
    };
}

/**
 * Processes BPMN DataObject shapes.
 * Determines if collection flag is set.
 *
 * @param {VisioShapeNode} shapes - The data object shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @param {VisioNodeInput} node - The diagram node being processed.
 * @returns {BPMNDataObjectShapeResult} BPMN DataObject shape definition.
 *
 * @example
 * const dataObj = getDataObjectShape(shapeObj, propMap, node);
 *
 * @private
 */
function getDataObjectShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType, node: VisioShape): BPMNDataObjectShapeResult {
    let isCollection: boolean = false;

    // ==================== Extract Collection Flag ====================
    const bpmnCollection: string = propertyMap.get('BpmnCollection');
    if (bpmnCollection === '1') {
        isCollection = true;
    }

    // ==================== Extract Colors from Child Shapes ====================
    const childShapes: VisioShapeNode[] = shapes.Shapes && shapes.Shapes.Shape && ensureArray(shapes.Shapes.Shape);
    if (childShapes && childShapes.length > 0) {
        let fillColorFound: boolean = false;
        let strokeColorFound: boolean = false;

        for (const childShape of childShapes) {
            if (childShape && childShape.Cell) {
                const childCell: Map<string, CellMapValue> = mapCellValues(childShape.Cell);

                if (!fillColorFound) {
                    const fillColor: string = getCellMapStringValue(childCell, 'FillForegnd');
                    if (fillColor !== undefined) {
                        if ((node as VisioShape).style && (node as VisioShape).style.fillColor === undefined) {
                            (node as VisioShape).style.fillColor = fillColor;
                        }
                        fillColorFound = true;
                    }
                }

                if (!strokeColorFound) {
                    const strokeColor: string = getCellMapStringValue(childCell, 'LineColor');
                    if (strokeColor !== undefined) {
                        if ((node as VisioShape).style && (node as VisioShape).style.strokeColor === undefined) {
                            (node as VisioShape).style.strokeColor = strokeColor;
                        }
                        strokeColorFound = true;
                    }
                }

                if (fillColorFound && strokeColorFound) {
                    break;
                }
            }
        }
    }

    return {
        type: 'Bpmn',
        shape: 'DataObject',
        dataObject: {
            collection: isCollection,
            type: 'None'
        }
    };
}

/**
 * Processes BPMN TextAnnotation shapes.
 * Determines annotation direction and target relationship.
 *
 * @param {VisioShapeNode} shapes - The text annotation shape XML object.
 * @returns {BPMNTextAnnotationShapeResult} BPMN TextAnnotation shape definition.
 *
 * @example
 * const textAnnot = getTextAnnotationShape(shapeObj);
 *
 * @private
 */
function getTextAnnotationShape(shapes: VisioShapeNode): BPMNTextAnnotationShapeResult {
    let direction: 'Top' | 'Bottom' | 'Left' | 'Right' = 'Left';
    let targetId: string = '';

    // ==================== Direction Mapping ====================
    const orientationMap: { [key: string]: ('Top' | 'Bottom' | 'Left' | 'Right') } = {
        '1': 'Right',
        '2': 'Top',
        '3': 'Left',
        '4': 'Bottom'
    };

    // ==================== Extract Direction from User Section ====================
    const sections: VisioSection[] = ensureArray(shapes.Section);
    const userSection: VisioSection = sections.find((sec: VisioSection) => sec.$ && sec.$.N === USER_SECTION);
    const propertyMap: BPMNPropertyMapType = createPropertyMap(userSection as VisioSection);
    const orientation: string = propertyMap.get('Orientation');
    if (orientation && orientationMap[`${orientation}`]) {
        direction = orientationMap[`${orientation}`];
    }

    // ==================== Extract Target from Relationships ====================
    const shapeCells: VisioCell[] = ensureArray(shapes.Cell);
    const relationshipCell: VisioCell = shapeCells.find((cell: VisioCell) => cell && cell.$ && cell.$.N === RELATIONSHIPS_CELL);
    if (relationshipCell && relationshipCell.$.F) {
        targetId = getTextAnnotationTargetID(relationshipCell.$.F) || '';
    }

    return {
        type: 'Bpmn',
        shape: 'TextAnnotation',
        textAnnotation: {
            textAnnotationDirection: direction,
            textAnnotationTarget: targetId || ''
        }
    };
}

/**
 * Processes BPMN Activity (Task or SubProcess) shapes.
 * Determines activity type and delegates to appropriate handler.
 *
 * @param {VisioShapeNode} shapes - The activity shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @returns {BPMNActivityShapeResult} BPMN Activity shape definition.
 *
 * @example
 * const activity = getActivityShape(shapeObj, propMap);
 *
 * @private
 */
function getActivityShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType): BPMNActivityShapeResult {
    let activityType: string = 'Task';

    // ==================== Extract Activity Type ====================
    if (shapes.$.Name) {
        activityType = shapes.$.Name.replace(/[^a-zA-Z]/g, '');
    }

    const bpmnActivityType: string = propertyMap.get('BpmnActivityType');
    if (bpmnActivityType) {
        if (bpmnActivityType === 'Sub-Process') {
            activityType = 'SubProcess';
        } else if (bpmnActivityType === 'Task') {
            activityType = 'Task';
        }
    }

    // ==================== Delegate to Appropriate Handler ====================
    if (activityType === 'SubProcess' || activityType === 'CollapsedSubProcess') {
        return getSubProcessShape(shapes, propertyMap);
    } else {
        return getTaskShape(shapes, propertyMap);
    }
}

/**
 * Processes BPMN Task shapes.
 * Determines task type, loop type, compensation, and call flags.
 *
 * @param {VisioShapeNode} shapes - The task shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @returns {BPMNActivityShapeResult} BPMN Task activity definition.
 *
 * @example
 * const task = getTaskShape(shapeObj, propMap);
 *
 * @private
 */
function getTaskShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType): BPMNActivityShapeResult {
    const task: { type: string, loop: string, compensation: boolean, call: boolean } = {
        type: 'None',
        loop: 'None',
        compensation: false,
        call: false
    };

    // ==================== Loop Type Mapping ====================
    const loopTypeMap: { [key: string]: string } = {
        'none': 'None',
        'standard': 'Standard',
        'parallelmultiinstance': 'ParallelMultiInstance',
        'sequentialmultiinstance': 'SequenceMultiInstance'
    };

    // ==================== Extract Task Properties ====================
    task.type = propertyMap.get('BpmnTaskType') || 'None';
    task.compensation = propertyMap.get('BpmnIsForCompensation') === '1';
    task.call = propertyMap.get('BpmnBoundaryType') === 'Call';

    // ==================== Extract Loop Type ====================
    const visioLoopValue: string = propertyMap.get('BpmnLoopType') || 'none';
    const visioLoopKey: string = visioLoopValue.toLowerCase();
    task.loop = loopTypeMap[`${visioLoopKey}`] || visioLoopValue;

    return {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
            activity: 'Task',
            task: task
        }
    };
}

/**
 * Processes BPMN SubProcess shapes (collapsed).
 * Determines subprocess properties including loop, compensation, and boundary type.
 *
 * @param {VisioShapeNode} shapes - The subprocess shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @returns {BPMNActivityShapeResult} BPMN SubProcess activity definition.
 *
 * @example
 * const subProc = getSubProcessShape(shapeObj, propMap);
 *
 * @private
 */
function getSubProcessShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType): BPMNActivityShapeResult {
    const subProcess: {
        type: string, loop: string, compensation: boolean, adhoc: boolean,
        collapsed: boolean, boundary: string,
    } = {
        type: 'None', loop: 'None', compensation: false, adhoc: false,
        collapsed: true, boundary: 'Default'
    };

    // ==================== Loop Type Mapping ====================
    const loopTypeMap: { [key: string]: string } = {
        'none': 'None', 'standard': 'Standard', 'parallelmultiinstance': 'ParallelMultiInstance',
        'sequentialmultiinstance': 'SequenceMultiInstance'
    };

    // ==================== Extract SubProcess Properties ====================
    subProcess.type = 'None';
    subProcess.compensation = propertyMap.get('BpmnIsForCompensation') === '1';
    subProcess.adhoc = propertyMap.get('BpmnAdHoc') === '1';

    // ==================== Extract Collapse State ====================
    const isCollapsedValue: string = propertyMap.get('BpmnIsCollapsed');
    subProcess.collapsed = isCollapsedValue !== '0';

    // ==================== Extract Loop Type ====================
    const visioLoopValue: string = propertyMap.get('BpmnLoopType') || 'none';
    const visioLoopKey: string = visioLoopValue.toLowerCase();
    subProcess.loop = loopTypeMap[`${visioLoopKey}`] || visioLoopValue;

    // ==================== Extract Boundary Type ====================
    subProcess.boundary = propertyMap.get('BpmnBoundaryType') || 'Default';

    return {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
            activity: 'SubProcess',
            subProcess: subProcess
        }
    };
}

/**
 * Processes BPMN ExpandedSubProcess shapes.
 * Determines subprocess properties and extracts child process IDs.
 *
 * @param {VisioShapeNode} shapes - The expanded subprocess shape XML object.
 * @param {BPMNPropertyMapType} propertyMap - Property map from shape.
 * @param {VisioNodeInput} Node - The diagram node being processed.
 * @param {ParsingContext} context - Parser context for tracking expanded processes.
 * @returns {BPMNActivityShapeResult} BPMN ExpandedSubProcess activity definition.
 *
 * @example
 * const expandedSubProc = getExpandedSubProcessShape(shapeObj, propMap, node, context);
 *
 * @private
 */
function getExpandedSubProcessShape(shapes: VisioShapeNode, propertyMap: BPMNPropertyMapType,
                                    Node: VisioShape, context: ParsingContext): BPMNActivityShapeResult {
    const subProcess: BPMNSubProcessInput = {
        loop: 'None',
        compensation: false,
        adhoc: false,
        collapsed: false,
        boundary: 'Default',
        processes: []
    };

    // ==================== Loop Type Mapping ====================
    const loopTypeMap: { [key: string]: string } = {
        'none': 'None', 'standard': 'Standard', 'parallelmultiinstance': 'ParallelMultiInstance',
        'sequentialmultiinstance': 'SequenceMultiInstance'
    };

    // ==================== Extract SubProcess Properties ====================
    subProcess.compensation = propertyMap.get('BpmnIsForCompensation') === '1';
    subProcess.adhoc = propertyMap.get('BpmnAdHoc') === '1';
    subProcess.boundary = propertyMap.get('BpmnBoundaryType') || 'Default';

    // ==================== Extract Loop Type ====================
    const visioLoopValue: string = propertyMap.get('BpmnLoopType') || 'none';
    const visioLoopKey: string = visioLoopValue.toLowerCase();
    subProcess.loop = loopTypeMap[`${visioLoopKey}`] || visioLoopValue;

    // ==================== Mark as Drop Target ====================
    (Node as any).AllowDrop = true;

    // ==================== Extract Child Process IDs ====================
    const shapeCells: VisioCell[] = ensureArray(shapes.Cell);
    const relationshipCell: VisioCell = shapeCells.find((cell: VisioCell) => cell && cell.$ && cell.$.N === RELATIONSHIPS_CELL);
    if (relationshipCell && relationshipCell.$.F) {
        const processIDs: string[] = getProcessIDs(shapes);
        if (processIDs.length > 0) {
            subProcess.processes = processIDs;
        }
    }

    // ==================== Track Expanded Process ====================
    const shapeID: string = getShapeId(shapes);
    if (shapeID) {
        context.data.expandedSubprocessCollection.push(shapeID);
    }

    return {
        type: 'Bpmn',
        shape: 'Activity',
        activity: {
            activity: 'SubProcess',
            subProcess: subProcess as BPMNSubProcess
        }
    };
}

/**
 * Extracts shape ID from shape XML attributes.
 *
 * @param {VisioShapeNode} shapes - The shape XML object.
 * @returns {string} The shape ID or empty string.
 *
 * @example
 * const id = getShapeId(shapeObj);
 *
 * @private
 */
function getShapeId(shapes: VisioShapeNode): string {
    return shapes && shapes.$ && shapes.$.ID != null ? String(shapes.$.ID) : '';
}

/**
 * Processes BPMN Group shapes.
 * Returns a group shape definition.
 *
 * @param {VisioShapeNode} shapes - The group shape XML object.
 * @returns {BPMNSimpleShapeResult} BPMN Group shape definition.
 *
 * @example
 * const group = getGroupShape(shapeObj);
 *
 * @private
 */
function getGroupShape(shapes: VisioShapeNode): BPMNSimpleShapeResult {
    const shapeCells: VisioCell[] = ensureArray(shapes.Cell);
    const relationshipCell: VisioCell = shapeCells.find((cell: VisioCell) => cell && cell.$ && cell.$.N === RELATIONSHIPS_CELL);

    return {
        type: 'Bpmn',
        shape: 'Group'
    };
}

/**
 * Extracts child process IDs from a subprocess Relationships cell formula.
 * Parses complex DEPENDSON formulas to extract Sheet references.
 *
 * @param {VisioShapeNode} shape - The subprocess shape with Relationships cell.
 * @returns {string[]} Array of process IDs extracted from formula.
 *
 * @example
 * const processIds = getProcessIDs(subprocessShape);
 * // Returns ['1', '2', '3'] etc.
 *
 * @private
 */
function getProcessIDs(shape: VisioShapeNode): string[] {
    const processIDs: string[] = [];

    // ==================== Extract Relationships Cell ====================
    const relationsCell: VisioCell = ensureArray(shape.Cell).find((c: VisioCell) => c.$.N === RELATIONSHIPS_CELL);
    if (relationsCell && relationsCell.$.F) {
        const formula: string = relationsCell.$.F;

        // ==================== Parse SUM Formula ====================
        const sumArgsRegex: RegExp = /SUM\((.*)\)/;
        const sumMatch: RegExpMatchArray | null = formula.match(sumArgsRegex);
        if (sumMatch && sumMatch[1]) {
            const argsString: string = sumMatch[1];

            // ==================== Split by DEPENDSON Calls ====================
            const dependsonCallSplitter: RegExp = /,(?=\s*DEPENDSON\()/g;
            const individualDependsonCalls: string[] = argsString.split(dependsonCallSplitter);

            // ==================== Extract Sheet IDs ====================
            for (const call of individualDependsonCalls) {
                if (call.startsWith('DEPENDSON(1,')) {
                    const sheetIdExtractorRegex: RegExp = /Sheet\.(\d+)!SheetRef\(\)/g;
                    let sheetIdExtractMatch: RegExpExecArray | null;
                    sheetIdExtractMatch = sheetIdExtractorRegex.exec(call);
                    while (sheetIdExtractMatch !== null) {
                        if (sheetIdExtractMatch[1]) {
                            processIDs.push(sheetIdExtractMatch[1]);
                        }
                        sheetIdExtractMatch = sheetIdExtractorRegex.exec(call);
                    }
                }
            }
        }
    }

    return processIDs;
}

/**
 * Extracts target shape ID from a TextAnnotation Relationships formula.
 * Parses Sheet reference to identify the connected shape.
 *
 * @param {string} formula - The Relationships cell formula.
 * @returns {string | null} The target shape ID or null if not found.
 *
 * @example
 * const targetId = getTextAnnotationTargetID('DEPENDSON(1,Sheet.5!SheetRef())');
 * // Returns '5'
 *
 * @private
 */
function getTextAnnotationTargetID(formula: string): string | null {
    if (!formula) {
        return null;
    }

    // ==================== Extract Sheet ID ====================
    const match: RegExpMatchArray = formula.match(/Sheet\.(\d+)!/);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

/**
 * Converts a string to capitalized words format.
 * Capitalizes first letter of each word, lowercases the rest.
 *
 * @param {string} str - The input string.
 * @returns {string} The capitalized words string.
 *
 * @example
 * const result = toCapitalizedWords('hello world');
 * // Returns 'HelloWorld'
 *
 * @private
 */
function toCapitalizedWords(str: string): string {
    return str.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
}
