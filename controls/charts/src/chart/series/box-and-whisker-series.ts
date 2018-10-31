import { Rect, withInRange, PathOption, sum } from '../../common/utils/helper';
import { Size, getSaturationColor, ChartLocation, getPoint } from '../../common/utils/helper';
import { Chart } from '../chart';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { BoxPlotMode } from '../utils/enum';
import { getMedian } from '../../common/utils/helper';
import { IBoxPlotQuartile } from '../../common/model/interface';
import { Axis } from '../../chart/axis/axis';

/**
 * `BoxAndWhiskerSeries` module is used to render the box and whisker series.
 */
export class BoxAndWhiskerSeries extends ColumnBase {

    /**
     * Render BoxAndWhisker series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let argsData: IPointRenderEventArgs;
        for (let point of series.points) {
            point.symbolLocations = []; point.regions = [];
            let centerRegion: Rect;
            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                this.findBoxPlotValues(point.y as number[], point, series.boxPlotMode);
                //region to cover the top and bottom ticks
                this.updateTipRegion(series, point, sideBySideInfo);
                //get middle rect
                centerRegion = this.getRectangle(
                    (point.xValue + sideBySideInfo.start),
                    point.upperQuartile, (point.xValue + sideBySideInfo.end),
                    point.lowerQuartile, series
                );
                point.regions.push(centerRegion);
                argsData = this.triggerEvent(
                    series, point, series.interior, {
                        color: (!isNullOrUndefined(series.border.color) && series.border.color !== 'transparent') ? series.border.color :
                            getSaturationColor(series.interior, -0.6),
                        width: series.border.width ? series.border.width : 1
                    }
                );
                if (!argsData.cancel) {
                    this.renderBoxAndWhisker(
                        series, point, centerRegion, argsData,
                        this.getPathString(
                            point, series,
                            getPoint(point.xValue, point.median, xAxis, yAxis, isInverted),
                            getPoint(point.xValue + sideBySideInfo.median, point.average, xAxis, yAxis, isInverted)
                        ),
                        sideBySideInfo.median
                    );
                }
            }
        }
        if (series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * update the tip region fo box plot
     * @param series 
     * @param point 
     * @param sideBySideInfo 
     */
    private updateTipRegion(series: Series, point: Points, sideBySideInfo: DoubleRange): void {
        let tipRegion: Rect = this.getRectangle(
            (point.xValue + sideBySideInfo.median),
            point.maximum, (point.xValue + sideBySideInfo.median),
            point.minimum, series
        );
        this.updateTipSize(series, point, tipRegion, series.chart.requireInvertedAxis);
    }

    /**
     * Update tip size to tip regions
     * @param series 
     * @param point 
     * @param region 
     * @param isInverted 
     */
    private updateTipSize(series: Series, point: Points, region: Rect, isInverted: boolean): void {
        let borderWidth: number = series.border.width || 1;
        if (!isInverted) {
            region.x -= borderWidth / 2;
            region.width = region.width || borderWidth;
        } else {
            region.y -= borderWidth / 2;
            region.height = region.height || borderWidth;
        }
        point.regions.push(region);
    }

    /**
     * Calculation for path direction performed here
     * @param point 
     * @param series 
     * @param median 
     * @param average 
     */
    public getPathString(point: Points, series: Series, median: ChartLocation, average: ChartLocation): string {
        let topRect: Rect = point.regions[0];
        let midRect: Rect = point.regions[1];
        let direction: string = '';
        let width: number = series.chart.requireInvertedAxis ? topRect.height : topRect.width;
        let center: number = series.chart.requireInvertedAxis ? topRect.y + topRect.height / 2 :
            topRect.x + topRect.width / 2;
        let midWidth: number = midRect.x + midRect.width;
        let midHeight: number = midRect.y + midRect.height;
        let topWidth: number = topRect.x + topRect.width;
        let topHeight: number = topRect.y + topRect.height;
        if (!series.chart.requireInvertedAxis) {
            this.updateTipSize(series, point, { x: midRect.x, y: topRect.y, width: midWidth - midRect.x, height: 0 }, true);
            this.updateTipSize(series, point, { x: midRect.x, y: topHeight, width: midWidth - midRect.x, height: 0 }, true);
            direction += 'M ' + midRect.x + ' ' + topRect.y + ' ' + ' L ' + midWidth + ' ' + topRect.y;
            direction += ' M ' + center + ' ' + topRect.y + ' ' + ' L ' + center + ' ' + midRect.y;
            direction += ' M ' + midRect.x + ' ' + midRect.y + ' ' + ' L ' + midWidth + ' ' + midRect.y +
                ' L ' + midWidth + ' ' + midHeight + ' L ' + midRect.x + ' ' + midHeight + ' Z';
            direction += ' M ' + center + ' ' + midHeight + ' L ' + center + ' ' + topHeight;
            direction += ' M ' + midRect.x + ' ' + topHeight + ' L ' + midWidth + ' ' + topHeight;
            direction += ' M ' + midRect.x + ' ' + median.y + ' L ' + midWidth + ' ' + median.y;
            direction += series.showMean ?
                ' M ' + (average.x - 5) + ' ' + (average.y - 5) + ' L ' + (average.x + 5) + ' ' + (average.y + 5) +
                ' M ' + (average.x + 5) + ' ' + (average.y - 5) + ' L ' + (average.x - 5) + ' ' + (average.y + 5) : '';
        } else {
            this.updateTipSize(series, point, { x: topRect.x, y: midRect.y, width: 0, height: midHeight - midRect.y }, false);
            this.updateTipSize(series, point, { x: topWidth, y: midRect.y, width: 0, height: midHeight - midRect.y }, true);
            direction += 'M ' + topRect.x + ' ' + midRect.y + ' L ' + topRect.x + ' ' + midHeight;
            direction += 'M ' + topRect.x + ' ' + center + ' ' + ' L ' + midRect.x + ' ' + center;
            direction += ' M ' + midRect.x + ' ' + midRect.y + ' ' + ' L ' + midWidth + ' ' + midRect.y +
                ' L ' + midWidth + ' ' + midHeight + ' L ' + midRect.x + ' ' + midHeight + ' Z';
            direction += ' M ' + midWidth + ' ' + center + ' L ' + topWidth + ' ' + center;
            direction += ' M ' + topWidth + ' ' + midRect.y + ' L ' + topWidth + ' ' + midHeight;
            direction += ' M ' + median.x + ' ' + midRect.y + ' ' + ' L ' + median.x + ' ' + midHeight;
            direction += series.showMean ?
                'M ' + (average.x + 5) + ' ' + (average.y - 5) + ' L ' + (average.x - 5) + ' ' + (average.y + 5) +
                'M ' + (average.x - 5) + ' ' + (average.y - 5) + ' L ' + (average.x + 5) + ' ' + (average.y + 5) : '';
        }
        return direction;
    }


    /**
     * Rendering for box and whisker append here.
     * @param series
     * @param point 
     * @param rect 
     * @param argsData 
     * @param direction 
     */
    public renderBoxAndWhisker(
        series: Series, point: Points, rect: Rect, argsData: IPointRenderEventArgs,
        direction: string, median: number
    ): void {
        let location: ChartLocation;
        let size: Size;
        let symbolId: string = series.chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        let element: HTMLElement = series.chart.renderer.drawPath(
            new PathOption(
                symbolId + '_BoxPath',
                argsData.fill, argsData.border.width,
                argsData.border.color, series.opacity, series.dashArray, direction
            )
        ) as HTMLElement;
        element.setAttribute('aria-label', point.x.toString() + ':' + point.maximum.toString()
            + ':' + point.minimum.toString() + ':' + point.lowerQuartile.toString() + ':' + point.upperQuartile.toString());
        let parentElement: Element = series.chart.renderer.createGroup({
            'id': symbolId
        });
        parentElement.appendChild(element);
        for (let i: number = 0; i < point.outliers.length; i++) {
            location = getPoint(
                (point.xValue + median), point.outliers[i], series.xAxis, series.yAxis,
                series.chart.requireInvertedAxis
            );
            size = new Size(series.marker.width, series.marker.height);
            point.symbolLocations.push(location);
            this.updateTipSize(
                series, point, {
                    x: location.x - (size.width / 2), y: location.y - (size.height / 2),
                    width: size.width, height: size.height
                },
                true
            );
        }
        series.seriesElement.appendChild(parentElement);
    }
    /**
     * To find the box plot values
     * @param yValues 
     * @param point 
     * @param mode 
     */
    public findBoxPlotValues(yValues: number[], point: Points, mode: BoxPlotMode): void {
        let yCount: number = yValues.length;
        let quartile: IBoxPlotQuartile = {
            average: sum(yValues) / yCount,
            lowerQuartile: 0, upperQuartile: 0,
            maximum: 0, minimum: 0,
            median: 0, outliers: []
        };
        if (mode === 'Exclusive') {
            quartile.lowerQuartile = this.getExclusiveQuartileValue(yValues, yCount, 0.25);
            quartile.upperQuartile = this.getExclusiveQuartileValue(yValues, yCount, 0.75);
            quartile.median = this.getExclusiveQuartileValue(yValues, yCount, 0.5);
        } else if (mode === 'Inclusive') {
            quartile.lowerQuartile = this.getInclusiveQuartileValue(yValues, yCount, 0.25);
            quartile.upperQuartile = this.getInclusiveQuartileValue(yValues, yCount, 0.75);
            quartile.median = this.getInclusiveQuartileValue(yValues, yCount, 0.5);
        } else {
            quartile.median = getMedian(yValues);
            this.getQuartileValues(yValues, yCount, quartile);
        }
        this.getMinMaxOutlier(yValues, yCount, quartile);
        point.minimum = quartile.minimum;
        point.maximum = quartile.maximum;
        point.lowerQuartile = quartile.lowerQuartile;
        point.upperQuartile = quartile.upperQuartile;
        point.median = quartile.median;
        point.outliers = quartile.outliers;
        point.average = quartile.average;
    }
    /**
     * to find the exclusive quartile values
     * @param yValues 
     * @param count 
     * @param percentile 
     */
    private getExclusiveQuartileValue(yValues: number[], count: number, percentile: number): number {
        if (count === 0) {
            return 0;
        } else if (count === 1) {
            return yValues[0];
        }
        let value: number = 0;
        let rank: number = percentile * (count + 1);
        let integerRank: number = Math.floor(Math.abs(rank));
        let fractionRank: number = rank - integerRank;
        if (integerRank === 0) {
            value = yValues[0];
        } else if (integerRank > count - 1) {
            value = yValues[count - 1];
        } else {
            value = fractionRank * (yValues[integerRank] - yValues[integerRank - 1]) + yValues[integerRank - 1];
        }
        return value;
    }
    /**
     * to find the inclusive quartile values
     * @param yValues 
     * @param count 
     * @param percentile 
     */
    private getInclusiveQuartileValue(yValues: number[], count: number, percentile: number): number {
        if (count === 0) {
            return 0;
        } else if (count === 1) {
            return yValues[0];
        }
        let value: number = 0;
        let rank: number = percentile * (count - 1);
        let integerRank: number = Math.floor(Math.abs(rank));
        let fractionRank: number = rank - integerRank;
        value = fractionRank * (yValues[integerRank + 1] - yValues[integerRank]) + yValues[integerRank];
        return value;
    }
    /**
     * To find the quartile values
     * @param yValues 
     * @param count 
     * @param lowerQuartile 
     * @param upperQuartile 
     */
    private getQuartileValues(yValues: number[], count: number, quartile: IBoxPlotQuartile): void {
        if (count === 1) {
            quartile.lowerQuartile = yValues[0];
            quartile.upperQuartile = yValues[0];
            return null;
        }
        let isEvenList: boolean = count % 2 === 0;
        let halfLength: number = count / 2;
        let lowerQuartileArray: number[] = yValues.slice(0, halfLength);
        let upperQuartileArray: number[] = yValues.slice(isEvenList ? halfLength : halfLength + 1, count);
        quartile.lowerQuartile = getMedian(lowerQuartileArray);
        quartile.upperQuartile = getMedian(upperQuartileArray);
    }
    /**
     * To find the min, max and outlier values
     * @param yValues 
     * @param lowerQuartile 
     * @param upperQuartile 
     * @param minimum 
     * @param maximum 
     * @param outliers 
     */
    private getMinMaxOutlier(
        yValues: number[], count: number, quartile: IBoxPlotQuartile
    ): void {
        let interquartile: number = quartile.upperQuartile - quartile.lowerQuartile;
        let rangeIQR: number = 1.5 * interquartile;
        for (let i: number = 0; i < count; i++) {
            if (yValues[i] < quartile.lowerQuartile - rangeIQR) {
                quartile.outliers.push(yValues[i]);
            } else {
                quartile.minimum = yValues[i];
                break;
            }
        }
        for (let i: number = count - 1; i >= 0; i--) {
            if (yValues[i] > quartile.upperQuartile + rangeIQR) {
                quartile.outliers.push(yValues[i]);
            } else {
                quartile.maximum = yValues[i];
                break;
            }
        }
    }
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'BoxAndWhiskerSeries';
        /**
         * return the module name
         */
    }

    /**
     * To destroy the candle series. 
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the candle series.
         */
    }
}