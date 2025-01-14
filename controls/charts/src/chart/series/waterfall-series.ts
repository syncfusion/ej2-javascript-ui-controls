import { withInRange } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { subArraySum, getElement, appendChildElement, redrawElement } from '../../common/utils/helper';
import { Series, Points } from './chart-series';
import { DoubleRange } from '../utils/double-range';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { animationMode, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * The `WaterfallSeries` module is used to render the waterfall series.
 */

export class WaterfallSeries extends ColumnBase {
    /**
     * Store the cumulative values of each index.
     *
     * @private
     */
    public cumulativeSums: number[] = [];

    /**
     * Render waterfall series.
     *
     * @returns {void}
     * @private
     */

    public render(series: Series): void {
        let rect: Rect;
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        const origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        let prevEndValue: number = 0;
        let direction: string = '';
        let currentEndValue: number = 0;
        let originValue: number;
        let prevRegion: Rect = null;
        let y: number;
        const isInversed: boolean =  series.chart.requireInvertedAxis;
        let intermediateOrigin: number = 0;
        const redraw: boolean = series.chart.redraw;
        for (const point of series.points) {
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                //Calcute the current point value to render waterfall series.
                const isSum: boolean = this.isIntermediateSum(series, point.index);
                const totalSum: boolean = this.isSumIndex(series, point.index);
                currentEndValue += isSum || totalSum === true ? 0 : point.yValue;

                //Calcute the origin value for points
                originValue = (isSum === true ? intermediateOrigin : ((prevEndValue !== null && !totalSum) ? prevEndValue : origin));
                rect = this.getRectangle(point.xValue + sideBySideInfo.start, currentEndValue,
                                         point.xValue + sideBySideInfo.end, originValue, series);
                argsData = this.triggerPointRenderEvent(series, point);
                //intermediateOrigin is used only for imtermediate data
                if (isSum) {
                    intermediateOrigin = currentEndValue;
                }
                prevEndValue = currentEndValue;
                if (!argsData.cancel) {
                    this.updateSymbolLocation(point, rect, series);
                    this.drawRectangle(series, point, rect, argsData);
                }
                const currentRegion: Rect = point.regions[0];
                if (prevRegion !== null) {
                    const prevLeft: number = isInversed ? prevRegion.x : prevRegion.y;
                    const currentLeft: number = isInversed ? currentRegion.x : currentRegion.y;
                    let prevBottom: number;
                    let currentBottom: number;
                    let currentYValue: number = currentRegion.y;
                    let currentXValue: number = currentRegion.x;
                    const beforePoint: Points = series.points[(point.index - 1 === -1) ? 1 : point.index - 1];
                    if (point.yValue === 0) {
                        prevBottom = isInversed ? prevRegion.x + prevRegion.width : prevRegion.y + prevRegion.height;
                        currentBottom = isInversed ?
                            point.symbolLocations[0].x : point.symbolLocations[0].y;
                    } else {
                        prevBottom = isInversed ? (beforePoint.yValue === 0) ?
                            beforePoint.symbolLocations[0].x : prevRegion.x + prevRegion.width : (beforePoint.yValue === 0) ?
                            beforePoint.symbolLocations[0].y : prevRegion.y + prevRegion.height;
                        currentBottom = isInversed ?
                            currentRegion.x + currentRegion.width : currentRegion.y + currentRegion.height;
                    }
                    if (Math.round(prevLeft) === Math.round(currentLeft) ||
                        Math.round(prevBottom) === Math.round(currentLeft)) {
                        y = isInversed ? (currentRegion.x === 0 && prevRegion.x === 0) ? currentBottom : currentRegion.x : currentRegion.y;
                        y = (point.yValue === 0) ?
                            (isInversed ? point.symbolLocations[0].x : point.symbolLocations[0].y) : y;
                    } else {
                        y = currentBottom;
                    }
                    if (isInversed) {
                        if (beforePoint.yValue === 0) {
                            prevRegion.y = ((prevRegion.y + prevRegion.height / 2) + (rect.height / 2)) - prevRegion.height;
                        }
                        if (point.yValue === 0) {
                            currentYValue = ((currentRegion.y + currentRegion.height / 2) - (rect.height / 2));
                        }
                        direction = direction.concat('M' + ' ' + y + ' ' + (series.xAxis.isInversed ? (prevRegion.y + prevRegion.height) : prevRegion.y) + ' ' +
                            'L' + ' ' + y + ' ' + (series.xAxis.isInversed ? currentYValue : (currentYValue + currentRegion.height)) + ' ');
                    } else {
                        let connectorX: number = prevRegion.x;
                        if (beforePoint.yValue === 0) {
                            connectorX = ((connectorX + prevRegion.width / 2) + (rect.width / 2)) - prevRegion.width;
                            currentXValue = ((currentRegion.x + currentRegion.width / 2) + (rect.width / 2)) - currentRegion.width;
                        }
                        if (point.yValue === 0) {
                            currentXValue = ((currentRegion.x + currentRegion.width / 2) - (rect.width / 2));
                        }
                        direction = direction.concat('M' + ' ' + (series.xAxis.isInversed ? connectorX : (connectorX + prevRegion.width)) + ' ' + y + ' ' +
                            'L' + ' ' + (series.xAxis.isInversed ? (currentXValue + currentRegion.width) : currentXValue) + ' ' + y + ' ');
                    }
                }
                prevRegion = point.regions[0];
            }
        }
        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index + '_Connector_', 'none', series.connector.width,
            series.connector.color, series.opacity, series.connector.dashArray, direction);
        if (redraw && getElement(options.id)) {
            direction = getElement(options.id).getAttribute('d');
        }
        const element: HTMLElement = <HTMLElement>(redrawElement(redraw, options.id, options, series.chart.renderer) ||
            series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y])));
        element.style.visibility = (!series.chart.enableCanvas) ? ((((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && series.chart.animateSeries) ?
            'hidden' : 'visible') : null;
        appendChildElement(series.chart.enableCanvas, series.seriesElement, element, redraw, true, null, null, null, direction,
                           null, null, null, series.chart.duration);
        this.renderMarker(series);
    }

    /**
     * Updates the direction of rendering for the specified series.
     *
     * @param {Series} series - The series to be rendered.
     * @param {number} point - Specifies the point.
     * @returns {void}
     * @private
     */
    public updateDirection(series: Series, point: number[]): void {
        this.render(series);
        if (series.marker.visible) {
            appendChildElement(series.chart.enableCanvas, series.chart.seriesElements, series.symbolElement, true);
        }
        if (series.marker.dataLabel.visible && series.chart.dataLabelModule) {
            for (let i: number = 0; i < point.length; i++) {
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
     * Checks whether the current point in the series is an intermediate sum.
     *
     * @param {Series} series - The series to check.
     * @param {number} index - The index of the point in the series.
     * @returns {boolean} - Returns true if the current point is an intermediate sum, otherwise false.
     */
    private isIntermediateSum(series: Series, index: number): boolean {
        if (series.intermediateSumIndexes !== undefined && series.intermediateSumIndexes.indexOf(index) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * Checks whether the current point in the series is a sum index.
     *
     * @param {Series} series - The series to check.
     * @param {number} index - The index of the point in the series.
     * @returns {boolean} - Returns true if the current point is a sum index, otherwise false.
     */
    private isSumIndex(series: Series, index: number): boolean {
        if (series.sumIndexes !== undefined && series.sumIndexes.indexOf(index) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * Triggers the point render event for a given series and point.
     *
     * @param {Series} series - The series to which the point belongs.
     * @param {Points} point - The point for which to trigger the event.
     * @returns {IPointRenderEventArgs} - The event arguments for the point render event.
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        let color: string;
        const isSum: boolean = this.isIntermediateSum(series, point.index);
        const totalSum: boolean = this.isSumIndex(series, point.index);
        if (isSum || totalSum) {
            color = series.summaryFillColor;
        } else if (point.y < 0) {
            color = series.negativeFillColor;
        } else {
            color = series.interior;
        }
        return this.triggerEvent(series, point, color, { color: series.border.color, width: series.border.width });
    }

    /**
     * Processes the internal data for a series.
     *
     * @param {Object[]} json - The internal data JSON array.
     * @param {Series} series - The series for which to process the data.
     * @returns {Object[]} - The processed internal data array.
     * @private
     */
    public processInternalData(json: Object[], series: Series): Object[] {
        const data: Object[] = json; let index: number; let sumValue : number = 0;
        const intermediateSum: number[] = (!isNullOrUndefined(series.intermediateSumIndexes) && series.intermediateSumIndexes.length > 0) ?
            series.intermediateSumIndexes.sort((a: number, b: number) => a - b) : series.intermediateSumIndexes;
        const sumIndex: number[] = (!isNullOrUndefined(series.sumIndexes) && series.sumIndexes.length > 0) ?
            series.sumIndexes.sort((a: number, b: number) => a - b) : series.sumIndexes;
        let cumulativeSum: number = 0;
        for (let i: number = 0; i < data.length; i++) {
            cumulativeSum += data[i as number][series.yName] !== undefined ? data[i as number][series.yName] : 0;
            this.cumulativeSums.push(cumulativeSum);
        }
        if (intermediateSum !== undefined && intermediateSum.length > 0) {
            for (let i: number = 0; i < intermediateSum.length; i++) {
                for (let j: number = 0; j < data.length; j++) {
                    if (j === intermediateSum[i as number]) {
                        if (i === 0) {
                            index = subArraySum(data, -1, intermediateSum[i as number], null, series);
                        } else {
                            index = subArraySum(data, intermediateSum[i - 1], intermediateSum[i as number], null, series);
                        }
                        data[j as number][series.yName] = index;
                    }
                }
            }
        }
        if (sumIndex !== undefined && sumIndex.length > 0) {
            let intermediateSumCount: number = 0;
            for (let k: number = 0; k < sumIndex.length; k++) {
                for (let j: number = 0; j < data.length; j++) {
                    if (j === sumIndex[k as number]) {
                        if (intermediateSum !== undefined && intermediateSum.length > intermediateSumCount &&
                            intermediateSum[k as number] !== sumIndex[k as number] && intermediateSum[k as number] <
                            sumIndex[k as number]) {
                            index = subArraySum(data, intermediateSum.length <= 1 ? intermediateSum[0] - 1 :
                                intermediateSum[k as number] - 1, sumIndex[k as number], sumIndex, series);
                            intermediateSumCount += 1;
                        } else {
                            if (k === 0) {
                                index = subArraySum(data, -1, sumIndex[k as number], null, series);
                            } else {
                                index = subArraySum(data, sumIndex[k as number - 1], sumIndex[k as number], null, series);
                            }
                        }
                        sumValue += index;
                        data[j as number][series.yName] = sumValue;
                    }
                }
            }
        }
        return data;
    }

    /**
     * Animates the series.
     *
     * @param  {Series} series - Defines the series to animate.
     * @returns {void}
     * @private
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'WaterfallSeries';
        /**
         * return the module name.
         */
    }
    /**
     * To destroy the waterfall series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroys the waterfall series.
         */
    }

}
