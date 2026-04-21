/**
 * Highlight src file
 */
import { Browser} from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Series } from '../series/chart-series';

import { Selection } from './selection';

/**
 * The `Highlight` module manages the highlighting of chart elements.
 *
 */
export class Highlight extends Selection {

    /**
     * Constructor for selection module.
     *
     * @private
     */

    constructor(chart: Chart) {
        super(chart);
        this.chart = chart;
        this.renderer = chart.renderer;
        this.wireEvents();
    }
    /**
     * Binding events for selection module.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (this.chart.isDestroyed || (this.chart.stockChart && this.chart.stockChart.onPanning)) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
    }

    /**
     * UnBinding events for selection module.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
    }
    /**
     * Declares private variables used within the chart.
     *
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     */
    private declarePrivateVariables(chart: Chart): void {
        this.styleId = chart.element.id + '_ej2_chart_highlight';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.highlightDataIndexes = [];
        this.isSeriesMode = chart.highlightMode === 'Series';
    }

    /**
     * Method to select the point and series.
     *
     * @param {Chart} chart - The chart instance.
     * @returns {void}
     */
    public invokeHighlight(chart: Chart): void {
        this.declarePrivateVariables(chart);
        this.series = <Series[]>extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = chart.highlightMode;
    }

    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Returns the module name.
     */
    public getModuleName(): string {
        return 'Highlight';
    }
    /**
     * To destroy the highlight.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        // Destroy method performed here.
    }
}
