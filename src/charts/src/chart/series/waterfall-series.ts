import { PathOption, withInRange, Rect } from '../../common/utils/helper';
import { subArraySum, getElement, appendChildElement, redrawElement } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { DoubleRange } from '../utils/double-range';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';

/**
 * `WaterfallSeries` module is used to render the waterfall series.
 */

export class WaterfallSeries extends ColumnBase {

    /**
     * Render waterfall series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        let rect: Rect;
        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let origin: number = Math.max(<number>series.yAxis.visibleRange.min, 0);
        let argsData: IPointRenderEventArgs;
        let prevEndValue: number = 0;
        let direction: string = '';
        let currentEndValue: number = 0;
        let originValue: number;
        let prevRegion: Rect = null;
        let y: number;
        let isInversed: Boolean =  series.chart.requireInvertedAxis;
        let intermediateOrigin: number = 0;
        let redraw: boolean = series.chart.redraw;
        for (let point of series.points) {
            point.symbolLocations = []; point.regions = [];
            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                //Calcute the current point value to render waterfall series.
                let isSum: boolean = this.isIntermediateSum(series, point.index);
                let totalSum: boolean = this.isSumIndex(series, point.index);
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
                let currentRegion: Rect = point.regions[0];
                if (prevRegion !== null) {
                    let prevLeft: number = isInversed ? prevRegion.x : prevRegion.y;
                    let currentLeft: number = isInversed ? currentRegion.x : currentRegion.y;
                    let prevBottom: number = isInversed ? prevRegion.x + prevRegion.width : prevRegion.y + prevRegion.height;
                    let currentBottom: number = isInversed ?
                        currentRegion.x + currentRegion.width : currentRegion.y + currentRegion.height;
                    if (Math.round(prevLeft) === Math.round(currentLeft) ||
                        Math.round(prevBottom) === Math.round(currentLeft)) {
                        y = isInversed ? currentRegion.x : currentRegion.y;
                    } else {
                        y = currentBottom;
                    }
                    if (isInversed) {
                        direction = direction.concat('M' + ' ' + y + ' ' + (prevRegion.y + prevRegion.height) + ' ' +
                            'L' + ' ' + y + ' ' + currentRegion.y + ' ');
                    } else {
                        direction = direction.concat('M' + ' ' + prevRegion.x + ' ' + y + ' ' +
                            'L' + ' ' + (currentRegion.x + currentRegion.width) + ' ' + y + ' ');
                    }
                }
                prevRegion = point.regions[0];
            }
        }
        let options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index + '_Connector_', 'none', series.connector.width,
            series.connector.color, series.opacity, series.connector.dashArray, direction);
        if (redraw && getElement(options.id)) {
            direction = getElement(options.id).getAttribute('d');
        }
        let element: HTMLElement = <HTMLElement>(redrawElement(redraw, options.id, options, series.chart.renderer) ||
            series.chart.renderer.drawPath(options));
        element.style.visibility = (series.animation.enable && series.chart.animateSeries) ? 'hidden' : 'visible';
        appendChildElement(series.seriesElement, element, redraw, true, null, null, null, direction);
        this.renderMarker(series);
    }

    /**
     * To check intermediateSumIndex in waterfall series.
     * @return boolean
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
     * @return boolean
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
     * @return IPointRenderEventArgs
     * @private
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        let color: string;
        let isSum: boolean = this.isIntermediateSum(series, point.index);
        let totalSum: boolean = this.isSumIndex(series, point.index);
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
     * @return {object[]}
     * @private
     */
    public processInternalData(json: Object[], series: Series): Object[] {
        let data: Object[] = json; let length: number = json.length; let index: number;
        let intermediateSum: number[] = series.intermediateSumIndexes;
        let sumIndex: number[] = series.sumIndexes;
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
                            index = subArraySum(data, -1, sumIndex[k], sumIndex, series);
                        } else {
                            index = subArraySum(data, -1, sumIndex[k], null, series);
                        }
                        data[j][series.yName] = index;
                    }
                }
            }
        }
        return data;
    }

    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
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
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroys the waterfall series.
         */
    }


}
