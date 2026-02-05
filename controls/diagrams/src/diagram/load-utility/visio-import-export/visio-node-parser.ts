import { VisioNodeAnnotation } from './visio-annotations';
import { getCellValue, isConnectorShape } from './visio-connectors';
import { findAllGeometries, getMasterId, inchToPx, isGroupShape, isValidMasterId, mapCellValues, toCamelCase } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { getVisioPorts, parseVisioNodeShadow, parseVisioNodeStyle, setDefaultData } from './visio-model-parsers';
import { VisioLayer, VisioMaster, VisioShape } from './visio-models';
import { determineShapeType, shapeIndex } from './visio-nodes';
import {
    CellMapValue,
    VisioMedia,
    VisioPort,
    VisioShapeNode,
    VisioSection,
    ShapeAttributes,
    VisioCell,
    OneOrMany,
    VisioRow,
    StyleEntry,
    DefaultShapeData,
    GeometryDataObject,
    ApplyCommonNodePropertiesArgs,
    Attributes,
    AugmentedGeometry
} from './visio-types';

/**
 * Main parser function for converting raw Visio shape XML objects into VisioShape instances.
 * This is the entry point for shape parsing and handles multiple shape types:
 * - Master-based shapes (shapes that reference master definitions)
 * - Group shapes (containers with child shapes)
 * - Raw/primitive shapes (without masters)
 * - Foreign/Image shapes (embedded media)
 * - Draw shapes (path-based shapes)
 *
 * The function processes shape hierarchies and establishes parent-child relationships
 * for grouped shapes while handling coordinate system conversions and styling.
 *
 * @param {VisioShapesContainer} obj - The raw parsed XML object containing Shape elements.
 * @param {ParsingContext} context - Parser utilities and state including current page, masters, themes.
 * @returns {VisioShape[]} An array of parsed VisioShape objects ready for diagram rendering.
 *
 * @example
 * const shapes = parserVisioShape(rawXmlObj, context);
 * shapes.forEach(shape => {
 *     console.log(`Shape: ${shape.id} at (${shape.offsetX}, ${shape.offsetY})`);
 * });
 *
 * @private
 */
export function parserVisioShape(
    obj: { Shape?: OneOrMany<VisioShapeNode> },
    context: ParsingContext
): VisioShape[] {
    // ==================== Extract Shape Elements ====================
    // Get the Shape property from the object (may be single or array)
    const shapeElements: OneOrMany<VisioShapeNode> | undefined = obj.Shape;

    // Determine if we have a single raw shape (not an array)
    const rawShape: boolean = shapeElements && !Array.isArray(shapeElements) && typeof shapeElements === 'object';
    const resultShapes: VisioShape[] = [];

    // ==================== Process Raw/Primitive Shapes ====================
    // Handle shapes defined locally without referencing a master
    if (rawShape && !Array.isArray(shapeElements)) {
        const singleShape: VisioShapeNode = shapeElements;
        // Check if this is a raw shape definition (has NameU/Type but no Master reference)
        if (singleShape.$ &&
            (singleShape.$.NameU || singleShape.$.Type) &&
            !singleShape.$.Master) {

            const shapeData: VisioShapeNode = singleShape;
            const cells: VisioCell[] = Array.isArray(shapeData.Cell)
                ? shapeData.Cell
                : [shapeData.Cell];

            // ==================== Extract Cell Properties ====================
            // Convert cell array to Map for efficient lookup
            const cellMap: Map<string, CellMapValue> = mapCellValues(cells);

            // Extract geometry and dimension properties
            const defaultWidth: number = Number(cellMap.get('Width'));
            const defaultHeight: number = Number(cellMap.get('Height'));
            const defaultLocX: number = cellMap.get('LocPinX') as number;
            const defaultLocY: number = cellMap.get('LocPinY') as number;
            const defaultBeginX: string = cellMap.get('BeginX') as string;
            const defaultBeginY: string = cellMap.get('BeginY') as string;
            const defaultEndX: string = cellMap.get('EndX') as string;
            const defaultEndY: string = cellMap.get('EndY') as string;
            const bgColor: string = cellMap.get('FillForegnd') as string;

            // Extract text positioning and sizing properties
            const txtWidth: number = Number(cellMap.get('TxtWidth'));
            const txtHeight: number = Number(cellMap.get('TxtHeight'));
            const txtPinX: number = Number(cellMap.get('TxtPinX'));
            const txtPinY: number = Number(cellMap.get('TxtPinY'));
            const txtLocalPinX: number = Number(cellMap.get('TxtLocPinX'));
            const txtLocalPinY: number = Number(cellMap.get('TxtLocPinY'));

            // ==================== Extract Theme Style Properties ====================
            // Quick style cells control theme-based coloring and effects
            const QuickStyleLineColor: number = cellMap.get('QuickStyleLineColor') as number;
            const QuickStyleFillColor: number = cellMap.get('QuickStyleFillColor') as number;
            const QuickStyleShadowColor: number = cellMap.get('QuickStyleShadowColor') as number;
            const QuickStyleFontColor: number = cellMap.get('QuickStyleFontColor') as number;
            const QuickStyleLineMatrix: number = cellMap.get('QuickStyleLineMatrix') as number;
            const QuickStyleFillMatrix: number = cellMap.get('QuickStyleFillMatrix') as number;
            const QuickStyleEffectsMatrix: number = cellMap.get('QuickStyleEffectsMatrix') as number;
            const QuickStyleFontMatrix: number = cellMap.get('QuickStyleFontMatrix') as number;

            // ==================== Build Geometry Object ====================
            // Get master data if available (for fallback values)
            const master: VisioMaster = context.data.masters[shapeIndex.value];

            // Extract connection points (ports) for this shape
            const connections: VisioPort[] = getVisioPorts(shapeData, undefined, defaultWidth, defaultHeight);

            // Build normalized geometry object with all properties
            const Geometry: any = {
                N: 'Geometry',
                Row: undefined,
                Width: defaultWidth,
                Height: defaultHeight,
                LocPinX: defaultLocX,
                LocPinY: defaultLocY,
                beginX: defaultBeginX,
                beginY: defaultBeginY,
                endX: defaultEndX,
                endY: defaultEndY,
                masterID: master ? master.id : undefined,
                shapeName: master ? master.name : undefined,
                shapeType: master ? master.shapeType : undefined,
                ports: connections,
                fillColor: bgColor,
                shapeStyle: undefined,
                txtWidth: txtWidth,
                txtHeight: txtHeight,
                txtPinX: txtPinX,
                txtPinY: txtPinY,
                txtLocalPinX: txtLocalPinX,
                txtLocalPinY: txtLocalPinY,
                QuickStyleLineColor: QuickStyleLineColor,
                QuickStyleFillColor: QuickStyleFillColor,
                QuickStyleShadowColor: QuickStyleShadowColor,
                QuickStyleFontColor: QuickStyleFontColor,
                QuickStyleLineMatrix: QuickStyleLineMatrix,
                QuickStyleFillMatrix: QuickStyleFillMatrix,
                QuickStyleEffectsMatrix: QuickStyleEffectsMatrix,
                QuickStyleFontMatrix: QuickStyleFontMatrix
            };

            // ==================== Extract Geometry Rows ====================
            // Find all geometry sections defining the shape's path/outline
            const geometry: AugmentedGeometry[] = findAllGeometries(shapeData);
            Geometry.Row = geometry;

            // ==================== Extract Default Styles ====================
            // Find default styling properties for this shape type
            const defaultStyle: StyleEntry[] | undefined = findAllDefaultStyles(shapeData);
            if (defaultStyle) {
                Geometry.shapeStyle = defaultStyle;
            }

            // Store geometry data for later shape instance processing
            context.data.shapes.push(Geometry);
            shapeIndex.value++;
        }
    }

    // ==================== Process Master-Based and Group Shapes ====================
    // Normalize shapes array (handle single shape vs. array)
    const rawShapes: VisioShapeNode[] = Array.isArray(shapeElements)
        ? shapeElements
        : (shapeElements &&
           typeof shapeElements === 'object' &&
           shapeElements.$ &&
           (shapeElements.$.Master || isGroupShape(shapeElements) || shapeElements.$.Type === 'Foreign')) ||
           context.data.masters.length === 0
            ? [shapeElements as VisioShapeNode]
            : [];

    if (rawShapes) {
        rawShapes.forEach(async (shapeObj: any) => {
            // ==================== Process Master Shapes and Groups ====================
            if (shapeObj.$.Master || isGroupShape(shapeObj)) {
                const shapeData: VisioShapeNode = shapeObj;
                const attributes: ShapeAttributes = shapeData.$;
                const cells: VisioCell[] = Array.isArray(shapeData.Cell)
                    ? shapeData.Cell
                    : [shapeData.Cell];
                const section: VisioSection[] = shapeData.Section
                    ? (Array.isArray(shapeData.Section) ? shapeData.Section : [shapeData.Section])
                    : [];

                // ==================== Calculate Page-Related Values ====================
                // Convert page height from inches to pixels for coordinate transformation
                const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);

                // Map cells for efficient property lookup
                const cellMap: Map<string, CellMapValue> = mapCellValues(cells);
                const pinYExists: boolean = cellMap.has('PinY');

                // Extract geometry-level cells (for properties like NoShow)
                const getcell: Map<string, CellMapValue> = getGeometryCells(section, mapCellValues);

                // ==================== Handle Group Shapes ====================
                // Groups are containers with child shapes
                if (isGroupShape(shapeObj) && !(shapeObj.$.Master != null)) {
                    processImmediateSubShapes(shapeObj, context, resultShapes);
                } else {
                    // ==================== Handle Master-Based Shapes ====================
                    const masterId: string = getMasterId(shapeObj);

                    // Skip if this is a connector (handled separately)
                    if (!isConnectorShape(shapeObj, context)) {
                        const shape: VisioShape = new VisioShape();

                        // ==================== Set Basic Properties ====================
                        shape.id = attributes.ID;
                        shape.masterId = attributes.Master;
                        shape.name = attributes.NameU;
                        shape.type = attributes.Type != null ? attributes.Type : 'Shape';

                        // ==================== Handle Special Shape Types ====================
                        // 'Solid' shapes are typically background shapes with simple fill
                        if (shape.name === 'Solid') {
                            shape.fillColor = String(cellMap.get('FillForegnd') || 'transParent');
                        } else {
                            // Get default properties from the master
                            const defaultData: DefaultShapeData = setDefaultData(
                                context.data.shapes as unknown as GeometryDataObject[],
                                attributes
                            );

                            // Apply all common shape properties (position, size, style, etc.)
                            applyCommonNodeProperties(shape, {
                                cellMap,
                                attributes,
                                defaultData,
                                pageHeight,
                                pinYExists,
                                context,
                                getcell,
                                shapeData
                            });

                            // Assign shape to its layer
                            assignShapeLayer(shape, cellMap, context);
                        }

                        resultShapes.push(shape);
                    }
                }
            }
            // ==================== Process Raw/Path/Image Shapes ====================
            else if (shapeObj.$ && (shapeObj.$.Type !== 'Guide' || (shapeObj as any).$.Type === 'Foreign')) {
                const drawshapeData: VisioShapeNode = shapeObj;
                const attributes: ShapeAttributes = drawshapeData.$ || {} as ShapeAttributes;
                const cells: VisioCell[] = Array.isArray(drawshapeData.Cell)
                    ? drawshapeData.Cell
                    : [drawshapeData.Cell];
                const section: VisioSection[] = drawshapeData.Section
                    ? (Array.isArray(drawshapeData.Section) ? drawshapeData.Section : [drawshapeData.Section])
                    : [];

                // ==================== Extract Position and Dimensions ====================
                const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);
                const cellMap: Map<string, CellMapValue> = mapCellValues(cells);

                const drawshape: VisioShape = new VisioShape();

                // ==================== Calculate Y Position ====================
                // Visio uses bottom-left origin; we invert Y coordinate based on page height
                const drawpinY: number = cellMap.get('PinY') != null ? Number(cellMap.get('PinY')) : 0;
                const pinYValue: number = inchToPx(drawpinY);
                drawshape.offsetY = drawpinY ? pageHeight - pinYValue : 0;

                // ==================== Set Position and Dimensions ====================
                drawshape.id = attributes.ID;
                drawshape.offsetX = cellMap.get('PinX') != null ? Number(cellMap.get('PinX')) : 0;
                drawshape.width = cellMap.get('Width') != null ? Number(cellMap.get('Width')) : 1;
                drawshape.height = cellMap.get('Height') != null ? Number(cellMap.get('Height')) : 1;

                // ==================== Set Pivot Points (rotation center) ====================
                drawshape.pivotX = cellMap.get('LocPinX') != null ? cellMap.get('LocPinX') as number : 0.5;
                drawshape.pivotY = cellMap.get('LocPinY') != null ? cellMap.get('LocPinY') as number : 0.5;

                // ==================== Set Transformations ====================
                drawshape.flipX = cellMap.get('FlipX') != null ? Number(cellMap.get('FlipX')) : 0;
                drawshape.flipY = cellMap.get('FlipY') != null ? Number(cellMap.get('FlipY')) : 0;
                drawshape.rotateAngle = cellMap.get('Angle') != null ? cellMap.get('Angle') as number : 0;
                drawshape.cornerRadius = cellMap.get('Rounding') != null ? cellMap.get('Rounding') as number : 0;

                // ==================== Determine Shape Type and Extract Geometry ====================
                attributes.Name = attributes.Type === 'Foreign' ? 'Image' : 'Path';
                const attributeName: string = attributes.Name;

                // Extract connection points for this shape
                const shapePorts: VisioPort[] = getVisioPorts(drawshape as any, undefined, drawshape.width, drawshape.height);

                // Find geometry section containing path/shape definition
                const geometrySection: VisioSection[] = section.filter((sec: any) => sec && sec.$ && sec.$.N === 'Geometry');
                attributes.Row = geometrySection ? geometrySection[0].Row : undefined;

                // ==================== Build Default Data ====================
                const defaultData: any = {
                    Width: drawshape.width,
                    Height: drawshape.height,
                    Name: attributeName,
                    pinY: drawpinY,
                    pinX: drawshape.offsetX
                };
                defaultData.Ports = mergePorts(undefined, shapePorts);

                const merged: Attributes = {
                    ...defaultData,
                    ...attributes
                };

                // ==================== Handle Image/Foreign Shapes ====================
                if (attributeName === 'Image') {
                    const ForeignData: any = drawshapeData.ForeignData;
                    drawshape.type = ForeignData.$.CompressionType;
                    drawshape.foreignType = ForeignData.$.ForeignType;
                    drawshape.imageId = ForeignData.Rel.$['r:id'];
                }

                // ==================== Extract Visibility from Geometry ====================
                if (geometrySection && geometrySection[0].Cell) {
                    const geometryCellMap: Map<string, CellMapValue> = mapCellValues(geometrySection[0].Cell);
                    drawshape.visibility = geometryCellMap.get('NoShow') ? geometryCellMap.get('NoShow') === '1' : false;
                }

                // ==================== Set Final Properties ====================
                drawshape.pinY = drawpinY;
                drawshape.shape = determineShapeType(merged, undefined, undefined, undefined, context);
                drawshape.style = parseVisioNodeStyle(drawshapeData, context, undefined, attributeName);
                drawshape.annotation = VisioNodeAnnotation.fromJs(drawshapeData, defaultData);
                drawshape.constraints = applyConstraints(drawshape, cellMap);
                drawshape.shadow = parseVisioNodeShadow(cellMap, context);
                drawshape.ports = defaultData.Ports || [];

                // ==================== Attach Media Data for Images ====================
                if (drawshape.shape && drawshape.shape.type === 'Image' && drawshape.imageId) {
                    const media: VisioMedia = context.data.medias[drawshape.imageId];
                    if (media && media.dataUrl) {
                        drawshape.shape.source = media.dataUrl;
                    }
                }

                assignShapeLayer(drawshape, cellMap, context);
                resultShapes.push(drawshape);
            }
        });
    }

    return resultShapes;
}

/**
 * Applies common node properties to a VisioShape instance from parsed cell data.
 * This function consolidates the logic for setting position, dimensions, styling,
 * theme colors, transformations, and constraints that apply to most shape types.
 *
 * It handles:
 * - Position (offsetX, offsetY) with coordinate system conversion
 * - Dimensions (width, height)
 * - Rotation and flipping
 * - Pivot points for rotation center
 * - Quick style colors and matrices
 * - Annotations (text)
 * - Styling (fill, stroke, gradients)
 * - Shadows and constraints
 *
 * This function extracts values from the cell map with appropriate fallbacks to
 * default data from the shape's master definition.
 *
 * @param {VisioShape} shape - The VisioShape instance to populate with properties.
 * @param {ApplyCommonNodePropertiesArgs} args - Configuration object containing parsed data.
 * @returns {void} - Modifies the shape parameter in place.
 *
 * @example
 * applyCommonNodeProperties(shape, {
 *     cellMap: cellValueMap,
 *     attributes: shapeAttributes,
 *     defaultData: masterDefaults,
 *     pageHeight: 800,
 *     pinYExists: true,
 *     context: parsingContext,
 *     getcell: geometryCellMap,
 *     shapeData: rawXmlData
 * });
 *
 * @private
 */
export function applyCommonNodeProperties(
    shape: any,
    args: ApplyCommonNodePropertiesArgs
): void {
    const { cellMap, attributes, defaultData, pageHeight, pinYExists, context, getcell, shapeData } = args;

    // ==================== Set Name/Label ====================
    // Use provided name, fall back to master name, or Image or use generic 'Shape'
    attributes.Name = (attributes.Type === 'Foreign') ? 'Image' : attributes.Name ? attributes.Name : defaultData.Name ? defaultData.Name : 'Shape';

    // ==================== Handle Image/Foreign Shapes ====================
    if (attributes.Name === 'Image') {
        const ForeignData: any = args.shapeData.ForeignData;
        shape.type = ForeignData.$.CompressionType;
        shape.foreignType = ForeignData.$.ForeignType;
        shape.imageId = ForeignData.Rel.$['r:id'];
    }

    // ==================== Extract Default Styling ====================
    // Convert style array to object for easier property access
    const defaultShapeStyle: Record<string, CellMapValue> = shapeStyleToObject(defaultData.shapeStyle);

    // ==================== Extract Height and Connection Points ====================
    const shapeHeight: number = cellMap.get('Height') ? Number(cellMap.get('Height')) : defaultData.Height;


    // ==================== Set Position ====================
    // X position from PinX cell
    shape.offsetX = cellMap.get('PinX') != null ? Number(cellMap.get('PinX')) : 0;

    // Y position with coordinate system conversion (Visio: bottom-left origin)
    const pinYValue: number = pinYExists
        ? inchToPx(Number(cellMap.get('PinY')))
        : Number(cellMap.get('PinY'));
    shape.offsetY = pinYExists ? pageHeight - pinYValue : 0;

    // ==================== Set Dimensions ====================
    shape.width = cellMap.get('Width') != null
        ? Number(cellMap.get('Width'))
        : (defaultData && defaultData.Width) !== undefined
            ? defaultData.Width
            : 1;

    shape.height = cellMap.get('Height') != null
        ? Number(cellMap.get('Height'))
        : (defaultData && defaultData.Height) !== undefined
            ? defaultData.Height
            : 1;
    const shapePorts: VisioPort[] = getVisioPorts(args.shapeData, args.defaultData, shape.width, shape.height);

    // Merge ports from both shape instance and master
    defaultData.Ports = mergePorts(defaultData.Ports, shapePorts);

    // ==================== Set Pivot Points (Rotation Center) ====================
    shape.pivotX = cellMap.get('LocPinX') != null ? cellMap.get('LocPinX') : 0.5;
    shape.pivotY = cellMap.get('LocPinY') != null ? cellMap.get('LocPinY') : 0.5;

    // ==================== Set Rotation and Corner Radius ====================
    shape.rotateAngle = cellMap.get('Angle') != null ? cellMap.get('Angle') : 0;
    shape.cornerRadius = cellMap.get('Rounding') != null ? cellMap.get('Rounding') : defaultShapeStyle.cornerRadius;

    // ==================== Store PinY for Reference ====================
    shape.pinY = pinYValue;

    // ==================== Set Text Annotation ====================
    shape.annotation = VisioNodeAnnotation.fromJs(shapeData, (defaultData as any));

    // ==================== Set Quick Style Line Color ====================
    shape.QuickLineColor = cellMap.get('QuickStyleLineColor') != null ? Number(cellMap.get('QuickStyleLineColor')) :
        (defaultData && defaultData.QuickStyleLineColor) !== undefined ? Number(defaultData.QuickStyleLineColor) : undefined;

    // ==================== Set Quick Style Fill Color ====================
    shape.QuickFillColor = cellMap.get('QuickStyleFillColor') != null ? Number(cellMap.get('QuickStyleFillColor')) :
        (defaultData && defaultData.QuickStyleFillColor) !== undefined ? Number(defaultData.QuickStyleFillColor) : undefined;

    // ==================== Set Quick Style Shadow Color ====================
    shape.QuickShadowColor = cellMap.get('QuickStyleShadowColor') != null ? Number(cellMap.get('QuickStyleShadowColor')) :
        (defaultData && defaultData.QuickStyleShadowColor) !== undefined ? Number(defaultData.QuickStyleShadowColor) : undefined;

    // ==================== Set Quick Style Line Matrix ====================
    shape.QuickLineMatrix = cellMap.get('QuickStyleLineMatrix') != null ? Number(cellMap.get('QuickStyleLineMatrix')) :
        (defaultData && defaultData.QuickStyleLineMatrix) !== undefined ? Number(defaultData.QuickStyleLineMatrix) : undefined;

    // ==================== Set Quick Style Fill Matrix ====================
    shape.QuickFillMatrix = cellMap.get('QuickStyleFillMatrix') != null ? Number(cellMap.get('QuickStyleFillMatrix')) :
        (defaultData && defaultData.QuickStyleFillMatrix) !== undefined ? Number(defaultData.QuickStyleFillMatrix) : undefined;

    // ==================== Set Quick Style Effects Matrix ====================
    shape.QuickShadowMatrix = cellMap.get('QuickStyleEffectsMatrix') != null ? Number(cellMap.get('QuickStyleEffectsMatrix')) :
        (defaultData && defaultData.QuickStyleEffectsMatrix) !== undefined ? Number(defaultData.QuickStyleEffectsMatrix) : undefined;

    // ==================== Set Theme and Color Scheme Indices ====================
    shape.ThemeIndex = cellMap.get('ThemeIndex') != null ? Number(cellMap.get('ThemeIndex')) : undefined;
    shape.ColorSchemeIndex = cellMap.get('ColorSchemeIndex') != null ? Number(cellMap.get('ColorSchemeIndex')) : undefined;

    // ==================== Set Flip Transformations ====================
    shape.flipX = cellMap.get('FlipX') != null ? Number(cellMap.get('FlipX')) : 0;
    shape.flipY = cellMap.get('FlipY') != null ? Number(cellMap.get('FlipY')) : 0;

    // ==================== Set Display and Interaction Properties ====================
    // Extract visibility from geometry cells (NoShow flag)
    shape.visibility = getcell.has('NoShow') ? getcell.get('NoShow') === '1' : false;

    // Extract comment/tooltip
    shape.tooltip = cellMap.get('Comment') != null ? cellMap.get('Comment') : '';

    // Extract glue type (determines connector attachment behavior)
    shape.glueValue = cellMap.get('GlueType') != null ? cellMap.get('GlueType') : undefined;

    // ==================== Set Visual Styling ====================
    shape.style = parseVisioNodeStyle(shapeData, context, defaultShapeStyle, undefined);

    // ==================== Determine Shape Type and Geometry ====================
    shape.shape = determineShapeType(attributes, (defaultData as any), shapeData, shape, context);

    // ==================== Attach Media Data for Images ====================
    if (shape.shape && shape.shape.type === 'Image' && shape.imageId) {
        const media: VisioMedia = context.data.medias[shape.imageId];
        if (media && media.dataUrl) {
            shape.shape.source = media.dataUrl;
        }
    }

    // ==================== Apply Edit Constraints ====================
    shape.constraints = applyConstraints(shape, cellMap);

    // ==================== Set Shadow Effects ====================
    shape.shadow = parseVisioNodeShadow(cellMap, context);

    // ==================== Set Connection Points ====================
    shape.ports = defaultData.Ports;

    // ==================== Deep Annotation Merge for Line Callouts ====================
    if (shape.shape && attributes && attributes.Name === 'Line Callout') {
        // then chek if it has shape.annotation, then set the
        if (shape.annotation.content === '') {
            // Gather all texts from children and merge
            const deepTexts: string[] = collectDeepAnnotationText(shapeData); // 'shape' is the XML group node
            if (deepTexts.length > 0) {
                const merged: string = deepTexts.join('\n');

                // Replace the group’s auto-generated single annotation
                shape.annotation = {
                    content: merged
                } as VisioNodeAnnotation;
            }
        }
        // also avoid the flip and rotation for line callouts
        shape.flipX = 0;
        shape.flipY = 0;
        shape.rotateAngle = 0;
    }
}

/**
 * Converts a style object (or array) to a standardized Record format.
 * This helper function normalizes different style representations into
 * a consistent key-value object that can be easily indexed and merged.
 *
 * Handles three input formats:
 * 1. Array of StyleEntry objects - converted to object with key as property name
 * 2. Plain object - shallow copied to preserve existing structure
 * 3. Other types (null, undefined, etc.) - returns empty object
 *
 * @param {StyleEntry[] | Record<string, CellMapValue> | undefined} style - The style data.
 * @returns {Record<string, CellMapValue>} A standardized object with style properties.
 *
 * @example
 * // Array input
 * const styleArray = [
 *     { key: 'cornerRadius', value: 5 },
 *     { key: 'strokeWidth', value: 2 }
 * ];
 * const result = shapeStyleToObject(styleArray);
 * // result: { cornerRadius: 5, strokeWidth: 2 }
 *
 * // Object input
 * const styleObj = { fillColor: '#FF0000', strokeWidth: 2 };
 * const result = shapeStyleToObject(styleObj);
 * // result: { fillColor: '#FF0000', strokeWidth: 2 }
 *
 * @private
 */
function shapeStyleToObject(
    style: StyleEntry[] | Record<string, CellMapValue> | undefined
): Record<string, CellMapValue> {
    // ==================== Handle Array Format ====================
    // Array of StyleEntry objects - iterate and build object
    if (Array.isArray(style)) {
        const out: Record<string, CellMapValue> = {};
        for (const item of style as StyleEntry[]) {
            // Only add if item has a valid string key
            if (item && typeof item.key === 'string') {
                out[item.key] = item.value;
            }
        }
        return out;
    }

    // ==================== Handle Object Format ====================
    // Plain object - create shallow copy
    if (style && typeof style === 'object') {
        return { ...(style as Record<string, CellMapValue>) };
    }

    // ==================== Handle Invalid/Undefined ====================
    // Return empty object for null, undefined, or other types
    return {};
}

/**
 * Finds and extracts default style properties from a shape's cell data.
 * This function identifies style-related cells and builds an array of
 * StyleEntry objects representing the shape's inherent styling.
 *
 * Properties extracted:
 * - Corner radius (from Rounding cell)
 * - Stroke width (from LineWeight cell)
 * - Fill pattern (from FillPattern cell)
 *
 * Uses provided default values as fallbacks if cells are missing or invalid.
 *
 * @param {VisioShapeNode | null | undefined} shapeData - The raw shape XML data containing Cell elements.
 * @returns {StyleEntry[]} An array of style entries with key and value properties.
 *                         Returns empty array if shapeData is null/undefined.
 *
 * @example
 * const styles = findAllDefaultStyles(shapeXmlData);
 * // Returns:
 * // [
 * //     { key: 'cornerRadius', value: 0 },
 * //     { key: 'strokeWidth', value: 2.5 },
 * //     { key: 'FillPattern', value: undefined }
 * // ]
 *
 * @private
 */
function findAllDefaultStyles(shapeData: VisioShapeNode | null | undefined): StyleEntry[] {
    if (!shapeData) { return []; }

    const cells: VisioCell[] = Array.isArray(shapeData.Cell)
        ? shapeData.Cell
        : [shapeData.Cell];

    // No cell data available - return empty
    if (!cells || cells.length === 0) { return []; }

    const entries: StyleEntry[] = [];

    /**
     * Helper function to add style entries with fallback defaults.
     * Checks if value is missing/invalid (undefined, null, empty string, NaN)
     * and uses defaultValue if so.
     *
     * @param {string} key - The style property name.
     * @param {CellMapValue} value - The parsed cell value.
     * @param {CellMapValue} defaultValue - Fallback value if cell value is invalid.
     * @returns {void}
     */
    const defaultStyles: (key: string, value: CellMapValue, defaultValue: CellMapValue) => void = (
        key: string,
        value: CellMapValue,
        defaultValue: CellMapValue
    ): void => {
        // Check if value is NaN (results from Number() on invalid input)
        const invalidNumber: boolean = typeof value === 'number' && Number.isNaN(value);

        // Check if value is missing (undefined, null, empty string, or NaN)
        const isMissing: boolean = value === undefined || value === null || value === '' || invalidNumber;

        // Push entry with provided value or default fallback
        entries.push({ key, value: isMissing ? defaultValue : value });
    };

    // ==================== Extract Corner Radius ====================
    // Rounding cell defines corner radius (0 = no rounding)
    const rounding: string = getCellValue(cells, 'Rounding');
    defaultStyles('cornerRadius', Number(rounding), 0);

    // ==================== Extract Stroke Width ====================
    // LineWeight cell defines line/stroke thickness
    const lineWidth: string = getCellValue(cells, 'LineWeight');
    defaultStyles('strokeWidth', Number(lineWidth), 0);

    // ==================== Extract Fill Pattern ====================
    // FillPattern cell defines pattern type (solid, hatched, etc.)
    const fillPattern: string = getCellValue(cells, 'FillPattern');
    defaultStyles('FillPattern', fillPattern, undefined);

    // ==================== Extract Fill Foreground Transparency ====================
    // FillForegndTrans cell defines foreground fill transparency (0-100% or 0-1)
    const FillForegndTrans: string = getCellValue(cells, 'FillForegndTrans');
    defaultStyles('FillForegndTrans', Number(FillForegndTrans), 0);
    return entries;
}

/**
 * Merges two arrays of ports into a single deduplicated array.
 * Uses a Map to maintain uniqueness by port ID, allowing newer ports
 * to override older ones with the same ID.
 *
 * Processing order:
 * 1. Add all ports from basePorts to the map
 * 2. Add/update ports from updatePorts (newer values take precedence)
 * 3. Return all unique ports as array
 *
 * This is useful when combining master ports with shape-specific ports,
 * where shape-specific ports should override master defaults.
 *
 * @param {VisioPort[]} basePorts - The base/original port array (may be empty).
 * @param {VisioPort[]} updatePorts - The ports to merge in (may be empty).
 * @returns {VisioPort[]} A merged array of unique ports indexed by ID.
 *
 * @example
 * const masterPorts = [
 *     { id: 'port0', x: 0, y: 0, ... },
 *     { id: 'port1', x: 100, y: 0, ... }
 * ];
 * const shapePorts = [
 *     { id: 'port1', x: 100, y: 50, ... },  // Updated position
 *     { id: 'port2', x: 50, y: 100, ... }   // New port
 * ];
 * const merged = mergePorts(masterPorts, shapePorts);
 * // merged contains 3 ports: port0 (original), port1 (updated), port2 (new)
 *
 * @private
 */
function mergePorts(basePorts: VisioPort[], updatePorts: VisioPort[]): VisioPort[] {
    // ==================== Initialize Port Map ====================
    // Map maintains uniqueness by port ID
    const portMap: Map<string, VisioPort> = new Map<string, VisioPort>();

    // ==================== Add Base Ports ====================
    // Add all ports from base array (or empty if base is undefined)
    (basePorts ? basePorts : []).forEach((port: any) => portMap.set(port.id, port));

    // ==================== Add/Update Ports ====================
    // Add ports from update array, overwriting duplicates by ID
    (updatePorts ? updatePorts : []).forEach((port: any) => portMap.set(port.id, port));

    // ==================== Return Merged Array ====================
    // Convert map values back to array format
    return Array.from((portMap as any).values());
}

/**
 * Processes immediate child shapes of a group/container shape.
 * This function recursively builds the shape tree, creating VisioShape instances
 * for all children and establishing parent-child relationships.
 *
 * Processing steps:
 * 1. Extract child shapes from the group's Shapes.Shape property
 * 2. Recursively process each child (may be a nested group or regular shape)
 * 3. Collect child IDs and establish parentId references
 * 4. Create the parent group node with children list
 * 5. Add group node after all children (maintains proper z-order)
 *
 * This ensures that when shapes are rendered, children appear before their
 * parent group, allowing proper rendering of nested structures.
 *
 * @param {VisioShapeNode} shape - The group shape XML object containing Shapes.Shape elements.
 * @param {ParsingContext} context - Parser context with page, themes, and master data.
 * @param {VisioShape[]} resultShapes - Output array to accumulate parsed shapes (modified in place).
 * @returns {void} - Modifies resultShapes array by adding child and group shapes.
 *
 * @example
 * // Input: Group shape with 3 children
 * // Output: resultShapes gets 4 new entries (3 children + 1 group)
 * processImmediateSubShapes(groupXml, context, resultShapes);
 *
 * @private
 */
function processImmediateSubShapes(
    shape: VisioShapeNode,
    context: ParsingContext,
    resultShapes: VisioShape[]
): void {
    // ==================== Validate Input ====================
    if (!shape || !shape.$) { return; }

    // ==================== Extract Group Information ====================
    const groupId: string = shape.$.ID;
    const children: OneOrMany<VisioShapeNode> | undefined = shape.Shapes.Shape;

    // No child shapes
    if (!children) { return; }

    // ==================== Create Parent Group Node ====================
    const attributes: ShapeAttributes = shape.$;
    const cells: VisioCell[] = Array.isArray(shape.Cell)
        ? shape.Cell
        : shape.Cell ? [shape.Cell] : [];
    const section: VisioSection[] = shape.Section
        ? (Array.isArray(shape.Section) ? shape.Section : [shape.Section])
        : [];
    // Find Geometry section which contains visibility properties
    const userSection: VisioSection = section.find((s: VisioSection) => s && s.$ && s.$.N === 'User');
    let excludeFromProcessing: boolean  = false;
    if (userSection && !Array.isArray(userSection.Row) && userSection.Row.$.N === 'visNavOrder') {
        excludeFromProcessing = true;
    }
    // ==================== Process Child Shapes ====================
    // Normalize to array (handle single child vs. multiple)
    const subShapes: VisioShapeNode[] = Array.isArray(children) ? children : [children];
    const childIds: string[] = [];

    for (const sub of subShapes) {
        // Validate that child references a valid master
        const masterId: string = getMasterId(sub);
        if (!isValidMasterId(masterId) && !(sub.Text && sub.Text.value) && !excludeFromProcessing) {
            return null;
        }

        // Recursively build node for this sub-shape
        const child: VisioShape | null = createNodeForShape(sub, context, resultShapes);

        // If successfully created, record parent relationship
        if (child && child.id) {
            (child as VisioShape & { parentId: string }).parentId = groupId;
            childIds.push(child.id);
        }
    }
    // ==================== Extract Coordinate System Data ====================
    const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);
    const cellMap: Map<string, CellMapValue> = mapCellValues(cells);
    const pinYExists: boolean = cellMap.has('PinY');

    // Extract geometry-level cells (for properties like NoShow)
    const getcell: Map<string, CellMapValue> = getGeometryCells(section, mapCellValues);

    // ==================== Get Default Group Properties ====================
    // For groups, setDefaultData returns {} (no master reference)
    const defaultData: DefaultShapeData = setDefaultData(
        context.data.shapes as unknown as GeometryDataObject[],
        attributes
    );

    // ==================== Build Group Node ====================
    const groupNode: VisioShape = new VisioShape();
    groupNode.id = groupId;
    groupNode.masterId = attributes.Master;
    groupNode.name = attributes.NameU;
    groupNode.type = attributes.Type != null ? attributes.Type : 'Shape';

    // ==================== Apply Common Properties ====================
    // Populate position, size, style, etc. for the group
    applyCommonNodeProperties(groupNode, {
        cellMap,
        attributes,
        defaultData,
        pageHeight,
        pinYExists,
        context,
        getcell,
        shapeData: shape
    });

    // ==================== Set Children Relationship ====================
    (groupNode as VisioShape & { children: string[] }).children = childIds;

    // ==================== Assign Layer ====================
    assignShapeLayer(groupNode, cellMap, context);

    // ==================== Add Group After Children ====================
    // This ordering ensures children render before parent in z-order
    resultShapes.push(groupNode);
}

/**
 * Creates a VisioShape node for a single shape object and adds it to the result array.
 * This is a helper function used when recursively processing grouped shapes.
 *
 * The function:
 * 1. Validates the shape object
 * 2. Skips connectors (handled separately)
 * 3. Extracts all cell properties and styling
 * 4. Creates and populates a VisioShape instance
 * 5. Adds the shape to the result array
 *
 * This function is called during recursive processing of groups to build
 * individual nodes for each child shape.
 *
 * @param {VisioShapeNode} shapeObj - The raw shape XML object to convert.
 * @param {ParsingContext} context - Parser context with page, themes, and master data.
 * @param {VisioShape[]} resultShapes - Output array to accumulate parsed shapes (modified in place).
 * @returns {VisioShape | null} The created VisioShape instance, or null if shape is invalid/skip (e.g., connector).
 *
 * @example
 * const childShape = createNodeForShape(childShapeXml, context, resultShapes);
 * if (childShape) {
 *     console.log(`Created shape: ${childShape.id}`);
 * }
 *
 * @private
 */
function createNodeForShape(
    shapeObj: VisioShapeNode,
    context: ParsingContext,
    resultShapes: VisioShape[]
): VisioShape | null {
    // ==================== Validate Input ====================
    if (!shapeObj || !shapeObj.$) { return null; }

    // ==================== Extract Properties ====================
    const attributes: ShapeAttributes = shapeObj.$;
    const cells: VisioCell[] = Array.isArray(shapeObj.Cell)
        ? shapeObj.Cell
        : shapeObj.Cell ? [shapeObj.Cell] : [];
    const section: VisioSection[] = shapeObj.Section
        ? (Array.isArray(shapeObj.Section) ? shapeObj.Section : [shapeObj.Section])
        : [];

    // ==================== Skip Connectors ====================
    // Connectors are handled separately and not included as regular shapes
    if (isConnectorShape(shapeObj, context)) { return null; }

    // ==================== Extract Coordinate System Data ====================
    const pageHeight: number = inchToPx(context.data.currentPage.pageHeight);
    const cellMap: Map<string, CellMapValue> = mapCellValues(cells);
    const pinYExists: boolean = cellMap.has('PinY');

    // Extract geometry-level cells (for NoShow property)
    const getcell: Map<string, CellMapValue> = getGeometryCells(section, mapCellValues);

    // ==================== Initialize Shape ====================
    const shape: any = new VisioShape();
    shape.id = attributes.ID;
    shape.masterId = attributes.Master;
    shape.name = attributes.NameU;
    shape.type = attributes.Type != null ? attributes.Type : 'Shape';

    // ==================== Handle Special Shape Type ====================
    // 'Solid' shapes are background/fill shapes with no complex styling
    if (shape.name === 'Solid') {
        shape.fillColor = cellMap.get('FillForegnd') || 'transParent';
    } else {
        // ==================== Get Master Default Data ====================
        const defaultData: DefaultShapeData = setDefaultData(
            context.data.shapes as unknown as GeometryDataObject[],
            attributes
        );

        // ==================== Apply All Common Properties ====================
        applyCommonNodeProperties(shape, {
            cellMap,
            attributes,
            defaultData,
            pageHeight,
            pinYExists,
            context,
            getcell,
            shapeData: shapeObj
        });

        // ==================== Assign to Layer ====================
        assignShapeLayer(shape, cellMap, context);
    }

    // ==================== Add to Result Collection ====================
    resultShapes.push(shape);

    return shape;
}

/**
 * Extracts geometry-level cell values from a shape's Section array.
 * Geometry cells contain shape-specific rendering properties like the NoShow flag.
 *
 * This function searches through sections for the 'Geometry' section,
 * then converts its cells to a Map for efficient property lookup.
 *
 * Returns an empty map if no Geometry section is found.
 *
 * @param {VisioSection[]} section - Array of Section objects from the shape XML.
 * @param {Function} cellMapper - Function to convert cell array to Map (typically mapCellValues).
 * @returns {Map<string, CellMapValue>} Map of geometry cell name -> value, or empty map if not found.
 *
 * @example
 * const geometryCells = getGeometryCells(sections, mapCellValues);
 * const noShow = geometryCells.get('NoShow'); // '0' or '1'
 *
 * @private
 */
function getGeometryCells(
    section: VisioSection[],
    cellMapper: (cells: VisioCell[]) => Map<string, CellMapValue>
): Map<string, CellMapValue> {
    // ==================== Search for Geometry Section ====================
    for (const sec of section || []) {
        // Check if this is the Geometry section and has cells
        if (sec.$.N === 'Geometry' && sec.Cell) {
            // Normalize cell array
            const geometryCells: VisioCell[] = Array.isArray(sec.Cell) ? sec.Cell : [sec.Cell];

            // Convert to Map and return
            return cellMapper(geometryCells);
        }
    }

    // ==================== No Geometry Section Found ====================
    // Return empty map as fallback
    return new Map<string, CellMapValue>();
}

/**
 * Assigns a shape to its appropriate layer and records the relationship.
 * Layers are organizational containers that allow grouping and visibility control.
 *
 * This function:
 * 1. Extracts the LayerMember cell value (layer index)
 * 2. Sets the shape's layerMember property
 * 3. Adds the shape ID to the layer's objects list
 *
 * Handles validation to ensure the layer index is valid before assignment.
 *
 * @param {VisioShape} shape - The shape to assign to a layer.
 * @param {Map<string, CellMapValue>} cellMap - Map of cell name -> value for the shape.
 * @param {ParsingContext} context - Parser context containing current page and layer data.
 * @returns {void} - Modifies shape.layerMember and updates context layer data.
 *
 * @example
 * assignShapeLayer(shape, cellMap, context);
 * // Now shape.layerMember = 0 and context.data.currentPage.layers[0].objects includes shape.id
 *
 * @private
 */
function assignShapeLayer(
    shape: VisioShape,
    cellMap: Map<string, CellMapValue>,
    context: ParsingContext
): void {
    // ==================== Validate Shape ID ====================
    const shapeId: string = shape.id;
    if (!shapeId) {
        return;
    }

    // ==================== Extract Layer Index ====================
    // LayerMember cell contains the layer index (0-based)
    const layerValue: CellMapValue = cellMap.get('LayerMember') as CellMapValue;
    const layerIndex: number = layerValue != null ? parseInt(layerValue.toString(), 10) : 0;

    // ==================== Set Shape Layer Reference ====================
    shape.layerMember = layerIndex;

    // ==================== Add Shape to Layer's Objects ====================
    const layers: VisioLayer[] = context.data.currentPage.layers;

    // Validate layer exists and index is in bounds
    if (Array.isArray(layers) && layers.length > 0 && layerIndex >= 0 && layers[parseInt(layerIndex.toString(), 10)]) {
        // Add shape ID to layer's object list
        layers[parseInt(layerIndex.toString(), 10)].objects.push(shape.id);
    }
}

/**
 * Applies lock/constraint properties from cell map to a shape object.
 * Converts lock cell values to camelCase properties on the shape.
 *
 * @param {VisioShape} shape - The shape object to apply constraints to (modified in place).
 * @param {Map<string, CellMapValue>} cellMap - Map of cell names to values.
 * @returns {void} - Modifies shape parameter in place.
 *
 * @example
 * const cellMap = new Map([['LockWidth', '1'], ['LockHeight', '0']]);
 * applyConstraints(shape, cellMap);
 * // shape.lockWidth = true, shape.lockHeight = false
 *
 * @private
 */
function applyConstraints(shape: VisioShape, cellMap: Map<string, CellMapValue>): void {
    // ==================== List of Lock Properties ====================
    const lockKeys: string[] = [
        'LockWidth',
        'LockHeight',
        'LockAspect',
        'LockMoveY',
        'LockMoveX',
        'LockRotate',
        'LockDelete',
        'LockSelect',
        'LockTextEdit',
        'Comment',
        'GlueType',
        'AllowDrop'
    ];

    // ==================== Apply Each Lock Property ====================
    for (const key of lockKeys) {
        const value: CellMapValue = cellMap.get(key);
        // Convert to camelCase property and evaluate as boolean (non-'0' = true)
        (shape as any)[toCamelCase(key)] = value != null && value !== '0';
    }
}

/**
 * Recursively collects all text content from a Visio shape node and its children.
 * This function traverses the shape hierarchy, extracting text from the
 * Text property of each shape node and aggregating it into a single array.
 * It is useful for gathering annotations from grouped shapes or complex structures.
 * @param {any} shapeNode - The Visio shape node to extract text from.
 * @returns {string[]} An array of text strings collected from the shape and its descendants.
 * @example
 * const texts = collectDeepText(shapeNode);
 * console.log(texts); // Outputs all text content from the shape and its children
 * @private
 */
function collectDeepAnnotationText(shapeNode: any): string[] {
    if (!shapeNode) { return []; }

    const results: string[] = [];

    // 1) Text on this node
    if (shapeNode.Text && typeof shapeNode.Text.value === 'string') {
        const text: string = (shapeNode.Text.value as string).trim();
        if (text.length > 0) { results.push(text); }
    }

    // 2) Descend into children
    if (shapeNode.Shapes && shapeNode.Shapes.Shape) {
        const children: any[] = Array.isArray(shapeNode.Shapes.Shape)
            ? shapeNode.Shapes.Shape
            : [shapeNode.Shapes.Shape];

        for (const c of children) {
            results.push(...collectDeepAnnotationText(c));
        }
    }

    return results;
}
