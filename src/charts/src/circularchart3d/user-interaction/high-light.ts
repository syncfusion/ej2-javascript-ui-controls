/**
 * Circular 3D chart highlight.
 */
import { Browser } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../circularchart3d';
import { CircularChart3DSeries } from '../renderer/series';
import { CircularChartSelection3D } from './selection';


/**
 * The `CircularChart3DHighlight` module handles highlighting for the Circular 3D chart.
 *
 * @private
 */
export class CircularChartHighlight3D extends CircularChartSelection3D {

    /**
     * Constructor for the highlight module.
     *
     * @param {CircularChart3D} circular3D - The instance of the circular 3D chart.
     * @private.
     */
    constructor(circular3D: CircularChart3D) {
        super(circular3D);
        this.circular3D = circular3D;
        this.renderer = circular3D.renderer;
        this.wireEvents();
    }

    /**
     * Binds events for the highlight module.
     *
     * @returns {void}
     */
    private wireEvents(): void {
        if (this.circular3D.isDestroyed) { return; }
        this.circular3D.on(Browser.touchMoveEvent, this.mouseMove, this);
    }

    /**
     * Unbinds events for the highlight module.
     *
     * @returns {void}
     */
    private unWireEvents(): void {
        if (this.circular3D.isDestroyed) { return; }
        this.circular3D.off(Browser.touchMoveEvent, this.mouseMove);
    }

    /**
     * Initializes private variables for highlight and deselection.
     *
     * @param {CircularChart3D} circular3D - The instance of the circular 3D chart.
     * @returns {void}
     */
    private declarePrivateVariables(circular3D: CircularChart3D): void {
        this.styleId = circular3D.element.id + '_ej2_chart_highlight';
        this.unselected = circular3D.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.highlightDataIndexes = [];
    }

    /**
     * Invokes the highlight style to highlight the point and series in the circular 3D chart.
     *
     * @param {CircularChart3D} circular3D - The instance of the circular 3D chart.
     * @returns {void}
     */
    public invokeHighlight(circular3D: CircularChart3D): void {
        this.declarePrivateVariables(circular3D);
        this.series = <CircularChart3DSeries[]>extend({}, circular3D.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = circular3D.highlightMode;
    }

    /**
     * Gets the module name for the circular 3D highlight module.
     *
     * @returns {string} - The module name.
     * @private
     */
    public getModuleName(): string {
        return 'CircularChartHighlight3D';
    }

    /**
     * Destroys the `CircularChart3DHighlight` module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.unWireEvents();
        //Destroy method performed here
    }
}
