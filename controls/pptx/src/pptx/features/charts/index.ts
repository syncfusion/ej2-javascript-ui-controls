/**
 * Optional DrawingML charts module (`@syncfusion/ej2-pptx/charts`).
 *
 * @remarks
 * **TASK-1066 CH-0** established the architecture boundary (feature id,
 * detector, nested package limits, xlsx root surface).
 *
 * **TASK-1067** adds the package-graph bridge + `parseChartSpace` read model:
 * {@link asChart} / {@link resolveChart} / {@link enumerateDocumentCharts},
 * host {@link buildChartPackageGraph}, related-part classification, typed
 * {@link ChartsError}.
 *
 * **TASK-1068** adds public {@link Charts} on `slide.charts` (`length` +
 * {@link Charts.at}) and the {@link Chart} handle (shape + safe read props).
 *
 * **TASK-1069** adds {@link addChart} / {@link removeChart} on `Slide`, the
 * finite classic type catalog, and minimal embedded XLSX + `c:externalData`
 * via ej2-xlsx `exportChartPart`. ChartEx authoring and dual-write remain out
 * of scope. Nested embeddings stay classified only on the read bridge path.
 *
 * **TASK-1070** extends {@link AddChartOptions} with optional `from` (bytes or
 * live workbook + sheet + range). Embedding policy is **subset** (copied cell
 * values into a new minimal XLSX), not a full consumer-package copy. Nested
 * bytes are scanned via {@link openNestedXlsxPackage} before `Workbook.open`.
 *
 * **TASK-1071** adds dual-write data edit (`dataRange`, series cells,
 * `addSeries` / `removeSeries`) and {@link Chart.refresh} (not full Excel calc;
 * external-only / missing embed refuse with typed {@link ChartsError}).
 * Dual-write keeps formula strings + sheet cells; presentation-chart
 * `numCache`/`strCache` are filled from those cells on create/flush.
 *
 * `charts`, `addChart`, and `removeChart` are declared directly on the core
 * {@link Slide} class (API-RULES R6.2). Detect + security remain import-safe
 * when xlsx is missing; authoring and `slide.charts` materialization require
 * {@link loadXlsxRoot} (warm cache for sync collection).
 *
 * Citations: ECMA-376 Part 1 §14.2.1–§14.2.2; Part 4 §12.2.1–§12.2.2 / §13.2.9;
 * [MS-ODRAWXML] 2.1.1–2.1.2; ADR `docs/adr/2026-09-18-chart-edit.md`;
 * req/spec **037**; `.agent/policies/security.md`.
 *
 * @packageDocumentation
 */
import { registerFeature, registerGraphicKindDetector } from '../../core/registry/feature-registry';
import { ShapeType } from '../../core/presentation/shapetype';
import { addChart, DEFAULT_CHART_BOUNDS, DEFAULT_CHART_NAME, DEFAULT_FROM_EXCEL_RANGE, EMBEDDED_XLSX_CONTENT_TYPE, PPT_CHART_PART_PREFIX, PPT_EMBEDDING_PART_PREFIX, AddChartFromExcelSource, AddChartOptions } from './add-chart';
import { Chart } from './chart';
import { AddChartSeriesOptions, ChartSeriesView } from './chart-data-edit';
import { Charts } from './charts';
import { CHART_EX_ENGINE_TYPE_VALUES, CHART_EX_TYPE_KEYS, CLASSIC_CHART_TYPE_KEYS, isChartExTypeKey, isClassicChartType, ClassicChartTypeKey } from './classic-chart-types';
import { CHART_COLOR_STYLE_CONTENT_TYPE, CHART_COLOR_STYLE_RELATIONSHIP_TYPE, CHART_CONTENT_TYPE, CHART_RELATIONSHIP_TYPE, CHART_STYLE_CONTENT_TYPE, CHART_STYLE_RELATIONSHIP_TYPE, CHART_USER_SHAPES_CONTENT_TYPE, CHART_USER_SHAPES_RELATIONSHIP_TYPE, CHARTS_FEATURE_ID, DRAWINGML_CHART_URI, EMBEDDED_PACKAGE_RELATIONSHIP_TYPE } from './constants';
import { ChartsError, partNameOptions } from './errors';
import { isNestedPackageSecurityError, openNestedXlsxPackage, openNestedXlsxPackageSync, NestedPackageOpenResult } from './nested-package-security';
import { buildChartPackageGraph, ChartPackageGraph, ChartPackagePart, ChartPackageRelationship } from './package-graph';
import { chartHasColorStyle, chartHasEmbeddedPackage, chartHasRelatedKind, chartHasStyle, chartHasUnknownRelatedParts, chartHasUserShapes, chartPartName, listChartRelatedParts } from './read-model';
import { removeChart } from './remove-chart';
import { asChart, chartDataSourceKind, enumerateDocumentCharts, getChartPackageGraph, listChartChildRelationships, resolveChart, ChartInstance, ChartRelatedKind, ChartRelatedPart } from './resolve-chart';
import { getXlsxChartHostApi, ChartDataSource, ChartFrameFillFormat, ChartFrameFormat, ChartFrameLineFormat, ChartPartExport, ChartAxisFormat, ChartLegendFormat, ChartSeriesDataLabels, ChartTitleAreaFormat, HostChart, HostChartRelationship, HostWorkbook, HostWorksheet, HostWorksheetCell, ParsedChartSpace, SerializeChartSpaceEntry, XlsxChartHostApi } from './xlsx-chart-api';
import { assertApprovedXlsxImportSpecifier, clearCachedXlsxRoot, EJ2_XLSX_ROOT_EXPORT_VERIFICATION, getCachedXlsxRoot, getXlsxRootRequired, loadXlsxRoot, tryLoadXlsxRoot, Ej2XlsxRootModule, XlsxRootLoadResult } from './xlsx-surface';

interface ChartDetector {
    detect(uri: string | undefined): ShapeType | null;
}

const chartDetector: ChartDetector = {
    detect: (uri: string | undefined): ShapeType | null => (uri === DRAWINGML_CHART_URI ? 'chart' : null)
};
/**
 * One-time activate: warm xlsx root so sync `slide.charts` can materialize.
 *
 * @remarks
 * Detect/security remain import-safe when xlsx is missing; activation failure
 * surfaces only when `ensureFeature(CHARTS_FEATURE_ID)` is awaited.
 *
 * @returns {Promise<void>} A promise that resolves after the xlsx root has been loaded.
 */
async function activateCharts(): Promise<void> {
    await loadXlsxRoot();
}
registerGraphicKindDetector(chartDetector);
registerFeature({ id: CHARTS_FEATURE_ID, activate: activateCharts });
/**
 * Ensures the chart graphic-kind detector is registered.
 *
 * @remarks
 * Importing `@syncfusion/ej2-pptx/charts` already registers; call this when an
 * application wants an explicit enablement hook (same pattern as
 * diagrams/tables).
 *
 * @public
 *
 * @returns {void} Nothing.
 */
export function detectCharts(): void {
    registerGraphicKindDetector(chartDetector);
}
/**
 * Ensures the charts feature id is registered (with xlsx warm-on-activate).
 *
 * @public
 *
 * @returns {void} Nothing.
 */
export function enableCharts(): void {
    registerFeature({ id: CHARTS_FEATURE_ID, activate: activateCharts });
}
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
    DRAWINGML_CHART_URI,
    EJ2_XLSX_ROOT_EXPORT_VERIFICATION,
    EMBEDDED_PACKAGE_RELATIONSHIP_TYPE,
    EMBEDDED_XLSX_CONTENT_TYPE,
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
};
export { parseChartRenderModel } from './parse-chart-render-model';
export {
    ChartAxisModel,
    ChartColor,
    ChartColorTransform,
    ChartDataLabelsModel,
    ChartErrorBarsModel,
    ChartFill,
    ChartLegendModel,
    ChartLine,
    ChartMarkerModel,
    ChartPlotKind,
    ChartPlotModel,
    ChartPointFormat,
    ChartRenderModel,
    ChartSeriesModel,
    ChartShapeFormat,
    ChartTextStyle,
    ChartTitleModel,
    ChartTrendlineModel
} from './chart-render-model';
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
};

export { ChartGradientSource, ChartGradientHostKind } from './chart-gradient-sources';

export { ChartGradientTarget, ChartGradientLane } from './chart-gradient-target';

export { ChartTextTarget, ChartTextLane } from './chart-text-source';
