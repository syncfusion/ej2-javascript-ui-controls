import { ChartLocation, ControlPoints } from '../../common/utils/helper';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { IntervalType } from '../../common/utils/enum';
import { LineBase } from './line-base';
import { AnimationModel } from '../../common/model/base-model';

/**
 * render Line series
 */

export class SplineBase extends LineBase {

    private splinePoints: number[] = [];
    private lowSplinePoints: number[] = [];
    /**
     * Initializes the spline rendering module.
     *
     * @param {Chart} [chartModule] - Specifies the chart instance.
     */
    constructor(chartModule?: Chart) {
        super(chartModule);
    }

    /**
     * Finds the spline points for the series.
     *
     * @param {Series} series - The series for which spline points need to be found.
     * @returns {void}
     */
    public findSplinePoint(series: Series): void {
        let value: ControlPoints;
        let lowPoints: ControlPoints;
        let realPoints: Points[] = [];
        const points: Points[] = [];
        let point: Points;
        let pointIndex: number = 0; let negativePoint: boolean = false;
        realPoints = this.filterEmptyPoints(series);
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
        let isLow: boolean = false;
        this.splinePoints = this.findSplineCoefficients(points, series, isLow);
        if (series.type === 'SplineRangeArea'){
            isLow = !isLow;
            this.lowSplinePoints = this.findSplineCoefficients(points, series, isLow);
        }
        if (points.length > 1) {
            series.drawPoints = [];
            series.lowDrawPoints = [];
            for (const point of points) {
                negativePoint = negativePoint ? negativePoint : point.yValue < 0;
                if (point.index !== 0) {
                    const previous: number = this.getPreviousIndex(points, point.index - 1, series);
                    if (series.type === 'SplineRangeArea') {
                        points[previous as number].yValue = points[previous as number].high > points[previous as number].low ?
                            (points[previous as number].high as number) : (points[previous as number].low as number);
                        point.yValue = point.high > point.low ? (point.high as number) : (point.low as number);
                    }
                    value = this.getControlPoints(
                        points[previous as number], point, this.splinePoints[previous as number],
                        this.splinePoints[point.index], series
                    );
                    series.drawPoints.push(value);
                    if (series.type === 'SplineRangeArea'){
                        points[previous as number].yValue = points[previous as number].low < points[previous as number].high ?
                            (points[previous as number].low as number) : (points[previous as number].high as number);
                        point.yValue = point.low < point.high ? (point.low as number) : (point.high as number);
                        lowPoints = this.getControlPoints(
                            points[previous as number], point, this.lowSplinePoints[previous as number],
                            this.lowSplinePoints[point.index], series
                        );
                        series.lowDrawPoints.push(lowPoints);
                    }
                    // fix for Y-Axis of Spline chart not adjusting scale to suit dataSource issue
                    const delta: number = series.yMax - series.yMin;
                    if (point.yValue && value.controlPoint1.y && value.controlPoint2.y && delta > 1) {
                        series.yMin = Math.min(series.yMin, point.yValue, value.controlPoint1.y, value.controlPoint2.y);
                        series.yMax = Math.ceil(Math.max(series.yMax, point.yValue, value.controlPoint1.y, value.controlPoint2.y));
                        series.yMin = series.yAxis.valueType !== 'Logarithmic' ? Math.floor(series.yMin) : series.yMin;
                    }
                }
            }
            if (!negativePoint && series.yMin < 0) { series.yMin = 0; }
            if (series.chart.chartAreaType === 'PolarRadar' && series.isClosed) {
                value = this.getControlPoints(
                    { xValue: points[points.length - 1].xValue, yValue: points[points.length - 1].yValue } as Points,
                    { xValue: points[points.length - 1].xValue + 1, yValue: points[0].yValue } as Points,
                    this.splinePoints[0], this.splinePoints[points[points.length - 1].index], series);
                series.drawPoints.push(value);
            }
        }
    }
    protected getPreviousIndex(points: Points[], i: number, series: Series): number {
        if (series.emptyPointSettings.mode !== 'Drop') {
            return i;
        }
        while (isNullOrUndefined(points[i as number]) && i > -1) {
            i = i - 1;
        }
        return i;
    }
    public getNextIndex(points: Points[], i: number, series: Series): number {
        if (series.emptyPointSettings.mode !== 'Drop') {
            return i;
        }
        while (isNullOrUndefined(points[i as number]) && i < points.length) {
            i = i + 1;
        }
        return i;
    }
    public filterEmptyPoints(series: Series, seriesPoints?: Points[]): Points[] {
        if (series.emptyPointSettings.mode !== 'Drop' && this.isPointInRange(series.points)) {
            return seriesPoints ? seriesPoints : series.points;
        }
        const points: Points[] = seriesPoints ? seriesPoints : extend([], series.points, null, true) as Points[];
        for (let i: number = 0; i < points.length; i++) {
            points[i as number].index = i;
            if (points[i as number].isEmpty) {
                points[i as number].symbolLocations = [];
                points[i as number].regions = [];
                points.splice(i, 1);
                i--;
            }
        }
        return points;
    }
    /**
     * Checks if the data points are within the range.
     *
     * @param {Points[]} points - The data points to check.
     * @returns {boolean} True if the data points are within the range, false otherwise.
     */
    public isPointInRange(points: Points[]): boolean {
        for (const point of points) {
            if (!point.isPointInRange) {
                return false;
            }
        }
        return true;
    }
    /**
     * Finds the spline coefficients based on the type of spline interpolation.
     *
     * @param {Points[]} points - The data points for spline interpolation.
     * @param {Series} series - The series associated with the data points.
     * @param {boolean} [isLow] - Indicates whether to calculate the lower bound. Default is false.
     * @returns {number[]} The calculated coefficients.
     * @private
     */
    public findSplineCoefficients(points: Points[], series: Series, isLow?: boolean): number[] {
        let ySpline: number[] = [];
        const ySplineDuplicate: number[] = [];
        let cardinalSplineTension: number = series.cardinalSplineTension ? series.cardinalSplineTension : 0.5;
        // cardinalSplineTension = cardinalSplineTension < 0 ? 0 : cardinalSplineTension > 1 ? 1 : cardinalSplineTension;
        if (cardinalSplineTension < 0) {
            cardinalSplineTension = 0;
        }
        else if (cardinalSplineTension > 1) {
            cardinalSplineTension = 1;
        }
        switch (series.splineType) {
        case 'Monotonic':
            ySpline = this.monotonicSplineCoefficients(points, series, isLow);
            break;

        case 'Cardinal':
            ySpline = this.cardinalSplineCofficients(points, series);
            break;
        default:
            if (series.splineType === 'Clamped') {
                ySpline = this.clampedSplineCofficients(points, series, isLow);
            } else {
                // assigning the first and last value as zero
                ySpline[0] = ySplineDuplicate[0] = 0;
                ySpline[points.length - 1] = 0;
            }
            ySpline = this.naturalSplineCoefficients(points, series, isLow);
            break;
        }
        return ySpline;
    }
    /**
     * Calculates the coefficients for a monotonic spline interpolation.
     *
     * @param {Points[]} points - The data points for spline interpolation.
     * @param {Series} series - The series associated with the data points.
     * @param {boolean} isLow - Indicates whether to calculate the lower bound.
     * @returns {number[]} The calculated coefficients.
     * @private
     */
    private monotonicSplineCoefficients(points: Points[], series: Series, isLow: boolean): number[] {
        const count: number = points.length;
        const ySpline: number[] = [];
        const dx: number[] = [];
        const dy: number[] = [];
        const slope: number[] = [];
        let interPoint: number;
        for (let i: number = 0; i < count - 1; i++) {
            if (series.type === 'SplineRangeArea') {
                if (!isLow) {
                    points[i + 1].yValue = points[i + 1].high > points[i + 1].low ?
                        (points[i + 1].high as number) : (points[i + 1].low as number);
                    points[i as number ].yValue = points[i as number].high > points[i as number].low ?
                        (points[i as number].high as number) : (points[i as number].low as number);
                }
                if (isLow) {
                    points[i + 1].yValue = points[i + 1].low < points[i + 1].high ? (points[i + 1].low as number) :
                        (points[i + 1].high as number);
                    points[i as number].yValue = points[i as number].low < points[i as number].high ? (points[i as number].low as number) :
                        (points[i as number].high as number);
                }
            }
            dx[i as number] = points[i + 1].xValue - points[i as number].xValue;
            dy[i as number] = points[i + 1].yValue - points[i as number].yValue;
            slope[i as number] = dy[i as number] / dx[i as number];
        }
        //interpolant points
        const slopeLength: number = slope.length;
        // to find the first and last co-efficient value
        ySpline[0] = slope[0];
        ySpline[count - 1] = slope[slopeLength - 1];
        //to find the other co-efficient values
        for (let j: number = 0; j < dx.length; j++) {
            if (slopeLength > j + 1) {
                if (slope[j as number] * slope[j + 1] <= 0) {
                    ySpline[j + 1] = 0;
                } else {
                    interPoint = dx[j as number] + dx[j + 1];
                    ySpline[j + 1] = 3 * interPoint / ((interPoint + dx[j + 1]) / slope[j as number] +
                    (interPoint + dx[j as number]) / slope[j + 1]);
                }
            }
        }
        return ySpline;
    }

    /**
     * Calculates the coefficients for a cardinal spline interpolation.
     *
     * @param {Points[]} points - The data points for spline interpolation.
     * @param {Series} series - The series associated with the data points.
     * @returns {number[]} The calculated coefficients.
     * @private
     */
    private cardinalSplineCofficients(points: Points[], series: Series): number[] {
        const count: number = points.length;
        const ySpline: number[] = [];
        let cardinalSplineTension: number = series.cardinalSplineTension ? series.cardinalSplineTension : 0.5;
        cardinalSplineTension = cardinalSplineTension < 0 ? 0 : cardinalSplineTension > 1 ? 1 : cardinalSplineTension;
        for (let i: number = 0; i < count; i++) {
            if (i === 0) {
                ySpline[i as number] = (count > 2) ? (cardinalSplineTension * (points[i + 2].xValue - points[i as number].xValue)) : 0;
            } else if (i === (count - 1)) {
                ySpline[i as number] = (count > 2) ? (cardinalSplineTension * (points[count - 1].xValue - points[count - 3].xValue)) : 0;
            } else {
                ySpline[i as number] = (cardinalSplineTension * (points[i + 1].xValue - points[i - 1].xValue));
            }
        }
        return ySpline;
    }

    /**
     * Calculates the coefficients for a clamped spline interpolation.
     *
     * @param {Points[]} points - The data points for spline interpolation.
     * @param {Series} series - The series associated with the data points.
     * @param {boolean} isLow - Indicates whether to calculate the lower bound.
     * @returns {number[]} The calculated coefficients.
     * @private
     */
    private clampedSplineCofficients(points: Points[], series: Series, isLow: boolean): number[] {
        const count: number = points.length;
        const ySpline: number[] = [];
        const ySplineDuplicate: number[] = [];
        for (let i: number = 0; i < count - 1; i++) {
            if (series.type === 'SplineRangeArea') {
                if (!isLow) {
                    points[1].yValue = points[1].high > points[1].low ? (points[1].high as number) : (points[1].low as number);
                    points[0].yValue = points[0].high > points[0].low ? (points[0].high as number) : (points[0].low as number);
                    points[points.length - 1].yValue = points[points.length - 1].high > points[points.length - 1].low ?
                        (points[points.length - 1].high as number) : (points[points.length - 1].low as number);
                    points[points.length - 2].yValue = points[points.length - 2].high > points[points.length - 2].low ?
                        (points[points.length - 2].high as number) : (points[points.length - 2].low as number);
                }
                if (isLow) {
                    points[1].yValue = points[1].low < points[1].high ? (points[1].low as number) : (points[1].high as number);
                    points[0].yValue = points[0].low < points[0].high ? (points[0].low as number) : (points[0].high as number);
                    points[points.length - 1].yValue = points[points.length - 1].low < points[points.length - 1].high ?
                        (points[points.length - 1].low as number) : (points[points.length - 1].high as number);
                    points[points.length - 2].yValue = points[points.length - 2].low < points[points.length - 2].high ?
                        (points[points.length - 2].low as number) : (points[points.length - 2].high as number);
                }
            }
            ySpline[0] = (3 * (points[1].yValue - points[0].yValue)) / (points[1].xValue - points[0].xValue) - 3;
            ySplineDuplicate[0] = 0.5;
            ySpline[points.length - 1] = (3 * (points[points.length - 1].yValue - points[points.length - 2].yValue)) /
                (points[points.length - 1].xValue - points[points.length - 2].xValue);
            ySpline[0] = ySplineDuplicate[0] = Math.abs(ySpline[0]) === Infinity ? 0 : ySpline[0];
            ySpline[points.length - 1] = ySplineDuplicate[points.length - 1] = Math.abs(ySpline[points.length - 1]) === Infinity ?
                0 : ySpline[points.length - 1];
        }
        return ySpline;
    }

    /**
     * Calculates the coefficients for a natural spline interpolation.
     *
     * @param {Points[]} points - The data points for spline interpolation.
     * @param {Series} series - The series associated with the data points.
     * @param {boolean} isLow - Indicates whether to calculate the lower bound.
     * @returns {number[]} The calculated coefficients.
     * @private
     */
    private naturalSplineCoefficients(points: Points[], series: Series, isLow: boolean): number[] {
        const count: number = points.length;
        const ySpline: number[] = [];
        const ySplineDuplicate: number[] = [];
        let dy1: number;
        let dy2: number;
        let coefficient1: number;
        let coefficient2: number;
        let coefficient3: number;
        ySpline[0] = ySplineDuplicate[0] = 0;
        ySpline[points.length - 1] = 0;
        for (let i: number = 1; i < count - 1; i++) {
            if (series.type === 'SplineRangeArea'){
                if (!isLow){
                    points[i + 1].yValue = points[i + 1].low > points[i + 1].high ? (points[i + 1].low as number) :
                        (points[i + 1].high as number);
                    points[i as number].yValue = points[i as number].low > points[i as number].high ? (points[i as number].low as number) :
                        (points[i as number].high as number);
                    points[i - 1].yValue = points[i - 1].low > points[i - 1].high ? (points[i - 1].low as number) :
                        (points[i - 1].high as number);
                }
                if (isLow){
                    points[i + 1].yValue = points[i + 1].high < points[i + 1].low ? (points[i + 1].high as number) :
                        (points[i + 1].low as number);
                    points[i as number].yValue = points[i as number].high < points[i as number].low ? (points[i as number].high as number) :
                        (points[i as number].low as number);
                    points[i - 1].yValue = points[i - 1].high < points[i - 1].low ? (points[i - 1].high as number) :
                        (points[i - 1].low as number);
                }
            }
            coefficient1 = points[i as number].xValue - points[i - 1].xValue;
            coefficient2 = points[i + 1].xValue - points[i - 1].xValue;
            coefficient3 = points[i + 1].xValue - points[i as number].xValue;
            dy1 = points[i + 1].yValue - points[i as number].yValue || null;
            dy2 = points[i as number].yValue - points[i - 1].yValue || null;

            if (coefficient1 === 0 || coefficient2 === 0 || coefficient3 === 0) {
                ySpline[i as number] = 0;
                ySplineDuplicate[i as number] = 0;
            } else {
                const p: number = 1 / (coefficient1 * ySpline[i - 1] + 2 * coefficient2);
                ySpline[i as number] = -p * coefficient3;
                ySplineDuplicate[i as number] = p * (6 * (dy1 / coefficient3 - dy2 / coefficient1) - coefficient1 *
                ySplineDuplicate[i - 1]);
            }
        }
        for (let k: number = count - 2; k >= 0; k--) {
            ySpline[k as number] = ySpline[k as number] * ySpline[k + 1] + ySplineDuplicate[k as number];
        }
        return ySpline;
    }
    /**
     * Calculates the control points for a spline segment.
     *
     * @param {Points} point1 - The first data point.
     * @param {Points} point2 - The second data point.
     * @param {number} ySpline1 - The Y-value of the first spline point.
     * @param {number} ySpline2 - The Y-value of the second spline point.
     * @param {Series} series - The series associated with the data points.
     * @returns {ControlPoints} The calculated control points.
     * @public
     */
    public getControlPoints(point1: Points, point2: Points, ySpline1: number, ySpline2: number, series: Series): ControlPoints {
        let controlPoint1: ChartLocation;
        let controlPoint2: ChartLocation;
        let point: ControlPoints;
        let ySplineDuplicate1: number = ySpline1;
        let ySplineDuplicate2: number = ySpline2;
        const xValue1: number = point1.xValue;
        const yValue1: number = point1.yValue;
        const xValue2: number = point2.xValue;
        const yValue2: number = point2.yValue;
        switch (series.splineType) {
        case 'Cardinal':
            if (series.xAxis.valueType === 'DateTime') {
                ySplineDuplicate1 = ySpline1 / this.dateTimeInterval(series);
                ySplineDuplicate2 = ySpline2 / this.dateTimeInterval(series);
            }
            controlPoint1 = new ChartLocation(xValue1 + ySpline1 / 3, yValue1 + ySplineDuplicate1 / 3);
            controlPoint2 = new ChartLocation(xValue2 - ySpline2 / 3, yValue2 - ySplineDuplicate2 / 3);
            point = new ControlPoints(controlPoint1, controlPoint2);
            break;
        case 'Monotonic': {
            const value: number = (xValue2 - xValue1) / 3;
            controlPoint1 = new ChartLocation(xValue1 + value, yValue1 + ySpline1 * value);
            controlPoint2 = new ChartLocation(xValue2 - value, yValue2 - ySpline2 * value);
            point = new ControlPoints(controlPoint1, controlPoint2);
            break;
        }
        default: {
            const one3: number = 1 / 3.0;
            let deltaX2: number = (xValue2 - xValue1);
            deltaX2 = deltaX2 * deltaX2;
            const y1: number = one3 * (((2 * yValue1) + yValue2) - one3 * deltaX2 * (ySpline1 + 0.5 * ySpline2));
            const y2: number = one3 * ((yValue1 + (2 * yValue2)) - one3 * deltaX2 * (0.5 * ySpline1 + ySpline2));
            controlPoint1 = new ChartLocation((2 * (xValue1) + (xValue2)) * one3, y1);
            controlPoint2 = new ChartLocation(((xValue1) + 2 * (xValue2)) * one3, y2);
            point = new ControlPoints(controlPoint1, controlPoint2);
            break;
        }
        }
        return point;
    }
    /**
     * Calculates the date-time interval.
     *
     * @param {Series} series - The series for which the date-time interval needs to be calculated.
     * @returns {number} The calculated date-time interval.
     * @protected
     */
    protected dateTimeInterval(series: Series): number {
        const interval: IntervalType = series.xAxis.actualIntervalType;
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
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     */
    public doAnimation(series: Series): void {
        const option: AnimationModel = series.animation;
        this.doLinearAnimation(series, option);
    }
}
