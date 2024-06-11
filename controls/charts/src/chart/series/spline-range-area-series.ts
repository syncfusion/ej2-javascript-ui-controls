import { withInRange, getPoint, ChartLocation, animateAddPoints } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base';
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../axis/axis';

/**
 * `SplineRangeAreaSeries` module is used to render the range area series.
 */

export class SplineRangeAreaSeries extends SplineBase {

    public borderDirection : string = '';
    /**
     * Render SplineRangeArea Series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {Axis} xAxis - The x-axis of the chart.
     * @param {Axis} yAxis - The y-axis of the chart.
     * @param {boolean} inverted - Specifies whether the chart is inverted.
     * @param {boolean} pointAnimate - Specifies whether the point has to be animated or not.
     * @param {boolean} pointUpdate - Specifies whether the point has to be updated or not.
     * @returns {void}
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean, pointAnimate?: boolean, pointUpdate?: boolean): void {
        let point: Points;
        let direction: string = '';
        let closed: boolean = undefined;
        let firstPoint: Points = null;
        let pt: ChartLocation;
        let betweenPt1: ChartLocation;
        let betweenPt2: ChartLocation;
        let highControlPt1: ChartLocation;
        let highControlPt2: ChartLocation;
        let realPoint: Points[] = [];
        const points: Points[] = [];
        let Index: number = 0;
        const borderWidth: number = series.border.width ? series.border.width : 0;
        const borderColor: string = series.border.color ? series.border.color : series.interior;
        let lastPoint: string = '';
        realPoint = this.filterEmptyPoints(series);

        for (let i: number = 0; i < realPoint.length; i++) {
            point = realPoint[i as number];
            if (point.x === null || point.x === '') {
                continue;
            } else {
                point.index = Index;
                Index++;
                points.push(point);
            }
        }

        let previous: number;
        let next: number;
        const visiblePoint: Points[] = this.enableComplexProperty(series);
        const length: number = visiblePoint.length;
        for (let i: number = 0; i < length; i++) {
            point = visiblePoint[i as number];
            point.regions = [];
            point.symbolLocations = [];
            next = this.getNextIndex(points, point.index - 1, series);
            previous = this.getPreviousIndex(points, point.index - 1, series);
            let lowPoint: number = Math.min(<number>point.low, <number>point.high);
            let highPoint: number = Math.max(<number>point.low, <number>point.high);

            if (yAxis.isAxisInverse) {
                const temp: number = lowPoint;
                lowPoint = highPoint;
                highPoint = temp;
            }

            const lowPtCoordinate: ChartLocation = getPoint(point.xValue, lowPoint, xAxis, yAxis, inverted);
            const highPtCoordinate: ChartLocation = getPoint(point.xValue, highPoint, xAxis, yAxis, inverted);
            point.symbolLocations.push(highPtCoordinate);
            point.symbolLocations.push(lowPtCoordinate);
            const rect1: Rect = new Rect(
                Math.min(lowPtCoordinate.x, highPtCoordinate.x), Math.min(lowPtCoordinate.y, highPtCoordinate.y),
                Math.max(Math.abs(highPtCoordinate.x - lowPtCoordinate.x), series.marker.width),
                Math.max(Math.abs(highPtCoordinate.y - lowPtCoordinate.y), series.marker.width));

            if (!inverted) {
                rect1.x -= series.marker.width / 2;
            } else {
                rect1.y -= series.marker.width / 2;
            }
            point.regions.push(rect1);

            //Path to connect the high points
            if (point.visible &&
                withInRange(visiblePoint[previous as number], point, visiblePoint[next as number], series)) {
                if (firstPoint) {
                    highControlPt1 = series.drawPoints[previous as number].controlPoint1;
                    highControlPt2 = series.drawPoints[previous as number].controlPoint2;
                    pt = getPoint(point.xValue, point.high > point.low ? (point.high as number) : (point.low as number),
                                  xAxis, yAxis, inverted);
                    betweenPt1 = getPoint(highControlPt1.x, highControlPt1.y, xAxis, yAxis, inverted);
                    betweenPt2 = getPoint(highControlPt2.x, highControlPt2.y, xAxis, yAxis, inverted);
                    direction = direction.concat('C ' + betweenPt1.x + ' '
                        + betweenPt1.y + ' ' + betweenPt2.x + ' ' + betweenPt2.y + ' ' + pt.x + ' ' + pt.y + ' ');
                    this.borderDirection += 'C ' + betweenPt1.x + ' '
                        + betweenPt1.y + ' ' + betweenPt2.x + ' ' + betweenPt2.y + ' ' + pt.x + ' ' + pt.y + ' ';
                } else {
                    if (yAxis.isAxisInverse) {
                        direction = direction.concat('M ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ' + 'L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ');
                        this.borderDirection += 'M ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ';
                        lastPoint = 'L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y);
                    } else {
                        direction = direction.concat('M ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ' + 'L ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ');
                        this.borderDirection += 'M ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ';
                        lastPoint = 'L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y);
                    }
                    closed = false;
                }
                if ((i + 1 < visiblePoint.length && !visiblePoint[i + 1].visible)
                    || i === visiblePoint.length - 1) {
                    // Path to connect the low points
                    direction = this.closeSplineRangeAreaPath(visiblePoint, point, series, direction, i, xAxis, yAxis, inverted);
                    this.borderDirection += lastPoint;
                    lastPoint = '';
                    direction = direction.concat(' ' + 'Z');
                    closed = true;
                }
                firstPoint = point;
            } else {
                if (closed === false && i !== 0) {
                    direction = this.closeSplineRangeAreaPath(visiblePoint, point, series, direction, i, xAxis, yAxis, inverted);
                    closed = true;
                }
                firstPoint = null;
                point.symbolLocations = [];
            }
        }
        const name1: string = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.chart.element.id + '_Series_' + series.index;

        const options: PathOption = new PathOption(
            name1, series.interior,
            0, 'transparent', series.opacity, series.dashArray, direction);
        this[pointAnimate ? 'addPath' : 'appendLinePath'](options, series, '');
        /**
         * To draw border for the path directions of area
         */
        if (series.border.width !== 0) {
            this[pointAnimate ? 'addPath' : 'appendLinePath'](new PathOption(
                series.chart.element.id + '_Series_border_' + series.index, 'transparent',
                borderWidth, borderColor, 1, series.dashArray,
                this.borderDirection
            ), series, '');
            this.borderDirection = '';
        }
        if (!pointUpdate) {this.renderMarker(series); }
    }

    /**
     * path for rendering the low points in SplineRangeArea
     *
     * @returns {void}.
     * @private
     */

    protected closeSplineRangeAreaPath( visiblePoint: Points[], point: Points, series: Series, direction: string,
                                        i: number, xAxis: Axis, yAxis: Axis, inverted: boolean): string {
        let firstPoint: Points = null;
        let pt: ChartLocation;
        let betweenPt1: ChartLocation;
        let betweenPt2: ChartLocation;
        let lowControlPt1: ChartLocation;
        let lowControlPt2: ChartLocation;
        for (let j: number = i; j > 0; j--) {
            if (visiblePoint[j as number].visible) {
                point = visiblePoint[j as number];
                let low: number = Math.min(<number>point.low, <number>point.high);
                let high: number = Math.max(<number>point.low, <number>point.high);

                if (yAxis.isAxisInverse) {
                    const temp: number = low;
                    low = high;
                    high = temp;
                }

                const lowPtCoordinate: ChartLocation = getPoint(point.xValue, low, xAxis, yAxis, inverted);
                const highPtCoordinate : ChartLocation = getPoint(point.xValue, high, xAxis, yAxis, inverted);
                if (firstPoint){
                    lowControlPt1 = series.lowDrawPoints[j as number].controlPoint1;
                    lowControlPt2 = series.lowDrawPoints[j as number].controlPoint2;
                    pt = getPoint(point.xValue, point.low < point.high ? (point.low as number) : (point.high as number),
                                  xAxis, yAxis, inverted);
                    betweenPt1 = getPoint(lowControlPt1.x, lowControlPt1.y, xAxis, yAxis, inverted);
                    betweenPt2 = getPoint(lowControlPt2.x, lowControlPt2.y, xAxis, yAxis, inverted);
                    direction = direction.concat('C ' + betweenPt2.x + ' '
                            + betweenPt2.y + ' ' + betweenPt1.x + ' ' + betweenPt1.y + ' ' + pt.x + ' ' + pt.y + ' ');
                    this.borderDirection += 'C ' + betweenPt2.x + ' '
                    + betweenPt2.y + ' ' + betweenPt1.x + ' ' + betweenPt1.y + ' ' + pt.x + ' ' + pt.y + ' ';
                }
                else {
                    if (yAxis.isAxisInverse){
                        direction = direction.concat('L ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ' );
                        this.borderDirection += 'M ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ';
                    } else {
                        direction = direction.concat('L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ' );
                        this.borderDirection += 'M ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ';
                    }
                }
            } else {
                break;
            }
            firstPoint = point;
        }
        return direction;
    }

    /**
     * To animate point for spline range area series.
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
     * @returns {void}
     */
    public addPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = startPathCommands.length; i < endPathCommands.length; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.splice(((startPathCommands.length) / 2) + 1, 0, 'C ' + ((startPathCommands[(startPathCommands.length - 1) / 2].split(' ')).slice(5, 7)).join(' ') + ' ' + ((startPathCommands[(startPathCommands.length - 1) / 2].split(' ')).slice(5, 7)).join(' ') + ' ' + ((startPathCommands[(startPathCommands.length - 1) / 2].split(' ')).slice(5, 7)).join(' '));
                        startPathCommands.splice((startPathCommands.length / 2) + 2, 0, 'C ' + (startPathCommands[(startPathCommands.length / 2) + 1].split(' ')).slice(1, 3).join(' ') + ' ' + (startPathCommands[(startPathCommands.length / 2) + 1].split(' ')).slice(1, 3).join(' ') + ' ' + (startPathCommands[(startPathCommands.length / 2) + 1].split(' ')).slice(1, 3).join(' '));
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(2, 0, 'C ' + endPathCommands[1].split(' ').slice(-3).join(' ') + endPathCommands[1].split(' ').slice(-3).join(' ') + endPathCommands[1].split(' ').slice(-3).join(' '));
                        endPathCommands.splice(endPathCommands.length - 1, 0, 'C ' + endPathCommands[endPathCommands.length - 2].split(' ').slice(-4).join(' ') + endPathCommands[endPathCommands.length - 2].split(' ').slice(-4).join(' ') + endPathCommands[endPathCommands.length - 2].split(' ').slice(-4).join(' '));
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, points.previousDirection, this.chart.duration, options.d);
            } else {
                animateAddPoints(points.element, options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
        }
    }
    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
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
        return 'SplineRangeAreaSeries';
    }

    /**
     * To destroy the line series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys range area series.
         */
    }
}
