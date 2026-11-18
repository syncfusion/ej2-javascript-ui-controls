/**
 * Optional SmartArt / DrawingML diagram common layer.
 *
 * @remarks
 * Host-neutral package constants, part parse/serialize, and content-type handlers
 * shared by PowerPoint, Word, and Excel consumers. This module must not export
 * slide, document-body, worksheet, or other host product types.
 *
 * Mapping: `docs/ooxml-mapping/smart-art.md`
 * Requirement: `docs/requirements/smart-art-shared-common.md`
 * @packageDocumentation
 */

export {
    DIAGRAM_COLORS_CONTENT_TYPE,
    DIAGRAM_COLORS_RELATIONSHIP_TYPE,
    DIAGRAM_CONTENT_TYPES,
    DIAGRAM_DATA_CONTENT_TYPE,
    DIAGRAM_DATA_RELATIONSHIP_TYPE,
    DIAGRAM_GRAPHIC_DATA_URI,
    DIAGRAM_LAYOUT_CONTENT_TYPE,
    DIAGRAM_LAYOUT_RELATIONSHIP_TYPE,
    DIAGRAM_NAMESPACE,
    DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE,
    DIAGRAM_RELATIONSHIP_TYPES,
    DIAGRAM_STYLE_CONTENT_TYPE,
    DRAWINGML_MAIN_NAMESPACE,
    OFFICE_DOCUMENT_RELATIONSHIPS_NAMESPACE,
    OFFICE_IMAGE_RELATIONSHIP_TYPE
} from './namespaces';

export { DiagramPartError } from './errors';

export {
    DiagramPointType,
    CreateDiagramInstanceOptions,
    CreateDiagramInstanceResult,
    CreateDiagramInstanceSeeds,
    DiagramColorsPart,
    DiagramConnection,
    DiagramDataPart,
    DiagramGraphicHook,
    DiagramInstance,
    DiagramLayoutPart,
    DiagramPackageGraph,
    DiagramPackagePart,
    DiagramPackageRelationship,
    DiagramPartHandler,
    DiagramPartNames,
    DiagramPoint,
    DiagramRelIds,
    DiagramStylePart,
    GetDiagramInstanceOptions,
    RemoveDiagramInstanceOptions,
    RemoveDiagramInstanceResult
} from './types';

export { parseDiagramData } from './parse-data';
export { parseDiagramColors } from './parse-colors';
export { parseDiagramLayout } from './parse-layout';
export { parseDiagramStyle } from './parse-style';
export { findDiagramRelIds, parseDiagramRelIds } from './parse-rel-ids';

export {
    serializeDiagramColors,
    serializeDiagramData,
    serializeDiagramLayout,
    serializeDiagramStyle
} from './serialize';

export {
    enumerateDiagramInstances,
    getDiagramInstance,
    listDiagramParts,
    normalizePartName
} from './package-graph';

export { createDiagramInstance, removeDiagramInstance } from './mutators';

export {
    diagramPoint,
    diagramPointText,
    listDiagramConnections,
    listDiagramPoints,
    withDiagramPointText
} from './point-text';

export { getDiagramPartHandler, registerSmartArtFeature } from './register';
