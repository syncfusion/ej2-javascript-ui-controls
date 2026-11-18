/**
 * Internal XLSX backend state for a chart.
 *
 * Holds the real backend XLSX workbook, worksheet, and chart handle.
 * This is the internal integration layer — not exposed publicly.
 *
 * Every chart maintains exactly one backend state with independent:
 * - Workbook instance
 * - Worksheet instance
 * - Chart handle
 * - Cached bytes
 *
 * @private
 */

import { DocxError } from '../../core/errors/docx-error';
import { Workbook as IWorkbook, Worksheet as IWorksheet, Chart as IChart } from '@syncfusion/ej2-xlsx';

// Type aliases for backend handles
type XlsxWorkbookHandle = IWorkbook;
type XlsxWorksheetHandle = IWorksheet;
type XlsxChartHandle = IChart;

/**
 * Chart backend state — internal only.
 * Encapsulates real XLSX workbook, worksheet, and chart instance.
 *
 * All three components (workbook, worksheet, chart) must be present
 * and belong together. No partial or placeholder state is allowed.
 *
 * @private
 */
export interface ChartBackendState {
    /**
     * Real XLSX workbook instance.
     * Owned exclusively by this chart during its lifetime.
     * Created fresh for each chart; never shared.
     *
     * @private
     */
    readonly workbook: XlsxWorkbookHandle;

    /**
     * Real XLSX worksheet within the workbook.
     * Contains the chart's data cells (typically first sheet).
     * Created when workbook is created.
     *
     * @private
     */
    readonly worksheet: XlsxWorksheetHandle;

    /**
     * Real XLSX chart handle, worksheet-owned.
     * Obtained from worksheet.addChart() or parsed from existing data.
     * Represents a real DrawingML chart in the XLSX object model.
     *
     * @private
     */
    readonly backendChart: XlsxChartHandle;

    /**
     * Whether the worksheet data has been modified and needs sync.
     * Mark true when series values or categories change.
     * Cleared after export.
     *
     * @private
     */
    dataDirty: boolean;

    /**
     * Whether the backend chart has been modified and needs re-export.
     * Mark true when chart properties change (title, legend, axes).
     * Cleared after export.
     *
     * @private
     */
    chartDirty: boolean;

    /**
     * Cached workbook bytes from last save.
     * Used for packaging the embedded workbook into the DOCX.
     * Cleared after packaging; refreshed on next save.
     *
     * @private
     */
    cachedWorkbookBytes: Uint8Array | undefined;
}

/**
 * Create initial backend state with a new workbook/worksheet/chart.
 *
 * Validates that all three required components are present.
 * This is called during appendChart() or parsing.
 *
 * @param {XlsxWorkbookHandle} workbook - Real XLSX workbook (never undefined)
 * @param {XlsxWorksheetHandle} worksheet - Real XLSX worksheet from that workbook (never undefined)
 * @param {XlsxChartHandle} backendChart - Real XLSX chart from that worksheet (never undefined)
 * @returns {ChartBackendState} Initialized backend state
 * @throws DocxError if any component is undefined
 * @private
 */
export function createChartBackendState(
    workbook: XlsxWorkbookHandle,
    worksheet: XlsxWorksheetHandle,
    backendChart: XlsxChartHandle
): ChartBackendState {
    // Validate that all required components are present
    if (!workbook) {
        throw new DocxError(
            'chart/invalid-backend-state',
            'Workbook is required for chart backend state'
        );
    }

    if (!worksheet) {
        throw new DocxError(
            'chart/invalid-backend-state',
            'Worksheet is required for chart backend state'
        );
    }

    if (!backendChart) {
        throw new DocxError(
            'chart/invalid-backend-state',
            'Backend chart is required for chart backend state'
        );
    }

    return {
        workbook,
        worksheet,
        backendChart,
        dataDirty: false,
        chartDirty: false,
        cachedWorkbookBytes: undefined
    };
}
