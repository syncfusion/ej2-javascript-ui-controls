/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { ChartLocation, ControlPoints, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { Axis } from '../../chart/axis/axis';


/**
 * `SplineSeries` module is used to render the spline series.
 */

export class SplineSeries extends SplineBase {

    /**
     * Render the spline series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let firstPoint: Points = null;
        let direction: string = '';
        let startPoint: string = 'M';
        let points: Points[] = [];
        const tempPoints: Points[] = series.category === 'TrendLine' ? series.points : this.enableComplexProperty(series);
        points = this.filterEmptyPoints(series, tempPoints);
        let previous: number;
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        for (const point of points) {
            previous = this.getPreviousIndex(points, point.index - 1, series);
            point.symbolLocations = []; point.regions = [];
            if (point.visible) {
                if (withInRange(points[previous as number], point, points[this.getNextIndex(points, point.index - 1, series)], series)) {
                    if (firstPoint !== null) {
                        direction = this.getSplineDirection(
                            series.drawPoints[previous as number], firstPoint, point, xAxis, yAxis, isInverted, series, startPoint,
                            getCoordinate, direction);
                        startPoint = 'L';
                    }
                    this.storePointLocation(point, series, isInverted, getCoordinate);
                }
                firstPoint = point;
            } else {
                startPoint = 'M';
                firstPoint = null;
                point.symbolLocations = [];
            }
        }
        if ((points.length > 0 && series.drawPoints.length > 0) && series.chart.chartAreaType === 'PolarRadar' && series.isClosed) {
            const connectPoints: { first: Points, last: Points } = this.getFirstLastVisiblePoint(points);
            direction = this.getSplineDirection(
                series.drawPoints[series.drawPoints.length - 1], connectPoints.last,
                { xValue: connectPoints.first.xValue, yValue: connectPoints.first.yValue } as Points,
                xAxis, yAxis, isInverted,
                series, startPoint,
                getCoordinate, direction);
            startPoint = 'L';
        }
        const name: string =
            series.category === 'TrendLine' ? series.chart.element.id + '_Series_' + series.sourceIndex + '_TrendLine_' + series.index :
                series.chart.element.id + '_Series_' + series.index;
        const options: PathOption = new PathOption(
            name, 'transparent', series.width, series.interior,
            series.opacity, series.dashArray, direction
        );
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    }
    /**
     * To find the direct of spline using points.
     *
     * @param {ControlPoints} data data
     * @param {Points} firstPoint firstPoint
     * @param {Points} point point
     * @param {Axis} xAxis xAxis
     * @param {Axis} yAxis yAxis
     * @param {boolean} isInverted isInverted
     * @param {Series} series series
     * @param {string} startPoint startPoint
     * @param {Function} getCoordinate getCoordinate
     * @param {string} direction direction
     */
    private getSplineDirection(
        data: ControlPoints, firstPoint: Points, point: Points, xAxis: Axis, yAxis: Axis, isInverted: boolean, series: Series,
        startPoint: string, getCoordinate: Function, direction: string
    ): string {
        const controlPoint1: ChartLocation = data.controlPoint1;
        const controlPoint2: ChartLocation = data.controlPoint2;
        const pt1: ChartLocation = getCoordinate(firstPoint.xValue, firstPoint.yValue, xAxis, yAxis, isInverted, series);
        const pt2: ChartLocation = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
        const bpt1: ChartLocation = getCoordinate(controlPoint1.x, controlPoint1.y, xAxis, yAxis, isInverted, series);
        const bpt2: ChartLocation = getCoordinate(controlPoint2.x, controlPoint2.y, xAxis, yAxis, isInverted, series);
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
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }
}
