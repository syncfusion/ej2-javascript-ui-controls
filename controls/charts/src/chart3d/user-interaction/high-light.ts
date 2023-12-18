/**
 * Highlight src file
 */
import { Browser } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { Chart3D } from '../../chart3d';
import { Chart3DSeries } from '../series/chart-series';
import { Selection3D } from './selection';

/**
 * The `Highlight` module handles the highlight for chart.
 *
 * @private
 */
export class Highlight3D extends Selection3D {

    /**
     * Constructor for selection module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     */
    constructor(chart: Chart3D) {
        super(chart);
        this.chart = chart;
        this.wireEvents();
    }

    /**
     * Binding events for highlight module.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
    }

    /**
     * Unbinding events for highlight module.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
    }

    /**
     * Declares private variables for the highlight modules.
     *
     * @param {Chart3D} chart - The 3D chart for which private variables are being declared.
     * @returns {void}
     */
    private declarePrivateVariables(chart: Chart3D): void {
        this.styleId = chart.element.id + '_ej2_chart_highlight';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.highlightDataIndexes = [];
        this.isSeriesMode = chart.highlightMode === 'Series';
    }

    /**
     * Invokes the highlighting functionality on a 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart on which highlighting is being invoked.
     * @returns {void}
     */
    public invokeHighlight(chart: Chart3D): void {
        this.declarePrivateVariables(chart);
        this.series = <Chart3DSeries[]>extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = chart.highlightMode;
    }

    /**
     * Gets the module name for the highlighting functionality.
     *
     * @returns {string} The module name.
     */
    public getModuleName(): string {
        return 'Highlight3D';
    }

    /**
     * To destroy the highlight module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        // Destroy method performed here
    }
}
