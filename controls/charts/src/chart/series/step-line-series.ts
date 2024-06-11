import { ChartLocation, getPoint, withInRange } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * `StepLineSeries` module is used to render the step line series.
 */

export class StepLineSeries extends LineBase {

    /**
     * Render the Step line series.
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
        let direction: string = '';
        let startPoint: string = 'M';
        let prevPoint: Points = null;
        let lineLength: number;
        let point1: ChartLocation;
        let point2: ChartLocation;
        const visiblePoints: Points[] = this.enableComplexProperty(series);
        if (xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks') {
            lineLength = 0.5;
        } else {
            lineLength = 0;
        }
        for (const point of visiblePoints) {
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                if (startPoint === 'M' && (!visiblePoints[point.index + 1] || !visiblePoints[point.index + 1].visible)) {
                    direction = '';
                }
                if (prevPoint != null) {
                    point2 = getPoint(point.xValue, point.yValue, xAxis, yAxis, isInverted);
                    point1 = getPoint(prevPoint.xValue, prevPoint.yValue, xAxis, yAxis, isInverted);
                    direction = direction.concat(startPoint + ' ' + (point1.x) + ' ' + (point1.y) + this.GetStepLineDirection(point2, point1, series.step));
                    startPoint = 'L';
                } else {
                    point1 = getPoint(point.xValue - lineLength, point.yValue, xAxis, yAxis, isInverted);
                    direction = direction.concat(startPoint + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    startPoint = 'L';
                }
                this.storePointLocation(point, series, isInverted, getPoint);
                if (direction === '') {
                    direction = 'M ' + point.symbolLocations[0].x + ' ' + point.symbolLocations[0].y;
                }
                prevPoint = point;
            } else {
                prevPoint = series.emptyPointSettings.mode === 'Drop' ? prevPoint : null;
                startPoint = series.emptyPointSettings.mode === 'Drop' ? startPoint : 'M';
            }
        }
        if (visiblePoints.length > 0) {
            point1 = getPoint(
                visiblePoints[visiblePoints.length - 1].xValue + lineLength,
                visiblePoints[visiblePoints.length - 1].yValue, xAxis, yAxis, isInverted
            );
            direction = direction.concat(startPoint + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
        }
        const pathOptions: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index, 'transparent',
            series.width, series.interior, series.opacity, series.dashArray, direction
        );
        this[pointAnimate ? 'addPath' : 'appendLinePath'](pathOptions, series, '');
        if (!pointUpdate) {this.renderMarker(series); }
    }
    /**
     * To animate point for step line series.
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
     * To destroy the step line series.
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
        return 'StepLineSeries';
    }
}
