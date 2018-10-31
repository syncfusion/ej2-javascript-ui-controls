import { withInRange, getPoint, ChartLocation, PathOption, Rect } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../axis/axis';

/**
 * `RangeAreaSeries` module is used to render the range area series.
 */

export class RangeAreaSeries extends LineBase {
    /**
     * Render RangeArea Series.
     * @return {void}.
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean): void {
        let point: Points;
        let direction: string = '';
        let command: string = 'M';
        let closed: boolean = undefined;

        let visiblePoints: Points[] = this.improveChartPerformance(series);

        for (let i: number = 0, length: number = visiblePoints.length; i < length; i++) {
            point = visiblePoints[i];
            point.symbolLocations = [];
            point.regions = [];

            let low: number = Math.min(<number>point.low, <number>point.high);
            let high: number = Math.max(<number>point.low, <number>point.high);
            if (yAxis.isInversed) {
                let temp: number = low;
                low = high;
                high = temp;
            }

            let lowPoint: ChartLocation = getPoint(point.xValue, low, xAxis, yAxis, inverted);
            let highPoint: ChartLocation = getPoint(point.xValue, high, xAxis, yAxis, inverted);
            point.symbolLocations.push(highPoint);
            point.symbolLocations.push(lowPoint);

            let rect: Rect = new Rect(
                Math.min(lowPoint.x, highPoint.x), Math.min(lowPoint.y, highPoint.y),
                Math.max(Math.abs(highPoint.x - lowPoint.x), series.marker.width),
                Math.max(Math.abs(highPoint.y - lowPoint.y), series.marker.width));

            if (!inverted) {
                rect.x -= series.marker.width / 2;
            } else {
                rect.y -= series.marker.width / 2;
            }

            point.regions.push(rect);

            //Path to connect the high points
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                direction = direction.concat(command + ' ' + (lowPoint.x) + ' ' + (lowPoint.y) + ' ');
                closed = false;

                if ((i + 1 < visiblePoints.length && !visiblePoints[i + 1].visible)
                    || i === visiblePoints.length - 1) {
                    // Path to connect the low points
                    direction = this.closeRangeAreaPath(visiblePoints, point, series, direction, i);
                    command = 'M';
                    direction = direction.concat(' ' + 'Z');
                    closed = true;
                }
                command = 'L';
            } else {
                if (closed === false && i !== 0) {
                    direction = this.closeRangeAreaPath(visiblePoints, point, series, direction, i);
                    closed = true;
                }
                command = 'M';
                point.symbolLocations = [];
            }
        }
        let name: string = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.chart.element.id + '_Series_' + series.index;

        let options: PathOption = new PathOption(
            name, series.interior,
            series.border.width, series.border.color, series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    }

    /**
     * path for rendering the low points
     * @return {void}.
     * @private
     */

    protected closeRangeAreaPath(
        visiblePoints: Points[], point: Points, series: Series, direction: string, i: number): string {
        for (let j: number = i; j >= 0; j--) {
            if (visiblePoints[j].visible && visiblePoints[j].symbolLocations[0]) {
                point = visiblePoints[j];
                direction += 'L' + ' ' + (point.symbolLocations[0].x) + ' ' + ((point.symbolLocations[0].y)) + ' ';
            } else {
                break;
            }
        }
        return direction;
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'RangeAreaSeries';
    }

    /**
     * To destroy the line series. 
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys range area series
         */
    }
}
