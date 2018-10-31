import { sum, ChartLocation, PathOption, getPoint, templateAnimate } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series } from './chart-series';
import { ColumnSeries } from './column-series';

/**
 * `HistogramSeries` Module used to render the histogram series.
 */
export class HistogramSeries extends ColumnSeries {
    /**
     * Render Histogram series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        super.render(series);
        if (series.showNormalDistribution) {
            this.renderNormalDistribution(series);
        }

    }
    /**
     * To calculate bin interval for Histogram series.
     * @return number
     * @private
     */
    private calculateBinInterval(yValues: number[], series: Series): void {
        let mean: number = sum(yValues) / yValues.length;
        let sumValue: number = 0;
        for (let value of yValues) {
            sumValue += (value - mean) * (value - mean);
        }
        series.histogramValues.mean = mean;
        series.histogramValues.sDValue = Math.round(Math.sqrt(sumValue / yValues.length - 1));
        series.histogramValues.binWidth = series.binInterval ||
            Math.round((3.5 * series.histogramValues.sDValue) / Math.pow(yValues.length, 1 / 3));
    }
    /**
     * Add data points for Histogram series.
     * @return {object[]}
     * @private
     */
    public processInternalData(data: Object[], series: Series): Object[] {
        let updatedData: Object[] = [];
        let yValues: number[] = [];
        let binWidth: number;
        Object.keys(data).forEach((key: string) => {
            yValues.push(data[key][series.yName]);
        });
        series.histogramValues = {
            yValues: yValues
        };
        let min: number = Math.min(...series.histogramValues.yValues);
        this.calculateBinInterval(series.histogramValues.yValues, series);
        binWidth = series.histogramValues.binWidth;
        let yCount: number;
        for (let j: number = 0; j < data.length; ) {
            yCount = yValues.filter((y: number) => y >= min && y < (min + (binWidth))).length;
            updatedData.push({
                'x': min + binWidth / 2,
                [series.yName]: yCount
            });
            min = min + binWidth;
            j += yCount;
        }
        return updatedData;
    }
    /**
     * Render Normal Distribution for Histogram series.
     * @return {void}
     * @private
     */
    private renderNormalDistribution(series: Series): void {
        let min: number = series.xAxis.actualRange.min;
        let max: number = series.xAxis.actualRange.max;
        let xValue: number; let pointLocation: ChartLocation;
        let yValue: number;
        let direction: string = '';
        let startPoint: string = 'M';
        let yValuesCount: number = series.histogramValues.yValues.length;
        let binWidth: number = series.histogramValues.binWidth;
        let mean: number = series.histogramValues.mean;
        let sDValue: number = series.histogramValues.sDValue;
        let pointsCount: number = 500;
        let del: number = (max - min) / (pointsCount - 1);
        let distributionLine: Element;
        for (let i: number = 0; i < pointsCount; i++) {
            xValue = min + i * del;
            yValue = Math.exp(-(xValue - mean) * (xValue - mean) / (2 * sDValue * sDValue)) /
                (sDValue * Math.sqrt(2 * Math.PI));
            pointLocation = getPoint(
                xValue, yValue * binWidth * yValuesCount, series.xAxis, series.yAxis,
                series.chart.requireInvertedAxis, series
            );
            direction += startPoint + ' ' + (pointLocation.x) + ' ' + (pointLocation.y) + ' ';
            startPoint = 'L';
        }
        distributionLine = series.chart.renderer.drawPath(
            new PathOption(
                series.chart.element.id + '_Series_' + series.index + '_NDLine', 'transparent',
                2, series.chart.themeStyle.errorBar, series.opacity, series.dashArray, direction
            )
        );
        (<HTMLElement>distributionLine).style.visibility = (series.animation.enable && series.chart.animateSeries) ?
            'hidden' : 'visible';
        series.seriesElement.appendChild(distributionLine);
    }
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        super.doAnimation(series);
        if (series.showNormalDistribution) {
            templateAnimate(
                series.seriesElement.lastElementChild,
                series.animation.duration, 500, 'FadeIn'
            );
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'HistogramSeries';
        /**
         * return the module name
         */
    }

    /**
     * To destroy the histogram series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}