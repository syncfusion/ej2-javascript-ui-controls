import { Series, Points } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';
import { Chart } from '../chart';

/**
 * `SmaIndicator` module is used to render SMA indicator.
 */
export class SmaIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions based on SMA approach
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator, chart: Chart): void {
        let smaPoints: Points[] = [];
        let points: Points[] = indicator.points;
        if (points && points.length) {
            //prepare data
            let validData: Points[] = points;
            let field: string = firstToLowerCase(indicator.field);
            let xField: string = 'x';

            let signalSeries: Series = indicator.targetSeries[0];

            if (validData && validData.length && validData.length >= indicator.period) {
                //find initial average
                let average: number = 0;
                let sum: number = 0;

                for (let i: number = 0; i < indicator.period; i++) {
                    sum += validData[i][field];
                }

                average = sum / indicator.period;

                smaPoints.push(this.getDataPoint(
                    validData[indicator.period - 1][xField], average, validData[indicator.period - 1],
                    signalSeries, smaPoints.length));

                let index: number = indicator.period;
                while (index < validData.length) {
                    sum -= validData[index - indicator.period][field];
                    sum += validData[index][field];
                    average = sum / indicator.period;
                    smaPoints.push(this.getDataPoint(
                        validData[index][xField], average, validData[index],
                        signalSeries, smaPoints.length));
                    index++;
                }
            }
            this.setSeriesRange(smaPoints, indicator);
        }
    }

    /**
     * To destroy the SMA indicator
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the SMA indicator
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'SmaIndicator';
    }
}