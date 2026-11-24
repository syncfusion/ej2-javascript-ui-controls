/**
 * Chart support for Word documents.
 *
 * @remarks
 * A chart is a paragraph item created with {@link Paragraph.appendChart}.
 * The document owns the chart lifecycle; the chart formatting model (title area, chart area, plot area,
 * legend, axes, series, data labels) is owned by `@syncfusion/ej2-xlsx` and exposed unchanged.
 *
 * @packageDocumentation
 * @public
 */

// ============================================================================
// Public API - Core Chart Class and Data
// ============================================================================

/**
 * Live chart paragraph item.
 *
 * @public
 */
export { Chart } from './chart';

/**
 * Chart data accessor for cell-level read/write operations.
 *
 * @public
 */
export { ChartData } from './chart-data';

// ============================================================================
// Public API - ej2-xlsx chart model (passed through, not re-implemented)
// ============================================================================

/**
 * Chart formatting objects, enums and constants are owned by ej2-xlsx and
 * returned by the live `Chart` getters as-is (`chartTitleArea`, `chartArea`,
 * `plotArea`, `legend`, axes, `series`). New ej2-xlsx chart members therefore
 * reach ej2-docx users without any change here.
 *
 * @public
 */
export {
    ChartType, ChartFillType, DataLabelPosition, LegendPosition, TickMarkType,
    Chart as XlsxChart, ChartAxis, ChartDataLabels, ChartFill, ChartFrameFormat, ChartLegend,
    ChartLineFormat, ChartSerieFormat, ChartSeries, ChartTextArea, ChartView3D
} from '@syncfusion/ej2-xlsx';

// ============================================================================
// Feature Registration & Initialization
// ============================================================================

// Side-effect: registers the chart feature with the document model.
import './register';

/**
 * Reset chart feature (test-only utility).
 *
 * @private
 */
export { resetChartsFeatureForTests, registerChartsFeature } from './register';

// ============================================================================
// DO NOT EXPORT:
// ============================================================================

// Internal types (never exported):
// - ChartBackendState, createChartBackendState
// - XlsxWorkbookHandle, XlsxWorksheetHandle, XlsxChartHandle
// - appendChartImpl, createChartWithBackend, isValidChartType
// - Chart parsing, serialization, package helpers
// - Standalone appendChart function
// - ChartOptions, OfficeChartCreateOptions
// - Any XLSX-specific types or handles
