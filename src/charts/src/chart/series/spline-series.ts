import { ChartLocation, PathOption, ControlPoints, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { Axis } from '../../chart/axis/axis';


/**
 * `SplineSeries` module is used to render the spline series.
 */

export class SplineSeries extends SplineBase {

    /**
     * Render the spline series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let chart: Chart = series.chart;
        let marker: MarkerSettingsModel = series.marker;
        let ySpline: number[];
        let options: PathOption;
        let firstPoint: Points = null;
        let secondPoint: Points = null;
        let direction: string = '';
        let pt1: ChartLocation;
        let pt2: ChartLocation;
        let bpt1: ChartLocation;
        let bpt2: ChartLocation;
        let data: ControlPoints;
        let controlPointCount: number = 0;
        let controlPoint1: ChartLocation;
        let controlPoint2: ChartLocation;
        let startPoint: string = 'M';
        let points: Points[] = this.filterEmptyPoints(series);
        let previous: number;
        let getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        for (let point of points) {
            previous = this.getPreviousIndex(points, point.index - 1, series);
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(points[previous], point, points[this.getNextIndex(points, point.index - 1, series)], series)) {
                if (firstPoint !== null) {
                    data = series.drawPoints[previous];
                    controlPoint1 = data.controlPoint1;
                    controlPoint2 = data.controlPoint2;
                    pt1 = getCoordinate(firstPoint.xValue, firstPoint.yValue, xAxis, yAxis, isInverted, series);
                    pt2 = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                    bpt1 = getCoordinate(controlPoint1.x, controlPoint1.y, xAxis, yAxis, isInverted, series);
                    bpt2 = getCoordinate(controlPoint2.x, controlPoint2.y, xAxis, yAxis, isInverted, series);
                    direction = direction.concat((startPoint + ' ' + (pt1.x) + ' ' + (pt1.y) + ' ' + 'C' + ' ' + (bpt1.x) + ' '
                        + (bpt1.y) + ' ' + (bpt2.x) + ' ' + (bpt2.y) + ' ' + (pt2.x) + ' ' + (pt2.y) + ' '));
                    startPoint = 'L';
                }
                firstPoint = point;
                this.storePointLocation(point, series, isInverted, getCoordinate);
            } else {
                startPoint = 'M';
                firstPoint = null;
                point.symbolLocations = [];
            }
        }
        let name: string =
            series.category === 'TrendLine' ? series.chart.element.id + '_Series_' + series.sourceIndex + '_TrendLine_' + series.index :
                series.chart.element.id + '_Series_' + series.index;
        options = new PathOption(
            name, 'transparent', series.width, series.interior,
            series.opacity, series.dashArray, direction
        );
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'SplineSeries';
    }

    /**
     * To destroy the spline. 
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method calling here
         */
    }
}