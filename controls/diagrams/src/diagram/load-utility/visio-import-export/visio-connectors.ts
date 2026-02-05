import { AnnotationConstraints, ConnectorConstraints, Segments } from '../../enum/enum';
import { DiagramConnectorSegmentModel } from '../../objects/connector-model';
import { VisioConnectorAnnotation, VisioTextAlignmentModel, VisioTextStyleModel } from './visio-annotations';
import { LINE_PATTERN_MAP } from './visio-constants';
import { extractGradientStops, formatCoordinate, getDecoratorDimensions, getDecoratorShape, getGradientVectorByAngle, getRadialGradient, getRouting, getTooltip, getVisibility, inchToPoint, inchToPx, mapCellValues, roundTo2Decimals, toBoolean, toCamelCase } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { setDefaultData } from './visio-model-parsers';
import { VisioMaster, VisioPage } from './visio-models';
import { getBPMNFlowShapes, getShapeKeywordsFromMaster, getTextDecoration, getUMLConnectors } from './visio-nodes';
import { AccentColorDefinition, ActiveThemeResult, ColorInfo, ThemeColorElement, ThemeEntry, applyThemeStyles, defaultStroke, extractColorWithModifiers, fontMapping, getConnectorFontType, hasOwn, isActiveThemeApplied, normalizeRange, resolveAccentColor } from './visio-theme';
import {
    Attributes,
    CellMapValue,
    ControlPointSet,
    GeometryData,
    NurbsParameters,
    PointWithType,
    Vec2,
    VisioCell,
    VisioPort,
    VisioSegmentsModel,
    WCP,
    Direction,
    ExtractedNurbsData,
    DecoratorShapes,
    ConnectorType,
    AnnotationStyle,
    VisioRow,
    SolidFillValue,
    VisioShapeNode,
    VisioSection,
    OneOrMany,
    VisioShapesNode,
    ConnectsElement,
    VisioConnectElement,
    MasterDefaultValues,
    GradientStop,
    GradientVector,
    RadialGradientConfig,
    ConnectorGradient,
    ConnectorShapePayload,
    ShapeAttributes,
    ParsedXmlObject,
    UMLConnectorResult,
    BPMNFlowShapeResult,
    CellAttribute,
    ConnectorResolvedStyle,
    ResolvedAnnotationStyle
} from './visio-types';

/**
 * Represents a Visio connector (line, arrow, or connector shape).
 * Contains all properties needed to define connector geometry, styling, and metadata.
 */
export class VisioConnector {
    /** Unique identifier for the connector */
    id: string;
    /** ID of the source shape */
    sourceId?: string;
    /** ID of the target shape */
    targetId?: string;
    /** ID of the source port on the source shape */
    sourcePortId?: string;
    /** ID of the target port on the target shape */
    targetPortId?: string;
    /** Starting X coordinate in pixels */
    beginX: number;
    /** Starting Y coordinate in pixels */
    beginY: number;
    /** Ending X coordinate in pixels */
    endX: number;
    /** Ending Y coordinate in pixels */
    endY: number;
    /** Type of connector routing (Straight, Orthogonal, Bezier) */
    type: ConnectorType;
    /** Corner radius for the connector */
    cornerRadius?: number;
    /** ID of the master shape this connector is based on */
    masterId?: string;
    /** Reference to the master shape */
    master?: VisioMaster;
    /** Connector styling properties */
    style?: VisioStyleModel;
    /** Text annotation/label for the connector */
    annotation?: VisioConnectorAnnotation;
    /** Decorator (arrow head) at the source end */
    sourceDecorator?: VisioDecoratorModel;
    /** Decorator (arrow head) at the target end */
    targetDecorator?: VisioDecoratorModel;
    /** Layer membership index */
    layerMember?: number;
    /** Constraint flags for connector behavior */
    constraints?: number;
    /** Distance for line bridges to jump over connectors */
    bridgeSpace?: number;
    /** Segments defining the connector path */
    segments?: DiagramConnectorSegmentModel[];
    /** Flag indicating if connector is visible */
    visible?: boolean;
    /** Tooltip text for the connector */
    tooltip?: string;
    /** Flag allowing shapes to be dropped on this connector */
    allowDrop?: boolean;
    /** Flag enabling automatic connector line routing */
    lineRouting?: boolean;
    /** QuickStyle line color index */
    QuickStyleLineColor: number;
    /** QuickStyle line matrix index */
    QuickStyleLineMatrix: number;
    /** Connection points/ports on the connector */
    ports?: VisioPort[];
    /** Reference to the underlying Visio shape object */
    shape?: ConnectorShapePayload;
    /** Flag indicating this is a connector shape */
    IsConnector?: boolean;
    /** Connector line routing extension setting */
    conLineRouteExt?: string;
    /** Shape-level routing style (0-22) - Controls routing algorithm */
    shapeRouteStyle?: string;

    /**
     * Creates VisioConnector instances from Visio shape data.
     * Parses connector cells and extracts all relevant properties.
     * @static
     * @param {VisioShapesNode} obj - The Visio shapes container object
     * @param {ParsingContext} context - Parsing context containing page and connector data
     * @returns {VisioConnector[]} Array of parsed connector objects
     */
    static fromJs(obj: VisioShapesNode, context: ParsingContext): VisioConnector[] {
        const connectors: VisioConnector[] = [];
        const shapes: VisioShapeNode[] = Array.isArray(obj.Shape) ? (obj.Shape as VisioShapeNode[]) : [obj.Shape as VisioShapeNode];
        const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);

        for (const shape of shapes) {
            // Check if this shape is actually a connector
            if (isConnectorShape(shape, context)) {
                const attributes: Attributes = (shape && shape.$) ? (shape.$ as Attributes) : {};
                const defaultData: MasterDefaultValues = setDefaultData(context.data.shapes, attributes as ShapeAttributes);
                const connector: VisioConnector = new VisioConnector();

                /**
                 * Helper function to extract cell values by name
                 * @param {string} name - The name of the cell to find
                 * @returns {string | undefined} The cell value
                 */
                const getCell: (name: string) => string | undefined = (name: string) => {
                    const cell: VisioCell = Array.isArray(shape.Cell)
                        ? (shape.Cell as VisioCell[]).find((c: VisioCell) => c.$.N === name)
                        : ((shape.Cell as VisioCell).$.N === name ? (shape.Cell as VisioCell) : undefined);
                    return cell ? cell.$.V as string : undefined;
                };

                // Create map of cell values for efficient lookup
                const cellMap: Map<string, CellMapValue> = mapCellValues(VisioConnectorUtils.isArrayCell(shape));

                // Extract basic connector properties
                connector.id = shape.$!.ID;
                connector.conLineRouteExt = getCell('ConLineRouteExt') || '0';
                connector.shapeRouteStyle = getCell('ShapeRouteStyle') || '0';
                connector.type = getConnectorType(shape, connector, context);

                // Extract and convert begin coordinates
                const beginXCell: string = getCell('BeginX') || (defaultData.beginX as string);
                connector.beginX = Number(beginXCell) * 96;
                const beginYCell: string = getCell('BeginY') || (defaultData.beginY as string);
                if (beginYCell) {
                    // Invert Y-axis: page height - Visio Y coordinate
                    connector.beginY = pageHeight - (Number(beginYCell) * 96);
                }

                // Extract and convert end coordinates
                const endXCell: string = getCell('EndX') || (defaultData.endX as string);
                connector.endX = Number(endXCell) * 96;
                const endYCell: string = getCell('EndY') || (defaultData.endY as string);
                if (endYCell) {
                    connector.endY = pageHeight - (Number(endYCell) * 96);
                }

                // Extract styling and annotation properties
                connector.cornerRadius = Number(getCell('Rounding'));
                connector.visible = getVisibility(shape.Section);
                connector.masterId = shape.$!.Master;
                connector.IsConnector = true;
                connector.QuickStyleLineColor = getCell('QuickStyleLineColor') !== undefined ?
                    Number(getCell('QuickStyleLineColor')) : undefined as number;
                connector.QuickStyleLineMatrix = getCell('QuickStyleLineMatrix') !== undefined ?
                    Number(getCell('QuickStyleLineMatrix')) : undefined as number;

                // Extract style and annotation data
                connector.style = VisioStyleModel.fromShape(shape);
                connector.annotation = VisioConnectorAnnotation.fromJs(shape, defaultData);

                // Extract decorator information
                connector.sourceDecorator = VisioDecoratorModel.fromJs(shape, true, context);
                connector.targetDecorator = VisioDecoratorModel.fromJs(shape, false, context);

                // Extract connection information from context
                connector.sourceId = getConnectorSourceId(connector.id, context);
                connector.targetId = getConnectorTargetId(connector.id, context);
                connector.sourcePortId = getConnectorSourcePortId(connector.id, context);
                connector.targetPortId = getConnectorTargetPortId(connector.id, context);

                // Extract additional properties
                connector.tooltip = getTooltip(cellMap);
                getConstraints(connector, VisioConnectorUtils.isArrayCell(shape));
                connector.allowDrop = !toBoolean(getCell('ShapeSplittable'));
                connector.lineRouting = getRouting(cellMap);
                connector.bridgeSpace = getBridgeSpace(context);
                connector.segments = VisioConnectorUtils.getConnectorSegments(shape, connector, context);
                connector.layerMember = getCell('LayerMember') !== undefined ? parseInt(getCell('LayerMember')!.toString(), 10) : 0;
                connector.ports = getVisioConnectorPorts(shape);
                connector.shape = getConnectorShape(attributes, shape, connector, context);

                // Add connector to layer if layer exists
                if (connector.layerMember !== undefined && connector.layerMember >= 0 &&
                    (context.data.currentPage && context.data.currentPage.layers && context.data.currentPage.layers.length > 0)) {
                    const page0: VisioPage = context.data.currentPage;
                    if (page0 && page0.layers && page0.layers[parseInt(connector.layerMember.toString(), 10)]) {
                        page0.layers[parseInt(connector.layerMember.toString(), 10)].objects.push(connector.id);
                    }
                }

                connectors.push(connector);
            }
        }
        return connectors;
    }
}

/**
 * Extracts connection ports from a Visio connector shape.
 * Ports define connection points on the connector where other shapes can connect.
 * @function getVisioConnectorPorts
 * @param {VisioShapeNode} shape - The Visio shape object containing Section data
 * @returns {VisioPort[]} Array of port objects with position and direction data
 */
function getVisioConnectorPorts(shape: VisioShapeNode): VisioPort[] {
    const ports: VisioPort[] = [];

    // Return empty if no sections exist
    if (!shape.Section) { return ports; }

    // Normalize section to always be an array
    const sections: VisioSection[] = Array.isArray(shape.Section)
        ? (shape.Section as VisioSection[])
        : [shape.Section as VisioSection];

    // Find the Connection section which contains port definitions
    const connSection: VisioSection | undefined = sections.find((s: VisioSection) => s.$ && s.$.N === 'Connection');
    if (!connSection || !connSection.Row) { return ports; }

    // Normalize rows to always be an array
    const rows: VisioRow[] = Array.isArray(connSection.Row)
        ? (connSection.Row as VisioRow[])
        : [connSection.Row as VisioRow];

    // Process each connection row
    rows.forEach((row: VisioRow) => {
        // Only process Connection type rows
        if (row.$ && row.$.T === 'Connection') {
            const id: string | undefined = row.$.IX;
            const cells: VisioCell[] = Array.isArray(row.Cell)
                ? (row.Cell as VisioCell[])
                : [row.Cell as VisioCell];

            // Initialize port object with default values
            const port: VisioPort = {
                id: `port${id}`,
                x: 0, y: 0,
                dirX: 0, dirY: 0,
                type: 0, autoGen: 0, prompt: ''
            };

            // Extract cell values into port properties
            cells.forEach((cell: VisioCell) => {
                const name: string = cell.$.N;
                const value: CellMapValue = cell.$.V;
                switch (name) {
                case 'X': port.x = parseFloat(value as string); break;
                case 'Y': port.y = parseFloat(value as string); break;
                case 'DirX': port.dirX = parseFloat(value as string); break;
                case 'DirY': port.dirY = parseFloat(value as string); break;
                case 'Type': port.type = parseInt(value as string, 10); break;
                case 'AutoGen': port.autoGen = parseInt(value as string, 10); break;
                case 'Prompt': port.prompt = value as string; break;
                }
            });
            ports.push(port);
        }
    });
    return ports;
}

/**
 * Determines if a ShapeRouteStyle value indicates a STRAIGHT algorithm.
 * @private
 * @param {string} srs - The ShapeRouteStyle value
 * @returns {boolean} True if the style routes as a straight line
 */
function isStraightRouting(srs: string): boolean {
    // 2 = Straight, 16 = Center-to-center (used to enforce straight routing)
    return srs === '2' || srs === '16'; // MS Learn ShapeRouteStyle table
}

/**
 * Determines if a ShapeRouteStyle value indicates a RIGHT-ANGLE algorithm.
 * @private
 * @param {string} srs - The ShapeRouteStyle value
 * @returns {boolean} True if the style routes orthogonally
 */
function isOrthogonalRouting(srs: string): boolean {
    // 1 = Right angle
    if (srs === '1') { return true; }
    const n: number = parseInt(srs, 10);
    // Org / Flowchart / Tree directional families (NS/WE, SN/EW)
    if ((n >= 3 && n <= 8) || (n >= 10 && n <= 15)) { return true; }
    // Simple directional variants
    if ((n >= 17 && n <= 20) || n === 21 || n === 22) { return true; }
    // 9 = Network -> defer to geometry-based decision later; do NOT mark orthogonal here
    if (n === 9) { return false; }
    // 0 gets resolved to page RouteStyle elsewhere
    return false;
}

/**
 * Determines the connector type (Straight, Orthogonal, or Bezier) based on routing settings.
 * @function getConnectorType
 * @param {any} shape - The Visio shape object containing Cell data
 * @param {any} connector - The connector object being created
 * @param {ParsingContext} context - Parsing context with page settings
 * @returns {ConnectorType} The determined connector type ('Straight', 'Orthogonal', or 'Bezier')
 */
function getConnectorType(shape: any, connector: any, context: ParsingContext): ConnectorType {
    const page: VisioPage = context.data.currentPage;
    const clr: string = connector.conLineRouteExt;
    const srs: string = connector.shapeRouteStyle;
    const pageLineRouteExt: string = page.lineRouteExt;
    const pageRouteStyle: string = page.routeStyle;
    //1004838 - bezier connectors are rendering as orthogonal connectors.
    let geometrySection: VisioSection;
    if (Array.isArray(shape.Section)) {
        for (const section of shape.Section as VisioSection[]) {
            if (section.$ && section.$.N === 'Geometry') {
                geometrySection = section;
                break;
            }
        }
    }
    else if (shape.Section && (shape.Section as VisioSection).$ && (shape.Section as VisioSection).$.N === 'Geometry') {
        geometrySection = shape.Section as VisioSection;
    }
    if (!geometrySection) {
        const masterShape: any = context.data.shapes.find((item: any) => {
            if (item.masterID === shape.$.Master) { return item; }
        });
        if (masterShape) {
            geometrySection = masterShape.Row && masterShape.Row[0];
        }
    }
    if (geometrySection) {
        for (let i: number = 0; i < (geometrySection.Row as VisioRow[]).length; i++) {
            const row: VisioRow = (geometrySection.Row as VisioRow[])[parseInt(i.toString(), 10)];
            const rowType: string | undefined = row && row.$ && row.$.T;
            if (rowType === 'ArcTo') {
                return 'Bezier';
            }
            if ((geometrySection.Row as VisioRow[]).length === 2 && rowType !== 'LineTo') {
                return 'Straight';
            }
        }
    }

    // ==================== STEP 1: Determine Curvature (Appearance) ====================
    /**
     * Curvature controls the visual appearance of the connector.
     * CURVED: Uses NURBS (bezier curves)
     * STRAIGHT: Uses straight lines (may still be routed orthogonally)
     */
    let curvature: 'STRAIGHT' | 'CURVED' = 'STRAIGHT';

    if (clr === '2') {
        curvature = 'CURVED';
    } else if (clr === '1') {
        curvature = 'STRAIGHT';
    } else { // clr === '0' (Default)
        curvature = (pageLineRouteExt === '2') ? 'CURVED' : 'STRAIGHT';
    }

    // ==================== STEP 2: Determine Routing Algorithm ====================
    /**
     * Routing algorithm controls HOW the connector is routed.
     * STRAIGHT: Direct line from source to target
     * RIGHT-ANGLE: Orthogonal segments (horizontal/vertical)
     */
    const effectiveSrs: string = (srs !== '0') ? srs : pageRouteStyle;

    let algorithm: 'STRAIGHT' | 'RIGHT-ANGLE' | 'NETWORK';
    if (isStraightRouting(effectiveSrs)) {
        algorithm = 'STRAIGHT';
    } else if (isOrthogonalRouting(effectiveSrs)) {
        algorithm = 'RIGHT-ANGLE';
    } else {
        // Only case expected here: 9 = Network
        algorithm = 'NETWORK';
    }

    // ==================== STEP 3: Combine Curvature + Algorithm ====================
    /**
     * Final connector type is determined by combining both properties:
     * If curvature = CURVED:
     *   Return 'Bezier' (NURBS curves override routing algorithm)
     * If curvature = STRAIGHT:
     *   - If algorithm = STRAIGHT: Return 'Straight'
     *   - If algorithm = RIGHT-ANGLE: Return 'Orthogonal'
     */
    if (curvature === 'CURVED') {
        return 'Bezier';
    }

    if (algorithm === 'STRAIGHT') {
        return 'Straight';
    }
    if (algorithm === 'RIGHT-ANGLE') {
        return 'Orthogonal';
    }

    // NETWORK: decide by geometry if available; otherwise default to Orthogonal
    // (Network can yield multi-segment non-orthogonal polylines; EJ2 has no 'polyline' type)
    // const pointCount: number = (geometryData && geometryData.points) ? geometryData.points.length : 0;
    //if (pointCount <= 2) {
    //    return 'Straight';
    //}
    return 'Orthogonal';
}

/**
 * Determines the connector shape type based on master name and keywords.
 * Identifies special connector types like BPMN flow shapes and UML connectors.
 * @function getConnectorShape
 * @param {Attributes} attributes - Shape attributes containing the name
 * @param {VisioShapeNode} shapes - The connector shape object
 * @param {VisioConnector} Node - Optional node/connector reference for shape lookup
 * @param {ParsingContext} context - Parsing context with master data
 * @returns {any} The connector shape definition, or undefined if standard connector
 */
export function getConnectorShape(attributes: Attributes, shapes: VisioShapeNode,
                                  Node?: VisioConnector, context?: ParsingContext): any {
    // Define special connector shape types
    const bpmnFlowShapes: ReadonlySet<string> = new Set<string>(['MessageFlow', 'SequenceFlow', 'Association']);
    const umlConnectors: ReadonlySet<string> = new Set<string>(['Inheritance', 'Association',
        'Dependency', 'Aggregation', 'Composition',
        'DirectedAssociation', 'InterfaceRealization']);

    const name: string | undefined = attributes.Name;
    let finalShape: string;

    if (name !== undefined) {
        // Normalize shape name by removing hyphens, spaces, and dots
        let trimmedName: string = name.replace(/[-\s](.)/g, (match: any, letter: string) => letter.toUpperCase())
            .replace(/[-\s]/g, '');
        trimmedName = trimmedName.replace(/\.\d+$/, '').trim();
        finalShape = trimmedName;

        // Handle Association shape specially by checking keywords
        if (finalShape === 'Association') {
            const keywordsRaw: string = getShapeKeywordsFromMaster(shapes, context!);
            const kw: string = (keywordsRaw || '').toLowerCase();
            const hasUml: boolean = kw.includes('uml');
            if (hasUml) {
                const shape: UMLConnectorResult = getUMLConnectors(shapes, finalShape, Node);
                return shape as ConnectorShapePayload;
            }
        }

        // Check if shape is a known BPMN or UML connector
        if (bpmnFlowShapes.has(finalShape)) {
            const shape: BPMNFlowShapeResult = getBPMNFlowShapes(shapes, finalShape, Node);
            return shape as ConnectorShapePayload;
        }
        else if (umlConnectors.has(finalShape)) {
            const shape: UMLConnectorResult = getUMLConnectors(shapes, finalShape, Node);
            return shape as ConnectorShapePayload;
        }
        return undefined;
    }
}

/**
 * Represents styling properties for a Visio connector line.
 * Contains fill, stroke, opacity, and dash pattern information.
 */
export class VisioStyleModel {
    /** Fill color of the connector */
    fill?: string;
    /** Stroke/line color of the connector */
    strokeColor?: string;
    /** Dash array pattern for the stroke */
    strokeDashArray?: string;
    /** Width of the stroke line */
    strokeWidth?: number;
    /** Opacity/transparency level (0-1) */
    opacity: number = 0;

    /**
     * Creates a VisioStyleModel instance from a Visio connector shape.
     * Extracts line styling properties from shape cells.
     * @static
     * @param {VisioShapeNode} shape - The Visio connector shape object
     * @returns {VisioStyleModel} A new VisioStyleModel with extracted style properties
     */
    static fromShape(shape: VisioShapeNode): VisioStyleModel {
        const style: VisioStyleModel = new VisioStyleModel();

        /**
         * Helper function to get cell value by name
         * @param {string} name - The name of the cell to find
         * @returns {string | undefined} The cell value
         */
        const getCell: (name: string) => string | undefined = (name: string) => {
            const cell: VisioCell = Array.isArray(shape.Cell)
                ? (shape.Cell as VisioCell[]).find((c: VisioCell) => c.$.N === name)
                : ((shape.Cell as VisioCell).$.N === name ? (shape.Cell as VisioCell) : undefined);
            return cell ? (cell.$.V as string) : undefined;
        };

        // Extract fill color
        style.fill = getCell('FillForegnd') || 'transparent';

        // Extract line color
        style.strokeColor = getCell('LineColor') || undefined;

        // Extract opacity/transparency
        if (getCell('LineColorTrans')) {
            style.opacity = Number(getCell('LineColorTrans'));
        }

        // Extract and convert dash pattern
        const linePattern: string = getCell('LinePattern') || '0';
        style.strokeWidth = getCell('LineWeight') != null ? Number(getCell('LineWeight')) : 0;
        style.strokeDashArray = VisioStyleModel.convertDashPattern(linePattern);

        return style;
    }

    /**
     * Converts Visio dash pattern codes to Syncfusion strokeDashArray format.
     * @static
     * @param {string} patternCode - The Visio line pattern code
     * @returns {string} The Syncfusion dash array string
     */
    static convertDashPattern(patternCode: string): string {
        return LINE_PATTERN_MAP[String(patternCode)] || '';
    }
}

/**
 * Represents styling properties for connector decorators (arrow heads).
 * Contains fill, stroke, gradient, and other decorator-specific styling.
 */
export class VisioDecoratorStyleModel {
    /** Fill color of the decorator */
    fill?: string;
    /** Opacity/transparency level (0-1) */
    opacity?: number = 0;
    /** Stroke color of the decorator */
    strokeColor?: string;
    /** Gradient fill color (alternative to solid fill) */
    gradient?: string;
    /** Width of the stroke line */
    strokeWidth: number;
    /** Flag indicating if gradient is enabled */
    isgradientEnabled: boolean;
    /** Type of gradient (Linear or Radial) */
    gradientType: 'Linear' | 'Radial';
    /** Gradient coordinates/parameters */
    gradientcoOrdinates: GradientVector | RadialGradientConfig;
    /** Array of gradient stop colors */
    gradientStops: GradientStop[];
    /** Angle of the gradient in degrees */
    gradientAngle: number;

    /**
     * Creates a VisioDecoratorStyleModel instance from a Visio shape.
     * Extracts decorator styling including gradients if applicable.
     * @static
     * @param {VisioShapeNode} shape - The Visio shape object containing decorator style data
     * @param {ParsingContext} context - Parsing context for warnings
     * @returns {VisioDecoratorStyleModel} A new VisioDecoratorStyleModel with extracted styles
     */
    static fromShapeJs(shape: VisioShapeNode, context: ParsingContext): VisioDecoratorStyleModel {
        const style: VisioDecoratorStyleModel = new VisioDecoratorStyleModel();
        const section: VisioSection[] = shape.Section ? (Array.isArray(shape.Section)
            ? (shape.Section as VisioSection[]) : [shape.Section as VisioSection]) : [];

        /**
         * Helper function to get cell value by name
         * @param {string} name - The name of the cell to find
         * @returns {string | undefined} The cell value
         */
        const getCell: (name: string) => string | undefined = (name: string) => {
            const cells: VisioCell[] = VisioConnectorUtils.isArrayCell(shape);
            const cell: VisioCell = cells.find((c: VisioCell) => c.$.N === name);
            return cell ? (cell.$.V as string) : undefined;
        };

        // Extract basic styling properties
        if (shape && shape.Cell) {
            // Extract opacity
            if (getCell('LineColorTrans')) {
                style.opacity = Number(getCell('LineColorTrans'));
            }

            // Extract color (used for both fill and stroke)
            if (getCell('LineColor')) {
                style.fill = getCell('LineColor');
                style.strokeColor = getCell('LineColor');
            }

            // Extract stroke width
            style.strokeWidth = getCell('LineWeight') != null ? Number(getCell('LineWeight')) : 0;

            // Extract gradient angle in radians
            style.gradientAngle = getCell('LineGradientAngle') != null ? Number(getCell('LineGradientAngle')) : 0;

            // Check if gradient is enabled
            style.isgradientEnabled = getCell('LineGradientEnabled') != null && getCell('LineGradientEnabled') !== '0';

            // Process gradient if enabled
            if (style.isgradientEnabled) {
                context.addWarning('[WARNING] :: Syncfusion supports gradients for connector decorators only, whereas Visio applies gradients across the entire connector, leading to visual differences.');

                // Convert angle from radians to degrees
                const angleRad: number = Number(getCell('LineGradientAngle'));
                const angleDeg: number = angleRad * (180 / Math.PI);

                // Determine gradient type from gradient direction cell
                const gradientDir: string = getCell('LineGradientDir')!;
                style.gradientType = gradientDir === '0' ? 'Linear' : 'Radial';

                // Get gradient background color
                style.gradient = getCell('FillBkgnd') != null ? getCell('FillBkgnd') : '#1b2811';

                // Set gradient coordinates based on type
                if (style.gradientType === 'Linear') {
                    style.gradientcoOrdinates = getGradientVectorByAngle(angleDeg);
                }
                else {
                    style.gradientcoOrdinates = getRadialGradient(gradientDir);
                }

                // Extract gradient stops
                const fillGradientSection: VisioSection | undefined = section.find((sec: VisioSection) => {
                    return sec && sec.$ && sec.$.N === 'LineGradient';
                });
                style.gradientStops = extractGradientStops(fillGradientSection) as GradientStop[];
            }
        }
        return style;
    }
}

/**
 * Represents a decorator (arrow head or end marker) for a connector.
 * Defines shape, size, and styling of source or target decorators.
 */
export class VisioDecoratorModel {
    /** Height of the decorator in pixels */
    height?: number;
    /** Width of the decorator in pixels */
    width?: number;
    /** Shape type of the decorator (Arrow, Diamond, etc.) */
    shape?: DecoratorShapes;
    /** Styling properties of the decorator */
    style?: VisioDecoratorStyleModel;
    /** QuickStyle line color index */
    QuickStyleLineColor?: number;
    /** QuickStyle line matrix index */
    QuickStyleLineMatrix?: number;
    /** Flag indicating this is a connector decorator */
    IsConnector?: boolean;

    /**
     * Creates a VisioDecoratorModel instance from a Visio connector shape.
     * Extracts arrow/decorator properties for either source or target end.
     * @static
     * @param {VisioShapeNode} shape - The Visio connector shape object
     * @param {boolean} isSource - True for source end decorator, false for target end
     * @param {ParsingContext} context - Parsing context for warnings and master data
     * @returns {VisioDecoratorModel} A new VisioDecoratorModel with extracted decorator properties
     */
    static fromJs(shape: VisioShapeNode, isSource: boolean, context: ParsingContext): VisioDecoratorModel {
        const decorator: VisioDecoratorModel = new VisioDecoratorModel();

        /**
         * Helper function to get cell value by name
         * @param {string} name - The name of the cell to find
         * @returns {string | undefined} The cell value
         */
        const getCell: (name: string) => string | undefined = (name: string) => {
            const cells: VisioCell[] = VisioConnectorUtils.isArrayCell(shape);
            const cell: VisioCell = cells.find((c: VisioCell) => c.$.N === name);
            return cell ? (cell.$.V as string) : undefined;
        };

        // Extract arrow properties based on source or target end
        const beginArrowSize: string = isSource ? getCell('BeginArrowSize')! : getCell('EndArrowSize')!;
        const beginArrow: string = isSource ? getCell('BeginArrow')! : getCell('EndArrow')!;

        // Convert arrow code to type (0 for no arrow, 4 for default arrow)
        const arrowType: number = beginArrow !== undefined ? Number(beginArrow) : 0;
        const arrowSize: string = beginArrowSize || '2';

        // Get decorator shape name and dimensions
        const arrowShape: string = getDecoratorShape(arrowType);
        const dimensions: { width: number; height: number } = getDecoratorDimensions(arrowSize, arrowShape);

        // Set decorator properties
        decorator.shape = arrowShape as DecoratorShapes;
        decorator.IsConnector = true;
        decorator.width = dimensions.width;
        decorator.height = dimensions.height;
        decorator.QuickStyleLineColor = getCell('QuickStyleLineColor') !== undefined ? Number(getCell('QuickStyleLineColor')) : undefined;
        decorator.QuickStyleLineMatrix = getCell('QuickStyleLineMatrix') !== undefined ?
            Number(getCell('QuickStyleLineMatrix')) : undefined;

        // Extract decorator styling
        decorator.style = VisioDecoratorStyleModel.fromShapeJs(shape, context);

        // Special handling for diamond shape (transparent by default in Visio)
        if (decorator.shape === 'Diamond') {
            decorator.style!.fill = 'Transparent';
        }

        return decorator;
    }
}

/**
 * Represents connection data between shapes and connectors.
 * Stores source/target relationships and port associations.
 */
export class VisioConnections {
    /** ID of the connector shape */
    connectorId?: string;
    /** ID of the source shape */
    sourceId?: string;
    /** ID of the target shape */
    targetId?: string;
    /** ID of the port on the source shape */
    sourcePortId?: string;
    /** ID of the port on the target shape */
    targetPortId?: string;

    /**
     * Creates VisioConnections instances from Visio Connect data.
     * Parses connector-to-shape connections from the XML Connect elements.
     * @static
     * @param {ConnectsElement} obj - The Visio document object containing Connect elements
     * @param {ParsingContext} context - Parsing context (unused but maintained for interface compatibility)
     * @returns {VisioConnections[]} Array of connection objects
     */
    static fromJs(obj: ConnectsElement | ParsedXmlObject, context: ParsingContext): VisioConnections[] {
        const connections: VisioConnections[] = [];
        const connectorMap: { [key: string]: VisioConnections } = {};

        // Normalize connects to always be an array
        const connects: VisioConnectElement[] = Array.isArray(obj.Connect) ?
            (obj.Connect as VisioConnectElement[]) : [obj.Connect as VisioConnectElement];

        // Process each connection element
        for (const connect of connects) {
            const connectorId: string = connect.$.FromSheet;

            // Initialize connector connection if not exists
            if (!connectorMap[`${connectorId}`]) {
                connectorMap[`${connectorId}`] = new VisioConnections();
                connectorMap[`${connectorId}`].connectorId = connectorId;
            }

            const connection: VisioConnections = connectorMap[`${connectorId}`];
            const input: string = connect.$.ToCell;

            // Extract port index from cell reference (e.g., "Connections.3" -> port2)
            const match: number = Number(input.match(/\d+/)) - 1;

            // Determine if connection is source (BeginX) or target (EndX)
            if (connect.$.FromCell === 'BeginX') {
                // This is the source (beginning) of the connector
                connection.sourceId = connect.$.ToSheet;
                if (match !== -1) {
                    connection.sourcePortId = connect.$.ToCell ? `port${match}` : undefined;
                }
            } else if (connect.$.FromCell === 'EndX') {
                // This is the target (end) of the connector
                connection.targetId = connect.$.ToSheet;
                if (match !== -1) {
                    connection.targetPortId = connect.$.ToCell ? `port${match}` : undefined;
                }
            }
        }

        // Convert map to array of connections
        return Object.keys(connectorMap).map((key: string) => connectorMap[`${key}`]);
    }
}

/**
 * Utility class for processing Visio connector geometry and segments.
 * Handles extraction of connector paths, bezier curves, and segment calculations.
 *
 * @private
 */
class VisioConnectorUtils {
    /** Tolerance for floating-point comparisons */
    private static readonly TOLERANCE: number = 0.001;
    /** Number of reduction points for simplification */
    private static readonly REDUCTION_POINTS: number = 20;
    /** Pixel scale factor for coordinate conversion (1 inch = 96 pixels) */
    private static readonly SCALE_FACTOR: number = 96;

    /**
     * Compares two numbers with a tolerance value.
     * Used for floating-point equality checks.
     * @private
     * @param {number} a - First number to compare
     * @param {number} b - Second number to compare
     * @param {number} tolerance - Tolerance value for comparison (default: 0.001)
     * @returns {boolean} True if numbers are approximately equal within tolerance
     */
    private static approxEqual(a: number, b: number, tolerance: number = this.TOLERANCE): boolean {
        return Math.abs(a - b) < tolerance;
    }

    /**
     * Extracts a cell value from an array of cells by name.
     * @private
     * @param {VisioCell[]} arr - Array of cell objects
     * @param {string} name - Name of the cell to find
     * @returns {string | undefined} The cell value, or undefined if not found
     */
    private static getCell(arr: VisioCell[], name: string): string | undefined {
        const cell: VisioCell = arr && arr.find((c: VisioCell) => c.$.N === name);
        return cell ? (cell.$.V as string) : undefined;
    }

    /**
     * Extracts a cell value from either a single cell or array of cells.
     * @private
     * @param {OneOrMany<VisioCell>} cell - A single cell object or array of cell objects
     * @param {string} name - Name of the cell to find
     * @returns {string | undefined} The cell value, or undefined if not found
     */
    private static getCellValue(cell: OneOrMany<VisioCell>, name: string): string | undefined {
        if (Array.isArray(cell)) {
            const match: VisioCell = cell.find((c: VisioCell) => c && c.$ && c.$.N === name);
            return match && match.$ && (match.$.V as string);
        }
        if (cell && (cell as VisioCell).$ && (cell as VisioCell).$.N === name) {
            return (cell as VisioCell).$.V as string;
        }
        return undefined;
    }

    /**
     * Finds and returns the Geometry section from a shape.
     * @private
     * @param {VisioShapeNode} shape - The Visio shape object
     * @returns {VisioSection | null} The Geometry section, or null if not found
     */
    private static getGeometrySection(shape: VisioShapeNode): VisioSection | null {
        return Array.isArray(shape.Section)
            ? (shape.Section as VisioSection[]).find((s: VisioSection) => s.$.N === 'Geometry')
            : (shape.Section && (shape.Section as VisioSection).$.N === 'Geometry' ? (shape.Section as VisioSection) : null);
    }

    /**
     * Filters geometry rows to exclude deleted rows and arc-to entries.
     * @private
     * @param {VisioSection | null} geometrySection - The Geometry section object
     * @returns {VisioRow[]} Array of active geometry rows
     */
    private static getActiveRows(geometrySection: VisioSection | null): VisioRow[] {
        if (!geometrySection || !geometrySection.Row) { return []; }

        // Normalize rows to always be an array
        const geometryRows: VisioRow[] = Array.isArray(geometrySection.Row)
            ? (geometrySection.Row as VisioRow[])
            : [geometrySection.Row as VisioRow];

        // Filter out deleted rows (Del='1') and ArcTo rows (line jumps)
        return geometryRows.filter((row: VisioRow) => {
            return !(row.$ && row.$.Del === '1') && row.$.T !== 'ArcTo';
        });
    }

    /**
     * Converts Visio Y-coordinate to Syncfusion Y-coordinate (inverts Y-axis).
     * Visio Y increases upward; Syncfusion Y increases downward.
     * @private
     * @param {number} visioY - The Y-coordinate in Visio coordinate system
     * @param {ParsingContext} context - Parsing context with page height information
     * @returns {number} The converted Y-coordinate in Syncfusion system
     */
    private static convertVisioY(visioY: number, context: ParsingContext): number {
        const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);
        return pageHeight - (visioY * this.SCALE_FACTOR);
    }
    /**
     * isArrayCell Method is used to check the shape cell is array or not
     * @static
     * @param {VisioShapeNode} shape - To check the shape cell is array or not
     * @returns {VisioCell[]} Return the cell array
     */
    static isArrayCell(shape: VisioShapeNode): VisioCell[] {
        const Cell: VisioCell[] = (Array.isArray(shape.Cell) ? shape.Cell : [shape.Cell]) as VisioCell[];
        return Cell;
    }

    /**
     * Extracts and converts the Begin coordinates of a connector.
     * @private
     * @param {VisioShapeNode} shape - The Visio connector shape
     * @param {ParsingContext} context - Parsing context for coordinate conversion
     * @returns {PointWithType} The converted begin coordinates
     */
    private static getBeginCoordinates(shape: VisioShapeNode, context: ParsingContext): PointWithType {
        const cells: VisioCell[] = this.isArrayCell(shape);
        const beginXCell: string = this.getCell(cells, 'BeginX') as string;
        const beginYCell: string = this.getCell(cells, 'BeginY') as string;

        return {
            x: beginXCell ? Number(beginXCell) * this.SCALE_FACTOR : 0,
            y: beginYCell ? this.convertVisioY(Number(beginYCell), context) : 0
        };
    }

    /**
     * Processes a LineTo geometry row into absolute coordinates.
     * Converts relative Visio coordinates to absolute page coordinates.
     * @private
     * @param {VisioRow} row - The LineTo geometry row
     * @param {VisioShapeNode} shape - The Visio connector shape
     * @param {PointWithType} lastPoint - The previous point (for reference)
     * @param {ParsingContext} context - Parsing context for coordinate conversion
     * @returns {PointWithType} The converted point coordinates
     */
    private static processLineToRow(row: VisioRow, shape: VisioShapeNode,
                                    lastPoint: PointWithType, context: ParsingContext): PointWithType {
        // Extract X and Y values from cell array
        let lx: string | undefined;
        let ly: string | undefined;
        if (Array.isArray(row.Cell)) {
            lx = this.getCellValue(row.Cell as VisioCell[], 'X');
            ly = this.getCellValue(row.Cell as VisioCell[], 'Y');
        } else {
            lx = this.getCellValue([row.Cell as VisioCell], 'X');
            ly = this.getCellValue([row.Cell as VisioCell], 'Y');
        }

        // Get the original begin coordinates in Visio coordinate system
        const originalCells: VisioCell[] = this.isArrayCell(shape);
        const originalBeginX: string = this.getCell(originalCells, 'BeginX') as string;
        const originalBeginY: string = this.getCell(originalCells, 'BeginY') as string;
        const beginXInches: number = originalBeginX ? Number(originalBeginX) : 0;
        const beginYInches: number = originalBeginY ? Number(originalBeginY) : 0;

        // Calculate absolute coordinates in Visio coordinate system
        // LineTo coordinates are relative to the BeginX/BeginY
        const absoluteVisioX: number = beginXInches + (lx !== undefined ? Number(lx) : 0);
        const absoluteVisioY: number = beginYInches + (ly !== undefined ? Number(ly) : 0);

        // Convert to Syncfusion coordinates with proper Y-axis inversion
        return {
            x: absoluteVisioX * this.SCALE_FACTOR,
            y: this.convertVisioY(absoluteVisioY, context)
        };
    }

    /**
     * Extracts all geometry data from a connector shape.
     * Parses MoveTo and LineTo rows to build the connector path.
     * @private
     * @param {VisioShapeNode} shape - The Visio connector shape
     * @param {ParsingContext} context - Parsing context for coordinate conversion
     * @returns {GeometryData} Object containing points and segment type information
     */
    private static extractGeometryData(shape: VisioShapeNode, context: ParsingContext): GeometryData {
        const geometrySection: VisioSection | null = this.getGeometrySection(shape);
        const beginPoint: PointWithType = this.getBeginCoordinates(shape, context);

        // Return simple begin point if no geometry section
        if (!geometrySection) {
            return {
                points: [beginPoint],
                hasOrthogonalSegment: false,
                hasDiagonalSegment: false
            };
        }

        const activeRows: VisioRow[] = this.getActiveRows(geometrySection);
        const points: PointWithType[] = [];
        let lastPoint: PointWithType = { ...beginPoint };

        // Handle MoveTo row if present (defines alternate starting point)
        const hasMoveTo: boolean = activeRows.length > 0 && activeRows[0].$.T === 'MoveTo';
        if (hasMoveTo) {
            const mx: number = Number(this.getCellValue(activeRows[0].Cell as OneOrMany<VisioCell>, 'X') || 0);
            const my: number = Number(this.getCellValue(activeRows[0].Cell as OneOrMany<VisioCell>, 'Y') || 0);

            // Get original begin coordinates for calculation
            const originalCells: VisioCell[] = this.isArrayCell(shape);
            const originalBeginX: string = this.getCell(originalCells, 'BeginX') as string;
            const originalBeginY: string = this.getCell(originalCells, 'BeginY') as string;
            const beginXInches: number = originalBeginX ? Number(originalBeginX) : 0;
            const beginYInches: number = originalBeginY ? Number(originalBeginY) : 0;

            // Calculate absolute MoveTo coordinates
            const absoluteX: number = beginXInches + mx;
            const absoluteY: number = beginYInches + my;

            lastPoint = {
                x: absoluteX * this.SCALE_FACTOR,
                y: this.convertVisioY(absoluteY, context),
                type: 'MoveTo'
            };
        }

        points.push({ ...lastPoint });

        // Process LineTo rows
        for (let i: number = (hasMoveTo ? 1 : 0); i < activeRows.length; i++) {
            const row: VisioRow = activeRows[parseInt(i.toString(), 10)];
            if (row.$.T === 'LineTo') {
                const coords: PointWithType = this.processLineToRow(row, shape, lastPoint, context);
                lastPoint = coords;
                points.push({ ...coords, type: 'LineTo' });
            }
        }

        // Analyze segments to determine if orthogonal or diagonal
        let hasOrthogonalSegment: boolean = false;
        let hasDiagonalSegment: boolean = false;

        for (let i: number = 0; i < points.length - 1; i++) {
            const p1: PointWithType = points[parseInt(i.toString(), 10)];
            const p2: PointWithType = points[parseInt(i.toString(), 10) + 1];

            // Check if segment is axis-aligned (orthogonal)
            if (this.approxEqual(p1.x, p2.x) || this.approxEqual(p1.y, p2.y)) {
                hasOrthogonalSegment = true;
            } else {
                hasDiagonalSegment = true;
            }
        }

        return { points, hasOrthogonalSegment, hasDiagonalSegment };
    }

    /**
     * Extracts connector segments based on connector type.
     * Builds appropriate segment models for Orthogonal, Straight, or Bezier connectors.
     * @static
     * @param {VisioShapeNode} shape - The Visio connector shape
     * @param {VisioConnector} connector - The connector object being processed
     * @param {ParsingContext} context - Parsing context for coordinate conversion
     * @returns {DiagramConnectorSegmentModel[]} Array of connector segment models
     */
    static getConnectorSegments(shape: VisioShapeNode,
                                connector: VisioConnector, context: ParsingContext): DiagramConnectorSegmentModel[] {
        const geometryData: GeometryData = this.extractGeometryData(shape, context);

        // Return empty if insufficient points
        if ((connector.type === 'Orthogonal' || connector.type === 'Straight') && (geometryData.points.length < 2)) { return []; }

        // Build segments based on connector type
        switch (connector.type) {
        case 'Orthogonal':
            return this.buildOrthogonalSegments(geometryData, connector);
        case 'Straight':
            return this.buildStraightSegments(geometryData, connector);
        case 'Bezier':
            return this.getBezierSegments(shape, context);
        }
    }

    /**
     * Builds orthogonal connector segments from geometry points.
     * Creates segments with direction and length properties.
     * @private
     * @param {GeometryData} geometryData - The extracted geometry data with points
     * @param {VisioConnector} connector - The connector object
     * @returns {DiagramConnectorSegmentModel[]} Array of orthogonal segments
     */
    private static buildOrthogonalSegments(geometryData: GeometryData, connector: VisioConnector): DiagramConnectorSegmentModel[] {
        const segments: DiagramConnectorSegmentModel[] = [];
        const loopLimit: number = geometryData.points.length - 1;

        // Process all point pairs
        for (let i: number = 0; i < loopLimit; i++) {
            const p1: PointWithType = geometryData.points[parseInt(i.toString(), 10)];
            const p2: PointWithType = geometryData.points[parseInt(i.toString(), 10) + 1];
            const isLastSegment: boolean = (i === loopLimit - 1);

            // Check if segment is vertical or horizontal
            if (this.approxEqual(p1.x, p2.x)) {
                // Vertical orthogonal segment
                this.addOrthogonalSegment(segments, p1, p2, isLastSegment, 'vertical');
            } else if (this.approxEqual(p1.y, p2.y)) {
                // Horizontal orthogonal segment
                this.addOrthogonalSegment(segments, p1, p2, isLastSegment, 'horizontal');
            }
        }

        return segments;
    }

    /**
     * Builds straight connector segments from geometry points.
     * Creates segments with target point properties.
     * @private
     * @param {GeometryData} geometryData - The extracted geometry data with points
     * @param {VisioConnector} connector - The connector object
     * @returns {DiagramConnectorSegmentModel[]} Array of straight segments
     */
    private static buildStraightSegments(geometryData: GeometryData, connector: VisioConnector): DiagramConnectorSegmentModel[] {
        const segments: DiagramConnectorSegmentModel[] = [];
        const loopLimit: number = geometryData.points.length - 2;

        // Process all but the last point pair
        for (let i: number = 0; i < loopLimit; i++) {
            const p1: PointWithType = geometryData.points[parseInt(i.toString(), 10)];
            const p2: PointWithType = geometryData.points[parseInt(i.toString(), 10) + 1];
            this.addStraightSegment(segments, p1, p2, false);
        }

        return segments;
    }

    /**
     * Adds an orthogonal segment to the segments array.
     * Calculates length and direction based on segment orientation.
     * @private
     * @param {DiagramConnectorSegmentModel[]} segments - Array to add segment to
     * @param {PointWithType} p1 - Start point of segment
     * @param {PointWithType} p2 - End point of segment
     * @param {boolean} isLastSegment - Whether this is the last segment
     * @param {'vertical' | 'horizontal'} orientation - Segment orientation
     * @returns {void}
     */
    private static addOrthogonalSegment(
        segments: DiagramConnectorSegmentModel[],
        p1: PointWithType,
        p2: PointWithType,
        isLastSegment: boolean,
        orientation: 'vertical' | 'horizontal'
    ): void {
        let length: number;
        let direction: Direction;

        if (orientation === 'vertical') {
            // Calculate vertical distance and direction
            length = formatCoordinate(Math.abs(p2.y - p1.y));
            direction = p2.y > p1.y ? 'Bottom' : 'Top';
        } else {
            // Calculate horizontal distance and direction
            length = formatCoordinate(Math.abs(p2.x - p1.x));
            direction = p2.x > p1.x ? 'Right' : 'Left';
        }

        // Last segment has zero length and no direction
        if (isLastSegment) {
            // Need to fix in source further
            length = 1;
        }

        segments.push({
            type: 'Orthogonal',
            direction,
            length
        } as DiagramConnectorSegmentModel);
    }

    /**
     * Adds a straight segment to the segments array.
     * Stores the target point for the segment.
     * @private
     * @param {DiagramConnectorSegmentModel[]} segments - Array to add segment to
     * @param {PointWithType} p1 - Start point of segment
     * @param {PointWithType} p2 - End point of segment
     * @param {boolean} isLastSegment - Whether this is the last segment
     * @returns {void}
     */
    private static addStraightSegment(
        segments: DiagramConnectorSegmentModel[],
        p1: PointWithType,
        p2: PointWithType,
        isLastSegment: boolean
    ): void {
        const point: PointWithType = { x: p2.x, y: p2.y };
        segments.push({
            type: 'Straight',
            point: point as { x: number; y: number }
        } as DiagramConnectorSegmentModel);
    }

    /**
     * Extracts Bezier curve segments from a connector's NURBS geometry.
     * Converts NURBS curves to cubic Bezier segments.
     * @private
     * @param {VisioShapeNode} shape - The Visio connector shape
     * @param {ParsingContext} context - Parsing context for coordinate conversion
     * @returns {DiagramConnectorSegmentModel[]} Array of Bezier segments
     */
    private static getBezierSegments(shape: VisioShapeNode, context: ParsingContext): DiagramConnectorSegmentModel[] {
        const geometrySection: VisioSection | null = this.getGeometrySection(shape);
        const activeRows: VisioRow[] = this.getActiveRows(geometrySection);
        const beginPoint: PointWithType = this.getBeginCoordinates(shape, context);
        const extractedData: ExtractedNurbsData = {
            moveTo: { x: 0, y: 0 },
            nurbsTo: {} as { [key: string]: { F?: string, V: string } }
        };

        // Extract MoveTo and NURBSTo rows
        for (const row of activeRows) {
            const rowType: string | undefined = row.$.T;
            if (rowType === 'MoveTo') {
                // Extract starting point coordinates
                const xCell: VisioCell = (Array.isArray(row.Cell) ? (row.Cell as VisioCell[]) :
                    [row.Cell as VisioCell]).find((c: VisioCell) => c.$.N === 'X');
                const yCell: VisioCell = (Array.isArray(row.Cell) ? (row.Cell as VisioCell[]) :
                    [row.Cell as VisioCell]).find((c: VisioCell) => c.$.N === 'Y');
                extractedData.moveTo.x = parseFloat(xCell ? (xCell.$.V as string) : '0');
                extractedData.moveTo.y = parseFloat(yCell ? (yCell.$.V as string) : '0');

            } else if (rowType === 'NURBSTo') {
                // Extract NURBS curve data from cells
                for (const cell of (Array.isArray(row.Cell) ? (row.Cell as VisioCell[]) : [row.Cell as VisioCell])) {
                    const cellData: CellAttribute = cell.$;
                    extractedData.nurbsTo[cellData.N] = {
                        F: cellData.F,
                        V: cellData.V as string
                    };
                }
            }
        }

        // Get the NURBS endpoint and formula
        const nurbsCellData: { F?: string; V: string; } = extractedData.nurbsTo['E'];
        const nurbsValueString: string | undefined = (nurbsCellData && nurbsCellData.F);

        if (nurbsValueString) {
            // Extract NURBS dimensions
            const width: number = parseFloat((extractedData.nurbsTo['X'] ? extractedData.nurbsTo['X'].V : '1'));
            const height: number = parseFloat((extractedData.nurbsTo['Y'] ? extractedData.nurbsTo['Y'].V : '1'));
            const localEndPoint: PointWithType = { x: width, y: height };

            // Build weighted control points in local coordinates
            const localNurbs: {
                degree: number;
                points: WCP[];
                xType: number;
                yType: number;
            } = this.buildLocalWCPs(nurbsValueString, width, height, extractedData.moveTo, localEndPoint);

            if (localNurbs) {
                try {
                    // Step 1: Convert NURBS to local cubic Bezier segments
                    const localBeziers: {
                        p0: Vec2;
                        c1: Vec2;
                        c2: Vec2;
                        p1: Vec2;
                    }[] = this.extractCubicBeziers(localNurbs);

                    // Step 2: Convert local Beziers to page coordinates (handles scaling and Y-inversion)
                    const pageBeziers: {
                        p0: PointWithType;
                        c1: PointWithType;
                        c2: PointWithType;
                        p1: PointWithType;
                    }[] = this.toPageBeziers(localBeziers, beginPoint, 96);

                    // Step 3: Convert page coordinates to connector segment models
                    const segments: DiagramConnectorSegmentModel[] = this.beziersToSegments(pageBeziers);

                    // Ensure last point aligns perfectly with target shape
                    if (segments.length > 0) {
                        const lastSegment: any = segments[segments.length - 1] as DiagramConnectorSegmentModel &
                        { point?: { x: number; y: number } };
                        lastSegment.point = { x: 0, y: 0 };
                    }

                    return segments;

                } catch (e) {
                    // Return empty array if Bezier conversion fails
                    return [];
                }
            }
        }

        return [];
    }

    /**
     * Parses a NURBS formula string into its components.
     * Extracts degree, control points, knots, and weights.
     * @private
     * @param {string} formula - The NURBS formula string
     * @returns {NurbsParameters | null} Parsed NURBS parameters, or null if invalid
     */
    private static parseNurbsFormula(formula: string): NurbsParameters | null {
        const s: string = formula.trim().replace(/^=/, '');

        // Validate formula format
        if (!s.startsWith('NURBS(') || !s.endsWith(')')) { return null; }

        // Extract and parse numeric values
        const parts: number[] = s.slice(6, -1).split(',').map((v: string) => parseFloat(v.trim()));
        if (parts.length < 8) { return null; }

        // Extract NURBS parameters
        const knotLast: number = parts[0];
        const degree: number = parts[1];
        const xType: number = parts[2];
        const yType: number = parts[3];

        // Extract control points (4 values per point: x, y, knot, weight)
        const controlPoints: ControlPointSet[] = [];
        for (let i: number = 4; i + 3 < parts.length; i += 4) {
            controlPoints.push({
                x: parts[parseInt(i.toString(), 10)],
                y: parts[parseInt(i.toString(), 10) + 1],
                knot: parts[parseInt(i.toString(), 10) + 2],
                weight: parts[parseInt(i.toString(), 10) + 3]
            });
        }

        return { knotLast, degree, xType, yType, controlPoints };
    }

    /**
     * Builds weighted control points in local coordinate system.
     * Converts NURBS parameters to weighted control point format.
     * @private
     * @param {string} eFormula - The NURBS endpoint formula
     * @param {number} width - Local coordinate width
     * @param {number} height - Local coordinate height
     * @param {Vec2} moveTo - Starting point in local coordinates
     * @param {Vec2} localEnd - Ending point in local coordinates
     * @returns {object | null} Object with degree, points, xType, yType, or null if invalid
     */
    private static buildLocalWCPs(eFormula: string, width: number, height: number,
                                  moveTo: Vec2, localEnd: Vec2): { degree: number; points: WCP[]; xType: number; yType: number } | null {
        const p: NurbsParameters | null = this.parseNurbsFormula(eFormula);

        /**
         * Converts normalized coordinates to local coordinates.
         * @param {number} x - Normalized X coordinate
         * @param {number} y - Normalized Y coordinate
         * @returns {Vec2} Local coordinate point
         */
        const toLocal: (x: number, y: number) => Vec2 = (x: number, y: number): Vec2 => (
            {
                x: (p.xType === 0 ? x * width : x),
                y: (p.yType === 0 ? y * height : y)
            }
        );

        // Build weighted control points array
        const pts: WCP[] = [];
        pts.push({ x: moveTo.x, y: moveTo.y, w: 1 });

        for (const cp of p.controlPoints) {
            const v: Vec2 = toLocal(cp.x, cp.y);
            pts.push({ x: v.x, y: v.y, w: (cp.weight !== null && cp.weight !== undefined) ? cp.weight : 1 });
        }

        pts.push({ x: localEnd.x, y: localEnd.y, w: 1 });

        return { degree: p.degree, points: pts, xType: p.xType, yType: p.yType };
    }

    /**
     * Creates a clamped uniform knot vector for NURBS curve.
     * Used to ensure curve passes through endpoints.
     * @private
     * @param {number} nCP - Number of control points
     * @param {number} degree - Degree of the curve
     * @returns {number[]} Knot vector array
     */
    private static makeClampedUniformKnots(nCP: number, degree: number): number[] {
        const interior: number = Math.max(0, nCP - degree - 1);
        const U: number[] = [];

        // Add degree+1 knots with value 0
        for (let i: number = 0; i <= degree; i++) { U.push(0); }

        // Add interior knots (evenly spaced from 0 to 1)
        for (let i: number = 1; i <= interior; i++) { U.push(i / (interior + 1)); }

        // Add degree+1 knots with value 1
        for (let i: number = 0; i <= degree; i++) { U.push(1); }

        return U;
    }

    /**
     * Inserts a knot into a B-spline curve.
     * Uses the Böhm algorithm for knot insertion.
     * @private
     * @param {WCP[]} P - Control points array
     * @param {number[]} U - Knot vector
     * @param {number} p - Degree of the curve
     * @param {number} u - Knot value to insert
     * @returns {object} Object with updated points P and knot vector U
     */
    private static insertKnot(P: WCP[], U: number[], p: number, u: number): { P: WCP[]; U: number[] } {
        // Find the knot span containing u
        let k: number = p;
        for (let i: number = p; i < U.length - p - 1; i++) {
            if (u >= U[parseInt(i.toString(), 10)] && u < U[parseInt(i.toString(), 10) + 1]) { k = i; break; }
        }

        const n: number = P.length - 1;
        const Q: WCP[] = new Array(P.length + 1);
        const V: number[] = new Array(U.length + 1);

        // Copy knots before insertion point
        for (let i: number = 0; i <= k; i++) {
            V[parseInt(i.toString(), 10)] = U[parseInt(i.toString(), 10)];
            V[k + 1] = u;
        }

        // Copy knots after insertion point
        for (let i: number = k + 1; i < U.length; i++) {
            V[parseInt(i.toString(), 10) + 1] = U[parseInt(i.toString(), 10)];
        }

        // Copy unaffected control points
        for (let i: number = 0; i <= k - p; i++) {
            Q[parseInt(i.toString(), 10)] = { ...P[parseInt(i.toString(), 10)] };
        }

        for (let i: number = k; i <= n; i++) {
            Q[parseInt(i.toString(), 10) + 1] = { ...P[parseInt(i.toString(), 10)] };
        }

        // Compute new control points at insertion point
        for (let i: number = k - p + 1; i <= k; i++) {
            const indexI: number = i;
            const indexIPlusP: number = i + p;
            const indexIMinus1: number = i - 1;
            const denom: number = (U[parseInt(indexIPlusP.toString(), 10)] - U[parseInt(indexI.toString(), 10)]);
            const alpha: number = (u - U[parseInt(indexI.toString(), 10)]) / denom;

            Q[parseInt(indexI.toString(), 10)] = {
                x: alpha * P[parseInt(indexI.toString(), 10)].x + (1 - alpha) * P[parseInt(indexIMinus1.toString(), 10)].x,
                y: alpha * P[parseInt(indexI.toString(), 10)].y + (1 - alpha) * P[parseInt(indexIMinus1.toString(), 10)].y,
                w: alpha * P[parseInt(indexI.toString(), 10)].w + (1 - alpha) * P[parseInt(indexIMinus1.toString(), 10)].w
            };
        }

        return { P: Q, U: V };
    }

    /**
     * Elevates knot multiplicity to match curve degree.
     * Ensures each knot has proper multiplicity for subdivision.
     * @private
     * @param {WCP[]} P - Control points array
     * @param {number[]} U - Knot vector
     * @param {number} p - Degree of the curve
     * @param {number} u - Knot value to elevate
     * @returns {object} Object with updated points P and knot vector U
     */
    private static elevateMultiplicityToDegree(P: WCP[], U: number[], p: number, u: number): { P: WCP[]; U: number[] } {
        // Count current multiplicity
        let mult: number = 0;
        for (let i: number = 0; i < U.length; i++) {
            if (Math.abs(U[parseInt(i.toString(), 10)] - u) < 1e-12) {
                mult++;
            }
        }

        // Insert knot until multiplicity equals degree
        while (mult < p) {
            const r: { P: WCP[]; U: number[]; } = this.insertKnot(P, U, p, u);
            P = r.P; U = r.U; mult++;
        }

        return { P, U };
    }

    /**
     * Extracts cubic Bezier segments from a B-spline curve.
     * Subdivides NURBS curve into cubic Bezier curves.
     * @private
     * @param {{degree: number, points: WCP[]}} local - Local NURBS with control points
     * @returns {array} Array of cubic Bezier segment objects
     */
    private static extractCubicBeziers(local: { degree: number; points: WCP[]; }): { p0: Vec2; c1: Vec2; c2: Vec2; p1: Vec2; }[] {
        const p: number = local.degree;

        // Can only extract cubic Beziers from degree 3 NURBS
        if (p !== 3) {
            return [];
        }

        // Create clamped uniform knot vector
        let U: number[] = this.makeClampedUniformKnots(local.points.length, p);
        let P: WCP[] = local.points.map((q: WCP) => ({ ...q }));

        // Get all interior knots
        const interiorKnots: number[] = U.slice(p + 1, U.length - p - 1);
        const uniqueInteriorKnots: number[] = interiorKnots.filter((v: number, i: number, a: number[]) => a.indexOf(v) === i);

        // Elevate multiplicity of all interior knots to degree
        for (const u of uniqueInteriorKnots) {
            const r: { P: WCP[]; U: number[]; } = this.elevateMultiplicityToDegree(P, U, p, u);
            P = r.P;
            U = r.U;
        }

        // Extract cubic Bezier segments
        const segs: { p0: Vec2; c1: Vec2; c2: Vec2; p1: Vec2; }[] = [];
        for (let i: number = 0; i + p < P.length; i += p) {
            if (i + 3 >= P.length) { continue; }

            // Get 4 control points for cubic Bezier
            const B0: WCP = P[parseInt(i.toString(), 10)];
            const B1: WCP = P[parseInt(i.toString(), 10) + 1];
            const B2: WCP = P[parseInt(i.toString(), 10) + 2];
            const B3: WCP = P[parseInt(i.toString(), 10) + 3];

            /**
             * Converts weighted control point to 2D Cartesian coordinates.
             * @param {WCP} q - Weighted control point
             * @returns {Vec2} 2D point
             */
            const toXY: (q: WCP) => Vec2 = (q: WCP): Vec2 => (
                {
                    x: q.x / ((q.w !== 0 && q.w)),
                    y: q.y / ((q.w !== 0 && q.w))
                }
            );

            segs.push({ p0: toXY(B0), c1: toXY(B1), c2: toXY(B2), p1: toXY(B3) });
        }

        return segs;
    }

    /**
     * Converts local Bezier curves to page coordinates.
     * Applies scaling and Y-axis inversion.
     * @private
     * @param {{p0: Vec2, c1: Vec2, c2: Vec2, p1: Vec2}[]} beziers - Local Bezier segments
     * @param {PointWithType} begin - Starting point in page coordinates
     * @param {number} scale - Scale factor for conversion (default: 96)
     * @returns {array} Array of Bezier segments in page coordinates
     */
    private static toPageBeziers(
        beziers: { p0: Vec2; c1: Vec2; c2: Vec2; p1: Vec2; }[],
        begin: PointWithType,
        scale: number
    ): { p0: PointWithType; c1: PointWithType; c2: PointWithType; p1: PointWithType; }[] {
        /**
         * Transforms local coordinates to page coordinates.
         * @param {Vec2} v - Local coordinate point
         * @returns {PointWithType} Page coordinate point
         */
        const T: (v: Vec2) => PointWithType = (v: Vec2): PointWithType => (
            {
                x: begin.x + v.x * scale,
                y: begin.y - v.y * scale  // Y-axis inverted
            }
        );

        return beziers.map(
            (b: { p0: Vec2; c1: Vec2; c2: Vec2; p1: Vec2; }): { p0: PointWithType;
                c1: PointWithType; c2: PointWithType; p1: PointWithType; } => ({
                p0: T(b.p0),
                c1: T(b.c1),
                c2: T(b.c2),
                p1: T(b.p1)
            })
        );
    }

    /**
     * Converts Bezier curve segments to connector segment models.
     * Transforms geometric Bezier data into Syncfusion segment format.
     * @private
     * @param {{p0: PointWithType, c1: PointWithType, c2: PointWithType, p1: PointWithType}[]} beziers - Bezier segments
     * @returns {DiagramConnectorSegmentModel[]} Array of connector segment models
     */
    private static beziersToSegments(beziers: { p0: PointWithType; c1: PointWithType;
        c2: PointWithType; p1: PointWithType; }[]): DiagramConnectorSegmentModel[] {
        return beziers.map((b: {p0: PointWithType; c1: PointWithType; c2: PointWithType; p1: PointWithType; }) => ({
            type: 'Bezier',
            point1: { x: b.c1.x, y: b.c1.y },
            point2: { x: b.c2.x, y: b.c2.y },
            point: { x: b.p1.x, y: b.p1.y }
        })) as DiagramConnectorSegmentModel[];
    }
}

/**
 * Extracts a cell value from cell array, handling both single and array formats.
 * @function getCellValue
 * @param {OneOrMany<VisioCell>} cell - A single cell object or array of cell objects
 * @param {string} name - Name of the cell to find
 * @returns {string | undefined} The cell value, or undefined if not found
 */
export function getCellValue(cell: OneOrMany<VisioCell>, name: string): string | undefined {
    if (Array.isArray(cell)) {
        const match: VisioCell = cell.find((c: VisioCell) => c && c.$ && c.$.N === name);
        return match && match.$ && (match.$.V as string);
    }
    if (cell && (cell as VisioCell).$ && (cell as VisioCell).$.N === name) {
        return (cell as VisioCell).$.V as string;
    }
    return undefined;
}

/**
 * Calculates bridge space for line-bridging connectors.
 * Returns the spacing between overlapping connectors.
 * @function getBridgeSpace
 * @param {ParsingContext} context - Parsing context with page bridging settings
 * @returns {number} The bridge spacing value in pixels
 */
function getBridgeSpace(context: ParsingContext): number {
    const page: VisioPage = context.data.currentPage;
    const bridgeStyle: number = page.bridging;

    // No bridging if style is 0
    if (bridgeStyle === 0) {
        return 0;
    }

    // Get base spacing based on bridge style
    const baseSpacing: number = (bridgeStyle === 2)
        ? page.verticalBridgeSpace
        : page.horizontalBridgeSpace;

    return baseSpacing * 10;
}

/**
 * Extracts constraint flags from connector cells.
 * Sets lock properties on the connector object.
 * @function getConstraints
 * @param {VisioConnector} shape - The connector object to populate
 * @param {VisioCell[]} cells - Array of cell objects from the connector shape
 * @returns {void}
 */
function getConstraints(shape: VisioConnector, cells: VisioCell[]): void {
    const cellMap: Map<string, CellMapValue> = mapCellValues(cells);
    const lockKeys: string[] = [
        'LockDelete',
        'LockSelect',
        'LockTextEdit',
        'LockBegin',
        'LockEnd',
        'LockMoveX',
        'LockMoveY',
        'LockVtxEdit'
    ];

    // Set boolean flags for each lock constraint
    for (const key of lockKeys) {
        const value: string = cellMap.get(key) as string;
        (shape as any)[toCamelCase(key)] = value != null && value !== '0';
    }
}

/**
 * Applies connector constraint flags to the Syncfusion connector constraints.
 * Converts Visio lock properties to Syncfusion constraint bitmasks.
 * @function setConstraints
 * @param {any} shape - The connector object with lock flags
 * @param {ParsingContext} context - Parsing context for warnings
 * @returns {number} Syncfusion connector constraint value
 */
function setConstraints(shape: any, context: ParsingContext): number {
    let constraints: number | undefined = shape.constraints;
    // Start with default constraints
    constraints = ConnectorConstraints.Default | ConnectorConstraints.AllowDrop | ConnectorConstraints.DragSegmentThumb;

    // Disable drag if move is locked
    if (shape.lockMoveX || shape.lockMoveY) {
        context.addWarning('[WARNING] :: Drag constraints for connector (if either lockMoveX or lockMoveY is selected, drag constraints will be disabled completely in Syncfusion).');
        constraints &= ~ConnectorConstraints.Drag;
    }

    // Apply individual lock constraints
    if (shape.lockDelete) {
        constraints &= ~ConnectorConstraints.Delete;
    }
    if (shape.lockSelect) {
        constraints &= ~ConnectorConstraints.Select;
    }
    if (shape.lockBegin) {
        constraints &= ~ConnectorConstraints.DragSourceEnd;
    }
    if (shape.lockEnd) {
        constraints &= ~ConnectorConstraints.DragTargetEnd;
    }
    if (shape.tooltip) {
        constraints |= ConnectorConstraints.Tooltip;
    }
    if (shape.lockTextEdit) {
        constraints |= ConnectorConstraints.ReadOnly;
    }
    if (!shape.allowDrop) {
        constraints &= ~ConnectorConstraints.AllowDrop;
    }
    if (shape.lineRouting) {
        constraints |= ConnectorConstraints.LineRouting;
    }
    if (shape.lockVtxEdit) {
        constraints &= ~ConnectorConstraints.DragSegmentThumb;
    }

    return constraints;
}

/**
 * Applies annotation constraint flags for connector text.
 * @function setAnnotationConstraints
 * @param {any} shape - The annotation object with lock flags
 * @returns {any} Syncfusion annotation constraint value
 */
function setAnnotationConstraints(shape: any): any {
    let constraints: any = shape.constraints;

    if (shape.lockTextEdit) {
        constraints = AnnotationConstraints.InheritReadOnly;
    }
    if (shape.lockRotate) {
        constraints = AnnotationConstraints.Interaction & ~AnnotationConstraints.Rotate;
    }
    if (shape.lockSelect) {
        constraints = AnnotationConstraints.Interaction & ~AnnotationConstraints.Select;
    }

    return constraints;
}

/**
 * Determines if a shape is a connector based on its cells and master reference.
 * Checks for connector-specific cells (BeginX, BeginY, EndX, EndY) and valid master.
 * @function isConnectorShape
 * @param {VisioShapeNode} shape - The Visio shape object to check
 * @param {ParsingContext} context - Parsing context with master data
 * @returns {boolean} True if shape is identified as a connector
 */
export function isConnectorShape(shape: VisioShapeNode, context: ParsingContext): boolean {
    const masters: VisioMaster[] = context.data.masters;

    // Get all cell names in the shape
    const cellArray: VisioCell[] = VisioConnectorUtils.isArrayCell(shape);
    const cellNames: any = cellArray.map((cell: VisioCell) => cell.$ && cell.$.N);

    // Check for connector-specific cells
    const hasBeginEndPoints: boolean =
        cellNames.includes('BeginX') ||
        cellNames.includes('BeginY') ||
        cellNames.includes('EndX') ||
        cellNames.includes('EndY');

    // Check if master is valid
    const masterId: string | undefined = shape.$ && shape.$.Master;
    const hasValidMaster: boolean =
        masterId !== undefined &&
        masters.some((m: { id: string }) => m.id === masterId);

    return hasBeginEndPoints && hasValidMaster;
}

/**
 * Retrieves the source shape ID for a connector by looking up connection data.
 * @function getConnectorSourceId
 * @param {string} connectorId - ID of the connector to look up
 * @param {ParsingContext} context - Parsing context with connection data
 * @returns {string | undefined} The source shape ID, or undefined if not found
 */
function getConnectorSourceId(connectorId: string, context: ParsingContext): string | undefined {
    const connections: VisioConnections[] = context.data.connections as VisioConnections[];
    const connection: VisioConnections = connections.find((conn: VisioConnections) => conn.connectorId === connectorId);
    return connection ? connection.sourceId : undefined;
}

/**
 * Retrieves the target shape ID for a connector by looking up connection data.
 * @function getConnectorTargetId
 * @param {string} connectorId - ID of the connector to look up
 * @param {ParsingContext} context - Parsing context with connection data
 * @returns {string | undefined} The target shape ID, or undefined if not found
 */
function getConnectorTargetId(connectorId: string, context: ParsingContext): string | undefined {
    const connections: VisioConnections[] = context.data.connections as VisioConnections[];
    const connection: VisioConnections = connections.find((conn: VisioConnections) => conn.connectorId === connectorId);
    return connection ? connection.targetId : undefined;
}

/**
 * Retrieves the source port ID for a connector by looking up connection data.
 * @function getConnectorSourcePortId
 * @param {string} connectorId - ID of the connector to look up
 * @param {ParsingContext} context - Parsing context with connection data
 * @returns {string | undefined} The source port ID, or undefined if not found
 */
function getConnectorSourcePortId(connectorId: string, context: ParsingContext): string | undefined {
    const connections: VisioConnections[] = context.data.connections as VisioConnections[];
    const connection: VisioConnections = connections.find((conn: VisioConnections) => conn.connectorId === connectorId);
    return connection ? connection.sourcePortId : undefined;
}

/**
 * Retrieves the target port ID for a connector by looking up connection data.
 * @function getConnectorTargetPortId
 * @param {string} connectorId - ID of the connector to look up
 * @param {ParsingContext} context - Parsing context with connection data
 * @returns {string | undefined} The target port ID, or undefined if not found
 */
function getConnectorTargetPortId(connectorId: string, context: ParsingContext): string | undefined {
    const connections: VisioConnections[] = context.data.connections as VisioConnections[];
    const connection: VisioConnections = connections.find((conn: VisioConnections) => conn.connectorId === connectorId);
    return connection ? connection.targetPortId : undefined;
}

/**
 * Maps VisioTextAlignmentModel to Syncfusion text alignment string.
 * @function getTextAlign
 * @param {VisioTextAlignmentModel} alignment - The Visio text alignment model
 * @returns {'Left' | 'Right' | 'Center' | 'Justify'} The Syncfusion alignment string
 */
function getTextAlign(alignment: VisioTextAlignmentModel): 'Left' | 'Right' | 'Center' | 'Justify' {
    if (alignment && alignment.left) { return 'Left'; }
    if (alignment && alignment.right) { return 'Right'; }
    if (alignment && alignment.justify) { return 'Justify'; }
    return 'Center';
}

/**
 * Maps Visio connector type to Syncfusion Segments type.
 * Includes warnings for Bezier curve approximation.
 * @function getType
 * @param {ConnectorType} type - The Visio connector type
 * @param {ParsingContext} context - Parsing context for warnings
 * @returns {Segments} The Syncfusion segment type
 */
function getType(type: ConnectorType, context: ParsingContext): Segments {
    if (type === 'Orthogonal') {
        return 'Orthogonal';
    } else if (type === 'Bezier') {
        context.addWarning('[WARNING] :: Bezier curve is approximated from Visio.');
        return 'Bezier';
    } else {
        return 'Straight'; // Default value
    }
}

/**
 * Interface for best projection result on a connector segment.
 * Used in connector path calculations.
 * @interface BestProjection
 */
interface BestProjection {
    /** Index of the best segment */
    segmentIndex: number;
    /** Parameter t on the segment (0-1) */
    tOnSegment: number;
    /** Distance to the projection */
    distance: number;
}

/**
 * Interface for margin values.
 * @interface Margin
 */
interface Margin {
    /** Left margin value */
    left: number;
    /** Top margin value */
    top: number;
}

/** Epsilon value for floating-point precision */
const EPS: number = 1e-12;

/** Type alias for a 2D point */
type Pt = { x: number; y: number };

/** Type union for all connector segment types */
type ConnectorSegment = StraightSegment | OrthogonalSegment | BezierSegment;

/**
 * Interface for straight connector segments.
 * @interface StraightSegment
 */
interface StraightSegment {
    /** Segment type identifier */
    type: 'Straight';
    /** Target point of the segment */
    point: Pt;
}

/**
 * Interface for orthogonal connector segments.
 * @interface OrthogonalSegment
 */
interface OrthogonalSegment {
    /** Segment type identifier */
    type: 'Orthogonal';
    /** Direction of the segment (Top, Bottom, Left, Right) */
    direction: Direction;
    /** Length of the segment */
    length: number;
}

/**
 * Interface for Bezier curve connector segments.
 * @interface BezierSegment
 */
interface BezierSegment {
    /** Segment type identifier */
    type: 'Bezier';
    /** First control point (optional) */
    point1?: Pt;
    /** Second control point (optional) */
    point2?: Pt;
    /** First Bezier control point (optional) */
    bezierPoint1?: Pt;
    /** Second Bezier control point (optional) */
    bezierPoint2?: Pt;
    /** End point of the curve */
    point: Pt;
}

/**
 * Calculates Euclidean distance between two points.
 * @function hypot2
 * @param {Pt} a - First point
 * @param {Pt} b - Second point
 * @returns {number} Distance between points
 */
function hypot2(a: Pt, b: Pt): number { return Math.hypot(a.x - b.x, a.y - b.y); }

/**
 * Clamps a value to the range [0, 1].
 * @function clamp01
 * @param {number} v - Value to clamp
 * @returns {number} Clamped value
 */
function clamp01(v: number): number { return v <= 0 ? 0 : v >= 1 ? 1 : v; }

/**
 * Snaps a value to 0 or 1 if within epsilon distance.
 * @function snap01
 * @param {number} v - Value to snap
 * @returns {number} Snapped value (0, v, or 1)
 */
function snap01(v: number): number {
    if (Math.abs(v) < EPS) { return 0; }
    if (Math.abs(1 - v) < EPS) { return 1; }
    return v;
}

/**
 * Normalizes a 2D vector to unit length.
 * @function normalize
 * @param {Pt} v - Vector to normalize
 * @returns {Pt} Normalized vector
 */
function normalize(v: Pt): Pt {
    const L: number = Math.hypot(v.x, v.y) || 1e-12;
    return { x: v.x / L, y: v.y / L };
}

/**
 * Evaluates a cubic Bezier curve at parameter t.
 * Uses the standard cubic Bezier formula.
 * @function cubic
 * @param {Pt} p0 - Start point
 * @param {Pt} c1 - First control point
 * @param {Pt} c2 - Second control point
 * @param {Pt} p1 - End point
 * @param {number} t - Parameter (0-1)
 * @returns {Pt} Point on the curve
 */
function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
    const u: number = 1 - t;
    const u2: number = u * u;
    const u3: number = u2 * u;
    const t2: number = t * t;
    const t3: number = t2 * t;
    return {
        x: u3 * p0.x + 3 * u2 * t * c1.x + 3 * u * t2 * c2.x + t3 * p1.x,
        y: u3 * p0.y + 3 * u2 * t * c1.y + 3 * u * t2 * c2.y + t3 * p1.y
    };
}

/**
 * Flattens a cubic Bezier curve into a polyline.
 * Samples the curve at regular intervals.
 * @function flattenCubicToPolyline
 * @param {Pt} p0 - Start point
 * @param {Pt} c1 - First control point
 * @param {Pt} c2 - Second control point
 * @param {Pt} p1 - End point
 * @param {number} steps - Number of samples (default: 48)
 * @returns {Pt[]} Array of points on the polyline
 */
function flattenCubicToPolyline(p0: Pt, c1: Pt, c2: Pt, p1: Pt, steps: number): Pt[] {
    const out: Pt[] = [];
    for (let i: number = 0; i <= steps; i++) {
        out.push(cubic(p0, c1, c2, p1, i / steps));
    }
    return out;
}

/**
 * Builds a polyline representation of a connector's path in pixels.
 * Handles straight, orthogonal, and Bezier connector types.
 * @function buildConnectorPolylinePx
 * @param {VisioConnector} conn - The connector to build polyline for
 * @returns {Pt[]} Array of points representing the connector path
 */
function buildConnectorPolylinePx(conn: VisioConnector): Pt[] {
    // Start with begin point
    const polylinePoints: Pt[] = [{ x: conn.beginX, y: conn.beginY }];

    // Return simple line if no segments
    if (!conn.segments || (conn.segments as ConnectorSegment[]).length === 0) {
        polylinePoints.push({ x: conn.endX, y: conn.endY });
        return polylinePoints;
    }

    // Build polyline based on connector type
    if (conn.type === 'Straight') {
        // Add all straight segment points
        for (const s of conn.segments as StraightSegment[]) {
            if (s.type === 'Straight' && s.point) {
                polylinePoints.push({ x: s.point.x, y: s.point.y });
            }
        }

        // Ensure end point is included
        const last: Pt = polylinePoints[polylinePoints.length - 1];
        if (hypot2(last, { x: conn.endX, y: conn.endY }) > EPS) {
            polylinePoints.push({ x: conn.endX, y: conn.endY });
        }
        return polylinePoints;
    }

    if (conn.type === 'Orthogonal') {
        // Build path by applying direction and length to each segment
        let currentPoint: Pt = { x: conn.beginX, y: conn.beginY };
        for (const segment of conn.segments as OrthogonalSegment[]) {
            if (segment.type !== 'Orthogonal') { continue; }

            const L: number = typeof segment.length === 'number' ? segment.length : 0;
            const nextPoint: Pt = { ...currentPoint };

            // Apply direction to calculate next point
            switch (segment.direction) {
            case 'Left': nextPoint.x -= L; break;
            case 'Right': nextPoint.x += L; break;
            case 'Top': nextPoint.y -= L; break;
            case 'Bottom': nextPoint.y += L; break;
            default: break;
            }

            // Add to polyline if significant distance
            if (hypot2(currentPoint, nextPoint) > EPS) {
                polylinePoints.push(nextPoint);
                currentPoint = nextPoint;
            }
        }

        // Ensure end point is included
        const lastPoint: Pt = polylinePoints[parseInt(polylinePoints.length.toString(), 10) - 1];
        if (hypot2(lastPoint, { x: conn.endX, y: conn.endY }) > EPS) {
            polylinePoints.push({ x: conn.endX, y: conn.endY });
        }
        return polylinePoints;
    }

    if (conn.type === 'Bezier') {
        // Build path by sampling Bezier curves
        const bezierSegs: BezierSegment[] = (conn.segments as BezierSegment[]).filter((s: BezierSegment) => s.type === 'Bezier');
        const TOL: number = 1e-6;
        const nearlyEqual: (a: number, b: number) => boolean = (a: number, b: number) => Math.abs(a - b) <= TOL;

        let p0: Pt = { x: conn.beginX, y: conn.beginY };

        // Process each Bezier segment
        for (let idx: number = 0; idx < bezierSegs.length; idx++) {
            const s: BezierSegment = bezierSegs[parseInt(idx.toString(), 10)];
            const c1: Pt = s.point1!;
            const c2: Pt = s.point2!;
            let p1: Pt = s.point;

            if (!c1 || !c2 || !p1) { continue; }

            // Force last point to end if nearly equal
            if (idx === bezierSegs.length - 1) {
                if (!nearlyEqual(p1.x, conn.endX) || !nearlyEqual(p1.y, conn.endY)) {
                    p1 = { x: conn.endX, y: conn.endY };
                }
            }

            // Sample the Bezier curve and add to polyline
            const samples: Pt[] = flattenCubicToPolyline(p0, c1, c2, p1, 48);
            for (let i: number = 1; i < samples.length; i++) {
                polylinePoints.push(samples[parseInt(i.toString(), 10)]);
            }
            p0 = p1;
        }

        // Ensure end point is included
        const last: Pt = polylinePoints[parseInt(polylinePoints.length.toString(), 10) - 1];
        if (hypot2(last, { x: conn.endX, y: conn.endY }) > EPS) {
            polylinePoints.push({ x: conn.endX, y: conn.endY });
        }
        return polylinePoints;
    }

    polylinePoints.push({ x: conn.endX, y: conn.endY });
    return polylinePoints;
}

/**
 * Projects a point onto a line segment and returns projection parameters.
 * @function projectOnSegment
 * @param {Pt} p - Point to project
 * @param {Pt} a - Segment start point
 * @param {Pt} b - Segment end point
 * @returns {{t: number, q: Pt}} Object with parameter t and projection point q
 */
function projectOnSegment(p: Pt, a: Pt, b: Pt): { t: number; q: Pt } {
    const abx: number = b.x - a.x;
    const aby: number = b.y - a.y;
    const apx: number = p.x - a.x;
    const apy: number = p.y - a.y;
    const ab2: number = abx * abx + aby * aby || 1e-12;

    // Calculate projection parameter
    let t: number = (apx * abx + apy * aby) / ab2;
    t = Math.max(0, Math.min(1, t));

    return { t, q: { x: a.x + t * abx, y: a.y + t * aby } };
}

/**
 * Calculates the offset along a polyline for a given point.
 * Returns normalized offset (0-1) based on arclength distance.
 * @function pathOffsetAlongPolyline
 * @param {Pt[]} path - Array of points defining the polyline
 * @param {Pt} point - Point to find offset for
 * @returns {number} Normalized offset (0-1)
 */
function pathOffsetAlongPolyline(path: Pt[], point: Pt): number {

    let finalOffset: number;

    // Return midpoint if invalid path
    if (!path || path.length < 2) { return 0.5; }

    // Calculate segment lengths
    const segmentLengths: number[] = [];
    let totalLength: number = 0;
    for (let index: number = 0; index < path.length - 1; index++) {
        const length: number = hypot2(path[parseInt(index.toString(), 10)], path[parseInt(index.toString(), 10) + 1]);
        segmentLengths.push(length);
        totalLength += length;
    }

    // Return midpoint if path is degenerate
    if (totalLength < EPS) { return 0.5; }

    // Find best projection onto path
    let bestProjection: BestProjection = { segmentIndex: 0, tOnSegment: 0, distance: Infinity };
    for (let segmentIndex: number = 0; segmentIndex < path.length - 1; segmentIndex++) {
        const segStartIndex: number = segmentIndex;
        const segEndIndex: number = segmentIndex + 1;
        const segStart: Pt = {
            x: roundTo2Decimals(path[parseInt(segStartIndex.toString(), 10)].x),
            y: roundTo2Decimals(path[parseInt(segStartIndex.toString(), 10)].y)
        };
        const segEnd: Pt = {
            x: roundTo2Decimals(path[parseInt(segEndIndex.toString(), 10)].x),
            y: roundTo2Decimals(path[parseInt(segEndIndex.toString(), 10)].y)
        };
        const { t, q } = projectOnSegment(point, segStart, segEnd);
        const distanceToProjection: number = hypot2(point, q);

        if (distanceToProjection < bestProjection.distance) {
            bestProjection = { segmentIndex, tOnSegment: t, distance: distanceToProjection };
        }
    }

    // Calculate accumulated arc length
    let accumulatedLength: number = 0;
    for (let i: number = 0; i < bestProjection.segmentIndex; i++) {
        accumulatedLength += segmentLengths[parseInt(i.toString(), 10)];
    }
    accumulatedLength += segmentLengths[parseInt(bestProjection.segmentIndex.toString(), 10)] * bestProjection.tOnSegment;

    // Normalize and snap to endpoints
    finalOffset = snap01(clamp01(accumulatedLength / totalLength));
    if (finalOffset === 0) {
        finalOffset = 0.0001;
    }
    if (finalOffset === 1) {
        finalOffset = 0.999;
    }

    return finalOffset;
}

/**
 * Converts local inches to page pixels.
 * Applies scale factor and coordinate system transformation.
 * @function InchesToPagePx
 * @param {Pt} beginPx - Beginning point in pixels
 * @param {Pt} endPx - Ending point in pixels
 * @param {number} localXIn - Local X coordinate in inches
 * @param {number} localYIn - Local Y coordinate in inches
 * @returns {Pt} Converted point in page pixels
 */
function InchesToPagePx(beginPx: Pt, endPx: Pt, localXIn: number, localYIn: number): Pt {
    const SCALE: number = 96; // 96 px/in to match Begin/End inch→px conversion and avoid port/label drift
    const xPx: number = localXIn * SCALE;
    const yPx: number = localYIn * SCALE;
    return {
        x: beginPx.x + xPx,
        y: beginPx.y - yPx // Y-axis inverted
    };
}

/**
 * Checks if a direction vector is vertical.
 * @function isVertical
 * @param {object} direction - Direction vector with x and y components
 * @returns {boolean} True if vector is vertical (x ≈ 0, |y| ≈ 1)
 */
function isVertical(direction: { x: number; y: number }): boolean {
    return Math.abs(direction.x) < EPS && Math.abs(Math.abs(direction.y) - 1) < EPS;
}

/**
 * Checks if a direction vector is horizontal.
 * @function isHorizontal
 * @param {object} direction - Direction vector with x and y components
 * @returns {boolean} True if vector is horizontal (y ≈ 0, |x| ≈ 1)
 */
function isHorizontal(direction: { x: number; y: number }): boolean {
    return Math.abs(direction.y) < EPS && Math.abs(Math.abs(direction.x) - 1) < EPS;
}

/**
 * Gets a point on a polyline at a specified offset using true arclength.
 * @function pointAtOffset
 * @param {Pt[]} pathPoints - Array of points defining the polyline
 * @param {number} offset - Normalized offset (0-1)
 * @returns {{q: Pt, segIndex: number, t: number}} Object with point, segment index, and parameter
 */
function pointAtOffset(pathPoints: Pt[], offset: number): { q: Pt; segIndex: number; t: number } {
    const normalizedOffset: number = Math.max(0, Math.min(1, offset));

    // Return first point if invalid path
    if (!pathPoints || pathPoints.length < 2) {
        return { q: pathPoints[0] || { x: 0, y: 0 }, segIndex: 0, t: 0 };
    }

    // Compute true segment lengths and total path length
    const segmentLengths: number[] = [];
    let totalLength: number = 0;
    for (let segmentIndex: number = 0; segmentIndex < pathPoints.length - 1; segmentIndex++) {
        const start: Pt = pathPoints[parseInt(segmentIndex.toString(), 10)];
        const end: Pt = pathPoints[parseInt(segmentIndex.toString(), 10)  + 1];
        const dx: number = end.x - start.x;
        const dy: number = end.y - start.y;
        const segmentLength: number = Math.hypot(dx, dy);
        segmentLengths.push(segmentLength);
        totalLength += segmentLength;
    }

    // Return first point if degenerate path
    if (totalLength < EPS) {
        return { q: pathPoints[0], segIndex: 0, t: 0 };
    }

    // Walk segments until reaching target arclength
    let remainingLength: number = normalizedOffset * totalLength;
    for (let segmentIndex: number = 0; segmentIndex < segmentLengths.length; segmentIndex++) {
        const segmentLength: number = segmentLengths[parseInt(segmentIndex.toString(), 10)];

        if (remainingLength <= segmentLength || segmentIndex === segmentLengths.length - 1) {
            const tOnSegment: number = segmentLength > 0 ? (remainingLength / segmentLength) : 0;
            const startPoint: Pt = pathPoints[parseInt(segmentIndex.toString(), 10)];
            const endPoint: Pt = pathPoints[parseInt(segmentIndex.toString(), 10) + 1];

            const pointOnPath: Pt = {
                x: startPoint.x + (endPoint.x - startPoint.x) * tOnSegment,
                y: startPoint.y + (endPoint.y - startPoint.y) * tOnSegment
            };

            return { q: pointOnPath, segIndex: segmentIndex, t: tOnSegment };
        }

        remainingLength -= segmentLength;
    }

    // Fallback to last point
    const lastPoint: Pt = pathPoints[parseInt(pathPoints.length.toString(), 10) - 1];
    return { q: lastPoint, segIndex: segmentLengths.length - 1, t: 1 };
}

/**
 * Calculates annotation placement margin using a known offset on the connector.
 * @function AnnotationMargin
 * @param {VisioConnector} conn - The connector shape
 * @param {object} visioText - Visio text transform properties
 * @param {number} offset - Normalized offset on the connector (0-1)
 * @returns {Margin} Object with left and top margin values
 */
function AnnotationMargin(
    conn: VisioConnector,
    visioText: {
        txtPinX: number;
        txtPinY: number;
        txtLocPinX: number;
        txtLocPinY: number;
        txtWidth: number;
        txtHeight: number;
        txtAngle: number;
    },
    offset: number
): Margin {
    const threshold: number = 12;

    // Build connector path in page pixels
    const path: Pt[] = buildConnectorPolylinePx(conn);

    // Compute text box center in connector-local inches
    const dxcIn: number = visioText.txtWidth / 2 - visioText.txtLocPinX;
    const dycIn: number = visioText.txtHeight / 2 - visioText.txtLocPinY;

    // Convert local center to absolute page pixel point
    const beginPx: Pt = { x: conn.beginX, y: conn.beginY };
    const endPx: Pt = { x: conn.endX, y: conn.endY };
    const dir: Pt = normalize({ x: endPx.x - beginPx.x, y: endPx.y - beginPx.y });

    let localYIn: number = (visioText.txtPinY) + dycIn;
    let localXIn: number = (visioText.txtPinX) + dxcIn;

    // Adjust local coordinates based on connector direction
    if (isVertical(dir)) {
        localXIn = (visioText.txtPinX - visioText.txtLocPinY) + dycIn;
    }
    if (isHorizontal(dir)) {
        localYIn = (visioText.txtPinY - visioText.txtLocPinY) + dycIn;
    }

    const labelCenter: Pt = InchesToPagePx(beginPx, endPx, localXIn, localYIn);

    // Get anchor point on connector at given offset
    const { q } = pointAtOffset(path, offset);

    // Calculate margin as difference between label center and anchor
    let left: number = labelCenter.x - q.x;
    let top: number = labelCenter.y - q.y;

    // Snap to zero if below threshold
    if (Math.abs(left) <= threshold) { left = 0; }
    if (Math.abs(top) <= threshold) { top = 0; }

    return { left, top };
}

/**
 * Calculates port placement margin using a known offset on the connector.
 * @function PortMargin
 * @param {VisioConnector} conn - The connector shape
 * @param {VisioPort} visioPort - The connector port
 * @param {number} offset - Normalized offset on the connector (0-1)
 * @returns {Margin} Object with left and top margin values
 */
function PortMargin(
    conn: VisioConnector,
    visioPort: VisioPort,
    offset: number
): Margin {
    // Build connector path in page pixels
    const path: Pt[] = buildConnectorPolylinePx(conn);

    // Convert port position to page pixels
    const beginPx: Pt = { x: conn.beginX, y: conn.beginY };
    const endPx: Pt = { x: conn.endX, y: conn.endY };

    // Use the port's connector-local inches directly.
    const labelCenter: Pt = InchesToPagePx(beginPx, endPx, visioPort.x, visioPort.y);

    // Get anchor point on connector at given offset
    const { q } = pointAtOffset(path, offset);

    // Exact pixel delta; no snapping.
    const left: number = labelCenter.x - q.x;
    const top: number = labelCenter.y - q.y;
    return { left, top };
}

/**
 * Converts Visio connector data to Syncfusion connector format.
 * Applies styling, constraints, decorators, and annotations.
 * @function bindVisioConnectors
 * @param {VisioConnector} connectorData - The Visio connector to convert
 * @param {ParsingContext} context - Parsing context for warnings and settings
 * @returns {any} Syncfusion connector object
 */
export function bindVisioConnectors(connectorData: VisioConnector, context: ParsingContext): any {
    const ports: VisioPort[] = connectorData.ports;
    const pathPx: Pt[] = buildConnectorPolylinePx(connectorData);
    const beginPx: Pt = { x: connectorData.beginX, y: connectorData.beginY };
    const endPx: Pt = { x: connectorData.endX, y: connectorData.endY };

    // Calculate offsets and margins for ports
    for (let i: number = 0; i < ports.length; i++) {
        const p: VisioPort & { offset?: number; margin?: Margin; } = ports[parseInt(i.toString(), 10)] as VisioPort &
        { offset?: number; margin?: Margin };
        const pagePoint: Pt = InchesToPagePx(beginPx, endPx, p.x, p.y);
        const offset: number = pathOffsetAlongPolyline(pathPx, pagePoint);
        const margin: Margin = PortMargin(connectorData, p, offset);
        (ports[parseInt(i.toString(), 10)] as VisioConnectorPort).offset = offset;
        (ports[parseInt(i.toString(), 10)] as VisioConnectorPort).margin = margin;
    }

    // Warn about unsupported corner radius
    if (connectorData.cornerRadius) {
        context.addWarning('[WARNING] :: Compound type, cap type, and rounding presets are not supported in Syncfusion.');
        context.addWarning('[WARNING] :: Corner radius differs between Visio and Syncfusion.');
    }

    // Return Syncfusion connector object
    return {
        id: connectorData.id,
        type: getType(connectorData.type, context),
        sourceID: connectorData.sourceId,
        targetID: connectorData.targetId,
        sourcePortID: connectorData.sourcePortId,
        targetPortID: connectorData.targetPortId,
        sourcePoint: {
            x: formatCoordinate(connectorData.beginX),
            y: formatCoordinate(connectorData.beginY)
        },
        targetPoint: {
            x: formatCoordinate(connectorData.endX),
            y: formatCoordinate(connectorData.endY)
        },
        cornerRadius: connectorData.cornerRadius ? inchToPoint(connectorData.cornerRadius) : 0,
        visible: connectorData.visible,
        style: setConnectorStyle(connectorData, context),
        annotations: getVisioConnectorAnnotations(connectorData, context),
        sourceDecorator: getDecoratorStyle(connectorData.sourceDecorator!, context),
        targetDecorator: getDecoratorStyle(connectorData.targetDecorator!, context),
        constraints: setConstraints(connectorData, context),
        tooltip: { content: connectorData.tooltip ? connectorData.tooltip : '' },
        bridgeSpace: formatCoordinate(connectorData.bridgeSpace ? connectorData.bridgeSpace : 10),
        segments: (connectorData.segments && connectorData.segments.length) > 1 ? connectorData.segments : [],
        ports: connectorData.ports,
        shape: connectorData.shape
    };
}

/**
 * Extracts and formats connector annotations (text labels).
 * Calculates annotation positioning and styling.
 * @function getVisioConnectorAnnotations
 * @param {VisioConnector} connectorData - The connector containing annotations
 * @param {ParsingContext} context - Parsing context for styling and warnings
 * @returns {any[]} Array of annotation objects
 */
function getVisioConnectorAnnotations(connectorData: VisioConnector, context: ParsingContext): any[] {
    const annotation: VisioConnectorAnnotation = connectorData.annotation!;
    const annotationPx: Pt[] = buildConnectorPolylinePx(connectorData);
    const beginPx: Pt = { x: connectorData.beginX, y: connectorData.beginY };
    const endPx: Pt = { x: connectorData.endX, y: connectorData.endY };
    const pagePoint: Pt = InchesToPagePx(beginPx, endPx, annotation.txtPinX, annotation.txtPinY);
    const annotationOffset: number = pathOffsetAlongPolyline(annotationPx, pagePoint);
    const margin: Margin = AnnotationMargin(connectorData, annotation as any, annotationOffset);

    // Return annotations only if content exists and is non-empty
    if (connectorData.annotation && connectorData.annotation.content && connectorData.annotation.content.trim() !== '') {
        return [{
            content: connectorData.annotation.content,
            rotateAngle: (360 - (connectorData.annotation.rotateAngle)) % 360 || 0,
            visibility: connectorData.annotation.visible,
            constraints: setAnnotationConstraints(connectorData.annotation),
            verticalAlignment: connectorData.annotation.verticalAlignment,
            horizontalAlignment: connectorData.annotation.horizontalAlignment,
            style: setconnectorAnnotation(connectorData, context),
            hyperlink: setHyperLink(connectorData),
            offset: annotationOffset,
            margin: margin
        }];
    }

    return [];
}

/**
 * Extracts hyperlink information from a connector annotation.
 * @function setHyperLink
 * @param {VisioConnector} connectorData - The connector with annotation
 * @returns {any} Hyperlink object, or undefined if no hyperlink present
 */
function setHyperLink(connectorData: VisioConnector): any {
    if (connectorData.annotation && connectorData.annotation.hyperlink && connectorData.annotation.hyperlink.link) {
        return {
            link: connectorData.annotation.hyperlink.link,
            content: connectorData.annotation.hyperlink.content || '',
            hyperlinkOpenState: connectorData.annotation.hyperlink.newWindow ? 'NewWindow' : 'NewTab'
        };
    }
    return undefined;
}

/**
 * Applies styling to a connector line.
 * Applies theme colors and formats dash patterns.
 * @function setConnectorStyle
 * @param {VisioConnector} connector - The connector to style
 * @param {ParsingContext} context - Parsing context for theme styling
 * @returns {ConnectorResolvedStyle} Syncfusion connector style object
 */
function setConnectorStyle(connector: VisioConnector, context: ParsingContext): ConnectorResolvedStyle {
    const connectorStyle: ConnectorResolvedStyle = applyThemeStyles(connector, context);

    // Warn about stroke dash differences
    if (connectorStyle.strokeDashArray) {
        context.addWarning('[WARNING] :: Stroke dash arrays differ between Visio and Syncfusion.');
    }

    return {
        strokeColor: typeof connectorStyle.strokeColor !== 'undefined' ? connectorStyle.strokeColor : defaultStroke,
        strokeWidth: connectorStyle.strokeWidth,
        strokeDashArray: connectorStyle.strokeDashArray,
        opacity: connectorStyle.opacity !== undefined ? (1 - connectorStyle.opacity) : 1
    };
}

/**
 * Applies styling to connector decorators (arrow heads).
 * Handles gradients and validates decorator shapes.
 * @function getDecoratorStyle
 * @param {VisioDecoratorModel} decorator - The decorator model to style
 * @param {ParsingContext} context - Parsing context for warnings
 * @returns {any} Syncfusion decorator style object
 */
function getDecoratorStyle(decorator: VisioDecoratorModel, context: ParsingContext): any {
    const validDecoratorShapes: DecoratorShapes[] = [
        'Arrow', 'None', 'Diamond', 'OpenArrow', 'Circle', 'Square',
        'Fletch', 'OpenFetch', 'IndentedArrow', 'OutdentedArrow',
        'DoubleArrow', 'Custom'
    ];

    const decoratorstyle: any = applyThemeStyles(decorator as any, context);
    const height: number = decoratorstyle.themed ? (decoratorstyle).height : decorator.height!;
    const width: number = (decoratorstyle).themed ? (decoratorstyle).width : decorator.width!;

    // Warn about approximations
    context.addWarning('[WARNING] :: Decorator sizes are approximated.');

    const shape: DecoratorShapes = decorator.shape!;
    if (validDecoratorShapes.indexOf(shape) !== -1) {
        context.addWarning('[WARNING] :: Decorator shapes available in Visio are 45; in Syncfusion only 12 shapes are available. Unsupported shapes are rendered as Arrow shape.');
    }

    // Extract colors
    const fill: string = decorator.style!.fill ? decorator.style!.fill : decoratorstyle.strokeColor;
    const strokeColor: string = decorator.style!.strokeColor ? decorator.style!.strokeColor : decoratorstyle.strokeColor;
    const strokeWidth: number = decoratorstyle.strokeWidth;

    // Extract opacity
    let opacity: number = 1;
    if (decorator.style!.opacity !== undefined && decorator.style!.opacity !== null) {
        opacity = (1 - decorator.style!.opacity);
    }

    // Build gradient if enabled
    let gradient: ConnectorGradient | undefined;
    if (decorator.style!.isgradientEnabled) {
        context.addWarning('[WARNING] :: Gradients are approximated.');

        if (decorator.style!.gradientType === 'Linear') {
            gradient = {
                type: 'Linear',
                x1: (decorator.style!.gradientcoOrdinates as GradientVector).x1,
                y1: (decorator.style!.gradientcoOrdinates as GradientVector).y1,
                x2: (decorator.style!.gradientcoOrdinates as GradientVector).x2,
                y2: (decorator.style!.gradientcoOrdinates as GradientVector).y2,
                stops: decorator.style!.gradientStops
            };
        } else {
            gradient = {
                type: 'Radial',
                cx: (decorator.style!.gradientcoOrdinates as RadialGradientConfig).cx,
                cy: (decorator.style!.gradientcoOrdinates as RadialGradientConfig).cy,
                fx: (decorator.style!.gradientcoOrdinates as RadialGradientConfig).fx,
                fy: (decorator.style!.gradientcoOrdinates as RadialGradientConfig).fy,
                r: (decorator.style!.gradientcoOrdinates as RadialGradientConfig).r,
                stops: decorator.style!.gradientStops
            };
        }
    } else {
        gradient = undefined;
    }

    return {
        height, width, shape,
        style: { fill, strokeColor, opacity: opacity, gradient, strokeWidth }
    };
}

/**
 * Applies styling and theme colors to connector annotation text.
 * Handles font family, size, color, and text decoration.
 * @function setconnectorAnnotation
 * @param {VisioConnector} connectorData - The connector with annotation
 * @param {ParsingContext} context - Parsing context for theme styling
 * @returns {any} Syncfusion annotation style object
 */
function setconnectorAnnotation(connectorData: VisioConnector, context: ParsingContext): ResolvedAnnotationStyle {
    // Extract incoming style properties
    const incomingStyle: AnnotationStyle | VisioTextStyleModel =
        connectorData &&
            connectorData.annotation &&
            connectorData.annotation.style
            ? connectorData.annotation.style
            : {} as AnnotationStyle;

    const incomingColor: string | undefined = typeof incomingStyle.color === 'string' ? incomingStyle.color : undefined;
    let resolvedColor: string = incomingColor ? incomingColor : '';
    let resolvedFontFamily: string | undefined = typeof incomingStyle.fontFamily === 'string'
        ? incomingStyle.fontFamily
        : undefined;
    let themeFontApplied: boolean = false;
    let themeColorApplied: boolean = false;

    // Check for active theme application
    const activeTheme: ActiveThemeResult = isActiveThemeApplied(connectorData.annotation as any, context);
    if (activeTheme && activeTheme.isThemeApplied) {
        if (activeTheme.theme && Array.isArray(activeTheme.theme) && activeTheme.theme.length > 0) {
            const first: ThemeEntry = activeTheme.theme[0];

            // Apply theme font if available
            if (!resolvedFontFamily && first && typeof first.fontFamily === 'string') {
                let fontName: string = first.fontFamily;
                if (fontMapping && typeof fontMapping === 'object' && hasOwn(fontMapping, fontName)) {
                    fontName = (fontMapping as Record<string, string>)[`${fontName}`];
                }
                resolvedFontFamily = fontName;
                themeFontApplied = true;
            }

            // Apply theme color if not already set
            if (!incomingColor || incomingColor === 'Themed') {
                const range: number = normalizeRange(activeTheme.range);
                const fontEntry: AccentColorDefinition = getConnectorFontType(activeTheme.currentTheme, range);

                if (fontEntry && hasOwn(fontEntry, 'vt:color')) {
                    const colorNodeUnknown: ThemeColorElement = (fontEntry as any)['vt:color'];
                    const colorInput: ColorInfo = extractColorWithModifiers(colorNodeUnknown as ThemeColorElement);
                    const themed: string = resolveAccentColor(colorInput, activeTheme.theme, activeTheme.fillIdxColor);

                    if (typeof themed === 'string' && themed !== '') {
                        resolvedColor = themed;
                        themeColorApplied = true;
                    }
                }
            }
        }
    }

    // Set final property values with fallbacks
    const finalColor: string =
        themeColorApplied
            ? resolvedColor
            : (incomingStyle.color !== undefined && incomingStyle.color !== null && incomingStyle.color !== ''
                ? incomingStyle.color as string
                : '#3D64AC');

    const finalFontFamily: string | undefined = themeFontApplied ? resolvedFontFamily : incomingStyle.fontFamily;
    const finalFontSize: number = typeof incomingStyle.fontSize === 'number' ? incomingStyle.fontSize : 8 * 1.33;
    const finalOpacity: number = typeof incomingStyle.opacity === 'number' ? incomingStyle.opacity : 1;
    const finalBold: boolean = typeof incomingStyle.bold === 'boolean' ? incomingStyle.bold : false;
    const finalItalic: boolean = typeof incomingStyle.italic === 'boolean' ? incomingStyle.italic : false;
    const finalTextAlign: 'Left' | 'Center' | 'Right' | 'Justify' =
        getTextAlign(incomingStyle.textAlign);
    const finalTextDecoration: 'None' | 'Underline' | 'Overline' | 'LineThrough' =
        getTextDecoration(incomingStyle.textDecoration);

    return {
        color: finalColor,
        fill: incomingStyle.fill,
        fontFamily: finalFontFamily,
        fontSize: finalFontSize,
        opacity: finalOpacity,
        bold: finalBold,
        italic: finalItalic,
        textAlign: finalTextAlign,
        textDecoration: finalTextDecoration
    };
}
interface VisioConnectorPort extends VisioPort {
    offset?: number;
    margin?: { left: number; top: number };
}
