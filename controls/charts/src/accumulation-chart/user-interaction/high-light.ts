/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/**
 * AccumulationChart highlight source file
 */
import { Browser } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { AccumulationChart } from '../accumulation';
import { AccumulationSeries } from '../model/acc-base';
import { AccumulationSelection } from './selection';

// tslint:disable:no-string-literal
/**
 * `AccumulationHighlight` module handles the selection for chart.
 * @private
 */
export class AccumulationHighlight extends AccumulationSelection {

    /**
     * Constructor for selection module.
     * @private.
     */

    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.renderer = accumulation.renderer;
        this.wireEvents();
    }
    /**
     * Binding events for selection module.
     */
    private wireEvents(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMove, this);
    }
    /**
     * UnBinding events for selection module.
     */
    private unWireEvents(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.off(Browser.touchMoveEvent, this.mouseMove);
    }
    /**
     * To find private variable values
     */
    private declarePrivateVariables(accumulation: AccumulationChart): void {
        this.styleId = accumulation.element.id + '_ej2_chart_highlight';
        this.unselected = accumulation.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.highlightDataIndexes = [];
    }
    /**
     * Method to select the point and series.
     * @return {void}
     */
    public invokeHighlight(accumulation: AccumulationChart): void {
        this.declarePrivateVariables(accumulation);
        this.series = <AccumulationSeries[]>extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = accumulation.highlightMode;
    }

    /**
     * Get module name.
     * @private
     */
    public getModuleName(): string {
        return 'AccumulationHighlight';
    }
    /**
     * To destroy the highlight.
     * @return {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        //Destroy method performed here
    }
}
