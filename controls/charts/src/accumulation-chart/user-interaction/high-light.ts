/**
 * AccumulationChart highlight source file
 */
import { Browser } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { AccumulationChart } from '../accumulation';
import { AccumulationSeries } from '../model/acc-base';
import { AccumulationSelection } from './selection';

/**
 * `AccumulationHighlight` module handles the selection for chart.
 *
 * @private
 */
export class AccumulationHighlight extends AccumulationSelection {

    /**
     * Constructor for selection module.
     *
     * @private.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     */
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.renderer = accumulation.renderer;
        this.wireEvents();
    }
    /**
     * Binding events for selection module.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMove, this);
    }
    /**
     * UnBinding events for selection module.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.off(Browser.touchMoveEvent, this.mouseMove);
    }
    /**
     * To find private variable values.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    private declarePrivateVariables(accumulation: AccumulationChart): void {
        this.styleId = accumulation.element.id + '_ej2_chart_highlight';
        this.unselected = accumulation.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.highlightDataIndexes = [];
    }
    /**
     * Method to select the point and series.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    public invokeHighlight(accumulation: AccumulationChart): void {
        this.declarePrivateVariables(accumulation);
        this.series = <AccumulationSeries[]>extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = accumulation.highlightMode;
    }

    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Returns the module name.
     */
    public getModuleName(): string {
        return 'AccumulationHighlight';
    }
    /**
     * To destroy the highlight.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        //Destroy method performed here
    }
}
