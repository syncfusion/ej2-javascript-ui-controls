/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { getAnimationFunction, ChartLocation, pathAnimation, getElement } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { VisibleRangeModel, Axis } from '../axis/axis';
import { Series, Points } from './chart-series';
import { Chart } from '../chart';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';



/**
 * Base for line type series.
 */

export class LineBase {

    public chart: Chart;
    /** @private */
    constructor(chartModule?: Chart) {
        this.chart = chartModule;
    }
    /**
     * To improve the chart performance.
     *
     * @returns {void}
     * @private
     */
    public enableComplexProperty(series: Series): Points[] {
        const tempPoints: Points[] = [];
        const tempPoints2: Points[] = [];
        const xVisibleRange: VisibleRangeModel = series.xAxis.visibleRange;
        const yVisibleRange: VisibleRangeModel = series.yAxis.visibleRange;
        const seriesPoints: Points[] = <Points[]>series.points;
        const areaBounds: Rect = series.clipRect;
        const xTolerance: number = Math.abs(xVisibleRange.delta / areaBounds.width);
        const yTolerance: number = Math.abs(yVisibleRange.delta / areaBounds.height);
        let prevXValue: number = (seriesPoints[0] && seriesPoints[0].xValue > xTolerance) ? 0 : xTolerance;
        let prevYValue: number = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance;
        let xVal: number = 0;
        let yVal: number = 0;
        for (const currentPoint of seriesPoints) {
            currentPoint.symbolLocations = [];
            xVal = currentPoint.xValue ? currentPoint.xValue : xVisibleRange.min;
            yVal = currentPoint.yValue ? currentPoint.yValue : yVisibleRange.min;
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
     */
    public getLineDirection(
        firstPoint: Points, secondPoint: Points, series: Series,
        isInverted: Boolean, getPointLocation: Function,
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
     * To append the line path.
     *
     * @returns {void}
     * @private
     */
    public appendLinePath(options: PathOption, series: Series, clipRect: string): void {
        const element: Element = getElement(options.id);
        const chart: Chart = series.chart;
        const previousDirection: string = element ? element.getAttribute('d') : null;
        const htmlObject: HTMLElement =
            series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y])) as HTMLElement;
        if (htmlObject) {
            htmlObject.setAttribute('clip-path', clipRect);
        }
        series.pathElement = htmlObject;
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(htmlObject);
        }
        series.isRectSeries = false;
        pathAnimation(element, options.d, series.chart.redraw, previousDirection, chart.duration);
    }

    /**
     * To render the marker for the series.
     *
     * @returns {void}
     * @private
     */
    public renderMarker(series: Series): void {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * To do the progressive animation.
     *
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
            duration: option.duration,
            delay: option.delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    path.style.visibility = 'visible';
                    currentTime = Math.abs(Math.round(((args.timeStamp - args.delay) * pathLength) / args.duration));
                    path.setAttribute('stroke-dasharray', currentTime + ',' + pathLength);
                }
            },
            end: () => {
                path.setAttribute('stroke-dasharray', strokeDashArray);
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
     * To find point with in the visible range
     *
     * @param {Points} point point
     * @param {Axis} yAxis yAxis
     * @private
     */
    public withinYRange(point: Points, yAxis: Axis): boolean {
        return point.yValue >= yAxis.visibleRange.min && point.yValue <= yAxis.visibleRange.max;
    }

    /**
     * To get first and last visible points
     *
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
     * To Generate the area series border path direction from area series main direction path.
     * 
     *  @param {string} direction direction
     *
     * */
    public getBorderDirection(
        direction: string
    ): string{
        const coordinates: string [] = direction.split(' ');
        if (coordinates.length > 3 && !(this.chart.stackingAreaSeriesModule) && !(this.chart.stackingStepAreaSeriesModule)) {
            coordinates.splice(coordinates.length - 4, 3);
        }
        else if (this.chart.stackingAreaSeriesModule || this.chart.stackingStepAreaSeriesModule) {
            coordinates.splice(coordinates.length / 2 + 1, coordinates.length / 2 + 1);
            if (coordinates[coordinates.length - 1] === 'L') {
                coordinates.splice(coordinates.length - 1, 1);
            }
        }
        return coordinates.join(' ');
    } 

    /**
     * To remove empty point directions from series direction of area types.
     * 
     *  @param {string} borderDirection direction
     *
     * */
    public removeEmptyPointsBorder(
        borderDirection: string
    ): string {
        let startIndex: number = 0;
        const coordinates: string [] = borderDirection.split(' ');
        // eslint-disable-next-line @typescript-eslint/tslint/config
        let point;
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
     * To do the linear animation.
     *
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
        new Animation({}).animate(clipRect, {
            duration: duration,
            delay: animation.delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    clipRect.style.visibility = 'visible';
                    if (series.chart.requireInvertedAxis) {
                        value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(1,' + (value / elementHeight) + ') translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    } else {
                        value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(' + (value / elementWidth) + ', 1) translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                }
            },
            end: () => {
                clipRect.setAttribute('transform', 'translate(0,0)');
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        });
    }
}
