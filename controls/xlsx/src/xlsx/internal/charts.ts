/**
 * Host-only chart APIs for DocIO, PPTX, and other Syncfusion products that
 * depend on `@syncfusion/ej2-xlsx` and need chart-part handoff +
 * `c:externalData` binding.
 *
 * **Not** part of the end-user public surface. Import from:
 *
 * ```ts
 * import {
 *   CHART_CONTENT_TYPE,
 *   CHART_REL_TYPE_STRICT,
 *   CHART_REL_TYPE_TRANSITIONAL,
 *   ChartType,
 *   InvalidChartError,
 *   type Chart,
 *   type ChartData,
 *   type ChartDataSource,
 *   type ChartHost,
 *   type ChartPartExport,
 *   type ChartSeries,
 *   type HostChartRelationship,
 *   type OfficeChartCreateOptions,
 *   type ParseOfficeChartOptions,
 *   asChartHost,
 *   createOfficeChart,
 *   exportChartPart,
 *   getChartDataSource,
 *   parseOfficeChart,
 *   setChartDataSource,
 * } from '@syncfusion/ej2-xlsx/internal/charts';
 * ```
 *
 * Public worksheet chart authoring (`addChart`, series, formatting) stays on
 * the package root. This subpath exposes the host contract that
 * `stripInternal` removes from `dist/index.d.ts`, plus {@link exportChartPart},
 * {@link createOfficeChart}, and {@link parseOfficeChart} for DOCX/PPTX
 * package writers.
 *
 * Hosts bind `c:externalData` **after** create via {@link setChartDataSource}
 * (or the {@link ChartHost.dataSource} setter). There is no create-time options
 * bag for host data sources.
 *
 * Office factories are additive and do **not** change existing XLSX worksheet
 * chart lifecycle (`addChart`, load, materialize).
 *
 * @packageDocumentation
 */

import {
    Chart,
    ChartDataSource
} from '../worksheet/charts';
import {
    createOfficeChart,
    exportChartPart,
    parseOfficeChart
} from '../worksheet/charts';

export {
    Chart,
    ChartData,
    ChartDataSource,
    ChartPartExport,
    ChartSeries,
    ChartType,
    HostChartRelationship,
    OfficeChartCreateOptions,
    ParseOfficeChartOptions,
    parseChartSpace,
    serializeChartSpace
} from '../worksheet/charts';

export { InvalidChartError } from '../core/errors';

export {
    CHART_CONTENT_TYPE,
    CHART_REL_TYPE_STRICT,
    CHART_REL_TYPE_TRANSITIONAL
} from '../core/package/constants';

export { createOfficeChart, exportChartPart, parseOfficeChart };

/**
 * Chart handle with the host-only `dataSource` property restored.
 *
 * Use after `sheet.addChart(...)`, {@link createOfficeChart}, or
 * {@link parseOfficeChart} when the host must read or write
 * `c:externalData` relationship state. The public {@link Chart} interface
 * does not declare `dataSource`; this host interface is the typed surface.
 *
 * @private
 */
export interface ChartHost extends Chart {
    /**
     * Package relationship for `c:externalData`.
     * Default `{ kind: 'none' }`.
     *
     * @private
     */
    dataSource: ChartDataSource;
}

/**
 * Read chart `c:externalData` relationship state.
 *
 * @param {Chart} chart - Chart handle from `sheet.addChart` / `sheet.charts`, or from
 *   {@link createOfficeChart} / {@link parseOfficeChart}.
 * @returns {ChartDataSource} Current data-source kind and relationship id when present.
 *
 * @private
 */
export function getChartDataSource(chart: Chart): ChartDataSource {
    return (chart as ChartHost).dataSource;
}

/**
 * Set chart `c:externalData` relationship state.
 *
 * Hosts own the related package part / external target; this library only
 * records the relationship id on the chart model and emits
 * `<c:externalData r:id="…"/>` on serialize / {@link exportChartPart}.
 * Invalid shapes throw `InvalidChartError`.
 *
 * @param {Chart} chart - Chart handle from `sheet.addChart` / `sheet.charts`, or from
 *   {@link createOfficeChart} / {@link parseOfficeChart}.
 * @param {ChartDataSource} dataSource - `none` | `embedded` | `external` binding.
 * @returns {void} Nothing.
 *
 * @private
 */
export function setChartDataSource(chart: Chart, dataSource: ChartDataSource): void {
    (chart as ChartHost).dataSource = dataSource;
}

/**
 * Narrow a public {@link Chart} to {@link ChartHost} for typed `dataSource`
 * access without repeating a cast at every call site.
 *
 * @param {Chart} chart - Public chart handle.
 * @returns {ChartHost} Same handle typed with host `dataSource`.
 *
 * @private
 */
export function asChartHost(chart: Chart): ChartHost {
    return chart as ChartHost;
}
