import { ChartLocation, ControlPoints, getPoint, withInRange, TransformToVisible, animateAddPoints } from '../../common/utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { Axis } from '../../chart/axis/axis';


/**
 * The `SplineSeries` module is used to render the spline series.
 */

export class SplineSeries extends SplineBase {


    /**
     * Render the spline series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the chart is inverted.
     * @param {boolean} pointUpdate - Specifies whether the chart is inverted.
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        let firstPoint: Points = null;
        let direction: string = '';
        let startPoint: string = 'M';
        let points: Points[] = [];
        const tempPoints: Points[] = series.category === 'TrendLine' ? series.points : this.enableComplexProperty(series);
        points = this.filterEmptyPoints(series, tempPoints);
        let previous: number;
        const getCoordinate: Function = series.chart.chartAreaType === 'PolarRadar' ? TransformToVisible : getPoint;
        for (const point of points) {
            if (point.index === 1) {
                direction = '';
            }
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
                    if (direction === '' && points.length === 1) {
                        direction = 'M ' + point.symbolLocations[0].x + ' ' + point.symbolLocations[0].y;
                    }
                    if (firstPoint === null && direction !== '' && (point.index === points.length - 1 || (points[point.index + 1] && !points[point.index + 1].visible))) {
                        direction += 'M ' + point.symbolLocations[0].x + ' ' + point.symbolLocations[0].y + ' ';
                    }
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
        this[pointAnimate ? 'addPath' : 'appendLinePath'](options, series, '');
        if (!pointUpdate) {this.renderMarker(series); }
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
     * @returns {string} - Returns the direct of spline using points.
     * @private
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
     * Adds a area path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @param {ChartLocation[]} [firstSymbol] - The location of the first symbol.
     * @returns {void}
     * @private
     */
    public addPath (options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
        this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (series.removedPointIndex === 0 && startPathCommands.length > endPathCommands.length && startPathCommands[2] && startPathCommands[2].indexOf('M') === 0) {
                startPathCommands.splice(0, startPathCommands.length - endPathCommands.length);
                points.previousDirection = startPathCommands.join('');
            }
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        if (endPathCommands.length === startPathCommands.length + 1 && endPathCommands[endPathCommands.length - 1].indexOf('M') === 0) {
                            startPathCommands.push(endPathCommands[endPathCommands.length - 1]);
                        }
                        else if (startPathCommands[startPathCommands.length - 1].indexOf('C') === 0) {
                            startPathCommands.push('L ' + ((startPathCommands[startPathCommands.length - 1]).split(' ').slice(-3)).join(' '));
                        }
                        else if (startPathCommands[startPathCommands.length - 1].indexOf('L') === 0) {
                            const points: string[] = ((startPathCommands[startPathCommands.length - 1])).split(' ').slice(-3);
                            startPathCommands.push('C ' + points.join(' ') + points.join(' ') + points.join(' '));
                        }
                        else {
                            const points: string = (startPathCommands[startPathCommands.length - 1]).replace('M', '');
                            startPathCommands.push('C' + points + points + points);
                        }
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (series.removedPointIndex === series.points.length && endPathCommands.length !== startPathCommands.length) {
                        if (endPathCommands[endPathCommands.length - 1].indexOf('C') === 0) {
                            endPathCommands.push('L ' + ((endPathCommands[endPathCommands.length - 1]).split(' ').slice(-3)).join(' '));
                        }
                        else if (endPathCommands[endPathCommands.length - 1].indexOf('L') === 0) {
                            const points: string[] = ((endPathCommands[endPathCommands.length - 1])).split(' ').slice(-3);
                            endPathCommands.push('C ' + points.join(' ') + points.join(' ') + points.join(' '));
                        }
                        else {
                            const points: string = (endPathCommands[endPathCommands.length - 1]).replace('M', '');
                            endPathCommands.push('C' + points + points + points);
                        }
                    } else {
                        if (endPathCommands.length === 1) {
                            const points: string = (endPathCommands[endPathCommands.length - 1]).replace('M', '');
                            endPathCommands.push('C' + points + points + points);
                        }
                        else if (endPathCommands.length !== startPathCommands.length) {
                            endPathCommands.splice(1, 0, 'C ' + endPathCommands[0].split(' ').slice(-3).join(' ') + endPathCommands[0].split(' ').slice(-3).join(' ') + endPathCommands[0].split(' ').slice(-3).join(' '), endPathCommands[0].replace('M', 'L'));
                        }
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            } else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
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
         * Destroy method calling here.
         */
    }
}
