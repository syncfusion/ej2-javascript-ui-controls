/**
 * Public surface: `@syncfusion/ej2-office-common/diagrams`
 *
 * SmartArt / DrawingML diagram parser, model, serializer, and catalog.
 * TASK-9008. Host wiring for docx is TASK-9009.
 *
 * @packageDocumentation
 */

export {
    A_NAMESPACE,
    A_NAMESPACE_STRICT,
    DGM14_NAMESPACE,
    DGM14_RECOLOR_IMG_EXT_URI,
    DGM_NAMESPACE,
    DGM_NAMESPACE_STRICT,
    DIAGRAMS_FEATURE_ID,
    DIAGRAM_COLORS_CONTENT_TYPE,
    DIAGRAM_COLORS_RELATIONSHIP_TYPE,
    DIAGRAM_DATA_CONTENT_TYPE,
    DIAGRAM_DATA_RELATIONSHIP_TYPE,
    DIAGRAM_DRAWING_CONTENT_TYPE,
    DIAGRAM_DRAWING_RELATIONSHIP_TYPE,
    DIAGRAM_GRAPHIC_DATA_URI,
    DIAGRAM_GRAPHIC_DATA_URI_STRICT,
    DIAGRAM_LAYOUT_CONTENT_TYPE,
    DIAGRAM_LAYOUT_RELATIONSHIP_TYPE,
    DIAGRAM_QUICK_STYLE_CONTENT_TYPE,
    DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE,
    DSP_NAMESPACE,
    isANamespace,
    isDgmNamespace,
    isDiagramGraphicDataUri,
    isRNamespace,
    MAX_DIAGRAM_CONNECTIONS,
    MAX_DIAGRAM_POINTS,
    MS_DIAGRAM_DATA_MODEL_EXT_URI,
    R_NAMESPACE,
    R_NAMESPACE_STRICT,
    W_NAMESPACE,
    WP_NAMESPACE
} from './constants';

export {
    attr,
    cloneElement,
    el,
    elementChildren,
    findChild,
    findChildren,
    getAttr,
    getAttrNS,
    isElementNode,
    isTextNode,
    text,
    textContent,
    ElementAttr,
    ElementChild,
    ElementNode,
    ElementTree,
    TextNode
} from './element-tree';

export {
    DiagramError,
    DiagramModelError,
    DiagramParseError,
    isDiagramError,
    DiagramErrorCode
} from './errors';

export {
    DiagramDataModel,
    isDiagramDataModel,
    DiagramConnection,
    DiagramConnectionProps,
    DiagramConnectionType,
    DiagramDataModelInit,
    DiagramPoint,
    DiagramPointProps,
    DiagramPointType,
    ModelId
} from './diagram-data-model';

export {
    DiagramColors,
    DiagramDrawing,
    DiagramLayout,
    DiagramQuickStyle,
    isDiagramColors,
    isDiagramDrawing,
    isDiagramLayout,
    isDiagramQuickStyle
} from './diagram-views';

export {
    parseDiagramColors,
    parseDiagramData,
    parseDiagramDrawing,
    parseDiagramLayout,
    parseDiagramQuickStyle
} from './diagram-parsers';

export {
    extLst,
    serializeDiagramColors,
    serializeDiagramData,
    serializeDiagramDrawing,
    serializeDiagramLayout,
    serializeDiagramQuickStyle
} from './diagram-serializers';

export {
    detectSmartArtInTree,
    findDiagramRelIdsInGraphicData,
    isSmartArtDiagram,
    isSmartArtGraphicDataUri,
    parseRelIds,
    SmartArtDiagram,
    DiagramRelIds,
    SmartArtDiagramInit
} from './smart-art-diagram';

export {
    isSmartArtCatalog,
    relIds,
    SmartArtCatalog,
    ApplyToPackageOptions,
    ApplyToPackageResult,
    DiagramPartKind,
    DiagramPartRecord,
    PackageView,
    SmartArtRecord
} from './smart-art-catalog';
