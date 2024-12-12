import { getAnimationFunction, ChartLocation, pathAnimation, getElement, animateAddPoints } from '../../common/utils/helper';
import { PathAttributes, PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Axis } from '../axis/axis';
import { Series, Points } from './chart-series';
import { Chart } from '../chart';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions, animationMode, isNullOrUndefined } from '@syncfusion/ej2-base';
import { StepPosition } from '../utils/enum';
import { VisibleRangeModel } from '../../common/model/interface';
import { TrendlineModel } from './chart-series-model';



/**
 * Base class for line-type series.
 * This class provides common properties and methods for line-type series in the chart.
 *
 * @private
 */

export class LineBase {

    public chart: Chart;
    private previousX: number;
    private previousY: number;
    /**
     * Initializes the tooltip module for the chart.
     *
     * @param {Chart} [chartModule] - The chart instance to which the tooltip module is initialized.
     */
    constructor(chartModule?: Chart) {
        this.chart = chartModule;
    }
    /**
     * Enhances the performance of the chart by enabling complex properties.
     *
     * @param {Series} series - The series for which complex properties are enabled.
     * @returns {Points[]} An array of points.
     * @private
     */
    public enableComplexProperty(series: Series): Points[] {
        const tempPoints: Points[] = [];
        const tempPoints2: Points[] = [];
        const xVisibleRange: VisibleRangeModel = series.xAxis.visibleRange;
        const yVisibleRange: VisibleRangeModel = series.yAxis.visibleRange;
        const seriesPoints: Points[] = <Points[]>series.points;
        const areaBounds: Rect = series.clipRect;
        const xTolerance: number = this.chart && this.chart.zoomRedraw && this.chart.redraw ? this.previousX :
            Math.abs(xVisibleRange.delta / areaBounds.width);
        const yTolerance: number = this.chart && this.chart.zoomRedraw && this.chart.redraw ? this.previousY :
            Math.abs(yVisibleRange.delta / areaBounds.height);
        let prevXValue: number = (seriesPoints[0] && seriesPoints[0].xValue > xTolerance) ? 0 : xTolerance;
        let prevYValue: number = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance;
        this.previousX = xTolerance;
        this.previousY = yTolerance;
        let xVal: number = 0;
        let yVal: number = 0;
        for (const currentPoint of seriesPoints) {
            currentPoint.symbolLocations = [];
            xVal = !isNullOrUndefined(currentPoint.xValue) ? currentPoint.xValue : xVisibleRange.min;
            yVal = !isNullOrUndefined(currentPoint.yValue) ? currentPoint.yValue : yVisibleRange.min;
            if (Math.abs(prevXValue - xVal) >= xTolerance || Math.abs(prevYValue - yVal) >= yTolerance) {
                tempPoints.push(currentPoint);
                prevXValue = xVal;
                prevYValue = yVal;
            }
        }
        let tempPoint: Points;
        for (let i: number = 0; i < tempPoints.length; i++) {
            tempPoint = tempPoints[i as number];
            if (isNullOrUndefined(tempPoint.x) || (series.category === 'Indicator' && (isNaN(tempPoint.xValue) || isNaN(tempPoint.yValue)))) {
                continue;
            } else {
                tempPoints2.push(tempPoint);
            }
        }
        return tempPoints2;
    }
    /**
     * To generate the line path direction.
     *
     * @param {Points} firstPoint firstPoint
     * @param {Points} secondPoint secondPoint
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getPointLocation getPointLocation
     * @param {string} startPoint startPoint
     * @returns {string} get line path direction
     * @private
     */
    public getLineDirection(
        firstPoint: Points, secondPoint: Points, series: Series,
        isInverted: boolean, getPointLocation: Function,
        startPoint: string
    ): string {
        let direction: string = '';
        if (firstPoint != null) {
            const point1: ChartLocation = getPointLocation(
                firstPoint.xValue, firstPoint.yValue, series.xAxis, series.yAxis, isInverted, series
            );
            const point2: ChartLocation = getPointLocation(
                secondPoint.xValue, secondPoint.yValue, series.xAxis, series.yAxis, isInverted, series
            );

            direction = startPoint + ' ' + (point1.x) + ' ' + (point1.y) + ' ' +
                'L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ';
        }
        return direction;

    }
    /**
     * Appends a line path to the chart.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clipping rectangle for the path.
     * @returns {void}
     * @private
     */
    public appendLinePath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; chart: Chart } =
            this.appendPathElement(options, series, clipRect);
        pathAnimation(points.element, options.d, series.chart.redraw, points.previousDirection, points.chart.duration);
    }

    public appendPathElement(options: PathOption | PathAttributes, series: Series, clipRect: string): {
        element: Element, previousDirection: string, chart: Chart
    } {
        const element: Element = getElement(options.id);
        const chart: Chart = series.chart;
        const previousDirection: string = element ? element.getAttribute('d') : null;
        const htmlObject: HTMLElement =
            series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y])) as HTMLElement;
        if (htmlObject) {
            htmlObject.setAttribute('clip-path', clipRect);
        }
        if (series.category === 'TrendLine' && htmlObject) {
            const trendline: TrendlineModel = chart.series[series.sourceIndex].trendlines[series.index];
            if (!trendline.marker.visible) {
                htmlObject.setAttribute('tabindex', trendline.accessibility.focusable ? String(trendline.accessibility.tabIndex) : '-1');
            }
            htmlObject.setAttribute('role', trendline.accessibility.accessibilityRole ? trendline.accessibility.accessibilityRole : '');
            htmlObject.setAttribute('aria-label', trendline.accessibility.accessibilityDescription ? trendline.accessibility.accessibilityDescription : '');
        }
        series.pathElement = htmlObject;
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(htmlObject);
        }
        series.isRectSeries = false;
        return { element, previousDirection, chart };
    }
    /**
     * Adds a line path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @returns {void}
     * @private
     */
    public addPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; chart: Chart } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.push((startPathCommands[startPathCommands.length - 1]).replace('M', 'L'));
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        if (series.removedPointIndex === series.points.length) {
                            endPathCommands.push((endPathCommands[endPathCommands.length - 1]).replace('M', 'L'));
                        }
                        else {
                            endPathCommands.splice(1, 0, endPathCommands[0].replace('M', 'L'));
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
     * Adds a area path to equate the start and end paths.
     *
     * @param {PathOption} options - The options for the path.
     * @param {Series} series - The series to which the path belongs.
     * @param {string} clipRect - The clip rectangle for the path.
     * @returns {void}
     * @private
     */
    public addAreaPath(options: PathOption, series: Series, clipRect: string): void {
        const points: { element: Element; previousDirection: string; chart: Chart } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection !== '' && options.d !== '') {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (minLength < endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        if (endPathCommands.length !== startPathCommands.length) {
                            if (startPathCommands.length === 1) {
                                startPathCommands.push(startPathCommands[startPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].replace('M', 'L'));
                            } else {
                                startPathCommands.splice(startPathCommands.length - 1, 0, startPathCommands[startPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)]);
                            }
                        }
                    }
                }
                animateAddPoints(points.element, options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            } else if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        if (series.removedPointIndex === series.points.length) {
                            if (endPathCommands.length === 1) {
                                endPathCommands.push(endPathCommands[endPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)].replace('M', 'L'));
                            } else {
                                endPathCommands.splice(endPathCommands.length - 1, 0, endPathCommands[endPathCommands.length - (options.id.indexOf('border') !== -1 ? 1 : 2)]);
                            }
                        }
                        else {
                            endPathCommands.splice(1, 0, endPathCommands[1] ? endPathCommands[1] : endPathCommands[0]);
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
     * To render the marker for the series.
     *
     * @param {Series} series - The series for which markers are rendered.
     * @returns {void}
     * @private
     */
    public renderMarker(series: Series): void {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * Executes progressive animation for the series.
     *
     * @param {Series} series - The series for which progressive animation is executed.
     * @param {AnimationModel} option - The animation option.
     * @returns {void}
     * @private
     */
    public doProgressiveAnimation(series: Series, option: AnimationModel): void {
        const animation: Animation = new Animation({});
        const path: HTMLElement = <HTMLElement>series.pathElement;
        const strokeDashArray: string = path.getAttribute('stroke-dasharray');
        const pathLength: number = (<SVGPathElement>series.pathElement).getTotalLength();
        let currentTime: number;
        path.style.visibility = 'hidden';
        animation.animate(path, {
            duration: (option.duration === 0 && animationMode === 'Enable') ? 1000 : option.duration,
            delay: option.delay,
            progress: (args: AnimationOptions): void => {
                path.style.visibility = 'visible';
                currentTime = Math.abs(Math.round(((args.timeStamp) * pathLength) / args.duration));
                path.setAttribute('stroke-dasharray', currentTime + ',' + pathLength);
            },
            end: () => {
                const annotations: HTMLElement = <HTMLElement>getElement(series.chart.element.id + '_Annotation_Collections');
                if (annotations) {
                    annotations.style.visibility = 'visible';
                }
                path.setAttribute('stroke-dasharray', strokeDashArray);
                path.style.visibility = '';
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        });
    }
    /**
     * To store the symbol location and region.
     *
     * @param {Points} point point
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getLocation getLocation
     * @returns {void}
     * @private
     */
    public storePointLocation(point: Points, series: Series, isInverted: boolean, getLocation: Function): void {
        const markerWidth: number = (series.marker && series.marker.width) ? series.marker.width : 0;
        const markerHeight: number = (series.marker && series.marker.height) ? series.marker.height : 0;
        point.symbolLocations.push(
            getLocation(
                point.xValue, point.yValue,
                series.xAxis, series.yAxis, isInverted, series
            )
        );
        point.regions.push(
            new Rect(
                point.symbolLocations[0].x - markerWidth,
                point.symbolLocations[0].y - markerHeight,
                2 * markerWidth,
                2 * markerHeight
            )
        );
    }
    /**
     * Checks if the y-value of a point falls within the y-axis range.
     *
     * @param {Points} point - The point to be checked.
     * @param {Axis} yAxis - The y-axis.
     * @returns {boolean} - Returns true if the y-value falls within the y-axis range, otherwise false.
     * @private
     */
    public withinYRange(point: Points, yAxis: Axis): boolean {
        return point.yValue >= yAxis.visibleRange.min && point.yValue <= yAxis.visibleRange.max;
    }

    public GetStepLineDirection(currentPoint: ChartLocation, previousPoint: ChartLocation, stepLineType: StepPosition, command: string = 'L', series: Series, isBorder?: boolean): string {
        const X: string = (series.noRisers && isBorder) ? ' M ' : ' L ';
        if (stepLineType === 'Right') {
            command = (series.noRisers && isBorder) ? 'M' : 'L';
            return (command + ' ' +
                (previousPoint.x) + ' ' + (currentPoint.y) + ' L ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
        }
        else if (stepLineType === 'Center') {
            const centerX: number = previousPoint.x + (currentPoint.x - previousPoint.x) / 2;
            return (command + ' ' +
                (centerX) + ' ' + (previousPoint.y) + X + (centerX) + ' ' + (currentPoint.y) + ' L ' + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
        }
        else {
            return (command + ' ' +
                (currentPoint.x) + ' ' + (previousPoint.y) + X + (currentPoint.x) + ' ' + (currentPoint.y) + ' ');
        }
    }

    /**
     * Gets the first and last visible points from a collection of points.
     *
     * @param {Points[]} points - Collection of points.
     * @returns {{ first: Points, last: Points }} - Returns an object containing the first and last visible points.
     * @private
     */
    public getFirstLastVisiblePoint(points: Points[]): { first: Points, last: Points } {
        let first: Points = null; let last: Points = null;
        for (const point of points) {
            if (first === null && point.visible) {
                first = last = point;
            }
            last = point.visible ? point : last;
        }
        return { first: first ? first : points[0], last: last ? last : points[points.length - 1] };
    }

    /**
     * Gets the border direction based on the provided direction.
     *
     * @param {string} direction - The direction string.
     * @returns {string} - Returns the border direction.
     * @private
     */
    public getBorderDirection(
        direction: string
    ): string {
        const coordinates: string[] = direction.split(' ');
        if (coordinates.length > 3 && !(this.chart.stackingAreaSeriesModule) && !(this.chart.stackingStepAreaSeriesModule)) {
            coordinates.splice(coordinates.length - 4, 3);
        }
        else if (this.chart.stackingAreaSeriesModule || this.chart.stackingStepAreaSeriesModule) {
            coordinates.splice(coordinates.length / 2 + 1, coordinates.length / 2 + 1);
            if (coordinates[coordinates.length - 1] === 'L' || coordinates[coordinates.length - 1] === 'M') {
                coordinates.splice(coordinates.length - 1, 1);
            }
        }
        return coordinates.join(' ');
    }

    /**
     * Removes the border from the empty points based on the provided border direction.
     *
     * @param {string} borderDirection - The border direction.
     * @returns {string} - Returns the updated border direction.
     * @private
     */
    public removeEmptyPointsBorder(
        borderDirection: string
    ): string {
        let startIndex: number = 0;
        const coordinates: string[] = borderDirection.split(' ');
        let point: number;
        if (coordinates.length === 4) {
            return coordinates.join(' ');
        }
        do {
            point = coordinates.indexOf('M', startIndex);
            if (point > -1) {
                coordinates.splice(point + 1, 3);
                startIndex = point + 1;
                if (point - 6 > 0) {
                    coordinates.splice(point - 6, 6);
                    startIndex -= 6;
                }
            }
        } while (point !== -1);

        return coordinates.join(' ');
    }

    /**
     * Performs linear animation for the series based on the provided animation model.
     *
     * @param {Series} series - The series to animate.
     * @param {AnimationModel} animation - The animation model containing animation details.
     * @returns {void}
     * @private
     */
    public doLinearAnimation(series: Series, animation: AnimationModel): void {
        const clipRect: HTMLElement = <HTMLElement>series.clipRectElement.childNodes[0].childNodes[0];
        const duration: number = series.chart.animated ? series.chart.duration : animation.duration;
        const effect: Function = getAnimationFunction('Linear');
        const elementHeight: number = +clipRect.getAttribute('height');
        const elementWidth: number = +clipRect.getAttribute('width');
        const xCenter: number = +clipRect.getAttribute('x');
        const yCenter: number = series.chart.requireInvertedAxis ? +clipRect.getAttribute('height') + +clipRect.getAttribute('y') :
            +clipRect.getAttribute('y');
        let value: number;
        clipRect.style.visibility = 'hidden';
        this.animateRect(series, animation, clipRect, duration, effect, elementHeight, elementWidth, xCenter, yCenter, value);
        if (series.marker && series.marker.visible && series.symbolElement) {
            const markerClipRect: HTMLElement = <HTMLElement>series.symbolElement.childNodes[0].childNodes[0];
            markerClipRect.style.visibility = 'hidden';
            this.animateRect(series, animation, markerClipRect, duration, effect, elementHeight, elementWidth, xCenter, yCenter, value);
        }
    }

    /**
     * Animates the given clip rectangle with the specified animation parameters.
     *
     * @param {Series} series - The series to which the clip rectangle belongs.
     * @param {AnimationModel} animation - The animation model containing animation details.
     * @param {HTMLElement} clipRect - The clip rectangle to animate.
     * @param {number} duration - The duration of the animation.
     * @param {Function} effect - The animation function to use.
     * @param {number} elementHeight - The height of the clip rectangle element.
     * @param {number} elementWidth - The width of the clip rectangle element.
     * @param {number} xCenter - The x-coordinate of the clip rectangle's center.
     * @param {number} yCenter - The y-coordinate of the clip rectangle's center.
     * @param {number} value - The animation value.
     * @returns {void}
     */
    private animateRect(series: Series, animation: AnimationModel, clipRect: HTMLElement, duration: number, effect: Function,
                        elementHeight: number, elementWidth: number, xCenter: number, yCenter: number, value: number): void
    {
        new Animation({}).animate(clipRect, {
            duration: (duration === 0 && animationMode === 'Enable') ? 1000 : duration,
            delay: animation.delay,
            progress: (args: AnimationOptions): void => {
                clipRect.style.visibility = 'visible';
                if (series.chart.requireInvertedAxis) {
                    value = effect(args.timeStamp, 0, elementHeight, args.duration);
                    clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                        ') scale(1,' + (value / elementHeight) + ') translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                } else {
                    value = effect(args.timeStamp, 0, elementWidth, args.duration);
                    clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                        ') scale(' + (value / elementWidth) + ', 1) translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                }
            },
            end: () => {
                const annotations: HTMLElement = <HTMLElement>getElement(series.chart.element.id + '_Annotation_Collections');
                if (annotations) {
                    annotations.style.visibility = 'visible';
                }
                clipRect.setAttribute('transform', 'translate(0,0)');
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        });
    }
}
