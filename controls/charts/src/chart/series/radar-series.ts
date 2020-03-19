import { Chart } from '../chart';
import { Series } from './chart-series';
import { firstToLowerCase, ChartLocation, CoefficientToVector, valueToPolarCoefficient } from '../../common/utils/helper';
import { PolarSeries } from '../series/polar-series';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Axis } from '../axis/axis';

/**
 * `RadarSeries` module is used to render the radar series.
 */

export class RadarSeries extends PolarSeries {
    /**
     * Render radar Series.
     * @return {void}.
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean): void {
        let seriesType: string = firstToLowerCase(series.drawType);
        let yAxisMin: number =  <number>yAxis.minimum;
        let yAxisMax: number = <number>yAxis.maximum;
        for (let point of series.points)  {
            point.visible = point.visible && !((!isNullOrUndefined(yAxisMin) && point.yValue < yAxisMin) ||
            (!isNullOrUndefined(yAxisMax) && point.yValue > yAxisMax));
        }
        if (series.drawType.indexOf('Column') === -1) {
            series.chart[seriesType + 'SeriesModule'].render(series, xAxis, yAxis, inverted);
        } else {
            this.columnDrawTypeRender(series, xAxis, yAxis);
        }
    }

    // path calculation for isInversed polar area series

    public getRadarIsInversedPath(xAxis: Axis, endPoint: string): string {
        let chart: Chart = this.chart;
        let x1: number;
        let y1: number;
        let vector: ChartLocation;
        let radius: number = chart.radius;
        let length: number = xAxis.visibleLabels.length;
        let direction: string = endPoint;
        vector = CoefficientToVector(valueToPolarCoefficient(xAxis.visibleLabels[0].value, xAxis), this.startAngle);
        y1 = this.centerY + radius * vector.y;
        x1 = this.centerX + radius * vector.x;
        direction += ' L ' + x1 + ' ' + y1 + ' ';
        for (let i: number = length - 1; i >= 0; i--) {
            vector = CoefficientToVector(valueToPolarCoefficient(xAxis.visibleLabels[i].value, xAxis), this.startAngle);
            y1 = this.centerY + radius * vector.y;
            x1 = this.centerX + radius * vector.x;
            direction += 'L ' + x1 + ' ' + y1 + ' ';
        }
        return direction;
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'RadarSeries';
    }

    /**
     * To destroy the radar series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}