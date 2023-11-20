import { getPoint, withInRange, ChartLocation } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
/**
 * `RangeStepAreaSeries` Module used to render the range step area series.
 */
export class RangeStepAreaSeries extends LineBase {
    private borderDirection: string = '';
    private prevPoint: Points = null;

    /**
     * Render RangeStepArea series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        this.prevPoint = null;
        let point: Points;
        let currentPoint: ChartLocation;
        let secondPoint: ChartLocation;
        let start: ChartLocation = null;
        let direction: string = '';
        let lineLength: number = 0;
        let command: string = 'M';
        let closed: boolean = undefined;
        let low: number;
        let high: number;
        const borderWidth: number = series.border.width ? series.border.width : 0;
        const borderColor: string = series.border.color ? series.border.color : series.interior;
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        }
        for (let i: number = 0, length: number = visiblePoints.length; i < length; i++) {
            point = visiblePoints[i as number];
            point.symbolLocations = [];
            point.regions = [];
            low = Math.min(<number>point.low, <number>point.high);
            high = Math.max(<number>point.low, <number>point.high);
            if (yAxis.isAxisInverse) {
                const temp: number = low;
                low = high;
                high = temp;
            }
            const lowPoint: ChartLocation = getPoint(point.xValue, low, xAxis, yAxis, isInverted);
            const highPoint: ChartLocation = getPoint(point.xValue, high, xAxis, yAxis, isInverted);
            point.symbolLocations.push(highPoint);
            point.symbolLocations.push(lowPoint);
            const rect: Rect = new Rect(
                Math.min(lowPoint.x, highPoint.x), Math.min(lowPoint.y, highPoint.y),
                Math.max(Math.abs(highPoint.x - lowPoint.x), series.marker.width),
                Math.max(Math.abs(highPoint.y - lowPoint.y), series.marker.width));

            point.regions.push(rect);
            //Path to connect the high points.
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {

                if (start === null) {
                    start = new ChartLocation(point.xValue, 0);
                    // Start point for the current path.
                    currentPoint = getPoint(point.xValue - lineLength, origin, xAxis, yAxis, isInverted);
                    direction += (command + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                    currentPoint = getPoint(point.xValue - lineLength, point.high > point.low ? (point.high as number)
                        : (point.low as number), xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                    this.borderDirection += (command + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                }
                // First Point to draw the RangeStepArea path.
                if (this.prevPoint != null) {
                    currentPoint = getPoint(point.xValue, point.high > point.low ? (point.high as number)
                        : (point.low as number), xAxis, yAxis, isInverted);
                    secondPoint = getPoint(this.prevPoint.xValue, this.prevPoint.high > this.prevPoint.low ? (this.prevPoint.high as number)
                        : (this.prevPoint.low as number), xAxis, yAxis, isInverted);
                    direction += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, command));
                    this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, command));
                    
                }
                else if (series.emptyPointSettings.mode === 'Gap') {
                    currentPoint = getPoint(point.xValue, point.high > point.low ? (point.high as number)
                        : (point.low as number), xAxis, yAxis, isInverted);
                    direction += command + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ';
                    this.borderDirection += command + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ';
                }
                closed = false;
                command = ' L';
                this.prevPoint = point;
                if ((i + 1 < visiblePoints.length && !visiblePoints[i + 1].visible)
                    || i === visiblePoints.length - 1) {
                    // Path to connect the low points.
                    direction = this.closeRangeStepAreaPath(visiblePoints, point, series, direction, i, xAxis, yAxis, isInverted);
                    command = 'M';
                    direction = direction.concat(' ' + 'Z ');
                    closed = true;
                    this.prevPoint = null;
                    start = null;
                }
            } else {
                if (closed === false && i !== 0) {
                    direction = this.closeRangeStepAreaPath(visiblePoints, point, series, direction, i, xAxis, yAxis, isInverted);
                    closed = true;
                }
                command = 'M';
                point.symbolLocations = [];
            }
        }
        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior,
            0, 'transparent', series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
        /**
         * To draw border for the range step area chart.
         */
        if (series.border.width !== 0) {
            this.appendLinePath(
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                    borderWidth, borderColor, 1, series.dashArray,
                    this.borderDirection
                ),
                series, ''
            );
            this.borderDirection = '';
        }
        this.renderMarker(series);
    }

    /**
     * Calculating path direction for rendering the low points.
     *
     * @returns {void}.
     * @private
     */

    protected closeRangeStepAreaPath(
        visiblePoints: Points[], point: Points, series: Series, direction: string,
        i: number, xAxis: Axis, yAxis: Axis, isInverted: boolean): string {
        let currentPoint: ChartLocation;
        let secondPoint: ChartLocation;
        let low: number;
        let high: number;
        for (let j: number = i;  j >= 0; j--) {
            if (visiblePoints[j as number].visible) {
                point = visiblePoints[j as number];

                low = Math.min(<number>point.low, <number>point.high);
                high = Math.max(<number>point.low, <number>point.high);
                if (yAxis.isAxisInverse) {
                    const temp: number = low;
                    low = high;
                    high = temp;
                }

                // Lowpoint for RangeStepArea path.
                if (this.prevPoint != null) {
                    currentPoint = getPoint(point.xValue, point.low < point.high ? (point.low as number)
                        : (point.high as number), xAxis, yAxis, isInverted);
                    secondPoint = getPoint(this.prevPoint.xValue, this.prevPoint.low < this.prevPoint.high ? (this.prevPoint.low as number)
                        : (this.prevPoint.high as number), xAxis, yAxis, isInverted);
                    direction += (this.GetStepLineDirection(currentPoint, secondPoint, series.step));
                    if (j === i) {
                        this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, 'M'));
                    }
                    else {
                        this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, 'L'));
                    }
                }

            } else {
                break;
            }
            this.prevPoint = point;
        }
        return direction;

    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
         */
        return 'RangeStepAreaSeries';
    }

    /**
     * To destroy the range step area series.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys range step area series.
         */
    }
}
