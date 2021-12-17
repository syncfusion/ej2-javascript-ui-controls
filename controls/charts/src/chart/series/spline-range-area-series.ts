/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange, getPoint, ChartLocation } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Series, Points } from './chart-series';
import { SplineBase } from './spline-base'
import { AnimationModel } from '../../common/model/base-model';
import { Axis } from '../axis/axis';

/**
 * `SplineRangeAreaSeries` module is used to render the range area series.
 */

export class SplineRangeAreaSeries extends SplineBase {
    /**
     * Render SplineRangeArea Series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series, xAxis: Axis, yAxis: Axis, inverted: boolean): void {
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
        realPoint = this.filterEmptyPoints(series);
        
        for (let i: number = 0; i < realPoint.length; i++) {
            point = realPoint[i];
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
            point = visiblePoint[i];
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
                withInRange(visiblePoint[previous], point, visiblePoint[next], series)) {
                    if (firstPoint) {
                        highControlPt1 = series.drawPoints[previous].controlPoint1;
                        highControlPt2 = series.drawPoints[previous].controlPoint2;
                        pt = getPoint(point.xValue, point.high > point.low ? (point.high as number) : (point.low as number), xAxis, yAxis, inverted);
                        betweenPt1 = getPoint(highControlPt1.x, highControlPt1.y, xAxis, yAxis, inverted);
                        betweenPt2 = getPoint(highControlPt2.x, highControlPt2.y, xAxis, yAxis, inverted);
                        direction = direction.concat('C ' + betweenPt1.x + ' '
                            + betweenPt1.y + ' ' + betweenPt2.x + ' ' + betweenPt2.y + ' ' + pt.x + ' ' + pt.y + ' ');
                    } else {
                        if (yAxis.isAxisInverse) {
                            direction = direction.concat('M ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ' + 'L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ');
                        } else {
                            direction = direction.concat('M ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ' + 'L ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ');
                        }
                        closed = false;
                    }
                    if ((i + 1 < visiblePoint.length && !visiblePoint[i + 1].visible)
                        || i === visiblePoint.length - 1) {
                        // Path to connect the low points
                        direction = this.closeSplineRangeAreaPath(visiblePoint, point, series, direction, i, xAxis, yAxis, inverted);
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
            series.border.width, series.border.color, series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    }

    /**
     * path for rendering the low points in SplineRangeArea
     *
     * @returns {void}.
     * @private
     */

    protected closeSplineRangeAreaPath( visiblePoint: Points[], point: Points, series: Series, direction: string,
        i: number, xAxis: Axis, yAxis: Axis, inverted: boolean): string {
        let firstPoint: Points = null
        let pt: ChartLocation;
        let betweenPt1: ChartLocation;
        let betweenPt2: ChartLocation;
        let lowControlPt1: ChartLocation;
        let lowControlPt2: ChartLocation;
        for (let j: number = i; j > 0; j--) {
            if (visiblePoint[j].visible) {
                point = visiblePoint[j];
                let low: number = Math.min(<number>point.low, <number>point.high);
                let high: number = Math.max(<number>point.low, <number>point.high);
                
                if (yAxis.isAxisInverse) {
                const temp: number = low;
                low = high;
                high = temp;
                }
                
                const lowPtCoordinate: ChartLocation = getPoint(point.xValue, low, xAxis, yAxis, inverted);
                const highPtCoordinate : ChartLocation = getPoint(point.xValue, high, xAxis, yAxis, inverted);
                if(firstPoint){
                lowControlPt1 = series.lowDrawPoints[j].controlPoint1;
                lowControlPt2 = series.lowDrawPoints[j].controlPoint2;
                pt = getPoint(point.xValue, point.low < point.high ? (point.low as number) : (point.high as number), xAxis, yAxis, inverted);
                betweenPt1 = getPoint(lowControlPt1.x, lowControlPt1.y, xAxis, yAxis, inverted);
                betweenPt2 = getPoint(lowControlPt2.x, lowControlPt2.y, xAxis, yAxis, inverted);
                direction = direction.concat('C ' + betweenPt2.x + ' '
                            + betweenPt2.y + ' ' + betweenPt1.x + ' ' + betweenPt1.y + ' ' + pt.x + ' ' + pt.y + ' ');
                }
                else {
                    if (yAxis.isAxisInverse){
                        direction = direction.concat('L ' + (highPtCoordinate.x) + ' ' + (highPtCoordinate.y) + ' ' );
                    } else {
                        direction = direction.concat('L ' + (lowPtCoordinate.x) + ' ' + (lowPtCoordinate.y) + ' ' );
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
     */

    protected getModuleName(): string {
        /**
         * Returns the module name of the series
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
         * Destroys range area series
         */
    }
}
