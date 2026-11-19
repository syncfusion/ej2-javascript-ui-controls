import { ChartModel } from '../base/chart';
import { Chart, AccumulationChart } from '@syncfusion/ej2-charts';

export interface IChartLifecycleItem {
    model: ChartModel;
    component: Chart | AccumulationChart;
    overlayElement?: HTMLElement;
    json?: Record<string, unknown>;
    keywordIndex?: number;
}

/**
 * Tracks chart instances, models, overlays, and IDs for ChartManager.
 */
export class LifecycleManager {
    private charts: Map<string, IChartLifecycleItem>;
    private index: number;
    private hostPrefix: string;

    constructor(hostPrefix: string = 'office') {
        this.charts = new Map<string, IChartLifecycleItem>();
        this.index = 0;
        this.hostPrefix = hostPrefix;
    }

    /**
     * Generates a unique chart ID for a new chart.
     *
     * @returns {string} Unique chart id.
     */
    public generateId(): string {
        return this.hostPrefix + '_chart_' + this.index++;
    }

    /**
     * Registers a chart instance in the lifecycle registry.
     *
     * @param {string} id - Chart identifier.
     * @param {ChartModel} model - Chart model.
     * @param {Chart | AccumulationChart} component - Chart component.
     * @param {HTMLElement} [overlayElement] - Overlay element.
     * @param {Object} [json] - Raw OpenXML JSON tree.
     * @param {number} [keywordIndex] - Keyword index for JSON keys.
     * @returns {void}
     */
    public registerChart(
        id: string, model: ChartModel, component: Chart | AccumulationChart,
        overlayElement?: HTMLElement, json?: Record<string, unknown> | object, keywordIndex?: number
    ): void {
        this.charts.set(id, {
            model: model,
            component: component,
            overlayElement: overlayElement,
            json: json as Record<string, unknown>,
            keywordIndex: keywordIndex
        });
    }

    /**
     * Unregisters a chart by ID.
     *
     * @param {string} id - Chart identifier.
     * @returns {void}
     */
    public unregisterChart(id: string): void {
        if (this.charts.has(id)) {
            this.charts.delete(id);
        }
    }

    /**
     * Retrieves the chart registry record for a given ID.
     *
     * @param {string} id - Chart identifier.
     * @returns {IChartLifecycleItem} Chart record.
     */
    public getChart(id: string): IChartLifecycleItem {
        return this.charts.get(id) || null;
    }

    /**
     * Returns an array of all chart models.
     *
     * @returns {ChartModel[]} Array of chart models.
     */
    public getAllCharts(): ChartModel[] {
        const result: ChartModel[] = [];
        this.charts.forEach((item: IChartLifecycleItem): void => {
            result.push(item.model);
        });
        return result;
    }

    /**
     * Destroys all registered charts.
     *
     * @returns {void}
     */
    public destroyAll(): void {
        this.charts.forEach((item: IChartLifecycleItem): void => {
            if (item.component) {
                item.component.destroy();
            }
            if (item.overlayElement && item.overlayElement.parentElement) {
                item.overlayElement.remove();
            }
        });
        this.charts.clear();
        this.index = 0;
    }
}
