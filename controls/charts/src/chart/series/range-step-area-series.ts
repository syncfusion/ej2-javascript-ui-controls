import { getPoint, withInRange, ChartLocation, animateAddPoints } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
/**
 * The `RangeStepAreaSeries` module is used to render the range step area series.
 */
export class RangeStepAreaSeries extends LineBase {
    private borderDirection: string = '';
    private prevPoint: Points = null;

    /**
     * Renders the Range Step Area series on the chart.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis associated with the series.
     * @param {Axis} yAxis - The y-axis associated with the series.
     * @param {boolean} isInverted - Specifies whether the series is inverted.
     * @param {boolean} pointAnimate - Specifies whether to animate the series point.
     * @param {boolean} pointUpdate - Specifies whether to update the previous point.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate: boolean, pointUpdate?: boolean): void {
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
                    direction += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, command, series, false));
                    this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, command, series, true));
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
        this[pointAnimate ? 'addPath' : 'appendLinePath'](options, series, '');
        /**
         * To draw border for the range step area chart.
         */
        if (series.border.width !== 0) {
            this[pointAnimate ? 'addPath' : 'appendLinePath'](
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                    borderWidth, borderColor, 1, series.border.dashArray,
                    this.borderDirection
                ),
                series, ''
            );
            this.borderDirection = '';
        }
        if (!pointUpdate) {this.renderMarker(series); }
    }

    /**
     * Calculating path direction for rendering the low points.
     *
     * @param {Points[]} visiblePoints - The visible data points.
     * @param {Points} point - The current data point.
     * @param {Series} series - The series to which the data point belongs.
     * @param {string} direction - The direction of the series.
     * @param {number} i - The index of the current data point.
     * @param {Axis} xAxis - The x-axis associated with the series.
     * @param {Axis} yAxis - The y-axis associated with the series.
     * @param {boolean} isInverted - Specifies whether the series is inverted.
     * @returns {string} - Returns the path direction for low direction.
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
                    direction += (this.GetStepLineDirection(currentPoint, secondPoint, series.step === 'Right' ? 'Left' : (series.step === 'Left' ? 'Right' : series.step), 'L', series, false));
                    if (j === i) {
                        this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step === 'Right' ? 'Left' : (series.step === 'Left' ? 'Right' : series.step), 'M', series, true));
                    }
                    else {
                        this.borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step === 'Right' ? 'Left' : (series.step === 'Left' ? 'Right' : series.step), 'L', series, true));
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
     * To animate point for range step area series.
     *
     * @param {Series} series - Specifies the series.
     * @param {number} point - Specifies the point.
     * @returns {void}
     * @private
     */
    public updateDirection(series: Series, point: number[]): void {
        this.render(series, series.xAxis, series.yAxis, series.chart.requireInvertedAxis, false, true);
        for (let i: number = 0; i < point.length; i++) {
            if (series.marker && series.marker.visible) {
                series.points[point[i as number]].symbolLocations.map(function (location: ChartLocation, index: number): void {
                    series.chart.markerRender.renderMarker(series, series.points[point[i as number]], location, index, true);
                });
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
            }
        }
    }

    public addPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.splice((Math.floor((startPathCommands.length / 2)) - 1), 0,
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) - 1],
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) - 1]);
                        startPathCommands.splice((Math.floor((startPathCommands.length / 2)) + 2), 0,
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) + 2],
                                                 startPathCommands[Math.floor((startPathCommands.length / 2)) + 2]);
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(2, 0, endPathCommands[2]);
                        endPathCommands.splice(endPathCommands.length - 3, 0, endPathCommands[endPathCommands.length - 3]);
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            } else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
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
