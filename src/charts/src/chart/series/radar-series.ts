import { Chart } from '../chart';
import { Series } from './chart-series';
import { firstToLowerCase, ChartLocation, CoefficientToVector, valueToPolarCoefficient } from '../../common/utils/helper';
import { PolarSeries } from '../series/polar-series';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Axis } from '../axis/axis';

/**
 * The `RadarSeries` module is used to render the radar series.
 */

export class RadarSeries extends PolarSeries {
    /**
     * Renders the provided radar series on the chart based on the given x-axis, y-axis, and inversion status.
     *
     * @param {Series} series - The series to render.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} inverted - A flag indicating whether the chart is inverted or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean): void {
        const seriesType: string = firstToLowerCase(series.drawType);
        const yAxisMin: number =  <number>yAxis.minimum;
        const yAxisMax: number = <number>yAxis.maximum;
        for (const point of series.points)  {
            point.visible = point.visible && !((!isNullOrUndefined(yAxisMin) && point.yValue < yAxisMin) ||
            (!isNullOrUndefined(yAxisMax) && point.yValue > yAxisMax));
        }
        if (series.points.length) {
            if (series.drawType.indexOf('Column') === -1) {
                series.chart[seriesType + 'SeriesModule'].render(series, xAxis, yAxis, inverted);
            } else {
                this.columnDrawTypeRender(series, xAxis, yAxis);
            }
        }
    }

    // path calculation for isInversed polar area series

    public getRadarIsInversedPath(xAxis: Axis, endPoint: string): string {
        const chart: Chart = this.chart;
        let x1: number;
        let y1: number;
        let vector: ChartLocation;
        const radius: number = chart.radius;
        const length: number = xAxis.visibleLabels.length;
        let direction: string = endPoint;
        vector = CoefficientToVector(valueToPolarCoefficient(xAxis.visibleLabels[0].value, xAxis), this.startAngle);
        y1 = this.centerY + radius * vector.y;
        x1 = this.centerX + radius * vector.x;
        if (isNaN(x1) || isNaN(y1)) {
            return direction;
        }
        direction += ' L ' + x1 + ' ' + y1 + ' ';
        for (let i: number = length - 1; i >= 0; i--) {
            vector = CoefficientToVector(valueToPolarCoefficient(xAxis.visibleLabels[i as number].value, xAxis), this.startAngle);
            y1 = this.centerY + radius * vector.y;
            x1 = this.centerX + radius * vector.x;
            direction += 'L ' + x1 + ' ' + y1 + ' ';
        }
        return direction;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
         */
        return 'RadarSeries';
    }

    /**
     * To destroy the radar series.
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
