import { withInRange, getPoint, ChartLocation, TransformToVisible } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel, LinearGradientModel, RadialGradientModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

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
        initializeTelemetryFeature('LineSeries', 'Charts');
        let point1: ChartLocation;
        let point2: ChartLocation;
        let direction: string = '';
        let prevPoint: Points = null;
        let startPoint: string = 'M';
        const isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        const isDrop: boolean = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        const getCoordinate: Function = isPolar ? TransformToVisible : getPoint;
        const visiblePoints: Points[] = series.category === 'TrendLine' ? series.points : this.enableComplexProperty(series);
        const markerWidth: number = (series.marker && series.marker.width) ? series.marker.width : 0;
        const markerHeight: number = (series.marker && series.marker.height) ? series.marker.height : 0;
        for (const point of visiblePoints) {
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                // same result as storePointLocation with the marker size read once per series
                const location: ChartLocation = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                point.symbolLocations = [location];
                point.regions = [new Rect(location.x - markerWidth, location.y - markerHeight, 2 * markerWidth, 2 * markerHeight)];
                if (prevPoint) {
                    const loc1: ChartLocation = prevPoint.symbolLocations[0];
                    const loc2: ChartLocation = point.symbolLocations[0];
                    direction += startPoint + ' ' + loc1.x + ' ' + loc1.y + ' L ' + loc2.x + ' ' + loc2.y + ' ';
                }
                startPoint = prevPoint ? 'L' : startPoint;
                prevPoint = point;
                if (direction === '' && visiblePoints.length === 1) {
                    direction = 'M ' + point.symbolLocations[0].x + ' ' + point.symbolLocations[0].y;
                }
            } else {
                point.regions = [];
                point.symbolLocations = [];
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
        this.applyGradientColors(series);
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
     * Applies gradient colors to the series based on linear or radial gradient settings.
     * If either a linear gradient or radial gradient is defined with color stops,
     * the series interior is set to use the gradient fill.
     *
     * @param {Series} series - The series to which gradient colors will be applied.
     * @returns {void}
     * @private
     */
    private applyGradientColors(series: Series): void {
        const linearGradient: LinearGradientModel = series.linearGradient && series.linearGradient.gradientColorStop.length > 0
            ? series.linearGradient : null;
        const radialGradient: RadialGradientModel = series.radialGradient && series.radialGradient.gradientColorStop.length > 0
            ? series.radialGradient : null;
        if (!isNullOrUndefined(linearGradient) || !isNullOrUndefined(radialGradient)) {
            series.interior = `url(#${series.gradientId})`;
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
