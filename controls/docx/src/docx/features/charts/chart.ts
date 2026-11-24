/**
 * Public chart paragraph item for ej2-docx.
 *
 * A chart is a proper paragraph item that inherits from ParagraphItem,
 * stored directly in the paragraph.items collection.
 *
 * Internally, it maintains a real XLSX workbook, worksheet, and chart handle.
 * All XLSX-specific types and properties are kept private.
 *
 * @public
 */

import { DetachedObjectError } from '../../core/errors/docx-error';
import { ParagraphItem, ParagraphItemOwner } from '../document/paragraph-item';
import { EntityType } from '../document/entity-type';
import { ChartBackendState } from './backend-state';
import {
    Chart as XlsxChart, ChartAxis, ChartFrameFormat, ChartLegend, ChartSeries, ChartTextArea
} from '@syncfusion/ej2-xlsx';

type ScatterStyle = NonNullable<XlsxChart['scatterStyle']>;
import { ChartData } from './chart-data';
import { LoadedChartPart } from './chart-merge';

import { buildChartRun } from './chart-drawing';
import { OpenXmlElement } from '../../core/xml/index';

/**
 * Live chart in a paragraph.
 *
 * Represents a DrawingML chart with embedded XLSX workbook and data.
 * The chart is a proper paragraph item and participates in normal
 * paragraph-item traversal, cloning, importing, and destruction.
 *
 * @public
 */
export class Chart extends ParagraphItem {
    /**
     * Gets the entity type.
     *
     * @public
     */
    readonly entityType: EntityType.Chart = EntityType.Chart;

    /**
     * Relationship ID linking to the chart part in the owning story.
     *
     * @private
     */
    private relationshipIdValue: string;

    /**
     * Width in points.
     *
     * @private
     */
    private widthPtValue: number;

    /**
     * Height in points.
     *
     * @private
     */
    private heightPtValue: number;

    /**
     * Chart name (used in drawing properties).
     *
     * @private
     */
    private nameValue: string;

    /**
     * Drawing object ID (unique within owning story part).
     *
     * @private
     */
    private docPrIdValue: number;

    /**
     * Internal XLSX backend state.
     * Encapsulates workbook, worksheet, and chart handle.
     *
     * @private
     */
    private backendStateValue: ChartBackendState;

    /**
     * Preserved XML host element (for round-trip of unsupported properties).
     *
     * @private
     */
    private preservedHostValue: any | undefined;

    /**
     * Series collection.
     *
     * @private
     */

    /**
     * Chart data accessor wrapper.
     *
     * @private
     */
    private chartDataValue: ChartData;
    private packageIndexValue: number | undefined;
    /**
     * True while a newly created chart has no explicit title, so Word shows an automatic one.
     *
     * @private
     */
    autoTitle: boolean = false;
    /**
     * Original chart part and baseline model export captured on load; merged with the
     * current model export on save so DrawingML the model does not cover survives.
     *
     * @private
     */
    loadedPart: LoadedChartPart | undefined;

    /**
     * Create a chart paragraph item.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {number} widthPt - The width pt.
     * @param {number} heightPt - The height pt.
     * @param {string} name - The name.
     * @param {number} docPrId - The doc pr id.
     * @param {ChartBackendState} backendState - The backend state.
     * @param {any} preservedHost - The preserved host.
     * @private
     */
    constructor(
        relationshipId: string,
        widthPt: number,
        heightPt: number,
        /**
         * Gets or sets the name.
         */
        name: string,
        docPrId: number,
        backendState: ChartBackendState,
        preservedHost?: any
    ) {
        super();
        this.relationshipIdValue = relationshipId;
        this.widthPtValue = widthPt;
        this.heightPtValue = heightPt;
        this.nameValue = name;
        this.docPrIdValue = docPrId;
        this.backendStateValue = backendState;
        this.preservedHostValue = preservedHost;
        this.chartDataValue = new ChartData(backendState.worksheet);
    }

    // ========================================================================
    // Public Properties
    // ========================================================================

    /**
     * Gets or sets the type of the chart (for example {@link ChartType | ChartType.ColumnClustered}).
     *
     * @public
     */
    get chartType(): XlsxChart['type'] {
        this.assertAttached();
        return this.backendStateValue.backendChart.type;
    }

    set chartType(value: XlsxChart['type']) {
        this.mutate();
        this.backendStateValue.backendChart.type = value;
    }

    /**
     * Gets or sets the title of the chart.
     *
     * @public
     */
    get chartTitle(): string | undefined {
        this.assertAttached();
        return this.backendStateValue.backendChart.chartTitle;
    }

    set chartTitle(value: string | undefined) {
        this.mutate();
        this.autoTitle = false;
        this.backendStateValue.backendChart.chartTitle = value;
    }

    /**
     * Gets or sets the width of the chart, in points.
     *
     * @public
     */
    get width(): number {
        return this.widthPtValue;
    }

    set width(value: number) {
        this.mutate();
        if (value <= 0 || !isFinite(value)) {
            throw new Error('Chart width must be a positive number');
        }
        this.widthPtValue = value;
    }

    /**
     * Gets or sets the height of the chart, in points.
     *
     * @public
     */
    get height(): number {
        return this.heightPtValue;
    }

    set height(value: number) {
        this.mutate();
        if (value <= 0 || !isFinite(value)) {
            throw new Error('Chart height must be a positive number');
        }
        this.heightPtValue = value;
    }

    /**
     * Gets or sets the name of the chart.
     *
     * @public
     */
    get name(): string {
        return this.nameValue;
    }

    set name(value: string) {
        this.mutate();
        this.nameValue = value;
    }

    /**
     * Gets the {@link ChartData} used to read and write the cells of the chart data worksheet. Read-only.
     *
     * Rows and columns are 1-based, as in Excel.
     *
     * @example
     * ```typescript
     * chart.chartData.setValue(1, 1, 'Category');
     * chart.chartData.setValue(1, 2, 'Sales');
     * chart.chartData.setValue(2, 1, 'Q1');
     * chart.chartData.setValue(2, 2, 100);
     * ```
     *
     * @public
     */
    get chartData(): ChartData {
        this.assertAttached();
        return this.chartDataValue;
    }

    /**
     * Gets the format (fill and border) of the chart area. Read-only.
     *
     * @remarks
     * Returns the {@link ChartFrameFormat} instance.
     *
     * @public
     */
    get chartArea(): ChartFrameFormat {
        this.assertAttached();
        return this.xlsxChart.chartArea;
    }

    /**
     * Gets the format (fill and border) of the plot area. Read-only.
     *
     * @remarks
     * Returns the {@link ChartFrameFormat} instance.
     *
     * @public
     */
    get plotArea(): ChartFrameFormat {
        this.assertAttached();
        return this.xlsxChart.plotArea;
    }

    /**
     * Gets the text format (font name, size, color, bold, italic) of the chart title. Read-only.
     *
     * @remarks
     * Returns the {@link ChartTextArea} instance.
     *
     * @public
     */
    get chartTitleArea(): ChartTextArea {
        this.assertAttached();
        return this.xlsxChart.chartTitleArea;
    }

    /**
     * Gets or sets a value indicating whether the chart has a title.
     *
     * @public
     */
    get hasTitle(): boolean {
        this.assertAttached();
        return this.backendStateValue.backendChart.hasTitle;
    }
    set hasTitle(value: boolean) {
        this.mutate();
        this.autoTitle = false;
        this.backendStateValue.backendChart.hasTitle = value;
    }

    /**
     * Gets or sets a value indicating whether the chart shows a data table below the plot area.
     *
     * @public
     */
    get hasDataTable(): boolean {
        this.assertAttached();
        return this.backendStateValue.backendChart.hasDataTable;
    }
    set hasDataTable(value: boolean) {
        this.mutate();
        this.backendStateValue.backendChart.hasDataTable = value;
    }

    /**
     * Gets or sets a value indicating whether each worksheet row is a series. When false, each column is a series.
     *
     * @public
     */
    get isSeriesInRows(): boolean {
        this.assertAttached();
        return this.backendStateValue.backendChart.isSeriesInRows;
    }
    set isSeriesInRows(value: boolean) {
        this.mutate();
        this.backendStateValue.backendChart.isSeriesInRows = value;
    }

    /**
     * Gets or sets the scatter chart style: "none", "line", "lineMarker", "marker", "smooth" or "smoothMarker".
     *
     * @public
     */
    get scatterStyle(): string | undefined {
        this.assertAttached();
        return this.backendStateValue.backendChart.scatterStyle;
    }
    set scatterStyle(value: string | undefined) {
        this.mutate();
        this.backendStateValue.backendChart.scatterStyle = value as ScatterStyle | undefined;
    }

    /**
     * Gets or sets a value indicating whether the chart has a legend.
     *
     * @public
     */
    get hasLegend(): boolean {
        this.assertAttached();
        return this.backendStateValue.backendChart.hasLegend;
    }
    set hasLegend(value: boolean) {
        this.mutate();
        this.backendStateValue.backendChart.hasLegend = value;
    }

    /**
     * Gets the primary category (X) axis of the chart. Read-only.
     *
     * @remarks
     * Returns the {@link ChartAxis} instance.
     *
     * @public
     */
    get primaryCategoryAxis(): ChartAxis {
        this.assertAttached();
        return this.xlsxChart.primaryCategoryAxis;
    }

    /**
     * Gets the primary value (Y) axis of the chart. Read-only.
     *
     * @remarks
     * Returns the {@link ChartAxis} instance.
     *
     * @public
     */
    get primaryValueAxis(): ChartAxis {
        this.assertAttached();
        return this.xlsxChart.primaryValueAxis;
    }

    /**
     * Gets the legend of the chart. Read-only.
     *
     * @remarks
     * Returns the {@link ChartLegend} instance.
     *
     * @public
     */
    get legend(): ChartLegend {
        this.assertAttached();
        return this.xlsxChart.legend;
    }

    /**
     * Gets the collection of {@link ChartSeries} present in the chart. Read-only.
     *
     * @remarks
     * Add or remove series with {@link Chart.addSeries} and {@link Chart.removeSeries}.
     *
     * @public
     */
    get series(): ReadonlyArray<ChartSeries> {
        this.assertAttached();
        return this.xlsxChart.series;
    }

    /**
     * Adds a new series to the chart.
     *
     * @param {string} title - Specifies the name of the series.
     * @returns {ChartSeries} - Returns the newly added series.
     */
    addSeries(title?: string): ChartSeries {
        this.mutate();
        return this.xlsxChart.addSeries(title);
    }

    /**
     * Removes a series from the chart.
     *
     * @param {ChartSeries | number} target - Specifies the series to remove, or its zero-based index.
     * @returns {void}
     */
    removeSeries(target: ChartSeries | number): void {
        this.mutate();
        this.xlsxChart.removeSeries(target);
    }

    private get xlsxChart(): XlsxChart {
        return this.backendStateValue.backendChart;
    }

    // ========================================================================
    // Internal Properties (for feature layer only)
    // ========================================================================

    /**
     * Relationship ID to the chart part.
     *
     * @private
     */
    get relationshipId(): string {
        return this.relationshipIdValue;
    }

    /**
     * Drawing object ID.
     *
     * @private
     */
    get docPrId(): number {
        return this.docPrIdValue;
    }

    /**
     * Internal backend XLSX state.
     *
     * @private
     */
    get backendState(): ChartBackendState {
        return this.backendStateValue;
    }

    /**
     * Preserved host XML element.
     *
     * @private
     */
    get preservedHost(): any | undefined {
        return this.preservedHostValue;
    }

    /**
     * Adopt data and series from a chart parsed from an existing document.
     *
     * @param {Object} cells - The cells.
     * @returns {void} Nothing is returned.
     * @private
     */
    adoptLoadedState(cells: ReadonlyArray<{ row: number; column: number; value: string | number | boolean }>): void {
        this.chartDataValue.adopt(cells);
    }

    /**
     * Package identity assigned at save time.
     *
     * @param {string} relationshipId - The relationship id.
     * @param {number} docPrId - The doc pr id.
     * @param {number} packageIndex - The package index.
     * @returns {void} Nothing is returned.
     * @private
     */
    assignPackageIdentity(relationshipId: string, docPrId: number, packageIndex: number): void {
        this.relationshipIdValue = relationshipId;
        this.docPrIdValue = docPrId;
        this.packageIndexValue = packageIndex;
    }

    /**
     * 1-based index used in `charts/chartN.xml` once the chart has been saved.
     *
     * @private
     */
    get packageIndex(): number | undefined {
        return this.packageIndexValue;
    }

    /**
     * Inline `w:r` for this chart.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toRunOpenXml(): OpenXmlElement {
        return buildChartRun(this.relationshipIdValue, this.widthPtValue, this.heightPtValue, this.docPrIdValue, this.nameValue);
    }
}
