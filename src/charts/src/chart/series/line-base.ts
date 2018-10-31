import { Rect, PathOption, getAnimationFunction, ChartLocation, pathAnimation, getElement } from '../../common/utils/helper';
import { VisibleRangeModel } from '../axis/axis';
import { Series, Points } from './chart-series';
import { Chart } from '../chart';
import { AnimationModel } from '../../common/model/base-model';
import { Animation, AnimationOptions  } from '@syncfusion/ej2-base';


/**
 * Base for line type series.
 */

export class LineBase {

    public chart: Chart;
    private padding: number;
    /** @private */
    constructor(chartModule?: Chart) {
        this.chart = chartModule;
        this.padding = 5;
    }
    /**
     * To improve the chart performance.
     * @return {void}
     * @private
     */
    public improveChartPerformance(series: Series): Points[] {
        let tempPoints: Points[] = [];
        let xVisibleRange: VisibleRangeModel = series.xAxis.visibleRange;
        let yVisibleRange: VisibleRangeModel = series.yAxis.visibleRange;
        let seriesPoints: Points[] = <Points[]>series.points;
        let areaBounds: Rect = series.clipRect;
        let xTolerance: number = Math.abs(xVisibleRange.delta / areaBounds.width);
        let yTolerance: number = Math.abs(yVisibleRange.delta / areaBounds.height);
        let prevXValue: number = (seriesPoints[0] && seriesPoints[0].x > xTolerance) ? 0 : xTolerance;
        let prevYValue: number = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance;
        let xVal: number = 0;
        let yVal: number = 0;
        let currentPoint: Points;
        for (let currentPoint of seriesPoints) {
            currentPoint.symbolLocations = [];
            xVal = currentPoint.xValue ? currentPoint.xValue : xVisibleRange.min;
            yVal = currentPoint.yValue ? currentPoint.yValue : yVisibleRange.min;
            if (Math.abs(prevXValue - xVal) >= xTolerance || Math.abs(prevYValue - yVal) >= yTolerance) {
                tempPoints.push(currentPoint);
                prevXValue = xVal;
                prevYValue = yVal;
            }
        }
        return tempPoints;
    }
    /**
     * To generate the line path direction
     * @param firstPoint 
     * @param secondPoint 
     * @param series 
     * @param isInverted 
     * @param getPointLocation 
     * @param startPoint 
     */
    public getLineDirection(
        firstPoint: Points, secondPoint: Points, series: Series,
        isInverted: Boolean, getPointLocation: Function,
        startPoint: string
    ): string {
        let direction: string = '';
        if (firstPoint != null) {
            let point1: ChartLocation = getPointLocation(
                firstPoint.xValue, firstPoint.yValue, series.xAxis, series.yAxis, isInverted, series
            );
            let point2: ChartLocation = getPointLocation(
                secondPoint.xValue, secondPoint.yValue, series.xAxis, series.yAxis, isInverted, series
            );
            direction = startPoint + ' ' + (point1.x) + ' ' + (point1.y) + ' ' +
                'L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ';
        }
        return direction;

    }
    /**
     * To append the line path. 
     * @return {void}
     * @private
     */
    public appendLinePath(options: PathOption, series: Series, clipRect: string): void {
        let element: Element = getElement(options.id);
        let previousDirection: string = element ? element.getAttribute('d') : null;
        let htmlObject: HTMLElement = series.chart.renderer.drawPath(options) as HTMLElement;
        htmlObject.setAttribute('clip-path', clipRect);
        series.pathElement = htmlObject;
        series.seriesElement.appendChild(htmlObject);
        series.isRectSeries = false;
        pathAnimation(element, options.d, series.chart.redraw, previousDirection);
    }

    /**
     * To render the marker for the series. 
     * @return {void}
     * @private
     */
    public renderMarker(series: Series): void {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * To do the progressive animation. 
     * @return {void}
     * @private
     */
    public doProgressiveAnimation(series: Series, option: AnimationModel): void {
        let animation: Animation = new Animation({});
        let path: HTMLElement = <HTMLElement>series.pathElement;
        let strokeDashArray: string = path.getAttribute('stroke-dasharray');
        let pathLength: number = (<SVGPathElement>series.pathElement).getTotalLength();
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
            end: (model: AnimationOptions) => {
                path.setAttribute('stroke-dasharray', strokeDashArray);
                series.chart.trigger('animationComplete', { series: series });
            }
        });
    }
    /**
     * To store the symbol location and region
     * @param point 
     * @param series 
     * @param isInverted 
     * @param getLocation 
     */
    public storePointLocation(point: Points, series: Series, isInverted: boolean, getLocation: Function): void {
        let markerWidth: number = (series.marker && series.marker.width) ? series.marker.width : 0;
        let markerHeight: number = (series.marker && series.marker.height) ? series.marker.height : 0;
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
     * To do the linear animation. 
     * @return {void}   
     * @private
     */
    public doLinearAnimation(series: Series, animation: AnimationModel): void {
        let clipRect: HTMLElement = <HTMLElement>series.clipRectElement.childNodes[0].childNodes[0];
        let effect: Function = getAnimationFunction('Linear');
        let elementHeight: number = +clipRect.getAttribute('height');
        let elementWidth: number = +clipRect.getAttribute('width');
        let xCenter: number = +clipRect.getAttribute('x');
        let yCenter: number = series.chart.requireInvertedAxis ? +clipRect.getAttribute('height') + +clipRect.getAttribute('y') :
            +clipRect.getAttribute('y');
        let value: number;
        clipRect.style.visibility = 'hidden';
        new Animation({}).animate(clipRect, {
            duration: animation.duration,
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
            end: (model: AnimationOptions) => {
                clipRect.setAttribute('transform', 'translate(0,0)');
                series.chart.trigger('animationComplete', { series: series });
            }
        });
    }
}