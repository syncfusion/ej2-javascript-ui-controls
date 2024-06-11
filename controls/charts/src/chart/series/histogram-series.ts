import { sum, ChartLocation, getPoint, templateAnimate, appendChildElement } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series } from './chart-series';
import { ColumnSeries } from './column-series';
import { animationMode } from '@syncfusion/ej2-base';

/**
 * `HistogramSeries` Module used to render the histogram series.
 */
export class HistogramSeries extends ColumnSeries {
    /**
     * Render Histogram series.
     *
     * @param {Series} series - The series to render.
     * @returns {void}
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
     *
     * @param {number[]} yValues - The y values of the series.
     * @param {Series} series - The series for which the bin interval is calculated.
     * @returns {void}
     * @private
     */
    private calculateBinInterval(yValues: number[], series: Series): void {
        const mean: number = sum(yValues) / yValues.length;
        let sumValue: number = 0;
        for (const value of yValues) {
            sumValue += (value - mean) * (value - mean);
        }
        series.histogramValues.mean = mean;
        series.histogramValues.sDValue = Math.sqrt(Math.abs(sumValue / yValues.length));
        series.histogramValues.binWidth = series.binInterval ||
            Math.round((3.5 * series.histogramValues.sDValue) / Math.pow(yValues.length, 1 / 3)) || 1;
    }
    /**
     * Processes the internal data for the series.
     *
     * @param {Object[]} data - The internal data to be processed.
     * @param {Series} series - The series for which the internal data is processed.
     * @returns {Object[]} - The processed internal data.
     */
    public processInternalData(data: Object[], series: Series): Object[] {
        const updatedData: Object[] = [];
        const yValues: number[] = [];
        const keys: string[] = Object.keys(data);
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i as number];
            yValues.push(data[key as string][series.yName]);
        }
        series.histogramValues = {
            yValues: yValues
        };
        let min: number = Math.min(...series.histogramValues.yValues);
        const max: number = Math.max(...series.histogramValues.yValues);
        this.calculateBinInterval(series.histogramValues.yValues, series);
        const binWidth: number = series.histogramValues.binWidth;
        let yCount: number;
        for (let j: number = 0; j < data.length; ) {
            yCount = yValues.filter((y: number) => y >= min && y < (min + (binWidth))).length;
            if ((min + binWidth) === max) {
                yCount += yValues.filter((y: number) => y >= max).length;
            }
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
     * Calculates the bin values for the series.
     *
     * @param {Series} series - The series for which the bin values are calculated.
     * @returns {void}
     * @private
     */
    public calculateBinValues(series: Series): void {
        const yValuesCount: number = series.histogramValues.yValues.length;
        const binWidth: number = series.histogramValues.binWidth;
        const mean: number = series.histogramValues.mean;
        const sDValue: number = series.histogramValues.sDValue;
        const pointsCount: number = 500;
        const min: number = series.xAxis.minimum ? parseInt(series.xAxis.minimum.toString(), 10) : series.xMin;
        const max: number = series.xAxis.maximum ? parseInt(series.xAxis.maximum.toString(), 10) : series.xMax;
        const points: number = series.points.length;
        let xValue: number;
        let yValue: number;
        const del: number = (max - min) / (pointsCount - 1);
        if (points) {
            for (let i: number = 0; i < pointsCount; i++) {
                xValue = min + i * del;
                yValue = (Math.exp(-(xValue - mean) * (xValue - mean) / (2 * sDValue * sDValue)) /
                    (sDValue * Math.sqrt(2 * Math.PI))) * binWidth * yValuesCount;
                series.yMin = series.yMin > yValue   ? yValue : series.yMin;
                series.yMax = series.yMax < yValue   ? yValue : series.yMax;
            }
        }
    }
    /**
     * Render Normal Distribution for Histogram series.
     *
     * @param {Series} series - The series for which the normal distribution is rendered.
     * @returns {void}
     * @private
     */
    private renderNormalDistribution(series: Series): void {
        const min: number = series.xAxis.actualRange.min;
        const max: number = series.xAxis.actualRange.max;
        let xValue: number; let pointLocation: ChartLocation;
        let yValue: number;
        let direction: string = '';
        let startPoint: string = 'M';
        const yValuesCount: number = series.histogramValues.yValues.length;
        const binWidth: number = series.histogramValues.binWidth;
        const mean: number = series.histogramValues.mean;
        const sDValue: number = series.histogramValues.sDValue;
        const pointsCount: number = 500;
        const del: number = (max - min) / (pointsCount - 1);
        const points: number = series.points.length;
        if (points) {
            for (let i: number = 0; i < pointsCount; i++) {
                xValue = min + i * del;
                yValue = Math.exp(-(xValue - mean) * (xValue - mean) / (2 * sDValue * sDValue)) /
                    (sDValue * Math.sqrt(2 * Math.PI));
                pointLocation = getPoint(
                    xValue, yValue * binWidth * yValuesCount, series.xAxis, series.yAxis,
                    series.chart.requireInvertedAxis
                );
                direction += startPoint + ' ' + (pointLocation.x) + ' ' + (pointLocation.y) + ' ';
                startPoint = 'L';
            }
        }
        const distributionLine: Element = series.chart.renderer.drawPath(
            new PathOption(
                series.chart.element.id + '_Series_' + series.index + '_NDLine', 'transparent',
                2, series.chart.themeStyle.histogram || series.chart.themeStyle.errorBar, series.opacity, series.dashArray, direction
            ),
            new Int32Array([series.clipRect.x, series.clipRect.y])
        );
        (<HTMLElement>distributionLine).style.visibility = (!series.chart.enableCanvas) ? ((((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') &&
                                                            series.chart.animateSeries) ? 'hidden' : 'visible') : null;
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(distributionLine);
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        super.doAnimation(series);
        if (series.showNormalDistribution) {
            templateAnimate(
                series.seriesElement.lastElementChild,
                ((series.animation.duration === 0 && animationMode === 'Enable') ? 1000 : series.animation.duration), 500, 'FadeIn'
            );
        }
    }

    /**
     * Updates the direction of rendering for the specified series.
     *
     * @param {Series} series - The series to be rendered.
     * @returns {void}
     */
    public updateDirection(series: Series): void {
        this.render(series);
        if (series.marker.visible) {
            appendChildElement(series.chart.enableCanvas, series.chart.seriesElements, series.symbolElement, true);
        }
        if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
            series.chart.dataLabelCollections = [];
            series.chart.dataLabelModule.render(series, series.chart, series.marker.dataLabel);
            if (series.textElement) {
                appendChildElement(series.chart.enableCanvas, series.chart.dataLabelElements, series.shapeElement, true);
                appendChildElement(series.chart.enableCanvas, series.chart.dataLabelElements, series.textElement, true);
            }
        }
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'HistogramSeries';
        /**
         * return the module name.
         */
    }

    /**
     * To destroy the histogram series.
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
