import { getPoint, withInRange, ChartLocation } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * The `StepAreaSeries` module is used to render the step area series.
 */

export class StepAreaSeries extends LineBase {

    /**
     * Render Step Area series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        let currentPoint: ChartLocation;
        let secondPoint: ChartLocation;
        let start: ChartLocation = null;
        let direction: string = '';
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        const pointsLength: number = visiblePoints.length;
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let point: Points;
        let xValue: number;
        let lineLength: number;
        let prevPoint: Points = null;
        let borderDirection: string = '';
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        } else {
            lineLength = 0;
        }
        for (let i: number = 0; i < pointsLength; i++) {
            point = visiblePoints[i as number];
            xValue = point.xValue;
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoints[i - 1], point, visiblePoints[i + 1], series)) {
                if (start === null) {
                    start = new ChartLocation(xValue, 0);
                    // Start point for the current path
                    currentPoint = getPoint(xValue - lineLength, origin, xAxis, yAxis, isInverted);
                    direction += ('M' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                    currentPoint = getPoint(xValue - lineLength, point.yValue, xAxis, yAxis, isInverted);
                    direction += ('L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                    borderDirection += ('M' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
                }
                // First Point to draw the Steparea path
                if (prevPoint != null) {
                    currentPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                    secondPoint = getPoint(prevPoint.xValue, prevPoint.yValue, xAxis, yAxis, isInverted);
                    direction = direction.concat(this.GetStepLineDirection(currentPoint, secondPoint, series.step, 'L', series));
                    borderDirection += (this.GetStepLineDirection(currentPoint, secondPoint, series.step, 'L', series, true));
                } else if (series.emptyPointSettings.mode === 'Gap') {
                    currentPoint = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                    direction += 'L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ';
                    borderDirection += 'L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ';
                }
                this.storePointLocation(point, series, isInverted, getPoint);
                prevPoint = point;
            }
            if (visiblePoints[i + 1] && !visiblePoints[i + 1].visible && series.emptyPointSettings.mode !== 'Drop') {
                // current start point
                currentPoint = getPoint(xValue + lineLength, origin, xAxis, yAxis, isInverted);
                direction += ('L' + ' ' + (currentPoint.x) + ' ' + (currentPoint.y));
                start = null;
                prevPoint = null;
            }
        }

        if ((pointsLength > 1) && direction !== '') {
            start = { 'x': visiblePoints[pointsLength - 1].xValue + lineLength, 'y': visiblePoints[pointsLength - 1].yValue };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            borderDirection += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
            start = { 'x': visiblePoints[pointsLength - 1].xValue + lineLength, 'y': origin };
            secondPoint = getPoint(start.x, start.y, xAxis, yAxis, isInverted);
            direction += ('L' + ' ' + (secondPoint.x) + ' ' + (secondPoint.y) + ' ');
        } else {
            direction = '';
        }

        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, series.interior,
            0, 'transparent', series.opacity, series.dashArray, direction
        );
        this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](options, series, '');
        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            const options: PathOption = new PathOption(
                series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                series.border.width, series.border.color ? series.border.color : series.interior, 1, series.dashArray, borderDirection
            );
            this[pointAnimate ? 'addAreaPath' : 'appendLinePath'](options, series, '');
        }
        if (!pointUpdate) {this.renderMarker(series); }
    }

    /**
     * To animate point for step area series.
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
                series.chart.dataLabelModule.renderDataLabel(series, series.points[point[i as number]],
                                                             null, series.marker.dataLabel);
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
     * To destroy the step Area series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here.
         */
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
        return 'StepAreaSeries';
    }
}
