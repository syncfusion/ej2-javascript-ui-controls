/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Series, Points } from '../series/chart-series';
import { firstToLowerCase } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { TechnicalAnalysis } from './indicator-base';

/**
 * `SmaIndicator` module is used to render SMA indicator.
 */
export class SmaIndicator extends TechnicalAnalysis {

    /**
     * Defines the predictions based on SMA approach
     *
     * @private
     */
    public initDataSource(indicator: TechnicalIndicator): void {
        const smaPoints: Points[] = [];
        const points: Points[] = indicator.points;
        if (points && points.length) {
            //prepare data
            const validData: Points[] = points;
            const field: string = firstToLowerCase(indicator.field);
            const xField: string = 'x';

            const signalSeries: Series = indicator.targetSeries[0];

            if (validData && validData.length && validData.length >= indicator.period) {
                //find initial average
                let average: number = 0;
                let sum: number = 0;

                for (let i: number = 0; i < indicator.period; i++) {
                    sum += validData[i as number][field as string];
                }

                average = sum / indicator.period;

                smaPoints.push(this.getDataPoint(
                    validData[indicator.period - 1][xField as string], average, validData[indicator.period - 1],
                    signalSeries, smaPoints.length));

                let index: number = indicator.period;
                while (index < validData.length) {
                    sum -= validData[index - indicator.period][field as string];
                    sum += validData[index as number][field as string];
                    average = sum / indicator.period;
                    smaPoints.push(this.getDataPoint(
                        validData[index as number][xField as string], average, validData[index as number],
                        signalSeries, smaPoints.length));
                    index++;
                }
            }
            this.setSeriesRange(smaPoints, indicator);
        }
    }

    /**
     * To destroy the SMA indicator
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
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
