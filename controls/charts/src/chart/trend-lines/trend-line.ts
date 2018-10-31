import { Series, Points, Trendline } from '../series/chart-series';
import { TrendlineTypes } from '../../chart/utils/enum';
import { findClipRect, RectOption, Rect } from '../../common/utils/helper';
import { Chart } from '../chart';

/**
 * `Trendline` module is used to render 6 types of trendlines in chart.
 */
export class Trendlines {
    /**
     * Defines the collection of series, that are used to represent a trendline
     * @private
     */
    public initSeriesCollection(trendline: Trendline, chart: Chart): void {
        let trendLineSeries: Series = new Series(trendline, 'targetSeries', {}, true);
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
    }

    /**
     * Creates the elements of a trendline
     */
    private createTrendLineElements(
        chart: Chart, trendline: Trendline, index: number, element: Element, clipRectElement: Element): void {
        trendline.trendLineElement = element;
        trendline.targetSeries.clipRectElement = clipRectElement;
        trendline.targetSeries.seriesElement = element;
        chart.trendLineElements.appendChild(trendline.trendLineElement);
    }

    /**
     * Defines the data point of trendline
     */
    private getDataPoint(
        x: Object, y: Object, sourcePoint: Points, series: Series, index: number,
    ): Points {
        let trendPoint: Points = new Points();
        trendPoint.x = x;
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
        let xxAvg: number = 0; let yyAvg: number = 0;
        let index: number = 0; let slope: number = 0; let intercept: number = 0;
        while (index < points.length) {
            xAvg += xValues[index];
            yAvg += yValues[index];
            xyAvg += xValues[index] * yValues[index];
            xxAvg += xValues[index] * xValues[index];
            yyAvg += yValues[index] * yValues[index];
            index++;
        }
        let type: TrendlineTypes = trendline.type;
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
            if (type === 'Exponential' || type === 'Power') {
                intercept = Math.exp((yAvg - (slope * xAvg)) / points.length);
            } else {
                intercept = (yAvg - (slope * xAvg)) / points.length;
            }
        }
        return { slope: slope, intercept: intercept };
    }

    /**
     * Defines the points to draw the trendlines
     */
    public initDataSource(trendline: Trendline, chart: Chart): void {
        let points: Points[] = trendline.points;
        if (points && points.length) {
            //prepare data
            let trendlineSeries: Series = trendline.targetSeries;
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
        let xValue: number[] = [];
        let yValue: number[] = [];
        let index: number = 0;
        let slopeIntercept: SlopeIntercept;
        while (index < points.length) {
            let point: Points = points[index];
            xValue.push(point.xValue);
            yValue.push(Math.log(point.yValue));
            index++;
        }
        slopeIntercept = this.findSlopeIntercept(xValue, yValue, trendline, points);
        series.points = this.getExponentialPoints(trendline, points, xValue, yValue, series, slopeIntercept);
    }

    /**
     * Calculation of logarithmic points
     */
    private setLogarithmicRange(points: Points[], trendline: Trendline, series: Series): void {
        let xLogValue: number[] = [];
        let yLogValue: number[] = [];
        let xPointsLgr: number[] = [];
        let slopeIntercept: SlopeIntercept;
        let index: number = 0;
        while (index < points.length) {
            let point: Points = points[index];
            xPointsLgr.push(point.xValue);
            xLogValue.push(Math.log(point.xValue));
            yLogValue.push(point.yValue);
            index++;
        }
        slopeIntercept = this.findSlopeIntercept(xLogValue, yLogValue, trendline, points);
        series.points = this.getLogarithmicPoints(trendline, points, xPointsLgr, yLogValue, series, slopeIntercept);
    }

    /**
     * Calculation of polynomial points
     */
    private setPolynomialRange(points: Points[], trendline: Trendline, series: Series): void {
        let xPolyValues: number[] = [];
        let yPolyValues: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            let point: Points = points[index];
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
        let xValues: number[] = [];
        let yValues: number[] = [];
        let powerPoints: number[] = [];
        let slopeIntercept: SlopeIntercept;
        let index: number = 0;
        while (index < points.length) {
            let point: Points = points[index];
            powerPoints.push(point.xValue);
            xValues.push(Math.log(point.xValue));
            yValues.push(Math.log(point.yValue));
            index++;
        }
        slopeIntercept = this.findSlopeIntercept(xValues, yValues, trendline, points);
        series.points = this.getPowerPoints(trendline, points, powerPoints, yValues, series, slopeIntercept);
    }

    /**
     * Calculation of linear points
     */
    private setLinearRange(points: Points[], trendline: Trendline, series: Series): void {
        let xValues: number[] = [];
        let yValues: number[] = [];
        let slopeIntercept: SlopeIntercept;
        let index: number = 0;
        while (index < points.length) {
            let point: Points = points[index];
            xValues.push(point.xValue);
            yValues.push(point.yValue);
            index++;
        }
        slopeIntercept = this.findSlopeIntercept(xValues, yValues, trendline, points);
        series.points = this.getLinearPoints(trendline, points, xValues, yValues, series, slopeIntercept);
    }

    /**
     * Calculation of moving average points
     */
    private setMovingAverageRange(points: Points[], trendline: Trendline, series: Series): void {
        let xValues: number[] = [];
        let yValues: number[] = [];
        let xAvgValues: number[] = [];
        let index: number = 0;
        while (index < points.length) {
            let point: Points = points[index];
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
        let midPoint: number = Math.round((points.length / 2));
        let pts: Points[] = [];
        let x1Log: number = xValues[0] - trendline.backwardForecast;
        let y1Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope * Math.log(x1Log));
        let x2Log: number = xValues[midPoint - 1];
        let y2Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope * Math.log(x2Log));
        let x3Log: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        let y3Log: number = slopeInterceptLog.intercept + (slopeInterceptLog.slope * Math.log(x3Log));
        pts.push(
            this.getDataPoint(x1Log, y1Log, points[0], series, pts.length));
        pts.push(
            this.getDataPoint(x2Log, y2Log, points[midPoint - 1], series, pts.length));
        pts.push(
            this.getDataPoint(x3Log, y3Log, points[points.length - 1], series, pts.length));
        return pts;
    }

    /**
     * Defines the points based on data point
     */
    private getPowerPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                           series: Series, slopeInterceptPower: SlopeIntercept): Points[] {
        let midPoint: number = Math.round((points.length / 2));
        let pts: Points[] = [];
        let x1: number = xValues[0] - trendline.backwardForecast;
        x1 = x1 > -1 ? x1 : 0;
        let y1: number = slopeInterceptPower.intercept * Math.pow(x1, slopeInterceptPower.slope);
        let x2: number = xValues[midPoint - 1];
        let y2: number = slopeInterceptPower.intercept * Math.pow(x2, slopeInterceptPower.slope);
        let x3: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        let y3: number = slopeInterceptPower.intercept * Math.pow(x3, slopeInterceptPower.slope);
        pts.push(
            this.getDataPoint(x1, y1, points[0], series, pts.length));
        pts.push(
            this.getDataPoint(x2, y2, points[midPoint - 1], series, pts.length));
        pts.push(
            this.getDataPoint(x3, y3, points[points.length - 1], series, pts.length));
        return pts;
    }

    /**
     * Get the polynomial points based on polynomial slopes
     */
    private getPolynomialPoints(
        trendline: Trendline, points: Points[], xValues: number[], yValues: number[], series: Series): Points[] {
        let midPoint: number = Math.round((points.length / 2));
        let pts: Points[] = [];
        let polynomialOrder: number = points.length <= trendline.polynomialOrder ? points.length : trendline.polynomialOrder;
        polynomialOrder = Math.max(2, polynomialOrder);
        polynomialOrder = Math.min(6, polynomialOrder);
        trendline.polynomialOrder = polynomialOrder;
        trendline.polynomialSlopes = [];
        trendline.polynomialSlopes.length = trendline.polynomialOrder + 1;
        let index: number = 0;
        while (index < xValues.length) {
            let xVal: number = xValues[index];
            let yVal: number = yValues[index];
            let subIndex: number = 0;
            while (subIndex <= trendline.polynomialOrder) {
                if (!trendline.polynomialSlopes[subIndex]) {
                    trendline.polynomialSlopes[subIndex] = 0;
                }
                trendline.polynomialSlopes[subIndex] += Math.pow(xVal, subIndex) * yVal;
                ++subIndex;
            }
            index++;
        }
        let numArray: number[] = [];
        numArray.length = 1 + 2 * trendline.polynomialOrder;
        let matrix: number[][] = [];
        matrix.length = trendline.polynomialOrder + 1;
        let newIndex: number = 0;
        while (newIndex < (trendline.polynomialOrder + 1)) {
            matrix[newIndex] = [];
            matrix[newIndex].length = 3;
            newIndex++;
        }
        let nIndex: number = 0;
        let num1: number = 0;
        while (nIndex < xValues.length) {
            let d: number = xValues[nIndex];
            let num2: number = 1.0;
            let nIndex2: number = 0;
            while (nIndex2 < numArray.length) {
                if (!numArray[nIndex2]) {
                    numArray[nIndex2] = 0;
                }
                numArray[nIndex2] += num2;
                num2 *= d;
                ++num1;
                ++nIndex2;
            }
            ++nIndex;
        }
        let nnIndex: number = 0;
        while (nnIndex <= trendline.polynomialOrder) {
            let nnIndex2: number = 0;
            while (nnIndex2 <= trendline.polynomialOrder) {
                matrix[nnIndex][nnIndex2] = numArray[nnIndex + nnIndex2];
                ++nnIndex2;
            }
            ++nnIndex;
        }

        if (!this.gaussJordanElimination(matrix, trendline.polynomialSlopes)) {
            trendline.polynomialSlopes = null;
        }
        pts = this.getPoints(trendline, points, xValues, yValues, series);
        return pts;
    }

    /**
     * Defines the moving average points
     */
    private getMovingAveragePoints(
        trendline: Trendline, points: Points[],
        xValues: number[], yValues: number[], series: Series): Points[] {
        let pts: Points[] = [];
        let period: number = trendline.period >= points.length ? points.length - 1 : trendline.period;
        period = Math.max(2, period);
        let index: number = 0; let y: number; let x: number; let count: number; let nullCount: number;
        while (index < points.length - 1) {
            y = count = nullCount = 0;
            for (let j: number = index; count < period; j++) {
                count++;
                if (!yValues[j]) {
                    nullCount++;
                }
                y += yValues[j];
            }
            y = period - nullCount <= 0 ? null : y / (period - nullCount);
            if (y && !isNaN(y)) {
                x = xValues[period - 1 + index];
                pts.push(
                    this.getDataPoint(x, y, points[period - 1 + index], series, pts.length));
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
        let pts: Points[] = [];
        let x1Linear: number = xValues[0] - trendline.backwardForecast;
        let y1Linear: number = slopeInterceptLinear.slope * x1Linear + slopeInterceptLinear.intercept;
        let x2Linear: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        let y2Linear: number = slopeInterceptLinear.slope * x2Linear + slopeInterceptLinear.intercept;
        pts.push(
            this.getDataPoint(x1Linear, y1Linear, points[0], series, pts.length));
        pts.push(
            this.getDataPoint(x2Linear, y2Linear, points[points.length - 1], series, pts.length));
        return pts;
    }

    /**
     * Defines the exponential points
     */
    private getExponentialPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[],
                                 series: Series, slopeInterceptExp: SlopeIntercept): Points[] {
        let midPoint: number = Math.round((points.length / 2));
        let ptsExp: Points[] = [];
        let x1: number = xValues[0] - trendline.backwardForecast;
        let y1: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x1);
        let x2: number = xValues[midPoint - 1];
        let y2: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x2);
        let x3: number = xValues[xValues.length - 1] + trendline.forwardForecast;
        let y3: number = slopeInterceptExp.intercept * Math.exp(slopeInterceptExp.slope * x3);
        ptsExp.push(
            this.getDataPoint(x1, y1, points[0], series, ptsExp.length));
        ptsExp.push(
            this.getDataPoint(x2, y2, points[midPoint - 1], series, ptsExp.length));
        ptsExp.push(
            this.getDataPoint(x3, y3, points[points.length - 1], series, ptsExp.length));
        return ptsExp;
    }

    /**
     * Defines the points based on data point
     */
    private getPoints(trendline: Trendline, points: Points[], xValues: number[], yValues: number[], series: Series): Points[] {
        let midPoint: number = Math.round((points.length / 2));
        let polynomialSlopes: number[] = trendline.polynomialSlopes;
        let pts: Points[] = []; let x1: number = 1;
        let index: number = 1; let xValue: number; let yValue: number;
        while (index <= polynomialSlopes.length) {
            if (index === 1) {
                xValue = xValues[0] - trendline.backwardForecast;
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, points[0], series, pts.length));
            } else if (index === polynomialSlopes.length) {
                xValue = xValues[points.length - 1] + trendline.forwardForecast;
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, points[points.length - 1], series, pts.length));
            } else {
                x1 += (points.length + trendline.forwardForecast) / polynomialSlopes.length;
                xValue = xValues[parseInt(x1.toString(), 10) - 1];
                yValue = this.getPolynomialYValue(polynomialSlopes, xValue);
                pts.push(
                    this.getDataPoint(xValue, yValue, points[parseInt(x1.toString(), 10) - 1], series, pts.length));
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
            sum += slopes[index] * Math.pow(x, index);
            index++;
        }
        return sum;
    }

    /**
     * Defines the gauss jordan elimination
     */
    private gaussJordanElimination(matrix: number[][], polynomialSlopes: number[]): boolean {
        let length: number = matrix.length;
        let numArray1: number[] = [];
        let numArray2: number[] = [];
        let numArray3: number[] = [];
        numArray1.length = length;
        numArray2.length = length;
        numArray3.length = length;
        let index: number = 0;
        while (index < length) {
            numArray3[index] = 0;
            ++index;
        }
        let index1: number = 0;
        while (index1 < length) {
            let num1: number = 0; let index2: number = 0; let index3: number = 0;
            let index4: number = 0;
            while (index4 < length) {
                if (numArray3[index4] !== 1) {
                    let index5: number = 0;
                    while (index5 < length) {
                        if (numArray3[index5] === 0 && Math.abs(matrix[index4][index5]) >= num1) {
                            num1 = Math.abs(matrix[index4][index5]);
                            index2 = index4;
                            index3 = index5;
                        }
                        ++index5;
                    }
                }
                ++index4;
            }
            ++numArray3[index3];
            if (index2 !== index3) {
                let index4: number = 0;
                while (index4 < length) {
                    let num2: number = matrix[index2][index4];
                    matrix[index2][index4] = matrix[index3][index4];
                    matrix[index3][index4] = num2;
                    ++index4;
                }
                let num3: number = polynomialSlopes[index2];
                polynomialSlopes[index2] = polynomialSlopes[index3];
                polynomialSlopes[index3] = num3;
            }
            numArray2[index1] = index2;
            numArray1[index1] = index3;
            if (matrix[index3][index3] === 0.0) {
                return false;
            }
            let num4: number = 1.0 / matrix[index3][index3];
            matrix[index3][index3] = 1.0;
            let iindex4: number = 0;
            while (iindex4 < length) {
                matrix[index3][iindex4] *= num4;
                ++iindex4;
            }
            polynomialSlopes[index3] *= num4;
            let iandex4: number = 0;
            while (iandex4 < length) {
                if (iandex4 !== index3) {
                    let num2: number = matrix[iandex4][index3];
                    matrix[iandex4][index3] = 0.0;
                    let index5: number = 0;
                    while (index5 < length) {
                        matrix[iandex4][index5] -= matrix[index3][index5] * num2;
                        ++index5;
                    }
                    polynomialSlopes[iandex4] -= polynomialSlopes[index3] * num2;
                }
                ++iandex4;
            }
            ++index1;
        }
        let iindex1: number = length - 1;
        while (iindex1 >= 0) {
            if (numArray2[iindex1] !== numArray1[iindex1]) {
                let iindex2: number = 0;
                while (iindex2 < length) {
                    let num: number = matrix[iindex2][numArray2[iindex1]];
                    matrix[iindex2][numArray2[iindex1]] = matrix[iindex2][numArray1[iindex1]];
                    matrix[iindex2][numArray1[iindex1]] = num;
                    ++iindex2;
                }
            }
            --iindex1;
        }
        return true;
    }

    /**
     * Defines the trendline elements
     */
    public getTrendLineElements(series: Series, chart: Chart): void {
        findClipRect(series);
        let clipRect: Rect = series.clipRect;
        let clipRectElement: Element = chart.renderer.drawClipPath(new RectOption(
            chart.element.id + '_ChartTrendlineClipRect_' + series.index, 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: 0, y: 0, width: clipRect.width,
                height: clipRect.height,
            }));

        let element: Element;
        element = chart.renderer.createGroup({
            'id': chart.element.id + 'TrendlineSeriesGroup' + series.index,
            'transform': 'translate(' + clipRect.x + ',' + clipRect.y + ')',
            'clip-path': 'url(#' + chart.element.id + '_ChartTrendlineClipRect_' + series.index + ')'
        });

        //defines the clip rect element


        element.appendChild(clipRectElement);

        for (let trendline of series.trendlines) {

            this.createTrendLineElements(
                chart, trendline as Trendline, (trendline as Trendline).index, element, clipRectElement);

        }

    }

    /**
     * To destroy the trendline
     */
    public destroy(chart: Chart): void {
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