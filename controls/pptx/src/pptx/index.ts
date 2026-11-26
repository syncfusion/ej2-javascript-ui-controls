/**
 * Public entry point for @syncfusion/ej2-pptx.
 *
 * @packageDocumentation
 */
export { AnimationTargetError, PresentationError, PresentationErrorCode } from './core/errors';
export { BuiltInProperties, BuiltInProperty } from './core/properties/builtin-set';
export { CustomProperties, CustomPropertyValue } from './core/properties/custom-set';
export { DEFAULT_SECURITY_LIMITS, EncryptedPackageError, InvalidPackageError, InvalidPasswordError, PackageLimitError,
    resolveLimits, UnsupportedEncryptionError, XmlLimitError, SecurityErrorOptions, SecurityLimits } from './core/security/index';
export { MarkupCompatibilityError, MarkupCompatibilityErrorCode } from './core/xml/index';
export { Presentation, FormatType, getFormatTypeFromContentType, getFormatTypeFromExtension, COMMENT_AUTHORS_CONTENT_TYPE, COMMENT_AUTHORS_REL_TYPE, COMMENTS_CONTENT_TYPE,
    COMMENTS_REL_TYPE, CONTENT_TYPES_PART_NAME, DIGITAL_SIGNATURE_CONTENT_TYPE, DIGITAL_SIGNATURE_ORIGIN_CONTENT_TYPE,
    DIGITAL_SIGNATURE_ORIGIN_PART_NAME, DIGITAL_SIGNATURE_ORIGIN_REL_TYPE, DIGITAL_SIGNATURE_REL_TYPE, IMAGE_GIF_CONTENT_TYPE, IMAGE_JPEG_CONTENT_TYPE, IMAGE_PNG_CONTENT_TYPE, IMAGE_REL_TYPE, OFFICE_DOCUMENT_REL_TYPE, PACKAGE_RELS_PART_NAME, PRESENTATION_MAIN_CONTENT_TYPES, SLIDE_CONTENT_TYPE, SLIDE_LAYOUT_CONTENT_TYPE, SLIDE_LAYOUT_REL_TYPE, SLIDE_MASTER_CONTENT_TYPE, SLIDE_MASTER_REL_TYPE, SLIDE_REL_TYPE, THEME_CONTENT_TYPE, THEME_REL_TYPE, VBA_PROJECT_CONTENT_TYPE, VBA_PROJECT_REL_TYPE, DEFAULT_SLIDE_LAYOUT_TYPE, SlideLayoutType, isSlideLayoutType, AddSlideOptions, CreatePresentationOptions, HostPartRelationshipAccess, OpenPresentationInput, OpenPresentationOptions, PackagePart, PackagePartAccess, PackageRelationship, RelationshipTargetMode, SlideCollection, SlideLayoutTypeValue } from './core/package/index';
export { DEFAULT_PICTURE_NAME, DEFAULT_PICTURE_BOUNDS, PICTURE_INSERT_CONTENT_TYPES, Picture, AddPictureOptions,
    PictureBounds, PictureDataInput, ReplaceImageDataOptions } from './core/pictures/index';
export {
    PictureBlipEffectKind, PictureBlipEffectSnapshot, PictureDirectRelationshipSnapshot,
    PictureDirectSnapshot, PictureEffectColorSnapshot, PictureEmbeddedSourceSnapshot,
    PictureIntrinsicSizeSnapshot, PictureLinkedSourceSnapshot, PictureMediaRequest,
    PictureMediaResponse, PictureRelativeRectangleSnapshot, PictureRenderSnapshot, ShapePictureFillRenderSnapshot,
    PictureResolvedRelationshipSnapshot, PictureResolvedSnapshot, PictureStretchSnapshot,
    PictureTileAlignment, PictureTileFlip, PictureTileSnapshot
} from './worker/picture-render-snapshot';
export { BackgroundFill, DirectSlideBackground, DateTimeFormatType, HeaderFooter, HeadersFooters, HyperlinkView, LayoutSlide, MasterSlide, PictureBackgroundFill, PresentationSection, Section, SectionCollection,
    ResolvedSlideBackground, Slide, OFFICE_REL_ATTR_NS, PML_NS, ShapeType, ST_SLIDE_ID_MAX_EXCLUSIVE,
    ST_SLIDE_ID_MIN } from './core/presentation/index';
export { AutoShapeType, DML_NS, DEFAULT_AUTO_SHAPE_BOUNDS, DEFAULT_TEXT_BOX_BOUNDS, DEFAULT_TEXT_BOX_NAME,
    ST_DRAWING_ELEMENT_ID_MAX, Shape, PictureShape, ShapeNotFoundError, ShapeTextError, ShapeTreeCycleError, isAutoShapeType, AddShapeOptions, 
    AddTextOptions, AddTextBoxOptions, AutoShapeTypeValue, BlipFill, ConnectorConnection, ConnectorEnds, CustomGeometry,
    CustomGeometryCommand, CustomGeometryConnectionSite, CustomGeometryPath, CustomGeometryPoint,
    DirectFill, DirectGeometry, DirectLine, DirectLineFill, DirectTransform, EmuPoint, EmuSize, GeometryGuide, GeometryKind,
    GradientFill, GroupChildSpace, GroupFill, LineEnd, LineJoin, MissingFill, NoFill, PatternFill, PresetGeometry,
    ResolvedDirectFill, ResolvedFill, ResolvedMissingFill, ResolvedStyleRefFill, ShapeCollection, ShapeElementKind,
    ShapeStyleRefs, SolidFill, StyleMatrixReference, ShapeBounds, TextBoxBounds } from './core/shapes/index';
export { DEFAULT_PLACEHOLDER_IDX, DEFAULT_PLACEHOLDER_TYPE, PLACEHOLDER_TYPES, isPlaceholderType, PlaceholderInfo,
    PlaceholderMatch, PlaceholderType } from './core/placeholders/index';
export { ResolvedTextStyle, ResolvedTransform, StyleInheritanceSource } from './core/resolve/index';
export { COLOR_MAP_KEYS, COLOR_SCHEME_SLOTS, ColorMapping, ColorScheme, SCHEME_COLOR_VALS, ThemePart,
    effectiveColorMap, isColorMapKey, isColorSchemeIndex, resolveColor, resolveSchemeColor, ColorMapKey, ColorSchemeIndex, ColorValue,
    EffectiveColorContext, HslColorValue, PrstColorValue, ResolvedColor, ResolvedDirectColor, ResolvedSrgbColor,
    SchemeColorVal, SchemeColorValue, ScrgbColorValue, SrgbColorValue, SysColorValue, UnresolvedColor,
    UnresolvedColorReason,
    ThemeColorTransform, ThemeEffectStyle, ThemeFillStyle, ThemeFontCollection, ThemeFontScheme, ThemeFormatScheme, ThemeGradientStop,
    ThemeLineStyle, ThemeSupplementalFont, ThemeTypeface } from './core/theme/index';
export { TextBody, TextRange, TextRangeAnchor, Paragraph, TextPart, Font, TextUnderlineType, TextStrikeType,
    TextCapsType, isTextUnderlineType,
    isTextStrikeType, isTextCapsType, HorizontalAlignmentType, isHorizontalAlignmentType, TextSpacingType, isTextSpacingType, TextFindMatch, TextSelection,
    TextUnderlineTypeValue, TextStrikeTypeValue, TextCapsTypeValue, HorizontalAlignmentTypeValue, TextSpacingTypeValue, TextSpacingValue,
    TextAutoFit, TextBodyProperties, TextTabStop, TextVerticalAnchor, TextVerticalType, TextWrapping,
    ParagraphCollection, TextPartCollection, ListFormat, ListType, NumberedListStyle, ListTypeValue,
    NumberedListStyleValue } from './core/text/index';
export { ensureFeature, isFeatureRegistered, listRegisteredFeatures, registerFeature, FeatureId,
    FeatureModule } from './core/registry/index';
export {
    PRESENTATION_WORKER_SOURCE,
    resolveTextParagraphStyleSnapshot,
    resolveTextCharacterStyleSnapshot,
    selectTextMasterStyleBucket
} from './worker/index';
export {
    DirectTextParagraphStyleSnapshot,
    ResolvedTextParagraphStyleSnapshot,
    TextMasterStyleSnapshot,
    TextStyleInheritanceSource,
    TextStyleLevelSnapshot,
    TextStylePropertySources,
    TextStyleResolutionInput,
    TextStyleSpacingSnapshot,
    TextStyleTabSnapshot,
    TextBulletColorSnapshot,
    TextBulletFontSnapshot,
    TextBulletSizeSnapshot,
    TextBulletSnapshot,
    FallbackFrameDirectSnapshot,
    FallbackFrameKind,
    FallbackFrameRenderSnapshot,
    FallbackFrameResolvedSnapshot,
    OuterShadowEffectSnapshot,
    ShapeEffectSnapshot,
    TableCellBorderSnapshot,
    TableCellDirectStyleSnapshot,
    TableCellRenderSnapshot,
    TableCellResolvedStyleSnapshot,
    TableCellTextStyleSnapshot,
    TableCellTextBodySnapshot,
    TableDirectPropertiesSnapshot,
    TableJsonValue,
    TableRenderSnapshot,
    TableStyleBucket
} from './worker/index';
export {
    readTextParagraphContentSnapshot,
    readTextParagraphDirectStyleSnapshot,
    readTextParagraphEndCharacterSnapshot
} from './worker/rich-text-snapshot';
export {
    DirectTextCharacterSnapshot,
    TextBreakContentSnapshot,
    TextColorSnapshot,
    TextFieldContentSnapshot,
    TextHyperlinkSnapshot,
    TextParagraphContentSnapshot,
    TextRunContentSnapshot
} from './worker/rich-text-snapshot';
export {
    FontDesignUnit,
    FontResolutionRequest,
    LayoutFontCollection,
    LayoutPresentationInfo,
    LayoutShapeLevels,
    LayoutShapeSnapshot,
    LayoutTextBodyPropertiesSnapshot,
    LayoutTextBodySnapshot,
    LayoutTextCharacterSnapshot,
    LayoutTextColorSnapshot,
    LayoutTextContentSnapshot,
    LayoutTextParagraphSnapshot,
    LayoutTextRunSnapshot,
    LayoutThemeSnapshot,
    PINNED_FONT_FAMILIES,
    PINNED_FONT_METRIC_UNITS,
    ResolvedFontFamily,
    ResolvedTextBody,
    ResolvedTextBodyProperties,
    ResolvedTextParagraph,
    ShapeTextBounds,
    SkiaFontMetrics,
    SymbolFontBulletReplacement,
    TextBoxLayout,
    TextLayoutLine,
    TextLayoutMarker,
    TextLayoutSegment,
    TextMeasureRequest,
    TextMeasureResult,
    TextMeasurer,
    TextPoint,
    TextScript,
    TextShapeResult,
    ThemeFontCollections,
    fontDesignUnit,
    layoutTextBody,
    resolveFontFamily,
    resolvePresetTextBounds,
    resolveSymbolFontBullet,
    resolveTextBody,
    resolveTextTransform,
    skiaFontMetrics,
    skiaLayoutAscent,
    textPoint
} from './core/layout/index';

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
    OfficeChartType,
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
    resolveChart,
    tryLoadXlsxRoot
} from './features/charts/index';
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
    ChartCategoryAxis,
    ChartData,
    ChartDataRange,
    ChartRange,
    ChartRangeLike,
    ChartSeries,
    ChartSeriesApi,
    ChartSeriesCollection,
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
} from './features/charts/index';
export {
    COMMENTS_FEATURE_ID,
    MODERN_COMMENTS_REL_TYPE,
    enableCommentsModule
} from './features/comments/index';
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
} from './features/hyperlinks-actions/index';
export {
    AddExternalHyperlinkOptions,
    HyperlinkInfo,
    HyperlinkSourceKind,
    RunHyperlinkKind,
    ShapeHyperlinkKind
} from './features/hyperlinks-actions/index';
export {
    MACROS_DETECT_FEATURE_ID,
    enableMacrosDetect
} from './features/macros-detect/index';
export {
    detectMedia
} from './features/media/index';
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
} from './features/notes/index';
export {
    detectOle
} from './features/ole/index';
export {
    addTable,
    asTable,
    BuiltInTableStyle,
    DRAWINGML_TABLE_URI,
    Table,
    TableCell,
    TableRow,
    TableRows,
    TableColumn,
    TableColumns,
    TablesError,
    TABLES_FEATURE_ID,
    DEFAULT_TABLE_BOUNDS,
    DEFAULT_TABLE_NAME,
    buildEmptyTableCell,
    buildTableGraphicFrame,
    buildTbl,
    resolveColumnWidthsEmu,
    resolveRowHeightsEmu
} from './features/tables/index';
export {
    AddTableOptions,
    AddTableColumnOptions,
    AddTableRowOptions,
    DirectTableCellProperties,
    DirectTableCellPropertiesPatch,
    TableMergeInfo,
    BuildTableGraphicFrameArgs,
    BuildTblArgs
} from './features/tables/index';

export { GradientHostResult, GradientHostDiagnostic, GradientGroupOwner } from './core/resolve/gradient-hosts';
export { EffectiveGradientFill, EffectiveGradientShade, EffectiveGradientRectangle, EffectiveGradientStop,
    EffectiveGradientValue, GradientValueSource } from './core/resolve/gradient-resolution-types';
export { GradientColorResult, GradientColorFailure, GradientReferenceColor, resolveGradientStopColor } from './core/layout/gradient-color-resolution';
export { AuthoredFillMatrixReference, AuthoredLineMatrixReference } from './core/theme/read-fill-reference';
export { GradientLexical } from './core/theme/gradient-values';
export { GradientReadDiagnostic } from './core/theme/gradient-types';

export { GradientFillOptions, GradientStopOptions, GradientShadeOptions, GradientRectangleOptions, GradientColorOperation } from './core/shapes/gradient-fill-options';
export { GradientFillError } from './core/shapes/write-gradient-fill';

export { GradientStopEditor, GradientEditableStop } from './core/shapes/gradient-stop-editor';

export { TextCharacterFills, TextFillSnapshot, TextLineFillSnapshot, TextUnderlineFillSnapshot, TextUnderlineLineSnapshot } from './core/text/character-fills';

export { EffectiveTextCharacterFills, EffectiveTextFill, EffectiveTextDecorationFill, TextFillInheritanceSource } from './core/resolve/resolve-text-fills';
export { TextFillTarget } from './core/resolve/text-fill-host';

export { TextGradientDecoration } from './core/shapes/mutate-decoration-fill';

export { TableFillChoice, TableStyleFillSnapshot, TableCellFillSnapshot, TableFillData,
    TableFillSelection, TableFillResolvedData, TableGradientFillSnapshot, TableStyleFillRegion } from './worker/table-fill-bindings';

export { TablePhysicalBorderEdge, TableBorderEdge, TableBorderLineProperties, TableBorderChoice,
    TableBorderRecord, TableBorderSelection } from './worker/table-border-bindings';

export { ThemeGradientMatrix } from './core/theme/theme-matrix-editor';

/** Canonical authored gradient sidecar wire type, separate from render paint. */
export { GradientPartSnapshot, AuthoredGradientRecord, GradientPathStep } from './worker/gradient-transport';

export { GradientGeometryPatch, GradientShadePatch, GradientRectanglePatch } from './core/shapes/gradient-geometry';

export { GradientBackgroundCopy } from './core/presentation/gradient-background-copy';

export { TextLineStyleSnapshot } from './core/text/text-line-style';

export { parseChartRenderModel } from './features/charts/parse-chart-render-model';
export {
    ChartAxisModel, ChartColor, ChartColorTransform, ChartDataLabelsModel, ChartErrorBarsModel, ChartFill, ChartLegendModel,
    ChartLine, ChartMarkerModel, ChartPlotKind, ChartPlotModel, ChartPointFormat, ChartRenderModel, ChartSeriesModel,
    ChartShapeFormat, ChartTextStyle, ChartTitleModel, ChartTrendlineModel
} from './features/charts/chart-render-model';
