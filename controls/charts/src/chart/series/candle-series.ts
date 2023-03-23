/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { withInRange, pathAnimation, getElement } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { BorderModel } from '../../common/model/base-model';

/**
 * `CandleSeries` module is used to render the candle series.
 */
export class CandleSeries extends ColumnBase {

    /**
     * Render Candle series.
     *
     * @returns {void}
     * @private
     */
    public render(series: Series): void {
        const sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let argsData: IPointRenderEventArgs;
        const borderWidth: number = Math.max(series.border.width, 1 );
        for (const point of series.points) {
            let direction: string = '';
            let centerRegion: Rect; let tickRegion: Rect;
            //initializing after zooming and also normal initialization
            point.regions = [];
            point.symbolLocations = [];

            if (point.visible && withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {

                //region to cover the top and bottom ticks

                tickRegion = this.getRectangle(
                    (point.xValue + sideBySideInfo.median),
                    <number>Math.max(<number>point.high, <number>point.low),
                    (point.xValue + sideBySideInfo.median),
                    <number>Math.min(<number>point.high, <number>point.low), series
                );

                if (!series.chart.requireInvertedAxis) {
                    tickRegion.x -= borderWidth / 2;
                    tickRegion.width = borderWidth;
                } else {
                    tickRegion.y -= borderWidth / 2;
                    tickRegion.height = borderWidth;
                }

                //get middleRect
                centerRegion = this.getRectangle(
                    (point.xValue + sideBySideInfo.start),
                    <number>Math.max(<number>point.open, <number>point.close),
                    (point.xValue + sideBySideInfo.end),
                    <number>Math.min(<number>point.open, <number>point.close), series
                );

                direction = this.getPathString(tickRegion, centerRegion, series);
                argsData = this.triggerPointRenderEvent(series, point);

                if (!argsData.cancel) {
                    this.drawCandle(series, point, centerRegion, argsData, direction);
                    this.updateSymbolLocation(point, tickRegion, series);
                    this.updateSymbolLocation(point, centerRegion, series);
                }
            }
        }
    }

    /**
     * Trigger point rendering event
     */
    protected triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        const fill: string = this.getCandleColor(point, series);
        const border: BorderModel = { color: series.border.color, width: Math.max(series.border.width, 1) };
        return this.triggerEvent(series, point, fill, border);
    }



    /**
     * Find the color of the candle
     *
     * @param {Points} point point
     * @param {Series} series series
     * @returns {string} color of the candle
     * @private
     */
    private getCandleColor(point: Points, series: Series): string {
        const previousPoint: Points = series.points[point.index - 1];
        if (series.enableSolidCandles === false) {
            if (!previousPoint) {
                return <string>series.bearFillColor;
            } else {
                return <number>previousPoint.close > <number>point.close ? <string>series.bullFillColor : <string>series.bearFillColor;
            }
        } else {
            return <number>point.open > <number>point.close ? <string>series.bullFillColor : <string>series.bearFillColor;
        }
    }



    /**
     * Finds the path of the candle shape
     *
     * @private
     */
    public getPathString(topRect: Rect, midRect: Rect, series: Series): string {
        let direction: string = '';
        const center: number = series.chart.requireInvertedAxis ? topRect.y + topRect.height / 2 :
            topRect.x + topRect.width / 2;


        //tick 1 segment
        direction += !series.chart.requireInvertedAxis ?
            'M' + ' ' + (center) + ' ' + (topRect.y) + ' ' + 'L' + ' ' + (center) + ' ' + midRect.y :
            'M' + ' ' + (topRect.x) + ' ' + (center) + ' ' + 'L' + ' ' + (midRect.x) + ' ' + center;

        direction = direction.concat(' M' + ' ' + (midRect.x) + ' ' + (midRect.y) + ' ' +
            'L' + ' ' + (midRect.x + midRect.width) + ' ' + (midRect.y) + ' ' +
            'L' + ' ' + (midRect.x + midRect.width) + ' ' +
            (midRect.y + midRect.height) + ' ' +
            'L' + ' ' + (midRect.x) + ' ' + (midRect.y + midRect.height) +
            ' ' + 'Z');

        direction += !series.chart.requireInvertedAxis ?
            ' M' + ' ' + (center) + ' ' + (midRect.y + midRect.height) + ' ' + 'L' + ' ' + (center) + ' ' + (topRect.y +
                topRect.height) :
            ' M' + ' ' + (midRect.x + midRect.width) + ' ' + (center) + ' ' + 'L' + ' ' +
            (topRect.x + topRect.width) + ' ' + center;
        return direction;
    }

    /**
     * Draws the candle shape
     *
     * @param {Series} series series
     * @param {Points} point point
     * @param {Rect} rect point region
     * @param {IPointRenderEventArgs} argsData argsData
     * @param {string} direction path direction
     * @returns {void}
     * @private
     */
    public drawCandle(
        series: Series, point: Points, rect: Rect, argsData: IPointRenderEventArgs,
        direction: string
    ): void {
        const check: number = series.chart.requireInvertedAxis ? rect.height : rect.width;
        if (check <= 0) {
            return null;
        }
        const fill: string = !series.enableSolidCandles ?
            (<number>point.open > <number>point.close ? argsData.fill : 'transparent') : argsData.fill;

        argsData.border.color = argsData.fill;

        const options: PathOption = new PathOption(
            series.chart.element.id + '_Series_' + series.index + '_Point_' + point.index,
            fill, argsData.border.width, argsData.border.color, series.opacity, series.dashArray, direction);
        const element: Element = getElement(options.id);
        const previousDirection: string = element ? element.getAttribute('d') : null;
        const candleElement: HTMLElement =
            series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y])) as HTMLElement;
        candleElement.setAttribute('role', 'img');
        candleElement.setAttribute('aria-label', point.x.toString() + ':' + point.high.toString()
            + ':' + point.low.toString() + ':' + point.close.toString() + ':' + point.open.toString());
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(candleElement);
        }
        pathAnimation(element, direction, series.chart.redraw, previousDirection);
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
        return 'CandleSeries';
        /**
         * return the module name
         */
    }

    /**
     * To destroy the candle series.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the candle series.
         */
    }
}
