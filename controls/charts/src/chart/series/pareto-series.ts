import { Chart } from '../chart';
import { Series } from '../series/chart-series';
import { ColumnBase } from './column-base';
import { Axis } from '../axis/axis';
import { markerShapes } from './marker';
import { getSeriesColor } from '../../common/model/theme';

/**
 * The `ParetoSeries` module is used to render the pareto series.
 */

export class ParetoSeries extends ColumnBase {
    public paretoAxes: Axis[] = [];
    /**
     * Defines the Line initialization.
     *
     * @private
     */

    public initSeries(targetSeries: Series, chart: Chart): void {
        const series: Series = new Series(chart, 'series', (targetSeries as Series & { properties: Object }).properties, true);
        const colors: string[] = chart.palettes.length ? chart.palettes : getSeriesColor(chart.theme);
        const count: number = colors.length;
        series.name = 'Pareto';
        series.yAxisName = targetSeries.yAxisName + '_CumulativeAxis';
        series.category = 'Pareto';
        targetSeries.category = 'Pareto';
        series.index = targetSeries.index + chart.series.length;
        series.type = 'Line';
        series.interior = series.fill = series.paretoOptions.fill ? series.paretoOptions.fill : colors[series.index % count];
        series.width = series.paretoOptions.width;
        series.dashArray = series.paretoOptions.dashArray;
        series.marker = series.paretoOptions.marker;
        if (series.marker && series.marker.visible) {
            series.marker.shape = series.marker.shape ? series.marker.shape : markerShapes[chart.markerIndex as number % 10];
            chart.markerIndex++;
        }
        chart.visibleSeries.push(series);
        this.initAxis(targetSeries, series, chart);
    }
    /**
     * Defines the Axis initialization for Line.
     *
     * @private
     */

    public initAxis(paretoSeries: Series, targetSeries: Series, chart: Chart): void {
        const isExist: boolean = this.paretoAxes.some((currentAxis: Axis) => {
            return currentAxis.name === targetSeries.yAxisName;
        });
        if (!isExist) {
            const secondaryAxis: Axis = <Axis>(paretoSeries.yAxisName && chart.axes.length ? chart.axes.filter((axis: Axis) => {
                return axis.name === paretoSeries.yAxisName;
            })[0] : chart.primaryYAxis);
            const newAxis: Axis = new Axis(chart, 'axes', {
                name: targetSeries.yAxisName,
                majorGridLines: {
                    width: 0
                },
                majorTickLines: secondaryAxis.majorTickLines,
                lineStyle: secondaryAxis.lineStyle,
                minimum: 0,
                maximum: 100,
                interval: 20,
                rowIndex: secondaryAxis.rowIndex,
                opposedPosition: true,
                labelFormat: '{value}%'
            });
            this.paretoAxes.push(newAxis);
        }
    }
    /**
     * Render Pareto series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        series.chart.columnSeriesModule.render(series);
    }
    /**
     * Perform cumulative calculation on the provided JSON data based on the series type.
     *
     * @param {Object} json - The JSON data to perform cumulative calculation on.
     * @param {Series} series - The series for which cumulative calculation is performed.
     * @returns {Object[]} - An array containing the result of the cumulative calculation.
     * @private
     */
    public performCumulativeCalculation(json: Object, series: Series): Object[] {
        const data: Object[] = <Object[]>json;
        let sum: number = 0;
        let count: number = 0;
        const length: number = data.length;
        for (let i: number = 0; i < length; i++) {
            sum += data[i as number][series.yName];
        }
        for (let i: number = 0; i < length; i++) {
            count = count + data[i as number][series.yName];
            data[i as number][series.yName] = Math.round((count / sum) * 100);
        }
        return data;
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'ParetoSeries';
        /**
         * return the module name.
         */
    }
    /**
     * To destroy the pareto series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }
}
