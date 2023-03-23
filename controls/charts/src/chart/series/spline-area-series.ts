/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { ChartLocation, getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { Axis } from '../../chart/axis/axis';


/**
 * `SplineAreaSeries` module used to render the spline area series.
 */

export class SplineAreaSeries extends SplineBase {

    /**
     * Render the splineArea series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean): void {
        let firstPoint: Points = null;
        let direction: string = '';
        let startPoint: ChartLocation = null;
        let startPoint1: ChartLocation = null;
        let pt2: ChartLocation;
        let bpt1: ChartLocation;
        let bpt2: ChartLocation;
        let controlPt1: ChartLocation;
        let controlPt2: ChartLocation;
        let realPoints: Points[] = [];
        const points: Points[] = [];
        let point: Points;
        let pointIndex: number = 0;
        realPoints = this.filterEmptyPoints(series);
        let emptyPointDirection:  string = '';
        for (let i: number = 0; i < realPoints.length; i++) {
            point = realPoints[i as number];
            if (point.x === null || point.x === '') {
                continue;
            } else {
                point.index = pointIndex;
                pointIndex++;
                points.push(point);
            }
        }
        const pointsLength: number = points.length;
        let previous: number;
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        const origin: number = series.chart.chartAreaType === 'PolarRadar' ? series.points[0].yValue :
            Math.max(<number>series.yAxis.visibleRange.min, 0);
        for (let i: number = 0; i < pointsLength; i++) {
            point = points[i as number];
            point.symbolLocations = [];
            point.regions = [];
            previous = this.getPreviousIndex(points, point.index - 1, series);
            if (point.visible &&
                withInRange(points[previous as number], point, points[this.getNextIndex(points, point.index - 1, series)], series)) {
                if (firstPoint) {
                    controlPt1 = series.drawPoints[previous as number].controlPoint1;
                    controlPt2 = series.drawPoints[previous as number].controlPoint2;
                    pt2 = getCoordinate(point.xValue, point.yValue, xAxis, yAxis, isInverted, series);
                    bpt1 = getCoordinate(controlPt1.x, controlPt1.y, xAxis, yAxis, isInverted, series);
                    bpt2 = getCoordinate(controlPt2.x, controlPt2.y, xAxis, yAxis, isInverted, series);
                    direction = direction.concat('C ' + bpt1.x + ' '
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
            if (((i + 1 < pointsLength && !points[i + 1].visible) || i === pointsLength - 1)
                && pt2 && startPoint) {
                startPoint = getCoordinate(point.xValue, origin, xAxis, yAxis, isInverted, series);
                direction = direction.concat('L ' + (startPoint.x) + ' ' + (startPoint.y) + ' ');
            }
        }
        this.appendLinePath(
            new PathOption(
                series.chart.element.id + '_Series_' + series.index,
                series.interior, 0, 'transparent',
                series.opacity, series.dashArray, direction
            ),
            series, ''
        );

        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(direction));
            this.appendLinePath(
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index,
                    'transparent', series.border.width, series.border.color ? series.border.color : series.interior,
                    1, series.dashArray, emptyPointDirection
                ),
                series, ''
            );
        }
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
