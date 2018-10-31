import { ChartLocation, PathOption, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { Axis } from '../../chart/axis/axis';

/**
 * `SplineAreaSeries` module used to render the spline area series.
 */

export class SplineAreaSeries extends SplineBase {

    /**
     * Render the splineArea series.
     * @return {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let firstPoint: Points = null;
        let direction: string = '';
        let startPoint: ChartLocation = null;
        let startPoint1: ChartLocation = null;
        let pt1: ChartLocation;
        let pt2: ChartLocation;
        let bpt1: ChartLocation;
        let bpt2: ChartLocation;
        let controlPt1: ChartLocation;
        let controlPt2: ChartLocation;
        let points: Points[] = this.filterEmptyPoints(series);
        let pointsLength: number = series.points.length;
        let point: Points;
        let previous: number;
        let getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        let origin: number = series.chart.chartAreaType === 'PolarRadar' ? series.points[0].yValue :
            Math.max(<number>series.yAxis.visibleRange.min, 0);
        for (let i: number = 0; i < pointsLength; i++) {
            point = series.points[i];
            point.symbolLocations = [];
            point.regions = [];
            previous = this.getPreviousIndex(points, point.index - 1, series);
            if (point.visible &&
                withInRange(points[previous], point, points[this.getNextIndex(points, point.index - 1, series)], series)) {
                if (firstPoint) {
                    controlPt1 = series.drawPoints[previous].controlPoint1;
                    controlPt2 = series.drawPoints[previous].controlPoint2;
                    pt1 = getCoordinate(firstPoint.xValue, firstPoint.yValue, xAxis, yAxis, isInverted, series);
                    pt2 = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                    bpt1 = getCoordinate(controlPt1.x, controlPt1.y, xAxis, yAxis, isInverted, series);
                    bpt2 = getCoordinate(controlPt2.x, controlPt2.y, xAxis, yAxis, isInverted, series);
                    direction = direction.concat(' C ' + bpt1.x + ' '
                        + bpt1.y + ' ' + bpt2.x + ' ' + bpt2.y + ' ' + pt2.x + ' ' + pt2.y + ' ');
                } else {
                    // Start point for the current path
                    startPoint = getCoordinate(point.xValue, origin, xAxis, yAxis, isInverted, series);
                    direction += ('M ' + startPoint.x + ' ' + startPoint.y + ' ');
                    // First Point to draw the area path
                    startPoint1 = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                    direction += ('L ' + startPoint1.x + ' ' + startPoint1.y + ' ');
                }
                this.storePointLocation(point, series, isInverted, getCoordinate);
                firstPoint = point;
            } else {
                firstPoint = null;
                point.symbolLocations = [];
            }
            if (((i + 1 < pointsLength && !series.points[i + 1].visible) || i === pointsLength - 1)
                && pt2 && startPoint) {
                startPoint = getCoordinate(point.xValue, origin, xAxis, yAxis, isInverted, series);
                direction = direction.concat('L ' + (startPoint.x) + ' ' + (startPoint.y));
            }
        }
        this.appendLinePath(
            new PathOption(
                series.chart.element.id + '_Series_' + series.index,
                series.interior, series.border.width, series.border.color,
                series.opacity, series.dashArray, direction
            ),
            series, ''
        );
        this.renderMarker(series);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'SplineAreaSeries';
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