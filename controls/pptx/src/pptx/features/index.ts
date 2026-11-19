/**
 * Optional feature modules barrel (`features.ts` → `./src/pptx/features/index`).
 *
 * Named re-exports mirror each area's public `index.ts` (same pattern as
 * `src/pptx/core/index.ts`). Per-area entry points remain valid; this barrel
 * is what the package root re-exports so consumers do not import internal paths.
 *
 * @packageDocumentation
 */
export {
    addChart,
    asChart,
    assertApprovedXlsxImportSpecifier,
    buildChartPackageGraph,
    Chart,
    Charts,
    chartDataSourceKind,
    chartHasColorStyle,
    chartHasEmbeddedPackage,
    chartHasRelatedKind,
    chartHasStyle,
    chartHasUnknownRelatedParts,
    chartHasUserShapes,
    chartPartName,
    CHART_COLOR_STYLE_CONTENT_TYPE,
    CHART_COLOR_STYLE_RELATIONSHIP_TYPE,
    CHART_CONTENT_TYPE,
    CHART_EX_ENGINE_TYPE_VALUES,
    CHART_EX_TYPE_KEYS,
    CHART_RELATIONSHIP_TYPE,
    CHART_STYLE_CONTENT_TYPE,
    CHART_STYLE_RELATIONSHIP_TYPE,
    CHART_USER_SHAPES_CONTENT_TYPE,
    CHART_USER_SHAPES_RELATIONSHIP_TYPE,
    CHARTS_FEATURE_ID,
    ChartsError,
    CLASSIC_CHART_TYPE_KEYS,
    clearCachedXlsxRoot,
    DEFAULT_FROM_EXCEL_RANGE,
    DEFAULT_CHART_BOUNDS,
    DEFAULT_CHART_NAME,
    detectCharts,
    DRAWINGML_CHART_URI,
    EJ2_XLSX_ROOT_EXPORT_VERIFICATION,
    EMBEDDED_PACKAGE_RELATIONSHIP_TYPE,
    EMBEDDED_XLSX_CONTENT_TYPE,
    enableCharts,
    enumerateDocumentCharts,
    getCachedXlsxRoot,
    getChartPackageGraph,
    getXlsxChartHostApi,
    isChartExTypeKey,
    isClassicChartType,
    isNestedPackageSecurityError,
    listChartChildRelationships,
    listChartRelatedParts,
    loadXlsxRoot,
    openNestedXlsxPackage,
    partNameOptions,
    PPT_CHART_PART_PREFIX,
    PPT_EMBEDDING_PART_PREFIX,
    removeChart,
    resolveChart,
    tryLoadXlsxRoot
} from './charts/index';
export {
    AddChartFromExcelSource,
    AddChartSeriesOptions,
    AddChartOptions,
    ChartDataSource,
    ChartFrameFillFormat,
    ChartFrameFormat,
    ChartFrameLineFormat,
    ChartInstance,
    ChartPackageGraph,
    ChartPackagePart,
    ChartPackageRelationship,
    ChartPartExport,
    ChartRelatedKind,
    ChartRelatedPart,
    ChartAxisFormat,
    ChartLegendFormat,
    ChartSeriesDataLabels,
    ChartSeriesView,
    ChartTitleAreaFormat,
    ClassicChartTypeKey,
    Ej2XlsxRootModule,
    HostChart,
    HostChartRelationship,
    HostWorkbook,
    HostWorksheet,
    HostWorksheetCell,
    NestedPackageOpenResult,
    ParsedChartSpace,
    SerializeChartSpaceEntry,
    XlsxChartHostApi,
    XlsxRootLoadResult
} from './charts/index';
export {
    COMMENTS_FEATURE_ID,
    MODERN_COMMENTS_REL_TYPE,
    enableCommentsModule
} from './comments/index';
export {
    HYPERLINK_REL_TYPE,
    HYPERLINKS_ACTIONS_FEATURE_ID,
    addExternalHyperlink,
    clearHyperlink,
    readRunHyperlink,
    readShapeHyperlink,
    retargetExternal,
    retargetInternal,
    HyperlinkMutationError,
    classifyHyperlinkTarget,
    notePresentation,
    readPictureHyperlinkView,
    readShapeHyperlinkView,
    readTextPartHyperlinkView,
    removePictureHyperlink,
    removeShapeHyperlink,
    removeTextPartHyperlink,
    setPictureHyperlink,
    setShapeHyperlink,
    setTextPartHyperlink
} from './hyperlinks-actions/index';
export {
    AddExternalHyperlinkOptions,
    HyperlinkInfo,
    HyperlinkSourceKind,
    RunHyperlinkKind,
    ShapeHyperlinkKind
} from './hyperlinks-actions/index';
export {
    MACROS_DETECT_FEATURE_ID,
    enableMacrosDetect
} from './macros-detect/index';
export {
    detectMedia
} from './media/index';
export {
    NOTES_FEATURE_ID,
    NOTES_MASTER_CONTENT_TYPE,
    NOTES_MASTER_REL_TYPE,
    NOTES_SLIDE_CONTENT_TYPE,
    NOTES_SLIDE_REL_TYPE,
    HANDOUT_MASTER_CONTENT_TYPE,
    HANDOUT_MASTER_REL_TYPE,
    NotesSlide,
    NotesMutationOptions,
    NotesMaster,
    HandoutMaster,
    addNotesSlide,
    ensureNotes,
    getNotes,
    getHandoutMaster,
    removeNotesSlide,
    NotesError
} from './notes/index';
export {
    detectOle
} from './ole/index';
export {
    addTable,
    removeTable,
    asTable,
    DRAWINGML_TABLE_URI,
    Table,
    TableCell,
    TablesError,
    TABLES_FEATURE_ID,
    DEFAULT_TABLE_BOUNDS,
    DEFAULT_TABLE_NAME,
    buildEmptyTableCell,
    buildTableGraphicFrame,
    buildTbl,
    resolveColumnWidthsEmu,
    resolveRowHeightsEmu,
    BuiltInTableStyle
} from './tables/index';
export {
    AddTableOptions,
    AddTableColumnOptions,
    AddTableRowOptions,
    DirectTableCellProperties,
    DirectTableCellPropertiesPatch,
    TableMergeInfo,
    BuildTableGraphicFrameArgs,
    BuildTblArgs
} from './tables/index';
