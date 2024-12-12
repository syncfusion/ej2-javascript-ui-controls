import { withInRange, getPoint, ChartLocation, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * The `LineSeries` module is used to render the line series.
 */
export class LineSeries extends LineBase {
    /**
     * Renders the line series based on the provided axis and inversion status.
     *
     * @param {Series} series - The series to render.
     * @param {Axis} xAxis - The X-axis associated with the series.
     * @param {Axis} yAxis - The Y-axis associated with the series.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        let point1: ChartLocation;
        let point2: ChartLocation;
        let direction: string = '';
        let prevPoint: Points = null;
        let startPoint: string = 'M';
        const isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        const isDrop: boolean = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        const getCoordinate: Function = isPolar ? TransformToVisible : getPoint;
        const visiblePoints: Points[] = series.category === 'TrendLine' ? series.points : this.enableComplexProperty(series);
        for (const point of visiblePoints) {
            point.regions = [];
            point.symbolLocations = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                direction += this.getLineDirection(prevPoint, point, series, isInverted, getCoordinate, startPoint);
                startPoint = prevPoint ? 'L' : startPoint;
                prevPoint = point;
                this.storePointLocation(point, series, isInverted, getCoordinate);
                if (direction === '' && visiblePoints.length === 1) {
                    direction = 'M ' + point.symbolLocations[0].x + ' ' + point.symbolLocations[0].y;
                }
            } else {
                prevPoint = isDrop ? prevPoint : null;
                startPoint = isDrop ? startPoint : 'M';
            }
        }
        if (isPolar) {
            if (series.isClosed) {
                const points: {first: Points, last: Points} = this.getFirstLastVisiblePoint(visiblePoints);
                point2 = getCoordinate(
                    points.last.xValue, points.last.yValue,
                    xAxis, yAxis, isInverted, series
                );
                point1 = getCoordinate(points.first.xValue, points.first.yValue, xAxis, yAxis, isInverted, series);
                direction = direction.concat(startPoint + ' ' + point2.x + ' ' + point2.y + ' ' + 'L' + ' ' + point1.x + ' ' + point1.y);
            }
        }
        const name: string = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.category === 'TrendLine' ? series.chart.element.id + '_Series_' + series.sourceIndex + '_TrendLine_' + series.index :
                series.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index);
        const options: PathOption = new PathOption(
            name, 'none', series.width, series.interior,
            series.opacity, series.dashArray, direction
        );
        this[pointAnimate ? 'addPath' : 'appendLinePath'](options, series, '');
        if (!pointUpdate) {this.renderMarker(series); }
    }

    /**
     * To animate point for line series.
     *
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
        this.doProgressiveAnimation(series, option);
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'LineSeries';
    }

    /**
     * To destroy the line series.
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
