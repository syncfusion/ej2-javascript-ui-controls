/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
import { Chart } from '../chart';
import { Series } from '../series/chart-series';
import { ColumnBase } from './column-base';
import { Axis } from '../axis/axis';

/**
 * `Pareto series` module used to render the Pareto series.
 */

export class ParetoSeries extends ColumnBase {
    public paretoAxes: Axis[] = [];
    /**
     * Defines the Line initialization.
     */

    public initSeries(targetSeries: Series, chart: Chart): void {
        const series: Series = new Series(chart, 'series', (targetSeries as Series & { properties: Object }).properties, true);
        series.name = 'Pareto';
        series.yAxisName = targetSeries.yAxisName + '_CumulativeAxis';
        series.category = 'Pareto';
        targetSeries.category = 'Pareto';
        series.type = 'Line';
        series.interior = chart.themeStyle.errorBar;
        chart.visibleSeries.push(series);
        this.initAxis(targetSeries, series, chart);
    }
    /**
     * Defines the Axis initialization for Line.
     */

    public initAxis(paretoSeries: Series, targetSeries: Series, chart: Chart): void {
        const isExist: boolean = this.paretoAxes.some((currentAxis: Axis) => {
            return currentAxis.name === targetSeries.yAxisName;
        });
        if (!isExist) {
            const secondaryAxis: Axis = <Axis>(paretoSeries.yAxisName ? chart.axes.filter((axis: Axis) => {
                return axis.name === paretoSeries.yAxisName;
            })[0] : chart.primaryYAxis);
            const newAxis: Axis = new Axis(chart, 'axis', {
                name: targetSeries.yAxisName,
                majorGridLines: {
                    width: 0
                },
                majorTickLines: secondaryAxis.majorTickLines,
                lineStyle: secondaryAxis.lineStyle,
                minimum: 0,
                maximum: 100,
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
     * To perform the cumulative calculation for pareto series.
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
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'ParetoSeries';
        /**
         * return the module name
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
         * Destroy method performed here
         */
    }
}
