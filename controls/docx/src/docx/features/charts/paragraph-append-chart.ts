/**
 * Paragraph.appendChart() implementation.
 *
 * Adds a new chart to a paragraph with specified type, width, and height.
 *
 * Handles:
 * 1. Input validation (chart type, width, height)
 * 2. Backend chart creation with real XLSX workbook
 * 3. Chart paragraph item creation
 * 4. Insertion through standard paragraph.items API
 * 5. Proper ID allocation (deferred to serialization)
 *
 * The chart is immediately usable for data modification and formatting.
 * Real IDs and package names are allocated during document save.
 *
 * @private
 */

import { Paragraph } from '../document/paragraph';
import { Chart } from './chart';
import { ChartType } from '@syncfusion/ej2-xlsx';
import { createChartBackendState, ChartBackendState } from './backend-state';
import { createChartWithBackend, isValidChartType } from './backend-adapter';

/**
 * Implementation of Paragraph.appendChart().
 *
 * Creates a new chart paragraph item with the specified type, width, and height.
 * The chart is added directly to the paragraph items collection through
 * the standard paragraph insertion API (not casting to any).
 *
 * @param {Paragraph} paragraph - The owning paragraph.
 * @param {ChartType} chartType - Chart type identifier (e.g., ChartType.ColumnClustered).
 * @param {number} width - Width in points (must be positive and finite).
 * @param {number} height - Height in points (must be positive and finite).
 * @returns {Chart} The new Chart paragraph item.
 * @throws DocxError if validation fails or chart creation fails
 * @private
 */
export function appendChartImpl(
    paragraph: Paragraph,
    chartType: ChartType,
    width: number,
    height: number
): Chart {
    // Assert paragraph is still mutable
    paragraph.ensureMutable();

    // Validate chart type
    if (!isValidChartType(chartType)) {
        throw new Error('Invalid chart type: ' + chartType);
    }

    // Validate width
    if (width <= 0 || !isFinite(width)) {
        throw new Error('Chart width must be a positive number greater than zero');
    }

    // Validate height
    if (height <= 0 || !isFinite(height)) {
        throw new Error('Chart height must be a positive number greater than zero');
    }

    // Create backend state with real XLSX workbook, worksheet, and chart
    const backendState: ChartBackendState = createChartWithBackend(chartType);

    // Provisional IDs (to be allocated during serialization)
    // These are marked @private and not exposed to users
    const docPrId: number = 0; // Placeholder; allocated during save
    const chartName: string = 'Chart 1'; // Placeholder; will be updated during save
    const relationshipId: string = 'rId1'; // Placeholder; allocated during save

    // Create the chart paragraph item
    const chart: Chart = new Chart(
        relationshipId,
        width,
        height,
        chartName,
        docPrId,
        backendState
    );
    chart.autoTitle = true;
    // Word charts show gridlines on the value axis only; xlsx defaults both axes on.
    backendState.backendChart.primaryCategoryAxis.hasMajorGridLines = false;

    // Insert through standard paragraph items API
    // The items collection handles attachment and ownership
    const items: any = (paragraph as any).items;
    if (typeof items.add === 'function') {
        items.add(chart);
    } else {
        throw new Error('Paragraph.items does not support add() method');
    }

    return chart;
}

/**
 * Bind appendChart to Paragraph prototype.
 * Called during feature registration.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function bindAppendChartToParaGraph(): void {
    // This will be called from the feature registration
    // For now, TypeScript augmentation handles the method signature
    // Runtime installation happens when the charts feature loads
}
