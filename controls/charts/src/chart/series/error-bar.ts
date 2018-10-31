import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { ErrorBarSettingsModel, ErrorBarCapSettingsModel } from '../series/chart-series-model';
import { Series, Points } from './chart-series';
import { Mean, RectOption, StackValues, pathAnimation, getElement, appendChildElement, appendClipElement } from '../../common/utils/helper';
import { getPoint, ChartLocation, PathOption, sum, templateAnimate } from '../../common/utils/helper';
import { ErrorBarMode, ErrorBarDirection } from '../../chart/utils/enum';

/**
 * `ErrorBar` module is used to render the error bar for series.
 */
export class ErrorBar {
    private chart: Chart;
    public errorHeight: number;
    public error: number;
    public positiveHeight: number;
    public negativeHeight: number;
    /**
     * Constructor for the error bar module.
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;

    }

    /**
     * Render the error bar for series.
     * @return {void}
     */

    public render(series: Series): void {
        if (this.chart.chartAreaType === 'PolarRadar') {
            return null;
        }
        this.createElement(series, this.chart);
        this.renderErrorBar(series);
    }
    private renderErrorBar(series: Series): void {
        let seriesIndex: number = series.index;
        let symbolId: string;
        let capId: string;
        let errorbar: ErrorBarSettingsModel = series.errorBar;
        let errorBarCap: ErrorBarCapSettingsModel = series.errorBar.errorBarCap;
        let errorDirection: string[] = ['', ''];
        let redraw: boolean = series.chart.redraw;
        for (let point of series.points) {
            if (point.visible && point.symbolLocations[0]) {
                let errorX: number = 0;
                let errorY: number = 0;
                switch (errorbar.mode) {
                    case 'Vertical':
                        errorY = errorbar.verticalError;
                        break;
                    case 'Horizontal':
                        errorX = errorbar.horizontalError;
                        break;
                    case 'Both':
                        errorX = errorbar.horizontalError;
                        errorY = errorbar.verticalError;
                        break;

                }
                errorDirection = this['calculate' + errorbar.type + 'Value'](
                    point, series, this.chart.requireInvertedAxis,
                    errorX, errorY
                );

                symbolId = this.chart.element.id + '_Series_' + '_ErrorBarGroup_' + seriesIndex + '_Point_' + point.index;
                capId = this.chart.element.id + '_Series_' + '_ErrorBarCap_' + seriesIndex + '_Point_' + point.index;

                let shapeOption: PathOption = new PathOption(
                    symbolId, '', errorbar.width, errorbar.color || this.chart.themeStyle.errorBar, null, '', errorDirection[0]
                );
                let element: Element = getElement(shapeOption.id);
                let previousDirection: string = element ? element.getAttribute('d') : null;
                series.errorBarElement.appendChild(this.chart.renderer.drawPath(shapeOption));
                pathAnimation(element, errorDirection[0], redraw, previousDirection);
                let capOption: PathOption = new PathOption(
                    capId, '', errorBarCap.width, errorBarCap.color || this.chart.themeStyle.errorBar, null, '', errorDirection[1]
                );
                element = getElement(capOption.id);
                previousDirection = element ? element.getAttribute('d') : null;
                appendChildElement(series.errorBarElement, this.chart.renderer.drawPath(capOption), redraw);
                pathAnimation(element, errorDirection[1], redraw, previousDirection);
            }
        }
    }

    // path calculation for error bar

    private findLocation(point: Points, series: Series, isInverted: boolean, x1: number, y1: number): string[] {
        let errorbar: ErrorBarSettingsModel = series.errorBar;
        let direction: ErrorBarDirection = errorbar.direction;
        let location: ChartLocation[] = [];
        let stackedValue: StackValues = series.stackedValues;
        let yValue: number = series.type.indexOf('Stacking') > - 1 ? series.stackedValues.endValues[point.index] :
            (series.seriesType === 'HighLow' || series.seriesType === 'HighLowOpenClose') ? <number>(series.points[point.index].high) :
                point.yValue;
        let startPoint: ChartLocation = getPoint(
            point.xValue + ((direction === 'Plus' || direction === 'Both') ? (errorbar.type === 'Custom' &&
                (errorbar.mode === 'Horizontal' || errorbar.mode === 'Both')) ? x1 = errorbar.horizontalPositiveError : x1 : 0),
            yValue + ((direction === 'Plus' || direction === 'Both') ? (errorbar.type === 'Custom' &&
                (errorbar.mode === 'Vertical' || errorbar.mode === 'Both')) ? y1 = errorbar.verticalPositiveError : y1 : 0),
            series.xAxis, series.yAxis, isInverted
        );
        location.push(startPoint);

        if (series.isRectSeries) {
            let midPoint: ChartLocation = point.symbolLocations[0];
            location.push(midPoint);
        } else {
            let midPoint: ChartLocation = getPoint(
                point.xValue, point.yValue,
                series.xAxis, series.yAxis, isInverted
            );
            location.push(midPoint);
        }

        let endPoint: ChartLocation = getPoint(
            point.xValue - ((direction === 'Minus' || direction === 'Both') ? (errorbar.type === 'Custom' &&
                (errorbar.mode === 'Horizontal' || errorbar.mode === 'Both')) ? x1 = errorbar.horizontalNegativeError : x1 : 0),
            yValue - ((direction === 'Minus' || direction === 'Both') ? (errorbar.type === 'Custom' &&
                (errorbar.mode === 'Vertical' || errorbar.mode === 'Both')) ? y1 = errorbar.verticalNegativeError : y1 : 0),
            series.xAxis, series.yAxis, isInverted
        );
        location.push(endPoint);

        // calculate error height for datalabel position alignment
        point.error = (errorbar.mode === 'Vertical') ? errorbar.verticalError : errorbar.horizontalError;
        this.negativeHeight = (errorbar.mode === 'Vertical' || errorbar.mode === 'Both') ? (isInverted ? (location[1].x - location[2].x) :
            (location[2].y - location[1].y)) : 0;
        this.positiveHeight = (errorbar.mode === 'Vertical' || errorbar.mode === 'Both') ? (isInverted ? (location[0].x - location[1].x) :
            (location[1].y - location[0].y)) : 0;
        return this.getErrorDirection(location[0], location[1], location[2], series, isInverted);

    }
    // calculations for eror bar types
    private calculateFixedValue(
        point: Points, series: Series, isInverted: boolean,
        errorX: number, errorY: number, xAxis: Axis, yAxis: Axis
    ): string[] {
        let errorbar: ErrorBarSettingsModel = series.errorBar;
        return this.findLocation(point, series, isInverted, errorX, errorY);
    }

    private calculatePercentageValue(
        point: Points, series: Series, isInverted: boolean,
        errorX: number, errorY: number, xAxis: Axis, yAxis: Axis
    ): string[] {
        errorX = (errorX / 100) * point.xValue;
        errorY = (errorY / 100) * point.yValue;
        return this.findLocation(point, series, isInverted, errorX, errorY);

    }

    private calculateStandardDeviationValue(
        point: Points, series: Series, isInverted: boolean,
        errorX: number, errorY: number, xAxis: Axis, yAxis: Axis
    ): string[] {
        let getMean: Mean = this.meanCalculation(series, series.errorBar.mode);
        errorX = errorX * (getMean.horizontalSquareRoot + getMean.horizontalMean);
        errorY = errorY * (getMean.verticalSquareRoot + getMean.verticalMean);

        return this.findLocation(point, series, isInverted, errorX, errorY);
    }
    private calculateStandardErrorValue(
        point: Points, series: Series, isInverted: boolean,
        errorX: number, errorY: number, xAxis: Axis, yAxis: Axis
    ): string[] {
        let length: number = series.points.length;
        let getMean: Mean = this.meanCalculation(series, series.errorBar.mode);
        errorX = ((errorX * getMean.horizontalSquareRoot) / Math.sqrt(length));
        errorY = ((errorY * getMean.verticalSquareRoot) / Math.sqrt(length));
        return this.findLocation(point, series, isInverted, errorX, errorY);
    }

    private calculateCustomValue(
        point: Points, series: Series, isInverted: boolean,
        errorX: number, errorY: number, xAxis: Axis, yAxis: Axis
    ): string[] {
        let errorbar: ErrorBarSettingsModel = series.errorBar;
        return this.findLocation(point, series, isInverted, errorX, errorY);

    }

    private getHorizontalDirection(
        start: ChartLocation, mid: ChartLocation, end: ChartLocation,
        direction: ErrorBarDirection, errorMode: ErrorBarMode, capLength: number
    ): string[] {

        let path: string = '';
        let capDirection: string = '';
        path += 'M ' + start.x + ' ' + mid.y + ' L ' + end.x + ' ' + mid.y;
        capDirection += (direction === 'Plus' || direction === 'Both') ? 'M ' + (start.x) + ' ' + (mid.y - capLength) + ' L '
            + (start.x) + ' ' + (mid.y + capLength) : '';
        capDirection += (direction === 'Minus' || direction === 'Both') ? 'M ' + (end.x) + ' ' + (mid.y - capLength) + ' L '
            + (end.x) + ' ' + (mid.y + capLength) : ' ';
        return [path, capDirection];
    }

    private getVerticalDirection(
        start: ChartLocation, mid: ChartLocation, end: ChartLocation,
        direction: ErrorBarDirection, errorMode: ErrorBarMode, capLength: number
    ): string[] {

        let path: string = '';
        let capDirection: string = '';
        path += 'M ' + mid.x + ' ' + start.y + ' L ' + mid.x + ' ' + end.y;
        capDirection += (direction === 'Plus' || direction === 'Both') ? 'M ' + (mid.x - capLength) + ' ' + start.y + ' L '
            + (mid.x + capLength) + ' ' + start.y : '';
        capDirection += (direction === 'Minus' || direction === 'Both') ? 'M ' + (mid.x - capLength) + ' ' + end.y + ' L '
            + (mid.x + capLength) + ' ' + end.y : '';
        return [path, capDirection];
    }

    private getBothDirection(
        start: ChartLocation, mid: ChartLocation, end: ChartLocation,
        direction: ErrorBarDirection, errorMode: ErrorBarMode, capLength: number
    ): string[] {

        let capDirection: string = '';
        let path: string = '';
        let pathH: string[] = this.getHorizontalDirection(start, mid, end, direction, errorMode, capLength);
        let pathV: string[] = this.getVerticalDirection(start, mid, end, direction, errorMode, capLength);
        path = pathH[0].concat(pathV[0]);
        capDirection = pathH[1].concat(pathV[1]);
        return [path, capDirection];
    }

    private getErrorDirection(
        start: ChartLocation, mid: ChartLocation, end: ChartLocation,
        series: Series, isInverted: boolean
    ): string[] {
        let direction: ErrorBarDirection = series.errorBar.direction;
        let mode: ErrorBarMode = series.errorBar.mode;
        let capLength: number = series.errorBar.errorBarCap.length;
        let path: string = '';
        let paths: string[];
        let capDirection: string = '';
        let errorMode: ErrorBarMode = mode;
        switch (mode) {
            case 'Both':
                errorMode = mode;
                break;
            case 'Horizontal':
                errorMode = (isInverted) ? 'Vertical' : mode;
                break;
            case 'Vertical':
                errorMode = (isInverted) ? 'Horizontal' : mode;
                break;
        }
        switch (errorMode) {
            case 'Horizontal':
                paths = this.getHorizontalDirection(start, mid, end, direction, errorMode, capLength);
                break;
            case 'Vertical':
                paths = this.getVerticalDirection(start, mid, end, direction, errorMode, capLength);
                break;
            case 'Both':
                paths = this.getBothDirection(start, mid, end, direction, errorMode, capLength);
                break;
        }
        return [paths[0], paths[1]];
    }
    // mean calculation for standard deviation and standard error

    public meanCalculation(series: Series, mode: ErrorBarMode): Mean {
        let sumOfX: number = 0; let sumOfY: number = 0;
        let verticalMean: number = 0; let horizontalMean: number = 0;
        let verStandardMean: number; let horStandardMean: number;
        let verSquareRoot: number; let horSquareRoot: number;
        let length: number = series.points.length;

        switch (mode) {
            case 'Vertical':
                sumOfY = sum(series.yData);
                verticalMean = sumOfY / length;
                break;
            case 'Horizontal':
                sumOfX = sum(series.xData);
                horizontalMean = sumOfX / length;
                break;
            case 'Both':
                sumOfY = sum(series.yData);
                verticalMean = sumOfY / length;
                sumOfX = sum(series.xData);
                horizontalMean = sumOfX / length;
        }

        for (let point of series.points) {
            if (mode === 'Vertical') {
                sumOfY = sumOfY + Math.pow((point.yValue - verticalMean), 2);
            } else if (mode === 'Horizontal') {
                sumOfX = sumOfX + Math.pow((point.xValue - horizontalMean), 2);
            } else {
                sumOfY = sumOfY + Math.pow((point.yValue - verticalMean), 2);
                sumOfX = sumOfX + Math.pow((point.xValue - horizontalMean), 2);
            }
        }
        verStandardMean = sumOfY / (length - 1);
        verSquareRoot = Math.sqrt(sumOfY / (length - 1));
        horStandardMean = sumOfX / (length - 1);
        horSquareRoot = Math.sqrt(sumOfX / (length - 1));

        return new Mean(verStandardMean, verSquareRoot, horStandardMean, horSquareRoot, verticalMean, horizontalMean);
    }

    private createElement(series: Series, chart: Chart): void {
        let explodeValue: number = 5;
        let transform: string = chart.chartAreaType === 'Cartesian' ?
            'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')' : '';
        let markerHeight: number = (series.marker.height + explodeValue) / 2;
        let markerWidth: number = (series.marker.width + explodeValue) / 2;
        if (chart.chartAreaType === 'Cartesian') {
            let options: RectOption = new RectOption(
                chart.element.id + '_ChartErrorBarClipRect_' + series.index, 'transparent',
                { width: 1, color: 'Gray' }, 1,
                {
                    x: -markerWidth, y: -markerHeight,
                    width: series.clipRect.width + markerWidth * 2, height: series.clipRect.height + markerHeight * 2
                }
            );
            series.errorBarElement = chart.renderer.createGroup({
                'id': chart.element.id + 'ErrorBarGroup' + series.index,
                'transform': transform,
                'clip-path': 'url(#' + chart.element.id + '_ChartErrorBarClipRect_' + series.index + ')'
            });
            series.errorBarElement.appendChild(
                appendClipElement(chart.redraw, options, chart.renderer)
            );
        }
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */

    public doErrorBarAnimation(series: Series): void {
        let errorBarElements: NodeList = series.errorBarElement.childNodes;
        if (!errorBarElements) {
            return null;
        }
        let delay: number = series.animation.delay + series.animation.duration;
        let j: number = 1;
        while (j < errorBarElements.length) {
            for (let i: number = 0; i < series.points.length; i++) {
                if (!series.points[i].symbolLocations[0]) {
                    continue;
                }
                (<HTMLElement>errorBarElements[j]).style.visibility = 'hidden';
                templateAnimate(
                    errorBarElements[j] as HTMLElement, delay, 350,
                    series.chart.requireInvertedAxis ? 'SlideLeftIn' : 'SlideBottomIn',
                    false
                );
            }
            j++;
        }
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        // Returns the module name
        return 'ErrorBar';
    }
    /**
     * To destroy the errorBar for series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        // Destroy method performed here
    }
}

