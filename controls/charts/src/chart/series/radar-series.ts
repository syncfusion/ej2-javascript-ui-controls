import { Chart } from '../chart';
import { Series } from './chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
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