import { ChartLocation, getPoint, withInRange, TransformToVisible, animateAddPoints } from '../../common/utils/helper';
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
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} isInverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated.
     * @returns {void}
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, isInverted: boolean, pointAnimate: boolean, pointUpdate?: boolean): void {
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
        this[pointAnimate ? 'addPath' : 'appendLinePath'](
            new PathOption(
                series.chart.element.id + '_Series_' + series.index,
                series.interior, 0, 'transparent',
                series.opacity, series.dashArray, direction
            ), series, '');

        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            emptyPointDirection = this.removeEmptyPointsBorder(this.getBorderDirection(direction));
            this[pointAnimate ? 'addPath' : 'appendLinePath'](
                new PathOption(
                    series.chart.element.id + '_Series_border_' + series.index,
                    'transparent', series.border.width, series.border.color ? series.border.color : series.interior,
                    1, series.dashArray, emptyPointDirection
                ),
                series, ''
            );
        }
        if (!pointUpdate) {this.renderMarker(series); }
    }

    /**
     * To animate point for spline area series.
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
     * Adds a area path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @param {ChartLocation[]} [firstSymbol] - The location of the first symbol.
     * @returns {void}
     */
    public addPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            if (points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g).length === 2) {
                points.previousDirection = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g)[0] + 'L ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2]
                    + ' C ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2] + ' ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2] + ' ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2]
                    + ' L ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2];
            }
            if ((options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g).length === 2) {
                options.d = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g)[0] + 'L ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2]
                    + ' C ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2] + ' ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2] + ' ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2]
                    + ' L ' + points.previousDirection.split(' ')[1] + ' ' + points.previousDirection.split(' ')[2];
            }
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        let lastPointBeforeCurve: string;
                        if ((startPathCommands[startPathCommands.length - 1]).split(' ').length === 4 && options.id.indexOf('border') !== -1) {
                            lastPointBeforeCurve = startPathCommands[startPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].split(' ').slice(1).join(' ');
                        }
                        else {
                            lastPointBeforeCurve = startPathCommands[startPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].split(' ').slice(5).join(' ');
                        }

                        const curveCommand: string = 'C ' + lastPointBeforeCurve + lastPointBeforeCurve + lastPointBeforeCurve;
                        if (options.id.indexOf('border') !== -1) {
                            startPathCommands.push(curveCommand);
                        }
                        else {
                            startPathCommands.splice(startPathCommands.length - 1, 0, curveCommand);
                        }
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            }
            else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        let firstPointBeforeCurve: string;
                        if (series.removedPointIndex === series.points.length) {
                            if ((startPathCommands[startPathCommands.length - 1]).split(' ').length === 4 && options.id.indexOf('border') !== -1) {
                                firstPointBeforeCurve = endPathCommands[endPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].split(' ').slice(1).join(' ');
                            }
                            else {
                                firstPointBeforeCurve = endPathCommands[endPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].split(' ').slice(5).join(' ');
                            }
                            var curveCommand = 'C ' + firstPointBeforeCurve + firstPointBeforeCurve + firstPointBeforeCurve;
                            if (options.id.indexOf('border') !== -1) {
                                endPathCommands.push(curveCommand);
                            }
                            else {
                                endPathCommands.splice(endPathCommands.length - 1, 0, curveCommand);
                            }
                        } else {
                            if ((startPathCommands[startPathCommands.length - 1]).split(' ').length === 4) {
                                firstPointBeforeCurve = 'C ' + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(-3).join(' ') + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(1).join(' ') + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(1).join(' ');
                            }
                            else {
                                firstPointBeforeCurve = 'C ' + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(-3).join(' ') + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(-3).join(' ') + endPathCommands[options.id.indexOf('border') !== -1 ? 0 : 1].split(' ').slice(-3).join(' ');
                            }
                            endPathCommands.splice((options.id.indexOf('border') !== -1 ? 1 : 2), 0, firstPointBeforeCurve);
                        }
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            }
            else {
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
         * Destroy method calling here.
         */
    }
}
