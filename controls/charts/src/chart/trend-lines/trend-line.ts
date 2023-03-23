/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Series, Points, Trendline } from '../series/chart-series';
import { TrendlineTypes } from '../../chart/utils/enum';
import { findClipRect, RectOption } from '../../common/utils/helper';
import { Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * `Trendline` module is used to render 6 types of trendlines in chart.
 */
export class Trendlines {
    /**
     * Defines the collection of series, that are used to represent a trendline
     *
     * @private
     */
    public initSeriesCollection(trendline: Trendline, chart: Chart): void {
        const trendLineSeries: Series = new Series(trendline, 'targetSeries', {}, true);
        if (trendline.type === 'Linear' || trendline.type === 'MovingAverage') {
            trendLineSeries.type = 'Line';
        } else {
            trendLineSeries.type = 'Spline';
        }
        this.setSeriesProperties(
            trendLineSeries, trendline, trendline.type,
            trendline.fill, trendline.width, chart);
    }

    /**
     * Initializes the properties of the trendline series
     */
    private setSeriesProperties(
        series: Series, trendline: Trendline, name: string, fill: string,
        width: number, chart: Chart): void {
        series.name = trendline.name;
        series.xName = 'x';
        series.yName = 'y';
        series.fill = fill || 'blue';
        series.width = width;
        series.dashArray = trendline.dashArray;
        series.clipRectElement = trendline.clipRectElement;
        series.points = [];
        series.enableTooltip = trendline.enableTooltip;
        series.index = trendline.index;
        series.sourceIndex = trendline.sourceIndex;
        series.interior = series.fill;
        series.animation = trendline.animation;
        series.legendShape = 'HorizontalLine';
        series.marker = trendline.marker;
        series.category = 'TrendLine';
        series.chart = chart;
        series.xMin = Infinity; series.xMax = -Infinity;
        series.yMin = Infinity; series.yMax = -Infinity;
        series.xData = [];
        series.yData = [];
        trendline.targetSeries = series;
        if (chart.isBlazor) {
            trendline.targetSeries.border = {}; // To avoid console error in blazor
            trendline.targetSeries.connector = {}; // To avoid console error in blazor
        }
    }

    /**
     * Creates the elements of a trendline
     */
    private createTrendLineElements(
        chart: Chart, trendline: Trendline, index: number, element: Element, clipRectElement: Element): void {
        trendline.trendLineElement = element;
        trendline.targetSeries.clipRectElement = clipRectElement;
        trendline.targetSeries.seriesElement = element;
        if (chart.trendLineElements) {
            chart.trendLineElements.appendChild(trendline.trendLineElement);
        }
    }

    /**
     * Defines the data point of trendline
     */
    private getDataPoint(
        x: Object, y: Object, series: Series, index: number
    ): Points {
        const trendPoint: Points = new Points();
        trendPoint.x = series.xAxis.valueType === 'DateTime' ? new Date(Number(x)) : x;
        trendPoint.y = y;
        trendPoint.xValue = Number(x);
        trendPoint.color = series.fill;
        trendPoint.index = index;
        trendPoint.yValue = Number(y);
        trendPoint.visible = true;
        series.xMin = Math.min(series.xMin, trendPoint.xValue);
        series.yMin = Math.min(series.yMin, trendPoint.yValue);
        series.xMax = Math.max(series.xMax, trendPoint.xValue);
        series.yMax = Math.max(series.yMax, trendPoint.yValue);
        series.xData.push(trendPoint.xValue);
        return trendPoint;
    }

    /**
     * Finds the slope and intercept of trendline
     */
    private findSlopeIntercept(xValues: number[], yValues: number[], trendline: Trendline, points: Points[]): SlopeIntercept {
        let xAvg: number = 0; let yAvg: number = 0;
        let xyAvg: number = 0;
        let xxAvg: number = 0;
        let index: number = 0; let slope: number = 0; let intercept: number = 0;
        while (index < points.length) {
        // To fix trendline not rendered issue while Nan Value is provided for y values.
            if (isNaN(yValues[index as number])) {
                yValues[index as number] = ((yValues[index - 1] + yValues[index + 1]) / 2);
            }
            xAvg += xValues[index as number];
            yAvg += yValues[index as number];
            xyAvg += xValues[index as number] * yValues[index as number];
            xxAvg += xValues[index as number] * xValues[index as number];
            index++;
        }
        const type: TrendlineTypes = trendline.type;
        if (trendline.intercept && (type === 'Linear' || type === 'Exponential' )) {
            intercept = trendline.intercept;
            switch (type) {
            case 'Linear':
                slope = ((xyAvg) - (trendline.intercept * xAvg)) / xxAvg;
                break;
            case 'Exponential':
                slope = ((xyAvg) - (Math.log(Math.abs(trendline.intercept)) * xAvg)) / xxAvg;
                break;
            }
        } else {
            slope = ((points.length * xyAvg) - (xAvg * yAvg)) / ((points.length * xxAvg) - (xAvg * xAvg));
            slope = (type === 'Linear' ? slope : Math.abs(slope));
            if (type === 'Exponential' || type === 'Power') {
                intercept = Math.exp((yAvg - (slope * xAvg)) / points.length);
            } else {
                intercept = (yAvg - (slope * xAvg)) / points.length;
            }
        }
        return { slope: slope, intercept: intercept };
    }

    /**
     * Defines the points to draw the trendlines.
     */
    public initDataSource(trendline: Trendline): void {
        const points: Points[] = trendline.points;
        if (points && points.length) {
            //prepare data
            const trendlineSeries: Series = trendline.targetSeries;
            switch (trendline.type) {
            case 'Linear':
                this.setLinearRange(points, trendline, trendlineSeries);
                break;
            case 'Exponential':
                this.setExponentialRange(points, trendline, trendlineSeries);
                break;
            case 'MovingAverage':
                this.setMovingAverageRange(points, trendline, trendlineSeries);
                break;
            case 'Polynomial':
                this.setPolynomialRange(points, trendline, trendlineSeries);
                break;
            case 'Power':
                this.setPowerRange(points, trendline, trendlineSeries);
                break;
            case 'Logarithmic':
                this.setLogarithmicRange(points, trendline, trendlineSeries);
                break;
            }
            if (trendline.type !== 'Linear' && trendline.type !== 'MovingAverage') {
                trendlineSeries.chart.splineSeriesModule.findSplinePoint(trendlineSeries);
            }
        }
    }

    /**
     * Calculation of exponential points
     */
    private setExponentialRange(points: Points[], trendline: Trendline, series: Series): void {
        const xValue: number[] = [];
        const yValue: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            const yDataValue: number = point.yValue ? Math.log(point.yValue) : 0;
            xValue.push(point.xValue);
            yValue.push(yDataValue);
            index++;
        }
        const slopeIntercept: SlopeIntercept = this.findSlopeIntercept(xValue, yValue, trendline, points);
        series.points = this.getExponentialPoints(trendline, points, xValue, yValue, series, slopeIntercept);
    }

    /**
     * Calculation of logarithmic points
     */
    private setLogarithmicRange(points: Points[], trendline: Trendline, series: Series): void {
        const xLogValue: number[] = [];
        const yLogValue: number[] = [];
        const xPointsLgr: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            const xDataValue: number = point.xValue ? Math.log(point.xValue) : 0;
            xPointsLgr.push(point.xValue);
            xLogValue.push(xDataValue);
            yLogValue.push(point.yValue);
            index++;
        }
        const slopeIntercept: SlopeIntercept = this.findSlopeIntercept(xLogValue, yLogValue, trendline, points);
        series.points = this.getLogarithmicPoints(trendline, points, xPointsLgr, yLogValue, series, slopeIntercept);
    }

    /**
     * Calculation of polynomial points
     */
    private setPolynomialRange(points: Points[], trendline: Trendline, series: Series): void {
        const xPolyValues: number[] = [];
        const yPolyValues: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            xPolyValues.push(point.xValue);
            yPolyValues.push(point.yValue);
            index++;
        }
        series.points = this.getPolynomialPoints(trendline, points, xPolyValues, yPolyValues, series);
    }

    /**
     * Calculation of power points
     */
    private setPowerRange(points: Points[], trendline: Trendline, series: Series): void {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const powerPoints: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            const xDataValue: number = point.xValue ? Math.log(point.xValue) : 0;
            const yDataValue: number = point.yValue ? Math.log(point.yValue) : 0;
            powerPoints.push(point.xValue);
            xValues.push(xDataValue);
            yValues.push(yDataValue);
            index++;
        }
        const slopeIntercept: SlopeIntercept = this.findSlopeIntercept(xValues, yValues, trendline, points);
        series.points = this.getPowerPoints(trendline, points, powerPoints, yValues, series, slopeIntercept);
    }

    /**
     * Calculation of linear points
     */
    private setLinearRange(points: Points[], trendline: Trendline, series: Series): void {
        const xValues: number[] = [];
        const yValues: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            xValues.push(point.xValue);
            yValues.push(point.yValue);
            index++;
        }
        const slopeIntercept: SlopeIntercept = this.findSlopeIntercept(xValues, yValues, trendline, points);
        series.points = this.getLinearPoints(trendline, points, xValues, yValues, series, slopeIntercept);
    }

    /**
     * Calculation of moving average points
     */
    private setMovingAverageRange(points: Points[], trendline: Trendline, series: Series): void {
        const xValues: number[] = [];
        const yValues: number[] = [];
        const xAvgValues: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            const point: Points = points[index as number];
            xAvgValues.push(point.xValue);
            xValues.push(index + 1);
            yValues.push(point.yValue);
            index++;
        }
        series.points = this.getMovingAveragePoints(trendline, points, xAvgValues, yValues, series);
    }

    /**
     * Calculation of logarithmic points
     */
    private getLogarithmicPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                                 series: Series, slopeInterceptLog: SlopeIntercept): Points[] {
        const midPoint: number = Math.round((points.length / 2));
        const pts: Points[] = [];
        const x1Log: number = xValues[0] - trendline.backwardForecast;
        const x1: number = x1Log ? Math.log(x1Log) : 0;
        const y1Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope * x1);
        const x2Log: number = xValues[midPoint - 1];
        const x2: number = x2Log ? Math.log(x2Log) : 0;
        const y2Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope *  x2);
        const x3Log: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        const x3: number = x3Log ? Math.log(x3Log) : 0;
        const y3Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope *  x3);
        pts.push(
            this.getDataPoint(x1Log, y1Log, series, pts.length));
        pts.push(
            this.getDataPoint(x2Log, y2Log, series, pts.length));
        pts.push(
            this.getDataPoint(x3Log, y3Log, series, pts.length));
        return pts;
    }

    /**
     * Defines the points based on data point
     */
    private getPowerPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                           series: Series, slopeInterceptPower: SlopeIntercept): Points[] {
        const midPoint: number = Math.round((points.length / 2));
        const pts: Points[] = [];
        let x1: number = xValues[0] - trendline.backwardForecast;
        x1 = x1 > -1 ? x1 : 0;
        const y1: number = slopeInterceptPower.intercept * Math.pow(x1, slopeInterceptPower.slope);
        const x2: number = xValues[midPoint - 1];
        const y2: number = slopeInterceptPower.intercept * Math.pow(x2, slopeInterceptPower.slope);
        const x3: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        const y3: number = slopeInterceptPower.intercept * Math.pow(x3, slopeInterceptPower.slope);
        pts.push(
            this.getDataPoint(x1, y1, series, pts.length));
        pts.push(
            this.getDataPoint(x2, y2, series, pts.length));
        pts.push(
            this.getDataPoint(x3, y3, series, pts.length));
        return pts;
    }

    /**
     * Get the polynomial points based on polynomial slopes
     */
    private getPolynomialPoints(
        trendline: Trendline, points: Points[], xValues: number[], yValues: number[], series: Series): Points[] {
        let pts: Points[] = [];
        let polynomialOrder: number = points.length <= trendline.polynomialOrder ? points.length : trendline.polynomialOrder;
        polynomialOrder = Math.max(2, polynomialOrder);
        polynomialOrder = Math.min(6, polynomialOrder);
        trendline.polynomialOrder = polynomialOrder;
        trendline.polynomialSlopes = [];
        trendline.polynomialSlopes.length = trendline.polynomialOrder + 1;
        let index: number = 0;
        while (index < xValues.length) {
            const xVal: number = xValues[index as number];
            const yVal: number = yValues[index as number];
            let subIndex: number = 0;
            while (subIndex <= trendline.polynomialOrder) {
                if (!trendline.polynomialSlopes[subIndex as number]) {
                    trendline.polynomialSlopes[subIndex as number] = 0;
                }
                trendline.polynomialSlopes[subIndex as number] += Math.pow(xVal, subIndex) * yVal;
                ++subIndex;
            }
            index++;
        }
        const numArray: number[] = [];
        numArray.length = 1 + 2 * trendline.polynomialOrder;
        const matrix: number[][] = [];
        matrix.length = trendline.polynomialOrder + 1;
        let newIndex: number = 0;
        while (newIndex < (trendline.polynomialOrder + 1)) {
            matrix[newIndex as number] = [];
            matrix[newIndex as number].length = 3;
            newIndex++;
        }
        let nIndex: number = 0;
        while (nIndex < xValues.length) {
            const d: number = xValues[nIndex as number];
            let num2: number = 1.0;
            let nIndex2: number = 0;
            while (nIndex2 < numArray.length) {
                if (!numArray[nIndex2 as number]) {
                    numArray[nIndex2 as number] = 0;
                }
                numArray[nIndex2 as number] += num2;
                num2 *= d;
                ++nIndex2;
            }
            ++nIndex;
        }
        let nnIndex: number = 0;
        while (nnIndex <= trendline.polynomialOrder) {
            let nnIndex2: number = 0;
            while (nnIndex2 <= trendline.polynomialOrder) {
                matrix[nnIndex as number][nnIndex2 as number] = numArray[nnIndex + nnIndex2];
                ++nnIndex2;
            }
            ++nnIndex;
        }

        if (!this.gaussJordanElimination(matrix, trendline.polynomialSlopes)) {
            trendline.polynomialSlopes = null;
        }
        pts = this.getPoints(trendline, points, xValues, series);
        return pts;
    }

    /**
     * Defines the moving average points
     */
    private getMovingAveragePoints(
        trendline: Trendline, points: Points[],
        xValues: number[], yValues: number[], series: Series): Points[] {
        const pts: Points[] = [];
        let period: number = trendline.period >= points.length ? points.length - 1 : trendline.period;
        period = Math.max(2, period);
        let index: number = 0; let y: number; let x: number; let count: number; let nullCount: number;
        while (index < points.length - 1) {
            y = count = nullCount = 0;
            for (let j: number = index; count < period; j++) {
                count++;
                y += yValues[j as number];
            }
            y = period - nullCount < 0 ? null : y ? y / (period - nullCount) : y;
            if (!isNullOrUndefined(y) && !isNaN(y)) {
                x = xValues[period - 1 + index];
                pts.push(
                    this.getDataPoint(x, y, series, pts.length));
            }
            index++;
        }
        return pts;
    }

    /**
     * Defines the linear points
     */
    private getLinearPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                            series: Series, slopeInterceptLinear: SlopeIntercept): Points[] {
        const pts: Points[] = [];
        const max: number = xValues.indexOf(Math.max.apply(null, xValues));
        const min: number = xValues.indexOf(Math.min.apply(null, xValues));
        const x1Linear: number = xValues[min as number] - trendline.backwardForecast;
        const y1Linear: number = slopeInterceptLinear.slope * x1Linear + slopeInterceptLinear.intercept;
        const x2Linear: number = xValues[max as number] + trendline.forwardForecast;
        const y2Linear: number = slopeInterceptLinear.slope * x2Linear + slopeInterceptLinear.intercept;
        pts.push(
            this.getDataPoint(x1Linear, y1Linear, series, pts.length));
        pts.push(
            this.getDataPoint(x2Linear, y2Linear, series, pts.length));
        return pts;
    }

    /**
     * Defines the exponential points
     */
    private getExponentialPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                                 series: Series, slopeInterceptExp: SlopeIntercept): Points[] {
        const midPoint: number = Math.round((points.length / 2));
        const ptsExp: Points[] = [];
        const x1: number = xValues[0] - trendline.backwardForecast;
        const y1: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x1);
        const x2: number = xValues[midPoint - 1];
        const y2: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x2);
        const x3: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        const y3: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x3);
        ptsExp.push(
            this.getDataPoint(x1, y1, series, ptsExp.length));
        ptsExp.push(
            this.getDataPoint(x2, y2, series, ptsExp.length));
        ptsExp.push(
            this.getDataPoint(x3, y3, series, ptsExp.length));
        return ptsExp;
    }

    /**
     * Defines the points based on data point
     */
    private getPoints(trendline: Trendline, points: Points[], xValues: number[], series: Series): Points[] {
        const polynomialSlopes: number[] = trendline.polynomialSlopes;
        const pts: Points[] = []; let x1: number = 1;
        let index: number = 1; let xValue: number; let yValue: number;
        // We have to sort the points in ascending order. Because, the data source of the series may be random order.
        points.sort((a: Points, b: Points) => { return a.xValue - b.xValue; });
        xValues.sort((a: number, b: number) => { return a - b; });
        while (index <= polynomialSlopes.length) {
            if (index === 1) {
                xValue = xValues[0] - trendline.backwardForecast;
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, series, pts.length));
            } else if (index === polynomialSlopes.length) {
                xValue = xValues[points.length - 1] + trendline.forwardForecast;
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, series, pts.length));
            } else {
                x1 += (points.length + trendline.forwardForecast) / polynomialSlopes.length;
                xValue = xValues[parseInt(x1.toString(), 10) - 1];
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, series, pts.length));
            }
            index++;
        }
        return pts;
    }

    /**
     * Defines the polynomial value of y
     */
    private getPolynomialYValue(slopes: number[], x: number): number {
        let sum: number = 0;
        let index: number = 0;
        while (index < slopes.length) {
            sum += slopes[index as number] * Math.pow(x, index);
            index++;
        }
        return sum;
    }

    /**
     * Defines the gauss jordan elimination
     */
    private gaussJordanElimination(matrix: number[][], polynomialSlopes: number[]): boolean {
        const length: number = matrix.length;
        const numArray1: number[] = [];
        const numArray2: number[] = [];
        const numArray3: number[] = [];
        numArray1.length = length;
        numArray2.length = length;
        numArray3.length = length;
        let index: number = 0;
        while (index < length) {
            numArray3[index as number] = 0;
            ++index;
        }
        let index1: number = 0;
        while (index1 < length) {
            let num1: number = 0; let index2: number = 0; let index3: number = 0;
            let index4: number = 0;
            while (index4 < length) {
                if (numArray3[index4 as number] !== 1) {
                    let index5: number = 0;
                    while (index5 < length) {
                        if (numArray3[index5 as number] === 0 && Math.abs(matrix[index4 as number][index5 as number]) >= num1) {
                            num1 = Math.abs(matrix[index4 as number][index5 as number]);
                            index2 = index4;
                            index3 = index5;
                        }
                        ++index5;
                    }
                }
                ++index4;
            }
            ++numArray3[index3 as number];
            if (index2 !== index3) {
                let index4: number = 0;
                while (index4 < length) {
                    const num2: number = matrix[index2 as number][index4 as number];
                    matrix[index2 as number][index4 as number] = matrix[index3 as number][index4 as number];
                    matrix[index3 as number][index4 as number] = num2;
                    ++index4;
                }
                const num3: number = polynomialSlopes[index2 as number];
                polynomialSlopes[index2 as number] = polynomialSlopes[index3 as number];
                polynomialSlopes[index3 as number] = num3;
            }
            numArray2[index1 as number] = index2;
            numArray1[index1 as number] = index3;
            if (matrix[index3 as number][index3 as number] === 0.0) {
                return false;
            }
            const num4: number = 1.0 / matrix[index3 as number][index3 as number];
            matrix[index3 as number][index3 as number] = 1.0;
            let iindex4: number = 0;
            while (iindex4 < length) {
                matrix[index3 as number][iindex4 as number] *= num4;
                ++iindex4;
            }
            polynomialSlopes[index3 as number] *= num4;
            let iandex4: number = 0;
            while (iandex4 < length) {
                if (iandex4 !== index3) {
                    const num2: number = matrix[iandex4 as number][index3 as number];
                    matrix[iandex4 as number][index3 as number] = 0.0;
                    let index5: number = 0;
                    while (index5 < length) {
                        matrix[iandex4 as number][index5 as number] -= matrix[index3 as number][index5 as number] * num2;
                        ++index5;
                    }
                    polynomialSlopes[iandex4 as number] -= polynomialSlopes[index3 as number] * num2;
                }
                ++iandex4;
            }
            ++index1;
        }
        let iindex1: number = length - 1;
        while (iindex1 >= 0) {
            if (numArray2[iindex1 as number] !== numArray1[iindex1 as number]) {
                let iindex2: number = 0;
                while (iindex2 < length) {
                    const num: number = matrix[iindex2 as number][numArray2[iindex1 as number]];
                    matrix[iindex2 as number][numArray2[iindex1 as number]] = matrix[iindex2 as number][numArray1[iindex1 as number]];
                    matrix[iindex2 as number][numArray1[iindex1 as number]] = num;
                    ++iindex2;
                }
            }
            --iindex1;
        }
        return true;
    }

    /**
     * Defines the trendline elements.
     */
    public getTrendLineElements(series: Series, chart: Chart): void {
        findClipRect(series);
        const clipRect: Rect = series.clipRect;
        const clipRectElement: Element = chart.renderer.drawClipPath(new RectOption(
            chart.element.id + '_ChartTrendlineClipRect_' + series.index, 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: 0, y: 0, width: clipRect.width,
                height: clipRect.height
            }));
        const element: Element = chart.renderer.createGroup({
            'id': chart.element.id + 'TrendlineSeriesGroup' + series.index,
            'transform': 'translate(' + clipRect.x + ',' + clipRect.y + ')',
            'clip-path': 'url(#' + chart.element.id + '_ChartTrendlineClipRect_' + series.index + ')'
        });

        //defines the clip rect element

        if (element) {
            element.appendChild(clipRectElement);
        }

        for (const trendline of series.trendlines) {

            this.createTrendLineElements(
                chart, trendline as Trendline, (trendline as Trendline).index, element, clipRectElement);

        }

    }

    /**
     * To destroy the trendline.
     */
    public destroy(): void {
        /**
         * Destroys the Linear Trendline
         */
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name of the series
         */
        return 'TrendLine';
    }

}
/** @private */
export interface SlopeIntercept {
    slope?: number;
    intercept?: number;
}
