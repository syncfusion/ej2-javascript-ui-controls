import { ChartLocation, ControlPoints, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
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
                    direction = this.getSplineDirection(
                        series.drawPoints[previous], firstPoint, point, xAxis, yAxis, isInverted, series, startPoint,
                        getCoordinate, direction);
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
        if (series.chart.chartAreaType === 'PolarRadar' && series.isClosed) {
            direction = this.getSplineDirection(
                series.drawPoints[series.drawPoints.length - 1], points[points.length - 1],
                {xValue: points.length, yValue: points[0].yValue } as Points,
                xAxis, yAxis, isInverted,
                series, startPoint,
                getCoordinate, direction);
            startPoint = 'L';
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
     * 
     * @param data To find the direct of spline using points.
     * @param firstPoint 
     * @param point 
     * @param xAxis 
     * @param yAxis 
     * @param isInverted 
     * @param series 
     * @param startPoint 
     * @param getCoordinate 
     * @param direction 
     */
    private getSplineDirection(
        data: ControlPoints, firstPoint: Points, point: Points, xAxis: Axis, yAxis: Axis, isInverted: boolean, series: Series,
        startPoint: string, getCoordinate: Function, direction: string
         ): string {
        let controlPoint1: ChartLocation = data.controlPoint1;
        let controlPoint2: ChartLocation = data.controlPoint2;
        let pt1: ChartLocation = getCoordinate(firstPoint.xValue, firstPoint.yValue, xAxis, yAxis, isInverted, series);
        let pt2: ChartLocation = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
        let bpt1: ChartLocation = getCoordinate(controlPoint1.x, controlPoint1.y, xAxis, yAxis, isInverted, series);
        let bpt2: ChartLocation = getCoordinate(controlPoint2.x, controlPoint2.y, xAxis, yAxis, isInverted, series);
        return direction.concat((startPoint + ' ' + (pt1.x) + ' ' + (pt1.y) + ' ' + 'C' + ' ' + (bpt1.x) + ' '
            + (bpt1.y) + ' ' + (bpt2.x) + ' ' + (bpt2.y) + ' ' + (pt2.x) + ' ' + (pt2.y) + ' '));
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