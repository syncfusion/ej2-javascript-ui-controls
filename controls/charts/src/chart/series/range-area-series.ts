import { withInRange, getPoint, ChartLocation, animateAddPoints } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../axis/axis';

/**
 * `RangeAreaSeries` module is used to render the range area series.
 */

export class RangeAreaSeries extends LineBase {

    public borderDirection : string = '';
    /**
     * Renders the provided Range Area series on the chart based on the given x-axis, y-axis, and inversion status.
     *
     * @param {Series} series - The series to render.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} inverted - A flag indicating whether the chart is inverted or not.
     * @param {boolean} pointAnimate - A flag indicating whether the points should be animated.
     * @param {boolean} pointUpdate - A flag indicating whether the points should be updated.
     * @returns {void}
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean, pointAnimate: boolean, pointUpdate?: boolean): void {
        let point: Points;
        let direction: string = '';
        let command: string = 'M';
        let closed: boolean = undefined;
        const borderWidth: number = series.border.width ? series.border.width : 0;
        const borderColor: string = series.border.color ? series.border.color : series.interior;

        const visiblePoints: Points[] = this.enableComplexProperty(series);

        for (let i: number = 0, length: number = visiblePoints.length; i < length; i++) {
            point = visiblePoints[i as number];
            point.symbolLocations = [];
            point.regions = [];

            let low: number = Math.min(<number>point.low, <number>point.high);
            let high: number = Math.max(<number>point.low, <number>point.high);
            if (yAxis.isAxisInverse) {
                const temp: number = low;
                low = high;
                high = temp;
            }

            const lowPoint: ChartLocation = getPoint(point.xValue, low, xAxis, yAxis, inverted);
            const highPoint: ChartLocation = getPoint(point.xValue, high, xAxis, yAxis, inverted);
            point.symbolLocations.push(highPoint);
            point.symbolLocations.push(lowPoint);

            const rect: Rect = new Rect(
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
                this.borderDirection += (command + ' ' + (lowPoint.x) + ' ' + (lowPoint.y) + ' ');
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
        const name: string = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.chart.element.id + '_Series_' + series.index;

        const options: PathOption = new PathOption(
            name, series.interior,
            0, 'transparent', series.opacity, series.dashArray, direction);
        this[pointAnimate ? 'addPath' : 'appendLinePath'](options, series, '');

        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            this[pointAnimate ? 'addPath' : 'appendLinePath'](
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                    borderWidth, borderColor, 1, series.dashArray,
                    this.borderDirection
                ),
                series, ''
            );
            this.borderDirection = '';
        }
        if (!pointUpdate) { this.renderMarker(series); }
    }

    /**
     * path for rendering the low points
     *
     * @returns {void}.
     * @private
     */

    protected closeRangeAreaPath(
        visiblePoints: Points[], point: Points, series: Series, direction: string, i: number): string {
        for (let j: number = i; j >= 0; j--) {
            if (visiblePoints[j as number].visible && visiblePoints[j as number].symbolLocations[0]) {
                point = visiblePoints[j as number];
                direction += 'L' + ' ' + (point.symbolLocations[0].x) + ' ' + ((point.symbolLocations[0].y)) + ' ';
                this.borderDirection += (j === i ? 'M' : 'L') + ' ' + (point.symbolLocations[0].x) + ' ' + ((point.symbolLocations[0].y)) + ' ';
            } else {
                break;
            }
        }
        return direction;
    }

    /**
     * To animate point for range area series.
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
                series.chart.markerRender.renderMarker(series, series.points[point[i as number]],
                                                       series.points[point[i as number]].symbolLocations[0], null, true);
            }
            if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
                series.chart.dataLabelModule.commonId = series.chart.element.id + '_Series_' + series.index + '_Point_';
                const dataLabelElement: Element[] = series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                                                                 null, series.marker.dataLabel);
                for (let j: number = 0; j < dataLabelElement.length; j++) {
                    series.chart.dataLabelModule.doDataLabelAnimation(series, dataLabelElement[j as number]);
                }
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
                        startPathCommands.splice((startPathCommands.length - 1) / 2, 0,
                                                 startPathCommands.slice(0, (startPathCommands.length - 1) / 2).pop(),
                                                 startPathCommands.slice(0, ((startPathCommands.length - 1) / 2) + 1).pop());
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(1, 0, endPathCommands[0]);
                        endPathCommands.splice(endPathCommands.length - 2, 0, endPathCommands[endPathCommands.length - 2]);
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            }
            else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
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
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series.
         */
        return 'RangeAreaSeries';
    }

    /**
     * To destroy the line series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys range area series.
         */
    }
}
