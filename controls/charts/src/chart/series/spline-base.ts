import { ChartLocation, ControlPoints } from '../../common/utils/helper';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { IntervalType } from '../../chart/utils/enum';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';

/**
 * render Line series
 */

export class SplineBase extends LineBase {

    private splinePoints: number[] = [];
    /** @private */
    constructor(chartModule?: Chart) {
        super(chartModule);
    }

    /**
     * To find the control points for spline. 
     * @return {void}
     * @private
     */
    public findSplinePoint(series: Series): void {
        let value: ControlPoints;
        let points: Points[] = this.filterEmptyPoints(series);
        this.splinePoints = this.findSplineCoefficients(points, series);
        if (points.length > 1) {
            series.drawPoints = [];
            for (let point of points) {
                if (point.index !== 0) {
                    let previous: number = this.getPreviousIndex(points, point.index - 1, series);
                    value = this.getControlPoints(
                        points[previous], point, this.splinePoints[previous],
                        this.splinePoints[point.index], series
                    );
                    series.drawPoints.push(value);
                    if (point.yValue && value.controlPoint1.y && value.controlPoint2.y) {
                        series.yMin = Math.floor(Math.min(series.yMin, point.yValue, value.controlPoint1.y, value.controlPoint2.y));
                        series.yMax = Math.ceil(Math.max(series.yMax, point.yValue, value.controlPoint1.y, value.controlPoint2.y));
                    }
                }
            }
        }
    }
    protected getPreviousIndex(points: Points[], i: number, series: Series): number {
        if (series.emptyPointSettings.mode !== 'Drop') {
            return i;
        }
        while (isNullOrUndefined(points[i]) && i > -1) {
            i = i - 1;
        }
        return i;
    }
    public getNextIndex(points: Points[], i: number, series: Series): number {
        if (series.emptyPointSettings.mode !== 'Drop') {
            return i;
        }
        while (isNullOrUndefined(points[i]) && i < points.length) {
            i = i + 1;
        }
        return i;
    }
    public filterEmptyPoints(series: Series): Points[] {
        if (series.emptyPointSettings.mode !== 'Drop') {
            return series.points;
        }
        let points: Points[] = extend([], series.points, null, true) as Points[];
        for (let i: number = 0; i < points.length; i++) {
            points[i].index = i;
            if (points[i].isEmpty) {
                points[i].symbolLocations = [];
                points[i].regions = [];
                points.splice(i, 1);
                i--;
            }
        }
        return points;
    }
    /**
     * To find the natural spline. 
     * @return {void}
     * @private
     */
    public findSplineCoefficients(points: Points[], series: Series): number[] {
        let count: number = points.length;
        let ySpline: number[] = [];
        let ySplineDuplicate: number[] = [];
        let coefficient1: number;
        let coefficient2: number;
        let coefficient3: number;
        let dy1: number;
        let dy2: number;
        let dx: number[] = [];
        let dy: number[] = [];
        let slope: number[] = [];
        let interPoint: number;
        let slopeLength: number;
        let cardinalSplineTension: number = series.cardinalSplineTension ? series.cardinalSplineTension : 0.5;
        cardinalSplineTension = cardinalSplineTension < 0 ? 0 : cardinalSplineTension > 1 ? 1 : cardinalSplineTension;
        switch (series.splineType) {
            case 'Monotonic':
                for (let i: number = 0; i < count - 1; i++) {
                    dx[i] = points[i + 1].xValue - points[i].xValue;
                    dy[i] = points[i + 1].yValue - points[i].yValue;
                    slope[i] = dy[i] / dx[i];
                }
                //interpolant points
                slopeLength = slope.length;
                // to find the first and last co-efficient value
                ySpline[0] = slope[0];
                ySpline[count - 1] = slope[slopeLength - 1];
                //to find the other co-efficient values
                for (let j: number = 0; j < dx.length; j++) {
                    if (slopeLength > j + 1) {
                        if (slope[j] * slope[j + 1] <= 0) {
                            ySpline[j + 1] = 0;
                        } else {
                            interPoint = dx[j] + dx[j + 1];
                            ySpline[j + 1] = 3 * interPoint / ((interPoint + dx[j + 1]) / slope[j] + (interPoint + dx[j]) / slope[j + 1]);
                        }
                    }
                }
                break;

            case 'Cardinal':
                for (let i: number = 0; i < count; i++) {
                    if (i === 0) {
                        ySpline[i] = (count > 2) ? (cardinalSplineTension * (points[i + 2].xValue - points[i].xValue)) : 0;
                    } else if (i === (count - 1)) {
                        ySpline[i] = (count > 2) ? (cardinalSplineTension * (points[count - 1].xValue - points[count - 3].xValue)) : 0;
                    } else {
                        ySpline[i] = (cardinalSplineTension * (points[i + 1].xValue - points[i - 1].xValue));
                    }
                }
                break;
            default:
                if (series.splineType === 'Clamped') {
                    let firstIndex: number = (points[1].yValue - points[0].yValue) / (points[1].xValue - points[0].xValue);
                    let lastIndex: number = (points[count - 1].xValue - points[count - 2].xValue) /
                        (points[count - 1].yValue - points[count - 2].yValue);
                    ySpline[0] = (3 * (points[1].yValue - points[0].yValue)) / (points[1].xValue - points[0].xValue) - 3;
                    ySplineDuplicate[0] = 0.5;
                    ySpline[points.length - 1] = (3 * (points[points.length - 1].yValue - points[points.length - 2].yValue)) /
                        (points[points.length - 1].xValue - points[points.length - 2].xValue);
                    ySpline[0] = ySplineDuplicate[0] = Math.abs(ySpline[0]) === Infinity ? 0 : ySpline[0];
                    ySpline[points.length - 1] = ySplineDuplicate[points.length - 1] = Math.abs(ySpline[points.length - 1]) === Infinity ?
                        0 : ySpline[points.length - 1];

                } else {
                    // assigning the first and last value as zero
                    ySpline[0] = ySplineDuplicate[0] = 0;
                    ySpline[points.length - 1] = 0;
                }
                for (let i: number = 1; i < count - 1; i++) {
                    coefficient1 = points[i].xValue - points[i - 1].xValue;
                    coefficient2 = points[i + 1].xValue - points[i - 1].xValue;
                    coefficient3 = points[i + 1].xValue - points[i].xValue;
                    dy1 = points[i + 1].yValue - points[i].yValue || null;
                    dy2 = points[i].yValue - points[i - 1].yValue || null;

                    if (coefficient1 === 0 || coefficient2 === 0 || coefficient3 === 0) {
                        ySpline[i] = 0;
                        ySplineDuplicate[i] = 0;
                    } else {
                        let p: number = 1 / (coefficient1 * ySpline[i - 1] + 2 * coefficient2);
                        ySpline[i] = -p * coefficient3;
                        ySplineDuplicate[i] = p * (6 * (dy1 / coefficient3 - dy2 / coefficient1) - coefficient1 * ySplineDuplicate[i - 1]);
                    }
                }
                for (let k: number = count - 2; k >= 0; k--) {
                    ySpline[k] = ySpline[k] * ySpline[k + 1] + ySplineDuplicate[k];
                }
                break;
        }

        return ySpline;
    }
    /**
     * To find the control points for spline. 
     * @return {void}
     * @private
     */
    public getControlPoints(point1: Points, point2: Points, ySpline1: number, ySpline2: number, series: Series): ControlPoints {
        let controlPoint1: ChartLocation;
        let controlPoint2: ChartLocation;
        let point: ControlPoints;
        let ySplineDuplicate1: number = ySpline1;
        let ySplineDuplicate2: number = ySpline2;
        switch (series.splineType) {
            case 'Cardinal':
                if (series.xAxis.valueType === 'DateTime') {
                    ySplineDuplicate1 = ySpline1 / this.dateTimeInterval(series);
                    ySplineDuplicate2 = ySpline2 / this.dateTimeInterval(series);
                }
                controlPoint1 = new ChartLocation(point1.xValue + ySpline1 / 3, point1.yValue + ySplineDuplicate1 / 3);
                controlPoint2 = new ChartLocation(point2.xValue - ySpline2 / 3, point2.yValue - ySplineDuplicate2 / 3);
                point = new ControlPoints(controlPoint1, controlPoint2);
                break;

            case 'Monotonic':
                let value: number = (point2.xValue - point1.xValue) / 3;
                controlPoint1 = new ChartLocation(point1.xValue + value, point1.yValue + ySpline1 * value);
                controlPoint2 = new ChartLocation(point2.xValue - value, point2.yValue - ySpline2 * value);
                point = new ControlPoints(controlPoint1, controlPoint2);
                break;

            default:
                let one3: number = 1 / 3.0;
                let deltaX2: number = (point2.xValue - point1.xValue);
                deltaX2 = deltaX2 * deltaX2;
                let y1: number = one3 * (((2 * point1.yValue) + point2.yValue) - one3 * deltaX2 * (ySpline1 + 0.5 * ySpline2));
                let y2: number = one3 * ((point1.yValue + (2 * point2.yValue)) - one3 * deltaX2 * (0.5 * ySpline1 + ySpline2));

                controlPoint1 = new ChartLocation((2 * (point1.xValue) + (point2.xValue)) * one3, y1);
                controlPoint2 = new ChartLocation(((point1.xValue) + 2 * (point2.xValue)) * one3, y2);
                point = new ControlPoints(controlPoint1, controlPoint2);
                break;
        }
        return point;
    }

    /**
     * calculate datetime interval in hours 
     * 
     */
    protected dateTimeInterval(series: Series): number {
        let interval: IntervalType = series.xAxis.actualIntervalType;
        let intervalInMilliseconds: number;
        if (interval === 'Years') {
            intervalInMilliseconds = 365 * 24 * 60 * 60 * 1000;
        } else if (interval === 'Months') {
            intervalInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        } else if (interval === 'Days') {
            intervalInMilliseconds = 24 * 60 * 60 * 1000;
        } else if (interval === 'Hours') {
            intervalInMilliseconds = 60 * 60 * 1000;
        } else if (interval === 'Minutes') {
            intervalInMilliseconds = 60 * 1000;
        } else if (interval === 'Seconds') {
            intervalInMilliseconds = 1000;
        } else {
            intervalInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        }
        return intervalInMilliseconds;
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    public doAnimation(series: Series): void {
        let option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }
}