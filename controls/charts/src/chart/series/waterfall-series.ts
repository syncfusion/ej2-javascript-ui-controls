/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { withInRange } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { subArraySum, getElement, appendChildElement, redrawElement } from '../../common/utils/helper';
import { Series, Points } from './chart-series';
import { DoubleRange } from '../utils/double-range';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';

/**
 * `WaterfallSeries` module is used to render the waterfall series.
 */

export class WaterfallSeries extends ColumnBase {

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
                    const beforePoint: Points = series.points[point.index - 1];
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
                        direction = direction.concat('M' + ' ' + y + ' ' + (prevRegion.y + prevRegion.height) + ' ' +
                            'L' + ' ' + y + ' ' + currentYValue + ' ');
                    } else {
                        if (beforePoint.yValue === 0) {
                            prevRegion.x = ((prevRegion.x + prevRegion.width / 2) - (rect.width / 2));
                            currentXValue = ((currentRegion.x + currentRegion.width / 2) + (rect.width / 2)) - currentRegion.width;
                        }
                        direction = direction.concat('M' + ' ' + prevRegion.x + ' ' + y + ' ' +
                            'L' + ' ' + (currentXValue + currentRegion.width) + ' ' + y + ' ');
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
        element.style.visibility = (!series.chart.enableCanvas) ? ((series.animation.enable && series.chart.animateSeries) ?
            'hidden' : 'visible') : null;
        appendChildElement(series.chart.enableCanvas, series.seriesElement, element, redraw, true, null, null, null, direction);
        this.renderMarker(series);
    }

    /**
     * To check intermediateSumIndex in waterfall series.
     *
     * @returns {boolean} check intermediateSumIndex
     * @private
     */
    private isIntermediateSum(series: Series, index: number): boolean {
        if (series.intermediateSumIndexes !== undefined && series.intermediateSumIndexes.indexOf(index) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * To check sumIndex in waterfall series.
     *
     * @returns {boolean} check sumIndex
     * @private
     */
    private isSumIndex(series: Series, index: number): boolean {
        if (series.sumIndexes !== undefined && series.sumIndexes.indexOf(index) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * To trigger the point rendering event for waterfall series.
     *
     * @returns {IPointRenderEventArgs} point rendering event values
     * @private
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
     * Add sumIndex and intermediateSumIndex data.
     *
     * @returns {object[]} data
     * @private
     */
    public processInternalData(json: Object[], series: Series): Object[] {
        const data: Object[] = json; let index: number; let sumValue : number = 0;
        const intermediateSum: number[] = series.intermediateSumIndexes;
        const sumIndex: number[] = series.sumIndexes;
        if (intermediateSum !== undefined && intermediateSum.length > 0) {
            for (let i: number = 0; i < intermediateSum.length; i++) {
                for (let j: number = 0; j < data.length; j++) {
                    if (j === intermediateSum[i]) {
                        if (i === 0) {
                            index = subArraySum(data, -1, intermediateSum[i], null, series);
                        } else {
                            index = subArraySum(data, intermediateSum[i - 1], intermediateSum[i], null, series);
                        }
                        data[j][series.yName] = index;
                    }
                }
            }
        }
        if (sumIndex !== undefined && sumIndex.length > 0) {
            for (let k: number = 0; k < sumIndex.length; k++) {
                for (let j: number = 0; j < data.length; j++) {
                    if (j === sumIndex[k]) {
                        if (intermediateSum !== undefined) {
                            index = subArraySum(data, intermediateSum[k] - 1, sumIndex[k], sumIndex, series);
                        } else {
                            if (k === 0) {
                                index = subArraySum(data, -1, sumIndex[k], null, series);
                            } else {
                                index = subArraySum(data, sumIndex[k - 1], sumIndex[k], null, series);
                            }
                        }
                        sumValue += index;
                        data[j][series.yName] = sumValue;
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
     */
    public doAnimation(series: Series): void {
        this.animate(series);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'WaterfallSeries';
        /**
         * return the module name
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
