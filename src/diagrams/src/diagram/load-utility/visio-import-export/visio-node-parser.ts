import { VisioNodeAnnotation } from './visio-annotations';
import { getCellValue, isConnectorShape } from './visio-connectors';
import { applyParentTransformToCellMap, ensureArray, getCellMap, getNumberFromCellMap, inchToPx, isGroupShape, mapCellValues, mergeCellMaps, toCamelCase } from './visio-core';
import { ParsingContext } from './visio-import-export';
import { getVisioPorts, parseVisioNodeShadow, parseVisioNodeStyle } from './visio-model-parsers';
import { VisioLayer, VisioNodeStyle, VisioShape } from './visio-models';
import { allGeometrySectionsNoFill, allGeometrySectionsNoLine, areAllGeometrySectionsHidden, determineDefaultNodeShape, mergeGeometrySectionsByIndex, resolveMasterSourceForNode, resolveShapeNameForMapping, tryDetermineSemanticGroupShape } from './visio-nodes';
import {
    CellMapValue,
    VisioPort,
    VisioShapeNode,
    VisioSection,
    ShapeAttributes,
    VisioCell,
    OneOrMany,
    StyleEntry,
    ApplyCommonNodePropertiesArgs,
    DetermineShapeResult,
    GroupTransform,
    DefaultShapeData,
    VisioMedia,
    ParsedXmlObject,
    ForeignDataBlock,
    XmlStringMap
} from './visio-types';

/**
 * Parses Visio shape elements into EJ2 diagram shapes.
 * Iterates through shape nodes, delegates parsing to `parserVisioShapeNode`,
 * and collects the resulting VisioShape objects.
 *
 * @param {object} shapeObj - Input object containing shape nodes
 * @param {OneOrMany<VisioShapeNode>} [shapeObj.Shape] - Shape node(s) to parse
 * @param {ParsingContext} context - Parsing context with master index
 * @returns {VisioShape[]} Array of parsed VisioShape objects
 */
export function parserVisioShape(
    shapeObj: { Shape?: OneOrMany<VisioShapeNode> },
    context: ParsingContext
): VisioShape[] {
    const shapeElements: OneOrMany<VisioShapeNode> | undefined = shapeObj && shapeObj.Shape ? shapeObj.Shape : undefined;
    const visioShapes: VisioShapeNode[] = shapeElements
        ? (Array.isArray(shapeElements) ? shapeElements : [shapeElements])
        : [];

    const result: VisioShape[] = [];
    for (let i: number = 0; i < visioShapes.length; i++) {
        const visioShape: VisioShapeNode = visioShapes[parseInt(i.toString(), 10)];
        if (!visioShape || !(visioShape as VisioShapeNode).$) {
            continue;
        }
        const parsedShapes: VisioShape[] = parserVisioShapeNode(visioShape, context);
        if (parsedShapes && parsedShapes.length > 0) {
            for (let k: number = 0; k < parsedShapes.length; k++) {
                result.push(parsedShapes[parseInt(k.toString(), 10)]);
            }
        }
    }
    return result;
}

/**
 * Routes parsing of a Visio shape node.
 * Decides whether the node is a connector, group, or vertex shape
 * and delegates to the appropriate parser.
 *
 * @param {VisioShapeNode} pageNode - Shape node to parse
 * @param {ParsingContext} context - Parsing context with master index
 * @param {string} [parentMasterId] - Optional parent master ID for nested shapes
 * @param {GroupTransform} [parentTx] - Optional parent transform for child positioning
 * @returns {VisioShape[]} Parsed Visio shapes
 */
function parserVisioShapeNode(
    pageNode: VisioShapeNode,
    context: ParsingContext,
    parentMasterId?: string,
    parentTx?: GroupTransform
): VisioShape[] {
    if (!pageNode || !(pageNode as VisioShapeNode).$) {
        return [];
    }
    if (isConnectorShape(pageNode, context)) {
        return [];
    }

    if (isGroupShape(pageNode)) {
        return parseGroupShape(pageNode, context, parentMasterId, parentTx);
    }
    return parseVertexShape(pageNode, context, parentMasterId, parentTx);
}

/**
 * Parses a Visio group shape node.
 * Builds merged cell maps, resolves master references, applies transforms,
 * constructs default data, and recursively parses child shapes.
 * If the group maps to a supported semantic EJ2 type (BPMN/UML/Image),
 * returns it directly as a single node.
 *
 * @param {VisioShapeNode} groupNode - Group shape node to parse
 * @param {ParsingContext} context - Parsing context with master index
 * @param {string} [parentMasterId] - Optional parent master ID for nested groups
 * @param {GroupTransform} [parentTx] - Optional parent transform for child positioning
 * @returns {VisioShape[]} Parsed group shape(s) including children
 */
function parseGroupShape(
    groupNode: VisioShapeNode,
    context: ParsingContext,
    parentMasterId?: string,
    parentTx?: GroupTransform
): VisioShape[] {
    const resultShapes: VisioShape[] = [];

    // Extract group attributes
    const groupAttributes: ShapeAttributes | undefined = (groupNode as VisioShapeNode).$ ? (groupNode as VisioShapeNode).$ : undefined;
    // Keep owning master id for nested groups that only have MasterShape.
    let groupMasterId: string = '';
    if (groupAttributes && groupAttributes.Master != null) {
        groupMasterId = String(groupAttributes.Master);
    } else if (parentMasterId && parentMasterId.length > 0) {
        groupMasterId = String(parentMasterId);
    }

    // Get group's cell map (instance cells)
    const groupInstanceCellMap: Map<string, CellMapValue> = getCellMap(groupNode);

    // Resolve master and merge cells (master as base, instance overrides)
    const groupMasterNode: VisioShapeNode | null = resolveMasterSourceForNode(groupNode, context, parentMasterId);
    let groupMergedCellMap: Map<string, CellMapValue> = groupMasterNode
        ? mergeCellMaps(getCellMap(groupMasterNode), groupInstanceCellMap)
        : groupInstanceCellMap;

    // Build default data for group from merged cells (use buildDefaultDataFromMerged for consistency)
    const groupDefaultData: DefaultShapeData = buildDefaultDataFromMerged(
        groupMergedCellMap,
        groupMasterNode || groupNode,
        groupNode,
        context,
        parentMasterId
    );

    // If inside a group, convert local PinX/PinY to page PinX/PinY
    if (parentTx) {
        groupMergedCellMap = applyParentTransformToCellMap(groupMergedCellMap, parentTx);
    }

    const parentTransform: GroupTransform = {
        pinX: getNumberFromCellMap(groupMergedCellMap, 'PinX', 0),
        pinY: getNumberFromCellMap(groupMergedCellMap, 'PinY', 0),
        locPinX: getNumberFromCellMap(groupMergedCellMap, 'LocPinX', Number(groupDefaultData.LocPinX)),
        locPinY: getNumberFromCellMap(groupMergedCellMap, 'LocPinY', Number(groupDefaultData.LocPinY)),
        angle: getNumberFromCellMap(groupMergedCellMap, 'Angle', 0),
        flipX: getNumberFromCellMap(groupMergedCellMap, 'FlipX', 0),
        flipY: getNumberFromCellMap(groupMergedCellMap, 'FlipY', 0),
        width: getNumberFromCellMap(groupMergedCellMap, 'Width', Number(groupDefaultData.Width)),
        height: getNumberFromCellMap(groupMergedCellMap, 'Height', Number(groupDefaultData.Height))
    };

    // -------------------- Semantic group shortcut (BPMN/UML/Image master groups) --------------------
    // Create the group shape early so determineShapeType can set Node flags (e.g., AllowDrop for BPMN subprocess)
    const groupShape: VisioShape = new VisioShape();
    const pageHeightPixels: number = inchToPx(context.data.currentPage.pageHeight);
    const groupSections: VisioSection[] = (groupNode as VisioShapeNode).Section ? ensureArray((groupNode as VisioShapeNode).Section) : [];
    const groupPinYExists: boolean = groupMergedCellMap.has('PinY');
    const groupGeometryCellMap: Map<string, CellMapValue> = getGeometryCells(groupSections, mapCellValues);

    groupShape.id = (groupAttributes && (groupAttributes as ShapeAttributes).ID != null)
        ? String((groupAttributes as ShapeAttributes).ID)
        : ('group_' + Math.random().toString(36).slice(2));

    applyCommonNodeProperties(groupShape, {
        cellMap: groupMergedCellMap,
        attributes: groupAttributes as ShapeAttributes,
        defaultData: groupDefaultData,
        pageHeight: pageHeightPixels,
        pinYExists: groupPinYExists,
        context: context,
        getcell: groupGeometryCellMap,
        shapeData: groupNode,
        masterSource: groupMasterNode
    });

    assignShapeLayer(groupShape, groupMergedCellMap, context);

    // If this master group maps to a supported semantic EJ2 shape, return it as a single node and skip children.
    const semanticShape: DetermineShapeResult | null = tryDetermineSemanticGroupShape(
        groupNode,
        groupMasterNode,
        groupShape,
        context,
        parentMasterId
    );

    if (semanticShape) {
        (groupShape as VisioShape).shape = semanticShape;
        resultShapes.push(groupShape);
        return resultShapes;
    }

    // Parse child shapes and pass down the group's master ID for proper child master resolution
    const childShapeIds: string[] = [];

    // Detect geometry sections on the group itself (prefer master sections, supplement with instance-only)
    let groupGeomSections: VisioSection[] = [];
    if (groupMasterNode) {
        groupGeomSections = mergeGeometrySectionsByIndex(groupMasterNode, groupNode); // master-preferred merge
    } else {
        const secsOnly: VisioSection[] = ensureArray((groupNode as VisioShapeNode).Section);
        for (const sec of secsOnly) {
            if (sec && sec.$ && sec.$.N === 'Geometry') { groupGeomSections.push(sec); }
        }
    }

    // Build a visual child node representing this group's own Geometry section (if available)
    const groupGeometryNode: VisioShape | null = createGroupGeometryStandaloneNodeIfAny(
        groupNode,
        groupMasterNode,
        groupShape,
        groupAttributes,
        groupSections,
        groupMergedCellMap,
        groupDefaultData,
        groupPinYExists,
        groupGeomSections,
        context,
        parentMasterId
    );
    if (groupGeometryNode) {
        resultShapes.push(groupGeometryNode);
        childShapeIds.push(groupGeometryNode.id);
    }

    const childShapesContainer: VisioShapeNode['Shapes'] = (groupNode as VisioShapeNode).Shapes;
    if (childShapesContainer && (childShapesContainer as  VisioShapeNode['Shapes']).Shape) {
        const childShapeNodeArray: VisioShapeNode[] = ensureArray((childShapesContainer as  VisioShapeNode['Shapes']).Shape);

        for (let childIndex: number = 0; childIndex < childShapeNodeArray.length; childIndex++) {
            const childShapeNode: VisioShapeNode = childShapeNodeArray[parseInt(childIndex.toString(), 10)];

            // Record connector child IDs so EJ2 group 'children' includes them
            if (isConnectorShape(childShapeNode, context)) {
                let connectorChildId: string = '';
                if (childShapeNode && childShapeNode.$ && childShapeNode.$.ID != null) {
                    connectorChildId = String(childShapeNode.$.ID);
                }
                if (connectorChildId && connectorChildId.length > 0) {
                    childShapeIds.push(connectorChildId);
                }
                // Connectors themselves are parsed in the connector pass; so do not parse here
            }

            // IMPORTANT: Pass groupMasterId so child can resolve MasterShape references within parent master
            const parsedChildShapes: VisioShape[] = parserVisioShapeNode(
                childShapeNode,
                context,
                groupMasterId,  // Pass parent master ID for child shape resolution
                parentTransform
            );
            const currentGroupId: string = (groupAttributes && groupAttributes.ID != null) ? String(groupAttributes.ID) : 'group';
            let childIsGroup: boolean = false;
            if (childShapeNode && childShapeNode.$ && childShapeNode.$.Type != null) {
                childIsGroup = String(childShapeNode.$.Type).toLowerCase() === 'group';
            }
            const childRootId: string = (childShapeNode && childShapeNode.$ && childShapeNode.$.ID != null) ? String(childShapeNode.$.ID) : '';

            // Collect all child shapes and track their IDs
            for (let shapeIndex: number = 0; shapeIndex < parsedChildShapes.length; shapeIndex++) {
                const childShape: VisioShape = parsedChildShapes[parseInt(shapeIndex.toString(), 10)];
                resultShapes.push(childShape);

                if (childShape && childShape.id) {
                    // Only set parent on the immediate child wrapper; keep grandchildren under their own group.
                    if (!childIsGroup) {
                        childShape.parentId = currentGroupId;
                    } else if (childRootId && String(childShape.id) === childRootId) {
                        childShape.parentId = currentGroupId;
                    }
                }
            }

            // Only attach immediate child id to this group to avoid double-grouping.
            if (!childIsGroup) {
                if (parsedChildShapes.length > 0 && parsedChildShapes[0] && parsedChildShapes[0].id) {
                    childShapeIds.push(String(parsedChildShapes[0].id));
                }
            } else {
                if (childRootId) {
                    childShapeIds.push(childRootId);
                }
            }
        }
    }

    // Set group ID and apply properties
    groupShape.id = (groupAttributes && (groupAttributes as ShapeAttributes).ID != null)
        ? String((groupAttributes as ShapeAttributes).ID)
        : ('group_' + Math.random().toString(36).slice(2));

    // Link child shapes to group
    (groupShape as VisioShape).children = childShapeIds;
    resultShapes.push(groupShape);

    return resultShapes;
}

/**
 * Parses a Visio vertex (non-group, non-connector) shape node.
 * Merges master and instance cell maps, applies parent transforms,
 * builds default data, applies common properties, and determines
 * the final EJ2 shape representation.
 *
 * - Resolves master source for the node (root or child).
 * - Applies parent transform if inside a group.
 * - Builds default shape data from merged cells.
 * - Applies common node properties and assigns layer.
 * - Merges geometry sections (master-preferred).
 * - Determines final shape type (semantic or path).
 * - Attaches image source if applicable.
 *
 * @param {VisioShapeNode} pageNode - Shape node to parse
 * @param {ParsingContext} context - Parsing context with master index and page data
 * @param {string} [parentMasterId] - Optional parent master ID for nested shapes
 * @param {GroupTransform} [parentTx] - Optional parent transform for child positioning
 * @returns {VisioShape[]} Parsed Visio shape(s) for the vertex node
 */
function parseVertexShape(
    pageNode: VisioShapeNode,
    context: ParsingContext,
    parentMasterId?: string,
    parentTx?: GroupTransform
): VisioShape[] {
    const out: VisioShape[] = [];

    // Get master source (root or child) if referenced
    // Use parentMasterId to properly resolve child shapes within parent master definition
    const masterSource: VisioShapeNode | null = resolveMasterSourceForNode(pageNode, context, parentMasterId);
    const instMap: Map<string, CellMapValue> = getCellMap(pageNode);
    let mergedMap: Map<string, CellMapValue> = masterSource
        ? mergeCellMaps(getCellMap(masterSource), instMap)
        : instMap;

    // If inside a group, convert local PinX/PinY to page PinX/PinY
    if (parentTx) {
        mergedMap = applyParentTransformToCellMap(mergedMap, parentTx);
    }

    // Build defaultData (master defaults)
    const nodeDefaultData: DefaultShapeData = buildDefaultDataFromMerged(
        mergedMap,
        masterSource ? masterSource : pageNode,
        pageNode,
        context,
        parentMasterId
    );

    // Shape envelope
    const attributes: ShapeAttributes | undefined = (pageNode as VisioShapeNode).$ || undefined;
    const shapeId: string = (attributes && (attributes as ShapeAttributes).ID != null) ? String((attributes as ShapeAttributes).ID) : ('s_' + Math.random().toString(36).slice(2));

    // Build ShapeAttributes
    const shapeAttributes: ShapeAttributes = {
        ID: shapeId,
        Master: attributes.Master,
        MasterID: attributes.MasterID,
        MasterId: attributes.MasterId,
        NameU: attributes.NameU,
        Name: attributes.Name,
        Type: attributes.Type
    };
    const pageHeightPx: number = inchToPx(context.data.currentPage.pageHeight);
    const pinYExists: boolean = mergedMap.has('PinY');

    // Geometry cells map
    const pageSecs: VisioSection[] = ensureArray((pageNode as VisioShapeNode).Section);
    let geoCellMap: Map<string, CellMapValue> = getGeometryCells(pageSecs, mapCellValues);
    if (geoCellMap.size === 0 && masterSource) {
        const masterSecs: VisioSection[] = ensureArray((masterSource as VisioShapeNode).Section);
        geoCellMap = getGeometryCells(masterSecs, mapCellValues);
    }

    const node: VisioShape = new VisioShape();
    node.id = shapeId;

    // ==================== Handle Special Shape Type: Solid ====================
    // Solid shapes are background/fill-only shapes with minimal properties
    if (shapeAttributes.Name === 'Solid') {
        node.name = shapeAttributes.Name;
        node.fillColor = mergedMap.get('FillForegnd') ? String(mergedMap.get('FillForegnd')) : 'transparent';
    } else {
        // ==================== Apply Common Properties for Regular Shapes ====================
        applyCommonNodeProperties(node, {
            cellMap: mergedMap,
            attributes: shapeAttributes,
            defaultData: nodeDefaultData,
            pageHeight: pageHeightPx,
            pinYExists: pinYExists,
            context: context,
            getcell: geoCellMap,
            shapeData: pageNode,
            masterSource: masterSource
        });

        assignShapeLayer(node, mergedMap, context);
    }

    // Geometry for THIS node
    let geomSections: VisioSection[] = [];
    if (masterSource) {
        const mergedSections: VisioSection[] = mergeGeometrySectionsByIndex(masterSource, pageNode);
        geomSections = mergedSections;
    } else {
        const secsOnly: VisioSection[] = ensureArray((pageNode as VisioShapeNode).Section);
        for (const section of secsOnly) {
            if (section && section.$ && section.$.N === 'Geometry') {
                geomSections.push(section);
            }
        }
    }

    // Hide node only if all geometry sections are marked NoShow=1
    const hideAllSections: boolean = areAllGeometrySectionsHidden(geomSections);
    if (hideAllSections) {
        node.visibility = true; // internal flag meaning "invisible" in your pipeline
    } else {
        node.visibility = false;
    }

    // Determine final node shape
    const finalShape: DetermineShapeResult = determineDefaultNodeShape(
        pageNode,
        masterSource,
        geomSections,
        node,
        context,
        parentMasterId
    );
    node.shape = finalShape;

    const isStrokeOnlyNode: boolean = allGeometrySectionsNoFill(geomSections) && !allGeometrySectionsNoLine(geomSections);

    // ---- Enforce geometry-driven fill/line semantics (stroke-only paths) ----
    if (isStrokeOnlyNode && node && (node as VisioShape).shape && ((node as VisioShape).shape).type === 'Path') {
        node.style.fillColor = 'transparent';
        (node.style as VisioNodeStyle).opacity = 0;
    }
    // If geometry says no line, also honor it robustly (avoid accidental strokes)
    if (allGeometrySectionsNoLine(geomSections)) {
        (node.style as VisioNodeStyle).strokeColor = 'transparent';
        (node.style as VisioNodeStyle).strokeWidth = 0;
    }

    // Attach Image source of image nodes
    if (node.shape && node.shape.type === 'Image' && node.imageId) {
        const mediaObj: VisioMedia | undefined = context.data.medias[node.imageId];
        if (mediaObj && mediaObj.dataUrl) {
            node.shape.source = mediaObj.dataUrl;
        }
    }

    out.push(node);
    return out;
}

/**
 * Creates a standalone visual child node from the group's own Geometry section.
 * Used when the group shape itself has Geometry rows that must render as a
 * separate child node. Returns the generated VisioShape or null if the group
 * has no Geometry sections.
 *
 * This helper reuses common property application, resolves geometry-level
 * cells, assigns layer membership, determines the final node shape, and
 * attaches the new node as a visual child of the main group shape.
 *
 * @param {VisioShapeNode} groupNode - The XML node representing the group.
 * @param {VisioShapeNode|null} groupMasterNode - The resolved master node, if any.
 * @param {VisioShape} groupShape - The main VisioShape instance for the group.
 * @param {Attributes} groupAttributes - Raw attributes from the group's XML.
 * @param {VisioSection[]} groupSections - Sections on the group instance.
 * @param {Map<string, CellMapValue>} groupMergedCellMap - Merged master+instance cell map.
 * @param {DefaultShapeData} groupDefaultData - Default values extracted from merged cells.
 * @param {boolean} groupPinYExists - Indicates if PinY is explicitly present on the group.
 * @param {VisioSection[]} groupGeomSections - Geometry sections belonging to the group.
 * @param {ParsingContext} context - Global parsing context with master/page metadata.
 * @param {string} [parentMasterId] - Optional parent master ID for nested groups.
 * @returns {VisioShape|null} A standalone geometry node or null if no geometry exists.
 * @private
 */
function createGroupGeometryStandaloneNodeIfAny(
    groupNode: VisioShapeNode,
    groupMasterNode: VisioShapeNode | null,
    groupShape: VisioShape,
    groupAttributes: ShapeAttributes,
    groupSections: VisioSection[],
    groupMergedCellMap: Map<string, CellMapValue>,
    groupDefaultData: DefaultShapeData,
    groupPinYExists: boolean,
    groupGeomSections: VisioSection[],
    context: ParsingContext,
    parentMasterId?: string
): VisioShape | null {
    if (!groupGeomSections || groupGeomSections.length === 0) {
        return null;
    }

    // Build a standalone visual node from the group's own geometry; parent it to the group
    const groupGeometryNode: VisioShape = new VisioShape();
    groupGeometryNode.id = String(groupShape.id) + '_g'; // derive child id from group id (stable and unique enough)

    // Reuse common property application so offsets/dimensions/layer exactly match the group box
    const pageHeightPixels: number = inchToPx(context.data.currentPage.pageHeight);
    const groupGeomCellMap: Map<string, CellMapValue> = getGeometryCells(groupSections, mapCellValues);

    // NOTE: attributes.ID overridden so the child has its own id
    const geometryAttributes: ShapeAttributes = { ...(groupAttributes as ShapeAttributes), ID: groupGeometryNode.id };

    applyCommonNodeProperties(groupGeometryNode, {
        cellMap: groupMergedCellMap,           // use group's merged cells (has Width/Height/PinX/PinY)
        attributes: geometryAttributes,          // child attributes (with new id)
        defaultData: groupDefaultData,         // same defaults as group
        pageHeight: pageHeightPixels,
        pinYExists: groupPinYExists,
        context: context,
        getcell: groupGeomCellMap,             // geometry-level flags (NoShow, etc.)
        shapeData: groupNode,                 // the group's XML (source of geometry rows)
        masterSource: groupMasterNode
    });
    assignShapeLayer(groupGeometryNode, groupMergedCellMap, context); // inherit group's layer

    // Determine final visual for the geometry (usually Path); semantic shortcut already exited above
    const geomShape: DetermineShapeResult = determineDefaultNodeShape(
        groupNode,           // page node
        groupMasterNode,     // master node (if any)
        groupGeomSections,   // geometry sections collected above
        groupGeometryNode,            // target VisioShape to populate
        context,
        parentMasterId
    );
    (groupGeometryNode as VisioShape).shape = geomShape;

    // Parent/children linkage and z-order: geometry first so it renders beneath other children
    groupGeometryNode.parentId = String(groupShape.id);
    return groupGeometryNode;
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
function applyCommonNodeProperties(
    shape: VisioShape,
    args: ApplyCommonNodePropertiesArgs
): void {
    const { cellMap, attributes, defaultData, pageHeight, pinYExists, context, getcell, shapeData } = args;

    // ==================== Set Name/Label ====================
    // Use provided name, fall back to master name, or 'Image' for foreign shapes, or generic 'Shape'
    attributes.Name = (attributes.Type === 'Foreign')
        ? 'Image'
        : attributes.Name
            ? attributes.Name
            : defaultData.Name
                ? defaultData.Name
                : 'Shape';

    // ==================== Handle Image/Foreign Shapes ====================
    // Foreign (image) shapes may store <ForeignData> on the instance or on the master.
    if (attributes) {
        let isForeignShape: boolean = false;

        // Detect as Foreign by Type first
        if (typeof attributes.Type === 'string') {
            if (attributes.Type === 'Foreign') {
                isForeignShape = true;
            }
        }

        // Also accept normalized name "Image" (some flows rename Foreign -> Image)
        if (!isForeignShape && typeof attributes.Name === 'string') {
            if (attributes.Name === 'Image') {
                isForeignShape = true;
            }
        }

        if (isForeignShape) {
            // Pick the node that actually owns <ForeignData> (instance preferred, then master)
            let ownerWithForeignData: VisioShapeNode | null = null;
            if (args && args.shapeData) {
                const instNode: VisioShapeNode = args.shapeData as VisioShapeNode;
                if (getForeignDataBlock(instNode)) {
                    ownerWithForeignData = instNode;
                }
            }
            if (!ownerWithForeignData && args && args.masterSource) {
                const masterNode: VisioShapeNode = args.masterSource as VisioShapeNode;
                if (getForeignDataBlock(masterNode)) {
                    ownerWithForeignData = masterNode;
                }
            }

            // Safely extract type metadata and relation id when ForeignData exists
            if (ownerWithForeignData) {
                const foreignData: ForeignDataBlock | undefined = getForeignDataBlock(ownerWithForeignData);
                if (foreignData && foreignData.$ && typeof foreignData.$ === 'object') {
                    const foreignDataAttrs: XmlStringMap = foreignData.$ as XmlStringMap;

                    // CompressionType -> shape.type (backward compatibility with pipeline)
                    if (Object.prototype.hasOwnProperty.call(foreignDataAttrs, 'CompressionType')) {
                        const compressionVal: unknown = foreignDataAttrs['CompressionType'];
                        if (typeof compressionVal === 'string') {
                            shape.type = compressionVal;
                        }
                    }

                    // ForeignType -> shape.foreignType
                    if (Object.prototype.hasOwnProperty.call(foreignDataAttrs, 'ForeignType')) {
                        const foreignType: unknown = foreignDataAttrs['ForeignType'];
                        if (typeof foreignType === 'string') {
                            shape.foreignType = foreignType;
                        }
                    }
                }

                // Rel/@r:id (or rId) -> shape.imageId (sanitized)
                const relId: string = extractRelIdFromForeignData(foreignData);
                if (relId && relId.length > 0) {
                    shape.imageId = relId;
                }
            }
        }
    }

    // ==================== Extract Default Styling ====================
    // Convert style array to object for easier property access
    const defaultShapeStyle: Record<string, CellMapValue> = shapeStyleToObject(defaultData.shapeStyle);

    // ==================== Set Position ====================
    // X position from PinX cell (in inches - converted to pixels in convertVisioShapeToNode)
    const pinXInches: number = cellMap.get('PinX') != null ? Number(cellMap.get('PinX')) : 0;
    shape.offsetX = pinXInches;

    // Y position with coordinate system conversion (Visio: bottom-left origin → EJ2: top-left origin)
    const pinYInches: number = cellMap.get('PinY') != null ? Number(cellMap.get('PinY')) : 0;
    const pinYPixels: number = pinYExists ? inchToPx(pinYInches) : pinYInches;
    shape.offsetY = pinYExists ? pageHeight - pinYPixels : 0;

    // ==================== Set Dimensions ====================
    // Always extract Width and Height directly from THIS shape's cellMap first
    shape.width = cellMap.get('Width') != null
        ? Number(cellMap.get('Width'))
        : (defaultData && defaultData.Width) !== undefined
            ? defaultData.Width
            : 1;  // Default to 1 inch if not specified
    shape.height = cellMap.get('Height') != null
        ? Number(cellMap.get('Height'))
        : (defaultData && defaultData.Height) !== undefined
            ? defaultData.Height
            : 1;  // Default to 1 inch if not specified

    // Extract port coordinates using merged width/height (includes master fallback)
    const shapePorts: VisioPort[] = getVisioPorts(args.shapeData, args.defaultData, shape.width, shape.height);

    // Merge ports from both shape instance and master
    defaultData.Ports = mergePorts(defaultData.Ports, shapePorts);

    // ==================== Set Pivot Points (Rotation Center) ====================
    const locPinXInches: number = cellMap.get('LocPinX') != null ? Number(cellMap.get('LocPinX')) : 0;
    const locPinYInches: number = cellMap.get('LocPinY') != null ? Number(cellMap.get('LocPinY')) : 0;

    // Pivot points stay in inches - normalized during shape conversion
    shape.pivotX = locPinXInches;
    shape.pivotY = locPinYInches;

    // ==================== Set Rotation and Corner Radius ====================
    const rotationAngleDegrees: number = cellMap.get('Angle') != null ? Number(cellMap.get('Angle')) : 0;
    const cornerRadiusInches: number = cellMap.get('Rounding') != null
        ? Number(cellMap.get('Rounding'))
        : (defaultShapeStyle.cornerRadius ? Number(defaultShapeStyle.cornerRadius) : 0);

    shape.rotateAngle = rotationAngleDegrees;
    shape.cornerRadius = cornerRadiusInches;

    // ==================== Store PinY for Reference ====================
    shape.pinY = pinYPixels;

    // ==================== Set Text Annotation ====================
    shape.annotation = VisioNodeAnnotation.fromJs(shapeData, (defaultData as ParsedXmlObject));

    // ==================== Set Quick Style Colors ====================
    shape.QuickLineColor = cellMap.get('QuickStyleLineColor') != null
        ? Number(cellMap.get('QuickStyleLineColor'))
        : (defaultData && defaultData.QuickStyleLineColor) !== undefined
            ? Number(defaultData.QuickStyleLineColor)
            : undefined;

    shape.QuickFillColor = cellMap.get('QuickStyleFillColor') != null
        ? Number(cellMap.get('QuickStyleFillColor'))
        : (defaultData && defaultData.QuickStyleFillColor) !== undefined
            ? Number(defaultData.QuickStyleFillColor)
            : undefined;

    shape.QuickShadowColor = cellMap.get('QuickStyleShadowColor') != null
        ? Number(cellMap.get('QuickStyleShadowColor'))
        : (defaultData && defaultData.QuickStyleShadowColor) !== undefined
            ? Number(defaultData.QuickStyleShadowColor)
            : undefined;

    // ==================== Set Quick Style Matrices ====================
    shape.QuickLineMatrix = cellMap.get('QuickStyleLineMatrix') != null
        ? Number(cellMap.get('QuickStyleLineMatrix'))
        : (defaultData && defaultData.QuickStyleLineMatrix) !== undefined
            ? Number(defaultData.QuickStyleLineMatrix)
            : undefined;

    shape.QuickFillMatrix = cellMap.get('QuickStyleFillMatrix') != null
        ? Number(cellMap.get('QuickStyleFillMatrix'))
        : (defaultData && defaultData.QuickStyleFillMatrix) !== undefined
            ? Number(defaultData.QuickStyleFillMatrix)
            : undefined;

    shape.QuickShadowMatrix = cellMap.get('QuickStyleEffectsMatrix') != null
        ? Number(cellMap.get('QuickStyleEffectsMatrix'))
        : (defaultData && defaultData.QuickStyleEffectsMatrix) !== undefined
            ? Number(defaultData.QuickStyleEffectsMatrix)
            : undefined;

    // ==================== Set Theme and Color Scheme Indices ====================
    shape.ThemeIndex = cellMap.get('ThemeIndex') != null ? Number(cellMap.get('ThemeIndex')) : undefined;
    shape.ColorSchemeIndex = cellMap.get('ColorSchemeIndex') != null ? Number(cellMap.get('ColorSchemeIndex')) : undefined;

    // ==================== Set Flip Transformations ====================
    shape.flipX = cellMap.get('FlipX') != null ? Number(cellMap.get('FlipX')) : 0;
    shape.flipY = cellMap.get('FlipY') != null ? Number(cellMap.get('FlipY')) : 0;

    // ==================== Set Display and Interaction Properties ====================
    // Extract visibility from geometry cells (NoShow flag indicates hidden shapes)
    shape.visibility = getcell.has('NoShow') ? getcell.get('NoShow') === '1' : false;

    // Extract comment/tooltip text
    const tooltipText: string = cellMap.get('Comment') != null ? String(cellMap.get('Comment')) : '';
    shape.tooltip = tooltipText;

    // Extract glue type (determines connector attachment behavior)
    shape.glueValue = cellMap.get('GlueType') != null ? Number(cellMap.get('GlueType')) : undefined;

    // ==================== Set Visual Styling ====================
    shape.style = parseVisioNodeStyle(shapeData, context, defaultShapeStyle, shape, undefined);

    // ==================== Apply Edit Constraints ====================
    shape.constraints = applyConstraints(shape, cellMap);

    // ==================== Set Shadow Effects ====================
    shape.shadow = parseVisioNodeShadow(cellMap, context);

    // ==================== Set Connection Points ====================
    shape.ports = defaultData.Ports;

    // Need to retrieve shape data for export
    shape.addInfo = {
        data: args.shapeData,
        isModified: false,
        masterId: shape.masterId
    };

    // ==================== Master Placeholder Text Fallback ====================
    if (shape.annotation && args && args.shapeData) {
        // Validate instance node carrier
        const instanceNodeCarrier: { [k: string]: unknown } = args.shapeData as unknown as { [k: string]: unknown };

        // Check for a local <Text> element on the page instance for any text override
        let instanceHasLocalText: boolean = false;
        if (Object.prototype.hasOwnProperty.call(instanceNodeCarrier, 'Text')) {
            instanceHasLocalText = true;
        }

        // Prepare master node reference
        let masterNodeForFallback: VisioShapeNode | null = null;
        if (args.masterSource) {
            masterNodeForFallback = args.masterSource as VisioShapeNode;
        }

        // Only perform fallback when the instance truly lacks <Text>
        if (!instanceHasLocalText) {
            VisioNodeAnnotation.applyMasterTextFallback(
                shape.annotation as VisioNodeAnnotation,
                args.shapeData as VisioShapeNode,
                masterNodeForFallback
            );
        }
    }
}

/**
 * Builds default shape data from a merged cell map.
 * Extracts dimensions, pins, connector points, text properties,
 * quick style attributes, semantic name, ports, and style information.
 *
 * @param {Map<string, CellMapValue>} mergedMap - Combined cell map from master and instance
 * @param {VisioShapeNode} masterSource - Master shape node providing defaults
 * @param {VisioShapeNode} [pageNode] - Optional page shape node for overrides
 * @param {ParsingContext} [context] - Parsing context with master index
 * @param {string} [parentMasterId] - Optional parent master ID for nested shapes
 * @returns {DefaultShapeData} Object containing extracted default data for the shape
 */
function buildDefaultDataFromMerged(
    mergedMap: Map<string, CellMapValue>,
    masterSource: VisioShapeNode,
    pageNode?: VisioShapeNode,
    context?: ParsingContext,
    parentMasterId?: string
): DefaultShapeData {
    const out: DefaultShapeData = {};

    // ==================== Basic Dimensions ====================
    out.Width = getNumberFromCellMap(mergedMap, 'Width', undefined) as number;
    out.Height = getNumberFromCellMap(mergedMap, 'Height', undefined) as number;

    // ==================== Pin/Pivot Points ====================
    out.LocPinX = getNumberFromCellMap(mergedMap, 'LocPinX', 0) as number;
    out.LocPinY = getNumberFromCellMap(mergedMap, 'LocPinY', 0) as number;

    // ==================== Connector Begin/End Points ====================
    out.BeginX = getNumberFromCellMap(mergedMap, 'BeginX', undefined) as number;
    out.BeginY = getNumberFromCellMap(mergedMap, 'BeginY', undefined) as number;
    out.EndX = getNumberFromCellMap(mergedMap, 'EndX', undefined) as number;
    out.EndY = getNumberFromCellMap(mergedMap, 'EndY', undefined) as number;

    // ==================== Text/Annotation Properties ====================
    out.TxtWidth = getNumberFromCellMap(mergedMap, 'TxtWidth', undefined) as number;
    out.TxtHeight = getNumberFromCellMap(mergedMap, 'TxtHeight', undefined) as number;
    out.TxtPinX = getNumberFromCellMap(mergedMap, 'TxtPinX', undefined) as number;
    out.TxtPinY = getNumberFromCellMap(mergedMap, 'TxtPinY', undefined) as number;
    out.TxtLocPinX = getNumberFromCellMap(mergedMap, 'TxtLocPinX', undefined) as number;
    out.TxtLocPinY = getNumberFromCellMap(mergedMap, 'TxtLocPinY', undefined) as number;

    // ==================== Quick Style Colors ====================
    out.QuickStyleLineColor = getNumberFromCellMap(mergedMap, 'QuickStyleLineColor', undefined) as number;
    out.QuickStyleFillColor = getNumberFromCellMap(mergedMap, 'QuickStyleFillColor', undefined) as number;
    out.QuickStyleShadowColor = getNumberFromCellMap(mergedMap, 'QuickStyleShadowColor', undefined) as number;
    out.QuickStyleFontColor = getNumberFromCellMap(mergedMap, 'QuickStyleFontColor', undefined) as number;

    // ==================== Quick Style Matrices ====================
    out.QuickStyleLineMatrix = getNumberFromCellMap(mergedMap, 'QuickStyleLineMatrix', undefined) as number;
    out.QuickStyleFillMatrix = getNumberFromCellMap(mergedMap, 'QuickStyleFillMatrix', undefined) as number;
    out.QuickStyleEffectsMatrix = getNumberFromCellMap(mergedMap, 'QuickStyleEffectsMatrix', undefined) as number;
    out.QuickStyleFontMatrix = getNumberFromCellMap(mergedMap, 'QuickStyleFontMatrix', undefined) as number;

    // ==================== Shape Name ====================
    const nameFromCells: CellMapValue = mergedMap.get('Name');
    out.Name = nameFromCells != null ? String(nameFromCells) : undefined;
    // If cell "Name" is missing, resolve semantic name using instance/master/masters.xml index.
    if ((!out.Name || String(out.Name).trim() === '') && pageNode && context) {
        const resolved: string = resolveShapeNameForMapping(pageNode, masterSource, context, parentMasterId);
        if (resolved && resolved.trim().length > 0) {
            out.Name = resolved;
        }
    }

    // ==================== Extract Ports from Master ====================
    out.Ports = masterSource
        ? getVisioPorts(masterSource, undefined, out.Width, out.Height)
        : [];

    // ==================== Extract Style Properties ====================
    out.shapeStyle = findAllDefaultStyles(masterSource ? masterSource : (pageNode ? pageNode : null));

    return out;
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
 * Safely returns the <ForeignData> block if present on the given shape node.
 * @param {VisioShapeNode | null | undefined} node - Shape node that may contain ForeignData
 * @returns {ForeignDataBlock | undefined} The ForeignData block or undefined if absent
 */
function getForeignDataBlock(node: VisioShapeNode | null | undefined): ForeignDataBlock | undefined {
    // Validate carrier
    if (!node) {
        return undefined;
    }
    const carrier: { [k: string]: unknown } = node as unknown as { [k: string]: unknown };

    // Confirm property exists
    if (!Object.prototype.hasOwnProperty.call(carrier, 'ForeignData')) {
        return undefined;
    }

    // Narrow and validate structure
    const raw: unknown = carrier['ForeignData'];
    if (!raw || typeof raw !== 'object') {
        return undefined;
    }
    return raw as ForeignDataBlock;
}

/**
 * Extracts a sanitized relation id from ForeignData.Rel (supports single or array; r:id or rId).
 * @param {ForeignDataBlock | undefined} foreignData - The normalized ForeignData block
 * @returns {string} Sanitized relation id or empty string when missing
 */
function extractRelIdFromForeignData(foreignData: ForeignDataBlock | undefined): string {
    // Guard when ForeignData is absent
    if (!foreignData) {
        return '';
    }

    // Normalize Rel into a single candidate having a '$' bag
    let relCandidate: { $?: XmlStringMap } | undefined = undefined;

    if (foreignData.Rel) {
        if (Array.isArray(foreignData.Rel)) {
            for (let i: number = 0; i < foreignData.Rel.length; i += 1) {
                const item: { $?: XmlStringMap } = foreignData.Rel[parseInt(i.toString(), 10)];
                if (item && item.$ && typeof item.$ === 'object') {
                    relCandidate = item;
                    break;
                }
            }
        } else {
            if (foreignData.Rel.$ && typeof foreignData.Rel.$ === 'object') {
                relCandidate = foreignData.Rel;
            }
        }
    }

    if (!relCandidate || !relCandidate.$) {
        return '';
    }

    // Support r:id and rId
    const attributes: XmlStringMap = relCandidate.$ as XmlStringMap;
    let relationId: string = '';
    if (Object.prototype.hasOwnProperty.call(attributes, 'r:id')) {
        const value: unknown = attributes['r:id'];
        if (typeof value === 'string') {
            relationId = value;
        }
    } else if (Object.prototype.hasOwnProperty.call(attributes, 'rId')) {
        const value2: unknown = attributes['rId'];
        if (typeof value2 === 'string') {
            relationId = value2;
        }
    }

    // Sanitize (trim + clamp to 64 chars)
    if (relationId) {
        const trimmed: string = relationId.trim();
        if (trimmed.length > 64) {
            return trimmed.slice(0, 64);
        }
        return trimmed;
    }
    return '';
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
    (basePorts ? basePorts : []).forEach((port: VisioPort) => portMap.set(port.id, port));

    // ==================== Add/Update Ports ====================
    // Add ports from update array, overwriting duplicates by ID
    (updatePorts ? updatePorts : []).forEach((port: VisioPort) => portMap.set(port.id, port));

    // ==================== Return Merged Array ====================
    const mergedPorts: VisioPort[] = [];
    portMap.forEach((port: VisioPort) => mergedPorts.push(port));
    return mergedPorts;
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
