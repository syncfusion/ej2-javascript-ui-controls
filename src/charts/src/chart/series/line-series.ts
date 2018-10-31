import { withInRange, getPoint, ChartLocation, PathOption, TransformToVisible } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../../chart/axis/axis';

/**
 * `LineSeries` module used to render the line series.
 */
export class LineSeries extends LineBase {
    /**
     * Render Line Series.
     * @return {void}.
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let point1: ChartLocation;
        let point2: ChartLocation;
        let direction: string = '';
        let prevPoint: Points = null;
        let startPoint: string = 'M';
        let options: PathOption;
        let isPolar: boolean = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        let isDrop: boolean = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        let getCoordinate: Function = isPolar ? TransformToVisible : getPoint;
        let visiblePoints: Points[] = this.improveChartPerformance(series);
        for (let point of visiblePoints) {
            point.regions = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                direction += this.getLineDirection(prevPoint, point, series, isInverted, getCoordinate, startPoint);
                startPoint = prevPoint ? 'L' : startPoint;
                prevPoint = point;
                this.storePointLocation(point, series, isInverted, getCoordinate);
            } else {
                prevPoint = isDrop ? prevPoint : null;
                startPoint = isDrop ? startPoint : 'M';
                point.symbolLocations = [];
            }
        }
        if (isPolar) {
            if (series.isClosed) {
                point2 = getCoordinate(
                    visiblePoints[visiblePoints.length - 1].xValue, visiblePoints[visiblePoints.length - 1].yValue,
                    xAxis, yAxis, isInverted, series
                );
                point1 = getCoordinate(visiblePoints[0].xValue, visiblePoints[0].yValue, xAxis, yAxis, isInverted, series);
                direction = direction.concat(startPoint + ' ' + point2.x + ' ' + point2.y + ' ' + 'L' + ' ' + point1.x + ' ' + point1.y);
            }
        }
        let name: string = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.category === 'TrendLine' ? series.chart.element.id + '_Series_' + series.sourceIndex + '_TrendLine_' + series.index :
                series.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index);
        options = new PathOption(
            name, 'none', series.width, series.interior,
            series.opacity, series.dashArray, direction
        );
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        this.doProgressiveAnimation(series, option);
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'LineSeries';
    }

    /**
     * To destroy the line series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}