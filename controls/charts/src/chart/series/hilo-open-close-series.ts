import { Rect, withInRange, PathOption, ChartLocation, pathAnimation, getElement } from '../../common/utils/helper';
import { Chart } from '../chart';
import { DoubleRange } from '../utils/double-range';
import { Series, Points } from './chart-series';
import { ColumnBase } from './column-base';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { BorderModel } from '../../common/model/base-model';

/**
 * `HiloOpenCloseSeries` module is used to render the hiloOpenClose series.
 */
export class HiloOpenCloseSeries extends ColumnBase {

    /**
     * Render HiloOpenCloseSeries series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        let highLowRect: Rect;
        let open: ChartLocation;
        let close: ChartLocation;

        let sideBySideInfo: DoubleRange = this.getSideBySideInfo(series);
        let argsData: IPointRenderEventArgs;
        let borderWidth: number = Math.max(series.border.width, 2);
        for (let point of series.points) {
            point.symbolLocations = [];
            point.regions = [];
            if (point.visible &&
                withInRange(series.points[point.index - 1], point, series.points[point.index + 1], series)) {
                //highlow
                highLowRect = this.getRectangle(
                    point.xValue + sideBySideInfo.start, <number>Math.max(<number>point.high, <number>point.low),
                    point.xValue + sideBySideInfo.end, <number>Math.min(<number>point.high, <number>point.low), series);

                point.regions.push(this.getRectangle(
                    point.xValue + sideBySideInfo.median, <number>Math.max(<number>point.high, <number>point.low),
                    point.xValue + sideBySideInfo.median, <number>Math.min(<number>point.high, <number>point.low), series
                ));

                this.updateTickRegion(!series.chart.requireInvertedAxis, point.regions[0], borderWidth);
                //open
                point.regions.push(this.getRectangle(
                    point.xValue + sideBySideInfo.start, <number>Math.max(<number>point.open, <number>point.close),
                    point.xValue + sideBySideInfo.median, <number>Math.max(<number>point.open, <number>point.close), series
                ));

                //close
                point.regions.push(this.getRectangle(
                    point.xValue + sideBySideInfo.median, <number>Math.min(<number>point.open, <number>point.close),
                    point.xValue + sideBySideInfo.end, <number>Math.min(<number>point.open, <number>point.close), series
                ));

                argsData = this.triggerPointRenderEvent(series, point);
                if (!argsData.cancel) {
                    this.updateSymbolLocation(point, point.regions[0], series);
                    let open: ChartLocation = { x: point.regions[1].x, y: point.regions[1].y };
                    let close: ChartLocation = { x: point.regions[2].x, y: point.regions[2].y };
                    this.drawHiloOpenClosePath(series, point, open, close, highLowRect, argsData);
                }

                this.updateTickRegion(series.chart.requireInvertedAxis, point.regions[1], borderWidth);
                this.updateTickRegion(series.chart.requireInvertedAxis, point.regions[2], borderWidth);

            }
        }
    }
    /**
     * Updates the tick region
     */
    private updateTickRegion(horizontal: boolean, region: Rect, borderWidth: number): void {
        if (horizontal) {
            region.x -= borderWidth / 2;
            region.width = borderWidth;
        } else {
            region.y -= borderWidth / 2;
            region.height = borderWidth;
        }

    }

    /**
     * Trigger point rendering event
     */
    private triggerPointRenderEvent(series: Series, point: Points): IPointRenderEventArgs {
        let fill: string = (point.open <= point.close) ? series.bearFillColor : series.bullFillColor;
        let border: BorderModel = { color: series.border.color, width: Math.max(series.border.width, 1) };
        return this.triggerEvent(series, point, fill, border);
    }

    /**
     * To draw the rectangle for points.
     * @return {void}
     * @private
     */
    protected drawHiloOpenClosePath(
        series: Series, point: Points, open: ChartLocation, close: ChartLocation, rect: Rect, argsData: IPointRenderEventArgs
    ): void {
        // region highlow
        let direction: string; let options: PathOption;
        if (series.chart.requireInvertedAxis) {
            direction = ('M' + ' ' + (rect.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height / 2) + ' ');
            direction += ('M' + ' ' + (open.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (open.x) + ' ' + (rect.y + rect.height) + ' ');
            direction += ('M' + ' ' + (close.x) + ' ' + (rect.y + rect.height / 2) + ' ' +
                'L' + ' ' + (close.x) + ' ' + (rect.y) + ' ');
        } else {
            direction = ('M' + ' ' + (rect.x + rect.width / 2) + ' ' + (rect.y + rect.height) + ' ' +
                'L' + ' ' + (rect.x + rect.width / 2) + ' ' + (rect.y) + ' ');

            //region opentick
            direction += ('M' + ' ' + (rect.x) + ' ' + (open.y) + ' ' +
                'L' + ' ' + (rect.x + rect.width / 2) + ' ' + (open.y) + ' ');

            //region closetick
            direction += ('M' + ' ' + (rect.x + rect.width / 2) + ' ' + (close.y) + ' ' +
                'L' + ' ' + (rect.x + rect.width) + ' ' + (close.y) + ' ');
        }

        options = new PathOption(
            series.chart.element.id + '_Series_' + series.index + '_Point_' + point.index,
            argsData.fill, argsData.border.width, argsData.fill, series.opacity, series.dashArray, direction);
        pathAnimation(getElement(options.id), direction, series.chart.redraw);
        let element: HTMLElement = series.chart.renderer.drawPath(options) as HTMLElement;
        element.setAttribute('aria-label', point.x.toString() + ':' + point.high.toString()
            + ':' + point.low.toString() + ':' + point.close.toString() + ':' + point.open.toString());
        series.seriesElement.appendChild(element);
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'HiloOpenCloseSeries';
        /**
         * return the module name
         */
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
     * To destroy the column series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}